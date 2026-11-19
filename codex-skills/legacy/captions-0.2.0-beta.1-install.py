#!/usr/bin/env python3
"""Verify and install the public captions skill; no network or dependency install."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import subprocess
import tempfile
import time
import uuid

ROOT = Path(__file__).resolve().parent
NAME = "codex-video-captions"
COMPAT = "tram-video-studio"
STATE = ".codex-video-captions-managed.json"


def sha(file):
    h = hashlib.sha256()
    with file.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def relative(value):
    p = PurePosixPath(value)
    if p.is_absolute() or not p.parts or ".." in p.parts or "\\" in value or ":" in value:
        raise ValueError("Invalid manifest path")
    return p


def verify(root=ROOT):
    root = root.resolve()
    manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    if manifest.get("skill") != NAME or manifest.get("compatibilitySkill") != COMPAT:
        raise ValueError("Unexpected skill manifest")
    expected = set()
    for item in manifest["files"]:
        rel = relative(item["path"])
        if rel.parts[0] != NAME and rel.as_posix() != COMPAT + "/SKILL.md":
            raise ValueError("Manifest cannot manage other skills")
        if rel.as_posix() in expected:
            raise ValueError("Duplicate manifest path")
        file = root.joinpath(*rel.parts)
        cursor = file
        while cursor != root:
            if cursor.is_symlink():
                raise ValueError("Package symlinks are not allowed")
            cursor = cursor.parent
        if not file.is_file() or file.stat().st_size != item["bytes"] or sha(file) != item["sha256"]:
            raise ValueError("Damaged or changed package file: " + rel.as_posix())
        expected.add(rel.as_posix())
    actual = {p.relative_to(root).as_posix() for p in (root / NAME).rglob("*") if p.is_file()}
    if actual != {p for p in expected if p.startswith(NAME + "/")}:
        raise ValueError("Unexpected files in the distributed skill")
    for item in manifest.get("supportFiles", []):
        rel = relative(item["path"])
        file = root.joinpath(*rel.parts)
        if file.is_symlink() or not file.is_file() or sha(file) != item["sha256"]:
            raise ValueError("Changed installer or installation document")
    return manifest


def destination(root, rel):
    file = root.joinpath(*relative(rel).parts)
    cursor = file
    while cursor != root:
        if cursor.is_symlink():
            raise ValueError("Refusing a symlink in the installation target")
        cursor = cursor.parent
    if file.exists() and not file.is_file():
        raise ValueError("Target file path is not a regular file")
    return file


def atomic_copy(source, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp = target.with_name("." + target.name + "." + uuid.uuid4().hex + ".tmp")
    try:
        shutil.copyfile(source, tmp)
        tmp.replace(target)
    finally:
        tmp.unlink(missing_ok=True)


def local_tools():
    node = shutil.which("node")
    node_version = None
    if node:
        try:
            node_version = subprocess.run([node, "--version"], capture_output=True, text=True, timeout=5).stdout.strip()
        except (OSError, subprocess.SubprocessError):
            pass
    browser = any(shutil.which(name) for name in ["google-chrome", "chromium", "chromium-browser"])
    if os.name == "nt":
        browser = browser or any((Path(os.environ.get(key, "")) / tail).is_file() for key, tail in [
            ("PROGRAMFILES", "Google/Chrome/Application/chrome.exe"),
            ("LOCALAPPDATA", "Google/Chrome/Application/chrome.exe"),
        ])
    else:
        browser = browser or Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").is_file()
    return {"node": node_version, "ffmpeg": bool(shutil.which("ffmpeg")), "ffprobe": bool(shutil.which("ffprobe")), "browserDetected": bool(browser), "dependenciesInstalledByThisScript": False}


def initialize_workspace(workspace, root):
    workspace = workspace.expanduser().resolve()
    for folder in ["input", "output", "dna", "projects"]:
        (workspace / folder).mkdir(parents=True, exist_ok=True)
    example = workspace / "dna/profile.example.json"
    if not example.exists():
        shutil.copyfile(root / NAME / "profiles/demo-a.json", example)
    readme = workspace / "README.md"
    if not readme.exists():
        readme.write_text(
            "# Video workspace\n\nNguồn của bạn đặt trong input/, bản xuất trong output/, "
            "DNA riêng trong dna/, dự án dựng trong projects/. Các thư mục này tách khỏi skill đã cài.\n\n"
            "profile.example.json chỉ là ví dụ hình học, chưa là DNA được bạn chọn. "
            "Khi có video, gọi $codex-video-captions và chọn profile riêng rõ ràng. "
            "Không đưa nguồn, token hoặc bản xuất vào repo public. Bộ cài không ghi đè workspace đã có.\n",
            encoding="utf-8",
        )
    return str(workspace)


def install(target, workspace=None, dry_run=False, root=ROOT):
    manifest = verify(root)
    target = target.expanduser()
    if target.is_symlink():
        raise ValueError("The target skills directory is a symlink")
    target = target.resolve()
    changes, preserved = [], []
    for item in manifest["files"]:
        dest = destination(target, item["path"])
        if dest.is_file() and sha(dest) == item["sha256"]:
            continue
        # Existing custom data stays active. Code/docs are managed and backed
        # up before updates; private DNA belongs in the separate workspace.
        rel = item["path"]
        data_file = rel.startswith(NAME + "/profiles/") or rel.startswith(NAME + "/examples/")
        if dest.is_file() and data_file:
            preserved.append(rel)
            continue
        changes.append((item, dest, sha(dest) if dest.is_file() else None))
    state_file = destination(target, STATE)
    result = {"version": manifest["version"], "skill": NAME, "compatibilitySkill": COMPAT,
              "changedFiles": len(changes), "preservedCustomData": preserved, "dryRun": dry_run}
    if dry_run:
        return result
    target.mkdir(parents=True, exist_ok=True)
    backup = None
    if any(old is not None for _, _, old in changes):
        backup = target.parent / "skill-backups" / (NAME + "-" + str(time.time_ns()))
        backup.mkdir(parents=True, exist_ok=False)
        for item, dest, old in changes:
            if old is not None:
                saved = backup / item["path"]
                saved.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(dest, saved)
    written = []
    try:
        for item, dest, old in changes:
            if (sha(dest) if dest.is_file() else None) != old:
                raise ValueError("Target changed during installation")
            atomic_copy(root / item["path"], dest)
            written.append((item, dest, old))
        for item in manifest["files"]:
            if item["path"] not in preserved and sha(destination(target, item["path"])) != item["sha256"]:
                raise ValueError("Installed managed file did not pass verification")
    except BaseException:
        for item, dest, old in reversed(written):
            if dest.is_file() and sha(dest) == item["sha256"]:
                if old is None:
                    dest.unlink()
                else:
                    atomic_copy(backup / item["path"], dest)
        raise
    if changes or not state_file.exists():
        state = {"version": manifest["version"], "skill": NAME, "files": manifest["files"],
                 "preservedCustomData": preserved, "installedAt": time.time()}
        tmp = state_file.with_name("." + state_file.name + "." + uuid.uuid4().hex + ".tmp")
        try:
            with tmp.open("x", encoding="utf-8") as stream:
                stream.write(json.dumps(state, ensure_ascii=False, indent=2))
            tmp.replace(state_file)
        finally:
            tmp.unlink(missing_ok=True)
    if workspace is not None:
        result["workspace"] = initialize_workspace(workspace, root)
    if backup:
        result["backup"] = str(backup)
    result["target"] = str(target)
    result["tools"] = local_tools()
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", type=Path, default=Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex"))) / "skills")
    parser.add_argument("--workspace", type=Path, default=Path.home() / "Documents/CodexVideoProjects")
    parser.add_argument("--no-workspace", action="store_true")
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    if args.check:
        data = verify()
        print(json.dumps({"verified": len(data["files"]), "version": data["version"], "installed": False}))
    else:
        print(json.dumps(install(args.target, None if args.no_workspace else args.workspace, args.dry_run), ensure_ascii=False, indent=2))
        print("Restart Codex or start a new chat, then invoke $codex-video-captions. The old $tram-video-studio name routes to this version.")
        print("No dependencies were installed. Missing render tools require a normal project/tool installation; do not disable sandbox or change system security.")

#!/usr/bin/env python3
"""Install only this verified skill; no network, shell commands or credential access."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import tempfile
import time

ROOT = Path(__file__).resolve().parent
NAME = "tram-video-studio"


def verify(root=ROOT):
    manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    if manifest["skill"] != NAME:
        raise ValueError("Unexpected skill name")
    expected = set()
    for item in manifest["files"]:
        rel = Path(item["path"])
        if rel.is_absolute() or ".." in rel.parts or not rel.parts or rel.parts[0] != NAME:
            raise ValueError("Invalid manifest path")
        file = root / rel
        if any(p.is_symlink() for p in [file, *file.parents] if p != root.parent):
            raise ValueError("Symlinks are not allowed")
        if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest() != item["sha256"]:
            raise ValueError("Damaged or changed file: " + str(rel))
        expected.add(rel.as_posix())
    actual = {p.relative_to(root).as_posix() for p in (root / NAME).rglob("*") if p.is_file()}
    if actual != expected:
        raise ValueError("Unexpected files in skill folder")
    return len(expected)


def install(target):
    count = verify()
    target = target.expanduser().resolve()
    target.mkdir(parents=True, exist_ok=True)
    destination = target / NAME
    if destination.is_symlink():
        raise ValueError("Existing skill path is a symlink; refusing to replace")
    stage = Path(tempfile.mkdtemp(prefix=".tram-install-", dir=target))
    backup = None
    try:
        shutil.copytree(ROOT / NAME, stage / NAME)
        if destination.exists():
            backups = target.parent / "skill-backups"
            backups.mkdir(exist_ok=True)
            backup = backups / (NAME + "-" + str(time.time_ns()))
            destination.rename(backup)
        try:
            (stage / NAME).rename(destination)
        except BaseException:
            if backup is not None:
                backup.rename(destination)
            raise
    finally:
        shutil.rmtree(stage, ignore_errors=True)
    print("Installed %s (%d files) at %s" % (NAME, count, destination))
    if backup:
        print("Previous version preserved at", backup)
    print("Restart Codex and invoke $tram-video-studio in a new chat.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", type=Path, default=Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex"))) / "skills")
    parser.add_argument("--check", action="store_true", help="Verify only; do not install")
    args = parser.parse_args()
    if args.check:
        print("Verified", verify(), "skill files; nothing installed.")
    else:
        install(args.target)

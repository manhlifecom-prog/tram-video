import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("caption_install", ROOT / "install.py")
installer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(installer)


class InstallTests(unittest.TestCase):
    def test_fresh_and_second_install_are_idempotent(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            target, work = root / "skills", root / "video-workspace"
            first = installer.install(target, work)
            self.assertGreater(first["changedFiles"], 0)
            state = (target / installer.STATE).read_bytes()
            (work / "dna/private.json").write_text('{"private":true}')
            second = installer.install(target, work)
            self.assertEqual(second["changedFiles"], 0)
            self.assertEqual((target / installer.STATE).read_bytes(), state)
            self.assertEqual((work / "dna/private.json").read_text(), '{"private":true}')
            self.assertTrue((target / "codex-video-captions/SKILL.md").is_file())
            self.assertIn("../codex-video-captions/SKILL.md", (target / "tram-video-studio/SKILL.md").read_text())

    def test_old_entry_is_backed_up_but_custom_assets_remain(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            target = root / "skills"
            old = target / "tram-video-studio"
            (old / "assets/private").mkdir(parents=True)
            (old / "SKILL.md").write_text("old custom entry")
            (old / "assets/private/dna.json").write_text("own DNA")
            result = installer.install(target)
            self.assertEqual((old / "assets/private/dna.json").read_text(), "own DNA")
            self.assertEqual((Path(result["backup"]) / "tram-video-studio/SKILL.md").read_text(), "old custom entry")

    def test_dry_run_does_not_create_any_target_or_workspace(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            result = installer.install(root / "skills", root / "workspace", dry_run=True)
            self.assertTrue(result["dryRun"])
            self.assertEqual(list(root.iterdir()), [])

    def test_custom_new_profile_and_unmanaged_input_are_preserved(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            target = root / "skills"
            installer.install(target)
            profile = target / "codex-video-captions/profiles/demo-a.json"
            profile.write_text('{"customDNA":true}')
            source = target / "codex-video-captions/my-private-source.txt"
            source.write_text("private input")
            result = installer.install(target)
            self.assertIn("codex-video-captions/profiles/demo-a.json", result["preservedCustomData"])
            self.assertEqual(profile.read_text(), '{"customDNA":true}')
            self.assertEqual(source.read_text(), "private input")

    def test_symlink_entry_is_rejected_before_writing(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            target = root / "skills"
            target.mkdir()
            outside = root / "outside"
            outside.mkdir()
            (target / "tram-video-studio").symlink_to(outside, target_is_directory=True)
            with self.assertRaises(ValueError):
                installer.install(target)
            self.assertFalse((target / "codex-video-captions").exists())

    def test_modified_managed_code_has_a_recoverable_backup(self):
        with tempfile.TemporaryDirectory() as temp:
            target = Path(temp) / "skills"
            installer.install(target)
            helper = target / "codex-video-captions/assets/EmotionalCaption.tsx"
            helper.write_text("custom code")
            result = installer.install(target)
            self.assertEqual((Path(result["backup"]) / "codex-video-captions/assets/EmotionalCaption.tsx").read_text(), "custom code")
            self.assertNotEqual(helper.read_text(), "custom code")


if __name__ == "__main__":
    unittest.main()

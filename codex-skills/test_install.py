from pathlib import Path
import tempfile, shutil, hashlib, json, subprocess, unittest, ast, runpy, sys, io
from unittest import mock
ROOT=Path(__file__).resolve().parents[3]
PKG=Path(__file__).resolve().parent/'codex-video-captions'
INSTALL=PKG/'scripts/install.py';ASR=PKG/'scripts/asr-offline.py'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
class InstallerTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name).resolve();self.pkg=self.root/'package';self.pkg.mkdir();(self.pkg/'scripts').mkdir();shutil.copy2(INSTALL,self.pkg/'scripts/install.py');(self.pkg/'SKILL.md').write_text('generic skill');(self.pkg/'a.txt').write_text('old');self.target=self.root/'skills'/'codex-video-captions';self.backups=self.root/'backups';self.manifest()
 def tearDown(self):self.tmp.cleanup()
 def manifest(self):
  rows=[{'path':f.relative_to(self.pkg).as_posix(),'sha256':sha(f),'bytes':f.stat().st_size} for f in self.pkg.rglob('*') if f.is_file() and f.name!='MANIFEST.json'];(self.pkg/'MANIFEST.json').write_text(json.dumps({'files':rows}))
 def run_install(self,*args,ok=True):
  r=subprocess.run([sys.executable,str(self.pkg/'scripts/install.py'),'--target-dir',str(self.target),*args],capture_output=True,text=True)
  self.assertEqual(r.returncode==0,ok,r.stdout+r.stderr);return r
 def test_check_does_not_write_and_fresh_idempotent(self):
  self.run_install('--check-only');self.assertFalse(self.target.parent.exists());self.run_install();a=sha(self.target/'a.txt');r=self.run_install();self.assertIn('up-to-date',r.stdout);self.assertEqual(sha(self.target/'a.txt'),a)
 def test_upgrade_preserves_dna_custom_and_outside_backup(self):
  self.run_install();(self.target/'profiles').mkdir();(self.target/'profiles/own.json').write_text('custom');(self.target/'custom.bin').write_bytes(b'preserve');(self.pkg/'a.txt').write_text('new');self.manifest();self.run_install('--upgrade','--backup-dir',str(self.backups));self.assertEqual((self.target/'profiles/own.json').read_text(),'custom');self.assertEqual((self.target/'custom.bin').read_bytes(),b'preserve');self.assertEqual((self.target/'a.txt').read_text(),'new');self.assertEqual(len(list(self.backups.iterdir())),1);self.run_install()
 def test_checksum_failure_before_destination(self):
  (self.pkg/'a.txt').write_text('tampered');self.run_install(ok=False);self.assertFalse(self.target.exists())
 def test_modified_managed_refused(self):
  self.run_install();(self.target/'a.txt').write_text('user edit');self.run_install('--upgrade','--backup-dir',str(self.backups),ok=False);self.assertEqual((self.target/'a.txt').read_text(),'user edit');self.assertFalse(self.backups.exists())
 def test_unmanaged_collision_refused(self):
  self.run_install();(self.target/'b.txt').write_text('custom');(self.pkg/'b.txt').write_text('newmanaged');self.manifest();self.run_install('--upgrade','--backup-dir',str(self.backups),ok=False);self.assertEqual((self.target/'b.txt').read_text(),'custom')
 def test_backup_inside_discovery_refused(self):
  self.run_install();(self.pkg/'a.txt').write_text('new');self.manifest();self.run_install('--upgrade','--backup-dir',str(self.target.parent/'badbackup'),ok=False)
 def test_protected_payload_not_installed_and_symlink_refused(self):
  (self.pkg/'project-plan.json').write_text('do not install');self.manifest();self.run_install();self.assertFalse((self.target/'project-plan.json').exists());(self.target/'a.txt').unlink();(self.target/'a.txt').symlink_to(self.pkg/'a.txt');self.run_install(ok=False)
 def test_failed_upgrade_rolls_back_only_managed(self):
  self.run_install();old=sha(self.target/'a.txt');oldmanifest=sha(self.target/'MANIFEST.json');(self.pkg/'a.txt').write_text('new');(self.pkg/'b.txt').write_text('newB');self.manifest();module=runpy.run_path(str(self.pkg/'scripts/install.py'));original=shutil.copy2
  def injected(src,dst,*args,**kw):
   if Path(src).name=='b.txt' and Path(dst).parent==self.target:raise OSError('fixture injected copy failure')
   return original(src,dst,*args,**kw)
  with mock.patch.object(sys,'argv',['install.py','--target-dir',str(self.target),'--upgrade','--backup-dir',str(self.backups)]),mock.patch('shutil.copy2',side_effect=injected):
   with self.assertRaises(OSError):module['main']()
  self.assertEqual(sha(self.target/'a.txt'),old);self.assertEqual(sha(self.target/'MANIFEST.json'),oldmanifest);self.assertFalse((self.target/'b.txt').exists())
class ASRPreflightTests(unittest.TestCase):
 def test_check_only_npz_no_model_import_and_missing_tokenizer(self):
  with tempfile.TemporaryDirectory() as td:
   root=Path(td);source=root/'source.bin';source.write_bytes(b'fixture not media');model=root/'model';model.mkdir();(model/'weights.npz').write_bytes(b'fixture not weights');(model/'config.json').write_text(json.dumps({'n_mels':128,'n_audio_layer':32,'n_text_layer':32,'n_vocab':51866}));pkg=root/'mlx_whisper';(pkg/'assets').mkdir(parents=True);(pkg/'__init__.py').write_text('raise RuntimeError("must not import model")')
   for n in ['assets/multilingual.tiktoken','assets/gpt2.tiktoken','assets/mel_filters.npz','transcribe.py','load_models.py','tokenizer.py','timing.py']:(pkg/n).write_text('fixture')
   module=runpy.run_path(str(ASR));args=['asr-offline.py','--source',str(source),'--model-dir',str(model),'--ffmpeg',sys.executable,'--check-only'];spec=type('Spec',(),{'origin':str(pkg/'__init__.py')})();versions={'mlx-whisper':'0.4.3','mlx':'0.32.4'}
   with mock.patch.object(sys,'argv',args),mock.patch.object(sys,'platform','darwin'),mock.patch('platform.machine',return_value='arm64'),mock.patch('importlib.metadata.version',side_effect=lambda n:versions[n]),mock.patch('importlib.util.find_spec',return_value=spec),mock.patch('sys.stdout',new_callable=io.StringIO) as output:
    module['main']();r=json.loads(output.getvalue());self.assertEqual(r['weightsFile'],'weights.npz');self.assertTrue(r['checkOnly']);self.assertNotIn('mlx_whisper',sys.modules);(pkg/'assets/multilingual.tiktoken').unlink()
    with self.assertRaisesRegex(ValueError,'Missing local tokenizer'):module['main']()
   with self.assertRaises(PermissionError):module['deny_network']('socket.connect',())
if __name__=='__main__':
 for f in [INSTALL,ASR]:ast.parse(f.read_text())
 unittest.main(verbosity=2)

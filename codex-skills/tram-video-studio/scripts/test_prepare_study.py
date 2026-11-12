"""Functional checks against synthetic local media; never touches production state."""
import json, os, pathlib, subprocess, sys, tempfile, unittest
SCRIPT=pathlib.Path(__file__).with_name('prepare_study.py')
FF=os.environ['STUDY_FFMPEG']
class StudyPackTests(unittest.TestCase):
 def test_silent_media_cache_and_corruption(self):
  with tempfile.TemporaryDirectory(prefix='tram-study-test-') as d:
   root=pathlib.Path(d);video=root/'silent.mp4'
   subprocess.run([FF,'-v','error','-f','lavfi','-i','color=c=blue:s=240x426:r=24:d=1.5','-c:v','libx264','-an',str(video)],check=True)
   args=[sys.executable,str(SCRIPT),str(video),'--output',str(root/'packs'),'--ffmpeg',FF,'--dense','0:1']
   first=subprocess.run(args,check=True,text=True,capture_output=True);r=json.loads(first.stdout);self.assertFalse(r['cacheHit'])
   p=pathlib.Path(r['pack']);data=json.loads(p.read_text());self.assertFalse(data['hasAudio']);self.assertFalse(data['humanReviewed']);self.assertFalse(data['templateApproved'])
   self.assertTrue(any(f['file'].startswith('dense-') for f in data['files']))
   second=subprocess.run(args,check=True,text=True,capture_output=True);self.assertTrue(json.loads(second.stdout)['cacheHit']);self.assertEqual(json.loads(second.stdout)['pack'],str(p))
   item=next(f for f in data['files'] if f['file'].endswith('.jpg'));(p.parent/item['file']).write_bytes(b'broken')
   bad=subprocess.run(args,text=True,capture_output=True);self.assertNotEqual(bad.returncode,0);self.assertIn('Cache damaged',bad.stderr);self.assertEqual((p.parent/item['file']).read_bytes(),b'broken')
 def test_rejects_invalid_window_before_decoding(self):
  with tempfile.TemporaryDirectory(prefix='tram-study-test-') as d:
   source=pathlib.Path(d)/'empty.mp4';source.write_bytes(b'not video')
   result=subprocess.run([sys.executable,str(SCRIPT),str(source),'--output',str(pathlib.Path(d)/'out'),'--ffmpeg',FF,'--dense','5:2'],capture_output=True,text=True)
   self.assertNotEqual(result.returncode,0);self.assertIn('Dense window must be positive',result.stderr);self.assertFalse((pathlib.Path(d)/'out').exists())
if __name__=='__main__':unittest.main()

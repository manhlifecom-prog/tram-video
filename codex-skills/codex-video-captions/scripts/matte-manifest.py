#!/usr/bin/env python3
"""Hash prepared person-alpha/CFR pair; does not infer masks or assert quality."""
import argparse,hashlib,json,pathlib,subprocess,sys
p=argparse.ArgumentParser();p.add_argument('--public-dir',required=True);p.add_argument('--clip',required=True);p.add_argument('--alpha-dir',required=True);p.add_argument('--source-sha256',required=True);p.add_argument('--output',required=True);a=p.parse_args();root=pathlib.Path(a.public_dir).resolve();clip=(root/a.clip).resolve();alpha=(root/a.alpha_dir).resolve();out=pathlib.Path(a.output)
if root not in clip.parents or root not in alpha.parents or out.exists():sys.exit('Local public paths and new manifest required')
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate:frame=best_effort_timestamp_time','-of','json',str(clip)]));frames=probe['frames'];files=sorted(alpha.glob('*.png'))
if len(files)>1800:sys.exit('Bounded matte window exceeds1800frames')
if not frames or abs(float(frames[0]['best_effort_timestamp_time']))>1e-6 or probe['streams'][0]['r_frame_rate']!='30/1' or len(frames)!=len(files):sys.exit('Matte requires PTS0 30fps paired CFR clip, one alpha per decoded frame')
expected=[f'{i:06d}.png' for i in range(len(files))]
if [q.name for q in files]!=expected:sys.exit('Alpha sequence must start000000 with no gaps')
sha=lambda q:hashlib.sha256(q.read_bytes()).hexdigest();result={'sourceSha256':a.source_sha256,'sourceClipSha256':sha(clip),'firstLocalPts':0,'fps':30,'dimensions':[probe['streams'][0]['width'],probe['streams'][0]['height']],'frames':[{'file':q.relative_to(root).as_posix(),'sha256':sha(q)}for q in files],'quality':'Structural PTS/count/hash only; actual edges/occlusion/readability review pending','scope':'Person occlusion over original base, not complete prop/hand/background extraction'};out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(result,indent=2))

#!/usr/bin/env python3
"""Actual output-clock RMS for phone wave bars; not ASR/lip-sync evidence."""
import argparse,array,hashlib,json,math,pathlib,shutil,subprocess,sys
p=argparse.ArgumentParser();p.add_argument('--voice',required=True);p.add_argument('--edl',required=True);p.add_argument('--output',required=True);p.add_argument('--floor',type=float,required=True);p.add_argument('--range',type=float,required=True);a=p.parse_args()
voice=pathlib.Path(a.voice);edl=pathlib.Path(a.edl);out=pathlib.Path(a.output)
if not voice.is_file() or not edl.is_file() or out.exists() or a.range<=0:sys.exit('Existing voice/EDL, explicit normalization and new output required')
ff=shutil.which('ffmpeg')
if not ff:sys.exit('Existing FFmpeg required; no automatic install')
plan=json.loads(edl.read_text());segments=plan.get('segments')
if not segments:sys.exit('EDL must contain sourceStart/sourceEnd/outputStart segments')
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
proc=subprocess.Popen([ff,'-v','error','-i',str(voice),'-vn','-ac','1','-ar','8000','-f','f32le','pipe:1'],stdout=subprocess.PIPE);points=[];index=0
try:
 while True:
  raw=proc.stdout.read(1280)
  if not raw:break
  if len(raw)%4:raise ValueError('Incomplete float sample')
  samples=array.array('f');samples.frombytes(raw)
  if sys.byteorder!='little':samples.byteswap()
  rms=math.sqrt(sum(x*x for x in samples)/len(samples));t=index*.04;seg=next((s for s in segments if s['outputStart']<=t<s['outputStart']+s['sourceEnd']-s['sourceStart']),None)
  points.append({'outputTime':round(t,6),'sourceTime':round(seg['sourceStart']+t-seg['outputStart'],6) if seg else None,'rms':rms,'peak':max(abs(x) for x in samples),'normalizedRms':max(0,min(1,(rms-a.floor)/a.range))});index+=1
  if index>45000:raise ValueError('Envelope duration exceeds1800s')
 if proc.wait()!=0:raise ValueError('FFmpeg decode failed')
except Exception:
 proc.kill();proc.wait();raise
out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps({'referenceVoiceSha256':sha(voice),'edlSha256':sha(edl),'intervalSeconds':.04,'basis':'Actual output-clock voice PCM RMS, not ASR/lipsync/listening approval','points':points},indent=2))

#!/usr/bin/env python3
"""Explicit local output-clock voice/music/SFX mix; no assets/providers bundled."""
import argparse,hashlib,json,pathlib,shutil,subprocess,sys
p=argparse.ArgumentParser();p.add_argument('--plan',required=True);p.add_argument('--source',required=True);p.add_argument('--music');p.add_argument('--music-rights');p.add_argument('--sfx-manifest');p.add_argument('--output',required=True);p.add_argument('--voice-output');p.add_argument('--voice-gain',type=float,default=1);p.add_argument('--music-gain',type=float);p.add_argument('--check-only',action='store_true');a=p.parse_args()
plan=json.loads(pathlib.Path(a.plan).read_text());source=pathlib.Path(a.source).resolve();out=pathlib.Path(a.output)
if not source.is_file() or out.exists():sys.exit('Existing local raw source and new output required')
if hashlib.sha256(source.read_bytes()).hexdigest()!=plan['source']['sha256']:sys.exit('Raw source hash mismatch; never stack an old fullmix as voice')
ff=shutil.which('ffmpeg')
if not ff:sys.exit('FFmpeg prerequisite missing; no automatic install')
cmd=[ff,'-v','error','-i',str(source)];filters=[];labels=[]
for i,s in enumerate(plan['segments']):
 filters.append('[0:a]atrim=start='+str(s['sourceStart'])+':end='+str(s['sourceEnd'])+',asetpts=PTS-STARTPTS[v'+str(i)+']');labels.append('[v'+str(i)+']')
filters.append(''.join(labels)+'concat=n='+str(len(labels))+':v=0:a=1,volume='+str(a.voice_gain)+',apad,atrim=duration='+str(plan['duration'])+',aresample=48000,aformat=channel_layouts=stereo[voice]');mix=['[voice]'];nextInput=1
if a.voice_output:
 vr=pathlib.Path(a.voice_output)
 if vr.exists() or vr.resolve()==out.resolve():sys.exit('Choose a separate new voice-only output')
 voicecmd=cmd.copy()+['-filter_complex',';'.join(filters),'-map','[voice]','-ar','48000','-ac','2','-c:a','pcm_s16le','-n',a.voice_output]
if a.music:
 if a.music_gain is None or not a.music_rights or not pathlib.Path(a.music_rights).is_file():sys.exit('Choose explicit music gain and rights/credit receipt')
 if not pathlib.Path(a.music).is_file():sys.exit('Licensed music file missing')
 cmd+=['-i',a.music];filters.append('[voice]asplit=2[mainvoice][duckkey]');mix=['[mainvoice]'];filters.append('['+str(nextInput)+':a]volume='+str(a.music_gain)+',apad,atrim=duration='+str(plan['duration'])+'[music]');filters.append('[music][duckkey]sidechaincompress=threshold=0.025:ratio=5:attack=20:release=350[ducked]');mix.append('[ducked]');nextInput+=1
events=json.loads(pathlib.Path(a.sfx_manifest).read_text())['events'] if a.sfx_manifest else []
for i,e in enumerate(events):
 if not pathlib.Path(e['file']).is_file() or not e.get('rights') or not(0<=e['outputAt']<plan['duration']):sys.exit('SFX file/rights/output-clock contact missing')
 cmd+=['-i',e['file']];delay=round(e['outputAt']*1000);label='fx'+str(i);filters.append('['+str(nextInput)+':a]volume='+str(e['gain'])+',adelay='+str(delay)+':all=1['+label+']');mix.append('['+label+']');nextInput+=1
filters.append(''.join(mix)+'amix=inputs='+str(len(mix))+':duration=first:normalize=0,apad,atrim=duration='+str(plan['duration'])+'[out]');cmd+=['-filter_complex',';'.join(filters),'-map','[out]','-ar','48000','-ac','2','-c:a','pcm_s16le','-n',str(out)]
if a.check_only:print(json.dumps({'checkOnly':True,'commands':([voicecmd] if a.voice_output else [])+[cmd],'voiceRoutes':1,'listening':'pending'}));sys.exit(0)
out.parent.mkdir(parents=True,exist_ok=True)
if a.voice_output:
 pathlib.Path(a.voice_output).parent.mkdir(parents=True,exist_ok=True)
 subprocess.run(voicecmd,check=True)
subprocess.run(cmd,check=True);pathlib.Path(str(out)+'.receipt.json').write_text(json.dumps({'commands':([voicecmd] if a.voice_output else [])+[cmd],'outputSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'voiceRoutes':1,'voiceReferenceSha256':hashlib.sha256(pathlib.Path(a.voice_output).read_bytes()).hexdigest() if a.voice_output else None,'rightsReceipt':a.music_rights,'actualListening':'pending','warning':'Gains and technical output do not prove good music or clean edit joins'},indent=2))

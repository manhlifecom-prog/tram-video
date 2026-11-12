#!/usr/bin/env python3
"""Prepare cached local observation media. Does not infer, approve or publish skills."""
import argparse, hashlib, json, math, os, pathlib, re, shutil, subprocess, tempfile, time
VERSION = '1'
def sha(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda:f.read(1024*1024), b''): h.update(b)
    return h.hexdigest()
def run(args):
    p = subprocess.run(args, capture_output=True, text=True, timeout=240)
    if p.returncode: raise RuntimeError(p.stderr[-3000:])
    return p.stderr

def main():
    a = argparse.ArgumentParser(description=__doc__)
    a.add_argument('video', type=pathlib.Path); a.add_argument('--output', type=pathlib.Path, required=True)
    a.add_argument('--ffmpeg', required=True); a.add_argument('--interval', type=float, default=3)
    a.add_argument('--dense', action='append', default=[], help='START:END seconds; at most 12 s per window')
    q = a.parse_args(); source = q.video.resolve(strict=True)
    ff = pathlib.Path(q.ffmpeg).resolve(strict=True)
    if not source.is_file() or source == ff: raise ValueError('Expected a local video file')
    if not .5 <= q.interval <= 10: raise ValueError('interval must be 0.5..10 s')
    windows = []
    for w in q.dense:
        lo, hi = map(float,w.split(':'))
        if not math.isfinite(lo+hi) or lo < 0 or hi <= lo or hi-lo > 12: raise ValueError('Dense window must be positive and <=12 s')
        windows.append([lo,hi])
    if len(windows)>6: raise ValueError('Select at most six meaningful dense windows')
    version = subprocess.check_output([str(ff),'-version'],text=True).splitlines()[0]
    config = {'scriptVersion':VERSION,'scriptSha256':sha(__file__),'sourceSha256':sha(source),'ffmpeg':version,'interval':q.interval,'denseWindows':windows}
    key = hashlib.sha256(json.dumps(config,sort_keys=True).encode()).hexdigest()[:20]
    base=q.output.resolve();base.mkdir(parents=True,exist_ok=True)
    target=base/key; manifest=target/'pack.json'
    if manifest.exists():
        old=json.loads(manifest.read_text())
        if old.get('config') != config: raise ValueError('Cache configuration mismatch')
        for f in old['files']:
            p=(target/f['file']).resolve()
            if target not in p.parents or not p.is_file() or sha(p)!=f['sha256']: raise ValueError('Cache damaged; preserve it and use a new output directory')
        print(json.dumps({'pack':str(manifest),'cacheHit':True,'humanReviewed':False}));return
    if target.exists(): raise ValueError('Unfinished cache exists; inspect it before retrying')
    temp=pathlib.Path(tempfile.mkdtemp(prefix='.preparing-',dir=base));started=time.monotonic()
    try:
        meta=subprocess.run([str(ff),'-hide_banner','-i',str(source)],capture_output=True,text=True,timeout=30).stderr
        m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',meta)
        if not m or 'Video:' not in meta: raise ValueError('Video duration/stream unavailable')
        duration=int(m[1])*3600+int(m[2])*60+float(m[3])
        if duration>600: raise ValueError('Split sources longer than ten minutes with provenance before studying')
        if any(hi>duration for lo,hi in windows): raise ValueError('Dense window exceeds source duration')
        common=[str(ff),'-hide_banner','-nostdin','-y','-threads','2']
        count=math.ceil(duration/q.interval)
        # A small overview is for discovery; it is never frame-by-frame playback proof.
        run(common+['-v','error','-i',str(source),'-an','-vf',f'fps=1/{q.interval},scale=240:-2,tile=5x3','-fps_mode','passthrough',str(temp/'overview-%02d.jpg')])
        # Actual scene-change candidate timestamps, not a complete or verified cut list.
        log=run(common+['-i',str(source),'-an','-vf',"select='gt(scene,0.25)',showinfo",'-fps_mode','vfr','-f','null','-'])
        cuts=[float(t) for t in re.findall(r'pts_time:([\d.]+)',log)]
        (temp/'scene-candidates.json').write_text(json.dumps({'threshold':.25,'times':cuts,'verifiedCuts':False},indent=2))
        for i,(lo,hi) in enumerate(windows):
            run(common+['-v','error','-ss',str(lo),'-t',str(hi-lo),'-i',str(source),'-an','-vf','fps=4,scale=240:-2,tile=6x4','-fps_mode','passthrough',str(temp/f'dense-{i:02d}-%02d.jpg')])
        # Audio remains separate. A waveform cannot prove a clean stem or learned SFX.
        has_audio = 'Audio:' in meta
        if has_audio:
            run(common+['-v','error','-i',str(source),'-vn','-ac','1','-ar','16000','-c:a','pcm_s16le',str(temp/'speech-16k.wav')])
            run(common+['-v','error','-i',str(source),'-filter_complex','aformat=channel_layouts=mono,showwavespic=s=1600x240:colors=white','-frames:v','1',str(temp/'waveform.png')])
        files=[{'file':p.name,'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(temp.iterdir()) if p.is_file()]
        result={'config':config,'durationSeconds':duration,'hasAudio':has_audio,'overviewIndex':[{'index':i,'approximateSeconds':round((i+.5)*q.interval,3),'sheet':f'overview-{i//15+1:02d}.jpg','cell':i%15} for i in range(count)],'denseIndex':[{'window':[lo,hi],'sampleRate':4,'sampleTimestampsApproximate':True} for lo,hi in windows],'files':files,'preparationSeconds':round(time.monotonic()-started,3),'humanReviewed':False,'directAudioAudition':False,'templateApproved':False,'published':False,'localExecutionApproved':False}
        (temp/'pack.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
        temp.rename(target)
        print(json.dumps({'pack':str(manifest),'cacheHit':False,'preparationSeconds':result['preparationSeconds'],'humanReviewed':False}))
    except Exception:
        # Preserve partial evidence rather than silently deleting user data.
        print(json.dumps({'partialPack':str(temp),'complete':False}),file=__import__('sys').stderr)
        raise
if __name__=='__main__': main()

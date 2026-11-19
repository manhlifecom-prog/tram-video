#!/usr/bin/env python3
"""Optional existing MLX Whisper adapter; check first, no downloads or retries."""
import argparse, hashlib, importlib.util, importlib.metadata, json, os, platform
from pathlib import Path
import shutil, subprocess, sys, time
for key in ['HF_HUB_OFFLINE','TRANSFORMERS_OFFLINE','HF_DATASETS_OFFLINE']:os.environ[key]='1'
os.environ['HF_HUB_DISABLE_TELEMETRY']='1';os.environ['DO_NOT_TRACK']='1'
def deny_network(event,args):
 if event in {'socket.connect','socket.connect_ex','socket.getaddrinfo','socket.bind','socket.sendto'}:raise PermissionError('Offline ASR: Python network forbidden')
sys.addaudithook(deny_network)
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return h.hexdigest()
def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--source',required=True);parser.add_argument('--model-dir',required=True);parser.add_argument('--output');parser.add_argument('--language');parser.add_argument('--ffmpeg');parser.add_argument('--expected-source-sha256');parser.add_argument('--expected-model-sha256');parser.add_argument('--check-only',action='store_true');a=parser.parse_args()
 source=Path(a.source).expanduser().resolve();model=Path(a.model_dir).expanduser().resolve()
 if not source.is_file() or not model.is_dir() or not (model/'config.json').is_file():raise ValueError('Existing local source/model config required; no fetch')
 weights=next((model/n for n in ['weights.safetensors','weights.npz'] if (model/n).is_file()),None)
 if weights is None:raise ValueError('Complete local weights.safetensors OR weights.npz required; no fetch')
 config=json.loads((model/'config.json').read_text(encoding='utf8'))
 if not all(k in config for k in ['n_mels','n_audio_layer','n_text_layer','n_vocab']):raise ValueError('Unsupported local MLX Whisper config')
 if sys.platform!='darwin' or platform.machine()!='arm64':raise ValueError('This optional adapter requires Apple Silicon macOS; use a verified source-bound transcript or separately supported adapter')
 versions={}
 for name,version in [('mlx-whisper','0.4.3'),('mlx','0.32.4')]:
  try:actual=importlib.metadata.version(name)
  except importlib.metadata.PackageNotFoundError:raise ValueError('Missing optional dependency '+name+'; no install performed')
  if actual!=version:raise ValueError('Unsupported optional version '+name+': expected '+version+', got '+actual)
  versions[name]=actual
 spec=importlib.util.find_spec('mlx_whisper')
 if not spec or not spec.origin:raise ValueError('Local mlx_whisper module not found')
 package=Path(spec.origin).parent;resources={}
 for n in ['assets/multilingual.tiktoken','assets/gpt2.tiktoken','assets/mel_filters.npz','transcribe.py','load_models.py','tokenizer.py','timing.py']:
  q=package/n
  if not q.is_file():raise ValueError('Missing local tokenizer/runtime resource '+n+'; network fallback forbidden')
  resources[n]=sha(q)
 ff=Path(a.ffmpeg or shutil.which('ffmpeg') or '').expanduser().resolve()
 if not ff.is_file() or not os.access(ff,os.X_OK):raise ValueError('Existing FFmpeg executable required; no download')
 source_sha=sha(source);weights_sha=sha(weights)
 for expected,actual,label in [(a.expected_source_sha256,source_sha,'source'),(a.expected_model_sha256,weights_sha,'model')]:
  if expected and expected!=actual:raise ValueError(label+' fingerprint mismatch')
 receipt={'sourceSha256':source_sha,'modelWeightsSha256':weights_sha,'modelConfigSha256':sha(model/'config.json'),'weightsFile':weights.name,'architecture':{k:config[k] for k in ['n_mels','n_audio_layer','n_text_layer','n_vocab']},'versions':versions,'python':platform.python_version(),'runtimeResources':resources,'ffmpegSha256':sha(ff),'checkOnly':a.check_only,'network':'Python socket audit deny plus hub-offline; FFmpeg file/pipe protocol whitelist; no provider/install/model download','guardScope':'Adapter guard, not a whole-OS sandbox against arbitrary native code','wordClock':'Estimated cross-attention/DTW; model probabilities not calibrated accuracy; listening pending'}
 if a.check_only:print(json.dumps(receipt));return
 if not a.output or not a.language or not a.expected_source_sha256 or not a.expected_model_sha256:raise ValueError('Inference requires --output, explicit --language and both expected fingerprints from check-only')
 out=Path(a.output).expanduser().resolve()
 if out.exists() or out.is_symlink():raise ValueError('Transcript already exists; preserve original and inspect cache, no retry')
 probe=out.parent
 while not probe.exists():probe=probe.parent
 if shutil.disk_usage(probe).free<3*1024**3:raise ValueError('Insufficient disk for safe local inference; need at least 3 GiB and project-specific RAM review')
 out.parent.mkdir(parents=True,exist_ok=True);attempt=out.with_name(out.name+'.attempt.json')
 state={**receipt,'status':'reserved','startedAt':time.time(),'attempt':1,'retry':'No automatic retries; inspect failed reservation before any separately authorized new attempt'}
 with attempt.open('x',encoding='utf8') as f:json.dump(state,f,indent=2)
 try:
  import numpy as np
  import mlx_whisper
  # Decode only local file/pipe protocols, avoiding subprocess network escapes in playlist inputs.
  cmd=[str(ff),'-v','error','-nostdin','-protocol_whitelist','file,pipe','-i',str(source),'-vn','-ac','1','-ar','16000','-f','f32le','pipe:1']
  pcm=subprocess.run(cmd,capture_output=True,check=True).stdout;audio=np.frombuffer(pcm,dtype=np.float32)
  result=mlx_whisper.transcribe(audio,path_or_hf_repo=str(model),language=a.language,task='transcribe',word_timestamps=True,temperature=0.0,fp16=True,verbose=None)
  record={**receipt,'decodeCommand':cmd,'attempt':1,'result':result,'manualListening':'pending','sourceUnmodified':True}
  with out.open('x',encoding='utf8') as f:json.dump(record,f,ensure_ascii=False,indent=2)
  out.chmod(0o444);state.update({'status':'completed','outputSha256':sha(out),'elapsedSeconds':time.time()-state['startedAt']})
 except BaseException:
  state['status']='failed_no_retry';attempt.write_text(json.dumps(state,indent=2),encoding='utf8');raise
 attempt.write_text(json.dumps(state,indent=2),encoding='utf8');print(json.dumps({'status':'completed','output':str(out),'sha256':state['outputSha256'],'manualListening':'pending'}))
if __name__=='__main__':
 try:main()
 except (ValueError,OSError,KeyError,json.JSONDecodeError,subprocess.CalledProcessError) as e:raise SystemExit('Offline ASR stopped: '+str(e))

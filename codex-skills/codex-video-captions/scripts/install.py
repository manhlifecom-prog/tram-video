#!/usr/bin/env python3
"""Verified managed install; explicit destination, no dependencies or media work."""
import argparse, hashlib, json, os, re, shutil, tempfile, time, uuid
from pathlib import Path, PurePosixPath
NAME='codex-video-captions'
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return h.hexdigest()
def protected(n):
 return n.split('/')[0].lower() in {'profiles','dna','data','outputs','projects','config','.cache','.git','node_modules'} or n.startswith(('.env','public/input/','public/audio/','public/matte/','public/illustrations/')) or n=='project-plan.json'
def paths(m):
 if not isinstance(m.get('files'),list):raise ValueError('Manifest files must be an array')
 rows={}
 for row in m['files']:
  n=row.get('path','');r=PurePosixPath(n)
  if not n or r.is_absolute() or n!=r.as_posix() or '..' in r.parts or chr(92) in n or ':' in n or n in rows or n=='MANIFEST.json' or not re.fullmatch('[a-f0-9]{64}',row.get('sha256','')):raise ValueError('Unsafe/duplicate manifest entry: '+n)
  rows[n]=row
 return rows
def safe(root,n):
 q=root
 if q.is_symlink():raise ValueError('Target directory symlink refused')
 for part in PurePosixPath(n).parts:
  q=q/part
  if q.is_symlink():raise ValueError('Symlink target component refused: '+n)
 return q
def main():
 parser=argparse.ArgumentParser(description=__doc__);g=parser.add_mutually_exclusive_group(required=True);g.add_argument('--skills-dir');g.add_argument('--target-dir',help='Exact real folder named codex-video-captions');parser.add_argument('--backup-dir');parser.add_argument('--upgrade',action='store_true');parser.add_argument('--check-only',action='store_true');a=parser.parse_args()
 src=Path(__file__).resolve().parents[1];raw=Path(a.target_dir or str(Path(a.skills_dir).expanduser()/NAME)).expanduser().absolute()
 if raw.name!=NAME or any(q.is_symlink() for q in [raw,*raw.parents]):raise ValueError('Use a real destination ending in '+NAME)
 dest=raw.resolve();base=dest.parent
 if dest==src or src in dest.parents or dest in src.parents:raise ValueError('Destination must be separate from package source')
 mp=src/'MANIFEST.json';new=paths(json.loads(mp.read_text(encoding='utf8')));entries=list(src.rglob('*'))
 if any(q.is_symlink() for q in entries):raise ValueError('Package symlinks refused')
 if {q.relative_to(src).as_posix() for q in entries if q.is_file()}!=set(new)|{'MANIFEST.json'}:raise ValueError('Package has unlisted/missing files; use verified complete archive')
 for n,row in new.items():
  f=src/n
  if sha(f)!=row['sha256'] or ('bytes' in row and f.stat().st_size!=row['bytes']):raise ValueError('Package checksum failure: '+n)
 old={}
 if dest.exists():
  if not dest.is_dir() or not safe(dest,'MANIFEST.json').is_file():raise ValueError('Unmanaged existing target preserved; review migration separately')
  old=paths(json.loads((dest/'MANIFEST.json').read_text(encoding='utf8')))
  for n,row in old.items():
   if protected(n):continue
   q=safe(dest,n)
   if not q.is_file() or sha(q)!=row['sha256']:raise ValueError('Modified/missing managed file preserved: '+n)
  for n in new:
   q=safe(dest,n)
   if not protected(n) and q.exists() and n not in old:raise ValueError('Unmanaged collision preserved: '+n)
  if sha(dest/'MANIFEST.json')==sha(mp):print(json.dumps({'status':'up-to-date','target':str(dest),'checkOnly':a.check_only}));return
  if not a.upgrade or not a.backup_dir:raise ValueError('Upgrade requires --upgrade plus --backup-dir outside skills discovery')
 br=Path(a.backup_dir).expanduser().resolve() if a.backup_dir else None
 if br and (br==base or base in br.parents or br==src or src in br.parents):raise ValueError('Backup must be outside skills discovery and package source')
 skipped=sorted(n for n in new if protected(n))
 if a.check_only:print(json.dumps({'status':'verified-check-only','target':str(dest),'upgrade':dest.exists(),'protectedPayloadNotInstalled':skipped}));return
 if not dest.exists():
  base.parent.mkdir(parents=True,exist_ok=True)
  with tempfile.TemporaryDirectory(prefix='codex-skill-install-',dir=base.parent) as td:
   stage=Path(td)/NAME;stage.mkdir()
   for n in new:
    if protected(n):continue
    q=stage/n;q.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src/n,q)
   shutil.copy2(mp,stage/'MANIFEST.json');base.mkdir(parents=True,exist_ok=True)
   if dest.exists():raise ValueError('Target appeared during install; preserved')
   os.rename(stage,dest)
  print(json.dumps({'status':'installed','target':str(dest),'protectedPayloadNotInstalled':skipped,'workflowRun':False}));return
 backup=br/(NAME+'-'+str(int(time.time()))+'-'+uuid.uuid4().hex[:8]);backup.mkdir(parents=True,exist_ok=False);names=sorted(n for n in set(old)|set(new) if not protected(n))
 for n in [*old,'MANIFEST.json']:
  q=safe(dest,n)
  if not protected(n) and q.is_file():(backup/n).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(q,backup/n)
 created=[]
 try:
  for n in names:
   q=safe(dest,n)
   if not q.exists():created.append(n)
   if n in new:q.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src/n,q)
   elif q.exists():q.unlink()
  shutil.copy2(mp,dest/'MANIFEST.json')
 except Exception:
  for n in names:
   b=backup/n
   if b.is_file():q=safe(dest,n);q.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(b,q)
  for n in created:
   q=safe(dest,n)
   if q.is_file() and n in new and sha(q)==new[n]['sha256']:q.unlink()
  shutil.copy2(backup/'MANIFEST.json',dest/'MANIFEST.json');raise
 receipt={'status':'upgraded','target':str(dest),'backup':str(backup),'managedOnly':True,'protectedPayloadNotInstalled':skipped,'workflowRun':False,'rollback':'Restore backed-up managed files/manifest; remove only newly added managed files with matching new hashes, never user data.'};(backup/'INSTALL-RECEIPT.json').write_text(json.dumps(receipt,indent=2),encoding='utf8');print(json.dumps(receipt))
if __name__=='__main__':
 try:main()
 except (ValueError,OSError,KeyError,json.JSONDecodeError) as e:raise SystemExit('Install stopped: '+str(e))

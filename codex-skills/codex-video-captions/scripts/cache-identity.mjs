import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {lstat,readdir} from 'node:fs/promises';
import path from 'node:path';
/** Remotion copies public into the bundle: code AND public bytes identify a reusable bundle. */
export async function cacheIdentity(root){
 const hash=createHash('sha256');
 async function visit(relative){
  const file=path.join(root,relative),info=await lstat(file);
  if(info.isSymbolicLink())throw Error('Project bundle inputs must be regular local files/directories; copy intended assets into the project instead of linking them.');
  if(info.isDirectory()){for(const name of (await readdir(file)).sort())await visit(path.join(relative,name));return;}
  if(!info.isFile())throw Error('Unsupported bundle input: '+relative);
  const normalized=relative.split(path.sep).join('/');hash.update(Buffer.byteLength(normalized)+':'+normalized+':'+info.size+':');
  for await(const chunk of createReadStream(file))hash.update(chunk);
 }
 for(const relative of ['assets','renderer','examples','profiles','public','package.json'])await visit(relative);
 return hash.digest('hex');
}

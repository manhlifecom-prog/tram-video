import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,rm,writeFile,utimes} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {cacheIdentity} from './cache-identity.mjs';
async function fixture(run){const root=await mkdtemp(path.join(os.tmpdir(),'caption-cache-test-'));try{for(const d of ['assets','renderer','examples','profiles','public/input','public/fonts'])await mkdir(path.join(root,d),{recursive:true});for(const [file,bytes]of [['assets/helper.tsx','code'],['renderer/index.tsx','renderer'],['public/input/source.mp4','source-a'],['public/fonts/font.ttf','font-a'],['package.json','{}']])await writeFile(path.join(root,file),bytes);await run(root);}finally{await rm(root,{recursive:true,force:true});}}
test('bundle identity is stable for unchanged bytes, regardless of file mtime',()=>fixture(async root=>{const initial=await cacheIdentity(root);await utimes(path.join(root,'public/input/source.mp4'),new Date(0),new Date(0));assert.equal(await cacheIdentity(root),initial);}));
test('same-name source replacement and a new public filename both invalidate a reusable bundle',()=>fixture(async root=>{const first=await cacheIdentity(root);await writeFile(path.join(root,'public/input/source.mp4'),'source-b');const second=await cacheIdentity(root);assert.notEqual(second,first);await writeFile(path.join(root,'public/input/new-source.mp4'),'source-c');assert.notEqual(await cacheIdentity(root),second);}));
test('font bytes and helper code changes invalidate a reusable bundle',()=>fixture(async root=>{const first=await cacheIdentity(root);await writeFile(path.join(root,'public/fonts/font.ttf'),'font-b');const second=await cacheIdentity(root);assert.notEqual(second,first);await writeFile(path.join(root,'assets/helper.tsx'),'code-v2');assert.notEqual(await cacheIdentity(root),second);}));

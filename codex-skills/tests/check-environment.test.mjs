import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, rm, symlink, realpath} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';
import {checkProject} from '../codex-video-captions/scripts/check-environment.mjs';
const pkg=JSON.parse(await readFile(new URL('../codex-video-captions/package.json',import.meta.url),'utf8'));
async function fixture(fn){const temp=await realpath(await mkdtemp(path.join(os.tmpdir(),'skill setup ')));try{const project=path.join(temp,'working project');await mkdir(project);await writeFile(path.join(project,'package.json'),JSON.stringify(pkg));await local(project);await fn(project,temp);}finally{await rm(temp,{recursive:true,force:true});}}
async function local(project){for(const [name,version]of Object.entries({...pkg.dependencies,...pkg.devDependencies})){const d=path.join(project,'node_modules',name);await mkdir(d,{recursive:true});await writeFile(path.join(d,'package.json'),JSON.stringify({name,version}));}}
test('exact seven local metadata pins, spaces in project path',()=>fixture(async p=>{const r=await checkProject(p);assert.equal(Object.keys(r.pins).length,7);assert.equal(r.status,'local-setup-check-only');}));
test('ancestor packages cannot satisfy absent local modules',()=>fixture(async(p,t)=>{await rm(path.join(p,'node_modules'),{recursive:true});await local(t);await assert.rejects(checkProject(p),/project-local/);}));
test('shared node_modules symlink rejected',()=>fixture(async(p,t)=>{const target=path.join(t,'external');await mkdir(target);await local(target);await rm(path.join(p,'node_modules'),{recursive:true});await symlink(path.join(target,'node_modules'),path.join(p,'node_modules'));await assert.rejects(checkProject(p),/project-local/);}));
test('package symlink rejected even with matching version',()=>fixture(async(p,t)=>{const dest=path.join(p,'node_modules/react');await rm(dest,{recursive:true});const other=path.join(t,'external-react');await mkdir(other);await writeFile(path.join(other,'package.json'),JSON.stringify({version:'19.2.3'}));await symlink(other,dest);await assert.rejects(checkProject(p),/actual project-local/);}));
test('wrong local package version rejected',()=>fixture(async p=>{await writeFile(path.join(p,'node_modules/react/package.json'),JSON.stringify({version:'1.0.0'}));await assert.rejects(checkProject(p),/Wrong react/);}));
test('package declaration cannot silently remove a required pin',()=>fixture(async p=>{const modified=structuredClone(pkg);delete modified.dependencies.remotion;await writeFile(path.join(p,'package.json'),JSON.stringify(modified));await assert.rejects(checkProject(p),/exact seven/);}));

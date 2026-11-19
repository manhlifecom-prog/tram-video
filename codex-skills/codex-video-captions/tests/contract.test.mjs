import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {checkPlan} from '../scripts/check-plan.mjs';
const base=JSON.parse(await readFile(new URL('../examples/neutral-plan.json',import.meta.url),'utf8'));const clone=()=>structuredClone(base);
test('neutral contract structurally valid but not media ready',()=>{assert.equal(checkPlan(clone()).exampleOnly,true)});
test('unknown capability cannot downgrade silently',()=>{const p=clone();p.requestedCapabilities.push('secret-engine');assert.throws(()=>checkPlan(p),/Unsupported/)});
test('requested phone cannot become static fallback',()=>{const p=clone();p.requestedCapabilities.push('phone-ui');assert.throws(()=>checkPlan(p),/animatedphone/)});
test('requested word motion cannot become phrase fallback',()=>{const p=clone();p.requestedCapabilities.push('word-captions');assert.throws(()=>checkPlan(p),/perword/)});
test('integer-frame segment gap fails',()=>{const p=clone();p.segments[0].videoFrameStart=1;assert.throws(()=>checkPlan(p),/EDL/)});
test('clock from another source fails',()=>{const p=clone();p.wordClock.sourceSha256='f'.repeat(64);assert.throws(()=>checkPlan(p),/Source-bound/)});
test('edited voice cannot reuse unprepared source audio',()=>{const p=clone();p.segments[0].sourceStart=.1;assert.throws(()=>checkPlan(p))});
test('matte without sourceclock mix fails',()=>{const p=clone();p.behindShots=[{}];assert.throws(()=>checkPlan(p),/fullmix/)});
test('editorial hook requires explicit local phases and text',()=>{const p=clone();p.openingHook={editorial:true};assert.throws(()=>checkPlan(p),/Opening hook/)});
test('unapproved full render fails',()=>assert.throws(()=>checkPlan(clone(),{full:true}),/permission|review/));

test('same-name media byte change invalidates real renderer fingerprint',async()=>{const {mkdtemp,writeFile,rm}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const path=await import('node:path');const {fingerprintInputs}=await import('../scripts/cache-identity.mjs');const root=await mkdtemp(path.join(tmpdir(),'caption-cache-'));try{const f=path.join(root,'source.bin');await writeFile(f,'customer-a');const a=await fingerprintInputs(root,[f]);await writeFile(f,'customer-b');const b=await fingerprintInputs(root,[f]);assert.notEqual(a.identity,b.identity)}finally{await rm(root,{recursive:true,force:true})}});

test('all required plain-text entry reference paths resolve',async()=>{const {access}=await import('node:fs/promises');const s=await readFile(new URL('../SKILL.md',import.meta.url),'utf8');const refs=[...s.matchAll(/references\/[A-Za-z0-9._/-]+\.md/g)].map(m=>m[0]);assert.ok(refs.length);for(const r of refs)await access(new URL('../'+r,import.meta.url));});

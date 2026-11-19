import {readFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
export const modes=['reveal','calm','shine','spring','tension','curious','burst','word-spring','word-curious','word-soft','word-spark'];
const normalized=s=>s.trim().replace(/\s+/g,' ');
const finite=n=>typeof n==='number'&&Number.isFinite(n);
function requireValue(ok,message){if(!ok)throw new Error(message);}
export function checkInput(input){
 requireValue(input&&input.schemaVersion==='0.1.0','schemaVersion must be0.1.0');
 requireValue(typeof input.profileId==='string'&&/^[a-z0-9-]{1,60}$/.test(input.profileId),'profileId required; choose an explicit local DNA profile, no automatic customer style');
 requireValue(typeof input.id==='string'&&/^[a-z0-9-]{1,80}$/.test(input.id),'id must be a short lowercase identifier');
 requireValue(finite(input.duration)&&input.duration>=1&&input.duration<=90,'duration must be1..90 seconds');
 requireValue([24,25,30].includes(input.fps),'fps must be24,25 or30');
 requireValue(input.source&&['geometry','video'].includes(input.source.kind),'source.kind must be geometry or video');
 requireValue(typeof input.source.provenance==='string'&&input.source.provenance.trim().length>=10,'source.provenance must explain source rights');
 if(input.source.kind==='video')requireValue(typeof input.source.file==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_./-]*\.(mp4|mov|webm)$/i.test(input.source.file)&&!input.source.file.split('/').some(p=>p==='..'||p==='')&&!input.source.file.includes(':'),'source.file must be a relative video path inside public/, without URLs or traversal');
 requireValue(input.timingBasis&&['source-asr','manual-source-anchors','synthetic-cue'].includes(input.timingBasis.kind),'timingBasis.kind required');
 requireValue(typeof input.timingBasis.note==='string'&&input.timingBasis.note.length>=10,'timingBasis.note must describe the actual timing evidence');
 requireValue(typeof input.timingBasis.listened==='boolean','timingBasis.listened must be stated truthfully');
 requireValue(input.source.kind!=='geometry'||input.timingBasis.kind==='synthetic-cue','geometry is a synthetic cue proof, not speech ASR');
 requireValue(finite(input.captionTop)&&input.captionTop>=150&&input.captionTop<=1600,'captionTop must be within portrait safe area150..1600');
 requireValue(Array.isArray(input.cues)&&input.cues.length>0&&input.cues.length<=120,'cues must contain1..120 entries');
 let previousEnd=0;
 for(const [index,cue] of input.cues.entries()){
  const tag=`cue${index+1}`;
  requireValue(finite(cue.start)&&finite(cue.end)&&cue.start>=previousEnd&&cue.end>cue.start&&cue.end<=input.duration,`${tag}: invalid/overlapping cue times`);previousEnd=cue.end;
  requireValue(typeof cue.text==='string'&&cue.text===normalized(cue.text)&&cue.text.length<=240,`${tag}: text must be normalized and <=240 characters`);
  const words=cue.text.split(' '),choice=cue.choice;
  requireValue(choice&&modes.includes(choice.mode)&&choice.start===cue.start,`${tag}: explicit choice mode/start required`);
  requireValue(typeof choice.reason==='string'&&choice.reason.length>=10&&typeof choice.emotion==='string',`${tag}: choose motion from meaning/emotion, with a reason`);
  requireValue(!choice.main&&!choice.lead&&!choice.tail,`${tag}: starter renderer uses explicit phrase lines; adapt source before adding summary mode`);
  requireValue(Array.isArray(choice.lines)&&choice.lines.length>=1&&choice.lines.length<=3&&choice.lines.every(s=>typeof s==='string'&&normalized(s)===s)&&normalized(choice.lines.join(' '))===cue.text,`${tag}: lines must preserve the complete text and punctuation`);
  if(cue.key)requireValue(typeof cue.key==='string'&&choice.lines.some(line=>line.includes(cue.key)),`${tag}: key phrase must stay together on one line`);
  requireValue(finite(choice.bodySize)&&choice.bodySize>=32&&choice.bodySize<=70&&finite(choice.keySize)&&choice.keySize>=choice.bodySize&&choice.keySize<=105,`${tag}: body/key sizes outside starter limits`);
  const onsets=choice.tokenOnsets;
  requireValue(Array.isArray(onsets)&&onsets.length===words.length,`${tag}: one source-mapped tokenOnset per token is required; no invented even delay`);
  requireValue(onsets.every((n,i)=>finite(n)&&n>=0&&n<cue.end-cue.start&&(i===0||n>=onsets[i-1])),`${tag}: tokenOnsets must increase within cue`);
  requireValue(onsets.every(n=>n<=cue.end-cue.start-.2),`${tag}: tokenOnsets readingWindowInsufficient; preserve source anchors, use a valid key-idea caption or real source pause. Do not move words earlier for validation.`);
  if(choice.mode.startsWith('word-'))requireValue(Array.isArray(choice.wordOnsets)&&choice.wordOnsets.length===words.length&&choice.wordOnsets.every((n,i)=>n===onsets[i]),`${tag}: word mode requires the same explicit source-mapped wordOnsets`);
 }
 return input;
}
export function checkProfile(profile,input){
 requireValue(profile&&profile.profileVersion==='0.1.0'&&profile.id===input.profileId,'An exact versioned local DNA profile is required');
 requireValue(profile.typography?.fontId==='be-vietnam-pro','Only the bundled registered fontId be-vietnam-pro is currently available');
 for(const key of ['background','surface','shape','shapeShade','text','accent','soft','muted'])requireValue(/^#[0-9a-fA-F]{6}$/.test(profile.palette?.[key]||''),`Profile palette.${key} must be an explicit six-digit hex color`);
 requireValue(finite(profile.typography.shadowOpacity)&&profile.typography.shadowOpacity>=0&&profile.typography.shadowOpacity<=.6,'Profile shadowOpacity must be0..0.6');
 for(const key of ['bodyScale','keyScale'])requireValue(finite(profile.typography[key])&&profile.typography[key]>=.8&&profile.typography[key]<=1.1,`Profile typography.${key} outside0.8..1.1`);
 requireValue(finite(profile.layout?.captionOffsetY)&&input.captionTop+profile.layout.captionOffsetY>=150&&input.captionTop+profile.layout.captionOffsetY<=1600,'Profile caption position outside safe area');
 requireValue(['contain','cover'].includes(profile.layout.videoFit)&&[profile.layout.captionLeft,profile.layout.captionRight].every(n=>finite(n)&&n>=75&&n<=200),'Profile must declare crop fit and caption side margins');
 requireValue(profile.motion?.policy==='mostly-phrase-sparse-emphasis'&&Array.isArray(profile.motion.allowedModes)&&profile.motion.maxSpecialCuesInRow===1,'Profile motion policy must be explicit; no random preset rotation');
 let consecutive=0;
 for(const cue of input.cues){requireValue(profile.motion.allowedModes.includes(cue.choice.mode),'Cue mode is outside this profile');consecutive=['reveal','calm','word-soft'].includes(cue.choice.mode)?0:consecutive+1;requireValue(consecutive<=1,'Consecutive special effects exceed this profile; add a genuine quiet cue instead of cycling presets');}
 for(const key of ['faceIdentity','sourceVoice','liveSpeaker','semanticNegation'])requireValue(profile.preserve?.[key]===true,`Profile preserve.${key} must remain true for this presenter sample`);
 requireValue(typeof profile.cropRule==='string'&&profile.cropRule.length>=20,'Profile cropRule must protect the real speaker');
 return profile;
}
export async function readInput(file){return checkInput(JSON.parse(await readFile(file,'utf8')));}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),file=path.resolve(process.argv[2]||path.join(root,'examples/profile-a-same-input.json'));
 try{const input=await readInput(file);console.log(`Input valid: ${input.id}; ${input.duration}s; ${input.cues.length} cues; ${input.timingBasis.kind}`);}catch(error){console.error(error.message);process.exitCode=1;}
}

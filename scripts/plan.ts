import {readFile, mkdir, writeFile, copyFile} from 'node:fs/promises';
import {resolve, basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {sentenceEffectsPlan} from '../src/lib/studio/sentence-effects';
import {motionProps} from '../src/lib/studio/motion-props';
import {defaultConcept} from '../src/lib/studio/types';

type Segment = {start:number;end:number;text:string};
export function validateTranscript(input: unknown): {title:string;duration:number;segments:Segment[]} {
  if (!input || typeof input !== 'object') throw new Error('Transcript must be an object.');
  const value = input as Record<string,unknown>;
  if (typeof value.duration !== 'number' || !Number.isFinite(value.duration) || value.duration <= 0 || value.duration > 3600)
    throw new Error('duration must be 0–3600 seconds (exclusive of zero).');
  if (!Array.isArray(value.segments) || !value.segments.length || value.segments.length > 80)
    throw new Error('Provide 1–80 timed speech segments.');
  let previousEnd = 0;
  const segments = value.segments.map((item:unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Invalid speech segment.');
    const s = item as Segment;
    if (!Number.isFinite(s.start) || !Number.isFinite(s.end) || s.start < previousEnd || s.end <= s.start || s.end > (value.duration as number) || typeof s.text !== 'string' || !s.text.trim())
      throw new Error('Segments must be ordered, non-overlapping, non-empty and inside duration.');
    previousEnd = s.end;
    return {start:s.start,end:s.end,text:s.text.trim()};
  });
  return {title:typeof value.title === 'string' ? value.title : 'Trạm Video',duration:value.duration,segments};
}

async function main() {
  const [input,video] = process.argv.slice(2);
  if (!input) throw new Error('Usage: npm run plan -- examples/transcript.json [your-video.mp4]');
  const transcript = validateTranscript(JSON.parse(await readFile(resolve(input),'utf8')));
  const plan = sentenceEffectsPlan(transcript.segments,transcript.duration,transcript.title);
  const props = motionProps(plan,transcript.segments,{...defaultConcept,name:transcript.title,color:'#D8B778',font:'Be Vietnam Pro'},1080,1920);
  if (video) {
    if (!/\.(mp4|webm|mov)$/i.test(basename(video))) throw new Error('Use MP4, MOV or WebM video.');
    await mkdir('public/local',{recursive:true});
    const name = `source${basename(video).slice(basename(video).lastIndexOf('.')).toLowerCase()}`;
    await copyFile(resolve(video),resolve('public/local',name));
    props.videoSrc = `local/${name}`;
  }
  await mkdir('out',{recursive:true});
  await writeFile('out/props.json',JSON.stringify(props,null,2)+'\n');
  console.log(`Created out/props.json: ${plan.scenes.length} scenes. Next: npm run render`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {console.error(error.message);process.exitCode=1;});
}

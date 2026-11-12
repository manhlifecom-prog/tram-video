import {Easing,interpolate} from 'remotion';

type Entry={at:number;end:number};
export type CountStepsTiming={
 frame:number;
 number:Entry;
 label:Entry;
 title:Entry;
 overviewExit:Entry;
 steps:{id:string;at:number;end:number}[];
 listExit:Entry;
};
const ease=Easing.bezier(.16,1,.3,1);
const valid=(t:Entry)=>Number.isSafeInteger(t.at)&&Number.isSafeInteger(t.end)&&t.at>=0&&t.end>t.at;
const progress=(frame:number,t:Entry)=>interpolate(frame,[t.at,t.end],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
/** Reusable timing primitive reconstructed from an observed layout grammar.
 * Observed grammar: count → label → title → clear → accumulating step rows.
 * Curve is the authored reconstruction, not measured easing from the reference.
 * No source, typography, colors, count text, dimensions or audio is supplied.
 * Keep actual media/speech clocks external and source media mounted continuously.
 * Renderer must measure its account font at phone scale and reserve safe areas.
 */
export function countStepsState(p:CountStepsTiming){
 const {frame,number,label,title,overviewExit,steps,listExit}=p;
 if(!Number.isFinite(frame)||![number,label,title,overviewExit,listExit].every(valid)||!Array.isArray(steps)||steps.length<1||steps.length>6||new Set(steps.map(s=>s.id)).size!==steps.length||steps.some(s=>typeof s.id!=='string'||!s.id.trim()||!valid(s)))throw Error('Count steps requires valid frame clocks and1–6 distinct actual steps. Split longer processes rather than dropping content.');
 if(label.at<number.at||title.at<label.at||overviewExit.at<Math.max(number.end,label.end,title.end)||steps[0].at<overviewExit.end||steps.some((s,i)=>i>0&&s.at<=steps[i-1].at)||listExit.at<Math.max(...steps.map(s=>s.end)))throw Error('Count steps must hold and clear the overview before ordered rows enter, then hold every completed row before exit.');
 const exit=progress(frame,overviewExit),listOut=progress(frame,listExit);
 const amount=(entry:Entry)=>progress(frame,entry);
 return {
  count:steps.length,
  overview:{visible:frame>=number.at&&frame<overviewExit.end,opacity:frame<number.at?0:1-exit,exitAmount:exit,number:amount(number),label:amount(label),title:amount(title)},
  list:{visible:frame>=steps[0].at&&frame<listExit.end,opacity:frame<steps[0].at?0:1-listOut,exitAmount:listOut,rows:steps.map(s=>({id:s.id,amount:amount(s)}))},
 };
}

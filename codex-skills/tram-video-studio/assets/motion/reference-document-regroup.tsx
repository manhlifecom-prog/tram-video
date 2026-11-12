import React,{type ReactNode} from 'react';
import {Easing,interpolate,useCurrentFrame} from 'remotion';
export type RegroupRect={x:number;y:number;width:number;height:number};
type Item={id:string;content:ReactNode;rect:RegroupRect;at:number;frames:number};
export type DocumentRegroupProps={
 width:number;height:number;pageRect:RegroupRect;pageContent:ReactNode;
 oldRows:Item[];newGroups:(Item&{sourceIds:string[]})[];
 timing:{clearAt:number;clearFrames:number;exitAt:number;exitFrames:number};
 /** Explicitly authored residual ghost, not an inferred OCR/alpha value. */
 oldResidualOpacity:number;
};
const ease=Easing.bezier(.16,1,.3,1);
const inside=(r:RegroupRect,w:number,h:number)=>[r.x,r.y,r.width,r.height].every(Number.isFinite)&&r.x>=0&&r.y>=0&&r.width>0&&r.height>0&&r.x+r.width<=w&&r.y+r.height<=h;
const overlaps=(a:RegroupRect,b:RegroupRect)=>a.x<b.x+b.width&&b.x<a.x+a.width&&a.y<b.y+b.height&&b.y<a.y+a.height;
const clock=(v:number)=>Number.isSafeInteger(v)&&v>=0;
/** Document regroup grammar: keep ONE page, fade old rows in place,
 * then accumulate distinct capability chips in reserved cells. There is no
 * observed geometric morph from company rows into chips. Caller supplies
 * truthful content, measured account fonts/colors and safe page geometry.
 * No source voice, music/SFX, automatic grouping or exact reference easing.
 * Keep speaker/video/captions outside this component on continuous clocks. */
export function documentRegroupState(p:DocumentRegroupProps,frame:number){
 const {width,height,pageRect,oldRows,newGroups,timing:t,oldResidualOpacity}=p;
 if(!Number.isFinite(frame)||![width,height].every(v=>Number.isFinite(v)&&v>=320)||!inside(pageRect,width,height)||p.pageContent==null||![t.clearAt,t.clearFrames,t.exitAt,t.exitFrames].every(clock)||t.clearFrames<2||t.exitFrames<2||!Number.isFinite(oldResidualOpacity)||oldResidualOpacity<0||oldResidualOpacity>.15)throw Error('Document regroup needs bounded page geometry, explicit clocks and a faint authored residual.');
 for(const [kind,items] of [['old',oldRows],['new',newGroups]] as const){
  if(!Array.isArray(items)||!items.length||items.length>12||new Set(items.map(i=>i.id)).size!==items.length||items.some((i,n)=>!i.id?.trim()||i.content==null||!inside(i.rect,pageRect.width,pageRect.height)||!clock(i.at)||!clock(i.frames)||i.frames<2||(n>0&&i.at<items[n-1].at)||items.slice(n+1).some(j=>overlaps(i.rect,j.rect))))throw Error('Document regroup needs1–12 distinct ordered nonoverlapping items per state. Split larger groups, never drop them.');
  if(kind==='old'&&Math.max(...items.map(i=>i.at+i.frames))>t.clearAt)throw Error('Old rows must finish entering before the grouping criterion changes.');
  if(kind==='new'&&(items[0].at<t.clearAt+t.clearFrames||Math.max(...items.map(i=>i.at+i.frames))>t.exitAt))throw Error('New groups follow the old-row fade and all finish before page exit.');
 }
 if(newGroups.some(g=>!Array.isArray(g.sourceIds)||!g.sourceIds.length||new Set(g.sourceIds).size!==g.sourceIds.length||g.sourceIds.some(id=>!oldRows.some(r=>r.id===id))))throw Error('New groups must name the actual old evidence IDs they summarize; IDs do not prove semantic correctness.');
 const q=(at:number,frames:number)=>interpolate(frame,[at,at+frames],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
 const clear=q(t.clearAt,t.clearFrames),exit=q(t.exitAt,t.exitFrames);
 return {page:{opacity:1-exit},oldRows:oldRows.map(i=>({id:i.id,opacity:q(i.at,i.frames)*(1-clear*(1-oldResidualOpacity)),translateY:(1-q(i.at,i.frames))*8})),newGroups:newGroups.map(i=>({id:i.id,opacity:q(i.at,i.frames),translateX:(1-q(i.at,i.frames))*12}))};
}
export const documentRegroupFrame=(p:DocumentRegroupProps,frame:number)=>{
 const state=documentRegroupState(p,frame);
 const render=(items:Item[],values:{id:string;opacity:number;translateX?:number;translateY?:number}[])=>items.map((i,n)=><div key={i.id} data-regroup-item={i.id} style={{position:'absolute',left:i.rect.x,top:i.rect.y,width:i.rect.width,height:i.rect.height,opacity:values[n].opacity,translate:`${values[n].translateX||0}px ${values[n].translateY||0}px`}}>{i.content}</div>);
 return <div data-regroup-page="persistent" style={{position:'absolute',left:p.pageRect.x,top:p.pageRect.y,width:p.pageRect.width,height:p.pageRect.height,opacity:state.page.opacity}}>
  {p.pageContent}
  <div data-regroup-state="old">{render(p.oldRows,state.oldRows)}</div>
  <div data-regroup-state="new">{render(p.newGroups,state.newGroups)}</div>
 </div>;
};

export const ReferenceDocumentRegroup:React.FC<DocumentRegroupProps>=(p)=>documentRegroupFrame(p,useCurrentFrame());

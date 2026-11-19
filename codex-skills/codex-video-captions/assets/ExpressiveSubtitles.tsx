import React,{useEffect,useRef,useState} from 'react';import {spring,useVideoConfig,delayRender,continueRender,cancelRender} from 'remotion';
const ease=(v:number)=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
type Block={text:string;at:number;sourceAnchor:number;x:number;y:number;size:number;effect:string;width:number;timingMode?:string;entry?:'glide'|'wipe'|'steady';fontStyle?:'normal'|'italic';tokens?:{text:string;at:number;accent?:boolean}[]};
export type DesignedCue={id:string;start:number;end:number;reason:string;kind:string;blocks:Block[]};
function blockFontStyle(block:Block):'normal'|'italic' {
 return block.fontStyle ?? (block.size>=90&&block.effect!=='pressure'?'italic':'normal');
}
function Fragment({b,t}:{b:Block;t:number}){
 const {fps}=useVideoConfig(),age=t-b.at,show=ease(age/(b.entry==='wipe'?.34:.22)),h=Math.max(0,age),hero=b.size>=90;
 const p=spring({frame:h*fps,fps,config:{damping:18,stiffness:220,mass:.8}});
 let y=(b.entry==='steady'?0:12)*(1-show),x=0,scale=1,rotate=0;
 if(b.effect==='spring'){y=48*(1-p);scale=.82+.18*p;}
 if(b.effect==='pressure'){scale=.86+.14*p;y=24*(1-p);x=Math.sin(h*24)*Math.exp(-h*8)*7;}
 if(b.effect==='curious'){rotate=-5*(1-ease(h/1.2))+Math.sin(h*16)*Math.exp(-h*5)*4;y=24*(1-p);}
 if(b.effect==='flow'){x=-30*(1-show);y=6*(1-show);}
 const style:React.CSSProperties={position:'absolute',left:b.x,top:b.y,width:b.width,whiteSpace:'nowrap',fontSize:b.size,lineHeight:1.08,letterSpacing:hero?-2:-.3,fontWeight:hero?850:b.size>=60?650:500,fontStyle:blockFontStyle(b),color:'var(--caption-text)',opacity:b.tokens?1:show,clipPath:b.entry==='wipe'?`inset(-24px ${(1-show)*100}% -24px -26px)`:undefined,transform:`translate(${x}px,${y}px) rotate(${rotate}deg) scale(${scale})`,transformOrigin:'15% 70%',WebkitTextStroke:'0px',textShadow:'0 3px 13px rgba(8,16,24,0.32)'};
 return <div style={style}>{b.tokens?b.tokens.map((token,i)=><React.Fragment key={i}>{i>0?' ':null}<span style={{opacity:t-token.at<-1e-7?0:.78+.22*ease((t-token.at)/.16),display:'inline-block',color:token.accent?'var(--caption-accent,var(--caption-text))':undefined,transform:`translateY(${(token.accent?12:5)*(1-ease((t-token.at)/.20))}px)`}}>{token.text}</span></React.Fragment>):b.text}
  {!b.tokens&&b.effect==='shine'&&age>=0&&age<.8&&<span aria-hidden style={{position:'absolute',inset:0,color:'var(--material-highlight)',filter:'drop-shadow(0 0 12px var(--material-highlight))',clipPath:`polygon(${-35+h*230}% 0,${-20+h*230}% 0,${-39+h*230}% 100%,${-54+h*230}% 100%)`}}>{b.text}</span>}
  {b.effect==='curious'&&hero&&age>=0&&<svg width="60" height="65" viewBox="0 0 64 64" style={{position:'absolute',left:Math.min(b.width-60,b.text.length*b.size*.53),top:-35,opacity:b.tokens?1:show,clipPath:b.entry==='wipe'?`inset(-24px ${(1-show)*100}% -24px -26px)`:undefined,transform:`rotate(${8*Math.sin(h*3)}deg)`}}><path d="M20 21 C20 2 51 6 47 23 C46 31 33 30 33 41" stroke="var(--material-highlight)" strokeWidth="4" fill="none"/><circle cx="33" cy="52" r="3" fill="var(--material-highlight)"/></svg>}
  {b.effect==='spring'&&hero&&age>.02&&age<.65&&<svg width="240" height="180" style={{position:'absolute',left:b.width*.45,top:-60,pointerEvents:'none'}}>{Array.from({length:7},(_,i)=>{const q=ease(h/.65),a=i*2.39996;return <path key={i} d={`M${120+Math.cos(a)*q*100} ${90+Math.sin(a)*q*65} l${Math.cos(a)*10} ${Math.sin(a)*10}`} stroke="var(--material-highlight)" strokeWidth="3" opacity={1-q}/>})}</svg>}
 </div>;
}
export function ExpressiveSubtitles({cue,t}:{cue:DesignedCue;t:number;top?:number;choice?:unknown}){
 return <div style={{position:'absolute',inset:0,opacity:1,pointerEvents:'none'}}>{cue.blocks.map((b,i)=><Fragment key={`${cue.id}-${i}`} b={b} t={t}/>)}</div>;
}
export function SubtitleFontAudit({cues,safeMargin}:{cues:DesignedCue[];safeMargin:number}){
 const ref=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Measure all subtitle phrases in actual registered fonts'));
 useEffect(()=>{let live=true;document.fonts.ready.then(()=>{if(!live)return;const rows=Array.from(ref.current?.querySelectorAll<HTMLElement>('[data-subwidth]')??[]).map(el=>({cue:el.dataset.cue,text:el.textContent,width:el.getBoundingClientRect().width,limit:Number(el.dataset.limit)}));const bad=rows.filter(r=>r.width>r.limit+.5);if(bad.length){cancelRender(new Error('Subtitle phrase exceeds safe width: '+JSON.stringify(bad)));return;}const behind=Array.from(document.querySelectorAll<HTMLElement>('[data-behind-max]')).map(el=>({id:el.dataset.behindMax,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,width:el.getBoundingClientRect().width,safeLeft:Number(el.dataset.safeMargin),safeRight:1080-Number(el.dataset.safeMargin)}));if(behind.some(r=>r.left<r.safeLeft||r.right>r.safeRight)){cancelRender(new Error('Behind transformed safe margin failed: '+JSON.stringify(behind)));return;}console.log('BEHIND_MAX_BOUNDS '+JSON.stringify(behind));console.log('SUBTITLE_FONT_WIDTHS '+JSON.stringify(rows));continueRender(handle);}).catch(cancelRender);return()=>{live=false;};},[handle,cues]);
 return <div ref={ref} style={{position:'absolute',left:0,top:-9999,whiteSpace:'nowrap',visibility:'hidden'}}>{cues.flatMap(c=>c.blocks.map((b,i)=><span key={`${c.id}-${i}`} data-subwidth="true" data-cue={c.id} data-limit={Math.min(b.width,1080-b.x-safeMargin)} style={{display:'block',width:'max-content',fontSize:b.size,fontWeight:b.size>=90?850:b.size>=60?650:500,fontStyle:blockFontStyle(b),letterSpacing:b.size>=90?-2:-.3}}>{b.text}</span>))}</div>;
}

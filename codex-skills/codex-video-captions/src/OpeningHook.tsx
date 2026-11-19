import React from 'react';
const e=(v:number)=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
export function OpeningHook({t:sourceTime,config:c}:{t:number;config:any}){
 const t=sourceTime-c.start;
 if(t<0||t>=c.end-c.start)return null;
 const first=1-e((t-c.questionFadeAt)/.4),second=e((t-c.benefitAt)/.25),focus=e((t-c.focusAt)/.55),shine=e((t-c.impactAt)/.55);
 const type={position:'absolute',left:80,width:920,fontWeight:850,fontStyle:'italic',lineHeight:1.08,color:'var(--caption-text)',letterSpacing:-2,textShadow:'0 3px 0 var(--material-shade),0 7px 18px var(--caption-shadow)'} as React.CSSProperties;
 return <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 48%,transparent 58%,var(--caption-shadow) 83%,var(--caption-shadow) 100%)'}}/>
  <div style={{...type,top:1270,fontSize:128,opacity:e(t/.13)*first,transform:`translateY(${20*(1-e(t/.2))}px)`}}>{c.question}</div>
  <div style={{...type,top:1190,fontSize:56,fontStyle:'normal',fontWeight:600,opacity:second}}>{c.lead}</div>
  <div style={{...type,top:1290,fontSize:114,opacity:second}}>{c.main}</div>
  <div style={{...type,top:1440,fontSize:65,fontStyle:'normal',fontWeight:500,opacity:second}}>{c.tail}</div>
  {t>=c.impactAt&&<div style={{...type,top:1290,fontSize:114,color:'var(--caption-accent)',opacity:second,filter:'drop-shadow(0 0 12px var(--caption-glow))',clipPath:`polygon(${-30+shine*170}% 0,${-15+shine*170}% 0,${-33+shine*170}% 100%,${-48+shine*170}% 100%)`}}>{c.main}</div>}
  <svg width="1080" height="1920" style={{position:'absolute'}}>
   <defs><linearGradient id="hookMetal"><stop stopColor="var(--material-highlight)"/><stop offset=".4" stopColor="var(--material-mid)"/><stop offset=".7" stopColor="var(--material-shade)"/><stop offset="1" stopColor="var(--depth-light)"/></linearGradient><radialGradient id="hookGlass"><stop stopColor="var(--material-mid)"/><stop offset=".6" stopColor="var(--depth-mid)"/><stop offset="1" stopColor="var(--depth-dark)"/></radialGradient></defs>
   <g transform={`translate(${35*(1-e(t/.35))} ${65*(1-e(t/.35))}) rotate(${-12*(1-focus)} 875 1600)`} opacity={e(t/.2)}>
    <rect x="770" y="1510" width="210" height="145" rx="27" fill="var(--material-shade)"/><rect x="758" y="1498" width="210" height="145" rx="27" fill="url(#hookMetal)" stroke="var(--material-highlight)" strokeWidth="3"/>
    <circle cx="864" cy="1570" r="77" fill="var(--depth-dark)" stroke="var(--material-highlight)" strokeWidth="5"/><circle cx="855" cy="1563" r="61" fill="url(#hookGlass)"/>
    {Array.from({length:6},(_,i)=><path key={i} d="M0 -45 L36 -16 L22 25 L0 13 Z" fill="var(--material-mid)" fillOpacity=".3" transform={`translate(855 1563) rotate(${i*60+focus*38}) scale(${1-.23*focus})`}/>)}
    <ellipse cx="834" cy="1542" rx="17" ry="10" fill="var(--material-highlight)" opacity=".7"/>
    {[0,1].map(i=><circle key={i} cx="855" cy="1563" r={90+25*i+15*(1-focus)} fill="none" stroke="var(--material-highlight)" strokeWidth="2" opacity={.35*(1-i*.3)}/>)}
   </g>
  </svg>
  <div style={{position:'absolute',left:80,top:1640,display:'flex',gap:22,opacity:e((t-c.stepsAt)/.25)}}>{c.steps.map((x:string,i:number)=><div key={x} style={{width:135,height:76,borderRadius:18,border:'1px solid var(--material-highlight)',background:i===0?'var(--material-highlight)':'var(--caption-icon-surface)',boxShadow:i===0?'0 10px 25px var(--caption-shadow)':undefined,color:i===0?'var(--scene-text)':'var(--caption-text)',fontSize:45,fontWeight:700,textAlign:'center',paddingTop:8,transform:i===0?`translateY(${-8*e((t-c.impactAt)/.35)}px)`:undefined}}>{x}</div>)}</div>
 </div>;
}

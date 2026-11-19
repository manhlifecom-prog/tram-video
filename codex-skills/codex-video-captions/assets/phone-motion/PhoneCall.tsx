import React from 'react';
const e=(x:number)=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
export function PhoneCall({t,plan}:{t:number;plan:any}){
 const p=plan.phoneMotion,c=plan.profile.phonePalette;if(!p||!c||!p.frame||p.frame.width!==370||p.frame.height!==650||!p.appLabel||!p.contactLabel||!p.connectingLabel||!p.conversationLabel||!p.idleLabel||!plan.phoneVoiceEnvelope?.length)throw Error('Explicit phone story/palette/actual voice envelope required');if(t<p.sourceStart||t>=p.sourceEnd)return null;
 const entry=e((t-p.sourceStart)/.65),connect=e((t-p.connect)/.45),exit=e((t-p.exit)/(p.sourceEnd-p.exit));
 const output=plan.segments.find((s:any)=>t>=s.sourceStart&&t<s.sourceEnd),out=output.outputStart+t-output.sourceStart;
 const points=plan.phoneVoiceEnvelope??[],sample=points.length?points[Math.min(points.length-1,Math.max(0,Math.round((out-points[0].outputTime)/.04)))]:null,rms=sample?.normalizedRms??0;
 const ringing=t>=p.ring&&t<p.connect,talking=t>=p.connect;const palette=Object.fromEntries(Object.entries(c).map(([key,value])=>['--phone-'+key,value])) as React.CSSProperties;
 return <div style={{...palette,position:'absolute',left:p.frame.left,top:p.frame.top,width:p.frame.width,height:p.frame.height,perspective:1100,pointerEvents:'none',opacity:entry*(1-exit)}}>
  <div style={{position:'absolute',inset:0,borderRadius:55,background:'linear-gradient(100deg,var(--phone-frameDark),var(--phone-frameMid) 8%,var(--phone-frameLight) 50%,var(--phone-frameEdge) 92%)',padding:12,boxShadow:'15px 12px 0 var(--phone-frameSide),22px 34px 65px var(--phone-shadow)',transform:`translateY(${150*(1-entry)-60*exit}px) rotateY(${-38*(1-entry)+7*(1-connect)}deg) rotateZ(${-8*(1-entry)+2*(1-connect)}deg) scale(${.6+.4*entry-.12*exit})`,transformStyle:'preserve-3d',transformOrigin:'50% 75%'}}>
   <div style={{position:'absolute',left:-5,top:140,width:5,height:90,borderRadius:4,background:'var(--phone-buttonEdge)'}}/>
   <div style={{height:'100%',borderRadius:45,overflow:'hidden',background:'linear-gradient(160deg,var(--phone-screenLight),var(--phone-screenMid))',border:'2px solid var(--phone-screenBorder)',position:'relative',color:'var(--phone-text)'}}>
    <div style={{position:'absolute',top:16,left:'50%',transform:'translateX(-50%)',width:102,height:23,borderRadius:20,background:'var(--phone-notch)'}}/>
    <div style={{position:'absolute',top:67,left:25,right:25,fontSize:23,fontWeight:600,letterSpacing:.4,opacity:e((t-p.initiate)/.1)}}>{p.appLabel}</div>
    <div style={{position:'absolute',top:130,left:20,right:20,textAlign:'center',fontSize:35,fontWeight:800,opacity:e((t-p.connect)/.12)}}>{p.contactLabel}</div>
    <div style={{position:'absolute',top:190,left:20,right:20,textAlign:'center',fontSize:18,fontWeight:500}}>{talking?p.conversationLabel:t>=p.initiate?p.connectingLabel:p.idleLabel}</div>
    <svg width="346" height="270" style={{position:'absolute',left:0,top:230}}>
     <defs><radialGradient id="callGlow"><stop stopColor="var(--phone-glow)" stopOpacity=".65"/><stop offset="1" stopColor="var(--phone-glow)" stopOpacity="0"/></radialGradient></defs>
     <circle cx="173" cy="125" r={80+25*rms} fill="url(#callGlow)"/>
     {ringing&&[0,1,2].map(i=>{const q=((t-p.ring)*1.5+i*.33)%1;return <circle key={i} cx="173" cy="125" r={35+q*95} fill="none" stroke="var(--phone-ring)" strokeWidth="3" opacity={(1-q)*.8}/>})}
     {Array.from({length:11},(_,i)=>{const h=talking?16+rms*145*(.4+.6*Math.abs(Math.sin(i*1.3+t*2))):8+8*Math.sin((t-p.initiate)*8+i);return <rect key={i} x={82+i*17} y={125-h/2} width="9" height={h} rx="4.5" fill={talking?'var(--phone-active)':'var(--phone-inactive)'} opacity={t>=p.initiate?1:.35}/>})}
     {talking&&<path d="M140 233 L162 253 L207 209" fill="none" stroke="var(--phone-active)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity={connect*(1-e((t-p.connect-.65)/.2))}/>}
    </svg>
    {t>=p.reply&&<div style={{position:'absolute',top:420,right:25,width:120,height:53,borderRadius:'25px 25px 5px 25px',background:'var(--phone-reply)',display:'flex',alignItems:'center',justifyContent:'center',gap:10,boxShadow:'0 8px 18px var(--phone-replyShadow)',opacity:e((t-p.reply)/.15),transform:`translateY(${24*(1-e((t-p.reply)/.3))}px)`}}>{[0,1,2].map(i=><div key={i} style={{width:9,height:9,borderRadius:10,background:'var(--phone-replyInk)',transform:`translateY(${-6*Math.max(0,Math.sin((t-p.reply)*8-i))}px)`}}/>)}</div>}
    <div style={{position:'absolute',bottom:47,left:35,right:35,display:'flex',justifyContent:'space-between'}}>{['mic','video','end'].map((v,i)=><div key={v} style={{position:'relative',width:66,height:66,borderRadius:38,background:i===2?'var(--phone-endButton)':'var(--phone-buttonSurface)',boxShadow:'0 5px 15px var(--phone-buttonShadow)',border:'1px solid var(--phone-buttonBorder)',transform:i===2&&t>=p.initiate&&t<p.initiate+.3?`scale(${1-.12*Math.sin((t-p.initiate)/.3*Math.PI)})`:undefined}}><svg width="66" height="66"><path d={i===0?'M28 23 Q28 15 33 15 Q38 15 38 23 V35 Q38 42 33 42 Q28 42 28 35 Z M22 33 Q22 49 33 49 Q44 49 44 33 M33 49 V55':i===1?'M18 22 H39 V43 H18 Z M39 27 L50 21 V45 L39 38 Z':'M18 36 Q33 21 48 36'} fill="none" stroke={i===2?'white':'var(--phone-buttonInk)'} strokeWidth="3" strokeLinecap="round"/></svg></div>)}</div>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(115deg,transparent 20%,var(--phone-glassLight) 35%,transparent 50%)',transform:`translateX(${-100+connect*180}%)`}}/>
   </div>
  </div>
 </div>;
}

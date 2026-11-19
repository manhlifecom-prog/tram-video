import React from 'react';
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
export function MotionLayer({t,events}:{t:number;events:any[]}){
 const ev=events.find(e=>t>=e.start&&t<e.end);if(!ev)return null;
 const a=t-ev.start,q=clamp((t-ev.start)/.7)*clamp((ev.end-t)/.7),impact=clamp((t-ev.contact)/.65);
 return <svg width="1080" height="1920" style={{position:'absolute',pointerEvents:'none',opacity:q}}>
  <defs><linearGradient id="maxLight"><stop stopColor="var(--material-highlight)" stopOpacity="0"/><stop offset=".5" stopColor="var(--material-highlight)"/><stop offset="1" stopColor="var(--material-highlight)" stopOpacity="0"/></linearGradient><filter id="maxGlow"><feGaussianBlur stdDeviation="4"/></filter></defs>
  {ev.kind==='pressure'&&<g fill="none" stroke="var(--material-highlight)">
   {[0,1,2].map(i=><g key={i} opacity={.7-i*.13} transform={`translate(${Math.sin(a*9+i)*4},0)`}><path d={`M${50+i*25} 470 V${1150-i*65} L${140+i*25} ${1240-i*65}`} strokeWidth={5-i}/><path d={`M${1030-i*25} 470 V${1150-i*65} L${940-i*25} ${1240-i*65}`} strokeWidth={5-i}/></g>)}
   <path d="M115 1320 Q540 1230 965 1320" strokeWidth="2" strokeDasharray="10 14"/>
  </g>}
  {(ev.kind==='open'||ev.kind==='growth')&&<g>
   {[0,1,2,3,4].map(i=>{const phase=(a*.24+i*.19)%1;return <g key={i} opacity={(1-phase)*.7} transform={`translate(${120+i*215} ${1740-phase*600}) rotate(-24)`}><rect x="-3" y="-70" width={i%2?3:6} height="140" rx="3" fill="url(#maxLight)"/><circle r="4" fill="var(--material-highlight)"/></g>})}
   <path d={`M75 ${1610-40*impact} Q540 ${1640-180*impact} 1005 ${1610-40*impact}`} fill="none" stroke="url(#maxLight)" strokeWidth="6"/>
   <path d={`M100 ${1640-40*impact} Q540 ${1670-180*impact} 980 ${1640-40*impact}`} fill="none" stroke="var(--material-mid)" strokeOpacity=".6" strokeWidth="2"/>
  </g>}
  {ev.kind==='connect'&&<g fill="none" stroke="var(--material-highlight)">{[0,1,2].map(i=>{const r=45+((a*.3+i*.32)%1)*170;return <ellipse key={i} cx="850" cy="1360" rx={r*.75} ry={r} opacity={(1-(r-45)/170)*.55} strokeWidth="7"/>})}<path d="M300 1460 Q550 1330 850 1260" strokeWidth="3" strokeDasharray="5 15" strokeDashoffset={-a*28}/></g>}
  {ev.kind==='focus'&&<g fill="none" stroke="var(--material-highlight)" opacity={.85}><path d="M75 540 H270 M75 540 V720 M1005 540 H810 M1005 540 V720 M75 1340 V1160 M75 1340 H270 M1005 1340 V1160 M1005 1340 H810" strokeWidth={4+2*impact}/><rect x="390" y="1290" width="300" height="8" rx="4" fill="var(--material-highlight)" opacity=".3"/><rect x="390" y="1290" width={300*impact} height="8" rx="4" fill="var(--material-highlight)"/></g>}
  {ev.finiteBurst===true&&<g fill="var(--material-highlight)">{Array.from({length:22},(_,i)=>{const p=clamp((t-ev.contact)/1.2),angle=i*2.39996;return <g key={i} opacity={p*(1-p)*3} transform={`translate(${540+Math.cos(angle)*p*650} ${1500+Math.sin(angle)*p*380-120*p}) rotate(${i*24+p*60})`}><rect x="-5" y="-16" width="10" height="32" rx="3"/></g>})}</g>}
  {ev.kind==='scatter'&&<g fill="var(--material-highlight)">{Array.from({length:15},(_,i)=>{const p=clamp((t-ev.contact)/.8);return <g key={i} opacity={p*(1-p)*2.5} transform={`translate(${540+Math.cos(i*2.4)*p*750} ${1340+Math.sin(i*2.4)*p*350}) rotate(${i*29+p*90})`}><rect x="-4" y="-15" width="8" height="30" rx="3"/></g>})}</g>}
 </svg>;
}

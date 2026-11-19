import React from 'react';
import {spring,useVideoConfig} from 'remotion';
import {ease} from './Film';
export type SceneType={id:string;start:number;end:number;kind:string;readingOwner:string;overSource?:boolean;presenter?:{x:number;y:number;w:number;h:number};labels:{text:string;at:number;x:number;y:number;size:number;align?:'center'|'left';italic?:boolean;color?:string;width?:number}[];actions:Record<string,number>;data?:Record<string,any>;reason:string};
const enter=(t:number,a:number,d=.45)=>ease((t-a)/d);
function Label({label,t,colors}:{label:SceneType['labels'][0];t:number;colors:any}){
 const {fps}=useVideoConfig(),a=t-label.at,p=spring({frame:Math.max(0,a*fps),fps,config:{damping:22,stiffness:240,mass:.8}});
 return <div style={{position:'absolute',left:label.x,top:label.y,width:label.width??Math.max(180,1080-label.x-60),textAlign:label.align??'left',whiteSpace:'pre-line',fontSize:label.size,fontWeight:label.size>=82?850:600,fontStyle:label.italic?'italic':undefined,lineHeight:1.15,letterSpacing:label.size>=100?-2:-.5,color:label.color??colors.sceneText,textShadow:label.color==='white'?(label.size>=100?'0 3px 0 var(--material-mid),0 6px 0 var(--material-shade),0 10px 0 var(--material-shade),0 24px 28px var(--caption-shadow)':'0 3px 17px var(--caption-shadow)'):undefined,opacity:enter(t,label.at,.13),transform:`perspective(900px) translateY(${(label.size>=100?65:18)*(1-p)}px) rotateX(${(label.size>=100?35:0)*(1-p)}deg) scale(${label.size>=100?.88+.12*p:1})`}}>{label.text}</div>;
}
export function Artwork({scene,t,colors}:{scene:SceneType;t:number;colors:any}){
 const a=scene.actions;
 return <>
  <svg width="1080" height="1920" style={{position:'absolute',pointerEvents:'none'}}>
   <defs><linearGradient id="paper" x2="1" y2="1"><stop stopColor="var(--material-highlight)"/><stop offset="1" stopColor="var(--material-highlight)"/></linearGradient><linearGradient id="metal" x2="1" y2="1"><stop stopColor="var(--material-highlight)"/><stop offset=".5" stopColor="var(--material-highlight)"/><stop offset="1" stopColor="var(--material-shade)"/></linearGradient><filter id="depth" x="-40%" y="-30%" width="180%" height="190%"><feDropShadow dx="0" dy="20" stdDeviation="20" floodColor="var(--depth-dark)" floodOpacity=".18"/></filter></defs>
   {scene.kind==='progress'&&<g>
    {(scene.data?.steps??[]).map((s:any,i:number)=>{const q=enter(t,s.at,.3),x=140+i*195,y=1650-i*40;return <g key={i} opacity={q}><path d={`M${x} ${y} l45 -24 v${-80-i*35} l-45 24 Z`} fill="var(--material-shade)"/><path d={`M${x} ${y} l-40 -22 v${-80-i*35} l40 22 Z`} fill="var(--material-mid)"/><path d={`M${x-40} ${y-102-i*35} l45 -24 l40 22 l-45 24 Z`} fill="var(--material-highlight)"/><text x={x} y={y+55} textAnchor="middle" fill="white" fontSize="43" fontWeight="700">{s.label}</text></g>})}
    {(()=>{const steps=(scene.data?.steps??[]).filter((s:any)=>t>=s.at),active=steps.at(-1);return active?<text x="540" y="1390" textAnchor="middle" fill="white" fontSize="205" fontWeight="850" fontStyle="italic" style={{filter:'drop-shadow(0 6px 0 var(--material-shade)) drop-shadow(0 16px 20px var(--caption-shadow))'}}>{active.label}</text>:null})()}
   </g>}
   {scene.kind==='phone'&&!scene.data?.v3Illustration&&<g opacity={enter(t,a.phone)} filter="url(#depth)" transform={`translate(${-475+60*(1-enter(t,a.connect,.65))},${-540+140*(1-enter(t,a.phone,.6))}) scale(1.5) rotate(${-8*(1-enter(t,a.connect,.6))} 870 1285)`}>
    <rect x="748" y="1093" width="280" height="410" rx="38" fill="var(--depth-dark)"/>
    <path d="M1008 1135 V1420" stroke="var(--material-highlight)" strokeWidth="8" opacity=".8"/>
    <rect x="730" y="1080" width="280" height="410" rx="38" fill="url(#metal)" stroke="var(--material-shade)" strokeWidth="2"/>
    <rect x="740" y="1090" width="260" height="390" rx="32" fill="url(#paper)"/>
    <rect x="825" y="1105" width="90" height="12" rx="6" fill="var(--depth-dark)"/>
    <circle cx="870" cy="1200" r={42+6*Math.sin((t-a.connect)*4)} fill="none" stroke={colors.line} strokeWidth="2" opacity={enter(t,a.connect)*.45}/>
    <circle cx="870" cy="1200" r="32" fill="var(--material-mid)"/><path d="M755 1100 L965 1470" stroke="white" strokeWidth="50" opacity=".18"/>
    {[0,1,2,3,4].map(i=><rect key={i} x={845+i*11} y={1200-(8+12*(.5+.5*Math.sin(t*5+i)))} width="6" height={16+24*(.5+.5*Math.sin(t*5+i))} rx="3" fill={colors.sceneText} opacity={enter(t,a.connect)}/>)}
    <text x="870" y="1310" textAnchor="middle" fontFamily="CaptionKit" fill={colors.sceneText} fontSize="29" fontWeight="700" opacity={enter(t,a.friend)}>{scene.data?.contactLabel}</text>
    <text x="870" y="1354" textAnchor="middle" fontFamily="CaptionKit" fill={colors.line} fontSize="19" opacity={enter(t,a.connect)}>{scene.data?.statusLabel}</text>
    <circle cx="870" cy="1420" r="23" fill="var(--material-shade)"/><path d="M859 1423 Q870 1410 881 1423" stroke="white" strokeWidth="4" fill="none"/>
   </g>}
   {scene.kind==='camera'&&<g opacity={enter(t,a.camera)}>
    <defs><linearGradient id="cameraMetal"><stop stopColor="var(--material-highlight)"/><stop offset=".35" stopColor="var(--material-mid)"/><stop offset=".7" stopColor="var(--material-shade)"/><stop offset="1" stopColor="var(--material-highlight)"/></linearGradient></defs>
    <g transform={`rotate(${-16*(1-enter(t,a.stable,.65))} 810 1330)`}>
     <path d="M760 1370 L160 1350 L160 1530 Z" fill="var(--material-highlight)" fillOpacity=".12" stroke="var(--material-highlight)" strokeWidth="3" strokeDasharray="14 12"/>
     <g opacity={scene.data?.v3Illustration?0:1}><rect x="652" y="1254" width="330" height="210" rx="32" fill="var(--depth-dark)"/>
     <rect x="635" y="1235" width="330" height="210" rx="32" fill="url(#cameraMetal)" stroke="var(--material-highlight)" strokeWidth="3"/>
     <path d="M690 1235 L718 1195 H850 L878 1235" fill="var(--material-mid)" stroke="white" strokeWidth="2"/>
     <ellipse cx="792" cy="1340" rx="84" ry="88" fill="var(--depth-dark)" stroke="var(--material-highlight)" strokeWidth="6"/>
     <ellipse cx="782" cy="1330" rx="65" ry="69" fill="var(--material-mid)" stroke="var(--depth-dark)" strokeWidth="5"/>
     <ellipse cx="775" cy="1325" rx="40" ry="44" fill="var(--depth-dark)"/><ellipse cx="760" cy="1305" rx="15" ry="19" fill="var(--material-highlight)" opacity=".7"/>
     <rect x="900" y="1254" width="32" height="17" rx="5" fill="white"/></g>
    </g>
    <g opacity={enter(t,a.stable)}><path d="M140 790 V730 H220 M860 730 H940 V790 M140 1130 V1190 H220 M860 1190 H940 V1130" fill="none" stroke="white" strokeWidth="6"/><rect x="175" y="1250" width="310" height="62" rx="31" fill="var(--material-highlight)"/><path d="M205 1281 H455 M330 1262 V1300" stroke="var(--depth-dark)" strokeWidth="3"/><circle cx="330" cy="1281" r="8" fill="var(--depth-dark)"/></g>
   </g>}
   {scene.kind==='flying-words'&&<g>{(scene.data?.words??[]).map((word:any,i:number)=>{const q=enter(t,a.fly,.85),x=[70,620,140][i]+q*(i-1)*760,y=[1420,1390,1580][i]-q*(180+i*110);return <g key={i} transform={`translate(${x},${y}) rotate(${q*(i-1)*38}) scale(${1+q*.45})`} opacity={enter(t,word.at,.12)*(1-q*.75)}><text x="5" y="9" fill="var(--material-shade)" fontFamily="CaptionKit" fontWeight="850" fontSize="108">{word.text}</text><text fill="white" fontFamily="CaptionKit" fontWeight="850" fontSize="108" style={{filter:'drop-shadow(0 10px 12px var(--caption-shadow))'}}>{word.text}</text></g>})}</g>}
   {scene.kind==='notebook'&&<g opacity={enter(t,a.paper)}>
    <rect x="170" y="650" width="740" height="580" rx="25" fill={colors.surface} stroke={colors.line} strokeWidth="2"/>
    {(scene.data?.items??[]).map((s:any,i:number)=><g key={i} transform={`translate(245 ${780+i*150})`} opacity={enter(t,s.at)}><circle cx="0" cy="-7" r="8" fill={colors.line}/><path d="M40 -8 H550" stroke={colors.line} strokeWidth="7" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-enter(t,s.at,.65)}/></g>)}
   </g>}
   {scene.kind==='release'&&<g opacity={enter(t,a.release)}>{Array.from({length:9},(_,i)=>{const q=enter(t,a.release,.7),ang=i*2.39996,r=30+110*q;return <circle key={i} cx={540+Math.cos(ang)*r} cy={930+Math.sin(ang)*r*.5} r={3} fill={colors.line} opacity={1-enter(t,a.release+.3,.5)}/>})}</g>}
  </svg>
  {scene.labels.map((label,i)=><Label key={i} label={label} t={t} colors={colors}/>)}
 </>;
}

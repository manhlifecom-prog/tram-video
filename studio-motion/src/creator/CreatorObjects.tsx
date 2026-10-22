import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = {extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;

/** Editorial objects used by the Creator Notes template, driven by the scene's words. */
export function CreatorObjects({mode,items}:{mode:string;items:string[]}) {
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
 const s=width/1080,t=frame/fps;
 const enter=(delay=0)=>interpolate(t,[delay,delay+.65],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
 if(mode==='journal') return <div style={{position:'absolute',left:width*.14,top:height*.35,width:width*.72,height:height*.39,perspective:1300*s,opacity:enter(.15),translate:`0 ${(1-enter(.15))*100*s}px`,rotate:'-5deg'}}>
  <div style={{position:'absolute',inset:0,background:'#3B261E',borderRadius:28*s,translate:`${12*s}px ${18*s}px`,boxShadow:`0 ${30*s}px ${70*s}px #0008`}}/>
  <div style={{position:'absolute',inset:0,padding:`${60*s}px ${65*s}px`,borderRadius:22*s,background:'linear-gradient(100deg,#F5EBD7,#F5EBD7 8%,#F5EBD7 94%,#D6C4A3)',color:'#14263D',border:`${3*s}px solid #fff7`,transform:'rotateY(-5deg)'}}>
   <div style={{fontSize:29*s,fontWeight:800,letterSpacing:6*s,color:'#6A4936'}}>GHI CHÉP TỪ CUỘC TRÒ CHUYỆN</div>
   <div style={{height:4*s,background:'#D6C4A3',marginTop:25*s}}/>
   <div style={{fontSize:72*s,lineHeight:1.2,fontWeight:900,letterSpacing:-2*s,marginTop:60*s,opacity:enter(.3)}}>{items[1] || 'Từ trải nghiệm'}<br/><span style={{position:'relative',display:'inline-block',zIndex:0}}><span style={{position:'absolute',left:-7*s,right:-7*s,bottom:3*s,height:'42%',background:'#D6C4A3',zIndex:-1,scale:`${enter(.8)} 1`,transformOrigin:'left'}}/>{items[2] || 'thành câu chuyện'}</span></div>
   {[0,1,2].map(i=><div key={i} style={{height:3*s,background:'#D6C4A3',marginTop:(i===0?65:38)*s,width:`${92-i*13}%`,scale:`${enter(1+i*.15)} 1`,transformOrigin:'left'}}/>)}
  </div>
  {[0,1,2,3,4].map(i=><div key={i} style={{position:'absolute',left:-18*s,top:(75+i*110)*s,width:42*s,height:18*s,borderRadius:12*s,background:'linear-gradient(#F5EBD7,#3B261E 45%,#D6C4A3)',boxShadow:`0 ${3*s}px ${6*s}px #0006`}}/>)}
 </div>;
 if(mode==='focus') return <div style={{position:'absolute',left:90*s,right:90*s,top:height*.36,height:height*.38}}>
  <svg width="100%" height="100%" viewBox="0 0 900 730" style={{overflow:'visible'}}>
   <defs><linearGradient id="focus-accent" x1="0" x2="1"><stop stopColor="#D6C4A3"/><stop offset="1" stopColor="#6A4936"/></linearGradient><radialGradient id="focus-lens"><stop stopColor="#D6C4A3"/><stop offset=".15" stopColor="#6A4936"/><stop offset=".8" stopColor="#0C1726"/><stop offset="1" stopColor="#B79764"/></radialGradient></defs>
   <g opacity={enter(.15)} style={{transformOrigin:'450px 225px',scale:enter(.15)}}>
    <circle cx="450" cy="225" r="190" fill="#0C1726" stroke="#B7976444" strokeWidth="3"/>
    <circle cx="450" cy="225" r="155" fill="url(#focus-lens)" stroke="#B79764" strokeWidth="12"/>
    <circle cx="450" cy="225" r="122" fill="none" stroke="#D6C4A380" strokeWidth="3" strokeDasharray="3 11"/>
    <circle cx="450" cy="225" r="77" fill="#0C1726" stroke="#D6C4A3" strokeWidth="3"/>
    <path d="M424 225h52M450 199v52" stroke="#F5EBD7" strokeWidth="4"/>
   </g>
   <path d="M450 422v70M210 492h480M210 492v65M690 492v65" fill="none" stroke="#D6C4A3" strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-enter(.55)}/>
   {[210,690].map((x,i)=><g key={x} opacity={enter(.75+i*.2)} style={{translate:`0 ${(1-enter(.75+i*.2))*30}px`}}><rect x={x-190} y="555" width="380" height="115" rx="24" fill={i?'#0C1726':'url(#focus-accent)'} stroke="#D6C4A3" strokeWidth="2"/><text x={x} y="624" fill={i?'#F5EBD7':'#0C1726'} fontFamily="Be Vietnam Pro" fontSize="41" fontWeight="800" textAnchor="middle">{items[i+1] || (i?'Cách kể':'Chủ đề')}</text></g>)}
  </svg>
 </div>;
 return null;
}

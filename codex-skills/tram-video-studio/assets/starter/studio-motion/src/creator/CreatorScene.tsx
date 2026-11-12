import type {CSSProperties} from 'react';
import {Video} from '@remotion/media';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {MotionScene} from '../Graphics';
import {CreatorObjects} from './CreatorObjects';
import {SemanticScene} from './SemanticScene';

const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const accent='#D8B778';
const ease=Easing.bezier(.16,1,.3,1);

function ScreenVideo({src,sourceStart,style}:{src:string;sourceStart:number;style?:CSSProperties}) {
 const {fps}=useVideoConfig();
 return src?<Video src={src} trimBefore={Math.round(sourceStart*fps)} muted premountFor={fps} objectFit="cover" style={{width:'100%',height:'100%',...style}}/>:<div style={{height:'100%',background:'linear-gradient(30deg,#14263D,#6A4936)'}}/>;
}

export function CreatorScene({scene,videoSrc}:{scene:MotionScene;videoSrc:string}) {
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
 const s=width/1080, t=frame/fps;
 const p=(delay=0,duration=.7)=>interpolate(t,[delay,delay+duration],[0,1],{...clamp,easing:ease});
 const mode=scene.items[0] || 'story';
 const isQuestion=mode==='question';
 const isCamera=mode==='camera';
 const live=isQuestion || isCamera;
 const heading=scene.caption.split(/\\n|\n/);
 const title:CSSProperties={position:'absolute',left:86*s,right:80*s,top:height*.14,fontSize:92*s,fontWeight:800,lineHeight:1.04,letterSpacing:-3*s,color:'#F5EBD7',margin:0};
 if(mode==='sentence') return <SemanticScene scene={scene} videoSrc={videoSrc}/>;
 return <section data-scene-layout="creator" style={{position:'absolute',inset:0,overflow:'hidden',color:'#fff',background:live?'transparent':'radial-gradient(ellipse at 32% 0%,#6A4936 0%,#14263D 35%,#0C1726 76%)'}}>
  {!live && <>
   <div style={{position:'absolute',inset:0,opacity:.09,backgroundImage:'linear-gradient(#ffffff66 1px,transparent 1px),linear-gradient(90deg,#ffffff66 1px,transparent 1px)',backgroundSize:`${86*s}px ${86*s}px`,maskImage:'linear-gradient(#000,transparent 75%)'}}/>
   <div style={{position:'absolute',left:-width*.3,top:height*.25,width:width*1.6,height:width*1.6,border:`${2*s}px solid #B797642B`,borderRadius:'50%',scale:1+p(.1)*.05}}/>
   <div style={{position:'absolute',left:width*.1,top:height*.35,width:width*.8,height:width*.8,background:'#B797643B',filter:`blur(${90*s}px)`,borderRadius:'50%'}}/>
  </>}
  {live && <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#0C172650 0%,transparent 32%,#0C172688 61%,#0C1726F5 95%)'}}/>}
  <h1 data-safe-text style={{...title,top:isQuestion?height*.61:title.top,fontSize:isQuestion?94*s:title.fontSize}}>
   {heading.map((line,i)=><div key={i} style={{overflow:'hidden',paddingBottom:10*s}}><span style={{display:'block',color:i===heading.length-1?accent:'#F5EBD7',translate:`0 ${interpolate(t,[i*.13,.65+i*.13],[115,0],{...clamp,easing:ease})}%`,textShadow:isQuestion?'0 4px 20px #0008':'none'}}>{line}</span></div>)}
  </h1>
  {mode==='story' && <>
   <div style={{position:'absolute',left:width*.235,top:height*.315,width:width*.53,height:height*.46,perspective:1400*s,opacity:p(.15),translate:`0 ${(1-p(.15))*130*s}px`,rotate:`${-8+2*p(1)}deg`}}>
    <div style={{position:'absolute',inset:0,borderRadius:56*s,padding:11*s,background:'linear-gradient(110deg,#D6C4A3,#49404b 18%,#D6C4A3 52%,#0C1726 75%,#D6C4A3)',boxShadow:`${25*s}px ${35*s}px ${50*s}px #0009`,transform:`rotateY(${interpolate(t,[0,3],[-17,-6],clamp)}deg)`}}>
     <div style={{position:'relative',height:'100%',overflow:'hidden',borderRadius:46*s,border:`${8*s}px solid #0C1726`,background:'#0C1726'}}>
      <ScreenVideo src={videoSrc} sourceStart={scene.start}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#fff2,transparent 30%,#0008)'}}/>
      <div style={{position:'absolute',top:15*s,left:'32%',right:'32%',height:27*s,background:'#0C1726',borderRadius:30*s}}/>
      <div style={{position:'absolute',left:30*s,bottom:36*s,fontSize:31*s,fontWeight:700}}>Một câu chuyện thật.</div>
      <div style={{position:'absolute',right:25*s,bottom:100*s,width:66*s,height:66*s,borderRadius:'50%',border:`${3*s}px solid #fff9`,display:'grid',placeItems:'center',background:'#0004'}}><svg width={28*s} height={28*s} viewBox="0 0 24 24"><path d="m8 4 13 8-13 8Z" fill="white"/></svg></div>
     </div>
    </div>
   </div>
   {[scene.items[1] || 'Thói quen',scene.items[2] || 'Đời sống'].map((label,i)=><div key={label} style={{position:'absolute',left:(i===0?90:580)*s,top:height*(i===0?.49:.68),padding:`${20*s}px ${25*s}px`,border:`${2*s}px solid #B7976488`,borderRadius:18*s,fontSize:37*s,fontWeight:800,background:i===0?'linear-gradient(100deg,#B79764,#6A4936)':'linear-gradient(100deg,#0C1726,#14263D)',boxShadow:`0 ${14*s}px ${30*s}px #0005`,opacity:p(.55+i*.3),translate:`${(1-p(.55+i*.3))*(i===0?-80:80)*s}px ${Math.sin(t*1.7+i)*6*s}px`,rotate:`${i===0?-5:5}deg`}}>{label}</div>)}
  </>}
  {mode==='goal' && <>
   <div style={{position:'absolute',left:width*.14,top:height*.36,width:width*.69,height:height*.32,opacity:p(.15),translate:`0 ${(1-p(.15))*100*s}px`,rotate:`${-7+p(.2)*3}deg`,perspective:1400*s}}>
    {[2,1,0].map(i=><div key={i} style={{position:'absolute',inset:0,translate:`${i*11*s}px ${i*13*s}px`,borderRadius:30*s,background:i?'#B79764':'linear-gradient(145deg,#F5EBD7,#F5EBD7)',boxShadow:i===2?`0 ${28*s}px ${55*s}px #0008`:undefined,border:`${2*s}px solid #fff8`}}/>)}
    <div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:30*s,color:'#0C1726'}}>
     <div style={{height:'24%',display:'grid',placeItems:'center',background:'linear-gradient(110deg,#B79764,#6A4936)',color:'white',fontSize:43*s,fontWeight:800,letterSpacing:5*s}}>MỖI NGÀY</div>
     <div style={{display:'flex',alignItems:'baseline',justifyContent:'center',gap:25*s,height:'76%'}}>
      <span style={{fontSize:275*s,lineHeight:1.3,fontWeight:900,letterSpacing:-14*s,color:'#3B261E',scale:p(.45),textShadow:`0 ${6*s}px #ffffff`}}>{scene.items[1] || ''}</span>
      <span style={{fontSize:48*s,fontWeight:900,letterSpacing:-1*s}}>VIDEO</span>
     </div>
    </div>
    {[.2,.8].map(x=><div key={x} style={{position:'absolute',left:`${x*100}%`,top:-32*s,width:24*s,height:76*s,borderRadius:12*s,background:'linear-gradient(90deg,#3B261E,#F5EBD7 45%,#92765B)',boxShadow:`0 ${5*s}px ${8*s}px #0006`}}/>)}
   </div>
   <div style={{position:'absolute',left:width*.2,right:width*.2,top:height*.72,textAlign:'center',fontSize:30*s,letterSpacing:3*s,color:'#E4CCA0',fontWeight:700,opacity:p(.8)}}>MỤC TIÊU TRONG CUỘC TRÒ CHUYỆN</div>
   <div style={{position:'absolute',right:78*s,top:height*.27,width:190*s,height:190*s,overflow:'hidden',borderRadius:'50%',border:`${5*s}px solid #B79764`,boxShadow:`0 ${10*s}px ${25*s}px #0006`,opacity:p(.25),scale:p(.25)}}><ScreenVideo src={videoSrc} sourceStart={scene.start} style={{objectPosition:'center 65%'}}/></div>
  </>}
  {mode==='question' && <div style={{position:'absolute',left:88*s,top:height*.57,display:'flex',alignItems:'center',gap:14*s,fontSize:28*s,fontWeight:800,letterSpacing:4*s,opacity:p(.1)}}><span style={{height:10*s,width:10*s,borderRadius:'50%',background:accent,boxShadow:`0 0 ${22*s}px ${accent}`}}/>{scene.items[1] || 'TỪ KẾ HOẠCH ĐẾN THỰC TẾ'}</div>}
  <CreatorObjects mode={mode} items={scene.items}/>
  {isCamera && <div style={{position:'absolute',left:100*s,right:100*s,top:height*.36,height:height*.37,opacity:p(.15)}}>
   <svg width="100%" height="100%" viewBox="0 0 880 710"><path d="M0 110V0h110M770 0h110v110M880 600v110H770M110 710H0V600" fill="none" stroke="#D6C4A3" strokeWidth="8"/><path d="M440 310v90M395 355h90" stroke="#fff8" strokeWidth="3"/></svg>
   <div style={{position:'absolute',left:28*s,bottom:28*s,padding:`${14*s}px ${22*s}px`,background:'#0C1726BB',borderRadius:10*s,fontSize:33*s,fontWeight:700,color:'#E4CCA0'}}>Ánh sáng tự nhiên · Góc quay thật</div>
  </div>}
 </section>;
}

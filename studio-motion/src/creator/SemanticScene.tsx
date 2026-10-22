import {Video} from '@remotion/media';
import {Easing,interpolate,useCurrentFrame,useVideoConfig,staticFile} from 'remotion';
import type {MotionScene} from '../Graphics';
import {SemanticArt} from './SemanticArt';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const stages=new Set(['day','planning','routine','habit','compass','food-channel','recipe','puzzle','growth','memories','niche','habit-target','seed','overthink','palette','cost','gear','phone','sun']);

export function SemanticScene({scene,videoSrc}:{scene:MotionScene;videoSrc:string}){
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
 const s=width/1080,t=frame/fps,kind=scene.items[1]||'share',stage=stages.has(kind);
 const p=interpolate(t,[0,.26],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
 const lines=scene.caption.split('\n');
 return <section data-semantic-kind={kind} style={{position:'absolute',inset:0,overflow:'hidden',fontFamily:'"Be Vietnam Pro",Arial,sans-serif',color:'#F5EBD7',background:stage?'radial-gradient(ellipse at 25% 5%,#3B261E,#14263D 45%,#0C1726 85%)':'linear-gradient(180deg,#0C1726EA 0%,#14263DD9 38%,#14263D22 62%,#0C172622 100%)'}}>
  <style>{`@font-face{font-family:'Be Vietnam Pro';font-style:normal;font-weight:500;src:url('${staticFile('fonts/BeVietnamPro-Medium.ttf')}')}@font-face{font-family:'Be Vietnam Pro';font-style:normal;font-weight:700 900;src:url('${staticFile('fonts/BeVietnamPro-Bold.ttf')}')}`}</style>
  {stage&&<><div style={{position:'absolute',left:-width*.2,top:height*.16,width:width*1.4,height:width*1.4,border:'2px solid #B7976422',borderRadius:'50%'}}/><div style={{position:'absolute',left:width*.1,top:height*.25,width:width*.8,height:width*.8,background:'#B797642B',filter:`blur(${85*s}px)`,borderRadius:'50%'}}/></>}
  <div style={{position:'absolute',left:90*s,right:stage?90*s:width*.48,top:height*.125,opacity:p,translate:`0 ${(1-p)*22*s}px`}}>
   <div style={{width:50*s,height:5*s,background:'#D8B778',marginBottom:24*s}}/>
   <h1 data-safe-text style={{margin:0,fontSize:(stage?78:62)*s,lineHeight:1.08,fontWeight:800,letterSpacing:-2*s,textShadow:'0 3px 12px #0005'}}>{lines.map((line,i)=><div key={i} style={{color:i===lines.length-1?'#E4CCA0':'#F5EBD7',marginBottom:7*s}}>{line}</div>)}</h1>
  </div>
  <div style={{position:'absolute',left:width*(stage?.09:.43),right:width*(stage?.09:.04),top:height*(stage?.28:.16),height:height*(stage?.39:.29),opacity:p,scale:.93+p*.07,transformOrigin:'50% 65%'}}><SemanticArt kind={kind} t={t}/></div>
  {stage&&videoSrc&&<div style={{position:'absolute',left:width*.1,top:height*.65,width:width*.27,height:height*.19,borderRadius:26*s,overflow:'hidden',border:`${3*s}px solid #B7976488`,boxShadow:'0 20px 40px #0006',rotate:'-3deg'}}>
   <Video src={videoSrc} trimBefore={Math.round(scene.start*fps)} muted premountFor={fps} objectFit="cover" style={{width:'100%',height:'100%',objectPosition:'center 50%'}}/>
   <div style={{position:'absolute',left:12*s,right:12*s,bottom:12*s,background:'#0C1726AA',padding:8*s,textAlign:'center',fontSize:19*s,fontWeight:700,letterSpacing:2*s}}>CUỘC TRÒ CHUYỆN THẬT</div>
  </div>}
 </section>;
}

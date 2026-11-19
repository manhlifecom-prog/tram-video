import React from 'react';
import {AbsoluteFill,Composition,OffthreadVideo,registerRoot,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {type Cue,type TextChoice} from '../assets/EmotionalCaption';
import {EmotionalCaptionProfiled} from '../assets/EmotionalCaptionProfiled';
import demo from '../examples/profile-a-same-input.json';
import demoProfile from '../profiles/demo-a.json';
type Input={schemaVersion:string;id:string;duration:number;fps:number;source:{kind:string;file?:string;provenance:string};timingBasis:{kind:string;note:string;listened:boolean};captionTop:number;cues:(Cue&{choice:TextChoice})[]};
type Profile={id:string;palette:Record<string,string>;typography:{fontId:string;bodyScale:number;keyScale:number;shadowOpacity:number};layout:{captionOffsetY:number;captionLeft:number;captionRight:number;videoFit:'contain'|'cover'}};
type Props={input:Input;profile:Profile};
const fontCss=`@font-face{font-family:CaptionKit;src:url('${staticFile('fonts/BeVietnamPro-Medium.ttf')}');font-weight:400 600;font-style:normal}@font-face{font-family:CaptionKit;src:url('${staticFile('fonts/BeVietnamPro-Bold.ttf')}');font-weight:700 900;font-style:normal}@font-face{font-family:CaptionKit;src:url('${staticFile('fonts/BeVietnamPro-ExtraBoldItalic.ttf')}');font-weight:700 900;font-style:italic}`;
function Geometry({t,profile}:{t:number;profile:Profile}){
 const pulse=Math.max(0,1-Math.abs(t-1.8)/.3)+Math.max(0,1-Math.abs(t-6.1)/.3);
 return <AbsoluteFill style={{background:`radial-gradient(circle at 55% 32%,${profile.palette.surface},${profile.palette.background} 72%)`}}>
  <div style={{position:'absolute',left:100,top:135,fontSize:24,letterSpacing:4,color:profile.palette.muted}}>CAPTION KIT · TECHNICAL PROOF</div>
  <div style={{position:'absolute',left:150,top:390,width:780,height:780,borderRadius:390,border:`1px solid ${profile.palette.muted}40`}}/>
  <div style={{position:'absolute',left:320+Math.sin(t*.8)*65,top:550+Math.cos(t*.8)*30,width:390,height:390,borderRadius:90,transform:`rotate(${t*3}deg) scale(${1+pulse*.025})`,background:`linear-gradient(145deg,${profile.palette.shape},${profile.palette.shapeShade})`,boxShadow:'0 25px 90px #0005'}}/>
  <div style={{position:'absolute',left:125,right:125,top:1710,fontSize:24,lineHeight:1.6,textAlign:'center',color:profile.palette.muted}}>Hình học tự tạo · Không có người thật hoặc giọng nói.<br/>Chỉ kiểm dựng chữ và vòng sửa, không chứng minh căn giọng.</div>
 </AbsoluteFill>;
}
export function CaptionVideo({input,profile}:Props){
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const theme={'--caption-accent':profile.palette.accent,'--caption-soft':profile.palette.soft,'--caption-text':profile.palette.text,'--caption-glow':profile.palette.accent+'4a','--caption-shadow':`rgba(0,0,0,${profile.typography.shadowOpacity})`,'--caption-icon-surface':profile.palette.background,'--caption-left':profile.layout.captionLeft+'px','--caption-right':profile.layout.captionRight+'px'} as React.CSSProperties;
 return <AbsoluteFill style={{...theme,background:profile.palette.background,fontFamily:'CaptionKit,sans-serif'}}> 
  <style>{fontCss}</style>
  {input.source.kind==='video'?<OffthreadVideo src={staticFile(input.source.file!)} style={{width:'100%',height:'100%',objectFit:profile.layout.videoFit}}/>:<Geometry t={t} profile={profile}/>}
  {input.cues.map(cue=>t>=cue.start&&t<cue.end?<EmotionalCaptionProfiled key={cue.start} cue={cue} choice={{...cue.choice,bodySize:(cue.choice.bodySize??54)*profile.typography.bodyScale,keySize:(cue.choice.keySize??78)*profile.typography.keyScale}} t={t} top={input.captionTop+profile.layout.captionOffsetY}/>:null)}
 </AbsoluteFill>;
}
function Root(){return <Composition id="CaptionVideo" component={CaptionVideo} width={1080} height={1920} fps={24} durationInFrames={192} defaultProps={{input:demo as Input,profile:demoProfile as Profile}} calculateMetadata={({props})=>({durationInFrames:Math.round(props.input.duration*props.input.fps),fps:props.input.fps})}/>;}
registerRoot(Root);

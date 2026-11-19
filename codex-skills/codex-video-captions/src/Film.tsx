import React from 'react';
import {AbsoluteFill,Audio,Composition,OffthreadVideo,Sequence,registerRoot,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {OpeningHook} from './OpeningHook';
import {ExpressiveSubtitles,SubtitleFontAudit} from '../assets/ExpressiveSubtitles';
import {SemanticStage,semanticWindow} from './SemanticStage';
import {BehindText,behindAt,BehindMaxWidthProbe} from './BehindText';
import {ArtVignettes} from './ArtVignettes';
import {MotionLayer} from './MotionLayer';
import {EmotionalCaption as EmotionalWordCaption} from '../assets/emotional-caption/EmotionalCaption';
import {WordFontAudit} from '../assets/WordFontAudit';
import {PhoneCall} from '../assets/phone-motion/PhoneCall';
import {Artwork,SceneType} from './Scenes';
import planFile from '../project-plan.json';
export const ease=(n:number)=>{n=Math.max(0,Math.min(1,n));return n*n*(3-2*n)};
type Props={plan:any};
const blend=(a:number,b:number,q:number)=>a+(b-a)*q;
export function Film({plan}:Props){
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),outputT=frame/fps;
 const segment=plan.segments.find((s:any)=>outputT>=s.outputStart&&outputT<s.outputStart+s.sourceEnd-s.sourceStart)??plan.segments.at(-1),t=plan.timelineClock==='source'?segment.sourceStart+outputT-segment.outputStart:outputT;
 if(plan.status==='WAIT_EXACT_SOURCE_ASR_AND_CONTENT_REVIEW')throw Error('Real source-word plan required; no basic/synthetic fallback');
 const behind=behindAt(plan,t);
 const scene=plan.scenes.find((s:any)=>t>=s.start&&t<s.end),w=scene?ease((t-scene.start)/.5)*ease((scene.end-t)/.5):0;
 const target=scene?.presenter??{x:0,y:0,w:1080,h:1920},box={x:blend(0,target.x,w),y:blend(0,target.y,w),w:blend(1080,target.w,w),h:blend(1920,target.h,w)};
 const wordCue=plan.wordCaptions.find((c:any)=>t>=c.start&&t<c.end),summary=plan.subtitles.find((c:any)=>t>=c.start&&t<c.end),cue=wordCue??summary,showCaption=cue&&!(plan.openingHook&&t>=plan.openingHook.start&&t<plan.openingHook.end)&&!behind&&!semanticWindow(plan.semanticStages,t)&&!(scene?.readingOwner==='scene'&&w>.15);
 const colors=plan.profile.colors;
 const attention=plan.attentionMoves.reduce((v:number,m:any)=>v+m.amplitude*ease((t-m.start)/m.enter)*ease((m.end-t)/m.exit),0);
 const css={'--caption-accent':colors.key,'--caption-soft':colors.soft,'--caption-text':colors.text,'--caption-glow':colors.glow,'--caption-shadow':colors.shadow,'--depth-light':colors.depthLight,'--depth-mid':colors.depthMid,'--depth-dark':colors.depthDark,'--material-highlight':colors.materialHighlight,'--material-mid':colors.materialMid,'--material-shade':colors.materialShade,'--scene-text':colors.sceneText,'--caption-icon-surface':colors.surface,'--caption-left':'80px','--caption-right':'80px'} as React.CSSProperties;
 return <AbsoluteFill style={{...css,fontFamily:'CaptionKit,sans-serif',background:colors.background,color:colors.text,overflow:'hidden'}}>
  <WordFontAudit cues={plan.wordCaptions}/><SubtitleFontAudit cues={plan.subtitles} safeMargin={plan.profile.safeMarginX}/><BehindMaxWidthProbe shots={plan.behindShots} safeMargin={plan.profile.safeMarginX}/>
  <style>{`@font-face{font-family:CaptionKit;src:url('${staticFile('fonts/BeVietnamPro-Medium.ttf')}');font-weight:400 599}@font-face{font-family:CaptionKit;src:url('${staticFile('fonts/BeVietnamPro-Bold.ttf')}');font-weight:600 799}@font-face{font-family:CaptionKit;src:url('${staticFile('fonts/BeVietnamPro-ExtraBoldItalic.ttf')}');font-weight:800 900;font-style:italic}*{box-sizing:border-box}`}</style>
  <div style={{position:'absolute',left:box.x,top:box.y,width:box.w,height:box.h,overflow:'hidden',borderRadius:scene?.presenter?30*w:0,boxShadow:scene?.presenter?'0 20px 70px var(--caption-shadow)':undefined}}>
   <AbsoluteFill style={{transform:`scale(${1+attention})`,transformOrigin:plan.profile.sourceTransformOrigin}}>{behind?<BehindText shot={behind} t={t}/>:plan.segments.map((s:any,i:number)=><Sequence key={i} from={s.videoFrameStart??Math.round(s.outputStart*fps)} durationInFrames={s.videoFrameEndExclusive!==undefined?s.videoFrameEndExclusive-s.videoFrameStart:Math.round((s.sourceEnd-s.sourceStart)*fps)}><OffthreadVideo muted={plan.audio.mode==='fullmix'} src={staticFile(plan.source.file)} trimBefore={Math.round(s.sourceStart*fps)} style={{width:'100%',height:'100%',objectFit:'contain'}}/></Sequence>)}</AbsoluteFill>
   <AbsoluteFill style={{opacity:scene?.overSource?1:showCaption?1-w:0,background:plan.profile.readabilityGradient}}/>
  </div>
  <MotionLayer t={t} events={plan.motionEvents}/>
  {!behind&&<SemanticStage t={t} stages={plan.semanticStages}/>}
  <ArtVignettes t={t} windows={plan.artWindows} file={plan.illustrations?.file??''}/>
  {plan.phoneMotion&&<PhoneCall t={t} plan={plan}/>}
  {scene&&<AbsoluteFill style={{opacity:w}}><Artwork scene={scene as SceneType} t={t} colors={colors}/></AbsoluteFill>}
  {showCaption&&(wordCue?<EmotionalWordCaption cue={wordCue} t={t} top={wordCue.top} choice={wordCue.choice}/>:<ExpressiveSubtitles cue={summary} t={t}/>)}
  {plan.openingHook&&<OpeningHook t={t} config={plan.openingHook}/>}
  {plan.audio.mode==='fullmix'&&<Audio src={staticFile(plan.audio.fullMixFile)}/>}
 </AbsoluteFill>;
}
registerRoot(()=> <Composition id="ClientFilm" component={Film} width={1080} height={1920} fps={30} durationInFrames={240} defaultProps={{plan:planFile}} calculateMetadata={({props})=>({fps:props.plan.fps,durationInFrames:Math.round(props.plan.duration*props.plan.fps)})}/>);

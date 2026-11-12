import {Composition, staticFile} from 'remotion';
import {StudioMotion, type StudioMotionProps} from './Composition';

const defaults: StudioMotionProps = {
  videoSrc:'',width:1080,height:1920,durationInFrames:270,
  concept:{name:'Trạm Video',color:'#D8B778',font:'Be Vietnam Pro',pace:'balanced'},
  scenes:[
    {start:0,duration:3,caption:'Một chiếc\nđiện thoại',layout:'creator',items:['sentence','phone']},
    {start:3,duration:3,caption:'Tìm hướng\ncó ánh sáng',layout:'creator',items:['sentence','sun']},
    {start:6,duration:3,caption:'Chia sẻ\ncâu chuyện ra',layout:'creator',items:['sentence','share']},
  ],captions:[],
};
function Video(props: StudioMotionProps) {
  return <StudioMotion {...props} videoSrc={props.videoSrc ? staticFile(props.videoSrc) : ''}/>;
}
export function RemotionRoot() {
  return <Composition id="TramVideo" component={Video} fps={30} width={1080} height={1920}
    durationInFrames={270} defaultProps={defaults}
    calculateMetadata={({props})=>({width:props.width,height:props.height,durationInFrames:props.durationInFrames})}/>;
}

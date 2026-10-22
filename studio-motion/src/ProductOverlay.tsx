import {Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import type {MotionScene} from "./Graphics";

/** Tech product concept: footage is the hero, typography lives in the upper safe area. */
export function ProductOverlay({scene,accent}:{scene:MotionScene;accent:string}) {
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
  const size=width/1080,clamp={extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
  const progress=interpolate(frame,[0,.65*fps],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
  const opacity=interpolate(frame,[(scene.duration-.35)*fps,scene.duration*fps],[1,0],clamp);
  const hero=scene.caption.toLowerCase().includes("mac studio");
  const lines=hero?["Mac","Studio"]:scene.caption.split("\n");
  return <div style={{position:"absolute",inset:0,opacity,pointerEvents:"none"}}>
    <div style={{position:"absolute",inset:"0 0 48%",background:"linear-gradient(180deg,#07101be8,#07101b55 70%,transparent)",opacity:progress}}/>
    <div style={{position:"absolute",top:height*.112,left:width*.078,right:width*.09}}>
      <div style={{display:"flex",alignItems:"center",gap:16*size,color:accent,fontSize:24*size,fontWeight:700,letterSpacing:4*size,opacity:progress,marginBottom:24*size}}>
        <span style={{height:2*size,width:55*size,background:accent,scale:`${progress} 1`,transformOrigin:"left"}}/>
        {scene.items[0] || "MỞ HỘP"}
      </div>
      {lines.map((line,i)=><div key={i} style={{overflow:"hidden",paddingBottom:8*size}}><div data-safe-text style={{
        color:hero&&i===1?accent:"#f4f6f9",fontSize:(hero?156:82)*size,fontWeight:800,
        lineHeight:1.02,letterSpacing:(hero?-7:-2)*size,textShadow:"0 5px 28px #0005",
        translate:`0 ${interpolate(frame,[i*.11*fps,(.65+i*.11)*fps],[115,0],{...clamp,easing:Easing.bezier(.16,1,.3,1)})}%`,
      }}>{line}</div></div>)}
      <div style={{height:2*size,width:hero?260*size:160*size,marginTop:28*size,background:"#ffffff44",scale:`${progress} 1`,transformOrigin:"left"}}/>
    </div>
    <div style={{position:"absolute",inset:"0 0 auto",height:height*.006,background:accent,scale:`${progress} 1`,transformOrigin:"left"}}/>
  </div>;
}

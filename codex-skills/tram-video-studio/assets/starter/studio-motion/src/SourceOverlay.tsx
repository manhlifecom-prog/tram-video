import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { MotionScene } from "./Graphics";

/** Brief emphasis over live footage. The center stays clear for hands/products. */
export function SourceOverlay({ scene, accent }: {scene: MotionScene; accent: string}) {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const size = Math.min(width / 1080, height / 1080);
  const portrait = height > width;
  const words = scene.caption.trim().split(/\s+/);
  const boundary = Math.max(1, Math.ceil(words.length / 2));
  const lines = [words.slice(0, boundary).join(" "), words.slice(boundary).join(" ")].filter(Boolean);
  const clamp = {extrapolateLeft:"clamp",extrapolateRight:"clamp"} as const;
  const out = interpolate(frame, [(scene.duration - 0.3) * fps, scene.duration * fps], [1, 0], clamp);
  return <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:out}}>
    <div style={{position:"absolute",inset:"0 0 64%",background:"linear-gradient(180deg,#06151d80,transparent)"}} />
    <div style={{position:"absolute",left:width*0.075,top:height*(portrait?0.115:0.13),width:width*(portrait?0.82:0.52)}}>
      <div style={{height:5*size,width:interpolate(frame,[0,0.5*fps],[0,70*size],clamp),background:accent,marginBottom:22*size}} />
      {lines.map((line,i)=><div data-safe-text key={i} style={{overflow:"hidden",paddingBottom:4*size}}><div style={{
        fontSize:(portrait?74:59)*size,fontWeight:800,lineHeight:1.13,letterSpacing:-2*size,
        color:i===lines.length-1?accent:"#fffdf7",textShadow:"0 3px 16px #07141a80",
        translate:`0 ${interpolate(frame,[i*0.09*fps,(0.45+i*0.09)*fps],[100,0],{...clamp,easing:Easing.bezier(0.16,1,0.3,1)})}%`,
      }}>{line}</div></div>)}
    </div>
  </div>;
}

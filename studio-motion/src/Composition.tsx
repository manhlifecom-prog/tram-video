import type { Caption } from "@remotion/captions";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneGraphic, type MotionScene } from "./Graphics";
import {captionGroupAt} from "./caption-timing";
export type { MotionScene } from "./Graphics";

export type StudioMotionProps = {
  videoSrc: string;
  width: number;
  height: number;
  durationInFrames: number;
  concept: { name: string; color: string; font: string; pace: string };
  scenes: MotionScene[];
  captions: Caption[];
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function MotionCaptions({
  captions,
  accent,
}: {
  captions: Caption[];
  accent: string;
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const time = (frame / fps) * 1000;
  const page=captionGroupAt(captions,time);
  if (!page) return null;
  const {group,wordLevel,active}=page;
  return (
    <div
      style={{
        position: "absolute",
        left: width * 0.08,
        right: width * 0.08,
        bottom: height * 0.115,
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        data-safe-text
        style={{
          maxWidth: "100%",
          background: "linear-gradient(180deg,#07141300,#07141335)",
          color: "#fffdf5",
          padding: `${(16 * width) / 1080}px ${(24 * width) / 1080}px`,
          borderRadius: (10 * width) / 1080,
          textShadow: "0 3px 9px #000d, 0 0 3px #000f",
          WebkitTextStroke: `${(1.1 * width) / 1080}px #07141388`,
          fontSize: ((height > width ? 54 : 34) * width) / 1080,
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        {group.map((c, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              margin: "0 0.1em",
              padding: "0 0.09em",
              borderRadius: "0.15em",
              background: "transparent",
              color: wordLevel && i === active ? accent : "inherit",
            }}
          >
            {c.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StudioMotion(props: StudioMotionProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const size = portrait ? width / 1080 : height / 1080;
  const sceneIndex = props.scenes.findIndex(
    (s) =>
      frame >= Math.round(s.start * fps) &&
      frame < Math.round((s.start + s.duration) * fps),
  );
  const scene = props.scenes[sceneIndex];
  const inset = !!scene && !["speaker", "overlay", "product", "creator"].includes(scene.layout);
  const creatorConcept = props.scenes.some(s=>s.layout === "creator");
  const productConcept = props.scenes.some(s=>s.layout === "product");
  const sceneFrame = scene ? frame-Math.round(scene.start*fps) : 0;
  const diameter = portrait ? width * 0.185 : height * 0.18;
  const dark =
    scene?.graphic?.theme === "dark" ||
    scene?.layout === "image" ||
    scene?.layout === "stat" ||
    scene?.layout === "quote" ||
    scene?.layout === "speaker" || scene?.layout === "overlay" || scene?.layout === "product" || scene?.layout === "creator";
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f5f2e9",
        fontFamily: `"${props.concept.font}", Arial, sans-serif`,
        overflow: "hidden",
      }}
    >
      <style>{`@font-face{font-family:'Be Vietnam Pro';font-style:normal;font-weight:500;src:url('${staticFile("fonts/BeVietnamPro-Medium.ttf")}')}@font-face{font-family:'Be Vietnam Pro';font-style:normal;font-weight:700 900;src:url('${staticFile("fonts/BeVietnamPro-Bold.ttf")}')}`}</style>
      {props.videoSrc && (
        <div
          style={{
            position: "absolute",
            left: inset ? width * 0.915 - diameter : 0,
            top: inset ? height * 0.047 : 0,
            width: inset ? diameter : width,
            height: inset ? diameter : height,
            borderRadius: inset ? "50%" : 0,
            overflow: "hidden",
            border: inset ? `${6 * size}px solid ${props.concept.color}` : 0,
            boxShadow: inset ? "0 12px 35px #0003" : "none",
            zIndex: inset ? 3 : 0,
          }}
        >
          <Video
            src={props.videoSrc}
            premountFor={fps}
            objectFit="cover"
            style={{
              width: "100%",
              height: "100%",
              objectPosition: "center 25%",
              scale: productConcept && !inset ? interpolate(sceneFrame,[0,Math.max(1,(scene?.duration || 1)*fps)],[1,1.025],clamp) : 1,
            }}
          />
        </div>
      )}
      {props.scenes.map((s, i) => (
        <Sequence
          key={i}
          from={Math.round(s.start * fps)}
          durationInFrames={Math.max(1, Math.round(s.duration * fps))}
          premountFor={fps}
          name={s.caption.slice(0, 45)}
        >
          <SceneGraphic
            scene={s}
            accent={props.concept.color}
            pace={props.concept.pace}
            videoSrc={props.videoSrc}
          />
        </Sequence>
      ))}

      {props.concept.name && !/^Concept (đầu tiên|riêng)$/i.test(props.concept.name) && <div
        style={{
          position: "absolute",
          left: width * 0.085,
          top: height * 0.065,
          display: "flex",
          alignItems: "center",
          gap: 15 * size,
          color: dark ? "#f5f2e9" : "#203b31",
          fontSize: 25 * size,
          fontWeight: 700,
          textShadow: "0 2px 9px #0008",
          maxWidth: width * 0.58,
        }}
      >
        <span
          style={{
            width: 14 * size,
            height: 14 * size,
            borderRadius: "50%",
            background: props.concept.color,
            flexShrink: 0,
          }}
        />
        {props.concept.name}
      </div>}
      <MotionCaptions captions={props.captions} accent={props.concept.color} />
      {!productConcept && !creatorConcept && <div
        style={{
          position: "absolute",
          left: width * 0.085,
          right: width * 0.085,
          bottom: height * 0.045,
          height: 4 * size,
          background: dark ? "#ffffff25" : "#172b2920",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${interpolate(frame, [0, props.durationInFrames - 1], [0, 100], clamp)}%`,
            background: props.concept.color,
          }}
        />
      </div>}
    </AbsoluteFill>
  );
}


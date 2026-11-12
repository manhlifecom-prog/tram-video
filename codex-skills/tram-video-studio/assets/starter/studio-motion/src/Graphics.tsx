import type { CSSProperties } from "react";
import { AssetScene } from "./AssetScene";
import { CustomGraphic } from "./CustomGraphic";
import { SourceOverlay } from "./SourceOverlay";
import { ProductOverlay } from "./ProductOverlay";
import { CreatorScene } from "./creator/CreatorScene";
import type { GraphicSpec } from "../../src/lib/studio/graphic-spec";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type Layout =
  | "image"
  | "custom"
  | "speaker"
  | "overlay"
  | "product"
  | "creator"
  | "title"
  | "stat"
  | "steps"
  | "comparison"
  | "iceberg"
  | "timeline"
  | "quote";
export type MotionScene = {
  start: number;
  duration: number;
  caption: string;
  layout: Layout;
  items: string[];
  graphic?: GraphicSpec;
  assetId?: string;
  assetSrc?: string;
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ink = "#202621";
const paper = "#f5f2e9";

export function SceneGraphic({
  scene,
  accent,
  pace,
  videoSrc,
}: {
  scene: MotionScene;
  accent: string;
  pace: string;
  videoSrc?: string;
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const size = portrait ? width / 1080 : height / 1080;
  const enter = pace === "calm" ? 0.8 : pace === "fast" ? 0.35 : 0.55;
  const dark =
    scene.layout === "stat" ||
    scene.layout === "quote" ||
    scene.graphic?.theme === "dark";
  const foreground = dark ? paper : ink;
  const show = (delay = 0) =>
    interpolate(frame, [delay * fps, (delay + enter) * fps], [0, 1], {
      ...clamp,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  const items = scene.items.slice(0, 3);
  const head: CSSProperties = {
    position: "absolute",
    left: width * 0.085,
    top: height * (portrait ? 0.19 : 0.27),
    width: width * (portrait ? 0.83 : 0.38),
    color: foreground,
    fontSize: (portrait ? 86 : 78) * size,
    fontWeight: 700,
    lineHeight: 1.18,
    letterSpacing: -3 * size,
    margin: 0,
    overflowWrap: "anywhere",
    opacity: show(),
    translate: `0px ${interpolate(show(), [0, 1], [35 * size, 0])}px`,
  };
  const stage: CSSProperties = {
    position: "absolute",
    left: width * (portrait ? 0.075 : 0.52),
    top: height * (portrait ? (scene.layout === "custom" ? 0.32 : 0.4) : 0.2),
    width: width * (portrait ? 0.85 : 0.4),
    height:
      height * (portrait ? (scene.layout === "custom" ? 0.48 : 0.39) : 0.62),
    opacity: show(0.15),
    scale: interpolate(show(0.15), [0, 1], [0.94, 1]),
  };
  if (scene.layout === "image" && scene.assetSrc)
    return (
      <AssetScene
        src={scene.assetSrc}
        caption={scene.caption}
        accent={accent}
      />
    );
  if (scene.layout === "speaker") return null;
  if (scene.layout === "overlay") return <SourceOverlay scene={scene} accent={accent} />;
  if (scene.layout === "product") return <ProductOverlay scene={scene} accent={accent} />;
  if (scene.layout === "creator") return <CreatorScene scene={scene} videoSrc={videoSrc || ""} />;
  return (
    <section
      data-scene-layout={scene.layout}
      style={{
        position: "absolute",
        inset: 0,
        background: dark ? `radial-gradient(ellipse at 28% 5%, ${accent}32, transparent 60%), linear-gradient(165deg,#142922,#08120f)` : paper,
        color: foreground,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage: `radial-gradient(${foreground} 1px, transparent 1px)`,
          backgroundSize: `${28 * size}px ${28 * size}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.085,
          top: height * 0.14,
          width: 64 * size,
          height: 8 * size,
          background: accent,
        }}
      />
      <h1
        data-safe-text
        style={{
          ...head,
          fontSize:
            (scene.caption.length > 65 ? 66 : portrait ? 86 : 78) * size,
        }}
      >
        {scene.caption}
      </h1>
      <div style={stage}>
        {scene.graphic && scene.layout === "custom" && (
          <CustomGraphic graphic={scene.graphic} accent={accent} />
        )}
        {scene.layout === "title" && (
          <div aria-hidden style={{height:"100%",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",left:"5%",top:"30%",width:"90%",height:4*size,background:accent,scale:`${show(.25)} 1`,transformOrigin:"left"}} />
            <div style={{position:"absolute",left:"5%",top:"30%",width:22*size,height:22*size,borderRadius:"50%",background:accent,translate:`${show(.25)*width*.6}px -9px`}} />
          </div>
        )}
        {scene.layout === "stat" && (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <svg
              viewBox="0 0 600 600"
              style={{ position: "absolute", height: "110%", opacity: 0.5 }}
            >
              <circle
                cx="300"
                cy="300"
                r="265"
                fill="none"
                stroke={paper}
                strokeOpacity="0.15"
                strokeWidth="2"
              />
              <circle
                cx="300"
                cy="300"
                r="265"
                fill="none"
                stroke={accent}
                strokeWidth="18"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="0.72 1"
                strokeDashoffset={interpolate(show(0.2), [0, 1], [0.72, 0])}
              />
            </svg>
            <div
              data-safe-text
              style={{
                color: accent,
                position: "relative",
                fontWeight: 700,
                fontSize:
                  Math.min(
                    176,
                    (760 / Math.max(3, (items[0] || "").length)) * 1.5,
                  ) * size,
                lineHeight: 1.05,
                letterSpacing: -7 * size,
                maxWidth: "92%",
                overflowWrap: "anywhere",
                textAlign: "center",
              }}
            >
              {items[0]}
            </div>
            {items[1] && (
              <div
                data-safe-text
                style={{
                  fontSize: 44 * size,
                  maxWidth: "80%",
                  textAlign: "center",
                  marginTop: 40 * size,
                  opacity: show(0.6),
                }}
              >
                {items[1]}
              </div>
            )}
          </div>
        )}
        {(scene.layout === "steps" || scene.layout === "timeline") && (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 38 * size,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "13%",
                bottom: "13%",
                left: 57 * size,
                width: 4 * size,
                background: `${accent}55`,
                scale: `1 ${show(0.3)}`,
                transformOrigin: "top",
              }}
            />
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 32 * size,
                  opacity: show(0.25 + i * 0.3),
                  translate: `${(1 - show(0.25 + i * 0.3)) * 60 * size}px 0px`,
                }}
              >
                <div
                  style={{
                    width: 118 * size,
                    height: 118 * size,
                    borderRadius: scene.layout === "steps" ? 30 * size : "50%",
                    flexShrink: 0,
                    background: i === items.length - 1 ? accent : ink,
                    color: paper,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 40 * size,
                    fontWeight: 700,
                    position: "relative",
                    border: `${8 * size}px solid ${paper}`,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  data-safe-text
                  style={{
                    flex: 1,
                    background: "#fff9",
                    border: `1px solid ${ink}1c`,
                    padding: `${27 * size}px ${32 * size}px`,
                    borderRadius: 18 * size,
                    fontSize: (item.length > 45 ? 40 : 44) * size,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    overflowWrap: "anywhere",
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        )}
        {scene.layout === "comparison" && (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: 24 * size,
            }}
          >
            {items.slice(0, 2).map((item, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  alignSelf: "stretch",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: 30 * size,
                  borderRadius: 32 * size,
                  background: i ? ink : "#e5e2d9",
                  color: i ? paper : ink,
                  opacity: show(0.2 + i * 0.4),
                  translate: `0px ${(1 - show(0.2 + i * 0.4)) * 60 * size}px`,
                }}
              >
                <svg
                  viewBox="0 0 240 240"
                  style={{ width: "100%", marginBottom: 25 * size }}
                >
                  {i === 0 ? (
                    <g
                      stroke={ink}
                      strokeWidth="9"
                      fill="none"
                      strokeLinecap="round"
                    >
                      <path
                        d="M40 65l130 100M50 175l120-115M65 40l105 160"
                        opacity="0.2"
                      />
                      <path d="M55 100h120M55 135h100" />
                    </g>
                  ) : (
                    <g
                      fill="none"
                      stroke={accent}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="30" y="30" width="180" height="180" rx="40" />
                      <path d="M65 125l35 35 73-80" />
                    </g>
                  )}
                </svg>
                <div
                  data-safe-text
                  style={{
                    fontSize: (item.length > 35 ? 40 : 46) * size,
                    lineHeight: 1.3,
                    fontWeight: 700,
                    overflowWrap: "anywhere",
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        )}
        {scene.layout === "iceberg" && (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <svg width="100%" height="100%" viewBox="0 0 900 720">
              <path d="M0 250H900V720H0Z" fill="#d8e9e5" />
              <path
                d="M0 250Q80 235 150 250T300 250T450 250T600 250T750 250T900 250"
                stroke="#648d86"
                strokeWidth="4"
                fill="none"
              />
              <g style={{ translate: `0px ${(1 - show(0.2)) * 80}px` }}>
                <path d="M280 250L420 70 565 250Z" fill={accent} />
                <path d="M420 70L450 250H280Z" fill="white" opacity="0.4" />
                <path
                  d="M280 260L565 260 675 400 460 630 215 400Z"
                  fill={ink}
                />
                <path d="M280 260L460 630 215 400Z" fill="#3a5952" />
                <path d="M565 260L675 400 460 630Z" fill="#28463e" />
              </g>
              <path
                d="M545 160H760M650 450H790"
                stroke={ink}
                strokeWidth="3"
                strokeDasharray="8 8"
                opacity={show(0.8)}
              />
            </svg>
            {items[0] && (
              <div
                data-safe-text
                style={{
                  position: "absolute",
                  right: 0,
                  top: "1%",
                  width: "43%",
                  textAlign: "right",
                  fontSize: (items[0].length > 25 ? 40 : 44) * size,
                  fontWeight: 700,
                  opacity: show(0.5),
                  overflowWrap: "anywhere",
                }}
              >
                {items[0]}
              </div>
            )}
            {items[1] && (
              <div
                data-safe-text
                style={{
                  position: "absolute",
                  left: 20 * size,
                  bottom: "4%",
                  width: "85%",
                  padding: `${20 * size}px ${28 * size}px`,
                  borderRadius: 16 * size,
                  background: paper,
                  boxShadow: "0 12px 30px #172b2910",
                  fontSize: 44 * size,
                  fontWeight: 700,
                  opacity: show(0.9),
                  overflowWrap: "anywhere",
                }}
              >
                {items[1]}
              </div>
            )}
          </div>
        )}
        {scene.layout === "quote" && (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: accent,
                fontSize: 300 * size,
                height: 190 * size,
                lineHeight: 1,
              }}
            >
              “
            </div>
            <div
              data-safe-text
              style={{
                fontSize: 64 * size,
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: -2 * size,
              }}
            >
              {(items[0] || scene.caption).split(" ").map((word, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: show(0.2 + i * 0.055),
                    color:
                      i > (items[0] || scene.caption).split(" ").length - 4
                        ? accent
                        : paper,
                    marginRight: 16 * size,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

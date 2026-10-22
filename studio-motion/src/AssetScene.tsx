import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

/** Uses only the current job's private, loopback asset URLs. */
export function AssetScene({
  src,
  caption,
  accent,
}: {
  src: string;
  caption: string;
  accent: string;
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const size = Math.min(width, height) / 1080;
  const enter = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <AbsoluteFill
      data-scene-layout="image"
      style={{ background: "#091b20", overflow: "hidden" }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 70% 30%, ${accent}50, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * (portrait ? 0.075 : 0.47),
          top: height * (portrait ? 0.26 : 0.17),
          width: width * (portrait ? 0.85 : 0.45),
          height: height * (portrait ? 0.43 : 0.64),
          perspective: 1800,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 36 * size,
            background: "#ffffff09",
            border: "1px solid #ffffff30",
            boxShadow: `0 40px 90px #0008, 0 0 100px ${accent}25`,
            overflow: "hidden",
            opacity: enter,
            translate: `0px ${(1 - enter) * 65 * size}px`,
            transform: `rotateY(${(1 - enter) * -12}deg) rotateX(${(1 - enter) * 5}deg)`,
            scale: interpolate(frame, [0, 12 * fps], [1, 1.055], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: 32 * size,
              boxSizing: "border-box",
            }}
          />
          <AbsoluteFill
            style={{
              pointerEvents: "none",
              background:
                "linear-gradient(135deg,#ffffff18,transparent 40%,#0002)",
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: width * 0.085,
          top: height * (portrait ? 0.72 : 0.3),
          width: width * (portrait ? 0.83 : 0.33),
          color: "#fffdf5",
          opacity: enter,
          translate: `0px ${(1 - enter) * 25 * size}px`,
        }}
      >
        <div
          style={{
            width: 58 * size,
            height: 5 * size,
            background: accent,
            marginBottom: 24 * size,
            borderRadius: 5,
          }}
        />
        <h1
          data-safe-text
          style={{
            margin: 0,
            fontSize:
              (caption.length > 70 ? 44 : caption.length > 40 ? 52 : 64) * size,
            lineHeight: 1.2,
            letterSpacing: -1.8 * size,
            textWrap: "balance",
            overflowWrap: "anywhere",
          }}
        >
          {caption}
        </h1>
      </div>
    </AbsoluteFill>
  );
}

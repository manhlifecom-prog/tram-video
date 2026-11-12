import { useId } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { GraphicSpec } from "../../src/lib/studio/graphic-spec";
import { PhysicalObject } from "./PhysicalObject";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function CustomGraphic({
  graphic,
  accent,
}: {
  graphic: GraphicSpec;
  accent: string;
}) {
  const filterId = "custom-depth-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = {
    accent,
    soft: graphic.theme === "dark" ? "#344b47" : "#e8e2d5",
    ink: "#152e2b",
    paper: "#f5f2e9",
    white: "#ffffff",
    muted: "#80928c",
    none: "none",
  };
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 900 900"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow
            dx="0"
            dy="15"
            stdDeviation="18"
            floodColor="#081f1b"
            floodOpacity="0.18"
          />
        </filter>
      </defs>
      {graphic.nodes.map((n, i) => {
        const t = interpolate(
          frame,
          [n.delay * fps, (n.delay + 0.7) * fps],
          [0, 1],
          { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
        );
        const float =
          n.motion === "float" ? Math.sin((frame / fps) * 1.6 + i) * 7 : 0;
        const sx = n.motion === "pop" ? interpolate(t, [0, 1], [0.8, 1]) : 1;
        const dx = n.motion === "rise" ? (1 - t) * 45 : float;
        const common = {
          fill: palette[n.fill],
          stroke: palette[n.stroke],
          strokeWidth: n.weight,
          strokeLinecap: "round" as const,
          strokeLinejoin: "round" as const,
        };
        return (
          <g
            key={i}
            opacity={t}
            style={{
              translate: `${n.x}px ${n.y + dx}px`,
              scale: sx,
              transformOrigin: `${n.w / 2}px ${n.h / 2}px`,
            }}
          >
            {["phone", "box", "clock", "battery", "gear", "book"].includes(n.kind) && <PhysicalObject node={n} accent={accent} />}
            {n.kind === "rect" && (
              <rect
                {...common}
                width={n.w}
                height={n.h}
                rx={Math.min(24, n.h * 0.18)}
                filter={n.fill !== "none" ? `url(#${filterId})` : undefined}
              />
            )}
            {n.kind === "circle" && (
              <circle
                {...common}
                cx={n.w / 2}
                cy={n.w / 2}
                r={n.w / 2}
                filter={n.fill !== "none" ? `url(#${filterId})` : undefined}
              />
            )}
            {n.kind === "path" && (
              <path
                {...common}
                d={n.d}
                pathLength={1}
                strokeDasharray={n.motion === "draw" ? 1 : undefined}
                strokeDashoffset={n.motion === "draw" ? 1 - t : undefined}
              />
            )}
            {n.kind === "line" && (
              <path
                {...common}
                d={`M0 0L${n.w} ${n.h}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - t}
              />
            )}
            {n.kind === "text" && (
              <text
                data-custom-label
                fontSize={n.size}
                fontWeight={700}
                fill={palette[n.fill]}
              >
                {n.text.split("\n").map((line, j) => (
                  <tspan key={j} x={0} dy={j === 0 ? 0 : n.size * 1.25}>
                    {line}
                  </tspan>
                ))}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

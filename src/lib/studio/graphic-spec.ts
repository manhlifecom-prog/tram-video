/** A bounded motion drawing, never executable model-generated JavaScript. */
export type GraphicNode = {
  kind: "path" | "rect" | "circle" | "text" | "line" | "phone" | "box" | "clock" | "battery" | "gear" | "book";
  x: number;
  y: number;
  w: number;
  h: number;
  d: string;
  text: string;
  fill: "accent" | "soft" | "ink" | "paper" | "white" | "muted" | "none";
  stroke: "accent" | "soft" | "ink" | "paper" | "white" | "muted" | "none";
  weight: number;
  size: number;
  delay: number;
  motion: "draw" | "rise" | "pop" | "float" | "none";
};
export type GraphicSpec = {
  theme: "light" | "dark";
  rationale: string;
  nodes: GraphicNode[];
};
const paints = ["accent", "soft", "ink", "paper", "white", "muted", "none"];
export const graphicSchema = {
  type: "object",
  additionalProperties: false,
  required: ["theme", "rationale", "nodes"],
  properties: {
    theme: { type: "string", enum: ["light", "dark"] },
    rationale: { type: "string" },
    nodes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "kind",
          "x",
          "y",
          "w",
          "h",
          "d",
          "text",
          "fill",
          "stroke",
          "weight",
          "size",
          "delay",
          "motion",
        ],
        properties: {
          kind: {
            type: "string",
            enum: ["path", "rect", "circle", "text", "line", "phone", "box", "clock", "battery", "gear", "book"],
          },
          x: { type: "number" },
          y: { type: "number" },
          w: { type: "number" },
          h: { type: "number" },
          d: { type: "string" },
          text: { type: "string" },
          fill: { type: "string", enum: paints },
          stroke: { type: "string", enum: paints },
          weight: { type: "number" },
          size: { type: "number" },
          delay: { type: "number" },
          motion: {
            type: "string",
            enum: ["draw", "rise", "pop", "float", "none"],
          },
        },
      },
    },
  },
};
export function validateGraphic(value: GraphicSpec): GraphicSpec {
  if (
    !value ||
    !["light", "dark"].includes(value.theme) ||
    typeof value.rationale !== "string" ||
    value.rationale.length > 1500 ||
    !Array.isArray(value.nodes) ||
    value.nodes.length < 3 ||
    value.nodes.length > 48
  )
    throw new Error("Hình giải thích Codex chưa hợp lệ.");
  for (const [index, n] of value.nodes.entries()) {
    const fail = (rule: string): never => {
      throw new Error(`Hình minh họa: phần tử ${index} sai ${rule}.`);
    };
    if (
      !n ||
      !["path", "rect", "circle", "text", "line", "phone", "box", "clock", "battery", "gear", "book"].includes(n.kind) ||
      !paints.includes(n.fill) ||
      !paints.includes(n.stroke) ||
      !["draw", "rise", "pop", "float", "none"].includes(n.motion)
    )
      fail("loại hoặc màu");
    if (![n.x, n.y, n.w, n.h, n.weight, n.size, n.delay].every(Number.isFinite))
      fail("giá trị số");
    if (n.x < -100 || n.x > 1000 || n.y < -100 || n.y > 1000)
      fail("tọa độ (-100..1000)");
    if (
      Math.abs(n.w) > 1000 ||
      Math.abs(n.h) > 1000 ||
      (n.kind !== "line" && (n.w < 0 || n.h < 0))
    )
      fail("kích thước (0..1000)");
    if (
      n.weight < 0 ||
      n.weight > 16 ||
      n.size < 0 ||
      n.size > 120 ||
      n.delay < 0 ||
      n.delay > 6
    )
      fail("nét vẽ, cỡ chữ hoặc thời gian");
    if (
      typeof n.text !== "string" ||
      n.text.length > 100 ||
      typeof n.d !== "string" ||
      n.d.length > 3500
    )
      fail("độ dài nội dung");
    if (
      n.kind === "path" &&
      (!n.d ||
        !/^[MmLlHhVvCcSsQqTtAaZz0-9eE+.,\s-]+$/.test(n.d) ||
        (n.d.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi) || []).some(
          (s) => !Number.isFinite(Number(s)) || Math.abs(Number(s)) > 3000,
        ))
    )
      fail("đường SVG");
    if (
      n.kind === "text" &&
      (n.size < 32 || n.text.split("\n").length > 3 || n.w < 80)
    )
      fail("cỡ hoặc vùng chữ (size>=32, w>=80)");
    if (["phone", "box", "clock", "battery", "gear", "book"].includes(n.kind) && (n.w < 100 || n.h < 100))
      fail("vùng vật thể (w,h>=100)");
  }
  return value;
}

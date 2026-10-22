import type { Concept, EditPlan } from "./types";
import { captionCoverage } from "./editorial";

export function motionProps(
  plan: EditPlan,
  segments: { start: number; end: number; text: string }[],
  concept: Concept,
  width: number,
  height: number,
  words?: { word: string; start: number; end: number }[],
) {
  let cursor = 0;
  const captions: {
    text: string;
    startMs: number;
    endMs: number;
    timestampMs: null;
    confidence: null;
    timing: "word" | "phrase";
  }[] = [];
  // Build captions on the source timeline once. A visual cut must not repeat
  // the complete spoken sentence on each side of that cut.
  const sourceCaptions = segments.flatMap<{id:string;text:string;start:number;end:number;timing:"word"|"phrase"}>((segment, segmentIndex) => {
    const timed = (words || []).filter(word =>
      Number.isFinite(word.start) && Number.isFinite(word.end) &&
      word.end > word.start && word.start < segment.end &&
      word.end > segment.start && word.word.trim());
    if (timed.length && captionCoverage(segment.text, timed.map(w => w.word).join(" ")) >= 0.95)
      return timed.map((word, index) => ({
        id: `${segmentIndex}:${index}`, text: word.word.trim(),
        timing: "word" as const,
        start: Math.max(segment.start, word.start), end: Math.min(segment.end, word.end),
      }));
    const tokens = segment.text.trim().split(/\s+/).filter(Boolean);
    const count = Math.ceil(tokens.length / 7);
    const chunkSize = Math.ceil(tokens.length / count);
    return Array.from({length: count}, (_, index) => ({
      id: `${segmentIndex}:${index}`, text: tokens.slice(index * chunkSize, (index + 1) * chunkSize).join(" "),
      timing: "phrase" as const,
      start: segment.start + (segment.end - segment.start) * index / count,
      end: segment.start + (segment.end - segment.start) * (index + 1) / count,
    }));
  });
  let previousId = "", previousSourceEnd = -1;
  const scenes = plan.scenes.map((scene) => {
    const start = cursor, duration = scene.end - scene.start;
    for (const caption of sourceCaptions) {
      const a = Math.max(scene.start, caption.start), b = Math.min(scene.end, caption.end);
      if (b <= a) continue;
      const startMs = (start + a - scene.start) * 1000;
      const endMs = (start + b - scene.start) * 1000;
      const previous = captions[captions.length - 1];
      if (previous && previousId === caption.id && Math.abs(previous.endMs - startMs) < 0.1 && Math.abs(previousSourceEnd - a) < 0.0001)
        previous.endMs = endMs;
      else captions.push({text: caption.text, startMs, endMs, timestampMs: null, confidence: null, timing:caption.timing});
      previousId = caption.id;
      previousSourceEnd = b;
    }
    cursor += duration;
    let layout = scene.layout || "speaker";
    let items = scene.items || [];
    if (layout === "creator" && items[0] === "goal") {
      const spoken=segments.filter(s=>s.start<scene.end && s.end>scene.start).map(s=>s.text.toLocaleLowerCase()).join(' ');
      const aliases:Record<string,string>={'1':'một','2':'hai','3':'ba','4':'bốn','5':'năm','6':'sáu','7':'bảy','8':'tám','9':'chín','10':'mười'};
      const n=items[1];
      if(!n || !aliases[n] || !new RegExp(`(?:^|\\s)(?:${n}|${aliases[n]})\\s+video(?:\\s|[.,!?]|$)`,'i').test(spoken)) {layout='speaker';items=[];}
    }
    // Do not turn an AI-invented statistic into an authoritative visual.
    const normalize = (value: string) =>
      value.toLocaleLowerCase().replace(/\s+/g, " ").trim();
    if (
      layout === "stat" &&
      (!items[0] ||
        !normalize(
          segments
            .filter((s) => s.start < scene.end && s.end > scene.start)
            .map((s) => s.text)
            .join(" "),
        ).includes(normalize(items[0])))
    )
      layout = "title";
    return {
      start,
      duration,
      caption: scene.caption,
      ...(scene.assetId ? { assetId: scene.assetId } : {}),
      ...(scene.graphic ? { graphic: scene.graphic } : {}),
      layout,
      items: layout === "title" ? [] : items,
    };
  });
  return {
    videoSrc: "",
    width,
    height,
    durationInFrames: Math.max(1, Math.round(cursor * 30)),
    concept: {
      name: concept.name,
      color: concept.color,
      font: concept.font,
      pace: concept.pace,
    },
    scenes,
    captions,
  };
}

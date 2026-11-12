import type { EditPlan, SourceAnalysis } from "./types";

const tokens = (s: string) => s.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").match(/[\p{L}\p{N}]+/gu) || [];

function shorteningRequested(notes: string) {
  const positive = notes.replace(/(?:không|đừng|tránh|không được)\s+(?:rút gọn|tóm tắt|cắt ngắn|cắt còn|chỉ giữ|làm highlight)/gi, "");
  return /(?:rút gọn|tóm tắt|highlight|cắt ngắn|cắt còn|chỉ giữ|cắt (?:bỏ )?(?:đoạn|phần) thừa|bỏ (?:đoạn|phần) thừa)/i.test(positive);
}

// Explicit source intervals are executable constraints. A model may style them
// but cannot restore discarded footage or omit a requested interval.
export function requestedSourceRanges(notes: string, duration: number) {
  const clause = notes.match(/giữ các khoảng nguồn\s*:?[\s\S]*?(?=\.(?:\s|$)|$)/i)?.[0];
  if (!clause) return [];
  const ranges = [...clause.matchAll(/(\d+(?:\.\d+)?)\s*[–—-]\s*(\d+(?:\.\d+)?)/g)].map(m=>({start:Number(m[1]),end:Number(m[2])}));
  let end = 0;
  if (!ranges.length || ranges.some(r=>{const invalid=r.start<end || r.end-r.start<.25 || r.end>duration;end=r.end;return invalid;}))
    throw new Error("Các khoảng nguồn cần theo thứ tự, không chồng nhau và nằm trong clip.");
  return ranges;
}

export function applyRequestedRanges(plan: EditPlan, duration: number, notes: string): EditPlan {
  const ranges = requestedSourceRanges(notes,duration);
  if (!ranges.length) return plan;
  const scenes: EditPlan["scenes"] = [];
  for (const range of ranges) {
    let cursor = range.start;
    for (const scene of plan.scenes) {
      const start=Math.max(range.start,scene.start),end=Math.min(range.end,scene.end);
      if (end<=start) continue;
      if (start>cursor+.001) scenes.push({start:cursor,end:start,caption:"",visual:"Giữ đoạn nguồn đã chọn",layout:"speaker",items:[]});
      scenes.push({...scene,start,end});cursor=end;
    }
    if (cursor<range.end-.001) scenes.push({start:cursor,end:range.end,caption:"",visual:"Giữ đoạn nguồn đã chọn",layout:"speaker",items:[]});
  }
  return {...plan,scenes};
}

export function paceProductOverlays(plan: EditPlan): EditPlan {
  const duration=plan.scenes.reduce((sum,s)=>sum+s.end-s.start,0);
  const limit=Math.max(3,Math.ceil(duration/10));
  let overlays=0;
  return {...plan,scenes:plan.scenes.map(scene=>{
    if(scene.layout==='speaker') return {...scene,caption:'',items:[]};
    if(scene.layout!=='product') return scene;
    // A transitional shot is too brief to read a title. Keep the footage clear.
    if(scene.end-scene.start<1.25 || !scene.caption.trim() || overlays>=limit)
      return {...scene,layout:'speaker' as const,caption:'',items:[]};
    overlays++;return scene;
  })};
}

// A later request to trim must override a previous keep-all instruction.
export function effectiveDurationNotes(instructions: string, feedback: {text:string}[]) {
  for (const note of [...feedback].reverse()) {
    if (/(?:giữ nguyên|giữ toàn bộ|không cắt|rút gọn|tóm tắt|highlight|cắt ngắn|cắt còn|chỉ giữ|cắt (?:bỏ )?(?:đoạn|phần) thừa|bỏ (?:đoạn|phần) thừa)/i.test(note.text)) return note.text;
  }
  return instructions;
}

// Multiset coverage counts repeated words; unrelated short excerpts must not
// pass merely because they share common vocabulary with the complete speech.
export function captionCoverage(primary: string, timed: string) {
  const required = tokens(primary), available = new Map<string, number>();
  for (const token of tokens(timed)) available.set(token, (available.get(token) || 0) + 1);
  let matched = 0;
  for (const token of required) {
    const n = available.get(token) || 0;
    if (n > 0) { matched++; available.set(token, n - 1); }
  }
  return required.length ? matched / required.length : 0;
}

export function validateEditorialSegments(value: unknown, duration: number): SourceAnalysis["segments"] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 300) throw new Error("Cần từ 1 đến 300 đoạn lời thoại.");
  let previous = 0;
  return value.map(s => {
    if (!s || !Number.isFinite(s.start) || !Number.isFinite(s.end) || s.start < previous || s.end > duration + 0.01 || s.end - s.start < 0.1 || typeof s.text !== "string" || !s.text.trim() || s.text.length > 1600)
      throw new Error("Mốc phụ đề phải theo thứ tự, không chồng nhau và nằm trong clip. Mỗi đoạn cần lời thoại.");
    previous = s.end;
    return { start: s.start, end: s.end, text: s.text.trim() };
  });
}

export function editorialQuality(analysis: SourceAnalysis, plan?: EditPlan, notes = "") {
  const allowShortening = shorteningRequested(notes);
  const keptText = analysis.segments.filter(s=>!plan || plan.scenes.some(scene=>s.start<scene.end && s.end>scene.start)).map(s=>s.text).join(" ");
  // With an explicit trim request, check the retained speech against the full
  // independent recognition. Discarded speech is intentionally absent.
  const coverage = plan && allowShortening ? captionCoverage(keptText,analysis.primaryText) : captionCoverage(analysis.primaryText,keptText);
  const issues: string[] = [];
  if (!analysis.segments.length) issues.push("Chưa có lời thoại kèm mốc thời gian để dựng phụ đề.");
  if (coverage < 0.85 && !analysis.confirmedAt && (plan || !allowShortening)) issues.push(`Mốc phụ đề mới đối chiếu được ${Math.round(coverage * 100)}% lời nhận diện. Cần nghe và sửa lời thoại trước khi dựng.`);
  const retainedRatio = plan ? plan.scenes.reduce((n, s) => n + s.end - s.start, 0) / analysis.duration : undefined;
  if (retainedRatio !== undefined && retainedRatio < 0.7 && !allowShortening) issues.push(`Kế hoạch chỉ giữ ${Math.round(retainedRatio * 100)}% clip gốc. Cần làm rõ phần muốn bỏ trước khi xuất video.`);
  if (plan && !allowShortening) {
    const speechDuration = analysis.segments.reduce((sum, s) => sum + s.end - s.start, 0);
    const retainedSpeech = analysis.segments.reduce((sum, s) => sum + plan.scenes.reduce((n, scene) => n + Math.max(0, Math.min(scene.end, s.end) - Math.max(scene.start, s.start)), 0), 0);
    if (speechDuration && retainedSpeech / speechDuration < 0.9) issues.push("Kế hoạch bỏ mất lời thoại đã xác nhận dù chưa có yêu cầu rút gọn. Cần giữ lại nội dung hoặc ghi rõ phần muốn cắt.");
  }
  return { checkedAt: new Date().toISOString(), captionCoverage: coverage, retainedRatio, issues };
}

// "Keep all" is an executable constraint, not a suggestion for the model.
export function preserveRequestedDuration(plan: EditPlan, duration: number, notes: string): EditPlan {
  if (shorteningRequested(notes) || requestedSourceRanges(notes,duration).length) return plan;
  if (!/(?:giữ\s+(?:nguyên\s+|lại\s+)?(?:toàn bộ|đủ\s*\d+|\d+\s*(?:giây|s))|giữ nguyên (?:clip|video)|không cắt(?:\s|[,.!?]|$))/i.test(notes)) return plan;
  const scenes: EditPlan["scenes"] = [];
  let cursor = 0;
  for (const scene of plan.scenes) {
    if (scene.start > cursor + 0.01) scenes.push({ start: cursor, end: scene.start, caption: "", visual: "Giữ nguyên hình và tiếng theo yêu cầu.", layout: "speaker", items: [] });
    scenes.push(scene); cursor = scene.end;
  }
  if (cursor < duration - 0.01) scenes.push({ start: cursor, end: duration, caption: "", visual: "Giữ nguyên phần còn lại của clip.", layout: "speaker", items: [] });
  return { ...plan, scenes };
}

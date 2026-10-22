import type {EditPlan,StudioJob} from './types';
type Speech={start:number;end:number;text:string};
const directive=/(?:từng|mỗi)\s+(?:câu|ý|đoạn\s+lời)/i;

export function sentenceEffectsRequested(notes:string,feedback:StudioJob['feedback']=[],conceptInstructions='') {
 const latest=[...feedback].reverse().find(f=>directive.test(f.text))?.text || (directive.test(notes)?notes:conceptInstructions);
 if(!directive.test(latest)||!/(hiệu ứng|minh họa|chuyển động|mô tả)/i.test(latest))return false;
 return !/(?:không|đừng|bỏ)\s+(?:cần\s+)?(?:hiệu ứng\s+|minh họa\s+|cho\s+)?(?:từng|mỗi)\s+(?:câu|ý|đoạn)/i.test(latest);
}

/** Reusable local motion vocabulary. No LLM, images or network tokens per sentence. */
export function sentenceMetaphor(text:string):{kind:string;caption:string;number?:string} {
 const t=text.toLocaleLowerCase();
 const cue=(kind:string,caption:string)=>({kind,caption});
 if(/cây|cây xanh/.test(t)&&/góc|quay/.test(t))return cue('garden','Đưa cây xanh\nvào góc quay');
 if(/mặt|gương mặt/.test(t)&&/sáng/.test(t))return cue('portrait','Ánh sáng\ntrên gương mặt');
 if(/cửa/.test(t)&&/sáng/.test(t))return cue('window','Ra gần cửa.\nLấy sáng thật.');
 if(/ánh sáng/.test(t))return cue('sun','Tìm hướng\ncó ánh sáng');
 if(/đứng ngoài|vị trí|góc quay/.test(t))return cue('location','Thử một\nvị trí khác');
 if(/điện thoại/.test(t))return cue('phone','Một chiếc\nđiện thoại');
 if(/quay phim|chụp ảnh|thiết bị|camera|máy quay/.test(t))return cue('gear','Máy quay.\nĐèn. Thiết bị.');
 if(/chi phí|tốn tiền|thuê/.test(t))return cue('cost','Chi phí\nđể bắt đầu');
 if(/nghĩ nhiều|chưa dám|chả dám/.test(t))return cue('overthink','Nghĩ nhiều.\nChưa dám đăng.');
 if(/cái gu|gu riêng|phong cách riêng/.test(t))return cue('palette','Một cách kể.\nMột cái gu.');
 if(/khó khăn|trở ngại|vật cản/.test(t))return cue('obstacle','Gặp khó khăn.\nChia sẻ ra.');
 if(/thời gian/.test(t))return cue('time','Thời gian\ndành để quay');
 if(/mấy video|bao nhiêu video/.test(t))return cue('day','Một ngày\nmấy video?');
 const n=t.match(/(?:^|\s)(một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười|[1-9]|10)\s+video(?:\s|[.,!?]|$)/)?.[1];
 if(n&&!/chưa|không|bao nhiêu|mấy/.test(t)&&/mỗi ngày|một ngày|mục tiêu|thành công/.test(t)) {
  const names:Record<string,string>={'một':'1','hai':'2','ba':'3','bốn':'4','năm':'5','sáu':'6','bảy':'7','tám':'8','chín':'9','mười':'10'};
  return {kind:'goal',caption:'Mục tiêu\nmỗi ngày',number:names[n]||n};
 }
 if(/định hướng/.test(t))return cue('compass','Từ định hướng\nđến thực tế');
 if(/triết lý/.test(t))return cue('plain','Chuyện thật.\nKể giản dị.');
 if(/lý do|tại sao|vì sao/.test(t))return cue('why','Vì sao mình\nlàm điều này?');
 if(/hình ảnh/.test(t))return cue('image','Đằng sau\nmột hình ảnh');
 if(/quy trình|các bước|từng bước/.test(t))return cue('recipe','Từng bước.\nTừng quy trình.');
 if(/không làm nấu ăn/.test(t))return cue('food-no','Chọn lại\nđiều mình kể');
 if(/nấu ăn|món ăn/.test(t))return cue('food-channel','Món ăn\nthành chủ đề');
 if(/chẳng giỏi|không giỏi/.test(t))return cue('doubt','Mình giỏi\nđiều gì?');
 if(/không chuyên/.test(t))return cue('puzzle','Chọn điều\nmình hiểu rõ');
 if(/mình giỏi|điểm mạnh/.test(t))return cue('skill','Nhìn lại\nđiểm mạnh');
 if(/khoảnh khắc|trải nghiệm/.test(t))return cue('memories','Ghi lại\nkhoảnh khắc thật');
 if(/tích lũy|phát triển bản thân/.test(t))return cue('growth','Tích lũy\nvà phát triển');
 if(/ngách/.test(t))return cue('niche','Tìm một\ngách cụ thể');
 if(/thói quen/.test(t))return cue('habit','Bắt đầu từ\nthói quen');
 if(/người xem|thu hút|nhu cầu/.test(t))return cue('audience','Đúng chuyện.\nĐúng người xem.');
 if(/dám chia sẻ/.test(t))return cue('courage','Dám kể\ncuộc sống mình');
 if(/phong cách sống|đời sống|hàng ngày/.test(t))return cue('lifestyle','Kể về\ncuộc sống thật');
 if(/làm đi|đăng|làm video/.test(t))return cue('publish','Cứ bắt đầu\nlàm video');
 return cue('share','Chia sẻ\ncâu chuyện ra');
}

export function sentenceEffectsPlan(segments:Speech[],duration:number,title:string,retained?:EditPlan):EditPlan {
 if(!segments.length||segments.length>80)throw new Error('Chế độ minh họa từng câu hỗ trợ tối đa 80 đoạn lời mỗi bản dựng.');
 const starts=segments.map((s,i)=>i===0?0:Math.round(s.start*30)/30);
 const cues=segments.map((s,i)=>{
  const start=starts[i],end=i+1<segments.length?starts[i+1]:duration;
  if(end-start<.25)throw new Error('Hai mốc lời quá gần nhau để minh họa rõ; cần gộp hoặc sửa mốc phụ đề.');
  const m=sentenceMetaphor(s.text);
  return {start,end,caption:m.caption,layout:'creator' as const,items:m.kind==='goal'?['goal',m.number!]:['sentence',m.kind],visual:`Minh họa câu: ${s.text}`};
 });
 // Restyling must not restore silence or discarded takes from the cut plan.
 const ranges:{start:number;end:number}[]=[];
 for(const scene of retained?.scenes || [{start:0,end:duration}]){
  const last=ranges.at(-1);
  if(last&&Math.abs(last.end-scene.start)<.00001)last.end=scene.end;
  else ranges.push({start:scene.start,end:scene.end});
 }
 const scenes=ranges.flatMap(range=>{
  const pieces=cues.flatMap(c=>{const start=Math.max(c.start,range.start),end=Math.min(c.end,range.end);return end>start?[{...c,start,end}]:[];});
  // A cut next to a sentence boundary can leave a sub-frame-sized style cue.
  // Merge only touching source intervals; never bridge a discarded interval.
  for(let i=0;i<pieces.length;){
   if(pieces[i].end-pieces[i].start>=.25){i++;continue;}
   if(i>0){pieces[i-1].end=pieces[i].end;pieces.splice(i,1);}
   else if(pieces.length>1){pieces[1].start=pieces[0].start;pieces.shift();}
   else throw new Error('Khoảng nguồn quá ngắn để minh họa.');
  }
  return pieces;
 });
 if(scenes.length>80)throw new Error('Bản dựng có hơn 80 khoảng minh họa; cần chia thành các phần ngắn hơn.');
 return {title,summary:'Minh họa theo từng đoạn lời, giữ giọng gốc và các khoảng đã cắt. Chọn vật thể bằng bộ quy tắc chạy local.',scenes};
}

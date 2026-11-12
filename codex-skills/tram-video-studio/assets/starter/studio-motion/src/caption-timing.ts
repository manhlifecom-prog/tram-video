type TimedCaption = {text:string;startMs:number;endMs:number;timing?:"word"|"phrase"};

export function captionGroupAt<T extends TimedCaption>(captions:T[],time:number) {
  const active=captions.findIndex(c=>time>=c.startMs && time<c.endMs);
  if(active<0) return null;
  const isWord=(c:TimedCaption)=>c.timing==='word' || (!c.timing && captions.every(item=>item.text.trim().split(/\s+/).length===1));
  if(!isWord(captions[active])) return {wordLevel:false,active:0,group:[captions[active]]};
  let begin=active;
  while(begin>0 && isWord(captions[begin-1]) && captions[begin].startMs-captions[begin-1].endMs<=650) begin--;
  // Anchor pages at the start of each continuous sequence of timed words.
  begin+=Math.floor((active-begin)/5)*5;
  let end=begin+1;
  while(end<captions.length && end-begin<5 && isWord(captions[end]) && captions[end].startMs-captions[end-1].endMs<=650) end++;
  return {wordLevel:true,active:active-begin,group:captions.slice(begin,end)};
}

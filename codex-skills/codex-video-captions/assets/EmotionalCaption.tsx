import React from 'react';
export type Cue={start:number;end:number;text:string;key?:string};
export type TextChoice={start:number;mode:string;emotion:string;reason:string;lead?:string;main?:string;tail?:string;icon?:string;wordOnsets?:number[];lines?:string[];bodySize?:number;keySize?:number;tokenOnsets?:number[];leadOnset?:number;mainOnsets?:number[];tailOnset?:number};
const e=(x:number)=>{const q=Math.max(0,Math.min(1,x));return q*q*(3-2*q)};
function Emotion({kind,age}:{kind:string;age:number}){
 const q=e(age/.28),bob=Math.sin(age*3)*3;
 return <svg width="58" height="58" viewBox="0 0 64 64" style={{display:'inline-block',verticalAlign:'middle',margin:'0 12px',opacity:q,transform:`translateY(${bob-10*(1-q)}px) scale(${.8+.2*q})`}}>
 {kind==='heart'?<path d="M32 52C-9 28 15 1 32 20C49 1 73 28 32 52Z" fill="#f0bac6"/>:kind==='question'?<><circle cx="32" cy="32" r="26" stroke="#c3efe5" strokeWidth="3" fill="#13232c"/><path d="M23 23C23 9 48 13 42 28L32 37" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"/><circle cx="32" cy="46" r="2.6" fill="white"/></>:<><circle cx="32" cy="32" r="26" stroke="#c3efe5" strokeWidth="3" fill="#13232c"/><circle cx="23" cy="27" r="2.5" fill="white"/><circle cx="41" cy="27" r="2.5" fill="white"/><path d="M21 38Q32 50 43 38" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/></>}
 </svg>
}
function Burst({age}:{age:number}){
 const t=Math.max(0,age),p=e(t/.72);if(age<0||age>1.05)return null;
 return <svg viewBox="0 0 600 260" style={{position:'absolute',width:600,height:260,left:'50%',top:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none',overflow:'visible'}}>
 {Array.from({length:18},(_,i)=>{const a=i*2.39996,r=42+125*p,alpha=e(t/.08)*(1-e((t-.32)/.55));return <g key={i} transform={`translate(${300+Math.cos(a)*r} ${130+Math.sin(a)*r*.56+35*p*p}) rotate(${i*35+p*90})`} opacity={alpha}>
 {i%3===0?<path d="M-7 0H7M0-7V7" stroke={i%2?'#9eead4':'#fff'} strokeWidth="2.5"/>:<rect x="-3" y="-6" width="6" height="12" rx="2" fill={i%2?'#a5efd9':'#fff'}/>}
 </g>})}
 </svg>
}
function Key({text,age,mode,size=76}:{text:string;age:number;mode:string;size?:number}){
 const show=e(age/.14),h=Math.max(0,age);
 let y=12*(1-show),scale=.96+.04*show,rotate=0,x=0;
 if(mode==='spring'){y-=Math.sin(h*19)*Math.exp(-h*5.7)*17;scale+=.13*Math.sin(h*19)*Math.exp(-h*5.7)}
 if(mode==='tension'){x=Math.sin(h*38)*Math.exp(-h*5)*4;scale+=.055*Math.sin(h*15)*Math.exp(-h*5)}
 if(mode==='curious'){rotate=Math.sin(h*16)*Math.exp(-h*4.5)*5}
 const calm=mode==='calm';
 return <span style={{display:'inline-block',position:'relative',margin:'0 3px',color:calm?'#e8fff5':'#b3f8df',fontWeight:850,fontStyle:'italic',fontSize:size,lineHeight:1.13,opacity:show,transform:`translate(${x}px,${y}px) scale(${scale}) rotate(${rotate}deg)`,transformOrigin:'50% 75%',textShadow:calm?`0 0 ${8+3*Math.sin(h*2)}px #b1e9d04a,0 3px 12px #030914`:'0 3px 12px #030914'}}>
 {text}
 {(mode==='shine'||mode==='curious')&&h<.72&&<span aria-hidden style={{position:'absolute',inset:0,color:'#fff',clipPath:`polygon(${-35+h*230}% 0,${-15+h*230}% 0,${-36+h*230}% 100%,${-56+h*230}% 100%)`,filter:'drop-shadow(0 0 5px #fff8)'}}>{text}</span>}
 {mode==='burst'&&<Burst age={h-.08}/>}
 </span>
}
function WordCaption({cue,t,top,choice}:{cue:Cue;t:number;top:number;choice:TextChoice}){
 const age=t-cue.start,words=cue.text.split(/\s+/),key=cue.key??'',keyStart=key?cue.text.indexOf(key):-1,keyEnd=keyStart+key.length;
 let cursor=0;const items=words.map(word=>{const start=cursor;cursor+=word.length+1;return {word,marked:keyStart>=0&&start<keyEnd&&start+word.length>keyStart}});
 const lastMarked=items.reduce((last,w,i)=>w.marked?i:last,-1),body=choice.bodySize??57,keySize=choice.keySize??75;
 const alpha=e(age/.10)*e((cue.end-t)/.12);
 let index=0;const groups=(choice.lines??[cue.text]).map(line=>line.split(/\s+/).map(()=>index++));
 const renderWord=(i:number)=>{const {word,marked}=items[i];
 const onset=choice.wordOnsets?.[i]??i*Math.min(.14,(cue.end-cue.start-.7)/words.length),hit=age-onset,q=e(hit/.15),h=Math.max(0,hit);
 let y=12*(1-q),rotate=0,scale=.96+.04*q;
 if(choice.mode==='word-spring'){y-=Math.sin(h*20)*Math.exp(-h*6)*(marked?19:7);scale+=(marked?.15:.04)*Math.sin(h*20)*Math.exp(-h*6)}
 if(choice.mode==='word-curious'){rotate=Math.sin(h*17)*Math.exp(-h*5)*(marked?5:1.4);y=8*(1-q)}
 if(choice.mode==='word-soft'){y=7*(1-q);scale=.985+.015*q}
 if(choice.mode==='word-spark'&&marked){y-=Math.sin(h*18)*Math.exp(-h*7)*9}
 return <span key={i} style={{display:'inline-block',position:'relative',marginRight:12,opacity:q,fontSize:marked?keySize:body,fontWeight:marked?850:600,fontStyle:marked?'italic':undefined,color:marked?(choice.mode==='word-soft'?'#f4dbe0':'#b7f8e3'):'#fff',transform:`translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`,transformOrigin:'50% 75%'}}>
 {word}{choice.mode==='word-spark'&&marked&&i===lastMarked&&<Burst age={h-.05}/>}
 </span>};
 return <div style={{position:'absolute',left:75,right:145,top:top-4,textAlign:'center',fontSize:body,fontWeight:600,lineHeight:1.25,color:'white',opacity:alpha,textShadow:'0 3px 12px #020916,0 1px 4px #020916'}}>
 {groups.map((group,lineIndex)=><div key={lineIndex} style={{whiteSpace:'nowrap',marginTop:lineIndex?10:0}}>{group.map(renderWord)}{lineIndex===groups.length-1&&choice.icon&&<Emotion kind={choice.icon} age={age-(choice.wordOnsets?.[lastMarked]??.8)}/>}</div>)}
 </div>
}

function TimedPhraseCaption({cue,t,top,choice}:{cue:Cue;t:number;top:number;choice:TextChoice}){
 const age=t-cue.start,key=cue.key??'',keyStart=key?cue.text.indexOf(key):-1,keyEnd=keyStart+key.length,body=choice.bodySize??52;
 let char=0,index=0;const items=cue.text.split(/\s+/).map(word=>{const start=char;char+=word.length+1;return {word,at:choice.tokenOnsets?.[index++]??0,marked:keyStart>=0&&start<keyEnd&&start+word.length>keyStart}});
 let token=0;const lines=(choice.lines??[cue.text]).map(line=>{const groups:{text:string;at:number;marked:boolean}[]=[];for(const _word of line.split(/\s+/)){const item=items[token++],last=groups.at(-1);if(last&&last.marked===item.marked&&Math.abs(last.at-item.at)<.001)last.text+=' '+item.word;else groups.push({text:item.word,at:item.at,marked:item.marked})}return groups});
 const keyOnset=Math.max(0,...items.filter(x=>x.marked).map(x=>x.at));
 return <div style={{position:'absolute',left:75,right:145,top:top-6,textAlign:'center',opacity:e((cue.end-t)/.12),fontSize:body,fontWeight:600,lineHeight:1.25,color:'#fff',letterSpacing:-.4,textShadow:'0 3px 12px #020916,0 1px 4px #020916'}}>
 {lines.map((groups,i)=><div key={i} style={{whiteSpace:'nowrap',marginTop:i?9:0}}>{groups.map((g,j)=><React.Fragment key={j}>{g.marked?<Key text={g.text} age={age-g.at} mode={choice.mode} size={choice.keySize??78}/>:<span style={{opacity:e((age-g.at)/.10)}}>{g.text}</span>}{j<groups.length-1?' ':null}</React.Fragment>)}{groups.some(x=>x.marked)&&choice.icon&&<Emotion kind={choice.icon} age={age-keyOnset}/>}</div>)}
 </div>
}

export function EmotionalCaption({cue,t,top,choice}:{cue:Cue;t:number;top:number;choice?:TextChoice}){
 const a=t-cue.start,d=cue.end-cue.start,mode=choice?.mode??'reveal',opacity=e(a/.11)*e((cue.end-t)/.12);
 if(choice?.mode.startsWith('word-'))return <WordCaption cue={cue} t={t} top={top} choice={choice}/>;
 if(choice?.main){
  const lines=choice.main.split('\n');
  return <div style={{position:'absolute',left:80,right:150,top:top-35,textAlign:'center',opacity,color:'white',textShadow:'0 3px 14px #020b16',lineHeight:1.15}}>
   {choice.lead&&<div style={{fontSize:39,fontWeight:500,opacity:e((a-(choice.leadOnset??0))/.12),marginBottom:12}}>{choice.lead}</div>}
   {lines.map((line,i)=>{const onset=choice.mainOnsets?.[i]??i*.17,q=e((a-onset)/.12),h=Math.max(0,a-onset);return <div key={line} style={{fontSize:lines.length>1?(i===lines.length-1?96:64):90,fontWeight:i===lines.length-1?800:600,fontStyle:i===lines.length-1?'italic':undefined,marginBottom:8,opacity:q,transform:`translateY(${24*(1-q)-(mode==='spring'?Math.sin(h*18)*Math.exp(-h*6)*11:0)}px)`}}>{line}</div>})}
   {choice.tail&&<div style={{fontSize:43,marginTop:13,opacity:e((a-(choice.tailOnset??.3))/.12)}}>{choice.tail}</div>}
  </div>
 }
 if(choice?.tokenOnsets)return <TimedPhraseCaption cue={cue} t={t} top={top} choice={choice}/>;
 if(choice?.lines){
  const key=cue.key??'',keyLine=key?choice.lines.findIndex(line=>line.includes(key)):-1,body=choice.bodySize??52;let chunkIndex=0;
  return <div style={{position:'absolute',left:75,right:145,top:top-6,textAlign:'center',opacity,color:'#fff',fontSize:body,fontWeight:600,lineHeight:1.25,letterSpacing:-.4,textShadow:'0 3px 12px #020916,0 1px 4px #020916'}}>
   {choice.lines.map((line,i)=>{const k=key?line.indexOf(key):-1;
    if(k>=0){const tail=line.slice(k+key.length),punct=tail.match(/^[,.;:!?]+/)?.[0]??'';return <div key={i} style={{whiteSpace:'nowrap',marginTop:i?9:0}}><span style={{opacity:e(a/.14)}}>{line.slice(0,k)}</span><Key text={key+punct} age={a-Math.min(.28,d*.21)} mode={mode} size={choice.keySize??78}/><span style={{opacity:e((a-Math.min(.43,d*.32))/.14)}}>{tail.slice(punct.length)}</span>{choice.icon&&<Emotion kind={choice.icon} age={a-Math.min(.28,d*.21)}/>}</div>}
    const parts=line.match(/(?:\S+\s*){1,3}/g)??[line];return <div key={i} style={{whiteSpace:'nowrap',marginTop:i?9:0}}>{parts.map((part,j)=>{const onset=keyLine>=0?(i>keyLine?Math.min(.43,d*.32):chunkIndex++*Math.min(.12,d/12)):chunkIndex++*Math.min(.16,d/12);return <span key={j} style={{opacity:e((a-onset)/.14)}}>{part}</span>})}</div>
   })}
  </div>
 }
 const key=cue.key,at=key?cue.text.indexOf(key):-1,marked=at>=0&&!!key,tail=marked?cue.text.slice(at+key!.length):'',punct=tail.match(/^[,.;:!?]+/)?.[0]??'';
 const parts=marked?[cue.text.slice(0,at),key!+punct,tail.slice(punct.length)]:(cue.text.match(/(?:\S+\s*){1,3}/g)??[cue.text]);
 return <div style={{position:'absolute',left:75,right:150,top:top-6,textAlign:'center',opacity,color:'#fff',fontSize:58,fontWeight:700,lineHeight:1.24,letterSpacing:-.6,textShadow:'0 3px 12px #020916,0 1px 4px #020916',textWrap:'balance'}}>
 {parts.map((part,i)=>{const emphasized=marked&&i===1;const onset=marked?(emphasized?Math.min(.28,d*.21):i===2?Math.min(.43,d*.32):0):i*Math.min(.16,d/(parts.length+1));return emphasized?<React.Fragment key={i}><Key text={part} age={a-onset} mode={mode}/>{choice?.icon&&<Emotion kind={choice.icon} age={a-onset}/>}</React.Fragment>:<span key={i} style={{opacity:e((a-onset)/.14)}}>{part}</span>})}
 </div>
}

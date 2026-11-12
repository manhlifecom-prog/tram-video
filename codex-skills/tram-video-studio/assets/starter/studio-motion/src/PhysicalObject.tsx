import { useId } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { GraphicNode } from "../../src/lib/studio/graphic-spec";

/** Original dimensional props that the director composes around the spoken idea. */
export function PhysicalObject({node, accent}: {node: GraphicNode; accent: string}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const local = Math.max(0, frame / fps - node.delay);
  const p = interpolate(local, [0.1, 1.6], [0, 1], {extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const metal = `url(#metal${id})`, glow = `url(#accent${id})`;
  const label = node.text.slice(0, 32);
  return <svg width={node.w} height={node.h || node.w} viewBox="0 0 300 300" overflow="visible">
    <defs>
      <linearGradient id={`metal${id}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f7f7f3"/><stop offset=".32" stopColor="#b6c3c0"/><stop offset=".52" stopColor="#eff0e9"/><stop offset="1" stopColor="#556f68"/></linearGradient>
      <linearGradient id={`accent${id}`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#fff7dd"/><stop offset=".25" stopColor={accent}/><stop offset="1" stopColor="#403223"/></linearGradient>
      <linearGradient id={`screen${id}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#253b38"/><stop offset="1" stopColor="#07110f"/></linearGradient>
      <filter id={`shadow${id}`} x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#020c09" floodOpacity=".35"/></filter>
    </defs>
    <ellipse cx="150" cy="276" rx="85" ry="12" fill="#06120f" opacity=".18"/>
    <g filter={`url(#shadow${id})`}>
      {node.kind === "phone" && <g transform={`translate(0 ${Math.sin(local * 1.5)*4}) rotate(-8 150 150)`}>
        <rect x="82" y="18" width="151" height="251" rx="26" fill="#101a18"/>
        <rect x="70" y="12" width="151" height="251" rx="26" fill={metal} stroke="#e6ede6" strokeWidth="2"/>
        <rect x="77" y="19" width="137" height="237" rx="20" fill={`url(#screen${id})`}/>
        <rect x="121" y="26" width="52" height="10" rx="6" fill="#030807"/>
        <circle cx="146" cy="106" r="37" fill={glow}/>
        <path d="m139 91 23 15-23 15Z" fill="#fff9e9"/>
        {[0,1,2,3,4,5,6,7,8].map(i=><rect key={i} x={99+i*11} y={169-(6+Math.sin(local*7+i)*9)} width="5" height={12+Math.sin(local*7+i)*9} rx="3" fill={accent} opacity=".8"/>)}
        <text x="145" y="217" textAnchor="middle" fill="#fffdf5" fontSize="17" fontWeight="700">{label.slice(0,18)}</text>
        <rect x="119" y="241" width="52" height="4" rx="2" fill="#fff" opacity=".55"/>
      </g>}
      {node.kind === "box" && <g>
        <path d="m50 133 102-39 103 42-103 45Z" fill="#f4f0e7"/>
        <path d="m50 133 102 48v85L50 217Z" fill="#bec8c1"/>
        <path d="m152 181 103-45v81l-103 49Z" fill="#6e8279"/>
        <g transform={`translate(0 ${-p*48})`}><path d="m43 110 109-42 110 44-110 46Z" fill={metal}/><path d="m43 110 109 48v18L43 130Z" fill="#dfe4da"/><path d="m152 158 110-46v19l-110 45Z" fill="#8a9f93"/><path d="m97 90 112 44 22-8L118 82Z" fill={glow}/></g>
        <path d="m78 164 47 21v29l-47-23Z" fill="#eff0e5" opacity=".8"/>
      </g>}
      {node.kind === "clock" && <g>
        <rect x="132" y="22" width="36" height="25" rx="6" fill={metal}/><rect x="119" y="12" width="62" height="17" rx="7" fill={metal}/>
        <circle cx="150" cy="157" r="110" fill={metal}/><circle cx="150" cy="157" r="100" fill="#102c27"/><circle cx="150" cy="157" r="91" fill="#0a1d1a" stroke="#82988b" strokeWidth="1"/>
        {Array.from({length:60},(_,i)=><path key={i} d={i%5===0?"M150 72v11":"M150 74v5"} stroke={i%5===0?"#e9efdf":"#5d7d71"} strokeWidth={i%5===0?3:1} transform={`rotate(${i*6} 150 157)`}/>)}
        <path d="M150 157v-57" stroke="#faf7ea" strokeWidth="7" strokeLinecap="round" transform="rotate(54 150 157)"/>
        <path d="M150 174V79" stroke={accent} strokeWidth="3" strokeLinecap="round" transform={`rotate(${local*40} 150 157)`}/><circle cx="150" cy="157" r="7" fill={accent}/>
      </g>}
      {node.kind === "battery" && <g transform="rotate(-8 150 150)">
        <rect x="258" y="111" width="18" height="73" rx="7" fill={metal}/><rect x="23" y="88" width="238" height="123" rx="18" fill={metal}/><rect x="31" y="96" width="220" height="107" rx="12" fill="#0d1e19"/>
        {Array.from({length:8},(_,i)=><rect key={i} x={41+i*26} y="108" width="21" height="82" rx="5" fill={i/8<p?glow:"#30463a"}/>)}
      </g>}
      {node.kind === "gear" && <g transform={`rotate(${local*18} 150 150)`}>
        {Array.from({length:12},(_,i)=><rect key={i} x="132" y="37" width="36" height="52" rx="6" fill={glow} transform={`rotate(${i*30} 150 150)`}/>)}
        <circle cx="150" cy="150" r="86" fill={glow} stroke="#ffdca0" strokeWidth="2"/>
        {Array.from({length:6},(_,i)=><circle key={i} cx="150" cy="98" r="15" fill="#172d23" transform={`rotate(${i*60} 150 150)`}/>)}
        <circle cx="150" cy="150" r="26" fill="#0c1e18" stroke="#a8793b" strokeWidth="4"/>
      </g>}
      {node.kind === "book" && <g transform="rotate(-6 150 150)">
        <path d="M28 66q67-22 122 9 55-31 122-9v181q-64-20-122 2-58-22-122-2Z" fill="#14281e"/>
        <path d="M33 57q61-15 117 13v170q-60-24-117-12Z" fill="#e4dfc9"/><path d="M150 70q61-28 116-13v171q-59-12-116 12Z" fill="#faf6e7"/>
        <path d="M150 70v170" stroke="#b0aa8d" strokeWidth="2"/>
        {[0,1,2,3,4,5].map(i=><g key={i} opacity={p>i/7?.75:.1}><path d={`M49 ${92+i*20}q40-5 85 13M167 ${105+i*20}q40-18 83-13`} stroke={i===2?accent:"#8f9480"} strokeWidth={i===2?7:3}/></g>)}
      </g>}
    </g>
  </svg>;
}

import React from 'react';import {Img,staticFile,spring,useVideoConfig} from 'remotion';
const e=(v:number)=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
export function ArtVignettes({t,windows,file}:{t:number;windows:any[];file:string}){
 const {fps}=useVideoConfig(),v=windows.find(v=>t>=v.a&&t<v.b);if(!v)return null;
 const p=spring({frame:Math.max(0,(t-v.a)*fps),fps,config:{damping:18,stiffness:180,mass:.8}}),contact=e((t-v.at)/.5),shine=e((t-v.at)/.8),alpha=e((t-v.a)/.2)*e((v.b-t)/.2);
 return <div style={{position:'absolute',left:v.x,top:v.y,width:v.size,height:v.size,perspective:1200,opacity:alpha,pointerEvents:'none'}}>
  <div style={{position:'absolute',inset:0,borderRadius:40,overflow:'hidden',background:'var(--material-highlight)',border:'2px solid var(--material-highlight)',boxShadow:'14px 24px 0 var(--caption-shadow),0 35px 55px var(--caption-shadow)',transform:`translateY(${90*(1-p)}px) rotateY(${-20*(1-contact)}deg) rotateZ(${(v.id==='phone'?-6:5)*(1-contact)}deg) scale(${.78+.22*p})`,transformOrigin:'50% 75%'}}>
   <Img src={staticFile(file)} style={{position:'absolute',width:'200%',height:'200%',maxWidth:'none',left:v.q%2?'-100%':0,top:v.q>=2?'-100%':0}}/>
   {t>=v.at&&t<v.at+.8&&<div style={{position:'absolute',inset:0,background:'linear-gradient(110deg,transparent 25%,var(--caption-shadow) 48%,transparent 65%)',transform:`translateX(${-120+shine*260}%)`}}/>}
  </div>
 </div>;
}

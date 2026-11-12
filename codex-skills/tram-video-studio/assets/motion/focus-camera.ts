import {Easing, interpolate} from 'remotion';
export type FocusCue={start:number;hold:number;endhold:number;end:number;x:number;y:number;zoom:number};
/** Seconds, source-space focal point; put the matrix on graphics only, outside their camera group keep captions/face. */
export const focusCamera=(seconds:number,cues:FocusCue[],center={x:680,y:565})=>{
 const c=cues.find(c=>seconds>=c.start&&seconds<=c.end);
 if(!c)return 'matrix(1 0 0 1 0 0)';
 const options={extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.42,0,.58,1)} as const;
 const w=interpolate(seconds,[c.start,c.hold],[0,1],options)*(1-interpolate(seconds,[c.endhold,c.end],[0,1],options));
 const z=1+(c.zoom-1)*w;
 return `matrix(${z} 0 0 ${z} ${w*(center.x-c.x)-(c.zoom-1)*c.x*w} ${w*(center.y-c.y)-(c.zoom-1)*c.y*w})`;
};

import {useEffect,useState} from 'react';
/** Playback state for a bounded teaching replay. Remount for a different trace. */
export function useTracePlayback(total:number){
 const [step,setStep]=useState(0);const [playing,setPlaying]=useState(false);const [speed,setSpeed]=useState(1);const atEnd=step>=total;
 useEffect(()=>{if(!playing||atEnd)return;const timer=window.setTimeout(()=>setStep(value=>Math.min(value+1,total)),1200/speed);return()=>window.clearTimeout(timer);},[playing,atEnd,step,total,speed]);
 useEffect(()=>{const pause=()=>{if(document.hidden)setPlaying(false);};document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause);},[]);
 return {step,playing:playing&&!atEnd,speed,atEnd,setSpeed,seek:(value:number)=>{setPlaying(false);setStep(Math.max(0,Math.min(total,value)));},toggle:()=>{if(atEnd)setStep(0);setPlaying(value=>atEnd||!value);}};
}

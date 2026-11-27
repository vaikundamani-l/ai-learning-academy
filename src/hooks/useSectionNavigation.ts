import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

/** Handle section deep links, including sections rendered by lazy lesson modules. */
export function useSectionNavigation(){
 const {pathname,hash,key}=useLocation();
 useEffect(()=>{
  if(!hash)return;
  let id:string;
  try{id=decodeURIComponent(hash.slice(1));}catch{return;}
  if(!id)return;
  let frame:number|undefined;
  const scroll=()=>{
   const target=document.getElementById(id);
   if(!target)return false;
   frame=window.requestAnimationFrame(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+window.scrollY-96),behavior:reduced?'auto':'smooth'});
    if(id==='main-content')target.focus({preventScroll:true});
   });
   return true;
  };
  if(scroll())return()=>{if(frame!==undefined)window.cancelAnimationFrame(frame);};
  // The route may initially show Suspense's fallback. Wait for its target, not a fixed delay.
  const observer=new MutationObserver(()=>{if(scroll())observer.disconnect();});
  observer.observe(document.getElementById('main-content')??document.body,{childList:true,subtree:true});
  return()=>{observer.disconnect();if(frame!==undefined)window.cancelAnimationFrame(frame);};
 },[pathname,hash,key]);
}

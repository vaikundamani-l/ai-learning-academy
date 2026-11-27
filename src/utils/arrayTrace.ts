import type {ArrayOperation,ArrayFill,ArrayPosition} from '../data/arrayContent';
export interface ArrayCounts{initialized:number;copies:number;shifts:number;stores:number;clears:number;}
export interface ArrayFrame{phase:string;detail:string;buffer:(number|null)[];candidate:(number|null)[]|null;size:number;peak:number;counts:ArrayCounts;active:number[];result:string;}
export const arrayUnits=(counts:ArrayCounts)=>Object.values(counts).reduce((sum,value)=>sum+value,0);
export function arrayTrace(operation:ArrayOperation,fill:ArrayFill,position:ArrayPosition){
 if(!['append','insert','pop','invalid'].includes(operation)||!['spare','full'].includes(fill)||!['first','middle','last'].includes(position))throw new RangeError('Choose a supported array fixture.');
 const initial=fill==='spare'?[10,20,30]:[10,20,30,40];let buffer:(number|null)[]=[...initial,...Array(4-initial.length).fill(null)];let candidate:(number|null)[]|null=null;let size=initial.length;let peak=4;const counts:ArrayCounts={initialized:0,copies:0,shifts:0,stores:0,clears:0};const frames:ArrayFrame[]=[];
 const index=operation==='append'?size:operation==='invalid'?size+1:position==='first'?0:position==='middle'?Math.floor(size/2):operation==='insert'?size:size-1;
 const record=(phase:string,detail:string,active:number[]=[],result='not returned')=>frames.push({phase,detail,buffer:[...buffer],candidate:candidate?[...candidate]:null,size,peak,counts:{...counts},active:[...active],result});
 record('Validate',`Start with size ${size}, capacity 4. Counters reset after preparing the fixture. Index for this command: ${index}.`);
 if(operation==='invalid'){record('Rejected','The index is beyond the live range. Validate before allocating or moving references; no state or counter changes.',[],'IndexError');return{initial,index,frames};}
 if(operation!=='pop'&&size===buffer.length){
 candidate=Array(8).fill(null);counts.initialized+=8;peak=12;record('Allocate','Initialize a new eight-slot buffer. The old four slots still exist: peak 12 logical slots.');
 for(let i=0;i<size;i++){candidate[i]=buffer[i];counts.copies++;record('Copy',`Copy reference at index ${i} into the same position in the candidate. The payload object is not deep-copied.`,[i]);}
 buffer=candidate;candidate=null;record('Switch','Publish the new backing buffer after copying. Size remains unchanged; capacity is now 8.');
 }
 if(operation==='pop'){
 const removed=buffer[index];for(let i=index;i<size-1;i++){buffer[i]=buffer[i+1];counts.shifts++;record('Shift left',`Move reference ${i+1} → ${i}. The buffer is mid-operation; boundary invariants are checked after completion.`,[i,i+1]);}
 buffer[size-1]=null;counts.clears++;size--;record('Clear tail','Clear the former last live slot, reduce size and keep capacity. No shrinking is performed.',[],String(removed));
 }else{
 if(operation==='insert')for(let i=size;i>index;i--){buffer[i]=buffer[i-1];counts.shifts++;record('Shift right',`Move reference ${i-1} → ${i}, working right-to-left so an unread source is preserved.`,[i-1,i]);}
 buffer[index]=90;counts.stores++;size++;record('Store',`Store the new reference 90 at index ${index}, then increase size. Live elements occupy exactly the first ${size} slots.`,[index],'complete');
 }
 return{initial,index,frames};
}
export function appendCosts(policy:'double'|'one',m:number){
 if(!['double','one'].includes(policy)||!Number.isInteger(m)||m<0||m>1024)throw new RangeError('Use a known policy and integer batch size 0–1024.');
 let capacity=0,initialized=0,copies=0,stores=0,peak=0;const rows:{size:number;capacity:number;copies:number;initialized:number;stores:number;total:number;last:number;peak:number}[]=[];
 for(let n=0;n<m;n++){const before=initialized+copies+stores;if(n===capacity){const next=policy==='double'?Math.max(1,capacity*2):capacity+1;initialized+=next;copies+=n;peak=Math.max(peak,capacity+next);capacity=next;}stores++;rows.push({size:n+1,capacity,copies,initialized,stores,total:initialized+copies+stores,last:initialized+copies+stores-before,peak});}
 return rows;
}

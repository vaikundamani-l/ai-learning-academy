import type {UpdateMode} from '../data/pythonConcurrencyContent';
export interface ConcurrencyFrame {task:'A'|'B'|'Parent';operation:string;count:number;snapshots:{A:number|null;B:number|null};states:{A:string;B:string};events:string[];explanation:string;}
/** Three chosen cooperative schedules, not an OS scheduler or arbitrary Python runtime. */
export function concurrencyTrace(mode:UpdateMode){
 if(!['unsafe','locked','owned'].includes(mode))throw new RangeError('Choose a known update strategy.');
 const frames:ConcurrencyFrame[]=[];let count=0;const snapshots:{A:number|null;B:number|null}={A:null,B:null};const states={A:'ready',B:'ready'};const events:string[]=[];
 const add=(task:ConcurrencyFrame['task'],operation:string,explanation:string)=>frames.push({task,operation,explanation,count,snapshots:{...snapshots},states:{...states},events:[...events]});
 const read=(task:'A'|'B')=>{snapshots[task]=count;states[task]='running';events.push(`${task}: read ${count}`);add(task,'Read shared count',`${task} stores ${count} in its own snapshot. Later changes to count do not update that snapshot.`);};
 const pause=(task:'A'|'B')=>{states[task]='suspended at sleep(0)';add(task,'Suspend',`${task} yields cooperatively. Its snapshot remains ${snapshots[task]}.`);};
 const write=(task:'A'|'B')=>{count=snapshots[task]!+1;states[task]=mode==='locked'?'update written; lock held':'done';events.push(`${task}: write ${count}`);add(task,'Write snapshot + 1',`${task} writes its saved ${snapshots[task]} plus one. Shared count is now ${count}.`);};
 add('Parent','Create tasks','Both tasks are scheduled. This fixed replay starts with count zero and default cooperative scheduling.');
 if(mode==='unsafe'){read('A');pause('A');read('B');pause('B');write('A');write('B');}
 else if(mode==='locked'){
  add('A','Acquire asyncio lock','A owns the lock across its complete read/modify/write sequence.');read('A');pause('A');states.B='waiting for lock';add('B','Wait for lock','B cannot read count yet. Holding this async lock does not stop unrelated tasks from running.');write('A');states.A='done';add('A','Release lock','The context exits and permits B to acquire the same lock.');states.B='running (lock held)';add('B','Acquire asyncio lock','B can now enter the protected update.');read('B');pause('B');write('B');states.B='done';add('B','Release lock','Both protected updates have completed.');
 }else{
  for(const task of ['A','B'] as const){events.push(`${task}: compute 1`);states[task]='suspended with local contribution';add(task,'Compute local contribution',`${task} owns a result of one, then yields without rewriting shared count.`);}
  states.A='done';states.B='done';add('Parent','Wait for both results','Both independent results are available after successful TaskGroup exit.');count=2;add('Parent','Aggregate once','The parent computes 1 + 1. Only the parent assigns the total.');
 }
 add('Parent','Batch finished',mode==='unsafe'?'Both tasks finished without raising, yet the intended total of two was not preserved.':'The selected strategy preserves the two contributions for this program. It does not promise transaction rollback or general thread safety.');
 return {frames,count,events};
}

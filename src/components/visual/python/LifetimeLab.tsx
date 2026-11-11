import {useState} from 'react';
import {CodeBlock} from '../../learning/CodeBlock';
import {AnimationController} from '../AnimationController';
import {useTracePlayback} from '../../../hooks/useTracePlayback';
import {lifetimeTrace} from '../../../utils/lifetimeTrace';
import {lifetimeProgram,type LifetimeCase} from '../../../data/pythonLifetimeContent';
const phaseLabels:Record<string,string>={
 'Construct manager':'Construct','Enter scope':'Enter','Entry raises':'Entry error','Entry self-cleanup':'Entry cleanup',
 'Caller handles entry error':'Caller','Run body':'Body','Body completes':'Body done','Body requests return':'Return pending',
 'Body raises':'Body error','Exit releases lease':'Exit','Cleanup raises a new error':'Cleanup error',
 'Caller sees cleanup error':'Caller','Caller receives body error':'Caller','Suppress exact ValueError':'Suppressed','Caller receives result':'Caller',
};
function Replay({kind}:{kind:LifetimeCase}){
 const model=lifetimeTrace(kind);const playback=useTracePlayback(model.frames.length);const frame=model.frames[playback.step-1];const [prediction,setPrediction]=useState('');const [checked,setChecked]=useState(false);
 const outcome=kind==='earlyReturn'?'early':kind==='exitError'?'runtime':['bodyError','enterError'].includes(kind)?'value':'normal';
 return <div className="space-y-4 min-w-0"><details><summary className="cursor-pointer py-2 text-cyber-sky">Complete Python program for this path</summary><CodeBlock title="lease_lifetime.py — synthetic resource" code={lifetimeProgram(kind)}/></details>
 <label className="block">Predict what reaches the caller<select aria-label="Lifetime outcome prediction" value={prediction} onChange={e=>{setPrediction(e.target.value);setChecked(false);}} className="block w-full mt-2 p-3 border border-surface-border rounded-lg bg-surface"><option value="">Choose before checking</option><option value="normal">Returns normal</option><option value="early">Returns early</option><option value="value">ValueError propagates</option><option value="runtime">RuntimeError propagates</option></select></label>
 <button disabled={!prediction} onClick={()=>setChecked(true)} className="min-h-11 px-4 py-3 border border-cyber-sky rounded-lg text-cyber-sky disabled:opacity-50">Check lifetime prediction</button>
 {checked&&<p role="status">{prediction===outcome?'Your prediction matches.':'Compare entry, body and exit with your prediction.'} Final lease: inactive. Caller event: {model.events.find(event=>event.startsWith('caller '))}. Cleanup and operation success are separate facts.</p>}
 <dl className="grid sm:grid-cols-3 gap-3 text-sm">{[['Lease state',frame?.active?'active':'inactive'],['Body reached',frame?.bodyReached?'yes':'no'],['Pending control flow',frame?.pending||'none']].map(([label,value])=><div key={label} className="min-w-0 p-4 rounded-xl bg-surface border border-surface-border"><dt className="text-slate-400">{label}</dt><dd className="font-mono break-words text-slate-100 mt-2">{value}</dd></div>)}</dl>
 <p className="font-semibold text-slate-100">{frame?.phase||'Before construction'}</p><p role="status" aria-live={playback.playing?'off':'polite'} className="p-4 rounded-xl border border-cyber-sky/30 bg-cyber-sky/5">{frame?.explanation||'Predict, then inspect which responsibility owns acquisition and cleanup.'}</p>
 <pre aria-label="Lifetime event history" className="p-4 rounded-xl border border-surface-border bg-surface text-sm text-cyber-emerald overflow-x-auto">{frame?.events.join('\n')||'(no events yet)'}</pre>
 <AnimationController currentCycle={playback.step} totalCycles={model.frames.length} unitLabel="Step" isPlaying={playback.playing} speed={playback.speed} phaseLabel={frame?phaseLabels[frame.phase]||frame.phase:'Ready'} onPlayToggle={playback.toggle} onStepForward={()=>playback.seek(playback.step+1)} onStepBackward={()=>playback.seek(playback.step-1)} onReset={()=>playback.seek(0)} onSpeedChange={playback.setSpeed} onSeek={playback.seek}/>
 </div>;
}
export function LifetimeLab(){const [kind,setKind]=useState<LifetimeCase>('bodyError');return <div role="group" aria-label="Context lifetime lab" className="p-4 sm:p-6 rounded-2xl border border-cyber-sky/30 bg-surface-card space-y-5 min-w-0"><p className="text-sm">Fixed source-level paths for a synthetic lease, verified against Python. The browser does not open files or run arbitrary Python. Rewind replays teaching state rather than reversing real side effects.</p><label className="block">Control-flow path<select aria-label="Context lifetime path" value={kind} onChange={e=>setKind(e.target.value as LifetimeCase)} className="block w-full mt-2 p-3 border border-surface-border rounded-lg bg-surface"><option value="success">Body succeeds</option><option value="bodyError">Body raises; exit preserves error</option><option value="earlyReturn">Body returns early</option><option value="enterError">Entry fails and self-cleans</option><option value="suppress">Exit suppresses the body error</option><option value="exitError">Exit raises a new cleanup error</option></select></label><Replay key={kind} kind={kind}/></div>;}

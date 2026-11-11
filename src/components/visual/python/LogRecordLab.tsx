import {useEffect,useState} from 'react';
import {AnimationController} from '../AnimationController';
import {logRecordTrace} from '../../../utils/logRecordTrace';
const fixtures={valid:'[WARN] service=api ms=0042',suffix:'[INFO] service=api ms=12 trailing',range:'[ERROR] service=db ms=2001',unicode:'[INFO] service=api ms=٣',blank:''};
export function LogRecordLab(){
 const [raw,setRaw]=useState<string>(fixtures.valid);const [step,setStep]=useState(0);const [playing,setPlaying]=useState(false);const [speed,setSpeed]=useState(1);const [prediction,setPrediction]=useState('');const [checked,setChecked]=useState(false);
 const model=logRecordTrace(raw);const frame=model.frames[step-1];const atEnd=step>=model.frames.length;
 const seek=(next:number)=>{setPlaying(false);setStep(next);};
 const change=(next:string)=>{setRaw(next);setStep(0);setPlaying(false);setPrediction('');setChecked(false);};
 useEffect(()=>{if(!playing||atEnd)return;const timer=window.setTimeout(()=>setStep(value=>Math.min(value+1,model.frames.length)),1000/speed);return()=>window.clearTimeout(timer);},[playing,atEnd,step,speed,model.frames.length]);
 useEffect(()=>{const pause=()=>{if(document.hidden)setPlaying(false);};document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause);},[]);
 return <div className="p-4 sm:p-6 rounded-2xl border border-cyber-sky/30 bg-surface-card space-y-5 min-w-0" role="group" aria-label="Record grammar lab">
 <p className="text-sm">A deterministic scanner for this one grammar. This visual explains the contract; it is not a replay of Python’s internal regex engine or a general pattern editor.</p>
 <div className="flex flex-wrap gap-2">{Object.entries(fixtures).map(([name,value])=><button key={name} onClick={()=>change(value)} className="min-h-11 px-3 py-2 border border-surface-border rounded-lg text-cyber-sky">{name==='valid'?'Valid record':name==='suffix'?'Trailing text':name==='range'?'Out of range':name==='unicode'?'Unicode digit':'Blank record'}</button>)}</div>
 <label className="block">Record input<textarea aria-label="Log record input" rows={3} maxLength={160} value={raw} onChange={e=>change(e.target.value)} className="block w-full mt-2 p-3 rounded-lg border border-surface-border bg-surface font-mono text-sm"/></label>
 <p className="text-sm">Try a record longer than 80 characters to test the body limit. One optional LF/CRLF terminator is removed. Blank input is a blank record, not an empty file.</p>
 <label className="block">Predict the parser outcome<select aria-label="Record acceptance prediction" value={prediction} onChange={e=>{setPrediction(e.target.value);setChecked(false);}} className="block w-full mt-2 p-3 rounded-lg border border-surface-border bg-surface"><option value="">Choose before checking</option><option value="accept">Accept the record</option><option value="format">Reject its format or length</option><option value="range">Reject its numeric range</option></select></label>
 <button disabled={!prediction} onClick={()=>setChecked(true)} className="min-h-11 px-4 py-3 border border-cyber-sky rounded-lg text-cyber-sky disabled:opacity-50">Check record prediction</button>
 {checked&&<p role="status">{prediction===(model.accepted?'accept':model.error==='ms outside 0–2000'?'range':'format')?'Your prediction matches.':'Compare the contract with your prediction.'} {model.accepted?'Accepted record.':`Rejected: ${model.error}.`} Trace the boundaries and captures below to explain why.</p>}
 <div className="space-y-3 p-4 border border-surface-border rounded-xl bg-surface min-w-0">
 <p className="text-sm">Body characters examined: {frame?.cursor||0} / {Array.from(model.body).length}. Position points to the next unconsumed character.</p>
 <div className="flex flex-wrap gap-1 font-mono text-sm" aria-label="Record character progress">{Array.from(model.body).length?Array.from(model.body).map((char,index)=><span key={index} className={`border rounded px-1.5 py-1 ${index<(frame?.cursor||0)?'border-cyber-purple text-cyber-purple':index===(frame?.cursor||0)?'border-cyber-sky text-cyber-sky':'border-surface-border'}`}>{char===' '?'␠':char==='\n'?'\\n':char==='\r'?'\\r':char==='\t'?'\\t':char}</span>):<span>(empty body)</span>}</div>
 <p className="font-semibold text-slate-100">{frame?.phase||'Ready'}</p><p role="status" aria-live={playing&&!atEnd?'off':'polite'}>{frame?.explanation||'Predict, then step through the scanner. No characters have been examined.'}</p>
 <dl className="grid sm:grid-cols-3 gap-3 text-sm">{(['level','service','ms'] as const).map(name=><div key={name} className="min-w-0"><dt className="text-slate-400">{name}</dt><dd className="font-mono break-words">{frame?.captures[name]??'not captured'}</dd></div>)}</dl>
 <p className="text-sm">Partial captures are diagnostic state, not an accepted record. A later boundary or range failure rejects the entire record.</p>
 </div>
 <AnimationController currentCycle={step} totalCycles={model.frames.length} unitLabel="Step" isPlaying={playing&&!atEnd} speed={speed} phaseLabel={atEnd?(model.accepted?'Accepted':'Rejected'):frame?.phase||'Ready'} onPlayToggle={()=>{if(atEnd)setStep(0);setPlaying(value=>atEnd||!value);}} onStepForward={()=>seek(Math.min(step+1,model.frames.length))} onStepBackward={()=>seek(Math.max(0,step-1))} onReset={()=>seek(0)} onSpeedChange={setSpeed} onSeek={seek}/>
 </div>;
}

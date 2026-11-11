import {useState} from 'react';
import {AnimationController} from '../AnimationController';
import {useTracePlayback} from '../../../hooks/useTracePlayback';
import {httpResponseTrace,type HttpCase} from '../../../utils/httpResponseTrace';
function Replay({kind,size}:{kind:HttpCase;size:number}){
 const model=httpResponseTrace(kind,size);const playback=useTracePlayback(model.frames.length);const frame=model.frames[playback.step-1];const [prediction,setPrediction]=useState('');const [checked,setChecked]=useState(false);
 const outcome=kind==='valid'?'success':kind==='missing'?'status':kind==='timeout'?'timeout':'protocol';
 return <div className="space-y-4 min-w-0">
 <label className="block">Predict the final outcome<select aria-label="HTTP outcome prediction" value={prediction} onChange={e=>{setPrediction(e.target.value);setChecked(false);}} className="block w-full mt-2 p-3 border border-surface-border rounded-lg bg-surface"><option value="">Choose before checking</option><option value="success">Valid report</option><option value="status">HTTP status error</option><option value="protocol">Incomplete or invalid framing</option><option value="timeout">Deadline expires</option></select></label>
 <button disabled={!prediction} onClick={()=>setChecked(true)} className="min-h-11 px-4 py-3 border border-cyber-sky rounded-lg text-cyber-sky disabled:opacity-50">Check HTTP prediction</button>
 {checked&&<p role="status">{prediction===outcome?'Your prediction matches.':'Compare the layers with your prediction.'} Final outcome: {model.result}. Changing receive size does not repair missing bytes, an invalid length or an HTTP error.</p>}
 <div className="grid sm:grid-cols-3 gap-3 text-sm">{[['Total bytes received',frame?.received??0],['Header bytes including delimiter',frame?.headerBytes??'not complete'],['HTTP status',frame?.status??'not parsed'],['Declared body bytes',frame?.expected??'not parsed'],['Body bytes received',frame?.bodyBytes??0],['State',frame?.phase??'Before receiving']].map(([label,value])=><div key={label} className="min-w-0 p-3 border border-surface-border rounded-xl bg-surface"><p className="text-slate-400">{label}</p><p className="font-mono break-words mt-2 text-slate-100">{value}</p></div>)}</div>
 <div className="space-y-3 p-4 rounded-xl border border-surface-border bg-surface min-w-0"><p className="font-semibold text-slate-100">Most recent modeled receive</p><pre className="text-sm font-mono overflow-x-auto text-cyber-sky">{frame?.chunk?JSON.stringify(frame.chunk):'(no bytes in this event)'}</pre><p className="text-sm">Escaped \r\n marks carriage-return/line-feed bytes. All wire characters in these fixtures are ASCII, so each displayed character occupies one byte.</p><p role="status" aria-live={playback.playing?'off':'polite'}>{frame?.explanation||'Predict, then step through receive events. A chunk can contain part of a header, multiple headers, or both headers and body.'}</p><p className="font-mono text-sm break-words">Result: {frame?.result||'not available'}</p></div>
 <AnimationController currentCycle={playback.step} totalCycles={model.frames.length} unitLabel="Step" isPlaying={playback.playing} speed={playback.speed} phaseLabel={frame?.phase||'Ready'} onPlayToggle={playback.toggle} onStepForward={()=>playback.seek(playback.step+1)} onStepBackward={()=>playback.seek(playback.step-1)} onReset={()=>playback.seek(0)} onSpeedChange={playback.setSpeed} onSeek={playback.seek}/>
 </div>;
}
export function HttpResponseLab(){
 const [kind,setKind]=useState<HttpCase>('valid');const [size,setSize]=useState(23);
 return <div role="group" aria-label="HTTP response assembly lab" className="p-4 sm:p-6 rounded-2xl border border-cyber-sky/30 bg-surface-card space-y-5 min-w-0">
 <p className="text-sm">Guided replay of fixed local responses, not live traffic, packet boundaries or elapsed-time measurements. Receive sizes are illustrative; actual TCP reads can combine or split server writes.</p>
 <label className="block">Response fixture<select aria-label="HTTP response fixture" value={kind} onChange={e=>setKind(e.target.value as HttpCase)} className="block w-full mt-2 p-3 border border-surface-border rounded-lg bg-surface"><option value="valid">Complete 200 response</option><option value="truncated">EOF before declared body length</option><option value="missing">Complete 404 response</option><option value="badLength">Invalid Content-Length</option><option value="timeout">Deadline before remaining bytes</option></select></label>
 <label className="block">Modeled bytes per receive: {size}<input aria-label="Modeled receive size" type="range" min="1" max="256" value={size} onChange={e=>setSize(Number(e.target.value))} className="block w-full mt-3 accent-cyber-sky"/></label>
 <Replay key={`${kind}-${size}`} kind={kind} size={size}/>
 </div>;
}

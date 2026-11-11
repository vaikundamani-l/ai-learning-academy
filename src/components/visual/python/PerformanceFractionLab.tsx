import {useState} from 'react';
import {performanceModel} from '../../../utils/performanceModel';
export function PerformanceFractionLab(){
 const [percent,setPercent]=useState(80);const [factor,setFactor]=useState(2);const [prediction,setPrediction]=useState('');const [checked,setChecked]=useState(false);
 const result=performanceModel(percent,factor);const clear=()=>{setPrediction('');setChecked(false);};
 return <div className="p-4 sm:p-6 rounded-2xl border border-cyber-sky/30 bg-surface-card space-y-5 min-w-0">
 <p className="font-semibold text-cyber-sky">Illustrative 100ms workload — these are not measured Python timings.</p>
 <label className="block">Work eligible for improvement: {percent}%<input aria-label="Work percentage" type="range" min="0" max="100" value={percent} onChange={e=>{setPercent(Number(e.target.value));clear();}} className="block w-full mt-3 accent-cyber-sky"/></label>
 <label className="block">Local speed factor: {factor}×<input aria-label="Local speed factor" type="range" min="1" max="10" step="0.5" value={factor} onChange={e=>{setFactor(Number(e.target.value));clear();}} className="block w-full mt-3 accent-cyber-sky"/></label>
 <label className="block">Predict the new whole-program total in milliseconds<input aria-label="Predicted total milliseconds" inputMode="decimal" value={prediction} onChange={e=>{setPrediction(e.target.value);setChecked(false);}} className="block w-full mt-2 p-3 rounded-lg border border-surface-border bg-surface"/></label>
 <button disabled={!prediction.trim()} onClick={()=>setChecked(true)} className="min-h-11 px-4 py-3 rounded-lg border border-cyber-sky text-cyber-sky disabled:opacity-50">Check timing model</button>
 {checked&&<div className="space-y-4"><p role="status">{Number.isFinite(Number(prediction))&&Math.abs(Number(prediction)-result.total)<=0.1?'Your prediction matches within 0.1ms.':'Compare the parts with your prediction.'} New total: {result.total.toFixed(2)}ms; whole-program speedup: {result.speedup.toFixed(2)}×.</p>
 <div role="img" aria-label={`Before: 100 milliseconds. After: ${result.unchanged} unchanged plus ${result.improved.toFixed(2)} improved milliseconds. Both bars use the same 100 millisecond scale.`} className="space-y-3">
 <p className="text-sm">Before: 100ms</p><div className="flex h-6 rounded bg-surface overflow-hidden"><div className="bg-cyber-sky" style={{width:`${result.unchanged}%`}}/><div className="bg-cyber-purple" style={{width:`${result.originalHot}%`}}/></div>
 <p className="text-sm">After: {result.total.toFixed(2)}ms on the same scale</p><div className="flex h-6 rounded bg-surface overflow-hidden"><div className="bg-cyber-sky" style={{width:`${result.unchanged}%`}}/><div className="bg-cyber-purple" style={{width:`${result.improved}%`}}/></div></div>
 <p>Unchanged work: {result.unchanged}ms. Improved part: {result.originalHot}ms ÷ {factor} = {result.improved.toFixed(2)}ms. Add both parts before computing the overall speedup.</p>
 </div>}
 <p className="text-sm text-slate-400">This assumes the same fixed work, no added overhead and no interaction between parts. It models local speedups from 1× to 10×; actual changes can add overhead, move bottlenecks or make performance worse.</p>
 </div>;
}

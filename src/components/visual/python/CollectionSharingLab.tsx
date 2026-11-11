import { useState } from 'react';
import { ProgramTrace } from '../../learning/ProgramTrace';
import { collectionSharingModel, type SharingMode } from '../../../utils/pythonCollectionTrace';
export function CollectionSharingLab() {
 const [mode,setMode]=useState<SharingMode>('alias');const [value,setValue]=useState(30);
 const [prediction,setPrediction]=useState('');const [checked,setChecked]=useState(false);
 const resetPrediction=()=>{setPrediction('');setChecked(false);};
 const model=collectionSharingModel(mode,value);
 const expected=mode==='alias'?`[10, 20, ${value}]`:'[10, 20]';
 return <div className="p-4 sm:p-6 space-y-5 rounded-2xl bg-surface-card border border-cyber-sky/30 min-w-0">
 <div role="group" aria-label="Choose collection binding" className="flex flex-wrap gap-3">{(['alias','copy'] as const).map(item=><button key={item} aria-pressed={mode===item} onClick={()=>{setMode(item);resetPrediction();}} className={`min-h-11 px-4 py-3 rounded-lg border ${mode===item?'border-cyber-sky text-cyber-sky':'border-surface-border'}`}>{item==='alias'?'Share the list':'Copy the outer list'}</button>)}</div>
 <label className="block">Value to append: {value}<input aria-label="Value to append" type="range" min="0" max="99" value={value} onChange={e=>{setValue(Number(e.target.value));resetPrediction();}} className="block w-full mt-3 accent-cyber-sky"/></label>
 <p>Predict whether original will include the new value. Step to the assignment, then to append, and explain what changed. A and B are teaching labels for distinct outer objects, not memory addresses.</p>
 <label className="block">Predict original after append (list notation)<input value={prediction} onChange={e=>{setPrediction(e.target.value);setChecked(false);}} className="block w-full mt-2 p-3 rounded-lg bg-surface border border-surface-border font-mono"/></label>
 <button className="min-h-11 px-4 py-3 rounded-lg border border-cyber-sky text-cyber-sky disabled:opacity-50" disabled={!prediction.trim()} onClick={()=>setChecked(true)}>Check sharing prediction</button>
 {checked&&<p role="status">{prediction.replace(/\s/g,'')===expected.replace(/\s/g,'')?'Your prediction matches.':'Compare your prediction with the result:'} original is {expected}. {mode==='alias'?'Both names reach List A, so the append is visible through either name.':'other reaches List B, so its append does not change List A.'}</p>}
 <ProgramTrace key={`${mode}-${value}`} title="collection_sharing.py" code={model.code} frames={model.frames} renderState={step=>{
  const snapshot=model.snapshots[step];return <div className="grid sm:grid-cols-2 gap-3" aria-label="Collection object graph">
   <div className="p-4 rounded-xl border border-cyber-sky/40 bg-surface space-y-2"><p className="font-semibold text-cyber-sky">List A</p><p className="text-sm">{step?'original → A':'No objects created yet'}</p><pre className="overflow-x-auto">{step?JSON.stringify(snapshot.original):'—'}</pre>{snapshot.shared&&<p className="text-cyber-amber text-sm">other → A (same object)</p>}</div>
   <div className="p-4 rounded-xl border border-surface-border bg-surface space-y-2"><p className="font-semibold text-slate-100">{snapshot.other&&!snapshot.shared?'List B':'Second name'}</p><p className="text-sm">{!snapshot.other?'other not assigned':snapshot.shared?'No second list was created':'other → B (distinct outer object)'}</p>{snapshot.other&&!snapshot.shared&&<pre className="overflow-x-auto">{JSON.stringify(snapshot.other)}</pre>}</div>
  </div>;
 }}/>
 </div>;
}

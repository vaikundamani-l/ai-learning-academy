import { useId, useState } from 'react';
import type { ReasoningChallengeData } from '../../data/pythonReasoningChallenges';
import { CodeBlock } from './CodeBlock';

const normalize = (value: string) => value.replace(/\r\n/g, '\n').trim();

/** Output comparison is automatic; learners compare their own reasoning to the worked explanation. */
export function ReasoningChallenge({ challenge }: { challenge: ReasoningChallengeData }) {
  const inputId = useId();
  const [variantIndex, setVariantIndex] = useState(0);
  const [prediction, setPrediction] = useState('');
  const [reason, setReason] = useState('');
  const [checked, setChecked] = useState(false);
  const variant = challenge.variants[variantIndex];
  const matches = normalize(prediction) === normalize(variant.output);
  return <section className="p-4 sm:p-6 rounded-2xl border border-cyber-indigo/30 bg-surface-card space-y-4 min-w-0" aria-labelledby={`${inputId}-title`}>
    <h3 id={`${inputId}-title`} className="text-lg font-semibold text-slate-100">{challenge.title}</h3>
    <p>{challenge.question}</p>
    <div role="group" aria-label={`Versions for ${challenge.title}`} className="flex flex-wrap gap-3">
      {challenge.variants.map((item, index) => <button key={item.title} aria-pressed={variantIndex === index}
        className={`min-h-11 px-4 py-2 rounded-lg border ${variantIndex === index ? 'border-cyber-indigo text-cyber-indigo bg-cyber-indigo/10' : 'border-surface-border'}`}
        onClick={() => { setVariantIndex(index); setPrediction(''); setReason(''); setChecked(false); }}>{item.title}</button>)}
    </div>
    <CodeBlock title={`${challenge.id}.py`} code={variant.code} />
    <label className="block" htmlFor={`${inputId}-output`}>Predict the output (one printed line per line)</label>
    <textarea id={`${inputId}-output`} rows={3} value={prediction} onChange={e => { setPrediction(e.target.value); setChecked(false); }} className="w-full p-3 rounded-lg bg-surface border border-surface-border font-mono text-sm" />
    <label className="block" htmlFor={`${inputId}-reason`}>Explain how the program reaches your prediction</label>
    <textarea id={`${inputId}-reason`} rows={3} value={reason} onChange={e => setReason(e.target.value)} className="w-full p-3 rounded-lg bg-surface border border-surface-border" />
    <p className="text-sm text-slate-400">These responses stay on this page while it is open. Output is checked automatically; your explanation is for self-review and is not automatically graded.</p>
    <button disabled={!prediction.trim() || !reason.trim()} onClick={() => setChecked(true)} className="min-h-11 px-4 py-3 rounded-lg border border-cyber-indigo text-cyber-indigo disabled:opacity-50">Compare prediction &amp; reasoning</button>
    {checked && <div className="space-y-4 border-t border-surface-border pt-4">
      <p role="status" className={matches ? 'text-cyber-emerald' : 'text-cyber-amber'}>{matches ? 'Your output matches. Check whether your reasoning explains every step below.' : 'The output differs. Find the first step where your reasoning differs from the program.'}</p>
      <p className="font-semibold text-slate-100">Verified output</p><pre className="p-3 rounded-lg bg-surface overflow-x-auto font-mono text-sm">{variant.output}</pre>
      <ol className="list-decimal pl-6 space-y-3">{variant.steps.map(step => <li key={step}>{step}</li>)}</ol>
      <p><strong className="text-slate-100">Explain the change:</strong> {challenge.transfer}</p>
    </div>}
  </section>;
}

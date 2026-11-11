import { useEffect, useState, type ReactNode } from 'react';
import { AnimationController } from '../visual/AnimationController';
import { CodeBlock } from './CodeBlock';

export interface ProgramFrame {
  line: number;
  names: string;
  output: string;
  explanation: string;
}

/** A replay of explicit teaching frames. It never evaluates arbitrary Python. */
export function ProgramTrace({ code, frames, title, renderState }: { code: string; frames: ProgramFrame[]; title: string; renderState?: (step: number) => ReactNode }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const frame = frames[step - 1];
  const atEnd = step >= frames.length;

  useEffect(() => {
    if (!playing || atEnd) return;
    const timer = window.setTimeout(() => setStep(value => Math.min(value + 1, frames.length)), 1400 / speed);
    return () => window.clearTimeout(timer);
  }, [playing, atEnd, step, frames.length, speed]);

  useEffect(() => {
    const pauseWhenHidden = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden);
  }, []);

  const seek = (value: number) => { setPlaying(false); setStep(value); };
  return <div className="space-y-4 min-w-0" role="group" aria-label={title}>
    <CodeBlock title={title} code={code} highlightLines={frame ? [frame.line] : []} />
    {renderState?.(step)}
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="min-w-0 p-4 rounded-xl border border-surface-border bg-surface"><p className="font-semibold text-slate-100">Names and values</p><p className="font-mono text-sm break-words mt-2">{frame?.names || 'None assigned yet'}</p></div>
      <div className="min-w-0 p-4 rounded-xl border border-surface-border bg-surface"><p className="font-semibold text-slate-100">Output so far</p><pre className="text-cyber-emerald text-sm overflow-x-auto mt-2">{frame?.output || '(empty)'}</pre></div>
    </div>
    <p role="status" aria-live={playing && !atEnd ? 'off' : 'polite'} className="p-4 rounded-xl bg-cyber-sky/5 border border-cyber-sky/20 min-h-20">{frame?.explanation || 'Before execution: no statements have run. Step forward or press Play.'}</p>
    <AnimationController currentCycle={step} totalCycles={frames.length} unitLabel="Step" isPlaying={playing && !atEnd} speed={speed}
      phaseLabel={atEnd ? 'Finished' : step ? `Line ${frame.line}` : 'Ready'}
      onPlayToggle={() => { if (atEnd) setStep(0); setPlaying(value => atEnd || !value); }}
      onStepForward={() => seek(Math.min(step + 1, frames.length))} onStepBackward={() => seek(Math.max(0, step - 1))}
      onReset={() => seek(0)} onSpeedChange={setSpeed} onSeek={seek} />
    <p className="text-sm text-slate-400">Guided model of the displayed program. Highlighting shows the line just processed; loop headers can appear multiple times. Run the copied code with Python to verify its output.</p>
  </div>;
}

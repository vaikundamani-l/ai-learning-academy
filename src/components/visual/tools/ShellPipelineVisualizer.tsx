import React, { useState } from 'react';
import { Terminal, ArrowRight, Play, RotateCcw, Database, HardDrive, CheckCircle2, Layers } from 'lucide-react';
import { parsePipeline } from '../../../utils/devTooling';

export const ShellPipelineVisualizer: React.FC = () => {
  const [pipelineInput, setPipelineInput] = useState<string>('cat server.log | grep ERROR | sort | uniq -c > report.txt');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const stages = parsePipeline(pipelineInput.replace(/>.*$/, ''));
  const hasOutputRedirection = pipelineInput.includes('>');
  const outputFile = hasOutputRedirection ? pipelineInput.split('>')[1].trim() : null;

  const mockDataPackets = [
    ['2026-11-05 10:00:01 INFO Connected', '2026-11-05 10:00:02 ERROR DB Timeout', '2026-11-05 10:00:03 WARN Disk 90%', '2026-11-05 10:00:04 ERROR DB Timeout'],
    ['2026-11-05 10:00:02 ERROR DB Timeout', '2026-11-05 10:00:04 ERROR DB Timeout'],
    ['2026-11-05 10:00:02 ERROR DB Timeout', '2026-11-05 10:00:04 ERROR DB Timeout'],
    ['   2 ERROR DB Timeout']
  ];

  const handleStepForward = () => {
    setCurrentStep((prev) => (prev < stages.length - 1 ? prev + 1 : 0));
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyber-emerald" />
            <span>Unix I/O Redirection & Kernel Pipe Simulator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Trace how the shell coordinates anonymous pipe buffers and file descriptor dup2() rewiring.
          </p>
        </div>

        {/* Step Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleStepForward}
            className="px-3 py-1.5 rounded-lg bg-cyber-emerald text-void font-bold text-xs font-mono hover:bg-emerald-400 transition flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Step Stream Flow</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-white text-xs font-mono transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pipeline Input Display */}
      <div className="p-3.5 rounded-xl bg-surface border border-surface-border space-y-2">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          Active Shell Command Line
        </div>
        <div className="font-mono text-sm text-cyber-sky bg-surface-card p-2.5 rounded-lg border border-surface-border break-all">
          $ {pipelineInput}
        </div>
      </div>

      {/* Visual Pipeline Flow Chart */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Process Graph & File Descriptor Wireup
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {stages.map((st, idx) => {
            const isCurrent = currentStep === idx;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition space-y-3 relative ${
                  isCurrent
                    ? 'bg-cyber-emerald/10 border-cyber-emerald ring-2 ring-cyber-emerald/40 text-slate-100'
                    : 'bg-surface border-surface-border text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-cyber-emerald">Stage {idx + 1}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-surface-border text-slate-400">
                    PID {2001 + idx}
                  </span>
                </div>

                <div className="font-mono text-sm font-bold text-slate-100 truncate">
                  {st.command} {st.args.join(' ')}
                </div>

                {/* File Descriptor Table */}
                <div className="p-2 rounded bg-surface-card border border-surface-border text-[10px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">stdin (FD 0):</span>
                    <span className={st.isPipeTarget ? 'text-cyber-sky font-bold' : 'text-slate-300'}>
                      {st.isPipeTarget ? `Pipe #${idx} (Read)` : 'TTY / keyboard'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">stdout (FD 1):</span>
                    <span className={st.isPipeSource ? 'text-cyber-amber font-bold' : 'text-cyber-emerald font-bold'}>
                      {st.isPipeSource ? `Pipe #${idx + 1} (Write)` : outputFile ? `file: ${outputFile}` : 'TTY / screen'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">stderr (FD 2):</span>
                    <span className="text-slate-500">Terminal (unredirected)</span>
                  </div>
                </div>

                {/* Live Stream Buffer Content */}
                <div className="pt-1">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">Process Buffer Out:</span>
                  <div className="p-2 rounded bg-surface border border-surface-border text-[10px] font-mono text-slate-200 min-h-[48px] max-h-24 overflow-y-auto">
                    {(mockDataPackets[idx] || []).map((line, lIdx) => (
                      <div key={lIdx} className="truncate">{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Callout */}
      <div className="p-3.5 rounded-xl bg-surface border border-surface-border text-xs text-slate-300 font-sans leading-relaxed space-y-1.5">
        <strong className="text-cyber-emerald font-mono text-xs block">Operating System Mechanism (pipe() & dup2()):</strong>
        <p>
          Before executing <code className="text-cyber-sky">execve()</code>, the parent shell calls <code className="text-cyber-sky">pipe(pipefd)</code> creating a unidirectional in-memory kernel ring buffer (typically 64 KB). In the child process, the shell calls <code className="text-cyber-sky">dup2(pipefd[1], STDOUT_FILENO)</code>, redirecting standard output directly into the pipe buffer!
        </p>
      </div>
    </div>
  );
};

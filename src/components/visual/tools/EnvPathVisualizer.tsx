import React, { useState } from 'react';
import { Search, FolderTree, Terminal, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { resolveCommandPath } from '../../../utils/devTooling';

export const EnvPathVisualizer: React.FC = () => {
  const [commandInput, setCommandInput] = useState<string>('git');
  const [pathList, setPathList] = useState<string[]>([
    '/home/developer/.local/bin',
    '/usr/local/bin',
    '/usr/bin',
    '/bin',
  ]);

  const mockFilesystem: Record<string, string[]> = {
    '/home/developer/.local/bin': ['poetry', 'ruff', 'black'],
    '/usr/local/bin': ['node', 'docker', 'kubectl'],
    '/usr/bin': ['gcc', 'git', 'python3', 'make', 'curl'],
    '/bin': ['bash', 'sh', 'ls', 'cat', 'rm', 'mkdir'],
  };

  const resolution = resolveCommandPath(commandInput.trim(), pathList, mockFilesystem);

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Search className="w-4 h-4 text-cyber-sky" />
            <span>Interactive $PATH Resolution & Environment Variable Lab</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Trace how the shell traverses directory paths to locate and execute binary programs.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {['git', 'python3', 'bash', 'poetry', 'custom_tool'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => setCommandInput(cmd)}
              className={`px-2.5 py-1 rounded-lg border transition ${
                commandInput === cmd
                  ? 'bg-cyber-sky text-void font-bold border-cyber-sky'
                  : 'bg-surface border-surface-border text-slate-300 hover:text-white'
              }`}
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3 font-mono text-xs">
        <div className="flex items-center space-x-3">
          <label className="text-slate-400 text-xs">$ which</label>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-slate-100 text-xs w-48 focus:outline-none focus:border-cyber-sky"
            placeholder="Type command name..."
          />
        </div>

        <div className="text-[11px] text-slate-400 break-all">
          <strong className="text-cyber-sky">$PATH</strong> = {pathList.join(':')}
        </div>
      </div>

      {/* Sequential Directory Search Pipeline */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Sequential $PATH Search Trace
        </div>

        <div className="space-y-2 font-mono text-xs">
          {resolution.steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                step.found
                  ? 'bg-cyber-emerald/15 border-cyber-emerald/50 text-slate-100 font-bold'
                  : 'bg-surface border-surface-border text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <span className="w-5 h-5 rounded-full bg-surface border border-surface-border flex-shrink-0 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span className="break-all">Check directory: <code className="text-slate-200">{step.directory}/</code></span>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                {step.found ? (
                  <span className="flex items-center space-x-1.5 text-cyber-emerald text-[11px] break-all">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>FOUND: {step.checkedFile}</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Not in this directory</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution Verdict Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${
          resolution.resolvedPath
            ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-cyber-emerald'
            : 'bg-cyber-rose/10 border-cyber-rose/40 text-cyber-rose'
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0 break-all">
          {resolution.resolvedPath ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
          <span className="font-bold">
            {resolution.resolvedPath
              ? `Command resolved: ${resolution.resolvedPath}`
              : `bash: ${commandInput}: command not found (searched all directories in $PATH)`}
          </span>
        </div>
      </div>

      {/* Linux FHS Quick Reference */}
      <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2 text-xs font-sans text-slate-300">
        <strong className="font-mono text-slate-100 text-xs block">Linux Filesystem Hierarchy Standard (FHS):</strong>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
          <div><code className="text-cyber-sky">/bin, /usr/bin</code>: Essential system binaries</div>
          <div><code className="text-cyber-sky">/etc</code>: System-wide configuration files</div>
          <div><code className="text-cyber-sky">/var</code>: Variable data (logs, databases)</div>
          <div><code className="text-cyber-sky">/proc, /sys</code>: Kernel virtual filesystems</div>
        </div>
      </div>
    </div>
  );
};

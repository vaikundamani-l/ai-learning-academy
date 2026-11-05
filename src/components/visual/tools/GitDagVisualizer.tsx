import React, { useState } from 'react';
import { GitBranch, GitCommit, GitMerge, FileText, ArrowRight, CheckCircle2, RotateCcw, Shield, Layers, Plus } from 'lucide-react';
import { computeGitBlobHash } from '../../../utils/devTooling';

interface GitCommitNode {
  hash: string;
  shortHash: string;
  parentHash: string | null;
  message: string;
  branch: string;
  tree: {
    filename: string;
    blobHash: string;
    content: string;
  }[];
}

export const GitDagVisualizer: React.FC = () => {
  const [commits, setProcesses] = useState<GitCommitNode[]>([
    {
      hash: '9f82a17c24f601b3d849502847a9e0123456789a',
      shortHash: '9f82a17',
      parentHash: null,
      message: 'Initial project setup & README.md',
      branch: 'main',
      tree: [
        { filename: 'README.md', blobHash: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4', content: '# AI Master Course\nComputing Foundations.' }
      ]
    },
    {
      hash: '3a18b99c81e7d23a54b980145c2a10987654321b',
      shortHash: '3a18b99',
      parentHash: '9f82a17c24f601b3d849502847a9e0123456789a',
      message: 'Add neural network inference pipeline',
      branch: 'main',
      tree: [
        { filename: 'README.md', blobHash: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4', content: '# AI Master Course\nComputing Foundations.' },
        { filename: 'infer.py', blobHash: 'f4510b9c3214a7e981240192348a10923847561a', content: 'import torch\nmodel = load_model()' }
      ]
    },
    {
      hash: '7c40f82d1928471b02938471203948571029384c',
      shortHash: '7c40f82',
      parentHash: '3a18b99c81e7d23a54b980145c2a10987654321b',
      message: 'Implement GPU CUDA acceleration kernels',
      branch: 'feature/cuda',
      tree: [
        { filename: 'README.md', blobHash: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4', content: '# AI Master Course\nComputing Foundations.' },
        { filename: 'infer.py', blobHash: 'f4510b9c3214a7e981240192348a10923847561a', content: 'import torch\nmodel = load_model()' },
        { filename: 'kernel.cu', blobHash: 'b91823746192847561029384756102938475610b', content: '__global__ void matmul_kernel() {}' }
      ]
    }
  ]);

  const [activeBranch, setActiveBranch] = useState<'main' | 'feature/cuda'>('feature/cuda');
  const [selectedCommitHash, setSelectedCommitHash] = useState<string>('7c40f82d1928471b02938471203948571029384c');
  const [newCommitMsg, setNewCommitMsg] = useState<string>('');

  const selectedCommit = commits.find((c) => c.hash === selectedCommitHash) || commits[commits.length - 1];

  const handleCreateCommit = () => {
    if (!newCommitMsg.trim()) return;
    const parent = commits.filter((c) => c.branch === activeBranch || c.branch === 'main').pop();
    const newHash = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
    const shortHash = newHash.slice(0, 7);

    const newCommit: GitCommitNode = {
      hash: newHash,
      shortHash,
      parentHash: parent ? parent.hash : null,
      message: newCommitMsg.trim(),
      branch: activeBranch,
      tree: [
        ...(parent ? parent.tree : []),
        {
          filename: `patch_${shortHash}.py`,
          blobHash: computeGitBlobHash(newCommitMsg).sha1Hash,
          content: `# Patch ${shortHash}\nprint("${newCommitMsg}")`,
        },
      ],
    };

    setProcesses((prev) => [...prev, newCommit]);
    setSelectedCommitHash(newHash);
    setNewCommitMsg('');
  };

  const handleMerge = () => {
    // Fast forward merge feature/cuda into main
    const featureHead = commits.filter((c) => c.branch === 'feature/cuda').pop();
    if (!featureHead) return;

    setProcesses((prev) =>
      prev.map((c) => {
        if (c.hash === featureHead.hash) {
          return { ...c, branch: 'main (Merged)' };
        }
        return c;
      })
    );
    setActiveBranch('main');
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-cyber-sky" />
            <span>Interactive Git Directed Acyclic Graph (DAG) & Object Explorer</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize how Git models commits, trees, blobs, references, and HEAD as an immutable directed acyclic graph.
          </p>
        </div>

        {/* Branch switcher & Merge */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 p-1 rounded-lg bg-surface border border-surface-border font-mono text-xs">
            <span className="text-slate-400 text-[10px] pl-1">HEAD &rarr;</span>
            <button
              onClick={() => setActiveBranch('main')}
              className={`px-2.5 py-0.5 rounded text-[11px] transition ${
                activeBranch === 'main'
                  ? 'bg-cyber-sky text-void font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              main
            </button>
            <button
              onClick={() => setActiveBranch('feature/cuda')}
              className={`px-2.5 py-0.5 rounded text-[11px] transition ${
                activeBranch === 'feature/cuda'
                  ? 'bg-cyber-indigo text-void font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              feature/cuda
            </button>
          </div>

          <button
            onClick={handleMerge}
            className="px-3 py-1.5 rounded-lg bg-surface border border-cyber-emerald/40 text-cyber-emerald hover:bg-cyber-emerald/10 text-xs font-mono transition flex items-center space-x-1.5"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Merge to main</span>
          </button>
        </div>
      </div>

      {/* Interactive DAG Visual Timeline */}
      <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase tracking-wider">Commit DAG History (Click node to inspect Git objects)</span>
          <span className="text-cyber-sky text-[11px]">Active HEAD pointer: refs/heads/{activeBranch}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 overflow-x-auto py-2">
          {commits.map((c, idx) => {
            const isSelected = c.hash === selectedCommitHash;
            const isHead = (c.branch === activeBranch && idx === commits.length - 1) || (activeBranch === 'main' && c.branch.includes('main'));

            return (
              <React.Fragment key={c.hash}>
                {idx > 0 && (
                  <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
                <button
                  onClick={() => setSelectedCommitHash(c.hash)}
                  className={`p-3 rounded-xl border text-left transition flex-shrink-0 max-w-[210px] space-y-1.5 ${
                    isSelected
                      ? 'bg-cyber-sky/15 border-cyber-sky shadow-lg ring-1 ring-cyber-sky text-slate-100'
                      : 'bg-surface-card border-surface-border text-slate-300 hover:bg-surface-elevated hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-cyber-sky">
                      {c.shortHash}
                    </span>
                    {isHead && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyber-emerald text-void">
                        HEAD
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold truncate">{c.message}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="truncate max-w-[100px] text-cyber-indigo">{c.branch}</span>
                    <span>{c.tree.length} files</span>
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Selected Commit Object Tree vs Add Commit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selected Commit Object Inspector */}
        <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-surface-border pb-2">
            <span className="font-bold text-slate-100 flex items-center space-x-1.5">
              <GitCommit className="w-4 h-4 text-cyber-sky" />
              <span>Git Object Deconstruction: {selectedCommit.shortHash}</span>
            </span>
            <span className="text-slate-400 text-[10px]">Object Type: commit</span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-500">Full SHA-1: </span>
              <span className="text-cyber-sky break-all">{selectedCommit.hash}</span>
            </div>
            <div>
              <span className="text-slate-500">Parent Commit: </span>
              <span className="text-slate-300">{selectedCommit.parentHash ? selectedCommit.parentHash.slice(0, 16) + '...' : 'None (Root Initial Commit)'}</span>
            </div>
            <div>
              <span className="text-slate-500">Tree Objects ({selectedCommit.tree.length} Blobs):</span>
            </div>
          </div>

          {/* Tree & Blobs Table */}
          <div className="space-y-1.5 pt-1">
            {selectedCommit.tree.map((item, i) => (
              <div
                key={i}
                className="p-2 rounded bg-surface-card border border-surface-border flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-cyber-emerald" />
                  <span className="text-slate-200">{item.filename}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  blob <span className="text-cyber-amber">{item.blobHash.slice(0, 8)}...</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 pt-1 leading-relaxed">
            <strong>Content-Addressable Invariance:</strong> Changing even a single comma in <code>{selectedCommit.tree[0]?.filename}</code> creates a new Blob hash, which updates the Tree hash, which cascades into an entirely new Commit SHA-1!
          </div>
        </div>

        {/* Add Commit Action Box */}
        <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-3 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <span className="font-bold text-slate-100 block">Commit to refs/heads/{activeBranch}</span>
            <p className="text-slate-400 text-xs font-sans">
              Stage new files and compute a new commit node in the DAG:
            </p>

            <input
              type="text"
              placeholder="e.g., Optimize attention kernel latency"
              value={newCommitMsg}
              onChange={(e) => setNewCommitMsg(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-slate-100 text-xs focus:outline-none focus:border-cyber-sky"
            />
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between">
            <span className="text-[10px] text-slate-500">Creates .git/objects/xx/yy</span>
            <button
              onClick={handleCreateCommit}
              disabled={!newCommitMsg.trim()}
              className="px-4 py-2 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition disabled:opacity-40 flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>git commit -m</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

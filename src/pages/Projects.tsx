import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, 
  Terminal, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  FileCode,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  HelpCircle
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';

export const Projects: React.FC = () => {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAnswer = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const capstones = [
    {
      id: 'capstone-a',
      letter: 'A',
      title: 'Reliable Predictive System',
      domain: 'Systems & ML Pipeline',
      description: 'Documented data provenance, reproducible preprocessing, simple baseline and justified ML model, valid cross-validation evaluation, containerized deployment, monitoring, access controls, and automated recovery.',
      evidence: 'Empirical results, error analysis, latency benchmarks, threat model.'
    },
    {
      id: 'capstone-b',
      letter: 'B',
      title: 'Secure Personal AI Assistant',
      domain: 'Full-Stack LLM & Security',
      description: 'Step-by-step: Text chat interface -> Document ingestion -> Hybrid search with citations -> Unsupported-answer fallback -> Permission-controlled tool -> Persistent user memory with CRUD -> Auth & user isolation -> Latency/spending limits -> Voice I/O.',
      evidence: 'Task evaluations, security tests, latency/cost audit, failure traces, permission model.'
    },
    {
      id: 'capstone-c',
      letter: 'C',
      title: 'AI Security Laboratory',
      domain: 'Adversarial ML & Defense',
      description: 'Small models, isolated web targets, controlled adversarial testbeds, indirect prompt injection scenarios, retrieval poisoning test suites, membership inference tests, and attack/defense trade-off benchmarks.',
      evidence: 'Defined attacker capabilities, empirical outcomes, mitigations, residual risk analysis.'
    },
    {
      id: 'capstone-d',
      letter: 'D',
      title: 'AI-Assisted Security Operations Tool',
      domain: 'Applied AI for Cyber Defense',
      description: 'Synthetic or authorized telemetry ingestion, rule-based and ML classification baselines, evidence-linked alert summaries, mandatory analyst review gates, false-positive metrics, and safe workflow boundaries.',
      evidence: 'Detection quality metrics, operational analyst time savings, incident case study.'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
          <FolderGit2 className="w-4 h-4" />
          <span>Engineering Portfolio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Required Scratch Implementations & Capstones
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
          Mastery is established through verified code built from first principles. Complete the 25+ scratch implementations across the 31 stages and synthesize them in the 4 Master Capstones.
        </p>
      </div>

      {/* The 4 Master Capstones Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-amber font-semibold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Stage 30 — Master Engineering Capstones</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capstones.map((cap) => (
            <div
              key={cap.id}
              className="p-5 rounded-xl bg-surface-card border border-surface-border hover:border-cyber-amber/50 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-surface border border-surface-border text-cyber-amber font-mono font-bold text-xs">
                    CAPSTONE {cap.letter}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {cap.domain}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100">
                  {cap.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {cap.description}
                </p>

                <div className="p-2.5 rounded bg-surface border border-surface-border text-[11px] font-mono text-slate-400">
                  <span className="text-slate-500 font-semibold block mb-0.5">Required Evidence:</span>
                  <span>{cap.evidence}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Stage 30 Capstone</span>
                <Link
                  to="/stage/30"
                  className="text-cyber-amber hover:underline flex items-center space-x-1 font-semibold"
                >
                  <span>Open Capstone Spec</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Verified Milestone: Stage 0 Workspace */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-card via-surface-card to-surface-elevated border border-cyber-emerald/50 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyber-emerald font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyber-emerald" />
            <span>Stage 0 Milestone — Practice Workspace</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30 font-mono text-[11px] font-bold flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>14 workspace regression tests • Practical review required</span>
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-100">
            Reproducible Developer Workspace & Git Repository
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-4xl">
            An educational workspace connecting several Stage 0 concepts: bounded-buffer streaming file I/O, deep POSIX inode and permission metadata inspection, Unix shell pipelines with standard streams (0, 1, 2) and signal trap cleanup, and Git DAG internals with branching, non-fast-forward merge commits, and annotated releases.
          </p>
        </div>

        {/* Workspace Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-bold text-xs">
              <FileCode className="w-4 h-4" />
              <span>src/file_organizer.py</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              CLI file organizer featuring extension-based categories, streaming SHA-256 deduplication, collision resolution, dry-run simulation, and conflict-aware JSON undo journaling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-bold text-xs">
              <FileCode className="w-4 h-4" />
              <span>src/metadata_inspector.py</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Deep POSIX inspection querying <code className="text-cyber-sky">lstat()</code> for inode numbers, hard links, disk block allocations, 4-digit octal permission masks, SUID/SGID/sticky bits, and structured JSON output.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
            <div className="flex items-center space-x-2 text-cyber-amber font-mono font-bold text-xs">
              <Terminal className="w-4 h-4" />
              <span>src/directory_reporter.sh</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bash/GNU shell pipeline script demonstrating streams (stdout vs stderr <code className="text-cyber-amber">&gt;&amp;2</code>), <code className="text-cyber-amber">trap</code> scratchpad cleanup, and automated permission audits.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-surface-border p-4 text-sm text-slate-300 space-y-2">
          <p>Start with disposable sample files. Predict the dry-run result, organize them, inspect the undo journal, and restore them. Then create a conflicting original filename and confirm Undo preserves both copies.</p>
          <p>The README includes a worked example and a practical evidence checklist. Passing the automated tests demonstrates tool behavior; completing the stage also requires explaining your results and diagnosing an unfamiliar failure.</p>
        </div>

        {/* Interactive Learner Reflection & Diagnostics */}
        <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-cyber-sky" />
            <span>Learner Reflection & Diagnostic Evaluation Challenge</span>
          </div>

          <div className="space-y-3">
            {/* Prompt 1: Undo conflict */}
            <div className="p-3.5 rounded-lg bg-surface-card border border-surface-border space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-slate-200">
                  1. Journal Conflict & Safety Invariant: Why does <code className="text-cyber-sky">file_organizer.py</code> refuse to restore an item if the destination file is already occupied or modified?
                </span>
                <button
                  onClick={() => toggleAnswer('q1')}
                  className="px-2 py-1 rounded bg-surface hover:bg-surface-elevated text-cyber-sky border border-surface-border font-mono text-[11px] shrink-0 flex items-center space-x-1"
                >
                  <span>{revealedAnswers['q1'] ? 'Hide' : 'Explain'}</span>
                  {revealedAnswers['q1'] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
              {revealedAnswers['q1'] && (
                <div className="p-3 rounded bg-void/80 border border-cyber-sky/30 text-slate-300 leading-relaxed space-y-1 text-xs">
                  <p><strong>Safety Invariant:</strong> In transactional filesystem design, an undo action must never destroy newly created user data. If the user creates a new file at the original path after organization, or if the organized file was subsequently edited, overwriting it would cause irreversible data loss.</p>
                  <p>By refusing to overwrite and <strong>retaining the un-restored journal entry</strong>, the tool preserves both files and ensures the learner has a complete audit trail to reconcile the collision manually.</p>
                </div>
              )}
            </div>

            {/* Prompt 2: Failure diagnosis */}
            <div className="p-3.5 rounded-lg bg-surface-card border border-surface-border space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-slate-200">
                  2. Regression Diagnosis: In <code className="text-cyber-sky">diagnose_failure.sh</code>, how do you isolate whether a failure is in the Python categorization logic versus a Git repository state error?
                </span>
                <button
                  onClick={() => toggleAnswer('q2')}
                  className="px-2 py-1 rounded bg-surface hover:bg-surface-elevated text-cyber-emerald border border-surface-border font-mono text-[11px] shrink-0 flex items-center space-x-1"
                >
                  <span>{revealedAnswers['q2'] ? 'Hide' : 'Explain'}</span>
                  {revealedAnswers['q2'] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
              {revealedAnswers['q2'] && (
                <div className="p-3 rounded bg-void/80 border border-cyber-emerald/30 text-slate-300 leading-relaxed space-y-1 text-xs">
                  <p><strong>Isolation Strategy:</strong> First execute <code className="text-cyber-emerald">python3 -m unittest discover</code> to view the exact stack trace and assertion failure (e.g. unexpected category mapping). Next inspect <code className="text-cyber-emerald">git diff</code> or <code className="text-cyber-emerald">git log -p -1</code> to see what source lines changed relative to the baseline commit.</p>
                  <p>Finally, run <code className="text-cyber-emerald">git checkout HEAD -- src/</code> to restore working source and verify that all 14 unit tests return to clean green status.</p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Practical Checklist */}
          <div className="pt-2 border-t border-surface-border space-y-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              Practical Milestone Evidence Checklist
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: 'c1', label: 'make all: 14 regression tests passing' },
                { id: 'c2', label: 'make inspect: /etc/passwd inode & octal verified' },
                { id: 'c3', label: 'make organize: Dry-run and journal tested' },
                { id: 'c4', label: 'make diagnose: Deliberate failure identified & restored' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-2.5 rounded-lg border text-left flex items-center space-x-2 transition ${
                    checklist[item.id]
                      ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald'
                      : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {checklist[item.id] ? (
                    <CheckSquare className="w-4 h-4 text-cyber-emerald shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className="text-[11px] truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Quick Orchestration & Execution Instructions */}
        <div className="p-4 rounded-xl bg-surface/70 border border-surface-border space-y-2.5 font-mono text-xs">
          <div className="text-slate-400 font-semibold flex flex-wrap gap-2 items-center justify-between">
            <span>Isolated Workspace Repository Path:</span>
            <span className="text-cyber-emerald font-bold break-all">examples/stage-0-workspace-project/</span>
          </div>
          <div className="bg-void/80 p-3 rounded-lg border border-surface-border/60 text-slate-300 space-y-1">
            <div className="text-slate-500"># Run the full automated verification suite:</div>
            <div className="text-cyber-sky break-all">make -C examples/stage-0-workspace-project all</div>
            <div className="text-slate-500 pt-1"># Execute the Stage 0 failure diagnosis and recovery check:</div>
            <div className="text-cyber-emerald break-all">make -C examples/stage-0-workspace-project diagnose</div>
          </div>
        </div>

        <div className="pt-1 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <Link
            to="/stage/0"
            className="text-cyber-emerald hover:underline flex items-center space-x-1 font-bold"
          >
            <span>&larr; View Stage 0 Curriculum Dashboard</span>
          </Link>
          <span className="text-slate-500">
            Includes Dockerfile, devcontainer.json, Makefile, & unittest suite
          </span>
        </div>
      </div>

      {/* Stage-by-Stage Scratch Implementations Directory */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>25+ Required Scratch Portfolio Implementations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM_STAGES.filter(s => s.buildFromScratch.length > 0).map((stage) => (
            <div
              key={stage.id}
              className="p-4 rounded-xl bg-surface-card border border-surface-border hover:border-slate-500 transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1.5">
                  <span>Stage {stage.id}</span>
                  <span className="text-cyber-sky">{stage.buildFromScratch.length} items</span>
                </div>

                <h4 className="text-sm font-bold text-slate-200">
                  {stage.title}
                </h4>

                <div className="mt-3 space-y-1.5">
                  {stage.buildFromScratch.map((build, i) => (
                    <div
                      key={i}
                      className="text-xs font-mono p-1.5 rounded bg-surface border border-surface-border text-slate-300 flex items-start space-x-2"
                    >
                      <span className="text-cyber-emerald font-bold">•</span>
                      <span className="leading-tight">{build}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs font-mono">
                <Link
                  to={`/stage/${stage.id}`}
                  className="text-cyber-sky hover:underline"
                >
                  View Stage Lab &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

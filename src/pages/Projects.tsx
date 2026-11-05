import React from 'react';
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
  ExternalLink 
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';

export const Projects: React.FC = () => {
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

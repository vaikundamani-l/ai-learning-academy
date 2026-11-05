import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Map, 
  Cpu, 
  ShieldCheck, 
  FolderGit2, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Terminal,
  Activity
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';
import { useProgress } from '../context/ProgressContext';

export const Dashboard: React.FC = () => {
  const { progress } = useProgress();

  const activeStage = CURRICULUM_STAGES[progress.lastActiveStageId] || CURRICULUM_STAGES[0];
  const completedStagesCount = progress.completedStages.length;
  const startedStagesCount = progress.startedStages.length;
  const progressPercent = Math.round((completedStagesCount / CURRICULUM_STAGES.length) * 100);

  const parts = [
    { num: 1, title: 'Part I — Computing & Software Foundations', stages: [0, 1, 2, 3], tag: 'Foundations' },
    { num: 2, title: 'Part II — Mathematics & Data', stages: [4, 5], tag: 'Theory & Data' },
    { num: 3, title: 'Part III — Machine Learning & AI Foundations', stages: [6, 7, 8, 9, 10, 11], tag: 'Models' },
    { num: 4, title: 'Part IV — Language Models & AI Applications', stages: [12, 13, 14, 15, 16, 17, 18], tag: 'LLMs & Agents' },
    { num: 5, title: 'Part V — Reliable AI Systems', stages: [19, 20], tag: 'MLOps & Systems' },
    { num: 6, title: 'Part VI — Cybersecurity', stages: [21, 22, 23, 24, 25], tag: 'Applied Security' },
    { num: 7, title: 'Part VII — AI Security & AI for Cybersecurity', stages: [26, 27, 28], tag: 'Adversarial AI' },
    { num: 8, title: 'Part VIII — Research & Integration', stages: [29, 30], tag: 'Capstones' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Mission Header */}
      <div className="border-b border-surface-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-cyber-sky animate-pulse"></span>
            <span>Interactive Learning Academy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            AI, Systems & Cybersecurity Engineering
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            From computing hardware and software fundamentals to advanced LLMs, high-performance systems, and cybersecurity research.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/curriculum"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs font-mono text-slate-200 transition"
          >
            <Map className="w-4 h-4 text-cyber-sky" />
            <span>Curriculum Map</span>
          </Link>
          <Link
            to={`/stage/${activeStage.id}`}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyber-sky text-void font-semibold text-xs font-mono hover:bg-sky-400 transition shadow-lg shadow-cyber-sky/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume Stage {activeStage.id}</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-surface-card border border-surface-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Stages Started</span>
            <BookOpen className="w-4 h-4 text-cyber-sky" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">
            {startedStagesCount} <span className="text-xs text-slate-500 font-normal">/ 31</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            {progressPercent}% Complete
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-card border border-surface-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Stages Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">
            {completedStagesCount} <span className="text-xs text-slate-500 font-normal">/ 31</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Mastery checks verified
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-card border border-surface-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Portfolio Builds</span>
            <FolderGit2 className="w-4 h-4 text-cyber-indigo" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">
            25+ <span className="text-xs text-slate-500 font-normal">Required</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Scratch implementations
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-card border border-surface-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Master Capstones</span>
            <Award className="w-4 h-4 text-cyber-amber" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">
            4 <span className="text-xs text-slate-500 font-normal">Projects</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            End-to-end integration
          </div>
        </div>
      </div>

      {/* Active Focus Hero Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-surface-card via-surface to-surface-card border border-surface-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-sky/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyber-sky/20 text-cyber-sky border border-cyber-sky/40 text-[11px] font-mono font-semibold">
                CURRENT LEARNING STAGE {activeStage.id}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {activeStage.partTitle.split('—')[0]}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              {activeStage.title}
            </h2>

            <p className="text-sm text-slate-400 leading-relaxed">
              {activeStage.shortDescription}
            </p>

            {/* Pilot Lesson Highlight Banner */}
            {activeStage.id === 0 && (
              <div className="p-3 rounded-lg bg-cyber-sky/10 border border-cyber-sky/30 flex items-start space-x-3">
                <Cpu className="w-5 h-5 text-cyber-sky flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-cyber-sky">CPU Pilot • In development: </span>
                  Preview the CPU lesson outline and early cycle demonstration. The full lesson and visualizations are still being built.
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {activeStage.buildFromScratch.map((build, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-surface border border-surface-border text-[11px] font-mono text-slate-300 flex items-center space-x-1.5"
                >
                  <Terminal className="w-3 h-3 text-cyber-sky" />
                  <span>{build}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
            <Link
              to={`/stage/${activeStage.id}`}
              className="px-4 py-2.5 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono text-center hover:bg-sky-400 transition flex items-center justify-center space-x-2 shadow-lg shadow-cyber-sky/20"
            >
              <span>Explore Stage {activeStage.id}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/simulators/cpu-instruction-cycle"
              className="px-4 py-2.5 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-white hover:border-cyber-sky text-xs font-mono text-center transition flex items-center justify-center space-x-2"
            >
              <Cpu className="w-3.5 h-3.5 text-cyber-sky" />
              <span>Launch CPU Simulator</span>
            </Link>
          </div>
        </div>
      </div>

      {/* The 8 Curriculum Parts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              The 8 Master Curriculum Phases
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly preserved from the source roadmap without omission
            </p>
          </div>
          <Link
            to="/curriculum"
            className="text-xs font-mono text-cyber-sky hover:underline flex items-center space-x-1"
          >
            <span>View All 31 Stages</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {parts.map((part) => {
            const completedInPart = part.stages.filter(id => progress.completedStages.includes(id)).length;
            const isStarted = part.stages.some(id => progress.startedStages.includes(id));

            return (
              <div
                key={part.num}
                className="p-4 rounded-xl bg-surface-card border border-surface-border hover:border-slate-600 transition flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Part {part.num}</span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-cyber-sky text-[10px]">
                      {part.tag}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-200 mt-2 group-hover:text-cyber-sky transition">
                    {part.title.split('—')[1] || part.title}
                  </h4>

                  <div className="mt-3 space-y-1">
                    {part.stages.map((stageId) => {
                      const st = CURRICULUM_STAGES[stageId];
                      if (!st) return null;
                      const isStDone = progress.completedStages.includes(stageId);
                      return (
                        <Link
                          key={stageId}
                          to={`/stage/${stageId}`}
                          className="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-surface text-slate-400 hover:text-slate-200 transition font-mono"
                        >
                          <span className="truncate pr-2">
                            <span className="text-slate-600 mr-1.5">S{stageId}</span>
                            {st.title}
                          </span>
                          {isStDone && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald flex-shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Progress: {completedInPart}/{part.stages.length}</span>
                  <Link
                    to={`/stage/${part.stages[0]}`}
                    className="text-cyber-sky hover:underline"
                  >
                    Open &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Study System & Methodology Reminder */}
      <div className="p-5 rounded-xl bg-surface-card border border-surface-border text-xs text-slate-400 space-y-3">
        <div className="flex items-center space-x-2 text-slate-200 font-mono font-semibold">
          <Activity className="w-4 h-4 text-cyber-emerald" />
          <span>The Master Learning Method</span>
        </div>
        <p className="leading-relaxed">
          <strong className="text-slate-200">The Mastery Standard:</strong> Understand the problem &rarr; Explain the mechanism &rarr; Implement a small version &rarr; Verify correctness &rarr; Experiment with parameters &rarr; Measure failure limits.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-[11px]">
          <div className="p-2.5 rounded bg-surface border border-surface-border">
            <span className="text-cyber-sky font-semibold block">40% Implementation</span>
            <span className="text-slate-500">Coding & debugging from scratch</span>
          </div>
          <div className="p-2.5 rounded bg-surface border border-surface-border">
            <span className="text-cyber-amber font-semibold block">25% Theory & Math</span>
            <span className="text-slate-500">First-principles & equations</span>
          </div>
          <div className="p-2.5 rounded bg-surface border border-surface-border">
            <span className="text-cyber-emerald font-semibold block">20% Experiments</span>
            <span className="text-slate-500">Simulators & parameter ablation</span>
          </div>
          <div className="p-2.5 rounded bg-surface border border-surface-border">
            <span className="text-cyber-indigo font-semibold block">15% Review & Docs</span>
            <span className="text-slate-500">Recall & explanatory writing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

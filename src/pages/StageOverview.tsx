import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  FolderGit2, 
  BookOpen, 
  CheckSquare, 
  Clock, 
  Sparkles,
  Play
} from 'lucide-react';
import { NotFound } from './NotFound';
import { CURRICULUM_STAGES } from '../data/curriculumData';
import { useProgress } from '../context/ProgressContext';

export const StageOverview: React.FC = () => {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const { progress, markStageStarted, markStageCompleted } = useProgress();

  const id = /^\d+$/.test(stageId || '') ? Number(stageId) : -1;
  const stage = CURRICULUM_STAGES[id] || CURRICULUM_STAGES[0];

  const isCompleted = progress.completedStages.includes(stage.id);
  const isStarted = progress.startedStages.includes(stage.id);

  const prevStage = id > 0 ? CURRICULUM_STAGES[id - 1] : null;
  const nextStage = id < CURRICULUM_STAGES.length - 1 ? CURRICULUM_STAGES[id + 1] : null;

  const handleStartOrContinue = () => {
    markStageStarted(stage.id);
    if (stage.id === 0) {
      navigate('/stage/0/lesson/cpu-architecture');
    }
  };

  const handleToggleCompleted = () => {
    markStageCompleted(stage.id);
  };

  if (!CURRICULUM_STAGES[id]) return <NotFound />;

  return (
    <div className="space-y-8">
      {/* Back and Stage Navigation Bar */}
      <div className="flex items-center justify-between text-xs font-mono border-b border-surface-border pb-4">
        <Link
          to="/curriculum"
          className="flex items-center space-x-1.5 text-slate-400 hover:text-cyber-sky transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Curriculum Directory</span>
        </Link>

        <div className="flex items-center space-x-4">
          {prevStage && (
            <Link
              to={`/stage/${prevStage.id}`}
              className="text-slate-400 hover:text-slate-200 transition"
            >
              &larr; Stage {prevStage.id}
            </Link>
          )}
          {nextStage && (
            <Link
              to={`/stage/${nextStage.id}`}
              className="text-cyber-sky hover:underline transition"
            >
              Stage {nextStage.id} &rarr;
            </Link>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-cyber-sky/20 text-cyber-sky border border-cyber-sky/40 text-xs font-mono font-bold">
              STAGE {stage.id}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {stage.partTitle}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-slate-500 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{stage.estimatedHours}</span>
            </span>

            {isCompleted ? (
              <span className="px-3 py-1 rounded bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/40 text-xs font-mono font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Stage Mastered</span>
              </span>
            ) : (
              <button
                disabled title="Mastery verification will unlock when assessments are implemented"
                className="px-3 py-1 rounded bg-surface hover:bg-surface-elevated border border-surface-border text-xs font-mono text-slate-300 transition"
              >
                Assessment unavailable
              </button>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          {stage.title}
        </h1>

        <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
          {stage.shortDescription}
        </p>

        {/* Action Bar */}
        <div className="pt-2 flex flex-wrap gap-3">
          {stage.id === 0 ? (
            <>
              <Link
                to="/stage/0/lesson/cpu-architecture"
                className="px-4 py-2.5 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition flex items-center space-x-2 shadow-lg shadow-cyber-sky/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Lesson 1: CPU Architecture</span>
              </Link>
              <Link
                to="/stage/0/lesson/binary-data-representation"
                className="px-4 py-2.5 rounded-lg bg-surface border border-cyber-emerald/40 text-cyber-emerald hover:bg-cyber-emerald/10 font-bold text-xs font-mono transition flex items-center space-x-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Lesson 2: Memory & Binary Data</span>
              </Link>
              <Link
                to="/stage/0/lesson/operating-systems"
                className="px-4 py-2.5 rounded-lg bg-surface border border-cyber-indigo/40 text-cyber-indigo hover:bg-cyber-indigo/10 font-bold text-xs font-mono transition flex items-center space-x-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Lesson 3: Operating Systems</span>
              </Link>
              <Link
                to="/stage/0/lesson/developer-tooling"
                className="px-4 py-2.5 rounded-lg bg-surface border border-cyber-amber/40 text-cyber-amber hover:bg-cyber-amber/10 font-bold text-xs font-mono transition flex items-center space-x-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Lesson 4: Shell & Git</span>
              </Link>
            </>
          ) : (
            <button
              onClick={handleStartOrContinue}
              className="px-4 py-2.5 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition flex items-center space-x-2 shadow-lg shadow-cyber-sky/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isStarted ? 'Stage added to your plan' : 'Add stage to my plan'}</span>
            </button>
          )}

          {stage.simulators.length > 0 && (
            <Link
              to={stage.simulators[0].path}
              className="px-4 py-2.5 rounded-lg bg-surface border border-surface-border text-slate-200 hover:text-white hover:border-cyber-sky text-xs font-mono transition flex items-center space-x-2"
            >
              <Cpu className="w-3.5 h-3.5 text-cyber-sky" />
              <span>Launch Simulators ({stage.simulators.length})</span>
            </Link>
          )}
        </div>
      </div>

      {/* Quality Pilot Highlight Banner for Stage 0 */}
      {stage.id === 0 && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-cyber-sky/15 via-surface-card to-surface-card border border-cyber-sky/40 space-y-3">
          <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyber-sky" />
            <span>Stage 0 Comprehensive Computing Lessons</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            Stage 0 delivers rigorous first-principles lessons across all core computing fundamentals: from CPU clock cycles, pipelines, and register banks to Two's Complement, IEEE-754 floating point, virtual memory page tables, Unix shell pipelines, and Git content-addressable DAGs.
          </p>
          <div className="flex flex-wrap gap-4 pt-1">
            <Link
              to="/stage/0/lesson/cpu-architecture"
              className="text-xs font-mono font-semibold text-cyber-sky hover:underline flex items-center space-x-1"
            >
              <span>Lesson 1: CPU Architecture & ISA &rarr;</span>
            </Link>
            <Link
              to="/stage/0/lesson/binary-data-representation"
              className="text-xs font-mono font-semibold text-cyber-emerald hover:underline flex items-center space-x-1"
            >
              <span>Lesson 2: Memory Hierarchy & Binary Data &rarr;</span>
            </Link>
            <Link
              to="/stage/0/lesson/operating-systems"
              className="text-xs font-mono font-semibold text-cyber-indigo hover:underline flex items-center space-x-1"
            >
              <span>Lesson 3: Operating System Primitives &rarr;</span>
            </Link>
            <Link
              to="/stage/0/lesson/developer-tooling"
              className="text-xs font-mono font-semibold text-cyber-amber hover:underline flex items-center space-x-1"
            >
              <span>Lesson 4: Shell & Git Internals &rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {/* Two Column Layout: Topics vs Implementation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Topics Breakdown */}
        <div className="space-y-6">
          {/* Original Roadmap Topics */}
          <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-cyber-sky" />
                <span>Original Roadmap Topics</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border text-cyber-sky">
                Verbatim Source
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Preserved verbatim from the curriculum PDF ("Understand" section):
            </p>
            <ul className="space-y-2">
              {stage.originalTopics.map((topic, index) => (
                <li key={index} className="flex items-start space-x-2.5 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-sky flex-shrink-0 mt-1.5"></span>
                  <span className="leading-relaxed">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expanded Supporting Subtopics */}
          <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyber-indigo" />
                <span>Expanded Supporting Subtopics</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border text-slate-400">
                Detailed Engineering
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Technical subtopics expanding the foundational roadmap into deep engineering practice:
            </p>
            <ul className="space-y-2">
              {stage.expandedSubtopics.map((sub, index) => (
                <li key={index} className="flex items-start space-x-2.5 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-indigo flex-shrink-0 mt-1.5"></span>
                  <span className="leading-relaxed">{sub}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Build From Scratch, Project & Simulators */}
        <div className="space-y-6">
          {/* Build From Scratch */}
          <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyber-emerald" />
                <span>Build From Scratch Requirements</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border text-cyber-emerald">
                Portfolio Builds
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Required implementations built with zero heavy external magic libraries:
            </p>
            <div className="space-y-2">
              {stage.buildFromScratch.map((build, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-surface border border-surface-border text-xs font-mono text-slate-200 flex items-center space-x-2.5"
                >
                  <span className="w-5 h-5 rounded bg-surface-card border border-surface-border flex items-center justify-center text-[10px] text-cyber-emerald font-bold">
                    {index + 1}
                  </span>
                  <span>{build}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Stage Project */}
          <div className={`p-5 rounded-xl bg-surface-card border space-y-3 ${stage.id === 0 ? 'border-cyber-emerald/50' : 'border-surface-border'}`}>
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <FolderGit2 className={`w-4 h-4 ${stage.id === 0 ? 'text-cyber-emerald' : 'text-cyber-amber'}`} />
                <span>Stage Milestone Project</span>
              </h3>
              {stage.id === 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/40 font-bold">
                  ✓ Verified in examples/
                </span>
              )}
            </div>
            <h4 className={`text-xs font-bold font-mono uppercase ${stage.id === 0 ? 'text-cyber-emerald' : 'text-cyber-amber'}`}>
              {stage.projectTitle}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {stage.projectDescription}
            </p>
            {stage.id === 0 && (
              <div className="pt-2 border-t border-surface-border/60 space-y-2">
                <div className="text-[11px] font-mono text-slate-400">
                  <span className="text-cyber-emerald font-semibold">Location: </span>
                  <code className="text-slate-200">examples/stage-0-workspace-project/</code>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-slate-300">file_organizer.py</span>
                  <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-slate-300">metadata_inspector.py</span>
                  <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-slate-300">directory_reporter.sh</span>
                  <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-slate-300">Makefile</span>
                  <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-slate-300">Dockerfile</span>
                </div>
                <div className="pt-1">
                  <Link
                    to="/projects"
                    className="text-xs font-mono text-cyber-sky hover:underline flex items-center space-x-1"
                  >
                    <span>View Engineering Portfolio Spec &rarr;</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mastery Check */}
          <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyber-sky" />
                <span>Official Mastery Check</span>
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic bg-surface p-3 rounded-lg border border-surface-border">
              "{stage.masteryCheck}"
            </p>
          </div>

          {/* Interactive Simulators in this Stage */}
          {stage.simulators.length > 0 && (
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-cyber-sky" />
                  <span>Interactive Simulators</span>
                </h3>
              </div>
              <div className="space-y-2">
                {stage.simulators.map((sim) => (
                  <Link
                    key={sim.id}
                    to={sim.path}
                    className="p-3 rounded-lg bg-surface hover:bg-surface-elevated border border-surface-border hover:border-cyber-sky text-xs transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-mono font-bold text-slate-200 group-hover:text-cyber-sky transition">
                        {sim.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {sim.description}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyber-sky flex-shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

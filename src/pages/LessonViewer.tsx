import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  CheckCircle2, 
  Cpu, 
  Terminal, 
  BookOpen, 
  Layers, 
  Sliders, 
  FileCode2, 
  Sparkles,
  Share2,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';
import { useProgress } from '../context/ProgressContext';

export const LessonViewer: React.FC = () => {
  const { stageId, lessonId } = useParams<{ stageId: string; lessonId: string }>();
  const { progress, markLessonCompleted, toggleBookmark, isBookmarked } = useProgress();

  const id = parseInt(stageId || '0', 10);
  const stage = CURRICULUM_STAGES[id] || CURRICULUM_STAGES[0];
  const currentPath = `/stage/${id}/lesson/${lessonId}`;
  const bookmarked = isBookmarked(currentPath);
  const completed = progress.completedLessons.includes(currentPath);

  const [activeSection, setActiveSection] = useState('intro');

  // 18-Point Framework Table of Contents
  const tocItems = [
    { id: 'objectives', title: '1. Learning Objectives' },
    { id: 'prereqs', title: '2. Prerequisites & Assumptions' },
    { id: 'problem', title: '3. Historical Context & The Problem' },
    { id: 'fundamentals', title: '4. First Principles & Intuition' },
    { id: 'terminology', title: '5. Core Terminology & Notation' },
    { id: 'architecture', title: '6. Internal Component Architecture' },
    { id: 'mechanism', title: '7. Step-by-Step Working Mechanism' },
    { id: 'diagrams', title: '8. Architecture Schematics' },
    { id: 'animations', title: '9. Animated Dynamic Cycles' },
    { id: 'math', title: '10. Mathematics & Numerical Derivations' },
    { id: 'linux-demo', title: '11. Practical Linux & Tooling Demo' },
    { id: 'scratch-code', title: '12. Implementation From Scratch' },
    { id: 'real-world', title: '13. Production Systems & Case Studies' },
    { id: 'advanced', title: '14. Advanced Optimizations' },
    { id: 'failures', title: '15. Edge Cases & Failure Modes' },
    { id: 'experiments', title: '16. Interactive Experiments' },
    { id: 'exercises', title: '17. Graded Challenges' },
    { id: 'assessment', title: '18. Mini-Project & Mastery Assessment' },
  ];

  const handleMarkComplete = () => {
    markLessonCompleted(currentPath);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between text-xs font-mono border-b border-surface-border pb-3">
        <Link
          to={`/stage/${stage.id}`}
          className="flex items-center space-x-1.5 text-slate-400 hover:text-cyber-sky transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stage {stage.id}: {stage.title}</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => toggleBookmark(currentPath)}
            className={`p-1.5 rounded-lg border transition flex items-center space-x-1.5 ${
              bookmarked
                ? 'bg-cyber-sky/10 border-cyber-sky/40 text-cyber-sky'
                : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
            }`}
            title="Bookmark this lesson"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{bookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>

          <button
            onClick={handleMarkComplete}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition flex items-center space-x-1.5 ${
              completed
                ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald'
                : 'bg-cyber-sky text-void hover:bg-sky-400 border-transparent shadow-md shadow-cyber-sky/20'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{completed ? 'Lesson Completed' : 'Mark as Completed'}</span>
          </button>
        </div>
      </div>

      {/* Main Lesson Body with Sticky Table of Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column: Lesson Content (3 cols) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Lesson Header */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyber-sky/20 text-cyber-sky border border-cyber-sky/40 text-[11px] font-mono font-semibold">
                STAGE {stage.id} LESSON
              </span>
              <span className="text-xs font-mono text-slate-500">
                18-Point First Principles Framework
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {lessonId === 'cpu-architecture' ? 'CPU Architecture, ISA & Instruction Execution' : stage.title}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              {lessonId === 'cpu-architecture'
                ? 'A comprehensive first-principles exploration of the Central Processing Unit: ALU, Control Unit, register banks, clock cycles, ISA encoding, the 5-stage pipeline, branch prediction, and superscalar microarchitectures.'
                : stage.shortDescription}
            </p>
          </div>

          {/* Quick Launch Simulators Banner */}
          {stage.simulators.length > 0 && (
            <div className="p-4 rounded-xl bg-surface-card border border-surface-border flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyber-sky/10 border border-cyber-sky/30 text-cyber-sky">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono text-slate-100">
                    Interactive Teaching Laboratory Ready
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    This topic includes {stage.simulators.length} interactive simulator{stage.simulators.length > 1 ? 's' : ''} with step-by-step clock cycle controls.
                  </p>
                </div>
              </div>

              <Link
                to={stage.simulators[0].path}
                className="px-3 py-1.5 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition flex-shrink-0"
              >
                Launch Simulator &rarr;
              </Link>
            </div>
          )}

          {/* 1. Learning Objectives */}
          <section id="objectives" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">1.</span>
              <span>Learning Objectives</span>
            </h2>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-cyber-sky flex-shrink-0 mt-0.5" />
                <span>Explain the fundamental necessity of the CPU and the Von Neumann architecture boundary.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-cyber-sky flex-shrink-0 mt-0.5" />
                <span>Trace the discrete 5-stage instruction cycle: Fetch, Decode, Execute, Memory Access, and Writeback.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-cyber-sky flex-shrink-0 mt-0.5" />
                <span>Differentiate RISC and CISC design philosophies with concrete x86-64 and ARM64 instruction analysis.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-cyber-sky flex-shrink-0 mt-0.5" />
                <span>Diagnose instruction pipeline hazards (structural, data, control) and mitigate them via forwarding and branch prediction.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-cyber-sky flex-shrink-0 mt-0.5" />
                <span>Build, test, and step through an educational CPU instruction cycle simulator from scratch.</span>
              </li>
            </ul>
          </section>

          {/* 2. Prerequisites */}
          <section id="prereqs" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">2.</span>
              <span>Prerequisites & Assumptions</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              This lesson is designed for beginners with zero prior computer engineering background. A basic conceptual grasp of binary numbers (0s and 1s) and elementary logic gates (AND, OR, NOT) is helpful but fully reviewed in Section 4.
            </p>
          </section>

          {/* 3. Historical Context */}
          <section id="problem" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">3.</span>
              <span>The Problem & Historical Context</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Before the invention of stored-program general-purpose microprocessors, computers were single-purpose calculating machines or required physical rewiring (such as the ENIAC with plugboards and switches) to alter program behavior.
            </p>
            <div className="p-3 rounded-lg bg-surface border border-surface-border text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-cyber-amber block">The Breakthrough: Von Neumann Architecture (1945)</span>
              <span>Unifying program instructions and data into the same shared memory space, coordinated by a central processing engine capable of fetching and executing sequential instructions automatically.</span>
            </div>
          </section>

          {/* Phase 4 Pilot Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-card to-surface-elevated border border-cyber-sky/30 space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyber-sky" />
              <span>Full Phase 4 Pilot Ready for Deployment</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Interactive CPU Pilot Blueprint Connected
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The full 28-topic CPU Architecture lesson framework, including the live animated 5-stage pipeline, ALU simulator, register visualizer, cache hit/miss explorer, and educational Python CPU simulator, will be fully realized in Phase 4.
            </p>
            <div className="pt-1 flex flex-wrap gap-3">
              <Link
                to="/simulators/cpu-instruction-cycle"
                className="px-3.5 py-2 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition flex items-center space-x-2"
              >
                <Cpu className="w-4 h-4" />
                <span>Launch CPU Instruction Cycle Simulator</span>
              </Link>
              <Link
                to="/playground"
                className="px-3.5 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-white text-xs font-mono transition flex items-center space-x-2"
              >
                <Terminal className="w-4 h-4" />
                <span>Open CPU Code Playground</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Table of Contents (1 col) */}
        <div className="hidden lg:block sticky top-20 space-y-4">
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between border-b border-surface-border pb-2">
              <span>Table of Contents</span>
              <BookOpen className="w-3.5 h-3.5 text-cyber-sky" />
            </div>
            <nav className="space-y-1 text-[11px] font-mono max-h-[70vh] overflow-y-auto pr-1">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`block px-2 py-1.5 rounded transition truncate ${
                    activeSection === item.id
                      ? 'bg-cyber-sky/15 text-cyber-sky font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-surface'
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Quick Help Note */}
          <div className="p-3 rounded-lg bg-surface border border-surface-border text-[11px] font-mono text-slate-500">
            <span>Pedagogical Standard:</span> All 18 points rigorously covered before lesson sign-off.
          </div>
        </div>
      </div>
    </div>
  );
};

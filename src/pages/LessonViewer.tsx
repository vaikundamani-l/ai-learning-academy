import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  CheckCircle2, 
  Cpu, 
  FileText,
  Sparkles,
  Check
} from 'lucide-react';
import { NotFound } from './NotFound';
import { CURRICULUM_STAGES } from '../data/curriculumData';
import { useProgress } from '../context/ProgressContext';
import { MathBlock } from '../components/learning/MathBlock';
import { CodeBlock } from '../components/learning/CodeBlock';
import { Callout } from '../components/learning/Callout';
import { ScrollAwareTOC } from '../components/learning/ScrollAwareTOC';
import { SelfCheck } from '../components/learning/SelfCheck';
import { LessonNotesDrawer } from '../components/learning/LessonNotesDrawer';

export const LessonViewer: React.FC = () => {
  const { stageId, lessonId } = useParams<{ stageId: string; lessonId: string }>();
  const { progress, toggleBookmark, isBookmarked } = useProgress();
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const id = /^\d+$/.test(stageId || '') ? Number(stageId) : -1;
  const stage = CURRICULUM_STAGES[id] || CURRICULUM_STAGES[0];
  const currentPath = `/stage/${id}/lesson/${lessonId}`;
  const bookmarked = isBookmarked(currentPath);
  const completed = progress.completedLessons.includes(currentPath);

  // Real sections present in this lesson
  const tocSections = [
    { id: 'objectives', title: '1. Learning Objectives' },
    { id: 'prereqs', title: '2. Prerequisites & Assumptions' },
    { id: 'problem', title: '3. Historical Context & Core Problem' },
    { id: 'first-principles', title: '4. First Principles & Hardware Reality' },
    { id: 'math-equations', title: '5. Mathematical Foundations & IPC' },
    { id: 'code-implementation', title: '6. Microcode Implementation' },
    { id: 'self-check', title: '7. Diagnostic Self-Check' },
    { id: 'pilot-preview', title: '8. Complete Phase 4 Pilot Blueprint' },
  ];

  if (!CURRICULUM_STAGES[id] || id !== 0 || lessonId !== 'cpu-architecture') return <NotFound />;

  const sampleMicrocode = `# Educational 5-Stage CPU Instruction Decoding & Execution
# Stage 0: Foundation Architecture Demonstration

class SimpleCPU:
    def __init__(self):
        self.registers = {"R1": 5, "R2": 12, "R3": 0, "R4": 0}
        self.memory = {0x0A: 9, 0x0C: 0}
        self.pc = 0x0000
        self.zero_flag = False

    def step(self, opcode, dest, src):
        """Execute one instruction through discrete functional stages."""
        # STAGE 1: FETCH -> (handled by PC increment)
        self.pc += 4

        # STAGE 2: DECODE & READ REGISTERS
        val_src = self.memory.get(src, 0) if isinstance(src, int) else self.registers.get(src, src)

        # STAGE 3: EXECUTE (ALU)
        if opcode == "LOAD":
            result = val_src
        elif opcode == "ADD":
            result = self.registers[dest] + val_src
        elif opcode == "SUB":
            result = self.registers[dest] - val_src
            self.zero_flag = (result == 0)
        elif opcode == "STORE":
            self.memory[src] = self.registers[dest]
            return

        # STAGE 4 & 5: MEMORY & WRITEBACK
        self.registers[dest] = result`;

  return (
    <div className="space-y-6">
      {/* Draft notice banner */}
      <div role="status" className="rounded-xl border border-cyber-amber/40 bg-cyber-amber/10 p-4 text-xs font-mono text-slate-200 flex items-start space-x-2">
        <Sparkles className="w-4 h-4 text-cyber-amber flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-100">Learning Engine Preview: </strong>
          Sections below demonstrate KaTeX math formulas, syntax-highlighted code blocks, scroll-aware Table of Contents, responsive callouts, and diagnostic self-checks. The full 28-topic lesson and simulations will be deployed in Phase 4.
        </div>
      </div>

      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between text-xs font-mono border-b border-surface-border pb-3">
        <Link
          to={`/stage/${stage.id}`}
          className="flex items-center space-x-1.5 text-slate-400 hover:text-cyber-sky transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stage {stage.id}: {stage.title}</span>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Notes Drawer Toggle Button */}
          <button
            onClick={() => setIsNotesOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs font-mono text-slate-300 transition flex items-center space-x-1.5"
            title="Open lesson notes"
          >
            <FileText className="w-3.5 h-3.5 text-cyber-sky" />
            <span>Notes</span>
            {progress.notes[currentPath] && (
              <span className="w-1.5 h-1.5 bg-cyber-sky rounded-full"></span>
            )}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(currentPath)}
            className={`p-1.5 rounded-lg border transition flex items-center space-x-1.5 ${
              bookmarked
                ? 'bg-cyber-sky/15 border-cyber-sky/40 text-cyber-sky'
                : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
            }`}
            title="Bookmark this lesson"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{bookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>

          {/* Completion Button */}
          <button
            disabled
            title="Completion unlocks after the full lesson and assessments are deployed"
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition flex items-center space-x-1.5 ${
              completed
                ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald'
                : 'bg-surface-card border-surface-border text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{completed ? 'Lesson Completed' : 'Draft • Locked'}</span>
          </button>
        </div>
      </div>

      {/* Main Lesson Body with Scroll-Aware Table of Contents */}
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
              CPU Architecture, ISA & Instruction Execution
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              A comprehensive first-principles exploration of the Central Processing Unit: ALU, Control Unit, register banks, clock cycles, ISA encoding, the 5-stage pipeline, branch prediction, and superscalar microarchitectures.
            </p>
          </div>

          {/* Callout Demo: Engineering Context */}
          <Callout type="note" title="The Von Neumann Bottleneck">
            In standard Von Neumann machines, instructions and data share a unified memory bus. As CPU clock frequencies scaled exponentially from kilohertz to gigahertz, the throughput of the memory bus lagged far behind. This fundamental disparity gave rise to the multi-level CPU cache hierarchy (L1, L2, L3).
          </Callout>

          {/* 1. Learning Objectives */}
          <section id="objectives" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">1.</span>
              <span>Learning Objectives</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-cyber-sky flex-shrink-0 mt-1" />
                <span>Explain the fundamental necessity of the CPU and the Von Neumann architecture boundary.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-cyber-sky flex-shrink-0 mt-1" />
                <span>Trace the discrete 5-stage instruction cycle: Fetch, Decode, Execute, Memory Access, and Writeback.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-cyber-sky flex-shrink-0 mt-1" />
                <span>Differentiate RISC and CISC design philosophies with concrete x86-64 and ARM64 instruction analysis.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-cyber-sky flex-shrink-0 mt-1" />
                <span>Diagnose instruction pipeline hazards (structural, data, control) and mitigate them via forwarding and branch prediction.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-cyber-sky flex-shrink-0 mt-1" />
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
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              This lesson is designed for beginners with zero prior computer engineering background. A basic conceptual grasp of binary numbers (0s and 1s) and elementary logic gates (AND, OR, NOT) is helpful.
            </p>
          </section>

          {/* 3. Historical Context */}
          <section id="problem" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">3.</span>
              <span>The Problem & Historical Context</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Before the invention of stored-program general-purpose microprocessors, computers were single-purpose calculating machines or required physical rewiring (such as the ENIAC with plugboards and switches) to alter program behavior.
            </p>
          </section>

          {/* 4. First Principles & Hardware Reality */}
          <section id="first-principles" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">4.</span>
              <span>First Principles & Hardware Reality</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              At its physical silicon substrate, a CPU is a synchronous digital circuit composed of billions of microscopic MOSFET transistors acting as voltage-controlled electronic switches. These switches form elementary boolean logic gates, which combine into functional execution units.
            </p>

            <Callout type="hardware" title="Transistor Switching & Clock Edges">
              Registers are fabricated using bistable multivibrators (flip-flops) constructed from cross-coupled inverter gates. On each rising edge of the quartz clock oscillator, the Control Unit triggers latch enables, causing data to transition synchronously from one register stage to the next.
            </Callout>
          </section>

          {/* 5. Mathematical Foundations & IPC */}
          <section id="math-equations" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">5.</span>
              <span>Mathematical Foundations & The CPU Performance Equation</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              The execution time of any program on a processor is governed by the classic three-factor Iron Law of Processor Performance:
            </p>

            <MathBlock
              math="\text{CPU Time} = \frac{\text{Instructions}}{\text{Program}} \times \frac{\text{Clock Cycles}}{\text{Instruction}} \times \frac{\text{Seconds}}{\text{Clock Cycle}}"
              ariaLabel="The CPU Performance Equation"
            />

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Or more compactly, where <MathBlock math="I" inline /> is instruction count, <MathBlock math="\text{CPI}" inline /> is average cycles per instruction, and <MathBlock math="\tau" inline /> is clock cycle period (<MathBlock math="\tau = 1/f" inline />):
            </p>

            <MathBlock
              math="T_{\text{exec}} = I \times \text{CPI} \times \tau = \frac{I \times \text{CPI}}{f_{\text{clock}}}"
              ariaLabel="Compact CPU Execution Time Equation"
            />

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Under ideal 5-stage pipelining with zero hazard stalls, the processor achieves <MathBlock math="\text{CPI} \to 1.0" inline /> (<MathBlock math="\text{IPC} \to 1.0" inline />). In superscalar processors capable of dispatching <MathBlock math="W" inline /> instructions per cycle:
            </p>

            <MathBlock
              math="\text{IPC}_{\text{peak}} = W \quad \implies \quad \text{CPI}_{\text{ideal}} = \frac{1}{W}"
              ariaLabel="Peak Instructions Per Cycle"
            />

            <Callout type="deep-dive" title="Amdahl's Law of System Speedup">
              When accelerating instruction execution through parallel execution units, overall program speedup is bounded by the inherently sequential fraction <MathBlock math="s" inline />:
              <MathBlock math="S(p) = \frac{1}{s + \frac{1 - s}{p}}" />
            </Callout>
          </section>

          {/* 6. Microcode Implementation */}
          <section id="code-implementation" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">6.</span>
              <span>Microcode Implementation</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Below is an educational Python implementation demonstrating how a Control Unit sequentially decodes instructions, directs data across the register bank, and mutates memory:
            </p>

            <CodeBlock
              code={sampleMicrocode}
              language="python"
              title="cpu_microcode_engine.py"
              highlightLines={[12, 16, 21]}
            />
          </section>

          {/* 7. Diagnostic Self-Check */}
          <section id="self-check" className="space-y-3">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">7.</span>
              <span>Diagnostic Self-Check</span>
            </h2>

            <SelfCheck
              question="What fundamental problem occurs in a pipelined CPU when instruction J tries to read register R1 during its Decode stage, while instruction I (which calculates R1) is still in the Execute stage?"
              options={[
                {
                  text: 'A Structural Hazard: the processor lacks sufficient physical ALU execution circuits.',
                  isCorrect: false,
                  explanation: 'Structural hazards occur when hardware resources (e.g. memory ports or ALU units) cannot support two simultaneous operations, not from data dependencies.'
                },
                {
                  text: 'A Data Hazard (Read-After-Write / RAW): instruction J would read a stale, uncommitted value of R1.',
                  isCorrect: true,
                  explanation: 'Correct! This is a classic RAW data dependency. Without hardware forwarding (bypassing the ALU output directly to the next stage) or pipeline stalls (bubbles), instruction J computes with incorrect data.'
                },
                {
                  text: 'A Control Hazard: the branch predictor failed to guess the target instruction address.',
                  isCorrect: false,
                  explanation: 'Control hazards result from conditional branch instructions altering the Program Counter (PC), not register read/write dependencies.'
                }
              ]}
            />
          </section>

          {/* 8. Phase 4 Pilot Banner */}
          <section id="pilot-preview" className="p-6 rounded-2xl bg-gradient-to-br from-surface-card to-surface-elevated border border-cyber-sky/30 space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyber-sky" />
              <span>Phase 4 Quality Benchmark Pilot</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Complete 28-Topic Master Lesson Scheduled for Phase 4
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              In Phase 4, this blueprint will expand into the comprehensive 28-topic lesson covering ALU bit-slices, Control Unit state machines, x86-64 vs. ARM64 ISA comparisons, 5-stage pipeline hazard simulation, branch prediction state machines, superscalar reorder buffers, and Linux CPU profiling (`/proc/cpuinfo`, `perf`).
            </p>
            <div className="pt-1 flex flex-wrap gap-3">
              <Link
                to="/simulators/cpu-instruction-cycle"
                className="px-3.5 py-2 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition flex items-center space-x-2"
              >
                <Cpu className="w-4 h-4" />
                <span>Launch CPU Instruction Simulator</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Table of Contents (1 col) */}
        <div className="hidden lg:block sticky top-20 space-y-4">
          <ScrollAwareTOC sections={tocSections} />

          <div className="p-3 rounded-lg bg-surface-card border border-surface-border text-[11px] font-mono text-slate-500 space-y-1">
            <span className="font-semibold text-slate-300 block">Scroll-Aware Navigation</span>
            <span>TOC automatically tracks active section and reading progress.</span>
          </div>
        </div>
      </div>

      {/* Embedded In-Lesson Notes Drawer */}
      <LessonNotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        lessonPath={currentPath}
        lessonTitle="CPU Architecture, ISA & Instruction Execution"
      />
    </div>
  );
};

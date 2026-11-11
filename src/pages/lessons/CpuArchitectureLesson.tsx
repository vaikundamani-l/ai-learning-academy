import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  CheckCircle2, 
  FileText,
  Sparkles,
  Check,
  Award,
  AlertCircle,
  RotateCcw,
  Wrench,
  HelpCircle,
  Cpu,
  Layers
} from 'lucide-react';
import { Stage } from '../../types/curriculum';
import { useProgress } from '../../context/ProgressContext';
import { MathBlock } from '../../components/learning/MathBlock';
import { CodeBlock } from '../../components/learning/CodeBlock';
import { Callout } from '../../components/learning/Callout';
import { ScrollAwareTOC } from '../../components/learning/ScrollAwareTOC';
import { LessonNotesDrawer } from '../../components/learning/LessonNotesDrawer';

// 8 Interactive Visualizers and Simulators
import { CpuArchitectureDiagram } from '../../components/visual/cpu/CpuArchitectureDiagram';
import { InstructionCycleVisualizer } from '../../components/visual/cpu/InstructionCycleVisualizer';
import { RegisterBankVisualizer } from '../../components/visual/cpu/RegisterBankVisualizer';
import { AluSimulator } from '../../components/visual/cpu/AluSimulator';
import { CacheHitMissSimulator } from '../../components/visual/cpu/CacheHitMissSimulator';
import { PipelineHazardVisualizer } from '../../components/visual/cpu/PipelineHazardVisualizer';
import { EducationalCpuSimulator } from '../../components/visual/cpu/EducationalCpuSimulator';
import { ProcCpuInfoExplorer } from '../../components/visual/cpu/ProcCpuInfoExplorer';

// Structured Pedagogical Content
import { CPU_LESSON_CONTENT } from '../../data/cpuLessonContent';

interface CpuArchitectureLessonProps {
  stage: Stage;
  currentPath: string;
}

export const CpuArchitectureLesson: React.FC<CpuArchitectureLessonProps> = ({ stage, currentPath }) => {
  const { progress, toggleBookmark, isBookmarked, markLessonCompleted, saveAssessmentScore } = useProgress();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const closeNotes = useCallback(() => setIsNotesOpen(false), []);
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  // Assessment Gate State
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);

  const bookmarked = isBookmarked(currentPath);
  const completed = progress.completedLessons.includes(currentPath);
  const recordedScore = progress.assessmentScores[currentPath];

  const tocSections = [
    { id: 'objectives', title: '1. Learning Objectives' },
    { id: 'prereqs', title: '2. Prerequisites & Assumptions' },
    { id: 'history', title: '3. History & Von Neumann Architecture' },
    { id: 'components', title: '4. CPU Internal Architecture & Buses' },
    { id: 'registers', title: '5. Registers & Bit Representation' },
    { id: 'alu', title: '6. Arithmetic Logic Unit & Flags' },
    { id: 'memory-cache', title: '7. Memory Hierarchy & Caches' },
    { id: 'clock-isa', title: '8. Clock Cycles, CPI & ISA (x86 vs ARM)' },
    { id: 'instruction-cycle', title: '9. 5-Stage Instruction Execution' },
    { id: 'pipelining', title: '10. Pipelining & Hazard Mitigations' },
    { id: 'math', title: '11. Mathematical Foundations & Amdahl' },
    { id: 'superscalar', title: '12. Superscalar, Multicore & Rings' },
    { id: 'scratch-sim', title: '13. Educational CPU Simulator' },
    { id: 'code', title: '14. C, Python & Assembly Implementations' },
    { id: 'security', title: '15. Hardware Security: Meltdown & Spectre' },
    { id: 'linux-tools', title: '16. Linux CPU Tools & /proc/cpuinfo' },
    { id: 'future', title: '17. GPU Architecture & Future Trends' },
    { id: 'assessment', title: '18. Verified Diagnostic Mastery Exam' },
    { id: 'exercises', title: '19. Practical Hands-On Exercises' },
  ];

  const toggleHint = (exerciseId: number) => {
    setRevealedHints((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const handleSelectAnswer = (questionId: number, optionIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleGradeAssessment = () => {
    let correctCount = 0;
    CPU_LESSON_CONTENT.quizQuestions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected !== undefined && q.options[selected]?.isCorrect) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / CPU_LESSON_CONTENT.quizQuestions.length) * 100);
    setAssessmentScore(scorePct);
    setAssessmentSubmitted(true);
    saveAssessmentScore(currentPath, scorePct);

    if (scorePct >= 80) {
      markLessonCompleted(currentPath);
    }
  };

  const handleResetAssessment = () => {
    setUserAnswers({});
    setAssessmentSubmitted(false);
    setAssessmentScore(null);
  };

  const isMastered = (assessmentScore !== null && assessmentScore >= 80) || (recordedScore !== undefined && recordedScore >= 80) || completed;

  return (
    <div className="space-y-6">
      {/* Pilot Banner */}
      <div role="status" className="rounded-xl border border-cyber-sky/40 bg-cyber-sky/10 p-4 text-xs font-mono text-slate-200 flex items-start space-x-2.5">
        <Sparkles className="w-4 h-4 text-cyber-sky flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-100">Stage 0 Quality Benchmark Pilot: </strong>
          Complete 28-topic lesson covering ALU logic, Control Unit, register banks, 5-stage pipeline, cache hierarchy, ISA comparisons, 8 interactive simulators, KaTeX mathematical derivations, and hands-on Linux CPU investigations.
        </div>
      </div>

      {/* Top Breadcrumb & Controls Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between text-xs font-mono border-b border-surface-border pb-3">
        <Link
          to={`/stage/${stage.id}`}
          className="flex items-center space-x-1.5 text-slate-400 hover:text-cyber-sky transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stage {stage.id}: {stage.title}</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsNotesOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs font-mono text-slate-300 transition flex items-center space-x-1.5"
            title="Open lesson notes"
          >
            <FileText className="w-3.5 h-3.5 text-cyber-sky" />
            <span>Notes</span>
            {progress.notes[currentPath] && (
              <span className="w-1.5 h-1.5 bg-cyber-sky rounded-full" />
            )}
          </button>

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

          <button
            disabled={!isMastered}
            onClick={() => markLessonCompleted(currentPath)}
            title={isMastered ? "Lesson certified complete" : "Pass the diagnostic exam (>= 80%) to certify completion"}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition flex items-center space-x-1.5 ${
              isMastered
                ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald shadow-sm'
                : 'bg-surface-card border-surface-border text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isMastered ? 'Lesson Completed (Certified)' : 'Exam Gate: Pending (>=80%)'}</span>
          </button>
        </div>
      </div>

      <details className="lg:hidden rounded-xl border border-surface-border bg-surface-card p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-200">Jump to a lesson section</summary>
        <ScrollAwareTOC sections={tocSections} className="mt-3" />
      </details>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column: Lesson Body (3 columns) */}
        <div className="lg:col-span-3 space-y-10">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyber-sky/20 text-cyber-sky border border-cyber-sky/40 text-[11px] font-mono font-semibold">
                STAGE {stage.id} PILOT LESSON
              </span>
              <span className="text-xs font-mono text-slate-500">
                18-Point Educational Framework • Est. {CPU_LESSON_CONTENT.estimatedReadTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {CPU_LESSON_CONTENT.title}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              An authoritative, ground-up architectural journey through the Central Processing Unit: from silicon MOSFET switches and Von Neumann architecture to the 5-stage instruction pipeline, cache hierarchies, out-of-order execution, and hardware security side-channels.
            </p>
          </div>

          {/* 1. Learning Objectives */}
          <section id="objectives" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">1.</span>
              <span>Learning Objectives</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {CPU_LESSON_CONTENT.objectives.map((obj, i) => (
                <li key={i} className="flex items-start space-x-2.5">
                  <Check className="w-3.5 h-3.5 text-cyber-sky flex-shrink-0 mt-1" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 2. Prerequisites & Assumptions */}
          <section id="prereqs" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">2.</span>
              <span>Prerequisites & Foundational Assumptions</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300">
              {CPU_LESSON_CONTENT.prerequisites.map((prereq, i) => (
                <p key={i} className="leading-relaxed">• {prereq}</p>
              ))}
            </div>
            <Callout type="note" title="Zero Prior Hardware Knowledge Required">
              All electronic concepts are explained from first principles. When terms like *register*, *bus*, or *microcode* appear, they are defined before advanced usage.
            </Callout>
          </section>

          {/* 3. History & Von Neumann Architecture */}
          <section id="history" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">3.</span>
              <span>The Problem, Historical Evolution & The Von Neumann Architecture</span>
            </h2>
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                Before microprocessors, computing machines were single-purpose electromechanical devices or vacuum tube calculators (such as the 1945 ENIAC) that required hours of manual rewiring with plugboards and switches to change mathematical calculations.
              </p>
              <p>
                In 1945, mathematician John von Neumann proposed the <strong>Stored-Program Architecture</strong>. His radical breakthrough was simple yet profound: <em>both the executable program instructions and the data operate in the same addressable memory space as binary bits</em>. This meant a program could be loaded from external media, modified dynamically, and swapped without touching physical wiring.
              </p>
              <p>
                However, this elegance introduced the <strong>Von Neumann Bottleneck</strong>: because instructions and data share a single physical memory bus, CPU processing speed is fundamentally constrained by memory bus bandwidth.
              </p>
            </div>

            <Callout type="deep-dive" title="Von Neumann vs. Harvard Architectures">
              In a pure <strong>Harvard Architecture</strong>, instruction memory and data memory have separate physical address spaces and separate electrical bus lines, allowing simultaneous instruction fetch and data read. Modern high-performance processors adopt a <em>Modified Harvard Architecture</em>: the internal L1 cache is physically split into an <strong>L1 Instruction Cache (L1i)</strong> and an <strong>L1 Data Cache (L1d)</strong>, while main RAM remains unified.
            </Callout>
          </section>

          {/* 4. CPU Internal Architecture & Buses */}
          <section id="components" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
                <span className="text-cyber-sky">4.</span>
                <span>Major Internal CPU Subsystems & Bus Interconnect</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                At its core, a CPU die contains five primary functional subsystems synchronized by high-frequency clock oscillators:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-1">
                  <span className="text-cyber-amber font-bold">1. Control Unit (CU)</span>
                  <p className="text-slate-300 text-[11px]">Decodes instructions and pulses register write-enables and bus muxes.</p>
                </div>
                <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-1">
                  <span className="text-cyber-emerald font-bold">2. Arithmetic Logic Unit (ALU)</span>
                  <p className="text-slate-300 text-[11px]">Computes additions, subtractions, and bitwise Boolean gates.</p>
                </div>
                <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-1">
                  <span className="text-cyber-sky font-bold">3. Register File</span>
                  <p className="text-slate-300 text-[11px]">16+ on-die SRAM storage cells with single-cycle read/write access.</p>
                </div>
                <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-1">
                  <span className="text-cyber-indigo font-bold">4. Cache Hierarchy (L1-L3)</span>
                  <p className="text-slate-300 text-[11px]">High-speed on-die buffers bridging CPU and DRAM latency.</p>
                </div>
              </div>
            </div>

            <CpuArchitectureDiagram />
          </section>

          {/* 5. Registers */}
          <section id="registers" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
                <span className="text-cyber-sky">5.</span>
                <span>Registers in Detail: General Purpose, RIP, RSP & Partial Access</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Registers are the fastest memory in existence (~0.3 to 0.5 ns latency, 1 clock cycle on a modern 3.2 GHz core). In the 64-bit x86-64 architecture, registers can be accessed at different bit widths for backward compatibility with 32-bit (x86), 16-bit (8086), and 8-bit (8080) code. For example, modifying <strong>AL</strong> updates the lowest 8 bits of <strong>RAX</strong>.
              </p>
            </div>

            <RegisterBankVisualizer />
          </section>

          {/* 6. Arithmetic Logic Unit & Status Flags */}
          <section id="alu" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
                <span className="text-cyber-sky">6.</span>
                <span>Arithmetic and Logic: Binary Adders & Condition Codes</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                The ALU executes computations using combinational logic. A 64-bit adder is assembled from 64 1-bit Full Adders (or fast Carry-Lookahead adders). After every operation, hardware comparator circuits evaluate status flags:
              </p>
              <ul className="text-xs text-slate-300 space-y-1 font-mono">
                <li>• <strong>ZF (Zero Flag):</strong> Set to 1 if the mathematical result is exactly 0.</li>
                <li>• <strong>CF (Carry Flag):</strong> Set to 1 if unsigned addition overflows the register bit width.</li>
                <li>• <strong>SF (Sign Flag):</strong> Reflects the most significant bit (MSB), indicating negative signed results.</li>
                <li>• <strong>OF (Overflow Flag):</strong> Set to 1 if signed two's complement arithmetic exceeds representable bounds.</li>
              </ul>
            </div>

            <AluSimulator />
          </section>

          {/* 7. Memory Hierarchy & Caches */}
          <section id="memory-cache" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
                <span className="text-cyber-sky">7.</span>
                <span>The Memory Hierarchy, Cache Lines & Locality</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Due to the physical laws of signal propagation and silicon manufacturing costs, computer memory follows an inverse pyramid: capacity increases as speed decreases. Data is transferred between DRAM and cache strictly in chunks called <strong>Cache Lines</strong> (standard 64 bytes wide).
              </p>
            </div>

            <CacheHitMissSimulator />
          </section>

          {/* 8. Clock Cycles, CPI & ISA */}
          <section id="clock-isa" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">8.</span>
              <span>Clock Oscillators, CPI & Instruction Set Architectures (ISA)</span>
            </h2>
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                A CPU clock generator produces electrical square pulses at frequency <MathBlock math="f" inline /> (e.g. 3.2 GHz = 3.2 billion pulses per second). The clock period <MathBlock math="\tau = 1/f = 0.3125\text{ ns}" inline /> sets the minimum time window for signals to stabilize across logic gates.
              </p>
              <h3 className="text-sm font-bold text-slate-100 font-mono pt-2">CISC vs. RISC vs. RISC-V</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-lg bg-surface border border-surface-border space-y-1">
                  <span className="text-cyber-amber font-bold">x86-64 (CISC)</span>
                  <p className="text-slate-300 text-[11px]">
                    Complex Instruction Set. Variable-length instructions (1 to 15 bytes). Direct memory-to-register arithmetic (e.g. <code className="text-cyber-sky">ADD [RBP-8], EAX</code>). Hardware decoders convert complex CISC instructions into internal micro-ops.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-surface border border-surface-border space-y-1">
                  <span className="text-cyber-emerald font-bold">ARM64 & RISC-V (RISC)</span>
                  <p className="text-slate-300 text-[11px]">
                    Reduced Instruction Set. Fixed 32-bit instruction words in ARM64 A64. Strict <strong>Load/Store</strong> model: memory cannot be modified in an arithmetic instruction; operands must first be loaded into registers via <code className="text-cyber-sky">LDR</code> and stored via <code className="text-cyber-sky">STR</code>. (Note: RISC-V optionally supports 16-bit compressed instructions via the RVC extension).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 9. 5-Stage Instruction Execution Cycle */}
          <section id="instruction-cycle" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
                <span className="text-cyber-sky">9.</span>
                <span>The 5-Stage Instruction Execution Cycle: Step by Step</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every CPU instruction progresses through five discrete phases: <strong>IF (Fetch)</strong>, <strong>ID (Decode)</strong>, <strong>EX (Execute)</strong>, <strong>MEM (Memory)</strong>, and <strong>WB (Writeback)</strong>. Step through the interactive cycle visualizer below:
              </p>
            </div>

            <InstructionCycleVisualizer />
          </section>

          {/* 10. Pipelining & Hazard Mitigations */}
          <section id="pipelining" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
                <span className="text-cyber-sky">10.</span>
                <span>Pipelining, Hazards (Structural, Data, Control) & Forwarding</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Rather than waiting 5 full cycles for an instruction to retire before fetching the next, pipelining overlaps instructions like an automotive assembly line. While Instruction 1 is in Writeback, Instruction 5 is being fetched!
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Three hazards threaten pipeline flow:
                <br />1. <strong>Structural Hazard:</strong> Resource conflict (e.g. single memory port).
                <br />2. <strong>Data Hazard (RAW):</strong> An instruction needs data computed by a preceding instruction.
                <br />3. <strong>Control Hazard:</strong> Conditional branch changes PC, rendering speculatively fetched instructions invalid.
              </p>
            </div>

            <PipelineHazardVisualizer />
          </section>

          {/* 11. Mathematical Foundations & Amdahl's Law */}
          <section id="math" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">11.</span>
              <span>Mathematical Foundations: The Iron Law & Amdahl's Law Derivation</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              The execution time of any software algorithm is governed by the classic three-term equation:
            </p>

            <MathBlock
              math="\text{CPU Time} = \frac{\text{Instructions}}{\text{Program}} \times \frac{\text{Clock Cycles}}{\text{Instruction}} \times \frac{\text{Seconds}}{\text{Clock Cycle}} = I \times \text{CPI} \times \tau = \frac{I \times \text{CPI}}{f_{\text{clock}}}"
              ariaLabel="The Iron Law of Processor Performance"
            />

            <div className="space-y-3 pt-2 text-sm text-slate-300 leading-relaxed">
              <p>When cache memory misses occur, average CPI degrades substantially:</p>
              <MathBlock
                math="\text{CPI}_{\text{effective}} = \text{CPI}_{\text{base}} + (\text{Memory Accesses per Instruction} \times \text{Miss Rate} \times \text{Miss Penalty})"
                ariaLabel="CPI with Cache Misses"
              />

              <p>Average Memory Access Time (AMAT):</p>
              <MathBlock
                math="\text{AMAT} = t_{\text{hit}} + (\text{Miss Rate} \times t_{\text{miss}})"
                ariaLabel="Average Memory Access Time Formula"
              />

              <h3 className="text-sm font-bold text-slate-100 font-mono pt-2">Formal Derivation of Amdahl's Law</h3>
              <p>
                Let <MathBlock math="T_1" inline /> be the execution time on 1 core. Let <MathBlock math="p" inline /> be the parallelizable fraction (<MathBlock math="0 \le p \le 1" inline />), and <MathBlock math="s = 1 - p" inline /> be the strictly serial fraction. When executed on <MathBlock math="N" inline /> processor cores:
              </p>

              <MathBlock
                math="T_N = s \cdot T_1 + \frac{p \cdot T_1}{N} = T_1 \left( (1 - p) + \frac{p}{N} \right)"
                ariaLabel="Execution time on N cores"
              />

              <p>The overall speedup <MathBlock math="S(N) = \frac{T_1}{T_N}" inline /> is derived as:</p>

              <MathBlock
                math="S(N) = \frac{T_1}{T_1 \left( (1 - p) + \frac{p}{N} \right)} = \frac{1}{(1 - p) + \frac{p}{N}}"
                ariaLabel="Amdahl's Law Speedup"
              />

              <Callout type="deep-dive" title="Amdahl's Asymptotic Barrier">
                As <MathBlock math="N \to \infty" inline />, the maximum possible speedup is strictly bounded by the serial fraction:
                <MathBlock math="S_{\max} = \lim_{N \to \infty} S(N) = \frac{1}{1 - p} = \frac{1}{s}" />
                <em>Numerical proof:</em> If 10% of your algorithm is sequential (<MathBlock math="s = 0.10, p = 0.90" inline />), even with an infinite cluster of 1,000,000 cores, the maximum overall program speedup can <strong>never exceed 10x</strong> (<MathBlock math="1 / 0.10 = 10" inline />)!
              </Callout>
            </div>
          </section>

          {/* 12. Superscalar, Multicore & Privilege Rings */}
          <section id="superscalar" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">12.</span>
              <span>Superscalar Execution, Multicore, Hyper-Threading, MESI & Rings</span>
            </h2>
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                Modern high-performance processors are <strong>superscalar out-of-order (OoO)</strong> machines. Rather than dispatching 1 instruction per cycle, an execution engine (like Intel Golden Cove or Apple M-series) can decode and dispatch 6 to 8 micro-operations simultaneously into <strong>Reservation Stations</strong>, executing them whenever operand registers are ready, and retiring them sequentially via the <strong>Reorder Buffer (ROB)</strong>.
              </p>

              <h3 className="text-sm font-bold text-slate-100 font-mono pt-1">Physical Cores vs. Simultaneous Multithreading (SMT / Hyper-Threading)</h3>
              <p>
                A <strong>physical core</strong> contains dedicated execution pipelines, ALUs, FPUs, and private L1/L2 caches. In contrast, <strong>SMT (Hyper-Threading)</strong> duplicates only the lightweight architectural register state (Program Counter, general-purpose registers, APIC ID) while <em>sharing</em> the heavy execution units and caches. When Thread A stalls on an L2/L3 cache miss, the scheduler immediately issues ready micro-ops from Thread B into the active ALU ports.
              </p>

              <h3 className="text-sm font-bold text-slate-100 font-mono pt-1">Cache Coherence: The MESI Protocol</h3>
              <p>
                When multiple cores share main RAM, each cache line across private L1/L2 caches tracks one of four states:
              </p>
              <ul className="text-xs text-slate-300 space-y-1 font-mono">
                <li>• <strong>Modified (M):</strong> Cache line is valid only in this cache, dirty (modified), and differs from RAM.</li>
                <li>• <strong>Exclusive (E):</strong> Line is clean, matches RAM, and exists ONLY in this core's cache.</li>
                <li>• <strong>Shared (S):</strong> Line is clean, matches RAM, and may be present in other cores' caches (read-only).</li>
                <li>• <strong>Invalid (I):</strong> Line does not contain valid data; reads must fetch from bus.</li>
              </ul>

              <h3 className="text-sm font-bold text-slate-100 font-mono pt-1">Syscall Transition & Context Switching</h3>
              <p>
                When a user application performs I/O or requests OS memory, it executes the <code className="text-cyber-sky">syscall</code> instruction. The hardware reads the target kernel handler address from the Model-Specific Register <code className="text-cyber-sky">IA32_LSTAR</code>, saves the user-space RIP to RCX, saves RFLAGS to R11, and switches CPU privilege from Ring 3 to Ring 0. When switching processes, the OS saves all registers to the Process Control Block (PCB) and reloads CR3 (page table directory), which invalidates the non-global Translation Lookaside Buffer (TLB), inducing cold cache and translation delays.
              </p>
            </div>
          </section>

          {/* 13. Educational CPU Scratch Simulator */}
          <section id="scratch-sim" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
                <span className="text-cyber-sky">13.</span>
                <span>Full Educational CPU Simulator & Microcode Engine</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Step through complete instruction microcode execution with live register file inspection, physical memory dumps, and real-time event logs:
              </p>
            </div>

            <EducationalCpuSimulator />
          </section>

          {/* 14. Code Implementations */}
          <section id="code" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">14.</span>
              <span>Low-Level Code Implementations: C, Python & Assembly</span>
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-mono font-bold text-cyber-sky mb-1">
                  1. Measuring Cache Stride Performance in C (Row-Major vs Column-Major)
                </h3>
                <CodeBlock
                  code={CPU_LESSON_CONTENT.codeExamples.cBitwiseAndCache}
                  language="c"
                  title="cache_benchmark.c"
                  highlightLines={[14, 28]}
                />
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold text-cyber-emerald mb-1">
                  2. Educational CPU Simulator from Scratch in Python
                </h3>
                <CodeBlock
                  code={CPU_LESSON_CONTENT.codeExamples.pythonEmulator}
                  language="python"
                  title="simple_cpu.py"
                  highlightLines={[22, 33, 49]}
                />
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold text-cyber-amber mb-1">
                  3. Low-Level Assembly: x86-64 vs ARM64 Calling Conventions
                </h3>
                <CodeBlock
                  code={CPU_LESSON_CONTENT.codeExamples.assemblyComparison}
                  language="c"
                  title="isa_comparison.s"
                />
              </div>
            </div>
          </section>

          {/* 15. Hardware Security */}
          <section id="security" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">15.</span>
              <span>CPU Hardware Security: Speculative Execution & Side-Channels</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              In 2018, computer science witnessed a paradigm shift when researchers disclosed <strong>Meltdown</strong> and <strong>Spectre</strong>. These vulnerabilities were not software bugs, but flaws in modern out-of-order and speculative hardware design.
            </p>

            <Callout type="security" title="How Speculative Cache Timing Leaks Data">
              When a CPU predicts a branch or executes out-of-order, it speculatively loads kernel memory before privilege checks retire. Although the CPU faults and discards the architectural register result, the speculative memory read pulled data into the L1 cache. By measuring the access latency of candidate memory locations (FLUSH+RELOAD), an attacker infers the secret kernel byte via the microarchitectural cache state!
            </Callout>
          </section>

          {/* 16. Linux CPU Tools */}
          <section id="linux-tools" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
                <span className="text-cyber-sky">16.</span>
                <span>Linux CPU Investigation Workbench: /proc/cpuinfo & lscpu</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Inspect how the Linux kernel abstracts and surfaces hardware processor capabilities, feature flags (AVX2, VMX, SMEP, NX), and performance counters:
              </p>
            </div>

            <ProcCpuInfoExplorer />
          </section>

          {/* 17. GPU Architecture, Throughput Computing & Future Trends */}
          <section id="future" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">17.</span>
              <span>GPU Architecture, Throughput Computing & Future Microarchitectures</span>
            </h2>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                While a CPU is engineered as a <strong>latency-optimized</strong> machine designed to execute complex, branched, sequential code as fast as physically possible, a <strong>GPU (Graphics Processing Unit)</strong> is a <strong>throughput-optimized</strong> machine designed to perform massive data-parallel arithmetic across thousands of execution streams simultaneously.
              </p>

              <Callout type="note" title="Worked example: eight independent additions">
                Let A = [1,2,3,4,5,6,7,8] and B = [10,10,10,10,10,10,10,10]. Worker i computes C[i] = A[i] + B[i], giving [11,12,13,14,15,16,17,18]. No worker needs another worker’s result, so the work can be divided. A CPU loop can also compute this, and may vectorize it. This tiny example is a dependency model, not a speed benchmark. In contrast, a running total S[i] = S[i-1] + A[i] has dependencies and needs a different parallel algorithm.
              </Callout>
              <a href="https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/advanced-kernel-programming.html" className="text-cyber-sky underline text-sm">Source: NVIDIA CUDA execution and thread scheduling</a>
              {/* Silicon Allocation Comparison Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
                  <div className="flex items-center space-x-2 text-cyber-sky font-mono font-bold text-xs uppercase">
                    <Cpu className="w-4 h-4 text-cyber-sky" />
                    <span>CPU: Latency-Oriented Silicon</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Uses substantial hardware for branch predictors, out-of-order reorder buffers, speculative execution engines, and multi-megabyte L2/L3 cache hierarchies. The balance and number of cores vary by processor; the design can prioritize fast progress through dependent instructions.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
                  <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-bold text-xs uppercase">
                    <Layers className="w-4 h-4 text-cyber-emerald" />
                    <span>GPU: Throughput-Oriented Silicon</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Devotes substantial resources to parallel arithmetic units; some GPUs also include specialized matrix units. Employs <strong>SIMT (Single Instruction, Multiple Threads)</strong> where threads are grouped for instruction issue. NVIDIA CUDA warps contain 32 threads; other GPU architectures differ. Scheduling another ready resident warp can hide a memory stall, but does not remove latency. Modern NVIDIA GPUs support independent thread scheduling; never assume unsynchronized lockstep communication is safe.
                  </p>
                </div>
              </div>

              {/* Comparative Technical Table */}
              <div className="overflow-x-auto max-w-full min-w-0">
                <table className="min-w-full text-xs font-mono border-collapse border border-surface-border text-left">
                  <thead>
                    <tr className="bg-surface text-slate-300 border-b border-surface-border">
                      <th className="p-2.5 border-r border-surface-border font-bold">Architectural Metric</th>
                      <th className="p-2.5 border-r border-surface-border text-cyber-sky font-bold">General-Purpose CPU (x86-64 / ARM64)</th>
                      <th className="p-2.5 text-cyber-emerald font-bold">Accelerated GPU (NVIDIA / AMD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-slate-300">
                    <tr>
                      <td className="p-2.5 border-r border-surface-border font-semibold text-slate-400">Core Architecture</td>
                      <td className="p-2.5 border-r border-surface-border">General-purpose cores; count and execution design vary</td>
                      <td className="p-2.5">Many arithmetic lanes grouped into compute units</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-surface-border font-semibold text-slate-400">Execution Paradigm</td>
                      <td className="p-2.5 border-r border-surface-border">MIMD with hardware branch prediction</td>
                      <td className="p-2.5">Grouped SIMT / SIMD execution; divergence affects efficiency</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-surface-border font-semibold text-slate-400">Memory Bandwidth</td>
                      <td className="p-2.5 border-r border-surface-border">Depends on memory channels, processor, and workload</td>
                      <td className="p-2.5 text-cyber-emerald font-bold">Depends on device and memory: HBM and GDDR are different technologies</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-surface-border font-semibold text-slate-400">Latency Tolerance</td>
                      <td className="p-2.5 border-r border-surface-border">Deep on-die SRAM caches (L1/L2/L3)</td>
                      <td className="p-2.5">Schedules ready resident warps to hide some stalls</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-surface-border font-semibold text-slate-400">Optimal Workload</td>
                      <td className="p-2.5 border-r border-surface-border">Operating system kernels, compilers, sequential logic</td>
                      <td className="p-2.5">Dense matrix multiplication (GEMM), graphics rasterization, AI tensors</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Callout type="note" title="Why parallel workloads can benefit from GPUs">
                For the standard multiplication of two N-by-N matrices, there are N³ scalar products to accumulate. Different output cells can be assigned to parallel workers, while each cell still needs a reduction over its input products. GPUs can help when there is enough work and suitable memory access. CPUs and other accelerators can also run AI; transfer, launch and synchronization costs can outweigh parallelism for small jobs.
              </Callout>

              <div className="pt-2 space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Specialized Heterogeneous Microarchitectures
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-lg bg-surface border border-surface-border space-y-1">
                    <span className="text-cyber-sky font-bold">Heterogeneous Cores</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">ARM big.LITTLE, Apple Silicon, and Intel Alder Lake pair wide Out-of-Order Performance cores (P-cores) with energy-sipping in-order Efficiency cores (E-cores).</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-surface border border-surface-border space-y-1">
                    <span className="text-cyber-emerald font-bold">NPU / TPU Accelerators</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">Dedicated 2D systolic arrays optimized strictly for matrix multiplication (GEMM) and INT8/FP16 tensor activations for local AI model inference.</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-surface border border-surface-border space-y-1">
                    <span className="text-cyber-amber font-bold">3D Chiplet Packaging</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">Breaking monolithic silicon dies into modular compute chiplets and stacking SRAM vertically (e.g. AMD 3D V-Cache with 96 MB L3 per CCD) connected via silicon interposers.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 18. Verified Diagnostic Mastery Exam */}
          <section id="assessment" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-2">
              <div className="flex items-center space-x-2 text-cyber-sky font-mono font-bold text-xs uppercase">
                <Award className="w-4 h-4 text-cyber-sky" />
                <span>Section 18: Verified Diagnostic Mastery Exam</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 font-mono">
                10 Comprehensive Multiple-Choice Diagnostic Questions
              </h2>
              <p className="text-xs text-slate-400">
                Answer each question below and submit your exam. A passing score of <strong>80% or higher (8/10)</strong> is required to certify mastery and unlock official lesson completion.
              </p>
            </div>

            <div className="space-y-4">
              {CPU_LESSON_CONTENT.quizQuestions.map((q) => {
                const selectedOption = userAnswers[q.id];
                const isAnswered = selectedOption !== undefined;
                const isCorrect = isAnswered && q.options[selectedOption]?.isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      assessmentSubmitted
                        ? isCorrect
                          ? 'bg-cyber-emerald/10 border-cyber-emerald/40'
                          : 'bg-cyber-rose/10 border-cyber-rose/40'
                        : 'bg-surface-card border-surface-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-mono font-bold text-slate-100 leading-snug">
                        {q.id}. {q.question}
                      </h3>
                      {assessmentSubmitted && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                            isCorrect ? 'bg-cyber-emerald text-void' : 'bg-cyber-rose text-white'
                          }`}
                        >
                          {isCorrect ? 'CORRECT' : 'INCORRECT'}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedOption === optIdx;
                        return (
                          <label
                            key={optIdx}
                            className={`flex items-start space-x-2.5 p-2.5 rounded-lg border text-xs font-mono cursor-pointer transition ${
                              isSelected
                                ? 'bg-cyber-sky/15 border-cyber-sky text-slate-100'
                                : 'bg-surface border-surface-border text-slate-300 hover:bg-surface-elevated'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              checked={isSelected}
                              disabled={assessmentSubmitted && isMastered}
                              onChange={() => handleSelectAnswer(q.id, optIdx)}
                              className="mt-0.5 accent-cyber-sky"
                            />
                            <span className="leading-relaxed">{opt.text}</span>
                          </label>
                        );
                      })}
                    </div>

                    {assessmentSubmitted && (
                      <div className="mt-3 p-2.5 rounded-lg bg-surface border border-surface-border text-[11px] font-mono text-slate-300 leading-relaxed">
                        <strong className={isCorrect ? 'text-cyber-emerald' : 'text-cyber-amber'}>
                          Pedagogical Feedback: 
                        </strong>{' '}
                        {isAnswered ? q.options[selectedOption].explanation : 'No answer selected.'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400">Mastery Assessment Status:</div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">
                    {assessmentScore !== null
                      ? `Your Score: ${assessmentScore}% (${Math.round((assessmentScore / 100) * CPU_LESSON_CONTENT.quizQuestions.length)} / 10)`
                      : recordedScore !== undefined
                      ? `Previously Recorded Score: ${recordedScore}%`
                      : 'Exam Not Yet Evaluated'}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetAssessment}
                    className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-surface-border text-slate-300 text-xs flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={handleGradeAssessment}
                    disabled={Object.keys(userAnswers).length === 0}
                    className="px-4 py-2 rounded-lg bg-cyber-sky text-void font-bold text-xs hover:bg-sky-400 transition flex items-center space-x-1.5 disabled:opacity-40"
                  >
                    <Award className="w-4 h-4" />
                    <span>Evaluate My Score & Verify Mastery</span>
                  </button>
                </div>
              </div>

              {assessmentSubmitted && (
                <div
                  className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                    assessmentScore !== null && assessmentScore >= 80
                      ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-emerald-200'
                      : 'bg-cyber-amber/15 border-cyber-amber/40 text-amber-200'
                  }`}
                >
                  {assessmentScore !== null && assessmentScore >= 80 ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-cyber-emerald shrink-0" />
                      <span>
                        <strong>Congratulations! Certified Mastery Achieved ({assessmentScore}%).</strong>{' '}
                        Lesson completion is officially certified and unlocked.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-cyber-amber shrink-0" />
                      <span>
                        <strong>Score: {assessmentScore}%.</strong> A score of 80% is required for certified completion. Review the explanations above and retake the exam.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* 19. Practical Hands-On Exercises */}
          <section id="exercises" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-2">
              <div className="flex items-center space-x-2 text-cyber-amber font-mono font-bold text-xs uppercase">
                <Wrench className="w-4 h-4 text-cyber-amber" />
                <span>Section 19: Practical Hands-On Exercises</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 font-mono">
                Three Progressive Engineering Challenges
              </h2>
              <p className="text-xs text-slate-400">
                Solve these challenges to solidify your understanding of processor performance equations, cache line optimization, and microcode execution.
              </p>
            </div>

            <div className="space-y-4">
              {CPU_LESSON_CONTENT.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3 font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100">{ex.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                        ex.level === 'Beginner'
                          ? 'bg-cyber-emerald/15 text-cyber-emerald border-cyber-emerald/30'
                          : ex.level === 'Intermediate'
                          ? 'bg-cyber-sky/15 text-cyber-sky border-cyber-sky/30'
                          : 'bg-cyber-amber/15 text-cyber-amber border-cyber-amber/30'
                      }`}
                    >
                      {ex.level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {ex.description}
                  </p>

                  <div className="p-3 rounded-lg bg-surface border border-surface-border text-xs space-y-1 text-slate-300">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Tasks:</div>
                    {ex.tasks.map((t, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <span className="text-cyber-sky font-bold">•</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => toggleHint(ex.id)}
                      className="text-xs font-mono text-cyber-sky hover:underline flex items-center space-x-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{revealedHints[ex.id] ? 'Hide Solution Derivation' : 'Show Solution Derivation'}</span>
                    </button>

                    {revealedHints[ex.id] && (
                      <div className="mt-2 p-3 rounded-lg bg-cyber-sky/10 border border-cyber-sky/30 text-xs text-slate-200 leading-relaxed">
                        <strong className="text-cyber-sky">Solution & Derivation: </strong>
                        {ex.solutionHint}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Completion Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-card to-surface-elevated border border-cyber-emerald/40 space-y-4">
            <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
              <span>Pilot Review & Mastery Checkpoint</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {isMastered ? 'Stage 0 CPU Architecture Lesson Mastered!' : 'Complete the Diagnostic Exam to Certify Mastery'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {isMastered
                ? 'You have demonstrated certified architectural understanding across all 28 topics, from silicon MOSFET gates and 5-stage pipelines to cache lines and speculative side-channels.'
                : 'Score at least 80% on the Section 18 Diagnostic Exam to certify mastery and record your completion.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                disabled={!isMastered}
                onClick={() => markLessonCompleted(currentPath)}
                className={`px-4 py-2 rounded-lg font-bold text-xs font-mono transition flex items-center space-x-2 shadow-lg ${
                  isMastered
                    ? 'bg-cyber-emerald text-void hover:bg-emerald-400 shadow-cyber-emerald/20'
                    : 'bg-surface border border-surface-border text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{completed ? 'Certified & Completed' : isMastered ? 'Mark Lesson Complete' : 'Exam Gate: Score >=80% to Unlock'}</span>
              </button>

              <Link
                to="/stage/0/lesson/binary-data-representation"
                className="px-4 py-2 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition"
              >
                Proceed to Lesson 2: Binary Data & Memory &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Table of Contents */}
        <div className="hidden lg:block sticky top-20 space-y-4">
          <ScrollAwareTOC sections={tocSections} />
        </div>
      </div>

      <LessonNotesDrawer
        isOpen={isNotesOpen}
        onClose={closeNotes}
        lessonPath={currentPath}
        lessonTitle={CPU_LESSON_CONTENT.title}
      />
    </div>
  );
};

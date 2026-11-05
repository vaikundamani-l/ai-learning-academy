import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  CheckCircle2, 
  Cpu, 
  FileText,
  Sparkles,
  Check,
  ShieldAlert,
  Terminal,
  Zap,
  Code2,
  BookOpen,
  HelpCircle,
  Wrench,
  Award
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

// 8 Interactive Visualizers and Simulators
import { CpuArchitectureDiagram } from '../components/visual/cpu/CpuArchitectureDiagram';
import { InstructionCycleVisualizer } from '../components/visual/cpu/InstructionCycleVisualizer';
import { RegisterBankVisualizer } from '../components/visual/cpu/RegisterBankVisualizer';
import { AluSimulator } from '../components/visual/cpu/AluSimulator';
import { CacheHitMissSimulator } from '../components/visual/cpu/CacheHitMissSimulator';
import { PipelineHazardVisualizer } from '../components/visual/cpu/PipelineHazardVisualizer';
import { EducationalCpuSimulator } from '../components/visual/cpu/EducationalCpuSimulator';
import { ProcCpuInfoExplorer } from '../components/visual/cpu/ProcCpuInfoExplorer';

// Structured Pedagogical Content
import { CPU_LESSON_CONTENT } from '../data/cpuLessonContent';

export const LessonViewer: React.FC = () => {
  const { stageId, lessonId } = useParams<{ stageId: string; lessonId: string }>();
  const { progress, toggleBookmark, isBookmarked, markLessonCompleted } = useProgress();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  const id = /^\d+$/.test(stageId || '') ? Number(stageId) : -1;
  const stage = CURRICULUM_STAGES[id] || CURRICULUM_STAGES[0];
  const currentPath = `/stage/${id}/lesson/${lessonId}`;
  const bookmarked = isBookmarked(currentPath);
  const completed = progress.completedLessons.includes(currentPath);

  // 18-Point Framework Table of Contents
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
    { id: 'math', title: '11. Mathematical Foundations & Iron Law' },
    { id: 'superscalar', title: '12. Superscalar, Multicore & Rings' },
    { id: 'scratch-sim', title: '13. Educational CPU Simulator' },
    { id: 'code', title: '14. C, Python & Assembly Implementations' },
    { id: 'security', title: '15. Hardware Security: Meltdown & Spectre' },
    { id: 'linux-tools', title: '16. Linux CPU Tools & /proc/cpuinfo' },
    { id: 'assessment', title: '17. Comprehensive Diagnostic Self-Check' },
    { id: 'exercises', title: '18. Practical Hands-On Exercises' },
  ];

  if (!CURRICULUM_STAGES[id] || id !== 0 || lessonId !== 'cpu-architecture') return <NotFound />;

  const toggleHint = (exerciseId: number) => {
    setRevealedHints((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  return (
    <div className="space-y-6">
      {/* Flagship Pilot Banner */}
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
          {/* Notes Drawer Toggle */}
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

          {/* Mark Complete Action */}
          <button
            onClick={() => markLessonCompleted(currentPath)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition flex items-center space-x-1.5 ${
              completed
                ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-cyber-emerald'
                : 'bg-surface-card hover:bg-surface-elevated border-surface-border text-slate-200 hover:border-cyber-emerald'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald" />
            <span>{completed ? 'Lesson Completed' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left is Lesson Content, Right is Sticky Table of Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column: Lesson Body (3 columns) */}
        <div className="lg:col-span-3 space-y-10">
          {/* Lesson Header */}
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
                <p key={i} className="leading-relaxed">
                  • {prereq}
                </p>
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

          {/* 4. CPU Internal Architecture & Buses (Interactive Visualizer 1) */}
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

            {/* Embedded Visualizer 1 */}
            <CpuArchitectureDiagram />
          </section>

          {/* 5. Registers & Bit Representation (Interactive Visualizer 2) */}
          <section id="registers" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
                <span className="text-cyber-sky">5.</span>
                <span>Registers in Detail: General Purpose, RIP, RSP & Partial Access</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Registers are the fastest memory in existence (~0.5 ns latency). In the 64-bit x86-64 architecture, registers can be accessed at different bit widths for backward compatibility with 32-bit (x86), 16-bit (8086), and 8-bit (8080) code. For example, modifying <strong>AL</strong> updates the lowest 8 bits of <strong>RAX</strong>.
              </p>
            </div>

            {/* Embedded Visualizer 2 */}
            <RegisterBankVisualizer />
          </section>

          {/* 6. Arithmetic Logic Unit & Status Flags (Interactive Visualizer 3) */}
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
                <li>• <strong>OF (Overflow Flag):</strong> Set to 1 if signed two\'s complement arithmetic exceeds representable bounds.</li>
              </ul>
            </div>

            {/* Embedded Visualizer 3 */}
            <AluSimulator />
          </section>

          {/* 7. Memory Hierarchy & Caches (Interactive Visualizer 4) */}
          <section id="memory-cache" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
                <span className="text-cyber-sky">7.</span>
                <span>The Memory Hierarchy, Cache Lines & Locality</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Due to the physical laws of signal propagation and silicon manufacturing costs, computer memory follows an inverse pyramid: capacity increases as speed decreases.
              </p>
              <div className="overflow-x-auto text-xs font-mono">
                <table className="w-full text-left border border-surface-border">
                  <thead className="bg-surface text-slate-300 border-b border-surface-border">
                    <tr>
                      <th className="p-2">Tier</th>
                      <th className="p-2">Technology</th>
                      <th className="p-2">Typical Size</th>
                      <th className="p-2">Latency (Cycles)</th>
                      <th className="p-2">Access Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-slate-300">
                    <tr>
                      <td className="p-2 text-cyber-sky font-bold">Registers</td>
                      <td className="p-2">Dual-port SRAM flip-flops</td>
                      <td className="p-2">~1 KB</td>
                      <td className="p-2">0 - 1 cycle</td>
                      <td className="p-2">~0.5 ns</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-cyber-sky font-bold">L1 Cache</td>
                      <td className="p-2">On-core SRAM</td>
                      <td className="p-2">64 - 128 KB</td>
                      <td className="p-2">3 - 4 cycles</td>
                      <td className="p-2">~1.0 ns</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-cyber-indigo font-bold">L2 Cache</td>
                      <td className="p-2">Per-core SRAM</td>
                      <td className="p-2">512 KB - 2 MB</td>
                      <td className="p-2">12 - 14 cycles</td>
                      <td className="p-2">~3.5 ns</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-cyber-indigo font-bold">L3 Cache</td>
                      <td className="p-2">Shared On-Die SRAM</td>
                      <td className="p-2">16 - 96 MB</td>
                      <td className="p-2">40 - 60 cycles</td>
                      <td className="p-2">~12 - 15 ns</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-cyber-amber font-bold">Main RAM</td>
                      <td className="p-2">Off-chip DDR4/DDR5 DRAM</td>
                      <td className="p-2">16 - 128 GB</td>
                      <td className="p-2">200+ cycles</td>
                      <td className="p-2">60 - 80 ns</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Embedded Visualizer 4 */}
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
              <p>
                The <strong>Instruction Set Architecture (ISA)</strong> defines the vocabulary of the processor:
              </p>
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
                    Reduced Instruction Set. Fixed 32-bit instruction words. Strict <strong>Load/Store</strong> model: memory cannot be modified in an arithmetic instruction; operands must first be loaded into registers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 9. 5-Stage Instruction Execution Cycle (Interactive Visualizer 5) */}
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

            {/* Embedded Visualizer 5 */}
            <InstructionCycleVisualizer />
          </section>

          {/* 10. Pipelining & Hazard Mitigations (Interactive Visualizer 6) */}
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

            {/* Embedded Visualizer 6 */}
            <PipelineHazardVisualizer />
          </section>

          {/* 11. Mathematical Foundations & Iron Law */}
          <section id="math" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">11.</span>
              <span>Mathematical Foundations & The Iron Law of Performance</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              The execution time of any software algorithm is governed by the classic three-term equation:
            </p>

            <MathBlock
              math="\text{CPU Time} = \frac{\text{Instructions}}{\text{Program}} \times \frac{\text{Clock Cycles}}{\text{Instruction}} \times \frac{\text{Seconds}}{\text{Clock Cycle}} = I \times \text{CPI} \times \tau = \frac{I \times \text{CPI}}{f_{\text{clock}}}"
              ariaLabel="The Iron Law of Processor Performance"
            />

            <div className="space-y-3 pt-2 text-sm text-slate-300 leading-relaxed">
              <p>
                When cache memory misses occur, average CPI degrades substantially:
              </p>
              <MathBlock
                math="\text{CPI}_{\text{effective}} = \text{CPI}_{\text{base}} + (\text{Memory Accesses per Instruction} \times \text{Miss Rate} \times \text{Miss Penalty})"
                ariaLabel="CPI with Cache Misses"
              />

              <p>
                Average Memory Access Time (AMAT):
              </p>
              <MathBlock
                math="\text{AMAT} = t_{\text{hit}} + (\text{Miss Rate} \times t_{\text{miss}})"
                ariaLabel="Average Memory Access Time Formula"
              />

              <p>
                Pipelined Theoretical Speedup with <MathBlock math="k" inline /> stages over <MathBlock math="n" inline /> instructions:
              </p>
              <MathBlock
                math="S_{\text{pipeline}} = \frac{n \times k}{k + n - 1} \quad \xrightarrow{n \to \infty} \quad k"
                ariaLabel="Pipelined Speedup Limit"
              />
            </div>
          </section>

          {/* 12. Superscalar, Multicore & Privilege Rings */}
          <section id="superscalar" className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2 border-b border-surface-border pb-2">
              <span className="text-cyber-sky">12.</span>
              <span>Superscalar Execution, Multicore, Context Switches & Protection Rings</span>
            </h2>
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                Modern high-performance processors are <strong>superscalar out-of-order (OoO)</strong> machines. Rather than dispatching 1 instruction per cycle, an execution engine (like Intel Golden Cove or Apple M-series) can decode and dispatch 6 to 8 micro-operations simultaneously into <strong>Reservation Stations</strong>, executing them whenever operand registers are ready, and retiring them sequentially via the <strong>Reorder Buffer (ROB)</strong>.
              </p>
              <h3 className="text-sm font-bold text-slate-100 font-mono pt-1">CPU Protection Rings (Ring 0 to Ring 3)</h3>
              <p>
                To prevent unprivileged user code from crashing the physical machine or corrupting kernel memory, hardware enforces 4 rings:
              </p>
              <ul className="text-xs text-slate-300 space-y-1 font-mono">
                <li>• <strong>Ring 0 (Supervisor / Kernel Mode):</strong> Full access to physical page tables, I/O ports, MSRs, and hardware interrupts.</li>
                <li>• <strong>Ring 1 & 2:</strong> Device drivers (rarely used in modern general-purpose OSes).</li>
                <li>• <strong>Ring 3 (User Space):</strong> Restricted application execution. Privileged instructions (e.g. <code className="text-cyber-sky">cli</code>, <code className="text-cyber-sky">lgdt</code>, <code className="text-cyber-sky">wrmsr</code>) trigger General Protection Faults (#GP).</li>
              </ul>
            </div>
          </section>

          {/* 13. Educational CPU Scratch Simulator (Interactive Visualizer 7) */}
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

            {/* Embedded Visualizer 7 */}
            <EducationalCpuSimulator />
          </section>

          {/* 14. C, Python & Assembly Implementations */}
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

          {/* 15. Hardware Security: Meltdown & Spectre */}
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

          {/* 16. Linux CPU Tools & /proc/cpuinfo (Interactive Visualizer 8) */}
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

            {/* Embedded Visualizer 8 */}
            <ProcCpuInfoExplorer />
          </section>

          {/* 17. Comprehensive Diagnostic Self-Check (10 Questions) */}
          <section id="assessment" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-2">
              <div className="flex items-center space-x-2 text-cyber-sky font-mono font-bold text-xs uppercase">
                <Award className="w-4 h-4 text-cyber-sky" />
                <span>Section 17: Diagnostic Mastery Check</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 font-mono">
                10 Comprehensive Multiple-Choice Self-Assessment Questions
              </h2>
              <p className="text-xs text-slate-400">
                Test your conceptual and engineering mastery of CPU architecture. Instant pedagogical feedback is provided for every option.
              </p>
            </div>

            <div className="space-y-4">
              {CPU_LESSON_CONTENT.quizQuestions.map((q) => (
                <SelfCheck
                  key={q.id}
                  question={`${q.id}. ${q.question}`}
                  options={q.options}
                />
              ))}
            </div>
          </section>

          {/* 18. Practical Hands-On Exercises (3 Challenges) */}
          <section id="exercises" className="space-y-4">
            <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-2">
              <div className="flex items-center space-x-2 text-cyber-amber font-mono font-bold text-xs uppercase">
                <Wrench className="w-4 h-4 text-cyber-amber" />
                <span>Section 18: Practical Hands-On Exercises</span>
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

                  {/* Solution Hint Toggle */}
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

          {/* Lesson Completion Footer Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-card to-surface-elevated border border-cyber-emerald/40 space-y-4">
            <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
              <span>Pilot Lesson Completed</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Congratulations on Finishing CPU Architecture, ISA & Execution!
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              You have established the rigorous hardware mental model required for systems programming, compiler engineering, deep learning performance optimization, and cybersecurity exploit analysis.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => markLessonCompleted(currentPath)}
                className="px-4 py-2 rounded-lg bg-cyber-emerald text-void font-bold text-xs font-mono hover:bg-emerald-400 transition flex items-center space-x-2 shadow-lg shadow-cyber-emerald/20"
              >
                <Check className="w-4 h-4" />
                <span>{completed ? 'Lesson Marked Complete' : 'Confirm & Mark Stage 0 Pilot Complete'}</span>
              </button>

              <Link
                to="/stage/0"
                className="px-4 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-slate-100 text-xs font-mono transition"
              >
                Return to Stage 0 Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Table of Contents (1 column) */}
        <div className="hidden lg:block sticky top-20 space-y-4">
          <ScrollAwareTOC sections={tocSections} />

          <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border text-[11px] font-mono text-slate-400 space-y-1.5">
            <span className="font-bold text-slate-200 block">18-Point Framework Active</span>
            <p className="leading-relaxed text-[10px]">
              TOC continuously synchronizes with active viewport scroll position and updates reading progress.
            </p>
          </div>
        </div>
      </div>

      {/* Persistent Notes Drawer */}
      <LessonNotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        lessonPath={currentPath}
        lessonTitle={CPU_LESSON_CONTENT.title}
      />
    </div>
  );
};

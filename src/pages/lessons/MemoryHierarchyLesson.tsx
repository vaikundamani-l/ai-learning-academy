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
  Layers,
  Binary,
  Cpu,
  Database,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Stage } from '../../types/curriculum';
import { useProgress } from '../../context/ProgressContext';
import { MathBlock } from '../../components/learning/MathBlock';
import { CodeBlock } from '../../components/learning/CodeBlock';
import { Callout } from '../../components/learning/Callout';
import { ScrollAwareTOC } from '../../components/learning/ScrollAwareTOC';
import { LessonNotesDrawer } from '../../components/learning/LessonNotesDrawer';
import { LessonHeader } from '../../components/learning/LessonHeader';
import { AssessmentGate } from '../../components/learning/AssessmentGate';

// 3 Interactive Visualizers and Simulators
import { BitwiseVisualizer } from '../../components/visual/memory/BitwiseVisualizer';
import { Ieee754Visualizer } from '../../components/visual/memory/Ieee754Visualizer';
import { MemoryPyramidVisualizer } from '../../components/visual/memory/MemoryPyramidVisualizer';

// Structured Pedagogical Content
import { MEMORY_LESSON_CONTENT } from '../../data/memoryLessonContent';

interface MemoryHierarchyLessonProps {
  stage: Stage;
  currentPath: string;
}

export const MemoryHierarchyLesson: React.FC<MemoryHierarchyLessonProps> = ({ stage, currentPath }) => {
  const { progress, markLessonCompleted } = useProgress();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const closeNotes = useCallback(() => setIsNotesOpen(false), []);
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  const completed = progress.completedLessons.includes(currentPath);
  const recordedScore = progress.assessmentScores[currentPath];
  const isMastered = (recordedScore !== undefined && recordedScore >= 80) || completed;

  // 18-Point Framework Table of Contents
  const tocSections = [
    { id: 'objectives', title: '1. Learning Objectives' },
    { id: 'prereqs', title: '2. Prerequisites & Assumptions' },
    { id: 'history', title: '3. History of Memory & Encodings' },
    { id: 'number-systems', title: '4. Positional Number Systems' },
    { id: 'twos-complement', title: '5. Signed Integers & Two\'s Complement' },
    { id: 'bitwise-lab', title: '6. Interactive Bitwise & Masking Lab' },
    { id: 'fractional-binary', title: '7. Fractional Binary & Fixed-Point' },
    { id: 'ieee754-deep-dive', title: '8. IEEE-754 Floating-Point Standard' },
    { id: 'ieee754-converter', title: '9. Interactive IEEE-754 Converter' },
    { id: 'numerical-pitfalls', title: '10. Numerical Instability & Cancellation' },
    { id: 'character-encoding', title: '11. Text Encodings: ASCII to UTF-8' },
    { id: 'endianness', title: '12. Endianness: Little vs. Big-Endian' },
    { id: 'struct-padding', title: '13. Struct Alignment & Padding' },
    { id: 'c-code-memory', title: '14. C Memory Inspection Implementation' },
    { id: 'python-ieee-decoder', title: '15. Python IEEE-754 Decoder' },
    { id: 'memory-pyramid-theory', title: '16. Memory Hierarchy Physics' },
    { id: 'memory-pyramid-lab', title: '17. Interactive Memory Hierarchy' },
    { id: 'assessment', title: '18. Diagnostic Mastery Exam' },
    { id: 'exercises', title: '19. Practical Hands-On Exercises' },
  ];

  const toggleHint = (exerciseId: number) => {
    setRevealedHints((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  return (
    <div className="space-y-8 pb-16 max-w-full min-w-0">
      {/* Top Header Bar */}
      <LessonHeader
        stageNumber={MEMORY_LESSON_CONTENT.stageNumber}
        lessonIndex={2}
        totalLessons={4}
        estimatedReadTime={MEMORY_LESSON_CONTENT.estimatedReadTime}
        title={MEMORY_LESSON_CONTENT.title}
        currentPath={currentPath}
        onOpenNotes={() => setIsNotesOpen(true)}
      />

      {/* Mobile Table of Contents */}
      <details className="lg:hidden rounded-xl border border-surface-border bg-surface-card p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-200">Jump to a Memory lesson section</summary>
        <ScrollAwareTOC sections={tocSections} className="mt-3" />
      </details>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Lesson Content */}
        <div className="lg:col-span-3 space-y-12">

          {/* Section 1: Objectives */}
          <section id="objectives" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-cyber-sky" />
              <span>Section 1</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Learning Objectives
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Upon mastering this lesson, you will possess a complete mental and mathematical model of how data is stored, addressed, and manipulated across silicon hardware:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {MEMORY_LESSON_CONTENT.objectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-card border border-surface-border text-xs text-slate-300 flex items-start space-x-2.5"
                >
                  <span className="w-5 h-5 rounded bg-surface border border-surface-border flex items-center justify-center text-[10px] text-cyber-sky font-mono font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{obj}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Prerequisites */}
          <section id="prereqs" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <Check className="w-4 h-4 text-cyber-indigo" />
              <span>Section 2</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Prerequisites & Foundation
            </h2>
            <div className="space-y-2">
              {MEMORY_LESSON_CONTENT.prerequisites.map((req, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-surface border border-surface-border text-xs font-mono text-slate-300 flex items-start space-x-2"
                >
                  <span className="text-cyber-indigo font-bold">•</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: History */}
          <section id="history" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-amber font-mono font-semibold text-xs tracking-wider uppercase">
              <Layers className="w-4 h-4 text-cyber-amber" />
              <span>Section 3</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Historical Evolution: From Punched Cards to Silicon SRAM & DRAM
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                In the earliest computational systems, data storage was mechanical. Herman Hollerith’s 1890 census tabulator encoded demographic tallies into physical holes punched in cardboard. A hole completed an electrical circuit through a mercury bath, actuating an electromagnetic counter.
              </p>
              <p>
                The dawn of electronic computing in the 1940s required faster, non-mechanical memory. Early architectures utilized <strong>mercury acoustic delay lines</strong> (such as in the Cambridge EDSAC), converting electrical pulses into sound waves travelling through liquid mercury tubes. The sound waves were picked up by quartz piezo-crystals at the end and recirculated in a continuous acoustic echo loop.
              </p>
              <p>
                In 1949, Jay Forrester and An Wang pioneered <strong>magnetic core memory</strong>. Tiny ferrite ceramic rings (cores) were threaded onto a matrix of copper wires. By driving orthogonal current pulses through an X and Y wire, the magnetic polarity of a specific core flipped clockwise or counter-clockwise, storing a permanent binary 0 or 1. Reading a core required attempting to flip it and sensing whether an induction pulse occurred on a sense line—a <em>destructive readout</em> requiring immediate hardware rewrite cycles.
              </p>
              <p>
                In 1966, Dr. Robert Dennard at IBM invented the <strong>single-transistor Dynamic RAM (DRAM)</strong> cell (patented in 1968). By pairing one MOSFET access transistor with one microscopic storage capacitor, DRAM achieved unprecedented memory density, laying the foundation for modern silicon memory hierarchies.
              </p>
            </div>
          </section>

          {/* Section 4: Number Systems */}
          <section id="number-systems" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Binary className="w-4 h-4 text-cyber-sky" />
              <span>Section 4</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Positional Number Systems: Base 2, 8, 10, and 16
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                A positional numeral system represents any numerical magnitude <MathBlock math="N" inline /> using a base (radix) <MathBlock math="b" inline /> and a sequence of digits <MathBlock math="d_i \in [0, b-1]" inline />:
              </p>

              <MathBlock
                math="N = \sum_{i=0}^{n-1} d_i \cdot b^i = d_{n-1} b^{n-1} + \dots + d_1 b^1 + d_0 b^0"
                ariaLabel="General positional numeral expansion formula"
              />

              <p>
                Silicon computers use <strong>Base 2 (Binary)</strong> because transistors operate most reliably as binary switches (cutoff vs. saturation, representing 0 V ground and positive supply voltage). Two discrete states maximize noise margins and immunity to thermal voltage fluctuations.
              </p>
              <p>
                However, long strings of binary digits (e.g. <code className="text-cyber-sky">1101011110100101</code>) are human-error prone. Because <MathBlock math="8 = 2^3" inline /> and <MathBlock math="16 = 2^4" inline />, <strong>Octal (Base 8)</strong> groups binary bits into triplets, and <strong>Hexadecimal (Base 16)</strong> groups binary bits into 4-bit <em>nibbles</em>. Every hex digit corresponds to exactly four binary bits.
              </p>

              {/* Conversion Matrix Table */}
              <div className="overflow-x-auto my-4 border border-surface-border rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-surface-elevated text-slate-200 border-b border-surface-border">
                    <tr>
                      <th className="p-2.5">Decimal (Base 10)</th>
                      <th className="p-2.5">Binary (Base 2)</th>
                      <th className="p-2.5">Octal (Base 8)</th>
                      <th className="p-2.5">Hexadecimal (Base 16)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border/50 text-slate-300">
                    {[
                      { dec: '0', bin: '0000', oct: '0', hex: '0x0' },
                      { dec: '3', bin: '0011', oct: '3', hex: '0x3' },
                      { dec: '7', bin: '0111', oct: '7', hex: '0x7' },
                      { dec: '8', bin: '1000', oct: '10', hex: '0x8' },
                      { dec: '10', bin: '1010', oct: '12', hex: '0xA' },
                      { dec: '12', bin: '1100', oct: '14', hex: '0xC' },
                      { dec: '15', bin: '1111', oct: '17', hex: '0xF' },
                      { dec: '16', bin: '0001 0000', oct: '20', hex: '0x10' },
                      { dec: '255', bin: '1111 1111', oct: '377', hex: '0xFF' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/50">
                        <td className="p-2.5 text-cyber-amber">{row.dec}</td>
                        <td className="p-2.5 text-cyber-sky font-bold">{row.bin}</td>
                        <td className="p-2.5 text-slate-300">{row.oct}</td>
                        <td className="p-2.5 text-cyber-emerald font-bold">{row.hex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 5: Signed Integers & Two's Complement */}
          <section id="twos-complement" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-semibold text-xs tracking-wider uppercase">
              <Binary className="w-4 h-4 text-cyber-emerald" />
              <span>Section 5</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Signed Integers: The Engineering Triumph of Two's Complement
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                How can digital hardware store negative numbers when transistors only hold 0 and 1? Computer scientists explored three historical approaches:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
                <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1.5">
                  <div className="font-bold text-slate-200 text-xs font-mono">1. Sign-Magnitude</div>
                  <p className="text-[11px] text-slate-400">
                    MSB is the sign (0=+, 1=-), remaining bits are magnitude. Flaw: generates dual zeros (<code className="text-cyber-amber">+0 = 0000</code> and <code className="text-cyber-amber">-0 = 1000</code>), requiring separate adder and subtractor circuitry.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1.5">
                  <div className="font-bold text-slate-200 text-xs font-mono">2. One's Complement</div>
                  <p className="text-[11px] text-slate-400">
                    Negative numbers formed by inverting all bits. Flaw: still possesses dual zeros (<code className="text-cyber-amber">0000</code> and <code className="text-cyber-amber">1111</code>) and requires an awkward "end-around carry" adder stage.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-card border border-cyber-emerald/40 space-y-1.5 bg-cyber-emerald/5">
                  <div className="font-bold text-cyber-emerald text-xs font-mono">3. Two's Complement (Standard)</div>
                  <p className="text-[11px] text-slate-300">
                    The MSB carries negative weight <MathBlock math="-2^{n-1}" inline />. Exactly one zero, zero waste, and subtraction <MathBlock math="A - B" inline /> executes identically to addition <MathBlock math="A + (\sim B + 1)" inline /> on standard binary adders!
                  </p>
                </div>
              </div>

              <p>
                The value of an <MathBlock math="n" inline />-bit two's complement integer <MathBlock math="b_{n-1} b_{n-2} \dots b_0" inline /> is defined rigorously by:
              </p>

              <MathBlock
                math="\text{Value}(b_{n-1} \dots b_0) = -b_{n-1} \cdot 2^{n-1} + \sum_{i=0}^{n-2} b_i \cdot 2^i"
                ariaLabel="Two's complement signed integer valuation formula"
              />

              <p>
                For an 8-bit integer, the MSB bit 7 represents <MathBlock math="-2^7 = -128" inline />, while bits 0 through 6 represent positive values summing to +127. Thus, an 8-bit signed integer spans the asymmetric range:
              </p>

              <MathBlock
                math="[-2^{n-1}, \quad 2^{n-1} - 1] \implies [-128, \quad +127]"
                ariaLabel="Range of an n-bit two's complement integer (n=8)"
              />

              <Callout type="note" title="The Two-Step Negation Algorithm: Invert & Add One">
                To negate any number X in two's complement hardware:
                <br />
                1. <strong>Invert every bit (Bitwise NOT):</strong> <MathBlock math="\sim X" inline /> (One's complement)
                <br />
                2. <strong>Add 1:</strong> <MathBlock math="-X = \sim X + 1" inline />
                <br />
                <em>Example:</em> Negate +5 (<code className="font-mono">00000101</code>). Inverting yields <code className="font-mono">11111010</code>. Adding 1 yields <code className="font-mono">11111011</code> (-128 + 64 + 32 + 16 + 8 + 0 + 2 + 1 = -5).
              </Callout>
            </div>
          </section>

          {/* Section 6: Interactive Bitwise Lab */}
          <section id="bitwise-lab" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Binary className="w-4 h-4 text-cyber-sky" />
              <span>Section 6 — Interactive Laboratory</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Interactive Two's Complement & Bitmasking Visualizer
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Use the live laboratory below to step through signed integer negations, observe carry bit ripples, test bitwise logic operators (AND, OR, XOR, shifts), and inspect POSIX permission masks.
            </p>

            <BitwiseVisualizer />
          </section>

          {/* Section 7: Fractional Binary */}
          <section id="fractional-binary" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <Layers className="w-4 h-4 text-cyber-indigo" />
              <span>Section 7</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Fractional Binary & Fixed-Point Limitations
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Digits to the right of a binary point represent negative powers of two:
              </p>

              <MathBlock
                math="0.b_1 b_2 b_3 b_4 = b_1 \cdot 2^{-1} + b_2 \cdot 2^{-2} + b_3 \cdot 2^{-3} + b_4 \cdot 2^{-4} = \frac{b_1}{2} + \frac{b_2}{4} + \frac{b_3}{8} + \frac{b_4}{16}"
                ariaLabel="Fractional binary positional expansion"
              />

              <p>
                In <strong>Fixed-Point</strong> representation, a fixed number of bits is allocated to the integer portion and a fixed number to the fractional portion (e.g. Q16.16 format allocates 16 bits for whole numbers and 16 bits for fractions). While fast on hardware lacking floating-point units, fixed-point suffers from a rigid dynamic range: it cannot simultaneously represent atomic distances (<MathBlock math="10^{-10}\text{ m}" inline />) and astronomical distances (<MathBlock math="10^{15}\text{ m}" inline />).
              </p>
            </div>
          </section>

          {/* Section 8: IEEE-754 Deep Dive */}
          <section id="ieee754-deep-dive" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Cpu className="w-4 h-4 text-cyber-sky" />
              <span>Section 8</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              The IEEE-754 Floating-Point Standard (FP32 & FP64)
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                To provide enormous dynamic range with high precision, the IEEE-754 standard (developed under William Kahan, 1985) encodes real numbers using scientific notation in base 2:
              </p>

              <MathBlock
                math="V = (-1)^S \times (1 + \text{Mantissa}) \times 2^{\text{Exponent} - \text{Bias}}"
                ariaLabel="IEEE-754 normalized floating-point value equation"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
                <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2">
                  <div className="text-xs font-mono font-bold text-cyber-sky">Single Precision (FP32) — 32 bits</div>
                  <ul className="text-xs text-slate-300 space-y-1 font-mono">
                    <li>• Sign (S): 1 bit</li>
                    <li>• Exponent (E): 8 bits (Bias = 127)</li>
                    <li>• Mantissa (M): 23 bits</li>
                    <li>• Precision: ~7.2 decimal digits</li>
                    <li>• Dynamic Range: ~1.18 × 10⁻³⁸ to ~3.40 × 10³⁸</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2">
                  <div className="text-xs font-mono font-bold text-cyber-emerald">Double Precision (FP64) — 64 bits</div>
                  <ul className="text-xs text-slate-300 space-y-1 font-mono">
                    <li>• Sign (S): 1 bit</li>
                    <li>• Exponent (E): 11 bits (Bias = 1023)</li>
                    <li>• Mantissa (M): 52 bits</li>
                    <li>• Precision: ~15.9 decimal digits</li>
                    <li>• Dynamic Range: ~2.23 × 10⁻³⁰⁸ to ~1.80 × 10³⁰⁸</li>
                  </ul>
                </div>
              </div>

              <h4 className="font-bold text-slate-200 text-sm pt-2">Special Bit Patterns in IEEE-754</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                <li>
                  <strong>Implicit Leading 1 (Hidden Bit):</strong> For normal numbers, the mantissa always starts with a leading 1 before the binary point (1.M). Because it is always 1, hardware does not store it, effectively granting 24 bits of mantissa precision in 23 physical bits.
                </li>
                <li>
                  <strong>Subnormal (Denormal) Numbers (E = 0, M ≠ 0):</strong> The leading bit becomes 0 (0.M) and the exponent is fixed at <MathBlock math="1 - \text{bias}" inline />. This enables <em>gradual underflow</em>, preventing sudden zero drops for microscopic quantities.
                </li>
                <li>
                  <strong>Infinities (E = 255, M = 0):</strong> Represents overflow beyond the representable maximum (+∞ or -∞).
                </li>
                <li>
                  <strong>Not a Number (NaN) (E = 255, M ≠ 0):</strong> Represents indeterminate results such as 0 / 0 or square root of negative numbers.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 9: Interactive IEEE-754 Converter */}
          <section id="ieee754-converter" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Cpu className="w-4 h-4 text-cyber-sky" />
              <span>Section 9 — Interactive Laboratory</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Interactive IEEE-754 Single-Precision Converter
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Type any decimal number or click individual bits to see how the 1 sign bit, 8 biased exponent bits, and 23 normalized mantissa bits decode in real time.
            </p>

            <Ieee754Visualizer />
          </section>

          {/* Section 10: Numerical Pitfalls */}
          <section id="numerical-pitfalls" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-rose font-mono font-semibold text-xs tracking-wider uppercase">
              <ShieldAlert className="w-4 h-4 text-cyber-rose" />
              <span>Section 10</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Numerical Instability, Precision Loss & Catastrophic Cancellation
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                In base 10, the fraction 1/3 = 0.333333... has no finite decimal representation. Similarly, in base 2, fractions whose denominators possess prime factors other than 2 cannot be represented as finite binary fractions.
              </p>
              <p>
                Specifically, the decimal value 0.1 (1/10 = 1/(2 × 5)) produces an infinite repeating binary sequence:
              </p>

              <MathBlock
                math="0.1_{10} = 0.000110011001100110011001100110011\dots_2"
                ariaLabel="0.1 as an infinitely recurring fraction in base 2"
              />

              <p>
                When stored in FP32 or FP64, this infinite sequence is truncated to fit the mantissa, yielding a slight rounding error. When calculating <code className="text-cyber-sky">0.1 + 0.2</code>, the sum in double precision is <code className="text-cyber-sky">0.300000000000000044408920985...</code>, explaining why <code className="text-cyber-sky">0.1 + 0.2 == 0.3</code> evaluates to <code className="text-cyber-rose font-bold">false</code> in Python, JavaScript, and C.
              </p>

              <Callout type="caution" title="Catastrophic Cancellation in Scientific & AI Computing">
                When subtracting two nearly equal floating-point numbers (x - y where x ≈ y), the leading significant digits cancel out, leaving only rounding noise in the low-order bits. In deep learning backpropagation, catastrophic cancellation causes gradient vanishing or exploding NaN values. Financial systems avoid IEEE-754 floats entirely, mandating fixed-point integer cents or arbitrary-precision decimal libraries.
              </Callout>
            </div>
          </section>

          {/* Section 11: Character Encoding */}
          <section id="character-encoding" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-semibold text-xs tracking-wider uppercase">
              <FileText className="w-4 h-4 text-cyber-emerald" />
              <span>Section 11</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Text & Character Encodings: ASCII, Unicode, and UTF-8
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Computers store text by mapping numeric codes (code points) to visual glyphs:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                <li>
                  <strong>ASCII (1963):</strong> A 7-bit encoding defining 128 characters (0-127). Includes English uppercase/lowercase letters, numerals 0-9, punctuation, and control characters (<code className="text-cyber-sky">CR=13, LF=10, NUL=0</code>).
                </li>
                <li>
                  <strong>Unicode Standard:</strong> A universal character space allocating code points from <code className="text-cyber-sky">U+0000</code> to <code className="text-cyber-sky">U+10FFFF</code> (1,114,112 total code points), covering every living language, historic scripts, mathematical symbols, and emoji.
                </li>
                <li>
                  <strong>UTF-8 (Ken Thompson & Rob Pike, 1992):</strong> A variable-width byte encoding scheme mapping Unicode code points into 1 to 4 contiguous bytes:
                </li>
              </ul>

              <div className="overflow-x-auto my-3 border border-surface-border rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-surface-elevated text-slate-200 border-b border-surface-border">
                    <tr>
                      <th className="p-2.5">Code Point Range</th>
                      <th className="p-2.5">Bytes</th>
                      <th className="p-2.5">Byte 1</th>
                      <th className="p-2.5">Byte 2</th>
                      <th className="p-2.5">Byte 3</th>
                      <th className="p-2.5">Byte 4</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border/50 text-slate-300">
                    <tr>
                      <td className="p-2.5 text-cyber-sky">U+0000 – U+007F</td>
                      <td className="p-2.5">1</td>
                      <td className="p-2.5 font-bold text-emerald-400">0xxxxxxx</td>
                      <td className="p-2.5 text-slate-500">—</td>
                      <td className="p-2.5 text-slate-500">—</td>
                      <td className="p-2.5 text-slate-500">—</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-cyber-sky">U+0080 – U+07FF</td>
                      <td className="p-2.5">2</td>
                      <td className="p-2.5 font-bold text-amber-400">110xxxxx</td>
                      <td className="p-2.5 font-bold text-slate-300">10xxxxxx</td>
                      <td className="p-2.5 text-slate-500">—</td>
                      <td className="p-2.5 text-slate-500">—</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-cyber-sky">U+0800 – U+FFFF</td>
                      <td className="p-2.5">3</td>
                      <td className="p-2.5 font-bold text-indigo-400">1110xxxx</td>
                      <td className="p-2.5 font-bold text-slate-300">10xxxxxx</td>
                      <td className="p-2.5 font-bold text-slate-300">10xxxxxx</td>
                      <td className="p-2.5 text-slate-500">—</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-cyber-sky">U+10000 – U+10FFFF</td>
                      <td className="p-2.5">4</td>
                      <td className="p-2.5 font-bold text-rose-400">11110xxx</td>
                      <td className="p-2.5 font-bold text-slate-300">10xxxxxx</td>
                      <td className="p-2.5 font-bold text-slate-300">10xxxxxx</td>
                      <td className="p-2.5 font-bold text-slate-300">10xxxxxx</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                <strong>The Genius of UTF-8:</strong> Any legacy ASCII file is 100% valid UTF-8 without changing a single byte. Furthermore, all continuation bytes begin with the prefix <code className="text-cyber-sky font-bold">10</code>, making UTF-8 <em>self-synchronizing</em>: if a stream drops a byte, the decoder recovers instantly at the next byte starting with <code className="text-cyber-sky">0</code> or <code className="text-cyber-sky">11</code>.
              </p>
            </div>
          </section>

          {/* Section 12: Endianness */}
          <section id="endianness" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Database className="w-4 h-4 text-cyber-sky" />
              <span>Section 12</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Memory Byte Ordering: Little-Endian vs. Big-Endian
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                When a multi-byte word (such as a 32-bit integer <code className="text-cyber-sky">0xAABBCCDD</code>) is stored into byte-addressable memory, the CPU must choose the sequence in which the 4 bytes occupy sequential addresses:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
                <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2">
                  <div className="text-xs font-mono font-bold text-cyber-sky">Little-Endian (x86-64, ARM, Apple Silicon)</div>
                  <p className="text-xs text-slate-300">
                    The <strong>Least Significant Byte (LSB)</strong> is stored at the lowest physical memory address.
                  </p>
                  <div className="p-2.5 rounded bg-surface border border-surface-border font-mono text-xs text-slate-200">
                    Addr 0x1000: <span className="text-cyber-sky font-bold">0xDD</span> (LSB)<br />
                    Addr 0x1001: <span>0xCC</span><br />
                    Addr 0x1002: <span>0xBB</span><br />
                    Addr 0x1003: <span className="text-cyber-amber font-bold">0xAA</span> (MSB)
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Advantage: Typecasting a 64-bit int to a 32-bit or 8-bit int requires zero address calculation (the pointer points directly to the LSB).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2">
                  <div className="text-xs font-mono font-bold text-cyber-emerald">Big-Endian (Network Byte Order, TCP/IP)</div>
                  <p className="text-xs text-slate-300">
                    The <strong>Most Significant Byte (MSB)</strong> is stored at the lowest physical memory address.
                  </p>
                  <div className="p-2.5 rounded bg-surface border border-surface-border font-mono text-xs text-slate-200">
                    Addr 0x1000: <span className="text-cyber-amber font-bold">0xAA</span> (MSB)<br />
                    Addr 0x1001: <span>0xBB</span><br />
                    Addr 0x1002: <span>0xCC</span><br />
                    Addr 0x1003: <span className="text-cyber-sky font-bold">0xDD</span> (LSB)
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Advantage: Natural reading order when inspecting hexadecimal hex dumps. Standard for internet protocol headers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 13: Struct Alignment & Padding */}
          <section id="struct-padding" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-amber font-mono font-semibold text-xs tracking-wider uppercase">
              <Layers className="w-4 h-4 text-cyber-amber" />
              <span>Section 13</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Hardware Alignment Constraints & Compiler Struct Padding
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Modern 64-bit memory buses fetch data in chunks of 8 bytes (64 bits) aligned on 8-byte boundaries. When the CPU executes a 4-byte read at address <code className="text-cyber-sky">0x1001</code> (an unaligned address), it must execute two separate memory transactions: one reading <code className="text-cyber-sky">0x1000-0x1007</code> and another reading <code className="text-cyber-sky">0x1008-0x100F</code>, stitching the byte slices together in internal registers. On architectures like ARM or SPARC, unaligned reads can cause an immediate hardware fault (<code className="text-cyber-rose">SIGBUS</code>).
              </p>
              <p>
                To maintain maximum performance, compilers enforce <strong>natural alignment</strong>: an n-byte primitive type must be placed at a memory address that is a multiple of n:
              </p>

              <MathBlock
                math="\text{Address} \pmod{\text{sizeof}(\text{type})} == 0"
                ariaLabel="Natural memory alignment constraint"
              />

              <p>
                When you define a C/C++ or Rust struct, the compiler automatically inserts invisible <strong>padding bytes</strong> to satisfy alignment:
              </p>

              <div className="p-4 rounded-xl bg-surface-card border border-surface-border font-mono text-xs space-y-2">
                <div className="text-slate-400">// Unoptimized struct order:</div>
                <div className="text-slate-200">
                  struct Telemetry {'{'}<br />
                  &nbsp;&nbsp;char status;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-cyber-sky">// 1 byte</span><br />
                  &nbsp;&nbsp;<span className="text-cyber-rose font-bold">// [3 padding bytes inserted by compiler here!]</span><br />
                  &nbsp;&nbsp;int timestamp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-cyber-sky">// 4 bytes (aligned to multiple of 4)</span><br />
                  &nbsp;&nbsp;char sensor_id;&nbsp;&nbsp;&nbsp;<span className="text-cyber-sky">// 1 byte</span><br />
                  &nbsp;&nbsp;<span className="text-cyber-rose font-bold">// [7 padding bytes inserted by compiler here!]</span><br />
                  &nbsp;&nbsp;double reading;&nbsp;&nbsp;&nbsp;<span className="text-cyber-sky">// 8 bytes (aligned to multiple of 8)</span><br />
                  {'}'}; <span className="text-cyber-amber font-bold">// Total: 24 bytes! (14 bytes data + 10 bytes padding)</span>
                </div>
              </div>

              <p>
                By reordering members in <strong>descending order of size</strong> (e.g. <code className="text-cyber-emerald">double (8) &rarr; int (4) &rarr; char (1) &rarr; char (1)</code>), the same struct shrinks from <strong>24 bytes to 16 bytes</strong>—saving 33% of RAM and doubling cache line hit density!
              </p>
            </div>
          </section>

          {/* Section 14: C Code Memory Demo */}
          <section id="c-code-memory" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Cpu className="w-4 h-4 text-cyber-sky" />
              <span>Section 14 — Practical Verification</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Proving Endianness & Struct Padding in C11
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              The following tested C program casts multi-byte integers to raw uint8_t byte pointers to detect hardware endianness and uses <code className="text-cyber-sky">offsetof()</code> from <code className="text-cyber-sky">&lt;stddef.h&gt;</code> to measure compiler padding:
            </p>

            <CodeBlock
              language="c"
              code={MEMORY_LESSON_CONTENT.codeExamples.cMemoryAndEndianness}
              title="endianness_and_padding_demo.c"
            />
          </section>

          {/* Section 15: Python IEEE Decoder */}
          <section id="python-ieee-decoder" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <Cpu className="w-4 h-4 text-cyber-indigo" />
              <span>Section 15 — Implementation From Scratch</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Building an IEEE-754 Single-Precision Decoder From Scratch in Python
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Here is a pure Python implementation that extracts raw bit fields using bitwise shifting (<code className="text-cyber-sky">&gt;&gt;</code>) and masking (<code className="text-cyber-sky">&amp;</code>), computing the floating-point value without relying on the <code className="text-cyber-sky">struct</code> module:
            </p>

            <CodeBlock
              language="python"
              code={MEMORY_LESSON_CONTENT.codeExamples.pythonFloatDecoder}
              title="ieee754_decoder.py"
            />
          </section>

          {/* Section 16: Memory Pyramid Theory */}
          <section id="memory-pyramid-theory" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Layers className="w-4 h-4 text-cyber-sky" />
              <span>Section 16</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              The Physical Memory Hierarchy Pyramid: Speed of Light, Silicon Cost & Capacitors
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Why can't computers simply use 64 Gigabytes of ultra-fast L1 cache memory? The answer stems from the fundamental laws of semiconductor physics and economic scaling:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                <li>
                  <strong>Speed of Light in Copper/Silicon:</strong> Electrical signals propagate through silicon interconnects at approximately <MathBlock math="15\text{ cm/ns}" inline /> (about half the speed of light in vacuum). To access memory in 1 nanosecond, the storage cells must physically sit within a few centimeters of the ALU.
                </li>
                <li>
                  <strong>SRAM Cell Real Estate:</strong> Static RAM (used in CPU L1/L2/L3 caches) requires 6 transistors (6T) per single bit. A 64 GB SRAM array would require an enormous silicon die costing hundreds of thousands of dollars and generating fatal thermal wattage.
                </li>
                <li>
                  <strong>DRAM Capacitor Leakage:</strong> Dynamic RAM uses a single access transistor and a microscopic trench capacitor (1T-1C). While dense and inexpensive, the capacitor leaks charge through quantum tunneling and parasitic resistance, requiring an electrical recharge (refresh cycle) every 64 milliseconds. Furthermore, reading a capacitor discharges it, requiring a restore cycle and incurring a 60–80 ns latency penalty.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 17: Interactive Memory Hierarchy Visualizer */}
          <section id="memory-pyramid-lab" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Layers className="w-4 h-4 text-cyber-sky" />
              <span>Section 17 — Interactive Laboratory</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Interactive Memory Hierarchy Latency Visualizer
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Click any tier of the memory pyramid below to inspect access latencies, clock cycles, hardware technology, and the dramatic human-scale time equivalence (where 1 CPU cycle equals 1 human second).
            </p>

            <MemoryPyramidVisualizer />
          </section>

          {/* Section 18: Diagnostic Mastery Exam */}
          {/* Section 18: Diagnostic Mastery Exam */}
          <AssessmentGate
            currentPath={currentPath}
            lessonTitle={MEMORY_LESSON_CONTENT.title}
            sectionNumber={18}
            questions={MEMORY_LESSON_CONTENT.quizQuestions}
          />

          {/* Section 19: Practical Exercises */}
          <section id="exercises" className="space-y-6 pt-6 border-t border-surface-border">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <Wrench className="w-4 h-4 text-cyber-indigo" />
              <span>Section 19 — Practical Exercises</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                Hands-On Engineering Exercises
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Solidify your understanding by completing these three manual and structural derivation challenges:
              </p>
            </div>

            <div className="space-y-4">
              {MEMORY_LESSON_CONTENT.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100 font-mono">
                      {ex.title}
                    </h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        ex.level === 'Beginner'
                          ? 'bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30'
                          : ex.level === 'Intermediate'
                          ? 'bg-cyber-sky/10 text-cyber-sky border border-cyber-sky/30'
                          : 'bg-cyber-amber/10 text-cyber-amber border border-cyber-amber/30'
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
              <span>Stage 0 Mastery Checkpoint</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {isMastered ? 'Stage 0 Memory & Binary Data Representation Mastered!' : 'Complete the Diagnostic Exam to Certify Mastery'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {isMastered
                ? 'You have demonstrated certified architectural understanding across all topics, from Two\'s Complement arithmetic and IEEE-754 precision to UTF-8 serialization, endianness, and memory hierarchy physics.'
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
                to="/stage/0/lesson/cpu-architecture"
                className="px-4 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-slate-100 text-xs font-mono transition"
              >
                &larr; Back to Lesson 1: CPU Architecture
              </Link>

              <Link
                to="/stage/0/lesson/operating-systems"
                className="px-4 py-2 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition"
              >
                Proceed to Lesson 3: Operating Systems &rarr;
              </Link>

              <Link
                to="/stage/0"
                className="px-4 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-slate-100 text-xs font-mono transition"
              >
                Return to Stage 0 Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Table of Contents */}
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
        onClose={closeNotes}
        lessonPath={currentPath}
        lessonTitle={MEMORY_LESSON_CONTENT.title}
      />
    </div>
  );
};

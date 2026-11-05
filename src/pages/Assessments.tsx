import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';
import { useProgress } from '../context/ProgressContext';

export const Assessments: React.FC = () => {
  const { progress, saveAssessmentScore } = useProgress();

  // Interactive Quiz for Stage 0 (CPU Architecture & Fundamentals)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const stage0Questions = [
    {
      q: 'Why are CPU registers placed at the very top of the computer memory hierarchy?',
      options: [
        'They are fabricated with magnetic storage to preserve values across power loss.',
        'They are located directly on the CPU core using static flip-flops, providing single-cycle sub-nanosecond access latency.',
        'They use dynamic capacitive refresh circuits identical to main memory RAM.',
        'They are accessed via PCIe busses to maximize throughput.'
      ],
      correct: 1,
      explanation: 'Registers reside directly inside the CPU execution core fabricated with SRAM latches, giving sub-nanosecond access time compared to ~50-100ns for DRAM RAM.'
    },
    {
      q: 'In the classic 5-stage CPU instruction pipeline (IF, ID, EX, MEM, WB), what happens during the "Writeback" (WB) stage?',
      options: [
        'Instructions are fetched from the L1 instruction cache.',
        'The Control Unit decodes the opcode and reads register values.',
        'The computed result from the ALU or loaded data from memory is written back into the destination register in the register file.',
        'The CPU flushes all speculative instructions upon branch misprediction.'
      ],
      correct: 2,
      explanation: 'The Writeback stage commits the final computed ALU value or loaded memory data into the architectural register specified in the instruction.'
    },
    {
      q: 'What is a "Data Hazard" (Read-After-Write / RAW) in an instruction pipeline?',
      options: [
        'Two instructions attempt to access the memory bus at the exact same clock edge.',
        'An instruction attempts to read a register value before a preceding instruction has committed its new value to that register.',
        'A conditional branch outcome is predicted incorrectly, forcing a pipeline flush.',
        'The operating system initiates an interrupt during kernel context switching.'
      ],
      correct: 1,
      explanation: 'A RAW data hazard happens when instruction J requires operand R, which is computed by instruction I, but instruction I has not yet written back to R.'
    },
    {
      q: 'How does an Out-of-Order (OoO) superscalar CPU preserve program correctness despite executing instructions non-sequentially?',
      options: [
        'By disabling CPU interrupts during parallel execution.',
        'By using a Reorder Buffer (ROB) that allows instructions to execute out of order but strictly commits their architectural state in original program order.',
        'By requiring the compiler to insert NOP instructions before every branch.',
        'By executing all speculative paths simultaneously.'
      ],
      correct: 1,
      explanation: 'Modern superscalar CPUs execute instructions opportunistically as operands become ready, but retire/commit them in strict original sequential program order via the Reorder Buffer.'
    }
  ];

  const handleSelect = (optionIdx: number) => {
    if (submitted) return;
    const next = [...selectedAnswers];
    next[currentQuestion] = optionIdx;
    setSelectedAnswers(next);
  };

  const calculateScore = () => {
    let correctCount = 0;
    stage0Questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) {
        correctCount++;
      }
    });
    return Math.round((correctCount / stage0Questions.length) * 100);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    saveAssessmentScore('stage-0-quiz', score);
  };

  const handleReset = () => {
    setSelectedAnswers([]);
    setSubmitted(false);
    setCurrentQuestion(0);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
          <Award className="w-4 h-4" />
          <span>Mastery Verification System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Rigorous Assessments & Diagnostic Exams
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
          Mastery is verified through conceptual explanations, code debugging, and transfer problem solving. Opening a lesson does not mark it complete.
        </p>
      </div>

      {/* Interactive Assessment Sandbox: Stage 0 Benchmark Exam */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-cyber-sky font-bold">
                STAGE 0 EXAM
              </span>
              <span className="text-slate-400">Computer Fundamentals & CPU Architecture</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mt-1">
              Diagnostic Mastery Assessment ({currentQuestion + 1} of {stage0Questions.length})
            </h3>
          </div>

          {submitted && (
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold text-cyber-sky">
                Score: {calculateScore()}%
              </span>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-mono text-slate-300 hover:text-white transition flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            </div>
          )}
        </div>

        {/* Question Content */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-100 leading-relaxed">
            {stage0Questions[currentQuestion].q}
          </p>

          <div className="space-y-2">
            {stage0Questions[currentQuestion].options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQuestion] === idx;
              const isCorrect = stage0Questions[currentQuestion].correct === idx;

              let btnStyle = 'bg-surface border-surface-border text-slate-300 hover:border-slate-500';
              if (isSelected) {
                btnStyle = 'bg-cyber-sky/15 border-cyber-sky text-cyber-sky font-medium';
              }
              if (submitted) {
                if (isCorrect) {
                  btnStyle = 'bg-cyber-emerald/20 border-cyber-emerald text-cyber-emerald font-medium';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-cyber-rose/20 border-cyber-rose text-cyber-rose';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-mono transition flex items-start space-x-3 ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-md bg-void border border-surface-border flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed font-sans">{opt}</span>
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className="p-3.5 rounded-lg bg-surface border border-surface-border text-xs text-slate-300 space-y-1">
              <div className="text-[10px] font-mono text-cyber-sky font-semibold uppercase">Explanation:</div>
              <p>{stage0Questions[currentQuestion].explanation}</p>
            </div>
          )}
        </div>

        {/* Navigation & Submit Bar */}
        <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs font-mono">
          <button
            onClick={() => setCurrentQuestion(q => Math.max(0, q - 1))}
            disabled={currentQuestion === 0}
            className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-slate-400 hover:text-slate-200 disabled:opacity-40"
          >
            &larr; Previous
          </button>

          <div className="space-x-1">
            {stage0Questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-7 h-7 rounded text-xs transition ${
                  currentQuestion === i
                    ? 'bg-cyber-sky text-void font-bold'
                    : selectedAnswers[i] !== undefined
                    ? 'bg-surface-elevated text-slate-200'
                    : 'bg-surface text-slate-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentQuestion === stage0Questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitted || selectedAnswers.length < stage0Questions.length}
              className="px-4 py-1.5 rounded-lg bg-cyber-emerald text-void font-bold hover:bg-emerald-400 transition disabled:opacity-40"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(q => Math.min(stage0Questions.length - 1, q + 1))}
              className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-cyber-sky hover:text-sky-300"
            >
              Next &rarr;
            </button>
          )}
        </div>
      </div>

      {/* All 31 Stages Mastery Checks Directory */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100">
          Curriculum Stage Mastery Criteria (31 Stages)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CURRICULUM_STAGES.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2 text-xs"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="font-bold text-cyber-sky">Stage {s.id}</span>
                <span>{s.category}</span>
              </div>
              <h4 className="font-bold text-slate-200">{s.title}</h4>
              <p className="text-slate-400 italic bg-surface p-2.5 rounded border border-surface-border">
                "{s.masteryCheck}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

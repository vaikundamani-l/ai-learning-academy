import React, { useState } from 'react';
import { 
  CheckSquare, 
  Filter, 
  CheckCircle2, 
  Terminal, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Code2,
  Award
} from 'lucide-react';

interface Exercise {
  id: string;
  stageId: number;
  stageName: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  prompt: string;
  inputExample: string;
  expectedOutput: string;
  solutionHint: string;
}

export const Exercises: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<number | 'All'>('All');
  const [expandedId, setExpandedId] = useState<string | null>('ex-0-1');
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const sampleExercises: Exercise[] = [
    {
      id: 'ex-0-1',
      stageId: 0,
      stageName: 'Stage 0: Computer Fundamentals',
      level: 'Beginner',
      title: 'Two\'s Complement Integer Overflow Detector',
      prompt: 'Write a function in Python that takes an 8-bit signed integer value and checks whether adding a given delta produces an arithmetic overflow beyond the [-128, 127] boundary.',
      inputExample: 'check_overflow(val=120, delta=10)',
      expectedOutput: 'True (Overflow occurred: 130 > 127)',
      solutionHint: 'Check if (val + delta) > 127 or (val + delta) < -128. In hardware, overflow is detected when two positive operands yield a negative sign bit.'
    },
    {
      id: 'ex-0-2',
      stageId: 0,
      stageName: 'Stage 0: Computer Fundamentals',
      level: 'Intermediate',
      title: 'CPU Instruction Decoder for 16-bit Micro-ISA',
      prompt: 'Given a 16-bit binary instruction word where bits [15:12] represent the Opcode, bits [11:8] the Destination Register, and bits [7:0] an 8-bit immediate value, decode the word into a human-readable assembly string.',
      inputExample: 'decode_word("0010000100001111")',
      expectedOutput: '{"opcode": "LOAD", "reg": "R1", "imm": 15}',
      solutionHint: 'Use bitwise masking: opcode = (word >> 12) & 0xF; reg = (word >> 8) & 0xF; imm = word & 0xFF.'
    },
    {
      id: 'ex-0-3',
      stageId: 0,
      stageName: 'Stage 0: Computer Fundamentals',
      level: 'Advanced',
      title: 'Pipeline Data Hazard & RAW Dependency Detector',
      prompt: 'In a 5-stage CPU pipeline (IF, ID, EX, MEM, WB), determine whether instruction B depends on the register writeback of instruction A (Read-After-Write hazard) and calculate how many bubble stall cycles are required if forwarding is disabled.',
      inputExample: 'A: ADD R1, R2, R3 | B: SUB R4, R1, R5',
      expectedOutput: 'RAW Hazard Detected on R1. Requires 2 pipeline bubble stalls without forwarding.',
      solutionHint: 'Instruction A writes to R1 at the WB stage (cycle 5). Instruction B reads R1 at ID (cycle 2). Without forwarding, B must stall until cycle 5.'
    },
    {
      id: 'ex-1-1',
      stageId: 1,
      stageName: 'Stage 1: Python Thinking',
      level: 'Intermediate',
      title: 'Streamed Log Parser with Malformed Line Handling',
      prompt: 'Write a Python generator that parses server access logs line by line, extracts IPv4 addresses, and gracefully yields a structured dictionary while rejecting malformed lines without crashing.',
      inputExample: '"192.168.1.1 - - [05/Nov/2026] \\"GET /index.html HTTP/1.1\\" 200 1024"',
      expectedOutput: '{"ip": "192.168.1.1", "status": 200, "bytes": 1024}',
      solutionHint: 'Use a compiled regex with named groups. Enclose line splitting in try/except ValueError.'
    },
    {
      id: 'ex-2-1',
      stageId: 2,
      stageName: 'Stage 2: Data Structures & Algorithms',
      level: 'Advanced',
      title: 'O(1) LRU Cache Eviction Implementation',
      prompt: 'Implement an LRU Cache with get(key) and put(key, value) operations executing in strict O(1) amortized time complexity.',
      inputExample: 'cache = LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1); cache.put(3, 3); cache.get(2)',
      expectedOutput: 'cache.get(2) returns -1 (evicted as least recently used)',
      solutionHint: 'Combine a doubly linked list (for fast O(1) node detachment and head insertion) with a hash map (for O(1) node lookup by key).'
    }
  ];

  const filtered = sampleExercises.filter(ex => {
    const matchesLevel = selectedLevel === 'All' || ex.level === selectedLevel;
    const matchesStage = selectedStage === 'All' || ex.stageId === selectedStage;
    return matchesLevel && matchesStage;
  });

  const toggleComplete = (id: string) => {
    setCompletedExercises(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
            <CheckSquare className="w-4 h-4" />
            <span>Practical Challenges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            Graded Exercises & Implementation Drills
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Verify your comprehension through beginner, intermediate, and advanced engineering challenges spanning computing, algorithms, ML, and cybersecurity.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-surface-card p-2 rounded-xl border border-surface-border">
          <Award className="w-4 h-4 text-cyber-amber" />
          <span>Completed: {completedExercises.length} / {sampleExercises.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-1 bg-surface-card p-1 rounded-lg border border-surface-border">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded text-xs font-mono transition ${
                selectedLevel === lvl
                  ? 'bg-cyber-sky text-void font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {filtered.map((ex) => {
          const isDone = completedExercises.includes(ex.id);
          const isExpanded = expandedId === ex.id;

          return (
            <div
              key={ex.id}
              className={`rounded-xl border transition ${
                isDone
                  ? 'bg-surface-card/80 border-cyber-emerald/40'
                  : 'bg-surface-card border-surface-border hover:border-slate-500'
              }`}
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : ex.id)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-3 pr-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(ex.id);
                    }}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition flex-shrink-0 ${
                      isDone
                        ? 'bg-cyber-emerald border-cyber-emerald text-void'
                        : 'border-slate-500 hover:border-cyber-sky'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      <span className="text-slate-400">{ex.stageName}</span>
                      <span className="text-slate-600">•</span>
                      <span className={`font-semibold ${
                        ex.level === 'Beginner' ? 'text-cyber-sky' :
                        ex.level === 'Intermediate' ? 'text-cyber-amber' : 'text-cyber-rose'
                      }`}>
                        {ex.level}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100 mt-0.5">
                      {ex.title}
                    </h3>
                  </div>
                </div>

                <div className="text-slate-500">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-surface-border/60 space-y-4 text-xs font-mono">
                  <div>
                    <div className="text-slate-400 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                      Problem Statement
                    </div>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      {ex.prompt}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-surface border border-surface-border">
                      <span className="text-slate-500 uppercase text-[10px] block mb-1">Example Input:</span>
                      <code className="text-cyber-sky">{ex.inputExample}</code>
                    </div>
                    <div className="p-3 rounded-lg bg-surface border border-surface-border">
                      <span className="text-slate-500 uppercase text-[10px] block mb-1">Expected Output:</span>
                      <code className="text-cyber-emerald">{ex.expectedOutput}</code>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-surface border border-surface-border text-slate-400">
                    <span className="text-cyber-amber font-semibold block mb-0.5">Solution Architectural Hint:</span>
                    <span>{ex.solutionHint}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

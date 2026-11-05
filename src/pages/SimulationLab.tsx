import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Sliders, 
  Terminal, 
  Layers, 
  ShieldAlert, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cpuAtCycle, CPU_PHASES, CPU_PROGRAM } from '../utils/cpu';
import { CURRICULUM_STAGES } from '../data/curriculumData';

export const SimulationLab: React.FC = () => {
  const location = useLocation();
  const isCpuDirect = location.pathname.includes('cpu-instruction-cycle');

  // Interactive CPU Simulator State
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [speed, setSpeed] = useState<number>(1);
  const model = cpuAtCycle(cycle);
  const { pc, registers, phase: currentPhase, instruction: currentInstruction, logs: consoleLogs } = model;
  const program = CPU_PROGRAM;
  const phases = CPU_PHASES;
  const handleStep = () => { setIsRunning(false); setCycle(c => Math.min(20, c + 1)); };
  const handleReset = () => { setIsRunning(false); setCycle(0); };
  useEffect(() => {
    if (!isRunning || cycle >= 20) return;
    const timer = window.setInterval(() => setCycle(c => Math.min(20, c + 1)), 1000 / speed);
    return () => window.clearInterval(timer);
  }, [isRunning, speed, cycle >= 20]);
  useEffect(() => { if (cycle >= 20) setIsRunning(false); }, [cycle]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
          <Cpu className="w-4 h-4" />
          <span>Interactive Simulation Laboratory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Hardware, Neural & Systems Simulators
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
          Interactive execution environments equipped with step-forward/backward clocks, live register views, parameter sliders, and state inspection.
        </p>
      </div>

      <p className="rounded-xl border border-cyber-amber/30 bg-cyber-amber/10 p-4 text-sm text-slate-300">
        CPU preview: one instruction runs at a time through five phases. This is not a pipelined CPU. Memory[0x0A] starts at 9; STORE writes R4 to Memory[0x0C]. {model.halted ? 'Program finished. Reset or step backward to explore.' : 'Use Play or Step to follow the four-instruction program.'}
        <span className="block mt-2 font-mono">Memory[0x0C] = {model.memory['0x0C']}</span>
      </p>
      {/* Featured Flagship Simulator: CPU Instruction Execution Cycle */}
      <div className="p-6 rounded-2xl bg-surface-card border border-cyber-sky/40 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyber-sky/20 text-cyber-sky border border-cyber-sky/40 text-[10px] font-mono font-bold">
                STAGE 0 PILOT SIMULATOR
              </span>
              <span className="text-xs font-mono text-slate-400">
                Serial five-phase teaching model
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              CPU Instruction Execution & Register Simulator
            </h2>
          </div>

          {/* Animation Controls (Adhering to VISUAL_STANDARDS.md) */}
          <div className="flex items-center space-x-2 bg-surface p-1.5 rounded-xl border border-surface-border">
            <button
              disabled={model.halted}
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 rounded-lg bg-cyber-sky text-void hover:bg-sky-400 transition"
              title={isRunning ? "Pause simulation" : "Play continuous clock"}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button title="Step backward" disabled={cycle === 0}
              onClick={() => { setIsRunning(false); setCycle(c => Math.max(0, c - 1)); }}
              className="p-2 rounded-lg text-slate-300 hover:bg-surface-elevated">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              disabled={model.halted}
              onClick={handleStep}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-surface-elevated transition"
              title="Step forward (+1 cycle)"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-surface-elevated transition"
              title="Reset simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="border-l border-surface-border pl-2 ml-1 flex items-center space-x-1.5 text-xs font-mono text-slate-400">
              <span>Speed:</span>
              <button
                onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 0.5 : 1)}
                className="px-2 py-1 rounded bg-surface-card hover:bg-surface-elevated text-cyber-sky font-bold"
              >
                {speed}x
              </button>
            </div>
          </div>
        </div>

        {/* 5-Stage Pipeline Progress Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Execution phase</span>
            <span className="text-cyber-sky font-bold">Cycle {cycle}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {phases.map((ph) => {
              const isActive = currentPhase === ph;
              return (
                <div
                  key={ph}
                  className={`p-3 rounded-lg border text-center transition ${
                    isActive
                      ? 'bg-cyber-sky/20 border-cyber-sky text-cyber-sky shadow-lg shadow-cyber-sky/10'
                      : 'bg-surface border-surface-border text-slate-500'
                  }`}
                >
                  <div className="text-[10px] font-mono tracking-wider">{ph}</div>
                  <div className="text-xs font-bold mt-0.5">
                    {ph === 'FETCH' && 'Fetch instruction'}
                    {ph === 'DECODE' && 'Opcode & Operands'}
                    {ph === 'EXECUTE' && 'ALU Compute'}
                    {ph === 'MEMORY' && 'RAM Access'}
                    {ph === 'WRITEBACK' && 'Register Write'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hardware Blocks Grid: Registers + ALU + Instruction Pointer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Block 1: Program Counter & IR */}
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3">
            <div className="text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between border-b border-surface-border pb-2">
              <span>Control Unit & PC</span>
              <Cpu className="w-4 h-4 text-cyber-amber" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-surface-card">
                <span className="text-slate-400">Program Counter (PC):</span>
                <span className="text-cyber-sky font-bold">0x{pc.toString(16).padStart(4, '0')}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-card">
                <span className="text-slate-400">Instruction Reg (IR):</span>
                <span className="text-cyber-amber font-bold truncate max-w-[130px]">{currentInstruction}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-card">
                <span className="text-slate-400">Clock Phase:</span>
                <span className="text-cyber-emerald font-bold">{currentPhase}</span>
              </div>
            </div>
          </div>

          {/* Block 2: General Purpose Registers */}
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3">
            <div className="text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between border-b border-surface-border pb-2">
              <span>Register Bank (GPRs)</span>
              <Layers className="w-4 h-4 text-cyber-indigo" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(registers).map(([reg, val]) => (
                <div key={reg} className="p-2 rounded bg-surface-card flex items-center justify-between">
                  <span className="text-slate-400">{reg}:</span>
                  <span className="text-cyber-sky font-bold">0x{val.toString(16).padStart(2, '0')} ({val})</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 text-center pt-1">
              Educational integer registers; not a specific hardware ISA
            </div>
          </div>

          {/* Block 3: Live Micro-Execution Log */}
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
            <div className="text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between border-b border-surface-border pb-2">
              <span>Bus & ALU Telemetry</span>
              <Terminal className="w-4 h-4 text-cyber-emerald" />
            </div>
            <div className="bg-void p-2.5 rounded-lg border border-surface-border text-[11px] space-y-1 h-28 overflow-y-auto text-slate-300 font-mono">
              {consoleLogs.map((log, i) => (
                <div key={i} className={i === 0 ? 'text-cyber-sky font-semibold' : 'text-slate-500'}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Directory Catalog */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100">
          Curriculum Simulation Catalog
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM_STAGES.flatMap(s => s.simulators).slice(1).map((sim) => (
            <div
              key={sim.id}
              className="p-5 rounded-xl bg-surface-card border border-surface-border hover:border-slate-500 transition space-y-3 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
                  <span className="uppercase text-cyber-sky font-semibold">{sim.category}</span>
                  <span>Stage {sim.stageId}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyber-sky transition">
                  {sim.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {sim.description}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-slate-400">Planned simulator</span>
                <Link
                  to={`/stage/${sim.stageId}`}
                  className="text-cyber-sky hover:underline flex items-center space-x-1"
                >
                  <span>Stage outline</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

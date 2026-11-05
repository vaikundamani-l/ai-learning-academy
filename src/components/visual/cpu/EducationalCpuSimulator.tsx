import React, { useState, useEffect, useRef } from 'react';
import { SimulationHarness, RegisterEntry, MemoryEntry, LogEntry } from '../SimulationHarness';
import { AnimationController } from '../AnimationController';
import { cpuAtCycle, CPU_PROGRAM, CPU_PHASES } from '../../../utils/cpu';

export const EducationalCpuSimulator: React.FC = () => {
  const [cycle, setCycle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxCycles = 20;
  const cpuState = cpuAtCycle(cycle);

  useEffect(() => {
    if (!isPlaying || cycle >= maxCycles) return;
    const timer = setInterval(() => setCycle(value => Math.min(maxCycles, value + 1)), 1200 / speed);
    return () => clearInterval(timer);
  }, [isPlaying, speed, cycle >= maxCycles]);
  useEffect(() => { if (cycle >= maxCycles) setIsPlaying(false); }, [cycle]);

  const handlePlayToggle = () => {
    if (cycle >= maxCycles) {
      setCycle(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (cycle < maxCycles) setCycle((c) => c + 1);
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (cycle > 0) setCycle((c) => c - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCycle(0);
  };

  // Convert CPU state into harness structures
  const registersList: RegisterEntry[] = [
    {
      name: 'PC',
      value: `0x${cpuState.pc.toString(16).toUpperCase().padStart(4, '0')}`,
      bits: '16-bit',
      description: 'Program Counter',
    },
    {
      name: 'R1',
      value: cpuState.registers.R1,
      bits: '16-bit',
      description: 'Accumulator / Operand',
    },
    {
      name: 'R2',
      value: cpuState.registers.R2,
      bits: '16-bit',
      description: 'Secondary Operand',
    },
    {
      name: 'R3',
      value: cpuState.registers.R3,
      bits: '16-bit',
      description: 'Addition Target',
    },
    {
      name: 'R4',
      value: cpuState.registers.R4,
      bits: '16-bit',
      description: 'Subtraction Target',
    },
  ];

  const memoryList: MemoryEntry[] = [
    {
      address: '0x000A',
      hex: `0x${(cpuState.memory['0x0A'] || 0).toString(16).toUpperCase().padStart(4, '0')}`,
      decimal: cpuState.memory['0x0A'] || 0,
      label: 'Input Data',
      highlight: cycle >= 1 && cycle <= 5,
    },
    {
      address: '0x000C',
      hex: `0x${(cpuState.memory['0x0C'] || 0).toString(16).toUpperCase().padStart(4, '0')}`,
      decimal: cpuState.memory['0x0C'] || 0,
      label: 'Result Output',
      highlight: cycle >= 16,
    },
    {
      address: '0x0010',
      hex: '0x110A',
      decimal: 4362,
      label: 'Code: LOAD',
    },
    {
      address: '0x0014',
      hex: '0x2312',
      decimal: 8978,
      label: 'Code: ADD',
    },
  ];

  const logEntries: LogEntry[] = cpuState.logs.map((msg: string, i: number) => ({
    cycle: Math.max(1, cycle - i),
    timestamp: `${(cycle * 0.5).toFixed(1)} ns`,
    phase: cpuState.phase,
    message: msg,
  }));

  const activeInstructionIndex = cycle === 0 ? 0 : Math.min(3, Math.floor((cycle - 1) / 5));

  return (
    <SimulationHarness
      title="Complete Educational CPU Simulator & Microcode Engine"
      subtitle="Serial 5-phase educational execution model demonstrating instruction decode, ALU computation, and bus transactions."
      statusBadge={cpuState.halted ? 'Program Halted' : `Phase: ${cpuState.phase}`}
      registers={registersList}
      flags={{
        ZF: cpuState.registers.R4 === 0 && cycle >= 15,
        CF: false,
        SF: false,
      }}
      memory={memoryList}
      logs={logEntries}
      onResetSimulation={handleReset}
      controller={
        <AnimationController
          currentCycle={cycle}
          totalCycles={maxCycles}
          isPlaying={isPlaying}
          speed={speed}
          phaseLabel={cpuState.phase}
          statusText={`Current Instruction: ${cpuState.instruction} ${cpuState.halted ? '(HALTED)' : ''}`}
          onPlayToggle={handlePlayToggle}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onReset={handleReset}
          onSpeedChange={setSpeed}
          onSeek={(c) => {
            setIsPlaying(false);
            setCycle(c);
          }}
          canStepForward={cycle < maxCycles}
          canStepBackward={cycle > 0}
        />
      }
    >
      {/* Program Code Listing & Execution Arrow */}
      <div className="w-full space-y-4 font-mono">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-surface-border pb-2">
          <span>LOADED MICROCODE PROGRAM</span>
          <span>PC: 0x{cpuState.pc.toString(16).toUpperCase().padStart(4, '0')}</span>
        </div>

        <div className="space-y-2">
          {CPU_PROGRAM.map((prog: { op: string; dest: string; src: string; code: string }, idx: number) => {
            const isActive = idx === activeInstructionIndex && !cpuState.halted && cycle > 0;
            const isCompleted = idx < activeInstructionIndex || cpuState.halted;

            return (
              <div
                key={prog.code}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isActive
                    ? 'border-cyber-sky bg-cyber-sky/15 shadow-lg shadow-cyber-sky/10'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-300'
                    : 'border-surface-border bg-surface text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-cyber-sky text-void animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-surface-elevated text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-100 text-xs">
                        {prog.op} {prog.dest}, {prog.src}
                      </span>
                      <span className="text-[10px] text-slate-500">[{prog.code}]</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {idx === 0 && 'Load memory [0x0A] (value 9) into register R1'}
                      {idx === 1 && 'Add R1 (9) + R2 (12) -> store 21 into R3'}
                      {idx === 2 && 'Subtract R3 (21) - R1 (9) -> store 12 into R4'}
                      {idx === 3 && 'Store register R4 (12) back to memory [0x0C]'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {isActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyber-amber text-void">
                      {cpuState.phase}
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-xs text-cyber-emerald font-bold">RETIRED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status notice */}
        <div className="p-3 rounded-lg bg-surface border border-surface-border text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Execution Model: </strong>
          Each instruction transitions serially through 5 phases (Fetch, Decode, Execute, Memory, Writeback), taking 5 clock cycles per instruction (20 cycles total for 4 instructions).
        </div>
      </div>
    </SimulationHarness>
  );
};

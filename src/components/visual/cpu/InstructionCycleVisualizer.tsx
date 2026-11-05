import React, { useState, useEffect, useRef } from 'react';
import { AnimationController } from '../AnimationController';

interface StageInfo {
  name: string;
  short: string;
  color: string;
  subsystem: string;
  details: string;
  hardwareActions: string[];
}

export const InstructionCycleVisualizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stages: StageInfo[] = [
    {
      name: 'Instruction Fetch (IF)',
      short: 'IF',
      color: '#38bdf8',
      subsystem: 'Program Counter (PC) & L1 Instruction Cache',
      details:
        'The CPU places the value of the Program Counter (0x00401080) onto the address bus. The L1 Instruction Cache reads the 32-bit machine word (0x00A11820) and latches it into the Instruction Register (IR). Concurrently, the PC increments to 0x00401084 for the next sequential fetch.',
      hardwareActions: [
        'ADDR_BUS <= PC (0x00401080)',
        'I_CACHE_READ asserted',
        'IR <= Mem[PC] (ADD R3, R1, R2)',
        'PC <= PC + 4',
      ],
    },
    {
      name: 'Instruction Decode & Reg Read (ID)',
      short: 'ID',
      color: '#f59e0b',
      subsystem: 'Control Unit (CU) & Register File',
      details:
        'The Control Unit parses the opcode bits (000000 for ADD) and source/destination register indices (Rs=R1, Rt=R2, Rd=R3). The register file reads the 64-bit values stored in R1 (5) and R2 (12) and places them onto internal operand latch buses A and B.',
      hardwareActions: [
        'OPCODE <= IR[31:26] (ADD)',
        'SRC_A <= RegFile[R1] (5)',
        'SRC_B <= RegFile[R2] (12)',
        'ALU_CTRL <= SELECT_ADD',
      ],
    },
    {
      name: 'Execution / ALU Calculation (EX)',
      short: 'EX',
      color: '#10b981',
      subsystem: 'Arithmetic Logic Unit (ALU)',
      details:
        'The ALU activates its 64-bit parallel adder circuitry, performing 5 + 12 = 17. Concurrently, the flag generator checks the output: since 17 is non-zero, positive, and fits in 64 bits without carry out, Zero Flag (ZF)=0, Carry Flag (CF)=0, Sign Flag (SF)=0.',
      hardwareActions: [
        'ALU_OUT <= 5 + 12 = 17',
        'ZF <= (ALU_OUT == 0) -> 0',
        'SF <= ALU_OUT[63] -> 0',
        'CF <= CARRY_OUT -> 0',
      ],
    },
    {
      name: 'Memory Access (MEM)',
      short: 'MEM',
      color: '#818cf8',
      subsystem: 'L1 Data Cache / Bus Interface Unit',
      details:
        'For arithmetic instructions like ADD or SUB, memory access is bypassed (a 1-cycle pass-through or bubble). For LOAD (e.g. MOV R1, [0x1000]) or STORE instructions, the calculated effective address is sent to the L1 Data Cache to read or write data.',
      hardwareActions: [
        'MEM_READ <= 0 (Bypassed for ADD)',
        'MEM_WRITE <= 0',
        'DATA_BUS <= ALU_OUT (17 passed through)',
      ],
    },
    {
      name: 'Register Writeback (WB)',
      short: 'WB',
      color: '#ec4899',
      subsystem: 'Register File Write Port',
      details:
        'The final result (17) from the ALU is delivered to the destination register port Rd (R3). The register write enable signal (REG_WE) is strobed high on the rising clock edge, committing the value 17 into Register R3. The instruction has officially retired!',
      hardwareActions: [
        'REG_WE <= 1',
        'WRITE_REG_ADDR <= R3',
        'WRITE_DATA <= 17',
        'INSTRUCTION RETIRED',
      ],
    },
  ];

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 1800 / speed;
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= stages.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, stages.length]);

  const handlePlayToggle = () => {
    if (currentStep >= stages.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    if (currentStep < stages.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const handleStepBackward = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const activeStage = stages[currentStep];

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl space-y-4 p-5">
      {/* Visual Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
            The 5-Stage Classic Instruction Execution Cycle
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrating step-by-step clock transitions for instruction: <code className="text-cyber-amber">ADD R3, R1, R2</code> (R1=5, R2=12)
          </p>
        </div>
        <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyber-sky/15 text-cyber-sky border border-cyber-sky/30">
          Stage {currentStep + 1} of 5
        </span>
      </div>

      {/* Pipeline 5-Stage Visual Progression Track */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        {stages.map((stg, idx) => {
          const isActive = idx === currentStep;
          const isPast = idx < currentStep;
          return (
            <button
              key={stg.short}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(idx);
              }}
              className={`p-3 rounded-xl border text-left font-mono transition-all relative overflow-hidden ${
                isActive
                  ? 'border-cyber-sky bg-cyber-sky/15 shadow-lg shadow-cyber-sky/10'
                  : isPast
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-slate-200'
                  : 'border-surface-border bg-surface text-slate-500 opacity-70 hover:opacity-100'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-cyber-sky animate-pulse" />
              )}
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>{stg.short}</span>
                <span className="text-[10px]">{idx + 1}/5</span>
              </div>
              <div className="text-[11px] font-medium truncate text-slate-200">{stg.name}</div>
            </button>
          );
        })}
      </div>

      {/* Interactive Architecture Flow View */}
      <div className="p-5 rounded-xl bg-void border border-surface-border">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full animate-ping"
              style={{ backgroundColor: activeStage.color }}
            />
            <h4 className="text-sm font-bold font-mono text-slate-100">{activeStage.name}</h4>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Active Subsystem: <strong className="text-slate-200">{activeStage.subsystem}</strong>
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-surface/80 p-3.5 rounded-lg border border-surface-border">
          {activeStage.details}
        </p>

        {/* Micro-actions list */}
        <div className="mt-3.5 space-y-1.5">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Active Hardware Register & Bus Actions
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {activeStage.hardwareActions.map((act, i) => (
              <div
                key={i}
                className="px-2.5 py-1.5 rounded bg-surface-card border border-surface-border text-xs font-mono text-cyber-sky flex items-center space-x-2"
              >
                <span className="text-[10px] text-slate-500">{i + 1}.</span>
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation Controller Bar */}
      <AnimationController
        currentCycle={currentStep}
        totalCycles={stages.length - 1}
        isPlaying={isPlaying}
        speed={speed}
        phaseLabel={activeStage.short}
        statusText={`Phase ${currentStep + 1}: ${activeStage.name}`}
        onPlayToggle={handlePlayToggle}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        onReset={handleReset}
        onSpeedChange={setSpeed}
        onSeek={(cycle) => {
          setIsPlaying(false);
          setCurrentStep(cycle);
        }}
        canStepForward={currentStep < stages.length - 1}
        canStepBackward={currentStep > 0}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { Layers, AlertTriangle, CheckCircle, ArrowRight, RefreshCw, Zap } from 'lucide-react';

interface PipelineSlot {
  stage: 'IF' | 'ID' | 'EX' | 'MEM' | 'WB' | 'STALL' | 'FLUSH';
  instId: number;
}

export const PipelineHazardVisualizer: React.FC = () => {
  const [scenario, setScenario] = useState<'ideal' | 'raw_stall' | 'forwarding' | 'branch_flush'>('forwarding');

  // Instructions for the scenarios
  const instructions = {
    ideal: [
      { id: 1, asm: 'ADD R1, R2, R3', desc: 'Computes R2 + R3' },
      { id: 2, asm: 'SUB R4, R5, R6', desc: 'Independent computation' },
      { id: 3, asm: 'AND R7, R8, R9', desc: 'Independent computation' },
      { id: 4, asm: 'OR  R10, R11, R12', desc: 'Independent computation' },
    ],
    raw_stall: [
      { id: 1, asm: 'ADD R1, R2, R3', desc: 'Produces R1 (available in WB cycle 5)' },
      { id: 2, asm: 'SUB R4, R1, R5', desc: 'Requires R1 in ID (Stalls 2 cycles!)' },
      { id: 3, asm: 'AND R6, R7, R8', desc: 'Delayed by pipeline stall' },
    ],
    forwarding: [
      { id: 1, asm: 'ADD R1, R2, R3', desc: 'Produces R1 (forwarded from EX output)' },
      { id: 2, asm: 'SUB R4, R1, R5', desc: 'Bypasses stall via EX->EX Forwarding wire!' },
      { id: 3, asm: 'AND R6, R7, R8', desc: 'Continues at full 1 IPC throughput' },
    ],
    branch_flush: [
      { id: 1, asm: 'BEQ R1, R2, target', desc: 'Branch resolved TAKEN in Cycle 3' },
      { id: 2, asm: 'ADD R3, R4, R5', desc: 'Speculatively fetched (Flushed!)' },
      { id: 3, asm: 'SUB R6, R7, R8', desc: 'Speculatively fetched (Flushed!)' },
      { id: 4, asm: 'target: MOV R9, 10', desc: 'Correct target instruction executed' },
    ],
  };

  // Matrix: [Instruction][Cycle (1 to 7)]
  // Pre-calculated exact microarchitecture schedule for each scenario
  const schedules: Record<string, string[][]> = {
    ideal: [
      ['IF', 'ID', 'EX', 'MEM', 'WB', '-', '-'],
      ['-', 'IF', 'ID', 'EX', 'MEM', 'WB', '-'],
      ['-', '-', 'IF', 'ID', 'EX', 'MEM', 'WB'],
      ['-', '-', '-', 'IF', 'ID', 'EX', 'MEM'],
    ],
    raw_stall: [
      ['IF', 'ID', 'EX', 'MEM', 'WB', '-', '-'],
      ['-', 'IF', 'STALL', 'STALL', 'ID', 'EX', 'MEM'],
      ['-', '-', 'STALL', 'STALL', 'IF', 'ID', 'EX'],
    ],
    forwarding: [
      ['IF', 'ID', 'EX', 'MEM', 'WB', '-', '-'],
      ['-', 'IF', 'ID', 'EX', 'MEM', 'WB', '-'],
      ['-', '-', 'IF', 'ID', 'EX', 'MEM', 'WB'],
    ],
    branch_flush: [
      ['IF', 'ID', 'EX', 'MEM', 'WB', '-', '-'],
      ['-', 'IF', 'FLUSH', '-', '-', '-', '-'],
      ['-', '-', 'FLUSH', '-', '-', '-', '-'],
      ['-', '-', '-', 'IF', 'ID', 'EX', 'MEM'],
    ],
  };

  const currentInstructions = instructions[scenario];
  const currentSchedule = schedules[scenario];

  const getStageStyle = (stage: string) => {
    switch (stage) {
      case 'IF':
        return 'bg-cyber-sky/20 border-cyber-sky text-cyber-sky font-bold';
      case 'ID':
        return 'bg-cyber-amber/20 border-cyber-amber text-cyber-amber font-bold';
      case 'EX':
        return 'bg-cyber-emerald/20 border-cyber-emerald text-cyber-emerald font-bold';
      case 'MEM':
        return 'bg-cyber-indigo/20 border-cyber-indigo text-cyber-indigo font-bold';
      case 'WB':
        return 'bg-pink-500/20 border-pink-500 text-pink-400 font-bold';
      case 'STALL':
        return 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold animate-pulse';
      case 'FLUSH':
        return 'bg-slate-800 border-slate-600 text-slate-500 line-through';
      default:
        return 'bg-transparent border-transparent text-slate-700';
    }
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyber-sky" />
            <span>5-Stage Instruction Pipeline & Hazard Demonstrator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Examine instruction overlap, Data Hazards (RAW), Bypassing / Forwarding, and Branch Misprediction Flushes.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center space-x-1.5 font-mono text-xs">
          <span className="text-slate-400">Scenario:</span>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as any)}
            aria-label="Pipeline scenario"
            className="px-2.5 py-1 rounded bg-surface-elevated border border-surface-border text-slate-200 font-mono text-xs focus:outline-none focus:border-cyber-sky"
          >
            <option value="forwarding">Hardware Forwarding (0 Stalls)</option>
            <option value="raw_stall">RAW Data Hazard (2 Bubble Stalls)</option>
            <option value="branch_flush">Branch Mispredict (Pipeline Flush)</option>
            <option value="ideal">Ideal Pipeline (1 IPC)</option>
          </select>
        </div>
      </div>

      {/* Scenario explanation banner */}
      <div className="p-3.5 rounded-xl border border-surface-border bg-surface text-xs font-mono leading-relaxed space-y-1">
        {scenario === 'forwarding' && (
          <div className="text-cyber-emerald flex items-start space-x-2">
            <Zap className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyber-emerald" />
            <div>
              <strong>Hardware Forwarding / Bypassing: </strong>
              The ALU output of instruction 1 is routed directly via an internal multiplexer wire to the ALU input of instruction 2 at the start of cycle 3. No stalls are required!
            </div>
          </div>
        )}
        {scenario === 'raw_stall' && (
          <div className="text-rose-400 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <div>
              <strong>Read-After-Write (RAW) Hazard without Forwarding: </strong>
              Instruction 2 needs register R1 in cycle 2, but instruction 1 does not commit R1 until cycle 5 Writeback. The hardware hazard detection unit inserts two bubble STALL cycles.
            </div>
          </div>
        )}
        {scenario === 'branch_flush' && (
          <div className="text-cyber-amber flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyber-amber" />
            <div>
              <strong>Control Hazard & Branch Penalty: </strong>
              The branch predictor guessed "Not Taken", fetching instructions 2 and 3. In Cycle 3 (EX), the branch condition evaluates "TAKEN". Speculatively fetched instructions are flushed and PC loads the target address.
            </div>
          </div>
        )}
        {scenario === 'ideal' && (
          <div className="text-cyber-sky flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyber-sky" />
            <div>
              <strong>Ideal Pipeline Flow: </strong>
              Zero hazards or dependencies. One instruction is fetched, decoded, executed, accessed, and retired every clock cycle, achieving CPI = 1.0.
            </div>
          </div>
        )}
      </div>

      {/* Pipeline Gantt-Chart Matrix */}
      <div className="overflow-x-auto p-4 rounded-xl bg-void border border-surface-border font-mono">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-surface-border text-slate-400">
              <th className="py-2 px-3 min-w-[200px]">Instruction</th>
              <th className="text-center px-2">Cycle 1</th>
              <th className="text-center px-2">Cycle 2</th>
              <th className="text-center px-2">Cycle 3</th>
              <th className="text-center px-2">Cycle 4</th>
              <th className="text-center px-2">Cycle 5</th>
              <th className="text-center px-2">Cycle 6</th>
              <th className="text-center px-2">Cycle 7</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50">
            {currentInstructions.map((inst, rowIdx) => (
              <tr key={inst.id} className="hover:bg-surface/30 transition">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-slate-200">{inst.asm}</div>
                  <div className="text-[10px] text-slate-500">{inst.desc}</div>
                </td>
                {currentSchedule[rowIdx]?.map((stage, colIdx) => (
                  <td key={colIdx} className="text-center px-1.5 py-1">
                    {stage !== '-' && (
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[11px] border ${getStageStyle(
                          stage
                        )}`}
                      >
                        {stage}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono text-slate-400">
        <span className="font-bold text-slate-300">Legend:</span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded bg-cyber-sky/40 border border-cyber-sky" />
          <span>IF = Fetch</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded bg-cyber-amber/40 border border-cyber-amber" />
          <span>ID = Decode</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded bg-cyber-emerald/40 border border-cyber-emerald" />
          <span>EX = Execute</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded bg-cyber-indigo/40 border border-cyber-indigo" />
          <span>MEM = Memory</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded bg-pink-500/40 border border-pink-500" />
          <span>WB = Writeback</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded bg-rose-500/40 border border-rose-500" />
          <span>STALL = Bubble</span>
        </span>
      </div>
    </div>
  );
};

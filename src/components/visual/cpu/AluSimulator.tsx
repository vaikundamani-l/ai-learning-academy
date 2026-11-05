import React, { useState } from 'react';
import { Cpu, ArrowRight, Check, AlertCircle } from 'lucide-react';

export const AluSimulator: React.FC = () => {
  const [operandA, setOperandA] = useState<number>(45);
  const [operandB, setOperandB] = useState<number>(27);
  const [op, setOp] = useState<'ADD' | 'SUB' | 'AND' | 'OR' | 'XOR' | 'SHL' | 'SHR'>('ADD');

  // Constrain to 8-bit values (0-255)
  const a8 = Math.max(0, Math.min(255, operandA));
  const b8 = Math.max(0, Math.min(255, operandB));

  let rawResult = 0;
  let carry = false;
  let overflow = false;

  switch (op) {
    case 'ADD': {
      rawResult = a8 + b8;
      carry = rawResult > 255;
      // Signed overflow check (two positive make negative, or two negative make positive)
      const aSign = (a8 & 0x80) !== 0;
      const bSign = (b8 & 0x80) !== 0;
      const resSign = ((rawResult & 0xff) & 0x80) !== 0;
      overflow = (aSign === bSign) && (aSign !== resSign);
      break;
    }
    case 'SUB': {
      rawResult = a8 - b8;
      carry = a8 < b8; // borrow
      const aSign = (a8 & 0x80) !== 0;
      const bSign = (b8 & 0x80) !== 0;
      const resSign = ((rawResult & 0xff) & 0x80) !== 0;
      overflow = (aSign !== bSign) && (aSign !== resSign);
      break;
    }
    case 'AND':
      rawResult = a8 & b8;
      break;
    case 'OR':
      rawResult = a8 | b8;
      break;
    case 'XOR':
      rawResult = a8 ^ b8;
      break;
    case 'SHL':
      rawResult = a8 << 1;
      carry = (a8 & 0x80) !== 0;
      break;
    case 'SHR':
      rawResult = a8 >> 1;
      carry = (a8 & 0x01) !== 0;
      break;
  }

  const result8 = rawResult & 0xff;
  const zero = result8 === 0;
  const sign = (result8 & 0x80) !== 0;

  // Convert to 8-bit binary strings
  const aBin = a8.toString(2).padStart(8, '0');
  const bBin = b8.toString(2).padStart(8, '0');
  const resBin = result8.toString(2).padStart(8, '0');

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyber-emerald" />
            <span>Interactive 8-Bit Arithmetic Logic Unit (ALU) Simulator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test integer arithmetic, bitwise Boolean logic gates, carry propagation, and status flag evaluation.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30">
          8-Bit Word Engine
        </span>
      </div>

      {/* Control Panel: Inputs and Op Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {/* Operand A */}
        <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">OPERAND A (Input 1)</span>
            <span className="text-cyber-sky font-bold">0x{a8.toString(16).toUpperCase().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={0}
              max={255}
              value={operandA}
              onChange={(e) => setOperandA(Number(e.target.value))}
              aria-label="Operand A decimal value"
              className="w-20 px-2 py-1 rounded bg-surface-elevated border border-surface-border text-xs font-bold text-slate-100 focus:outline-none focus:border-cyber-sky"
            />
            <input
              type="range"
              min={0}
              max={255}
              value={operandA}
              onChange={(e) => setOperandA(Number(e.target.value))}
              aria-label="Operand A slider"
              className="flex-1 accent-cyber-sky"
            />
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
            <span>Binary:</span>
            <span className="text-slate-200 tracking-widest">{aBin}</span>
          </div>
        </div>

        {/* Operation Selector */}
        <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-2">
          <div className="text-xs font-bold text-slate-200">ALU OPERATION</div>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {(['ADD', 'SUB', 'AND', 'OR', 'XOR', 'SHL', 'SHR'] as const).map((operation) => (
              <button
                key={operation}
                onClick={() => setOp(operation)}
                className={`py-1.5 px-2 rounded font-bold transition text-center ${
                  op === operation
                    ? 'bg-cyber-emerald text-void shadow-md'
                    : 'bg-surface-elevated border border-surface-border text-slate-300 hover:text-slate-100'
                }`}
              >
                {operation}
              </button>
            ))}
          </div>
        </div>

        {/* Operand B */}
        <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">OPERAND B (Input 2)</span>
            <span className="text-cyber-sky font-bold">0x{b8.toString(16).toUpperCase().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={0}
              max={255}
              value={operandB}
              onChange={(e) => setOperandB(Number(e.target.value))}
              aria-label="Operand B decimal value"
              className="w-20 px-2 py-1 rounded bg-surface-elevated border border-surface-border text-xs font-bold text-slate-100 focus:outline-none focus:border-cyber-sky"
            />
            <input
              type="range"
              min={0}
              max={255}
              value={operandB}
              onChange={(e) => setOperandB(Number(e.target.value))}
              aria-label="Operand B slider"
              className="flex-1 accent-cyber-sky"
            />
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
            <span>Binary:</span>
            <span className="text-slate-200 tracking-widest">{bBin}</span>
          </div>
        </div>
      </div>

      {/* ALU Hardware Circuit Visualizer */}
      <div className="p-5 rounded-xl bg-void border border-surface-border space-y-4">
        <div className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
          <span>PARALLEL 8-BIT BIT-SLICES & CARRY CASCADE</span>
          <span className="text-cyber-emerald font-bold">Executing: {op}</span>
        </div>

        {/* Bit-by-bit Visual Columns */}
        <div className="grid grid-cols-8 gap-2 font-mono text-center">
          {[7, 6, 5, 4, 3, 2, 1, 0].map((bitIdx) => {
            const bitA = aBin[7 - bitIdx];
            const bitB = bBin[7 - bitIdx];
            const bitRes = resBin[7 - bitIdx];
            return (
              <div key={bitIdx} className="p-2 rounded-lg bg-surface border border-surface-border space-y-1">
                <div className="text-[10px] text-slate-500 font-bold">Bit {bitIdx}</div>
                <div className="text-xs text-cyber-sky font-bold">{bitA}</div>
                <div className="text-[10px] text-slate-600 font-bold">{op === 'ADD' ? '+' : op === 'SUB' ? '-' : op}</div>
                <div className="text-xs text-cyber-sky font-bold">{bitB}</div>
                <div className="border-t border-surface-border pt-1 text-xs text-cyber-emerald font-bold">
                  {bitRes}
                </div>
              </div>
            );
          })}
        </div>

        {/* Result & Flags Output Bar */}
        <div className="p-4 rounded-xl bg-surface border border-surface-border flex flex-wrap items-center justify-between gap-4 font-mono">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Accumulated 8-Bit Result</div>
            <div className="flex items-center space-x-3 text-lg font-bold text-slate-100 mt-0.5">
              <span className="text-cyber-emerald">{result8}</span>
              <span className="text-xs text-slate-400">(0x{result8.toString(16).toUpperCase().padStart(2, '0')})</span>
              <span className="text-xs text-cyber-sky tracking-wider font-mono">[{resBin}]</span>
            </div>
          </div>

          {/* Flags readouts */}
          <div className="flex items-center space-x-2">
            <div
              className={`px-3 py-1.5 rounded-lg border text-center text-xs ${
                zero ? 'bg-cyber-amber/20 border-cyber-amber text-cyber-amber font-bold' : 'bg-surface-elevated border-surface-border text-slate-500'
              }`}
            >
              <div className="text-[9px]">ZF (Zero)</div>
              <div>{zero ? '1' : '0'}</div>
            </div>

            <div
              className={`px-3 py-1.5 rounded-lg border text-center text-xs ${
                carry ? 'bg-cyber-amber/20 border-cyber-amber text-cyber-amber font-bold' : 'bg-surface-elevated border-surface-border text-slate-500'
              }`}
            >
              <div className="text-[9px]">CF (Carry)</div>
              <div>{carry ? '1' : '0'}</div>
            </div>

            <div
              className={`px-3 py-1.5 rounded-lg border text-center text-xs ${
                sign ? 'bg-cyber-amber/20 border-cyber-amber text-cyber-amber font-bold' : 'bg-surface-elevated border-surface-border text-slate-500'
              }`}
            >
              <div className="text-[9px]">SF (Sign)</div>
              <div>{sign ? '1' : '0'}</div>
            </div>

            <div
              className={`px-3 py-1.5 rounded-lg border text-center text-xs ${
                overflow ? 'bg-cyber-rose/20 border-cyber-rose text-cyber-rose font-bold' : 'bg-surface-elevated border-surface-border text-slate-500'
              }`}
            >
              <div className="text-[9px]">OF (Overflow)</div>
              <div>{overflow ? '1' : '0'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

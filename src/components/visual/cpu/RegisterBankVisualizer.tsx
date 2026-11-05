import React, { useState } from 'react';
import { Database, Binary, CheckCircle, Info } from 'lucide-react';

interface CpuRegister {
  name64: string;
  name32: string;
  name16: string;
  name8: string;
  role: string;
  value: bigint;
  standardUse: string;
}

export const RegisterBankVisualizer: React.FC = () => {
  const [selectedRegIndex, setSelectedRegIndex] = useState<number>(0);
  const [format, setFormat] = useState<'hex' | 'dec' | 'bin'>('hex');

  // Realistic sample register state in x86-64
  const [registers, setRegisters] = useState<CpuRegister[]>([
    {
      name64: 'RAX',
      name32: 'EAX',
      name16: 'AX',
      name8: 'AL',
      role: 'Accumulator Register',
      value: BigInt(42),
      standardUse: 'Arithmetic operations, function return values in System V AMD64 ABI.',
    },
    {
      name64: 'RBX',
      name32: 'EBX',
      name16: 'BX',
      name8: 'BL',
      role: 'Base Register',
      value: BigInt(0x1000),
      standardUse: 'Callee-saved register; traditionally used as a pointer to base data.',
    },
    {
      name64: 'RCX',
      name32: 'ECX',
      name16: 'CX',
      name8: 'CL',
      role: 'Counter Register',
      value: BigInt(10),
      standardUse: 'Loop counter in `REP` string ops and shift counts in bitwise operations.',
    },
    {
      name64: 'RDX',
      name32: 'EDX',
      name16: 'DX',
      name8: 'DL',
      role: 'Data Register',
      value: BigInt(0),
      standardUse: 'I/O operations, high 64 bits of 128-bit multiplication/division results.',
    },
    {
      name64: 'RSI',
      name32: 'ESI',
      name16: 'SI',
      name8: 'SIL',
      role: 'Source Index',
      value: BigInt(0x7ffd2b88),
      standardUse: 'Source pointer in string/memory copy operations; 2nd function argument.',
    },
    {
      name64: 'RDI',
      name32: 'EDI',
      name16: 'DI',
      name8: 'DIL',
      role: 'Destination Index',
      value: BigInt(0x7ffd2b90),
      standardUse: 'Destination pointer in string operations; 1st function argument.',
    },
    {
      name64: 'RBP',
      name32: 'EBP',
      name16: 'BP',
      name8: 'BPL',
      role: 'Base/Frame Pointer',
      value: BigInt(0x7fffffffe340),
      standardUse: 'Points to the base of the current stack frame for local variables.',
    },
    {
      name64: 'RSP',
      name32: 'ESP',
      name16: 'SP',
      name8: 'SPL',
      role: 'Stack Pointer',
      value: BigInt(0x7fffffffe318),
      standardUse: 'Points to the top of the execution call stack (decrements on `PUSH`).',
    },
    {
      name64: 'RIP',
      name32: 'EIP',
      name16: 'IP',
      name8: '-',
      role: 'Instruction Pointer',
      value: BigInt(0x00401124),
      standardUse: 'Holds the memory address of the next instruction waiting to execute.',
    },
  ]);

  // CPU Status Flags
  const [flags, setFlags] = useState({
    ZF: false, // Zero Flag
    CF: false, // Carry Flag
    SF: false, // Sign Flag
    OF: false, // Overflow Flag
    PF: true,  // Parity Flag
    AF: false, // Auxiliary Carry
  });

  const toggleFlag = (flagName: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flagName]: !prev[flagName] }));
  };

  const selectedReg = registers[selectedRegIndex];

  // Format value into 64-bit binary string
  const binaryString = selectedReg.value.toString(2).padStart(64, '0');
  const hexString = '0x' + selectedReg.value.toString(16).toUpperCase().padStart(16, '0');
  const decString = selectedReg.value.toString(10);

  // Quick register edit
  const handleSetRegValue = (newVal: bigint) => {
    setRegisters((prev) =>
      prev.map((r, i) => (i === selectedRegIndex ? { ...r, value: newVal } : r))
    );
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-5">
      {/* Visual Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyber-sky" />
            <span>x86-64 Register File & Status Flags Visualizer</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect 64-bit hardware registers, partial register addressing (RAX, EAX, AX, AL), and ALU condition codes.
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex items-center space-x-1 bg-surface border border-surface-border rounded-lg p-1 text-xs font-mono">
          <button
            onClick={() => setFormat('hex')}
            className={`px-2.5 py-1 rounded transition ${
              format === 'hex' ? 'bg-cyber-sky text-void font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HEX
          </button>
          <button
            onClick={() => setFormat('dec')}
            className={`px-2.5 py-1 rounded transition ${
              format === 'dec' ? 'bg-cyber-sky text-void font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DEC
          </button>
          <button
            onClick={() => setFormat('bin')}
            className={`px-2.5 py-1 rounded transition ${
              format === 'bin' ? 'bg-cyber-sky text-void font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BIN
          </button>
        </div>
      </div>

      {/* Main Grid: Register Table on Left, Register Detail & Flags on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Register Table (8 columns) */}
        <div className="lg:col-span-7 space-y-2 font-mono">
          <div className="text-[11px] font-bold text-slate-400 px-1 flex items-center justify-between">
            <span>REGISTER FILE (64-BIT ARCHITECTURE)</span>
            <span>Click register to inspect</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {registers.map((reg, idx) => {
              const isSelected = idx === selectedRegIndex;
              let displayVal = '0x' + reg.value.toString(16).toUpperCase().padStart(8, '0');
              if (format === 'dec') displayVal = reg.value.toString(10);
              if (format === 'bin') displayVal = reg.value.toString(2).padStart(64, '0');

              return (
                <button
                  key={reg.name64}
                  onClick={() => setSelectedRegIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'border-cyber-sky bg-cyber-sky/15 shadow-md shadow-cyber-sky/10'
                      : 'border-surface-border bg-surface hover:bg-surface-elevated text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-100 text-xs">{reg.name64}</span>
                      <span className="text-[10px] text-slate-500">({reg.name32})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{reg.role}</div>
                  </div>
                  <div className="text-right min-w-0 max-w-[60%]">
                    <span className="font-mono text-xs font-bold text-cyber-sky break-all">{displayVal}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick modify buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Load Preset Value into {selectedReg.name64}:</span>
            <button
              onClick={() => handleSetRegValue(BigInt(0))}
              className="px-2 py-1 rounded bg-surface border border-surface-border text-xs text-slate-300 hover:text-slate-100"
            >
              0
            </button>
            <button
              onClick={() => handleSetRegValue(BigInt(42))}
              className="px-2 py-1 rounded bg-surface border border-surface-border text-xs text-slate-300 hover:text-slate-100"
            >
              42
            </button>
            <button
              onClick={() => handleSetRegValue(BigInt(0xFFFFFFFF))}
              className="px-2 py-1 rounded bg-surface border border-surface-border text-xs text-slate-300 hover:text-slate-100"
            >
              0xFFFFFFFF
            </button>
            <button
              onClick={() => handleSetRegValue(BigInt(0x7FFE4C001000))}
              className="px-2 py-1 rounded bg-surface border border-surface-border text-xs text-slate-300 hover:text-slate-100"
            >
              Stack Addr
            </button>
          </div>
        </div>

        {/* Selected Register Breakdown & Flags (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Sub-register hierarchy card */}
          <div className="p-4 rounded-xl border border-surface-border bg-surface font-mono space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <span className="text-xs font-bold text-slate-200">
                {selectedReg.name64} Bit Partitioning
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-sky/15 text-cyber-sky border border-cyber-sky/30">
                64-bit Architecture
              </span>
            </div>

            {/* Visual Nesting Graphic */}
            <div className="space-y-1.5 text-center text-xs">
              {/* 64-bit RAX */}
              <div className="p-1.5 rounded bg-cyber-sky/10 border border-cyber-sky/40 text-cyber-sky">
                <div className="font-bold">{selectedReg.name64} (Bits [63:0])</div>
                <div className="text-[10px] text-slate-400">Full 64-bit Quadword: {hexString}</div>
              </div>

              {/* 32-bit EAX */}
              <div className="p-1.5 rounded bg-cyber-amber/10 border border-cyber-amber/40 text-cyber-amber mx-3">
                <div className="font-bold">{selectedReg.name32} (Bits [31:0])</div>
                <div className="text-[10px] text-slate-400">
                  Doubleword: 0x{selectedReg.value.toString(16).slice(-8).toUpperCase().padStart(8, '0')}
                </div>
              </div>

              {/* 16-bit AX & 8-bit AL */}
              <div className="grid grid-cols-2 gap-2 mx-6">
                <div className="p-1 rounded bg-cyber-emerald/10 border border-cyber-emerald/40 text-cyber-emerald">
                  <div className="font-bold text-[11px]">{selectedReg.name16} [15:0]</div>
                  <div className="text-[9px] text-slate-400">Word</div>
                </div>
                <div className="p-1 rounded bg-pink-500/10 border border-pink-500/40 text-pink-400">
                  <div className="font-bold text-[11px]">{selectedReg.name8} [7:0]</div>
                  <div className="text-[9px] text-slate-400">Byte</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {selectedReg.standardUse}
            </p>
          </div>

          {/* ALU Status Flags & Conditional Branch Matrix */}
          <div className="p-4 rounded-xl border border-surface-border bg-surface font-mono space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <span className="text-xs font-bold text-slate-200">RFLAGS (Condition Codes)</span>
              <span className="text-[10px] text-slate-400">Click flag to toggle</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {Object.entries(flags).map(([flg, state]) => (
                <button
                  key={flg}
                  onClick={() => toggleFlag(flg as keyof typeof flags)}
                  className={`p-2 rounded-lg border text-center transition ${
                    state
                      ? 'bg-cyber-amber/20 border-cyber-amber text-cyber-amber font-bold shadow-sm'
                      : 'bg-surface-card border-surface-border text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="text-xs">{flg}</div>
                  <div className="text-sm font-bold">{state ? '1' : '0'}</div>
                </button>
              ))}
            </div>

            {/* How Branches Evaluate These Flags */}
            <div className="pt-2 text-[11px] text-slate-300 space-y-1 bg-surface-card p-2.5 rounded-lg border border-surface-border">
              <div className="font-bold text-slate-400">CONDITIONAL JUMP EVALUATION:</div>
              <div className="flex items-center justify-between">
                <span>JE / JZ (Jump if Equal / Zero):</span>
                <span className={flags.ZF ? 'text-cyber-emerald font-bold' : 'text-slate-500'}>
                  {flags.ZF ? 'TAKEN (ZF=1)' : 'NOT TAKEN (ZF=0)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>JNE / JNZ (Jump if Not Equal):</span>
                <span className={!flags.ZF ? 'text-cyber-emerald font-bold' : 'text-slate-500'}>
                  {!flags.ZF ? 'TAKEN (ZF=0)' : 'NOT TAKEN (ZF=1)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>JL (Jump if Less, Signed):</span>
                <span className={flags.SF !== flags.OF ? 'text-cyber-emerald font-bold' : 'text-slate-500'}>
                  {flags.SF !== flags.OF ? 'TAKEN (SF≠OF)' : 'NOT TAKEN (SF=OF)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

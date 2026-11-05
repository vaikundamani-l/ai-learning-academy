import React, { useState } from 'react';
import { Binary, ArrowRight, RefreshCw, Check, Shield, Layers } from 'lucide-react';
import { computeTwosComplement, performBitwiseOp } from '../../../utils/bitwise';

export const BitwiseVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'twos' | 'operations' | 'masking'>('twos');
  const [twosInput, setTwosInput] = useState<number>(42);
  const [bitWidth, setBitWidth] = useState<8 | 16>(8);

  // Bitwise Ops state
  const [opA, setOpA] = useState<number>(0b00111100); // 60
  const [opB, setOpB] = useState<number>(0b00001101); // 13
  const [selectedOp, setSelectedOp] = useState<'AND' | 'OR' | 'XOR' | 'SHL' | 'SHR' | 'NOT'>('AND');

  // Permission Mask State (Read=4, Write=2, Execute=1)
  const [permFlags, setPermFlags] = useState<{ read: boolean; write: boolean; execute: boolean }>({
    read: true,
    write: true,
    execute: false,
  });

  const twosResult = computeTwosComplement(twosInput, bitWidth);
  const bitwiseResult = performBitwiseOp(opA, opB, selectedOp, bitWidth);

  const currentPermOctal = (permFlags.read ? 4 : 0) | (permFlags.write ? 2 : 0) | (permFlags.execute ? 1 : 0);

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Binary className="w-4 h-4 text-cyber-sky" />
            <span>Interactive Binary, Two's Complement & Bitmasking Lab</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore step-by-step signed negation, carry ripples, bitwise operators, and real-world Linux permission masking.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-1 bg-surface border border-surface-border rounded-lg p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('twos')}
            className={`px-3 py-1 rounded transition ${
              activeTab === 'twos' ? 'bg-cyber-sky text-void font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Two's Complement
          </button>
          <button
            onClick={() => setActiveTab('operations')}
            className={`px-3 py-1 rounded transition ${
              activeTab === 'operations' ? 'bg-cyber-sky text-void font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Logic & Shifts
          </button>
          <button
            onClick={() => setActiveTab('masking')}
            className={`px-3 py-1 rounded transition ${
              activeTab === 'masking' ? 'bg-cyber-sky text-void font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Permission Bitmasks
          </button>
        </div>
      </div>

      {/* Tab 1: Two's Complement Step-by-Step Negation */}
      {activeTab === 'twos' && (
        <div className="space-y-4 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-surface-border">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-300">Enter Decimal Integer:</span>
              <input
                type="number"
                min={-128}
                max={127}
                value={twosInput}
                onChange={(e) => setTwosInput(parseInt(e.target.value) || 0)}
                aria-label="Two's complement integer input"
                className="w-24 px-3 py-1.5 rounded-lg bg-surface-elevated border border-surface-border text-xs font-bold text-cyber-sky focus:outline-none focus:border-cyber-sky"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Word Width:</span>
              <button
                onClick={() => setBitWidth(8)}
                className={`px-2.5 py-1 rounded transition ${
                  bitWidth === 8 ? 'bg-cyber-sky text-void font-bold' : 'bg-surface-elevated text-slate-400'
                }`}
              >
                8-Bit
              </button>
              <button
                onClick={() => setBitWidth(16)}
                className={`px-2.5 py-1 rounded transition ${
                  bitWidth === 16 ? 'bg-cyber-sky text-void font-bold' : 'bg-surface-elevated text-slate-400'
                }`}
              >
                16-Bit
              </button>
            </div>
          </div>

          {/* Three-step visual transformation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-2">
              <span className="text-xs font-bold text-slate-300">1. Original Integer</span>
              <div className="text-lg font-bold text-cyber-sky">{twosResult.originalDecimal}</div>
              <div className="text-xs text-slate-400">
                Binary: <span className="font-bold text-slate-200 tracking-wider">{twosResult.originalBinary}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-cyber-amber/40 bg-cyber-amber/10 space-y-2">
              <span className="text-xs font-bold text-cyber-amber">2. Invert All Bits (~X)</span>
              <div className="text-xs text-slate-300">One's Complement:</div>
              <div className="text-xs font-bold text-cyber-amber tracking-wider">{twosResult.invertedBinary}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-cyber-emerald/40 bg-cyber-emerald/10 space-y-2">
              <span className="text-xs font-bold text-cyber-emerald">3. Add 1 (~X + 1)</span>
              <div className="text-xs text-slate-300">Two's Complement Signed:</div>
              <div className="text-xs font-bold text-cyber-emerald tracking-wider">{twosResult.twosComplementBinary}</div>
              <div className="text-xs text-slate-200">
                Hex: <strong>{twosResult.hex}</strong> | Decimal: <strong>{twosResult.negatedDecimal}</strong>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface border border-surface-border text-xs text-slate-300 leading-relaxed">
            <strong className="text-slate-100">Why Two's Complement Won in Silicon: </strong>
            In one's complement or sign-magnitude, there were two separate representations for zero (<code className="text-cyber-amber">+0</code> and <code className="text-cyber-amber">-0</code>), requiring special comparator logic. In Two's Complement, there is exactly one zero (<code className="text-cyber-emerald">00000000</code>), and subtraction <code className="text-cyber-sky">A - B</code> is implemented electronically using the exact same adder circuit by computing <code className="text-cyber-sky">A + (~B + 1)</code>!
          </div>
        </div>
      )}

      {/* Tab 2: Logic & Shifts */}
      {activeTab === 'operations' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-2">
              <span className="text-slate-400 font-bold">Operand A:</span>
              <input
                type="number"
                min={0}
                max={255}
                value={opA}
                onChange={(e) => setOpA(Number(e.target.value))}
                className="w-full px-2.5 py-1 rounded bg-surface-elevated border border-surface-border text-cyber-sky font-bold"
              />
              <div className="text-[11px] text-slate-300">Binary: {opA.toString(2).padStart(8, '0')}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-2">
              <span className="text-slate-400 font-bold">Bitwise Operation:</span>
              <div className="grid grid-cols-3 gap-1">
                {(['AND', 'OR', 'XOR', 'NOT', 'SHL', 'SHR'] as const).map((operation) => (
                  <button
                    key={operation}
                    onClick={() => setSelectedOp(operation)}
                    className={`py-1 rounded font-bold transition ${
                      selectedOp === operation
                        ? 'bg-cyber-sky text-void font-bold shadow'
                        : 'bg-surface-elevated text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    {operation}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-2">
              <span className="text-slate-400 font-bold">Operand B / Shift Amount:</span>
              <input
                type="number"
                min={0}
                max={255}
                value={opB}
                onChange={(e) => setOpB(Number(e.target.value))}
                className="w-full px-2.5 py-1 rounded bg-surface-elevated border border-surface-border text-cyber-sky font-bold"
              />
              <div className="text-[11px] text-slate-300">Binary: {opB.toString(2).padStart(8, '0')}</div>
            </div>
          </div>

          {/* Result view */}
          <div className="p-4 rounded-xl bg-void border border-surface-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Bitwise Computation Result</span>
              <div className="text-base font-bold text-slate-100 mt-0.5">
                <span className="text-cyber-emerald">{bitwiseResult.result}</span>
                <span className="text-xs text-slate-400 ml-2">({bitwiseResult.hex})</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold">8-Bit Binary</span>
              <div className="text-base font-bold text-cyber-sky tracking-widest mt-0.5">
                {bitwiseResult.binary}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Permission Bitmasks (Linux chmod) */}
      {activeTab === 'masking' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3">
            <div className="text-slate-200 font-bold">
              Real-World Application: POSIX Permission Bitmasks (chmod)
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              Unix file permissions represent Read, Write, and Execute as individual bits in a single 3-bit octal number:
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <button
                onClick={() => setPermFlags((p) => ({ ...p, read: !p.read }))}
                className={`p-3 rounded-xl border transition ${
                  permFlags.read
                    ? 'bg-cyber-sky/20 border-cyber-sky text-cyber-sky font-bold shadow'
                    : 'bg-surface-card border-surface-border text-slate-500'
                }`}
              >
                <div>READ (r)</div>
                <div className="text-sm font-bold mt-1">Bit 2 = {permFlags.read ? '1' : '0'} (Value 4)</div>
              </button>

              <button
                onClick={() => setPermFlags((p) => ({ ...p, write: !p.write }))}
                className={`p-3 rounded-xl border transition ${
                  permFlags.write
                    ? 'bg-cyber-amber/20 border-cyber-amber text-cyber-amber font-bold shadow'
                    : 'bg-surface-card border-surface-border text-slate-500'
                }`}
              >
                <div>WRITE (w)</div>
                <div className="text-sm font-bold mt-1">Bit 1 = {permFlags.write ? '1' : '0'} (Value 2)</div>
              </button>

              <button
                onClick={() => setPermFlags((p) => ({ ...p, execute: !p.execute }))}
                className={`p-3 rounded-xl border transition ${
                  permFlags.execute
                    ? 'bg-cyber-emerald/20 border-cyber-emerald text-cyber-emerald font-bold shadow'
                    : 'bg-surface-card border-surface-border text-slate-500'
                }`}
              >
                <div>EXECUTE (x)</div>
                <div className="text-sm font-bold mt-1">Bit 0 = {permFlags.execute ? '1' : '0'} (Value 1)</div>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-void border border-surface-border flex items-center justify-between text-xs">
              <span className="text-slate-400">Combined Octal & String:</span>
              <span className="text-cyber-sky font-bold">
                Octal: {currentPermOctal} | Mode: {permFlags.read ? 'r' : '-'}{permFlags.write ? 'w' : '-'}{permFlags.execute ? 'x' : '-'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

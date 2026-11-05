import React, { useState } from 'react';
import { Binary, Calculator, RefreshCw, Zap, AlertTriangle, Check } from 'lucide-react';
import { floatToBits32, bits32ToFloat, decodeIeee754_32 } from '../../../utils/ieee754';

export const Ieee754Visualizer: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('12.375');
  const [bitString, setBitString] = useState<string>(() => floatToBits32(12.375));

  const decoded = decodeIeee754_32(bitString);

  // When user enters a decimal number
  const handleDecimalChange = (valStr: string) => {
    setInputValue(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num)) {
      setBitString(floatToBits32(num));
    } else if (valStr.toLowerCase() === 'nan') {
      setBitString('01111111110000000000000000000000');
    } else if (valStr.toLowerCase() === 'infinity' || valStr === '+infinity') {
      setBitString('01111111100000000000000000000000');
    } else if (valStr.toLowerCase() === '-infinity') {
      setBitString('11111111100000000000000000000000');
    }
  };

  // Toggle single bit
  const handleToggleBit = (index: number) => {
    const bitArr = bitString.split('');
    bitArr[index] = bitArr[index] === '0' ? '1' : '0';
    const newBits = bitArr.join('');
    setBitString(newBits);
    const newNum = bits32ToFloat(newBits);
    setInputValue(String(newNum));
  };

  // Quick presets
  const applyPreset = (presetNum: number | string) => {
    if (typeof presetNum === 'number') {
      setInputValue(String(presetNum));
      setBitString(floatToBits32(presetNum));
    } else if (presetNum === 'NaN') {
      setInputValue('NaN');
      setBitString('01111111110000000000000000000000');
    } else if (presetNum === 'Inf') {
      setInputValue('Infinity');
      setBitString('01111111100000000000000000000000');
    } else if (presetNum === '-Inf') {
      setInputValue('-Infinity');
      setBitString('11111111100000000000000000000000');
    } else if (presetNum === '-0') {
      setInputValue('-0');
      setBitString('10000000000000000000000000000000');
    }
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-5">
      {/* Visual Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-cyber-sky" />
            <span>Interactive IEEE-754 Single-Precision (FP32) Converter</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any bit below to toggle it and observe real-time exponent biasing, mantissa normalization, and float reconstruction.
          </p>
        </div>

        <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyber-sky/15 text-cyber-sky border border-cyber-sky/30">
          32-Bit Floating Point
        </span>
      </div>

      {/* Input & Preset Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 font-mono">
        <div className="md:col-span-5 p-4 rounded-xl bg-surface border border-surface-border space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            Decimal Float Input:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleDecimalChange(e.target.value)}
              aria-label="Decimal floating point value"
              className="flex-1 px-3 py-1.5 rounded-lg bg-surface-elevated border border-surface-border text-xs font-mono font-bold text-cyber-sky focus:outline-none focus:border-cyber-sky"
            />
            <button
              onClick={() => applyPreset(12.375)}
              className="p-2 rounded-lg bg-surface-elevated border border-surface-border text-slate-300 hover:text-slate-100"
              title="Reset to 12.375"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick presets strip */}
        <div className="md:col-span-7 p-4 rounded-xl bg-surface border border-surface-border space-y-2">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">
            Special & Canonical Presets:
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => applyPreset(1.0)}
              className="px-2 py-1 rounded bg-surface-card border border-surface-border text-slate-300 hover:text-cyber-sky"
            >
              1.0
            </button>
            <button
              onClick={() => applyPreset(-1.0)}
              className="px-2 py-1 rounded bg-surface-card border border-surface-border text-slate-300 hover:text-cyber-rose"
            >
              -1.0
            </button>
            <button
              onClick={() => applyPreset(0.1)}
              className="px-2 py-1 rounded bg-surface-card border border-surface-border text-slate-300 hover:text-cyber-amber"
            >
              0.1 (Inexact)
            </button>
            <button
              onClick={() => applyPreset(12.375)}
              className="px-2 py-1 rounded bg-surface-card border border-surface-border text-slate-300 hover:text-cyber-emerald"
            >
              12.375
            </button>
            <button
              onClick={() => applyPreset('-0')}
              className="px-2 py-1 rounded bg-surface-card border border-surface-border text-slate-300 hover:text-slate-100"
            >
              -0.0
            </button>
            <button
              onClick={() => applyPreset('Inf')}
              className="px-2 py-1 rounded bg-surface-card border border-surface-border text-slate-300 hover:text-cyber-sky"
            >
              +Inf
            </button>
            <button
              onClick={() => applyPreset('NaN')}
              className="px-2 py-1 rounded bg-surface-card border border-surface-border text-slate-300 hover:text-cyber-rose"
            >
              NaN
            </button>
          </div>
        </div>
      </div>

      {/* 32 Interactive Bit Blocks */}
      <div className="p-4 rounded-xl bg-void border border-surface-border space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>CLICK ANY BIT TO TOGGLE (MSB Bit 31 to LSB Bit 0):</span>
          <span>Hex: 0x{parseInt(bitString, 2).toString(16).toUpperCase().padStart(8, '0')}</span>
        </div>

        {/* Bit segments grid */}
        <div className="space-y-2">
          {/* Legend row */}
          <div className="grid grid-cols-32 gap-0.5 text-center text-[9px] text-slate-500 select-none hidden sm:grid">
            {Array.from({ length: 32 }, (_, i) => 31 - i).map((bitIdx) => (
              <span key={bitIdx}>{bitIdx}</span>
            ))}
          </div>

          {/* Interactive bits bar */}
          <div className="grid grid-cols-16 sm:grid-cols-32 gap-1 text-center font-bold text-xs select-none">
            {bitString.split('').map((bit, idx) => {
              const bitNum = 31 - idx;
              const isSign = idx === 0;
              const isExp = idx >= 1 && idx <= 8;
              const isMantissa = idx >= 9;

              return (
                <button
                  key={idx}
                  onClick={() => handleToggleBit(idx)}
                  className={`py-2 rounded transition transform hover:scale-105 ${
                    isSign
                      ? bit === '1'
                        ? 'bg-cyber-rose text-white shadow'
                        : 'bg-cyber-rose/20 text-rose-300 border border-cyber-rose/40'
                      : isExp
                      ? bit === '1'
                        ? 'bg-cyber-amber text-void shadow'
                        : 'bg-cyber-amber/20 text-amber-300 border border-cyber-amber/40'
                      : bit === '1'
                      ? 'bg-cyber-sky text-void shadow'
                      : 'bg-cyber-sky/20 text-sky-300 border border-cyber-sky/40'
                  }`}
                  title={`Bit ${bitNum} (${isSign ? 'Sign' : isExp ? 'Exponent' : 'Mantissa'}). Click to flip.`}
                >
                  {bit}
                </button>
              );
            })}
          </div>

          {/* Segment boundaries labels */}
          <div className="grid grid-cols-12 gap-2 text-[10px] text-center pt-1 font-bold">
            <div className="col-span-2 text-cyber-rose bg-cyber-rose/10 py-1 rounded border border-cyber-rose/30">
              SIGN (1-Bit)
            </div>
            <div className="col-span-4 text-cyber-amber bg-cyber-amber/10 py-1 rounded border border-cyber-amber/30">
              BIASED EXPONENT (8-Bits, Bias 127)
            </div>
            <div className="col-span-6 text-cyber-sky bg-cyber-sky/10 py-1 rounded border border-cyber-sky/30">
              MANTISSA / FRACTION (23-Bits, Implicit 1.)
            </div>
          </div>
        </div>
      </div>

      {/* Reconstruction Formula & Breakdown Card */}
      <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3 font-mono text-xs">
        <div className="text-slate-400 font-bold uppercase tracking-wider border-b border-surface-border pb-2 flex items-center justify-between">
          <span>Mathematical Reconstruction Breakdown</span>
          <span className="text-cyber-sky">Value: {decoded.calculatedValue}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border space-y-1">
            <span className="text-cyber-rose font-bold">1. Sign Component</span>
            <div className="text-slate-200">
              Bit = {decoded.sign} &rarr; (-1)<sup>{decoded.sign}</sup> = {decoded.sign === 1 ? -1 : 1} ({decoded.sign === 1 ? 'Negative' : 'Positive'})
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border space-y-1">
            <span className="text-cyber-amber font-bold">2. Exponent Component</span>
            <div className="text-slate-200">
              Raw = {decoded.exponentRaw} (0b{decoded.exponentBits})
            </div>
            <div className="text-slate-400 text-[11px]">
              Actual = {decoded.exponentRaw} - 127 = <strong>{decoded.exponentActual}</strong> (2<sup>{decoded.exponentActual}</sup>)
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border space-y-1">
            <span className="text-cyber-sky font-bold">3. Mantissa Component</span>
            <div className="text-slate-200">
              Fraction = +{decoded.mantissaValue.toFixed(6)}
            </div>
            <div className="text-slate-400 text-[11px]">
              Significand = 1 + Fraction = <strong>{(1 + decoded.mantissaValue).toFixed(6)}</strong>
            </div>
          </div>
        </div>

        {/* Decoded equation readout */}
        <div className="p-3 rounded-lg bg-void border border-surface-border flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400">Reconstruction Formula:</span>
          <span className="text-cyber-emerald font-bold tracking-wide">
            {decoded.formulaString} = {decoded.calculatedValue}
          </span>
        </div>

        {/* Notice for 0.1 Inexactness */}
        {inputValue === '0.1' && (
          <div className="p-3 rounded-lg bg-cyber-amber/10 border border-cyber-amber/30 text-amber-200 flex items-start space-x-2 text-xs">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyber-amber" />
            <div>
              <strong>Why 0.1 cannot be represented exactly in binary: </strong>
              Just as 1/3 produces a repeating decimal in base 10 (0.3333...), the fraction 1/10 produces an infinite repeating binary sequence in base 2 (<code className="text-slate-100">0.0001100110011...</code>). In FP32, it truncates after 23 mantissa bits, storing approximately <code className="text-slate-100">0.10000000149011612</code>. This fundamental truncation error explains why <code className="text-slate-100">0.1 + 0.2 === 0.3</code> evaluates to <code className="text-cyber-rose">false</code> in programming languages!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

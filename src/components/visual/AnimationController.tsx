import React from 'react';
import { Play, Pause, RotateCcw, StepForward, StepBack, FastForward, Clock } from 'lucide-react';

export interface AnimationControllerProps {
  unitLabel?: string;
  currentCycle: number;
  totalCycles: number;
  isPlaying: boolean;
  speed: number; // e.g. 0.5, 1.0, 2.0
  phaseLabel?: string;
  statusText?: string;
  onPlayToggle: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek?: (cycle: number) => void;
  canStepForward?: boolean;
  canStepBackward?: boolean;
}

export const AnimationController: React.FC<AnimationControllerProps> = ({
  unitLabel = 'Cycle',
  currentCycle,
  totalCycles,
  isPlaying,
  speed,
  phaseLabel,
  statusText,
  onPlayToggle,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onSeek,
  canStepForward = true,
  canStepBackward = true,
}) => {
  // Shortcuts belong to this focused controller, never to every demo on the page.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target !== e.currentTarget || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.code === 'Space') { e.preventDefault(); onPlayToggle(); }
    else if (e.code === 'ArrowRight' && canStepForward && currentCycle < totalCycles) { e.preventDefault(); onStepForward(); }
    else if (e.code === 'ArrowLeft' && canStepBackward && currentCycle > 0) { e.preventDefault(); onStepBackward(); }
  };

  const speedOptions = [0.5, 1.0, 2.0];

  return (
    <div tabIndex={0} role="group" aria-label="Animation controls. Space to play or pause; arrow keys to step." onKeyDown={handleKeyDown} className="rounded-xl border border-surface-border bg-surface-card p-4 space-y-3">
      {/* Top status bar: Phase, cycle count, and description */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded bg-surface border border-surface-border text-slate-200">
            <Clock className="w-3.5 h-3.5 text-cyber-sky" />
            <span>
              {unitLabel} <strong className="text-cyber-sky">{currentCycle}</strong> / {totalCycles}
            </span>
          </div>

          {phaseLabel && (
            <span className="px-2.5 py-1 rounded bg-cyber-amber/10 border border-cyber-amber/30 text-cyber-amber font-bold">
              {phaseLabel}
            </span>
          )}
        </div>

        {statusText && (
          <span className="text-slate-300 text-xs truncate max-w-md">
            {statusText}
          </span>
        )}
      </div>

      {/* Scrubber slider bar */}
      <div className="space-y-1">
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={totalCycles}
            value={currentCycle}
            onChange={(e) => onSeek && onSeek(Number(e.target.value))}
            disabled={!onSeek}
            aria-label={`${unitLabel} progress scrubber`}
            className="w-full h-1.5 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-cyber-sky focus:outline-none"
          />
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center space-x-1.5">
          {/* Reset */}
          <button
            onClick={onReset}
            className="min-h-11 min-w-11 p-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated transition"
            title={`Reset to ${unitLabel} 0`}
            aria-label="Reset animation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={!canStepBackward || currentCycle <= 0}
            className="min-h-11 min-w-11 p-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated disabled:opacity-40 transition"
            title="Step Backward (Left Arrow)"
            aria-label={`Step backward one ${unitLabel.toLowerCase()}`}
          >
            <StepBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={onPlayToggle}
            className={`min-h-11 px-4 py-2 rounded-lg font-mono font-bold text-xs flex items-center space-x-2 transition shadow-md ${
              isPlaying
                ? 'bg-cyber-amber text-void hover:bg-amber-400'
                : 'bg-cyber-sky text-void hover:bg-sky-400'
            }`}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={!canStepForward || currentCycle >= totalCycles}
            className="min-h-11 min-w-11 p-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated disabled:opacity-40 transition"
            title="Step Forward (Right Arrow)"
            aria-label={`Step forward one ${unitLabel.toLowerCase()}`}
          >
            <StepForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center space-x-1 bg-surface border border-surface-border rounded-lg p-1">
          <FastForward className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          {speedOptions.map((opt) => (
            <button
              key={opt}
              aria-pressed={speed === opt}
              onClick={() => onSpeedChange(opt)}
              className={`min-h-11 min-w-11 px-2 py-0.5 rounded text-[11px] font-mono transition ${
                speed === opt
                  ? 'bg-cyber-sky text-void font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

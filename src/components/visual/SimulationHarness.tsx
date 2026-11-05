import React, { useState } from 'react';
import { Terminal, Database, Sliders, Cpu, History, AlertCircle, RefreshCw } from 'lucide-react';

export interface RegisterEntry {
  name: string;
  value: number | string;
  prevValue?: number | string;
  bits?: string;
  description?: string;
}

export interface MemoryEntry {
  address: string;
  hex: string;
  decimal: number;
  label?: string;
  highlight?: boolean;
}

export interface LogEntry {
  cycle: number;
  timestamp: string;
  phase: string;
  message: string;
  level?: 'info' | 'warn' | 'success' | 'hazard';
}

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
}

export interface SimulationHarnessProps {
  title: string;
  subtitle?: string;
  statusBadge?: string;
  presets?: PresetScenario[];
  selectedPreset?: string;
  onSelectPreset?: (id: string) => void;
  onResetSimulation?: () => void;
  // Main visual viewport
  children: React.ReactNode;
  // Interactive control bar (e.g. AnimationController or custom action buttons)
  controller?: React.ReactNode;
  // State readouts
  registers?: RegisterEntry[];
  flags?: Record<string, boolean>;
  memory?: MemoryEntry[];
  logs?: LogEntry[];
  // Additional configuration / parameter controls
  extraControls?: React.ReactNode;
}

export const SimulationHarness: React.FC<SimulationHarnessProps> = ({
  title,
  subtitle,
  statusBadge = 'Active Simulation',
  presets = [],
  selectedPreset,
  onSelectPreset,
  onResetSimulation,
  children,
  controller,
  registers = [],
  flags = {},
  memory = [],
  logs = [],
  extraControls,
}) => {
  const [activeTab, setActiveTab] = useState<'registers' | 'memory' | 'logs'>('registers');

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-2xl">
      {/* Simulation Header */}
      <div className="px-5 py-4 border-b border-surface-border bg-surface flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-4 h-4 text-cyber-sky" />
            <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight">{title}</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyber-emerald/15 border border-cyber-emerald/30 text-cyber-emerald">
              {statusBadge}
            </span>
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {/* Presets and Global Reset */}
        <div className="flex items-center space-x-2">
          {presets.length > 0 && onSelectPreset && (
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-mono text-slate-400">Preset:</span>
              <select
                aria-label="Simulation scenario preset"
                value={selectedPreset}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="bg-surface-elevated border border-surface-border text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyber-sky"
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {onResetSimulation && (
            <button
              onClick={onResetSimulation}
              className="p-1.5 rounded-lg bg-surface-elevated border border-surface-border text-slate-300 hover:text-slate-100 hover:border-cyber-sky transition"
              title="Reset All Simulation State"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left is Visualization Canvas & Controls, Right is Hardware State Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-surface-border">
        {/* Visualizer & Controller Column */}
        <div className="lg:col-span-8 p-5 space-y-4 bg-void">
          {/* Main Visual Node Canvas */}
          <div className="min-h-[340px] flex items-center justify-center rounded-xl bg-surface/50 border border-surface-border/60 p-4 overflow-x-auto">
            {children}
          </div>

          {/* Interactive Controller Bar */}
          {controller && <div>{controller}</div>}

          {/* Extra Configuration Sliders / Custom controls */}
          {extraControls && (
            <div className="p-3.5 rounded-xl border border-surface-border bg-surface-elevated/40">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 mb-2">
                <Sliders className="w-3.5 h-3.5 text-cyber-sky" />
                <span>Simulation Parameters</span>
              </div>
              {extraControls}
            </div>
          )}
        </div>

        {/* Hardware State Inspector Column */}
        <div className="lg:col-span-4 bg-surface flex flex-col min-h-[460px]">
          {/* Inspector Tab Selector */}
          <div className="flex items-center border-b border-surface-border bg-surface-card px-2 pt-2">
            <button
              onClick={() => setActiveTab('registers')}
              className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition flex items-center space-x-1.5 ${
                activeTab === 'registers'
                  ? 'border-cyber-sky text-cyber-sky font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Registers ({registers.length})</span>
            </button>

            {memory.length > 0 && (
              <button
                onClick={() => setActiveTab('memory')}
                className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition flex items-center space-x-1.5 ${
                  activeTab === 'memory'
                    ? 'border-cyber-indigo text-cyber-indigo font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Memory</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition flex items-center space-x-1.5 ${
                activeTab === 'logs'
                  ? 'border-cyber-emerald text-cyber-emerald font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Events ({logs.length})</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[460px] space-y-3 font-mono">
            {/* Registers Tab */}
            {activeTab === 'registers' && (
              <div className="space-y-3">
                {/* Status Flags */}
                {Object.keys(flags).length > 0 && (
                  <div className="p-3 rounded-lg bg-surface-card border border-surface-border">
                    <div className="text-[11px] font-bold text-slate-400 mb-2">ALU STATUS FLAGS</div>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(flags).map(([flag, active]) => (
                        <div
                          key={flag}
                          className={`text-center py-1 rounded text-xs border ${
                            active
                              ? 'bg-cyber-amber/20 border-cyber-amber/50 text-cyber-amber font-bold animate-pulse'
                              : 'bg-surface border-surface-border text-slate-500'
                          }`}
                        >
                          <div className="text-[10px]">{flag}</div>
                          <div className="text-[11px]">{active ? '1' : '0'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Register List */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 px-1">REGISTER FILE</div>
                  {registers.map((reg) => {
                    const hasChanged = reg.prevValue !== undefined && reg.prevValue !== reg.value;
                    return (
                      <div
                        key={reg.name}
                        className={`p-2.5 rounded-lg border transition-all flex items-center justify-between text-xs ${
                          hasChanged
                            ? 'bg-cyber-amber/15 border-cyber-amber/60 shadow-md shadow-cyber-amber/10'
                            : 'bg-surface-card border-surface-border'
                        }`}
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-100">{reg.name}</span>
                            {reg.bits && <span className="text-[10px] text-slate-500">[{reg.bits}]</span>}
                          </div>
                          {reg.description && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                              {reg.description}
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-xs ${
                              hasChanged
                                ? 'bg-cyber-amber text-void'
                                : 'bg-surface text-cyber-sky border border-surface-border'
                            }`}
                          >
                            {typeof reg.value === 'number'
                              ? `0x${reg.value.toString(16).toUpperCase().padStart(2, '0')} (${reg.value})`
                              : String(reg.value)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Memory Tab */}
            {activeTab === 'memory' && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 px-1">PHYSICAL MEMORY DUMP</div>
                <div className="space-y-1">
                  {memory.map((mem) => (
                    <div
                      key={mem.address}
                      className={`p-2 rounded border flex items-center justify-between text-xs ${
                        mem.highlight
                          ? 'bg-cyber-indigo/20 border-cyber-indigo/60 text-indigo-200'
                          : 'bg-surface-card border-surface-border text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-cyber-sky font-bold">{mem.address}</span>
                        {mem.label && (
                          <span className="text-[10px] text-slate-400 px-1.5 py-0.2 bg-surface rounded">
                            {mem.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 text-[11px]">{mem.decimal}</span>
                        <span className="px-1.5 py-0.5 rounded bg-surface border border-surface-border text-slate-100 font-bold">
                          {mem.hex}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 px-1">EXECUTION EVENT STREAM</div>
                {logs.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">No events logged yet.</div>
                ) : (
                  logs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-surface-card border border-surface-border text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="text-cyber-sky">Cycle {log.cycle}</span>
                        <span className="uppercase text-cyber-amber">{log.phase}</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">{log.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

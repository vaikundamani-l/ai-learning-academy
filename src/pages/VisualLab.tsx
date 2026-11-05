import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Cpu, 
  Zap, 
  Database, 
  Terminal, 
  ArrowRight,
  Filter,
  CheckCircle,
  Eye
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';

// Interactive Stage 0 Visualizers
import { CpuArchitectureDiagram } from '../components/visual/cpu/CpuArchitectureDiagram';
import { InstructionCycleVisualizer } from '../components/visual/cpu/InstructionCycleVisualizer';
import { RegisterBankVisualizer } from '../components/visual/cpu/RegisterBankVisualizer';
import { AluSimulator } from '../components/visual/cpu/AluSimulator';
import { CacheHitMissSimulator } from '../components/visual/cpu/CacheHitMissSimulator';
import { PipelineHazardVisualizer } from '../components/visual/cpu/PipelineHazardVisualizer';
import { EducationalCpuSimulator } from '../components/visual/cpu/EducationalCpuSimulator';
import { ProcCpuInfoExplorer } from '../components/visual/cpu/ProcCpuInfoExplorer';

export const VisualLab: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [activeVisualId, setActiveVisualId] = useState<string | null>('cpu-arch');

  const readyVisuals = [
    {
      id: 'cpu-arch',
      title: 'Von Neumann CPU Architecture & Internal Buses',
      category: 'hardware',
      stageId: 0,
      description: 'Interactive SVG schematic with clickable components inspecting CU, ALU, registers, and bus widths.',
      component: <CpuArchitectureDiagram />
    },
    {
      id: 'instruction-cycle',
      title: '5-Stage Instruction Cycle (IF, ID, EX, MEM, WB)',
      category: 'hardware',
      stageId: 0,
      description: 'Step-by-step clock synchronized animation tracing instruction flow across CPU subsystems.',
      component: <InstructionCycleVisualizer />
    },
    {
      id: 'registers',
      title: 'x86-64 Register Bank & Condition Codes',
      category: 'hardware',
      stageId: 0,
      description: 'Explore 64-bit GPRs (RAX, RBX, RCX, RDX, RSP, RIP) and status flags (ZF, CF, SF, OF).',
      component: <RegisterBankVisualizer />
    },
    {
      id: 'alu-sim',
      title: '8-Bit Arithmetic Logic Unit (ALU) Circuit',
      category: 'hardware',
      stageId: 0,
      description: 'Simulate parallel full adders, bitwise Boolean gates, and flag computation in real-time.',
      component: <AluSimulator />
    },
    {
      id: 'cache-sim',
      title: '2-Way Set-Associative Cache Hit / Miss Simulator',
      category: 'hardware',
      stageId: 0,
      description: 'Understand Tag matching, Set indexing, LRU replacement, and spatial/temporal locality.',
      component: <CacheHitMissSimulator />
    },
    {
      id: 'pipeline-hazards',
      title: '5-Stage Pipeline Hazards & Hardware Forwarding',
      category: 'hardware',
      stageId: 0,
      description: 'Demonstrating Data Hazards (RAW), bubble stalls, hardware bypassing, and branch mispredictions.',
      component: <PipelineHazardVisualizer />
    },
    {
      id: 'cpu-simulator',
      title: 'Complete Educational CPU & Microcode Engine',
      category: 'hardware',
      stageId: 0,
      description: 'Serial 5-phase execution model with physical memory inspection and live execution event log.',
      component: <EducationalCpuSimulator />
    },
    {
      id: 'proc-cpuinfo',
      title: 'Linux CPU Investigation Workbench: /proc/cpuinfo & lscpu',
      category: 'hardware',
      stageId: 0,
      description: 'Interactive exploration of Linux virtual filesystem processor metrics and security feature flags.',
      component: <ProcCpuInfoExplorer />
    }
  ];

  const categories = [
    { id: 'all', label: 'All Visuals' },
    { id: 'hardware', label: 'Hardware & CPU' },
    { id: 'math', label: 'Math & Vectors' },
    { id: 'neural', label: 'Neural & DL' },
    { id: 'network', label: 'Network & Systems' },
    { id: 'security', label: 'Security & Attacks' },
  ];

  const plannedVisuals = CURRICULUM_STAGES.flatMap((s) => s.simulators).slice(1);

  const activeVisualItem = readyVisuals.find((v) => v.id === activeVisualId);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
          <Layers className="w-4 h-4" />
          <span>Visual Learning Laboratory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Interactive Architecture & Systems Visualizers
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
          High-definition schematics, step-by-step hardware animations, and interactive circuit diagrams built according to strict pedagogical visual standards.
        </p>
      </div>

      {/* Featured Interactive Visualizer Viewport */}
      {activeVisualItem && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-cyber-sky" />
              <span className="text-xs font-mono font-bold text-slate-200">
                Active Visualizer: {activeVisualItem.title}
              </span>
            </div>
            <Link
              to="/stage/0/lesson/cpu-architecture"
              className="text-xs font-mono text-cyber-sky hover:underline flex items-center space-x-1"
            >
              <span>View in Master Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>{activeVisualItem.component}</div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 flex-shrink-0" />
        {categories.map((c) => (
          <button
            key={c.id}
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex-shrink-0 ${
              filter === c.id
                ? 'bg-cyber-sky text-void font-bold shadow-md shadow-cyber-sky/20'
                : 'bg-surface-card border border-surface-border text-slate-400 hover:text-slate-200 hover:bg-surface-elevated'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Ready Stage 0 Visualizers Gallery */}
      {(filter === 'all' || filter === 'hardware') && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyber-emerald" />
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              Ready Stage 0 Visualizers ({readyVisuals.length} Active)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {readyVisuals.map((v) => {
              const isSelected = v.id === activeVisualId;
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveVisualId(v.id)}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-cyber-sky bg-cyber-sky/15 shadow-md shadow-cyber-sky/10'
                      : 'border-surface-border bg-surface-card hover:bg-surface-elevated text-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface border border-surface-border text-cyber-sky font-semibold">
                      STAGE 0 READY
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 font-mono mt-1.5 leading-snug">
                      {v.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {v.description}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-cyber-sky font-semibold flex items-center space-x-1 pt-1">
                    <span>{isSelected ? 'Active Above' : 'Inspect Visualizer'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Planned Curriculum Visualizers Gallery */}
      <div className="space-y-3 pt-4 border-t border-surface-border">
        <h3 className="text-sm font-bold text-slate-400 font-mono">
          Planned Curriculum Visualizers Roadmap
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plannedVisuals
            .filter((v) => filter === 'all' || v.category === filter)
            .map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-surface-card border border-surface-border hover:border-slate-500 transition space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-[10px] font-mono text-cyber-sky uppercase font-semibold">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Stage {item.stageId}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyber-sky transition">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-slate-500">Planned Simulator</span>
                  <Link
                    to={`/stage/${item.stageId}`}
                    className="flex items-center space-x-1 text-cyber-sky hover:text-sky-300 font-semibold transition"
                  >
                    <span>Stage outline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

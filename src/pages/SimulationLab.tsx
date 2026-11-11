import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Layers, 
  Zap, 
  Database, 
  Terminal, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';

// Interactive Stage 0 Simulators
import { EducationalCpuSimulator } from '../components/visual/cpu/EducationalCpuSimulator';
import { AluSimulator } from '../components/visual/cpu/AluSimulator';
import { CacheHitMissSimulator } from '../components/visual/cpu/CacheHitMissSimulator';
import { PipelineHazardVisualizer } from '../components/visual/cpu/PipelineHazardVisualizer';
import { RegisterBankVisualizer } from '../components/visual/cpu/RegisterBankVisualizer';
import { BitwiseVisualizer } from '../components/visual/memory/BitwiseVisualizer';
import { Ieee754Visualizer } from '../components/visual/memory/Ieee754Visualizer';
import { MemoryPyramidVisualizer } from '../components/visual/memory/MemoryPyramidVisualizer';
import { ProcessLifecycleSimulator } from '../components/visual/os/ProcessLifecycleSimulator';
import { VirtualMemoryVisualizer } from '../components/visual/os/VirtualMemoryVisualizer';
import { PosixPermissionsVisualizer } from '../components/visual/os/PosixPermissionsVisualizer';
import { GitDagVisualizer } from '../components/visual/tools/GitDagVisualizer';
import { ShellPipelineVisualizer } from '../components/visual/tools/ShellPipelineVisualizer';
import { EnvPathVisualizer } from '../components/visual/tools/EnvPathVisualizer';
import { PythonMemoryVisualizer } from '../components/visual/python/PythonMemoryVisualizer';

export const SimulationLab: React.FC = () => {
  const [activeSim, setActiveSim] = useState<'cpu' | 'alu' | 'cache' | 'pipeline' | 'registers' | 'bitwise' | 'ieee754' | 'memory-pyramid' | 'process' | 'mmu' | 'permissions' | 'git' | 'pipeline-sim' | 'path' | 'python-memory'>('cpu');

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
          <Cpu className="w-4 h-4" />
          <span>Interactive Simulation Laboratory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Hardware, Neural & Systems Simulators
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
          Interactive execution environments equipped with step-forward/backward clocks, live register views, parameter sliders, and state inspection.
        </p>
      </div>

      {/* Simulator Switcher Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        <button
          onClick={() => setActiveSim('cpu')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'cpu'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>CPU Microcode Engine</span>
        </button>

        <button
          onClick={() => setActiveSim('alu')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'alu'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>8-Bit ALU Circuit</span>
        </button>

        <button
          onClick={() => setActiveSim('cache')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'cache'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Cache Hit/Miss Simulator</span>
        </button>

        <button
          onClick={() => setActiveSim('pipeline')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'pipeline'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>5-Stage Pipeline Hazards</span>
        </button>

        <button
          onClick={() => setActiveSim('registers')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'registers'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>x86-64 Register Bank</span>
        </button>

        <button
          onClick={() => setActiveSim('bitwise')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'bitwise'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Two's Complement & Bitwise</span>
        </button>

        <button
          onClick={() => setActiveSim('ieee754')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'ieee754'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>IEEE-754 FP Converter</span>
        </button>

        <button
          onClick={() => setActiveSim('memory-pyramid')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'memory-pyramid'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Memory Hierarchy Pyramid</span>
        </button>

        <button
          onClick={() => setActiveSim('process')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'process'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Process Lifecycle & PCB</span>
        </button>

        <button
          onClick={() => setActiveSim('mmu')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'mmu'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Virtual Memory & MMU</span>
        </button>

        <button
          onClick={() => setActiveSim('permissions')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'permissions'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>POSIX Permissions & Inodes</span>
        </button>

        <button
          onClick={() => setActiveSim('git')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'git'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Git DAG & Object Explorer</span>
        </button>

        <button
          onClick={() => setActiveSim('pipeline-sim')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'pipeline-sim'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Shell Pipeline & dup2()</span>
        </button>

        <button
          onClick={() => setActiveSim('path')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'path'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>$PATH & FHS Resolution</span>
        </button>

        <button
          onClick={() => setActiveSim('python-memory')}
          className={`px-3.5 py-2 rounded-xl border transition flex items-center space-x-2 flex-shrink-0 ${
            activeSim === 'python-memory'
              ? 'bg-cyber-sky text-void font-bold border-cyber-sky shadow-lg shadow-cyber-sky/20'
              : 'bg-surface-card border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Python Reference Graph</span>
        </button>
      </div>

      {/* Active Featured Simulator Viewport */}
      <div>
        {activeSim === 'cpu' && <EducationalCpuSimulator />}
        {activeSim === 'alu' && <AluSimulator />}
        {activeSim === 'cache' && <CacheHitMissSimulator />}
        {activeSim === 'pipeline' && <PipelineHazardVisualizer />}
        {activeSim === 'registers' && <RegisterBankVisualizer />}
        {activeSim === 'bitwise' && <BitwiseVisualizer />}
        {activeSim === 'ieee754' && <Ieee754Visualizer />}
        {activeSim === 'memory-pyramid' && <MemoryPyramidVisualizer />}
        {activeSim === 'process' && <ProcessLifecycleSimulator />}
        {activeSim === 'mmu' && <VirtualMemoryVisualizer />}
        {activeSim === 'permissions' && <PosixPermissionsVisualizer />}
        {activeSim === 'git' && <GitDagVisualizer />}
        {activeSim === 'pipeline-sim' && <ShellPipelineVisualizer />}
        {activeSim === 'path' && <EnvPathVisualizer />}
        {activeSim === 'python-memory' && <PythonMemoryVisualizer />}
      </div>

      {/* Simulator Directory Catalog */}
      <div className="space-y-4 pt-4 border-t border-surface-border">
        <h3 className="text-lg font-bold text-slate-100">
          Curriculum Simulation Roadmap Catalog
        </h3>
        <p className="text-xs text-slate-400">
          Upcoming simulators scheduled for future curriculum stages:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM_STAGES.flatMap((s) => s.simulators)
            .slice(1)
            .map((sim) => (
              <div
                key={sim.id}
                className="p-5 rounded-xl bg-surface-card border border-surface-border hover:border-slate-500 transition space-y-3 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
                    <span className="uppercase text-cyber-sky font-semibold">{sim.category}</span>
                    <span>Stage {sim.stageId}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyber-sky transition">
                    {sim.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {sim.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-slate-500">Planned Simulator</span>
                  <Link
                    to={`/stage/${sim.stageId}`}
                    className="text-cyber-sky hover:underline flex items-center space-x-1"
                  >
                    <span>Stage outline</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

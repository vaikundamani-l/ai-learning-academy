import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Cpu, 
  Maximize2, 
  Network, 
  Shield, 
  HardDrive, 
  GitCommit, 
  Eye, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';

export const VisualLab: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  // Collect all visualizers and simulators from the curriculum
  const allVisuals = CURRICULUM_STAGES.flatMap(s => s.simulators);

  const categories = [
    { id: 'all', label: 'All Visuals' },
    { id: 'hardware', label: 'Hardware & CPU' },
    { id: 'math', label: 'Math & Vectors' },
    { id: 'neural', label: 'Neural & DL' },
    { id: 'network', label: 'Network & Systems' },
    { id: 'security', label: 'Security & Attacks' },
  ];

  const filtered = filter === 'all' 
    ? allVisuals 
    : allVisuals.filter(v => v.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
          <Layers className="w-4 h-4" />
          <span>Visual Learning Laboratory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Interactive Architecture & Systems Visualizers
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
          High-definition vector schematics, hardware timing diagrams, neural network forward/backpropagation flows, and cryptographic protocols.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 flex-shrink-0" />
        {categories.map((c) => (
          <button
            key={c.id}
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

      {/* Visualizers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-surface-card border border-surface-border hover:border-slate-500 transition space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-[10px] font-mono text-cyber-sky uppercase font-semibold">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Stage {item.stageId}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-100 group-hover:text-cyber-sky transition">
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-slate-500">Step Controls Enabled</span>
              <Link
                to={item.path}
                className="flex items-center space-x-1 text-cyber-sky hover:text-sky-300 font-semibold transition"
              >
                <span>Launch Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

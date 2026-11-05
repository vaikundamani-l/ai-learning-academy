import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  BookOpen, 
  Sparkles,
  GitFork,
  LayoutGrid,
  Compass
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';
import { useProgress } from '../context/ProgressContext';
import { InteractiveRoadmapView } from '../components/roadmap/InteractiveRoadmapView';

export const CurriculumBrowser: React.FC = () => {
  const [viewMode, setViewMode] = useState<'roadmap' | 'grid'>('roadmap');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { progress } = useProgress();

  const categories = [
    'All',
    'Computing',
    'Mathematics',
    'Machine Learning',
    'Language Models',
    'Systems',
    'Cybersecurity',
    'AI Security',
    'Research'
  ];

  const filteredStages = CURRICULUM_STAGES.filter((stage) => {
    const matchesSearch = 
      stage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.originalTopics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      stage.buildFromScratch.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || stage.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header with View Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
            <BookOpen className="w-4 h-4" />
            <span>Interactive Curriculum Navigator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            The 31-Stage Master Roadmap
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Preserving all 31 stages from computing foundations to advanced AI security and capstones. Visualized in an interactive step-by-step roadmap flow.
          </p>
        </div>

        {/* View Mode Toggle Bar (Visual Roadmap vs Grid) */}
        <div className="flex items-center space-x-2 bg-surface-card p-1.5 rounded-xl border border-surface-border self-start lg:self-auto">
          <button
            onClick={() => setViewMode('roadmap')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono transition ${
              viewMode === 'roadmap'
                ? 'bg-cyber-sky text-void font-bold shadow-md shadow-cyber-sky/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Visual Roadmap (roadmap.sh style)</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono transition ${
              viewMode === 'grid'
                ? 'bg-cyber-sky text-void font-bold shadow-md shadow-cyber-sky/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Directory Grid</span>
          </button>
        </div>
      </div>

      {/* Conditionally Render either Roadmap Flow or Grid View */}
      {viewMode === 'roadmap' ? (
        <InteractiveRoadmapView />
      ) : (
        <div className="space-y-6">
          {/* Search and Category Filters for Grid View */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search topics, algorithms, scratch builds..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-card border border-surface-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyber-sky transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Categories Bar */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex-shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-cyber-sky text-void font-bold shadow-md shadow-cyber-sky/20'
                      : 'bg-surface-card border border-surface-border text-slate-400 hover:text-slate-200 hover:bg-surface-elevated'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStages.map((stage) => {
              const isCompleted = progress.completedStages.includes(stage.id);
              const isStarted = progress.startedStages.includes(stage.id);

              return (
                <div
                  key={stage.id}
                  className={`p-5 rounded-xl bg-surface-card border transition flex flex-col justify-between space-y-4 hover:border-slate-500 group relative ${
                    isCompleted
                      ? 'border-cyber-emerald/40 bg-surface-card/90'
                      : isStarted
                      ? 'border-cyber-sky/40'
                      : 'border-surface-border'
                  }`}
                >
                  {/* Card Top */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-cyber-sky text-[11px] font-mono font-bold">
                          STAGE {stage.id}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          Part {stage.part}
                        </span>
                      </div>

                      {isCompleted ? (
                        <span className="flex items-center space-x-1 text-[11px] font-mono text-cyber-emerald">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mastered</span>
                        </span>
                      ) : isStarted ? (
                        <span className="text-[11px] font-mono text-cyber-sky">In Progress</span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500">Not Started</span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyber-sky transition">
                      {stage.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {stage.shortDescription}
                    </p>

                    {/* Pilot Lesson Highlight for Stage 0 */}
                    {stage.id === 0 && (
                      <div className="px-2.5 py-1.5 rounded bg-cyber-sky/10 border border-cyber-sky/30 text-[11px] font-mono text-cyber-sky flex items-center space-x-1.5">
                        <Sparkles className="w-3 h-3 flex-shrink-0" />
                        <span>Includes Stage 0 CPU Pilot Lesson</span>
                      </div>
                    )}

                    {/* Build from scratch preview */}
                    <div className="pt-2">
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                        Build From Scratch ({stage.buildFromScratch.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {stage.buildFromScratch.slice(0, 2).map((build, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border text-slate-300 truncate max-w-[220px]"
                          >
                            {build}
                          </span>
                        ))}
                        {stage.buildFromScratch.length > 2 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-surface-border text-slate-500">
                            +{stage.buildFromScratch.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Prerequisites & Link */}
                  <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs font-mono">
                    <div className="text-[10px] text-slate-500">
                      {stage.prerequisites.length > 0 ? (
                        <span>Prereq: {stage.prerequisites.map(p => `S${p}`).join(', ')}</span>
                      ) : (
                        <span className="text-cyber-emerald">Entry Point</span>
                      )}
                    </div>

                    <Link
                      to={`/stage/${stage.id}`}
                      className="flex items-center space-x-1 text-cyber-sky hover:text-sky-300 font-semibold transition"
                    >
                      <span>Open Stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStages.length === 0 && (
            <div className="text-center py-16 bg-surface-card rounded-xl border border-surface-border text-slate-400 space-y-2">
              <p className="text-sm">No curriculum stages match your search query: <span className="text-slate-200">"{searchTerm}"</span></p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="text-xs font-mono text-cyber-sky hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

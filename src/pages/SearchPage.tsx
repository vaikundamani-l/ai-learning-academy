import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Terminal, 
  Cpu, 
  ArrowRight, 
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'topics' | 'builds' | 'simulators'>('all');

  const results = React.useMemo(() => {
    if (!query.trim()) return [];

    const q = query.trim().toLowerCase();
    const items: {
      type: 'topic' | 'build' | 'simulator' | 'stage';
      stageId: number;
      stageTitle: string;
      title: string;
      description?: string;
      url: string;
    }[] = [];

    CURRICULUM_STAGES.forEach(stage => {
      // Check stage title/description
      if (stage.title.toLowerCase().includes(q) || stage.shortDescription.toLowerCase().includes(q)) {
        items.push({
          type: 'stage',
          stageId: stage.id,
          stageTitle: stage.title,
          title: `Stage ${stage.id}: ${stage.title}`,
          description: stage.shortDescription,
          url: `/stage/${stage.id}`
        });
      }

      // Check original & expanded topics
      [...stage.originalTopics, ...stage.expandedSubtopics].forEach(topic => {
        if (topic.toLowerCase().includes(q)) {
          items.push({
            type: 'topic',
            stageId: stage.id,
            stageTitle: stage.title,
            title: topic,
            url: `/stage/${stage.id}`
          });
        }
      });

      // Check build from scratch
      stage.buildFromScratch.forEach(build => {
        if (build.toLowerCase().includes(q)) {
          items.push({
            type: 'build',
            stageId: stage.id,
            stageTitle: stage.title,
            title: build,
            description: `Required scratch build in Stage ${stage.id}`,
            url: `/stage/${stage.id}`
          });
        }
      });

      // Check simulators
      stage.simulators.forEach(sim => {
        if (sim.title.toLowerCase().includes(q) || sim.description.toLowerCase().includes(q)) {
          items.push({
            type: 'simulator',
            stageId: stage.id,
            stageTitle: stage.title,
            title: sim.title,
            description: sim.description,
            url: sim.path
          });
        }
      });
    });

    if (filterType === 'all') return items;
    if (filterType === 'topics') return items.filter(x => x.type === 'topic' || x.type === 'stage');
    if (filterType === 'builds') return items.filter(x => x.type === 'build');
    if (filterType === 'simulators') return items.filter(x => x.type === 'simulator');
    return items;
  }, [query, filterType]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
          <Search className="w-4 h-4" />
          <span>Omni Search</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Search Academy Knowledge Base
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
          Search stage descriptions, original topics, supporting topics, planned builds, and simulator titles.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-sky" />
          <input
            type="search"
            aria-label="Search curriculum"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a concept (e.g. CPU, KV-cache, LoRA, Attention, Diffie-Hellman, B-Tree, IoU)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-card border border-surface-border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyber-sky shadow-lg transition"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-500">Filter:</span>
          {(['all', 'topics', 'builds', 'simulators'] as const).map((t) => (
            <button
              key={t}
              aria-pressed={filterType === t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-md capitalize transition ${
                filterType === t
                  ? 'bg-cyber-sky/20 text-cyber-sky font-bold border border-cyber-sky/40'
                  : 'bg-surface text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {!query.trim() && <div className="rounded-xl border border-surface-border bg-surface-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">Explore a concept</h2>
        <p className="text-sm text-slate-400">Start with a topic below, or search the curriculum above.</p>
        <div className="flex flex-wrap gap-2">{['CPU', 'Python', 'Attention', 'Cryptography'].map(term =>
          <button key={term} onClick={() => setQuery(term)} className="rounded-lg border border-surface-border px-3 py-2 text-sm text-cyber-sky hover:bg-surface">{term}</button>
        )}</div>
      </div>}
      {/* Results List */}
      <div className="space-y-3">
        {query && (
          <div role="status" className="text-xs font-mono text-slate-400">
            Found {results.length} results matching "{query}"
          </div>
        )}

        <div className="space-y-2">
          {results.map((res, i) => (
            <Link
              key={i}
              to={res.url}
              className="p-4 rounded-xl bg-surface-card hover:bg-surface-elevated border border-surface-border hover:border-cyber-sky/50 transition flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-[10px] font-mono">
                  <span className={`px-2 py-0.5 rounded font-semibold ${
                    res.type === 'simulator' ? 'bg-cyber-sky/20 text-cyber-sky' :
                    res.type === 'build' ? 'bg-cyber-emerald/20 text-cyber-emerald' :
                    'bg-surface text-slate-400'
                  }`}>
                    {res.type.toUpperCase()}
                  </span>
                  <span className="text-slate-500">Stage {res.stageId}: {res.stageTitle}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyber-sky transition">
                  {res.title}
                </h4>
                {res.description && (
                  <p className="text-xs text-slate-400 line-clamp-1">{res.description}</p>
                )}
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyber-sky flex-shrink-0 ml-4 transition" />
            </Link>
          ))}
        </div>

        {query && results.length === 0 && (
          <div className="p-12 text-center bg-surface-card rounded-xl border border-surface-border text-slate-400 text-xs">
            No results found for "{query}". Try terms like "CPU", "Attention", "Cache", "SQL", or "Quantization".
          </div>
        )}
      </div>
    </div>
  );
};

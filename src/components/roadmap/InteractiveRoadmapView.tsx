import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Layers, 
  Shield, 
  Award, 
  BookOpen, 
  X, 
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  Check,
  Compass
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../../data/curriculumData';
import { useProgress } from '../../context/ProgressContext';
import { useFocusScope } from '../../hooks/useFocusScope';
import { Stage } from '../../types/curriculum';

interface RoadmapViewProps {
  onSelectStage?: (stageId: number) => void;
}

export const InteractiveRoadmapView: React.FC<RoadmapViewProps> = () => {
  const { progress, markStageCompleted, markStageStarted } = useProgress();
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [trackFilter, setTrackFilter] = useState<'all' | 'ai' | 'cyber' | 'systems'>('all');
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  const closeDrawer = useCallback(() => setSelectedStage(null), []);
  useFocusScope(!!selectedStage, '#stage-drawer', closeDrawer);

  const toggleTopicCheck = (topicKey: string) => {
    setCompletedTopics(prev => ({ ...prev, [topicKey]: !prev[topicKey] }));
  };

  // Group stages into chronological milestone blocks like roadmap.sh
  const roadmapSections = [
    {
      id: 'part-1',
      partNum: 1,
      title: 'Phase 1: Computing & Software Foundations',
      description: 'The bedrock of all systems: hardware architecture, OS primitives, memory, and programming.',
      badge: 'Core Prerequisite',
      color: 'border-cyber-sky/50 text-cyber-sky bg-cyber-sky/10',
      stageIds: [0, 1, 2, 3]
    },
    {
      id: 'part-2',
      partNum: 2,
      title: 'Phase 2: Mathematics & Analytical Data',
      description: 'Linear algebra, numerical optimization, probability, and reproducible data pipelines.',
      badge: 'Analytical Engine',
      color: 'border-cyber-amber/50 text-cyber-amber bg-cyber-amber/10',
      stageIds: [4, 5]
    },
    {
      id: 'part-3',
      partNum: 3,
      title: 'Phase 3: Machine Learning & Deep Learning Core',
      description: 'Classical models, search algorithms, automatic differentiation, computer vision, and transformers.',
      badge: 'AI Foundations',
      color: 'border-cyber-emerald/50 text-cyber-emerald bg-cyber-emerald/10',
      stageIds: [6, 7, 8, 9, 10, 11]
    },
    {
      id: 'part-4',
      partNum: 4,
      title: 'Phase 4: Language Models, RAG & Autonomous Agents',
      description: 'Pretraining, KV-cache inference, fine-tuning (LoRA), hybrid RAG search, and agentic workflows.',
      badge: 'Modern Frontier',
      color: 'border-cyber-indigo/50 text-cyber-indigo bg-cyber-indigo/10',
      stageIds: [12, 13, 14, 15, 16, 17, 18]
    },
    {
      id: 'part-5',
      partNum: 5,
      title: 'Phase 5: Reliable AI Systems & Performance Engineering',
      description: 'MLOps serving pipelines, continuous batching, quantization (INT8/4), and distributed parallelism.',
      badge: 'Production Scale',
      color: 'border-cyber-purple/50 text-cyber-purple bg-cyber-purple/10',
      stageIds: [19, 20]
    },
    {
      id: 'part-6',
      partNum: 6,
      title: 'Phase 6: Cybersecurity & Applied Systems Defense',
      description: 'Cryptography, web & API vulnerabilities, cloud IAM security, SIEM detection, and reverse engineering.',
      badge: 'Security Core',
      color: 'border-cyber-rose/50 text-cyber-rose bg-cyber-rose/10',
      stageIds: [21, 22, 23, 24, 25]
    },
    {
      id: 'part-7',
      partNum: 7,
      title: 'Phase 7: Adversarial AI Security & AI for Cyber Defense',
      description: 'Evasion attacks, model poisoning, indirect prompt injection, RAG defenses, and SOC alert triage.',
      badge: 'AI Defense',
      color: 'border-cyber-sky/50 text-cyber-sky bg-cyber-sky/10',
      stageIds: [26, 27, 28]
    },
    {
      id: 'part-8',
      partNum: 8,
      title: 'Phase 8: Research Methodology & Master Capstones',
      description: 'Empirical research, ablation experiments, and the 4 integrated end-to-end master capstone systems.',
      badge: 'Terminal Mastery',
      color: 'border-cyber-amber/50 text-cyber-amber bg-cyber-amber/10',
      stageIds: [29, 30]
    }
  ];

  // Filter sections by track
  const filteredSections = roadmapSections.filter(sec => {
    if (trackFilter === 'all') return true;
    if (trackFilter === 'ai') return [1, 2, 3, 4, 5, 8].includes(sec.partNum);
    if (trackFilter === 'cyber') return [1, 6, 7, 8].includes(sec.partNum);
    if (trackFilter === 'systems') return [1, 5, 6, 8].includes(sec.partNum);
    return true;
  });

  return (
    <div className="space-y-8 relative">
      {/* Roadmap Navigation & Filter Bar (Inspired by roadmap.sh header) */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
            <Compass className="w-4 h-4" />
            <span>Interactive Roadmap Navigation</span>
          </div>
          <div className="text-sm font-bold text-slate-100 mt-0.5">
            Step-by-Step Learning Progression Path
          </div>
        </div>

        {/* Track Filter Pills */}
        <div className="w-full sm:w-auto max-w-full min-w-0 flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono text-slate-500 mr-1 flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>Track:</span>
          </span>
          {[
            { id: 'all', label: 'Complete 31 Stages' },
            { id: 'ai', label: 'AI & LLM Track' },
            { id: 'cyber', label: 'Cybersecurity Track' },
            { id: 'systems', label: 'Systems & MLOps Track' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTrackFilter(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex-shrink-0 ${
                trackFilter === t.id
                  ? 'bg-cyber-sky text-void font-bold shadow-md shadow-cyber-sky/20'
                  : 'bg-surface border border-surface-border text-slate-400 hover:text-slate-200 hover:bg-surface-elevated'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap.sh Visual Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 py-1 border-y border-surface-border/40">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-cyber-emerald border border-cyber-emerald/50"></span>
          <span>Mastered Stage</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-cyber-sky border border-cyber-sky/50 animate-pulse"></span>
          <span>In Progress</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-surface-card border border-surface-border"></span>
          <span>Pending / Available</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyber-sky" />
          <span>Interactive Simulator Built</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyber-emerald" />
          <span>Build from Scratch Portfolio</span>
        </div>
      </div>

      {/* The Roadmap Flowchart Canvas */}
      <div className="space-y-12 max-w-4xl mx-auto py-4 relative">
        {/* Central connecting spine line */}
        <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-cyber-sky/40 via-cyber-indigo/30 to-cyber-amber/40 hidden md:block pointer-events-none"></div>

        {filteredSections.map((sec, secIndex) => (
          <div key={sec.id} className="space-y-6 relative z-10">
            {/* Phase Milestone Marker (roadmap.sh category banner) */}
            <div className="flex items-center justify-center">
              <div className="px-5 py-2 rounded-full bg-surface border border-surface-border text-center shadow-lg backdrop-blur-md flex items-center space-x-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${sec.color}`}>
                  {sec.badge}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-200 font-mono">
                  {sec.title}
                </span>
              </div>
            </div>

            {/* Stage Nodes in this Section */}
            <div className="space-y-4">
              {sec.stageIds.map((stageId, nodeIndex) => {
                const stage = CURRICULUM_STAGES[stageId];
                if (!stage) return null;

                const isDone = progress.completedStages.includes(stageId);
                const isStarted = progress.startedStages.includes(stageId);
                const hasPilot = stageId === 0;

                // Alternate left/right cards on desktop like roadmap.sh
                const isEven = nodeIndex % 2 === 0;

                return (
                  <div
                    key={stageId}
                    className={`flex flex-col md:flex-row items-center gap-4 ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Node Card */}
                    <div className="w-full md:w-[48%]">
                      <div
                        role="button" tabIndex={0} aria-label={`Inspect Stage ${stage.id}: ${stage.title}`}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedStage(stage); } }}
                        onClick={() => setSelectedStage(stage)}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer group hover:scale-[1.01] relative overflow-hidden ${
                          isDone
                            ? 'bg-surface-card border-cyber-emerald/60 shadow-lg shadow-cyber-emerald/5'
                            : isStarted
                            ? 'bg-surface-card border-cyber-sky shadow-lg shadow-cyber-sky/10'
                            : 'bg-surface-card border-surface-border hover:border-slate-500'
                        }`}
                      >
                        {/* Top Indicator */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border ${
                              isDone
                                ? 'bg-cyber-emerald/20 text-cyber-emerald border-cyber-emerald/40'
                                : isStarted
                                ? 'bg-cyber-sky/20 text-cyber-sky border-cyber-sky/40'
                                : 'bg-surface text-slate-400 border-surface-border'
                            }`}>
                              STAGE {stage.id}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {stage.category}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            {hasPilot && (
                              <span className="flex items-center space-x-1 text-[10px] font-mono text-cyber-sky bg-cyber-sky/10 px-2 py-0.5 rounded border border-cyber-sky/30">
                                <Sparkles className="w-3 h-3" />
                                <span className="hidden sm:inline">Pilot Lesson</span>
                              </span>
                            )}
                            {isDone ? (
                              <span className="flex items-center space-x-1 text-cyber-emerald text-xs font-mono font-semibold">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Mastered</span>
                              </span>
                            ) : isStarted ? (
                              <span className="text-cyber-sky text-xs font-mono">In Progress</span>
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-bold text-slate-100 group-hover:text-cyber-sky transition">
                          {stage.title}
                        </h4>

                        {/* Short Description */}
                        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {stage.shortDescription}
                        </p>

                        {/* Subtopics preview pills (roadmap.sh hallmark style) */}
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-surface-border/50">
                          {stage.originalTopics.slice(0, 3).map((topic, ti) => (
                            <span
                              key={ti}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border text-slate-300 truncate max-w-[190px]"
                            >
                              {topic.split(',')[0]}
                            </span>
                          ))}
                          {stage.originalTopics.length > 3 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-surface-border text-slate-500">
                              +{stage.originalTopics.length - 3} topics
                            </span>
                          )}
                        </div>

                        {/* Footer Badges */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-3 pt-2">
                          <span className="flex items-center space-x-1 text-cyber-emerald">
                            <Terminal className="w-3 h-3" />
                            <span>{stage.buildFromScratch.length} scratch build{stage.buildFromScratch.length > 1 ? 's' : ''}</span>
                          </span>

                          <span className="text-cyber-sky group-hover:underline flex items-center space-x-1">
                            <span>Inspect Stage</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Central Node Indicator on Spine */}
                    <div className="hidden md:flex items-center justify-center w-[4%]">
                      <div
                        role="button" tabIndex={0} aria-label={`Inspect Stage ${stage.id}: ${stage.title}`}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedStage(stage); } }}
                        onClick={() => setSelectedStage(stage)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-mono text-[11px] font-bold cursor-pointer transition transform hover:scale-125 z-20 ${
                          isDone
                            ? 'bg-cyber-emerald border-cyber-emerald text-void'
                            : isStarted
                            ? 'bg-void border-cyber-sky text-cyber-sky ring-4 ring-cyber-sky/20'
                            : 'bg-void border-surface-border text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {stage.id}
                      </div>
                    </div>

                    {/* Spacer for opposite column */}
                    <div className="hidden md:block w-[48%]"></div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Detail Drawer Modal (Opens when clicking any node) */}
      {selectedStage && (
        <div onClick={closeDrawer} className="fixed inset-0 z-50 flex items-center justify-end bg-void/80 backdrop-blur-sm animate-fade-in">
          <div
            id="stage-drawer" role="dialog" aria-modal="true" aria-label={`${selectedStage.title} overview`} tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl h-full bg-surface border-l border-surface-border p-6 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-4">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-cyber-sky/20 text-cyber-sky border border-cyber-sky/40 text-xs font-mono font-bold">
                    STAGE {selectedStage.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedStage.partTitle}
                  </span>
                </div>

                <button
                  aria-label="Close stage overview"
                  onClick={closeDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-elevated transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-100">
                  {selectedStage.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedStage.shortDescription}
                </p>
              </div>

              {/* Pilot Highlight Banner if Stage 0 */}
              {selectedStage.id === 0 && (
                <div className="p-3.5 rounded-xl bg-cyber-sky/10 border border-cyber-sky/30 space-y-1.5">
                  <div className="flex items-center space-x-2 text-cyber-sky text-xs font-mono font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>CPU Pilot • In development</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Preview the CPU lesson outline. The complete lesson and eight visualizations are planned for a later phase.
                  </p>
                </div>
              )}

              {/* Topics Checklist (roadmap.sh interactive checklist feature) */}
              <div className="space-y-2">
                <p className="text-xs text-slate-400">Personal checklist for this visit. These checks do not verify mastery or save learning progress.</p>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Session review checklist ({selectedStage.originalTopics.length})
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedStage.originalTopics.map((topic, idx) => {
                    const key = `${selectedStage.id}-topic-${idx}`;
                    const isChecked = !!completedTopics[key];
                    return (
                      <div
                        key={idx}
                        role="checkbox" aria-checked={isChecked} tabIndex={0}
                        onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleTopicCheck(key); } }}
                        onClick={() => toggleTopicCheck(key)}
                        className={`p-2.5 rounded-lg border text-xs transition cursor-pointer flex items-start space-x-2.5 ${
                          isChecked
                            ? 'bg-cyber-emerald/15 border-cyber-emerald/40 text-slate-200'
                            : 'bg-surface-card border-surface-border text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                          isChecked ? 'bg-cyber-emerald border-cyber-emerald text-void' : 'border-slate-500'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`leading-relaxed font-sans ${isChecked ? 'line-through text-slate-400' : ''}`}>
                          {topic}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Build From Scratch Portfolio Requirements */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-cyber-emerald uppercase tracking-wider font-semibold flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Build From Scratch Requirements ({selectedStage.buildFromScratch.length})</span>
                </div>
                <div className="space-y-1.5">
                  {selectedStage.buildFromScratch.map((build, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-surface-card border border-surface-border text-xs font-mono text-slate-300 flex items-center space-x-2"
                    >
                      <span className="text-cyber-emerald font-bold">•</span>
                      <span>{build}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage Project Brief */}
              <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1 text-xs">
                <div className="text-cyber-amber font-mono font-bold uppercase text-[10px]">
                  Milestone Project: {selectedStage.projectTitle}
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {selectedStage.projectDescription}
                </p>
              </div>

              {/* Official Mastery Check */}
              <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1 text-xs">
                <div className="text-cyber-sky font-mono font-bold uppercase text-[10px]">
                  Official Mastery Verification:
                </div>
                <p className="text-slate-300 italic font-sans">
                  "{selectedStage.masteryCheck}"
                </p>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row gap-3">
              {selectedStage.id === 0 ? (
                <Link
                  to="/stage/0/lesson/cpu-architecture"
                  className="flex-1 py-2.5 rounded-xl bg-cyber-sky text-void font-bold text-xs font-mono text-center hover:bg-sky-400 transition flex items-center justify-center space-x-2 shadow-lg shadow-cyber-sky/20"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Open CPU Pilot Lesson</span>
                </Link>
              ) : (
                <Link
                  to={`/stage/${selectedStage.id}`}
                  onClick={() => markStageStarted(selectedStage.id)}
                  className="flex-1 py-2.5 rounded-xl bg-cyber-sky text-void font-bold text-xs font-mono text-center hover:bg-sky-400 transition flex items-center justify-center space-x-2 shadow-lg shadow-cyber-sky/20"
                >
                  <span>Open Stage Overview</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {selectedStage.simulators.length > 0 && (
                <Link
                  to={selectedStage.simulators[0].path}
                  className="py-2.5 px-4 rounded-xl bg-surface-card border border-surface-border hover:border-cyber-sky text-slate-200 text-xs font-mono transition flex items-center justify-center space-x-2"
                >
                  <Cpu className="w-4 h-4 text-cyber-sky" />
                  <span>Simulators ({selectedStage.simulators.length})</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

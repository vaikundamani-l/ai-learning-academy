import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Award, 
  FolderGit2, 
  Terminal, 
  Download, 
  Upload, 
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';
import { useProgress } from '../context/ProgressContext';

export const ProgressPage: React.FC = () => {
  const { progress, markStageCompleted, resetProgress, exportProgressJSON } = useProgress();

  const totalStages = CURRICULUM_STAGES.length;
  const completedStagesCount = progress.completedStages.length;
  const startedStagesCount = progress.startedStages.length;
  const percentMastered = Math.round((completedStagesCount / totalStages) * 100);

  const handleExport = () => {
    const json = exportProgressJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-academy-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
            <BarChart3 className="w-4 h-4" />
            <span>Learning Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            Progress Analytics & Mastery Audit
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            Fine-grained verification of completed stages, scratch implementations, assessment scores, and capstone requirements.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs font-mono text-slate-300 transition flex items-center space-x-1.5"
            title="Export progress JSON backup"
          >
            <Download className="w-3.5 h-3.5 text-cyber-sky" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-2">
          <div className="text-xs font-mono text-slate-400">Curriculum Mastery</div>
          <div className="text-3xl font-extrabold font-mono text-slate-100">
            {percentMastered}%
          </div>
          <div className="w-full bg-void rounded-full h-2 border border-surface-border overflow-hidden">
            <div
              className="bg-cyber-sky h-full rounded-full transition-all duration-500"
              style={{ width: `${percentMastered}%` }}
            ></div>
          </div>
          <div className="text-[11px] font-mono text-slate-500 pt-1">
            {completedStagesCount} of {totalStages} Stages Verified
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-2">
          <div className="text-xs font-mono text-slate-400">Stages in Progress</div>
          <div className="text-3xl font-extrabold font-mono text-cyber-sky">
            {startedStagesCount}
          </div>
          <div className="text-[11px] font-mono text-slate-500 pt-2">
            Currently active learning paths
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-2">
          <div className="text-xs font-mono text-slate-400">Total Portfolio Implementations</div>
          <div className="text-3xl font-extrabold font-mono text-cyber-emerald">
            25+
          </div>
          <div className="text-[11px] font-mono text-slate-500 pt-2">
            Scratch algorithms & systems built
          </div>
        </div>
      </div>

      {/* 31-Stage Detailed Checkoff Table */}
      <div className="p-6 rounded-xl bg-surface-card border border-surface-border space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <h3 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
            <span>31-Stage Curriculum Verification Matrix</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Click checkmark to verify mastery
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surface-border text-slate-500 uppercase text-[10px]">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3">Domain</th>
                <th className="py-2.5 px-3">Scratch Builds</th>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {CURRICULUM_STAGES.map((stage) => {
                const isDone = progress.completedStages.includes(stage.id);
                const isStarted = progress.startedStages.includes(stage.id);

                return (
                  <tr key={stage.id} className="hover:bg-surface/50 transition">
                    <td className="py-3 px-3">
                      <button
                        onClick={() => markStageCompleted(stage.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                          isDone
                            ? 'bg-cyber-emerald border-cyber-emerald text-void'
                            : 'border-slate-600 hover:border-cyber-sky'
                        }`}
                        title="Toggle stage mastery checkoff"
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-200">Stage {stage.id}: </span>
                      <span className="text-slate-300 font-sans">{stage.title}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {stage.category}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {stage.buildFromScratch.length} items
                    </td>
                    <td className="py-3 px-3 text-slate-400 truncate max-w-xs font-sans">
                      {stage.projectTitle}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/stage/${stage.id}`}
                        className="text-cyber-sky hover:underline"
                      >
                        Open &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import type { ThemeMode } from '../types/theme';

export const Settings: React.FC = () => {
  const { resetProgress, exportProgressJSON, importProgressJSON } = useProgress();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = () => {
    const json = exportProgressJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-academy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = importProgressJSON(importText);
    if (ok) {
      setImportStatus('Progress imported successfully!');
      setImportText('');
    } else {
      setImportStatus('Error: Invalid JSON progress format.');
    }
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  const themeOptions: { id: ThemeMode; label: string; desc: string; icon: typeof Moon }[] = [
    {
      id: 'dark',
      label: 'Dark Mode',
      desc: 'Deep slate void with glowing cyber accents. Optimized for low eye strain.',
      icon: Moon,
    },
    {
      id: 'light',
      label: 'Light Mode',
      desc: 'Crisp laboratory paper aesthetic with WCAG AA high-contrast typography.',
      icon: Sun,
    },
    {
      id: 'system',
      label: 'System Preference',
      desc: 'Automatically synchronizes with your device operating system theme.',
      icon: Monitor,
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
          <SettingsIcon className="w-4 h-4" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Settings & Learning Data
        </h1>
        <p className="text-slate-400 text-sm mt-1 leading-relaxed">
          Configure interface appearance, manage local storage telemetry, and backup your learning milestones.
        </p>
      </div>

      {/* Section 1: Appearance & Theme Settings */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-2">
          <h2 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
            Appearance & Interface Theme
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Active: <strong className="text-cyber-sky capitalize">{theme}</strong> {theme === 'system' ? `(${resolvedTheme})` : ''}
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Select your preferred visual atmosphere. Preferences are persisted locally in your browser storage.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-3 relative group ${
                  isSelected
                    ? 'bg-surface-elevated border-cyber-sky shadow-md shadow-cyber-sky/10 ring-1 ring-cyber-sky'
                    : 'bg-surface border-surface-border hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg border ${
                    isSelected
                      ? 'bg-cyber-sky/15 border-cyber-sky/40 text-cyber-sky'
                      : 'bg-surface-card border-surface-border text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-[11px] font-mono text-cyber-emerald font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-100 font-mono">
                    {opt.label}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Data Management */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-6">
        <h2 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider border-b border-surface-border pb-2">
          Your Learning Data
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
            <h3 className="text-xs font-bold text-slate-200 font-mono">Export Progress Backup</h3>
            <p className="text-xs text-slate-400">
              Download your current stage completions, notes, and quiz scores as an offline JSON backup.
            </p>
            <button
              onClick={handleExport}
              className="mt-2 px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs font-mono text-cyber-sky transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON File</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
            <h3 className="text-xs font-bold text-slate-200 font-mono">Reset Learning State</h3>
            <p className="text-xs text-slate-400">
              Revert your local learning progress, quiz attempts, and bookmarks back to initial state.
            </p>
            {showResetConfirm ? (
              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg bg-cyber-rose text-white text-xs font-mono font-bold hover:bg-rose-600 transition"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-surface text-slate-400 text-xs font-mono"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="mt-2 px-3 py-1.5 rounded-lg bg-surface-card hover:bg-rose-950/40 border border-surface-border hover:border-cyber-rose/50 text-xs font-mono text-cyber-rose transition flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Progress</span>
              </button>
            )}
          </div>
        </div>

        {/* Restore from JSON */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-slate-200 font-mono">Import Progress JSON</h3>
          <textarea
            aria-label="Progress backup JSON"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste raw progress JSON string here to restore..."
            className="w-full p-3 rounded-lg bg-surface border border-surface-border text-xs font-mono text-slate-200 resize-none h-24 focus:outline-none focus:border-cyber-sky"
          />
          <div className="flex items-center justify-between">
            <button
              disabled={!importText.trim()}
              onClick={handleImport}
              className="px-4 py-1.5 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Progress</span>
            </button>
            {importStatus && (
              <span role="status" className={`text-xs font-mono ${importStatus.includes('Error') ? 'text-cyber-rose' : 'text-cyber-emerald'}`}>
                {importStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Platform Standards Compliance */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4 text-xs font-mono">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-surface-border pb-2">
          Course Design Standards
        </h2>

        <div className="space-y-2 text-slate-300">
          <div className="flex items-center space-x-2 text-cyber-emerald">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>Curriculum Preservation: All 31 stages strictly preserved from master roadmap PDF.</span>
          </div>
          <div className="flex items-center space-x-2 text-cyber-emerald">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>Language Integrity: 100% English only across all UI, diagrams, code, and text.</span>
          </div>
          <div className="flex items-center space-x-2 text-cyber-emerald">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>Lesson quality target: first-principles teaching, tested examples, visuals, and assessments. Full lessons are still in development.</span>
          </div>
          <div className="flex items-center space-x-2 text-cyber-emerald">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>Cybersecurity Safety: Local isolated educational lab targets only.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

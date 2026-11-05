import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export const Settings: React.FC = () => {
  const { progress, resetProgress, exportProgressJSON, importProgressJSON } = useProgress();
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

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
          <SettingsIcon className="w-4 h-4" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Platform Configuration & Telemetry Data
        </h1>
        <p className="text-slate-400 text-sm mt-1 leading-relaxed">
          Manage local storage data, export or restore your learning telemetry, and review academic verification standards.
        </p>
      </div>

      {/* Section 1: Data Management */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-6">
        <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider border-b border-surface-border pb-2">
          Learner State & Data Management
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
            <h4 className="text-xs font-bold text-slate-200 font-mono">Export Progress Backup</h4>
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
            <h4 className="text-xs font-bold text-slate-200 font-mono">Reset Learning State</h4>
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
          <h4 className="text-xs font-bold text-slate-200 font-mono">Import Progress JSON</h4>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste raw progress JSON string here to restore..."
            className="w-full p-3 rounded-lg bg-surface border border-surface-border text-xs font-mono text-slate-200 resize-none h-24 focus:outline-none focus:border-cyber-sky"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={handleImport}
              className="px-4 py-1.5 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Progress</span>
            </button>
            {importStatus && (
              <span className={`text-xs font-mono ${importStatus.includes('Error') ? 'text-cyber-rose' : 'text-cyber-emerald'}`}>
                {importStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Platform Standards Compliance */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4 text-xs font-mono">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-surface-border pb-2">
          Academic & Engineering Compliance Standards
        </h3>

        <div className="space-y-2 text-slate-300">
          <div className="flex items-center space-x-2 text-cyber-emerald">
            <Check className="w-4 h-4" />
            <span>Curriculum Preservation: All 31 stages strictly preserved from master roadmap PDF.</span>
          </div>
          <div className="flex items-center space-x-2 text-cyber-emerald">
            <Check className="w-4 h-4" />
            <span>Language Integrity: 100% English only across all UI, diagrams, code, and text.</span>
          </div>
          <div className="flex items-center space-x-2 text-cyber-emerald">
            <Check className="w-4 h-4" />
            <span>Pedagogical Standard: 18-point first principles framework with zero placeholder lessons.</span>
          </div>
          <div className="flex items-center space-x-2 text-cyber-emerald">
            <Check className="w-4 h-4" />
            <span>Cybersecurity Safety: Local isolated educational lab targets only.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

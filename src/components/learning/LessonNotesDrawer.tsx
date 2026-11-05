import React, { useState, useEffect } from 'react';
import { Bookmark, FileText, X, Save, Check } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { useFocusScope } from '../../hooks/useFocusScope';

interface LessonNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lessonPath: string;
  lessonTitle: string;
}

export const LessonNotesDrawer: React.FC<LessonNotesDrawerProps> = ({
  isOpen,
  onClose,
  lessonPath,
  lessonTitle,
}) => {
  const { progress, saveNote, toggleBookmark, isBookmarked } = useProgress();
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  useFocusScope(isOpen, '#lesson-notes-drawer', onClose);

  useEffect(() => {
    if (progress.notes[lessonPath]) {
      setContent(progress.notes[lessonPath]);
    } else {
      setContent('');
    }
  }, [lessonPath, progress.notes]);

  const handleSave = () => {
    saveNote(lessonPath, content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const bookmarked = isBookmarked(lessonPath);

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-end bg-void/80 backdrop-blur-sm animate-fade-in">
      <aside
        onClick={e => e.stopPropagation()}
        id="lesson-notes-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Notes for ${lessonTitle}`}
        className="w-full max-w-md h-full bg-surface border-l border-surface-border p-6 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyber-sky" />
              <h2 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
                Lesson Notes
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close notes panel"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-surface-elevated transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">
              Current Lesson
            </div>
            <h3 className="text-sm font-bold text-slate-200 mt-0.5">
              {lessonTitle}
            </h3>
          </div>

          {/* Bookmark Toggle inside Drawer */}
          <div className="p-3 rounded-xl bg-surface-card border border-surface-border flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'text-cyber-sky fill-current' : 'text-slate-500'}`} />
              <span>{bookmarked ? 'Bookmarked for review' : 'Not bookmarked'}</span>
            </div>
            <button
              onClick={() => toggleBookmark(lessonPath)}
              className="px-3 py-1 rounded bg-surface border border-surface-border text-xs font-mono text-slate-300 hover:text-white transition"
            >
              {bookmarked ? 'Remove' : 'Save'}
            </button>
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <label
              htmlFor="lesson-note-textarea"
              className="block text-xs font-mono text-slate-400"
            >
              Your Engineering Journal & Derivations
            </label>
            <textarea
              id="lesson-note-textarea"
              value={content}
              onChange={(e) => { setContent(e.target.value); setSaved(false); }}
              placeholder="Record your takeaways, hardware register observations, equations, or bug diagnostics..."
              className="w-full h-64 p-3 rounded-xl bg-void border border-surface-border text-xs font-mono text-slate-200 resize-none focus:outline-none focus:border-cyber-sky leading-relaxed"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-surface-border flex items-center justify-between">
          <button
            onClick={handleSave}
            disabled={content === (progress.notes[lessonPath] || '')}
            className="px-4 py-2 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved to Vault</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </>
            )}
          </button>
          <span className="text-[10px] font-mono text-slate-500">
            Stored in browser
          </span>
        </div>
      </aside>
    </div>
  );
};

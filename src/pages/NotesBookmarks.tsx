import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  FileText, 
  Trash2, 
  Plus, 
  ArrowRight, 
  Save, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export const NotesBookmarks: React.FC = () => {
  const { progress, toggleBookmark, saveNote } = useProgress();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes'>('bookmarks');
  const [newNoteKey, setNewNoteKey] = useState('stage-0-notes');
  const [savedMessage, setSavedMessage] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleSaveNote = () => {
    if (!newNoteKey.trim() || !newNoteContent.trim()) return;
    saveNote(newNoteKey.trim(), newNoteContent);
    setSavedMessage('Note saved in this browser.');
    setNewNoteContent('');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
          <Bookmark className="w-4 h-4" />
          <span>Knowledge Vault</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Bookmarks, Highlights & Personal Engineering Journal
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
          Quickly revisit saved lessons, review your technical notes, and persist key takeaways across the 31 stages.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 items-center border-b border-surface-border pb-3">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono transition ${
            activeTab === 'bookmarks'
              ? 'bg-cyber-sky text-void font-bold shadow-md shadow-cyber-sky/20'
              : 'bg-surface-card border border-surface-border text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Bookmarks ({progress.bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono transition ${
            activeTab === 'notes'
              ? 'bg-cyber-sky text-void font-bold shadow-md shadow-cyber-sky/20'
              : 'bg-surface-card border border-surface-border text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Engineering Notes ({Object.keys(progress.notes).length})</span>
        </button>
      </div>

      {/* Bookmarks Tab Content */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {progress.bookmarks.length === 0 ? (
            <div className="p-12 text-center bg-surface-card rounded-xl border border-surface-border text-slate-400 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm">No lessons bookmarked yet.</p>
              <Link to="/curriculum" className="text-xs font-mono text-cyber-sky hover:underline">
                Explore curriculum to bookmark lessons &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {progress.bookmarks.map((path) => (
                <div
                  key={path}
                  className="p-4 rounded-xl bg-surface-card border border-surface-border hover:border-slate-500 transition flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyber-sky uppercase font-semibold">
                      Saved Lesson
                    </span>
                    <h4 className="text-sm font-bold text-slate-200 font-mono break-all">
                      {path}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={path}
                      className="p-2 rounded-lg bg-surface hover:bg-surface-elevated text-cyber-sky transition"
                      title="Open Lesson"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => toggleBookmark(path)}
                      className="p-2 rounded-lg bg-surface hover:bg-surface-elevated text-slate-500 hover:text-cyber-rose transition"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes Tab Content */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Create Note Form */}
          <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center space-x-2">
              <Plus className="w-4 h-4 text-cyber-sky" />
              <span>Add Quick Engineering Note</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                aria-label="Note title"
                value={newNoteKey}
                onChange={(e) => setNewNoteKey(e.target.value)}
                placeholder="Topic or Stage Key (e.g. Stage 0 CPU)"
                className="px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-slate-200 font-mono focus:outline-none focus:border-cyber-sky"
              />
              <textarea
                aria-label="Note content"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write your observation, derivation or bug diagnostic..."
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-slate-200 font-mono resize-none h-20 focus:outline-none focus:border-cyber-sky"
              />
            </div>

            <p role="status" className="text-sm text-cyber-emerald">{savedMessage}</p>
            <div className="flex justify-end">
              <button
                disabled={!newNoteKey.trim() || !newNoteContent.trim()}
                onClick={handleSaveNote}
                className="px-4 py-1.5 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </div>

          {/* Saved Notes List */}
          <div className="space-y-3">
            {Object.entries(progress.notes).length === 0 ? (
              <div className="p-8 text-center bg-surface-card rounded-xl border border-surface-border text-slate-400 text-xs">
                No personal notes saved yet. Use the form above to record key insights!
              </div>
            ) : (
              Object.entries(progress.notes).map(([key, val]) => (
                <div
                  key={key}
                  className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-surface-border pb-1.5">
                    <span className="font-mono font-bold text-cyber-sky">{key}</span>
                  </div>
                  <p className="text-slate-300 font-mono whitespace-pre-wrap">{val}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

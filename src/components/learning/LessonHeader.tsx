import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, CheckCircle2, FileText } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export interface LessonHeaderProps {
  stageNumber: number;
  lessonIndex: number;
  totalLessons?: number;
  estimatedReadTime: string;
  title: string;
  currentPath: string;
  onOpenNotes: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  stageNumber,
  lessonIndex,
  totalLessons = 4,
  estimatedReadTime,
  title,
  currentPath,
  onOpenNotes,
}) => {
  const { progress, toggleBookmark, isBookmarked } = useProgress();

  const bookmarked = isBookmarked(currentPath);
  const completed = progress.completedLessons.includes(currentPath);
  const recordedScore = progress.assessmentScores[currentPath];
  const isMastered = (recordedScore !== undefined && recordedScore >= 80) || completed;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border pb-4">
      {/* Title & Navigation */}
      <div className="flex items-start gap-3 min-w-0">
        <Link
          to={`/stage/${stageNumber}`}
          className="min-h-11 min-w-11 p-2 rounded-lg bg-surface border border-surface-border text-slate-400 hover:text-slate-100 hover:bg-surface-elevated transition"
          title={`Return to Stage ${stageNumber} Dashboard`}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyber-sky">
            <span>Stage {stageNumber}</span>
            <span>•</span>
            <span>Lesson {lessonIndex}{totalLessons > 0 ? ` of ${totalLessons}` : ''}</span>
            <span>•</span>
            <span className="text-slate-400">{estimatedReadTime}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenNotes}
          className="min-h-11 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-mono text-slate-300 hover:text-slate-100 hover:bg-surface-elevated transition flex items-center space-x-1.5"
          title="Open Notes Drawer"
        >
          <FileText className="w-3.5 h-3.5 text-cyber-sky" />
          <span>Notes</span>
        </button>

        <button
          onClick={() => toggleBookmark(currentPath)}
          className={`min-h-11 px-3 py-1.5 rounded-lg border text-xs font-mono transition flex items-center space-x-1.5 ${
            bookmarked
              ? 'bg-cyber-sky/10 border-cyber-sky/40 text-cyber-sky'
              : 'bg-surface border-surface-border text-slate-400 hover:text-slate-200 hover:bg-surface-elevated'
          }`}
          title={bookmarked ? 'Remove Bookmark' : 'Bookmark this Lesson'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
          <span>{bookmarked ? 'Saved' : 'Save'}</span>
        </button>

        <div
          className={`min-h-11 px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 ${
            completed
              ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-cyber-emerald font-bold'
              : isMastered
              ? 'bg-cyber-emerald/5 border-cyber-emerald/20 text-cyber-emerald'
              : 'bg-surface border-surface-border text-slate-400'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{completed ? 'Completed' : isMastered ? 'Knowledge Check Passed' : 'In Progress'}</span>
        </div>
      </div>
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress } from '../types/curriculum';

const INITIAL_PROGRESS: UserProgress = {
  startedStages: [0],
  completedStages: [],
  completedLessons: [],
  completedExercises: [],
  completedProjects: [],
  bookmarks: ['/stage/0/lesson/cpu-architecture'],
  notes: {},
  assessmentScores: {},
  lastActiveStageId: 0
};

const STORAGE_KEY = 'ai_master_course_progress_v1';

interface ProgressContextType {
  progress: UserProgress;
  markStageStarted: (stageId: number) => void;
  markStageCompleted: (stageId: number) => void;
  markLessonCompleted: (lessonId: string) => void;
  toggleBookmark: (path: string) => void;
  isBookmarked: (path: string) => boolean;
  saveNote: (lessonId: string, content: string) => void;
  saveAssessmentScore: (quizId: string, score: number) => void;
  setLastActiveStage: (stageId: number) => void;
  resetProgress: () => void;
  exportProgressJSON: () => string;
  importProgressJSON: (jsonString: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
    return INITIAL_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  const markStageStarted = (stageId: number) => {
    setProgress(prev => ({
      ...prev,
      startedStages: prev.startedStages.includes(stageId)
        ? prev.startedStages
        : [...prev.startedStages, stageId],
      lastActiveStageId: stageId
    }));
  };

  const markStageCompleted = (stageId: number) => {
    setProgress(prev => ({
      ...prev,
      completedStages: prev.completedStages.includes(stageId)
        ? prev.completedStages
        : [...prev.completedStages, stageId]
    }));
  };

  const markLessonCompleted = (lessonId: string) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId]
    }));
  };

  const toggleBookmark = (path: string) => {
    setProgress(prev => {
      const exists = prev.bookmarks.includes(path);
      return {
        ...prev,
        bookmarks: exists
          ? prev.bookmarks.filter(b => b !== path)
          : [...prev.bookmarks, path]
      };
    });
  };

  const isBookmarked = (path: string) => progress.bookmarks.includes(path);

  const saveNote = (lessonId: string, content: string) => {
    setProgress(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [lessonId]: content
      }
    }));
  };

  const saveAssessmentScore = (quizId: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      assessmentScores: {
        ...prev.assessmentScores,
        [quizId]: score
      }
    }));
  };

  const setLastActiveStage = (stageId: number) => {
    setProgress(prev => ({ ...prev, lastActiveStageId: stageId }));
  };

  const resetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportProgressJSON = () => JSON.stringify(progress, null, 2);

  const importProgressJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.startedStages)) {
        setProgress(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON progress payload', e);
    }
    return false;
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markStageStarted,
        markStageCompleted,
        markLessonCompleted,
        toggleBookmark,
        isBookmarked,
        saveNote,
        saveAssessmentScore,
        setLastActiveStage,
        resetProgress,
        exportProgressJSON,
        importProgressJSON
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

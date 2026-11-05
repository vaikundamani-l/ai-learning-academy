export interface TopicItem {
  id: string;
  title: string;
  isOriginalRoadmap: boolean;
  description?: string;
  hasPilotContent?: boolean;
}

export interface SimulatorItem {
  id: string;
  title: string;
  description: string;
  category: 'hardware' | 'math' | 'neural' | 'network' | 'security' | 'systems';
  iconName: string;
  path: string;
  stageId: number;
}

export interface Stage {
  id: number;
  part: number;
  partTitle: string;
  title: string;
  shortDescription: string;
  prerequisites: number[]; // Stage IDs
  originalTopics: string[];
  expandedSubtopics: string[];
  buildFromScratch: string[];
  projectTitle: string;
  projectDescription: string;
  masteryCheck: string;
  simulators: SimulatorItem[];
  estimatedHours: string;
  category: 'Computing' | 'Mathematics' | 'Machine Learning' | 'Language Models' | 'Systems' | 'Cybersecurity' | 'AI Security' | 'Research';
}

export interface UserProgress {
  startedStages: number[];
  completedStages: number[];
  completedLessons: string[]; // lesson slug/id
  completedExercises: string[];
  completedProjects: number[];
  bookmarks: string[];
  notes: Record<string, string>; // key: lessonId, value: markdown note
  assessmentScores: Record<string, number>; // key: quizId, value: percentage score
  lastActiveStageId: number;
}

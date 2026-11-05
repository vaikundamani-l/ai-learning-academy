import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { NotFound } from './NotFound';
import { CURRICULUM_STAGES } from '../data/curriculumData';

const CpuArchitectureLesson = React.lazy(() =>
  import('./lessons/CpuArchitectureLesson').then((m) => ({ default: m.CpuArchitectureLesson }))
);
const MemoryHierarchyLesson = React.lazy(() =>
  import('./lessons/MemoryHierarchyLesson').then((m) => ({ default: m.MemoryHierarchyLesson }))
);
const OperatingSystemsLesson = React.lazy(() =>
  import('./lessons/OperatingSystemsLesson').then((m) => ({ default: m.OperatingSystemsLesson }))
);
const DeveloperToolingLesson = React.lazy(() =>
  import('./lessons/DeveloperToolingLesson').then((m) => ({ default: m.DeveloperToolingLesson }))
);

export const LessonViewer: React.FC = () => {
  const { stageId, lessonId } = useParams<{ stageId: string; lessonId: string }>();

  const id = /^\d+$/.test(stageId || '') ? Number(stageId) : -1;
  const stage = CURRICULUM_STAGES[id];

  if (!stage) return <NotFound />;

  const canonicalLessonId =
    ({
      'memory-hierarchy': 'binary-data-representation',
      'os-primitives': 'operating-systems',
      'processes-threads': 'operating-systems',
      'shell-and-git': 'developer-tooling',
      'terminal-and-git': 'developer-tooling',
    } as Record<string, string>)[lessonId || ''] || lessonId;

  const currentPath = `/stage/${id}/lesson/${canonicalLessonId}`;

  const renderLessonContent = () => {
    if (id === 0) {
      if (lessonId === 'cpu-architecture') {
        return <CpuArchitectureLesson stage={stage} currentPath={currentPath} />;
      }
      if (lessonId === 'binary-data-representation' || lessonId === 'memory-hierarchy') {
        return <MemoryHierarchyLesson stage={stage} currentPath={currentPath} />;
      }
      if (lessonId === 'operating-systems' || lessonId === 'os-primitives' || lessonId === 'processes-threads') {
        return <OperatingSystemsLesson stage={stage} currentPath={currentPath} />;
      }
      if (lessonId === 'developer-tooling' || lessonId === 'shell-and-git' || lessonId === 'terminal-and-git') {
        return <DeveloperToolingLesson stage={stage} currentPath={currentPath} />;
      }
    }
    return <NotFound />;
  };

  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-3 font-mono">
          <div className="w-8 h-8 mx-auto border-2 border-cyber-sky border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400">Loading curriculum module...</p>
        </div>
      }
    >
      {renderLessonContent()}
    </Suspense>
  );
};

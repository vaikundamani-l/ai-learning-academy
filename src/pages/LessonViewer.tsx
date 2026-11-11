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
const PythonBasicsLesson = React.lazy(() =>
  import('./lessons/PythonFirstProgramLesson').then((m) => ({ default: m.PythonFirstProgramLesson }))
);

const PythonControlFlowLesson = React.lazy(() =>
  import('./lessons/PythonControlFlowLesson').then((m) => ({ default: m.PythonControlFlowLesson }))
);

const PythonFunctionsLesson = React.lazy(() => import('./lessons/PythonFunctionsLesson').then(m => ({ default: m.PythonFunctionsLesson })));

const PythonCollectionsLesson = React.lazy(() => import('./lessons/PythonCollectionsLesson').then(m => ({ default: m.PythonCollectionsLesson })));

const PythonExceptionsLesson = React.lazy(() => import('./lessons/PythonExceptionsLesson').then(m => ({ default: m.PythonExceptionsLesson })));

const PythonModulesLesson = React.lazy(() => import('./lessons/PythonModulesLesson').then(m => ({ default: m.PythonModulesLesson })));

const PythonFilesLesson = React.lazy(() => import('./lessons/PythonFilesLesson').then(m => ({ default: m.PythonFilesLesson })));

const PythonStructuredDataLesson = React.lazy(() => import('./lessons/PythonStructuredDataLesson').then(m => ({ default: m.PythonStructuredDataLesson })));

const PythonClassesLesson = React.lazy(() => import('./lessons/PythonClassesLesson').then(m => ({ default: m.PythonClassesLesson })));

const PythonTestingLesson = React.lazy(() => import('./lessons/PythonTestingLesson').then(m => ({ default: m.PythonTestingLesson })));

const ComplexityLesson = React.lazy(() => import('./lessons/ComplexityLesson').then(m => ({ default: m.ComplexityLesson })));
const PythonInternalsLesson = React.lazy(() => import('./lessons/PythonBasicsLesson').then(m => ({ default: m.PythonBasicsLesson })));
const PythonCapstoneLesson = React.lazy(() => import('./lessons/PythonCapstoneLesson').then(m => ({ default: m.PythonCapstoneLesson })));
const PythonTaskManagerLesson = React.lazy(() => import('./lessons/PythonTaskManagerLesson').then(m => ({ default: m.PythonTaskManagerLesson })));
const PythonPytestLesson = React.lazy(() => import('./lessons/PythonPytestLesson').then(m => ({ default: m.PythonPytestLesson })));
const PythonLifetimeLesson = React.lazy(() => import('./lessons/PythonLifetimeLesson').then(m => ({ default: m.PythonLifetimeLesson })));
const PythonConcurrencyLesson = React.lazy(() => import('./lessons/PythonConcurrencyLesson').then(m => ({ default: m.PythonConcurrencyLesson })));
const PythonHttpLesson = React.lazy(() => import('./lessons/PythonHttpLesson').then(m => ({ default: m.PythonHttpLesson })));
const PythonRegexLesson = React.lazy(() => import('./lessons/PythonRegexLesson').then(m => ({ default: m.PythonRegexLesson })));
const PythonIterationLesson = React.lazy(() => import('./lessons/PythonIterationLesson').then(m => ({ default: m.PythonIterationLesson })));
const PythonTypingLesson = React.lazy(() => import('./lessons/PythonTypingLesson').then(m => ({ default: m.PythonTypingLesson })));

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
      'python-basics': 'first-python-program',
      'python-fundamentals': 'first-python-program',
      'computational-thinking': 'first-python-program',
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
    if (id === 2 && lessonId === 'complexity-foundations') return <ComplexityLesson stage={stage} currentPath={currentPath} />;
    if (id === 1) {
      if (lessonId === 'python-cpython-evidence') return <PythonInternalsLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-data-capstone') return <PythonCapstoneLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-task-manager') return <PythonTaskManagerLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-pytest-coverage') return <PythonPytestLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-context-decorators') return <PythonLifetimeLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-concurrency') return <PythonConcurrencyLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-http-client') return <PythonHttpLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-regex-logs') return <PythonRegexLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-iteration-scope') return <PythonIterationLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-typing-profiling') return <PythonTypingLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-testing') return <PythonTestingLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-classes') return <PythonClassesLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-structured-data') return <PythonStructuredDataLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-files') return <PythonFilesLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-modules') return <PythonModulesLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-exceptions') return <PythonExceptionsLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-collections') return <PythonCollectionsLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-functions') return <PythonFunctionsLesson stage={stage} currentPath={currentPath} />;
      if (lessonId === 'python-control-flow') {
        return <PythonControlFlowLesson stage={stage} currentPath={currentPath} />;
      }
      if (lessonId === 'first-python-program' || lessonId === 'python-basics' || lessonId === 'python-fundamentals' || lessonId === 'computational-thinking') {
        return <PythonBasicsLesson stage={stage} currentPath={currentPath} />;
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

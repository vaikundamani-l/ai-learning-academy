import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { CurriculumBrowser } from './pages/CurriculumBrowser';
import { StageOverview } from './pages/StageOverview';
import { LessonViewer } from './pages/LessonViewer';
import { SubjectHub } from './pages/SubjectHub';
import { VisualLab } from './pages/VisualLab';
import { SimulationLab } from './pages/SimulationLab';
import { Playground } from './pages/Playground';
import { Exercises } from './pages/Exercises';
import { Projects } from './pages/Projects';
import { Assessments } from './pages/Assessments';
import { ProgressPage } from './pages/ProgressPage';
import { NotesBookmarks } from './pages/NotesBookmarks';
import { SearchPage } from './pages/SearchPage';
import { NotFound } from './pages/NotFound';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="curriculum" element={<CurriculumBrowser />} />
              <Route path="stage/:stageId" element={<StageOverview />} />
              <Route path="stage/:stageId/lesson/:lessonId" element={<LessonViewer />} />
              <Route path="subject" element={<SubjectHub />} />
              <Route path="visual-lab" element={<VisualLab />} />
              <Route path="simulators" element={<SimulationLab />} />
              <Route path="simulators/:simulatorId" element={<SimulationLab />} />
              <Route path="playground" element={<Playground />} />
              <Route path="exercises" element={<Exercises />} />
              <Route path="projects" element={<Projects />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="notes" element={<NotesBookmarks />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </ThemeProvider>
  );
};

export default App;

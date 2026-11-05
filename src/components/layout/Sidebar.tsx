import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Layers, 
  Cpu, 
  Terminal, 
  CheckSquare, 
  FolderGit2, 
  Award, 
  BarChart3, 
  Bookmark, 
  Search, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  BookOpen,
  Shield,
  Binary
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../../data/curriculumData';
import { useProgress } from '../../context/ProgressContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [stagesOpen, setStagesOpen] = useState(true);
  const { progress } = useProgress();

  const mainNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Curriculum Navigator', path: '/curriculum', icon: Map },
    { name: 'Visual Learning Lab', path: '/visual-lab', icon: Layers },
    { name: 'Interactive Simulators', path: '/simulators', icon: Cpu },
    { name: 'Code Playground', path: '/playground', icon: Terminal },
    { name: 'Exercises & Challenges', path: '/exercises', icon: CheckSquare },
    { name: 'Engineering Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Assessments & Mastery', path: '/assessments', icon: Award },
    { name: 'Progress Analytics', path: '/progress', icon: BarChart3 },
    { name: 'Notes & Bookmarks', path: '/notes', icon: Bookmark },
    { name: 'Omni Search', path: '/search', icon: Search },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Group stages by Part for sidebar browsing
  const parts = [
    { num: 1, title: 'Part I: Foundations', range: [0, 1, 2, 3], icon: Binary },
    { num: 2, title: 'Part II: Math & Data', range: [4, 5], icon: BarChart3 },
    { num: 3, title: 'Part III: AI & ML', range: [6, 7, 8, 9, 10, 11], icon: Cpu },
    { num: 4, title: 'Part IV: Language Models', range: [12, 13, 14, 15, 16, 17, 18], icon: BookOpen },
    { num: 5, title: 'Part V: Reliable Systems', range: [19, 20], icon: Layers },
    { num: 6, title: 'Part VI: Cybersecurity', range: [21, 22, 23, 24, 25], icon: Shield },
    { num: 7, title: 'Part VII: AI Security', range: [26, 27, 28], icon: Shield },
    { num: 8, title: 'Part VIII: Research & Capstones', range: [29, 30], icon: Award },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-void/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-64 bg-surface border-r border-surface-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {/* Main Navigation Group */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
              Platform Modules
            </div>
            <nav className="space-y-0.5">
              {mainNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? 'bg-cyber-sky/10 text-cyber-sky border border-cyber-sky/20 font-semibold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-surface-card'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 mr-2.5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Curriculum Stages Accordion */}
          <div>
            <button
              onClick={() => setStagesOpen(!stagesOpen)}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold hover:text-slate-300 transition"
            >
              <span>31 Curriculum Stages</span>
              {stagesOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {stagesOpen && (
              <div className="mt-2 space-y-2">
                {parts.map((p) => {
                  return (
                    <div key={p.num} className="space-y-0.5">
                      <div className="px-3 py-1 text-[10px] font-mono text-slate-400 font-semibold flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-sky/60 mr-1.5"></span>
                        {p.title}
                      </div>
                      <div className="pl-3 space-y-0.5 border-l border-surface-border/40 ml-3">
                        {p.range.map((stageId) => {
                          const stage = CURRICULUM_STAGES[stageId];
                          if (!stage) return null;
                          const isCompleted = progress.completedStages.includes(stageId);
                          const isStarted = progress.startedStages.includes(stageId);

                          return (
                            <NavLink
                              key={stageId}
                              to={`/stage/${stageId}`}
                              onClick={onClose}
                              className={({ isActive }) =>
                                `flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-mono transition ${
                                  isActive
                                    ? 'bg-surface-elevated text-cyber-sky font-semibold'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-card'
                                }`
                              }
                            >
                              <span className="truncate pr-2">
                                <span className="text-slate-500 mr-1.5">S{stageId}</span>
                                {stage.title}
                              </span>
                              {isCompleted ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald flex-shrink-0" title="Completed"></span>
                              ) : isStarted ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyber-sky flex-shrink-0" title="In Progress"></span>
                              ) : null}
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-surface-border text-[11px] font-mono text-slate-500 bg-void/50">
          <div className="flex items-center justify-between">
            <span>Roadmap</span>
            <span className="text-slate-400">Nov 2026</span>
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">
            31 Stages • 4 Capstones
          </div>
        </div>
      </aside>
    </>
  );
};

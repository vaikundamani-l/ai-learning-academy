import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bookmark, 
  Settings, 
  Award,
  Terminal,
  Cpu,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, sidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Calculate approximate curriculum completion percentage
  const totalStages = 31;
  const completedCount = progress.completedStages.length;
  const progressPercent = Math.round((completedCount / totalStages) * 100);

  const stageMatch = location.pathname.match(/^\/stage\/(\d+)/);
  const breadcrumbs = stageMatch
    ? [{ label: `Stage ${stageMatch[1]}`, url: `/stage/${stageMatch[1]}` },
       ...(location.pathname.includes('/lesson/') ? [{ label: 'Lesson preview', url: location.pathname }] : [])]
    : [{ label: location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1].replace(/-/g, ' '), url: location.pathname }];

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || target.closest('input, textarea, select, [contenteditable="true"]')) return;
      event.preventDefault(); navigate('/search');
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [navigate]);

  const handleCycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const ThemeIcon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;
  const themeLabel = theme === 'system' 
    ? `System (${resolvedTheme})` 
    : theme === 'dark' 
    ? 'Dark' 
    : 'Light';

  return (
    <header className="sticky top-0 z-30 h-14 bg-void/90 backdrop-blur-md border-b border-surface-border px-4 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand & Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          aria-expanded={sidebarOpen}
          aria-controls="academy-sidebar"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-surface-card transition lg:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-7 h-7 rounded-lg bg-cyber-sky/10 border border-cyber-sky/30 flex items-center justify-center text-cyber-sky group-hover:border-cyber-sky transition">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-bold tracking-wider text-slate-100 uppercase block font-mono leading-none">
              AI & Systems
            </span>
            <span className="text-[10px] text-cyber-sky tracking-widest uppercase font-mono block leading-none mt-0.5">
              Academy
            </span>
          </div>
        </Link>

        {/* Dynamic Breadcrumbs */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-400 border-l border-surface-border pl-3 ml-2">
          <Link to="/" className="hover:text-cyber-sky transition">Academy</Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.url}>
              <span className="text-slate-600">/</span>
              {idx === breadcrumbs.length - 1
                ? <span aria-current="page" className="text-slate-200 capitalize">{crumb.label}</span>
                : <Link to={crumb.url} className="hover:text-cyber-sky capitalize">{crumb.label}</Link>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right: Search, Progress, Quick Tools */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Omni Search Shortcut Button */}
        <button
          aria-label="Search curriculum"
          onClick={() => navigate('/search')}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <Search className="w-3.5 h-3.5 text-cyber-sky" />
          <span className="hidden sm:inline">Search topics, code, labs...</span>
          <kbd className="hidden lg:inline text-[10px] bg-void px-1.5 py-0.5 rounded border border-surface-border font-mono text-slate-400">
            /
          </kbd>
        </button>

        {/* Global Progress Pill */}
        <Link
          to="/progress"
          className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-surface-card border border-surface-border text-xs text-slate-300 hover:border-cyber-sky transition"
          title="View detailed learning mastery progress"
        >
          <Award className="w-3.5 h-3.5 text-cyber-amber" />
          <span className="font-mono text-[11px] font-semibold">{progressPercent}%</span>
        </Link>

        {/* Theme Quick Switcher */}
        <button
          onClick={handleCycleTheme}
          aria-label={`Current theme: ${themeLabel}. Click to switch theme.`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-surface-card transition flex items-center space-x-1"
          title={`Theme: ${themeLabel} (Click to switch)`}
        >
          <ThemeIcon className="w-4 h-4 text-cyber-sky" />
          <span className="hidden xl:inline text-[10px] font-mono capitalize">{themeLabel}</span>
        </button>

        {/* Quick Links */}
        <Link
          to="/playground"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-surface-card transition"
          title="Interactive Code Playground"
        >
          <Terminal className="w-4 h-4" />
        </Link>

        <Link
          to="/notes"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-surface-card transition relative"
          title="Bookmarks & Notes"
        >
          <Bookmark className="w-4 h-4" />
          {progress.bookmarks.length > 0 && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyber-sky rounded-full ring-2 ring-void"></span>
          )}
        </Link>

        <Link
          to="/settings"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-surface-card transition"
          title="Platform Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};

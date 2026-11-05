import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';

export interface TOCSection {
  id: string;
  title: string;
  level?: number;
}

interface ScrollAwareTOCProps {
  sections: TOCSection[];
  className?: string;
}

export const ScrollAwareTOC: React.FC<ScrollAwareTOCProps> = ({
  sections,
  className = '',
}) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');
  const [readingProgress, setReadingProgress] = useState<number>(0);

  useEffect(() => {
    const update = () => {
      const nodes = sections.map(section => document.getElementById(section.id)).filter((node): node is HTMLElement => !!node);
      if (!nodes.length) return;
      const marker = window.scrollY + 100;
      const current = [...nodes].reverse().find(node => node.getBoundingClientRect().top + window.scrollY <= marker);
      setActiveId((current || nodes[0]).id);
      const start = nodes[0].getBoundingClientRect().top + window.scrollY;
      const last = nodes[nodes.length - 1];
      const end = last.getBoundingClientRect().bottom + window.scrollY;
      setReadingProgress(Math.round(Math.max(0, Math.min(1, (marker - start) / Math.max(1, end - start - window.innerHeight + 100))) * 100));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [sections]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
      setActiveId(id);
      // Set hash without jump
      window.history.replaceState(window.history.state, '', `#${id}`);
    }
  };

  return (
    <nav
      aria-label="Lesson Table of Contents"
      className={`p-4 rounded-xl bg-surface-card border border-surface-border space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-surface-border pb-2">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-cyber-sky" />
          <span>Table of Contents</span>
        </div>
        <span className="text-[11px] font-mono font-semibold text-cyber-sky" aria-label="Reading progress">
          {readingProgress}% read
        </span>
      </div>

      {/* Reading Progress Bar */}
      <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden border border-surface-border">
        <div
          className="bg-cyber-sky h-full rounded-full transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Nav List */}
      <div className="space-y-1 text-xs font-mono max-h-[60vh] overflow-y-auto pr-1">
        {sections.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <a
              key={sec.id}
              aria-current={isActive ? 'location' : undefined}
              href={`#${sec.id}`}
              onClick={(e) => scrollToSection(e, sec.id)}
              className={`block px-2.5 py-1.5 rounded-lg transition truncate ${
                isActive
                  ? 'bg-cyber-sky/15 text-cyber-sky font-bold border-l-2 border-cyber-sky pl-2'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface'
              }`}
            >
              {sec.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

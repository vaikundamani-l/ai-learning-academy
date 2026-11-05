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

  // Scroll listener for reading progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setReadingProgress(100);
        return;
      }
      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100)));
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to detect active section in viewport
  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible sections
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by top position to pick the one closest to top of viewport
          visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      setActiveId(id);
      // Set hash without jump
      window.history.pushState(null, '', `#${id}`);
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
        <span className="text-[11px] font-mono font-semibold text-cyber-sky" aria-live="polite">
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

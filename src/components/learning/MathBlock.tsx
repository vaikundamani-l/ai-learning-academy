import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathBlockProps {
  math: string;
  inline?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({ 
  math, 
  inline = false, 
  className = '',
  ariaLabel
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: !inline,
        throwOnError: false,
        strict: false,
        output: 'html',
      });
    } catch (err) {
      console.error('KaTeX rendering error for equation:', math, err);
      return `<code class="text-cyber-rose">${math.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
    }
  }, [math, inline]);

  if (inline) {
    return (
      <span
        role="math"
        aria-label={ariaLabel || math}
        className={`inline-block font-serif text-slate-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div
      role="region"
      aria-label={ariaLabel || 'Mathematical equation'}
      className={`my-4 p-4 rounded-xl bg-surface-card border border-surface-border overflow-x-auto text-center shadow-inner max-w-full min-w-0 ${className}`}
    >
      <div
        className="inline-block text-slate-100"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

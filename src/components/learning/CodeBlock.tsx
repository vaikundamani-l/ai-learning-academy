import React, { useState, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-nasm';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import { Copy, Check, Terminal, FileCode2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  title,
  showLineNumbers = true,
  highlightLines = [],
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const cleanCode = code.trim();
  const lines = cleanCode.split('\n');

  const highlightedHtml = useMemo(() => {
    const langKey = language.toLowerCase();
    const grammar = Prism.languages[langKey] || Prism.languages.python || Prism.languages.text;
    try {
      return Prism.highlight(cleanCode, grammar, langKey);
    } catch {
      return cleanCode;
    }
  }, [cleanCode, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code to clipboard', err);
    }
  };

  return (
    <div className={`my-4 rounded-xl border border-surface-border bg-void overflow-hidden shadow-md max-w-full min-w-0 ${className}`}>
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface-card border-b border-surface-border text-xs font-mono">
        <div className="flex items-center space-x-2">
          {title ? (
            <FileCode2 className="w-3.5 h-3.5 text-cyber-sky" />
          ) : (
            <Terminal className="w-3.5 h-3.5 text-cyber-emerald" />
          )}
          <span className="font-semibold text-slate-200">
            {title || `${language.toUpperCase()} SNIPPET`}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-[10px] text-cyber-sky uppercase font-semibold">
            {language}
          </span>
          <button
            onClick={handleCopy}
            aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-surface transition flex items-center space-x-1"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-cyber-emerald" />
                <span className="text-[10px] text-cyber-emerald font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[10px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed select-text max-w-full">
        {showLineNumbers ? (
          <table className="min-w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isHighlighted = highlightLines.includes(lineNum);
                const grammar = Prism.languages[language.toLowerCase()] || Prism.languages.python;
                const lineHtml = Prism.highlight(line || ' ', grammar, language.toLowerCase());

                return (
                  <tr
                    key={idx}
                    className={isHighlighted ? 'bg-cyber-sky/10 border-l-2 border-cyber-sky' : ''}
                  >
                    <td className="pr-4 select-none text-right text-slate-600 w-8 align-top font-mono text-[11px]">
                      {lineNum}
                    </td>
                    <td
                      className="text-slate-200 whitespace-pre font-mono"
                      dangerouslySetInnerHTML={{ __html: lineHtml }}
                    />
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <pre className="text-slate-200 whitespace-pre">
            <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
          </pre>
        )}
      </div>
    </div>
  );
};

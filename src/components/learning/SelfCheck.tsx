import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export interface SelfCheckOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface SelfCheckProps {
  question: string;
  options: SelfCheckOption[];
  title?: string;
  className?: string;
}

export const SelfCheck: React.FC<SelfCheckProps> = ({
  question,
  options,
  title = 'Self-Check Diagnostic',
  className = '',
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
  };

  const handleReset = () => {
    setSelectedIdx(null);
  };

  const selectedOption = selectedIdx !== null ? options[selectedIdx] : null;

  return (
    <div className={`my-6 p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyber-sky uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-cyber-sky" />
          <span>{title}</span>
        </div>
        {selectedIdx !== null && (
          <button
            onClick={handleReset}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-100 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <p className="text-sm font-semibold text-slate-100 leading-relaxed font-sans">
        {question}
      </p>

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          let style = 'bg-surface border-surface-border text-slate-300 hover:border-slate-500';
          if (isSelected) {
            style = opt.isCorrect
              ? 'bg-cyber-emerald/15 border-cyber-emerald text-cyber-emerald font-medium'
              : 'bg-cyber-rose/15 border-cyber-rose text-cyber-rose font-medium';
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`w-full p-3 rounded-xl border text-left text-xs font-mono transition flex items-start space-x-3 ${style}`}
            >
              <span className="w-5 h-5 rounded bg-void border border-surface-border flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="font-sans leading-relaxed">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback explanation */}
      {selectedOption && (
        <div
          role="status"
          className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
            selectedOption.isCorrect
              ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-slate-200'
              : 'bg-cyber-rose/10 border-cyber-rose/40 text-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2 font-mono font-bold uppercase text-[11px]">
            {selectedOption.isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
                <span className="text-cyber-emerald">Correct Insight</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-cyber-rose" />
                <span className="text-cyber-rose">Incorrect — Review the Mechanism</span>
              </>
            )}
          </div>
          <p className="font-sans text-slate-300 leading-relaxed pl-6">
            {selectedOption.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

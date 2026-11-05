import React from 'react';
import { 
  Info, 
  AlertTriangle, 
  AlertOctagon, 
  Cpu, 
  Sparkles, 
  Layers,
  ShieldAlert
} from 'lucide-react';

export type CalloutType = 'note' | 'caution' | 'danger' | 'deep-dive' | 'hardware' | 'security';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Callout: React.FC<CalloutProps> = ({
  type = 'note',
  title,
  children,
  className = '',
}) => {
  const configs = {
    note: {
      icon: Info,
      defaultTitle: 'Engineering Context',
      border: 'border-cyber-sky/40',
      bg: 'bg-cyber-sky/10',
      text: 'text-cyber-sky',
    },
    caution: {
      icon: AlertTriangle,
      defaultTitle: 'Caution & Common Misconception',
      border: 'border-cyber-amber/40',
      bg: 'bg-cyber-amber/10',
      text: 'text-cyber-amber',
    },
    danger: {
      icon: AlertOctagon,
      defaultTitle: 'Critical System Failure Risk',
      border: 'border-cyber-rose/40',
      bg: 'bg-cyber-rose/10',
      text: 'text-cyber-rose',
    },
    'deep-dive': {
      icon: Layers,
      defaultTitle: 'Architectural Deep Dive',
      border: 'border-cyber-indigo/40',
      bg: 'bg-cyber-indigo/10',
      text: 'text-cyber-indigo',
    },
    hardware: {
      icon: Cpu,
      defaultTitle: 'Low-Level Hardware Mechanics',
      border: 'border-cyber-emerald/40',
      bg: 'bg-cyber-emerald/10',
      text: 'text-cyber-emerald',
    },
    security: {
      icon: ShieldAlert,
      defaultTitle: 'Dual-Use & Security Defense',
      border: 'border-cyber-rose/40',
      bg: 'bg-cyber-rose/10',
      text: 'text-cyber-rose',
    },
  };

  const config = configs[type] || configs.note;
  const Icon = config.icon;

  return (
    <aside
      role="note"
      className={`my-4 p-4 rounded-xl border ${config.border} ${config.bg} space-y-2 text-xs leading-relaxed ${className}`}
    >
      <div className={`flex items-center space-x-2 font-mono font-bold uppercase tracking-wider text-[11px] ${config.text}`}>
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{title || config.defaultTitle}</span>
      </div>
      <div className="text-slate-200 pl-6 leading-relaxed font-sans">
        {children}
      </div>
    </aside>
  );
};

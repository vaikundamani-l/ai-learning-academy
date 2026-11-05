import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, GitBranch, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface/80 border-t border-surface-border text-xs text-slate-400 py-8 px-4 sm:px-8 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Col 1: Mission */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-slate-200 font-mono font-bold">
            <Cpu className="w-4 h-4 text-cyber-sky" />
            <span>AI, SYSTEMS & CYBERSECURITY</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            A first-principles, interactive university-grade engineering platform. From computing hardware fundamentals to advanced LLM systems and cybersecurity research.
          </p>
        </div>

        {/* Col 2: Core Learning Branches */}
        <div>
          <h4 className="font-mono text-slate-200 text-xs font-semibold uppercase tracking-wider mb-2">
            Curriculum Branches
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li><Link to="/curriculum" className="hover:text-cyber-sky transition">Computing & OS Foundations</Link></li>
            <li><Link to="/curriculum" className="hover:text-cyber-sky transition">Mathematics & Data Engineering</Link></li>
            <li><Link to="/curriculum" className="hover:text-cyber-sky transition">Deep Learning & Transformers</Link></li>
            <li><Link to="/curriculum" className="hover:text-cyber-sky transition">Language Models & RAG Agents</Link></li>
            <li><Link to="/curriculum" className="hover:text-cyber-sky transition">Systems & Performance Engineering</Link></li>
            <li><Link to="/curriculum" className="hover:text-cyber-sky transition">Cybersecurity & AI Defense</Link></li>
          </ul>
        </div>

        {/* Col 3: Reference Starting Points */}
        <div>
          <h4 className="font-mono text-slate-200 text-xs font-semibold uppercase tracking-wider mb-2">
            Verified Standards
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-400 font-mono text-[11px]">
            <li className="flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyber-indigo" />
              <span>Stanford CS336: LM from Scratch</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyber-emerald" />
              <span>NIST NICE Framework</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyber-amber" />
              <span>OWASP Top 10 & OWASP LLM</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyber-rose" />
              <span>MITRE ATLAS Matrix</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Platform Standards */}
        <div>
          <h4 className="font-mono text-slate-200 text-xs font-semibold uppercase tracking-wider mb-2">
            Engineering Standard
          </h4>
          <p className="text-slate-500 text-xs leading-relaxed mb-3">
            Strict first-principles pedagogical standard. All 31 stages preserved verbatim from the master roadmap. 100% English only.
          </p>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500">
            <GitBranch className="w-3 h-3 text-cyber-sky" />
            <span>Master Roadmap: Nov 2026</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-surface-border/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
        <div>AI, Systems & Cybersecurity Interactive Learning Academy</div>
        <div className="mt-2 sm:mt-0">First Principles • Visual Simulators • Scratch Implementations</div>
      </div>
    </footer>
  );
};

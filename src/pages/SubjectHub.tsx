import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Binary, 
  BarChart3, 
  Cpu, 
  BookOpen, 
  Layers, 
  Shield, 
  ShieldAlert, 
  Award,
  ArrowRight
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';

export const SubjectHub: React.FC = () => {
  const subjects = [
    {
      id: 'systems',
      title: 'Computer Systems & OS Architecture',
      description: 'Binary logic, CPU instruction execution, memory hierarchies, POSIX OS primitives, networking, and storage engines.',
      icon: Binary,
      color: 'text-cyber-sky',
      stages: [0, 1, 2, 3],
      primaryTopics: 'CPU Pipelines, Virtual Memory, Sockets, B-Trees, C Pointers'
    },
    {
      id: 'mathematics',
      title: 'Mathematics & Data Engineering',
      description: 'Linear algebra, vector spaces, multivariable calculus, probability, statistics, and reproducible data pipelines.',
      icon: BarChart3,
      color: 'text-cyber-amber',
      stages: [4, 5],
      primaryTopics: 'SVD, PCA, Gradient Descent, Bayes Rule, Data Leakage'
    },
    {
      id: 'ml-dl',
      title: 'Machine Learning & Deep Learning',
      description: 'Classical algorithms, decision trees, neural backprop, autodiff engines, computer vision, and transformers.',
      icon: Cpu,
      color: 'text-cyber-emerald',
      stages: [6, 7, 8, 9, 10, 11],
      primaryTopics: 'Decision Trees, Autograd, CNNs, BM25, Multi-Head Attention'
    },
    {
      id: 'llm-agents',
      title: 'Language Models & Autonomous Agents',
      description: 'Pretraining data, BPE tokenization, KV-cache inference, fine-tuning (LoRA), RAG, and agentic workflows.',
      icon: BookOpen,
      color: 'text-cyber-indigo',
      stages: [12, 13, 14, 15, 16, 17, 18],
      primaryTopics: 'BPE, KV-Cache, LoRA, HNSW RAG, ReAct Workflows'
    },
    {
      id: 'reliable-systems',
      title: 'MLOps & Distributed Systems',
      description: 'API serving architecture, GPU memory optimization, quantization (INT8/4), continuous batching, and distributed training.',
      icon: Layers,
      color: 'text-cyber-purple',
      stages: [19, 20],
      primaryTopics: 'CI/CD Gates, Quantization, Continuous Batching, FSDP'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity & Defense Engineering',
      description: 'Threat modeling, cryptography, OWASP web vulnerabilities, Linux hardening, detection engineering, and digital forensics.',
      icon: Shield,
      color: 'text-cyber-rose',
      stages: [21, 22, 23, 24, 25],
      primaryTopics: 'AES-GCM, SQLi/XSS, IAM Blast Radius, MITRE ATT&CK'
    },
    {
      id: 'ai-security',
      title: 'Adversarial AI Security & AI for Cyber',
      description: 'Adversarial evasion (FGSM), data poisoning, indirect prompt injection, RAG defenses, and ML-assisted SOC workflows.',
      icon: ShieldAlert,
      color: 'text-cyber-sky',
      stages: [26, 27, 28],
      primaryTopics: 'FGSM, Indirect Injection, Tool Sandboxing, SOC ML Triage'
    },
    {
      id: 'research-capstones',
      title: 'Research Methods & Master Capstones',
      description: 'Scientific paper reading, ablation studies, statistical rigor, and the 4 end-to-end engineered master capstone systems.',
      icon: Award,
      color: 'text-cyber-amber',
      stages: [29, 30],
      primaryTopics: 'Ablations, Statistical Significance, Capstones A-D'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky font-semibold tracking-wider uppercase">
          <Layers className="w-4 h-4" />
          <span>Subject Hubs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Technical Domain Academies
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
          Explore specialized learning pathways grouped by engineering domain. Each hub brings together interconnected stages, hands-on labs, and portfolio milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((sub) => {
          const Icon = sub.icon;
          return (
            <div
              key={sub.id}
              className="p-5 rounded-xl bg-surface-card border border-surface-border hover:border-slate-500 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-lg bg-surface border border-surface-border ${sub.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">{sub.title}</h3>
                    <div className="text-[11px] font-mono text-slate-500">
                      Stages {sub.stages.join(', ')}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {sub.description}
                </p>

                <div className="p-2 rounded bg-surface border border-surface-border text-[11px] font-mono text-slate-400">
                  <span className="text-slate-500 font-semibold">Key Core: </span>
                  {sub.primaryTopics}
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {sub.stages.map((sid) => (
                    <Link
                      key={sid}
                      to={`/stage/${sid}`}
                      className="px-2 py-0.5 rounded bg-surface hover:bg-surface-elevated text-[10px] font-mono text-slate-300 hover:text-cyber-sky transition"
                    >
                      S{sid}
                    </Link>
                  ))}
                </div>

                <Link
                  to={`/stage/${sub.stages[0]}`}
                  className="flex items-center space-x-1 text-xs font-mono font-semibold text-cyber-sky hover:text-sky-300 transition"
                >
                  <span>Explore Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

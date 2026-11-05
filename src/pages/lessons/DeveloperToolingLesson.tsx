import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Check, 
  Award, 
  AlertCircle, 
  RotateCcw, 
  Wrench, 
  HelpCircle, 
  Layers, 
  Terminal, 
  Cpu, 
  Database, 
  ArrowRight, 
  ShieldAlert, 
  GitBranch,
  FolderTree,
  Search
} from 'lucide-react';
import { Stage } from '../../types/curriculum';
import { useProgress } from '../../context/ProgressContext';
import { MathBlock } from '../../components/learning/MathBlock';
import { CodeBlock } from '../../components/learning/CodeBlock';
import { Callout } from '../../components/learning/Callout';
import { ScrollAwareTOC } from '../../components/learning/ScrollAwareTOC';
import { LessonNotesDrawer } from '../../components/learning/LessonNotesDrawer';

// 3 Interactive Visualizers
import { GitDagVisualizer } from '../../components/visual/tools/GitDagVisualizer';
import { ShellPipelineVisualizer } from '../../components/visual/tools/ShellPipelineVisualizer';
import { EnvPathVisualizer } from '../../components/visual/tools/EnvPathVisualizer';

// Structured Pedagogical Content
import { TOOLING_LESSON_CONTENT } from '../../data/toolingLessonContent';

interface DeveloperToolingLessonProps {
  stage: Stage;
  currentPath: string;
}

export const DeveloperToolingLesson: React.FC<DeveloperToolingLessonProps> = ({ stage, currentPath }) => {
  const { progress, toggleBookmark, isBookmarked, markLessonCompleted, saveAssessmentScore } = useProgress();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const closeNotes = useCallback(() => setIsNotesOpen(false), []);
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  // Assessment Gate State
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);

  const bookmarked = isBookmarked(currentPath);
  const completed = progress.completedLessons.includes(currentPath);
  const recordedScore = progress.assessmentScores[currentPath];

  // 18-Point Framework Table of Contents
  const tocSections = [
    { id: 'objectives', title: '1. Learning Objectives' },
    { id: 'prereqs', title: '2. Prerequisites & Assumptions' },
    { id: 'history', title: '3. History of Shells & Git' },
    { id: 'shell-architecture', title: '4. Shell Architecture & Streams' },
    { id: 'redirection-pipes', title: '5. Pipes & dup2() Redirection' },
    { id: 'pipeline-lab', title: '6. Interactive Pipeline Simulator' },
    { id: 'environment-variables', title: '7. Environment Variables & Scope' },
    { id: 'path-resolution', title: '8. $PATH Search & Linux FHS' },
    { id: 'path-lab', title: '9. Interactive $PATH Lab' },
    { id: 'package-managers', title: '10. Package Managers & Build Tools' },
    { id: 'git-philosophy', title: '11. Version Control Philosophy' },
    { id: 'git-objects', title: '12. Git Internals & Object Types' },
    { id: 'git-dag-theory', title: '13. Directed Acyclic Graph (DAG)' },
    { id: 'git-dag-lab', title: '14. Interactive Git DAG Explorer' },
    { id: 'merging-conflicts', title: '15. Branching, Merging & Conflicts' },
    { id: 'c-pipeline-code', title: '16. C Pipeline & dup2 Implementation' },
    { id: 'python-git-code', title: '17. Python Raw Git Object Creator' },
    { id: 'assessment', title: '18. Diagnostic Mastery Exam' },
    { id: 'exercises', title: '19. Practical Hands-On Exercises' },
  ];

  const toggleHint = (exerciseId: number) => {
    setRevealedHints((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const handleSelectAnswer = (questionId: number, optionIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleGradeAssessment = () => {
    let correctCount = 0;
    TOOLING_LESSON_CONTENT.quizQuestions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected !== undefined && q.options[selected]?.isCorrect) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / TOOLING_LESSON_CONTENT.quizQuestions.length) * 100);
    setAssessmentScore(scorePct);
    setAssessmentSubmitted(true);
    saveAssessmentScore(currentPath, scorePct);
  };

  const handleResetAssessment = () => {
    setUserAnswers({});
    setAssessmentSubmitted(false);
    setAssessmentScore(null);
  };

  const isMastered = (assessmentScore !== null && assessmentScore >= 80) || (recordedScore !== undefined && recordedScore >= 80);

  return (
    <div className="space-y-8 pb-16 max-w-full min-w-0">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/stage/0"
            className="p-2 rounded-lg bg-surface border border-surface-border text-slate-400 hover:text-slate-100 hover:bg-surface-elevated transition"
            title="Return to Stage 0 Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyber-sky">
              <span>Stage {TOOLING_LESSON_CONTENT.stageNumber}</span>
              <span>•</span>
              <span>Lesson 4 of 4</span>
              <span>•</span>
              <span className="text-slate-400">{TOOLING_LESSON_CONTENT.estimatedReadTime}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
              {TOOLING_LESSON_CONTENT.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsNotesOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-mono text-slate-300 hover:text-slate-100 hover:bg-surface-elevated transition flex items-center space-x-1.5"
            title="Open Notes Drawer"
          >
            <FileText className="w-3.5 h-3.5 text-cyber-sky" />
            <span>Notes</span>
          </button>

          <button
            onClick={() => toggleBookmark(currentPath)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition flex items-center space-x-1.5 ${
              bookmarked
                ? 'bg-cyber-sky/10 border-cyber-sky/40 text-cyber-sky'
                : 'bg-surface border-surface-border text-slate-400 hover:text-slate-200 hover:bg-surface-elevated'
            }`}
            title={bookmarked ? 'Remove Bookmark' : 'Bookmark this Lesson'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            <span>{bookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 ${
              completed
                ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-cyber-emerald font-bold'
                : isMastered
                ? 'bg-cyber-emerald/5 border-cyber-emerald/20 text-cyber-emerald'
                : 'bg-surface border-surface-border text-slate-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{completed ? 'Certified & Completed' : isMastered ? 'Mastery Unlocked' : 'In Progress'}</span>
          </div>
        </div>
      </div>

      {/* Mobile Table of Contents */}
      <details className="lg:hidden rounded-xl border border-surface-border bg-surface-card p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-200">Jump to a Tooling & Git lesson section</summary>
        <ScrollAwareTOC sections={tocSections} className="mt-3" />
      </details>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Lesson Content */}
        <div className="lg:col-span-3 min-w-0 space-y-12">

          {/* Section 1: Objectives */}
          <section id="objectives" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-cyber-sky" />
              <span>Section 1</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Learning Objectives
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Upon mastering this lesson, you will possess a complete internal understanding of developer tooling, shell streams, process pipes, environment inheritance, and Git's content-addressable directed acyclic graph:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {TOOLING_LESSON_CONTENT.objectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-card border border-surface-border text-xs text-slate-300 flex items-start space-x-2.5"
                >
                  <span className="w-5 h-5 rounded bg-surface border border-surface-border flex items-center justify-center text-[10px] text-cyber-sky font-mono font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{obj}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Prerequisites */}
          <section id="prereqs" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <Check className="w-4 h-4 text-cyber-indigo" />
              <span>Section 2</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Prerequisites & Foundation
            </h2>
            <div className="space-y-2">
              {TOOLING_LESSON_CONTENT.prerequisites.map((req, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-surface border border-surface-border text-xs font-mono text-slate-300 flex items-start space-x-2"
                >
                  <span className="text-cyber-indigo font-bold">•</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: History */}
          <section id="history" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-amber font-mono font-semibold text-xs tracking-wider uppercase">
              <Terminal className="w-4 h-4 text-cyber-amber" />
              <span>Section 3</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Historical Evolution: From Thompson Shell to Bash & The Birth of Git
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                In 1971, Ken Thompson wrote the original Unix shell (<code className="text-cyber-sky">/bin/sh</code>). In 1979, Stephen Bourne at Bell Labs introduced the <strong>Bourne Shell</strong>, establishing modern scripting syntax (loops, variables, control flow). In 1989, Brian Fox developed the <strong>Bourne Again Shell (Bash)</strong> for the GNU Project, which remains the default shell across Linux distributions.
              </p>
              <p>
                Before Git, version control was centralized. Systems like <strong>CVS (1986)</strong> and <strong>Subversion (SVN, 2000)</strong> relied on a single central server. Branching was slow and expensive, requiring network round-trips for every operation. In 2005, when the proprietary BitKeeper license was revoked from the Linux kernel team, Linus Torvalds took two weeks of leave to design <strong>Git</strong> from first principles.
              </p>
              <p>
                Torvalds rejected delta diff chains and centralized servers, creating a <strong>distributed, content-addressable object store</strong> where every cloned repository holds the entire immutable project history.
              </p>
            </div>
          </section>

          {/* Section 4: Shell Architecture */}
          <section id="shell-architecture" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Cpu className="w-4 h-4 text-cyber-sky" />
              <span>Section 4</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Shell Architecture & Standard Streams (stdin, stdout, stderr)
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                A shell is not the operating system; it is a userland program that loops through a simple cycle: <strong>Read, Parse, Expand, Execute, and Wait</strong>.
              </p>
              <p>
                Every process launched by the shell is automatically provided with three open file descriptors:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
                <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1">
                  <span className="font-mono text-xs font-bold text-cyber-sky block">FD 0: Standard Input (stdin)</span>
                  <p className="text-[11px] text-slate-400">By default reads keyboard characters or the read-end of a preceding pipe.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1">
                  <span className="font-mono text-xs font-bold text-cyber-emerald block">FD 1: Standard Output (stdout)</span>
                  <p className="text-[11px] text-slate-400">By default prints normal program output to the terminal screen or next pipe.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1">
                  <span className="font-mono text-xs font-bold text-cyber-rose block">FD 2: Standard Error (stderr)</span>
                  <p className="text-[11px] text-slate-400">Dedicated diagnostic error stream; avoids mixing error messages with pipeline data.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Redirection & Pipes */}
          <section id="redirection-pipes" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-semibold text-xs tracking-wider uppercase">
              <Terminal className="w-4 h-4 text-cyber-emerald" />
              <span>Section 5</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Kernel Pipes (|) & File Descriptor Redirection (dup2)
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Redirection alters where a process reads its input or writes its output:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                <li><code className="text-cyber-sky">&gt; file.txt</code>: Overwrites <code className="text-cyber-sky">file.txt</code> with stdout (FD 1).</li>
                <li><code className="text-cyber-sky">&gt;&gt; file.txt</code>: Appends stdout (FD 1) to the end of <code className="text-cyber-sky">file.txt</code>.</li>
                <li><code className="text-cyber-sky">&lt; file.txt</code>: Redirects stdin (FD 0) to read bytes from <code className="text-cyber-sky">file.txt</code>.</li>
                <li><code className="text-cyber-sky">2&gt;&amp;1</code>: Duplicates File Descriptor 2 onto File Descriptor 1, merging error output into stdout.</li>
              </ul>

              <h4 className="font-bold text-slate-200 text-sm pt-2">The Architecture of a Pipe</h4>
              <p>
                When you execute <code className="text-cyber-sky font-bold">cmdA | cmdB</code>, the shell performs these exact kernel operations:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-300">
                <li>Calls <code className="text-cyber-sky">pipe(pfd)</code>: Allocates a 64 KB kernel circular ring buffer returning two descriptors (<code className="text-cyber-sky">pfd[0]</code> for reading, <code className="text-cyber-sky">pfd[1]</code> for writing).</li>
                <li>Calls <code className="text-cyber-sky">fork()</code> twice to spawn child A and child B.</li>
                <li>In child A: Calls <code className="text-cyber-sky">dup2(pfd[1], STDOUT_FILENO)</code> and executes <code className="text-cyber-sky">cmdA</code>.</li>
                <li>In child B: Calls <code className="text-cyber-sky">dup2(pfd[0], STDIN_FILENO)</code> and executes <code className="text-cyber-sky">cmdB</code>.</li>
              </ol>
            </div>
          </section>

          {/* Section 6: Pipeline Simulator Lab */}
          <section id="pipeline-lab" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Terminal className="w-4 h-4 text-cyber-sky" />
              <span>Section 6 — Interactive Laboratory</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Interactive Unix I/O Redirection & Pipe Simulator
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Step through the multi-stage pipeline below to observe how each process's standard output stream connects to the next process's standard input through kernel memory buffers.
            </p>

            <ShellPipelineVisualizer />
          </section>

          {/* Section 7: Environment Variables */}
          <section id="environment-variables" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <FolderTree className="w-4 h-4 text-cyber-indigo" />
              <span>Section 7</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Environment Variables, Process Inheritance & Subshells
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Every Linux process has access to an array of null-terminated strings called <code className="text-cyber-sky">environ</code> in its virtual memory. When a process spawns a child via <code className="text-cyber-sky">fork()</code>, the child inherits an exact duplicate copy of this environment array.
              </p>

              <Callout type="note" title="Local Shell Variable vs. Exported Environment Variable">
                If you type <code className="font-mono">VAR=value</code>, the variable is <strong>local to the shell process</strong>. Child commands executed by the shell cannot see it.
                <br />
                Typing <code className="font-mono">export VAR=value</code> sets the internal export attribute, ensuring that when the shell calls <code className="font-mono">execve()</code>, the variable is passed to the child process!
              </Callout>
            </div>
          </section>

          {/* Section 8: PATH & FHS */}
          <section id="path-resolution" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Search className="w-4 h-4 text-cyber-sky" />
              <span>Section 8</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              The $PATH Search Algorithm & The Linux Filesystem Hierarchy (FHS)
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                When you type a command name without a slash (e.g. <code className="text-cyber-sky">git</code> instead of <code className="text-cyber-sky">/usr/bin/git</code>), the shell iterates through directories listed in <code className="text-cyber-sky">$PATH</code>:
              </p>

              <div className="p-3 rounded-lg bg-surface border border-surface-border font-mono text-xs text-cyber-sky break-all">
                $PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
              </div>

              <p>
                The shell checks each directory from left to right. The <strong>first executable file</strong> matching the command name is executed; all subsequent directories are ignored (shadowing).
              </p>
            </div>
          </section>

          {/* Section 9: PATH Lab */}
          <section id="path-lab" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Search className="w-4 h-4 text-cyber-sky" />
              <span>Section 9 — Interactive Laboratory</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Interactive $PATH Resolution & FHS Lab
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Type any command name to trace how the shell searches each directory in the $PATH list until it finds the executable.
            </p>

            <EnvPathVisualizer />
          </section>

          {/* Section 10: Package Managers */}
          <section id="package-managers" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-semibold text-xs tracking-wider uppercase">
              <Layers className="w-4 h-4 text-cyber-emerald" />
              <span>Section 10</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Developer Tooling, Package Managers & Shared Libraries
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Modern software depends on hundreds of shared libraries. System package managers (<code className="text-cyber-sky">apt</code>, <code className="text-cyber-sky">dnf</code>, <code className="text-cyber-sky">pacman</code>) resolve dependency directed graphs, verifying cryptographic checksums and installing precompiled ELF binaries and shared object (<code className="text-cyber-sky">.so</code>) libraries into <code className="text-cyber-sky">/usr/lib</code>.
              </p>
            </div>
          </section>

          {/* Section 11: Git Philosophy */}
          <section id="git-philosophy" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <GitBranch className="w-4 h-4 text-cyber-indigo" />
              <span>Section 11</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              The Philosophy of Version Control: Snapshots vs. Deltas
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Legacy version control systems recorded file histories as sequences of diffs (deltas). Git fundamentally differs: <strong>Git thinks of its data as a stream of snapshots</strong> over a miniature filesystem. If a file has not changed, Git does not store it again; it simply stores a link to the previous identical blob object!
              </p>
            </div>
          </section>

          {/* Section 12: Git Objects */}
          <section id="git-objects" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-amber font-mono font-semibold text-xs tracking-wider uppercase">
              <Database className="w-4 h-4 text-cyber-amber" />
              <span>Section 12</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Git Internals: Content-Addressable Storage & Object Types
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                At its core, Git is a simple key-value data store. You insert content and receive a 40-character SHA-1 hash. There are only four fundamental object types in the <code className="text-cyber-sky">.git/objects/</code> database:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
                <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1">
                  <div className="font-mono text-xs font-bold text-cyber-sky">1. Blob</div>
                  <p className="text-[11px] text-slate-400">Stores pure file content. Contains zero metadata, timestamps, or filenames.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1">
                  <div className="font-mono text-xs font-bold text-cyber-emerald">2. Tree</div>
                  <p className="text-[11px] text-slate-400">Directory listing mapping filenames and POSIX modes (100644, 100755) to blob hashes.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1">
                  <div className="font-mono text-xs font-bold text-cyber-indigo">3. Commit</div>
                  <p className="text-[11px] text-slate-400">Points to a root Tree, ancestor commit parent hashes, author/committer, and message.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1">
                  <div className="font-mono text-xs font-bold text-cyber-amber">4. Annotated Tag</div>
                  <p className="text-[11px] text-slate-400">Permanent pointer to a specific commit, with GPG signature, tagger name, and notes.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 13: Git DAG Theory */}
          <section id="git-dag-theory" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <GitBranch className="w-4 h-4 text-cyber-sky" />
              <span>Section 13</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Graph Theory: The Git Directed Acyclic Graph (DAG)
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Because each commit stores the cryptographic hash of its parent commit, the entire repository forms an immutable <strong>Directed Acyclic Graph (DAG)</strong>:
              </p>

              <MathBlock
                math="G = (V, E) \quad \text{where } v \in V, \; (v_{\text{child}}, v_{\text{parent}}) \in E"
                ariaLabel="Git Directed Acyclic Graph definition"
              />

              <p>
                A <strong>Branch</strong> is not a container of files; a branch is simply a 41-byte text file inside <code className="text-cyber-sky">.git/refs/heads/</code> containing the 40-character SHA-1 hash of its latest commit!
              </p>
            </div>
          </section>

          {/* Section 14: Git DAG Lab */}
          <section id="git-dag-lab" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <GitBranch className="w-4 h-4 text-cyber-sky" />
              <span>Section 14 — Interactive Laboratory</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Interactive Git DAG & Object Explorer
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore the commit timeline below. Click any commit node to inspect its internal tree and blob SHA-1 hashes, switch active branches, and create new commits to watch the DAG expand.
            </p>

            <GitDagVisualizer />
          </section>

          {/* Section 15: Merging & Conflicts */}
          <section id="merging-conflicts" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-rose font-mono font-semibold text-xs tracking-wider uppercase">
              <ShieldAlert className="w-4 h-4 text-cyber-rose" />
              <span>Section 15</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Branch Merging: Fast-Forward vs. Three-Way Merge & Conflict Resolution
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                When merging two branches, Git chooses between two distinct algorithms:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                <li>
                  <strong>Fast-Forward:</strong> If no commits were added to the base branch since the feature branch diverged, Git simply moves the branch pointer forward. No new merge commit is created.
                </li>
                <li>
                  <strong>Three-Way Merge:</strong> If both branches have diverged with independent commits, Git finds their <em>Most Recent Common Ancestor (MRCA)</em> and performs a 3-way diff between Ancestor, Branch A, and Branch B.
                </li>
              </ul>
              <p>
                If both branches modified the <strong>exact same line</strong>, Git halts the merge and inserts conflict markers (<code className="text-cyber-rose">&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code className="text-cyber-rose">=======</code>, <code className="text-cyber-rose">&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>) for human resolution.
              </p>
            </div>
          </section>

          {/* Section 16: C Code Pipeline */}
          <section id="c-pipeline-code" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Cpu className="w-4 h-4 text-cyber-sky" />
              <span>Section 16 — Practical Verification</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Verifying Kernel Pipes & Redirection in C11
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              The following tested C program creates a unidirectional kernel pipe buffer with <code className="text-cyber-sky">pipe()</code>, forks a child process, and demonstrates inter-process communication:
            </p>

            <CodeBlock
              language="c"
              code={TOOLING_LESSON_CONTENT.codeExamples.cPipelines}
              title="pipeline_demo.c"
            />
          </section>

          {/* Section 17: Python Git Creator */}
          <section id="python-git-code" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <Terminal className="w-4 h-4 text-cyber-indigo" />
              <span>Section 17 — Implementation From Scratch</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Building a Raw Git Object Engine in Pure Python
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              This tested Python script implements raw Git blob creation, prefixing content with <code className="text-cyber-sky">blob &lt;length&gt;\0</code>, computing the exact SHA-1 hash, and compressing with zlib:
            </p>

            <CodeBlock
              language="python"
              code={TOOLING_LESSON_CONTENT.codeExamples.pythonGitEngine}
              title="git_raw_object.py"
            />
          </section>

          {/* Section 18: Diagnostic Mastery Exam */}
          <section id="assessment" className="space-y-6 pt-6 border-t border-surface-border">
            <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-semibold text-xs tracking-wider uppercase">
              <Award className="w-4 h-4 text-cyber-emerald" />
              <span>Section 18 — Verified Diagnostic Mastery Gate</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                Diagnostic Mastery Exam
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                To certify completion of Stage 0 Lesson 4, you must demonstrate technical mastery by answering the following 10 developer tooling and Git questions. A passing score of <strong>&ge; 80% (8 of 10 correct)</strong> unlocks certified completion.
              </p>
            </div>

            {/* Exam Results Score Card */}
            {assessmentSubmitted && (
              <div
                className={`p-5 rounded-xl border space-y-3 transition ${
                  isMastered
                    ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-cyber-emerald'
                    : 'bg-cyber-rose/10 border-cyber-rose/40 text-cyber-rose'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono font-bold text-sm">
                    {isMastered ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{isMastered ? 'Mastery Verified!' : 'Score Threshold Not Reached'}</span>
                  </div>
                  <span className="text-lg font-mono font-extrabold">{assessmentScore}%</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {isMastered
                    ? `Congratulations! You scored ${assessmentScore}%, meeting the 80% developer tooling and Git mastery requirement. Your achievement is recorded in progress storage.`
                    : `You scored ${assessmentScore}%. An 80% score (at least 8 correct questions) is required to certify mastery. Review the technical explanations below and retry.`}
                </p>
              </div>
            )}

            {/* 10 Assessment Questions */}
            <div className="space-y-6">
              {TOOLING_LESSON_CONTENT.quizQuestions.map((q, qIdx) => {
                const selectedOptionIdx = userAnswers[q.id];
                const isAnswered = selectedOptionIdx !== undefined;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-xs font-mono font-bold text-cyber-sky">
                        Question {qIdx + 1} of {TOOLING_LESSON_CONTENT.quizQuestions.length}
                      </div>
                      {assessmentSubmitted && isAnswered && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            q.options[selectedOptionIdx]?.isCorrect
                              ? 'bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/40'
                              : 'bg-cyber-rose/20 text-cyber-rose border border-cyber-rose/40'
                          }`}
                        >
                          {q.options[selectedOptionIdx]?.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-slate-100 leading-relaxed font-sans">
                      {q.question}
                    </h3>

                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedOptionIdx === optIdx;
                        let optionStyle = 'bg-surface border-surface-border text-slate-300 hover:bg-surface-elevated hover:text-slate-100';

                        if (assessmentSubmitted) {
                          if (opt.isCorrect) {
                            optionStyle = 'bg-cyber-emerald/15 border-cyber-emerald/50 text-cyber-emerald font-semibold';
                          } else if (isSelected && !opt.isCorrect) {
                            optionStyle = 'bg-cyber-rose/15 border-cyber-rose/50 text-cyber-rose font-semibold';
                          } else {
                            optionStyle = 'bg-surface/50 border-surface-border/50 text-slate-500 opacity-60';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-cyber-sky/15 border-cyber-sky text-cyber-sky font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={assessmentSubmitted}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-start space-x-2.5 ${optionStyle}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-mono">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation */}
                    {assessmentSubmitted && isAnswered && (
                      <div className="p-3 rounded-lg bg-surface border border-surface-border text-xs text-slate-300 leading-relaxed font-sans space-y-1">
                        <strong className="text-cyber-sky font-mono text-[11px] block">Architectural Explanation:</strong>
                        <span>{q.options[selectedOptionIdx]?.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Assessment Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!assessmentSubmitted ? (
                <button
                  onClick={handleGradeAssessment}
                  disabled={Object.keys(userAnswers).length < TOOLING_LESSON_CONTENT.quizQuestions.length}
                  className={`px-5 py-2.5 rounded-lg font-bold text-xs font-mono transition flex items-center space-x-2 shadow-lg ${
                    Object.keys(userAnswers).length === TOOLING_LESSON_CONTENT.quizQuestions.length
                      ? 'bg-cyber-sky text-void hover:bg-sky-400 shadow-cyber-sky/20'
                      : 'bg-surface border border-surface-border text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>
                    Grade Diagnostic Exam ({Object.keys(userAnswers).length}/{TOOLING_LESSON_CONTENT.quizQuestions.length} Answered)
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleResetAssessment}
                  className="px-4 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated text-xs font-mono transition flex items-center space-x-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset & Retake Exam</span>
                </button>
              )}
            </div>
          </section>

          {/* Section 19: Practical Exercises */}
          <section id="exercises" className="space-y-6 pt-6 border-t border-surface-border">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <Wrench className="w-4 h-4 text-cyber-indigo" />
              <span>Section 19 — Practical Exercises</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                Hands-On Engineering Exercises
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Solidify your understanding by solving these three practical shell and Git engineering challenges:
              </p>
            </div>

            <div className="space-y-4">
              {TOOLING_LESSON_CONTENT.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100 font-mono">
                      {ex.title}
                    </h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        ex.level === 'Beginner'
                          ? 'bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30'
                          : ex.level === 'Intermediate'
                          ? 'bg-cyber-sky/10 text-cyber-sky border border-cyber-sky/30'
                          : 'bg-cyber-amber/10 text-cyber-amber border border-cyber-amber/30'
                      }`}
                    >
                      {ex.level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {ex.description}
                  </p>

                  <div className="p-3 rounded-lg bg-surface border border-surface-border text-xs space-y-1 text-slate-300">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Tasks:</div>
                    {ex.tasks.map((t, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <span className="text-cyber-sky font-bold">•</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  {/* Solution Hint Toggle */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleHint(ex.id)}
                      className="text-xs font-mono text-cyber-sky hover:underline flex items-center space-x-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{revealedHints[ex.id] ? 'Hide Solution Derivation' : 'Show Solution Derivation'}</span>
                    </button>

                    {revealedHints[ex.id] && (
                      <div className="mt-2 p-3 rounded-lg bg-cyber-sky/10 border border-cyber-sky/30 text-xs text-slate-200 leading-relaxed">
                        <strong className="text-cyber-sky">Solution & Derivation: </strong>
                        {ex.solutionHint}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lesson Completion Footer Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-card to-surface-elevated border border-cyber-emerald/40 space-y-4">
            <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
              <span>Stage 0 Mastery Checkpoint</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {isMastered ? 'Stage 0 Developer Tooling & Git Internals Mastered!' : 'Complete the Diagnostic Exam to Certify Mastery'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {isMastered
                ? 'You have demonstrated certified architectural understanding across all developer tooling primitives: Unix shell standard streams, kernel pipes, environment inheritance, and Git content-addressable DAG objects.'
                : 'Score at least 80% on the Section 18 Diagnostic Exam to certify mastery and record your completion.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                disabled={!isMastered}
                onClick={() => markLessonCompleted(currentPath)}
                className={`px-4 py-2 rounded-lg font-bold text-xs font-mono transition flex items-center space-x-2 shadow-lg ${
                  isMastered
                    ? 'bg-cyber-emerald text-void hover:bg-emerald-400 shadow-cyber-emerald/20'
                    : 'bg-surface border border-surface-border text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{completed ? 'Certified & Completed' : isMastered ? 'Mark Lesson Complete' : 'Exam Gate: Score >=80% to Unlock'}</span>
              </button>

              <Link
                to="/stage/0/lesson/operating-systems"
                className="px-4 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-slate-100 text-xs font-mono transition"
              >
                &larr; Back to Lesson 3: Operating Systems
              </Link>

              <Link
                to="/stage/0"
                className="px-4 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-slate-100 text-xs font-mono transition"
              >
                Return to Stage 0 Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Table of Contents */}
        <div className="hidden lg:block sticky top-20 space-y-4">
          <ScrollAwareTOC sections={tocSections} />

          <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border text-[11px] font-mono text-slate-400 space-y-1.5">
            <span className="font-bold text-slate-200 block">18-Point Framework Active</span>
            <p className="leading-relaxed text-[10px]">
              TOC continuously synchronizes with active viewport scroll position and updates reading progress.
            </p>
          </div>
        </div>
      </div>

      {/* Persistent Notes Drawer */}
      <LessonNotesDrawer
        isOpen={isNotesOpen}
        onClose={closeNotes}
        lessonPath={currentPath}
        lessonTitle={TOOLING_LESSON_CONTENT.title}
      />
    </div>
  );
};

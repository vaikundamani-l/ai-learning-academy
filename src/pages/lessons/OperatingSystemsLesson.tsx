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
  HardDrive,
  Activity
} from 'lucide-react';
import { Stage } from '../../types/curriculum';
import { useProgress } from '../../context/ProgressContext';
import { MathBlock } from '../../components/learning/MathBlock';
import { CodeBlock } from '../../components/learning/CodeBlock';
import { Callout } from '../../components/learning/Callout';
import { ScrollAwareTOC } from '../../components/learning/ScrollAwareTOC';
import { LessonNotesDrawer } from '../../components/learning/LessonNotesDrawer';
import { LessonHeader } from '../../components/learning/LessonHeader';
import { AssessmentGate } from '../../components/learning/AssessmentGate';

// 3 Interactive Visualizers
import { ProcessLifecycleSimulator } from '../../components/visual/os/ProcessLifecycleSimulator';
import { VirtualMemoryVisualizer } from '../../components/visual/os/VirtualMemoryVisualizer';
import { PosixPermissionsVisualizer } from '../../components/visual/os/PosixPermissionsVisualizer';

// Structured Pedagogical Content
import { OS_LESSON_CONTENT } from '../../data/osLessonContent';

interface OperatingSystemsLessonProps {
  stage: Stage;
  currentPath: string;
}

export const OperatingSystemsLesson: React.FC<OperatingSystemsLessonProps> = ({ stage, currentPath }) => {
  const { progress, markLessonCompleted } = useProgress();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const closeNotes = useCallback(() => setIsNotesOpen(false), []);
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  const completed = progress.completedLessons.includes(currentPath);
  const recordedScore = progress.assessmentScores[currentPath];
  const isMastered = (recordedScore !== undefined && recordedScore >= 80) || completed;

  // 18-Point Framework Table of Contents
  const tocSections = [
    { id: 'objectives', title: '1. Learning Objectives' },
    { id: 'prereqs', title: '2. Prerequisites & Assumptions' },
    { id: 'history', title: '3. History of Operating Systems' },
    { id: 'kernel-arch', title: '4. Kernel Architecture & System Calls' },
    { id: 'process-anatomy', title: '5. Virtual Address Space Anatomy' },
    { id: 'pcb-lifecycle', title: '6. Process Control Block & Lifecycle' },
    { id: 'process-sim-lab', title: '7. Interactive Process State Lab' },
    { id: 'fork-exec', title: '8. Fork, Execve, COW & Zombies' },
    { id: 'threads-concurrency', title: '9. Threads, Race Conditions & Mutexes' },
    { id: 'virtual-memory-theory', title: '10. Virtual Memory & 4KB Paging' },
    { id: 'tlb-caching', title: '11. TLB Caching & Multi-Level Tables' },
    { id: 'virtual-memory-lab', title: '12. Interactive MMU Translation Lab' },
    { id: 'filesystems-inodes', title: '13. Linux Inodes & Hard vs Soft Links' },
    { id: 'posix-permissions', title: '14. POSIX Permissions & SUID Bits' },
    { id: 'posix-permissions-lab', title: '15. Interactive Permissions Lab' },
    { id: 'c-process-code', title: '16. C Fork & Pthread Implementation' },
    { id: 'python-proc-maps', title: '17. Python /proc/self/maps Inspector' },
    { id: 'assessment', title: '18. Diagnostic Mastery Exam' },
    { id: 'exercises', title: '19. Practical Hands-On Exercises' },
  ];

  const toggleHint = (exerciseId: number) => {
    setRevealedHints((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  return (
    <div className="space-y-8 pb-16 max-w-full min-w-0">
      {/* Top Header Bar */}
      <LessonHeader
        stageNumber={OS_LESSON_CONTENT.stageNumber}
        lessonIndex={3}
        totalLessons={4}
        estimatedReadTime={OS_LESSON_CONTENT.estimatedReadTime}
        title={OS_LESSON_CONTENT.title}
        currentPath={currentPath}
        onOpenNotes={() => setIsNotesOpen(true)}
      />

      <details className="lg:hidden rounded-xl border border-surface-border bg-surface-card p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-200">Jump to an OS lesson section</summary>
        <ScrollAwareTOC sections={tocSections} className="mt-3" />
      </details>
      <div className="rounded-xl border border-surface-border p-4 text-sm text-slate-400 space-y-2">
        <p>Technical references for the reviewed models:</p>
        <div className="flex flex-wrap gap-3">
          <a className="text-cyber-sky underline" href="https://www.kernel.org/doc/html/latest/arch/x86/x86_64/mm.html">Linux x86-64 memory map</a>
          <a className="text-cyber-sky underline" href="https://www.kernel.org/doc/html/latest/mm/page_tables.html">Linux page tables</a>
          <a className="text-cyber-sky underline" href="https://man7.org/linux/man-pages/man2/waitpid.2.html">Process waiting and zombies</a>
          <a className="text-cyber-sky underline" href="https://man7.org/linux/man-pages/man2/chmod.2.html">File mode bits</a>
        </div>
      </div>
      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Lesson Content */}
        <div className="lg:col-span-3 space-y-12">

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
              Upon mastering this lesson, you will possess a rigorous mental and architectural model of how operating systems arbitrate hardware, isolate processes, manage virtual memory, and enforce filesystem access control:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {OS_LESSON_CONTENT.objectives.map((obj, idx) => (
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
              {OS_LESSON_CONTENT.prerequisites.map((req, idx) => (
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
              Historical Evolution: From Bare Metal Batch Systems to Modern Unix & Linux
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                In the 1950s, computers lacked operating systems entirely. Programmers reserved physical time slots, loaded machine code directly onto punched cards, and toggled switches on the front panel. In 1956, General Motors created the <strong>GM-NAA I/O system</strong> for the IBM 704—the earliest batch processing monitor that automatically loaded the next job when the current punch-card routine completed.
              </p>
              <p>
                In the 1960s, MIT, Bell Labs, and General Electric initiated <strong>Multics (Multiplexed Information and Computing Service)</strong>, introducing revolutionary concepts: timesharing, hierarchical file systems, dynamic linking, and ring-oriented hardware security. Although Multics proved excessively complex for the hardware of its era, its pioneers—Ken Thompson, Dennis Ritchie, and Brian Kernighan at Bell Labs—distilled its brilliant insights into <strong>Unix</strong> in 1969 on a scavenged PDP-7 minicomputer.
              </p>
              <p>
                Unix established two immutable paradigms that dominate modern systems:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                <li>
                  <strong>Everything is a File:</strong> Devices, keyboards, network sockets, and disks are accessed through uniform stream operations (<code className="text-cyber-sky">open()</code>, <code className="text-cyber-sky">read()</code>, <code className="text-cyber-sky">write()</code>, <code className="text-cyber-sky">close()</code>).
                </li>
                <li>
                  <strong>Process Isolation & Composition:</strong> Small, single-purpose programs combined through text pipes (<code className="text-cyber-sky">|</code>).
                </li>
              </ul>
              <p>
                In 1991, Finnish university student Linus Torvalds released the <strong>Linux</strong> monolithic kernel, pairing it with GNU userland utilities to create the open-source operating system that now powers over 90% of cloud servers, supercomputers, Android smartphones, and AI training clusters worldwide.
              </p>
            </div>
          </section>

          {/* Section 4: Kernel Architecture */}
          <section id="kernel-arch" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Cpu className="w-4 h-4 text-cyber-sky" />
              <span>Section 4</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Kernel Architecture & The System Call Hardware Boundary
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                The operating system kernel is the core supervisor program executing with full hardware access. CPUs enforce a strict hardware privilege barrier:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
                <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2">
                  <div className="text-xs font-mono font-bold text-cyber-rose">Ring 3: User Space (Untrusted)</div>
                  <p className="text-xs text-slate-300">
                    Application programs execute here. Direct execution of privileged instructions (<code className="text-cyber-rose">cli</code>, <code className="text-cyber-rose">hlt</code>, modifying the <code className="text-cyber-rose">CR3</code> page table pointer) is hardware-blocked, instantly generating a General Protection Fault.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2">
                  <div className="text-xs font-mono font-bold text-cyber-emerald">Ring 0: Kernel Space (Supervisor)</div>
                  <p className="text-xs text-slate-300">
                    The OS kernel executes here with unrestricted access to memory, hardware ports, and interrupt controllers. Manages process scheduling, memory mapping, device drivers, and network stacks.
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-slate-200 text-sm pt-2">The System Call Hardware Transition</h4>
              <p>
                When a user application requires hardware I/O (such as writing to a file or transmitting a network packet), it cannot access hardware controllers directly. It must invoke a <strong>System Call (syscall)</strong>:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-300">
                <li>The C standard library loads the syscall number (e.g. 1 for <code className="text-cyber-sky">sys_write</code> on x86-64) into register <code className="text-cyber-sky">RAX</code>, and argument pointers into <code className="text-cyber-sky">RDI, RSI, RDX</code>.</li>
                <li>The CPU executes the <code className="text-cyber-sky font-bold">syscall</code> instruction.</li>
                <li>The hardware atomically transitions the privilege level from Ring 3 to Ring 0, saves user registers, and jumps to the kernel entry address registered in the <code className="text-cyber-sky">IA32_LSTAR</code> Model-Specific Register.</li>
                <li>The kernel verifies caller parameters, performs the I/O, places the return code into <code className="text-cyber-sky">RAX</code>, and executes <code className="text-cyber-sky font-bold">sysretq</code> to return to user space.</li>
              </ol>
            </div>
          </section>

          {/* Section 5: Process Anatomy */}
          <section id="process-anatomy" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-semibold text-xs tracking-wider uppercase">
              <Database className="w-4 h-4 text-cyber-emerald" />
              <span>Section 5</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Virtual Address Space Anatomy: Code, Data, BSS, Heap & Stack
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Linux gives each process its own user-space address mappings. A common x86-64 configuration with four-level paging has roughly 128 TB of user virtual address space. Kernel mappings occupy a separate high-half region. This schematic is not to scale; actual layouts depend on architecture, randomization, and kernel isolation settings:
              </p>

              <div className="p-4 rounded-xl bg-surface-card border border-surface-border font-mono text-xs space-y-2">
                <div className="p-2 rounded bg-surface border border-cyber-rose/30 flex justify-between">
                  <span className="text-cyber-rose font-bold">0xFFFFFFFF80000000: Kernel text example</span>
                  <span className="text-slate-400">High-half kernel region; layout and isolation settings vary</span>
                </div>
                <div className="p-2 rounded bg-surface border border-cyber-amber/30 flex justify-between">
                  <span className="text-cyber-amber font-bold">User Stack (&darr; Grows Downward)</span>
                  <span className="text-slate-400">Local variables, function call frames, return addresses</span>
                </div>
                <div className="p-2 rounded bg-surface border border-surface-border text-center text-slate-500 text-[10px]">
                  &uarr; Schematic gap: mapped regions, free ranges, and guard pages vary &darr;
                </div>
                <div className="p-2 rounded bg-surface border border-cyber-sky/30 flex justify-between">
                  <span className="text-cyber-sky font-bold">User Heap / Allocations (brk and mmap)</span>
                  <span className="text-slate-400">Dynamic runtime allocations (malloc / new)</span>
                </div>
                <div className="p-2 rounded bg-surface border border-surface-border flex justify-between">
                  <span className="text-slate-200">.bss Segment</span>
                  <span className="text-slate-400">Uninitialized global/static variables (Zeroed by kernel)</span>
                </div>
                <div className="p-2 rounded bg-surface border border-surface-border flex justify-between">
                  <span className="text-slate-200">.data Segment</span>
                  <span className="text-slate-400">Initialized global and static variables</span>
                </div>
                <div className="p-2 rounded bg-surface border border-cyber-emerald/30 flex justify-between">
                  <span className="text-cyber-emerald font-bold">.text Segment (Code)</span>
                  <span className="text-slate-400">Executable machine instructions (Read-Only + Executable)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: PCB & Lifecycle */}
          <section id="pcb-lifecycle" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Activity className="w-4 h-4 text-cyber-sky" />
              <span>Section 6</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              The Process Control Block (PCB) & The 5-State Process Lifecycle
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                In the Linux kernel, each process is represented by a massive C struct called <code className="text-cyber-sky">struct task_struct</code> (defined in <code className="text-cyber-sky">&lt;linux/sched.h&gt;</code>), commonly known as the <strong>Process Control Block (PCB)</strong>. It stores:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                <li><strong>PID & PPID:</strong> Unique Process ID and Parent Process ID.</li>
                <li><strong>CPU Registers:</strong> Saved register states (RAX, RBX, RSP, RIP, RFLAGS) when the process is suspended.</li>
                <li><strong>Memory Management:</strong> Pointer to the <code className="text-cyber-sky">mm_struct</code> holding the CR3 page table base register.</li>
                <li><strong>File Descriptor Table:</strong> Pointers to all opened files, sockets, and terminal pipes.</li>
                <li><strong>Scheduling Parameters:</strong> Priority, nice value, and virtual runtime (<code className="text-cyber-sky">vruntime</code>) used by the Completely Fair Scheduler (CFS).</li>
              </ul>
            </div>
          </section>

          {/* Section 7: Process Lifecycle Visualizer */}
          <section id="process-sim-lab" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Activity className="w-4 h-4 text-cyber-sky" />
              <span>Section 7 — Interactive Laboratory</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Interactive Process Lifecycle & PCB State Engine
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Use the simulator below to spawn child tasks via <code className="text-cyber-sky">fork()</code>, transition tasks between lifecycle states (READY, RUNNING, WAITING, TERMINATED), inspect PCB memory allocations, and view the kernel scheduler event stream.
            </p>

            <ProcessLifecycleSimulator />
          </section>

          {/* Section 8: Fork, Exec, COW & Zombies */}
          <section id="fork-exec" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <Terminal className="w-4 h-4 text-cyber-indigo" />
              <span>Section 8</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Process Creation: fork(), execve(), Copy-on-Write (COW) & Zombie Processes
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                In Unix, new processes are created through a two-step mechanism:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-300">
                <li>
                  <strong className="text-slate-100">fork():</strong> Clones the calling process. It returns <code className="text-cyber-sky">0</code> to the child process and returns the <em>child's PID</em> to the parent process.
                </li>
                <li>
                  <strong className="text-slate-100">execve():</strong> Overwrites the current process's address space with a completely new binary loaded from disk, reinitializing the instruction pointer to the binary's entry point.
                </li>
              </ol>

              <Callout type="deep-dive" title="Copy-on-Write (COW) Optimization">
                If <code className="font-mono">fork()</code> physically duplicated all 16 GB of a parent's RAM, process creation would be catastrophically slow. Instead, Linux employs <strong>Copy-on-Write (COW)</strong>: the child process initially shares the parent's exact physical page frames, with the MMU marking all pages as <strong>Read-Only</strong>. When either process attempts to write to a page, a hardware page fault occurs, prompting the kernel to allocate a new physical frame and copy only that single 4 KB page!
              </Callout>

              <Callout type="caution" title="Zombie & Orphan Processes">
                When a process executes <code className="font-mono">exit()</code>, it becomes a <strong>Zombie</strong>: its memory is freed, but its exit status remains in the kernel process table until its parent calls <code className="font-mono">wait()</code> or <code className="font-mono">waitpid()</code> to "reap" it. If the parent dies without reaping, the child becomes an <strong>Orphan</strong>, and is immediately adopted by PID 1 (<code className="font-mono">systemd</code> or <code className="font-mono">init</code>), which automatically reaps terminated zombies.
              </Callout>
            </div>
          </section>

          {/* Section 9: Threads & Concurrency */}
          <section id="threads-concurrency" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-amber font-mono font-semibold text-xs tracking-wider uppercase">
              <Layers className="w-4 h-4 text-cyber-amber" />
              <span>Section 9</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Threads, Shared Memory, Race Conditions & Mutex Locks
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                A <strong>Thread</strong> is a unit of execution scheduled on a CPU core. Unlike processes, threads within the same process <strong>share the exact same virtual address space, heap, and open files</strong>, but each retains its own private register state and call stack.
              </p>

              <h4 className="font-bold text-slate-200 text-sm pt-2">The Race Condition Problem</h4>
              <p>
                Consider a shared counter variable incremented by two concurrent threads:
              </p>

              <div className="p-3 rounded-lg bg-surface border border-surface-border font-mono text-xs space-y-1">
                <span className="text-slate-400">// Assembly instructions for counter++:</span><br />
                <span className="text-cyber-sky">1. MOV RAX, [counter]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Load current value from RAM to register</span><br />
                <span className="text-cyber-sky">2. ADD RAX, 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Increment register in ALU</span><br />
                <span className="text-cyber-sky">3. MOV [counter], RAX&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Store updated value back to RAM</span>
              </div>

              <p>
                If Thread 1 executes steps 1 and 2, but a timer interrupt context-switches to Thread 2 before step 3, Thread 2 reads the original value. Both threads compute <MathBlock math="X + 1" inline /> instead of <MathBlock math="X + 2" inline />. This critical concurrency defect is prevented by enclosing the update within a <strong>Mutual Exclusion Lock (Mutex)</strong>:
              </p>

              <MathBlock
                math="\text{Thread}_A: \text{Lock}(\text{mutex}) \implies \text{Critical Section} \implies \text{Unlock}(\text{mutex})"
                ariaLabel="Mutual exclusion lock synchronization pattern"
              />
            </div>
          </section>

          {/* Section 10: Virtual Memory Theory */}
          <section id="virtual-memory-theory" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Layers className="w-4 h-4 text-cyber-sky" />
              <span>Section 10</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Virtual Memory Architecture & 4 KB Page Translation
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Virtual Memory decouples application addresses from physical silicon RAM chips. Memory is carved into fixed-size blocks called <strong>Pages</strong> (typically 4096 bytes = 4 KB, requiring 12 offset bits).
              </p>

              <MathBlock
                math="2^{12} = 4096\text{ bytes} = 4\text{ KB Page Size}"
                ariaLabel="4 KB page offset calculation"
              />

              <p>
                Every Virtual Address issued by the CPU is partitioned into two fields:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                <li><strong>Virtual Page Number (VPN):</strong> The index into the process's Page Table.</li>
                <li><strong>Page Offset:</strong> The exact byte position within the 4 KB page (passed through unmodified to physical memory).</li>
              </ul>

              <MathBlock
                math="\text{Physical Address} = (\text{Physical Frame Number (PFN)} \ll 12) \mid \text{Page Offset}"
                ariaLabel="Physical address reconstruction formula"
              />
            </div>
          </section>

          {/* Section 11: TLB Caching */}
          <section id="tlb-caching" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <Cpu className="w-4 h-4 text-cyber-indigo" />
              <span>Section 11</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Translation Lookaside Buffer (TLB) & Multi-Level Page Tables
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Because traversing a page table requires reading memory from DRAM, doing so on every single memory reference would cut computer performance in half. To eliminate this penalty, CPUs contain the <strong>Translation Lookaside Buffer (TLB)</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                <li>An on-core, content-addressable SRAM cache holding recent VPN &rarr; PFN mappings.</li>
                <li>TLB hits resolve in a fraction of a nanosecond with zero DRAM traffic.</li>
                <li>When a process switch occurs, the kernel updates CR3, which flushes non-global TLB entries, incurring an initial cache miss spike.</li>
              </ul>
              <p>
                On modern 64-bit systems, a flat page table would require Terabytes of RAM per process. Operating systems solve this by utilizing <strong>Multi-Level Page Tables</strong> (4-level paging on x86-64: PML4 &rarr; PDPT &rarr; PD &rarr; PT), allocating page tables only for virtual address regions that are actually populated.
              </p>
            </div>
          </section>

          {/* Section 12: Virtual Memory Visualizer */}
          <section id="virtual-memory-lab" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Layers className="w-4 h-4 text-cyber-sky" />
              <span>Section 12 — Interactive Laboratory</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Interactive MMU & Page Table Translation Visualizer
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Test virtual-to-physical address translation in the simulator below. Toggle between Read and Write modes, inspect Page Table present bits, and trigger real-time Page Faults and Segmentation Faults.
            </p>

            <VirtualMemoryVisualizer />
          </section>

          {/* Section 13: Filesystems & Inodes */}
          <section id="filesystems-inodes" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-amber font-mono font-semibold text-xs tracking-wider uppercase">
              <HardDrive className="w-4 h-4 text-cyber-amber" />
              <span>Section 13</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Linux Filesystem Primitives: Inodes, Dirents, Hard Links & Soft Links
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                In Unix and Linux filesystems (such as ext4), files are not identified by their human-readable pathnames. Instead, every file is represented by a numerical <strong>Inode (Index Node)</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                <li>
                  An Inode stores: File type, permissions, owner UID/GID, size, link count, timestamps (<code className="text-cyber-sky">atime</code>, <code className="text-cyber-sky">mtime</code>, <code className="text-cyber-sky">ctime</code>), and physical disk block pointers.
                </li>
                <li>
                  Directories are simply special files whose data blocks contain a list of pairs: <code className="text-cyber-sky">(filename &rarr; inode_number)</code>.
                </li>
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
                <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2">
                  <div className="text-xs font-mono font-bold text-cyber-sky">Hard Links (ln target linkname)</div>
                  <p className="text-xs text-slate-300">
                    Creates an additional directory entry pointing to the <strong>exact same Inode</strong>. The Inode's link counter increments by 1. Both filenames are identical peers; deleting one leaves the data intact until all links are removed.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2">
                  <div className="text-xs font-mono font-bold text-cyber-emerald">Symbolic (Soft) Links (ln -s target linkname)</div>
                  <p className="text-xs text-slate-300">
                    Creates a <strong>brand new Inode</strong> whose data block contains the text string of the target path. Can span across different disk partitions. If the target file is moved or deleted, the symlink breaks.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 14: POSIX Permissions */}
          <section id="posix-permissions" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-semibold text-xs tracking-wider uppercase">
              <ShieldAlert className="w-4 h-4 text-cyber-emerald" />
              <span>Section 14</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              POSIX File Permissions, Octal chmod & Security Bits (SUID, SGID, Sticky)
            </h2>
            <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                Every Linux file mode is governed by a 12-bit binary bitmask representing three access scopes (Owner, Group, Others) across three fundamental permissions:
              </p>

              <div className="overflow-x-auto my-3 border border-surface-border rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-surface-elevated text-slate-200 border-b border-surface-border">
                    <tr>
                      <th className="p-2.5">Permission</th>
                      <th className="p-2.5">Binary Bit</th>
                      <th className="p-2.5">Octal Value</th>
                      <th className="p-2.5">Meaning on Regular Files</th>
                      <th className="p-2.5">Meaning on Directories</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border/50 text-slate-300">
                    <tr>
                      <td className="p-2.5 text-cyber-sky font-bold">r (Read)</td>
                      <td className="p-2.5">100</td>
                      <td className="p-2.5 text-cyber-amber font-bold">4</td>
                      <td className="p-2.5">Read file contents</td>
                      <td className="p-2.5">List directory entries (ls)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-cyber-sky font-bold">w (Write)</td>
                      <td className="p-2.5">010</td>
                      <td className="p-2.5 text-cyber-amber font-bold">2</td>
                      <td className="p-2.5">Modify file contents</td>
                      <td className="p-2.5">Create / delete files in directory</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-cyber-sky font-bold">x (Execute)</td>
                      <td className="p-2.5">001</td>
                      <td className="p-2.5 text-cyber-amber font-bold">1</td>
                      <td className="p-2.5">Run file as a program</td>
                      <td className="p-2.5">Enter directory (cd / path traversal)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="font-bold text-slate-200 text-sm pt-2">Special Security Bits (High 3 Bits)</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                <li>
                  <strong>SetUID (SUID — Octal 4000):</strong> Executes the binary with the privileges of the <em>file owner</em> rather than the executing user (e.g. <code className="text-cyber-sky">/usr/bin/passwd</code> runs as root so standard users can write to <code className="text-cyber-sky">/etc/shadow</code>).
                </li>
                <li>
                  <strong>SetGID (SGID — Octal 2000):</strong> Newly created files in a directory inherit the directory's group ownership rather than the user's primary group.
                </li>
                <li>
                  <strong>Sticky Bit (Octal 1000):</strong> In shared writable directories like <code className="text-cyber-sky">/tmp</code>, prevents users from deleting or renaming files owned by other users.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 15: POSIX Permissions Visualizer */}
          <section id="posix-permissions-lab" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <ShieldAlert className="w-4 h-4 text-cyber-sky" />
              <span>Section 15 — Interactive Laboratory</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Interactive POSIX Permissions, Inode & Octal Lab
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore live permission toggles across Owner, Group, and Others. Observe real-time octal conversions (<code className="text-cyber-sky">chmod 0755</code>), symbolic strings, and switch to the Inode tab to inspect file metadata layouts.
            </p>

            <PosixPermissionsVisualizer />
          </section>

          {/* Section 16: C Code Implementation */}
          <section id="c-process-code" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-sky font-mono font-semibold text-xs tracking-wider uppercase">
              <Cpu className="w-4 h-4 text-cyber-sky" />
              <span>Section 16 — Practical Verification</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Verifying Process Isolation & POSIX Threads in C11
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              The following tested C program demonstrates that child processes spawned via <code className="text-cyber-sky">fork()</code> maintain private memory (changes in child do not alter parent variables), while POSIX threads (<code className="text-cyber-sky">pthread_create</code>) share memory and require mutex synchronization:
            </p>

            <CodeBlock
              language="c"
              code={OS_LESSON_CONTENT.codeExamples.cProcessAndThreads}
              title="process_and_threads_demo.c"
            />
          </section>

          {/* Section 17: Python /proc/self/maps */}
          <section id="python-proc-maps" className="space-y-4">
            <div className="flex items-center space-x-2 text-cyber-indigo font-mono font-semibold text-xs tracking-wider uppercase">
              <Terminal className="w-4 h-4 text-cyber-indigo" />
              <span>Section 17 — Implementation From Scratch</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 border-b border-surface-border pb-2">
              Inspecting Linux Virtual Address Segments & Inodes in Python
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              This Python script inspects the running process's own virtual memory layout by reading the Linux virtual filesystem at <code className="text-cyber-sky">/proc/self/maps</code> and decodes real inode metadata using <code className="text-cyber-sky">os.stat()</code>:
            </p>

            <CodeBlock
              language="python"
              code={OS_LESSON_CONTENT.codeExamples.pythonProcMaps}
              title="inspect_memory_and_inodes.py"
            />
          </section>

          <Callout type="note" title="What this completion gate measures">
            The quiz checks conceptual recall and reasoning. Passing it records lesson progress; it does not verify that you completed the programming exercises or demonstrate practical mastery.
          </Callout>
          {/* Section 18: Diagnostic Mastery Exam */}
          {/* Section 18: Diagnostic Mastery Exam */}
          <AssessmentGate
            currentPath={currentPath}
            lessonTitle={OS_LESSON_CONTENT.title}
            sectionNumber={18}
            questions={OS_LESSON_CONTENT.quizQuestions}
          />

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
                Solidify your understanding by solving these three practical OS and memory engineering challenges:
              </p>
            </div>

            <div className="space-y-4">
              {OS_LESSON_CONTENT.exercises.map((ex) => (
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
              {isMastered ? 'Stage 0 Operating System Primitives Mastered!' : 'Complete the Diagnostic Exam to Certify Mastery'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {isMastered
                ? 'You have demonstrated certified architectural understanding across all OS primitives: process isolation, pthreads, mutex synchronization, MMU virtual address translation, and POSIX filesystem inodes.'
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
                <span>{completed ? 'Lesson Completed' : isMastered ? 'Mark Lesson Complete' : 'Exam Gate: Score >=80% to Unlock'}</span>
              </button>

              <Link
                to="/stage/0/lesson/binary-data-representation"
                className="px-4 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-slate-100 text-xs font-mono transition"
              >
                &larr; Back to Lesson 2: Memory & Binary Data
              </Link>

              <Link
                to="/stage/0/lesson/developer-tooling"
                className="px-4 py-2 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition"
              >
                Proceed to Lesson 4: Developer Tooling & Git &rarr;
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
        lessonTitle={OS_LESSON_CONTENT.title}
      />
    </div>
  );
};

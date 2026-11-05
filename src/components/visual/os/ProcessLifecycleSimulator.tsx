import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Activity, Cpu, Layers, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProcessControlBlock, ProcessState, canTransitionProcess, transitionProcess } from '../../../utils/os';

const initialProcesses = (): ProcessControlBlock[] => [
    {
      pid: 101,
      ppid: 1,
      name: 'python3_inference',
      state: 'RUNNING',
      programCounter: 0x4012A0,
      priority: 20,
      cpuTimeUsed: 42,
      openFiles: [0, 1, 2, 3],
      memoryBytes: 16777216,
    },
    {
      pid: 102,
      ppid: 101,
      name: 'worker_thread_pool',
      state: 'READY',
      programCounter: 0x4018F0,
      priority: 20,
      cpuTimeUsed: 18,
      openFiles: [0, 1, 2],
      memoryBytes: 8388608,
    },
    {
      pid: 103,
      ppid: 1,
      name: 'postgres_logger',
      state: 'WAITING',
      programCounter: 0x510040,
      priority: 15,
      cpuTimeUsed: 95,
      openFiles: [0, 1, 2, 4, 5],
      memoryBytes: 33554432,
    },
  ];

export const ProcessLifecycleSimulator: React.FC = () => {
  const [processes, setProcesses] = useState<ProcessControlBlock[]>(initialProcesses);

  const nextPidRef = useRef(104);
  const [selectedPid, setSelectedPid] = useState<number>(101);
  const [eventLog, setEventLog] = useState<string[]>([
    'Kernel booted: PID 1 (systemd) initialized.',
    'PID 101 spawned via fork() -> State set to READY.',
    'Teaching scheduler dispatched PID 101 to CPU Core 0 -> State RUNNING.',
  ]);

  const selectedProcess = processes.find((p) => p.pid === selectedPid) || processes[0];

  const logEvent = (msg: string) => {
    setEventLog((prev) => [msg, ...prev.slice(0, 7)]);
  };

  const handleStateChange = (targetState: ProcessState) => {
    if (!canTransitionProcess(selectedProcess.state, targetState)) return;
    setProcesses(prev => transitionProcess(prev, selectedPid, targetState));
    logEvent(`PID ${selectedPid} (${selectedProcess.name}) transitioned to ${targetState}.`);
  };

  const handleSpawn = () => {
    if (selectedProcess.state === 'TERMINATED') return;
    const nextPid = nextPidRef.current++;
    const newProc: ProcessControlBlock = {
      pid: nextPid,
      ppid: selectedProcess.pid,
      name: `child_task_${nextPid}`,
      state: 'READY',
      programCounter: 0x400000,
      priority: 20,
      cpuTimeUsed: 0,
      openFiles: [...selectedProcess.openFiles],
      memoryBytes: selectedProcess.memoryBytes,
    };
    setProcesses((prev) => [...prev, newProc]);
    setSelectedPid(nextPid);
    logEvent(`fork(): PID ${selectedProcess.pid} spawned child PID ${nextPid} into READY queue.`);
  };

  const handleKill = () => handleStateChange('TERMINATED');
  const handleReap = () => {
    if (selectedProcess.state !== 'TERMINATED' || processes.length <= 1) return;
    const remaining = processes.filter(process => process.pid !== selectedPid);
    setProcesses(remaining); setSelectedPid(remaining[0].pid);
    logEvent(`Parent/reaper collected PID ${selectedPid}'s exit status and removed its PCB.`);
  };

  const states: { id: ProcessState; label: string; desc: string; color: string }[] = [
    { id: 'NEW', label: '1. NEW', desc: 'Process is being created and PCB allocated', color: 'border-slate-500 text-slate-400' },
    { id: 'READY', label: '2. READY', desc: 'Loaded into RAM, queued for CPU scheduling', color: 'border-cyber-sky text-cyber-sky bg-cyber-sky/10' },
    { id: 'RUNNING', label: '3. RUNNING', desc: 'Instructions actively executing on CPU core', color: 'border-cyber-emerald text-cyber-emerald bg-cyber-emerald/10' },
    { id: 'WAITING', label: '4. WAITING', desc: 'Blocked awaiting I/O or sync mutex', color: 'border-cyber-amber text-cyber-amber bg-cyber-amber/10' },
    { id: 'TERMINATED', label: '5. TERMINATED', desc: 'Halted, awaiting parent waitpid() reaping', color: 'border-cyber-rose text-cyber-rose bg-cyber-rose/10' },
  ];

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-6">
      <p className="text-sm text-slate-400">A single-core teaching model. Exit releases memory and files but leaves a zombie PCB until the simulated parent/reaper collects its status. Fork copies the displayed resources; copy-on-write is not simulated.</p>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyber-sky" />
            <span>Interactive Process Lifecycle & PCB State Engine</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step through process scheduling, context transitions, PCB data inspection, and system call events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={selectedProcess.state === 'TERMINATED'}
            onClick={handleSpawn}
            className="px-3 py-1.5 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition"
          >
            + fork() Child
          </button>
          <button
            onClick={handleKill}
            disabled={selectedProcess.state === 'TERMINATED'}
            className="px-3 py-1.5 rounded-lg bg-surface border border-cyber-rose/40 text-cyber-rose text-xs font-mono hover:bg-cyber-rose/10 transition disabled:opacity-40"
          >
            kill -9 PID
          </button>
          <button onClick={() => { setProcesses(initialProcesses()); setSelectedPid(101); nextPidRef.current = 104; setEventLog(['Teaching model reset. PID 101 is RUNNING.']); }} className="px-3 py-1.5 rounded-lg border border-surface-border text-xs text-slate-200">Reset processes</button>
          <button onClick={handleReap} disabled={selectedProcess.state !== 'TERMINATED' || processes.length <= 1}
            className="px-3 py-1.5 rounded-lg border border-surface-border text-xs text-slate-200">Reap exited PID</button>
        </div>
      </div>

      {/* 5-State Transition Diagram Flow */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Process Execution State Machine
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {states.map((st) => {
            const countInState = processes.filter((p) => p.state === st.id).length;
            const isSelectedHere = selectedProcess.state === st.id;

            return (
              <div
                key={st.id}
                className={`p-3.5 rounded-xl border transition space-y-2 relative ${
                  isSelectedHere
                    ? `${st.color} shadow-lg ring-2 ring-current`
                    : 'bg-surface border-surface-border text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs">{st.label}</span>
                  {countInState > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-surface border border-surface-border text-slate-200">
                      {countInState} proc
                    </span>
                  )}
                </div>
                <p className="text-[10px] leading-relaxed text-slate-300 font-sans">
                  {st.desc}
                </p>
                {isSelectedHere && (
                  <div className="text-[10px] font-mono font-bold flex items-center space-x-1 text-slate-100">
                    <CheckCircle2 className="w-3 h-3 text-current" />
                    <span>PID {selectedProcess.pid} Active</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* State Transition Actions */}
      <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3">
        <div className="text-xs font-mono text-slate-300 font-bold flex items-center justify-between">
          <span>Transition Selected Process (PID {selectedProcess.pid}):</span>
          <span className="text-cyber-sky font-normal text-[11px]">Current State: {selectedProcess.state}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            disabled={!canTransitionProcess(selectedProcess.state, 'READY')}
            onClick={() => handleStateChange('READY')}
            className="px-3 py-1.5 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-elevated text-xs font-mono text-slate-200 transition"
          >
            Admit / Wake / Preempt &rarr; READY
          </button>
          <button
            disabled={!canTransitionProcess(selectedProcess.state, 'RUNNING')}
            onClick={() => handleStateChange('RUNNING')}
            className="px-3 py-1.5 rounded-lg border border-cyber-emerald/40 bg-cyber-emerald/10 text-cyber-emerald text-xs font-mono hover:bg-cyber-emerald/20 transition font-bold"
          >
            Scheduler Dispatch &rarr; RUNNING
          </button>
          <button
            disabled={!canTransitionProcess(selectedProcess.state, 'WAITING')}
            onClick={() => handleStateChange('WAITING')}
            className="px-3 py-1.5 rounded-lg border border-cyber-amber/40 bg-cyber-amber/10 text-cyber-amber text-xs font-mono hover:bg-cyber-amber/20 transition"
          >
            I/O Request / Sleep &rarr; WAITING
          </button>
          <button
            disabled={!canTransitionProcess(selectedProcess.state, 'TERMINATED')}
            onClick={() => handleStateChange('TERMINATED')}
            className="px-3 py-1.5 rounded-lg border border-cyber-rose/40 bg-cyber-rose/10 text-cyber-rose text-xs font-mono hover:bg-cyber-rose/20 transition"
          >
            exit(0) &rarr; TERMINATED (Zombie)
          </button>
        </div>
      </div>

      {/* Two Column Layout: Process List & PCB Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Process Selector Table */}
        <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Teaching Process List (simplified PCB)
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {processes.map((proc) => (
              <button
                key={proc.pid}
                onClick={() => setSelectedPid(proc.pid)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition flex flex-wrap gap-2 items-center justify-between ${
                  proc.pid === selectedPid
                    ? 'bg-cyber-sky/15 border-cyber-sky text-slate-100 font-bold'
                    : 'bg-surface-card border-surface-border text-slate-300 hover:bg-surface-elevated'
                }`}
              >
                <div className="min-w-0 flex flex-wrap items-center gap-2">
                  <span className="text-cyber-sky">PID {proc.pid}</span>
                  <span className="text-slate-400">({proc.name})</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    proc.state === 'RUNNING'
                      ? 'bg-cyber-emerald/20 text-cyber-emerald'
                      : proc.state === 'READY'
                      ? 'bg-cyber-sky/20 text-cyber-sky'
                      : proc.state === 'WAITING'
                      ? 'bg-cyber-amber/20 text-cyber-amber'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {proc.state}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected PCB Inspector Card */}
        <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-surface-border pb-2">
            <span className="font-bold text-slate-100 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyber-sky" />
              <span>PCB: PID {selectedProcess.pid}</span>
            </span>
            <span className="text-[10px] text-slate-400">Parent PID: {selectedProcess.ppid}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-surface border border-surface-border">
              <span className="text-slate-500 block text-[9px] uppercase">Program Counter</span>
              <span className="text-cyber-emerald font-bold">0x{selectedProcess.programCounter.toString(16).toUpperCase()}</span>
            </div>
            <div className="p-2 rounded bg-surface border border-surface-border">
              <span className="text-slate-500 block text-[9px] uppercase">Memory Allocated</span>
              <span className="text-cyber-sky font-bold">{(selectedProcess.memoryBytes / 1024 / 1024).toFixed(1)} MB</span>
            </div>
            <div className="p-2 rounded bg-surface border border-surface-border">
              <span className="text-slate-500 block text-[9px] uppercase">CPU Ticks Used</span>
              <span className="text-cyber-amber font-bold">{selectedProcess.cpuTimeUsed} ticks</span>
            </div>
            <div className="p-2 rounded bg-surface border border-surface-border">
              <span className="text-slate-500 block text-[9px] uppercase">File Descriptors</span>
              <span className="text-slate-200">[{selectedProcess.openFiles.join(', ')}]</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 pt-1 leading-relaxed">
            <strong>Context Switch Impact:</strong> This simplified single-core model saves execution state and allows only one RUNNING process. It does not simulate Linux scheduling policy, virtual runtime, or TLB behavior.
          </div>
        </div>
      </div>

      {/* Kernel Event Stream */}
      <div className="p-3 rounded-xl bg-surface border border-surface-border font-mono text-xs space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Terminal className="w-3 h-3 text-cyber-emerald" />
          <span>Kernel Scheduler Event Log</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-300">
          {eventLog.map((ev, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <span className="text-cyber-sky font-bold">&gt;</span>
              <span>{ev}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

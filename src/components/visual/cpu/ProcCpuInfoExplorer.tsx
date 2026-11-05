import React, { useState } from 'react';
import { Terminal, Search, Info, Check, Shield, Cpu } from 'lucide-react';

interface CpuFlag {
  name: string;
  category: 'Security' | 'Vector' | 'Virtualization' | 'Core' | 'Memory';
  description: string;
}

export const ProcCpuInfoExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parsed' | 'raw' | 'commands'>('parsed');
  const [flagFilter, setFlagFilter] = useState('');
  const [selectedFlag, setSelectedFlag] = useState<CpuFlag | null>(null);

  // Standard important Linux CPU flags
  const flagsDatabase: CpuFlag[] = [
    { name: 'lm', category: 'Core', description: 'Long Mode: 64-bit CPU architecture support (AMD64 / Intel 64).' },
    { name: 'vmx', category: 'Virtualization', description: 'Intel VT-x hardware-assisted virtualization extensions (SVM on AMD).' },
    { name: 'avx2', category: 'Vector', description: 'Advanced Vector Extensions 2: 256-bit wide SIMD vector math operations.' },
    { name: 'fma', category: 'Vector', description: 'Fused Multiply-Add: computes (A × B) + C in a single floating-point cycle.' },
    { name: 'aes', category: 'Security', description: 'Hardware acceleration for Advanced Encryption Standard cryptographic rounds.' },
    { name: 'smep', category: 'Security', description: 'Supervisor Mode Execution Prevention: prevents kernel from executing user-space code.' },
    { name: 'smap', category: 'Security', description: 'Supervisor Mode Access Prevention: prevents kernel from accessing user memory unexpectedly.' },
    { name: 'nx', category: 'Security', description: 'No-Execute bit: hardware DEP marking pages (like stack) as non-executable to prevent exploits.' },
    { name: 'ht', category: 'Core', description: 'Hyper-Threading: provides 2 logical threads per physical CPU core.' },
    { name: 'sse4_2', category: 'Vector', description: 'Streaming SIMD Extensions 4.2 with CRC32 and text processing instructions.' },
    { name: 'tsc', category: 'Core', description: 'Time Stamp Counter: monotonic hardware cycle counter for high-resolution profiling.' },
    { name: 'pae', category: 'Memory', description: 'Physical Address Extension: enables 36-bit or greater physical memory addressing.' },
  ];

  const filteredFlags = flagsDatabase.filter(
    (f) =>
      f.name.toLowerCase().includes(flagFilter.toLowerCase()) ||
      f.description.toLowerCase().includes(flagFilter.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyber-sky" />
            <span>Linux CPU Investigation Workbench: /proc/cpuinfo & lscpu</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactively explore the Linux kernel virtual filesystem representation of processor hardware capabilities.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex items-center space-x-1 bg-surface border border-surface-border rounded-lg p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('parsed')}
            className={`px-3 py-1 rounded transition ${
              activeTab === 'parsed' ? 'bg-cyber-sky text-void font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Parsed Fields
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1 rounded transition ${
              activeTab === 'raw' ? 'bg-cyber-sky text-void font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Virtual File
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className={`px-3 py-1 rounded transition ${
              activeTab === 'commands' ? 'bg-cyber-sky text-void font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Linux CLI Drills
          </button>
        </div>
      </div>

      {/* Tab: Parsed Fields */}
      {activeTab === 'parsed' && (
        <div className="space-y-4 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Processor Identification</div>
              <div className="text-slate-100 font-bold">x86_64 High-Performance Core</div>
              <div className="text-slate-400 text-[11px] pt-1">
                Vendor: <span className="text-cyber-sky">GenuineIntel</span> | Family: 6 | Model: 158
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Dynamic Frequency & Stepping</div>
              <div className="text-slate-100 font-bold">3400.000 MHz (Turbo to 4.8 GHz)</div>
              <div className="text-slate-400 text-[11px] pt-1">
                Stepping: 10 | Bogomips: 6799.88
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">On-Die Cache Capacity</div>
              <div className="text-slate-100 font-bold">12288 KB (12 MB Smart Cache)</div>
              <div className="text-slate-400 text-[11px] pt-1">
                L1d: 32 KB | L1i: 32 KB | L2: 256 KB | L3: 12 MB
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Topology & SMT</div>
              <div className="text-slate-100 font-bold">8 Physical Cores / 16 SMT Threads</div>
              <div className="text-slate-400 text-[11px] pt-1">
                Siblings: 16 | Core ID: 0 | APIC ID: 0
              </div>
            </div>
          </div>

          {/* Interactive Flags Explorer */}
          <div className="p-4 rounded-xl border border-surface-border bg-surface space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-cyber-amber" />
                <span className="text-xs font-bold text-slate-200">
                  Instruction Set Architecture & Security Flags Explorer
                </span>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Filter flags (e.g. avx, smep)..."
                  value={flagFilter}
                  onChange={(e) => setFlagFilter(e.target.value)}
                  className="pl-8 pr-3 py-1 rounded bg-surface-elevated border border-surface-border text-xs text-slate-200 focus:outline-none focus:border-cyber-sky"
                />
              </div>
            </div>

            {/* Flags Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filteredFlags.map((flg) => {
                const isSelected = selectedFlag?.name === flg.name;
                return (
                  <button
                    key={flg.name}
                    onClick={() => setSelectedFlag(flg)}
                    className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'border-cyber-amber bg-cyber-amber/15 shadow'
                        : 'border-surface-border bg-surface-card hover:bg-surface-elevated text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-xs">{flg.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-surface border border-surface-border text-slate-400">
                      {flg.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Flag Detail Card */}
            {selectedFlag && (
              <div className="p-3 rounded-lg bg-cyber-amber/10 border border-cyber-amber/40 text-xs text-slate-200 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-cyber-amber text-sm">{selectedFlag.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-surface font-bold text-slate-300">
                    Category: {selectedFlag.category}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{selectedFlag.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Raw /proc/cpuinfo Virtual File */}
      {activeTab === 'raw' && (
        <div className="p-4 rounded-xl bg-void border border-surface-border font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          <pre>{`processor	: 0
vendor_id	: GenuineIntel
cpu family	: 6
model		: 158
model name	: Intel(R) Core(TM) i7-8700K CPU @ 3.70GHz
stepping	: 10
microcode	: 0xde
cpu MHz		: 3696.000
cache size	: 12288 KB
physical id	: 0
siblings	: 12
core id		: 0
cpu cores	: 6
apicid		: 0
initial apicid	: 0
fpu		: yes
fpu_exception	: yes
cpuid level	: 22
wp		: yes
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 hle avx2 smep bmi2 erms invpcid rtm mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities
bugs		: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds
bogomips	: 7392.00
clflush size	: 64
cache_alignment	: 64
address sizes	: 39 bits physical, 48 bits virtual
power management:`}</pre>
        </div>
      )}

      {/* Tab: Practical Linux CLI Drills */}
      {activeTab === 'commands' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl border border-surface-border bg-surface space-y-1.5">
            <div className="text-cyber-sky font-bold flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>1. View high-level CPU architecture summary:</span>
            </div>
            <div className="p-2 rounded bg-void text-slate-200 border border-surface-border">
              $ lscpu
            </div>
            <p className="text-slate-400 text-[11px]">
              Reports byte order (Little Endian), virtualization type, vulnerability mitigations, and cache topologies.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-surface-border bg-surface space-y-1.5">
            <div className="text-cyber-sky font-bold flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>2. Check for Hardware Virtualization (VMX/SVM) support:</span>
            </div>
            <div className="p-2 rounded bg-void text-slate-200 border border-surface-border">
              $ grep -E --color=auto 'vmx|svm' /proc/cpuinfo
            </div>
            <p className="text-slate-400 text-[11px]">
              If non-empty, your CPU supports hardware virtualization for KVM and hypervisors.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-surface-border bg-surface space-y-1.5">
            <div className="text-cyber-sky font-bold flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>3. Profile hardware CPU cycles and instruction retirement in real time:</span>
            </div>
            <div className="p-2 rounded bg-void text-slate-200 border border-surface-border">
              $ perf stat -e cycles,instructions,cache-misses,branch-misses ./my_program
            </div>
            <p className="text-slate-400 text-[11px]">
              Calculates real hardware IPC (Instructions Per Cycle) and branch misprediction rates via hardware performance counters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Layers, Database, HardDrive, Network, Clock, Zap, Info } from 'lucide-react';

interface TierData {
  id: string;
  name: string;
  latencyNs: number;
  cycles: string;
  typicalCapacity: string;
  technology: string;
  humanScale: string;
  description: string;
  costTier: string;
  color: string;
}

export const MemoryPyramidVisualizer: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<string>('l1');

  const tiers: TierData[] = [
    {
      id: 'reg',
      name: 'CPU Registers',
      latencyNs: 0.5,
      cycles: '0 - 1 Cycle',
      typicalCapacity: '1 - 2 KB',
      technology: 'Dual-port Static RAM (SRAM) flip-flops on core datapath',
      humanScale: '0.5 second (one heart beat)',
      description: 'The fastest storage in the computer. Located directly inside execution units, feeding immediate operands to ALU adders.',
      costTier: 'Extreme ($$$$$ on die)',
      color: '#38bdf8',
    },
    {
      id: 'l1',
      name: 'L1 Cache (Split L1i / L1d)',
      latencyNs: 1.0,
      cycles: '3 - 4 Cycles',
      typicalCapacity: '64 - 128 KB per core',
      technology: 'On-die 6-transistor (6T) SRAM cells with multi-way tag matchers',
      humanScale: '1.0 second',
      description: 'Split into dedicated Instruction Cache (L1i) and Data Cache (L1d) to avoid Von Neumann bus contention during pipeline fetch.',
      costTier: 'Very High ($$$$)',
      color: '#38bdf8',
    },
    {
      id: 'l2',
      name: 'L2 Cache (Non-inclusive / Inclusive)',
      latencyNs: 3.5,
      cycles: '12 - 14 Cycles',
      typicalCapacity: '512 KB - 2 MB per core',
      technology: 'Dedicated on-die SRAM buffer per physical core',
      humanScale: '3.5 seconds',
      description: 'Backs up L1 cache misses. Balances larger capacity with fast pipelined latency.',
      costTier: 'High ($$$)',
      color: '#818cf8',
    },
    {
      id: 'l3',
      name: 'L3 Cache (Last Level Cache - LLC)',
      latencyNs: 12.0,
      cycles: '40 - 60 Cycles',
      typicalCapacity: '16 - 96 MB shared',
      technology: 'Shared on-die / 3D-stacked SRAM interposer (e.g. AMD 3D V-Cache)',
      humanScale: '12 seconds',
      description: 'Shared across all physical CPU cores on a die. Employs MESI/MOESI cache coherence protocols to keep multi-core memory coherent.',
      costTier: 'Moderate-High ($$)',
      color: '#818cf8',
    },
    {
      id: 'ram',
      name: 'Main Memory (DDR4 / DDR5 DRAM)',
      latencyNs: 70.0,
      cycles: '~200 - 250 Cycles',
      typicalCapacity: '16 - 128 GB',
      technology: '1-transistor 1-capacitor (1T-1C) Dynamic RAM requiring periodic electrical refresh (every 64ms)',
      humanScale: '1.2 minutes (grabbing a cup of water)',
      description: 'Off-chip physical RAM. Access incurs substantial CPU pipeline stalls unless mitigated by hardware prefetchers and out-of-order execution.',
      costTier: 'Moderate ($4 - $6 / GB)',
      color: '#f59e0b',
    },
    {
      id: 'nvme',
      name: 'NVMe Solid-State Drive (SSD)',
      latencyNs: 15000.0, // 15 us
      cycles: '~50,000 Cycles',
      typicalCapacity: '512 GB - 4 TB',
      technology: 'NAND Flash memory (TLC / QLC 3D charge trap cells via PCIe Gen4/Gen5 bus)',
      humanScale: '4.2 hours (half a workday)',
      description: 'Non-volatile persistent storage. Accessed via the OS kernel page cache and filesystem block drivers.',
      costTier: 'Low (~$0.10 / GB)',
      color: '#10b981',
    },
    {
      id: 'network',
      name: 'Network / Cloud Datacenter Hop',
      latencyNs: 50000000.0, // 50 ms
      cycles: '~160,000,000 Cycles',
      typicalCapacity: 'Virtually Infinite (Cloud S3 / WAN)',
      technology: 'Optical fiber light transmission, IP packet routing, TLS encryption',
      humanScale: '1.6 years!',
      description: 'Accessing an external database or microservice over WAN. Illustrates why in-memory caching (Redis/Memcached) is paramount in high-scale systems.',
      costTier: 'Bandwidth & egress costs',
      color: '#ec4899',
    },
  ];

  const selectedTier = tiers.find((t) => t.id === selectedTierId) || tiers[0];

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyber-sky" />
            <span>The Memory Hierarchy Latency Pyramid & Human Time Scale</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare access times across registers, cache levels, DRAM, NVMe SSDs, and network hops.
          </p>
        </div>

        <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyber-amber/15 text-cyber-amber border border-cyber-amber/30">
          Latency Numbers Every Engineer Must Know
        </span>
      </div>

      {/* Main Pyramid and Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono">
        {/* Pyramid Staircase Visual (7 columns) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 px-1 flex items-center justify-between">
            <span>MEMORY HIERARCHY TIERS (FASTEST TO SLOWEST)</span>
            <span>Click tier to inspect</span>
          </div>

          <div className="space-y-1.5">
            {tiers.map((tier, idx) => {
              const isSelected = tier.id === selectedTierId;
              // Width decreases as speed increases
              const widthPercents = [40, 50, 60, 70, 80, 90, 100];
              const w = widthPercents[idx];

              return (
                <div key={tier.id} className="w-full flex justify-center">
                  <button
                    onClick={() => setSelectedTierId(tier.id)}
                    style={{ width: `${w}%` }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'border-cyber-sky bg-cyber-sky/15 shadow-md shadow-cyber-sky/10'
                        : 'border-surface-border bg-surface hover:bg-surface-elevated text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-100 flex items-center space-x-2">
                        <span>{tier.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{tier.typicalCapacity}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-cyber-amber">{tier.cycles}</div>
                      <div className="text-[10px] text-slate-500">
                        {tier.latencyNs < 1000 ? `${tier.latencyNs} ns` : tier.latencyNs < 1000000 ? `${tier.latencyNs / 1000} µs` : `${tier.latencyNs / 1000000} ms`}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Tier Detail Inspector Card (5 columns) */}
        <div className="lg:col-span-5 p-4 rounded-xl border border-surface-border bg-surface space-y-4">
          <div className="border-b border-surface-border pb-3">
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-sky/15 text-cyber-sky border border-cyber-sky/30 uppercase font-bold">
              Tier Inspection
            </span>
            <h4 className="text-sm font-bold text-slate-100 mt-1">{selectedTier.name}</h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border flex items-center justify-between">
              <span className="text-slate-400">Physical Latency:</span>
              <span className="font-bold text-cyber-amber">
                {selectedTier.latencyNs < 1000
                  ? `${selectedTier.latencyNs} nanoseconds`
                  : selectedTier.latencyNs < 1000000
                  ? `${selectedTier.latencyNs / 1000} microseconds`
                  : `${selectedTier.latencyNs / 1000000} milliseconds`}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border flex items-center justify-between">
              <span className="text-slate-400">CPU Cycles @ 3.2 GHz:</span>
              <span className="font-bold text-cyber-sky">{selectedTier.cycles}</span>
            </div>

            {/* Human scaled analogy */}
            <div className="p-2.5 rounded-lg bg-cyber-emerald/10 border border-cyber-emerald/30 text-emerald-200 space-y-0.5">
              <div className="font-bold text-[11px] text-cyber-emerald flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>If 1 CPU Cycle = 1 Human Second:</span>
              </div>
              <div className="font-bold text-xs">{selectedTier.humanScale}</div>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border space-y-1">
              <span className="text-slate-400 font-bold">Silicon Technology:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{selectedTier.technology}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
              {selectedTier.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

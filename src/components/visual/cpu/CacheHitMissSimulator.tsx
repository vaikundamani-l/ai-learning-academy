import React, { useState } from 'react';
import { Database, Zap, RefreshCw, Play, ArrowRight } from 'lucide-react';

interface CacheLine {
  valid: boolean;
  tag: string;
  data: string;
  dirty: boolean;
  age: number; // for LRU
}

export const CacheHitMissSimulator: React.FC = () => {
  const NUM_SETS = 4;
  const WAYS = 2; // 2-way set-associative cache
  const LINE_SIZE = 16; // 16 bytes per block

  // 4 sets, 2 ways each
  const [cache, setCache] = useState<CacheLine[][]>(() =>
    Array.from({ length: 4 }, () => [
      { valid: false, tag: '-', data: 'Empty', dirty: false, age: 0 },
      { valid: false, tag: '-', data: 'Empty', dirty: false, age: 0 },
    ])
  );

  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [lastAccess, setLastAccess] = useState<{
    addr: number;
    tag: number;
    setIdx: number;
    offset: number;
    hit: boolean;
    replacedWay?: number;
  } | null>(null);

  const [inputAddr, setInputAddr] = useState<string>('0x0020');

  // Address parsing helper: 16-bit address
  // [15:6 Tag (10 bits)] [5:4 Set Index (2 bits)] [3:0 Offset (4 bits)]
  const parseAddress = (addr: number) => {
    const offset = addr & 0x0f;
    const setIdx = (addr >> 4) & 0x03;
    const tag = (addr >> 6) & 0x3ff;
    return { tag, setIdx, offset };
  };

  const handleAccess = (addr: number) => {
    const { tag, setIdx, offset } = parseAddress(addr);
    const tagHex = '0x' + tag.toString(16).toUpperCase().padStart(3, '0');

    setCache((prev) => {
      const newCache = prev.map((set) => set.map((line) => ({ ...line })));
      const targetSet = newCache[setIdx];

      // Check for hit
      const hitIndex = targetSet.findIndex((line) => line.valid && line.tag === tagHex);

      if (hitIndex !== -1) {
        // Cache Hit!
        setHits((h) => h + 1);
        targetSet[hitIndex].age = Date.now();
        setLastAccess({ addr, tag, setIdx, offset, hit: true });
      } else {
        // Cache Miss!
        setMisses((m) => m + 1);
        // Replace least recently used (or invalid) line
        let victimIdx = targetSet.findIndex((l) => !l.valid);
        if (victimIdx === -1) {
          victimIdx = targetSet[0].age < targetSet[1].age ? 0 : 1;
        }

        targetSet[victimIdx] = {
          valid: true,
          tag: tagHex,
          data: `Mem[0x${(addr & ~0x0f).toString(16).toUpperCase()}]`,
          dirty: false,
          age: Date.now(),
        };

        setLastAccess({ addr, tag, setIdx, offset, hit: false, replacedWay: victimIdx });
      }

      return newCache;
    });
  };

  const handleCustomAccess = () => {
    const parsed = parseInt(inputAddr, 16);
    if (!isNaN(parsed) && parsed >= 0) {
      handleAccess(parsed);
    }
  };

  const handleReset = () => {
    setCache(
      Array.from({ length: 4 }, () => [
        { valid: false, tag: '-', data: 'Empty', dirty: false, age: 0 },
        { valid: false, tag: '-', data: 'Empty', dirty: false, age: 0 },
      ])
    );
    setHits(0);
    setMisses(0);
    setLastAccess(null);
  };

  // Preset access patterns
  const runPreset = (pattern: 'sequential' | 'strided' | 'temporal') => {
    handleReset();
    let addrs: number[] = [];
    if (pattern === 'sequential') {
      // Spatial locality: consecutive addresses in same/adjacent cache lines
      addrs = [0x0010, 0x0014, 0x0018, 0x001c, 0x0020, 0x0024, 0x0028, 0x002c];
    } else if (pattern === 'temporal') {
      // Temporal locality: repeatedly accessing same loop variables
      addrs = [0x0010, 0x0014, 0x0010, 0x0014, 0x0010, 0x0014, 0x0050, 0x0010];
    } else {
      // Stride conflict: conflicting sets causing thrashing
      addrs = [0x0010, 0x0050, 0x0090, 0x0010, 0x0050, 0x0090];
    }

    addrs.forEach((a, i) => {
      setTimeout(() => handleAccess(a), i * 350);
    });
  };

  const totalAccesses = hits + misses;
  const hitRate = totalAccesses > 0 ? ((hits / totalAccesses) * 100).toFixed(1) : '0.0';
  // AMAT calculation assuming L1 Hit = 1 cycle, Miss Penalty = 50 cycles
  const amat = totalAccesses > 0 ? (1 + (misses / totalAccesses) * 50).toFixed(1) : '1.0';

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyber-sky" />
            <span>2-Way Set-Associative Cache Hit / Miss Simulator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Understand Tag Matching, Index Decoding, LRU Evictions, and Spatial / Temporal Locality.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-2.5 py-1 rounded-lg bg-surface border border-surface-border text-xs font-mono text-slate-300 hover:text-slate-100 flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Cache</span>
        </button>
      </div>

      {/* Control Strip & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 font-mono">
        {/* Controls */}
        <div className="md:col-span-7 p-4 rounded-xl bg-surface border border-surface-border space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-300">Address Hex:</span>
            <input
              type="text"
              value={inputAddr}
              onChange={(e) => setInputAddr(e.target.value)}
              aria-label="Hex address input"
              className="w-28 px-2 py-1 rounded bg-surface-elevated border border-surface-border text-xs font-mono text-cyber-sky focus:outline-none focus:border-cyber-sky"
            />
            <button
              onClick={handleCustomAccess}
              className="px-3 py-1 rounded bg-cyber-sky text-void font-bold text-xs hover:bg-sky-400 transition"
            >
              Access
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center space-x-2 pt-1">
            <span className="text-[11px] text-slate-400">Presets:</span>
            <button
              onClick={() => runPreset('sequential')}
              className="px-2 py-1 rounded bg-surface-card border border-surface-border text-[11px] text-slate-300 hover:text-cyber-sky"
            >
              Sequential (Spatial)
            </button>
            <button
              onClick={() => runPreset('temporal')}
              className="px-2 py-1 rounded bg-surface-card border border-surface-border text-[11px] text-slate-300 hover:text-cyber-emerald"
            >
              Loop (Temporal)
            </button>
            <button
              onClick={() => runPreset('strided')}
              className="px-2 py-1 rounded bg-surface-card border border-surface-border text-[11px] text-slate-300 hover:text-cyber-rose"
            >
              Conflict Thrash
            </button>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="md:col-span-5 p-4 rounded-xl bg-surface border border-surface-border grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] text-slate-400">HITS / MISSES</div>
            <div className="text-sm font-bold mt-1 text-slate-100">
              <span className="text-cyber-emerald">{hits}</span> / <span className="text-cyber-rose">{misses}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">HIT RATE</div>
            <div className="text-sm font-bold text-cyber-sky mt-1">{hitRate}%</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">EST. AMAT</div>
            <div className="text-sm font-bold text-cyber-amber mt-1">{amat} cyc</div>
          </div>
        </div>
      </div>

      {/* Last Access Inspector Callout */}
      {lastAccess && (
        <div
          className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
            lastAccess.hit
              ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-emerald-300'
              : 'bg-cyber-rose/10 border-cyber-rose/40 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="font-bold">
              {lastAccess.hit ? 'CACHE HIT!' : 'CACHE MISS (Allocated into Way ' + lastAccess.replacedWay + ')'}
            </span>
            <span>• Requested Address: 0x{lastAccess.addr.toString(16).toUpperCase()}</span>
          </div>
          <div className="text-[11px] opacity-80">
            [Tag: 0x{lastAccess.tag.toString(16).toUpperCase()} | Set: {lastAccess.setIdx} | Offset: {lastAccess.offset}]
          </div>
        </div>
      )}

      {/* Cache Sets & Lines Table */}
      <div className="space-y-3 font-mono">
        <div className="text-xs font-bold text-slate-400 flex items-center justify-between px-1">
          <span>ON-DIE L1 CACHE (4 SETS × 2 WAYS)</span>
          <span className="text-[10px] text-slate-500">16-Byte Line Size</span>
        </div>

        <div className="space-y-2">
          {cache.map((set, setIdx) => {
            const isTargetSet = lastAccess?.setIdx === setIdx;
            return (
              <div
                key={setIdx}
                className={`p-3 rounded-xl border transition ${
                  isTargetSet
                    ? 'border-cyber-sky bg-surface-elevated/60 shadow-md'
                    : 'border-surface-border bg-surface'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-slate-200">SET {setIdx}</span>
                  {isTargetSet && <span className="text-cyber-sky text-[10px] animate-pulse">Active Set Target</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {set.map((line, wayIdx) => (
                    <div
                      key={wayIdx}
                      className={`p-2.5 rounded-lg border flex items-center justify-between ${
                        line.valid
                          ? 'bg-surface-card border-surface-border text-slate-200'
                          : 'bg-void/40 border-surface-border/50 text-slate-600'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] text-slate-400">Way {wayIdx}:</span>
                          <span className="font-bold text-cyber-sky">{line.tag}</span>
                          {line.valid && (
                            <span className="text-[9px] px-1 rounded bg-cyber-emerald/20 text-cyber-emerald">
                              VALID
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{line.data}</div>
                      </div>
                      <div className="text-right text-[10px] text-slate-500">
                        {line.valid ? 'Line Active' : 'Unallocated'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

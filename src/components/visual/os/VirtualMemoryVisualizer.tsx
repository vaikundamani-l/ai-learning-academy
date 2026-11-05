import React, { useState } from 'react';
import { Layers, Database, Cpu, AlertTriangle, CheckCircle2, ArrowRight, RefreshCw, ShieldAlert } from 'lucide-react';
import { translateVirtualAddress, PageTableEntry } from '../../../utils/os';

export const VirtualMemoryVisualizer: React.FC = () => {
  const [virtualAddrInput, setVirtualAddrInput] = useState<string>('0x21A4');
  const [isWriteMode, setIsWriteMode] = useState<boolean>(false);

  // Initial 16-entry page table for 16-bit address space with 4 KB pages
  const [pageTable, setPageTable] = useState<Record<number, PageTableEntry>>({
    ...Object.fromEntries(Array.from({ length: 16 }, (_, vpn) => [vpn, { vpn, pfn: 0, valid: false, writable: true, executable: false, referenced: false, dirty: false }])),
    0: { vpn: 0, pfn: 4, valid: true, writable: false, executable: true, referenced: true, dirty: false }, // Code (.text)
    1: { vpn: 1, pfn: 5, valid: true, writable: true, executable: false, referenced: true, dirty: true },   // Data (.data)
    2: { vpn: 2, pfn: 8, valid: true, writable: true, executable: false, referenced: true, dirty: false },  // Heap
    3: { vpn: 3, pfn: 0, valid: false, writable: false, executable: false, referenced: false, dirty: false }, // Unmapped
    4: { vpn: 4, pfn: 0, valid: false, writable: false, executable: false, referenced: false, dirty: false }, // Unmapped
    15: { vpn: 15, pfn: 14, valid: true, writable: true, executable: false, referenced: true, dirty: true }, // Stack
  });

  const validInput = /^(?:0x)?[0-9a-f]{1,4}$/i.test(virtualAddrInput.trim());
  const parsedAddr = validInput ? Number.parseInt(virtualAddrInput.trim().replace(/^0x/i, ''), 16) : NaN;
  const translation = translateVirtualAddress(parsedAddr, pageTable, isWriteMode);

  const applyPreset = (presetHex: string, write: boolean = false) => {
    setVirtualAddrInput(presetHex);
    setIsWriteMode(write);
  };

  const handleToggleValid = (vpn: number) => {
    setPageTable((prev) => ({
      ...prev,
      [vpn]: {
        ...prev[vpn],
        valid: !prev[vpn].valid,
        pfn: !prev[vpn].valid ? Array.from({ length: 16 }, (_, frame) => frame).find(frame => !Object.values(prev).some(entry => entry.valid && entry.pfn === frame))! : prev[vpn].pfn,
      },
    }));
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-6">
      <p className="text-sm text-slate-400">Simplified single-level page table with 16-bit addresses and 4 KB pages. Map entries manually to explore translation. This is not a full Linux MMU; execute permissions are displayed as metadata only.</p>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyber-sky" />
            <span>Virtual Memory MMU & Page Table Translation Visualizer</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrating hardware MMU address translation, Page Fault demand paging, and segmentation protections.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('0x21A4', false)}
            className="px-2.5 py-1 rounded bg-surface border border-surface-border text-[11px] font-mono text-slate-300 hover:text-white"
          >
            Heap Read (Hit)
          </button>
          <button
            onClick={() => applyPreset('0x0040', true)}
            className="px-2.5 py-1 rounded bg-surface border border-cyber-rose/40 text-[11px] font-mono text-cyber-rose hover:bg-cyber-rose/10"
          >
            Write to Code (Segfault)
          </button>
          <button
            onClick={() => applyPreset('0x3800', false)}
            className="px-2.5 py-1 rounded bg-surface border border-cyber-amber/40 text-[11px] font-mono text-cyber-amber hover:bg-cyber-amber/10"
          >
            Unmapped Page (Page Fault)
          </button>
        </div>
      </div>

      {/* Virtual Address Input Bar */}
      <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="virtual-address-input" className="text-xs font-mono text-slate-400">Virtual Address (16-bit Hex):</label>
            <input
              id="virtual-address-input"
              aria-invalid={!validInput}
              type="text"
              value={virtualAddrInput}
              onChange={(e) => setVirtualAddrInput(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-slate-100 font-mono text-sm w-32 focus:outline-none focus:border-cyber-sky"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Operation:</span>
            <button
              aria-pressed={!isWriteMode}
              onClick={() => setIsWriteMode(false)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                !isWriteMode
                  ? 'bg-cyber-sky text-void font-bold shadow-md shadow-cyber-sky/20'
                  : 'bg-surface-card text-slate-400 hover:text-slate-200'
              }`}
            >
              READ
            </button>
            <button
              aria-pressed={isWriteMode}
              onClick={() => setIsWriteMode(true)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                isWriteMode
                  ? 'bg-cyber-amber text-void font-bold shadow-md shadow-cyber-amber/20'
                  : 'bg-surface-card text-slate-400 hover:text-slate-200'
              }`}
            >
              WRITE
            </button>
          </div>
        </div>

        {/* Address Bitfield Breakdown */}
        <div hidden={!validInput} className="pt-2">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
            {validInput ? 'Hardware MMU Address Decomposition (4 KB Page Size)' : 'Address decomposition unavailable for invalid input'}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
            <div className="p-2.5 rounded-lg bg-cyber-sky/15 border border-cyber-sky/40">
              <span className="text-[10px] text-cyber-sky font-bold block">VPN (Virtual Page Number) — Bits [15:12]</span>
              <span className="text-lg font-extrabold text-slate-100">0x{translation.vpn.toString(16).toUpperCase()}</span>
              <span className="text-[10px] text-slate-400 block">(Page Index {translation.vpn})</span>
            </div>
            <div className="p-2.5 rounded-lg bg-cyber-indigo/15 border border-cyber-indigo/40">
              <span className="text-[10px] text-cyber-indigo font-bold block">Page Offset — Bits [11:0] (4096 bytes)</span>
              <span className="text-lg font-extrabold text-slate-100">0x{translation.pageOffset.toString(16).toUpperCase().padStart(3, '0')}</span>
              <span className="text-[10px] text-slate-400 block">(Offset {translation.pageOffset} bytes)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Translation Result Banner */}
      <div
        className={`p-4 rounded-xl border flex items-start space-x-3 transition ${
          translation.isHit
            ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-cyber-emerald'
            : 'bg-cyber-rose/10 border-cyber-rose/40 text-cyber-rose'
        }`}
      >
        {translation.isHit ? (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-1 text-xs font-mono">
          <div className="font-bold text-sm">
            {translation.isHit
              ? `MMU Translation SUCCESS: Physical Address = 0x${translation.physicalAddress!.toString(16).toUpperCase().padStart(4, '0')}`
              : validInput ? 'Hardware MMU Memory Exception Triggered' : 'Invalid virtual address'}
          </div>
          <div className="text-slate-300 font-sans text-xs">
            {translation.isHit ? (
              <span>
                VPN {translation.vpn} maps to Physical Frame Number (PFN) 0x{translation.pfn!.toString(16).toUpperCase()}.
                Physical address calculated as <code className="text-cyber-sky font-bold">(PFN &lt;&lt; 12) | Offset = 0x{translation.physicalAddress!.toString(16).toUpperCase()}</code>.
              </span>
            ) : (
              <span className="text-cyber-rose font-semibold">{translation.faultReason}</span>
            )}
          </div>
        </div>
      </div>

      {/* Live Page Table Inspector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
          <span>Active Process Page Table (CR3 Register Points Here)</span>
          <span className="text-[11px] text-slate-500">Map/evict entries manually; faults are not automatically resolved</span>
        </div>

        <div className="overflow-x-auto border border-surface-border rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-elevated text-slate-200 border-b border-surface-border">
              <tr>
                <th className="p-2.5">VPN</th>
                <th className="p-2.5">PFN (Frame)</th>
                <th className="p-2.5">Present (P)</th>
                <th className="p-2.5">Read/Write (R/W)</th>
                <th className="p-2.5">Execute (X)</th>
                <th className="p-2.5">Segment Role</th>
                <th className="p-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-slate-300">
              {Object.values(pageTable).map((entry) => {
                const isSelectedVpn = validInput && translation.vpn === entry.vpn;
                return (
                  <tr
                    key={entry.vpn}
                    className={`transition ${
                      isSelectedVpn
                        ? 'bg-cyber-sky/15 text-slate-100 font-bold'
                        : 'hover:bg-surface/50'
                    }`}
                  >
                    <td className="p-2.5 text-cyber-sky">VPN {entry.vpn}</td>
                    <td className="p-2.5">
                      {entry.valid ? (
                        <span className="text-cyber-emerald font-bold">PFN 0x{entry.pfn.toString(16).toUpperCase()}</span>
                      ) : (
                        <span className="text-slate-500">— (Not present)</span>
                      )}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          entry.valid
                            ? 'bg-cyber-emerald/20 text-cyber-emerald font-bold'
                            : 'bg-cyber-rose/20 text-cyber-rose'
                        }`}
                      >
                        {entry.valid ? '1 (In RAM)' : '0 (Fault)'}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className={entry.writable ? 'text-cyber-amber' : 'text-slate-400'}>
                        {entry.writable ? 'R/W' : 'RO (Read-Only)'}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className={entry.executable ? 'text-cyber-emerald' : 'text-slate-500'}>
                        {entry.executable ? 'YES' : 'NO (NX)'}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-400 text-[11px]">
                      {entry.vpn === 0 ? 'Code (.text)' : entry.vpn === 1 ? 'Data (.data)' : entry.vpn === 2 ? 'Heap' : entry.vpn === 15 ? 'Stack' : 'Unmapped'}
                    </td>
                    <td className="p-2.5">
                      <button
                        aria-label={`${entry.valid ? 'Evict' : 'Map'} virtual page ${entry.vpn}`}
                        onClick={() => handleToggleValid(entry.vpn)}
                        className="px-2 py-0.5 rounded text-[10px] bg-surface border border-surface-border text-slate-300 hover:text-white"
                      >
                        {entry.valid ? 'Evict' : 'Map a free frame'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

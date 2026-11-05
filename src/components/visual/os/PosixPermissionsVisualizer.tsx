import React, { useState } from 'react';
import { Shield, Lock, FileText, Check, AlertTriangle, Terminal, Key, HardDrive, Link as LinkIcon } from 'lucide-react';
import { parsePosixPermissions } from '../../../utils/os';

export const PosixPermissionsVisualizer: React.FC = () => {
  const [modeOctal, setModeOctal] = useState<string>('0755');
  const [activeTab, setActiveTab] = useState<'permissions' | 'inode'>('permissions');

  const [fileType, setFileType] = useState<'file' | 'directory'>('file');
  const parsed = parsePosixPermissions(modeOctal, fileType);

  const toggleBit = (group: 'owner' | 'group' | 'other', perm: 'r' | 'w' | 'x') => {
    const nextOwner = { ...parsed.owner };
    const nextGroup = { ...parsed.group };
    const nextOther = { ...parsed.other };

    if (group === 'owner') nextOwner[perm] = !nextOwner[perm];
    if (group === 'group') nextGroup[perm] = !nextGroup[perm];
    if (group === 'other') nextOther[perm] = !nextOther[perm];

    const ownerVal = (nextOwner.r ? 4 : 0) | (nextOwner.w ? 2 : 0) | (nextOwner.x ? 1 : 0);
    const groupVal = (nextGroup.r ? 4 : 0) | (nextGroup.w ? 2 : 0) | (nextGroup.x ? 1 : 0);
    const otherVal = (nextOther.r ? 4 : 0) | (nextOther.w ? 2 : 0) | (nextOther.x ? 1 : 0);

    const specialVal = (parsed.specialBits.setuid ? 4 : 0) | (parsed.specialBits.setgid ? 2 : 0) | (parsed.specialBits.sticky ? 1 : 0);

    const newOctal = `${specialVal ? specialVal.toString(8) : '0'}${ownerVal}${groupVal}${otherVal}`;
    setModeOctal(newOctal);
  };

  const toggleSpecial = (bit: 'setuid' | 'setgid' | 'sticky') => {
    const nextSpecial = { ...parsed.specialBits, [bit]: !parsed.specialBits[bit] };
    const specialVal = (nextSpecial.setuid ? 4 : 0) | (nextSpecial.setgid ? 2 : 0) | (nextSpecial.sticky ? 1 : 0);

    const ownerVal = (parsed.owner.r ? 4 : 0) | (parsed.owner.w ? 2 : 0) | (parsed.owner.x ? 1 : 0);
    const groupVal = (parsed.group.r ? 4 : 0) | (parsed.group.w ? 2 : 0) | (parsed.group.x ? 1 : 0);
    const otherVal = (parsed.other.r ? 4 : 0) | (parsed.other.w ? 2 : 0) | (parsed.other.x ? 1 : 0);

    const newOctal = `${specialVal ? specialVal.toString(8) : '0'}${ownerVal}${groupVal}${otherVal}`;
    setModeOctal(newOctal);
  };

  const applyPreset = (preset: string) => {
    setModeOctal(preset);
    setFileType(preset === '1777' ? 'directory' : 'file');
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-xl p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <Lock className="w-4 h-4 text-cyber-sky" />
            <span>Interactive POSIX Permissions, Inode & Octal Lab</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore owner/group/other bitwise flags, SUID privilege escalation vectors, and Linux filesystem inode metadata.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-2">
          <button
            aria-pressed={activeTab === 'permissions'}
            onClick={() => setActiveTab('permissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              activeTab === 'permissions'
                ? 'bg-cyber-sky text-void font-bold shadow-md shadow-cyber-sky/20'
                : 'bg-surface border border-surface-border text-slate-300 hover:text-white'
            }`}
          >
            Permission Bitmask
          </button>
          <button
            aria-pressed={activeTab === 'inode'}
            onClick={() => setActiveTab('inode')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              activeTab === 'inode'
                ? 'bg-cyber-sky text-void font-bold shadow-md shadow-cyber-sky/20'
                : 'bg-surface border border-surface-border text-slate-300 hover:text-white'
            }`}
          >
            Linux Inode Anatomy
          </button>
        </div>
      </div>

      {activeTab === 'permissions' ? (
        <div className="space-y-6">
          <label className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            Object type
            <select aria-label="Permission object type" value={fileType} onChange={e => setFileType(e.target.value as 'file' | 'directory')} className="rounded-lg border border-surface-border bg-surface px-3 py-2">
              <option value="file">Regular file</option><option value="directory">Directory</option>
            </select>
          </label>
          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Quick Presets:</span>
            {[
              { label: '0755 (Binary / Script)', val: '0755' },
              { label: '0644 (Standard File)', val: '0644' },
              { label: '0600 (SSH Private Key)', val: '0600' },
              { label: '0777 (Dangerous Open)', val: '0777' },
              { label: '4755 (SUID Root / passwd)', val: '4755' },
              { label: '1777 (Sticky / /tmp)', val: '1777' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p.val)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition ${
                  modeOctal === p.val
                    ? 'bg-cyber-sky/20 border-cyber-sky text-cyber-sky font-bold'
                    : 'bg-surface border-surface-border text-slate-300 hover:bg-surface-elevated'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Large Visual Output Banner */}
          <div className="p-4 rounded-xl bg-surface border border-surface-border grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
            <div className="p-3 rounded-lg bg-surface-card border border-surface-border space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Octal Mode (chmod)</span>
              <span className="text-2xl font-extrabold text-cyber-sky">{parsed.octal}</span>
              <code className="text-[11px] text-slate-300 block font-sans">chmod {parsed.octal} {fileType === 'directory' ? 'directory/' : 'file.txt'}</code>
            </div>

            <div className="p-3 rounded-lg bg-surface-card border border-surface-border space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Symbolic String (ls -l)</span>
              <span className="text-2xl font-extrabold text-cyber-emerald">{parsed.symbolic}</span>
              <span className="text-[11px] text-slate-400 block font-sans">10-character file mode</span>
            </div>

            <div className="p-3 rounded-lg bg-surface-card border border-surface-border space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">9-Bit Binary Bitmask</span>
              <span className="text-xl font-extrabold text-cyber-amber">
                {parsed.binary.slice(0, 3)} {parsed.binary.slice(3, 6)} {parsed.binary.slice(6, 9)}
              </span>
              <span className="text-[11px] text-slate-400 block font-sans">rwx rwx rwx (bits)</span>
            </div>
          </div>

          {/* Description Callout */}
          <div className="p-3 rounded-lg bg-cyber-sky/10 border border-cyber-sky/30 text-xs text-slate-200 leading-relaxed font-sans">
            <strong className="text-cyber-sky font-mono font-bold">Standard Role: </strong>
            {parsed.description}
          </div>

          {/* 3-Column Permission Matrix Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Owner */}
            <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <span className="font-bold text-slate-100">Owner (User / u)</span>
                <span className="text-cyber-sky font-bold">
                  {(parsed.owner.r ? 4 : 0) + (parsed.owner.w ? 2 : 0) + (parsed.owner.x ? 1 : 0)}
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { key: 'r', label: 'Read (4)', active: parsed.owner.r },
                  { key: 'w', label: 'Write (2)', active: parsed.owner.w },
                  { key: 'x', label: 'Execute (1)', active: parsed.owner.x },
                ].map((item) => (
                  <button
                    key={item.key}
                    aria-pressed={item.active}
                    aria-label={`Owner ${item.label}`}
                    onClick={() => toggleBit('owner', item.key as any)}
                    className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
                      item.active
                        ? 'bg-cyber-sky/15 border-cyber-sky text-slate-100 font-bold'
                        : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-bold">{item.active ? 'ACTIVE' : 'DENIED'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group */}
            <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <span className="font-bold text-slate-100">Group (g)</span>
                <span className="text-cyber-indigo font-bold">
                  {(parsed.group.r ? 4 : 0) + (parsed.group.w ? 2 : 0) + (parsed.group.x ? 1 : 0)}
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { key: 'r', label: 'Read (4)', active: parsed.group.r },
                  { key: 'w', label: 'Write (2)', active: parsed.group.w },
                  { key: 'x', label: 'Execute (1)', active: parsed.group.x },
                ].map((item) => (
                  <button
                    key={item.key}
                    aria-pressed={item.active}
                    aria-label={`Group ${item.label}`}
                    onClick={() => toggleBit('group', item.key as any)}
                    className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
                      item.active
                        ? 'bg-cyber-indigo/15 border-cyber-indigo text-slate-100 font-bold'
                        : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-bold">{item.active ? 'ACTIVE' : 'DENIED'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Others */}
            <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <span className="font-bold text-slate-100">Others / World (o)</span>
                <span className="text-cyber-emerald font-bold">
                  {(parsed.other.r ? 4 : 0) + (parsed.other.w ? 2 : 0) + (parsed.other.x ? 1 : 0)}
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { key: 'r', label: 'Read (4)', active: parsed.other.r },
                  { key: 'w', label: 'Write (2)', active: parsed.other.w },
                  { key: 'x', label: 'Execute (1)', active: parsed.other.x },
                ].map((item) => (
                  <button
                    key={item.key}
                    aria-pressed={item.active}
                    aria-label={`Others ${item.label}`}
                    onClick={() => toggleBit('other', item.key as any)}
                    className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
                      item.active
                        ? 'bg-cyber-emerald/15 border-cyber-emerald text-slate-100 font-bold'
                        : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-bold">{item.active ? 'ACTIVE' : 'DENIED'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Special Bits: SUID / SGID / Sticky */}
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3 font-mono text-xs">
            <span className="text-slate-300 font-bold block">Special Security Bits (High 3 Bits)</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                aria-pressed={parsed.specialBits.setuid}
                onClick={() => toggleSpecial('setuid')}
                className={`p-3 rounded-lg border text-left transition ${
                  parsed.specialBits.setuid
                    ? 'bg-cyber-rose/20 border-cyber-rose text-slate-100 font-bold'
                    : 'bg-surface-card border-surface-border text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>SUID (4000)</span>
                  <span className="text-[10px]">{parsed.specialBits.setuid ? 'ON' : 'OFF'}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans mt-1">Runs with owner privilege</p>
              </button>

              <button
                aria-pressed={parsed.specialBits.setgid}
                onClick={() => toggleSpecial('setgid')}
                className={`p-3 rounded-lg border text-left transition ${
                  parsed.specialBits.setgid
                    ? 'bg-cyber-amber/20 border-cyber-amber text-slate-100 font-bold'
                    : 'bg-surface-card border-surface-border text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>SGID (2000)</span>
                  <span className="text-[10px]">{parsed.specialBits.setgid ? 'ON' : 'OFF'}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans mt-1">Runs with group privilege</p>
              </button>

              <button
                aria-pressed={parsed.specialBits.sticky}
                onClick={() => toggleSpecial('sticky')}
                className={`p-3 rounded-lg border text-left transition ${
                  parsed.specialBits.sticky
                    ? 'bg-cyber-emerald/20 border-cyber-emerald text-slate-100 font-bold'
                    : 'bg-surface-card border-surface-border text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Sticky Bit (1000)</span>
                  <span className="text-[10px]">{parsed.specialBits.sticky ? 'ON' : 'OFF'}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans mt-1">Restricts directory deletion</p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Inode Anatomy Tab */
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <span className="font-bold text-slate-100 flex items-center space-x-1.5">
                <HardDrive className="w-4 h-4 text-cyber-sky" />
                <span>Linux Ext4 Inode Data Structure (stat /path/to/file)</span>
              </span>
              <span className="text-cyber-emerald text-[11px]">Inode #1405928</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-surface-card border border-surface-border">
                <span className="text-slate-500 block text-[9px] uppercase">File Mode</span>
                <span className="text-cyber-sky font-bold">-rwxr-xr-x (0755)</span>
              </div>
              <div className="p-2.5 rounded bg-surface-card border border-surface-border">
                <span className="text-slate-500 block text-[9px] uppercase">Hard Links Count</span>
                <span className="text-cyber-emerald font-bold">2 links</span>
              </div>
              <div className="p-2.5 rounded bg-surface-card border border-surface-border">
                <span className="text-slate-500 block text-[9px] uppercase">Owner UID / GID</span>
                <span className="text-slate-200">1000 (user) / 1000</span>
              </div>
              <div className="p-2.5 rounded bg-surface-card border border-surface-border">
                <span className="text-slate-500 block text-[9px] uppercase">File Size & Blocks</span>
                <span className="text-cyber-amber font-bold">8192 bytes (16 blks)</span>
              </div>
            </div>

            {/* Direct & Indirect Pointers */}
            <div className="p-3 rounded-lg bg-surface-card border border-surface-border space-y-2 text-[11px]">
              <span className="font-bold text-slate-200 block">Ext4 Extent Tree / Direct Block Pointers:</span>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                <div className="p-2 rounded bg-surface border border-cyber-sky/30 text-cyber-sky">Block #88120</div>
                <div className="p-2 rounded bg-surface border border-cyber-sky/30 text-cyber-sky">Block #88121</div>
                <div className="p-2 rounded bg-surface border border-surface-border text-slate-500">— Unused</div>
                <div className="p-2 rounded bg-surface border border-surface-border text-slate-500">— Unused</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 font-sans space-y-2 pt-1">
              <p>
                <strong>Hard Link vs Symbolic Link:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs">
                <li>
                  <strong className="text-slate-200">Hard Link:</strong> An additional directory entry pointing directly to the exact same Inode number. Removing one filename merely decrements the Inode's link count; data is only wiped when link count reaches 0.
                </li>
                <li>
                  <strong className="text-slate-200">Symbolic (Soft) Link:</strong> A distinct independent Inode whose data block holds the text path string of target file. If the target file is deleted, the symlink becomes a broken ("dangling") pointer.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

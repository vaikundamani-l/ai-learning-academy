/**
 * Operating System Primitives & Memory Management Pure Utilities
 * Pure functions for address translation, POSIX permission parsing, and process transitions.
 */

export interface PosixPermissionParsed {
  octal: string;
  symbolic: string;
  binary: string;
  specialBits: {
    setuid: boolean;
    setgid: boolean;
    sticky: boolean;
  };
  owner: { r: boolean; w: boolean; x: boolean };
  group: { r: boolean; w: boolean; x: boolean };
  other: { r: boolean; w: boolean; x: boolean };
  description: string;
}

/**
 * Parses octal text ('0755') or a numeric bitmask (0o755, not decimal 755) into structured permissions.
 */
export function parsePosixPermissions(mode: number | string, fileType: 'file' | 'directory' = 'file'): PosixPermissionParsed {
  if (typeof mode === 'string' && !/^(?:0o)?[0-7]{1,4}$/i.test(mode)) {
    throw new RangeError('Use one to four octal digits (0–7).');
  }
  const numMode = typeof mode === 'string' ? Number.parseInt(mode.replace(/^0o/i, ''), 8) : mode;
  if (!Number.isInteger(numMode) || numMode < 0 || numMode > 0o7777) {
    throw new RangeError('Permission bitmask must be an integer from 0 to 0o7777.');
  }

  const setuid = (numMode & 0o4000) !== 0;
  const setgid = (numMode & 0o2000) !== 0;
  const sticky = (numMode & 0o1000) !== 0;

  const owner = {
    r: (numMode & 0o400) !== 0,
    w: (numMode & 0o200) !== 0,
    x: (numMode & 0o100) !== 0,
  };

  const group = {
    r: (numMode & 0o040) !== 0,
    w: (numMode & 0o020) !== 0,
    x: (numMode & 0o010) !== 0,
  };

  const other = {
    r: (numMode & 0o004) !== 0,
    w: (numMode & 0o002) !== 0,
    x: (numMode & 0o001) !== 0,
  };

  // Build symbolic string (e.g. -rwxr-xr-x)
  let symOwnerX = owner.x ? (setuid ? 's' : 'x') : (setuid ? 'S' : '-');
  let symGroupX = group.x ? (setgid ? 's' : 'x') : (setgid ? 'S' : '-');
  let symOtherX = other.x ? (sticky ? 't' : 'x') : (sticky ? 'T' : '-');

  const symbolic = [
    fileType === 'directory' ? 'd' : '-',
    owner.r ? 'r' : '-',
    owner.w ? 'w' : '-',
    symOwnerX,
    group.r ? 'r' : '-',
    group.w ? 'w' : '-',
    symGroupX,
    other.r ? 'r' : '-',
    other.w ? 'w' : '-',
    symOtherX,
  ].join('');

  const octalStr = numMode.toString(8).padStart(4, '0');
  const binaryStr = (numMode & 0o777).toString(2).padStart(9, '0');

  let description = 'Standard user file';
  if (numMode === 0o755) description = 'Executable program / Directory standard (Owner full, Others read+exec)';
  else if (numMode === 0o644) description = 'Standard file permission (Owner read+write, Others read-only)';
  else if (numMode === 0o600) description = 'Confidential file / SSH private key (Owner read+write only)';
  else if (numMode === 0o700) description = 'Private directory / script (Owner full, Others blocked)';
  else if (numMode === 0o777) description = 'Dangerous open access (Everyone full read, write, execute)';
  else if (setuid) description = 'SUID: Executes with file owner permissions (e.g. /usr/bin/passwd)';
  else if (sticky) description = 'On a sticky directory, deletion or renaming is restricted to the file owner, directory owner, or a privileged process.';

  return {
    octal: octalStr,
    symbolic,
    binary: binaryStr,
    specialBits: { setuid, setgid, sticky },
    owner,
    group,
    other,
    description,
  };
}

/**
 * Page Table Entry definition for Virtual Memory translation simulation.
 */
export interface PageTableEntry {
  vpn: number;
  pfn: number;
  valid: boolean;
  writable: boolean;
  executable: boolean;
  referenced: boolean;
  dirty: boolean;
}

export interface AddressTranslationResult {
  virtualAddress: number;
  vpn: number;
  pageOffset: number;
  isHit: boolean;
  isFault: boolean;
  physicalAddress: number | null;
  pfn: number | null;
  faultReason?: string;
}

/**
 * Translates a 16-bit Virtual Address into a Physical Address using 4 KB (12-bit offset) pages.
 * VPN = (addr >> 12) & 0xF (upper 4 bits = 16 virtual pages)
 * Offset = addr & 0xFFF (lower 12 bits = 4096 bytes)
 */
export function translateVirtualAddress(
  virtualAddress: number,
  pageTable: Record<number, PageTableEntry>,
  isWrite: boolean = false
): AddressTranslationResult {
  const PAGE_OFFSET_BITS = 12; // 4 KB pages
  const PAGE_SIZE = 1 << PAGE_OFFSET_BITS;
  const OFFSET_MASK = PAGE_SIZE - 1;

  if (!Number.isInteger(virtualAddress) || virtualAddress < 0 || virtualAddress > 0xFFFF) {
    return { virtualAddress, vpn: 0, pageOffset: 0, isHit: false, isFault: true,
      physicalAddress: null, pfn: null, faultReason: 'Invalid input: enter a complete 16-bit hexadecimal address from 0x0000 to 0xFFFF.' };
  }
  const vpn = (virtualAddress >>> PAGE_OFFSET_BITS) & 0xF;
  const pageOffset = virtualAddress & OFFSET_MASK;

  const entry = pageTable[vpn];

  if (!entry || !entry.valid) {
    return {
      virtualAddress,
      vpn,
      pageOffset,
      isHit: false,
      isFault: true,
      physicalAddress: null,
      pfn: null,
      faultReason: `Page Fault: Virtual Page Number ${vpn} is not mapped in Physical RAM (Present bit = 0). The OS checks whether this is a valid mapping; it may allocate a zero-filled page, load backing data, or reject the access.`,
    };
  }

  if (isWrite && !entry.writable) {
    return {
      virtualAddress,
      vpn,
      pageOffset,
      isHit: false,
      isFault: true,
      physicalAddress: null,
      pfn: entry.pfn,
      faultReason: `Protection page fault: write access denied on Read-Only Page (VPN ${vpn}). The OS may resolve copy-on-write or reject the access with SIGSEGV (Segmentation Fault).`,
    };
  }

  const physicalAddress = (entry.pfn << PAGE_OFFSET_BITS) | pageOffset;

  return {
    virtualAddress,
    vpn,
    pageOffset,
    isHit: true,
    isFault: false,
    physicalAddress,
    pfn: entry.pfn,
  };
}

/**
 * Process Control Block (PCB) structure
 */
export type ProcessState = 'NEW' | 'READY' | 'RUNNING' | 'WAITING' | 'TERMINATED';

export interface ProcessControlBlock {
  pid: number;
  ppid: number;
  name: string;
  state: ProcessState;
  programCounter: number;
  priority: number;
  cpuTimeUsed: number;
  openFiles: number[];
  memoryBytes: number;
}


/** Single-core teaching state machine; not a Linux scheduler implementation. */
export function canTransitionProcess(from: ProcessState, to: ProcessState): boolean {
  const edges: Record<ProcessState, ProcessState[]> = {
    NEW: ['READY', 'TERMINATED'], READY: ['RUNNING', 'TERMINATED'],
    RUNNING: ['READY', 'WAITING', 'TERMINATED'], WAITING: ['READY', 'TERMINATED'], TERMINATED: [],
  };
  return edges[from].includes(to);
}
export function transitionProcess(processes: ProcessControlBlock[], pid: number, target: ProcessState): ProcessControlBlock[] {
  const selected = processes.find(process => process.pid === pid);
  if (!selected || !canTransitionProcess(selected.state, target)) return processes;
  return processes.map(process => {
    if (process.pid === pid) return {
      ...process, state: target,
      cpuTimeUsed: process.cpuTimeUsed + Number(target === 'RUNNING'),
      ...(target === 'TERMINATED' ? { openFiles: [], memoryBytes: 0 } : {}),
    };
    if (target === 'RUNNING' && process.state === 'RUNNING') return { ...process, state: 'READY' };
    return process;
  });
}

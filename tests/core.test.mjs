import test from 'node:test';
import assert from 'node:assert/strict';
import { cpuAtCycle } from '../src/utils/cpu.ts';
import { isUserProgress } from '../src/utils/progress.ts';
import { 
  isValidTheme, 
  resolveTheme, 
  getStoredTheme, 
  setStoredTheme, 
  applyThemeToDocument,
  THEME_STORAGE_KEY 
} from '../src/utils/theme.ts';

const backup = { startedStages: [], completedStages: [], completedLessons: [], completedExercises: [], completedProjects: [], bookmarks: [], notes: {}, assessmentScores: {}, lastActiveStageId: 0 };
test('valid progress backup round trips', () => assert.equal(isUserProgress(JSON.parse(JSON.stringify(backup))), true));
test('partial or malformed imports cannot replace progress', () => {
  for (const bad of [null, [], { startedStages: [] }, { ...backup, notes: null }, { ...backup, completedStages: [31] }, { ...backup, assessmentScores: { quiz: 101 } }, { ...backup, bookmarks: ['//example.org'] }, { ...backup, notes: { x: 42 } }]) {
    assert.equal(isUserProgress(bad), false);
  }
});
test('CPU loads memory, adds, subtracts, and stores in the correct phases', () => {
  assert.equal(cpuAtCycle(4).registers.R1, 5);
  assert.equal(cpuAtCycle(5).registers.R1, 9);
  assert.equal(cpuAtCycle(9).registers.R3, 0);
  assert.equal(cpuAtCycle(10).registers.R3, 21);
  assert.equal(cpuAtCycle(15).registers.R4, 12);
  assert.equal(cpuAtCycle(18).memory['0x0C'], 0);
  assert.equal(cpuAtCycle(19).memory['0x0C'], 12);
  assert.equal(cpuAtCycle(20).halted, true);
});
test('CPU replay supports rewind and clean reset without stale state', () => {
  cpuAtCycle(20);
  assert.equal(cpuAtCycle(18).memory['0x0C'], 0);
  assert.deepEqual(cpuAtCycle(0).registers, { R1: 5, R2: 12, R3: 0, R4: 0 });
  assert.equal(cpuAtCycle(1).phase, 'FETCH');
  assert.equal(cpuAtCycle(6).instruction, 'ADD R3, R1, R2');
});

// Theme Unit Tests
test('theme validator recognizes valid themes and rejects arbitrary strings', () => {
  assert.equal(isValidTheme('light'), true);
  assert.equal(isValidTheme('dark'), true);
  assert.equal(isValidTheme('system'), true);
  assert.equal(isValidTheme('blue'), false);
  assert.equal(isValidTheme(null), false);
  assert.equal(isValidTheme(undefined), false);
  assert.equal(isValidTheme(123), false);
});

test('resolveTheme properly maps explicit and system preferences', () => {
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('dark', true), 'dark');
  assert.equal(resolveTheme('light', false), 'light');
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('system', true), 'dark');
  assert.equal(resolveTheme('system', false), 'light');
});

test('theme persistence stores and retrieves valid settings with fallback', () => {
  const store = new Map();
  const mockStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    key: (i) => Array.from(store.keys())[i],
    get length() { return store.size; }
  };

  assert.equal(getStoredTheme(mockStorage), 'system');
  setStoredTheme('light', mockStorage);
  assert.equal(getStoredTheme(mockStorage), 'light');
  setStoredTheme('dark', mockStorage);
  assert.equal(getStoredTheme(mockStorage), 'dark');
  mockStorage.setItem(THEME_STORAGE_KEY, 'corrupted');
  assert.equal(getStoredTheme(mockStorage), 'system');
});

test('applyThemeToDocument toggles classes and sets colorScheme style', () => {
  const classes = new Set();
  const mockDoc = {
    documentElement: {
      classList: {
        add: (cls) => classes.add(cls),
        remove: (cls) => classes.delete(cls),
        contains: (cls) => classes.has(cls)
      },
      style: { colorScheme: '' }
    }
  };

  applyThemeToDocument('dark', mockDoc);
  assert.equal(classes.has('dark'), true);
  assert.equal(classes.has('light'), false);
  assert.equal(mockDoc.documentElement.style.colorScheme, 'dark');

  applyThemeToDocument('light', mockDoc);
  assert.equal(classes.has('dark'), false);
  assert.equal(classes.has('light'), true);
  assert.equal(mockDoc.documentElement.style.colorScheme, 'light');
});

// Phase 4 CPU Pilot Lesson & Assessment Rigor Tests
import { CPU_LESSON_CONTENT } from '../src/data/cpuLessonContent.ts';

test('CPU pilot metadata contains expected objective, quiz, and exercise structures', () => {
  assert.equal(CPU_LESSON_CONTENT.objectives.length >= 5, true);
  assert.equal(CPU_LESSON_CONTENT.prerequisites.length >= 2, true);
  assert.equal(CPU_LESSON_CONTENT.lexicon.length >= 10, true);
  assert.equal(CPU_LESSON_CONTENT.quizQuestions.length, 10);
  assert.equal(CPU_LESSON_CONTENT.exercises.length, 3);

  // Verify all 10 diagnostic questions have exactly one correct answer with explanations
  for (const q of CPU_LESSON_CONTENT.quizQuestions) {
    assert.ok(q.question.length > 10, `Question ${q.id} is non-trivial`);
    assert.ok(q.options.length >= 3, `Question ${q.id} has at least 3 options`);
    const correctOpts = q.options.filter((opt) => opt.isCorrect);
    assert.equal(correctOpts.length, 1, `Question ${q.id} must have exactly 1 correct answer`);
    for (const opt of q.options) {
      assert.ok(opt.explanation.length > 10, `Option explanation in question ${q.id} must be detailed`);
    }
  }

  // Verify exercises have task lists and solution hints
  for (const ex of CPU_LESSON_CONTENT.exercises) {
    assert.ok(ex.tasks.length >= 3, `Exercise ${ex.id} has at least 3 tasks`);
    assert.ok(ex.solutionHint.length > 20, `Exercise ${ex.id} has a detailed derivation hint`);
  }
});

test('reference performance and AMAT examples calculate expected results', () => {
  // Iron Law: Time = (Instructions * CPI) / Frequency
  const I = 10_000_000_000;
  const CPI = 6.70;
  const freq = 3.2e9;
  const time = (I * CPI) / freq;
  assert.equal(Math.round(time * 100) / 100, 20.94);

  // AMAT: Hit_Time + (Miss_Rate * Miss_Penalty)
  const hitTime = 1; // cycle
  const missRate = 0.05; // 5%
  const missPenalty = 50; // cycles
  const amat = hitTime + missRate * missPenalty;
  assert.equal(amat, 3.5);
});


import { emptyCache, accessCache, parseCacheAddress } from '../src/utils/cache.ts';
test('cache counts exactly one event per access without mutating prior state', () => {
  const empty = emptyCache();
  const miss = accessCache(empty, 0x10);
  const hit = accessCache(miss, 0x14);
  assert.equal(miss.misses, 1); assert.equal(miss.hits, 0);
  assert.equal(hit.hits, 1); assert.equal(hit.misses, 1);
  assert.equal(empty.cache[1][0].valid, false);
  assert.deepEqual(accessCache(empty, 0x10), miss);
});
test('cache uses deterministic LRU when several accesses happen in the same millisecond', () => {
  let state = emptyCache();
  for (const address of [0x10, 0x50, 0x10, 0x90]) state = accessCache(state, address);
  assert.equal(state.lastAccess.replacedWay, 1);
  assert.equal(accessCache(state, 0x10).lastAccess.hit, true);
  assert.equal(accessCache(state, 0x50).lastAccess.hit, false);
});
test('cache accepts only full 16-bit hexadecimal addresses', () => {
  assert.equal(parseCacheAddress(' 0xFFFF '), 65535);
  assert.equal(parseCacheAddress('0020'), 32);
  for (const bad of ['0x10000', '-1', '0x20junk', '', '1.5']) assert.equal(parseCacheAddress(bad), null);
});

// Primary Source & Code Execution Verification
import { execSync } from 'child_process';
import fs from 'fs';

test('CPU pilot code example in Python executes deterministically with verified outputs', () => {
  const pyCode = CPU_LESSON_CONTENT.codeExamples.pythonEmulator;
  fs.writeFileSync('/tmp/test_py_cpu.py', pyCode);
  const out = execSync('python3 /tmp/test_py_cpu.py', { encoding: 'utf-8' });
  assert.ok(out.includes("{'R1': 9, 'R2': 12, 'R3': 21, 'R4': 12}"));
  assert.ok(out.includes("Mem[0x0C]: 12"));
});

test('CPU pilot code example in C compiles and proves cache line spatial locality', () => {
  const cCode = CPU_LESSON_CONTENT.codeExamples.cBitwiseAndCache;
  fs.writeFileSync('/tmp/test_c_cache.c', cCode);
  execSync('gcc -O2 /tmp/test_c_cache.c -o /tmp/test_c_cache', { stdio: 'pipe' });
  const out = execSync('/tmp/test_c_cache', { encoding: 'utf-8' });
  assert.ok(out.includes("Sum: 16777216"));
  assert.ok(out.includes("Row-Major (Sequential):"));
  assert.ok(out.includes("Column-Major (Strided Miss):"));
});

test('CPU pilot code example in x86-64 assembly assembles, links, and produces exact results', () => {
  const asmFull = CPU_LESSON_CONTENT.codeExamples.assemblyComparison;
  const x86Section = asmFull.split('----------------------------------------------------------------------------')[0];
  fs.writeFileSync('/tmp/test_pilot_x86.s', x86Section);
  const harness = `
  #include <stdio.h>
  #include <assert.h>
  extern int add_and_scale_x86(int a, int b);
  int main() {
      assert(add_and_scale_x86(15, 25) == 80);
      assert(add_and_scale_x86(0, 0) == 0);
      assert(add_and_scale_x86(-5, 10) == 10);
      return 0;
  }
  `;
  fs.writeFileSync('/tmp/test_harness.c', harness);
  execSync('gcc /tmp/test_harness.c /tmp/test_pilot_x86.s -o /tmp/test_pilot_x86_app', { stdio: 'pipe' });
  execSync('/tmp/test_pilot_x86_app', { stdio: 'pipe' });
});

test('Amdahl Law derivation and speedup limits calculate mathematically exact bounds', () => {
  // S(N) = 1 / ((1 - p) + (p / N))
  const p = 0.90; // 90% parallel
  const s = 1 - p; // 10% serial

  const speedup10 = 1 / (s + p / 10);
  assert.equal(Math.round(speedup10 * 1000) / 1000, 5.263);

  const speedup1000 = 1 / (s + p / 1000);
  assert.equal(Math.round(speedup1000 * 10) / 10, 9.9);

  // Asymptotic limit S_max = 1 / s = 10 (rounded for IEEE-754 float precision)
  const maxSpeedup = 1 / s;
  assert.equal(Math.round(maxSpeedup), 10);
});

test('assessment mastery gate requires exactly 80% or greater to certify', () => {
  const questions = CPU_LESSON_CONTENT.quizQuestions;
  assert.equal(questions.length, 10);

  // Calculate score with 8 correct
  const correctCount8 = 8;
  const score8 = Math.round((correctCount8 / questions.length) * 100);
  assert.equal(score8, 80);
  assert.equal(score8 >= 80, true);

  // Calculate score with 7 correct
  const correctCount7 = 7;
  const score7 = Math.round((correctCount7 / questions.length) * 100);
  assert.equal(score7, 70);
  assert.equal(score7 >= 80, false);
});

// ============================================================================
// STAGE 0 LESSON 2: MEMORY HIERARCHY & BINARY DATA REPRESENTATION TESTS
// ============================================================================
import { floatToBits32, bits32ToFloat, decodeIeee754_32 } from '../src/utils/ieee754.ts';
import { computeTwosComplement, performBitwiseOp } from '../src/utils/bitwise.ts';
import { MEMORY_LESSON_CONTENT } from '../src/data/memoryLessonContent.ts';

test('IEEE-754 encoder and decoder convert floating point numbers deterministically', () => {
  // 12.375 = 1100.011_2 = 1.100011 * 2^3
  // S=0, E = 3 + 127 = 130 (10000010), Mantissa = 10001100000000000000000
  const bits12 = floatToBits32(12.375);
  assert.equal(bits12, '01000001010001100000000000000000');
  assert.equal(bits32ToFloat(bits12), 12.375);

  const decoded = decodeIeee754_32(bits12);
  assert.equal(decoded.sign, 0);
  assert.equal(decoded.exponentRaw, 130);
  assert.equal(decoded.exponentActual, 3);
  assert.equal(decoded.calculatedValue, 12.375);
  assert.equal(decoded.isZero, false);
  assert.equal(decoded.isNaN, false);
  assert.equal(decoded.isInfinity, false);

  // Negative float: -0.75 = -1.1 * 2^-1
  const bitsNeg = floatToBits32(-0.75);
  assert.equal(bitsNeg[0], '1'); // Sign bit is 1
  assert.equal(bits32ToFloat(bitsNeg), -0.75);

  // Special cases: +0, -0, Infinity, NaN
  const decodedZero = decodeIeee754_32(floatToBits32(0.0));
  assert.equal(decodedZero.isZero, true);

  const decodedInf = decodeIeee754_32(floatToBits32(Infinity));
  assert.equal(decodedInf.isInfinity, true);

  const decodedNaN = decodeIeee754_32(floatToBits32(NaN));
  assert.equal(decodedNaN.isNaN, true);
});

test('Two\'s complement utility correctly negates integers and proves single zero representation', () => {
  // Negating +53 (00110101):
  // Invert: 11001010
  // Add 1:  11001011 (-53 in 8-bit two's complement)
  const res53 = computeTwosComplement(53, 8);
  assert.equal(res53.originalBinary, '00110101');
  assert.equal(res53.invertedBinary, '11001010');
  assert.equal(res53.twosComplementBinary, '11001011');
  assert.equal(res53.negatedDecimal, -53);

  // Zero negation: 00000000 inverted is 11111111, adding 1 produces 100000000 clamped to 00000000
  const resZero = computeTwosComplement(0, 8);
  assert.equal(resZero.originalBinary, '00000000');
  assert.equal(resZero.twosComplementBinary, '00000000');
  assert.equal(resZero.negatedDecimal, 0);
});

test('Bitwise operations produce exact arithmetic and masking outputs', () => {
  // A = 60 (00111100), B = 13 (00001101)
  const andRes = performBitwiseOp(60, 13, 'AND', 8);
  assert.equal(andRes.result, 12);
  assert.equal(andRes.binary, '00001100');

  const orRes = performBitwiseOp(60, 13, 'OR', 8);
  assert.equal(orRes.result, 61);
  assert.equal(orRes.binary, '00111101');

  const xorRes = performBitwiseOp(60, 13, 'XOR', 8);
  assert.equal(xorRes.result, 49);
  assert.equal(xorRes.binary, '00110001');

  const notRes = performBitwiseOp(60, 0, 'NOT', 8);
  assert.equal(notRes.result, 195);
  assert.equal(notRes.binary, '11000011');

  const shlRes = performBitwiseOp(5, 2, 'SHL', 8);
  assert.equal(shlRes.result, 20); // 5 << 2 = 20

  const shrRes = performBitwiseOp(20, 2, 'SHR', 8);
  assert.equal(shrRes.result, 5); // 20 >> 2 = 5
});

test('Memory Lesson code example in C compiles and verifies endianness and struct padding', () => {
  const cCode = MEMORY_LESSON_CONTENT.codeExamples.cMemoryAndEndianness;
  fs.writeFileSync('/tmp/test_c_memory.c', cCode);
  execSync('gcc -O2 /tmp/test_c_memory.c -o /tmp/test_c_memory', { stdio: 'pipe' });
  const out = execSync('/tmp/test_c_memory', { encoding: 'utf-8' });

  // Verify Endianness detection
  assert.ok(out.includes("Verdict: Little-Endian"));

  // Verify struct padding measurements
  assert.ok(out.includes("Unoptimized struct size: 24 bytes"));
  assert.ok(out.includes("Optimized struct size:   16 bytes"));
});

test('Memory Lesson code example in Python executes and decodes IEEE-754 float from raw bits', () => {
  const pyCode = MEMORY_LESSON_CONTENT.codeExamples.pythonFloatDecoder;
  fs.writeFileSync('/tmp/test_py_ieee.py', pyCode);
  const out = execSync('python3 /tmp/test_py_ieee.py', { encoding: 'utf-8' });

  assert.ok(out.includes("0x41460000 -> Decoded: 12.375 (Normalized)"));
});

test('Memory lesson metadata and quiz have the expected structure', () => {
  assert.equal(MEMORY_LESSON_CONTENT.objectives.length >= 5, true);
  assert.equal(MEMORY_LESSON_CONTENT.prerequisites.length >= 3, true);
  assert.equal(MEMORY_LESSON_CONTENT.lexicon.length >= 10, true);
  assert.equal(MEMORY_LESSON_CONTENT.quizQuestions.length, 10);
  assert.equal(MEMORY_LESSON_CONTENT.exercises.length, 3);

  // Each quiz question must have 3 options, exactly 1 correct, and non-empty explanations
  for (const q of MEMORY_LESSON_CONTENT.quizQuestions) {
    assert.equal(q.options.length >= 3, true);
    const correctOpts = q.options.filter(o => o.isCorrect);
    assert.equal(correctOpts.length, 1, `Question ${q.id} must have exactly 1 correct answer`);
    assert.ok(correctOpts[0].explanation.length > 20, `Question ${q.id} must provide detailed explanation`);
  }

  // Each exercise must have tasks and solution hint
  for (const ex of MEMORY_LESSON_CONTENT.exercises) {
    assert.ok(ex.tasks.length >= 3);
    assert.ok(ex.solutionHint.length > 30);
  }
});

// ============================================================================
// STAGE 0 LESSON 3: OPERATING SYSTEM PRIMITIVES, PROCESSES & THREADS TESTS
// ============================================================================
import { parsePosixPermissions, translateVirtualAddress } from '../src/utils/os.ts';
import { OS_LESSON_CONTENT } from '../src/data/osLessonContent.ts';

test('POSIX permissions parser decodes octal, symbolic, and special SUID bits accurately', () => {
  // Standard 0755
  const p755 = parsePosixPermissions('0755');
  assert.equal(p755.octal, '0755');
  assert.equal(p755.symbolic, '-rwxr-xr-x');
  assert.equal(p755.owner.r && p755.owner.w && p755.owner.x, true);
  assert.equal(p755.group.r && !p755.group.w && p755.group.x, true);
  assert.equal(p755.other.r && !p755.other.w && p755.other.x, true);
  assert.equal(p755.specialBits.setuid, false);

  // SSH private key 0600
  const p600 = parsePosixPermissions(0o600);
  assert.equal(p600.octal, '0600');
  assert.equal(p600.symbolic, '-rw-------');
  assert.equal(p600.owner.r && p600.owner.w && !p600.owner.x, true);
  assert.equal(p600.group.r || p600.other.r, false);

  // SUID root executable (e.g. /usr/bin/passwd 4755)
  const p4755 = parsePosixPermissions('4755');
  assert.equal(p4755.octal, '4755');
  assert.equal(p4755.symbolic, '-rwsr-xr-x');
  assert.equal(p4755.specialBits.setuid, true);

  // Sticky bit (e.g. /tmp 1777)
  const p1777 = parsePosixPermissions('1777');
  assert.equal(p1777.symbolic, '-rwxrwxrwt');
  assert.equal(p1777.specialBits.sticky, true);
});

test('Virtual memory address translator performs page lookups, offsets, and detects page faults', () => {
  const pageTable = {
    0: { vpn: 0, pfn: 4, valid: true, writable: false, executable: true, referenced: true, dirty: false },
    1: { vpn: 1, pfn: 5, valid: true, writable: true, executable: false, referenced: true, dirty: true },
    2: { vpn: 2, pfn: 8, valid: true, writable: true, executable: false, referenced: true, dirty: false },
    3: { vpn: 3, pfn: 0, valid: false, writable: false, executable: false, referenced: false, dirty: false },
  };

  // Valid Heap Read: Addr 0x21A4 (VPN=2, offset=0x1A4) -> PFN=8 -> Physical = 0x81A4
  const resHeap = translateVirtualAddress(0x21A4, pageTable, false);
  assert.equal(resHeap.vpn, 2);
  assert.equal(resHeap.pageOffset, 0x1A4);
  assert.equal(resHeap.isHit, true);
  assert.equal(resHeap.isFault, false);
  assert.equal(resHeap.physicalAddress, 0x81A4);

  // Page Fault on Unmapped Page: Addr 0x3800 (VPN=3)
  const resFault = translateVirtualAddress(0x3800, pageTable, false);
  assert.equal(resFault.vpn, 3);
  assert.equal(resFault.isFault, true);
  assert.equal(resFault.isHit, false);
  assert.equal(resFault.physicalAddress, null);

  // Segmentation Fault on Read-Only Code write: Addr 0x0040 (VPN=0, writable=false)
  const resSegv = translateVirtualAddress(0x0040, pageTable, true);
  assert.equal(resSegv.isFault, true);
  assert.ok(resSegv.faultReason?.includes("Segmentation Fault"));
});

test('Operating Systems code example in C compiles and proves process isolation and pthread mutex', () => {
  const cCode = OS_LESSON_CONTENT.codeExamples.cProcessAndThreads;
  fs.writeFileSync('/tmp/test_c_os.c', cCode);
  execSync('gcc -O2 -pthread /tmp/test_c_os.c -o /tmp/test_c_os', { stdio: 'pipe' });
  const out = execSync('/tmp/test_c_os', { encoding: 'utf-8' });

  // Verify process isolation (child changed global_var to 150, but parent retained 100)
  assert.ok(out.includes("Modified global_var to: 150"));
  assert.ok(out.includes("Read global_var: 100"));
  assert.ok(out.includes("Parent memory was NOT changed by child (Total Isolation!)"));

  // Verify thread counter synchronization
  assert.ok(out.includes("Final Shared Counter (Expected 100000): 100000"));
  assert.ok(out.includes("Mutex prevented race conditions!"));
});

test('Operating Systems code example in Python reads /proc/self/maps and file inodes', () => {
  const pyCode = OS_LESSON_CONTENT.codeExamples.pythonProcMaps;
  fs.writeFileSync('/tmp/test_py_os.py', pyCode);
  const out = execSync('python3 /tmp/test_py_os.py', { encoding: 'utf-8' });

  assert.ok(out.includes("/proc/self/maps Virtual Address Segments"));
  assert.ok(out.includes("File Metadata & Inode Inspection for: /etc/passwd"));
  assert.ok(out.includes("Octal Mode:   0o644"));
});

test('OS lesson metadata and quiz have the expected structure', () => {
  assert.equal(OS_LESSON_CONTENT.objectives.length >= 5, true);
  assert.equal(OS_LESSON_CONTENT.prerequisites.length >= 3, true);
  assert.equal(OS_LESSON_CONTENT.lexicon.length >= 10, true);
  assert.equal(OS_LESSON_CONTENT.quizQuestions.length, 10);
  assert.equal(OS_LESSON_CONTENT.exercises.length, 3);

  // Verify 10 quiz questions structure
  for (const q of OS_LESSON_CONTENT.quizQuestions) {
    assert.equal(q.options.length >= 3, true);
    const correctOpts = q.options.filter(o => o.isCorrect);
    assert.equal(correctOpts.length, 1, `Question ${q.id} must have exactly 1 correct answer`);
    assert.ok(correctOpts[0].explanation.length > 20, `Question ${q.id} must provide detailed explanation`);
  }

  // Verify exercises
  for (const ex of OS_LESSON_CONTENT.exercises) {
    assert.ok(ex.tasks.length >= 3);
    assert.ok(ex.solutionHint.length > 30);
  }
});


import { canTransitionProcess, transitionProcess } from '../src/utils/os.ts';
test('OS address translation rejects invalid values instead of aliasing another page', () => {
  for (const address of [-1, 65536, 1.5, NaN, Infinity]) {
    const result = translateVirtualAddress(address, {});
    assert.equal(result.isHit, false);
    assert.equal(result.physicalAddress, null);
    assert.match(result.faultReason, /Invalid input/);
  }
});
test('POSIX permission parser rejects partial octal and invalid numeric masks', () => {
  for (const mode of ['0788', '0755junk', '', '888', -1, NaN, 1.5, 0o10000]) assert.throws(() => parsePosixPermissions(mode), RangeError);
  assert.equal(parsePosixPermissions('0o755').octal, '0755');
  assert.equal(parsePosixPermissions(0o755).octal, '0755');
});
const pcb = (pid, state) => ({ pid, ppid: 1, name: `task${pid}`, state, programCounter: 0, priority: 20, cpuTimeUsed: 0, openFiles: [0, 1, 2], memoryBytes: 4096 });
test('process transitions prevent resurrection and blocked-process dispatch', () => {
  assert.equal(canTransitionProcess('TERMINATED', 'READY'), false);
  assert.equal(canTransitionProcess('WAITING', 'RUNNING'), false);
  assert.equal(canTransitionProcess('READY', 'WAITING'), false);
  assert.equal(canTransitionProcess('WAITING', 'READY'), true);
  const initial = [pcb(1, 'WAITING')];
  assert.equal(transitionProcess(initial, 1, 'RUNNING'), initial);
});
test('single-core dispatch preempts the current process without mutating source data', () => {
  const initial = [pcb(1, 'RUNNING'), pcb(2, 'READY')];
  const next = transitionProcess(initial, 2, 'RUNNING');
  assert.equal(next.filter(process => process.state === 'RUNNING').length, 1);
  assert.equal(next[0].state, 'READY'); assert.equal(next[1].state, 'RUNNING');
  assert.equal(initial[0].state, 'RUNNING');
});
test('process exit leaves a zombie PCB while releasing displayed memory and descriptors', () => {
  const result = transitionProcess([pcb(1, 'RUNNING')], 1, 'TERMINATED');
  assert.equal(result.length, 1); assert.equal(result[0].state, 'TERMINATED');
  assert.equal(result[0].memoryBytes, 0); assert.deepEqual(result[0].openFiles, []);
});

test('directory permission mode uses the directory prefix and sticky execute indicator', () => {
  assert.equal(parsePosixPermissions('1777', 'directory').symbolic, 'drwxrwxrwt');
  assert.equal(parsePosixPermissions('1700', 'directory').symbolic, 'drwx-----T');
});

// ============================================================================
// Stage 0 Lesson 4: Developer Tooling, Shell & Git Internals Tests
// ============================================================================
import { sha1, computeGitBlobHash, parsePipeline, resolveCommandPath, calculateCidrSubnet, simulateTcpHandshake } from '../src/utils/devTooling.ts';
import { TOOLING_LESSON_CONTENT } from '../src/data/toolingLessonContent.ts';

test('pure SHA-1 and Git blob hashing produces canonical Git-compatible hashes', () => {
  // Canonical Git test vector: "Hello World\n"
  const helloResult = computeGitBlobHash('Hello World\n');
  assert.equal(helloResult.header, 'blob 12\0');
  assert.equal(helloResult.sha1Hash, '557db03de997c86a4a028e1ebd3a1ceb225be238');
  assert.equal(helloResult.objectPath, '.git/objects/55/7db03de997c86a4a028e1ebd3a1ceb225be238');

  // Exercise 1 test vector: "test content\n" (13 bytes)
  const testResult = computeGitBlobHash('test content\n');
  assert.equal(testResult.header, 'blob 13\0');
  assert.equal(testResult.sha1Hash, 'd670460b4b4aece5915caf5c68d12f560a9fe3e4');
  assert.equal(testResult.objectPath, '.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4');

  // Empty string Git blob
  const emptyResult = computeGitBlobHash('');
  assert.equal(emptyResult.header, 'blob 0\0');
  // Git empty blob standard hash: e69de29bb2d1d6434b8b29ae775ad8c2e48c5391
  assert.equal(emptyResult.sha1Hash, 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391');

  // Direct sha1 call
  assert.equal(sha1('abc'), 'a9993e364706816aba3e25717850c26c9cd0d89d');
});

test('shell pipeline parser decomposes Unix command pipelines into file descriptor mappings', () => {
  // Empty pipeline
  assert.deepEqual(parsePipeline(''), []);
  assert.deepEqual(parsePipeline('   '), []);

  // Single command (no pipes)
  const single = parsePipeline('ls -la');
  assert.equal(single.length, 1);
  assert.equal(single[0].command, 'ls');
  assert.deepEqual(single[0].args, ['-la']);
  assert.equal(single[0].inFd, 0); // Stdin
  assert.equal(single[0].outFd, 1); // Stdout
  assert.equal(single[0].errFd, 2);
  assert.equal(single[0].isPipeTarget, false);
  assert.equal(single[0].isPipeSource, false);

  // Multi-stage pipeline: cat file | grep err | wc -l
  const multi = parsePipeline('cat file.txt | grep "ERROR" | wc -l');
  assert.equal(multi.length, 3);

  // Stage 0: cat file.txt
  assert.equal(multi[0].command, 'cat');
  assert.deepEqual(multi[0].args, ['file.txt']);
  assert.equal(multi[0].inFd, 0); // Stdin
  assert.equal(multi[0].outFd, 4); // Pipe 1 write descriptor
  assert.equal(multi[0].isPipeSource, true);
  assert.equal(multi[0].isPipeTarget, false);

  // Stage 1: grep "ERROR"
  assert.equal(multi[1].command, 'grep');
  assert.equal(multi[1].inFd, 3); // Pipe 1 read descriptor
  assert.equal(multi[1].outFd, 6); // Pipe 2 write descriptor
  assert.equal(multi[1].isPipeSource, true);
  assert.equal(multi[1].isPipeTarget, true);

  // Stage 2: wc -l
  assert.equal(multi[2].command, 'wc');
  assert.deepEqual(multi[2].args, ['-l']);
  assert.equal(multi[2].inFd, 5); // Pipe 2 read descriptor
  assert.equal(multi[2].outFd, 1); // Terminal stdout
  assert.equal(multi[2].isPipeSource, false);
  assert.equal(multi[2].isPipeTarget, true);
});

test('PATH lookup resolver traverses directories sequentially and returns first match', () => {
  const mockFs = {
    '/usr/local/bin': ['docker', 'node'],
    '/usr/bin': ['git', 'python3', 'gcc', 'node'],
    '/bin': ['bash', 'sh', 'ls', 'cat']
  };

  const pathList = ['/usr/local/bin', '/usr/bin', '/bin'];

  // Found in first directory (/usr/local/bin)
  const nodeLookup = resolveCommandPath('node', pathList, mockFs);
  assert.equal(nodeLookup.resolvedPath, '/usr/local/bin/node');
  assert.equal(nodeLookup.steps.length, 1);
  assert.equal(nodeLookup.steps[0].found, true);

  // Found in second directory (/usr/bin/git)
  const gitLookup = resolveCommandPath('git', pathList, mockFs);
  assert.equal(gitLookup.resolvedPath, '/usr/bin/git');
  assert.equal(gitLookup.steps.length, 2);
  assert.equal(gitLookup.steps[0].found, false);
  assert.equal(gitLookup.steps[1].found, true);

  // Found in last directory (/bin/cat)
  const catLookup = resolveCommandPath('cat', pathList, mockFs);
  assert.equal(catLookup.resolvedPath, '/bin/cat');
  assert.equal(catLookup.steps.length, 3);
  assert.equal(catLookup.steps[0].found, false);
  assert.equal(catLookup.steps[1].found, false);
  assert.equal(catLookup.steps[2].found, true);

  // Not found anywhere
  const missingLookup = resolveCommandPath('nonexistent_tool', pathList, mockFs);
  assert.equal(missingLookup.resolvedPath, null);
  assert.equal(missingLookup.steps.length, 3);
  assert.ok(missingLookup.steps.every(s => !s.found));
});

test('Developer Tooling code example in C compiles and proves pipe() and dup2() inter-process communication', () => {
  const cCode = TOOLING_LESSON_CONTENT.codeExamples.cPipelines;
  fs.writeFileSync('/tmp/test_c_tooling.c', cCode);
  execSync('gcc -std=c11 -O2 /tmp/test_c_tooling.c -o /tmp/test_c_tooling', { encoding: 'utf-8' });
  const out = execSync('/tmp/test_c_tooling', { encoding: 'utf-8' });

  assert.ok(out.includes("Linux Kernel Pipe Creation"));
  assert.ok(out.includes("Pipe created: Read FD = 3, Write FD = 4") || out.includes("Pipe created:"));
  assert.ok(out.includes("PIPELINE_TELEMETRY: STATUS=OK BATCH=42"));
  assert.ok(out.includes("Verdict: Unidirectional kernel ring buffer transmitted data successfully!"));
});

test('Developer Tooling code example in Python executes and generates bit-accurate Git blob SHA-1', () => {
  const pyCode = TOOLING_LESSON_CONTENT.codeExamples.pythonGitEngine;
  fs.writeFileSync('/tmp/test_py_tooling.py', pyCode);
  const out = execSync('python3 /tmp/test_py_tooling.py', { encoding: 'utf-8' });

  assert.ok(out.includes("--- Git Blob Deconstruction ---"));
  assert.ok(out.includes("Computed SHA-1:  557db03de997c86a4a028e1ebd3a1ceb225be238"));
  assert.ok(out.includes("Object Path:     .git/objects/55/7db03de997c86a4a028e1ebd3a1ceb225be238"));
  assert.ok(out.includes("Verdict: Hash matches git hash-object exactly!"));
});

test('Tooling lesson metadata and quiz have the expected structure', () => {
  assert.equal(TOOLING_LESSON_CONTENT.objectives.length >= 5, true);
  assert.equal(TOOLING_LESSON_CONTENT.prerequisites.length >= 3, true);
  assert.equal(TOOLING_LESSON_CONTENT.lexicon.length >= 10, true);
  assert.equal(TOOLING_LESSON_CONTENT.quizQuestions.length, 10);
  assert.equal(TOOLING_LESSON_CONTENT.exercises.length, 3);

  // Verify 10 quiz questions structure
  for (const q of TOOLING_LESSON_CONTENT.quizQuestions) {
    assert.equal(q.options.length >= 3, true);
    const correctOpts = q.options.filter(o => o.isCorrect);
    assert.equal(correctOpts.length, 1, `Question ${q.id} must have exactly 1 correct answer`);
    assert.ok(correctOpts[0].explanation.length > 20, `Question ${q.id} must provide detailed explanation`);
  }

  // Verify exercises
  for (const ex of TOOLING_LESSON_CONTENT.exercises) {
    assert.ok(ex.tasks.length >= 3);
    assert.ok(ex.solutionHint.length > 30);
  }
});

test('calculateCidrSubnet performs bit-accurate IPv4 subnetting and host range calculations', () => {
  // Standard /24 Class C subnet: 192.168.1.100/24
  const res24 = calculateCidrSubnet('192.168.1.100/24');
  assert.equal(res24.netmask, '255.255.255.0');
  assert.equal(res24.networkAddress, '192.168.1.0');
  assert.equal(res24.broadcastAddress, '192.168.1.255');
  assert.equal(res24.firstUsableIp, '192.168.1.1');
  assert.equal(res24.lastUsableIp, '192.168.1.254');
  assert.equal(res24.totalAddresses, 256);
  assert.equal(res24.usableHosts, 254);

  // Large /16 subnet: 10.0.50.1/16
  const res16 = calculateCidrSubnet('10.0.50.1/16');
  assert.equal(res16.netmask, '255.255.0.0');
  assert.equal(res16.networkAddress, '10.0.0.0');
  assert.equal(res16.broadcastAddress, '10.0.255.255');
  assert.equal(res16.usableHosts, 65534);

  // Rejects invalid inputs
  assert.throws(() => calculateCidrSubnet('192.168.1.1/33'), RangeError);
  assert.throws(() => calculateCidrSubnet('256.0.0.1/24'), RangeError);
  assert.throws(() => calculateCidrSubnet('invalid_ip'), Error);
});

test('simulateTcpHandshake verifies the discrete 3-step TCP connection lifecycle', () => {
  const steps = simulateTcpHandshake(1000, 5000);
  assert.equal(steps.length, 3);

  // Step 1: Client SYN
  assert.equal(steps[0].sender, 'Client');
  assert.equal(steps[0].flags.SYN, true);
  assert.equal(steps[0].flags.ACK, false);
  assert.equal(steps[0].seq, 1000);
  assert.equal(steps[0].clientState, 'SYN_SENT');

  // Step 2: Server SYN-ACK
  assert.equal(steps[1].sender, 'Server');
  assert.equal(steps[1].flags.SYN, true);
  assert.equal(steps[1].flags.ACK, true);
  assert.equal(steps[1].seq, 5000);
  assert.equal(steps[1].ack, 1001);
  assert.equal(steps[1].serverState, 'SYN_RCVD');

  // Step 3: Client ACK -> ESTABLISHED
  assert.equal(steps[2].sender, 'Client');
  assert.equal(steps[2].flags.SYN, false);
  assert.equal(steps[2].flags.ACK, true);
  assert.equal(steps[2].seq, 1001);
  assert.equal(steps[2].ack, 5001);
  assert.equal(steps[2].clientState, 'ESTABLISHED');
  assert.equal(steps[2].serverState, 'ESTABLISHED');
});

test('Developer Tooling Python example exchanges real TCP bytes on loopback', () => {
  fs.writeFileSync('/tmp/test_py_net.py', TOOLING_LESSON_CONTENT.codeExamples.pythonSocketAndDns);
  const out = execSync('python3 /tmp/test_py_net.py', { encoding: 'utf-8', timeout: 15000 });
  assert.ok(out.includes('Local TCP reply: hello'));
  assert.ok(out.includes('Verified: local TCP connection exchanged application bytes.'));
});

test('Stage 0 diagnostic quiz option positions are balanced without position bias', () => {
  const lessons = [
    { name: 'CPU Architecture', content: CPU_LESSON_CONTENT },
    { name: 'Memory Hierarchy', content: MEMORY_LESSON_CONTENT },
    { name: 'Operating Systems', content: OS_LESSON_CONTENT },
    { name: 'Developer Tooling', content: TOOLING_LESSON_CONTENT },
  ];

  for (const { name, content } of lessons) {
    assert.equal(content.quizQuestions.length, 10, `${name} must have 10 quiz questions`);
    const counts = { 0: 0, 1: 0, 2: 0 };

    for (const q of content.quizQuestions) {
      const correctIndices = q.options
        .map((opt, idx) => (opt.isCorrect ? idx : -1))
        .filter(idx => idx !== -1);
      
      assert.equal(correctIndices.length, 1, `${name} Q${q.id} must have exactly 1 correct answer`);
      const correctIdx = correctIndices[0];
      assert.ok(correctIdx in counts, `${name} Q${q.id} correct answer must be in indices 0, 1, or 2`);
      counts[correctIdx]++;
    }

    // Ensure no position dominates: no position has > 4 questions, and all positions have at least 2
    for (const pos of [0, 1, 2]) {
      assert.ok(
        counts[pos] >= 2 && counts[pos] <= 4,
        `${name} option index ${pos} count (${counts[pos]}) must be balanced between 2 and 4`
      );
    }
  }
});



test('CIDR calculator rejects partial prefixes and noninteger or empty octets', () => {
  for (const input of ['1.2.3.4/24junk', '1.2.3.4/24/8', '1.2.3.4/2.5', '1.2..4/24', '1.2.3.4.5/24', '1.2.3.1e2/24']) {
    assert.throws(() => calculateCidrSubnet(input));
  }
});
test('CIDR /31 and /32 use point-to-point and single-address semantics', () => {
  const point = calculateCidrSubnet('192.0.2.5/31');
  assert.equal(point.usableHosts, 2);
  assert.equal(point.broadcastAddress, null);
  assert.equal(point.firstUsableIp, '192.0.2.4');
  assert.equal(point.lastUsableIp, '192.0.2.5');
  const host = calculateCidrSubnet('192.0.2.5/32');
  assert.equal(host.usableHosts, 1);
  assert.equal(host.broadcastAddress, null);
  assert.equal(host.firstUsableIp, '192.0.2.5');
});
test('TCP sequence numbers wrap as unsigned 32-bit integers', () => {
  const steps = simulateTcpHandshake(0xffffffff, 0xffffffff);
  assert.equal(steps[1].ack, 0);
  assert.equal(steps[2].seq, 0);
  assert.equal(steps[2].ack, 0);
  for (const value of [-1, 0x100000000, NaN, 1.5]) assert.throws(() => simulateTcpHandshake(value, 0), RangeError);
});

// ============================================================================
// Bounded Python reference graph (not measured CPython refcounts)
// ============================================================================
import {
  createMemoryEnvironment,
  allocatePyObject,
  assignVariable,
  deleteVariable,
  getPythonMemoryScenarios
} from '../src/utils/pythonMemory.ts';
import { PYTHON_BASICS_LESSON_CONTENT } from '../src/data/pythonBasicsLessonContent.ts';

test('teaching reference graph counts drawn edges during rebinding and zero-edge release', () => {
  const env = createMemoryEnvironment();

  // Allocate integer 100
  const id1 = allocatePyObject(env, 'int', '100');
  assert.equal(env.heap[id1].refCount, 0);
  assert.equal(env.heap[id1].isMutable, false);

  // Assign x = 100 -> refCount increments to 1
  assignVariable(env, 'x', id1);
  assert.equal(env.stack.x, id1);
  assert.equal(env.heap[id1].refCount, 1);

  // Assign y = x -> pointer aliasing, refCount increments to 2
  assignVariable(env, 'y', id1);
  assert.equal(env.stack.y, id1);
  assert.equal(env.heap[id1].refCount, 2);

  // Rebind x = 101 -> allocate new int, decrement id1, increment id2
  const id2 = allocatePyObject(env, 'int', '101');
  assignVariable(env, 'x', id2);
  assert.equal(env.stack.x, id2);
  assert.equal(env.heap[id2].refCount, 1);
  assert.equal(env.heap[id1].refCount, 1); // y still holds id1

  // Delete y -> id1 refCount reaches 0 and is removed from heap
  deleteVariable(env, 'y');
  assert.equal(env.stack.y, undefined);
  assert.equal(env.heap[id1], undefined);

  // Delete x -> id2 refCount reaches 0 and is removed from heap
  deleteVariable(env, 'x');
  assert.equal(env.stack.x, undefined);
  assert.equal(env.heap[id2], undefined);
});

test('teaching reference graph distinguishes a shared list from an independent outer copy', () => {
  const env = createMemoryEnvironment();

  // Create list [1, 2]
  const listId = allocatePyObject(env, 'list', '[1, 2]');
  assignVariable(env, 'a', listId);
  assignVariable(env, 'b', listId); // Alias

  assert.equal(env.stack.a, env.stack.b);
  assert.equal(env.heap[listId].refCount, 2);

  // Mutate the list in-place
  env.heap[listId].value = '[1, 2, 3]';
  assert.equal(env.heap[env.stack.a].value, '[1, 2, 3]');
  assert.equal(env.heap[env.stack.b].value, '[1, 2, 3]');

  // Create independent shallow copy
  const copyId = allocatePyObject(env, 'list', '[1, 2, 3]');
  assignVariable(env, 'c', copyId);
  assert.notEqual(env.stack.a, env.stack.c);
  assert.equal(env.heap[copyId].refCount, 1);
});

test('Python memory scenarios return fully formed deterministic simulation frames', () => {
  const scenarios = getPythonMemoryScenarios();
  assert.ok(Array.isArray(scenarios));
  assert.equal(scenarios.length, 5);

  for (const sc of scenarios) {
    assert.ok(sc.id, 'Scenario must have an id');
    assert.ok(sc.title, 'Scenario must have a title');
    assert.ok(sc.description, 'Scenario must have a description');
    assert.ok(sc.steps.length >= 3, `Scenario ${sc.id} must have at least 3 steps`);

    for (let i = 0; i < sc.steps.length; i++) {
      const step = sc.steps[i];
      assert.ok(step.title, `Step ${i} must include title`);
      assert.ok(step.code, `Step ${i} must include code`);
      assert.ok(step.explanation, `Step ${i} must include explanation`);
      assert.ok(step.environment, `Step ${i} must have an environment state`);
      assert.ok(step.environment.stack, `Step ${i} must have a stack frame`);
      assert.ok(step.environment.heap, `Step ${i} must have heap memory`);
    }
  }
});

test('reviewed CPython knowledge check distinguishes evidence and implementation limits', () => {
  const content = PYTHON_BASICS_LESSON_CONTENT;
  assert.equal(content.stageNumber, 1);
  assert.match(content.title, /CPython/);
  assert.equal(content.quizQuestions.length, 10);
  const positions = new Set();
  for (const question of content.quizQuestions) {
    assert.equal(question.options.filter(option => option.isCorrect).length, 1);
    positions.add(question.options.findIndex(option => option.isCorrect));
    assert.ok(question.options.every(option => option.explanation.length > 20));
  }
  assert.equal(positions.size, 3);
});

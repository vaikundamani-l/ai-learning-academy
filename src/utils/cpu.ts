export const CPU_PHASES = ['FETCH', 'DECODE', 'EXECUTE', 'MEMORY', 'WRITEBACK'] as const;
export const CPU_PROGRAM = [
  { op: 'LOAD', dest: 'R1', src: '[0x0A]', code: '0x110A' },
  { op: 'ADD', dest: 'R3', src: 'R1, R2', code: '0x2312' },
  { op: 'SUB', dest: 'R4', src: 'R3, R1', code: '0x3431' },
  { op: 'STORE', dest: '[0x0C]', src: 'R4', code: '0x440C' },
];
/** Serial, five-phase teaching model. No overlapping pipeline or speculation. */
export function cpuAtCycle(requestedCycle: number) {
  const cycle = Math.max(0, Math.min(20, Math.trunc(requestedCycle)));
  const registers: Record<string, number> = { R1: 5, R2: 12, R3: 0, R4: 0 };
  const memory: Record<string, number> = { '0x0A': 9, '0x0C': 0 };
  const logs = ['[INIT] R1=5, R2=12. Memory[0x0A]=9. Ready to fetch.'];
  for (let tick = 1; tick <= cycle; tick++) {
    const instruction = Math.floor((tick - 1) / 5);
    const phase = CPU_PHASES[(tick - 1) % 5];
    if (tick === 5) registers.R1 = memory['0x0A'];
    if (tick === 10) registers.R3 = registers.R1 + registers.R2;
    if (tick === 15) registers.R4 = registers.R3 - registers.R1;
    if (tick === 19) memory['0x0C'] = registers.R4;
    logs.unshift(`Cycle ${tick} [${phase}]: ${CPU_PROGRAM[instruction].op}${tick === 19 ? ' → Memory[0x0C]=12' : ''}`);
  }
  const index = cycle === 0 ? 0 : Math.floor((cycle - 1) / 5);
  const instr = CPU_PROGRAM[index];
  return {
    registers, memory, logs: logs.slice(0, 10), pc: cycle === 20 ? 16 : index * 4,
    phase: CPU_PHASES[cycle === 0 ? 0 : (cycle - 1) % 5],
    instruction: `${instr.op} ${instr.dest}, ${instr.src}`, halted: cycle === 20,
  };
}

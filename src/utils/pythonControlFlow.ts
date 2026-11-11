import type { ProgramFrame } from '../components/learning/ProgramTrace';

function boundedInteger(value: number, min: number, max: number) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`Choose an integer from ${min} to ${max}.`);
  }
}

export function decisionProgram(minutes: number) {
  boundedInteger(minutes, 0, 60);
  return `minutes = ${minutes}\nif minutes >= 30:\n    print("Target met")\nelif minutes > 0:\n    print("Getting started")\nelse:\n    print("Rest day")`;
}

export function decisionTrace(minutes: number): ProgramFrame[] {
  boundedInteger(minutes, 0, 60);
  const names = `minutes → ${minutes}`;
  const frames: ProgramFrame[] = [
    { line: 1, names, output: '', explanation: `Bind minutes to ${minutes}. No output yet.` },
    { line: 2, names, output: '', explanation: `${minutes} >= 30 is ${minutes >= 30 ? 'True: enter the first block.' : 'False: skip that block and test elif.'}` },
  ];
  if (minutes >= 30) {
    frames.push({ line: 3, names, output: 'Target met', explanation: 'Print Target met. This if/elif/else chain is finished; later branches are skipped.' });
  } else {
    frames.push({ line: 4, names, output: '', explanation: `${minutes} > 0 is ${minutes > 0 ? 'True: enter the elif block.' : 'False: use the else block.'}` });
    frames.push(minutes > 0
      ? { line: 5, names, output: 'Getting started', explanation: 'Print Getting started. The else block is skipped.' }
      : { line: 7, names, output: 'Rest day', explanation: 'Both tests were False. The else block prints Rest day.' });
  }
  return frames;
}

export function sumProgram(limit: number) {
  boundedInteger(limit, 0, 8);
  return `limit = ${limit}\ntotal = 0\nfor number in range(1, limit + 1):\n    total = total + number\nprint(total)`;
}

export function sumTrace(limit: number): ProgramFrame[] {
  boundedInteger(limit, 0, 8);
  let total = 0;
  const frames: ProgramFrame[] = [
    { line: 1, names: `limit → ${limit}`, output: '', explanation: `Bind limit to ${limit}.` },
    { line: 2, names: `limit → ${limit}; total → 0`, output: '', explanation: 'Initialize total once, before the loop. It will store the running sum.' },
  ];
  for (let number = 1; number <= limit; number++) {
    const before = total;
    frames.push({ line: 3, names: `limit → ${limit}; total → ${total}; number → ${number}`, output: '', explanation: `The range supplies ${number}. Bind number, then enter the indented body.` });
    total += number;
    frames.push({ line: 4, names: `limit → ${limit}; total → ${total}; number → ${number}`, output: '', explanation: `Update total: ${before} + ${number} = ${total}. Return to the loop header for the next item.` });
  }
  const names = `limit → ${limit}; total → ${total}${limit ? `; number → ${limit}` : ''}`;
  frames.push({ line: 3, names, output: '', explanation: `range(1, ${limit + 1}) has no more items. Exit the loop.${limit === 0 ? ' Its body never ran; number was never assigned.' : ''}` });
  frames.push({ line: 5, names, output: String(total), explanation: `The unindented print runs once, after the loop, and displays ${total}.` });
  return frames;
}

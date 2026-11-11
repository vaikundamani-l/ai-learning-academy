import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { decisionProgram, decisionTrace, sumProgram, sumTrace } from '../src/utils/pythonControlFlow.ts';
import { controlFlowExamples, controlFlowQuestions } from '../src/data/pythonControlFlowContent.ts';

const run = (code, input = '') => execFileSync('python3', ['-c', code], { input, encoding: 'utf8', timeout: 3000 }).trim();
test('all displayed control-flow programs produce their documented output', () => {
  for (const example of controlFlowExamples) assert.equal(run(example.code, example.input), example.output, example.title);
});
test('decision trace agrees with Python on both boundaries and all three paths', () => {
  for (const minutes of [0, 1, 29, 30, 31, 60]) {
    const frames = decisionTrace(minutes);
    assert.equal(frames.at(-1).output, run(decisionProgram(minutes)));
    const lines = frames.map(frame => frame.line);
    assert.deepEqual(lines, minutes >= 30 ? [1, 2, 3] : minutes > 0 ? [1, 2, 4, 5] : [1, 2, 4, 7]);
    assert.equal(frames[1].output, '', 'condition testing must not print');
  }
});
test('running sum trace matches Python, empty ranges and independent formula', () => {
  for (let limit = 0; limit <= 8; limit++) {
    const frames = sumTrace(limit);
    const expected = String(limit * (limit + 1) / 2);
    assert.equal(frames.at(-1).output, expected);
    assert.equal(run(sumProgram(limit)), expected);
    assert.equal(frames.filter(frame => frame.line === 4).length, limit);
    assert.ok(frames.slice(0, -1).every(frame => frame.output === ''));
    assert.deepEqual(frames, sumTrace(limit), 'rewinding uses deterministic snapshots');
  }
  assert.ok(!sumTrace(0).at(-1).names.includes('number'), 'empty range never assigns number');
  assert.match(sumTrace(3)[3].names, /total → 1/);
  assert.match(sumTrace(3)[5].names, /total → 3/);
  assert.match(sumTrace(3)[7].names, /total → 6/);
});
test('trace model rejects invalid and unbounded parameters', () => {
  for (const fn of [decisionProgram, decisionTrace, sumProgram, sumTrace]) {
    for (const value of [-1, 1.5, NaN, Infinity, 10000]) assert.throws(() => fn(value), RangeError);
  }
});
test('planner accepts endpoints and rejects integer inputs outside its contract', () => {
  const code = controlFlowExamples[5].code;
  for (const [minutes, days, total] of [[20,3,60], [30,0,0], [0,7,0], [1440,7,10080]]) {
    const output = run(code, `${minutes}\n${days}\n`);
    assert.ok(output.endsWith(`Weekly total: ${total}`));
    assert.equal((output.match(/Day \d+ total/g) || []).length, days);
  }
  for (const input of ['-1\n3\n', '1441\n3\n', '20\n-1\n', '20\n8\n']) {
    const output = run(code, input);
    assert.ok(output.endsWith('Choose minutes 0–1440 and days 0–7'));
    assert.ok(!output.includes('Weekly total:'));
  }
});
test('knowledge check has exactly one correct answer and varied positions', () => {
  const positions = [0,0,0];
  assert.equal(controlFlowQuestions.length, 10);
  for (const question of controlFlowQuestions) {
    assert.equal(question.options.filter(option=>option.isCorrect).length, 1);
    positions[question.options.findIndex(option=>option.isCorrect)]++;
  }
  assert.ok(positions.every(count=>count >= 3 && count <= 4));
});

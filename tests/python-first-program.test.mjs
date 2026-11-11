import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { firstProgramExamples, firstProgramQuestions, studyTrace } from '../src/data/pythonFirstProgram.ts';
test('intro examples produce the documented output in Python', () => {
  for (const example of firstProgramExamples) {
    assert.equal(execFileSync('python3', ['-c', example.code], { input: example.input || '', encoding: 'utf8' }).trim(), example.output);
  }
});
test('trace final output matches Python and quiz has one answer per item', () => {
  assert.equal(execFileSync('python3', ['-c', studyTrace.map(s=>s.line).join('\n')], {encoding:'utf8'}).trim(), '140');
  for (const question of firstProgramQuestions) assert.equal(question.options.filter(o=>o.isCorrect).length,1);
});

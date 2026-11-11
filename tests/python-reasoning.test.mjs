import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { firstProgramReasoning, controlFlowReasoning } from '../src/data/pythonReasoningChallenges.ts';
const run = code => execFileSync('python3', ['-c', code], {encoding:'utf8',timeout:3000}).trim();
test('every reasoning challenge variant has verified Python output', () => {
  for (const challenge of [...firstProgramReasoning, ...controlFlowReasoning]) {
    for (const variant of challenge.variants) assert.equal(run(variant.code), variant.output, `${challenge.id}: ${variant.title}`);
  }
});
test('counterexample transfers expose the intended mechanisms', () => {
  assert.equal(run(firstProgramReasoning[0].variants[0].code.replace('minutes = 30','days = 5')), '140\n100');
  assert.equal(run(firstProgramReasoning[1].variants[0].code.replace('"4"','"12"').replace('"5"','"12"')), '1212\n24');
  const [chain, independent] = controlFlowReasoning[0].variants;
  for (const minutes of [0,20,30]) {
    const a=run(chain.code.replace('minutes = 30',`minutes = ${minutes}`));
    const b=run(independent.code.replace('minutes = 30',`minutes = ${minutes}`));
    if(minutes===30) assert.notEqual(a,b); else assert.equal(a,b);
  }
  assert.equal(run(controlFlowReasoning[1].variants[0].code.replace('range(1, 4)','range(1, 5)')), '4');
  assert.equal(run(controlFlowReasoning[1].variants[1].code.replace('range(1, 4)','range(1, 5)')), '10');
});

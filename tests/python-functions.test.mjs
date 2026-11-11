import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { functionExamples, functionQuestions, returnReasoning } from '../src/data/pythonFunctionsContent.ts';
import { functionCallModel } from '../src/utils/pythonFunctionTrace.ts';
const run=code=>execFileSync('python3',['-c',code],{encoding:'utf8',timeout:3000}).trim();
test('function examples and print/return counterexamples match Python',()=>{
 for(const e of [...functionExamples,...returnReasoning.variants]) assert.equal(run(e.code),e.output);
});
test('call trace matches Python across zero, ordinary and maximum inputs',()=>{
 for(const [minutes,days] of [[0,0],[20,7],[60,7],[30,0]]) {
  const {code,frames}=functionCallModel(minutes,days);
  assert.equal(run(code),frames.at(-1).output);
  assert.ok(frames.slice(0,-1).every(f=>f.output===''));
  assert.match(frames[1].names,/answer not yet assigned/);
  assert.deepEqual(frames.map(f=>f.line),[1,5,2,3,5,6]);
  assert.deepEqual(functionCallModel(minutes,days).frames,frames);
 }
 for(const pair of [[-1,1],[61,1],[1,8],[NaN,1],[1.5,1]]) assert.throws(()=>functionCallModel(...pair),RangeError);
});
test('guard contract handles integer endpoints and catches a bad implementation',()=>{
 const code=functionExamples[3].code;
 assert.equal(run(code+'\nassert weekly_minutes(0, 7) == 0\nassert weekly_minutes(1441, 1) is None\nassert weekly_minutes(1, -1) is None'),'Checks passed');
 assert.throws(()=>execFileSync('python3',['-c',code.replace('return minutes * days','return minutes + days')],{stdio:'pipe',timeout:3000}));
});
test('transfer perimeter contract and missing-return experiment execute as explained',()=>{
 assert.equal(run('def perimeter(width, height):\n    if width < 0 or height < 0:\n        return None\n    return 2 * (width + height)\nfor w, h in ((3,4),(0,5),(0,0),(-1,4)):\n    print(perimeter(w,h))'),'14\n10\n0\nNone');
 assert.equal(run('def total(minutes, days):\n    if days == 0:\n        return 0\nprint(total(20,0))\nprint(total(20,3))'),'0\nNone');
});
test('function quiz has unique answers with varied positions',()=>{
 const counts=[0,0,0];for(const q of functionQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));
});

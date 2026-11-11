import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {collectionExamples,collectionQuestions,appendReasoning} from '../src/data/pythonCollectionsContent.ts';
import {collectionSharingModel} from '../src/utils/pythonCollectionTrace.ts';
const run=code=>execFileSync('python3',['-c',code],{encoding:'utf8',timeout:3000}).trim();
test('collection examples and mutation/return experiments match Python',()=>{
 for(const e of [...collectionExamples,...appendReasoning.variants]) assert.equal(run(e.code),e.output,e.title);
});
test('sharing trace matches Python and graph labels across alias and copy modes',()=>{
 for(const mode of ['alias','copy']) for(const value of [0,30,99]) {
  const {code,frames,snapshots}=collectionSharingModel(mode,value);
  assert.equal(run(code),frames.at(-1).output);
  assert.equal(snapshots[2].shared,mode==='alias');
  assert.deepEqual(snapshots[3].original,mode==='alias'?[10,20,value]:[10,20]);
  assert.deepEqual(snapshots[3].other,[10,20,value]);
  assert.deepEqual(snapshots[2].original,[10,20],'later appends must not alter earlier snapshots');
  assert.equal(frames[2].output,'');
  assert.equal(snapshots.length,frames.length+1);
 }
 for(const value of [-1,100,NaN,1.5]) assert.throws(()=>collectionSharingModel('copy',value),RangeError);
 assert.throws(()=>collectionSharingModel('unknown',10),RangeError);
});
test('frequency counter preserves input and accounts for all observations',()=>{
 const definition=collectionExamples[5].code.split('\nprint(count_topics')[0];
 assert.equal(run(definition+'\nsource = ["cpu", "ram", "cpu", "CPU"]\nbefore = source.copy()\ncounts = count_topics(source)\nassert source == before\nassert counts == {"cpu": 2, "ram": 1, "CPU": 1}\nassert sum(counts.values()) == len(source)\nassert count_topics([]) == {}\nprint("verified")'),'verified');
});
test('documented absent-item, immutability and hashability failures occur',()=>{
 const cases=[['[][0]','IndexError'],['{}["missing"]','KeyError'],['record = (1, 2)\nrecord[0] = 3','TypeError'],['{[1]: 2}','TypeError'],['[1].remove(2)','ValueError']];
 for(const [code,error] of cases) {
  try {run(code);assert.fail('expected '+error);} catch(e) {assert.match(String(e.stderr),new RegExp(error));}
 }
 assert.equal(run('print([1, 2][4:99])\nrecord = ([1],)\nrecord[0].append(2)\nprint(record)'), '[]\n([1, 2],)');
});
test('transfer solution preserves requested order, duplicates and both inputs',()=>{
 assert.equal(run('def missing_items(requested, available):\n    result = []\n    for name in requested:\n        if name not in available:\n            result.append(name)\n    return result\nrequested = ["pen", "pad", "pen"]\navailable = {"pad"}\nassert missing_items(requested, available) == ["pen", "pen"]\nassert requested == ["pen", "pad", "pen"]\nassert available == {"pad"}\nassert missing_items([], available) == []\nassert missing_items(["pad"], available) == []\nprint("verified")'),'verified');
});
test('collection knowledge check has unique answers and varied positions',()=>{
 const counts=[0,0,0];for(const q of collectionQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));
});

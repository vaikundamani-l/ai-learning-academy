import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {exceptionExamples,exceptionReasoning,exceptionQuestions,parseMinutesDefinition,tracebackDemo} from '../src/data/pythonExceptionsContent.ts';
import {exceptionFlowModel,validationCases} from '../src/utils/pythonExceptionTrace.ts';
const run=code=>execFileSync('python3',['-c',code],{encoding:'utf8',timeout:3000}).trim();
test('exception examples and false-success contrasts execute as documented',()=>{
 for(const example of [...exceptionExamples,...exceptionReasoning.variants]) assert.equal(run(example.code),example.output,example.title);
});
test('validation trace matches Python and distinguishes failed conversion from range rejection',()=>{
 for(const item of validationCases){const model=exceptionFlowModel(item.id);assert.equal(run(model.code),model.frames.at(-1).output);assert.equal(model.frames[1].output,'');assert.deepEqual(model,exceptionFlowModel(item.id));}
 assert.match(exceptionFlowModel('text').frames[1].names,/minutes not assigned/);
 assert.match(exceptionFlowModel('range').frames[1].names,/minutes → -1/);
 assert.deepEqual(exceptionFlowModel('text').frames.map(f=>f.line),[1,3,7,10]);
 assert.deepEqual(exceptionFlowModel('range').frames.map(f=>f.line),[1,3,4,5,7,10]);
 assert.deepEqual(exceptionFlowModel('zero').frames.map(f=>f.line),[1,3,4,9,10]);
 assert.throws(()=>exceptionFlowModel('unknown'),RangeError);
});
test('parser validates domain boundaries, preserves conversion cause and exposes wrong types',()=>{
 assert.equal(run(parseMinutesDefinition+'\nfor raw, expected in [("0",0),("60",60),(" 3 ",3),("+2",2)]:\n    assert parse_minutes(raw) == expected\nfor raw in ["-1","61","","2.5"]:\n    try:\n        parse_minutes(raw)\n    except ValueError:\n        continue\n    raise AssertionError("invalid input accepted")\ntry:\n    parse_minutes("bad")\nexcept ValueError as error:\n    assert isinstance(error.__cause__, ValueError)\ntry:\n    parse_minutes(None)\nexcept TypeError:\n    print("verified")'),'verified');
});
test('bounded attempts report exhaustion including empty input instead of saving zero',()=>{
 for(const replacement of ['["bad", "-1"]','[]']) {
  const output=run(exceptionExamples[4].code.replace('["bad", "-1", "25"]',replacement));
  assert.ok(output.endsWith('No valid entry was saved'));assert.ok(!output.includes('Saved minutes:'));
 }
});
test('unhandled traceback and a narrow handler preserve unexpected defects',()=>{
 const traceback=spawnSync('python3',['-c',tracebackDemo],{encoding:'utf8',timeout:3000});
 assert.notEqual(traceback.status,0);assert.match(traceback.stderr,/ValueError/);assert.match(traceback.stderr,/in record/);assert.match(traceback.stderr,/in parse/);
 const defect=spawnSync('python3',['-c','try:\n    result = misspelled_name\nexcept ValueError:\n    print("bad input")'],{encoding:'utf8',timeout:3000});
 assert.notEqual(defect.status,0);assert.match(defect.stderr,/NameError/);assert.equal(defect.stdout,'');
});
test('quantity transfer rejects invalid strings and respects its distinct nonzero contract',()=>{
 const definition=parseMinutesDefinition.replace('parse_minutes','parse_quantity').replace('minutes < 0 or minutes > 60','minutes < 1 or minutes > 100').replace('Use minutes from 0 to 60','Use quantity from 1 to 100');
 assert.equal(run(definition+'\nfor raw, expected in [("1",1),("100",100),(" 3 ",3)]:\n    assert parse_quantity(raw) == expected\nfor raw in ["0","101","","2.5"]:\n    try:\n        parse_quantity(raw)\n    except ValueError:\n        continue\n    raise AssertionError("invalid quantity accepted")\ntry:\n    parse_quantity(None)\nexcept TypeError:\n    print("verified")'),'verified');
});
test('exception quiz has one correct answer per question and varied answer positions',()=>{
 const counts=[0,0,0];for(const q of exceptionQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));
});

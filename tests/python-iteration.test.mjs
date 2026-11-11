import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {iteratorExample,iteratorOutput,counterDefinition,counterExample,counterOutput,squareDefinition,generatorProgram,pipelineDefinition,pipelineExample,pipelineOutput,scopeExample,scopeOutput,closureExample,closureOutput,scopeReasoning,lifetimeExample,lifetimeOutput,quantityGenerator,iterationQuestions} from '../src/data/pythonIterationContent.ts';
import {iterationTrace} from '../src/utils/pythonIterationTrace.ts';
const run=code=>execFileSync('python3',['-c',code],{encoding:'utf8',timeout:10000}).trim();

test('complete iterator, scope, closure, pipeline and resource examples produce their documented output',()=>{
 for(const [code,output] of [[iteratorExample,iteratorOutput],[counterExample,counterOutput],[pipelineExample,pipelineOutput],[scopeExample,scopeOutput],[closureExample,closureOutput],[lifetimeExample,lifetimeOutput]])assert.equal(run(code),output);
 for(const variant of scopeReasoning.variants)assert.equal(run(variant.code),variant.output);
});
test('all generator replay outputs match Python and its observable state after requests',()=>{
 for(const kind of ['normal','invalid','empty']){
  const model=iterationTrace(kind);assert.equal(run(model.code),model.output);
  const definition=generatorProgram(kind).split('\nprint("Created")')[0];
  const states=JSON.parse(run('import inspect, json\n'+definition+`\nstates = [inspect.getgeneratorstate(stream)]
for attempt in range(4):
    try:
        next(stream)
    except (StopIteration, ValueError):
        pass
    states.append(inspect.getgeneratorstate(stream))
print(json.dumps(states))`));
  const mapping={created:'GEN_CREATED',suspended:'GEN_SUSPENDED',closed:'GEN_CLOSED'};
  const settled=model.frames.filter(f=>f.line===13||f.line===15||(f.line===11&&f.explanation.startsWith('The next call has returned')));
  assert.deepEqual([mapping[model.frames[2].status],...settled.map(f=>mapping[f.status])],states);
  assert.equal(model.frames[2].consumed,0);assert.equal(model.frames.at(-1).status,'closed');
  assert.ok(model.frames.every(f=>f.line>=1&&f.line<=model.code.split('\n').length));
  const outputs=model.frames.map(f=>f.output);for(let i=1;i<outputs.length;i++)assert.ok(outputs[i].startsWith(outputs[i-1]));
  for(const f of model.frames.filter(f=>f.line===5))assert.equal(f.status,'suspended');
 }
 assert.throws(()=>iterationTrace('unknown'),RangeError);
});
test('a scratch iterator is its own cursor, stays exhausted and validates constructor boundaries',()=>{
 assert.equal(run(counterDefinition+`
a = CountTo(2)
b = iter(a)
assert a is b
assert next(a) == 0
assert next(b) == 1
assert a.current == 2
for attempt in range(3):
    try:
        next(a)
    except StopIteration:
        assert a.current == 2
    else:
        raise AssertionError("exhaustion lost")
for value in [True, 1.0, "2", None]:
    try:
        CountTo(value)
    except TypeError:
        continue
    raise AssertionError("type accepted")
try:
    CountTo(-1)
except ValueError:
    print("verified")`),'verified');
});
test('shared and independent iterator sources behave differently even when wrappers are recreated',()=>{
 assert.equal(run(iteratorExample.replace('second = iter(values)','second = first')),'2\n[3]\n[]\n[]\n[2, 3]');
 assert.equal(run(squareDefinition+`
source = iter([2, 3])
assert list(squares(source)) == [4, 9]
assert list(squares(source)) == []
assert list(squares([2, 3])) == [4, 9]
print("verified")`),'verified');
});
test('lazy validation examines only consumed records, preserves physical positions and closes on error',()=>{
 assert.equal(run(pipelineDefinition+`
seen = []
def source():
    for raw in ["10", "", "61", "20"]:
        seen.append(raw)
        yield raw
stream = valid_minutes(source())
assert seen == []
assert next(stream) == 10
assert seen == ["10"]
try:
    next(stream)
except ValueError as error:
    assert str(error) == "line 3: minutes outside 0–60"
else:
    raise AssertionError("range accepted")
assert seen == ["10", "", "61"]
assert list(stream) == []
assert list(valid_minutes([])) == []
assert list(valid_minutes(["0", "60"])) == [0, 60]
assert sum(valid_minutes(["10", "", "20"])) == 30
try:
    sum(valid_minutes(["10", "bad"]))
except ValueError as error:
    assert str(error) == "line 2: expected integer"
    assert isinstance(error.__cause__, ValueError)
else:
    raise AssertionError("malformed accepted")
print("verified")`),'verified');
});
test('generator body error differs from iterator exhaustion and explicit StopIteration is not a valid generator exit',()=>{
 assert.equal(run(`def wrong():
    yield 1
    raise StopIteration
stream = wrong()
assert next(stream) == 1
try:
    next(stream)
except RuntimeError as error:
    assert isinstance(error.__cause__, StopIteration)
else:
    raise AssertionError("explicit StopIteration escaped normally")
assert list(stream) == []
print("verified")`),'verified');
});
test('scope boundaries include shared closure bindings, defaults as references and independent counters',()=>{
 assert.equal(run(closureExample+`
assert first() == 3
assert second() == 2
alias = first
assert alias() == 4
assert first() == 5
values = []
def read(saved=values):
    return saved
values.append(7)
assert read() == [7]
assert read() is values
item = "module"
[item for item in [1, 2]]
assert item == "module"
def broken_counter():
    count = 0
    def advance():
        count += 1
    return advance
try:
    broken_counter()()
except UnboundLocalError:
    print("verified")`),'1 2 1\nverified');
});
test('quantity transfer yields valid items but never returns a successful report after invalid data',()=>{
 assert.equal(run(quantityGenerator+`
def report(values):
    count = total = 0
    for value in quantities(values):
        count += 1
        total += value
    return count, total
assert report([]) == (0, 0)
assert report([1, 100]) == (2, 101)
for data, error_type in [([1, 0], ValueError), ([101], ValueError), ([True], TypeError), (["3"], TypeError), ([1.0], TypeError)]:
    try:
        report(data)
    except error_type as error:
        assert str(error).startswith("item ")
    else:
        raise AssertionError("invalid report returned")
stream = quantities([1, 0])
assert next(stream) == 1
try:
    next(stream)
except ValueError as error:
    assert str(error) == "item 2: quantity outside 1–100"
assert list(stream) == []
print("verified")`),'verified');
});
test('iteration knowledge check has one correct option and varied answer positions',()=>{
 const counts=[0,0,0];assert.equal(iterationQuestions.length,10);
 for(const q of iterationQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));
});

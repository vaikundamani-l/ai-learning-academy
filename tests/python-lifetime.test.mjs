import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {leaseDefinition,lifetimeProgram,tracedDefinition,decoratorExample,decoratorOutput,resourceExample,resourceOutput,stackingExample,stackingOutput,asyncDefinition,asyncExample,asyncOutput,managedTextDefinition,returnReasoning,transferDefinition,lifetimeQuestions} from '../src/data/pythonLifetimeContent.ts';
import {lifetimeTrace} from '../src/utils/lifetimeTrace.ts';
const run=code=>execFileSync('python3',['-c',code],{encoding:'utf8',timeout:10000}).trim();

test('complete decorator/resource/stacking/async examples and reasoning variants match Python',()=>{
 for(const [code,output] of [[decoratorExample,decoratorOutput],[resourceExample,resourceOutput],[stackingExample,stackingOutput],[asyncExample,asyncOutput]])assert.equal(run(code),output);
 for(const variant of returnReasoning.variants)assert.equal(run(variant.code),variant.output);
});
test('all six lifetime replays match real Python events and keep historical state',()=>{
 for(const kind of ['success','bodyError','earlyReturn','enterError','suppress','exitError']){
  const model=lifetimeTrace(kind);assert.deepEqual(JSON.parse(run(lifetimeProgram(kind))),{active:model.active,events:model.events});
  assert.equal(model.active,false);assert.equal(model.frames.at(-1).active,false);
  assert.equal(model.frames[0].events.length,0);assert.equal(model.frames[0].active,false);
  for(let i=1;i<model.frames.length;i++)assert.deepEqual(model.frames[i].events.slice(0,model.frames[i-1].events.length),model.frames[i-1].events);
 }
 const entry=lifetimeTrace('enterError');assert.ok(entry.frames.every(f=>!f.bodyReached));assert.ok(!entry.events.some(e=>e.startsWith('exit ')));
 assert.ok(lifetimeTrace('exitError').events.includes('context ValueError'));
 assert.ok(lifetimeTrace('earlyReturn').events.includes('exit None'));
 assert.throws(()=>lifetimeTrace('unknown'),RangeError);
});
test('context protocol preserves body exception identity and gives None for normal/return paths',()=>{
 assert.equal(run(leaseDefinition+String.raw`
class Observed(Lease):
    def __exit__(self, kind, value, traceback):
        self.args = kind, value, traceback
        return super().__exit__(kind,value,traceback)
events = []
manager = Observed(events)
error = ValueError("specific instance")
try:
    with manager as resource:
        assert resource is manager and manager.active
        raise error
except ValueError as caught:
    assert caught is error
assert manager.args[0] is ValueError and manager.args[1] is error
assert manager.args[2] is not None and not manager.active
normal = Observed([])
with normal:
    pass
assert normal.args == (None,None,None)
early = Observed([])
def return_early():
    with early:
        return object()
result = return_early()
assert early.args == (None,None,None) and not early.active
print("verified")`),'verified');
});
test('entry failure, overlapping reuse and target binding failure retain the right cleanup owner',()=>{
 assert.equal(run(leaseDefinition+String.raw`
events = []
lease = Lease(events, fail_enter=True)
try:
    with lease:
        raise AssertionError("body should not run")
except ValueError:
    pass
assert events == ["enter","entry cleanup"] and not lease.active
lease = Lease([])
try:
    with lease:
        with lease:
            raise AssertionError("nested body should not run")
except RuntimeError:
    pass
assert lease.events == ["enter","exit RuntimeError"] and not lease.active
class PairSource:
    def __init__(self):
        self.closed = False
    def __enter__(self):
        return (1,)
    def __exit__(self,kind,value,tb):
        self.closed = True
        assert kind is ValueError
pair = PairSource()
try:
    with pair as (first,second):
        raise AssertionError("binding failure precedes body")
except ValueError:
    pass
assert pair.closed
print("verified")`),'verified');
});
test('narrow suppression skips the remaining body and cleanup error retains original context',()=>{
 assert.equal(run(leaseDefinition+String.raw`
events = []
with Lease(events,suppress=True):
    events.append("before error")
    raise ValueError("handled")
    events.append("must not run")
assert events == ["enter","before error","exit ValueError"]
original = ValueError("body")
lease = Lease([],fail_exit=True)
try:
    with lease:
        raise original
except RuntimeError as error:
    assert error.__context__ is original
else:
    raise AssertionError("cleanup error swallowed")
assert not lease.active
try:
    with Lease([],suppress=True):
        raise TypeError("not suppressed")
except TypeError:
    print("verified")`),'verified');
});
test('wrapper forwards positional/keyword arguments, same result/error objects and metadata',()=>{
 assert.equal(run(tracedDefinition+String.raw`
import io
import inspect
from contextlib import redirect_stdout
result = object()
error = ValueError("one instance")
def original(value, *, scale=2):
    """Identity contract."""
    if value == "bad":
        raise error
    assert value == 3 and scale == 4
    return result
wrapped = traced(original)
with redirect_stdout(io.StringIO()) as output:
    assert wrapped(3,scale=4) is result
    try:
        wrapped("bad",scale=4)
    except ValueError as caught:
        assert caught is error
    else:
        raise AssertionError("exception lost")
assert output.getvalue().splitlines() == ["enter original","exit original","enter original","exit original"]
assert wrapped is not original
assert wrapped.__name__ == original.__name__
assert wrapped.__doc__ == original.__doc__
assert wrapped.__wrapped__ is original and inspect.unwrap(wrapped) is original
print("verified")`),'verified');
});
test('generator context factories close real files, are one-shot and enforce exactly one yield',()=>{
 assert.equal(run(managedTextDefinition+String.raw`
from tempfile import TemporaryDirectory
from pathlib import Path
from contextlib import contextmanager, ExitStack
with TemporaryDirectory() as folder:
    path = Path(folder)/"input.txt"
    path.write_text("20\n",encoding="utf-8")
    manager = managed_text(path)
    with manager as handle:
        assert handle.read() == "20\n"
    assert handle.closed
    try:
        with manager:
            pass
    except (AttributeError,RuntimeError):
        pass
    else:
        raise AssertionError("one-shot manager reused")
    with managed_text(path) as second:
        assert not second.closed
    assert second.closed
    try:
        with managed_text(Path(folder)/"missing.txt"):
            pass
    except FileNotFoundError:
        pass
    else:
        raise AssertionError("missing file accepted")
@contextmanager
def zero():
    if False:
        yield
@contextmanager
def two():
    yield 1
    yield 2
for factory in [zero,two]:
    try:
        with factory():
            pass
    except RuntimeError:
        continue
    raise AssertionError("yield protocol not enforced")
events = []
try:
    with ExitStack() as stack:
        stack.callback(events.append,"first closed")
        stack.callback(events.append,"second closed")
        raise ValueError("later acquisition failed")
except ValueError:
    pass
assert events == ["second closed","first closed"]
print("verified")`),'verified');
});
test('a synchronous wrapper brackets coroutine/generator construction rather than deferred work',()=>{
 assert.equal(run(tracedDefinition+String.raw`
import io
import asyncio
from contextlib import redirect_stdout
events = []
async def deferred():
    events.append("async body")
    return 3
with redirect_stdout(io.StringIO()) as output:
    pending = traced(deferred)()
assert events == []
assert output.getvalue().splitlines() == ["enter deferred","exit deferred"]
assert asyncio.run(pending) == 3 and events == ["async body"]
def generated():
    events.append("generator body")
    yield 4
with redirect_stdout(io.StringIO()) as output:
    stream = traced(generated)()
assert events == ["async body"]
assert output.getvalue().splitlines() == ["enter generated","exit generated"]
assert next(stream) == 4
stream.close()
assert events == ["async body","generator body"]
print("verified")`),'verified');
});
test('async context and wrapper preserve cancellation after cooperative cleanup',()=>{
 assert.equal(run(asyncDefinition+String.raw`
async def check():
    events = []
    started = asyncio.Event()
    @async_traced
    async def blocked(*,events):
        async with session(events):
            started.set()
            await asyncio.Event().wait()
    task = asyncio.create_task(blocked(events=events))
    await started.wait()
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass
    else:
        raise AssertionError("cancellation swallowed")
    assert task.cancelled()
    assert events == ["wrapper enter","session open","session closed","wrapper exit"]
asyncio.run(check())
print("verified")`),'verified');
});
test('inventory transfer closes on rejection and preserves quantity boundaries/metadata',()=>{
 assert.equal(run(transferDefinition+String.raw`
assert quantity(1) == 1 and quantity(100) == 100
assert quantity.__name__ == "quantity"
for value, expected in [(0,ValueError),(101,ValueError),(True,TypeError),("3",TypeError)]:
    events = []
    try:
        with recording_scope(events) as resource:
            assert resource is events
            quantity(value)
    except expected:
        pass
    else:
        raise AssertionError("invalid quantity accepted")
    assert events == ["open","close"]
print("verified")`),'verified');
});
test('lifetime quiz has a single correct answer and balanced positions',()=>{
 const counts=[0,0,0];for(const q of lifetimeQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {updateProgram,coroutineExample,coroutineOutput,threadDefinition,threadExample,threadOutput,asyncDefinition,asyncExample,asyncOutput,failureExample,failureOutput,timeoutExample,timeoutOutput,processExample,processOutput,measurementExample,updateReasoning,concurrencyQuestions} from '../src/data/pythonConcurrencyContent.ts';
import {concurrencyTrace} from '../src/utils/concurrencyTrace.ts';
const run=code=>execFileSync('python3',['-c',code],{encoding:'utf8',timeout:15000}).trim();
function workspace(fn){const dir=mkdtempSync(join(tmpdir(),'academy-concurrency-'));try{return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}

test('coroutine, thread, async, failure and timeout programs match their documented outputs',()=>{
 for(const [code,expected] of [[coroutineExample,coroutineOutput],[threadExample,threadOutput],[asyncExample,asyncOutput],[failureExample,failureOutput],[timeoutExample,timeoutOutput]])assert.equal(run(code),expected);
 for(const variant of updateReasoning.variants)assert.equal(run(variant.code),variant.output);
});
test('three schedule models match real Python events/results and preserve historical snapshots',()=>{
 for(const mode of ['unsafe','locked','owned']){
  const model=concurrencyTrace(mode);
  for(let repeat=0;repeat<3;repeat++)assert.deepEqual(JSON.parse(run(updateProgram(mode))),{count:model.count,events:model.events});
  assert.equal(model.frames.at(-1).count,model.count);assert.ok(model.frames.every(f=>f.count>=0&&f.count<=2));
  for(let i=1;i<model.frames.length;i++)assert.deepEqual(model.frames[i].events.slice(0,model.frames[i-1].events.length),model.frames[i-1].events);
 }
 const unsafe=concurrencyTrace('unsafe');assert.equal(unsafe.count,1);
 const afterRead=unsafe.frames.find(f=>f.task==='A'&&f.operation==='Read shared count');assert.deepEqual(afterRead.snapshots,{A:0,B:null});
 assert.deepEqual(unsafe.frames.at(-1).snapshots,{A:0,B:0});
 const locked=concurrencyTrace('locked');assert.equal(locked.frames.find(f=>f.task==='B'&&f.operation==='Read shared count').snapshots.B,1);
 assert.throws(()=>concurrencyTrace('unknown'),RangeError);
});
test('thread batches preserve submission order, inputs and boundary errors without returning a partial report',()=>{
 assert.equal(run(threadDefinition+String.raw`
source = [("bolt", "1"), ("nut", "100")]
assert thread_batch(source) == [("bolt",1),("nut",100)]
assert source == [("bolt","1"),("nut","100")]
assert thread_batch([]) == []
for records in [[("bolt","0")],[("bolt","101")],[("bolt",True)],[("BOLT","1")],[("bolt","bad")],[("bolt","1")]*9,[("only",)],[("bolt","1"), ("nut","bad")]]:
    try:
        thread_batch(records)
    except (ValueError,TypeError):
        continue
    raise AssertionError("invalid batch accepted")
print("verified")`),'verified');
});
test('running thread work survives result timeout while queued future cancellation prevents execution',()=>{
 assert.equal(run(String.raw`from concurrent.futures import ThreadPoolExecutor, TimeoutError, CancelledError
from threading import Event
started, release = Event(), Event()
def work():
    started.set()
    if not release.wait(3):
        raise RuntimeError("test gate not released")
    return 3
with ThreadPoolExecutor(max_workers=1) as pool:
    running = pool.submit(work)
    try:
        assert started.wait(2)
        queued = pool.submit(lambda: 99)
        assert queued.cancel() is True
        assert running.cancel() is False
        try:
            running.result(timeout=0)
        except TimeoutError:
            pass
        else:
            raise AssertionError("running result completed before release")
        try:
            queued.result()
        except CancelledError:
            pass
        else:
            raise AssertionError("cancelled job returned a value")
    finally:
        release.set()
    assert running.result(timeout=2) == 3
print("verified")`),'verified');
});
test('async batch validates bounds, preserves order and cleans active jobs after success or failure',()=>{
 assert.equal(run(asyncDefinition+String.raw`
async def check():
    original = load_quantity
    active = peak = 0
    async def observed(name, text):
        nonlocal active, peak
        active += 1
        peak = max(peak,active)
        try:
            await asyncio.sleep(0)
            return parse_quantity(name,text)
        finally:
            active -= 1
    globals()["load_quantity"] = observed
    try:
        assert await async_batch([]) == []
        assert await async_batch([("bolt","3"),("nut","100")]) == [("bolt",3),("nut",100)]
        assert await async_batch([("bolt","1")]*8,limit=2) == [("bolt",1)]*8
        assert peak == 2 and active == 0
        failed = False
        try:
            await async_batch([("bolt","bad"),("nut","3"),("pin","4")])
        except* ValueError:
            failed = True
        assert failed and active == 0
        for limit in [0,5,True,1.5]:
            try:
                await async_batch([],limit)
            except ValueError:
                continue
            raise AssertionError("bad limit accepted")
        try:
            await async_batch([("bolt","1")]*9)
        except ValueError:
            pass
        else:
            raise AssertionError("unbounded task input accepted")
    finally:
        globals()["load_quantity"] = original
asyncio.run(check())
print("verified")`),'verified');
});
test('TaskGroup failure cancels and awaits sibling cleanup, preserving the child error',()=>{
 assert.equal(run(String.raw`import asyncio
async def check():
    cleaned = []
    ready = asyncio.Event()
    async def child():
        try:
            ready.set()
            await asyncio.Event().wait()
        finally:
            cleaned.append(True)
    async def fail():
        await ready.wait()
        raise RuntimeError("still propagated")
    try:
        async with asyncio.TaskGroup() as group:
            group.create_task(child())
            group.create_task(fail())
    except* RuntimeError as errors:
        assert cleaned == [True]
        assert any(str(error)=="still propagated" for error in errors.exceptions)
    assert cleaned == [True]
asyncio.run(check())
print("verified")`),'verified');
});
test('parent cancellation propagates after the async batch has cleaned every active job',()=>{
 assert.equal(run(asyncDefinition+String.raw`
async def check():
    active = 0
    ready = asyncio.Event()
    async def blocked(name, text):
        nonlocal active
        active += 1
        ready.set()
        try:
            await asyncio.Event().wait()
        finally:
            active -= 1
    globals()["load_quantity"] = blocked
    batch = asyncio.create_task(async_batch([("bolt","1"),("nut","2")]))
    await ready.wait()
    batch.cancel()
    try:
        await batch
    except asyncio.CancelledError:
        assert active == 0
    else:
        raise AssertionError("cancellation swallowed")
    assert batch.cancelled()
asyncio.run(check())
print("verified")`),'verified');
});
test('process example executes from an importable script using real spawn workers',()=>workspace(dir=>{
 const file=join(dir,'process_squares.py');writeFileSync(file,processExample);
 assert.equal(execFileSync('python3',[file],{cwd:dir,encoding:'utf8',timeout:15000}).trim(),processOutput);
 const probe='from process_squares import sum_squares\nfor n in [0,1,3,5,20]:\n    assert sum_squares(n) == n*(n-1)*(2*n-1)//6\nfor n in [-1,100001,True,1.5]:\n    try:\n        sum_squares(n)\n    except ValueError:\n        continue\n    raise AssertionError("invalid input accepted")\nprint("verified")';
 assert.equal(execFileSync('python3',['-c',probe],{cwd:dir,encoding:'utf8',timeout:10000}).trim(),'verified');
}));
test('measured sleep workload reports real finite durations and equivalent results without asserting a winner',()=>{
 const result=JSON.parse(run(measurementExample));assert.equal(result.result,2);assert.equal(typeof result.python,'string');
 assert.ok(Number.isFinite(result.sequential_seconds)&&result.sequential_seconds>=0);assert.ok(Number.isFinite(result.concurrent_seconds)&&result.concurrent_seconds>=0);
});
test('inventory batch transfer returns a report only after all owned results succeed',()=>{
 assert.equal(run(asyncDefinition+String.raw`
async def report(records):
    results = await async_batch(records)
    return {"rows":len(results),"total":sum(quantity for name,quantity in results)}
async def check():
    assert await report([]) == {"rows":0,"total":0}
    assert await report([("bolt","3"),("nut","100")]) == {"rows":2,"total":103}
    for raw in ["0","101","True","bad"]:
        rejected = False
        try:
            await report([("bolt","3"),("nut",raw)])
        except* ValueError:
            rejected = True
        assert rejected
asyncio.run(check())
print("verified")`),'verified');
});
test('concurrency quiz has one correct answer per item and balanced positions',()=>{
 const counts=[0,0,0];for(const q of concurrencyQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));
});

import type {ReasoningChallengeData} from './pythonReasoningChallenges';
export type UpdateMode='unsafe'|'locked'|'owned';
export function updateProgram(mode:UpdateMode){
 const body=mode==='owned'?`    async def add(name):
        events.append(f"{name}: compute 1")
        await asyncio.sleep(0)
        return 1
    async with asyncio.TaskGroup() as group:
        first = group.create_task(add("A"))
        second = group.create_task(add("B"))
    count = first.result() + second.result()`:`    lock = asyncio.Lock()
    async def add(name):
        nonlocal count
${mode==='locked'?'        async with lock:\n':''}${mode==='locked'?'    ':''}        snapshot = count
${mode==='locked'?'    ':''}        events.append(f"{name}: read {snapshot}")
${mode==='locked'?'    ':''}        await asyncio.sleep(0)
${mode==='locked'?'    ':''}        count = snapshot + 1
${mode==='locked'?'    ':''}        events.append(f"{name}: write {count}")
    async with asyncio.TaskGroup() as group:
        group.create_task(add("A"))
        group.create_task(add("B"))`;
 return `import asyncio
import json

async def main():
    count = 0
    events = []
${body}
    print(json.dumps({"count": count, "events": events}))

asyncio.run(main())`;
}
export const coroutineExample = `import asyncio

async def label(name):
    await asyncio.sleep(0)
    return name

async def main():
    pending = label("cpu")
    print("Created coroutine")
    print(await pending)
    async with asyncio.TaskGroup() as group:
        first = group.create_task(label("cpu"))
        second = group.create_task(label("ram"))
    print([first.result(), second.result()])

asyncio.run(main())`;
export const coroutineOutput = "Created coroutine\ncpu\n['cpu', 'ram']";
export const quantityHelpers = `def check_records(records):
    if type(records) not in (list, tuple) or len(records) > 8:
        raise ValueError("provide at most eight records in a list or tuple")
    for record in records:
        if type(record) is not tuple or len(record) != 2:
            raise ValueError("each record must be a (name, text) tuple")
    return tuple(records)

def parse_quantity(name, text):
    if type(name) is not str or not name or len(name) > 8 or any(not "a" <= char <= "z" for char in name):
        raise ValueError("name must be 1–8 lowercase ASCII letters")
    if type(text) is not str:
        raise TypeError("quantity text required")
    value = int(text)
    if not 1 <= value <= 100:
        raise ValueError("quantity must be from 1 to 100")
    return name, value`;
export const threadDefinition = `import time
from concurrent.futures import ThreadPoolExecutor

${quantityHelpers}

def blocking_quantity(name, text):
    time.sleep(0.01)  # Synthetic blocking wait, not a performance benchmark.
    return parse_quantity(name, text)

def thread_batch(records):
    items = check_records(records)
    with ThreadPoolExecutor(max_workers=2) as pool:
        futures = [pool.submit(blocking_quantity, name, text) for name, text in items]
        results = [future.result() for future in futures]
    return results`;
export const threadExample=threadDefinition+`

print(thread_batch([("bolt", "3"), ("nut", "5")]))
try:
    thread_batch([("bolt", "3"), ("nut", "bad")])
except ValueError:
    print("Batch failed; no report returned")`;
export const threadOutput="[('bolt', 3), ('nut', 5)]\nBatch failed; no report returned";
export const asyncDefinition = `import asyncio

${quantityHelpers}

async def load_quantity(name, text):
    await asyncio.sleep(0.01)  # Synthetic asynchronous wait.
    return parse_quantity(name, text)

async def async_batch(records, limit=2):
    items = check_records(records)
    if type(limit) is not int or not 1 <= limit <= 4:
        raise ValueError("limit must be an exact integer from 1 to 4")
    slots = asyncio.Semaphore(limit)
    async def one(name, text):
        async with slots:
            return await load_quantity(name, text)
    async with asyncio.TaskGroup() as group:
        tasks = [group.create_task(one(name, text)) for name, text in items]
    return [task.result() for task in tasks]`;
export const asyncExample = asyncDefinition+`

async def main():
    print(await async_batch([("bolt", "3"), ("nut", "5")]))
    try:
        await async_batch([("bolt", "3"), ("nut", "bad")])
    except* ValueError:
        print("Batch failed; no report returned")

asyncio.run(main())`;
export const asyncOutput=threadOutput;
export const failureExample = `import asyncio

async def main():
    events = []
    started = asyncio.Event()
    never = asyncio.Event()
    async def worker():
        try:
            started.set()
            await never.wait()
        finally:
            events.append("worker cleaned")
    async def fail():
        await started.wait()
        raise ValueError("synthetic failure")
    try:
        async with asyncio.TaskGroup() as group:
            group.create_task(worker())
            group.create_task(fail())
    except* ValueError:
        events.append("batch failed")
    print(events)

asyncio.run(main())`;
export const failureOutput="['worker cleaned', 'batch failed']";
export const timeoutExample = `import asyncio

async def main():
    events = []
    async def wait_forever():
        try:
            await asyncio.Event().wait()
        finally:
            events.append("waiter cleaned")
    try:
        async with asyncio.timeout(0.01):
            await wait_forever()
    except TimeoutError:
        events.append("timeout reported")
    print(events)

asyncio.run(main())`;
export const timeoutOutput="['waiter cleaned', 'timeout reported']";
export const processExample = `from concurrent.futures import ProcessPoolExecutor
from multiprocessing import get_context

def sum_squares(stop):
    if type(stop) is not int or not 0 <= stop <= 100000:
        raise ValueError("stop must be an exact integer from 0 to 100000")
    return sum(value * value for value in range(stop))

def main():
    with ProcessPoolExecutor(max_workers=2, mp_context=get_context("spawn")) as pool:
        results = list(pool.map(sum_squares, [3, 5]))
    print(results)
    print(sum(results))

if __name__ == "__main__":
    main()`;
export const processOutput='[5, 30]\n35';
export const measurementExample = `import asyncio
import json
import platform
import time

async def job():
    await asyncio.sleep(0.02)
    return 1

async def measure():
    start = time.perf_counter()
    sequential = [await job(), await job()]
    sequential_seconds = time.perf_counter() - start
    start = time.perf_counter()
    async with asyncio.TaskGroup() as group:
        first = group.create_task(job())
        second = group.create_task(job())
    concurrent = [first.result(), second.result()]
    concurrent_seconds = time.perf_counter() - start
    if sequential != concurrent:
        raise AssertionError("results differ")
    print(json.dumps({"python": platform.python_version(),
                      "sequential_seconds": sequential_seconds,
                      "concurrent_seconds": concurrent_seconds,
                      "result": sum(concurrent)}))

asyncio.run(measure())`;
export const updateReasoning:ReasoningChallengeData={id:'concurrency-update',title:'Can one loop thread still lose an update?',question:'Predict the final count, then explain which saved values survive the suspension. Both tasks are intended to add one.',transfer:'Remove the deliberate suspension in a disposable copy. Explain why a passing run is not a portable thread-safety or transaction guarantee.',variants:[
 {title:'Shared read, suspend, write',code:updateProgram('unsafe'),output:'{"count": 1, "events": ["A: read 0", "B: read 0", "A: write 1", "B: write 1"]}',steps:['Both tasks save count equal to zero before suspending at sleep(0).','A writes its saved zero plus one. B later writes its own saved zero plus one, overwriting the same value.','The chosen interleaving loses an update even on a single event-loop thread. This trace uses the normal task scheduling verified on Python 3.12.']},
 {title:'Owned results, one aggregation',code:updateProgram('owned'),output:'{"count": 2, "events": ["A: compute 1", "B: compute 1"]}',steps:['Each task returns its own independent contribution instead of reading and rewriting shared count.','The parent waits for successful group completion before collecting results.','One parent sums 1 + 1 = 2. No competing read/modify/write occurs in these workers.']},
]};
const checks:[string,string[],number,string][]=[
 ['What does concurrency mean?', ['Activities can make overlapping progress','Every activity executes at the same instant','Every program becomes faster'],0,'Parallelism is simultaneous execution; concurrency also includes interleaved waiting.'],
 ['Does calling async def f() automatically run its body?', ['Always','No; it returns a coroutine object','Only if it contains a loop'],1,'Await it or schedule it; ordinary construction is not execution.'],
 ['Does every await necessarily switch to another task?', ['Yes','Only on Windows','No; an already-ready awaitable may complete immediately'],2,'Suspension occurs when the awaited operation needs to wait.'],
 ['Why can two read/suspend/write tasks finish at count 1?', ['The GIL deleted a task','Both saved the same old count','Integers cannot be added'],1,'The shared read/modify/write was not protected as a unit.'],
 ['What is a simpler ownership repair for independent contributions?', ['Return results and aggregate in one parent','Start more workers','Ignore failed results'],0,'Workers do not need to mutate a shared total.'],
 ['What happens when one TaskGroup child raises the shown ValueError?', ['Every successful action is rolled back','The exception disappears','Remaining siblings are cancelled and awaited before grouped failure is raised'],2,'Cancellation/cleanup are structured lifetime behavior, not transactions.'],
 ['Does Future.result(timeout=...) forcibly stop a running thread?', ['Yes','No','Only with max_workers=2'],1,'It limits waiting for that result; running work needs its own stop policy.'],
 ['Why use a main guard in the spawn process example?', ['To suppress all exceptions','To share ordinary lists across processes','To avoid starting another pool when a worker imports the module'],2,'Spawn imports an importable module and passes serializable work.'],
 ['Does a semaphore alone bound the number of created tasks?', ['No; task creation and active work are separate bounds','Always','Only when limit=1'],0,'This example also caps its input at eight jobs.'],
 ['Is the traditional CPython GIL a universal guarantee across all Python builds?', ['Yes','No; implementation/build and native code matter','Only for HTTP'],1,'The lesson verifies GIL-enabled CPython 3.12 and notes optional free-threaded builds separately.'],
];
export const concurrencyQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));

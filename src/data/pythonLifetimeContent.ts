import type {ReasoningChallengeData} from './pythonReasoningChallenges';
export type LifetimeCase='success'|'bodyError'|'earlyReturn'|'enterError'|'suppress'|'exitError';
export const leaseDefinition = `class Lease:
    def __init__(self, events, *, fail_enter=False, suppress=False, fail_exit=False):
        self.events = events
        self.fail_enter = fail_enter
        self.suppress = suppress
        self.fail_exit = fail_exit
        self.active = False

    def __enter__(self):
        if self.active:
            raise RuntimeError("lease already active")
        self.events.append("enter")
        self.active = True
        try:
            if self.fail_enter:
                raise ValueError("entry failed")
        except ValueError:
            self.active = False
            self.events.append("entry cleanup")
            raise
        return self

    def __exit__(self, kind, value, traceback):
        self.active = False
        self.events.append("exit " + (kind.__name__ if kind else "None"))
        if self.fail_exit:
            raise RuntimeError("cleanup failed")
        return self.suppress and kind is ValueError`;
export function lifetimeProgram(kind:LifetimeCase){
 const flags=`fail_enter=${kind==='enterError'?'True':'False'}, suppress=${kind==='suppress'?'True':'False'}, fail_exit=${kind==='exitError'?'True':'False'}`;
 const statement=['bodyError','suppress','exitError'].includes(kind)?'        raise ValueError("invalid body")':kind==='earlyReturn'?'        return "early"':'        events.append("body complete")';
 return `import json

${leaseDefinition}

events = []
lease = Lease(events, ${flags})
def operation():
    with lease as handle:
        events.append("body")
${statement}
    return "normal"
try:
    result = operation()
    events.append("caller returned " + result)
except (ValueError, RuntimeError) as error:
    events.append("caller " + type(error).__name__)
    if error.__context__ is not None:
        events.append("context " + type(error.__context__).__name__)
print(json.dumps({"active": lease.active, "events": events}))`;
}
export const tracedDefinition = `from functools import wraps

def traced(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        print("enter", function.__name__)
        try:
            return function(*args, **kwargs)
        finally:
            print("exit", function.__name__)
    return wrapper`;
export const decoratorExample = tracedDefinition+`

@traced
def capacity(minutes, *, days=2):
    """Return planned minutes."""
    if type(minutes) is not int or not 0 <= minutes <= 60:
        raise ValueError("minutes must be an exact integer from 0 to 60")
    if type(days) is not int or not 1 <= days <= 7:
        raise ValueError("days must be an exact integer from 1 to 7")
    return minutes * days

print(capacity(20, days=3))
print(capacity.__name__)
print(capacity.__doc__)
try:
    capacity(61)
except ValueError:
    print("Rejected")`;
export const decoratorOutput='enter capacity\nexit capacity\n60\ncapacity\nReturn planned minutes.\nenter capacity\nexit capacity\nRejected';
const returnCode=(correct:boolean)=>`def preserve(function):
    def wrapper(*args, **kwargs):
        ${correct?'return ':''}function(*args, **kwargs)
    return wrapper

@preserve
def double(value):
    return value * 2

print(double(4))`;
export const returnReasoning:ReasoningChallengeData={id:'decorator-return',title:'Did the wrapper preserve the returned value?',question:'Predict the printed result. Explain whether calling the original function automatically forwards its result to the wrapper’s caller.',transfer:'Make double raise ValueError. Does either wrapper catch it? Then add functools.wraps and explain which metadata changes and which runtime behavior stays the same.',variants:[
 {title:'Call without returning',code:returnCode(false),output:'None',steps:['The wrapper calls double, whose result is 8.','That value is discarded because the wrapper has no return expression.','Reaching the end returns None. A decorator can silently break its function’s result contract.']},
 {title:'Forward the result',code:returnCode(true),output:'8',steps:['The wrapper passes the original arguments through.','The original function returns 8.','return forwards that same result to the caller. No exception handler or value conversion is added.']},
]};
export const managedTextDefinition = `from contextlib import contextmanager

@contextmanager
def managed_text(path):
    source = path.open(encoding="utf-8")
    try:
        yield source
    finally:
        source.close()`;
export const resourceExample = managedTextDefinition+`

from contextlib import ExitStack
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory() as folder:
    path = Path(folder) / "minutes.txt"
    with path.open("x", encoding="utf-8") as target:
        target.write("10\\n20\\n")
    try:
        with managed_text(path) as source:
            print("First:", source.readline().strip())
            raise ValueError("report failed")
    except ValueError:
        print("Closed after error:", source.closed)
    opened = []
    try:
        with ExitStack() as stack:
            for current in [path, Path(folder) / "missing.txt"]:
                opened.append(stack.enter_context(current.open(encoding="utf-8")))
    except FileNotFoundError:
        print("Earlier file closed:", opened[0].closed)`;
export const resourceOutput='First: 10\nClosed after error: True\nEarlier file closed: True';
export const stackingExample = `from functools import wraps

events = []
def layer(name):
    events.append("factory " + name)
    def decorate(function):
        events.append("decorate " + name)
        @wraps(function)
        def wrapper(*args, **kwargs):
            events.append("enter " + name)
            try:
                return function(*args, **kwargs)
            finally:
                events.append("exit " + name)
        return wrapper
    return decorate

@layer("outer")
@layer("inner")
def add(left, right):
    events.append("body")
    return left + right

print(add(2, 3))
print(events)`;
export const stackingOutput="5\n['factory outer', 'factory inner', 'decorate inner', 'decorate outer', 'enter outer', 'enter inner', 'body', 'exit inner', 'exit outer']";
export const asyncDefinition = `import asyncio
from contextlib import asynccontextmanager
from functools import wraps

def async_traced(function):
    @wraps(function)
    async def wrapper(*args, **kwargs):
        events = kwargs["events"]
        events.append("wrapper enter")
        try:
            return await function(*args, **kwargs)
        finally:
            events.append("wrapper exit")
    return wrapper

@asynccontextmanager
async def session(events):
    events.append("session open")
    try:
        yield "local token"
    finally:
        await asyncio.sleep(0)
        events.append("session closed")

@async_traced
async def work(*, events, fail=False):
    async with session(events) as token:
        events.append("body")
        await asyncio.sleep(0)
        if fail:
            raise ValueError("synthetic failure")
        return 3`;
export const asyncExample = asyncDefinition+`

async def main():
    events = []
    print(await work(events=events))
    print(events)
    events = []
    try:
        await work(events=events, fail=True)
    except ValueError:
        print("Failed; cleanup preserved")
    print(events)

asyncio.run(main())`;
export const asyncOutput="3\n['wrapper enter', 'session open', 'body', 'session closed', 'wrapper exit']\nFailed; cleanup preserved\n['wrapper enter', 'session open', 'body', 'session closed', 'wrapper exit']";
export const transferDefinition = `from contextlib import contextmanager
from functools import wraps

@contextmanager
def recording_scope(events):
    events.append("open")
    try:
        yield events
    finally:
        events.append("close")

def preserve(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper

@preserve
def quantity(value):
    if type(value) is not int:
        raise TypeError("exact integer quantity required")
    if not 1 <= value <= 100:
        raise ValueError("quantity outside 1–100")
    return value`;
const checks:[string,string[],number,string][]=[
 ['What is bound by with manager as resource?', ['The value returned by __enter__','Always the manager object','The result of __exit__'],0,'The manager may return itself or a different resource.'],
 ['When __enter__ raises, is that same manager’s __exit__ automatically called?', ['Always','No','Only for ValueError'],1,'Entry must clean up its own partial acquisition before propagating.'],
 ['What exception information does __exit__ receive after a normal return from the body?', ['A ReturnError','The returned value','Three None values'],2,'Returning is normal control flow; cleanup still occurs.'],
 ['What does a truthy __exit__ return do for a body exception?', ['Roll back every write','Suppress that exception','Skip cleanup'],1,'Suppression resumes after with, without resuming the skipped body statements.'],
 ['What does a new exception raised during __exit__ normally become?', ['The propagated error, with the earlier error available as context','A successful result','An automatic retry'],0,'Cleanup failures can mask the original failure and require careful diagnosis.'],
 ['Why must a wrapper return function(*args, **kwargs)?', ['To copy every object','To suppress exceptions','To forward the wrapped function’s result'],2,'Calling alone can discard the return value.'],
 ['Does wraps turn the wrapper into the identical original function object?', ['Yes','No','Only if __name__ matches'],1,'Metadata and __wrapped__ aid introspection without removing the wrapper.'],
 ['What is the application order for @outer above @inner?', ['outer first, then inner','Both at call time only','outer(inner(original))'],2,'Decorator expressions and application order must be distinguished.'],
 ['How many times should a generator-based context manager yield?', ['Exactly once on successful entry','Once per input record','Never'],0,'Code before/after the yield brackets one managed body.'],
 ['Why use an async wrapper around an async function when tracing execution lifetime?', ['To avoid awaiting it','To await the body before the wrapper exits','To stop every cancellation'],1,'A plain sync wrapper may only bracket coroutine construction.'],
];
export const lifetimeQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));

import type {ReasoningChallengeData} from './pythonReasoningChallenges';

export const iteratorExample = `values = [2, 3]
first = iter(values)
second = iter(values)
print(next(first))
print(list(first))
print(list(first))
print(list(second))
print(list(values))`;
export const iteratorOutput = '2\n[3]\n[]\n[2, 3]\n[2, 3]';

export const counterDefinition = `class CountTo:
    def __init__(self, stop):
        if type(stop) is not int:
            raise TypeError("stop must be an exact integer")
        if stop < 0:
            raise ValueError("stop must be nonnegative")
        self.current = 0
        self.stop = stop

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.stop:
            raise StopIteration
        result = self.current
        self.current += 1
        return result`;
export const counterExample = counterDefinition + `

counter = CountTo(3)
print(next(counter))
print(list(counter))
print(list(counter))
print(list(CountTo(0)))`;
export const counterOutput = '0\n[1, 2]\n[]\n[]';

export const squareDefinition = `def squares(values):
    for value in values:
        if value < 0:
            raise ValueError("negative value")
        yield value * value`;
export type IterationCase = 'normal' | 'invalid' | 'empty';
export const iterationInputs: Record<IterationCase, number[]> = {normal:[2,3],invalid:[2,-1],empty:[]};
export function generatorProgram(kind: IterationCase) {
    return squareDefinition + `
source = [${iterationInputs[kind].join(', ')}]
stream = squares(source)
print("Created")
for attempt in range(4):
    try:
        print("Value:", next(stream))
    except StopIteration:
        print("End")
    except ValueError as error:
        print("Error:", error)`;
}

export const pipelineDefinition = `def valid_minutes(lines):
    for number, raw in enumerate(lines, start=1):
        text = raw.strip()
        if not text:
            continue
        try:
            value = int(text)
        except ValueError as error:
            raise ValueError(f"line {number}: expected integer") from error
        if not 0 <= value <= 60:
            raise ValueError(f"line {number}: minutes outside 0–60")
        yield value`;
export const pipelineExample = pipelineDefinition + `

lines = iter(["10\\n", "\\n", "20\\n", "bad\\n"])
stream = valid_minutes(lines)
print("First:", next(stream))
try:
    total = sum(stream)
except ValueError as error:
    print("Report failed:", error)
else:
    print("Remaining total:", total)
print("After failure:", list(stream))`;
export const pipelineOutput = 'First: 10\nReport failed: line 4: expected integer\nAfter failure: []';

export const scopeExample = `topic = "module"

def describe():
    topic = "local"
    if True:
        detail = "same function"
    print(topic, detail)

describe()
print(topic)

def broken():
    print(topic)
    topic = "replacement"

try:
    broken()
except UnboundLocalError:
    print("Local name used before assignment")`;
export const scopeOutput = 'local same function\nmodule\nLocal name used before assignment';
export const closureExample = `def make_counter():
    count = 0
    def advance():
        nonlocal count
        count += 1
        return count
    return advance

first = make_counter()
second = make_counter()
print(first(), first(), second())`;
export const closureOutput = '1 2 1';

const closureProgram = (snapshot:boolean) => `def make_readers():
    readers = []
    for value in [10, 20, 30]:
        def read(${snapshot?'saved=value':''}):
            return ${snapshot?'saved':'value'}
        readers.append(read)
    return readers

print([read() for read in make_readers()])`;
export const scopeReasoning: ReasoningChallengeData = {
    id:'iteration-closure', title:'Did each function keep a separate value?',
    question:'Predict the printed list and explain when each function obtains the value it returns. The functions are called only after the loop has finished.',
    transfer:'Change the numbers and call one reader twice. Why is a default argument useful for immutable numbers here, yet not a deep copy of a mutable object?',
    variants:[
        {title:'Shared enclosing binding',code:closureProgram(false),output:'[30, 30, 30]',steps:['The loop rebinds the same enclosing value name. It does not create a new function scope per iteration.','Each returned reader resolves that shared binding when it is called. The loop has finished with value equal to 30.','A closure keeps access to a binding; it does not automatically freeze the value at function definition.']},
        {title:'Bind a default at definition',code:closureProgram(true),output:'[10, 20, 30]',steps:['Each def evaluates its default argument while that loop iteration runs.','Calling read() uses its saved default rather than the shared value binding.','The integer defaults differ. A default still refers to its object: this technique does not deep-copy nested mutable data.']},
    ],
};

export const lifetimeExample = `from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory() as folder:
    path = Path(folder) / "minutes.txt"
    with path.open("x", encoding="utf-8") as target:
        target.write("10\\n20\\n")
    with path.open(encoding="utf-8") as source:
        late = (int(line) for line in source)
    try:
        print(sum(late))
    except ValueError:
        print("Cannot read the closed file")
    with path.open(encoding="utf-8") as source:
        total = sum(int(line) for line in source)
    print("Total:", total)`;
export const lifetimeOutput = 'Cannot read the closed file\nTotal: 30';

export const quantityGenerator = `def quantities(values):
    for number, value in enumerate(values, start=1):
        if type(value) is not int:
            raise TypeError(f"item {number}: exact integer required")
        if not 1 <= value <= 100:
            raise ValueError(f"item {number}: quantity outside 1–100")
        yield value`;
const checks: [string,string[],number,string][] = [
 ['What does an iterator retain?', ['Its progress through a sequence of results','A fresh copy of all inputs','An automatic rewind'],0,'next advances the same iterator state.'],
 ['What happens when list consumes an already exhausted iterator?', ['It repeats prior results','It returns an empty list','It restarts the source'],1,'Exhaustion persists; create a new iterator from a reusable source.'],
 ['Which methods form the iterator protocol?', ['read and write','start and stop','__iter__ and __next__'],2,'iter obtains an iterator and next requests one result.'],
 ['When does the body of the shown generator function first run?', ['At def','When next first resumes it','Always when the object is created'],1,'Calling this generator function creates a generator; next starts its body.'],
 ['What does yield do here?', ['Produces a value and suspends the function','Discards all local state','Restarts the source'],0,'Execution can later resume with its local bindings retained.'],
 ['What follows an uncaught ValueError escaping this generator?', ['It skips just that item automatically','The caller can rewind it','The generator closes'],2,'The error propagates and later next calls indicate exhaustion.'],
 ['Does constructing valid_minutes(lines) validate the whole source?', ['Yes','No','Only if it contains a blank'],1,'Its body validates each encountered record during consumption.'],
 ['Why can broken() raise UnboundLocalError before its assignment?', ['The module variable vanished','if creates a private scope','Assignment makes topic local throughout that function'],2,'Reading the not-yet-bound local does not fall back to the module name.'],
 ['What does nonlocal count select?', ['An existing enclosing function binding','Any module in the program','A deep copy of count'],0,'It permits rebinding that enclosing name.'],
 ['Why consume a file-backed generator inside with?', ['To guarantee faster execution','To keep the required file open while reading','To permit automatic retries'],1,'Deferred work still needs a live resource.'],
];
export const iterationQuestions = checks.map(([question,options,answer,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({id:`iteration-${i+1}-${index}`,text,isCorrect:index===answer,explanation}))}));

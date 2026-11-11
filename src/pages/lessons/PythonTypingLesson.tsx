import {useCallback,useState,type ReactNode} from 'react';
import {Link} from 'react-router-dom';
import type {Stage} from '../../types/curriculum';
import {LessonHeader} from '../../components/learning/LessonHeader';
import {LessonNotesDrawer} from '../../components/learning/LessonNotesDrawer';
import {CodeBlock} from '../../components/learning/CodeBlock';
import {ReasoningChallenge} from '../../components/learning/ReasoningChallenge';
import {AssessmentGate} from '../../components/learning/AssessmentGate';
import {PerformanceFractionLab} from '../../components/visual/python/PerformanceFractionLab';
import {typingRequirements,typedGood,typedBad,checkedExample,checkedOutput,pydanticExample,pydanticOutput,benchmarkExample,profileWorkload,profileCaller,hintReasoning,typingQuestions} from '../../data/pythonTypingContent';
const sections=[['purpose','Three questions'],['hints','Read type hints'],['checker','Run mypy'],['boundary','Runtime checks'],['models','Validation models'],['time','Measure fairly'],['profile','Locate work'],['speedup','Whole-program effect'],['exercises','Transfer practice'],['assessment','Knowledge check']];
function Section({id,title,children}:{id:string;title:string;children:ReactNode}){return <section id={id} className="space-y-4 scroll-mt-24"><h2 className="text-2xl font-bold text-slate-100">{title}</h2>{children}</section>;}
function Output({children}:{children:ReactNode}){return <pre className="p-4 rounded-xl border border-surface-border bg-surface overflow-x-auto text-cyber-emerald text-sm">{children}</pre>;}
export function PythonTypingLesson({currentPath}:{stage:Stage;currentPath:string}){
 const [notesOpen,setNotesOpen]=useState(false);const closeNotes=useCallback(()=>setNotesOpen(false),[]);
 return <article className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10 text-slate-300 leading-relaxed min-w-0">
 <LessonHeader stageNumber={1} lessonIndex={11} totalLessons={0} estimatedReadTime="75–95 minutes" title="Type Hints, Runtime Validation & Profiling" currentPath={currentPath} onOpenNotes={()=>setNotesOpen(true)}/>
 <LessonNotesDrawer isOpen={notesOpen} onClose={closeNotes} lessonPath={currentPath} lessonTitle="Type Hints, Runtime Validation & Profiling"/>
 <p className="text-lg">Use different evidence for different claims: static consistency, accepted runtime values, correct behavior and measured performance.</p>
 <nav aria-label="Lesson sections" className="flex flex-wrap gap-2">{sections.map(([id,title])=><a key={id} href={`#${id}`} className="min-h-11 p-3 rounded-lg border border-surface-border text-cyber-sky text-sm">{title}</a>)}</nav>
 <Section id="purpose" title="1. Types, validation and measurement answer different questions">
 <p>Prerequisite: <Link className="text-cyber-sky underline" to="/stage/1/lesson/python-testing">Testing, Debugging &amp; Diagnostic Logging</Link>. You should be able to explain a failed assertion, preserve an invalid input’s error, and compare expected with observed behavior.</p>
 <ul className="list-disc pl-6 space-y-2"><li>Read annotations and explain what a static checker can and cannot establish.</li><li>Validate external values explicitly and distinguish strict rejection from coercion.</li><li>Measure equivalent workloads with stated setup, repetition and units.</li><li>Use a profile to locate work and estimate the whole-program effect of a local improvement.</li></ul>
 <p>A type checker analyzes code for consistency with declared types. Runtime validation inspects actual values entering a boundary. Tests compare observed behavior with expectations. A benchmark measures a chosen workload; a profile attributes activity to functions. Passing one of these checks does not automatically satisfy the others.</p>
 <p>A hint such as int is broader than “an exact integer from 0 to 60.” It does not express that range, and Python’s bool is an int subclass. Keep domain rules explicit instead of assuming annotations add all the checks your application needs.</p>
 </Section>
 <Section id="hints" title="2. Read an annotation without mistaking it for a guard">
 <CodeBlock title="typed_good.py — Python 3.10+ syntax, verified on 3.12" code={typedGood}/><Output>{'8\nNo result'}</Output>
 <p>value: int describes the intended argument type; the arrow describes the returned type. list[int] describes a list intended to contain integers, not a length or an automatic conversion. int | None allows either an integer or the no-result value. Checking is None narrows the remaining branch so arithmetic uses an integer.</p>
 <ReasoningChallenge challenge={hintReasoning}/>
 <p>object can receive any Python object, but a checker normally requires narrowing before type-specific operations. Any relaxes static checking and can let inconsistent uses pass through. Annotating an external boundary with object makes its need for inspection visible; it does not make that value valid by itself.</p>
 </Section>
 <Section id="checker" title="3. Run a real checker on a good call and a bad call">
 <p>Mypy is a development tool, not part of ordinary Python execution. Pydantic is a runtime validation library used later in this lesson. Use a fresh project environment for these third-party tools; the versions below were verified for this lesson with Python 3.12. Pins alone do not guarantee identical results on every interpreter/platform.</p>
 <CodeBlock title="typing-requirements.txt" language="text" code={typingRequirements}/>
 <CodeBlock title="Linux/macOS setup in a fresh exercise folder" language="bash" code={'python3 -m venv .venv\n.venv/bin/python -m pip install -r typing-requirements.txt\n.venv/bin/python -m mypy --strict typed_good.py'}/>
 <p>On Windows, create the environment with py -m venv .venv and use .\.venv\Scripts\python.exe for its Python commands. Installing tools requires their distributions to be available through your configured package source. The standard-library runtime examples work without mypy; the Pydantic example requires the declared package.</p>
 <CodeBlock title="typed_bad.py — intentionally inconsistent call" code={typedBad}/>
 <CodeBlock title="Compare static analysis with actual execution" language="bash" code={'.venv/bin/python -m mypy --strict typed_bad.py\n.venv/bin/python typed_bad.py'}/>
 <p>Expected: mypy reports an incompatible str argument where int is expected and exits unsuccessfully. Python still runs this script and prints 44. The checker identifies a consistency problem without executing this program; the interpreter follows actual runtime operations. Do not change the expected numeric contract merely because the bad program ran.</p>
 <p>A clean static check depends on annotations, tool configuration and checked code coverage. Unchecked functions, Any values, ignored diagnostics and external data can weaken its evidence. An int annotation also does not distinguish a boolean or encode the 0–60 domain range.</p>
 </Section>
 <Section id="boundary" title="4. Inspect actual values at the runtime boundary">
 <CodeBlock title="checked_minutes.py" code={checkedExample}/><Output>{checkedOutput}</Output>
 <p>The parameter accepts object because this boundary must inspect what arrived. type(value) is int enforces an exact integer, excluding bool. Only after that succeeds is the numeric range checked. The successful return is a validated integer; TypeError and ValueError describe distinct failures.</p>
 <p>Do not silently coerce external text unless the contract calls for conversion. The earlier input parser deliberately converted integer text; this object boundary deliberately rejects it. Both are reasonable when their accepted representations are explicit and tested.</p>
 </Section>
 <Section id="models" title="5. A library validates only through the paths you configure">
 <CodeBlock title="minute_model.py — Pydantic v2" code={pydanticExample}/><Output>{pydanticOutput}</Output>
 <p>BaseModel supplies model validation. Field adds the numeric bounds. ConfigDict enables strict inputs, rejects extra keys and validates field assignment. Strictness is an explicit Pydantic configuration; annotations on an ordinary function do not acquire that behavior automatically. By default, many Pydantic fields can coerce input instead.</p>
 <p>The example validates Python dictionaries. Strict JSON behavior can differ for some types; test the exact input path you use. validate_assignment protects the shown direct field assignment, not every possible bypass or mutation deep inside a nested mutable value. A model is not automatically immutable, and validation does not prove a later workflow is transactional.</p>
 </Section>
 <Section id="time" title="6. Establish equivalence, then measure a defined region">
 <CodeBlock title="lookup_benchmark.py" code={benchmarkExample}/>
 <p>Run this script with your selected Python. It prints the actual interpreter version, three measured duration samples for each implementation and a derived microseconds-per-lookup estimate. Values depend on the machine and run; there is no fixed timing result to copy from this page.</p>
 <p>The workload searches for the last element in a 1000-item list or the same member in a prebuilt set. Data construction is outside the timed region. That tests repeated lookup, not one lookup including set construction, not every hit/miss distribution and not memory usage. A set also has a construction and storage cost; changing the question can change the result.</p>
 <p>Each sample is a total for 1000 timed invocations. Divide by 1000 to estimate seconds per invocation, then multiply by 1,000,000 for microseconds. The minimum repeat is a useful lower-bound-style observation for this setup, not a guarantee of user latency. Keep the samples, compare related input sizes, and consider setup, caches, background load and interpreter differences.</p>
 <p>timeit normally disables garbage collection during timing. That can help isolate a small operation but omit costs important to a real workload. A faster wrong answer is not equivalent: correctness checks come first, and end-to-end measurements must include the work that matters to the user.</p>
 </Section>
 <Section id="profile" title="7. Use call attribution to ask where the work goes">
 <p>Save the workload as one module and the profiler caller beside it. We use the cProfile/pstats APIs verified with Python 3.12; profiler reports and available alternatives can differ in newer interpreters.</p>
 <CodeBlock title="profile_workload.py" code={profileWorkload}/><CodeBlock title="profile_case.py" code={profileCaller}/>
 <p>The final result should be a mapping with cpu: 50, ram: 25 and disk: 25. The workload calls count_topics 200 times and normalize 20,000 times. The profile prints actual measurements; no timing table is fabricated here. ncalls describes calls, tottime excludes subcall time, and cumtime includes it. High call counts suggest a question to investigate, not proof that a function dominates elapsed time.</p>
 <p>The profiler instruments execution and adds overhead. Use it to locate repeated or expensive work, then compare candidate changes with a controlled benchmark and the relevant tests. Do not treat instrumented timings as a neutral Python-versus-native-code speed comparison. Keep the output contract the same when moving normalization or caching results.</p>
 </Section>
 <Section id="speedup" title="8. Derive the whole-program effect before expecting a headline speedup">
 <p>Let the original total time be T, let fraction f be eligible for improvement, and let that part run s times as fast. Unchanged work takes (1 − f)T; the improved part takes fT/s. Add them: new time is T[(1 − f) + f/s]. Dividing the old time by the new gives whole-program speedup 1 / [(1 − f) + f/s].</p>
 <p>For a hypothetical 100ms workload with 80ms improved by a factor of 2, the unchanged 20ms stays. The improved part becomes 40ms, so the new total is 60ms and overall speedup is about 1.67×. This derivation is a model with stated assumptions, not a measured Python result.</p>
 <PerformanceFractionLab/>
 <p>Try 0% eligible work, then 100%, then a local factor of 1. Explain the results before using the controls. Improving a small fraction cannot transform the whole workload by the same factor. With a fixed nonzero unchanged part, even an arbitrarily fast improved part leaves that unchanged cost.</p>
 </Section>
 <Section id="exercises" title="9. Connect evidence and transfer the contract">
 {[
 ['Explain a tool boundary','Run the intentionally bad annotated file with Python and with mypy. Explain why one can succeed while the other reports a type error. Then pass True to the int-annotated function and decide whether your exact-integer domain permits it.','Annotations are used by the static tool; execution follows runtime values. int typing generally admits bool as a subtype, while an exact-integer runtime contract can reject it. Neither hint encodes the required numeric range.'],
 ['Challenge the benchmark','Move set construction into the measured function in a disposable copy. Keep outputs equivalent and compare one lookup versus many lookups. Record inputs, setup, repeats, interpreter and observed samples instead of claiming a universal winner.','You changed the workload by including construction. A repeated-lookup benefit may need to amortize that cost. Do not make an automated test fail merely because the expected timing winner changes on another machine.'],
 ['Transfer: typed quantities and a profile','Implement checked_quantity(value: object) -> int for exact integer quantities 1–100. Reject True, "3", zero and 101; accept 1 and 100. Add a strict Pydantic QuantityInput model with the same range and extra-key policy. Run mypy on annotated internal callers, execute runtime rejection tests and profile a repeated quantity-processing workload while preserving its result.','Use hints for internal consistency and actual checks at the boundary. Test the model’s chosen validation path and configuration. Report observed profile evidence separately from benchmark timings; keep the nonzero quantity rule distinct from minutes.'],
 ].map(([title,task,hint])=><div key={title} className="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3"><h3 className="font-semibold text-slate-100">{title}</h3><p>{task}</p><details><summary className="cursor-pointer py-2 text-cyber-sky">Reveal guidance after trying</summary><p>{hint}</p></details></div>)}
 <p>Readiness evidence: show a static diagnostic, a rejected runtime value, a tested valid result and a measured performance observation, and explain why each establishes a different claim. A quiz cannot substitute for those artifacts.</p>
 </Section>
 <AssessmentGate currentPath={currentPath} lessonTitle="Type Hints, Runtime Validation & Profiling" sectionNumber={10} questions={typingQuestions}/>
 <footer className="border-t border-surface-border pt-6 space-y-3 text-sm"><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-iteration-scope">Continue to Lesson 12: Iterators, Generators &amp; Scope →</Link><p>Primary references: <a className="text-cyber-sky underline" href="https://docs.python.org/3/library/typing.html">typing</a>, <a className="text-cyber-sky underline" href="https://mypy.readthedocs.io/en/stable/getting_started.html">mypy</a>, <a className="text-cyber-sky underline" href="https://docs.pydantic.dev/latest/concepts/strict_mode/">Pydantic strict mode</a>, <a className="text-cyber-sky underline" href="https://docs.python.org/3/library/timeit.html">timeit</a> and <a className="text-cyber-sky underline" href="https://docs.python.org/3.12/library/profile.html">Python 3.12 profiling</a>.</p><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-testing">← Review Testing &amp; Debugging</Link></footer>
 </article>;
}

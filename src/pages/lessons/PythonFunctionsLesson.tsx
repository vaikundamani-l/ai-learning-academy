import { useCallback, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Stage } from '../../types/curriculum';
import { LessonHeader } from '../../components/learning/LessonHeader';
import { LessonNotesDrawer } from '../../components/learning/LessonNotesDrawer';
import { CodeBlock } from '../../components/learning/CodeBlock';
import { ProgramTrace } from '../../components/learning/ProgramTrace';
import { ReasoningChallenge } from '../../components/learning/ReasoningChallenge';
import { AssessmentGate } from '../../components/learning/AssessmentGate';
import { functionExamples, functionQuestions, returnReasoning } from '../../data/pythonFunctionsContent';
import { functionCallModel } from '../../utils/pythonFunctionTrace';
const sections=[['purpose','Why functions?'],['call','Define & call'],['trace','Call explorer'],['return','Print & return'],['names','Local names'],['contract','Contracts & tests'],['exercises','Independent practice'],['assessment','Knowledge check']];
function Section({id,title,children}:{id:string;title:string;children:ReactNode}) {return <section id={id} className="space-y-4 scroll-mt-24"><h2 className="text-2xl font-bold text-slate-100">{title}</h2>{children}</section>;}
function Example({index}:{index:number}) {const e=functionExamples[index];return <div className="space-y-4 min-w-0"><CodeBlock title={e.title} code={e.code}/><p>{e.explanation}</p><p className="font-semibold text-slate-100">Verified output</p><pre className="p-4 overflow-x-auto rounded-xl bg-surface border border-surface-border text-cyber-emerald">{e.output}</pre></div>;}
export function PythonFunctionsLesson({currentPath}:{stage:Stage;currentPath:string}) {
 const [notesOpen,setNotesOpen]=useState(false);const closeNotes=useCallback(()=>setNotesOpen(false),[]);
 const [minutes,setMinutes]=useState(20);const [days,setDays]=useState(7);
 const model=functionCallModel(minutes,days);
 return <article className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10 text-slate-300 leading-relaxed min-w-0">
 <LessonHeader stageNumber={1} lessonIndex={3} totalLessons={0} estimatedReadTime="45–60 minutes" title="Functions, Parameters & Return Values" currentPath={currentPath} onOpenNotes={()=>setNotesOpen(true)}/>
 <LessonNotesDrawer isOpen={notesOpen} onClose={closeNotes} lessonPath={currentPath} lessonTitle="Functions, Parameters & Return Values"/>
 <p className="text-lg">Give a calculation a clear name, pass in the values it needs, and use its result wherever you need it.</p>
 <nav aria-label="Lesson sections" className="flex flex-wrap gap-2">{sections.map(([id,title])=><a key={id} href={`#${id}`} className="p-3 border border-surface-border rounded-lg text-cyber-sky text-sm">{title}</a>)}</nav>
 <Section id="purpose" title="1. A named operation with a clear responsibility">
 <p>Prerequisite: <Link className="text-cyber-sky underline" to="/stage/1/lesson/python-control-flow">Decisions &amp; Loops</Link>. You should be able to trace assignment, multiplication, conditions and indentation.</p>
 <ul className="list-disc pl-6 space-y-2"><li>Explain the difference between defining a function and calling it.</li><li>Trace arguments into local parameters and a result back to the caller.</li><li>Distinguish printing, returning, rebinding and missing results.</li><li>Build a small calculation with an explicit contract and boundary checks.</li></ul>
 <p>Suppose two parts of a planner both calculate a weekly total. Copying the formula works until a rule changes and only one copy is updated. A function groups the rule under one name. Every caller can request the same operation with different inputs. This is procedural abstraction: using a named operation through its agreed inputs and outputs while keeping its implementation in one place.</p>
 <p>A recipe is a useful analogy: its description can exist without cooking a meal. Calling a function is the execution step. The analogy has limits: Python follows explicit statements and binding rules rather than filling in human assumptions.</p>
 </Section>
 <Section id="call" title="2. From a definition to a result">
 <p>A parameter is a name in a function definition. An argument is a value or expression supplied in a call. The caller is the code requesting the operation. return ends the current call and supplies a value to that caller. A colon and indentation define the function body, just as indentation grouped earlier conditional bodies.</p>
 <Example index={0}/>
 <p>Read first = weekly_minutes(20, 7) as a sequence: evaluate the call, wait for it to return, then assign its result to first. The body executes in order with these local parameter values. Merely writing the function name without parentheses does not call it. A call must run after its definition has executed.</p>
 </Section>
 <Section id="trace" title="3. Follow the call boundary">
 <p>Before stepping, predict which action first makes output visible. Observe why the caller’s assignment is unfinished while the body runs. Change an input, then explain why the returned value changes. Try zero days: zero is a valid result, not a missing return.</p>
 <div className="p-4 sm:p-6 rounded-2xl bg-surface-card border border-cyber-sky/30 space-y-5">
 <label className="block">Minutes per day: {minutes}<input aria-label="Minutes per day" type="range" min="0" max="60" value={minutes} onChange={e=>setMinutes(Number(e.target.value))} className="block w-full mt-3 accent-cyber-sky"/></label>
 <label className="block">Days: {days}<input aria-label="Days" type="range" min="0" max="7" value={days} onChange={e=>setDays(Number(e.target.value))} className="block w-full mt-3 accent-cyber-sky"/></label>
 <div className="flex flex-wrap gap-3 text-sm font-semibold text-cyber-sky"><span>Caller arguments →</span><span>Local parameters →</span><span>Calculation →</span><span>Return → caller</span></div>
 <ProgramTrace key={`${minutes}-${days}`} title="function_call.py" code={model.code} frames={model.frames}/>
 <p className="text-sm">This trace models the displayed integer calculation, not CPython memory allocation or arbitrary Python execution. “No active call” describes execution state; it does not promise immediate memory reclamation.</p>
 </div>
 </Section>
 <Section id="return" title="4. Printing is an effect; returning supplies a value">
 <p>print sends text to output. return makes a value available to the caller. A function may do both, but they solve different problems. If execution reaches the end without an executed return, Python returns None. A bare return also returns None. None is a value representing absence in our examples, not the number zero or the string "None".</p>
 <ReasoningChallenge challenge={returnReasoning}/>
 <p>Execution does not continue to the next line in the same function after return. An early return can therefore handle an exceptional case before the ordinary calculation. Every path needs to match the result contract: forgetting a return in one branch can accidentally mix numbers and None.</p>
 </Section>
 <Section id="names" title="5. Local names and explicit arguments">
 <p>Scope describes where a name can be looked up. Parameters and assignments in these function bodies create local bindings for that invocation. A local name may have the same spelling as a caller’s name without being the same binding.</p>
 <Example index={1}/>
 <p>Python binds parameters to passed objects; it does not promise to copy every object. Rebinding an integer parameter is the mechanism demonstrated here. Mutating a shared list will need a different explanation in the collections lesson. Avoid global variables for these calculations: explicit inputs make the dependency visible to callers and tests.</p>
 <Example index={2}/>
 <p>Supplying a required argument too few times, an unexpected keyword, or the same parameter twice raises TypeError in these examples. Use parameter names as part of the interface. Keep keyword spelling consistent. Advanced parameter forms, closures and decorators are later topics.</p>
 </Section>
 <Section id="contract" title="6. Write a contract, then check it">
 <p>A contract states the accepted inputs and the meaning of each possible result. Our planner accepts integer minutes from 0 to 1440 and integer days from 0 to 7. For those inputs it returns minutes × days, measured in minutes/week. For out-of-range integers it returns None. It assumes integer inputs; it does not validate strings, floats or every other Python type.</p>
 <Example index={3}/>
 <p>The guard’s return None exits before the multiplication. For valid inputs, zero is meaningful: no study days gives zero weekly minutes. At the maximum, 1440 × 7 = 10080 minutes. The unit check is minutes/day × days/week = minutes/week. These checks make both range boundaries and result meaning visible.</p>
 <p>A function that calculates without reading input or printing can be reused from a terminal, a website or a test. Keep interaction at the edges: read and convert user input, call the function, then decide how to display its result. This separation does not automatically make the program faster; it makes its responsibilities easier to inspect and test.</p>
 <p>During development, deliberately change the final multiplication to addition and rerun the checks. The ordinary case should fail. Restore the formula and confirm that the checks pass again. A test that never catches a relevant mistake supplies weak evidence.</p>
 </Section>
 <Section id="exercises" title="7. Explain, repair, then transfer">
 {[
 ['Explain the call','Without running it, trace weekly_minutes(15, 4). State when each parameter is bound, when total becomes available, when the caller receives 60, and why the body does not print.','The argument values become call-local parameter bindings. Multiplication creates total = 60; return supplies it; caller assignment happens afterward. Only an explicit print produces output.'],
 ['Repair a missing path','Write a function that returns 0 when days is 0 and minutes * days otherwise. Call it on both paths. Then remove the nonzero return, observe None for positive days and explain the repair.','A function reaching the end returns None. Ensure both valid paths return the numeric result required by the contract; test days = 0 and days = 3 separately.'],
 ['Transfer: rectangle perimeter','From a blank file, implement perimeter(width, height) for nonnegative integer dimensions in meters. Return None for a negative dimension. Return 2 * (width + height) otherwise. Keep printing outside the function and write checks for (3,4), (0,5), (0,0), and (-1,4). Explain what a zero-width result means in your mathematical model.','Expected results: 14, 10, 0, None. A rectangle has two widths and two heights, so w + h + w + h = 2(w+h). Zero dimensions are allowed by this mathematical contract; a physical construction application might reject them. Integer types are assumed.'],
 ].map(([title,task,hint])=><div key={title} className="p-5 bg-surface-card border border-surface-border rounded-xl space-y-3"><h3 className="font-semibold text-slate-100">{title}</h3><p>{task}</p><details><summary className="py-2 cursor-pointer text-cyber-sky">Reveal guidance after trying</summary><p>{hint}</p></details></div>)}
 <p>Readiness evidence: implement the transfer function independently, explain each path, distinguish a valid zero from None, and show that a deliberately wrong formula fails a check. The quiz alone cannot establish that practical ability.</p>
 </Section>
 <AssessmentGate currentPath={currentPath} lessonTitle="Functions, Parameters & Return Values" sectionNumber={8} questions={functionQuestions}/>
 <footer className="border-t border-surface-border pt-6 space-y-3 text-sm"><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-collections">Continue to Lesson 4: Collections &amp; Shared State →</Link><p>Primary reference: <a className="text-cyber-sky underline" href="https://docs.python.org/3/tutorial/controlflow.html#defining-functions">Python tutorial: defining functions and arguments</a>.</p><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-control-flow">← Review Decisions &amp; Loops</Link></footer>
 </article>;
}

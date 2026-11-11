import { useCallback, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Stage } from '../../types/curriculum';
import { LessonHeader } from '../../components/learning/LessonHeader';
import { LessonNotesDrawer } from '../../components/learning/LessonNotesDrawer';
import { CodeBlock } from '../../components/learning/CodeBlock';
import { ProgramTrace } from '../../components/learning/ProgramTrace';
import { ReasoningChallenge } from '../../components/learning/ReasoningChallenge';
import { AssessmentGate } from '../../components/learning/AssessmentGate';
import { exceptionExamples, exceptionQuestions, exceptionReasoning, tracebackDemo } from '../../data/pythonExceptionsContent';
import { exceptionFlowModel, validationCases } from '../../utils/pythonExceptionTrace';
const sections=[['purpose','Start here'],['diagnose','Diagnose'],['handle','Handle narrowly'],['validate','Validate & raise'],['trace','Failure explorer'],['propagate','Propagation'],['cleanup','else & finally'],['retry','Bounded retries'],['exercises','Transfer practice'],['assessment','Knowledge check']];
function Section({id,title,children}:{id:string;title:string;children:ReactNode}){return <section id={id} className="space-y-4 scroll-mt-24"><h2 className="text-2xl font-bold text-slate-100">{title}</h2>{children}</section>;}
function Example({index}:{index:number}){const e=exceptionExamples[index];return <div className="space-y-4 min-w-0"><CodeBlock title={e.title} code={e.code}/><p>{e.explanation}</p><p className="font-semibold text-slate-100">Verified output</p><pre className="p-4 overflow-x-auto rounded-xl border border-surface-border bg-surface text-cyber-emerald text-sm">{e.output}</pre></div>;}
export function PythonExceptionsLesson({currentPath}:{stage:Stage;currentPath:string}){
 const [notesOpen,setNotesOpen]=useState(false);const closeNotes=useCallback(()=>setNotesOpen(false),[]);
 const [caseId,setCaseId]=useState('valid');const [prediction,setPrediction]=useState('');const [checked,setChecked]=useState(false);
 const model=exceptionFlowModel(caseId);
 return <article className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10 text-slate-300 leading-relaxed min-w-0">
 <LessonHeader stageNumber={1} lessonIndex={5} totalLessons={0} estimatedReadTime="55–70 minutes" title="Exceptions, Validation & Useful Errors" currentPath={currentPath} onOpenNotes={()=>setNotesOpen(true)}/>
 <LessonNotesDrawer isOpen={notesOpen} onClose={closeNotes} lessonPath={currentPath} lessonTitle="Exceptions, Validation & Useful Errors"/>
 <p className="text-lg">A trustworthy program preserves the difference between a valid answer and an operation that failed. Learn where execution goes when an operation cannot produce its promised result.</p>
 <nav aria-label="Lesson sections" className="flex flex-wrap gap-2">{sections.map(([id,title])=><a key={id} href={`#${id}`} className="min-h-11 p-3 border border-surface-border rounded-lg text-cyber-sky text-sm">{title}</a>)}</nav>
 <Section id="purpose" title="1. Failure is part of the result contract">
 <p>Prerequisite: <Link className="text-cyber-sky underline" to="/stage/1/lesson/python-collections">Collections, Lookup &amp; Shared State</Link>. You should be able to trace calls, distinguish zero from None, loop over a list, and explain a missing dictionary key.</p>
 <ul className="list-disc pl-6 space-y-2"><li>Locate the failing operation using its exception type and traceback.</li><li>Separate conversion, range validation and unexpected program defects.</li><li>Trace try, except, else, finally and propagation to a caller.</li><li>Build bounded recovery that reports failure without saving a fabricated result.</li></ul>
 <p>A planner that receives "twenty" cannot honestly claim a successful zero-minute session. Zero means a real amount; failed conversion means there is no amount yet. Earlier lessons returned None for some invalid values. Exceptions are another contract: successful calls return a value, while failed calls interrupt normal execution with an error that a suitable boundary can handle.</p>
 <p>An exception is a specific error value with a type and often a message. Raising signals it; handling responds to an expected failure. Recovery means taking a meaningful next action, such as asking for corrected input. Hiding the failure with an unrelated default is a different behavior.</p>
 </Section>
 <Section id="diagnose" title="2. Read the evidence before changing the code">
 <p>A syntax error prevents Python from parsing a piece of code. A missing colon in the script’s own try block cannot be repaired by an except clause in that same unparseable script. An execution-time exception happens after parsing, when an attempted operation fails.</p>
 <div className="overflow-x-auto rounded-xl border border-surface-border"><table className="w-full text-sm text-left"><thead><tr><th className="p-3">Type</th><th className="p-3">Question to investigate</th></tr></thead><tbody>{[
 ['ValueError','Is the kind of input appropriate but its value unsuitable, such as integer text that cannot be parsed?'],
 ['TypeError','Did the caller supply an unsupported kind of object or the wrong call arguments?'],
 ['KeyError / IndexError','Is a requested mapping key or sequence position absent?'],
 ['NameError','Was this name bound before the operation tried to use it?'],
 ['ZeroDivisionError','Is the denominator zero, and what should that mean for this application?'],
 ].map(([name,question])=><tr key={name} className="border-t border-surface-border"><td className="p-3 font-mono">{name}</td><td className="p-3">{question}</td></tr>)}</tbody></table></div>
 <p>An unhandled exception produces a traceback: a record of the active calls involved in the failure. Read its final exception type/message, then the failing source location, then work outward through the callers to find where the input came from. Line numbers and message details can differ across Python versions, so understand the operation rather than memorizing one display.</p>
 <CodeBlock title="traceback_demo.py — deliberately fails" code={tracebackDemo}/>
 <p>Run this as a script. It prints no successful result and ends with ValueError from int. In the traceback, the outer script calls record, record calls parse, and parse attempts conversion. The innermost source location identifies the failing operation; the outer calls explain how the text reached it. Repair the input or handle the expected failure at a suitable boundary rather than changing unrelated lines. The next section supplies that handler.</p>
 <details className="p-4 bg-surface-card border border-surface-border rounded-xl"><summary className="cursor-pointer py-2 text-cyber-sky">Diagnosis check: would catching every NameError fix a misspelled variable?</summary><p>No. A misspelled name is usually a defect to repair. Replacing it with a default can make broken code look successful. Reproduce the failing case, correct the name, and keep a check that detects the regression.</p></details>
 </Section>
 <Section id="handle" title="3. Catch the failure you know how to handle">
 <p>try marks the operation to attempt. except ValueError selects a matching conversion failure. When an exception occurs, the rest of that try body is skipped. A matching handler runs, then execution continues after the whole statement. It does not restart the failed line automatically.</p>
 <Example index={0}/>
 <p>Keep the protected region narrow. If you put conversion, calculation, saving and unrelated helper calls in one large try, a handler may mistake an unrelated ValueError for bad input. Put normal success work in else when it should run only after the protected operation succeeds. Exceptions raised inside else are not caught by the preceding except clauses.</p>
 <ReasoningChallenge challenge={exceptionReasoning}/>
 <p>except Exception catches many ordinary exceptions, not just conversion errors. A bare except is broader still and can catch KeyboardInterrupt and SystemExit. Preserve the ability to interrupt or exit normally; use specific handlers where you can take a meaningful recovery action. Unexpected errors should remain visible for diagnosis.</p>
 </Section>
 <Section id="validate" title="4. Conversion and validation answer different questions">
 <p>Conversion asks “can this text represent an integer?” Domain validation asks “is this integer permitted here?” int("-1") succeeds, but a negative number of study minutes violates our rule. For this API, callers supply text; valid results are integer minutes from 0 through 60, inclusive.</p>
 <Example index={1}/>
 <p>raise ValueError(...) creates and signals a value-related failure with a useful message. The range guard is ordinary program logic; it still runs when developer assertions are disabled. For malformed text, raise ... from error supplies a clearer domain message while preserving the original cause for debugging.</p>
 <p>The accepted text follows Python’s int conversion behavior, including surrounding whitespace and an optional sign; this function is not an ASCII-digits-only parser. It assumes text from the caller and does not promise validation for every possible Python object. Wrong object types can raise TypeError, which we deliberately do not disguise as bad user text.</p>
 <p>Good user feedback names the field, expected form or range, and next action. Developer diagnostics can retain the underlying cause and call path. In a real system, avoid exposing private input or credentials in public messages and logs.</p>
 </Section>
 <Section id="trace" title="5. Follow success, conversion failure and range rejection">
 <p>Choose a case and predict whether it reaches the accepted branch or the handler. Compare where minutes becomes bound. The same handler can receive different causes, but those causes occur at different lines.</p>
 <div className="p-4 sm:p-6 rounded-2xl bg-surface-card border border-cyber-sky/30 space-y-4">
 <label className="block">Input case<select aria-label="Input case" className="block w-full mt-2 p-3 bg-surface border border-surface-border rounded-lg" value={caseId} onChange={e=>{setCaseId(e.target.value);setPrediction('');setChecked(false);}}>{validationCases.map(sample=><option key={sample.id} value={sample.id}>{sample.label}</option>)}</select></label>
 <label className="block">Predict the path<select aria-label="Predict the path" className="block w-full mt-2 p-3 bg-surface border border-surface-border rounded-lg" value={prediction} onChange={e=>{setPrediction(e.target.value);setChecked(false);}}><option value="">Choose before tracing</option><option value="accepted">Accepted branch</option><option value="handler">ValueError handler</option></select></label>
 <button disabled={!prediction} onClick={()=>setChecked(true)} className="min-h-11 px-4 py-3 rounded-lg border border-cyber-sky text-cyber-sky disabled:opacity-50">Check path prediction</button>
 {checked&&<p role="status">{(prediction==='handler')===model.invalid?'Your path prediction matches.':'Compare your prediction with the trace.'} {model.invalid?'The handler runs; the accepted branch is skipped.':'Conversion and range validation succeed; the accepted branch runs.'}</p>}
 <ProgramTrace key={caseId} title="validation_paths.py" code={model.code} frames={model.frames}/>
 <p className="text-sm">This is a guided model of six predefined text cases, not an arbitrary Python interpreter. The combined handler gives one concise repair message; the reusable parser above supplies more specific causes.</p>
 </div>
 </Section>
 <Section id="propagate" title="6. When a function cannot finish, its caller may handle the failure">
 <Example index={2}/>
 <p>Read the call path as outer try → show_average → per_day → division. The failure travels back in the other direction until a matching handler is found. Neither assignment to value nor its print completes. If no matching handler exists, execution ends with an unhandled exception rather than a successful answer.</p>
 <p>Handling is not rollback. If earlier statements appended to a list, those changes are not automatically undone by except. Validate before committing changes, or design explicit recovery when work has already happened. We will build this into file-processing projects later.</p>
 </Section>
 <Section id="cleanup" title="7. Keep success and cleanup separate">
 <Example index={3}/>
 <p>Place success-only work in else. Use finally for actions required as control leaves the statement during normal Python control flow, including an exception path. Cleanup does not prove the operation succeeded, and it is not a guarantee against abrupt process termination.</p>
 <p>Do not return a success value from finally to “fix” an error: a return there can replace a pending return or suppress a pending exception. Likewise, an exception raised during cleanup can replace the currently propagating failure. Keep cleanup focused. Resource-specific examples and the with statement will follow with files.</p>
 </Section>
 <Section id="retry" title="8. Retry only when another attempt can help">
 <Example index={4}/>
 <p>A retry policy needs a reason, an exit on success, and an explicit exhausted path. This loop has at most three attempts, so failure cannot cause an unbounded retry.</p>
 <p>Trace the last case with no valid entries: remove "25" from attempts, and predict the final exhaustion message. With an empty attempt list, the body never runs and the loop’s else still reports that nothing was saved. No default zero enters the record.</p>
 </Section>
 <Section id="exercises" title="9. Diagnose, repair and transfer">
 {[
 ['Diagnose before catching','For int("twenty"), int("-1"), and int(None), identify conversion failure, successful conversion requiring range validation, and wrong object type. Explain which handler our text-boundary code should have.','ValueError, successful -1, and TypeError respectively. Catch expected malformed text with ValueError; reject the range separately; do not hide a wrong-type API call.'],
 ['Repair a false success','Run both print-and-save variants above with "bad" and "0". Explain why returning 0 in except makes their meanings indistinguishable. Repair the code so invalid text cannot reach the success print.','Keep conversion inside try, report a ValueError in except, and save only in else after range checks. A valid zero and a failed parse must stay distinct.'],
 ['Transfer: requested stock quantity','Implement parse_quantity(text) for text representing a whole number 1–100 inclusive. Return the integer when valid; raise ValueError with a useful message otherwise. Keep printing outside the function. Test "1", "100", "0", "101", "", "2.5", and " 3 ". Explain why the planner’s zero rule cannot be copied unchanged.','Valid results: 1, 100 and 3. The other four cases must raise ValueError. Conversion and range rules remain separate. A requested quantity requires at least one item, whereas the earlier planner allowed zero minutes. Also verify that passing None raises TypeError rather than becoming a successful quantity.'],
 ].map(([title,task,hint])=><div key={title} className="p-5 space-y-3 rounded-xl bg-surface-card border border-surface-border"><h3 className="font-semibold text-slate-100">{title}</h3><p>{task}</p><details><summary className="cursor-pointer py-2 text-cyber-sky">Reveal guidance after trying</summary><p>{hint}</p></details></div>)}
 <p>Readiness evidence: implement the quantity parser independently, show both accepted boundaries and rejection cases, preserve the invalid-versus-valid distinction, and explain why a handler belongs at a particular boundary. The quiz alone does not demonstrate that practical ability.</p>
 </Section>
 <AssessmentGate currentPath={currentPath} lessonTitle="Exceptions, Validation & Useful Errors" sectionNumber={10} questions={exceptionQuestions}/>
 <footer className="border-t border-surface-border pt-6 space-y-3 text-sm"><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-modules">Continue to Lesson 6: Modules &amp; Environments →</Link><p>Primary references: <a className="text-cyber-sky underline" href="https://docs.python.org/3/tutorial/errors.html">Python errors and exceptions</a> and <a className="text-cyber-sky underline" href="https://docs.python.org/3/library/exceptions.html">built-in exception types</a>.</p><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-collections">← Review Collections &amp; Shared State</Link></footer>
 </article>;
}

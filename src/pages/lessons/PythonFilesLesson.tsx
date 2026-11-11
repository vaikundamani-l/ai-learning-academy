import {useCallback,useState,type ReactNode} from 'react';
import {Link} from 'react-router-dom';
import type {Stage} from '../../types/curriculum';
import {LessonHeader} from '../../components/learning/LessonHeader';
import {LessonNotesDrawer} from '../../components/learning/LessonNotesDrawer';
import {CodeBlock} from '../../components/learning/CodeBlock';
import {ProgramTrace} from '../../components/learning/ProgramTrace';
import {ReasoningChallenge} from '../../components/learning/ReasoningChallenge';
import {AssessmentGate} from '../../components/learning/AssessmentGate';
import {fileExamples,fileQuestions,fileReasoning,fileReportBoundary,fileFixtureSetup,invalidUtf8Fixture} from '../../data/pythonFilesContent';
import {fileReadModel,fileTraceCases} from '../../utils/pythonFileTrace';
const sections=[['purpose','Start here'],['encoding','Text & bytes'],['read','Read & consume'],['modes','Choose a mode'],['cleanup','Close reliably'],['trace','File lifecycle explorer'],['parser','Parse records'],['failures','Report failure'],['exercises','Transfer practice'],['assessment','Knowledge check']];
function Section({id,title,children}:{id:string;title:string;children:ReactNode}){return <section id={id} className="space-y-4 scroll-mt-24"><h2 className="text-2xl font-bold text-slate-100">{title}</h2>{children}</section>;}
function Example({index}:{index:number}){const e=fileExamples[index];return <div className="space-y-4 min-w-0">{e.fixtures&&<><p>Create these input files in a fresh exercise folder. Run the setup code to preserve exact line endings and blank lines; x refuses existing fixture paths.</p>{Object.entries(e.fixtures).map(([name,text])=><CodeBlock key={name} title={name} language="text" code={text}/>)}<CodeBlock title="Create the exact input fixture" code={fileFixtureSetup(e.fixtures)}/></>}<CodeBlock title={e.title} code={e.code}/><p>Run this script from its exercise folder with your selected Python interpreter.</p><p>{e.explanation}</p><p className="font-semibold text-slate-100">Verified output</p><pre className="p-4 overflow-x-auto rounded-xl border border-surface-border bg-surface text-cyber-emerald text-sm">{e.output}</pre></div>;}
export function PythonFilesLesson({currentPath}:{stage:Stage;currentPath:string}){
 const [notesOpen,setNotesOpen]=useState(false);const closeNotes=useCallback(()=>setNotesOpen(false),[]);
 const [caseId,setCaseId]=useState('valid');const [prediction,setPrediction]=useState('');const [checked,setChecked]=useState(false);
 const model=fileReadModel(caseId);
 return <article className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10 text-slate-300 leading-relaxed min-w-0">
 <LessonHeader stageNumber={1} lessonIndex={7} totalLessons={0} estimatedReadTime="60–75 minutes" title="Files, Encodings & Reliable Record Processing" currentPath={currentPath} onOpenNotes={()=>setNotesOpen(true)}/>
 <LessonNotesDrawer isOpen={notesOpen} onClose={closeNotes} lessonPath={currentPath} lessonTitle="Files, Encodings & Reliable Record Processing"/>
 <p className="text-lg">Read data that outlives your program, preserve its meaning across text and bytes, and publish a result only when processing satisfies its contract.</p>
 <nav aria-label="Lesson sections" className="flex flex-wrap gap-2">{sections.map(([id,title])=><a key={id} href={`#${id}`} className="min-h-11 p-3 border border-surface-border rounded-lg text-cyber-sky text-sm">{title}</a>)}</nav>
 <Section id="purpose" title="1. Persisting data adds new failure boundaries">
 <p>Prerequisite: <Link className="text-cyber-sky underline" to="/stage/1/lesson/python-modules">Modules, Imports &amp; Project Environments</Link>. You should be able to run a script in a chosen folder, trace a function and loop, and handle an expected exception.</p>
 <ul className="list-disc pl-6 space-y-2"><li>Distinguish Unicode text from encoded bytes and select an explicit encoding.</li><li>Explain file modes, consumption and cleanup on success or failure.</li><li>Build a line-based parser with a stated blank-line and invalid-record policy.</li><li>Diagnose missing files, invalid encodings and malformed values without publishing a partial report as complete.</li></ul>
 <p>A hard-coded list disappears when a process ends. A file lets another program or a future run read the data, but now your calculation depends on a path, permissions, bytes, decoding and record rules. A correct arithmetic function cannot fix a wrong input format.</p>
 <p>A file object is a stream: an interface for consuming or producing data with a current position and an open/closed lifecycle. A path names a filesystem location. A relative path such as minutes.txt is resolved against the process’s current working directory, not automatically against the script’s directory.</p>
 </Section>
 <Section id="encoding" title="2. Decode bytes into text before interpreting records">
 <Example index={0}/>
 <p>An encoding specifies the mapping between text and bytes. Text mode returns str and performs decoding; binary mode returns bytes and does not decode. Use encoding="utf-8" when UTF-8 is the agreed format rather than relying on a default that can vary with Python configuration and platform.</p>
 <p>The default strict decoder raises UnicodeDecodeError when the bytes cannot be decoded as the requested encoding. errors="ignore" can discard bytes; errors="replace" can substitute replacement characters. Those are explicit data-loss policies, not repairs that recover the original data. A successfully decoded string can still contain a malformed numeric record.</p>
 </Section>
 <Section id="read" title="3. Reading consumes a stream">
 <Example index={1}/>
 <p>The logical read position advances. Repeating read does not automatically start again. Reopen the file when you need an independent read, or use a supported seek operation deliberately. Text streams can buffer and translate data, so do not assume their positions are simple raw byte indices.</p>
 <p>At end of a text stream, read and readline return "" when no more characters can be read. A blank line is different: its newline is data. In the usual text newline mode, common input line endings are translated to \n. Iterating over the file supplies lines without first reading the entire file into one string.</p>
 </Section>
 <Section id="modes" title="4. Choose the mode before opening the destination">
 <div className="overflow-x-auto rounded-xl border border-surface-border"><table className="w-full text-sm text-left"><thead><tr><th className="p-3">Mode</th><th className="p-3">Meaning</th><th className="p-3">Existing file</th></tr></thead><tbody>{[
 ['r','Read text','Retained; missing input raises FileNotFoundError.'],['x','Create new output','Refused with FileExistsError.'],['w','Write output','Truncated when opening succeeds.'],['a','Append output','Retained; writes go to the end.'],['rb / wb','Read/write bytes','No text decoding/encoding; wb still truncates.'],
 ].map(([mode,meaning,existing])=><tr key={mode} className="border-t border-surface-border"><td className="p-3 font-mono">{mode}</td><td className="p-3">{meaning}</td><td className="p-3">{existing}</td></tr>)}</tbody></table></div>
 <Example index={2}/>
 <p>Opening with w before checking input can destroy a previous report even if parsing fails later. The example uses x so an existing destination is preserved. File write methods return counts for the write operation, not a promise of transactionality or durable storage. Text writes accept str; binary writes accept bytes-like data. Pick the representation explicitly rather than mixing them.</p>
 </Section>
 <Section id="cleanup" title="5. with scopes cleanup, not rollback">
 <p>A context manager coordinates entering and leaving a block. For an ordinary file object, with open(...) as source binds the opened object and arranges closing as control leaves the block during ordinary Python execution. If opening fails, the block is never entered and source may never be bound.</p>
 <Example index={3}/>
 <p>The file closes before the outer handler runs. The previous print of 20 does not disappear. Similarly, closing a writer does not undo earlier bytes written. Close flushes Python’s buffers, but it is not a universal crash-durability guarantee. Transactional replacement and operating-system synchronization need a separate design.</p>
 <p>Closing the file does not remove the variable name. source.closed can be inspected afterward; trying to read through that closed stream raises ValueError. The with statement is useful because success, early return and raised exceptions can all leave a block.</p>
 </Section>
 <Section id="trace" title="6. Predict file state and report validity separately">
 <p>Use these small UTF-8 files to compare normal completion, a conversion failure and an empty file. Predict whether a complete total will be published; then step through reading, conversion and closing. These fixtures intentionally contain no blank lines or out-of-range values; the full parser below has a richer contract.</p>
 <div className="p-4 sm:p-6 rounded-2xl bg-surface-card border border-cyber-sky/30 space-y-4 min-w-0">
 <label className="block">File case<select aria-label="File case" value={caseId} onChange={e=>{setCaseId(e.target.value);setPrediction('');setChecked(false);}} className="block w-full mt-2 p-3 rounded-lg bg-surface border border-surface-border">{fileTraceCases.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
 <p className="text-sm">Input bytes are valid UTF-8. Text shown with visible newline escapes:</p><pre className="p-3 rounded-lg bg-surface overflow-x-auto text-sm">{JSON.stringify(model.fixture)}</pre>
 <label className="block">Predict the report<select aria-label="Predict the report" value={prediction} onChange={e=>{setPrediction(e.target.value);setChecked(false);}} className="block w-full mt-2 p-3 rounded-lg bg-surface border border-surface-border"><option value="">Choose before tracing</option><option value="total">Publish a complete total</option><option value="reject">Reject the report</option></select></label>
 <button disabled={!prediction} onClick={()=>setChecked(true)} className="min-h-11 px-4 py-3 rounded-lg border border-cyber-sky text-cyber-sky disabled:opacity-50">Check file prediction</button>
 {checked&&<p role="status">{(prediction==='reject')===(caseId==='invalid')?'Your path prediction matches.':'Compare the path with your prediction.'} {caseId==='invalid'?'No complete total is published; the file still closes.':'All records were processed; the file closes and the completed total is published.'}</p>}
 <ProgramTrace key={caseId} title="file_lifecycle.py" code={model.code} frames={model.frames}/>
 <p className="text-sm">This is a guided model of three existing files. It does not open files in your browser or simulate arbitrary I/O failures. The with-exit cleanup is summarized at the transition to the outer handler or else block.</p>
 </div>
 </Section>
 <Section id="parser" title="7. A complete parser needs a format and an error policy">
 <p>Contract: read a UTF-8 file with one integer minute value from 0 through 60 per nonblank line. Surrounding whitespace is accepted; blank lines are ignored deliberately. Other malformed or out-of-range records reject the whole report with their physical line number. Empty or all-blank input returns count 0 and total 0, which remains distinguishable from a missing file.</p>
 <Example index={4}/>
 <ol className="list-decimal pl-6 space-y-2"><li>Open for reading with the specified encoding.</li><li>Use enumerate to pair each line with its physical position, beginning at 1.</li><li>Apply the declared blank-line policy, then attempt conversion in a narrow try.</li><li>Raise a contextual error for malformed text; reject integers outside the domain range separately.</li><li>Add each accepted value and increment the accepted-record count.</li><li>After normal iteration and closing, return the two results as a tuple.</li></ol>
 <p>An f-string begins with f and substitutes expressions inside braces: <code>{'f"Line {line_number}"'}</code> includes the current line number in the error message. raise ... from error preserves the conversion cause. Integer spelling follows Python’s int rules; this is not a quoted CSV format or a universal numeric-text validator.</p>
 <p>Invariant: after each accepted record, count is the number of accepted nonblank records so far, and total is their sum. A zero contributes one record and zero minutes. For 20, blank, 0, 30 the states are (1,20), unchanged, (2,20), (3,50). A later error prevents these partial results being returned as a successful summary.</p>
 <ReasoningChallenge challenge={fileReasoning}/>
 </Section>
 <Section id="failures" title="8. Report the layer that failed">
 <p>Keep the summarize_minutes function definition above, remove the example’s three caller lines, and use this caller in their place. The boundary distinguishes a missing input, undecodable bytes, rejected records and other read failures. It prints a successful summary only in else.</p>
 <CodeBlock title="Caller for summarize_minutes" code={fileReportBoundary}/>
 <p>To reproduce a decoding failure, use another fresh exercise folder and run this setup. bytes([255]) makes the single raw byte FF, which is not valid UTF-8 by itself. xb creates a new binary file and refuses an existing path. Then run the parser and caller above: expect No report: input must be UTF-8.</p>
 <CodeBlock title="Create an intentionally invalid UTF-8 fixture" code={invalidUtf8Fixture}/>
 <p>UnicodeDecodeError is a ValueError subclass, so its more specific handler appears first. FileNotFoundError is an OSError subclass and is likewise handled before the generic file-error case. Decoding can fail while reading buffered data, so do not invent a precise record line number for an undecodable byte stream.</p>
 <p>Reading line by line reduces whole-file memory use, but a single enormous line or expensive conversion still needs limits in a production importer. Reports written in several steps can also be partially written after a disk error. Resource limits, temporary output plus replacement, and durable commits require explicit policies; this lesson does not label simple with blocks as atomic.</p>
 </Section>
 <Section id="exercises" title="9. Explain, repair and transfer">
 {[
 ['Explain the read position','Predict what a third read returns after a complete read, and compare an empty file with a one-newline file. Explain why the parser intentionally treats their record counts alike even though their byte contents differ.','At end of file, read returns an empty string. One newline is a blank line; the parser explicitly ignores it. Both inputs therefore return (0,0) under this format, not because they contain identical bytes.'],
 ['Repair hidden record loss','Run the silent-skip reasoning variant with 20, bad, 30. Change it to reject the report with physical line information. Add a blank before bad and verify its reported line changes.','The policy must be explicit. Track physical lines before skipping blanks, and raise rather than silently continuing after malformed records. The bad record moves from line 2 to line 3.'],
 ['Transfer: stock-quantity file','Create summarize_quantities(path) for UTF-8 input with one integer quantity 1–100 per nonblank line. Return (count,total); ignore blank lines, reject other invalid records with line numbers, and keep printing outside the parser. Test "1\\n100\\n", an empty file, "0\\n", "2.5\\n", "1\\n\\nbad\\n", invalid UTF-8 bytes and a missing path.','Valid summaries are (2,101) and (0,0). Zero is invalid in this contract. Malformed/range errors must reject the report, with bad on physical line 3 in the fifth case. Invalid bytes and missing files are separate failures; do not turn them into an empty successful report.'],
 ].map(([title,task,hint])=><div key={title} className="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3"><h3 className="font-semibold text-slate-100">{title}</h3><p>{task}</p><details><summary className="cursor-pointer py-2 text-cyber-sky">Reveal guidance after trying</summary><p>{hint}</p></details></div>)}
 <p>Readiness evidence: independently implement and test the transfer parser, demonstrate closing after a record error, distinguish missing/empty/malformed/undecodable inputs, and explain which outputs may already have occurred before an exception. A quiz alone cannot establish that ability.</p>
 </Section>
 <AssessmentGate currentPath={currentPath} lessonTitle="Files, Encodings & Reliable Record Processing" sectionNumber={10} questions={fileQuestions}/>
 <footer className="border-t border-surface-border pt-6 space-y-3 text-sm"><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-structured-data">Continue to Lesson 8: CSV, JSON &amp; Validation →</Link><p>Primary references: <a className="text-cyber-sky underline" href="https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files">Python file I/O</a>, <a className="text-cyber-sky underline" href="https://docs.python.org/3/library/functions.html#open">open modes and encodings</a>, and <a className="text-cyber-sky underline" href="https://docs.python.org/3/library/codecs.html#error-handlers">decoding error policies</a>.</p><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-modules">← Review Modules &amp; Environments</Link></footer>
 </article>;
}

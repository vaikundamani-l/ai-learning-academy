import {useCallback,useState,type ReactNode} from 'react';
import {Link} from 'react-router-dom';
import type {Stage} from '../../types/curriculum';
import {LessonHeader} from '../../components/learning/LessonHeader';
import {LessonNotesDrawer} from '../../components/learning/LessonNotesDrawer';
import {CodeBlock} from '../../components/learning/CodeBlock';
import {ProgramTrace} from '../../components/learning/ProgramTrace';
import {ReasoningChallenge} from '../../components/learning/ReasoningChallenge';
import {AssessmentGate} from '../../components/learning/AssessmentGate';
import {structuredExamples,structuredQuestions,syntaxReasoning,limitedCsvParser,csvFileWriter,jsonFileWriter,csvSessionsDefinition} from '../../data/pythonStructuredDataContent';
import {limitedCsvModel} from '../../utils/limitedCsvTrace';
const sections=[['purpose','Choose a format'],['csv','Quoted CSV'],['records','Records & lines'],['scratch','Build a small parser'],['json','JSON values'],['schema','Validate meaning'],['importer','Import CSV safely'],['write','Serialize'],['exercises','Transfer practice'],['assessment','Knowledge check']];
function Section({id,title,children}:{id:string;title:string;children:ReactNode}){return <section id={id} className="space-y-4 scroll-mt-24"><h2 className="text-2xl font-bold text-slate-100">{title}</h2>{children}</section>;}
function Example({index}:{index:number}){const e=structuredExamples[index];return <div className="space-y-4 min-w-0"><CodeBlock title={e.title} code={e.code}/><p>{e.explanation}</p><p className="font-semibold text-slate-100">Verified output</p><pre className="p-4 overflow-x-auto rounded-xl border border-surface-border bg-surface text-cyber-emerald text-sm">{e.output}</pre></div>;}
export function PythonStructuredDataLesson({currentPath}:{stage:Stage;currentPath:string}){
 const [notesOpen,setNotesOpen]=useState(false);const closeNotes=useCallback(()=>setNotesOpen(false),[]);
 const [text,setText]=useState('"Lee, Ada",25,"said ""hi"""');const [prediction,setPrediction]=useState('');const [checked,setChecked]=useState(false);
 const model=limitedCsvModel(text);const expected=model.error?'reject':String(model.fields!.length);
 const changeText=(value:string)=>{setText(value);setPrediction('');setChecked(false);};
 return <article className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10 text-slate-300 leading-relaxed min-w-0">
 <LessonHeader stageNumber={1} lessonIndex={8} totalLessons={0} estimatedReadTime="75–100 minutes" title="CSV, JSON & Structured-Data Validation" currentPath={currentPath} onOpenNotes={()=>setNotesOpen(true)}/>
 <LessonNotesDrawer isOpen={notesOpen} onClose={closeNotes} lessonPath={currentPath} lessonTitle="CSV, JSON & Structured-Data Validation"/>
 <p className="text-lg">Preserve field boundaries, decode structured values, and validate a record’s meaning before admitting it into your application.</p>
 <nav aria-label="Lesson sections" className="flex flex-wrap gap-2">{sections.map(([id,title])=><a key={id} href={`#${id}`} className="min-h-11 p-3 border border-surface-border rounded-lg text-cyber-sky text-sm">{title}</a>)}</nav>
 <Section id="purpose" title="1. A format describes structure; a schema describes your contract">
 <p>Prerequisite: <Link className="text-cyber-sky underline" to="/stage/1/lesson/python-files">Files, Encodings &amp; Reliable Record Processing</Link>. You should be able to read text with an explicit encoding, process collections and reject a malformed record without publishing a partial report.</p>
 <ul className="list-disc pl-6 space-y-2"><li>Explain delimiter, quoting and logical-record boundaries in CSV.</li><li>Build and trace a deliberately restricted single-record parser.</li><li>Map JSON values into Python and distinguish syntax from application validity.</li><li>Validate and round-trip small session records without silently dropping or coercing fields.</li></ul>
 <p>A CSV table represents records as fields separated by a delimiter, usually a comma. Quoting allows a field to contain a delimiter or even a newline. JSON represents objects, arrays and primitive values with explicit syntax. CSV fits flat tables; JSON fits nested records. Choose from the data relationship rather than the file extension alone.</p>
 <p>Parsing recovers structure from text. A schema states what your application requires: keys, types, ranges and relationships. Deserialization creates Python values from an external representation; serialization writes compatible values into that representation. Neither operation automatically enforces your application’s schema.</p>
 </Section>
 <Section id="csv" title="2. A quoted comma is data, not a boundary">
 <Example index={0}/>
 <p>A CSV dialect defines choices such as delimiter and quote handling. In this lesson’s comma-and-double-quote format, a quoted field begins at its opening quote; commas inside remain data. Two quotes inside a quoted field represent one quote. Outside the quoted region, a comma terminates the field. The parser must remember which region it is in.</p>
 <p>strict=True enables the standard reader’s stricter error reporting for malformed input; it does not impose a field count, numeric range, required header or every application-specific rule. In these default reader examples, fields remain strings.</p>
 </Section>
 <Section id="records" title="3. A logical record can span physical lines">
 <Example index={1}/>
 <p>Do not feed a file through separate line.split(",") calls and assume each physical line is one record. Let csv.reader consume the stream. For real CSV files, use open(path, encoding="utf-8", newline="") so the CSV layer can handle line endings and quoted newlines.</p>
 <p>Headers are an application convention, not a CSV syntax guarantee. Validate the expected header before mapping fields. A duplicate header can hide data when mapped to dictionary keys, and a short or long row can silently acquire defaults or extras in permissive APIs. Our importer below checks the exact header and row width before accepting data.</p>
 </Section>
 <Section id="scratch" title="4. Build a bounded parser and inspect its state">
 <p>Contract: one nonempty record of at most 180 printable ASCII characters, commas as separators, double quotes enclosing fields, and doubled quotes as quote escapes. No embedded newlines, Unicode fields, alternate dialects or whitespace after a closing quote are supported. Unquoted spaces remain data. Empty fields are allowed, including a trailing field after a comma; use two quotes for an explicitly empty quoted field. Empty input is rejected as no supplied record.</p>
 <div className="grid sm:grid-cols-2 gap-3">{[['start','A field has not accumulated unquoted data yet; a quote may start it.'],['plain','Unquoted data is accumulating; comma ends it and a quote here is rejected.'],['quoted','Commas are data. A quote moves to afterquote.'],['afterquote','Another quote escapes one literal quote; comma ends the field; end of input closes the record.']].map(([state,meaning])=><div key={state} className="p-4 rounded-xl border border-surface-border bg-surface-card"><h3 className="font-mono font-semibold text-cyber-sky">{state}</h3><p className="text-sm mt-2">{meaning}</p></div>)}</div>
 <details><summary className="cursor-pointer py-2 text-cyber-sky">Read and run the complete Python implementation</summary><CodeBlock title="record_parser.py — limited format only" code={limitedCsvParser}/><p>The loop consumes one character at a time. fields contains completed fields; field holds the current one. A quote is interpreted from state, not stripped blindly. After the loop, an unfinished quoted field is rejected; otherwise the final field is appended.</p></details>
 <div className="p-4 sm:p-6 rounded-2xl border border-cyber-sky/30 bg-surface-card space-y-4 min-w-0">
 <label className="block">Single record (up to 180 characters)<input aria-label="Single CSV record" maxLength={180} value={text} onChange={e=>changeText(e.target.value)} className="block w-full mt-2 p-3 border border-surface-border bg-surface rounded-lg font-mono text-sm"/></label>
 <div className="flex flex-wrap gap-3">{[['Quoted comma','"Lee, Ada",25'],['Escaped quotes','"said ""hi""",25'],['Missing quote','"Ada,25'],['Empty fields','Ada,,']].map(([label,value])=><button key={label} onClick={()=>changeText(value)} className="min-h-11 px-3 py-2 border border-surface-border rounded-lg text-sm">{label}</button>)}</div>
 <label className="block">Predict the number of fields, or type reject<input aria-label="Predict fields or rejection" value={prediction} onChange={e=>{setPrediction(e.target.value);setChecked(false);}} className="block w-full mt-2 p-3 border border-surface-border bg-surface rounded-lg"/></label>
 <button disabled={!prediction.trim()} onClick={()=>setChecked(true)} className="min-h-11 px-4 py-3 rounded-lg border border-cyber-sky text-cyber-sky disabled:opacity-50">Check CSV prediction</button>
 {checked&&<p role="status">{prediction.trim().toLowerCase()===expected?'Your prediction matches.':'Compare the trace with your prediction.'} {model.error?'The restricted parser rejects this input.':`It returns ${model.fields!.length} string fields.`}</p>}
 <ProgramTrace key={text} title="record_caller.py" code={model.code} frames={model.frames}/>
 <p className="text-sm">Save the Python implementation above as record_parser.py beside this caller before running it. The browser trace models that same restricted algorithm. Character steps highlight the waiting call while its internal field and state values change; the result is printed as compact JSON to expose field boundaries.</p>
 </div>
 <p>Invariant: completed fields have crossed a delimiter outside quotes; field contains exactly the decoded content of the unfinished field. The final delimiter is not required to complete the last field: end of input does that. This small parser is an engineering exercise; use the standard library for the broader formats it supports.</p>
 </Section>
 <Section id="json" title="5. JSON values are not Python source code">
 <Example index={2}/>
 <p>JSON objects use string keys; arrays are ordered values; strings use double quotes. Standard JSON spells its boolean and empty value literals true, false and null. Python uses True, False and None. Single-quoted object text, comments and trailing commas are not part of standard JSON syntax. json.loads reports malformed syntax with JSONDecodeError, which includes line and column information.</p>
 <p>Do not use eval to parse external text. JSON parsing interprets a data grammar rather than arbitrary Python expressions. Parsing still needs size/resource limits for untrusted large inputs. Repeated object names are another policy: Python’s default loader normally keeps the last value. Its default numeric handling also accepts NaN and infinities beyond standard JSON. A stricter ingestion boundary must explicitly reject such cases when required.</p>
 </Section>
 <Section id="schema" title="6. Check shape, exact types and domain ranges">
 <p>Our session contract is exactly two keys: name is nonblank text and minutes is an integer from 0 through 60. Unknown and missing keys are rejected. Numeric strings, floats, booleans and null are not coerced into minutes. Whitespace around a nonblank name is preserved rather than silently normalized.</p>
 <Example index={3}/>
 <p>type(value) is dict and the other exact-type checks ask which concrete built-in type was produced. set(value) collects dictionary keys so they can be compared with the allowed key set. isinstance includes subclasses, which is useful in other APIs but would allow a boolean through an ordinary integer check here. A returned dictionary is still the parsed object; validation does not create a deep copy.</p>
 <ReasoningChallenge challenge={syntaxReasoning}/>
 <p>This validator sees the object after parsing. It cannot detect duplicate keys that the loader already merged. It also does not enforce byte-size, nesting or duplicate-key restrictions on the source document. Keep syntax policy, schema rules and resource limits separate and explicit.</p>
 </Section>
 <Section id="importer" title="7. Combine CSV parsing with the same record contract">
 <CodeBlock title="sessions_csv.py — import and validate before returning" code={csvSessionsDefinition}/>
 <CodeBlock title="sessions.csv — save in a fresh exercise folder" language="text" code={'name,minutes\n"Lee, Ada",25\n'}/>
 <CodeBlock title="Caller — append after the importer definitions" code={'print(load_sessions_csv("sessions.csv"))'}/>
 <p>Run the combined importer and caller from this exercise folder. It prints a one-item list containing a dictionary with name Lee, Ada and integer minutes 25. A header-only file returns an empty list; a completely empty file is rejected because the required header is absent. Blank data records are rejected rather than silently skipped.</p>
 <p>Malformed CSV syntax can raise csv.Error, while our record checks raise ValueError; missing-file and decoding failures remain separate I/O boundaries. The reader handles quoting. The importer checks header, field count, conversion and the shared session schema. It names the physical line where a bad logical record ends, preserving the cause. After each accepted record, sessions contains exactly the validated records processed so far. Any later error prevents that partial list being returned as a successful import.</p>
 <p>This demonstration retains accepted records in memory; it is not an unbounded-file streaming guarantee. Handling very large imports may require bounded batches and transactional writes. It also uses one chosen dialect and schema, not automatic format guessing.</p>
 </Section>
 <Section id="write" title="8. Let serializers escape the format correctly">
 <p>Run each example in a fresh exercise folder. Exclusive x mode refuses an existing destination instead of overwriting it. The CSV writer chooses quoting for the comma-containing name; the reader then reconstructs two fields rather than three.</p>
 <CodeBlock title="csv_round_trip.py" code={csvFileWriter}/>
 <pre className="p-4 overflow-x-auto rounded-xl bg-surface border border-surface-border text-sm">{"[['name', 'minutes'], ['Lee, Ada', '25']]"}</pre>
 <p>CSV readers return strings here, so the written integer becomes text when read back. csv.writer writes None as an empty field by default; that transformation does not preserve the difference between None and an empty string.</p>
 <CodeBlock title="json_round_trip.py" code={jsonFileWriter}/>
 <p>Expected output: Round trip passed. allow_nan=False rejects non-finite float values during this serialization. A general JSON round trip does not preserve every Python type: tuples become arrays/lists, sets are not supported by default, and non-string dictionary keys can change meaning. Here the values are already compatible with the intended JSON record.</p>
 <p>Do not repeatedly append json.dump objects to a file and call the result one ordinary JSON document: adjacent documents are not automatically a framed format. Choose one document or a separately specified record format, and validate the structure you read back.</p>
 </Section>
 <Section id="exercises" title="9. Diagnose, modify and transfer">
 {[
 ['Explain a delimiter','Predict the restricted parser output for "Ada, Lee",25 and for Ada,Lee,25. Explain how one additional quote changes a delimiter into data. Then test an escaped quote.','The quoted-name case has two fields; the unquoted case has three. Quotes change parser state, not just the final display. A doubled quote inside quoted data produces a literal quote.'],
 ['Repair a schema mistake','Replace the exact minutes type check with isinstance(minutes, int) in a disposable copy. Test true, "25", 25, 25.0 and null after JSON parsing. Which unexpected value now passes?','True passes the loose integer check because bool subclasses int. Exact integer validation accepts 25 and rejects the other listed values under this contract.'],
 ['Transfer: quantity records','Implement validate_quantity(value) for exactly item (nonblank text) and quantity (an exact integer 1–100). Load JSON text first, then validate it. Test a valid quantity of 1 and 100, zero, true, "3", a missing item, an extra key and a non-object top-level value. Write a CSV adapter with the exact header item,quantity and preserve a quoted comma in an item name.','Keep parsing, conversion and schema checks distinct. JSON true must not become a quantity, CSV "3" must be deliberately converted before the common validator, and duplicate/unexpected columns must not be silently discarded. A parsed object with missing or extra keys must be rejected.'],
 ].map(([title,task,hint])=><div key={title} className="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3"><h3 className="font-semibold text-slate-100">{title}</h3><p>{task}</p><details><summary className="cursor-pointer py-2 text-cyber-sky">Reveal guidance after trying</summary><p>{hint}</p></details></div>)}
 <p>Readiness evidence: justify field boundaries, trace the restricted parser’s states, validate the quantity contract independently and show that malformed syntax, invalid schema and valid records have different outcomes. Do not infer that a library parser or round-trip check has proved the whole application contract.</p>
 </Section>
 <AssessmentGate currentPath={currentPath} lessonTitle="CSV, JSON & Structured-Data Validation" sectionNumber={10} questions={structuredQuestions}/>
 <footer className="border-t border-surface-border pt-6 space-y-3 text-sm"><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-classes">Continue to Lesson 9: Classes &amp; Composition →</Link><p>Primary references: <a className="text-cyber-sky underline" href="https://docs.python.org/3/library/csv.html">Python csv</a> and <a className="text-cyber-sky underline" href="https://docs.python.org/3/library/json.html">Python json</a>.</p><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-files">← Review Files &amp; Record Processing</Link></footer>
 </article>;
}

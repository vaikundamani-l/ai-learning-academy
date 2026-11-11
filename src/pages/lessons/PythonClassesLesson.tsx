import {useCallback,useState,type ReactNode} from 'react';
import {Link} from 'react-router-dom';
import type {Stage} from '../../types/curriculum';
import {LessonHeader} from '../../components/learning/LessonHeader';
import {LessonNotesDrawer} from '../../components/learning/LessonNotesDrawer';
import {CodeBlock} from '../../components/learning/CodeBlock';
import {ProgramTrace} from '../../components/learning/ProgramTrace';
import {ReasoningChallenge} from '../../components/learning/ReasoningChallenge';
import {AssessmentGate} from '../../components/learning/AssessmentGate';
import {classExamples,classQuestions,sharedClassReasoning,budgetClassDefinition,plannerDefinition} from '../../data/pythonClassesContent';
import {budgetTraceModel} from '../../utils/pythonClassTrace';
const sections=[['purpose','Why objects?'],['instances','Class & instance'],['methods','Understand self'],['validate','Protect valid state'],['trace','State explorer'],['shared','Shared attributes'],['composition','Composition'],['failures','Failure boundaries'],['exercises','Transfer practice'],['assessment','Knowledge check']];
function Section({id,title,children}:{id:string;title:string;children:ReactNode}){return <section id={id} className="space-y-4 scroll-mt-24"><h2 className="text-2xl font-bold text-slate-100">{title}</h2>{children}</section>;}
function Example({index}:{index:number}){const e=classExamples[index];return <div className="space-y-4 min-w-0"><CodeBlock title={e.title} code={e.code}/><p>{e.explanation}</p><p className="font-semibold text-slate-100">Verified output</p><pre className="p-4 overflow-x-auto rounded-xl border border-surface-border bg-surface text-cyber-emerald text-sm">{e.output}</pre></div>;}
export function PythonClassesLesson({currentPath}:{stage:Stage;currentPath:string}){
 const [notesOpen,setNotesOpen]=useState(false);const closeNotes=useCallback(()=>setNotesOpen(false),[]);
 const [limit,setLimit]=useState(20);const [amount,setAmount]=useState(10);const [prediction,setPrediction]=useState('');const [checked,setChecked]=useState(false);
 const model=budgetTraceModel(limit,amount);
 const clearPrediction=()=>{setPrediction('');setChecked(false);};
 return <article className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10 text-slate-300 leading-relaxed min-w-0">
 <LessonHeader stageNumber={1} lessonIndex={9} totalLessons={0} estimatedReadTime="60–80 minutes" title="Classes, State & Composition" currentPath={currentPath} onOpenNotes={()=>setNotesOpen(true)}/>
 <LessonNotesDrawer isOpen={notesOpen} onClose={closeNotes} lessonPath={currentPath} lessonTitle="Classes, State & Composition"/>
 <p className="text-lg">Give a piece of changing state a clear owner, keep its permitted operations nearby, and connect collaborators without hiding how their failures affect the result.</p>
 <nav aria-label="Lesson sections" className="flex flex-wrap gap-2">{sections.map(([id,title])=><a key={id} href={`#${id}`} className="min-h-11 p-3 border border-surface-border rounded-lg text-cyber-sky text-sm">{title}</a>)}</nav>
 <Section id="purpose" title="1. Use an object when it clarifies responsibility">
 <p>Prerequisite: <Link className="text-cyber-sky underline" to="/stage/1/lesson/python-structured-data">CSV, JSON &amp; Structured-Data Validation</Link>. You should be able to validate data, trace a method call on a list, explain aliasing and raise an error before publishing an invalid result.</p>
 <ul className="list-disc pl-6 space-y-2"><li>Distinguish class, instance, attribute, initialization and bound method.</li><li>Trace which instance receives a state change through self.</li><li>Maintain a documented invariant through validated operations.</li><li>Compose a budget and recorder while explaining ownership and partial failure.</li></ul>
 <p>A dictionary of fields plus functions can be a good design. A class becomes useful when a stable responsibility owns state across several operations. For example, a budget must remember accepted minutes and reject actions that would exceed its limit. Keeping that rule beside the state makes the intended interface easier to find.</p>
 <p>A class defines a type and its behavior. An instance is an individual object of that type. An attribute is a named value accessed through a dot. A method is an operation supplied by the class and called through an instance. Objects are not a substitute for validation, and learning classes does not make every function or dictionary obsolete.</p>
 </Section>
 <Section id="instances" title="2. Build two instances and trace their identities">
 <Example index={0}/>
 <p>The ordinary class call creates an instance and initializes it before returning it to the caller. __init__ initializes an already-created instance; it is not the allocation step and must return None. Allocation through __new__ is an advanced topic we do not customize here. If initialization raises, that new caller assignment does not complete.</p>
 <p>The two Session calls here create distinct instances with separate attribute bindings. alias = first creates another name for the same instance rather than copying it. is checks identity. The simple class does not define value equality; equal-looking attributes do not automatically create custom equality behavior.</p>
 </Section>
 <Section id="methods" title="3. self is the receiving object, not shared global state">
 <p>For the ordinary methods shown, first.label() supplies first as the first argument. Session.label(first) makes that binding visible explicitly. self is the conventional parameter name; it is not a reserved keyword or a special global that always points to the newest object.</p>
 <p>Inside initialization, name is a local parameter. self.name assigns an attribute on the receiving instance so later calls can retrieve it. Writing only name = ... would rebind a local name and would not create self.name. This is the same local-binding distinction you traced in the functions lesson, now with explicit attribute access.</p>
 <p>The class body executes when its definition runs, creating method functions and any class attributes. A method’s body waits for a call. We focus on ordinary instance methods; static methods, class methods, descriptors and inheritance will require additional rules.</p>
 </Section>
 <Section id="validate" title="4. Establish an invariant and validate before mutation">
 <p>Budget’s contract accepts an exact integer limit 0–60, starts used at 0, and permits nonnegative exact integer additions only while they fit. Its invariant is 0 ≤ used ≤ limit ≤ 60. Save this implementation as budget_model.py in the same exercise folder as its callers.</p>
 <CodeBlock title="budget_model.py" code={budgetClassDefinition}/>
 <Example index={1}/>
 <p>The sum is computed and checked before assignment. If the proposed total is too large, the method raises and leaves the previous state unchanged. Zero is permitted; booleans, strings, floats and negative additions are not. __init__ establishes a valid starting state, and each accepted method call preserves it.</p>
 <p>A leading underscore marks a non-public implementation detail by convention; it does not prevent direct access. A caller could still assign an invalid _used or _limit. The guarantees here cover the documented constructor/method path, not hostile writes to internal attributes. Encapsulation communicates responsibility and intended access; these attributes are not a security boundary.</p>
 </Section>
 <Section id="trace" title="5. Follow an accepted update and a rejected update">
 <p>The caller first seeds the budget with the smaller of 5 and its limit. Predict whether the next addition fits. Follow self into the same instance and compare its attributes before and after the guard. Changing either input starts a fresh model.</p>
 <div className="p-4 sm:p-6 rounded-2xl border border-cyber-sky/30 bg-surface-card space-y-4 min-w-0">
 <label className="block">Limit: {limit}<input aria-label="Budget limit" type="range" min="0" max="60" value={limit} onChange={e=>{setLimit(Number(e.target.value));clearPrediction();}} className="block w-full mt-3 accent-cyber-sky"/></label>
 <label className="block">Next addition: {amount}<input aria-label="Minutes to add" type="range" min="0" max="80" value={amount} onChange={e=>{setAmount(Number(e.target.value));clearPrediction();}} className="block w-full mt-3 accent-cyber-sky"/></label>
 <label className="block">Predict the action<select aria-label="Predict budget action" value={prediction} onChange={e=>{setPrediction(e.target.value);setChecked(false);}} className="block w-full mt-2 p-3 rounded-lg bg-surface border border-surface-border"><option value="">Choose before tracing</option><option value="accept">Accept and update</option><option value="reject">Reject without updating</option></select></label>
 <button disabled={!prediction} onClick={()=>setChecked(true)} className="min-h-11 px-4 py-3 rounded-lg border border-cyber-sky text-cyber-sky disabled:opacity-50">Check state prediction</button>
 {checked&&<p role="status">{(prediction==='reject')===model.rejected?'Your action prediction matches.':'Compare the guard with your prediction.'} {model.rejected?'The proposed total exceeds the limit; prior accepted state stays unchanged.':'The addition fits; the instance receives the new total.'}</p>}
 <ProgramTrace key={`${limit}-${amount}`} title="budget_caller.py" code={model.code} frames={model.frames} renderState={step=>{const snapshot=model.snapshots[step];return <div className="p-4 rounded-xl border border-cyber-sky/30 bg-surface min-w-0"><p className="font-semibold text-cyber-sky">{snapshot.created?'budget → Instance A':'No Budget instance assigned yet'}</p>{snapshot.created&&<dl className="grid grid-cols-3 gap-2 mt-3 text-sm"><div><dt>Limit</dt><dd>{snapshot.limit}</dd></div><div><dt>Used</dt><dd>{snapshot.used}</dd></div><div><dt>Remaining</dt><dd>{snapshot.limit-snapshot.used}</dd></div></dl>}</div>;}}/>
 <p className="text-sm">Save budget_model.py beside this caller to run it in Python. The trace summarizes constructor/method internals while highlighting the waiting caller line. Instance A is a teaching identity label, not a memory address. Input controls cover nonnegative integers; the actual class also rejects unsupported types.</p>
 </div>
 </Section>
 <Section id="shared" title="6. Distinct instances can still share a mutable attribute">
 <ReasoningChallenge challenge={sharedClassReasoning}/>
 <p>In these plain classes, attribute lookup first finds an instance attribute when present; otherwise it can reach the class attribute. Mutating a class-level list reached through an instance does not automatically copy it. Assigning an instance attribute can shadow a class attribute, which is another operation entirely.</p>
 <p>Class attributes are appropriate for deliberately shared class-level values. Per-instance lists should be created during each initialization. The same concern applies to mutable default arguments: a default list is not automatically recreated for each call. We will revisit defaults and scope with advanced functions.</p>
 </Section>
 <Section id="composition" title="7. Compose collaborators with separate responsibilities">
 <p>Composition means an object holds and uses other objects. StudyPlanner has a budget and a recorder; it is not a subclass of either. Save the following as planner.py beside budget_model.py, then run use_planner.py.</p>
 <CodeBlock title="planner.py" code={plannerDefinition}/>
 <div className="grid sm:grid-cols-3 gap-3">{[['StudyPlanner','Coordinates the action.'],['Budget','Accepts/rejects and tracks allowance.'],['MemoryLog','Stores accepted amounts and provides snapshots.']].map(([title,meaning])=><div key={title} className="p-4 rounded-xl border border-surface-border bg-surface-card"><h3 className="font-semibold text-slate-100">{title}</h3><p className="text-sm mt-2">{meaning}</p></div>)}</div>
 <Example index={2}/>
 <ol className="list-decimal pl-6 space-y-2"><li>planner.schedule(10) binds the planner instance as self and 10 as minutes.</li><li>self._budget resolves the supplied Budget instance. Its add method receives that Budget as its own self, validates the proposed total and changes used from 0 to 10.</li><li>self._recorder resolves the MemoryLog instance. Its record method receives the log as its own self and appends 10.</li><li>The calls finish without a result to use; the caller can ask the budget for its remaining 20 minutes. The later schedule(15) leaves 5.</li></ol>
 <p>The name self is local to each method call. The same spelling does not make the planner, budget and recorder the same object.</p>
 <p>The caller supplies the collaborators instead of letting the planner secretly choose them. This is dependency injection: explicit dependencies are passed in. The recorder contract here is that it provides record(minutes); the planner does not enforce a particular recorder class. Relying on the required behavior rather than a specific class is often called duck typing.</p>
 <p>References are shared, not copied. If two planners receive the same budget, they affect the same allowance; if each receives a new budget, their state is separate. Decide which ownership model your application needs. Returning a list copy prevents callers from appending directly to MemoryLog’s internal outer list, but does not turn the whole object into immutable data.</p>
 </Section>
 <Section id="failures" title="8. A valid method does not make a whole workflow transactional">
 <p>If Budget rejects the amount, schedule exits before record runs, so neither accepted budget state nor the log changes. If recording raises after Budget accepts, the budget has already changed. Two method calls do not form an automatic transaction. This teaching planner deliberately makes the order visible rather than claiming it is a production-safe persistent booking system.</p>
 <p>For production, decide what failure must preserve: reserved allowance, a durable record, or both. You may need a transaction, a reservation/commit protocol or an explicit compensation policy. Catching an error and printing success cannot provide those guarantees. Use a deliberately failing recorder in tests to expose the partial state.</p>
 <p>Inheritance expresses a different relationship: an instance of a subtype should satisfy the expected behavior of its base type. Using inheritance only to reuse a few lines can couple unrelated responsibilities. In this example, composition directly expresses the has-a relationship without inventing a Budget/Planner hierarchy.</p>
 </Section>
 <Section id="exercises" title="9. Explain, test failure and transfer">
 {[
 ['Explain the receiver','Make two Budget instances with limit 20. Add 5 through one, then bind an alias to it and add another 3 through the alias. Predict both totals and explain every reference.','The aliased instance totals 8; the distinct instance stays 0. Both names reach one instance, while the second class call produced a separate instance.'],
 ['Expose partial failure','Write a recorder whose record method raises RuntimeError. Give it to StudyPlanner, call schedule(10), handle that RuntimeError in your test and inspect the budget. Explain why the recorded failure did not restore the earlier total.','The budget now totals 10 because its update happened before recording. Test this deliberately; do not label schedule atomic. Also verify that a rejected budget addition never calls the recorder.'],
 ['Transfer: stock item and order desk','Implement StockItem(name, quantity): require nonblank text and an exact integer quantity 0–100. take(amount) requires an exact integer of at least 1, rejects requests larger than stock and updates only after validation. remaining() returns stock. Compose it with a recorder in OrderDesk.request(amount). Test initial stock 3, taking 2, rejecting 2 more, rejecting 0/True, independent instances and a failing recorder.','After taking 2, remaining is 1; all listed invalid takes preserve 1. A zero request is invalid here even though Budget.add(0) was valid. OrderDesk first takes stock, then records; if recording fails afterward, that version is not atomic either. Make that limitation part of the contract.'],
 ].map(([title,task,hint])=><div key={title} className="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3"><h3 className="font-semibold text-slate-100">{title}</h3><p>{task}</p><details><summary className="cursor-pointer py-2 text-cyber-sky">Reveal guidance after trying</summary><p>{hint}</p></details></div>)}
 <p>Readiness evidence: independently build the stock class and composed desk, show per-instance state, preserve invariants on rejected actions, demonstrate a shared-reference case and test the recorder failure boundary. The quiz checks understanding, not production readiness.</p>
 </Section>
 <AssessmentGate currentPath={currentPath} lessonTitle="Classes, State & Composition" sectionNumber={10} questions={classQuestions}/>
 <footer className="border-t border-surface-border pt-6 space-y-3 text-sm"><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-testing">Continue to Lesson 10: Testing, Debugging &amp; Logging →</Link><p>Primary references: <a className="text-cyber-sky underline" href="https://docs.python.org/3/tutorial/classes.html">Python classes</a> and <a className="text-cyber-sky underline" href="https://docs.python.org/3/reference/datamodel.html#object.__init__">instance initialization</a>.</p><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-structured-data">← Review CSV, JSON &amp; Validation</Link></footer>
 </article>;
}

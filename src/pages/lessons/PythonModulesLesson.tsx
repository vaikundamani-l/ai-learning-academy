import { useCallback, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Stage } from '../../types/curriculum';
import { LessonHeader } from '../../components/learning/LessonHeader';
import { LessonNotesDrawer } from '../../components/learning/LessonNotesDrawer';
import { CodeBlock } from '../../components/learning/CodeBlock';
import { ProgramTrace } from '../../components/learning/ProgramTrace';
import { ReasoningChallenge } from '../../components/learning/ReasoningChallenge';
import { AssessmentGate } from '../../components/learning/AssessmentGate';
import { moduleExamples, moduleQuestions, moduleReasoning, environmentProbe, environmentCommands, windowsEnvironmentCommands, requirementsExample } from '../../data/pythonModulesContent';
import { importTraceModel } from '../../utils/pythonImportTrace';
const sections=[['purpose','Why modules?'],['files','Connect files'],['initialization','Import runs code'],['guard','Main guard'],['trace','Import explorer'],['packages','Packages & -m'],['environment','Choose an interpreter'],['dependencies','Dependencies'],['debug','Diagnose imports'],['exercises','Transfer practice'],['assessment','Knowledge check']];
function Section({id,title,children}:{id:string;title:string;children:ReactNode}){return <section id={id} className="space-y-4 scroll-mt-24"><h2 className="text-2xl font-bold text-slate-100">{title}</h2>{children}</section>;}
function Example({index}:{index:number}){const e=moduleExamples[index];return <div className="space-y-4 min-w-0"><p>Use a separate folder for this example; save each file at the path shown.</p>{Object.entries(e.files).map(([path,code])=><CodeBlock key={path} title={path} code={code}/>)}<CodeBlock title="Run from this example’s root folder" language="bash" code={`python3 ${e.module?'-m ':''}${e.entry}`}/><p>{e.explanation}</p><p className="font-semibold text-slate-100">Verified output</p><pre className="p-4 overflow-x-auto rounded-xl border border-surface-border bg-surface text-cyber-emerald text-sm">{e.output}</pre></div>;}
export function PythonModulesLesson({currentPath}:{stage:Stage;currentPath:string}){
 const [notesOpen,setNotesOpen]=useState(false);const closeNotes=useCallback(()=>setNotesOpen(false),[]);
 const [mode,setMode]=useState<'import'|'script'>('import');const [prediction,setPrediction]=useState('');const [checked,setChecked]=useState(false);
 const model=importTraceModel(mode);const expected=mode==='import'?'Initializing totals\nApp: 150':'Initializing totals\nDemo: 140';
 return <article className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10 text-slate-300 leading-relaxed min-w-0">
 <LessonHeader stageNumber={1} lessonIndex={6} totalLessons={0} estimatedReadTime="60–75 minutes" title="Modules, Imports & Project Environments" currentPath={currentPath} onOpenNotes={()=>setNotesOpen(true)}/>
 <LessonNotesDrawer isOpen={notesOpen} onClose={closeNotes} lessonPath={currentPath} lessonTitle="Modules, Imports & Project Environments"/>
 <p className="text-lg">Keep a reusable rule in one place, connect its callers through imports, and prove which interpreter and dependencies run your program.</p>
 <nav aria-label="Lesson sections" className="flex flex-wrap gap-2">{sections.map(([id,title])=><a key={id} href={`#${id}`} className="min-h-11 p-3 border border-surface-border rounded-lg text-cyber-sky text-sm">{title}</a>)}</nav>
 <Section id="purpose" title="1. Separate responsibility without copying the rule">
 <p>Prerequisite: <Link className="text-cyber-sky underline" to="/stage/1/lesson/python-exceptions">Exceptions, Validation &amp; Useful Errors</Link>. You should be able to write a function, read a traceback, create text files and run Python from a terminal.</p>
 <ul className="list-disc pl-6 space-y-2"><li>Use one helper module from an application and a test without duplicating its implementation.</li><li>Trace import initialization, cached reuse and a guarded entry point.</li><li>Run a regular package in package context and diagnose common import failures.</li><li>Create a project environment, inspect its interpreter and explain dependency boundaries.</li></ul>
 <p>A growing script mixes calculations, interaction and checks. Copying the same function into several scripts creates several versions to maintain. A module gives the shared implementation its own namespace: a collection of names belonging to that module. Callers can request those names without pasting their definitions.</p>
 <p>A module in our examples is a .py source file. A regular import package groups modules and contains __init__.py. A distribution is an installable software project managed by a tool such as pip. Its distribution name and import names need not match. A dependency is software your project requires; an environment determines which interpreter and installed distributions are available.</p>
 </Section>
 <Section id="files" title="2. A helper, an application and a check">
 <Example index={0}/>
 <p>Also run python3 check_totals.py; expect Checks passed. The calculation assumes integer inputs appropriate to the caller’s domain, as in the earlier basic function example. Keep validation where its contract requires it; moving code into a module does not validate its inputs automatically.</p>
 <p>import totals binds the module name, so totals.weekly_minutes makes the source of the operation explicit. from totals import weekly_minutes binds the requested function directly; it still initializes the module if necessary. It does not load only the text of that one function. Avoid star imports in this project because they make the origin of names harder to inspect.</p>
 </Section>
 <Section id="initialization" title="3. Import can execute code before you call a function">
 <Example index={1}/>
 <p>During an ordinary first import, Python resolves the module, begins initializing it, executes its top-level statements, and supplies the module to the caller. It tracks modules in a cache called sys.modules. Successful repeated imports of the same name in this process normally reuse that object. This is why “import” is not a promise of a side-effect-free operation.</p>
 <p>Definitions are top-level statements too: def creates a function binding, while the function body waits for a call. Keep reusable modules quiet when possible. Starting input prompts, changing files or performing lengthy work on import can surprise every caller.</p>
 <ReasoningChallenge challenge={moduleReasoning}/>
 </Section>
 <Section id="guard" title="4. A main guard separates reusable code from a demo">
 <Example index={2}/>
 <p>__name__ is a module-level name set by Python for its execution context. In this ordinary import, it is totals. For the entry script it is __main__. The condition checks that value; it does not inspect the filename itself. Running the helper directly and importing it are different entry paths.</p>
 <p>The guard protects only its indented body. Moving a print or input call above it makes that operation run during import again. Aim for an importable calculation core and a small explicit entry point that handles interaction.</p>
 </Section>
 <Section id="trace" title="5. Predict initialization and cached reuse">
 <p>Choose how the program starts, predict every output line, then trace the path. Each change starts a fresh modeled process. In import mode the highlight belongs to app.py; the waiting import summarizes work inside totals.py.</p>
 <div className="p-4 sm:p-6 rounded-2xl bg-surface-card border border-cyber-sky/30 space-y-4 min-w-0">
 <div role="group" aria-label="Choose module entry point" className="flex flex-wrap gap-3">{(['import','script'] as const).map(item=><button key={item} aria-pressed={mode===item} onClick={()=>{setMode(item);setPrediction('');setChecked(false);}} className={`min-h-11 px-4 py-3 rounded-lg border ${mode===item?'border-cyber-sky text-cyber-sky':'border-surface-border'}`}>{item==='import'?'Import twice from app':'Run helper as script'}</button>)}</div>
 {mode==='import'&&<CodeBlock title="totals.py — helper used by the trace" code={model.helper}/>}
 <label className="block">Predict all output lines<textarea rows={3} value={prediction} onChange={e=>{setPrediction(e.target.value);setChecked(false);}} className="block w-full mt-2 p-3 rounded-lg border border-surface-border bg-surface font-mono text-sm"/></label>
 <button disabled={!prediction.trim()} className="min-h-11 px-4 py-3 rounded-lg border border-cyber-sky text-cyber-sky disabled:opacity-50" onClick={()=>setChecked(true)}>Check import prediction</button>
 {checked&&<p role="status">{prediction.replace(/\r\n/g,'\n').trim()===expected?'Your output prediction matches.':'Compare your prediction with the trace.'} Initialization prints once in either entry path; only the selected entry point prints App or Demo.</p>}
 <ProgramTrace key={mode} title={mode==='import'?'app.py':'totals.py'} code={model.code} frames={model.frames}/>
 <p className="text-sm">This guided model covers these two files in fresh processes. It does not simulate arbitrary import hooks, reloads or circular imports.</p>
 </div>
 </Section>
 <Section id="packages" title="6. Group related modules and run in package context">
 <Example index={3}/>
 <p>Make the study directory before saving its three files. The dot in from .totals import ... refers to the current package, not an arbitrary filesystem path. Running python3 study/__main__.py directly does not establish that same package context and can fail with an attempted-relative-import error. Use the demonstrated -m form from the parent folder.</p>
 <p>python -m names a module or package to execute using the selected interpreter’s import machinery. This is the same reason -m pip asks that interpreter to run its pip module. Import packages and installed distributions are related concepts, but a local study folder does not need an internet installation to be imported from this project.</p>
 </Section>
 <Section id="environment" title="7. Check the interpreter instead of trusting the prompt">
 <p>A virtual environment gives a project its own package installation area based on an existing Python installation. It normally separates project packages from those in the base environment. It is not a virtual machine or a security sandbox: code still has the process’s operating-system permissions.</p>
 <CodeBlock title="inspect_env.py — save beside the examples" code={environmentProbe}/>
 <p>sys is a standard-library module supplied with Python. executable identifies the interpreter path; prefix and base_prefix identify the active and base installation prefixes. In a standard venv, their inequality reports True. Version and absolute paths depend on your machine, so inspect them rather than copying invented values.</p>
 <p>Use a new project folder and a fresh .venv destination for this exercise. Save the following requirements.txt beside inspect_env.py. It intentionally requires no third-party distributions, so this exercise can verify the workflow without downloading packages.</p>
 <CodeBlock title="requirements.txt" language="text" code={requirementsExample}/>
 <CodeBlock title="Linux/macOS terminal — run in that project folder" language="bash" code={environmentCommands}/>
 <details><summary className="cursor-pointer py-2 text-cyber-sky">Windows commands</summary><CodeBlock title="Windows terminal" language="bash" code={windowsEnvironmentCommands}/></details>
 <p>Expected evidence: inspect_env.py reports In venv: True and an executable inside the new environment; pip --version reports a pip path for that environment; pip check reports No broken requirements found. The empty requirements file installs no application dependencies. --no-index prevents index lookups for this exercise.</p>
 <p>Some operating-system Python distributions require their venv/ensurepip support to be installed before environment creation works. If creation fails, read that error before proceeding. On a standard venv with pip available, these commands use the environment’s explicit interpreter path, so activation is optional. Activation mainly changes command lookup in the current shell; it does not transform an already-running notebook kernel or editor interpreter.</p>
 <p>Keep source files outside .venv and exclude .venv/ from Git. Record how to recreate the environment rather than copying its folder to another machine. A recreated environment may need a compatible Python version and platform.</p>
 </Section>
 <Section id="dependencies" title="8. Installation, imports and reproducibility are separate checks">
 <p>Running python -m pip selects pip through that Python interpreter. A bare pip command can resolve to another installation on PATH. If installation succeeds but import fails, compare sys.executable, the pip-reported location and the module’s expected import name before installing again.</p>
 <p>A direct dependency is required by your project; a transitive dependency is required by one of those dependencies. An actual application’s requirements should describe the distributions and constraints it needs. This exercise has none, so its file contains comments instead of a made-up package requirement.</p>
 <p>A version pin restricts one distribution’s version. It does not alone specify every transitive version, platform-specific build, interpreter or artifact. A freeze records an environment’s installed distributions; it is useful evidence, not a universal lock or a description of why each dependency was included. pip check detects certain declared dependency inconsistencies; it does not prove the application’s behavior or security.</p>
 <p>When adding a real dependency later, verify the published distribution, its import name, its compatibility and why the standard library is insufficient. Install using the selected project interpreter, then run the project’s actual behavioral tests. No third-party install is required for the lessons above.</p>
 </Section>
 <Section id="debug" title="9. Diagnose resolution and dependency problems">
 <div className="overflow-x-auto rounded-xl border border-surface-border"><table className="w-full text-sm text-left"><thead><tr><th className="p-3">Symptom</th><th className="p-3">Investigation</th></tr></thead><tbody>{[
 ['ModuleNotFoundError','Check spelling, project layout, launch folder, selected interpreter and whether a needed distribution is actually installed there.'],
 ['An imported library lacks an expected attribute','Check the module’s __file__ when present. A local file named like a library can shadow it; rename the conflict and restart the process. Some built-in modules have no __file__.'],
 ['Attempted relative import with no known parent package','Run the package in its intended context with -m, rather than launching a package-internal file as an unrelated script.'],
 ['A partially initialized module or circular import','Two modules may request names from each other before those names are bound. Move shared definitions into a lower-level module and keep dependencies one-way.'],
 ['A package is installed but another interpreter cannot import it','Compare interpreter paths and use that interpreter with -m pip. Restart long-running sessions after choosing the correct environment.'],
 ].map(([symptom,fix])=><tr key={symptom} className="border-t border-surface-border"><td className="p-3 align-top">{symptom}</td><td className="p-3">{fix}</td></tr>)}</tbody></table></div>
 <p>For the local helper, inspect totals.__file__ after import totals to see its resolved source. In these ordinary examples, the script directory participates in import search; -m uses the current directory in its starting search context. Installed package locations also matter. Changing sys.path at random can hide a layout problem and make launches behave differently.</p>
 </Section>
 <Section id="exercises" title="10. Explain, diagnose and transfer">
 {[
 ['Explain the entry paths','Predict what the guarded helper prints when imported from app.py and when run directly. Then move its demo print above the guard and explain what changes.','The guarded demo prints only when the helper is the entry script. A top-level demo print runs during first import too. The guard protects its own block, not the entire module.'],
 ['Diagnose before reinstalling','In a disposable example folder, create a local module with the same name as a library you intended to import. Inspect its __file__, rename it and restart Python. Explain why changing pip installations would not repair that local naming conflict.','Import resolution selected the local source. The resolved path is evidence; package installation is a separate operation. Use a fresh process so the earlier module cache does not obscure the rename.'],
 ['Transfer: reusable capacity package','Create a regular package capacity with __init__.py, estimates.py and __main__.py. Put total_mib(count, mib_per_file) in estimates.py; assume nonnegative integer inputs and return count * mib_per_file. The entry module should print total_mib(4, 25). Write a separate check_capacity.py that imports the function and checks (0, 10) and (3, 12) without running the package’s entry output. Run the entry with python3 -m capacity.','The entry prints 100. Checks should verify 0 and 36 and only print a checks-passed message of their own. Keep the demo in the entry module; the calculation module stays quiet on import. State the simplified constant-file-size assumption.'],
 ].map(([title,task,hint])=><div key={title} className="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3"><h3 className="font-semibold text-slate-100">{title}</h3><p>{task}</p><details><summary className="cursor-pointer py-2 text-cyber-sky">Reveal guidance after trying</summary><p>{hint}</p></details></div>)}
 <p>Readiness evidence: run the same helper from two callers, explain when its top-level code executes, demonstrate the package entry path, and show the selected environment’s actual interpreter and pip locations. A quiz score cannot substitute for those observed results.</p>
 </Section>
 <AssessmentGate currentPath={currentPath} lessonTitle="Modules, Imports & Project Environments" sectionNumber={11} questions={moduleQuestions}/>
 <footer className="border-t border-surface-border pt-6 space-y-3 text-sm"><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-files">Continue to Lesson 7: Files &amp; Record Processing →</Link><p>Primary references: <a className="text-cyber-sky underline" href="https://docs.python.org/3/tutorial/modules.html">Python modules</a>, <a className="text-cyber-sky underline" href="https://docs.python.org/3/library/venv.html">venv</a>, and <a className="text-cyber-sky underline" href="https://packaging.python.org/en/latest/tutorials/installing-packages/">Python Packaging User Guide</a>.</p><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-exceptions">← Review Exceptions &amp; Validation</Link></footer>
 </article>;
}

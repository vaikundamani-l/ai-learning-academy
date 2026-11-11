import { ReasoningChallenge } from '../../components/learning/ReasoningChallenge';
import { controlFlowReasoning } from '../../data/pythonReasoningChallenges';
import { useCallback, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Stage } from '../../types/curriculum';
import { LessonHeader } from '../../components/learning/LessonHeader';
import { LessonNotesDrawer } from '../../components/learning/LessonNotesDrawer';
import { CodeBlock } from '../../components/learning/CodeBlock';
import { ProgramTrace } from '../../components/learning/ProgramTrace';
import { AssessmentGate } from '../../components/learning/AssessmentGate';
import { controlFlowExamples, controlFlowPractice, controlFlowQuestions } from '../../data/pythonControlFlowContent';
import { decisionProgram, decisionTrace, sumProgram, sumTrace } from '../../utils/pythonControlFlow';

const sections = [
  ['goals', 'Start here'], ['compare', 'Compare values'], ['choose', 'Choose a branch'],
  ['repeat', 'Repeat with for'], ['while', 'Repeat with while'], ['lab', 'Trace explorer'],
  ['exits', 'Skip & stop'], ['build', 'Build a planner'], ['debug', 'Debug & test'],
  ['exercises', 'Practice'], ['reasoning', 'Explain the mechanism'], ['assessment', 'Knowledge check'],
];
function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="space-y-4 scroll-mt-24"><h2 className="text-2xl font-bold text-slate-100">{title}</h2>{children}</section>;
}
function Example({ index }: { index: number }) {
  const example = controlFlowExamples[index];
  return <div className="space-y-4 min-w-0">
    <CodeBlock title={example.title} code={example.code} />
    <p>{example.explanation}</p>
    <p className="font-semibold text-slate-100">Expected output{example.input ? ' with inputs 20 and 3 (typed input echo excluded)' : ''}</p>
    <pre className="overflow-x-auto p-4 rounded-xl bg-surface border border-surface-border text-cyber-emerald text-sm">{example.output}</pre>
  </div>;
}
function LoopDiagram() {
  return <figure className="p-4 border border-surface-border rounded-xl bg-surface-card">
    <svg viewBox="0 0 440 230" className="w-full max-w-2xl mx-auto" role="img" aria-labelledby="while-diagram-title while-diagram-desc">
      <title id="while-diagram-title">A while loop tests before running its body</title>
      <desc id="while-diagram-desc">Start at the test. True enters the body and updates state, then returns to the test. False exits to the next statement.</desc>
      <defs><marker id="while-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" /></marker></defs>
      <g className="text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#while-arrow)"><path d="M190 65 H270" /><path d="M110 95 V150" /><path d="M340 95 V120 H40 V65 H60" /></g>
      <g fill="rgb(var(--color-surface))" stroke="rgb(var(--color-cyber-sky))" strokeWidth="2"><rect x="60" y="35" width="130" height="60" rx="12" /><rect x="270" y="35" width="140" height="60" rx="12" /><rect x="60" y="150" width="130" height="60" rx="12" /></g>
      <g fill="rgb(var(--color-slate-100))" fontSize="16" textAnchor="middle"><text x="125" y="70">Test condition</text><text x="340" y="61">Body + update</text><text x="340" y="82" fontSize="12">then test again</text><text x="125" y="186">After loop</text></g>
      <g fill="rgb(var(--color-cyber-emerald))" fontSize="14"><text x="208" y="53">True</text><text x="120" y="130">False</text></g>
    </svg>
    <figcaption className="text-sm text-slate-400">Follow the condition each time around. A False initial test goes straight to the statement after the loop.</figcaption>
  </figure>;
}

export function PythonControlFlowLesson({ currentPath }: { stage: Stage; currentPath: string }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const closeNotes = useCallback(() => setNotesOpen(false), []);
  const [mode, setMode] = useState<'decision' | 'sum'>('decision');
  const [minutes, setMinutes] = useState(30);
  const [limit, setLimit] = useState(3);
  const [prediction, setPrediction] = useState('');
  const [checked, setChecked] = useState(false);
  const frames = mode === 'decision' ? decisionTrace(minutes) : sumTrace(limit);
  const code = mode === 'decision' ? decisionProgram(minutes) : sumProgram(limit);
  const expected = frames[frames.length - 1].output;
  const clearPrediction = () => { setPrediction(''); setChecked(false); };

  return <article className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10 text-slate-300 leading-relaxed min-w-0">
    <LessonHeader stageNumber={1} lessonIndex={2} totalLessons={0} estimatedReadTime="45–60 minutes" title="Decisions & Loops" currentPath={currentPath} onOpenNotes={() => setNotesOpen(true)} />
    <LessonNotesDrawer isOpen={notesOpen} onClose={closeNotes} lessonPath={currentPath} lessonTitle="Decisions & Loops" />
    <p className="text-lg">A useful program responds to its data. Teach your study planner to choose an action, repeat a calculation and explain when it stops.</p>
    <nav aria-label="Lesson sections" className="flex flex-wrap gap-2 text-sm">{sections.map(([id, title]) => <a key={id} className="px-3 py-2 rounded-lg border border-surface-border text-cyber-sky hover:bg-surface-card" href={`#${id}`}>{title}</a>)}</nav>

    <Section id="goals" title="1. What you will be able to do">
      <ul className="list-disc pl-6 space-y-2"><li>Compare values and explain which branch a program selects.</li><li>Trace the values supplied by range and build a running total.</li><li>Explain why a while loop stops, skips its body or runs indefinitely.</li><li>Build and test a study planner at valid and invalid boundaries.</li></ul>
      <p>Prerequisite: <Link className="text-cyber-sky underline" to="/stage/1/lesson/first-python-program">Your First Python Program</Link>. You should be able to run a .py file, assign a value, read input and convert integer text.</p>
      <details className="p-4 bg-surface-card border border-surface-border rounded-xl"><summary className="cursor-pointer text-cyber-sky">Readiness check: why does "20" + 7 fail?</summary><p className="mt-3">"20" is text, while 7 is an integer. Convert with int("20") before arithmetic. If that explanation is unfamiliar, revisit Lesson 1 before continuing.</p></details>
      <p>Writing a separate print for every day works for a three-day plan but becomes difficult to change for a month. Repetition expresses the rule once. A condition makes the same program respond to different input. These ideas appear across programming languages and grow into the algorithms you will study later.</p>
      <div className="grid sm:grid-cols-3 gap-3">{[['Sequence', 'Do instructions in order.'], ['Selection', 'Test a condition and choose a block.'], ['Iteration', 'Repeat a block over items or while a test is true.']].map(([term, text]) => <div key={term} className="p-4 rounded-xl bg-surface-card border border-surface-border"><h3 className="font-bold text-slate-100">{term}</h3><p className="text-sm mt-2">{text}</p></div>)}</div>
    </Section>

    <Section id="compare" title="2. Ask a question that produces True or False">
      <p>A comparison asks a question about values. Its result is a Boolean: True or False. A condition is an expression used to decide whether a block should run. A block is a group of statements at the same indentation level.</p>
      <p>Use == for equal, != for not equal, &lt; and &gt; for strict comparisons, and &lt;= or &gt;= to include the boundary. Assignment uses a single =; it gives a name a value.</p>
      <Example index={0} />
      <p>For Boolean conditions, and requires both sides, or accepts either side, and not reverses the result. Python checks the right side of and only if the left is true, and checks the right side of or only if the left is false. This is called short-circuit evaluation. We use explicit comparisons here; Python’s broader truth-value rules and value-returning Boolean expressions will come later.</p>
    </Section>

    <Section id="choose" title="3. Choose one branch with if, elif and else">
      <p>if tests the first possibility. elif means “otherwise, if” and is checked only when earlier conditions were false. else handles the remaining case without another condition. A colon starts each block; indent its body consistently with four spaces. Align elif and else with their if.</p>
      <Example index={1} />
      <p>At 30 minutes, both “at least 30” and “greater than 0” are true, but this chain chooses the first matching branch. Two separate if statements are different: both could run. Order specific cases before more general cases when overlap matters.</p>
    </Section>

    <Section id="repeat" title="4. Repeat over values with for and range">
      <p>An iteration is one pass through a loop body. An iterable supplies items to a for loop; range is our first example. range(start, stop) includes start and excludes stop. range(stop) starts at 0; range(start, stop, step) lets you change the increment.</p>
      <Example index={2} />
      <p>range(1, 1) supplies no items. range(3, 0, -1) supplies 3, 2, 1. A step of zero raises ValueError. A positive step cannot count toward a smaller stop: range(3, 0) is empty.</p>
      <p>To add values, use an accumulator: a name holding the result so far. Start total at 0 before the loop, then update total = total + number for every item. For 1, 2, 3, the successive totals are 1, 3, 6. To derive a check, write 1 + 2 + … + n forwards and n + … + 2 + 1 backwards. Each of the n aligned pairs sums to n + 1, so twice the original sum is n(n + 1). Divide by two: the sum is n(n + 1)/2. At n = 3 this gives 3 × 4 / 2 = 6; at n = 0 the empty sum is 0.</p>
    </Section>

    <Section id="while" title="5. Repeat while a condition stays true">
      <p>Use for when consuming a known iterable. Use while when a condition determines whether another pass is needed. A while loop checks before the first pass and again after each completed pass.</p>
      <Example index={3} />
      <LoopDiagram />
      <p>Removing the subtraction makes remaining stay 3 forever, so the condition never becomes False. If you deliberately try that experiment in your terminal, interrupt it with Ctrl+C. In this countdown, remaining is a nonnegative integer that decreases by one each pass, so it must eventually reach zero.</p>
    </Section>

    <Section id="lab" title="6. Predict, run the trace, explain the result">
      <p>Choose a program, change its input, and predict the final output. Step forward to inspect each decision. Playback and the scrubber let you replay a point without rerunning a real interpreter.</p>
      <div className="p-4 sm:p-5 space-y-5 rounded-2xl border border-cyber-sky/30 bg-surface-card min-w-0">
        <div className="flex flex-wrap gap-3" role="group" aria-label="Choose trace program">
          <button className={`px-4 py-3 rounded-lg border ${mode === 'decision' ? 'border-cyber-sky text-cyber-sky bg-cyber-sky/10' : 'border-surface-border'}`} aria-pressed={mode === 'decision'} onClick={() => { setMode('decision'); clearPrediction(); }}>Choose a branch</button>
          <button className={`px-4 py-3 rounded-lg border ${mode === 'sum' ? 'border-cyber-sky text-cyber-sky bg-cyber-sky/10' : 'border-surface-border'}`} aria-pressed={mode === 'sum'} onClick={() => { setMode('sum'); clearPrediction(); }}>Build a running sum</button>
        </div>
        {mode === 'decision' ? <label className="block font-semibold text-slate-100">Minutes to study: {minutes}<input className="block w-full mt-4 accent-cyber-sky" aria-label="Minutes to study" type="range" min="0" max="60" value={minutes} onChange={e => { setMinutes(Number(e.target.value)); clearPrediction(); }} /></label> : <label className="block font-semibold text-slate-100">Add the numbers 1 through: {limit}<input className="block w-full mt-4 accent-cyber-sky" aria-label="Sum limit" type="range" min="0" max="8" value={limit} onChange={e => { setLimit(Number(e.target.value)); clearPrediction(); }} /></label>}
        <p className="text-sm">{mode === 'decision' ? 'Try 0, 1, 29 and 30. Where does the chosen branch change?' : 'Try 0, 1 and 3. With 0, range(1, 1) is empty and the initial total survives.'}</p>
        <div className="flex flex-wrap items-end gap-3"><label className="block flex-1 basis-48 min-w-0">Predict the final output<input className="block w-full mt-2 p-3 rounded-lg border border-surface-border bg-surface" value={prediction} onChange={e => { setPrediction(e.target.value); setChecked(false); }} /></label><button className="px-4 py-3 border border-surface-border rounded-lg text-cyber-sky" onClick={() => setChecked(true)}>Check prediction</button></div>
        {checked && <p role="status" className="text-cyber-sky">{prediction.trim() === expected ? `Correct. The output is ${expected}.` : `The output is ${expected}. Follow the trace to explain how the program reaches it.`}</p>}
        <ProgramTrace key={`${mode}-${minutes}-${limit}`} title={mode === 'decision' ? 'branch_trace.py' : 'sum_trace.py'} code={code} frames={frames} />
      </div>
    </Section>

    <Section id="exits" title="7. Skip a pass or leave the loop">
      <p>continue skips the remainder of the current iteration. In a for loop, the next item is requested; in a while loop, the condition is tested again. break leaves the innermost loop immediately. Neither keyword by itself ends the entire program.</p>
      <Example index={4} />
      <p>Be careful with continue in a while loop: if it skips the only update, the loop can repeat the same state indefinitely. Keep the exit condition and progress step easy to inspect. Nested loops, loop else clauses and early returns come after functions.</p>
    </Section>

    <Section id="build" title="8. Build a weekly study planner from the rules">
      <p>Start with a contract: accept integer minutes from 0 through 1440 and days from 0 through 7. Reject numeric values outside those ranges. For valid values, display each day’s cumulative minutes, then the weekly total. Zero days must produce no day lines and a final total of zero.</p>
      <Example index={5} />
      <ol className="list-decimal pl-6 space-y-2"><li>Read and convert the two inputs; each has a distinct name.</li><li>Check invalid ranges before starting any work. One failed comparison is enough to reject the input.</li><li>Initialize total once inside the valid branch, before the loop.</li><li>For each day, add minutes and print the new accumulated value.</li><li>Dedent the final print to leave the loop while staying in the valid branch.</li></ol>
      <p>For a constant number of minutes per day, multiplication is the simpler way to get only the final total. The loop is useful when you also want each day’s cumulative result, or later when each day has a different value. After k days, total equals k × minutes: the starting value satisfies this at k = 0, and every addition maintains it. This is a loop invariant, a statement that stays true at each corresponding point in the loop.</p>
      <p>Production systems also handle malformed input, record errors and test failure paths. This small planner handles integer range rules; exception handling and reusable functions are upcoming topics. Adding days performs one update per day; the accumulator uses a fixed number of names. range supplies successive values without constructing a whole list.</p>
    </Section>

    <Section id="debug" title="9. Diagnose the mechanism, then test the boundary">
      <div className="overflow-x-auto rounded-xl border border-surface-border"><table className="w-full text-left text-sm"><thead className="bg-surface-card"><tr><th className="p-3">Symptom</th><th className="p-3">Check and repair</th></tr></thead><tbody>{[
        ['SyntaxError near an if or for', 'Check for a missing colon and the expression before it.'],
        ['IndentationError or the wrong lines repeat', 'Use consistent indentation. The body is indented; statements after it are dedented.'],
        ['The last intended number is missing', 'range excludes stop. Include n by using a stop of n + 1 for a positive unit step.'],
        ['The final sum equals only the last number', 'Look for total = 0 inside the loop; initialize once before repetition.'],
        ['The loop never stops', 'Check whether every possible path makes progress or exits. Interrupt a terminal experiment with Ctrl+C.'],
        ['Text "0" is accepted as a nonzero value', 'Input is text. Convert to a number before numeric comparisons; avoid relying on string truthiness.'],
      ].map(([symptom, fix]) => <tr key={symptom} className="border-t border-surface-border"><td className="p-3 align-top">{symptom}</td><td className="p-3">{fix}</td></tr>)}</tbody></table></div>
      <p>Test no work, one pass, several passes, an exact boundary and values just outside it. For days, use -1, 0, 1, 7, 8. Write down expected output before running the program. A successful typical example cannot tell you whether both boundaries are correct.</p>
    </Section>

    <Section id="exercises" title="10. Practice with decreasing support">
      {controlFlowPractice.map(({ title, task, hint }) => <div key={title} className="p-5 space-y-3 rounded-xl bg-surface-card border border-surface-border"><h3 className="font-semibold text-slate-100">{title}</h3><p>{task}</p><details><summary className="cursor-pointer py-2 text-cyber-sky">Reveal guidance after trying</summary><p className="mt-3">{hint}</p></details></div>)}
      <p>Before moving on, explain which line updates the state, why repetition ends, what happens with zero days, and why resetting an accumulator in the body loses previous work. Complete the planner from a blank file and keep your test results alongside it.</p>
    </Section>
    <section id="reasoning" className="space-y-6 scroll-mt-24"><h2 className="text-2xl font-bold text-slate-100">Explain the mechanism: predict, compare, transfer</h2><p>Knowing the final number is one part of understanding. Explain which operation produces it, then change the program and check whether your explanation still holds.</p>{controlFlowReasoning.map(challenge => <ReasoningChallenge key={challenge.id} challenge={challenge} />)}</section>
    <AssessmentGate key={currentPath} currentPath={currentPath} lessonTitle="Decisions & Loops" sectionNumber={11} questions={controlFlowQuestions} />
    <footer className="border-t border-surface-border pt-6 space-y-3 text-sm">
      <p>The quiz records a knowledge check; your independently written and tested planner provides practical evidence. Stage 1 also requires functions, collections, files and more.</p>
      <Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-functions">Continue to Lesson 3: Functions &amp; Return Values →</Link>
      <p>Primary references: <a className="text-cyber-sky underline" href="https://docs.python.org/3/tutorial/controlflow.html">Python control-flow tutorial</a> and <a className="text-cyber-sky underline" href="https://docs.python.org/3/reference/compound_stmts.html">Python statement reference</a>.</p>
      <Link className="inline-flex items-center min-h-11 text-cyber-sky underline" to="/stage/1/lesson/first-python-program">← Review Lesson 1</Link>
    </footer>
  </article>;
}

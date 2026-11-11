import { useCallback, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Stage } from '../../types/curriculum';
import { LessonHeader } from '../../components/learning/LessonHeader';
import { LessonNotesDrawer } from '../../components/learning/LessonNotesDrawer';
import { CodeBlock } from '../../components/learning/CodeBlock';
import { AssessmentGate } from '../../components/learning/AssessmentGate';
import { ReasoningChallenge } from '../../components/learning/ReasoningChallenge';
import { CollectionSharingLab } from '../../components/visual/python/CollectionSharingLab';
import { collectionExamples, collectionQuestions, appendReasoning } from '../../data/pythonCollectionsContent';
const sections=[['purpose','Choose a structure'],['lists','Lists'],['tuples','Tuples'],['dicts','Dictionaries'],['sets','Sets'],['sharing','Sharing & copying'],['build','Count from scratch'],['exercises','Practice'],['assessment','Knowledge check']];
function Section({id,title,children}:{id:string;title:string;children:ReactNode}) {return <section id={id} className="space-y-4 scroll-mt-24"><h2 className="text-2xl font-bold text-slate-100">{title}</h2>{children}</section>;}
function Example({index}:{index:number}) {const e=collectionExamples[index];return <div className="space-y-4 min-w-0"><CodeBlock title={e.title} code={e.code}/><p>{e.explanation}</p><p className="font-semibold text-slate-100">Verified output</p><pre className="p-4 overflow-x-auto rounded-xl bg-surface border border-surface-border text-cyber-emerald text-sm">{e.output}</pre></div>;}
export function PythonCollectionsLesson({currentPath}:{stage:Stage;currentPath:string}) {
 const [notesOpen,setNotesOpen]=useState(false);const closeNotes=useCallback(()=>setNotesOpen(false),[]);
 return <article className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10 text-slate-300 leading-relaxed min-w-0">
 <LessonHeader stageNumber={1} lessonIndex={4} totalLessons={0} estimatedReadTime="60–75 minutes" title="Collections, Lookup & Shared State" currentPath={currentPath} onOpenNotes={()=>setNotesOpen(true)}/>
 <LessonNotesDrawer isOpen={notesOpen} onClose={closeNotes} lessonPath={currentPath} lessonTitle="Collections, Lookup & Shared State"/>
 <p className="text-lg">Move from individual values to groups of data. Choose the structure by the questions your program must answer, then trace which objects a change actually affects.</p>
 <nav aria-label="Lesson sections" className="flex flex-wrap gap-2">{sections.map(([id,title])=><a key={id} href={`#${id}`} className="min-h-11 p-3 border border-surface-border rounded-lg text-cyber-sky text-sm">{title}</a>)}</nav>
 <Section id="purpose" title="1. Start with the question, then choose the collection">
 <p>Prerequisite: <Link className="text-cyber-sky underline" to="/stage/1/lesson/python-functions">Functions, Parameters &amp; Return Values</Link>. You should be able to trace a loop, pass values to a function and distinguish a returned value from a printed result.</p>
 <ul className="list-disc pl-6 space-y-2"><li>Choose a list, tuple, dictionary or set from concrete data requirements.</li><li>Read, update and iterate over small collections while explaining boundary cases.</li><li>Distinguish rebinding a name from changing a shared object.</li><li>Build and test a frequency counter without changing its input.</li></ul>
 <p>Names such as reading1, reading2 and reading3 make a program depend on how many readings exist. A collection lets one name hold a group whose size can change. An item is one contained value; an index identifies a position; a key identifies an entry in a mapping. A method is a named operation accessed through an object, such as history.append(40).</p>
 <div className="overflow-x-auto rounded-xl border border-surface-border"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">Question</th><th className="p-3">Structure</th><th className="p-3">What it preserves</th></tr></thead><tbody>{[
 ['What happened first, next and last?','list','Item order and duplicates; items can change.'],
 ['Which values form this fixed record?','tuple','Ordered item references that cannot be replaced in place.'],
 ['What value belongs to this name?','dict','Unique keys mapped to values.'],
 ['Have I seen this member before?','set','Distinct members; no positional indexing.'],
 ].map(([question,type,meaning])=><tr key={type} className="border-t border-surface-border"><td className="p-3">{question}</td><td className="p-3 font-mono">{type}</td><td className="p-3">{meaning}</td></tr>)}</tbody></table></div>
 <p>Do not select a set for a history if duplicate readings or their original order matter. Do not build parallel lists of names and values when a direct key-to-value relationship is the actual requirement. Different structures express different promises about the data.</p>
 </Section>
 <Section id="lists" title="2. Lists: positions, changes and boundaries">
 <p>Square brackets create a list. For a nonempty list of length n, ordinary nonnegative indices run from 0 through n − 1. Negative indices count from the end: -1 is the last item. A slice selects a range and excludes its stop, just like range in the earlier lesson.</p>
 <Example index={0}/>
 <p>After the updates, index 1 means 35. It is a position, not a permanent identifier for that value. Reading history[4] now raises IndexError because only indices 0 through 3 exist. In contrast, history[4:99] gives an empty list: slice bounds are clipped. An empty list has length zero, and reading its first or last item also raises IndexError.</p>
 <p>append changes the object; it does not return a new list. pop() removes and returns the last item and fails on an empty list. remove(value) removes the first matching item and raises ValueError when absent. Distinguish an index from a value before choosing an operation.</p>
 <ReasoningChallenge challenge={appendReasoning}/>
 </Section>
 <Section id="tuples" title="3. Tuples: a fixed record is not deep immutability">
 <p>A tuple is an ordered sequence whose item references cannot be replaced in place. It is useful for a small record with a stable shape. The comma creates the tuple; parentheses usually make the grouping easier to read.</p>
 <Example index={1}/>
 <p>Attempting session[1] = 30 raises TypeError. Rebinding session to a different tuple is still allowed: an immutable object does not make a variable name permanent. A tuple can contain a list, and that contained list can change. Immutability of the outer tuple is therefore not a promise about every reachable object.</p>
 <p>Unpacking a two-item record into three names raises ValueError in this simple form. For large records, many numeric positions become hard to understand; named representations will follow when we introduce classes.</p>
 </Section>
 <Section id="dicts" title="4. Dictionaries: keys identify values">
 <p>A mapping associates a key with a value. The dictionary expression uses braces and colon-separated key/value entries. Unlike a list index, a key can describe what the value means. Updating one key does not create a second entry with the same key.</p>
 <Example index={2}/>
 <p>Directly reading minutes["Friday"] raises KeyError when Friday is absent. get("Friday", 0) instead treats missing as zero by our chosen policy. This is appropriate only when absence really means zero: a measurement system may need to distinguish “not recorded” from a genuine zero. Membership can make that distinction explicit.</p>
 <p>Dictionary keys and set members must be hashable: they must support a stable hash and compatible equality while stored. Strings and integers work here; mutable lists do not. A tuple is usable as a key only if its contained items are hashable as well. Internal hash tables, collision handling and performance analysis belong to later data-structure lessons; no operation is promised universally constant time here.</p>
 <p>Looping over a dictionary directly supplies keys. items() supplies key/value pairs. In modern Python, iteration follows insertion order; it does not sort the keys. Avoid adding or deleting dictionary entries while iterating over that same dictionary.</p>
 </Section>
 <Section id="sets" title="5. Sets: membership and uniqueness">
 <p>A set answers membership questions without preserving duplicate occurrences. With three names cpu, ram, cpu, there are three observations but only two distinct topics. The distinction matters when you choose between counting observations and finding unique labels.</p>
 <Example index={3}/>
 <p>There is no topics[0]: a set has no positional indexing. Repeatedly adding an existing member leaves its membership unchanged. Sets support union (members in either set), intersection (members in both) and difference (members only in the first); use these ideas when comparing inventories rather than reconstructing an ordered history.</p>
 <p>Sorting is a presentation choice in this example, not a hidden property of sets. All our members are strings and comparable. Mixed values such as strings and integers do not necessarily support a common sort order.</p>
 </Section>
 <Section id="sharing" title="6. Trace names, objects and copies separately">
 <p>A mutable object can change while its identity remains the same. Assignment binds a name to an object; it does not copy the object. An alias is another name reaching the same object. This is why a function can mutate a passed list even though rebinding an integer parameter did not change the caller’s name in Lesson 3.</p>
 <CollectionSharingLab/>
 <p>Changing other to a different list is rebinding. Calling other.append(...) mutates the object currently reached through other. Ask “which object does this operation reach?” before predicting whether original changes.</p>
 <Example index={4}/>
 <p>A shallow copy creates a new outer container with references to the same contained objects. Our first lab uses integers, so appending at the outer level gives simple independence in copy mode. Nested lists expose the limit: changing a shared inner object is still visible through either outer list. Recursive copying is a separate tool, not an automatic fix for every design; decide what should be shared before copying a whole object graph.</p>
 </Section>
 <Section id="build" title="7. Build a frequency counter from the mechanism">
 <p>Contract: accept a list of topic-name strings, treat spelling and case exactly, return a dictionary of positive occurrence counts, and leave the input list unchanged. Empty input returns an empty dictionary. No normalization or arbitrary-object support is claimed.</p>
 <Example index={5}/>
 <ol className="list-decimal pl-6 space-y-2"><li>Create counts once, before the loop.</li><li>Read the next topic from the input list.</li><li>Use its existing count, or zero for a first occurrence.</li><li>Add one and store under that same key.</li><li>After all observations, return the mapping.</li></ol>
 <p>The invariant is: after each completed iteration, counts records the frequencies of all observations processed so far. Start with no observations and no entries. Each new observation increases exactly one count by one, so the sum of all counts equals the number of processed observations. At the end, cpu: 2 plus ram: 1 accounts for all three inputs.</p>
 <p>A production log summary uses this same idea but also needs parsing, malformed-input handling, normalization rules and resource limits. This function is the counting core. Repeatedly rebuilding the mapping inside the loop would discard earlier counts; modifying the input during iteration could also change which observations are processed.</p>
 </Section>
 <Section id="exercises" title="8. Predict, diagnose and transfer">
 {[
 ['Choose and explain','A sensor emits 20, 20, 30 in that order. Which structure preserves all observations? Which finds distinct readings? Explain what information is lost when switching representations.','A list preserves [20, 20, 30]. A set keeps distinct values 20 and 30, discarding repetition and an order guarantee. A dictionary of frequencies can preserve counts but does not encode the original sequence.'],
 ['Repair the count','Move counts = {} into the loop in the worked counter. Predict the result for ["cpu", "ram", "cpu"], run it, then restore the invariant. Also test the empty input path.','With initialization only in the body, the final mapping is {"cpu": 1}, and empty input leaves counts unassigned before return. Initialization belongs before the loop so both empty and nonempty cases have the correct state.'],
 ['Transfer: stock without changing the request','Implement missing_items(requested, available) for a list of requested name strings and a set of available strings. Return a new list of unavailable requests, preserving their order and duplicates. Do not modify either input. Test ["pen", "pad", "pen"] against {"pad"}, then empty requests, then everything available. Explain why returning a set violates the contract.','Create an empty result list, loop over requested, and append a name only when it is not in available. The operator not in tests for absence. Return ["pen", "pen"] for the first case and [] for the other two. Keep the repeated request: membership in stock does not mean duplicate requests may be discarded.'],
 ].map(([title,task,hint])=><div key={title} className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-3"><h3 className="font-semibold text-slate-100">{title}</h3><p>{task}</p><details><summary className="cursor-pointer py-2 text-cyber-sky">Reveal guidance after trying</summary><p>{hint}</p></details></div>)}
 <p>Readiness evidence: justify a collection choice, trace an alias and a shallow copy, diagnose an absent key versus an absent position, and independently implement missing_items with tests that verify unchanged inputs. The quiz checks knowledge; that practical work checks transfer.</p>
 </Section>
 <AssessmentGate currentPath={currentPath} lessonTitle="Collections, Lookup & Shared State" sectionNumber={9} questions={collectionQuestions}/>
 <footer className="border-t border-surface-border pt-6 space-y-3 text-sm"><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-exceptions">Continue to Lesson 5: Exceptions &amp; Validation →</Link><p>Primary references: <a className="text-cyber-sky underline" href="https://docs.python.org/3/tutorial/datastructures.html">Python data structures</a> and <a className="text-cyber-sky underline" href="https://docs.python.org/3/library/copy.html">assignment, shallow copying and deep copying</a>.</p><Link className="inline-flex min-h-11 items-center text-cyber-sky underline" to="/stage/1/lesson/python-functions">← Review Functions &amp; Return Values</Link></footer>
 </article>;
}

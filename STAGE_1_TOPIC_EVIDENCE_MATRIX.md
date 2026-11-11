# Stage 1 topic-to-evidence readiness review

Updated 11 November 2026 (initial inventory: 10 November 2026) against CURRICULUM_MASTER.md. This is an implementation/evidence inventory with a targeted gap review, not a new line-by-line recertification of every earlier lesson or proof of learner mastery. Earlier detailed teaching reviews live in PYTHON_TEACHING_REVIEW.md. The current full regression run executes 239 academy checks with zero failures/skips using the recorded optional tool directories.

## Original roadmap topics

Paths below are relative to the project root. Each named test file ran in the current full suite. “Reference evidence” means implementation/example verification; independent learner transfer remains a separate requirement.

| Required topic | Teaching implementation / reference evidence | Current limit / readiness action |
|---|---|---|
| Types, variables, control flow, functions | Lessons 1–3: PythonFirstProgramLesson.tsx, PythonControlFlowLesson.tsx, PythonFunctionsLesson.tsx; tests/python-first-program.test.mjs, python-control-flow.test.mjs, python-functions.test.mjs | Ask learner to explain name binding, branch/loop paths and return values on a new problem. |
| Lists, dictionaries, sets, tuples, iterators | Lessons 4 and 12: PythonCollectionsLesson.tsx, PythonIterationLesson.tsx; python-collections.test.mjs and python-iteration.test.mjs | Reference/cursor models are bounded teaching models; require independent mutation/exhaustion predictions. |
| Mutability, references, scope, exceptions | Lessons 3–5 and 12; python-functions.test.mjs, python-collections.test.mjs, python-exceptions.test.mjs, python-iteration.test.mjs | Core-language examples plus Lesson 20 explicitly separate drawn edges from controlled CPython observations; no exact universal counts are claimed. |
| Modules, packages, environments, dependencies | Lesson 6: PythonModulesLesson.tsx; python-modules.test.mjs; optional tool setup folders | Local execution and a fresh combined temporary tool installation are verified; fresh venv and Windows/macOS setup remain unverified. |
| Classes and composition | Lesson 9: PythonClassesLesson.tsx; python-classes.test.mjs | Budget/stock invariant examples verified; learner must build a different composition with failure behavior. |
| Type hints, logging, testing, profiling, debugging | Lessons 10, 11 and 17; python-testing.test.mjs, python-typing-profiling.test.mjs, python-pytest.test.mjs | Current run includes actual mypy/Pydantic/pytest/coverage tools; profiling measurements are workload-specific and coverage is execution evidence, not correctness proof. |
| Files, CSV, JSON, regular expressions, HTTP requests | Lessons 7, 8, 13, 14 and 19; python-files.test.mjs, python-structured-data.test.mjs, python-regex.test.mjs, python-http.test.mjs, python-capstone.test.mjs | Restricted grammars and loopback fixtures have explicit limits; no arbitrary internet endpoint or broad HTTP conformance claim. |
| Async programming and concurrency fundamentals | Lessons 15 and 16; python-concurrency.test.mjs, python-lifetime.test.mjs | Actual threads/tasks/spawn workers and cancellation tested; no universal performance winner or production scheduling claim. |

Lesson pages live under src/pages/lessons. Supporting model/source/test mappings are detailed in each teaching review entry.

## Expanded supporting subtopics

| Subtopic | Evidence | Status |
|---|---|---|
| Shallow/deep copies, id(), CPython reference counting and garbage collection | Lesson 20: reviewed PythonBasicsLesson.tsx; corrected pythonMemory.ts / PythonMemoryVisualizer.tsx; examples/stage-1-cpython/{inspect_references.py,copy_graphs.py,collect_cycle.py}; python-cpython.test.mjs | **Known correction gap resolved for the stated scope.** Synthetic labels/visible edge counts replace literal-address/count claims. Controlled ordinary-list deltas, immutable reuse, repeated-reference memo behavior and weakly observed cyclic collection verified on CPython 3.12.3. Custom finalization/resurrection/other builds are excluded explicitly. |
| Bytecode and execution under CPython VM | Lesson 20 and examples/stage-1-cpython/inspect_bytecode.py; BytecodeEvidenceLab.tsx; python-cpython.test.mjs | **Accepted bounded executable evidence added.** Actual nonadaptive 3.12 instructions and dis.stack_effect match both input replays; unsupported versions fail explicitly. No universal opcode/offset/native-CPU timing contract. |
| Decorators, generators, context managers | Lessons 12 and 16; python-iteration.test.mjs / python-lifetime.test.mjs | Reference examples verified, including deferred execution, failure ownership and async cleanup; independent transfer still required. |
| mypy and runtime Pydantic validation | Lesson 11 and examples/stage-1-typing-tools; python-typing-profiling.test.mjs | Actual tool checks ran, zero skips; version-specific setup/behavior and cross-platform limits documented. |
| pytest, assertions, fixtures and coverage | Lesson 17 and examples/stage-1-pytest; python-pytest.test.mjs | Actual tools verified; full-coverage surviving defect demonstrates why independent boundary assertions matter. |
| Threads, processes, asyncio and GIL constraints | Lesson 15; python-concurrency.test.mjs | Real spawn execution/task cleanup verified; GIL statements remain build/version qualified. |

The preserved advanced draft has been replaced by the focused reviewed Lesson 20 after its prerequisites. Repeated beginner scope/iterator/exception material stays in earlier dedicated lessons instead of being recertified through a large duplicated draft. Official Python 3.12 object, copy, sys, reference-count, gc, weakref and dis documentation informed the corrections. This does not certify other builds or all CPython internals.

## Scratch builds and stage project

| Required artifact | Implementation | Verification / limits |
|---|---|---|
| Deliberately limited CSV parser | Lesson 8, src/utils/limitedCsvTrace.ts and python-structured-data.test.mjs | Limited ASCII grammar/model compared with Python examples; not substituted for full standard CSV in the capstone. |
| Command-line task manager | examples/stage-1-task-manager; Lesson 18; python-task-manager.test.mjs | Actual files/subprocesses and fault injection; single writer, explicit crash/retry/metadata limits. |
| Log parser and summary generator | Lesson 13 / pythonRegexContent.ts; python-regex.test.mjs | Real local commands, fixed grammar, bounded file reads and complete-report behavior. |
| Simple socket HTTP client after networking basics | Lesson 14 / pythonHttpContent.ts; python-http.test.mjs | Actual loopback sockets, partition/framing/deadline checks; deliberately restricted protocol scope. |
| Tested data-processing application with useful errors and CLI | examples/stage-1-data-report; Lesson 19; python-capstone.test.mjs | Eleven shipped unittest methods plus 16 academy checks; actual local files, HTTP fixtures, schema/limit/error behavior and all ten replay/price combinations. |

## Stage mastery check: reference paths versus learner evidence

| Required behavior | Reference evidence now implemented | Independent evidence still required |
|---|---|---|
| Handle malformed files | Strict JSON duplicate/type/schema rejection; malformed UTF-8/CSV/header/record tests | Learner creates a malformed later record, diagnoses it and preserves inputs without a misleading total. |
| Handle missing values | Blank product/quantity and nonempty-data rules, physical-line diagnostics | Learner explains missing versus valid zero in the warehouse transfer and tests both. |
| Handle failed requests | Actual HTTP 503/302/refused connection, truncated/framing/media rejection; controlled timeout injection | Learner handles a failed local request without silently substituting old/invented catalog data. Slow-peer total-deadline behavior is not claimed by this capstone. |
| Handle unexpected inputs without silently incorrect results | Exact types, unknown products, 64 KiB/1000-row/100-product bounds; no success stdout before complete report | Learner submits independent code, hand-derived totals, boundary/failure tests and an explanation of stdout delivery/redirection limits. |

## Advancement decision

**Known reference-content blockers from this inventory are resolved for the documented teaching scope.** Twenty lessons, four scratch builds and the tested data-processing reference capstone are available. Current regression: 239/239, zero skips, with pinned optional tools restored in /tmp/academy-cpython-tools. This count reflects replacing two obsolete draft-content checks with one revised quiz check and adding eighteen behavior-focused CPython checks; it is not a percentage or mastery score.

Stage 2 foundation development may begin next. Learner readiness is a separate decision: require the independent capstone/transfer artifacts and explanations above before awarding mastery. No learner submission or sign-off was assessed during implementation. Broader platform/browser verification and independent teaching evaluation remain open. This inventory plus targeted corrections is not a new line-by-line recertification of every existing lesson. Phase 5 curriculum rollout continues; do not hold all future development indefinitely on the absence of a learner submission or claim mastery on that learner's behalf.

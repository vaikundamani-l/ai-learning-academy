import type {ProgramFrame} from '../components/learning/ProgramTrace';
export type BudgetVersion='correct'|'strict'|'unguarded';
export type TestSelection='ordinary'|'boundaries';
export function budgetTestModel(version:BudgetVersion,selection:TestSelection){
 if(!['correct','strict','unguarded'].includes(version)||!['ordinary','boundaries'].includes(selection))throw new RangeError('Choose a supported implementation and test selection.');
 const names=selection==='ordinary'?['test_ordinary']:['test_ordinary','test_exact_limit','test_over_limit','test_zero'];
 const results=names.map(name=>({name,status:version==='strict'&&['test_exact_limit','test_zero'].includes(name)?'ERROR':version==='unguarded'&&name==='test_over_limit'?'FAILURE':'PASS'}));
 const failures=results.filter(r=>r.status==='FAILURE').length;const errors=results.filter(r=>r.status==='ERROR').length;
 const success=!failures&&!errors;
 const code=`import io\nimport unittest\nfrom test_budget import BudgetTests\nnames = ${JSON.stringify(names)}\nsuite = unittest.TestSuite(BudgetTests(name) for name in names)\nreport = io.StringIO()\nrunner = unittest.TextTestRunner(stream=report)\nresult = runner.run(suite)\nprint("Run:", result.testsRun)\nprint("Failures:", len(result.failures))\nprint("Errors:", len(result.errors))\nprint("Successful:", result.wasSuccessful())`;
 const frames:ProgramFrame[]=[{line:5,names:`Selected ${names.length} tests; no results yet`,output:'',explanation:'Build a suite from the selected test names. Every test creates its own Budget; no test relies on another test’s state.'}];
 for(const result of results){const detail=result.status==='PASS'?'The selected assertions completed successfully. This is evidence for this case, not all possible behavior.':result.status==='ERROR'?'The implementation unexpectedly raises ValueError while a valid exact-limit action should succeed. The test errors before its final assertion.':'The over-limit call returns without the required ValueError. assertRaises reports a failed assertion.';frames.push({line:8,names:`${result.name} → ${result.status}`,output:'',explanation:detail});}
 let output='';const summaries=[`Run: ${names.length}`,`Failures: ${failures}`,`Errors: ${errors}`,`Successful: ${success?'True':'False'}`];
 summaries.forEach((summary,index)=>{output+=(output?'\n':'')+summary;frames.push({line:9+index,names:`Results: ${names.length-failures-errors} passed; ${failures} failure${failures===1?'':'s'}; ${errors} error${errors===1?'':'s'}`,output,explanation:index===3?(success?'The chosen suite passed. Check whether these inputs could distinguish the suspected defect.':'The suite detected a problem. Read the failing/erroring case and repair the implementation against the contract.'):'Print a deterministic summary of the actual runner result. The framework’s timing-dependent report is captured separately.'});});
 return{code,frames,results,success,failures,errors};
}

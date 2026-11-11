import type { ProgramFrame } from '../components/learning/ProgramTrace';
export function importTraceModel(mode:'import'|'script') {
 if(!['import','script'].includes(mode)) throw new RangeError('Choose import or script mode.');
 const helper='print("Initializing totals")\n\ndef weekly_minutes(minutes, days):\n    return minutes * days\n\nif __name__ == "__main__":\n    print("Demo:", weekly_minutes(20, 7))';
 const app='import totals\nimport totals\nprint("App:", totals.weekly_minutes(30, 5))';
 const initial='Initializing totals';
 const frames:ProgramFrame[]=mode==='script'?[
  {line:1,names:'Active script: __name__ → "__main__"',output:initial,explanation:'Run totals.py as the entry script. Its top-level print executes.'},
  {line:3,names:'weekly_minutes → function; __name__ → "__main__"',output:initial,explanation:'Define the function. Its body has not run yet.'},
  {line:6,names:'__name__ == "__main__" → True',output:initial,explanation:'The entry script’s guard matches, so its demo is selected.'},
  {line:7,names:'Demo call: minutes → 20; days → 7; return → 140',output:initial+'\nDemo: 140',explanation:'The demo calls the function and prints 140. It did not prevent the earlier initialization print.'},
 ]:[
  {line:1,names:'app waits; totals begins initialization',output:'',explanation:'In a fresh process, no totals module is cached yet. Import begins initializing it.'},
  {line:1,names:'totals: __name__ → "totals"; weekly_minutes → function',output:initial,explanation:'The helper’s top-level print executes and def binds its function. The main guard is False, so the demo is skipped. The highlighted app import waits for this initialization to finish.'},
  {line:1,names:'app: totals → initialized module; cache contains totals',output:initial,explanation:'Import completes and binds the module in app. The helper is ready for reuse.'},
  {line:2,names:'app: totals → same cached module',output:initial,explanation:'The second import reuses the cache. It does not print initialization again.'},
  {line:3,names:'App call: minutes → 30; days → 5; return → 150',output:initial+'\nApp: 150',explanation:'Call through the module namespace and print the returned 150. Function-call internals are summarized here.'},
 ];
 return {code:mode==='script'?helper:app,helper,frames};
}

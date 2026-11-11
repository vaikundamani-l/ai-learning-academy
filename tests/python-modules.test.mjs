import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {moduleExamples,moduleReasoning,moduleQuestions,environmentProbe,requirementsExample} from '../src/data/pythonModulesContent.ts';
import {importTraceModel} from '../src/utils/pythonImportTrace.ts';
function workspace(files,work){const dir=mkdtempSync(join(tmpdir(),'academy-modules-'));try{for(const [file,code]of Object.entries(files)){const path=join(dir,file);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,code);}return work(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const run=(dir,args,python='python3')=>execFileSync(python,args,{cwd:dir,encoding:'utf8',timeout:30000,env:{...process.env,PYTHONPATH:''}}).trim();
test('multi-file examples and separate caller checks execute in clean workspaces',()=>{
 for(const e of moduleExamples) workspace(e.files,dir=>{assert.equal(run(dir,e.module?['-m',e.entry]:[e.entry]),e.output,e.title);if(e.files['check_totals.py'])assert.equal(run(dir,['check_totals.py']),'Checks passed');});
 workspace(moduleExamples[2].files,dir=>assert.equal(run(dir,['totals.py']),'Demo: 140'));
});
test('import explorer agrees with real fresh Python processes and cache behavior',()=>{
 for(const mode of ['import','script']){const model=importTraceModel(mode);workspace({'totals.py':model.helper,'app.py':mode==='import'?model.code:''},dir=>assert.equal(run(dir,[mode==='import'?'app.py':'totals.py']),model.frames.at(-1).output));assert.deepEqual(model,importTraceModel(mode));}
 const frames=importTraceModel('import').frames;assert.equal(frames[1].output,frames[3].output);assert.throws(()=>importTraceModel('reload'),RangeError);
});
test('reasoning variants produce their documented output',()=>{for(const e of moduleReasoning.variants)assert.equal(execFileSync('python3',['-c',e.code],{encoding:'utf8'}).trim(),e.output);});
test('package context and shadowing failures are observable without reinstalling',()=>{
 workspace(moduleExamples[3].files,dir=>{const out=spawnSync('python3',['study/__main__.py'],{cwd:dir,encoding:'utf8'});assert.notEqual(out.status,0);assert.match(out.stderr,/relative import/);});
 workspace({'json.py':'marker = "local source"\n','app.py':'import json\nprint(json.marker)\nprint(json.__file__)\n'},dir=>{const out=run(dir,['app.py']);assert.ok(out.startsWith('local source\n'));assert.ok(out.endsWith(join(dir,'json.py')));});
});
test('offline environment workflow selects its own interpreter and pip',()=>{
 workspace({'inspect_env.py':environmentProbe,'requirements.txt':requirementsExample},dir=>{
  run(dir,['-m','venv','.venv']);const python=join(dir,'.venv','bin','python');
  const probe=run(dir,['inspect_env.py'],python);assert.match(probe,/In venv: True/);assert.ok(probe.includes(join(dir,'.venv')));
  assert.ok(run(dir,['-m','pip','--version'],python).includes(join(dir,'.venv')));
  run(dir,['-m','pip','install','--no-index','-r','requirements.txt'],python);
  assert.equal(run(dir,['-m','pip','check'],python),'No broken requirements found.');
 });
});
test('capacity transfer runs its entry and tests without leaking demo output',()=>{
 workspace({'capacity/__init__.py':'','capacity/estimates.py':'def total_mib(count, mib_per_file):\n    return count * mib_per_file\n','capacity/__main__.py':'from .estimates import total_mib\nprint(total_mib(4,25))\n','check_capacity.py':'from capacity.estimates import total_mib\nassert total_mib(0,10) == 0\nassert total_mib(3,12) == 36\nprint("Checks passed")\n'},dir=>{assert.equal(run(dir,['-m','capacity']),'100');assert.equal(run(dir,['check_capacity.py']),'Checks passed');});
});
test('module quiz has unique answers and varied positions',()=>{const counts=[0,0,0];for(const q of moduleQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));});

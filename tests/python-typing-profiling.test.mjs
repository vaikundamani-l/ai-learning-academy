import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,delimiter} from 'node:path';
import {typedGood,typedBad,checkedMinutes,checkedExample,checkedOutput,pydanticExample,pydanticOutput,benchmarkExample,profileWorkload,profileCaller,hintReasoning,typingQuestions} from '../src/data/pythonTypingContent.ts';
import {performanceModel} from '../src/utils/performanceModel.ts';
const python=process.env.ACADEMY_PYTHON||'python3';
const env={...process.env,PYTHONPATH:[process.env.ACADEMY_TYPING_TOOLS,process.env.PYTHONPATH].filter(Boolean).join(delimiter),PYTHONIOENCODING:'utf-8'};
const available=name=>spawnSync(python,['-c',`import importlib.util, sys; sys.exit(0 if importlib.util.find_spec(${JSON.stringify(name)}) else 1)`],{env,timeout:5000}).status===0;
function workspace(files,fn){const dir=mkdtempSync(join(tmpdir(),'academy-typing-'));try{for(const[name,data]of Object.entries(files))writeFileSync(join(dir,name),data);return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const run=(dir,code)=>execFileSync(python,['-c',code],{cwd:dir,encoding:'utf8',timeout:15000,env}).trim();
test('annotated and guarded examples execute with their documented behavior',()=>{
 workspace({},dir=>{assert.equal(run(dir,typedGood),'8\nNo result');assert.equal(run(dir,typedBad),'44');assert.equal(run(dir,checkedExample),checkedOutput);for(const e of hintReasoning.variants)assert.equal(run(dir,e.code),e.output);});
});
test('runtime boundary rejects wrong exact types and enforces numeric limits',()=>{
 workspace({},dir=>assert.equal(run(dir,checkedMinutes+'\nassert checked_minutes(0) == 0\nassert checked_minutes(60) == 60\nfor value in [True, "20", 20.0, None, []]:\n    try:\n        checked_minutes(value)\n    except TypeError:\n        continue\n    raise AssertionError("type accepted")\nfor value in [-1, 61]:\n    try:\n        checked_minutes(value)\n    except ValueError:\n        continue\n    raise AssertionError("range accepted")\nprint("verified")'),'verified'));
});
test('mypy accepts typed code and identifies the literal string call',{skip:!available('mypy')},()=>{
 workspace({'typed_good.py':typedGood,'typed_bad.py':typedBad,'checked.py':checkedMinutes,'bool_call.py':typedBad.replace('"4"','True')},dir=>{
  const args=['-m','mypy','--strict','--no-incremental','--cache-dir',join(dir,'cache')];
  const good=spawnSync(python,[...args,'typed_good.py','checked.py','bool_call.py'],{cwd:dir,encoding:'utf8',env,timeout:30000});assert.equal(good.status,0,good.stdout+good.stderr);
  const bad=spawnSync(python,[...args,'typed_bad.py'],{cwd:dir,encoding:'utf8',env,timeout:30000});assert.equal(bad.status,1);assert.match(bad.stdout,/arg-type/);assert.match(bad.stdout,/str/);
 });
});
test('Pydantic strict model rejects coercions/extras and validates shown assignments',{skip:!available('pydantic')},()=>{
 workspace({},dir=>{assert.equal(run(dir,pydanticExample),pydanticOutput);const definition=pydanticExample.split('\nfor value in ')[0];assert.equal(run(dir,definition+'\nfor data in [{"minutes": "20"}, {"minutes": True}, {"minutes": 20.0}, {"minutes": None}, {"minutes": 20, "extra": 1}, {}]:\n    try:\n        MinuteInput.model_validate(data)\n    except ValidationError:\n        continue\n    raise AssertionError("invalid model accepted")\nassert MinuteInput(minutes=0).minutes == 0\nassert MinuteInput(minutes=60).minutes == 60\nprint("verified")'),'verified');});
});
test('timeit example emits actual finite samples with consistent units, without asserting a timing winner',()=>{
 workspace({},dir=>{const result=JSON.parse(run(dir,benchmarkExample));assert.equal(result.iterations_per_sample,1000);for(const key of ['list_seconds','set_seconds']){assert.equal(result[key].length,3);assert.ok(result[key].every(x=>Number.isFinite(x)&&x>=0));}assert.ok(Math.abs(result.list_best_us_per_lookup-Math.min(...result.list_seconds)/1000*1e6)<1e-8);assert.ok(Math.abs(result.set_best_us_per_lookup-Math.min(...result.set_seconds)/1000*1e6)<1e-8);});
});
test('cProfile workload has the stated result and real function call counts',()=>{
 workspace({'profile_workload.py':profileWorkload},dir=>{const output=run(dir,profileCaller);assert.match(output,/function calls/);assert.match(output,/Result: \{'cpu': 50, 'ram': 25, 'disk': 25\}/);assert.equal(run(dir,'import cProfile, pstats\nfrom profile_workload import workload\np = cProfile.Profile()\nresult = p.runcall(workload)\ncounts = {}\nfor key, stats in pstats.Stats(p).stats.items():\n    if key[2] in ("count_topics", "normalize"):\n        counts[key[2]] = stats[1]\nassert counts["count_topics"] == 200\nassert counts["normalize"] == 20000\nprint("verified")'),'verified');});
});
test('whole-program model derives correct totals and rejects invalid controls',()=>{
 assert.equal(performanceModel(80,2).total,60);assert.equal(performanceModel(80,2).speedup,5/3);assert.equal(performanceModel(0,10).total,100);assert.equal(performanceModel(100,10).total,10);assert.equal(performanceModel(80,1).total,100);
 for(const fraction of [0,10,50,80,100])for(const speed of [1,2,2.5,10]){const value=performanceModel(fraction,speed);assert.ok(value.total<=100&&value.total>0);assert.ok(value.speedup<=speed+1e-10);assert.equal(value.total,value.unchanged+value.improved);}
 for(const args of [[-1,2],[101,2],[0.5,2],[50,0],[50,11],[50,NaN],[50,Infinity]])assert.throws(()=>performanceModel(...args),RangeError);
});
test('quantity transfer distinguishes its range from minutes',{skip:!available('pydantic')},()=>{
 const quantity=checkedMinutes.replaceAll('checked_minutes','checked_quantity').replaceAll('minutes','quantity').replace('value < 0 or value > 60','value < 1 or value > 100');
 const model=pydanticExample.split('\nfor value in ')[0].replaceAll('MinuteInput','QuantityInput').replaceAll('minutes','quantity').replace('ge=0, le=60','ge=1, le=100');
 workspace({},dir=>assert.equal(run(dir,quantity+'\n\n'+model+'\nfor value in [1,100]:\n    assert checked_quantity(value) == value\n    assert QuantityInput(quantity=value).quantity == value\nfor value in [0,101,True,"3"]:\n    try:\n        checked_quantity(value)\n    except (TypeError,ValueError):\n        pass\n    else:\n        raise AssertionError("invalid quantity accepted")\n    try:\n        QuantityInput(quantity=value)\n    except ValidationError:\n        continue\n    raise AssertionError("invalid model accepted")\nprint("verified")'),'verified'));
});
test('typing quiz has unique correct answers and varied positions',()=>{const counts=[0,0,0];for(const q of typingQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));});

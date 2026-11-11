import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,cpSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {complexityTrace,growthCounts} from '../src/utils/complexityTrace.ts';
import {complexityQuestions} from '../src/data/complexityContent.ts';
const source=fileURLToPath(new URL('../examples/stage-2-complexity/',import.meta.url));
function workspace(fn){const dir=mkdtempSync(join(tmpdir(),'academy-complexity-'));try{cpSync(source,dir,{recursive:true,filter:path=>!path.includes('__pycache__')});return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const run=(dir,code,input)=>execFileSync('python3',['-c',code],{cwd:dir,input,encoding:'utf8',timeout:15000,env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}}).trim();
test('all bounded trace kernels and search cases match real Python count/result outputs',()=>workspace(dir=>{
 const fixtures=[];for(let n=0;n<=16;n++)for(const kind of ['search','pairs','halve','copy'])for(const searchCase of (kind==='search'?['first','last','absent']:['absent']))fixtures.push({n,kind,searchCase});
 const results=JSON.parse(run(dir,String.raw`import json,sys
from operation_counts import *
results=[]
for case in json.load(sys.stdin):
    n,kind=case["n"],case["kind"]
    values=list(range(n))
    if kind=="search":
        target=0 if case["searchCase"]=="first" and n else n-1 if case["searchCase"]=="last" and n else -1
        result,count=linear_find(values,target)
    elif kind=="pairs": result=count=unordered_pairs(n)
    elif kind=="halve": result=count=halve_until_zero(n)
    else: result,count=copy_evens(values)
    results.append({"result":result,"count":count})
print(json.dumps(results))`,JSON.stringify(fixtures)));
 fixtures.forEach((fixture,index)=>{const model=complexityTrace(fixture.kind,fixture.n,fixture.searchCase);const last=model.frames[model.frames.length-1];assert.equal(model.count,results[index].count);assert.deepEqual(JSON.parse(last.result),results[index].result);assert.equal(last.count,model.count);assert.ok(model.frames.slice(0,-1).every(frame=>frame.result==='not returned'));});
}));
test('search counts early match, duplicates, missing values and empty input without mutation',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from operation_counts import linear_find,contains_plain
for values in [[],[3],[3,3,3],[2,3,2,4],[0,1,2,3,4]]:
    original=values.copy()
    for target in [-1,0,2,3,4]:
        expected=next((i for i,v in enumerate(values) if v==target),-1)
        index,count=linear_find(values,target)
        assert index==expected
        assert count==(expected+1 if expected>=0 else len(values))
        assert contains_plain(values,target)==(target in values)
        assert values==original
print("verified")`),'verified');
}));
test('pair counts equal independently enumerated unordered sets and satisfy quadratic bounds',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from itertools import combinations
from operation_counts import unordered_pairs
for n in range(65):
    expected=len(set(combinations(range(n),2)))
    count=unordered_pairs(n)
    assert count==expected==n*(n-1)//2
    if n>=2: assert n*n/4<=count<=n*n/2
print("verified")`),'verified');
}));
test('halving boundaries match integer bit lengths including powers of two',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from operation_counts import halve_until_zero
for n in range(1025):
    assert halve_until_zero(n)==n.bit_length()
assert [halve_until_zero(n) for n in [0,1,7,8,9,15,16]]==[0,1,3,4,4,4,5]
print("verified")`),'verified');
}));
test('copying/counting evens preserve inputs and distinguish result storage requirements',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from operation_counts import copy_evens,count_evens
for values in [[],[1,3,5],[0,2,4],[-4,-3,-2,-1,0],[2,2,3]]:
    before=values.copy()
    output,visits=copy_evens(values)
    count,count_visits=count_evens(values)
    expected=[v for v in values if v%2==0]
    assert output==expected and output is not values
    assert visits==count_visits==len(values)
    assert count==len(expected) and values==before
print("verified")`),'verified');
 const trace=complexityTrace('copy',8);assert.deepEqual(trace.output,[0,2,4,6]);assert.deepEqual(trace.frames[0].output,[0]);assert.deepEqual(trace.frames[2].output,[0,2]);
}));
test('all replay histories preserve counts and separate return frames from counted events',()=>{
 for(const kind of ['search','pairs','halve','copy'])for(const n of [0,1,2,8,16]){const trace=complexityTrace(kind,n);const last=trace.frames[trace.frames.length-1];assert.equal(trace.frames.length,trace.count+1);assert.equal(last.event,'Return');for(let i=0;i<trace.frames.length-1;i++)assert.equal(trace.frames[i].count,i+1);}
 const pair=complexityTrace('pairs',4);assert.deepEqual(pair.frames.slice(0,-1).map(frame=>frame.active),[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]);assert.equal(complexityTrace('search',8,'first').count,1);
});
test('growth functions and mathematical examples have correct values without treating curves as timings',()=>{
 assert.deepEqual(growthCounts(16),{constant:1,log:4,linear:16,nlog:64,quadratic:256,exponential:65536});assert.equal(growthCounts(1).log,0);assert.equal(growthCounts(8).nlog,24);
 for(let n=1;n<1000;n++){assert.ok(3*n<=3*n+7&&3*n+7<=10*n);}
 assert.equal(100*100,100**2);assert.ok(100*10>10**2);assert.ok(100*1000<1000**2);
 const counts=Array.from({length:16},(_,i)=>growthCounts(i+1).exponential);assert.ok(counts.every((value,i)=>i===0||value===2*counts[i-1]));
});
test('model input boundaries reject invalid scenarios and nonfinite or out-of-range sizes',()=>{
 for(const n of [-1,17,1.5,NaN,Infinity])assert.throws(()=>complexityTrace('search',n),RangeError);
 assert.throws(()=>complexityTrace('other',8),RangeError);assert.throws(()=>complexityTrace('search',8,'middle'),RangeError);
 for(const n of [0,-1,17,1.5,NaN])assert.throws(()=>growthCounts(n),RangeError);
});
test('independent two-pass and n-by-m transfer derivations match separate Python counters',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`for n in [0,1,3,8]:
    count=0
    for i in range(n): count+=1
    for j in range(n): count+=1
    assert count==2*n
    for m in [0,1,3,8]:
        rectangular=0
        for i in range(n):
            for j in range(m): rectangular+=1
        assert rectangular==n*m
print("verified")`),'verified');
}));
test('actual timing vectors report correct scope, finite samples and preserved GC setting',()=>workspace(dir=>{
 const observed=JSON.parse(run(dir,String.raw`import gc,json
from measure_search import measure
before=gc.isenabled()
result=measure()
assert gc.isenabled()==before
print(json.dumps(result))`));assert.match(observed.scope,/excludes input creation/);assert.ok(observed.version);assert.deepEqual(observed.measurements.map(item=>item.n),[128,1024,2048]);
 for(const item of observed.measurements){assert.equal(item.calls_per_sample,100);assert.equal(item.case,'target absent');assert.equal(item.seconds_per_call.length,3);assert.ok(item.seconds_per_call.every(value=>Number.isFinite(value)&&value>=0));assert.equal(item.minimum_seconds_per_call,Math.min(...item.seconds_per_call));}
}));
test('displayed runnable commands produce the worked results and measurements',()=>workspace(dir=>{
 const counts=JSON.parse(execFileSync('python3',['operation_counts.py'],{cwd:dir,encoding:'utf8'}));assert.deepEqual(counts,{first:[0,1],last:[7,8],absent:[-1,8],pairs:28,halvings:4,evens:[[0,2,4,6],8],even_count:[4,8]});
 const measurement=spawnSync('python3',['measure_search.py'],{cwd:dir,encoding:'utf8',timeout:10000});assert.equal(measurement.status,0,measurement.stderr);assert.equal(JSON.parse(measurement.stdout).measurements.length,3);
}));
test('knowledge check separates case, tightness, space conventions and measured performance',()=>{assert.equal(complexityQuestions.length,10);const positions=new Set();for(const q of complexityQuestions){assert.equal(q.options.filter(option=>option.isCorrect).length,1);positions.add(q.options.findIndex(option=>option.isCorrect));}assert.equal(positions.size,3);});

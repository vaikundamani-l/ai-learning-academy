import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,cpSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createMemoryEnvironment,allocatePyObject,assignVariable,deleteVariable,appendReference,collectUnreachable,getPythonMemoryScenarios} from '../src/utils/pythonMemory.ts';
import {bytecodeFrames} from '../src/data/pythonBasicsLessonContent.ts';
const source=fileURLToPath(new URL('../examples/stage-1-cpython/',import.meta.url));
function workspace(fn){const dir=mkdtempSync(join(tmpdir(),'academy-cpython-'));try{cpSync(source,dir,{recursive:true,filter:path=>!path.includes('__pycache__')});return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const run=(dir,code,input)=>execFileSync('python3',['-c',code],{cwd:dir,input,encoding:'utf8',timeout:10000,env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}}).trim();
function checkEdges(env){const edges=Object.fromEntries(Object.keys(env.heap).map(id=>[id,0]));for(const id of Object.values(env.stack)){assert.ok(id in edges);edges[id]++;}for(const object of Object.values(env.heap))for(const id of object.nestedRefs){assert.ok(id in edges);edges[id]++;}for(const object of Object.values(env.heap))assert.equal(object.refCount,edges[object.id]);}

test('every drawn snapshot counts all name/container edges and uses deterministic synthetic labels',()=>{
 const first=getPythonMemoryScenarios();assert.deepEqual(first,getPythonMemoryScenarios());assert.equal(first.length,5);
 for(const scenario of first)for(const step of scenario.steps){checkEdges(step.environment);for(const id of Object.keys(step.environment.heap))assert.match(id,/^M[1-9][0-9]*$/);}
 const copies=first.find(item=>item.id==='shallow-vs-deep').steps;
 assert.equal(copies[0].environment.heap.M1.refCount,1);assert.equal(copies[2].environment.heap.M1.refCount,2);
 assert.equal(copies[0].environment.heap.M3.value,'[1, 2]');assert.equal(copies[3].environment.heap.M3.value,'[1, 2, 99]');
});
test('rebind releases old zero-edge objects; same-target binding is a no-op',()=>{
 const env=createMemoryEnvironment();const first=allocatePyObject(env,'list','[]');assignVariable(env,'x',first);assignVariable(env,'x',first);assert.equal(env.heap[first].refCount,1);
 const second=allocatePyObject(env,'list','[]');assignVariable(env,'x',second);assert.equal(env.heap[first],undefined);assert.equal(env.heap[second].refCount,1);checkEdges(env);
 assert.throws(()=>assignVariable(env,'x','missing'),RangeError);assert.equal(env.stack.x,second);
});
test('zero-edge release cascades container edges but preserves another reachable child',()=>{
 const env=createMemoryEnvironment();const child=allocatePyObject(env,'list','[]');const parent=allocatePyObject(env,'list','[child, child]',[child,child]);assignVariable(env,'root',parent);assignVariable(env,'other',child);assert.equal(env.heap[child].refCount,3);
 deleteVariable(env,'root');assert.equal(env.heap[parent],undefined);assert.equal(env.heap[child].refCount,1);deleteVariable(env,'other');assert.deepEqual(env.heap,{});deleteVariable(env,'absent');checkEdges(env);
});
test('cycles remain after deleting names and explicit reachability collection preserves live cycles',()=>{
 const env=createMemoryEnvironment();const ring=allocatePyObject(env,'list','[]');assignVariable(env,'ring',ring);appendReference(env,ring,ring,'[self]');assert.equal(env.heap[ring].refCount,2);assert.deepEqual(collectUnreachable(env),[]);
 deleteVariable(env,'ring');assert.equal(env.heap[ring].refCount,1);assert.deepEqual(collectUnreachable(env),[ring]);assert.deepEqual(env.heap,{});
 const live=allocatePyObject(env,'list','[]');assignVariable(env,'live',live);appendReference(env,live,live,'[self]');checkEdges(env);assert.deepEqual(collectUnreachable(env),[]);checkEdges(env);
});
test('unreachable cycles release edges into reachable children when collected',()=>{
 const env=createMemoryEnvironment();const child=allocatePyObject(env,'list','[]');assignVariable(env,'child',child);const cycle=allocatePyObject(env,'list','[child]',[child]);assignVariable(env,'cycle',cycle);appendReference(env,cycle,cycle,'[child, self]');deleteVariable(env,'cycle');assert.equal(env.heap[child].refCount,2);assert.deepEqual(collectUnreachable(env),[cycle]);assert.equal(env.heap[child].refCount,1);checkEdges(env);
 assert.throws(()=>allocatePyObject(env,'list','[missing]',['bad']),RangeError);assert.throws(()=>appendReference(env,child,'bad','x'),RangeError);
});
for(const scenario of getPythonMemoryScenarios())test(`graph ${scenario.id} name/value/alias observations match actual Python after each step`,()=>workspace(dir=>{
 const payload=scenario.steps.map(step=>({code:step.code,names:Object.keys(step.environment.stack)}));
 const actual=JSON.parse(run(dir,String.raw`import copy,gc,json,sys
namespace={"copy":copy,"gc":gc}
observations=[]
for step in json.load(sys.stdin):
    exec(step["code"],namespace)
    names=step["names"]
    observations.append({"values":{name:repr(namespace[name]) for name in names},
        "aliases":{a+"|"+b:namespace[a] is namespace[b] for a in names for b in names}})
print(json.dumps(observations))`,JSON.stringify(payload)));
 scenario.steps.forEach((step,index)=>{const env=step.environment;for(const[name,id]of Object.entries(env.stack)){const expected=env.heap[id].value==='[self]'?'[[...]]':env.heap[id].value;assert.equal(actual[index].values[name],expected);for(const[other,target]of Object.entries(env.stack))assert.equal(actual[index].aliases[`${name}|${other}`],id===target);}});
}));
test('controlled getrefcount observation checks deltas and value identity rather than universal totals',()=>workspace(dir=>{
 const result=JSON.parse(execFileSync('python3',['inspect_references.py'],{cwd:dir,encoding:'utf8'}));assert.equal(result.implementation,'CPython');assert.match(result.version,/^3\.12\./);assert.equal(result.alias_delta,1);assert.equal(result.release_delta,-1);assert.equal(result.list_identity_preserved,true);assert.deepEqual(result.integer_values,[101,100]);
}));
test('actual deepcopy retains repeated references, reuses immutable atoms and copies self-cycles',()=>workspace(dir=>{
 const result=JSON.parse(execFileSync('python3',['copy_graphs.py'],{cwd:dir,encoding:'utf8'}));assert.deepEqual(result,{shallow_shares_inner:true,deep_shares_original_inner:false,deep_reuses_child:true,integer_atom_shared:true,deep_after_original_mutation:[[1,2],[1,2]],copied_cycle_points_to_copy:true});
}));
test('actual cyclic collection with weak observation restores either prior automatic-GC setting',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`import gc
from collect_cycle import inspect
for enabled in [True,False]:
    gc.enable() if enabled else gc.disable()
    result=inspect()
    assert result=={"alive_before_explicit_collection":True,"gone_after_explicit_collection":True}
    assert gc.isenabled()==enabled
gc.enable()
print("verified")`),'verified');
}));
for(const a of [2,5])test(`value-stack replay for a=${a} matches real dis instructions and stack effects`,()=>workspace(dir=>{
 const observed=JSON.parse(run(dir,`import json\nfrom inspect_bytecode import inspect\nprint(json.dumps(inspect(${a})))`));assert.deepEqual(observed.frames,bytecodeFrames(a));assert.equal(observed.result,a*3+4);assert.equal(Math.max(...observed.frames.map(frame=>frame.stack.length)),2);assert.equal(observed.frames.reduce((sum,frame)=>sum+frame.effect,0),0);
}));
test('reference programs reject unsupported interpreter version and replay rejects unsupported UI inputs',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from unittest.mock import patch
import inspect_references,collect_cycle,inspect_bytecode
for module in [inspect_references,collect_cycle,inspect_bytecode]:
    with patch.object(module.sys,"version_info",(3,13)):
        try: module.inspect()
        except RuntimeError as error: assert "3.12" in str(error)
        else: raise AssertionError("unsupported version accepted")
print("verified")`),'verified');assert.throws(()=>bytecodeFrames(0),RangeError);
}));
test('independent config copy and subtraction transfer expectations hold in real Python',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`import copy,dis
options={"debug":False}
original=[options,options]
shallow=copy.copy(original)
deep=copy.deepcopy(original)
options["debug"]=True
assert shallow==[{"debug":True},{"debug":True}]
assert deep==[{"debug":False},{"debug":False}]
assert deep[0] is deep[1] and deep[0] is not options
def difference(a,b): return a-b
instructions=list(dis.get_instructions(difference,adaptive=False,show_caches=False))
assert [i.argrepr for i in instructions if i.opname=="BINARY_OP"]==["-"]
assert difference(8,3)==5
stack=[8,3]
right,left=stack.pop(),stack.pop()
stack.append(left-right)
assert stack==[5]
print("verified")`),'verified');
}));
test('displayed command scripts and module disassembly run without dependencies',()=>workspace(dir=>{
 for(const name of ['inspect_references.py','copy_graphs.py','collect_cycle.py','inspect_bytecode.py']){const result=spawnSync('python3',[name],{cwd:dir,encoding:'utf8',timeout:10000});assert.equal(result.status,0,result.stderr);assert.ok(JSON.parse(result.stdout));}
 const result=spawnSync('python3',['-m','dis','inspect_bytecode.py'],{cwd:dir,encoding:'utf8',timeout:10000});assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/Disassembly of.*calculate/);assert.match(result.stdout,/BINARY_OP/);
 const page=readFileSync(new URL('../src/pages/lessons/PythonBasicsLesson.tsx',import.meta.url),'utf8');assert.match(page,/inspect_bytecode\.py\?raw/);
}));

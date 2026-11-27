import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,cpSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {arrayTrace,arrayUnits,appendCosts} from '../src/utils/arrayTrace.ts';
import {arrayQuestions} from '../src/data/arrayContent.ts';
const source=fileURLToPath(new URL('../examples/stage-2-arrays/',import.meta.url));
function workspace(fn){const dir=mkdtempSync(join(tmpdir(),'academy-arrays-'));try{cpSync(source,dir,{recursive:true,filter:path=>!path.includes('__pycache__')});return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const run=(dir,code,input)=>execFileSync('python3',['-c',code],{cwd:dir,input,encoding:'utf8',timeout:15000,env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}}).trim();
test('every movement fixture matches real Python final buffer, size, counters, peak and result',()=>workspace(dir=>{
 const cases=[];for(const operation of ['append','insert','pop','invalid'])for(const fill of ['spare','full'])for(const position of ['first','middle','last'])cases.push({operation,fill,position});
 const observed=JSON.parse(run(dir,String.raw`import json,sys
from dynamic_array import DynamicArray,_EMPTY
results=[]
for case in json.load(sys.stdin):
    initial=[10,20,30] if case["fill"]=="spare" else [10,20,30,40]
    a=DynamicArray()
    for value in initial: a.append(value)
    a.reset_counts()
    n=len(a)
    op=case["operation"]
    index=n if op=="append" else n+1 if op=="invalid" else 0 if case["position"]=="first" else n//2 if case["position"]=="middle" else n if op=="insert" else n-1
    try:
        if op=="append": a.append(90); result="complete"
        elif op=="insert": a.insert(index,90); result="complete"
        elif op=="pop": result=str(a.pop(index))
        else: a.at(index); raise AssertionError("bad index accepted")
    except IndexError: result="IndexError"
    a.check_invariants()
    results.append({"buffer":[None if value is _EMPTY else value for value in a._data],"size":len(a),"counts":a.counts,"peak":a.peak_slots,"result":result})
print(json.dumps(results))`,JSON.stringify(cases)));
 cases.forEach((item,i)=>{const frames=arrayTrace(item.operation,item.fill,item.position).frames;const last=frames[frames.length-1];const{buffer,size,counts,peak,result}=last;assert.deepEqual({buffer,size,counts,peak,result},observed[i],JSON.stringify(item));});
}));
test('doubling and exact-fit histories match real append runs for every prefix through 64',()=>workspace(dir=>{
 const actual=JSON.parse(run(dir,'import json\nfrom array_demo import append_history\nprint(json.dumps({policy:append_history(policy,64) for policy in ["double","one"]}))'));
 for(const policy of ['double','one']){const expected=appendCosts(policy,64);actual[policy].forEach((row,i)=>{assert.deepEqual({size:row.size,capacity:row.capacity,initialized:row.counts.initialized,copies:row.counts.copies,stores:row.counts.stores,total:Object.values(row.counts).reduce((s,v)=>s+v,0),last:row.this_append_units,peak:row.peak_slots},expected[i]);});}
}));
test('geometric aggregate bound and exact-fit quadratic formula hold at boundaries and wide prefixes',()=>{
 const rows=appendCosts('double',1024);for(const row of rows){assert.ok(row.capacity>=row.size&&row.capacity<2*row.size);assert.equal(row.copies,row.capacity-1);assert.equal(row.initialized,2*row.capacity-1);assert.ok(row.total<7*row.size);}
 for(const row of appendCosts('one',128)){assert.equal(row.copies,row.size*(row.size-1)/2);assert.equal(row.total,row.size**2+row.size);}
 assert.equal(rows[4].last,13);assert.equal(rows[7].total,30);assert.equal(appendCosts('one',8)[7].total,72);
});
test('movement order exposes candidate coexistence and preserves historical snapshots',()=>{
 const grow=arrayTrace('append','full','first').frames;const allocated=grow.find(frame=>frame.phase==='Allocate');assert.deepEqual(allocated.buffer,[10,20,30,40]);assert.deepEqual(allocated.candidate,Array(8).fill(null));assert.equal(allocated.peak,12);
 const copied=grow.find(frame=>frame.phase==='Copy');assert.deepEqual(copied.candidate,[10,null,null,null,null,null,null,null]);assert.deepEqual(allocated.candidate,Array(8).fill(null));assert.equal(grow[grow.length-1].candidate,null);
 const insertion=arrayTrace('insert','spare','first').frames.filter(frame=>frame.phase==='Shift right');assert.deepEqual(insertion.map(frame=>frame.active),[[2,3],[1,2],[0,1]]);assert.deepEqual(insertion[0].buffer,[10,20,30,30]);
 const removal=arrayTrace('pop','full','first').frames;assert.deepEqual(removal.filter(frame=>frame.phase==='Shift left').map(frame=>frame.active),[[0,1],[1,2],[2,3]]);assert.deepEqual(removal[removal.length-1].buffer,[20,30,40,null]);
});
test('strict indices fail without allocation or mutation and empty boundaries behave deliberately',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from dynamic_array import DynamicArray
from unittest.mock import patch
a=DynamicArray()
for action in [lambda:a.at(0),lambda:a.pop(),lambda:a.insert(1,5)]:
    try: action()
    except IndexError: pass
    else: raise AssertionError("empty bad index accepted")
a.insert(0,None)
assert a.at(0) is None and len(a)==1
for method in [a.at,lambda i:a.insert(i,10),a.pop]:
    for bad in [True,False,1.0,"0"]:
        before=(a.snapshot(),a._data,a.counts.copy(),a.peak_slots)
        try: method(bad)
        except TypeError: pass
        else: raise AssertionError("wrong index type accepted")
        assert a.snapshot()==before[0] and a._data is before[1] and a.counts==before[2] and a.peak_slots==before[3]
for bad in [-1,2]:
    with patch("dynamic_array.allocate",side_effect=AssertionError("must validate before allocation")):
        try: a.insert(bad,99)
        except IndexError: pass
        else: raise AssertionError("outside insert accepted")
assert a.pop() is None and len(a)==0
print("verified")`),'verified');
}));
test('allocation failure on full append/insert preserves old backing, values and counters',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from dynamic_array import DynamicArray
from unittest.mock import patch
for action in [lambda a:a.append(90),lambda a:a.insert(0,90)]:
    a=DynamicArray()
    for value in [10,20,30,40]: a.append(value)
    a.reset_counts()
    old=a._data
    with patch("dynamic_array.allocate",side_effect=MemoryError("synthetic allocation failure")):
        try: action(a)
        except MemoryError: pass
        else: raise AssertionError("failure hidden")
    assert a._data is old and a.snapshot()==[10,20,30,40] and a.capacity==4
    assert not any(a.counts.values()) and a.peak_slots==4
    a.check_invariants()
print("verified")`),'verified');
}));
test('payload aliases survive growth while popped slots stop retaining removed objects',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`import gc,weakref
from dynamic_array import DynamicArray,_EMPTY
class Payload: pass
item=Payload()
a=DynamicArray()
a.append(item);a.append(item);a.append(None)
assert a.at(0) is a.at(1) is item
snapshot=a.snapshot()
assert snapshot is not a._data and snapshot[0] is item
item.flag=5
assert a.at(1).flag==5
del snapshot
probe=weakref.ref(item)
del item
first=a.pop(0)
assert probe() is first and a.at(0) is first
second=a.pop(0)
assert first is second
del first,second
gc.collect()
assert probe() is None and a.snapshot()==[None]
assert all(value is _EMPTY for value in a._data[1:])
assert a.capacity==4
class CountReads(list):
    reads=0
    def __getitem__(self,index):
        self.reads+=1
        return super().__getitem__(index)
a._data=CountReads(a._data)
a.check_invariants()
assert a._data.reads==a.capacity==4 and len(a)==1
print("verified")`),'verified');
}));
test('mixed operations agree with a separate Python list oracle for both growth policies',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`import random
from dynamic_array import DynamicArray
for policy in ["double","one"]:
    random.seed(2711)
    a=DynamicArray(policy);expected=[]
    for step in range(400):
        operation=random.choice(["append","insert","pop","at"])
        if operation=="append":
            value=None if step%7==0 else step
            a.append(value);expected.append(value)
        elif operation=="insert":
            index=random.randrange(len(expected)+1)
            a.insert(index,step);expected.insert(index,step)
        elif expected:
            index=random.randrange(len(expected))
            if operation=="pop": assert a.pop(index)==expected.pop(index)
            else: assert a.at(index)==expected[index]
        a.check_invariants()
        assert a.snapshot()==expected and len(a)==len(expected) and a.capacity>=len(a)
print("verified")`),'verified');
}));
test('front insertions retain quadratic shifts while doubling growth copies remain linear',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from dynamic_array import DynamicArray
for m in [0,1,4,8,32]:
    a=DynamicArray()
    for value in range(m): a.insert(0,value)
    assert a.snapshot()==list(reversed(range(m)))
    assert a.counts["shifts"]==m*(m-1)//2
    assert a.counts["copies"]<2*m if m else a.counts["copies"]==0
print("verified")`),'verified');
}));
test('independent stable-compaction transfer keeps order and clears all removed tail slots',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`def compact(values,target):
    data=values.copy();write=0;moves=0
    for read in range(len(values)):
        if data[read]!=target:
            if write!=read: data[write]=data[read];moves+=1
            write+=1
    for index in range(write,len(data)): data[index]=None
    return data[:write],len(values)-write,moves,data[write:]
for values,target,expected in [([10,20,10,30],10,[20,30]),([],10,[]),([10,10],10,[]),([20,30],10,[20,30]),([None,1,None],None,[1])]:
    result,removed,moves,tail=compact(values,target)
    assert result==expected and removed==len(values)-len(expected)
    assert all(value is None for value in tail)
    assert moves<=len(values)
print("verified")`),'verified');
}));
test('displayed demo command reports the derived eight-append totals',()=>workspace(dir=>{
 const result=spawnSync('python3',['array_demo.py'],{cwd:dir,encoding:'utf8',timeout:10000});assert.equal(result.status,0,result.stderr);const data=JSON.parse(result.stdout);assert.equal(data.double.length,8);assert.equal(Object.values(data.double[7].counts).reduce((s,v)=>s+v,0),30);assert.equal(Object.values(data.one[7].counts).reduce((s,v)=>s+v,0),72);
}));
test('invalid model options are rejected and quiz answers have distinct correct positions',()=>{
 assert.throws(()=>arrayTrace('wrong','full','first'),RangeError);assert.throws(()=>arrayTrace('append','wrong','first'),RangeError);assert.throws(()=>arrayTrace('append','full','wrong'),RangeError);
 for(const n of [-1,1025,1.5,NaN])assert.throws(()=>appendCosts('double',n),RangeError);assert.throws(()=>appendCosts('bad',8),RangeError);assert.deepEqual(appendCosts('double',0),[]);
 assert.equal(arrayQuestions.length,10);for(const q of arrayQuestions)assert.equal(q.options.filter(option=>option.isCorrect).length,1);assert.equal(new Set(arrayQuestions.map(q=>q.options.findIndex(option=>option.isCorrect))).size,3);
 assert.equal(arrayUnits(arrayTrace('invalid','full','first').frames[1].counts),0);
});

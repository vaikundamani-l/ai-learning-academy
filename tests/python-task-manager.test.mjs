import test from 'node:test';
import assert from 'node:assert/strict';
import {copyFileSync,mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {taskFixture,taskManagerQuestions} from '../src/data/pythonTaskManagerContent.ts';
import {taskManagerTrace} from '../src/utils/taskManagerTrace.ts';
const folder=fileURLToPath(new URL('../examples/stage-1-task-manager/',import.meta.url));
const files=['task_domain.py','task_store.py','task_cli.py','test_tasks.py'];
const env={...process.env,PYTHONIOENCODING:'utf-8'};
function workspace(fn){const dir=mkdtempSync(join(tmpdir(),'academy-task-manager-'));try{for(const name of files)copyFileSync(join(folder,name),join(dir,name));return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const run=(dir,code,input)=>execFileSync('python3',['-c',code],{cwd:dir,encoding:'utf8',timeout:15000,env,input}).trim();

test('domain transitions preserve original snapshots, titles and independent task state',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from task_domain import *
state=empty_state()
first,task=add_task(state,"Read CPU")
assert state==empty_state() and first["next_id"]==2 and task["id"]==1
second,task=add_task(first,"Trace memory")
assert first["tasks"]==[{"id":1,"title":"Read CPU","done":False}]
changed,task,did_change=complete_task(second,1)
assert did_change and changed["tasks"][0]["done"] is True
assert not second["tasks"][0]["done"]
assert changed["tasks"][1] is not second["tasks"][1]
again,task,did_change=complete_task(changed,1)
assert not did_change and again==changed
assert changed["next_id"]==3
for title in ["", " ", " outer", "outer ", "line\nbreak", "tab\tinside", "a"*81, None, True]:
    try: add_task(first,title)
    except TaskError: continue
    raise AssertionError("invalid title accepted")
assert add_task(first,"a"*80)[1]["title"]=="a"*80
assert add_task(first,"Review café")[1]["title"]=="Review café"
for task_id in [True,0,-1,10000,"1",9]:
    try: complete_task(first,task_id)
    except TaskError: continue
    raise AssertionError("invalid id accepted")
print("verified")`),'verified');
}));
test('actual CLI persists across processes and repeated done does not write again',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`import json,subprocess,sys
from pathlib import Path
from unittest.mock import patch
import task_cli
from task_store import load_state
path=Path("tasks.json")
def call(*args):
    return subprocess.run([sys.executable,"task_cli.py","--db",str(path),*args],capture_output=True,text=True,timeout=5)
assert call("init").returncode==0
for title in ["Read CPU","Trace memory"]:
    reply=call("add",title)
    assert reply.returncode==0, reply.stderr
assert call("done","1").returncode==0
listed=call("list")
assert json.loads(listed.stdout)=={"tasks":[{"id":1,"title":"Read CPU","done":True},{"id":2,"title":"Trace memory","done":False}]}
before=path.read_bytes()
with patch("task_cli.save_state",side_effect=AssertionError("no redundant save")):
    import io
    from contextlib import redirect_stdout
    with redirect_stdout(io.StringIO()) as output:
        assert task_cli.main(["--db",str(path),"done","1"])==0
assert json.loads(output.getvalue())["changed"] is False
assert path.read_bytes()==before
for args in [("done","9"),("done","0"),("done","True"),("add"," "),("unknown",)]:
    reply=call(*args)
    assert reply.returncode==2 and reply.stdout==""
    assert path.read_bytes()==before
assert load_state(path)["next_id"]==3
print("verified")`),'verified');
}));
test('malformed/unsupported persisted data is rejected without reset or overwrite',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`import json,subprocess,sys
from pathlib import Path
from task_domain import empty_state
from task_store import encode_state
valid={"version":1,"next_id":2,"tasks":[{"id":1,"title":"Read CPU","done":False}]}
bad=[b"", b"\xff", b'{"version":', b'{"version":1,"version":1,"next_id":1,"tasks":[]}', b'{"version":NaN,"next_id":1,"tasks":[]}', ("["*2000+"0"+"]"*2000).encode()]
for mutate in [lambda s:s.update(version=True),lambda s:s.update(version=2),lambda s:s.update(next_id=True),lambda s:s.update(next_id=1),lambda s:s.update(extra=1),lambda s:s["tasks"][0].update(done=1),lambda s:s["tasks"][0].update(id=True),lambda s:s["tasks"].append(dict(s["tasks"][0]))]:
    state=json.loads(json.dumps(valid));mutate(state);bad.append(json.dumps(state).encode())
path=Path("tasks.json")
for raw in bad:
    path.write_bytes(raw)
    for command in [["list"],["add","Trace memory"],["init"]]:
        reply=subprocess.run([sys.executable,"task_cli.py","--db",str(path),*command],capture_output=True,text=True,timeout=5)
        assert reply.returncode==2 and reply.stdout=="",reply.stderr
        assert path.read_bytes()==raw
        assert "Traceback" not in reply.stderr
print("verified")`),'verified');
}));
test('count/id/serialized-byte bounds are separate and preserve previous data',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from pathlib import Path
from task_domain import *
from task_store import *
state={"version":1,"next_id":101,"tasks":[{"id":i,"title":"Task","done":False} for i in range(1,101)]}
validate_state(state)
try: add_task(state,"One more")
except TaskError: pass
else: raise AssertionError("capacity ignored")
state={"version":1,"next_id":10000,"tasks":[{"id":9999,"title":"Last","done":False}]}
try: add_task(state,"Another")
except TaskError: pass
else: raise AssertionError("id exhaustion ignored")
path=Path("tasks.json")
initialize(path)
payload=encode_state(empty_state())
path.write_bytes(payload+b" "*(MAX_BYTES-len(payload)))
assert load_state(path)==empty_state()
raw=path.read_bytes()+b" "
path.write_bytes(raw)
try: load_state(path)
except StoreError: pass
else: raise AssertionError("oversize read accepted")
assert path.read_bytes()==raw
oversize={"version":1,"next_id":101,"tasks":[{"id":i,"title":"🙂"*80,"done":False} for i in range(1,101)]}
validate_state(oversize)
try: save_state(path,oversize)
except StoreError: pass
else: raise AssertionError("oversize encoding accepted")
assert path.read_bytes()==raw and list(path.parent.glob(".*.tmp"))==[]
print("verified")`),'verified');
}));
test('write/flush/fsync/replace failures leave original bytes and no success output',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`import io
from contextlib import redirect_stdout,redirect_stderr
from pathlib import Path
from unittest.mock import patch
import task_store as store
import task_cli
path=Path("tasks.json");store.initialize(path);before=path.read_bytes()
factory=store.NamedTemporaryFile
class Faulty:
    def __init__(self,inner,phase): self.inner,self.phase=inner,phase
    @property
    def name(self): return self.inner.name
    def __enter__(self): return self
    def __exit__(self,*args): return self.inner.__exit__(*args)
    def write(self,data):
        if self.phase=="write":
            self.inner.write(data[:3]);raise OSError("synthetic write failure")
        return self.inner.write(data)
    def flush(self):
        if self.phase=="flush": raise OSError("synthetic flush failure")
        return self.inner.flush()
    def fileno(self): return self.inner.fileno()
for phase in ["write","flush","fsync","replace"]:
    if phase in ("write","flush"):
        patcher=patch("task_store.NamedTemporaryFile",side_effect=lambda *a,**kw:Faulty(factory(*a,**kw),phase))
    else:
        patcher=patch("task_store.os."+phase,side_effect=OSError("synthetic "+phase+" failure"))
    with patcher,redirect_stdout(io.StringIO()) as output,redirect_stderr(io.StringIO()) as errors:
        code=task_cli.main(["--db",str(path),"add","Trace memory"])
    assert code==2 and output.getvalue()=="" and errors.getvalue().startswith("error:")
    assert path.read_bytes()==before
    assert list(path.parent.glob(".*.tmp"))==[]
print("verified")`),'verified');
}));
test('exclusive initialization self-cleans its new failed file and rejects symlink paths',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from pathlib import Path
from unittest.mock import patch
from task_store import *
path=Path("tasks.json")
with patch("task_store.os.fsync",side_effect=OSError("synthetic init failure")):
    try: initialize(path)
    except OSError: pass
    else: raise AssertionError("init failure hidden")
assert not path.exists()
initialize(path);before=path.read_bytes()
with patch("task_store.write_payload",side_effect=AssertionError("must not write existing file")):
    try: initialize(path)
    except FileExistsError: pass
    else: raise AssertionError("existing file overwritten")
assert path.read_bytes()==before
link=Path("link.json");link.symlink_to(path)
for action in [lambda:load_state(link),lambda:save_state(link,empty_state()),lambda:initialize(link)]:
    try: action()
    except StoreError: continue
    raise AssertionError("symlink accepted")
assert link.is_symlink() and path.read_bytes()==before
print("verified")`),'verified');
}));
test('post-commit output failure leaves saved data and blind repeated add creates another id',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`import io,json
from pathlib import Path
from unittest.mock import patch
from contextlib import redirect_stdout,redirect_stderr
import task_cli
from task_store import initialize,load_state
path=Path("tasks.json");initialize(path)
class Broken:
    def write(self,text): raise BrokenPipeError("synthetic output failure")
    def flush(self): pass
with patch("sys.stdout",Broken()),redirect_stderr(io.StringIO()) as errors:
    code=task_cli.main(["--db",str(path),"add","Read CPU"])
assert code==1 and "may already be committed" in errors.getvalue()
assert load_state(path)["tasks"]==[{"id":1,"title":"Read CPU","done":False}]
with redirect_stdout(io.StringIO()) as output:
    assert task_cli.main(["--db",str(path),"add","Read CPU"])==0
state=load_state(path)
assert [task["id"] for task in state["tasks"]]==[1,2]
assert state["tasks"][0]["title"]==state["tasks"][1]["title"]
print("verified")`),'verified');
}));
test('every browser scenario agrees with actual command outcome and saved state',()=>{
 for(const kind of ['add','done','repeat','missing','corrupt','saveFail','outputFail'])workspace(dir=>{
  const fixture=taskFixture(kind);const model=taskManagerTrace(kind);const final=model.frames.at(-1);
  const result=JSON.parse(run(dir,String.raw`import io,json,sys
from pathlib import Path
from contextlib import redirect_stdout,redirect_stderr
from unittest.mock import patch
from contextlib import nullcontext
import task_cli,task_store
row=json.load(sys.stdin)
path=Path("tasks.json")
if row["kind"]=="corrupt": path.write_bytes(b'{"version":')
else: task_store.save_state(path,row["initial"])
before=path.read_bytes()
def fail_write(target,payload):
    target.write(payload[:3])
    raise OSError("synthetic staged write failure")
class Broken(io.StringIO):
    def write(self,text): raise BrokenPipeError("synthetic output failure")
output=Broken() if row["kind"]=="outputFail" else io.StringIO()
patcher=patch("task_store.write_payload",side_effect=fail_write) if row["kind"]=="saveFail" else nullcontext()
with patcher,redirect_stdout(output),redirect_stderr(io.StringIO()) as errors:
    code=task_cli.main(["--db",str(path),*row["args"]])
try: saved=task_store.load_state(path)
except task_store.StoreError: saved=None
print(json.dumps({"code":code,"stdout":output.getvalue().strip(),"stderr":errors.getvalue().strip(),"saved":saved,"unchanged":path.read_bytes()==before,"temporary":len(list(path.parent.glob(".*.tmp")))}))`,JSON.stringify({kind,...fixture})));
  assert.equal(result.code,final.code,kind);assert.equal(result.stderr,final.stderr,kind);assert.deepEqual(result.saved,final.saved,kind);assert.equal(result.unchanged,!final.committed,kind);assert.equal(result.temporary,0);
  assert.deepEqual(result.stdout?JSON.parse(result.stdout):null,final.stdout?JSON.parse(final.stdout):null,kind);
 });
});
test('atomic replacement does not protect two independent read-modify-write cycles',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`from pathlib import Path
from task_domain import add_task
from task_store import initialize,load_state,save_state
path=Path("tasks.json");initialize(path)
first=load_state(path);second=load_state(path)
a,_=add_task(first,"First writer")
b,_=add_task(second,"Second writer")
save_state(path,a);save_state(path,b)
state=load_state(path)
assert state["tasks"]==[{"id":1,"title":"Second writer","done":False}]
assert state["next_id"]==2
print("lost update demonstrated")`),'lost update demonstrated');
}));
test('shipped standard-library tests run and CLI help/required-path errors are real subprocess behavior',()=>workspace(dir=>{
 const result=spawnSync('python3',['-m','unittest','-v','test_tasks'],{cwd:dir,encoding:'utf8',timeout:15000,env});assert.equal(result.status,0,result.stdout+result.stderr);assert.match(result.stderr,/Ran 7 tests/);assert.match(result.stderr,/OK/);
 const help=spawnSync('python3',['task_cli.py','--help'],{cwd:dir,encoding:'utf8',env});assert.equal(help.status,0);assert.match(help.stdout,/--db/);
 const missing=spawnSync('python3',['task_cli.py','list'],{cwd:dir,encoding:'utf8',env});assert.equal(missing.status,2);assert.equal(missing.stdout,'');
}));
test('replay snapshots separate staging from saved state and never mutate previous frames',()=>{
 const add=taskManagerTrace('add');const candidate=add.frames.find(frame=>frame.phase==='Build candidate');assert.equal(candidate.saved.tasks.length,1);assert.equal(candidate.candidate.tasks.length,2);assert.equal(candidate.committed,false);
 assert.equal(add.frames.at(-1).saved.tasks.length,2);assert.equal(add.frames[0].saved.tasks.length,1);
 const failure=taskManagerTrace('saveFail');assert.equal(failure.frames.at(-1).saved.tasks.length,1);assert.equal(failure.frames.at(-1).temporary,false);assert.equal(failure.frames.at(-1).stdout,'');
 const output=taskManagerTrace('outputFail').frames.at(-1);assert.equal(output.committed,true);assert.equal(output.code,1);
 assert.throws(()=>taskManagerTrace('unknown'),RangeError);
});
test('task-manager quiz has unique answers and balanced positions',()=>{
 const counts=[0,0,0];for(const q of taskManagerQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));
});

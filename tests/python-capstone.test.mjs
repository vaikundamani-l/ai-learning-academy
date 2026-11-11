import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,cpSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {reportCases,reportFixture,capstoneQuestions} from '../src/data/pythonCapstoneContent.ts';
import {reportPipelineTrace} from '../src/utils/reportPipelineTrace.ts';
const source=fileURLToPath(new URL('../examples/stage-1-data-report/',import.meta.url));
function workspace(fn){const dir=mkdtempSync(join(tmpdir(),'academy-capstone-'));try{cpSync(source,dir,{recursive:true,filter:path=>!path.includes('__pycache__')});return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const run=(dir,code,input)=>execFileSync('python3',['-c',code],{cwd:dir,input,encoding:'utf8',timeout:15000,env:{...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1'}}).trim();
test('capstone shipped eleven-case suite runs real files, subprocesses and loopback HTTP',()=>workspace(dir=>{
 const result=spawnSync('python3',['-m','unittest','-v','test_report'],{cwd:dir,encoding:'utf8',timeout:20000});assert.equal(result.status,0,result.stderr);assert.match(result.stderr,/Ran 11 tests/);assert.match(result.stderr,/\bOK\b/);
}));
for(const kind of Object.keys(reportCases))for(const price of [125,200])test(`replay ${kind} at ${price} cents matches actual Python report/error`,()=>workspace(dir=>{
 const fixture=reportFixture(kind,price);const model=reportPipelineTrace(kind,price);const last=model.frames[model.frames.length-1];
 const actual=JSON.parse(run(dir,String.raw`import contextlib,io,json,sys
from pathlib import Path
from test_report import fixture
import report_cli
case=json.load(sys.stdin)
Path("orders.csv").write_text(case["orders"],encoding="utf-8")
Path("catalog.json").write_text(case["catalog"],encoding="utf-8")
out,err=io.StringIO(),io.StringIO()
with contextlib.redirect_stdout(out),contextlib.redirect_stderr(err):
    if case["kind"]=="http":
        with fixture(status=503) as url:
            code=report_cli.main(["--orders","orders.csv","--catalog-url",url])
    else:
        code=report_cli.main(["--orders","orders.csv","--catalog","catalog.json"])
print(json.dumps({"code":code,"stdout":out.getvalue(),"stderr":err.getvalue()}))`,JSON.stringify({...fixture,kind})));
 assert.equal(last.code,actual.code);assert.equal(last.stderr,actual.stderr.trim());
 if(last.code===0){assert.deepEqual(JSON.parse(last.stdout),JSON.parse(actual.stdout));assert.equal(last.subtotal,5*price+450);}else{assert.equal(actual.stdout,'');assert.equal(last.stdout,'');}
 assert.ok(model.frames.slice(0,-1).every(frame=>frame.stdout===''));
}));
test('replay snapshots expose internal subtotal without publishing a late error',()=>{
 const rejected=reportPipelineTrace('unknown',125).frames;assert.equal(rejected[rejected.length-1].subtotal,250);assert.ok(rejected.every(frame=>frame.stdout===''));assert.deepEqual(rejected[0].quantities,{});
 const valid=reportPipelineTrace('valid',125).frames;assert.deepEqual(valid[3].quantities,{PEN:2});assert.deepEqual(valid[5].quantities,{PEN:5,BOOK:1});assert.equal(valid[valid.length-2].stdout,'');
 assert.throws(()=>reportFixture('invalid',125),RangeError);assert.throws(()=>reportFixture('valid',0),RangeError);
});
test('shipped sample command and help match worked report and exit contract',()=>workspace(dir=>{
 const actual=JSON.parse(execFileSync('python3',['report_cli.py','--orders','orders.csv','--catalog','catalog.json'],{cwd:dir,encoding:'utf8'}));assert.equal(actual.total_cents,1075);assert.equal(actual.row_count,3);assert.deepEqual(actual.items.map(row=>[row.sku,row.quantity,row.subtotal_cents]),[['BOOK',1,450],['PEN',5,625]]);
 const help=spawnSync('python3',['report_cli.py','--help'],{cwd:dir,encoding:'utf8'});assert.equal(help.status,0);assert.match(help.stdout,/--catalog-url/);assert.equal(help.stderr,'');
}));
test('testable catalog version/root rules and CSV physical-line diagnostics',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`import json
from report_core import *
for value in [{"version":2,"prices_cents":{"PEN":1}}, {"version":1,"prices_cents":{"PEN":1},"extra":1}, {"prices_cents":{"PEN":1}}]:
    try: parse_catalog(json.dumps(value).encode())
    except DataError: pass
    else: raise AssertionError("invalid catalog accepted")
try: parse_orders(b'sku,quantity\n"PEN\nX",1\n')
except DataError as error: assert "line 3" in str(error),str(error)
else: raise AssertionError("newline product accepted")
# The boundary maximum remains well within JS exact integer display fixtures.
report=build_report(b'sku,quantity\n'+b'PEN,9999\n'*1000,b'{"version":1,"prices_cents":{"PEN":1000000}}')
assert report["total_cents"]==9999000000000 and report["row_count"]==1000
print("verified")`),'verified');
}));
test('capstone quiz offers one correct answer each and varied answer positions',()=>{
 assert.equal(capstoneQuestions.length,10);for(const q of capstoneQuestions)assert.equal(q.options.filter(option=>option.isCorrect).length,1);assert.deepEqual(new Set(capstoneQuestions.map(q=>q.options.findIndex(option=>option.isCorrect))),new Set([0,1,2]));
 const page=readFileSync(new URL('../src/pages/lessons/PythonCapstoneLesson.tsx',import.meta.url),'utf8');assert.match(page,/report_core\.py\?raw/);
});
test('displayed fixture server command serves a real catalog to the displayed CLI',()=>workspace(dir=>{
 assert.equal(run(dir,String.raw`import json,subprocess,sys
server=subprocess.Popen([sys.executable,"-u","serve_catalog.py","--port","0"],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
try:
    line=server.stdout.readline().strip()
    assert line.startswith("Fixture: http://127.0.0.1:"),line
    result=subprocess.run([sys.executable,"report_cli.py","--orders","orders.csv","--catalog-url",line.removeprefix("Fixture: ")],capture_output=True,text=True,timeout=5)
    assert result.returncode==0,result.stderr
    assert json.loads(result.stdout)["total_cents"]==1075
finally:
    server.terminate()
    server.communicate(timeout=5)
print("verified")`),'verified');
}));

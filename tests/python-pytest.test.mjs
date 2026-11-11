import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,readdirSync,realpathSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,delimiter} from 'node:path';
import {fitsVersions,coverageTestProgram,quantityModule,quantityTests,teardownTests,coverageReasoning,pytestQuestions} from '../src/data/pythonPytestContent.ts';
import {coverageEvidence} from '../src/utils/coverageEvidence.ts';
const python=process.env.ACADEMY_PYTEST_PYTHON||'python3';
const env={...process.env,PYTHONPATH:[process.env.ACADEMY_TEST_TOOLS,process.env.PYTHONPATH].filter(Boolean).join(delimiter),PYTHONIOENCODING:'utf-8',PYTEST_DISABLE_PLUGIN_AUTOLOAD:'1'};
const available=name=>spawnSync(python,['-c',`import importlib.util,sys;sys.exit(0 if importlib.util.find_spec(${JSON.stringify(name)}) else 1)`],{env,timeout:5000}).status===0;
const toolsAvailable=available('pytest')&&available('coverage');
const optional={skip:!toolsAvailable};
function workspace(files,fn){const dir=mkdtempSync(join(tmpdir(),'academy-pytest-'));try{for(const [name,data]of Object.entries(files))writeFileSync(join(dir,name),data);return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const run=(dir,code)=>execFileSync(python,['-c',code],{cwd:dir,encoding:'utf8',env,timeout:15000}).trim();
function pytest(dir,args=[]){return spawnSync(python,['-m','pytest','-q','--basetemp',join(dir,'pytest-tmp'),...args],{cwd:dir,encoding:'utf8',env,timeout:15000});}

test('coverage reasoning programs execute and distinguish running from checking',()=>workspace({},dir=>{
 for(const variant of coverageReasoning.variants)assert.equal(run(dir,variant.code),variant.output);
}));
test('coverage model preserves case expectations, execution snapshots and invalid-selection boundaries',()=>{
 for(const version of ['correct','strict'])for(const suite of ['ordinary','branches','boundaries']){
  const model=coverageEvidence(version,suite);assert.equal(model.statementTotal,4);assert.equal(model.branchTotal,2);
  assert.equal(model.success,version==='correct'||suite!=='boundaries');
  assert.equal(model.results.length,suite==='ordinary'?1:suite==='branches'?2:4);
  assert.deepEqual(model.coveredLines,suite==='ordinary'?[1,2,4]:[1,2,3,4]);
  assert.equal(model.coveredBranches.length,suite==='ordinary'?1:2);
  assert.equal(model.frames[0].results.length,0);assert.deepEqual(model.frames[0].coveredLines,[1]);
  assert.deepEqual(model.frames.at(-1).results,model.results);
 }
 assert.throws(()=>coverageEvidence('bad','ordinary'),RangeError);assert.throws(()=>coverageEvidence('correct','bad'),RangeError);
});
test('complete pytest quantity suite runs 15 passing cases with real built-in fixtures',optional,()=>workspace({'quantity.py':quantityModule,'test_quantity.py':quantityTests},dir=>{
 const result=pytest(dir,['test_quantity.py']);assert.equal(result.status,0,result.stdout+result.stderr);assert.match(result.stdout,/15 passed/);assert.doesNotMatch(result.stdout,/skipped/);
}));
test('parameter rows collect separately with useful ids and file fixtures remain order independent',optional,()=>workspace({'quantity.py':quantityModule,'test_quantity.py':quantityTests},dir=>{
 const collected=pytest(dir,['--collect-only','test_quantity.py']);assert.equal(collected.status,0,collected.stdout+collected.stderr);assert.match(collected.stdout,/15 tests collected/);assert.match(collected.stdout,/test_valid\[minimum\]/);assert.match(collected.stdout,/test_valid\[maximum\]/);
 for(const order of [['test_fresh_cursor','test_reads_file'],['test_reads_file','test_fresh_cursor']]){
  const result=pytest(dir,order.map(name=>'test_quantity.py::'+name));assert.equal(result.status,0,result.stdout+result.stderr);assert.match(result.stdout,/2 passed/);
 }
}));
test('yield fixture closes after an intentionally failing body and writes its closure evidence',optional,()=>workspace({'teardown_exercise.py':teardownTests},dir=>{
 const result=pytest(dir,['teardown_exercise.py']);assert.equal(result.status,1,result.stdout+result.stderr);assert.match(result.stdout,/1 failed/);
 const markers=[...new Set(readdirSync(join(dir,'pytest-tmp'),{recursive:true}).filter(name=>String(name).endsWith('closed.marker')).map(name=>realpathSync(join(dir,'pytest-tmp',name))))];assert.equal(markers.length,1);
 assert.equal(readFileSync(markers[0],'utf8'),'True');
}));
test('actual coverage reports agree with the model for both implementations and all suites',optional,()=>{
 for(const version of ['correct','strict'])for(const suite of ['ordinary','branches','boundaries'])workspace({'capacity.py':fitsVersions[version],'test_capacity.py':coverageTestProgram(suite)},dir=>{
  const model=coverageEvidence(version,suite);
  const measured=spawnSync(python,['-m','coverage','run','--branch','--source=capacity','-m','pytest','-q','--basetemp',join(dir,'pytest-tmp'),'test_capacity.py'],{cwd:dir,encoding:'utf8',env,timeout:15000});
  assert.equal(measured.status,model.success?0:1,measured.stdout+measured.stderr);
  const json=spawnSync(python,['-m','coverage','json','-o','coverage.json'],{cwd:dir,encoding:'utf8',env,timeout:10000});assert.equal(json.status,0,json.stdout+json.stderr);
  const data=JSON.parse(readFileSync(join(dir,'coverage.json'),'utf8'));const file=data.files['capacity.py'];assert.ok(file);
  assert.deepEqual(file.executed_lines,model.coveredLines);assert.equal(file.summary.num_statements,4);assert.equal(file.summary.num_branches,2);assert.equal(file.summary.covered_branches,model.coveredBranches.length);
  assert.deepEqual(file.executed_branches.map(([from,to])=>`${from}→${to}`).sort(),model.coveredBranches);
  const combined=100*(file.summary.covered_lines+file.summary.covered_branches)/(file.summary.num_statements+file.summary.num_branches);assert.ok(Math.abs(file.summary.percent_covered-combined)<0.01);
  const report=spawnSync(python,['-m','coverage','report','-m'],{cwd:dir,encoding:'utf8',env,timeout:10000});assert.equal(report.status,0,report.stdout+report.stderr);assert.match(report.stdout,/capacity.py/);
 });
});
test('monkeypatch restores environment even within one Python process after pytest exits',optional,()=>workspace({'quantity.py':quantityModule,'test_quantity.py':quantityTests},dir=>{
 assert.equal(run(dir,`import os, pytest\nos.environ["ACADEMY_LIMIT"] = "9"\ncode=pytest.main(["-q","--basetemp",${JSON.stringify(join(dir,'pytest-tmp'))},"test_quantity.py::test_configuration"])\nassert code == 0\nassert os.environ["ACADEMY_LIMIT"] == "9"\nprint("restored")`).split('\n').at(-1),'restored');
}));
test('test discovery distinguishes an empty collection from an executed passing test',optional,()=>workspace({'empty_case.py':'value = 3\n'},dir=>{
 const result=pytest(dir,['empty_case.py']);assert.equal(result.status,5,result.stdout+result.stderr);assert.match(result.stdout,/no tests ran/);
}));
test('quantity helpers preserve external-input and output contracts independently of pytest assertions',()=>workspace({'quantity.py':quantityModule},dir=>{
 assert.equal(run(dir,'from quantity import parse_quantity\nassert parse_quantity("1") == 1\nassert parse_quantity("100") == 100\nfor raw in ["0","101","bad",""]:\n    try:\n        parse_quantity(raw)\n    except ValueError:\n        continue\n    raise AssertionError("invalid text accepted")\nfor raw in [True,3,None]:\n    try:\n        parse_quantity(raw)\n    except TypeError:\n        continue\n    raise AssertionError("wrong representation accepted")\nprint("verified")'),'verified');
}));
test('inventory transfer executes parameterized grammar/range and real malformed-file expectations',optional,()=>workspace({
 'inventory.py':String.raw`import re
P = re.compile(r"item=(?P<item>[a-z]{1,8}) qty=(?P<qty>[0-9]{1,3})")
def parse_line(raw, number):
    body = raw[:-2] if raw.endswith("\r\n") else raw[:-1] if raw.endswith("\n") else raw
    match = P.fullmatch(body)
    if match is None:
        raise ValueError(f"line {number}: format")
    qty = int(match.group("qty"))
    if not 1 <= qty <= 100:
        raise ValueError(f"line {number}: range")
    return qty
def report(source):
    rows = total = 0
    for number, raw in enumerate(source,1):
        total += parse_line(raw,number)
        rows += 1
    return rows,total
`,
 'test_inventory.py':String.raw`import pytest
from inventory import parse_line, report
@pytest.mark.parametrize("raw,expected",[("item=bolt qty=1",1),("item=nut qty=100",100),("item=bolt qty=003",3)])
def test_valid(raw,expected):
    assert parse_line(raw,1) == expected
@pytest.mark.parametrize("raw",["item=bolt qty=0","item=bolt qty=101","item=bolt qty=True","item=bolt qty=1 trailing","item=bolt","item=abcdefghi qty=1"])
def test_reject(raw):
    with pytest.raises(ValueError):
        parse_line(raw,2)
def test_file(tmp_path):
    path=tmp_path/"input.txt"
    path.write_text("item=bolt qty=3\nitem=nut qty=100\n",encoding="utf-8")
    with path.open(encoding="utf-8") as source:
        assert report(source) == (2,103)
    path.write_text("item=bolt qty=3\nbad\n",encoding="utf-8")
    with path.open(encoding="utf-8") as source:
        with pytest.raises(ValueError,match="line 2: format"):
            report(source)
`},dir=>{
 const result=pytest(dir,['test_inventory.py']);assert.equal(result.status,0,result.stdout+result.stderr);assert.match(result.stdout,/10 passed/);
}));
test('pytest knowledge-check answers are unique and balanced',()=>{
 const counts=[0,0,0];for(const q of pytestQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));
});

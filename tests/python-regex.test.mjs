import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {matchingExample,matchingOutput,escapingExample,escapingOutput,extractionExample,extractionOutput,summaryExample,summaryOutput,operationExample,operationOutput,regexReasoning,parserDefinition,cliProgram,fixtureSetup,regexQuestions} from '../src/data/pythonRegexContent.ts';
import {logRecordTrace} from '../src/utils/logRecordTrace.ts';
const run=(code,input)=>execFileSync('python3',['-c',code],{encoding:'utf8',timeout:10000,input}).trim();
function workspace(fn){const dir=mkdtempSync(join(tmpdir(),'academy-regex-'));try{return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}

test('all standalone regex examples and reasoning variants match Python output',()=>{
 for(const [code,expected] of [[matchingExample,matchingOutput],[escapingExample,escapingOutput],[extractionExample,extractionOutput],[summaryExample,summaryOutput],[operationExample,operationOutput]])assert.equal(run(code),expected);
 for(const variant of regexReasoning.variants)assert.equal(run(variant.code),variant.output);
});
test('grammar scanner agrees with Python fullmatch and domain checks across boundary and mutation cases',()=>{
 const records=new Set(['','\n','\r\n','[INFO] service=api ms=٣','[INFO] service=api ms=１２','🙂'.repeat(81),'[INFO] service=api ms=0\r']);
 for(const level of ['INFO','WARN','ERROR','DEBUG'])for(const service of ['a','api','a'.repeat(12),'a'.repeat(13),'API',''])for(const ms of ['0','0000','2000','2001','9999','10000','-1',''])records.add(`[${level}] service=${service} ms=${ms}`);
 const seed='[WARN] service=api ms=0042';
 for(let index=0;index<=seed.length;index++){
  records.add(seed.slice(0,index)+seed.slice(index+1));
  for(const char of [' ','x','\t','\n','٣',']'])records.add(seed.slice(0,index)+char+seed.slice(index));
 }
 for(const ending of ['','\n','\r\n','\n\n',' ','\t'])records.add(seed+ending);
 records.add('x'.repeat(80));records.add('x'.repeat(81));
 const inputs=[...records];
 const expected=JSON.parse(run(parserDefinition+`
import json, sys
out = []
for raw in json.load(sys.stdin):
    try:
        out.append({"record": parse_line(raw, 1), "error": ""})
    except ValueError as error:
        out.append({"record": None, "error": str(error).split(": ", 1)[1]})
print(json.dumps(out))`,JSON.stringify(inputs)));
 inputs.forEach((raw,index)=>{
  const model=logRecordTrace(raw);assert.deepEqual({record:model.record,error:model.error},expected[index],JSON.stringify(raw));
  assert.equal(model.accepted,model.record!==null);assert.ok(model.frames.length>0);
  const length=Array.from(model.body).length;
  for(const frame of model.frames)assert.ok(frame.cursor>=0&&frame.cursor<=length);
  for(let i=1;i<model.frames.length;i++)assert.ok(model.frames[i].cursor>=model.frames[i-1].cursor);
  if(model.accepted)assert.equal(model.frames.at(-1).phase,'Accept record');else assert.equal(model.frames.at(-1).rejected,true);
 });
});
test('parser preserves whitespace and physical lines while allowing only declared terminators',()=>{
 assert.equal(run(parserDefinition+`
for ending in ["", "\\n", "\\r\\n"]:
    assert parse_line("[INFO] service=a ms=0000" + ending, 1) == {"level":"INFO", "service":"a", "ms":0}
for text in [" [INFO] service=a ms=0", "[INFO] service=a ms=0 ", "[INFO]  service=a ms=0", "[INFO] service=a ms=0\\r", "\\n"]:
    try:
        parse_line(text, 7)
    except ValueError as error:
        assert str(error) == "line 7: invalid record format"
    else:
        raise AssertionError("invalid boundary accepted")
try:
    summarize(["[INFO] service=a ms=0\\n", "\\n"])
except ValueError as error:
    assert str(error).startswith("line 2:")
print("verified")`),'verified');
});
test('summary satisfies independent totals, empty-versus-zero maximum and all-or-error consumption',()=>{
 assert.equal(run(parserDefinition+`
assert summarize([]) == {"records":0, "counts":{"INFO":0,"WARN":0,"ERROR":0}, "total_ms":0,"max_ms":None}
report = summarize(["[INFO] service=a ms=0"])
assert report["max_ms"] == 0 and report["records"] == 1
report = summarize(["[WARN] service=a ms=1", "[WARN] service=b ms=2", "[ERROR] service=c ms=2000"])
assert report == {"records":3,"counts":{"INFO":0,"WARN":2,"ERROR":1},"total_ms":2003,"max_ms":2000}
assert sum(report["counts"].values()) == report["records"]
seen = []
def lines():
    for text in ["[INFO] service=a ms=1", "bad", "[INFO] service=b ms=2"]:
        seen.append(text)
        yield text
try:
    summarize(lines())
except ValueError as error:
    assert str(error).startswith("line 2:")
else:
    raise AssertionError("partial report returned")
assert len(seen) == 2
print("verified")`),'verified');
});
test('bounded file iteration requests a capped size and rejects oversized input without reading the whole line',()=>{
 assert.equal(run(parserDefinition+`
import io
class Probe(io.StringIO):
    def __init__(self, text):
        super().__init__(text)
        self.requests = []
    def readline(self, size=-1):
        self.requests.append(size)
        return super().readline(size)
source = Probe("x" * 10000 + "\\n")
try:
    list(bounded_lines(source))
except ValueError as error:
    assert str(error) == "line 1: record exceeds 80 characters"
assert source.tell() == 83
assert source.requests == [83]
for length in [80, 81]:
    for ending in ["", "\\n", "\\r\\n"]:
        source = Probe("x" * length + ending)
        try:
            summarize(bounded_lines(source))
        except ValueError as error:
            assert ("exceeds" in str(error)) == (length > 80)
        assert all(size == 83 for size in source.requests)
print("verified")`),'verified');
});
test('actual fixture and CLI produce a correct JSON report and preserve existing files',()=>workspace(dir=>{
 writeFileSync(join(dir,'log_parser.py'),cliProgram);writeFileSync(join(dir,'make_fixture.py'),fixtureSetup);
 const setup=spawnSync('python3',['make_fixture.py'],{cwd:dir,encoding:'utf8'});assert.equal(setup.status,0,setup.stderr);
 const before=readFileSync(join(dir,'sample.log'));
 assert.equal(before.toString(),'[INFO] service=api ms=12\n[WARN] service=cache ms=40\r\n[ERROR] service=api ms=2000');
 const result=spawnSync('python3',['log_parser.py','sample.log'],{cwd:dir,encoding:'utf8'});assert.equal(result.status,0,result.stderr);assert.equal(result.stderr,'');
 assert.deepEqual(JSON.parse(result.stdout),{records:3,counts:{INFO:1,WARN:1,ERROR:1},total_ms:2052,max_ms:2000});assert.deepEqual(readFileSync(join(dir,'sample.log')),before);
 const repeated=spawnSync('python3',['make_fixture.py'],{cwd:dir,encoding:'utf8'});assert.notEqual(repeated.status,0);assert.deepEqual(readFileSync(join(dir,'sample.log')),before);
 const help=spawnSync('python3',['log_parser.py','--help'],{cwd:dir,encoding:'utf8'});assert.equal(help.status,0);assert.match(help.stdout,/path/);
}));
test('CLI failures have nonzero status, useful diagnostics and no successful stdout',()=>workspace(dir=>{
 writeFileSync(join(dir,'log_parser.py'),cliProgram);
 const fixtures={'bad.log':'[INFO] service=a ms=1\nwrong\n','range.log':'[INFO] service=a ms=2001','long.log':'x'.repeat(10000),'invalid.log':Buffer.from([255])};
 for(const [name,data] of Object.entries(fixtures))writeFileSync(join(dir,name),data);
 for(const name of [...Object.keys(fixtures),'missing.log']){
  const result=spawnSync('python3',['log_parser.py',name],{cwd:dir,encoding:'utf8'});assert.equal(result.status,2,result.stderr);assert.equal(result.stdout,'');assert.match(result.stderr,/error:/);assert.ok(result.stderr.endsWith('\n'));
  if(name==='bad.log')assert.match(result.stderr,/line 2:/);
 }
 writeFileSync(join(dir,'empty.log'),'');const empty=spawnSync('python3',['log_parser.py','empty.log'],{cwd:dir,encoding:'utf8'});assert.equal(empty.status,0);assert.equal(JSON.parse(empty.stdout).max_ms,null);
 const usage=spawnSync('python3',['log_parser.py'],{cwd:dir,encoding:'utf8'});assert.equal(usage.status,2);assert.equal(usage.stdout,'');
}));
test('scanner snapshots retain earlier captures without treating a later failure as acceptance',()=>{
 const model=logRecordTrace('[INFO] service=api ms=2001');
 assert.equal(model.accepted,false);assert.equal(model.frames.at(-1).captures.ms,2001);
 const level=model.frames.find(f=>f.phase==='Capture level');assert.deepEqual(level.captures,{level:'INFO'});
 const suffix=logRecordTrace('[INFO] service=api ms=12 trailing');assert.equal(suffix.accepted,false);assert.equal(suffix.frames.at(-1).captures.ms,undefined);
 assert.equal(logRecordTrace('[INFO] service=api ms=0').record.ms,0);
});
test('inventory transfer uses an independent grammar and nonzero domain, retaining complete-report semantics',()=>{
 assert.equal(run(String.raw`import re
P = re.compile(r"item=(?P<item>[a-z]{1,8}) qty=(?P<qty>[0-9]{1,3})")
def parse(raw, number):
    body = raw[:-2] if raw.endswith("\r\n") else raw[:-1] if raw.endswith("\n") else raw
    m = P.fullmatch(body)
    if m is None:
        raise ValueError(f"line {number}: format")
    qty = int(m.group("qty"))
    if not 1 <= qty <= 100:
        raise ValueError(f"line {number}: range")
    return qty
def report(lines):
    rows = total = 0
    for number, raw in enumerate(lines, 1):
        total += parse(raw, number)
        rows += 1
    return rows, total
assert report([]) == (0, 0)
assert report(["item=bolt qty=003\n", "item=nut qty=100\r\n"]) == (2, 103)
for raw in ["item=bolt qty=0", "item=bolt qty=101", "item=bolt qty=True", "item=abcdefghi qty=1", " item=bolt qty=1", "item=bolt  qty=1", "item=bolt qty=1 trailing", "item=bolt", ""]:
    try:
        report(["item=nut qty=1", raw])
    except ValueError as error:
        assert str(error).startswith("line 2:")
    else:
        raise AssertionError("invalid report")
print("verified")`),'verified');
});
test('regex knowledge check has unique correct answers and varied positions',()=>{
 const counts=[0,0,0];for(const q of regexQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));
});

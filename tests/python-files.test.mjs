import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileExamples,fileReasoning,fileQuestions,minuteFileParser,fileReportBoundary,fileFixtureSetup,invalidUtf8Fixture} from '../src/data/pythonFilesContent.ts';
import {fileReadModel,fileTraceCases} from '../src/utils/pythonFileTrace.ts';
function workspace(files,fn){const dir=mkdtempSync(join(tmpdir(),'academy-files-'));try{for(const[name,data]of Object.entries(files))writeFileSync(join(dir,name),data);return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const run=(dir,code)=>execFileSync('python3',['-c',code],{cwd:dir,encoding:'utf8',timeout:5000,env:{...process.env,PYTHONIOENCODING:'utf-8'}}).trim();
test('file examples and record-loss contrasts execute with documented outputs',()=>{
 for(const e of [...fileExamples,...fileReasoning.variants]) workspace({},dir=>{if(e.fixtures)run(dir,fileFixtureSetup(e.fixtures));assert.equal(run(dir,e.code),e.output,e.title);});
});
test('lifecycle model matches Python for valid, invalid and empty existing files',()=>{
 for(const item of fileTraceCases){const model=fileReadModel(item.id);workspace({'minutes.txt':model.fixture},dir=>assert.equal(run(dir,model.code),model.frames.at(-1).output));assert.deepEqual(model,fileReadModel(item.id));assert.ok(model.frames.at(-1).names.includes('source.closed → True'));}
 assert.throws(()=>fileReadModel('missing'),RangeError);
});
test('parser preserves physical line numbers, zero records and source bytes',()=>{
 workspace({'minutes.txt':'20\n\n0\n30\n','empty.txt':'','blank.txt':'\n \n','bad.txt':'20\n\nbad\n','range.txt':'61\n'},dir=>{
  assert.equal(run(dir,minuteFileParser+'\nassert summarize_minutes("minutes.txt") == (3,50)\nassert summarize_minutes("empty.txt") == (0,0)\nassert summarize_minutes("blank.txt") == (0,0)\nfor path, message in [("bad.txt", "Line 3: enter whole minutes"),("range.txt", "Line 1: use minutes from 0 to 60")]:\n    try:\n        summarize_minutes(path)\n    except ValueError as error:\n        assert str(error) == message\n    else:\n        raise AssertionError("invalid file accepted")\nprint("verified")'),'verified');
  assert.equal(readFileSync(join(dir,'minutes.txt'),'utf8'),'20\n\n0\n30\n');
 });
});
test('report boundary distinguishes empty, malformed, undecodable and missing inputs',()=>{
 for(const [fixture,expected]of [[{},'No report: input file is missing'],[{'minutes.txt':Buffer.from([255])},'No report: input must be UTF-8'],[{'minutes.txt':'bad\n'},'No report: Line 1: enter whole minutes'],[{'minutes.txt':''},'Records: 0\nTotal minutes: 0']])workspace(fixture,dir=>assert.equal(run(dir,minuteFileParser+'\n\n'+fileReportBoundary),expected));
});
test('displayed invalid-byte fixture triggers the specific decoding diagnostic',()=>{
 workspace({},dir=>{run(dir,invalidUtf8Fixture);assert.deepEqual([...readFileSync(join(dir,'minutes.txt'))],[255]);assert.equal(run(dir,minuteFileParser+'\n\n'+fileReportBoundary),'No report: input must be UTF-8');});
});
test('exclusive create preserves existing content and truncating mode is not rollback',()=>{
 workspace({},dir=>{run(dir,fileExamples[2].code);const result=spawnSync('python3',['-c',fileExamples[2].code],{cwd:dir,encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/FileExistsError/);assert.equal(readFileSync(join(dir,'report.txt'),'utf8'),'First\nSecond\n');});
 workspace({'report.txt':'valuable fixture\n'},dir=>{const result=spawnSync('python3',['-c','with open("report.txt", "w", encoding="utf-8") as target:\n    raise ValueError("later failure")'],{cwd:dir,encoding:'utf8'});assert.notEqual(result.status,0);assert.equal(readFileSync(join(dir,'report.txt'),'utf8'),'');});
});
test('quantity transfer changes the range and keeps file/decode failures explicit',()=>{
 const definition=minuteFileParser.replace('summarize_minutes','summarize_quantities').replace('value < 0 or value > 60','value < 1 or value > 100');
 workspace({'good.txt':'1\n100\n','empty.txt':'','zero.txt':'0\n','decimal.txt':'2.5\n','bad.txt':'1\n\nbad\n','bytes.txt':Buffer.from([255])},dir=>{
  assert.equal(run(dir,definition+'\nassert summarize_quantities("good.txt") == (2,101)\nassert summarize_quantities("empty.txt") == (0,0)\nfor path in ["zero.txt", "decimal.txt", "bad.txt"]:\n    try:\n        summarize_quantities(path)\n    except ValueError as error:\n        if path == "bad.txt":\n            assert str(error).startswith("Line 3:")\n    else:\n        raise AssertionError("invalid input accepted")\ntry:\n    summarize_quantities("bytes.txt")\nexcept UnicodeDecodeError:\n    pass\nelse:\n    raise AssertionError("decode failure hidden")\ntry:\n    summarize_quantities("missing.txt")\nexcept FileNotFoundError:\n    print("verified")'),'verified');
 });
});
test('file quiz has unique correct answers and varied positions',()=>{const counts=[0,0,0];for(const q of fileQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));});

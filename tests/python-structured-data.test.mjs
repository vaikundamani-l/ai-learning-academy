import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {structuredExamples,structuredQuestions,syntaxReasoning,limitedCsvParser,sessionValidator,csvSessionsDefinition,csvFileWriter,jsonFileWriter} from '../src/data/pythonStructuredDataContent.ts';
import {limitedCsvModel} from '../src/utils/limitedCsvTrace.ts';
function workspace(files,fn){const dir=mkdtempSync(join(tmpdir(),'academy-structured-'));try{for(const[name,data]of Object.entries(files))writeFileSync(join(dir,name),data);return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const run=(dir,code)=>execFileSync('python3',['-c',code],{cwd:dir,encoding:'utf8',timeout:5000,env:{...process.env,PYTHONPATH:'',PYTHONIOENCODING:'utf-8'}}).trim();
test('CSV/JSON examples and syntax/schema contrasts match Python output',()=>{for(const e of [...structuredExamples,...syntaxReasoning.variants])workspace({},dir=>assert.equal(run(dir,e.code),e.output,e.title));});
test('restricted CSV trace matches its Python implementation on accepted and rejected inputs',()=>{
 const cases=['"Lee, Ada",25,"said ""hi"""','Ada,25','"Ada, Lee",25','""',',','Ada,,','"a""b",2','"Ada,25','a"b,2','"a" x,2','a\nb','', 'a'.repeat(181),'é,2'];
 workspace({'record_parser.py':limitedCsvParser},dir=>{for(const text of cases){const model=limitedCsvModel(text);assert.equal(run(dir,model.code),model.frames.at(-1).output,JSON.stringify(text));assert.deepEqual(model,limitedCsvModel(text));assert.ok(model.frames.slice(0,-1).every(f=>f.output===''));}});
 assert.deepEqual(limitedCsvModel('Ada,,').fields,['Ada','','']);assert.equal(limitedCsvModel('"Ada,25').fields,null);
});
test('accepted restricted records agree with the standard CSV reader on field content',()=>{
 workspace({'record_parser.py':limitedCsvParser},dir=>assert.equal(run(dir,'import csv\nfrom io import StringIO\nfrom record_parser import parse_record\nfor text in [\'Ada,25\', \'"Lee, Ada",25\', \'"a""b",2\', \'a,,\', \'""\']:\n    assert parse_record(text) == next(csv.reader(StringIO(text), strict=True))\nprint("verified")'),'verified'));
});
test('session schema rejects wrong shapes, missing/extra fields, booleans and invalid ranges',()=>{
 workspace({},dir=>assert.equal(run(dir,sessionValidator+'\nfor value in [{"name":"Ada","minutes":0},{"name":" Ada ","minutes":60}]:\n    assert validate_session(value) is value\nfor value in [[], None, {}, {"name":"", "minutes":1}, {"name":"Ada", "minutes":True}, {"name":"Ada", "minutes":"25"}, {"name":"Ada", "minutes":25.0}, {"name":"Ada", "minutes":None}, {"name":"Ada", "minutes":-1}, {"name":"Ada", "minutes":61}, {"name":"Ada", "minutes":1, "extra":2}]:\n    try:\n        validate_session(value)\n    except ValueError:\n        continue\n    raise AssertionError("invalid record accepted")\nprint("verified")'),'verified'));
});
test('CSV importer handles quoted records and rejects headers, widths and invalid rows',()=>{
 workspace({'valid.csv':'name,minutes\n"Lee, Ada",25\n','multiline.csv':'name,minutes\n"Ada\nLee",20\n','header.csv':'name,minutes\n','empty.csv':'','duplicate.csv':'name,name\nAda,Ada\n','short.csv':'name,minutes\nAda\n','long.csv':'name,minutes\nAda,25,extra\n','bad.csv':'name,minutes\nAda,bad\n','range.csv':'name,minutes\nAda,61\n','quote.csv':'name,minutes\n"Ada,25\n'},dir=>assert.equal(run(dir,csvSessionsDefinition+'\nassert load_sessions_csv("valid.csv") == [{"name":"Lee, Ada", "minutes":25}]\nassert load_sessions_csv("multiline.csv")[0]["name"] == "Ada\\nLee"\nassert load_sessions_csv("header.csv") == []\nfor path in ["empty.csv","duplicate.csv","short.csv","long.csv","bad.csv","range.csv","quote.csv"]:\n    try:\n        load_sessions_csv(path)\n    except (ValueError, csv.Error):\n        continue\n    raise AssertionError("bad CSV accepted")\nprint("verified")'),'verified'));
});
test('serializer examples round trip through real files and preserve the intended values',()=>{
 workspace({},dir=>{assert.equal(run(dir,csvFileWriter),"[['name', 'minutes'], ['Lee, Ada', '25']]");assert.equal(run(dir,jsonFileWriter),'Round trip passed');});
});
test('quantity transfer adapts the common validator and CSV adapter to a nonzero range',()=>{
 const validate=sessionValidator.replaceAll('validate_session','validate_quantity').replaceAll('"name"','"item"').replaceAll('"minutes"','"quantity"').replace(' < 0 or ', ' < 1 or ').replace(' > 60:', ' > 100:');
 workspace({},dir=>assert.equal(run(dir,validate+'\nfor value in [{"item":"pen","quantity":1},{"item":"pen","quantity":100}]:\n    assert validate_quantity(value) == value\nfor value in [{"item":"pen","quantity":0},{"item":"pen","quantity":True},{"item":"pen","quantity":"3"},{"quantity":3},{"item":"pen","quantity":3,"extra":0},[]]:\n    try:\n        validate_quantity(value)\n    except ValueError:\n        continue\n    raise AssertionError("invalid quantity accepted")\nprint("verified")'),'verified'));
 const adapter=csvSessionsDefinition.replaceAll('validate_session','validate_quantity').replaceAll('load_sessions_csv','load_quantities_csv').replaceAll('"name"','"item"').replaceAll('"minutes"','"quantity"').replace(' < 0 or ', ' < 1 or ').replace(' > 60:', ' > 100:');
 workspace({'input.csv':'item,quantity\n"pen, blue",3\n'},dir=>assert.equal(run(dir,adapter+'\nassert load_quantities_csv("input.csv") == [{"item":"pen, blue","quantity":3}]\nprint("verified")'),'verified'));
});
test('structured-data quiz has unique answers and varied positions',()=>{const counts=[0,0,0];for(const q of structuredQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));});
test('JSON syntax, duplicate-key defaults and non-finite policy match the stated limits',()=>{
 workspace({},dir=>assert.equal(run(dir,'import json\nfor text in ["{bad}", \'{"x":1,}\']:\n    try:\n        json.loads(text)\n    except json.JSONDecodeError:\n        continue\n    raise AssertionError("invalid JSON accepted")\nassert json.loads(\'{"x":1,"x":2}\')["x"] == 2\nvalue = json.loads("NaN")\nassert value != value\ntry:\n    json.dumps(value, allow_nan=False)\nexcept ValueError:\n    print("verified")'),'verified'));
});
test('short record combinations agree across the trace, Python parser and accepted standard CSV rows',()=>{
 const cases=[''];let batch=[''];for(let length=1;length<=4;length++){batch=batch.flatMap(prefix=>['a',',','"',' '].map(char=>prefix+char));cases.push(...batch);}
 const expected=cases.map(text=>{const model=limitedCsvModel(text);return {text,fields:model.fields,error:model.error};});
 workspace({'record_parser.py':limitedCsvParser},dir=>{
  const script='import csv, json, sys\nfrom io import StringIO\nfrom record_parser import parse_record\nfor item in json.load(sys.stdin):\n    try:\n        fields = parse_record(item["text"])\n    except ValueError as error:\n        assert str(error) == item["error"]\n        assert item["fields"] is None\n    else:\n        assert item["error"] is None\n        assert fields == item["fields"]\n        assert fields == next(csv.reader(StringIO(item["text"]), strict=True))\nprint("verified")';
  assert.equal(execFileSync('python3',['-c',script],{cwd:dir,input:JSON.stringify(expected),encoding:'utf8',timeout:5000,env:{...process.env,PYTHONPATH:''}}).trim(),'verified');
 });
});

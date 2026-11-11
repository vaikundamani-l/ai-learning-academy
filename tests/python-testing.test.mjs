import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {budgetVersions,budgetTestDefinition,budgetLogDefinition,loggingApp,loggingOutput,debuggerCase,debuggerCommands,testingReasoning,testingQuestions} from '../src/data/pythonTestingContent.ts';
import {budgetTestModel} from '../src/utils/pythonTestTrace.ts';
function workspace(files,fn){const dir=mkdtempSync(join(tmpdir(),'academy-testing-'));try{for(const[name,data]of Object.entries(files))writeFileSync(join(dir,name),data);return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
const env={...process.env,PYTHONPATH:'',PYTHONIOENCODING:'utf-8',PYTHONBREAKPOINT:'pdb.set_trace'};
const run=(dir,code)=>execFileSync('python3',['-c',code],{cwd:dir,encoding:'utf8',timeout:5000,env}).trim();
test('modeled test outcomes match real unittest runs across all selections and defects',()=>{
 for(const version of ['correct','strict','unguarded']) workspace({'budget_model.py':budgetVersions[version],'test_budget.py':budgetTestDefinition},dir=>{
  for(const selection of ['ordinary','boundaries']){const model=budgetTestModel(version,selection);assert.equal(run(dir,model.code),model.frames.at(-1).output);assert.deepEqual(model,budgetTestModel(version,selection));}
 });
 assert.equal(budgetTestModel('strict','ordinary').success,true);assert.equal(budgetTestModel('strict','boundaries').errors,2);assert.equal(budgetTestModel('unguarded','boundaries').failures,1);assert.throws(()=>budgetTestModel('unknown','ordinary'),RangeError);
});
test('displayed unittest command exits successfully only for the correct helper',()=>{
 for(const version of ['correct','strict','unguarded'])workspace({'budget_model.py':budgetVersions[version],'test_budget.py':budgetTestDefinition},dir=>{const result=spawnSync('python3',['-m','unittest','-v','test_budget'],{cwd:dir,encoding:'utf8',timeout:5000,env});assert.equal(result.status,version==='correct'?0:1);assert.match(result.stderr,/Ran 4 tests/);if(version==='strict')assert.match(result.stderr,/errors=2/);if(version==='unguarded')assert.match(result.stderr,/failures=1/);});
});
test('framework checks still catch the removed guard under optimized execution',()=>{
 workspace({'budget_model.py':budgetVersions.unguarded,'test_budget.py':budgetTestDefinition},dir=>{const result=spawnSync('python3',['-O','-m','unittest','test_budget'],{cwd:dir,encoding:'utf8',timeout:5000,env});assert.equal(result.status,1);assert.match(result.stderr,/ValueError not raised/);});
});
test('reasoning variants match their expected and actual values',()=>{for(const e of testingReasoning.variants)workspace({},dir=>assert.equal(run(dir,e.code),e.output));});
test('logging output, level filtering and re-raised rejection match the lesson',()=>{
 workspace({'budget_model.py':budgetVersions.correct,'budget_logged.py':budgetLogDefinition},dir=>{
  assert.equal(run(dir,loggingApp),loggingOutput);
  const debug=run(dir,loggingApp.replace('level=logging.INFO','level=logging.DEBUG'));assert.match(debug,/DEBUG:budget_logged:attempt minutes=5 remaining=20/);assert.match(debug,/DEBUG:budget_logged:attempt minutes=30 remaining=15/);
  assert.equal(run(dir,'import unittest\nfrom budget_model import Budget\nfrom budget_logged import attempt\ncase = unittest.TestCase()\nbudget = Budget(20)\nbudget.add(5)\nwith case.assertLogs("budget_logged", level="WARNING") as captured:\n    with case.assertRaises(ValueError):\n        attempt(budget, 30)\ncase.assertEqual(budget.total(), 5)\ncase.assertEqual(len(captured.output), 1)\nprint("verified")'),'verified');
 });
});
test('debugger exercise exposes the documented state and resumes to the correct result',()=>{
 workspace({'budget_model.py':budgetVersions.correct,'debug_case.py':debuggerCase},dir=>{const result=spawnSync('python3',['debug_case.py'],{cwd:dir,input:debuggerCommands+'\n',encoding:'utf8',timeout:5000,env});assert.equal(result.status,0);assert.match(result.stdout,/\(Pdb\) 5/);assert.equal((result.stdout.match(/\(Pdb\) 15/g)||[]).length,2);assert.match(result.stdout,/Remaining: 0/);});
});
test('stock transfer unittest checks zero requests, boundaries and independent state',()=>{
 const stock='class StockItem:\n    def __init__(self, name, quantity):\n        if type(name) is not str or not name.strip():\n            raise ValueError("invalid name")\n        if type(quantity) is not int:\n            raise TypeError("invalid quantity type")\n        if quantity < 0 or quantity > 100:\n            raise ValueError("invalid quantity")\n        self._quantity = quantity\n    def take(self, amount):\n        if type(amount) is not int:\n            raise TypeError("invalid amount type")\n        if amount < 1 or amount > self._quantity:\n            raise ValueError("invalid withdrawal")\n        self._quantity = self._quantity - amount\n    def remaining(self):\n        return self._quantity\n\nclass OrderDesk:\n    def __init__(self, stock, recorder):\n        self._stock = stock\n        self._recorder = recorder\n    def request(self, amount):\n        self._stock.take(amount)\n        self._recorder.record(amount)';
 const tests='import unittest\nfrom stock import StockItem, OrderDesk\nclass FailingRecorder:\n    def record(self, amount):\n        raise RuntimeError("failed")\nclass StockTests(unittest.TestCase):\n    def test_boundaries_and_types(self):\n        item = StockItem("pen",3)\n        item.take(2)\n        self.assertEqual(item.remaining(),1)\n        for amount in [2,0]:\n            with self.assertRaises(ValueError):\n                item.take(amount)\n            self.assertEqual(item.remaining(),1)\n        with self.assertRaises(TypeError):\n            item.take(True)\n        item.take(1)\n        self.assertEqual(item.remaining(),0)\n    def test_independent_state(self):\n        a = StockItem("pen",3)\n        b = StockItem("pen",3)\n        a.take(1)\n        self.assertEqual(b.remaining(),3)\n    def test_recorder_failure(self):\n        stock = StockItem("pen",3)\n        desk = OrderDesk(stock, FailingRecorder())\n        with self.assertRaises(RuntimeError):\n            desk.request(2)\n        self.assertEqual(stock.remaining(),1)\nif __name__ == "__main__":\n    unittest.main()';
 workspace({'stock.py':stock,'test_stock.py':tests},dir=>{const result=spawnSync('python3',['-m','unittest','-v','test_stock'],{cwd:dir,encoding:'utf8',timeout:5000,env});assert.equal(result.status,0);assert.match(result.stderr,/Ran 3 tests/);});
});
test('testing quiz has unique correct answers and varied positions',()=>{const counts=[0,0,0];for(const q of testingQuestions){assert.equal(q.options.filter(o=>o.isCorrect).length,1);counts[q.options.findIndex(o=>o.isCorrect)]++;}assert.ok(counts.every(n=>n>=3&&n<=4));});

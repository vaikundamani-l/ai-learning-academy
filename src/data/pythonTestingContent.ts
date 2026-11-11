import {budgetClassDefinition} from './pythonClassesContent.ts';
import type {ReasoningChallengeData} from './pythonReasoningChallenges';
export const budgetVersions={
 correct:budgetClassDefinition,
 strict:budgetClassDefinition.replace('self._used + minutes > self._limit','self._used + minutes >= self._limit'),
 unguarded:budgetClassDefinition.replace('if self._used + minutes > self._limit:', 'if False:'),
};
export const budgetTestDefinition=`import unittest
from budget_model import Budget


class BudgetTests(unittest.TestCase):
    def test_ordinary(self):
        budget = Budget(20)
        budget.add(5)
        budget.add(10)
        self.assertEqual(budget.total(), 15)
        self.assertEqual(budget.remaining(), 5)

    def test_exact_limit(self):
        budget = Budget(20)
        budget.add(5)
        budget.add(15)
        self.assertEqual(budget.remaining(), 0)

    def test_over_limit(self):
        budget = Budget(20)
        budget.add(5)
        with self.assertRaises(ValueError):
            budget.add(16)
        self.assertEqual(budget.total(), 5)
        self.assertEqual(budget.remaining(), 15)

    def test_zero(self):
        budget = Budget(0)
        budget.add(0)
        self.assertEqual(budget.remaining(), 0)


if __name__ == "__main__":
    unittest.main()`;
export const budgetLogDefinition=`import logging

logger = logging.getLogger(__name__)


def attempt(budget, minutes):
    logger.debug("attempt minutes=%s remaining=%s", minutes, budget.remaining())
    try:
        budget.add(minutes)
    except ValueError:
        logger.warning("rejected minutes=%s remaining=%s", minutes, budget.remaining())
        raise
    logger.info("accepted minutes=%s total=%s", minutes, budget.total())`;
export const loggingApp='import logging\nimport sys\nfrom budget_model import Budget\nfrom budget_logged import attempt\n\nlogging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s", stream=sys.stdout)\nbudget = Budget(20)\nattempt(budget, 5)\ntry:\n    attempt(budget, 30)\nexcept ValueError:\n    print("Action rejected")\nprint("Remaining:", budget.remaining())';
export const loggingOutput='INFO:budget_logged:accepted minutes=5 total=5\nWARNING:budget_logged:rejected minutes=30 remaining=15\nAction rejected\nRemaining: 15';
export const debuggerCase='from budget_model import Budget\n\nbudget = Budget(20)\nbudget.add(5)\namount = 15\nbreakpoint()\nbudget.add(amount)\nprint("Remaining:", budget.remaining())';
export const debuggerCommands='p budget.total()\np amount\np budget.remaining()\ncontinue';
export const testingReasoning:ReasoningChallengeData={id:'unseen-boundary',title:'What does a passing ordinary example actually tell you?',question:'Both versions use the same faulty fits function. Predict the expected/actual values and explain which input distinguishes the intended contract from this implementation.',transfer:'Change amount to 16, then 0 with used and limit both zero. Which cases reveal the missing equality case? A test can only distinguish behavior exercised by its input.',variants:[
 {title:'Ordinary input only',code:'def fits(used, amount, limit):\n    return used + amount < limit\n\nprint("Expected:", True)\nprint("Actual:", fits(5, 10, 20))',output:'Expected: True\nActual: True',steps:['5 + 10 is 15, strictly below 20, so this faulty condition agrees with the expected ordinary result.','This input gives no evidence about equality at the limit.','An observed success for one input is narrower than a claim that every allowed input works.']},
 {title:'An exact-limit input',code:'def fits(used, amount, limit):\n    return used + amount < limit\n\nprint("Expected:", True)\nprint("Actual:", fits(5, 15, 20))',output:'Expected: True\nActual: False',steps:['The contract allows a total equal to the limit, so the independently chosen expected result is True.','The implementation asks 20 < 20 and returns False.','The boundary input distinguishes the bug. Repair the rule from the contract, then keep this case as a regression test.']},
]};
const checks:[string,string[],number,string][]=[
 ['Why is one passing ordinary test insufficient here?',['All tests are useless','It never exercises equality at the limit','It changes the program'],1,'A boundary bug can agree with ordinary inputs.'],
 ['Where should an expected result come from?',['The documented contract or independent reasoning','A copy of the implementation’s formula','The most convenient observed output'],0,'A test that mirrors the same mistake may pass for the wrong reason.'],
 ['What does assertRaises(ValueError) check?',['That no exception occurs','Every exception is acceptable','That the protected operation raises a matching ValueError'],2,'It verifies the expected error behavior, not just any crash.'],
 ['How does unittest classify an unexpected ValueError in the exact-limit test?',['A successful test','An error','A skipped test'],1,'The operation raised before the expected assertion could complete.'],
 ['Why create a fresh Budget inside each test?',['To avoid state dependence between tests','To share all previous totals','To guarantee every bug is found'],0,'Tests should not rely on another test running first.'],
 ['Does logging an error automatically re-raise it?', ['Always','Only at DEBUG','No'],2,'The code must explicitly propagate or otherwise handle the exception.'],
 ['Why might DEBUG messages be absent in this INFO-configured example?',['The operation never ran','The configured threshold filters them','Python cannot log numbers'],1,'Filtered diagnostics do not imply the underlying call was skipped.'],
 ['What should you inspect for an unexpected exact-limit rejection?',['Used, amount, limit and the comparison','Only the filename','Only the log color'],0,'Inspect the smallest state and rule explaining the mismatch.'],
 ['Does recording a log make a two-step workflow atomic?', ['Yes','Only in a class','No'],2,'Observability and transaction guarantees are separate concerns.'],
 ['What belongs in the regression after a fix?', ['Only a new screenshot','The smallest failing input plus related boundary cases','No checks after editing'],1,'Preserve the distinguishing example and verify neighboring behavior.'],
];
export const testingQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));

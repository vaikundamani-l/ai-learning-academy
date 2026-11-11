import type {ReasoningChallengeData} from './pythonReasoningChallenges';
export const pytestRequirements='pytest==9.2.0\ncoverage==7.17.2\n';
export type FitsVersion='correct'|'strict';
export type CoverageSuite='ordinary'|'branches'|'boundaries';
export const fitsVersions:Record<FitsVersion,string>={
 correct:'def fits(remaining, requested):\n    if requested > remaining:\n        return False\n    return True',
 strict:'def fits(remaining, requested):\n    if requested >= remaining:\n        return False\n    return True',
};
export const coverageCases=[
 {id:'ordinary',remaining:5,requested:3,expected:true},
 {id:'over',remaining:5,requested:6,expected:false},
 {id:'exact',remaining:5,requested:5,expected:true},
 {id:'zero',remaining:0,requested:0,expected:true},
];
export function coverageTestProgram(suite:CoverageSuite){
 const selected=coverageCases.slice(0,suite==='ordinary'?1:suite==='branches'?2:4);
 return `import pytest
from capacity import fits

@pytest.mark.parametrize("remaining,requested,expected", [
${selected.map(c=>`    pytest.param(${c.remaining}, ${c.requested}, ${c.expected?'True':'False'}, id="${c.id}"),`).join('\n')}
])
def test_fits(remaining, requested, expected):
    assert fits(remaining, requested) is expected`;
}
export const quantityModule = `import os
import sys

def parse_quantity(text):
    if type(text) is not str:
        raise TypeError("quantity text required")
    try:
        value = int(text)
    except ValueError as error:
        raise ValueError("expected integer text") from error
    if not 1 <= value <= 100:
        raise ValueError("quantity outside 1–100")
    return value

def load_quantity(source):
    return parse_quantity(source.read())

def configured_limit():
    return parse_quantity(os.environ.get("ACADEMY_LIMIT", "10"))

def report_quantity(text):
    try:
        value = parse_quantity(text)
    except (TypeError, ValueError) as error:
        print("invalid quantity:", error, file=sys.stderr)
        return 2
    print(value)
    return 0`;
export const quantityTests = `import os
import pytest
from quantity import parse_quantity, load_quantity, configured_limit, report_quantity

@pytest.fixture
def quantity_source(tmp_path):
    path = tmp_path / "quantity.txt"
    path.write_text("3\\n", encoding="utf-8")
    with path.open(encoding="utf-8") as source:
        yield source

def test_reads_file(quantity_source):
    assert not quantity_source.closed
    assert load_quantity(quantity_source) == 3

def test_fresh_cursor(quantity_source):
    assert quantity_source.tell() == 0
    assert load_quantity(quantity_source) == 3
    with pytest.raises(ValueError, match="expected integer text"):
        load_quantity(quantity_source)

@pytest.mark.parametrize("text,expected", [
    pytest.param("1", 1, id="minimum"),
    pytest.param("100", 100, id="maximum"),
    pytest.param("003", 3, id="leading-zero"),
])
def test_valid(text, expected):
    assert parse_quantity(text) == expected

@pytest.mark.parametrize("text,message", [
    ("0", "quantity outside 1–100"),
    ("101", "quantity outside 1–100"),
    ("bad", "expected integer text"),
    ("", "expected integer text"),
])
def test_invalid(text, message):
    with pytest.raises(ValueError) as caught:
        parse_quantity(text)
    assert str(caught.value) == message

@pytest.mark.parametrize("value", [True, 3, None])
def test_wrong_representation(value):
    with pytest.raises(TypeError, match="quantity text required"):
        parse_quantity(value)

@pytest.mark.parametrize("text,code,stdout,stderr_fragment", [
    ("3", 0, "3\\n", ""),
    ("bad", 2, "", "invalid quantity: expected integer text"),
])
def test_output_contract(text, code, stdout, stderr_fragment, capsys):
    assert report_quantity(text) == code
    captured = capsys.readouterr()
    assert captured.out == stdout
    if stderr_fragment:
        assert stderr_fragment in captured.err
    else:
        assert captured.err == ""

def test_configuration(monkeypatch):
    before = os.environ.get("ACADEMY_LIMIT")
    with monkeypatch.context() as scoped:
        scoped.setenv("ACADEMY_LIMIT", "7")
        assert configured_limit() == 7
    assert os.environ.get("ACADEMY_LIMIT") == before`;

export const teardownTests = `import pytest

@pytest.fixture
def opened_source(tmp_path):
    path = tmp_path / "input.txt"
    path.write_text("3", encoding="utf-8")
    source = path.open(encoding="utf-8")
    try:
        yield source
    finally:
        source.close()
        (tmp_path / "closed.marker").write_text(str(source.closed), encoding="utf-8")

def test_deliberate_failure(opened_source):
    assert False, "intentional exercise failure"`;
export const coverageReasoning:ReasoningChallengeData={id:'coverage-oracle',title:'Did running the code verify its answer?',question:'Predict the final line. Both versions call the same defective equality rule with remaining=5 and requested=5. What does executing a statement establish without a distinguishing assertion?',transfer:'Run the two-sided suite on requested 3 and 6. Why can both branches execute without checking equality?',variants:[
 {title:'Execute without checking',code:fitsVersions.strict+'\n\nfits(5, 5)\nprint("Test body finished")',output:'Test body finished',steps:['The defective helper returns False at equality.','The caller discards that result, so no expectation is compared.','Execution evidence says which statements ran. It does not establish the intended result.']},
 {title:'Check the equality contract',code:fitsVersions.strict+'\n\nif fits(5, 5) is not True:\n    print("Equality defect detected")\nelse:\n    print("Case passed")',output:'Equality defect detected',steps:['The expected True comes from the rule that exact available capacity is allowed.','The same defective function returns False.','The independent expectation distinguishes the defect. Both input selection and assertions matter.']},
]};
const checks:[string,string[],number,string][]=[
 ['How does a pytest function request a fixture?', ['By naming it as a parameter','By calling every fixture directly','By adding a global variable'],0,'The runner resolves the named fixture dependency.'],
 ['What does function fixture scope normally provide here?', ['One shared open file for all tests','A fresh fixture lifetime per test case','Automatic database rollback'],1,'Fresh state avoids cursor and mutable-state leakage between cases.'],
 ['What happens to yield-fixture teardown when the test assertion fails?', ['It is always skipped','The assertion becomes success','The runner still attempts teardown after successful setup'],2,'Setup that fails before yielding needs its own acquisition cleanup.'],
 ['What does parametrize add?', ['Automatic exhaustive proof','Separate collected cases for the supplied inputs','Random inputs by default'],1,'Explicit rows become individually reported cases.'],
 ['What is an oracle in this lesson?', ['An independent expected outcome','The same implementation copied into the test','A passing coverage threshold'],0,'Tests need expectations that can distinguish a wrong implementation.'],
 ['Can both branches be covered while an equality defect survives?', ['No','Only with skipped tests','Yes'],2,'Inputs on either side can miss the distinguishing boundary.'],
 ['Does monkeypatch replace all need for real integration checks?', ['Yes','No','Only on Linux'],1,'The patched boundary and the real external integration are different evidence.'],
 ['What does capsys check in the shown output test?', ['Real HTTP delivery','An operating-system process exit','Captured stdout/stderr from the in-process function'],2,'The returned code is checked separately; a subprocess integration remains distinct.'],
 ['Does tmp_path promise all test files vanish immediately after a test?', ['No; retention/cleanup policy is separate','Always','Only if the test passed'],0,'Isolation and handle teardown differ from directory retention.'],
 ['What should a known missing optional tool check be reported as?', ['Passed automatically','Skipped, with its unverified integration explicit','A learner mastery result'],1,'Skipped coverage is not executed evidence.'],
];
export const pytestQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));

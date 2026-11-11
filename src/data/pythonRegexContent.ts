import type {ReasoningChallengeData} from './pythonReasoningChallenges';

export const logPattern = String.raw`\[(?P<level>INFO|WARN|ERROR)\] service=(?P<service>[a-z]{1,12}) ms=(?P<ms>[0-9]{1,4})`;
export const matchingExample = String.raw`import re

pattern = re.compile(r"ms=([0-9]+)")
text = "prefix ms=12 trailing"
found = pattern.search(text)
print(found.group(1), found.span())
print(pattern.match(text))
print(pattern.fullmatch("ms=12 trailing"))
print(pattern.fullmatch("ms=12").group(1))`;
export const matchingOutput = '12 (7, 12)\nNone\nNone\n12';
export const escapingExample = String.raw`import re

print(bool(re.fullmatch(r"v1.2", "v1x2")))
print(bool(re.fullmatch(r"v1\.2", "v1x2")))
print(bool(re.fullmatch(r"v1\.2", "v1.2")))
print(bool(re.fullmatch(r"\d+", "٣")))
print(bool(re.fullmatch(r"[0-9]+", "٣")))`;
export const escapingOutput = 'True\nFalse\nTrue\nTrue\nFalse';
export const extractionExample = `import re

pattern = re.compile(r"${logPattern}")
match = pattern.fullmatch("[WARN] service=api ms=0042")
if match is None:
    raise ValueError("invalid record")
print(match.groupdict())
print(int(match.group("ms")))`;
export const extractionOutput = "{'level': 'WARN', 'service': 'api', 'ms': '0042'}\n42";

export const parserDefinition = `import re

MAX_BODY = 80
RECORD = re.compile(r"${logPattern}")

def parse_line(raw, number):
    if raw.endswith("\\r\\n"):
        body = raw[:-2]
    elif raw.endswith("\\n"):
        body = raw[:-1]
    else:
        body = raw
    if len(body) > MAX_BODY:
        raise ValueError(f"line {number}: record exceeds 80 characters")
    match = RECORD.fullmatch(body)
    if match is None:
        raise ValueError(f"line {number}: invalid record format")
    milliseconds = int(match.group("ms"))
    if milliseconds > 2000:
        raise ValueError(f"line {number}: ms outside 0–2000")
    return {"level": match.group("level"),
            "service": match.group("service"), "ms": milliseconds}

def summarize(lines):
    counts = {"INFO": 0, "WARN": 0, "ERROR": 0}
    records = total_ms = 0
    max_ms = None
    for number, raw in enumerate(lines, start=1):
        record = parse_line(raw, number)
        counts[record["level"]] += 1
        records += 1
        total_ms += record["ms"]
        max_ms = record["ms"] if max_ms is None else max(max_ms, record["ms"])
    return {"records": records, "counts": counts,
            "total_ms": total_ms, "max_ms": max_ms}

def bounded_lines(source):
    number = 0
    while True:
        raw = source.readline(MAX_BODY + 3)
        if not raw:
            return
        number += 1
        if len(raw) > MAX_BODY + 2:
            raise ValueError(f"line {number}: record exceeds 80 characters")
        yield raw`;
export const summaryExample = parserDefinition + `

lines = ["[INFO] service=api ms=12\\n",
         "[WARN] service=cache ms=40\\r\\n",
         "[ERROR] service=api ms=2000"]
print(summarize(lines))
try:
    summarize([lines[0], "[INFO] service=api ms=2001\\n"])
except ValueError as error:
    print("Report failed:", error)`;
export const summaryOutput = "{'records': 3, 'counts': {'INFO': 1, 'WARN': 1, 'ERROR': 1}, 'total_ms': 2052, 'max_ms': 2000}\nReport failed: line 2: ms outside 0–2000";
export const cliSuffix = String.raw`

def main(argv=None):
    import argparse
    import json
    from pathlib import Path

    parser = argparse.ArgumentParser(description="Summarize strict academy log records")
    parser.add_argument("path", type=Path)
    args = parser.parse_args(argv)
    try:
        with args.path.open(encoding="utf-8", newline="") as source:
            report = summarize(bounded_lines(source))
    except (OSError, UnicodeError, ValueError) as error:
        parser.exit(2, f"error: {error}\n")
    print(json.dumps(report, indent=2, sort_keys=True))

if __name__ == "__main__":
    main()`;
export const cliProgram = parserDefinition + cliSuffix;
export const fixtureSetup = String.raw`from pathlib import Path

with Path("sample.log").open("x", encoding="utf-8", newline="") as target:
    target.write("[INFO] service=api ms=12\n")
    target.write("[WARN] service=cache ms=40\r\n")
    target.write("[ERROR] service=api ms=2000")`;
export const operationExample = String.raw`import re

text = "ms=12; ms=7"
print([match.group(1) for match in re.finditer(r"ms=([0-9]+)", text)])
print(re.sub(r"ms=[0-9]+", "ms=<hidden>", text))
needle = "api.v2"
print(bool(re.fullmatch(re.escape(needle), "api.v2")))
print(bool(re.fullmatch(re.escape(needle), "apiXv2")))`;
export const operationOutput = "['12', '7']\nms=<hidden>; ms=<hidden>\nTrue\nFalse";

const reasoningCode = (whole:boolean) => `import re
pattern = re.compile(r"${logPattern}")
text = "prefix [INFO] service=api ms=12 trailing"
print(pattern.${whole?'fullmatch':'search'}(text) is not None)`;
export const regexReasoning:ReasoningChallengeData = {
    id:'regex-search-validation',title:'Did the whole record satisfy the grammar?',
    question:'Predict the boolean. Explain whether a matching fragment is sufficient evidence that the entire record is valid.',
    transfer:'Try a leading space, a trailing newline, and an uppercase service name. Which differences does the parser deliberately normalize, and which should it reject?',
    variants:[
        {title:'Search for a fragment',code:reasoningCode(false),output:'True',steps:['search tries to locate a matching substring within the larger text.','It finds the bracketed fragment even though the prefix and suffix remain.','That proves a fragment matches; it does not validate the record boundary.']},
        {title:'Require the whole record',code:reasoningCode(true),output:'False',steps:['fullmatch requires the pattern to account for the complete string.','The leading and trailing text are not part of this grammar.','The parser removes one allowed line terminator explicitly, then fullmatches the body without trimming other whitespace.']},
    ],
};
const checks:[string,string[],number,string][] = [
 ['Which operation requires the complete record body to match?', ['search','match','fullmatch'],2,'fullmatch checks both ends; search finds a fragment and match starts at the beginning.'],
 ['What does [a-z]{1,12} require here?', ['One to twelve ASCII lowercase letters','Any twelve Unicode characters','Exactly one service'],0,'The range and quantifier bound the service token.'],
 ['What does the raw-string prefix change?', ['It disables regex syntax','It changes Python string-literal escaping','It escapes every regex symbol'],1,'The regex engine still interprets the resulting pattern.'],
 ['Why is [0-9] used instead of default Unicode \\d?', ['It permits negative values','It accepts every numeral','It makes the ASCII digit contract explicit'],2,'The grammar deliberately accepts only ASCII decimal digits.'],
 ['Why can ms=2001 match the pattern but fail the parser?', ['Syntax and domain range are separate checks','The number is not an integer','fullmatch always skips digits'],0,'One to four digits describes shape, not the 0–2000 limit.'],
 ['What should happen to a blank physical line under this contract?', ['Ignore it silently','Reject it with a line number','Count it as INFO'],1,'The grammar requires a complete record on each physical line.'],
 ['When should the CLI print its successful JSON summary?', ['Before parsing','After the first valid line','Only after successful exhaustion of the input'],2,'A later invalid record must not produce a successful partial report.'],
 ['What does max_ms=None mean for an empty file?', ['There is no observed maximum','The maximum was zero','The parser crashed'],0,'No rows is different from a valid zero-millisecond row.'],
 ['Does the visualizer execute arbitrary Python regex patterns?', ['Yes','No, it models one declared grammar','Only when playing'],1,'Its deterministic scanner is checked against this fixed Python parser.'],
 ['Why avoid ambiguous nested repetition on untrusted input?', ['It always matches one character','It makes input Unicode','Backtracking can require excessive work'],2,'Use bounded formats, deliberate input limits and tested patterns.'],
];
export const regexQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));

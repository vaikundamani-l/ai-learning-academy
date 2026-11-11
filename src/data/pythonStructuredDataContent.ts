import type {ReasoningChallengeData} from './pythonReasoningChallenges';
export const limitedCsvParser = `def parse_record(text):
    if not text or len(text) > 180:
        raise ValueError("Use 1 to 180 printable ASCII characters")
    fields = []
    field = ""
    state = "start"
    for position, char in enumerate(text, start=1):
        if char < " " or char > "~":
            raise ValueError("Use printable ASCII on one line")
        if state == "quoted":
            if char == '"':
                state = "afterquote"
            else:
                field = field + char
        elif state == "afterquote":
            if char == '"':
                field = field + '"'
                state = "quoted"
            elif char == ",":
                fields.append(field)
                field = ""
                state = "start"
            else:
                raise ValueError(f"Character {position}: expected comma or end")
        elif char == ",":
            fields.append(field)
            field = ""
            state = "start"
        elif char == '"':
            if state != "start":
                raise ValueError(f"Character {position}: quote inside unquoted field")
            state = "quoted"
        else:
            field = field + char
            state = "plain"
    if state == "quoted":
        raise ValueError("Unclosed quoted field")
    fields.append(field)
    return fields`;
export const sessionValidator = `def validate_session(value):
    if type(value) is not dict:
        raise ValueError("Expected a JSON object")
    if set(value) != {"name", "minutes"}:
        raise ValueError("Expected exactly name and minutes")
    if type(value["name"]) is not str or not value["name"].strip():
        raise ValueError("name must be nonblank text")
    if type(value["minutes"]) is not int:
        raise ValueError("minutes must be an integer, not text or a boolean")
    if value["minutes"] < 0 or value["minutes"] > 60:
        raise ValueError("minutes must be from 0 to 60")
    return value`;
export const structuredExamples = [
 {title:'quoted_fields.py',code:'import csv\nfrom io import StringIO\n\ntext = \'"Lee, Ada",25,"said ""hi"""\'\nprint(text.split(","))\nprint(next(csv.reader(StringIO(text), strict=True)))',output:`['"Lee', ' Ada"', '25', '"said ""hi"""']\n['Lee, Ada', '25', 'said "hi"']`,explanation:'split treats every comma as a boundary, including the comma inside the quoted name. csv.reader interprets the quoting rules and keeps that name in one field. Doubled quotes inside a quoted field decode to one literal quote. StringIO provides a text stream in memory; next requests its first parsed row. The returned fields are strings, so 25 still needs numeric conversion.'},
 {title:'multiline_record.py',code:'import csv\nfrom io import StringIO\n\ntext = \'name,note\\nAda,"first\\nsecond"\\n\'\nreader = csv.reader(StringIO(text, newline=""), strict=True)\nfor row in reader:\n    print(row)\n    print("Physical lines consumed:", reader.line_num)',output:"['name', 'note']\nPhysical lines consumed: 1\n['Ada', 'first\\nsecond']\nPhysical lines consumed: 3",explanation:'The second logical record spans physical lines 2 and 3 because its note contains a quoted newline. A row number is therefore not always a physical line number. reader.line_num reports how many source lines the reader has consumed, not a byte offset or necessarily the start of the current record.'},
 {title:'json_values.py',code:'import json\n\ntext = \'{"name":"Ada","minutes":25,"active":true,"note":null}\'\nvalue = json.loads(text)\nprint(value["name"], value["minutes"])\nprint(value["active"], value["note"])\nprint(json.dumps(value, sort_keys=True))',output:'Ada 25\nTrue None\n{"active": true, "minutes": 25, "name": "Ada", "note": null}',explanation:'loads parses JSON text into Python values. JSON true becomes True and null becomes None. The object becomes a dictionary, while JSON arrays become lists. dumps serializes compatible Python values to JSON text. The s in loads/dumps denotes string-oriented input/output; load/dump operate with a file-like object.'},
 {title:'validate_session.py',code:'import json\n\n'+sessionValidator+'\n\nfor text in [\'{"name":"Ada","minutes":25}\', \'{"name":"Ada","minutes":"25"}\', \'{"name":"Ada","minutes":true}\']:\n    try:\n        session = validate_session(json.loads(text))\n    except ValueError as error:\n        print("Rejected:", error)\n    else:\n        print("Accepted:", session["minutes"])',output:'Accepted: 25\nRejected: minutes must be an integer, not text or a boolean\nRejected: minutes must be an integer, not text or a boolean',explanation:'All three inputs are valid JSON syntax, but only the first satisfies this application contract. type(x) is int deliberately requires the exact integer type: Python bool is a subclass of int, so a loose isinstance(x, int) check would also accept True. The validator does not coerce numeric text, trim the returned name or silently discard unknown keys.'},
];
export const csvFileWriter = 'import csv\n\nwith open("sessions.csv", "x", encoding="utf-8", newline="") as target:\n    writer = csv.writer(target)\n    writer.writerow(["name", "minutes"])\n    writer.writerow(["Lee, Ada", 25])\nwith open("sessions.csv", "r", encoding="utf-8", newline="") as source:\n    rows = list(csv.reader(source, strict=True))\nprint(rows)';
export const jsonFileWriter = 'import json\n\nsession = {"name": "Ada", "minutes": 25}\nwith open("session.json", "x", encoding="utf-8") as target:\n    json.dump(session, target, allow_nan=False)\nwith open("session.json", "r", encoding="utf-8") as source:\n    restored = json.load(source)\nassert restored == session\nprint("Round trip passed")';
export const syntaxReasoning:ReasoningChallengeData={id:'parse-or-validate',title:'Was it parsed, or was it accepted by the application?',question:'Predict each result. Explain why JSON syntax alone cannot decide whether minutes is a valid duration. Both programs parse the same text.',transfer:'Replace the JSON string "25" with the JSON number 25. Then try true and 0. Which values satisfy an exact integer contract, and why is a boolean different?',variants:[
 {title:'Trust successful parsing',code:'import json\nvalue = json.loads(\'{"minutes":"25"}\')\nprint("Accepted:", value["minutes"])',output:'Accepted: 25',steps:['JSON parsing succeeds and produces a dictionary whose minutes value is a string.','print displays its text without quotes, so the output can disguise the wrong type.','Successful syntax parsing is not evidence that the value is suitable for arithmetic or the application range.']},
 {title:'Check the value type',code:'import json\nvalue = json.loads(\'{"minutes":"25"}\')\nif type(value["minutes"]) is not int:\n    print("Rejected: minutes must be an integer")\nelse:\n    print("Accepted:", value["minutes"])',output:'Rejected: minutes must be an integer',steps:['Parsing still succeeds. The next operation checks the actual type rather than its printed appearance.','The value is str, so this branch rejects it.','This check covers the type only; the complete validator also checks object shape, name and the allowed range.']},
]};
const checks:[string,string[],number,string][]=[
 ['Why can split(",") corrupt a quoted CSV row?',['It converts numbers','It treats quoted commas as separators','It rejects every quotation mark'],1,'CSV requires format-aware handling of delimiters inside quoted fields.'],
 ['What are fields from the default csv.reader here?',['Strings','Automatically validated integers','JSON objects'],0,'Convert and validate fields explicitly.'],
 ['Can one CSV record span multiple physical lines?',['No','Only for JSON','Yes, with a quoted newline'],2,'Logical records and physical lines are different.'],
 ['What does JSON null become in Python?',['The string "null"','None','Zero'],1,'JSON and Python use different literal spellings.'],
 ['Does valid JSON guarantee the required fields and types?',['No','Always','Only with indent=2'],0,'A separate application contract must be checked.'],
 ['Why can isinstance(True, int) pass?',['True is JSON text','The parser discarded its type','bool is an int subclass in Python'],2,'An exact int contract may need a type check that excludes bool.'],
 ['Why use newline="" for CSV file objects?',['To remove quoted newlines','To let the CSV layer handle line endings','To convert CSV to bytes'],1,'The csv module handles its own newline rules.'],
 ['What does the scratch parser promise?',['One bounded printable-ASCII record','Every CSV dialect and Unicode file','Arbitrary multiline records'],0,'Its deliberate limits are part of its contract.'],
 ['Does Python JSON loading always reject repeated object keys by default?',['Always','Only for lists','No, later values normally replace earlier ones'],2,'Duplicate-key policy requires deliberate handling when it matters.'],
 ['Is a successful round trip proof of full schema validity?',['Yes','No','Only on Linux'],1,'Round-trip behavior and application validation answer different questions.'],
];
export const structuredQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));

export const csvSessionsDefinition='import csv\n\n'+sessionValidator+'\n\ndef load_sessions_csv(path):\n    sessions = []\n    with open(path, "r", encoding="utf-8", newline="") as source:\n        reader = csv.reader(source, strict=True)\n        if next(reader, None) != ["name", "minutes"]:\n            raise ValueError("Expected the header name,minutes")\n        for row in reader:\n            if len(row) != 2:\n                raise ValueError(f"Record ending at physical line {reader.line_num}: expected two fields")\n            try:\n                minutes = int(row[1])\n                session = validate_session({"name": row[0], "minutes": minutes})\n            except ValueError as error:\n                raise ValueError(f"Record ending at physical line {reader.line_num}: {error}") from error\n            sessions.append(session)\n    return sessions';

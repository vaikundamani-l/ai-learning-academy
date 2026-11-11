import type { ReasoningChallengeData } from './pythonReasoningChallenges';
export const functionExamples = [
  { title:'define_and_call.py', code:'def weekly_minutes(minutes, days):\n    total = minutes * days\n    return total\n\nfirst = weekly_minutes(20, 7)\nsecond = weekly_minutes(30, 5)\nprint(first, second)', output:'140 150', explanation:'def binds a function to the name weekly_minutes. Its body waits for a call. The first call binds local minutes to 20 and days to 7, calculates 140 and returns it. Only then is first assigned. The second call gets its own local bindings and returns 150. print displays both caller values.' },
  { title:'local_names.py', code:'def increase(score):\n    score = score + 5\n    return score\n\nscore = 10\nupdated = increase(score)\nprint(score, updated)', output:'10 15', explanation:'The caller evaluates score to the integer 10 and passes it. The parameter named score belongs to this call. Rebinding that local name to 15 does not rebind the caller’s score. return carries 15 back, where updated receives it. This demonstrates integer rebinding, not a promise that functions cannot mutate shared objects.' },
  { title:'defaults.py', code:'def weekly_minutes(minutes, days=7):\n    return minutes * days\n\nprint(weekly_minutes(20))\nprint(weekly_minutes(days=5, minutes=30))', output:'140\n150', explanation:'The omitted days argument uses the default 7. The next call supplies keyword arguments by parameter name, so their written order does not change the pairing. Defaults are evaluated when def executes; this immutable integer is safe for this example. Mutable defaults are a later topic.' },
  { title:'guard_and_test.py', code:'def weekly_minutes(minutes, days):\n    if minutes < 0 or minutes > 1440 or days < 0 or days > 7:\n        return None\n    return minutes * days\n\nassert weekly_minutes(20, 3) == 60\nassert weekly_minutes(30, 0) == 0\nassert weekly_minutes(1440, 7) == 10080\nassert weekly_minutes(-1, 3) is None\nassert weekly_minutes(20, 8) is None\nprint("Checks passed")', output:'Checks passed', explanation:'For integer inputs, the guard rejects values outside the agreed ranges by returning None immediately. Valid inputs reach the final multiplication. None is a distinct value meaning no result here; 0 is a valid computed result. assert checks a claim and raises AssertionError if it is false. is None tests the single None object. Assertions are developer checks, not production input validation: Python can disable them in optimized execution.' },
];
export const returnReasoning: ReasoningChallengeData = {
  id:'print-or-return', title:'Does displaying a result give it back to the caller?',
  question:'Predict every printed line. Explain what the caller assigns to answer and where each visible line comes from.',
  transfer:'Change the call to double(0). Both versions display 0 somewhere: explain why only one version gives the caller a numeric result it can reuse.',
  variants:[
    {title:'Print inside the function',code:'def double(number):\n    print(number * 2)\n\nanswer = double(4)\nprint(answer)',output:'8\nNone',steps:['The call binds number to 4 and the inner print displays 8.', 'Execution reaches the end without return, so the call produces None.', 'The caller assigns None to answer. Its own print displays None. Printing and returning are separate effects.']},
    {title:'Return to the caller',code:'def double(number):\n    return number * 2\n\nanswer = double(4)\nprint(answer)',output:'8',steps:['The call computes 8 and returns it without printing.', 'Only after that call finishes does the caller bind answer to 8.', 'The caller prints 8. It could instead save, compare or pass that returned value to another function.']},
  ],
};
const checks: [string,string[],number,string][] = [
 ['What does def do in these examples?', ['Runs the body immediately','Defines and binds a function','Prints the result'],1,'The body runs when the function is called.'],
 ['In def area(width, height), what is width?', ['A parameter','A returned value','A call'],0,'A parameter is a name in the function definition.'],
 ['In area(3, 4), what is 3?', ['A local variable definition','A function name','An argument'],2,'An argument is the value or expression supplied by the caller.'],
 ['What does a function with no executed return produce?', ['Zero','None','An empty string'],1,'Reaching the end returns None.'],
 ['Does return itself print its value?', ['No','Always','Only for integers'],0,'The caller can choose to print or otherwise use the value.'],
 ['What happens after an executed return?', ['The next body line runs','The function starts over','The current call exits'],2,'Control returns to the caller.'],
 ['A parameter is rebound to a new integer. Does this reassign the caller’s name?', ['Always','No','Only if names match'],1,'The local binding and caller binding are distinct.'],
 ['Why separate calculation from print and input?', ['To reuse and test the calculation directly','To make every program faster','To eliminate every error'],0,'Separating interaction from calculation makes behavior easier to reuse and check.'],
 ['Why distinguish None from 0 in a result contract?', ['They are interchangeable','None always means zero','Zero can be valid work; None can signal no result'],2,'The documented contract gives these values different meanings.'],
 ['Do assertions replace input validation in a released application?', ['Yes','No','Only for strings'],1,'Assertions may be disabled. Keep validation in ordinary program logic.'],
];
export const functionQuestions = checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));

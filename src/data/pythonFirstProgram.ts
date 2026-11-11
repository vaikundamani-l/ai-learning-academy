export const firstProgramExamples = [
  { title: 'hello.py', code: 'print("Hello, engineer!")', output: 'Hello, engineer!', explanation: 'print is a built-in function: a named operation you call using parentheses. The quoted text is its argument, the value supplied to the operation. Quotes mark the text in your code; print displays the text without those quotes.' },
  { title: 'values.py', code: 'print(3 + 2 * 4)\nprint((3 + 2) * 4)\nprint("3" + "2")\nprint(7 / 2)', output: '11\n20\n32\n3.5', explanation: 'Multiplication happens before addition; parentheses change the order. Quotes make digits text, so + joins them. / performs division and produces a floating-point result.' },
  { title: 'names.py', code: 'score = 10\nprevious = score\nscore = score + 5\nprint(previous, score)', output: '10 15', explanation: 'For each assignment here, evaluate the expression on the right, then bind the name on the left to the resulting value. previous keeps the earlier integer value; it is not a formula that tracks score. print separates its two arguments with a space.' },
  { title: 'study.py', code: 'minutes_text = input("Minutes per day: ")\nminutes = int(minutes_text)\nweekly = minutes * 7\nprint("Weekly minutes:", weekly)', input: '20\n', output: 'Minutes per day: Weekly minutes: 140', explanation: 'input displays a prompt and returns text. int converts integer text to a number. Multiplication calculates a week of practice. In an interactive terminal your typed 20 usually appears after the prompt; the captured output shown here excludes that terminal echo. Non-integer text raises ValueError.' },
];
export const studyTrace = [
  { line: 'minutes = 20', names: 'minutes → 20', output: '', why: 'Bind minutes to the integer 20. Assignment itself prints nothing.' },
  { line: 'days = 7', names: 'minutes → 20; days → 7', output: '', why: 'A second name stores the number of days.' },
  { line: 'weekly = minutes * days', names: 'minutes → 20; days → 7; weekly → 140', output: '', why: 'Look up both names, multiply 20 by 7, then bind weekly to 140.' },
  { line: 'print(weekly)', names: 'minutes → 20; days → 7; weekly → 140', output: '140', why: 'Look up weekly and display its value. The names remain available.' },
];
const items: [string, string[], number, string][] = [
  ['What does print("Hello") display?', ['"Hello" including quotes', 'Hello', 'Nothing'], 1, 'Quotes delimit a string in source code; print displays its contents.'],
  ['What is the result of 2 + 3 * 4?', ['20', '24', '14'], 2, 'Multiplication happens first: 3 * 4 is 12, then add 2.'],
  ['After x = 4; y = x; x = 9, what is y?', ['4', '9', 'Undefined'], 0, 'Assigning a new integer to x does not reassign y.'],
  ['What type does input return?', ['int', 'str', 'bool'], 1, 'Input returns text, even when you type digits.'],
  ['Which converts "12" into an integer?', ['print("12")', 'str(12)', 'int("12")'], 2, 'int parses valid integer text.'],
  ['Which expression joins two strings?', ['"AI" + " lab"', '"AI" - "lab"', '"AI" / "lab"'], 0, 'For strings, + concatenates their contents.'],
  ['What does print(7 / 2) display?', ['3', '3.5', '2'], 1, '/ performs division; this result is 3.5.'],
  ['Using an unassigned name usually causes which error?', ['ValueError', 'SyntaxError', 'NameError'], 2, 'NameError signals that Python cannot resolve that name.'],
  ['Why does int("twenty") fail?', ['It is not valid integer text', 'All input is forbidden', 'print is missing'], 0, 'Use digits such as 20 for this conversion.'],
  ['What best checks your study calculator?', ['Only read its code', 'Run several known inputs and compare expected results', 'Rename the file'], 1, 'Testing known cases gives evidence that the calculation behaves as intended.'],
];
export const firstProgramQuestions = items.map(([question, options, correct, explanation], i) => ({ id: i + 1, question, options: options.map((text, index) => ({ text, isCorrect: index === correct, explanation })) }));

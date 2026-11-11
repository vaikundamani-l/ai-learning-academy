export const controlFlowExamples = [
  {
    title: 'compare.py',
    code: 'minutes = 30\nprint(minutes >= 30)\nprint(minutes == 0)\nprint(minutes != 0)\nprint(0 <= minutes and minutes <= 60)',
    output: 'True\nFalse\nTrue\nTrue',
    explanation: '>= includes the boundary, == compares values, and != means different values. and requires both comparisons to be True here. In the last line, 30 is at least 0 and at most 60.',
  },
  {
    title: 'choose.py',
    code: 'minutes = 30\nif minutes >= 30:\n    print("Target met")\nelif minutes > 0:\n    print("Getting started")\nelse:\n    print("Rest day")\nprint("Plan saved")',
    output: 'Target met\nPlan saved',
    explanation: 'Test the if condition first. It is True at 30, so print Target met and skip the elif/else blocks. The final print is unindented and runs after the chain. Four spaces show which lines belong to a block.',
  },
  {
    title: 'count.py',
    code: 'for day in range(1, 4):\n    print("Day", day)\nprint("Done")',
    output: 'Day 1\nDay 2\nDay 3\nDone',
    explanation: 'range(1, 4) supplies 1, 2, 3; the stop value 4 is excluded. Each value is assigned to day before the indented print runs. The unindented final print runs once after repetition ends.',
  },
  {
    title: 'countdown.py',
    code: 'remaining = 3\nwhile remaining > 0:\n    print(remaining)\n    remaining = remaining - 1\nprint("Start")',
    output: '3\n2\n1\nStart',
    explanation: 'while checks its condition before every pass. The update decreases remaining from 3 toward 0. At 0 the test is False, so execution continues after the loop. Starting with 0 would skip the body entirely.',
  },
  {
    title: 'skip_and_stop.py',
    code: 'for number in range(1, 6):\n    if number == 2:\n        continue\n    if number == 4:\n        break\n    print(number)\nprint("Finished")',
    output: '1\n3\nFinished',
    explanation: 'At 2, continue skips the rest of that pass. At 4, break leaves the loop, so neither 4 nor 5 is printed. Both keywords affect the innermost enclosing loop; execution then continues as shown.',
  },
  {
    title: 'study_week.py',
    code: 'minutes = int(input("Minutes per day: "))\ndays = int(input("Days per week: "))\nif minutes < 0 or minutes > 1440 or days < 0 or days > 7:\n    print("Choose minutes 0–1440 and days 0–7")\nelse:\n    total = 0\n    for day in range(1, days + 1):\n        total = total + minutes\n        print("Day", day, "total", total)\n    print("Weekly total:", total)',
    input: '20\n3\n',
    output: 'Minutes per day: Days per week: Day 1 total 20\nDay 2 total 40\nDay 3 total 60\nWeekly total: 60',
    explanation: 'Convert both inputs before comparing them. or is True here if any out-of-range comparison is True. Valid input enters else; the accumulator total starts at zero and increases once per day. With 0 days it stays zero. Non-integer text still raises ValueError; this example validates numeric ranges, not every possible input.',
  },
];

const checks: [string, string[], number, string][] = [
  ['Which expression checks whether minutes equals 30?', ['minutes = 30', 'minutes == 30', 'minutes + 30'], 1, '== compares; = assigns a value to a name.'],
  ['At minutes = 30, is minutes >= 30 True?', ['Yes', 'No', 'It raises an error'], 0, '>= includes equality at the boundary.'],
  ['In one if/elif/else chain, what happens after the first True condition?', ['Every later block runs', 'Only else runs', 'Its block runs and later branches are skipped'], 2, 'A chain selects its first matching branch.'],
  ['Which values does range(1, 4) supply?', ['1, 2, 3, 4', '1, 2, 3', '0, 1, 2, 3'], 1, 'The start is included and the stop value is excluded.'],
  ['How often does a for loop body run for range(0)?', ['Zero times', 'Once', 'Forever'], 0, 'The range contains no items.'],
  ['Where should total = 0 go when adding all the numbers in a loop?', ['After each addition', 'After printing the final total', 'Before the loop'], 2, 'Initializing once preserves the running sum across iterations.'],
  ['Why must a countdown update its remaining value?', ['To indent the print', 'To make progress toward a False condition', 'To make the output colorful'], 1, 'Without progress or another exit, the same True test can repeat indefinitely.'],
  ['What does continue do in a loop?', ['Skips the rest of the current iteration', 'Exits the entire program', 'Always ends the loop'], 0, 'The next iteration begins; a while loop tests its condition again.'],
  ['What does break do?', ['Rewinds the current iteration', 'Skips only print statements', 'Exits the innermost enclosing loop'], 2, 'Execution resumes after that loop.'],
  ['A planner accepts days from 0 to 7. Which test cases best probe its limits?', ['Only 3', '-1, 0, 7 and 8', 'Only 100'], 1, 'Test both valid endpoints and one value just outside each endpoint.'],
];
export const controlFlowQuestions = checks.map(([question, options, correct, explanation], i) => ({
  id: i + 1, question, options: options.map((text, index) => ({ text, isCorrect: index === correct, explanation })),
}));

export const controlFlowPractice = [
  { title: 'Predict · follow the branch', task: 'Run choose.py with minutes equal to 0, 1, 29, 30 and 31. Predict both output lines before each run. Why do 30 and 31 follow the same branch?', hint: '0 prints Rest day; 1 and 29 print Getting started; 30 and 31 print Target met. Every case then prints Plan saved. >= includes 30.' },
  { title: 'Repair · keep the accumulated work', task: 'Move total = 0 inside the loop in the sum explorer’s copied program. Run it with limit = 3, explain why it now prints 3, and repair it to print 6.', hint: 'Resetting total before every addition loses the earlier partial sums. Initialize before the loop, then add each number once.' },
  { title: 'Transfer · weekly study planner', task: 'Write a program from a blank file that reads minutes per day and days per week, rejects numeric values outside 0–1440 and 0–7, prints a running total for each day, then prints a final total. Predict results for (20, 3), (30, 0), (0, 7), (-1, 3), (20, 8), and (1440, 7).', hint: 'Valid final totals are 60, 0, 0 and 10080 respectively; the two invalid pairs should print a range error and no day totals. Use if/else around the whole loop. Test non-integer text separately and document the remaining ValueError limitation.' },
];

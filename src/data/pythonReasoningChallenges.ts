export interface ReasoningVariant {
  title: string;
  code: string;
  output: string;
  steps: string[];
}
export interface ReasoningChallengeData {
  id: string;
  title: string;
  question: string;
  transfer: string;
  variants: ReasoningVariant[];
}
export const firstProgramReasoning: ReasoningChallengeData[] = [
  {
    id: 'stored-result', title: 'Does a calculated value update itself?',
    question: 'Predict both lines. Does weekly remember a result or remember a formula? Explain which line would need to run again after minutes changes.',
    transfer: 'Without running it first, change days to 5 after weekly is assigned. Which stored name changes, and which calculation must you repeat? Then run your version to check.',
    variants: [
      { title: 'Change the input only', code: 'minutes = 20\ndays = 7\nweekly = minutes * days\nminutes = 30\nprint(weekly)\nprint(minutes * days)', output: '140\n210', steps: ['Line 3 looks up 20 and 7, multiplies them, and binds weekly to the result 140.', 'Line 4 rebinds minutes to 30. It does not execute line 3 again or change weekly.', 'The first print looks up the stored value 140. The second evaluates a new expression: 30 × 7 = 210.', 'A name is a label for a value, not a spreadsheet cell that automatically recalculates dependent formulas. This example uses immutable integers; shared mutable objects require a later lesson.'] },
      { title: 'Recalculate explicitly', code: 'minutes = 20\ndays = 7\nweekly = minutes * days\nminutes = 30\nweekly = minutes * days\nprint(weekly)\nprint(minutes * days)', output: '210\n210', steps: ['The added assignment executes the multiplication again, now using minutes = 30.', 'weekly is rebound to 210 before either print runs.', 'Both output lines are 210, reached through a stored value and a newly evaluated expression respectively.'] },
    ],
  },
  {
    id: 'text-or-number', title: 'Why the same symbols can do different work',
    question: 'Predict each line. Explain why digits inside quotes behave differently from converted digits. Identify which operation joins text and which performs arithmetic.',
    transfer: 'Change both inputs to "12". Predict the joined text and the numeric sum before running. Explain why converting the result after joining would solve a different problem.',
    variants: [
      { title: 'Join versus add', code: 'first = "4"\nsecond = "5"\nprint(first + second)\nprint(int(first) + int(second))', output: '45\n9', steps: ['first and second are strings: their quotes specify text values, even though the characters are digits.', 'The first + joins two strings and produces "45". print displays its contents: 45.', 'int(first) and int(second) produce integers 4 and 5. Numeric addition produces 9.', 'Reading only the printed digits can hide the difference between text and numbers. Reason from the source values and operations.'] },
      { title: 'Convert after joining', code: 'first = "4"\nsecond = "5"\njoined = first + second\nprint(int(joined))', output: '45', steps: ['String joining happens first, producing "45".', 'int then parses that whole string as the number 45.', 'Converting after joining cannot recover the intended addition 4 + 5. Operation order changes the meaning of the program.'] },
    ],
  },
];
export const controlFlowReasoning: ReasoningChallengeData[] = [
  {
    id: 'branch-chain', title: 'One choice or two independent questions?',
    question: 'At 30 minutes, both comparisons are True. Predict every printed line, then explain whether Python evaluates the second condition in each version.',
    transfer: 'Try minutes = 0 and minutes = 20. Find a value where the versions agree and a value where they differ. Which structure fits one exclusive status message?',
    variants: [
      { title: 'One if/elif chain', code: 'minutes = 30\nif minutes >= 30:\n    print("Target met")\nelif minutes > 0:\n    print("Getting started")', output: 'Target met', steps: ['30 >= 30 evaluates to True, so the first body prints Target met.', 'The rest of this chain is skipped. The elif condition is not evaluated, even though it would be True if evaluated.', 'This structure expresses priority among alternatives. It can run at most one body; without else, it can also run none.'] },
      { title: 'Two independent if statements', code: 'minutes = 30\nif minutes >= 30:\n    print("Target met")\nif minutes > 0:\n    print("Getting started")', output: 'Target met\nGetting started', steps: ['The first if prints Target met.', 'Execution reaches a new, independent if. Its comparison 30 > 0 is also True.', 'The second body prints Getting started as well. Two if statements can be appropriate for two independent actions, but they do not enforce an exclusive status choice.'] },
    ],
  },
  {
    id: 'accumulator-location', title: 'Why moving one line loses earlier work',
    question: 'Predict the final total. For each pass, write total immediately before and immediately after the addition. Which version preserves earlier contributions?',
    transfer: 'Repeat the reasoning for range(1, 5): the intended sum is 10. Explain why changing only the stop value cannot repair a reset inside the loop.',
    variants: [
      { title: 'Reset inside the body', code: 'total = 0\nfor number in range(1, 4):\n    total = 0\n    total = total + number\nprint(total)', output: '3', steps: ['First pass: reset to 0, then add 1, giving 1.', 'Second pass: reset erases 1; add 2 to 0, giving 2.', 'Third pass: reset erases 2; add 3 to 0, giving 3.', 'The final print runs once and displays 3. This computes the last item rather than the sum of all items.'] },
      { title: 'Initialize before repetition', code: 'total = 0\nfor number in range(1, 4):\n    total = total + number\nprint(total)', output: '6', steps: ['Before the loop total is 0, representing the sum of no items.', 'First pass: 0 + 1 = 1. Second pass: 1 + 2 = 3. Third pass: 3 + 3 = 6.', 'Each pass preserves the previous partial sum and adds exactly one new contribution.', 'The invariant is: after each completed pass, total is the sum of all items processed so far. The initialization establishes it, and the update maintains it.'] },
    ],
  },
];

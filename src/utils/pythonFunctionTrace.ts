import type { ProgramFrame } from '../components/learning/ProgramTrace';
export function functionCallModel(minutes:number, days:number) {
  if (!Number.isInteger(minutes) || minutes<0 || minutes>60 || !Number.isInteger(days) || days<0 || days>7) throw new RangeError('Trace inputs must be integer minutes 0–60 and days 0–7.');
  const result=minutes*days;
  const code=`def weekly_minutes(minutes, days):\n    total = minutes * days\n    return total\n\nanswer = weekly_minutes(${minutes}, ${days})\nprint(answer)`;
  const frames:ProgramFrame[]=[
    {line:1,names:'Caller: weekly_minutes → function',output:'',explanation:'Execute def: create the function binding. Skip its body until a call occurs.'},
    {line:5,names:`Caller: answer not yet assigned. Call locals: minutes → ${minutes}; days → ${days}`,output:'',explanation:'Evaluate the arguments, enter the call, and bind the two local parameters. The assignment to answer is waiting for a result.'},
    {line:2,names:`Call locals: minutes → ${minutes}; days → ${days}; total → ${result}`,output:'',explanation:`Compute ${minutes} × ${days} = ${result} inside this call. Nothing prints.`},
    {line:3,names:`Return value → ${result}; caller assignment still pending`,output:'',explanation:'Look up total and return its value. Leave this function call and resume the waiting caller.'},
    {line:5,names:`Caller: answer → ${result}; no active weekly_minutes call`,output:'',explanation:'The call expression has finished. Bind answer to the returned value; the call’s local names are no longer active.'},
    {line:6,names:`Caller: answer → ${result}`,output:String(result),explanation:'The caller prints answer. Returning a value earlier did not print it.'},
  ];
  return {code,frames};
}

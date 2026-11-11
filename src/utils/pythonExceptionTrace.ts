import type { ProgramFrame } from '../components/learning/ProgramTrace';
export const validationCases=[
 {id:'valid',label:'Valid: 20',raw:'20',value:20},
 {id:'zero',label:'Valid boundary: 0',raw:'0',value:0},
 {id:'max',label:'Valid boundary: 60',raw:'60',value:60},
 {id:'range',label:'Out of range: -1',raw:'-1',value:-1},
 {id:'text',label:'Malformed: twenty',raw:'twenty',value:null},
 {id:'decimal',label:'Decimal text: 2.5',raw:'2.5',value:null},
] as const;
export function exceptionFlowModel(id:string) {
 const sample=validationCases.find(item=>item.id===id);
 if(!sample) throw new RangeError('Select a predefined validation case.');
 const invalid=sample.value===null||sample.value<0||sample.value>60;
 const raw=`raw → "${sample.raw}"`;
 const names=sample.value===null?`${raw}; minutes not assigned`:`${raw}; minutes → ${sample.value}`;
 const message='Invalid input: use whole minutes 0–60';
 const result=invalid?message:`Accepted minutes: ${sample.value}`;
 const code=`raw = "${sample.raw}"\ntry:\n    minutes = int(raw)\n    if minutes < 0 or minutes > 60:\n        raise ValueError("Minutes outside 0–60")\nexcept ValueError:\n    print("${message}")\nelse:\n    print("Accepted minutes:", minutes)\nprint("Finished")`;
 const frames:ProgramFrame[]=[
  {line:1,names:raw,output:'',explanation:'Bind raw to text. Conversion and validation have not happened.'},
  {line:3,names,output:'',explanation:sample.value===null?'Conversion raises ValueError before assignment completes. Skip the remaining try statements and find a matching handler.':`Conversion succeeds and binds minutes to ${sample.value}. A valid integer spelling is not yet proof of a permitted range.`},
 ];
 if(sample.value!==null) {
  frames.push({line:4,names,output:'',explanation:invalid?'The integer violates the range rule. Enter the guard.':'Both out-of-range comparisons are False. The guard body is skipped.'});
  if(invalid) frames.push({line:5,names,output:'',explanation:'raise signals ValueError explicitly. Normal execution of the try body ends.'});
 }
 frames.push({line:invalid?7:9,names,output:result,explanation:invalid?'The ValueError handler prints a repair instruction. else is skipped; no value is saved.':'The try body completed normally, so else prints the accepted value. The handler is skipped.'});
 frames.push({line:10,names,output:`${result}\nFinished`,explanation:'Continue after the whole statement. Handling did not resume at the line that failed.'});
 return {code,frames,invalid};
}

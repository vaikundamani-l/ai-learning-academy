import type {ProgramFrame} from '../components/learning/ProgramTrace';
export const fileTraceCases=[{id:'valid',label:'Two valid records',text:'20\n30\n'},{id:'invalid',label:'Malformed second record',text:'20\nbad\n'},{id:'empty',label:'Empty file',text:''}] as const;
export function fileReadModel(id:string){
 const sample=fileTraceCases.find(item=>item.id===id);if(!sample)throw new RangeError('Choose a predefined file case.');
 const code='total = 0\ntry:\n    with open("minutes.txt", "r", encoding="utf-8") as source:\n        for line in source:\n            total = total + int(line)\nexcept ValueError:\n    print("No report: invalid integer")\nelse:\n    print("Total:", total)\nprint("Closed:", source.closed)';
 const frames:ProgramFrame[]=[{line:1,names:'total → 0; file not opened',output:'',explanation:'Initialize the accumulator before attempting the read.'},{line:3,names:'total → 0; source → open UTF-8 text file',output:'',explanation:'In this case, open succeeds and enters the file context. Missing-file and decoding failures are not simulated here.'}];
 let total=0;const values=id==='empty'?[]:id==='invalid'?['20','bad']:['20','30'];
 for(let i=0;i<values.length;i++){
  const value=values[i];frames.push({line:4,names:`total → ${total}; file open; line → ${JSON.stringify(value+'\n')}`,output:'',explanation:`Read physical line ${i+1} from the file. Iteration includes its newline.`});
  if(value==='bad'){frames.push({line:5,names:`total → ${total}; conversion raised ValueError; file closing`,output:'',explanation:'int fails before addition and assignment complete. Leave the with block; the file is closed before the outer handler runs.'});break;}
  total+=Number(value);frames.push({line:5,names:`total → ${total}; file open`,output:'',explanation:`Convert the line and add ${value}. No report has been printed yet.`});
 }
 const failed=id==='invalid';const result=failed?'No report: invalid integer':`Total: ${total}`;
 frames.push({line:failed?7:9,names:`total → ${total}; source.closed → True`,output:result,explanation:failed?'The handler rejects the report. Closing did not erase the internal partial total.':'Iteration finishes and with closes the file. else publishes the completed total.'});
 frames.push({line:10,names:`total → ${total}; source.closed → True`,output:result+'\nClosed: True',explanation:'source remains bound to a file object, but its stream is closed. Cleanup and report validity are separate observations.'});
 return {code,frames,fixture:sample.text};
}

import type {ProgramFrame} from '../components/learning/ProgramTrace';
export type CsvState='start'|'plain'|'quoted'|'afterquote';
export function limitedCsvModel(text:string){
 const frames:ProgramFrame[]=[{line:3,names:'text bound; no fields parsed',output:'',explanation:'Start one bounded single-record parse. The displayed caller waits for a result.'}];
 let state:CsvState='start';let field='';const fields:string[]=[];let error:string|null=null;
 if(!text||Array.from(text).length>180) error='Use 1 to 180 printable ASCII characters';
 for(let i=0;!error&&i<text.length;i++){
  const char=text[i];let explanation='';
  if(char<' '||char>'~') error='Use printable ASCII on one line';
  else if(state==='quoted'){if(char==='"'){state='afterquote';explanation='A quote may close the quoted field; inspect the next character.';}else{field+=char;explanation='Inside quotes, a comma is data rather than a field boundary.';}}
  else if(state==='afterquote'){if(char==='"'){field+='"';state='quoted';explanation='The second of two quotes represents one literal quote; continue the quoted field.';}else if(char===','){fields.push(field);field='';state='start';explanation='A comma after the closing quote completes this field.';}else error=`Character ${i+1}: expected comma or end`;}
  else if(char===','){fields.push(field);field='';state='start';explanation='Outside quotes, a comma completes the current field, including an empty one.';}
  else if(char==='"'){if(state!=='start') error=`Character ${i+1}: quote inside unquoted field`;else{state='quoted';explanation='A quote at field start begins a quoted field.';}}
  else{field+=char;state='plain';explanation='Append ordinary unquoted data to the current field.';}
  frames.push({line:5,names:`Character ${i+1}: ${JSON.stringify(char)}; state → ${state}; field → ${JSON.stringify(field)}; completed → ${JSON.stringify(fields)}`,output:'',explanation:error||explanation});
 }
 if(!error&&state==='quoted')error='Unclosed quoted field';
 if(!error)fields.push(field);
 const result=error?`Rejected: ${error}`:JSON.stringify(fields);
 frames.push({line:error?7:9,names:error?'Parsing failed; no successful field list returned':`Accepted ${fields.length} fields`,output:result,explanation:error?'Reject the record. Partial fields are not a completed parse.':'End of record completes the final field. Serialize the returned strings as compact JSON for an unambiguous display.'});
 const code=`from record_parser import parse_record\nimport json\ntext = ${JSON.stringify(text)}\ntry:\n    fields = parse_record(text)\nexcept ValueError as error:\n    print("Rejected:", error)\nelse:\n    print(json.dumps(fields, separators=(",", ":")))`;
 return {code,frames,fields:error?null:fields,error};
}

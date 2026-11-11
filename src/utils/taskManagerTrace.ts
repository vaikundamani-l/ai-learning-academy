import {taskFixture,type TaskScenario,type TaskState} from '../data/pythonTaskManagerContent.ts';
export interface TaskFrame{phase:string;explanation:string;saved:TaskState|null;candidate:TaskState|null;temporary:boolean;committed:boolean;stdout:string;stderr:string;code:number|null;}
const copy=(state:TaskState|null):TaskState|null=>state?{...state,tasks:state.tasks.map(task=>({...task}))}:null;
/** Fixed CLI paths and fault locations, not a browser file writer or general Python interpreter. */
export function taskManagerTrace(kind:TaskScenario){
 const fixture=taskFixture(kind);let saved=fixture.corrupt?null:copy(fixture.initial);let candidate:TaskState|null=null;let temporary=false;let committed=false;let stdout='';let stderr='';let code:number|null=null;const frames:TaskFrame[]=[];
 const add=(phase:string,explanation:string)=>frames.push({phase,explanation,saved:copy(saved),candidate:copy(candidate),temporary,committed,stdout,stderr,code});
 const reject=(message:string)=>{stderr=`error: ${message}`;code=2;add('Rejected','The command reports an error without successful stdout. Saved bytes have not been replaced.');};
 add('Parse command',`Selected invocation: task_cli.py --db tasks.json ${fixture.args.join(' ')}. The real shell keeps the quoted title as one argument.`);
 add('Read database','Read at most 32769 bytes, then decode and validate. This fixture starts with one saved task; it is not a newly initialized empty file.');
 if(kind==='corrupt'){reject('invalid database JSON; existing bytes were not changed');return {frames,fixture};}
 add('Validate schema','Version, exact fields/types, ids, titles and next_id satisfy the bounded storage contract.');
 if(kind==='missing'){reject('task id not found');return {frames,fixture};}
 if(kind==='repeat'){stdout=JSON.stringify({changed:false,task:saved!.tasks[0]});code=0;add('No change','Task 1 is already done. Return changed=false without staging or replacing any file.');return {frames,fixture};}
 candidate=copy(saved)!;
 let result:object;
 if(kind==='done'){candidate.tasks[0].done=true;result={changed:true,task:candidate.tasks[0]};}
 else{const task={id:candidate.next_id,title:'Trace memory',done:false};candidate.tasks.push(task);candidate.next_id++;result={added:task};}
 add('Build candidate','The new dictionary/list state is independent of the loaded snapshot. It is not saved yet.');
 add('Encode candidate','Validate and serialize the full candidate; reject it before file mutation if the encoded byte limit is exceeded.');
 temporary=true;add('Stage file','Create a same-directory temporary file. Write/flush/fsync must succeed, and the handle must close before replacement.');
 if(kind==='saveFail'){
  add('Write fails','A synthetic staged-write error occurs before replacement. The original database remains the saved state.');temporary=false;add('Clean staging','The failure path removes its temporary file in this fixture. Cleanup itself can have separate failure limits.');reject('synthetic staged write failure');return {frames,fixture};
 }
 saved=copy(candidate);temporary=false;committed=true;add('Replace file','Successful os.replace is the commit point. The new state is now saved; reporting it is still a later operation.');
 if(kind==='outputFail'){stderr='error: output unavailable; operation may already be committed';code=1;add('Output fails','The mutation has committed, but stdout fails. Repeating add blindly could create a duplicate task.');}
 else{stdout=JSON.stringify(result);code=0;add('Report success','Only after a successful save does the CLI publish its JSON success result.');}
 return {frames,fixture};
}

export interface TaskRecord{id:number;title:string;done:boolean;}
export interface TaskState{version:1;next_id:number;tasks:TaskRecord[];}
export type TaskScenario='add'|'done'|'repeat'|'missing'|'corrupt'|'saveFail'|'outputFail';
export function taskFixture(kind:TaskScenario){
 if(!['add','done','repeat','missing','corrupt','saveFail','outputFail'].includes(kind))throw new RangeError('Choose a known task scenario.');
 const initial:TaskState={version:1,next_id:2,tasks:[{id:1,title:'Read CPU',done:kind==='repeat'}]};
 const args=kind==='done'||kind==='repeat'?['done','1']:kind==='missing'?['done','9']:['add','Trace memory'];
 return {initial,args,corrupt:kind==='corrupt'};
}
export const taskCommands='python3 task_cli.py --db tasks.json init\npython3 task_cli.py --db tasks.json add "Read CPU"\npython3 task_cli.py --db tasks.json add "Trace memory"\npython3 task_cli.py --db tasks.json done 1\npython3 task_cli.py --db tasks.json list\npython3 -m unittest -v test_tasks';
const checks:[string,string[],number,string][]=[
 ['Why does the app require an explicit database path?', ['To make the file being read or changed deliberate','To make writes concurrent','To skip validation'],0,'Every invocation names its storage boundary.'],
 ['What should malformed saved JSON become?', ['An empty database automatically','A visible error preserving existing bytes','A new task'],1,'Silent reset could destroy recoverable data.'],
 ['When should the success report be printed for an update?', ['Before validation','While a temporary file is being written','After replacement succeeds'],2,'A staged candidate is not yet the saved database.'],
 ['Does os.replace alone prevent two writers from losing updates?', ['Yes','No','Only when titles differ'],1,'Atomic replacement is not a lock over the read/modify/write cycle.'],
 ['What is the mutation commit point in this design?', ['Successful replacement of the database path','Creating the candidate dictionary','Allocating a temporary filename'],0,'Before replacement, the old saved state remains the committed state.'],
 ['What does repeating done on an already complete task do?', ['Creates a duplicate task','Resets next_id','Returns changed=false without saving again'],2,'The completion command is idempotent for that task state.'],
 ['Is repeating add automatically idempotent?', ['Yes','No','Only after an output error'],1,'Each successful add allocates another id. Reconcile uncertain outcomes before retrying.'],
 ['What does an output failure after successful replacement imply?', ['The old file was restored','The mutation never happened','The file may be updated despite a nonzero exit'],2,'Persistence and communicating success are separate operations.'],
 ['What does type(id) is int exclude that isinstance(id,int) admits?', ['bool values','Positive integers','The value 1'],0,'JSON true must not masquerade as task id/version/next_id.'],
 ['Does flushing/fsyncing only the temporary file prove full power-loss durability?', ['Always','No; directory persistence and system behavior remain separate','Only for JSON'],1,'The project makes a narrower pre-commit error-preservation claim.'],
];
export const taskManagerQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));

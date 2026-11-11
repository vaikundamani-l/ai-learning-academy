/** A small directed object graph, not CPython's allocator or measured ob_refcnt. */
export type PythonTypeName='int'|'float'|'str'|'list'|'dict'|'tuple';
export interface PyObject{id:string;type:PythonTypeName;isMutable:boolean;refCount:number;value:string;nestedRefs:string[];}
export interface PythonMemoryEnvironment{
 /** Compatibility name: this is a drawn namespace, not the machine stack. */
 stack:Record<string,string>;heap:Record<string,PyObject>;nextId:number;
 stepDescription:string;codeSnippet:string;
}
export function createMemoryEnvironment():PythonMemoryEnvironment{return{stack:{},heap:{},nextId:1,stepDescription:'Empty teaching graph.',codeSnippet:''};}
export function allocatePyObject(env:PythonMemoryEnvironment,type:PythonTypeName,value:string,nestedRefs:string[]=[]):string{
 for(const id of nestedRefs)if(!env.heap[id])throw new RangeError('An edge must target a displayed object.');
 const id=`M${env.nextId++}`;
 env.heap[id]={id,type,isMutable:type==='list'||type==='dict',refCount:0,value,nestedRefs:[...nestedRefs]};
 for(const target of nestedRefs)env.heap[target].refCount++;
 return id;
}
/** Cascade only zero-edge objects; cycles need the separate reachability pass. */
function release(env:PythonMemoryEnvironment,id:string):void{
 const object=env.heap[id];if(!object)return;
 object.refCount--;
 if(object.refCount===0){delete env.heap[id];for(const target of object.nestedRefs)release(env,target);}
}
export function assignVariable(env:PythonMemoryEnvironment,name:string,target:string):void{
 if(!env.heap[target])throw new RangeError('A name must target a displayed object.');
 if(env.stack[name]===target)return;
 const old=env.stack[name];env.heap[target].refCount++;env.stack[name]=target;
 if(old)release(env,old);
}
export function deleteVariable(env:PythonMemoryEnvironment,name:string):void{
 const old=env.stack[name];if(!old)return;delete env.stack[name];release(env,old);
}
export function appendReference(env:PythonMemoryEnvironment,list:string,target:string,value:string):void{
 if(env.heap[list]?.type!=='list'||!env.heap[target])throw new RangeError('Append requires a displayed list and target.');
 env.heap[list].nestedRefs.push(target);env.heap[list].value=value;env.heap[target].refCount++;
}
/** Explicit model reachability pass; not CPython's real cycle-collector algorithm. */
export function collectUnreachable(env:PythonMemoryEnvironment):string[]{
 const seen=new Set<string>();const pending=Object.values(env.stack);
 while(pending.length){const id=pending.pop()!;if(seen.has(id))continue;seen.add(id);pending.push(...env.heap[id].nestedRefs);}
 const removed=Object.keys(env.heap).filter(id=>!seen.has(id));
 for(const id of removed)delete env.heap[id];
 for(const object of Object.values(env.heap))object.refCount=0;
 for(const id of Object.values(env.stack))env.heap[id].refCount++;
 for(const object of Object.values(env.heap))for(const id of object.nestedRefs)env.heap[id].refCount++;
 return removed;
}
export interface SimulationScenarioStep{title:string;code:string;explanation:string;environment:PythonMemoryEnvironment;}
export function getPythonMemoryScenarios(){
 const scenarios:{id:string;title:string;description:string;steps:SimulationScenarioStep[];prediction:string;answer:string}[]=[];
 function scenario(id:string,title:string,description:string,prediction:string,answer:string){const env=createMemoryEnvironment();const steps:SimulationScenarioStep[]=[];scenarios.push({id,title,description,steps,prediction,answer});return{env,record:(title:string,code:string,explanation:string)=>steps.push({title,code,explanation,environment:JSON.parse(JSON.stringify(env))})};}
 {
 const{env,record}=scenario('immutability-rebinding','Integer rebinding','Names can change targets without mutating an integer.','After a = a + 1, what does b hold?','b remains 100; a becomes 101. Rebinding a does not mutate its previous target.');
 const old=allocatePyObject(env,'int','100');assignVariable(env,'a',old);record('Bind a','a = 100','Draw a → M1. The label is synthetic; the real interpreter may reuse a cached or immortal integer. No allocation or actual reference count is inferred.');
 assignVariable(env,'b',old);record('Alias','b = a','Both names target one object. Two drawn incoming edges do not mean sys.getrefcount returns 2.');
 const next=allocatePyObject(env,'int','101');assignVariable(env,'a',next);record('Rebind','a = a + 1','a now names the result 101; b still names 100. Integer immutability does not require a fresh allocation for every result.');
 }
 {
 const{env,record}=scenario('mutable-aliasing','List aliasing','Mutation is visible through an alias.','After list1.append(3), what does list2 contain?','list2 contains [1, 2, 3], because both names refer to the same list.');
 const one=allocatePyObject(env,'int','1'),two=allocatePyObject(env,'int','2');const list=allocatePyObject(env,'list','[1, 2]',[one,two]);assignVariable(env,'list1',list);record('Bind list','list1 = [1, 2]','The list contains edges to two integer nodes. Their counts include container edges.');
 assignVariable(env,'list2',list);record('Alias list','list2 = list1','Assignment adds a name binding; it does not copy the list.');
 const three=allocatePyObject(env,'int','3');appendReference(env,list,three,'[1, 2, 3]');record('Append','list1.append(3)','The list object keeps its identity; its internal element buffer may move during resizing. list2 observes the appended element.');
 }
 {
 const{env,record}=scenario('shallow-vs-deep','Shallow and deep copy','New list containers can still share some objects.','After matrix[0].append(99), which copy sees 99?','The shallow copy sees 99; the deep copy’s inner list remains [1, 2]. Integer atoms may still be shared.');
 const one=allocatePyObject(env,'int','1'),two=allocatePyObject(env,'int','2');const inner=allocatePyObject(env,'list','[1, 2]',[one,two]);const outer=allocatePyObject(env,'list','[[1, 2]]',[inner]);assignVariable(env,'matrix',outer);record('Nested list','matrix = [[1, 2]]','The outer list points to an inner list, which points to integer atoms. All drawn edges are counted.');
 const shallow=allocatePyObject(env,'list','[[1, 2]]',[inner]);assignVariable(env,'shallow',shallow);record('Shallow copy','shallow = matrix.copy()','A new outer list shares the original inner list.');
 const deepInner=allocatePyObject(env,'list','[1, 2]',[one,two]);const deep=allocatePyObject(env,'list','[[1, 2]]',[deepInner]);assignVariable(env,'deep',deep);record('Deep copy','deep = copy.deepcopy(matrix)','For these built-in lists deepcopy creates new outer/inner lists, while immutable integer atoms can be shared. It does not universally duplicate everything.');
 const atom=allocatePyObject(env,'int','99');appendReference(env,inner,atom,'[1, 2, 99]');env.heap[outer].value=env.heap[shallow].value='[[1, 2, 99]]';record('Mutate inner','matrix[0].append(99)','matrix and shallow still reach the same inner list. deep reaches a different inner list and is unchanged.');
 }
 {
 const{env,record}=scenario('refcount-dealloc','Delete names','del removes a binding, not every route to an object.','After del data, can ref still read the list?','Yes. ref still names the list; deleting one name does not destroy a reachable object.');
 const ten=allocatePyObject(env,'int','10'),twenty=allocatePyObject(env,'int','20');const list=allocatePyObject(env,'list','[10, 20]',[ten,twenty]);assignVariable(env,'data',list);record('Bind','data = [10, 20]','One displayed name edge reaches the list, which owns two element edges.');
 assignVariable(env,'ref',list);record('Alias','ref = data','Two name edges reach the same list.');
 deleteVariable(env,'data');record('Delete one name','del data','The name data is removed. ref still keeps this list reachable.');
 deleteVariable(env,'ref');record('Release last edge','del ref','The model removes the zero-edge list and cascades its element-edge releases. This is not evidence that process RAM fell or a real allocator returned memory to the OS.');
 }
 {
 const{env,record}=scenario('unreachable-cycle','Unreachable cycle','A positive internal count does not prove reachability.','After del ring, is the self-referencing list reachable from a drawn name?','No. Its self-edge remains, but there is no name path to it. The separate model collection removes it.');
 const list=allocatePyObject(env,'list','[]');assignVariable(env,'ring',list);record('Bind cycle root','ring = []','The list is reachable from the name ring.');
 appendReference(env,list,list,'[self]');record('Self reference','ring.append(ring)','One name edge and one self-edge give two displayed incoming edges.');
 deleteVariable(env,'ring');record('Delete root','del ring','One self-edge remains. Simple zero-edge release cannot remove this unreachable cycle.');
 collectUnreachable(env);record('Collect model','gc.collect()  # conceptual replay','The model performs reachability marking from drawn names and removes the unreachable cycle. CPython’s cyclic collector uses its own tracking algorithm; this is not an implementation of it.');
 }
 return scenarios;
}

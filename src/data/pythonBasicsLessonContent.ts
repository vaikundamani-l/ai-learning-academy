/** Reviewed replacement for the preserved advanced Python draft, sequenced after prerequisites. */
export interface QuizOption{text:string;isCorrect:boolean;explanation:string;}
export interface QuizQuestionItem{id:number;question:string;options:QuizOption[];}
const questions:[string,string[],number,string][]=[
 ['What does the graph label M1 represent?',['A synthetic object identifier','A measured physical address','A CPU register'],0,'The teaching model uses stable labels, not addresses read from your interpreter.'],
 ['Does a + 1 always allocate a fresh integer object?',['Yes, even for cached values','No; the result can reuse an existing immutable object','Only on Linux'],1,'Immutability constrains mutation, not a universal allocation policy.'],
 ['Two names target one list. What does del first_name do?',['Deletes the list through all aliases','Clears every element','Removes that binding; the other name can still reach the list'],2,'Removing a name is different from mutating or destroying an object.'],
 ['What does the displayed incoming-edge count measure?',['Only edges drawn in this teaching graph','The complete runtime reference count','RAM usage in bytes'],0,'Runtime roots, temporary references, caches and immortal objects are outside the diagram.'],
 ['Why can deepcopy preserve a repeated child within its result?',['Because the original is mutated','A memo records already-copied objects','Because every value becomes a string'],1,'The memo preserves repeated references and permits copying recursive structures.'],
 ['Does deep copying promise complete independence for all objects?',['Yes, for every Python type','Yes, if the source has no aliases','No; immutable atoms/custom policies/resources require care'],2,'Built-in list examples do not prove universal isolation or support for external resources.'],
 ['Can an unreachable self-cycle still have a positive reference count?',['Yes; an internal self-edge remains','No; unreachable means count zero','Only if id() is negative'],0,'Reachability from roots and incoming reference counts are distinct questions.'],
 ['What is the right comparison for controlled ordinary-list getrefcount observations?',['Subtract one and call it a universal census','Compare the observed alias/release deltas in the stated environment','Assume the count always starts at one'],1,'The observation itself and other runtime references affect absolute counts.'],
 ['After loading 2 and 3 then multiplying, what is the value stack?',['[2, 3, 6]','[3, 2]','[6]'],2,'The operation consumes two operands and pushes one result, a net stack effect of −1.'],
 ['Why does the bytecode reference target CPython 3.12 explicitly?',['Opcodes and specialization are implementation/version details','Python source only runs on version 3.12','Bytecode is the same as native CPU instructions'],0,'dis output is not a portable Python language or machine-code contract.'],
];
export const PYTHON_BASICS_LESSON_CONTENT={
 title:'CPython: References, Copy Graphs & Bytecode Evidence',stageNumber:1,stageTitle:'Python and Computational Thinking',estimatedReadTime:'90–120 minutes',
 objectives:['Separate language-level identity and mutation from CPython implementation observations.','Trace drawn reference edges and explain unreachable cycles.','Predict shallow/deep copy behavior including repeated references.','Measure controlled reference-count deltas without claiming exact universal counts.','Read actual version-qualified bytecode and derive value-stack transitions.'],
 prerequisites:['Lessons 3–4: functions, lists and aliasing.','Lessons 12 and 16: scope, iterators and resource lifetime.','Lesson 19: independent evidence and complete failure behavior.'],
 quizQuestions:questions.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))})),
};
export interface BytecodeFrame{op:string;argument:string;stack:number[];effect:number;}
export function bytecodeFrames(a:number):BytecodeFrame[]{
 if(![2,5].includes(a))throw new RangeError('Choose a supported bytecode input.');
 return[{op:'RESUME',argument:'',stack:[],effect:0},{op:'LOAD_FAST',argument:'a',stack:[a],effect:1},{op:'LOAD_FAST',argument:'b',stack:[a,3],effect:1},{op:'BINARY_OP',argument:'*',stack:[a*3],effect:-1},{op:'LOAD_FAST',argument:'c',stack:[a*3,4],effect:1},{op:'BINARY_OP',argument:'+',stack:[a*3+4],effect:-1},{op:'RETURN_VALUE',argument:'',stack:[],effect:-1}];
}

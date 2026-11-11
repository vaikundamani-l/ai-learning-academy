export type CountKernel='search'|'pairs'|'halve'|'copy';
export type SearchCase='first'|'last'|'absent';
export const kernelLabels:Record<CountKernel,string>={search:'Linear search',pairs:'Unordered pairs',halve:'Repeated halving',copy:'Copy even values'};
const checks:[string,string[],number,string][]=[
 ['What must be named before giving an operation count?',['Input size, input case and counted event','Only the programming language','Only CPU speed'],0,'A meaningful count needs a declared model and input family.'],
 ['An absent target in a list of length 8 requires how many equality checks here?',['1','8','64'],1,'Each of the eight values is compared once. Loop bookkeeping is outside this selected-event count.'],
 ['Does O(n) say that every input takes exactly n steps?',['Yes','Only for Python','No; it is an eventual upper-bound statement under a model'],2,'Exact counts, input cases and asymptotic classes answer different questions.'],
 ['What does Θ(n) establish that O(n) alone does not?',['Matching asymptotic lower and upper bounds','An average-case distribution','A runtime in seconds'],0,'A tight bound is distinct from whether we selected best, average or worst input cases.'],
 ['How many unordered distinct pairs exist among 8 positions?',['64','28','8'],1,'7+6+…+1 = 8×7/2 = 28. The nested loop does not run n² times exactly.'],
 ['Halving integer 8 until zero takes how many updates?',['3','8','4'],2,'8→4→2→1→0 has four updates. Boundary details matter.'],
 ['Two independent length-n scans have which tight visit bound?',['Θ(n)','Θ(n²)','Θ(log n)'],0,'The visits add: n+n=2n, whose constant factor does not change linear growth.'],
 ['A filter returns k references. What logical output storage does it need?',['Always one slot','k slots, separate from other auxiliary storage','n² slots'],1,'Output storage is part of total space unless explicitly excluded. Allocated capacity/bytes are implementation details.'],
 ['Why can one O(n²) implementation beat one O(n) implementation at small n?',['Big-O is always wrong','Quadratic means fewer operations for every n','Constants and lower-order work affect finite inputs'],2,'Asymptotic bounds do not rank exact elapsed times on every input size.'],
 ['What does one timing vector prove about all future runtimes?',['No universal ordering; it records that measured setup','The worst-case complexity class','Exactly how many CPU instructions ran'],0,'Measurements need a workload, environment and scope; mathematical bounds require reasoning beyond a few timings.'],
];
export const complexityQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));

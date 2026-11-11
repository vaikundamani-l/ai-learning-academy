import type { ProgramFrame } from '../components/learning/ProgramTrace';
export type SharingMode='alias'|'copy';
export interface CollectionSnapshot {original:number[];other:number[]|null;shared:boolean;}
const display=(items:number[])=>`[${items.join(', ')}]`;
export function collectionSharingModel(mode:SharingMode,value:number) {
 if(!['alias','copy'].includes(mode)||!Number.isInteger(value)||value<0||value>99) throw new RangeError('Use alias/copy mode and an integer value 0–99.');
 const shared=mode==='alias';const before=[10,20];const updated=[10,20,value];
 const finalOriginal=shared?updated:before;
 const code=`original = [10, 20]\nother = ${shared?'original':'original.copy()'}\nother.append(${value})\nprint(original)\nprint(other)`;
 const frames:ProgramFrame[]=[
  {line:1,names:'original → List A [10, 20]',output:'',explanation:'Create one list and bind original to it.'},
  {line:2,names:shared?'original → List A; other → List A':'original → List A; other → List B',output:'',explanation:shared?'Assignment binds other to the same list. It does not make a copy.':'copy creates a distinct outer list. These items are integers, so appending to the copied outer list will not change the original.'},
  {line:3,names:`original → ${display(finalOriginal)}; other → ${display(updated)}`,output:'',explanation:shared?'Mutate List A through other. original observes the same changed object.':'Append to List B. List A retains its two items.'},
  {line:4,names:shared?'Both names still refer to List A':'The names still refer to distinct outer lists',output:display(finalOriginal),explanation:'Print the list reached through original.'},
  {line:5,names:shared?'Both names still refer to List A':'The names still refer to distinct outer lists',output:`${display(finalOriginal)}\n${display(updated)}`,explanation:'Print the list reached through other. Compare both lines; the copy decision determines whether original changed.'},
 ];
 const snapshots:CollectionSnapshot[]=[
  {original:[],other:null,shared:false},
  {original:[...before],other:null,shared:false},
  {original:[...before],other:[...before],shared},
  ...Array.from({length:3},()=>({original:[...finalOriginal],other:[...updated],shared})),
 ];
 return {code,frames,snapshots};
}

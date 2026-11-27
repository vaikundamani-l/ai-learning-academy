export type ArrayOperation='append'|'insert'|'pop'|'invalid';
export type ArrayFill='spare'|'full';
export type ArrayPosition='first'|'middle'|'last';
const checks:[string,string[],number,string][]=[
 ['What does capacity mean in this dynamic-array model?',['Number of reserved backing slots','Number of live elements only','Total bytes used by nested payloads'],0,'Capacity includes spare slots; size counts the live prefix.'],
 ['For base 512 and slot width 8, what is slot 3’s illustrative address?',['515','536','4096'],1,'Use base + index×width = 512 + 3×8 = 536, under the fixed-width contiguous-slot model.'],
 ['Why move insertion’s suffix right-to-left?',['To sort all items','To make insertion worst-case constant','To avoid overwriting a source before copying it'],2,'Moving left-to-right can duplicate an overwritten value and lose another.'],
 ['Does resizing the backing buffer deep-copy each payload?',['No, this implementation copies references','Always','Only if the values are lists'],0,'Referenced objects can remain shared even when the slot buffer changes.'],
 ['What does doubling’s constant amortized append bound mean?',['Each append has the same constant cost','Total cost of an append-only sequence is linear in its length','Inputs must be random'],1,'It is a sequence guarantee under the stated model, not a per-call latency or probabilistic guarantee.'],
 ['Why can growing by one slot be expensive over m appends?',['It never allocates','It makes indexing linear','It copies 0+1+…+(m−1) references'],2,'Repeated exact-fit growth gives a quadratic total even though each call adds one item.'],
 ['During growth from capacity 4 to 8, how many backing slots can coexist?',['12 in this allocation/copy model','Only 8','Only 4'],0,'The old four-slot buffer and new eight-slot buffer coexist before replacement.'],
 ['What must pop do to the no-longer-live tail slot?',['Keep its old reference forever','Clear it to the unused sentinel','Deep-copy it into another buffer'],1,'Clearing avoids retaining an otherwise unneeded reference in spare capacity.'],
 ['Does amortized constant append make front insertion constant too?',['Yes','Only for Python','No, front insertion still shifts the live suffix'],2,'With repeated front insertions the movement sums quadratically.'],
 ['Does this model claim Python lists double their capacity exactly?',['No, its growth policy is deliberately educational','Yes, on every interpreter','Only when storing integers'],0,'The backing/cost model is separate from CPython’s version-dependent allocator policy.'],
];
export const arrayQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));

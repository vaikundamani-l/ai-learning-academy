import type {CountKernel,SearchCase} from '../data/complexityContent';
export interface CountFrame{event:string;count:number;detail:string;active:number[];output:number[];result:string;}
export function complexityTrace(kind:CountKernel,n:number,searchCase:SearchCase='absent'){
 if(!['search','pairs','halve','copy'].includes(kind)||!Number.isInteger(n)||n<0||n>16||!['first','last','absent'].includes(searchCase))throw new RangeError('Choose a known kernel, case and integer size 0–16.');
 const values=Array.from({length:n},(_,i)=>i);const frames:CountFrame[]=[];let count=0;const output:number[]=[];
 const push=(event:string,detail:string,active:number[]=[],result='not returned')=>frames.push({event,count,detail,active:[...active],output:[...output],result});
 if(kind==='search'){
 const target=searchCase==='first'&&n?0:searchCase==='last'&&n?n-1:-1;let found=-1;
 for(let i=0;i<n;i++){count++;push('Compare',`Compare values[${i}]=${i} with target ${target}.`,[i]);if(i===target){found=i;break;}}
 push('Return',`Return index ${found}. Equality comparisons: ${count}. Loop bookkeeping is not included.`,[],String(found));
 }else if(kind==='pairs'){
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){count++;push('Visit pair',`Visit positions (${i}, ${j}) once. Self-pairs and reversed duplicates are excluded.`,[i,j]);}
 push('Return',`${count} unordered pair visits; n(n−1)/2 = ${n}×${n-1}/2.`,[],String(count));
 }else if(kind==='halve'){
 let remaining=n;while(remaining>0){const old=remaining;remaining=Math.floor(remaining/2);count++;push('Halve',`${old} // 2 = ${remaining}. Count this update once.`);}
 push('Return',`Reached zero after ${count} updates. Zero initially needs no updates.`,[],String(count));
 }else{
 for(let i=0;i<n;i++){count++;if(i%2===0)output.push(i);push('Visit item',`Read ${i}; ${i%2===0?'append its reference to output':'keep no output reference'}.`,[i]);}
 push('Return',`${count} item visits; ${output.length} logical output slots. Other auxiliary names use a constant number of words in this model.`,[],JSON.stringify(output));
 }
 return{values,frames,count,output:[...output]};
}
export function growthCounts(n:number){if(!Number.isInteger(n)||n<1||n>16)throw new RangeError('Growth comparison uses integer n from 1–16.');return{constant:1,log:Math.log2(n),linear:n,nlog:n*Math.log2(n),quadratic:n*n,exponential:2**n};}

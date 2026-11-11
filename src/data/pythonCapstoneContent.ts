export type ReportCase='valid'|'missing'|'unknown'|'catalog'|'http';
export const reportCases:Record<ReportCase,string>={valid:'All three rows valid',missing:'Missing quantity in row 2',unknown:'Unknown product in row 2',catalog:'Boolean catalog price',http:'HTTP 503 from catalog'};
export function reportFixture(kind:ReportCase,price:number){
 if(!(kind in reportCases)||![125,200].includes(price))throw new RangeError('Choose a known fixture and price.');
 return {orders:kind==='missing'?'sku,quantity\nPEN,2\nBOOK,\n':kind==='unknown'?'sku,quantity\nPEN,2\nLOST,1\n':'sku,quantity\nPEN,2\nBOOK,1\nPEN,3\n',catalog:JSON.stringify({version:1,prices_cents:{PEN:kind==='catalog'?true:price,BOOK:450}})};
}
const checks:[string,string[],number,string][]=[
 ['Why reject a missing quantity instead of treating it as zero?',['Zero would hide missing evidence','Zero cannot be represented in Python','CSV always supplies quantities'],0,'A missing value is unknown; silently inventing zero changes the meaning of the report.'],
 ['A valid first row is followed by an unknown product. What is stdout?',['The first subtotal','Empty, with an error on stderr','A total excluding the unknown row'],1,'An internal subtotal is not a validated complete report.'],
 ['PEN appears with quantities 2 and 3 at 125 cents each. Its subtotal is?',['250 cents','375 cents','625 cents'],2,'The contract sums separate order entries: (2+3) × 125 = 625.'],
 ['What does an HTTP 200 establish?',['The catalog schema is valid','The HTTP status succeeded; data validation remains','All orders are priced'],1,'Transport status cannot prove application types, schema or product coverage.'],
 ['Why store the unit price as integer cents?',['Exact integer multiplication within this chosen cent-based model','Every currency uses cents','Integers validate the CSV automatically'],0,'This deliberately single-currency model needs no fractional-cent rounding.'],
 ['Does the two-second socket timeout guarantee a two-second total runtime?',['Yes','Only with JSON','No, it bounds blocking operations rather than total elapsed time'],2,'A peer can keep supplying data; a total deadline needs its own design.'],
 ['Is a boolean an accepted catalog price?',['Yes, because True equals 1','No; exact int type is required','Only for PEN'],1,'Runtime schema checks exclude bool even though bool is an int subclass.'],
 ['What happens to a shell output file opened with > before validation fails?',['Python restores it','It is always untouched','The shell may already have truncated it'],2,'No application output does not undo shell redirection.'],
 ['What should independent expected totals use?',['Hand-derived arithmetic and separate input partitions','The same helper being tested','Only a coverage percentage'],0,'Reusing the same faulty calculation can make both sides agree incorrectly.'],
 ['Do passing reference tests prove Stage 1 learner mastery?',['Yes','No; independent implementation and explanations are still needed','Only at 100% coverage'],1,'Reference verification and demonstrated learner transfer are separate evidence.'],
];
export const capstoneQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));

import {reportFixture,type ReportCase} from '../data/pythonCapstoneContent.ts';
export interface ReportFrame{phase:string;explanation:string;quantities:Record<string,number>;subtotal:number;stdout:string;stderr:string;code:number|null;}
/** Fixed bounded fixture replay; does not execute Python or perform I/O. */
export function reportPipelineTrace(kind:ReportCase,price:number){
 const fixture=reportFixture(kind,price);const frames:ReportFrame[]=[];let quantities:Record<string,number>={};let subtotal=0;
 const add=(phase:string,explanation:string,stdout='',stderr='',code:number|null=null)=>frames.push({phase,explanation,quantities:{...quantities},subtotal,stdout,stderr,code});
 const reject=(message:string)=>add('Rejected','The CLI catches this input failure, reports it on stderr and returns 2. No success report is printed.','',`error: ${message}`,2);
 add('Read','Read explicit inputs within their byte bound. No input is changed and stdout is empty.');
 if(kind==='http'){reject('catalog request: expected HTTP 200, got 503');return{fixture,frames};}
 if(kind==='catalog'){reject('catalog: PEN price must be integer cents 1–1000000');return{fixture,frames};}
 add('Catalog','Catalog schema and exact integer prices pass. A successful read alone would not prove this.');
 if(kind==='missing'){reject('orders line 3: quantity must be digits 1–9999');return{fixture,frames};}
 add('Parse','The CSV parser validates every record shape, product-code grammar and quantity before aggregation. Physical line numbers stay attached.');
 quantities.PEN=2;subtotal=2*price;
 add('Accumulate',`First order: PEN 2 × ${price} = ${subtotal} cents internally. This is not report output.`);
 if(kind==='unknown'){reject('orders line 3: unknown sku LOST');return{fixture,frames};}
 quantities.BOOK=1;subtotal+=450;
 add('Accumulate',`Second order: BOOK 1 × 450 = 450 cents; internal total ${subtotal}.`);
 quantities.PEN+=3;subtotal+=3*price;
 add('Accumulate',`Third order adds 3 PEN. PEN quantity is now 5, subtotal ${5*price}; combined total ${subtotal} cents.`);
 const report={version:1,row_count:3,items:[{sku:'BOOK',quantity:1,unit_cents:450,subtotal_cents:450},{sku:'PEN',quantity:5,unit_cents:price,subtotal_cents:5*price}],total_cents:subtotal};
 add('Build','All validation and product lookups succeeded. Build sorted items and serialize one complete report. stdout is still empty.');
 add('Publish','Only now publish the complete JSON report and return 0. Output delivery itself can still fail.',JSON.stringify(report),'',0);
 return{fixture,frames};
}

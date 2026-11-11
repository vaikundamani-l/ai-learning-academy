export type HttpCase='valid'|'truncated'|'missing'|'badLength'|'timeout';
export function httpFixture(kind:HttpCase){
 if(!['valid','truncated','missing','badLength','timeout'].includes(kind))throw new RangeError('Choose a known HTTP fixture.');
 const body=kind==='missing'?'{"error":"missing"}':'{"topic":"cpu","minutes":20}';
 const status=kind==='missing'?404:200;
 const declared=kind==='badLength'?'x':String(body.length+(kind==='truncated'?5:0));
 const head=`HTTP/1.1 ${status} ${status===200?'OK':'Not Found'}\r\nContent-Length: ${declared}\r\nContent-Type: application/json\r\nConnection: close\r\n\r\n`;
 return {wire:head+(kind==='timeout'?body.slice(0,2):body),terminal:kind==='timeout'?'timeout':'eof',body,status};
}
export interface HttpFrame{received:number;headerBytes:number|null;expected:number|null;bodyBytes:number;status:number|null;phase:string;explanation:string;chunk:string;result:string;}
/** Fixed ASCII fixtures only; educational buffer events, not a general HTTP implementation. */
export function httpResponseTrace(kind:HttpCase,chunkSize:number){
 if(!Number.isInteger(chunkSize)||chunkSize<1||chunkSize>256)throw new RangeError('Chunk size must be an integer from 1 to 256.');
 const fixture=httpFixture(kind);let buffer='';let headerBytes:number|null=null;let expected:number|null=null;let status:number|null=null;let bodyBytes=0;let result='';
 const frames:HttpFrame[]=[];
 const add=(phase:string,explanation:string,chunk='')=>frames.push({received:buffer.length,headerBytes,expected,bodyBytes,status,phase,explanation,chunk,result});
 add('Ready to receive','The request was sent. These predetermined receive results model a byte stream; no network request occurs in the browser.');
 for(let start=0;start<fixture.wire.length;start+=chunkSize){
  const chunk=fixture.wire.slice(start,start+chunkSize);buffer+=chunk;
  if(headerBytes===null){
   const boundary=buffer.indexOf('\r\n\r\n');
   if(boundary<0){add('Await headers','The delimiter is incomplete. Keep all accumulated bytes, including a possible partial CRLF boundary.',chunk);continue;}
   headerBytes=boundary+4;
   const head=buffer.slice(0,boundary);
   status=Number(head.slice(9,12));
   const length=head.match(/\r\nContent-Length: ([^\r\n]+)/)?.[1]||'';
   if(!/^[0-9]{1,4}$/.test(length)){result='Protocol error: one bounded Content-Length required';add('Protocol error','The complete headers contain an invalid length. Do not interpret the following bytes as a trusted body.',chunk);break;}
   expected=Number(length);
  }
  bodyBytes=buffer.length-headerBytes;
  if(bodyBytes<expected!){add('Await body',`Headers are complete, but ${bodyBytes} of ${expected} declared body bytes have arrived. Request more within the remaining deadline.`,chunk);continue;}
  if(status!==200){result=`HTTP ${status}`;add('HTTP error','The response is complete. Transport/framing succeeded, but this endpoint did not return the required success status.',chunk);break;}
  result=fixture.body;add('Complete','All declared bytes arrived. The fixture body passes UTF-8, JSON and report validation; now it can be returned.',chunk);break;
 }
 if(!result){
  if(fixture.terminal==='timeout'){result='Timeout: network deadline exceeded';add('Timeout','The modeled deadline expires while waiting for remaining bytes. Do not return a partial report.');}
  else{result=headerBytes===null?'Protocol error: EOF before complete headers':'Protocol error: EOF before complete body';add('Premature EOF','The peer closes before the declared message is complete. This is an error, not a shorter successful response.');}
 }
 return {frames,result,wire:fixture.wire};
}

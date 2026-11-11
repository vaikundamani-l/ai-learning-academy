export interface LogRecord {level:'INFO'|'WARN'|'ERROR'; service:string; ms:number;}
export interface LogFrame {cursor:number; phase:string; explanation:string; captures:Partial<LogRecord>; rejected:boolean;}
/** Deterministic contract scanner for one fixed grammar, not a general regex engine. */
export function logRecordTrace(raw:string) {
    const body=raw.endsWith('\r\n')?raw.slice(0,-2):raw.endsWith('\n')?raw.slice(0,-1):raw;
    const chars=Array.from(body);
    let cursor=0;const captures:Partial<LogRecord>={};const frames:LogFrame[]=[];
    let error='';
    const add=(phase:string,explanation:string,rejected=false)=>frames.push({cursor,phase,explanation,captures:{...captures},rejected});
    const fail=(reason:string,phase='Reject')=>{error=reason;add(phase,reason,true);};
    const literal=(text:string,phase:string)=>{
        for(const expected of text){
            if(chars[cursor]!==expected){fail('invalid record format',`Expected ${JSON.stringify(expected)} at position ${cursor}`);return false;}
            cursor++;add(phase,`Consume literal ${JSON.stringify(expected)}. Position ${cursor} is the next unconsumed character.`);
        }
        return true;
    };
    const finish=()=>({body,frames,accepted:!error,error,record:!error?captures as LogRecord:null});
    add('Body boundary','Remove one LF or CRLF terminator if present. Preserve all other whitespace. Positions are zero-based Unicode code-point positions.');
    if(chars.length>80){fail('record exceeds 80 characters');return finish();}
    if(!literal('[','Open level'))return finish();
    const level=chars[cursor]==='I'?'INFO':chars[cursor]==='W'?'WARN':chars[cursor]==='E'?'ERROR':null;
    if(!level){fail('invalid record format','Expected INFO, WARN or ERROR');return finish();}
    if(!literal(level,'Level alternative'))return finish();
    captures.level=level;add('Capture level',`The completed level token is ${level}.`);
    if(!literal('] service=','Service prefix'))return finish();
    const start=cursor;
    while(cursor<chars.length&&chars[cursor]>='a'&&chars[cursor]<='z'&&cursor-start<12){cursor++;add('Service letters','Consume one ASCII lowercase letter; the service token allows 1–12.');}
    if(cursor===start){fail('invalid record format','Service needs at least one lowercase letter');return finish();}
    captures.service=chars.slice(start,cursor).join('');add('Capture service',`Captured ${captures.service}. The next literal must be a space followed by ms=.`);
    if(!literal(' ms=','Milliseconds prefix'))return finish();
    const digits=cursor;
    while(cursor<chars.length&&chars[cursor]>='0'&&chars[cursor]<='9'&&cursor-digits<4){cursor++;add('ASCII digits','Consume one digit; the duration token allows 1–4.');}
    if(cursor===digits){fail('invalid record format','Duration needs at least one ASCII digit');return finish();}
    if(cursor!==chars.length){fail('invalid record format','Whole-record boundary failed: extra input remains');return finish();}
    captures.ms=Number(chars.slice(digits,cursor).join(''));add('Convert milliseconds',`Convert the captured digits to integer ${captures.ms}. Leading zeros are allowed by this grammar.`);
    if(captures.ms>2000){fail('ms outside 0–2000','Domain rejection');return finish();}
    add('Accept record','All input was consumed and the domain range holds. This record can be counted.');
    return finish();
}

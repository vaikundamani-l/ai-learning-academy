import type {ProgramFrame} from '../components/learning/ProgramTrace';
import {generatorProgram,iterationInputs,type IterationCase} from '../data/pythonIterationContent.ts';
export type GeneratorStatus = 'not created'|'created'|'running'|'suspended'|'closed';
export interface IterationFrame extends ProgramFrame {status:GeneratorStatus; consumed:number; value:number|null; attempt:number;}
/** Known fixed fixtures only. Source-level teaching events, not a Python interpreter. */
export function iterationTrace(kind:IterationCase) {
    if (!Object.prototype.hasOwnProperty.call(iterationInputs,kind)) throw new RangeError('Choose a known iteration case.');
    const input=iterationInputs[kind];
    const frames:IterationFrame[]=[];
    let status:GeneratorStatus='not created';
    let consumed=0; let value:number|null=null; let attempt=0;
    const output:string[]=[];
    const add=(line:number,explanation:string)=>frames.push({line,explanation,status,consumed,value,attempt,output:output.join('\n'),names:`attempt=${attempt || 'not started'}; value=${value ?? 'not bound'}; examined=${consumed}/${input.length}`});
    add(1,'Define the generator function. Its body has not run.');
    add(6,'Create the source list. No values have been examined.');
    status='created';add(7,'Calling squares creates a generator. Even the for loop inside it has not started.');
    output.push('Created');add(8,'The caller prints Created before requesting any generated value.');
    for(attempt=1;attempt<=4;attempt++) {
        const wasClosed=status==='closed';
        if(!wasClosed) status='running';
        add(11,wasClosed?'Request from a closed generator: it cannot resume.':'next requests one result. Resume after the previous yield, or start the body on the first request.');
        if(wasClosed || consumed===input.length) {
            status='closed';value=null;
            output.push('End');add(13,'No result is available. StopIteration is caught by the caller; exhaustion remains on subsequent requests.');
        } else {
            value=input[consumed++];add(2,'Take the next source item and bind the generator-local value.');
            add(3,`${value} < 0 is ${value<0?'true':'false'}. Validation happens now, during consumption.`);
            if(value<0) {
                status='closed';value=null;add(4,'ValueError escapes the generator body. Its execution ends; this does not skip the item and resume later.');
                value=null;output.push('Error: negative value');add(15,'The caller catches the domain error. Previously printed values remain; this is not rollback.');
            } else {
                status='suspended';add(5,`yield produces ${value*value} and preserves the local value ${value}. The caller has not printed the returned result yet.`);
                output.push(`Value: ${value*value}`);add(11,'The next call has returned a value; print now emits it. The generator remains suspended until the next request.');
            }
        }
    }
    return {code:generatorProgram(kind),frames,output:output.join('\n')};
}

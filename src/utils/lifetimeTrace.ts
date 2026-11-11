import type {LifetimeCase} from '../data/pythonLifetimeContent';
export interface LifetimeFrame {phase:string;active:boolean;bodyReached:boolean;pending:string;events:string[];explanation:string;}
/** Synthetic lease control-flow events, not a file system or Python interpreter. */
export function lifetimeTrace(kind:LifetimeCase){
 if(!['success','bodyError','earlyReturn','enterError','suppress','exitError'].includes(kind))throw new RangeError('Choose a known lifetime case.');
 const frames:LifetimeFrame[]=[];const events:string[]=[];let active=false;let bodyReached=false;let pending='none';
 const add=(phase:string,explanation:string)=>frames.push({phase,explanation,active,bodyReached,pending,events:[...events]});
 add('Construct manager','Construction stores configuration. This example acquires nothing until __enter__.');
 active=true;events.push('enter');add('Enter scope','__enter__ acquires the synthetic lease. Successful entry returns the resource used by the body.');
 if(kind==='enterError'){
  pending='ValueError';add('Entry raises','Entry fails before returning. Python will not call this manager’s __exit__; entry must release its partial acquisition.');
  active=false;events.push('entry cleanup');add('Entry self-cleanup','The manager releases its partial acquisition and re-raises. The managed body never starts.');pending='none (handled by caller)';events.push('caller ValueError');add('Caller handles entry error','No successful operation result is returned.');
 }else{
  bodyReached=true;events.push('body');add('Run body','Entry succeeded. The body now runs with an active lease.');
  if(kind==='success'){events.push('body complete');add('Body completes','The body reaches its end without an exception.');}
  else if(kind==='earlyReturn'){pending='return early';add('Body requests return','The return is pending. __exit__ must finish before the caller receives the value.');}
  else{pending='ValueError';add('Body raises','Remaining body statements are skipped. The exception is passed to __exit__.');}
  active=false;events.push(`exit ${['success','earlyReturn'].includes(kind)?'None':'ValueError'}`);add('Exit releases lease','__exit__ marks the lease inactive. Normal completion/return supplies None arguments; the failing body supplies ValueError information.');
  if(kind==='exitError'){pending='RuntimeError (context: ValueError)';add('Cleanup raises a new error','Cleanup raises RuntimeError. The body ValueError remains attached as exception context; no normal result is returned.');pending='none (handled by caller)';events.push('caller RuntimeError','context ValueError');add('Caller sees cleanup error','The caller handles RuntimeError and inspects its ValueError context.');}
  else if(kind==='bodyError'){pending='none (handled by caller)';events.push('caller ValueError');add('Caller receives body error','A false __exit__ result permits the original exception to propagate. Cleanup did not mean success.');}
  else{
   if(kind==='suppress'){pending='none';add('Suppress exact ValueError','A true __exit__ result suppresses this error. Execution resumes after with, not inside the interrupted body.');}
   const result=kind==='earlyReturn'?'early':'normal';pending='none';events.push(`caller returned ${result}`);add('Caller receives result',`The operation returns ${result} after cleanup. ${kind==='suppress'?'This variant deliberately hides the body failure; use suppression only under an explicit contract.':'The lease remains inactive.'}`);
  }
 }
 return {frames,events,active};
}

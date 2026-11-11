import {coverageCases,type CoverageSuite,type FitsVersion} from '../data/pythonPytestContent.ts';
export interface CoverageFrame{line:number;explanation:string;coveredLines:number[];coveredBranches:string[];results:{id:string;expected:boolean;actual:boolean;passed:boolean}[];}
/** Fixed four-line decision helper and explicitly selected cases, not measured browser coverage. */
export function coverageEvidence(version:FitsVersion,suite:CoverageSuite){
 if(!['correct','strict'].includes(version)||!['ordinary','branches','boundaries'].includes(suite))throw new RangeError('Choose a known implementation and suite.');
 const cases=coverageCases.slice(0,suite==='ordinary'?1:suite==='branches'?2:4);
 const lines=new Set<number>();const branches=new Set<string>();const results:CoverageFrame['results']=[];const frames:CoverageFrame[]=[];
 const add=(line:number,explanation:string)=>frames.push({line,explanation,coveredLines:[...lines].sort(),coveredBranches:[...branches].sort(),results:results.map(r=>({...r}))});
 lines.add(1);add(1,'Import defines the function. Its definition statement is counted; no input has been checked yet.');
 for(const input of cases){
  const reject=version==='correct'?input.requested>input.remaining:input.requested>=input.remaining;
  lines.add(2);add(2,`${input.id}: evaluate ${input.requested} ${version==='correct'?'>':'>='} ${input.remaining}. Expected acceptance: ${input.expected}.`);
  const line=reject?3:4;lines.add(line);branches.add(`2→${line}`);const actual=!reject;
  results.push({id:input.id,expected:input.expected,actual,passed:actual===input.expected});
  add(line,`${input.id}: helper returns ${actual}; expected ${input.expected}. ${actual===input.expected?'This case passes.':'The assertion detects a mismatch.'} Execution coverage and correctness evidence remain separate.`);
 }
 return {frames,results,coveredLines:[...lines].sort(),coveredBranches:[...branches].sort(),success:results.every(r=>r.passed),statementTotal:4,branchTotal:2};
}

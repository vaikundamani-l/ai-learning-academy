import type {ProgramFrame} from '../components/learning/ProgramTrace';
export interface BudgetSnapshot{created:boolean;limit:number;used:number;}
export function budgetTraceModel(limit:number,amount:number){
 if(!Number.isInteger(limit)||limit<0||limit>60||!Number.isInteger(amount)||amount<0||amount>80)throw new RangeError('Choose integer limit 0–60 and amount 0–80.');
 const seed=Math.min(5,limit);const rejected=seed+amount>limit;const finalUsed=rejected?seed:seed+amount;
 const code=`from budget_model import Budget\nbudget = Budget(${limit})\nbudget.add(${seed})\ntry:\n    budget.add(${amount})\nexcept ValueError as error:\n    print("Rejected:", error)\nelse:\n    print("Accepted total:", budget.total())\nprint("Remaining:", budget.remaining())`;
 const result=rejected?'Rejected: budget exceeded':`Accepted total: ${finalUsed}`;
 const frames:ProgramFrame[]=[
 {line:2,names:`budget → instance A; _limit → ${limit}; _used → 0`,output:'',explanation:'The class call creates and initializes this ordinary Budget instance. After successful initialization the caller binds budget to it.'},
 {line:3,names:`instance A: _limit → ${limit}; _used → ${seed}`,output:'',explanation:`Seed the budget with ${seed}, chosen so it fits even at a zero limit.`},
 {line:5,names:`self → instance A; minutes → ${amount}; current _used → ${seed}`,output:'',explanation:`The method receives this instance as self. Compute the proposed total ${seed} + ${amount} = ${seed+amount}, then compare it with the limit ${limit}.`},
 {line:5,names:`instance A: _limit → ${limit}; _used → ${finalUsed}`,output:'',explanation:rejected?'The guard raises before mutation. The prior accepted state is unchanged.':'The guards pass. Assign the new total to this instance’s _used attribute.'},
 {line:rejected?7:9,names:`instance A: used → ${finalUsed}; remaining → ${limit-finalUsed}`,output:result,explanation:rejected?'The caller reports the rejected action without claiming a new accepted total.':'The caller prints the accepted total; add itself returned None and did not print.'},
 {line:10,names:`instance A: used → ${finalUsed}; remaining → ${limit-finalUsed}`,output:result+`\nRemaining: ${limit-finalUsed}`,explanation:'Ask the same instance for its remaining allowance. Rejection and acceptance preserve the range invariant through the documented method API.'},
 ];
 const snapshots:BudgetSnapshot[]=[{created:false,limit,used:0},{created:true,limit,used:0},{created:true,limit,used:seed},{created:true,limit,used:seed},{created:true,limit,used:finalUsed},{created:true,limit,used:finalUsed},{created:true,limit,used:finalUsed}];
 return{code,frames,snapshots,rejected};
}

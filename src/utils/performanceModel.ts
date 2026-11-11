/** An illustrative fixed-work model, not a measurement or a profiler. */
export function performanceModel(percent:number,factor:number){
 if(!Number.isInteger(percent)||percent<0||percent>100||!Number.isFinite(factor)||factor<1||factor>10)throw new RangeError('Use an integer percent 0–100 and a speed factor 1–10.');
 const unchanged=100-percent;const improved=percent/factor;const total=unchanged+improved;
 return {original:100,unchanged,originalHot:percent,improved,total,speedup:100/total};
}

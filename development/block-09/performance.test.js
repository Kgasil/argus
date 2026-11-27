"use strict";
const assert=require("node:assert/strict"),{performance}=require("node:perf_hooks"),p=require("../block-02/privacy.js"),r=require("../block-03/review.js"),a=require("../block-04/assurance.js"),s=require("../block-05/session.js");
const plain="x".repeat(12000),dense=("a@example.invalid; ").repeat(600).slice(0,12000),numbers="1 ".repeat(6000);
const facts=Array.from({length:40},(_,i)=>({subject:"synthetic-"+i,predicate:"count",scope:"test",unit:"unit",value:i}));
const evidence={claims:facts.map((fact,i)=>({id:"c"+i,fact,exclusive:true})),references:Array.from({length:30},(_,i)=>({id:"r"+i,facts}))};
const ops=[["mask plain",()=>p.privacy(plain)],["mask dense",()=>p.privacy(dense)],["mask numeric",()=>p.privacy(numbers)],["review max",()=>r.review(plain)],["assurance max structured",()=>a.evaluate(evidence)],["session dense",()=>{const t=s.createSession();t.mask(dense);t.close();}]];
let count=0;
for(const [name,fn] of ops){for(let i=0;i<3;i++)fn();const times=[];for(let i=0;i<20;i++){const start=performance.now();fn();times.push(performance.now()-start);}times.sort((a,b)=>a-b);const p95=times[Math.ceil(times.length*.95)-1],max=times.at(-1);console.log("ARGUS_PERF "+name+" p95_ms="+p95.toFixed(3)+" max_ms="+max.toFixed(3));assert.ok(max<2000,"Broad CI guardrail exceeded: "+name);count++;}
console.log(count+" performance workloads passed");

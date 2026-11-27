/* Argus Block 04 — local structured evidence comparison, not factual verification. */
(function(root){
function makeAssurance(){
 "use strict";
 const limits=Object.freeze({claims:40,references:30,factsPerReference:40,field:160,text:12000,totalText:100000});
 const idPattern=/^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/;
 function object(v){return v!==null&&typeof v==="object"&&!Array.isArray(v);}
 function checkId(v){if(typeof v!=="string"||!idPattern.test(v))throw new TypeError("Invalid identifier.");return v;}
 function field(v){if(typeof v!=="string"||!v.trim()||v.length>limits.field)throw new TypeError("Invalid fact field.");return v.trim().normalize("NFC");}
 function text(v){if(typeof v!=="string"||v.length>limits.text)throw new TypeError("Invalid text.");return v;}
 function value(v){if(typeof v==="string")return field(v);if(typeof v==="boolean"||(typeof v==="number"&&Number.isFinite(v)))return v;throw new TypeError("Invalid typed value.");}
 function fact(v){if(!object(v))throw new TypeError("Invalid fact.");return {subject:field(v.subject),predicate:field(v.predicate),scope:field(v.scope),unit:field(v.unit),value:value(v.value)};}
 function key(f){return JSON.stringify([f.subject,f.predicate,f.scope,f.unit,typeof f.value]);}
 function norm(v){return v.normalize("NFC").toLowerCase().replace(/\s+/gu," ").trim();}
 function list(v,max){if(!Array.isArray(v)||v.length>max)throw new TypeError("Invalid or oversized list.");return v;}
 function unique(items){const ids=new Set();for(const x of items){if(ids.has(x.id))throw new TypeError("Duplicate identifier.");ids.add(x.id);}}
 function evaluate(input){
  if(!object(input))throw new TypeError("Invalid evaluation.");
  let totalText=0;
  const takeText=v=>{const s=text(v===undefined?"":v);totalText+=s.length;if(totalText>limits.totalText)throw new RangeError("Text budget exceeded.");return norm(s);};
  const claims=list(input.claims,limits.claims).map(c=>{
   if(!object(c)||typeof c.exclusive!=="boolean")throw new TypeError("Claim requires explicit exclusivity.");
   return {id:checkId(c.id),fact:fact(c.fact),exclusive:c.exclusive,text:takeText(c.text)};
  });
  if(!claims.length)throw new TypeError("At least one claim required.");
  const refs=list(input.references,limits.references).map(r=>{
   if(!object(r))throw new TypeError("Invalid reference.");
   return {id:checkId(r.id),facts:list(r.facts,limits.factsPerReference).map(fact),text:takeText(r.text)};
  });
  unique(claims);unique(refs);
  const results=claims.map(c=>{
   const k=key(c.fact),matches=[],conflicts=[],differentValues=[],textHints=[],internalConflicts=[];
   for(const r of refs){
    const same=r.facts.filter(f=>key(f)===k);
    if(same.some(f=>f.value===c.fact.value))matches.push(r.id);
    if(same.some(f=>f.value!==c.fact.value)){
     if(c.exclusive)conflicts.push(r.id);else differentValues.push(r.id);
    }
    if(c.text.length>=12&&r.text.includes(c.text))textHints.push(r.id);
   }
   for(const other of claims){
    if(other.id!==c.id&&(c.exclusive||other.exclusive)&&key(other.fact)===k&&other.fact.value!==c.fact.value)internalConflicts.push(other.id);
   }
   const status=internalConflicts.length||conflicts.length?(matches.length?"mixed_evidence":"contradiction"):matches.length?"compatible":textHints.length?"text_only":"unsupported";
   return {id:c.id,status,matches,conflicts,differentValues,textHints,internalConflicts,humanReview:true};
  });
  const counts={compatible:0,contradiction:0,mixed_evidence:0,text_only:0,unsupported:0};
  for(const r of results)counts[r.status]++;
  const reviewPriority=counts.contradiction||counts.mixed_evidence?"high":counts.unsupported||counts.text_only?"medium":"standard";
  return {results,counts,total:results.length,reviewPriority,humanReview:true,factualVerification:false,notice:"Comparison with supplied material only; source authenticity, extraction and factual truth are not verified."};
 }
 return Object.freeze({evaluate,limits});
}
const api=makeAssurance();if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.ArgusAssurance=api;
})(typeof globalThis!=="undefined"?globalThis:this);

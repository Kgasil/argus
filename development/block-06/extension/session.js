/* Argus Block 05 — ephemeral local session and minimized reports. */
(function(root){
function makeSessionAPI(privacy,security,assurance){
 "use strict";
 const operations=Object.freeze(["mask","review","assess"]);
 const categories=Object.freeze(["private_key","credential","key","email","cnpj","cpf","phone","card"]);
 const signals=Object.freeze(["instruction_override","secret_request","permission_bypass","authority_claim","execution_request","external_transfer","concealment","sensitive_pattern","authorization_missing","untrusted_action_source"]);
 const statuses=Object.freeze(["compatible","contradiction","mixed_evidence","text_only","unsupported"]);
 function plain(v){return v!==null&&typeof v==="object"&&!Array.isArray(v)&&(Object.getPrototypeOf(v)===Object.prototype||Object.getPrototypeOf(v)===null);}
 function keysOnly(v,allowed){if(!plain(v)||Object.keys(v).some(k=>!allowed.includes(k)))throw new TypeError("Invalid options.");}
 function own(v,k){return Object.prototype.hasOwnProperty.call(v,k)?v[k]:undefined;}
 function bool(v){if(typeof v!=="boolean")throw new TypeError("Expected boolean.");return v;}
 function clone(v){return JSON.parse(JSON.stringify(v));}
 function enumValue(v,allowed){if(!allowed.includes(v))throw new Error("Unexpected engine result.");return v;}
 function count(v){if(!Number.isSafeInteger(v)||v<0)throw new Error("Unexpected engine count.");return v;}
 function createSession(options={}){
  keysOnly(options,["operations","allowExport"]);
  const requested=own(options,"operations")===undefined?operations:own(options,"operations");
  if(!Array.isArray(requested)||requested.length>operations.length||Array.from(requested).some(x=>!operations.includes(x))||new Set(requested).size!==requested.length)throw new TypeError("Invalid capabilities.");
  const enabled=new Set(requested);
  const allowExport=own(options,"allowExport")===undefined?false:bool(own(options,"allowExport"));
  let last=null,closed=false;
  function open(){if(closed)throw new Error("Session closed.");}
  function begin(op){open();last=null;if(!enabled.has(op))throw new Error("Operation disabled.");}
  function remember(summary){last=summary;return clone(summary);}
  function mask(input,options={}){
   begin("mask");
   keysOnly(options,["includeMaskedText"]);
   const preview=own(options,"includeMaskedText")===undefined?false:bool(own(options,"includeMaskedText"));
   const r=privacy.privacy(input);
   const summary=remember({operation:"mask",total:count(r.total),findings:r.findings.map(f=>({kind:enumValue(f.kind,categories),count:count(f.count)})),humanReview:true});
   if(preview)return {summary,maskedText:r.output,warning:"Masked text can still contain sensitive information; review before sharing."};
   return {summary};
  }
  function review(input,context={}){
   begin("review");
   const r=security.review(input,context);
   return remember({operation:"review",level:enumValue(r.level,["low","medium","high","critical"]),decision:enumValue(r.decision,["no_signal","review","block_recommended"]),signals:r.signals.map(x=>enumValue(x,signals)),sensitive:count(r.sensitive),humanReview:true});
  }
  function assess(input){
   begin("assess");
   const r=assurance.evaluate(input);
   const counts={};for(const k of statuses)counts[k]=count(r.counts[k]);
   return remember({operation:"assess",counts,total:count(r.total),reviewPriority:enumValue(r.reviewPriority,["standard","medium","high"]),humanReview:true,factualVerification:false});
  }
  function getSummary(){open();return last===null?null:clone(last);}
  function exportSummary(options={}){
   open();keysOnly(options,["confirmed"]);
   if(!allowExport||own(options,"confirmed")!==true)throw new Error("Export requires enabled capability and explicit confirmation.");
   if(last===null)throw new Error("No report available.");
   return JSON.stringify({schema:"argus-minimized-summary-v1",summary:clone(last)},null,2);
  }
  function clear(){open();last=null;}
  function close(){last=null;enabled.clear();closed=true;}
  return Object.freeze({mask,review,assess,getSummary,exportSummary,clear,close});
 }
 return Object.freeze({createSession});
}
const common=typeof module!=="undefined"&&module.exports;
const privacy=common?require("../block-02/privacy.js"):root.ArgusPrivacyVNext;
const security=common?require("../block-03/review.js"):root.ArgusPromptReview;
const assurance=common?require("../block-04/assurance.js"):root.ArgusAssurance;
if(!privacy||!security||!assurance)throw new Error("Argus engines required.");
const api=makeSessionAPI(privacy,security,assurance);if(common)module.exports=api;else root.ArgusPrivateSession=api;
})(typeof globalThis!=="undefined"?globalThis:this);

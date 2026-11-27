"use strict";
const fs=require("node:fs"),crypto=require("node:crypto"),p=require("../block-02/privacy.js"),r=require("../block-03/review.js");
function evaluate(corpus){
 if(!corpus||corpus.schema!=="argus-independent-v1"||!Array.isArray(corpus.privacy)||!Array.isArray(corpus.prompt)||corpus.privacy.length+corpus.prompt.length>10000)throw Error("Invalid corpus schema");
 const ids=new Set();
 function run(rows,kind){const m={tp:0,fp:0,tn:0,fn:0,positiveExact:0,positive:0,exact:0,total:rows.length,fpIds:[],fnIds:[],mismatchIds:[]};
 for(const row of rows){if(!row||typeof row.id!=="string"||!/^[A-Za-z0-9_-]{1,40}$/.test(row.id)||ids.has(row.id)||typeof row.input!=="string"||row.input.length>12000||typeof row.positive!=="boolean")throw Error("Invalid row");ids.add(row.id);
 let detected;if(kind==="privacy"){if(typeof row.expected!=="string"||row.expected.length>300000)throw Error("Invalid expected output");const v=p.privacy(row.input);detected=v.total>0;const exact=v.output===row.expected;if(exact)m.exact++;else m.mismatchIds.push(row.id);if(row.positive){m.positive++;if(exact)m.positiveExact++;}}else{detected=r.review(row.input,row.context??{}).decision!=="no_signal";}
 if(row.positive&&detected)m.tp++;else if(!row.positive&&!detected)m.tn++;else if(detected){m.fp++;m.fpIds.push(row.id);}else{m.fn++;m.fnIds.push(row.id);}}
 return {...m,precision:m.tp+m.fp?m.tp/(m.tp+m.fp):null,recall:m.tp+m.fn?m.tp/(m.tp+m.fn):null,specificity:m.tn+m.fp?m.tn/(m.tn+m.fp):null};}
 return {privacy:run(corpus.privacy,"privacy"),prompt:run(corpus.prompt,"prompt"),independentStatus:"requires reviewer attestation",completeRemoval:"requires manual span adjudication",releaseAuthorized:false};
}
module.exports={evaluate};
if(require.main===module){try{if(process.argv.length!==3)throw Error("One local corpus path required");const path=process.argv[2];if(fs.statSync(path).size>40*1024*1024)throw Error("Corpus too large");const bytes=fs.readFileSync(path);console.log(JSON.stringify({sha256:crypto.createHash("sha256").update(bytes).digest("hex"),...evaluate(JSON.parse(bytes))},null,2));}catch{console.error("Evaluation failed; verify local schema and limits. No raw input logged.");process.exitCode=1;}}

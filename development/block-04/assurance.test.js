"use strict";
const assert=require("node:assert/strict");
const api=require("./assurance.js");
function suite(api,assert){
 const base={subject:"Projeto fictício A",predicate:"prazo",scope:"2026-11",unit:"dias",value:15};
 const claim=(changes={},id="c1",exclusive=true,txt="O prazo fictício é de 15 dias.")=>({id,fact:{...base,...changes},exclusive,text:txt});
 const ref=(facts=[],id="r1",text="")=>({id,facts,text});
 const evalOne=(c,refs)=>api.evaluate({claims:[c],references:refs});
 const cases=[
 ["compatible",claim(),[ref([base])],"compatible"],
 ["contradiction",claim(),[ref([{...base,value:20}])],"contradiction"],
 ["mixed refs",claim(),[ref([base]),ref([{...base,value:20}],"r2")],"mixed_evidence"],
 ["mixed same ref",claim(),[ref([base,{...base,value:20}])],"mixed_evidence"],
 ["no refs",claim(),[],"unsupported"],
 ["empty ref",claim(),[ref()],"unsupported"],
 ["different subject",claim(),[ref([{...base,subject:"B"}])],"unsupported"],
 ["different predicate",claim(),[ref([{...base,predicate:"custo"}])],"unsupported"],
 ["different scope",claim(),[ref([{...base,scope:"2027-01"}])],"unsupported"],
 ["different unit",claim(),[ref([{...base,unit:"horas"}])],"unsupported"],
 ["different value type",claim(),[ref([{...base,value:"15"}])],"unsupported"],
 ["nonexclusive",claim({},"c1",false),[ref([{...base,value:20}])],"unsupported"],
 ["nonexclusive compatible",claim({},"c1",false),[ref([base,{...base,value:20}])],"compatible"],
 ["text only",claim(),[ref([],"r1","O prazo fictício é de 15 dias.")],"text_only"],
 ["text normalized",claim(),[ref([],"r1","O PRAZO  FICTÍCIO É DE 15 DIAS.")],"text_only"],
 ["text negated",claim(),[ref([],"r1","É falso que: O prazo fictício é de 15 dias.")],"text_only"],
 ["text cannot override",claim(),[ref([{...base,value:20}],"r1","O prazo fictício é de 15 dias.")],"contradiction"],
 ["short text",claim({},"c1",true,"15"),[ref([],"r1","15")],"unsupported"],
 ["boolean match",claim({value:false}),[ref([{...base,value:false}])],"compatible"],
 ["boolean conflict",claim({value:false}),[ref([{...base,value:true}])],"contradiction"],
 ["string exact",claim({value:"Ativo"}),[ref([{...base,value:"Ativo"}])],"compatible"],
 ["case conservative",claim({value:"Ativo"}),[ref([{...base,value:"ativo"}])],"contradiction"],
 ["unicode canonical",claim({value:"café"}),[ref([{...base,value:"cafe\u0301"}])],"compatible"],
 ["number zero",claim({value:0}),[ref([{...base,value:0}])],"compatible"],
 ["negative number",claim({value:-2}),[ref([{...base,value:-2}])],"compatible"],
 ["decimal exact",claim({value:1.5}),[ref([{...base,value:1.5}])],"compatible"]
 ];
 let n=0;for(const [name,c,refs,status] of cases){const r=evalOne(c,refs);assert.equal(r.results[0].status,status,name);assert.equal(r.factualVerification,false,name);assert.equal(r.humanReview,true,name);n++;}
 let r=api.evaluate({claims:[claim(),claim({value:20},"c2")],references:[ref([base])]});assert.equal(r.results[0].status,"mixed_evidence");assert.equal(r.results[1].status,"contradiction");assert.deepEqual(r.results[0].internalConflicts,["c2"]);assert.equal(r.reviewPriority,"high");n++;
 r=api.evaluate({claims:[claim({},"c1",false),claim({value:20},"c2",false)],references:[]});assert.equal(r.results[0].status,"unsupported");assert.equal(r.results[0].internalConflicts.length,0);n++;
 r=evalOne(claim(),[ref([base,base]),ref([base],"r2")]);assert.deepEqual(r.results[0].matches,["r1","r2"]);n++;
 r=evalOne(claim({},"c1",false),[ref([{...base,value:20}])]);assert.deepEqual(r.results[0].differentValues,["r1"]);n++;
 r=evalOne(claim(),[ref([base])]);assert.equal(r.reviewPriority,"standard");assert.equal(r.results[0].humanReview,true);n++;
 r=evalOne(claim(),[]);assert.equal(r.reviewPriority,"medium");assert.equal(r.counts.unsupported,1);n++;
 r=api.evaluate({claims:[claim(),claim({predicate:"custo"},"c2")],references:[ref([base])]});assert.equal(r.total,2);assert.equal(r.counts.compatible,1);assert.equal(r.counts.unsupported,1);n++;
 r=evalOne(claim({subject:"synthetic-private-content"}),[]);assert.equal(JSON.stringify(r).includes("synthetic-private-content"),false);n++;
 for(const [name,fn] of [
 ["null",()=>api.evaluate(null)],["empty claims",()=>api.evaluate({claims:[],references:[]})],
 ["missing refs",()=>api.evaluate({claims:[claim()]})],["duplicate claim",()=>api.evaluate({claims:[claim(),claim()],references:[]})],
 ["duplicate ref",()=>evalOne(claim(),[ref(),ref()])],["invalid id",()=>evalOne(claim({},"<script>"),[])],
 ["missing exclusive",()=>api.evaluate({claims:[{id:"c1",fact:base}],references:[]})],
 ["invalid exclusive",()=>api.evaluate({claims:[{...claim(),exclusive:"true"}],references:[]})],
 ["missing scope",()=>evalOne(claim({scope:undefined}),[])],["empty unit",()=>evalOne(claim({unit:" "}),[])],
 ["object value",()=>evalOne(claim({value:{}}),[])],["NaN",()=>evalOne(claim({value:NaN}),[])],
 ["Infinity",()=>evalOne(claim({value:Infinity}),[])],["oversized field",()=>evalOne(claim({subject:"a".repeat(161)}),[])],
 ["oversized text",()=>evalOne(claim({},"c1",true,"a".repeat(12001)),[])],
 ["claim limit",()=>api.evaluate({claims:Array.from({length:41},(_,i)=>claim({},"c"+i)),references:[]})],
 ["reference limit",()=>evalOne(claim(),Array.from({length:31},(_,i)=>ref([],"r"+i)))],
 ["fact limit",()=>evalOne(claim(),[ref(Array.from({length:41},()=>base))])],
 ["budget",()=>evalOne(claim(),Array.from({length:9},(_,i)=>ref([],"r"+i,"a".repeat(12000))))],
 ["invalid reference fact",()=>evalOne(claim(),[ref([null])])]]){assert.throws(fn,name);n++;}
 return n;
}
console.log(suite(api,assert)+" assurance cases passed");

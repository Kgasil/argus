"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),i18n=require("./i18n.js"),lab=require("../block-07/lab.js");
let n=0;const test=(name,f)=>{f();n++;console.log("OK "+name);};
test("default Portuguese",()=>assert.equal(i18n.translate("pt-BR","Limpar"),"Limpar"));
test("English",()=>assert.equal(i18n.translate("en","Limpar"),"Clear"));
test("unknown text remains unchanged",()=>assert.equal(i18n.translate("en","unmapped synthetic string"),"unmapped synthetic string"));
test("prototype names not translated",()=>assert.equal(i18n.translate("en","constructor"),"constructor"));
test("extension copy parity",()=>assert.equal(fs.readFileSync(path.join(__dirname,"i18n.js"),"utf8"),fs.readFileSync(path.join(__dirname,"../block-06/extension/i18n.js"),"utf8")));
for(const [id,answer] of [["mask","detected"],["prompt","block_recommended"],["permission","block_recommended"],["match","compatible"],["conflict","contradiction"],["unsupported","unsupported"],["text","text_only"]])test("English scenario "+id,()=>{const r=lab.createLab().run(id,answer,false,"en");assert.equal(r.observed,answer);assert.equal(r.fixtureConsistent,true);assert.notEqual(lab.scenario(id,"en").title,lab.scenario(id).title);assert.notEqual(r.lesson,lab.createLab().run(id,answer).lesson);});
test("English masked preview matches fixture",()=>assert.equal(lab.createLab().run("mask","detected",false,"en").preview,"Synthetic contact: [EMAIL]; CPF [CPF]"));
function luminance(hex){const v=hex.match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2];}
for(const [name,a,b,min] of [["main text","edf4ff","0a1322",4.5],["panel text","edf4ff","111f33",4.5],["muted panel","aec2dc","111f33",4.5],["accent text","75baff","111f33",4.5],["primary button","071321","75baff",4.5],["focus indicator","85e5ed","111f33",3],["control border","637b9a","091321",3],["control border panel","637b9a","111f33",3],["placeholder","aec2dc","091321",4.5]])test(name+" contrast",()=>{const x=luminance(a),y=luminance(b),r=(Math.max(x,y)+.05)/(Math.min(x,y)+.05);assert.ok(r>=min,name+" "+r);console.log("contrast "+name+" "+r.toFixed(2));});
console.log(n+" design/i18n cases passed");

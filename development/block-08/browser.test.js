"use strict";
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process"),assert=require("node:assert/strict"),{pathToFileURL}=require("node:url");const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"argus-design-"));const out=path.resolve("argus-design-evidence");fs.mkdirSync(out,{recursive:true});
try{
const source=path.join(__dirname,"..");for(const folder of ["block-02","block-03","block-04","block-05","block-06","block-07","block-08"]){const dest=path.join(tmp,"development",folder);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.cpSync(path.join(source,folder),dest,{recursive:true});}
fs.mkdirSync(path.join(tmp,"assets"));fs.copyFileSync(path.join(__dirname,"../../assets/readme-cover.svg"),path.join(tmp,"assets/readme-cover.svg"));
const browser=process.env.CHROME_BIN||"google-chrome";
for(const [name,relative,width,height] of [["extension","block-06/extension/popup.html",390,844],["lab-desktop","block-07/mini/index.html",1280,900],["lab-narrow","block-07/mini/index.html",390,844]]){
const p=path.join(tmp,"development",relative),dir=path.dirname(p),original=fs.readFileSync(p,"utf8");fs.copyFileSync(path.join(__dirname,"browser-fixture.js"),path.join(dir,"design-fixture.js"));fs.writeFileSync(p,original.replace("</body>",'<script src="design-fixture.js"></script></body>'));
const args=["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--window-size="+width+","+height,"--user-data-dir="+path.join(tmp,"profile-"+name)];
const invoke=extra=>{const r=cp.spawnSync(browser,[...args,...extra,pathToFileURL(p).href],{encoding:"utf8",timeout:45000,maxBuffer:4*1024*1024});if(r.error)throw r.error;assert.equal(r.status,0,r.stderr);return r;};
const r=invoke(["--dump-dom"]),match=r.stdout.match(/<pre id="design-result">([^<]+)<\/pre>/);assert.ok(match,"Missing design result");assert.match(match[1],/^ARGUS_DESIGN_PASS \d+$/);console.log(name+" "+match[1]);
fs.writeFileSync(p,original);const png=path.join(out,name+"-pt.png");invoke(["--screenshot="+png]);const bytes=fs.readFileSync(png);assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");console.log("Screenshot "+name+" "+bytes.readUInt32BE(16)+"x"+bytes.readUInt32BE(20)+" bytes="+bytes.length);
}
}finally{fs.rmSync(tmp,{recursive:true,force:true});}

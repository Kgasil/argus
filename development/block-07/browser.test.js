"use strict";
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process"),assert=require("node:assert/strict"),{pathToFileURL}=require("node:url");const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"argus-lab-"));
try{
 for(const folder of ["block-02","block-03","block-04","block-05","block-07"]){const dest=path.join(tmp,"development",folder);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.cpSync(path.join(__dirname,"..",folder),dest,{recursive:true});}
 fs.mkdirSync(path.join(tmp,"assets"));fs.copyFileSync(path.join(__dirname,"../../assets/readme-cover.svg"),path.join(tmp,"assets/readme-cover.svg"));
 const dir=path.join(tmp,"development/block-07/mini"),p=path.join(dir,"index.html");fs.copyFileSync(path.join(__dirname,"browser-fixture.js"),path.join(dir,"browser-fixture.js"));fs.writeFileSync(p,fs.readFileSync(p,"utf8").replace("</body>",'<script src="browser-fixture.js"></script></body>'));
 const browser=process.env.CHROME_BIN||"google-chrome";
 for(const [width,height] of [[1280,900],[390,844]]){
  const r=cp.spawnSync(browser,["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--window-size="+width+","+height,"--user-data-dir="+path.join(tmp,"profile-"+width),"--dump-dom",pathToFileURL(p).href],{encoding:"utf8",timeout:45000,maxBuffer:4*1024*1024});
  if(r.error)throw r.error;assert.equal(r.status,0,r.stderr);const result=r.stdout.match(/<pre id="lab-browser-result">([^<]+)<\/pre>/);assert.ok(result,"Missing lab test result");assert.match(result[1],/^ARGUS_LAB_BROWSER_PASS \d+$/);console.log(width+"x"+height+" "+result[1]);
 }
}finally{fs.rmSync(tmp,{recursive:true,force:true});}

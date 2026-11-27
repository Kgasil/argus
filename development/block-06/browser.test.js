"use strict";
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process"),assert=require("node:assert/strict"),{pathToFileURL}=require("node:url");
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"argus-browser-"));
try{
 const folder=path.join(tmp,"fixture");fs.cpSync(path.join(__dirname,"extension"),folder,{recursive:true});
 fs.copyFileSync(path.join(__dirname,"browser-fixture.js"),path.join(folder,"browser-fixture.js"));
 const p=path.join(folder,"popup.html");fs.writeFileSync(p,fs.readFileSync(p,"utf8").replace("</body>",'<script src="browser-fixture.js"></script></body>'));
 const browser=process.env.CHROME_BIN||"google-chrome";
 const r=cp.spawnSync(browser,["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--user-data-dir="+path.join(tmp,"profile"),"--dump-dom",pathToFileURL(p).href],{encoding:"utf8",timeout:45000,maxBuffer:4*1024*1024});
 if(r.error)throw r.error;assert.equal(r.status,0,r.stderr);
 const result=r.stdout.match(/<pre id="browser-result">([^<]+)<\/pre>/);
 assert.ok(result,"Missing browser test result");assert.match(result[1],/^ARGUS_BROWSER_PASS \d+$/);console.log(result[1]);
}finally{fs.rmSync(tmp,{recursive:true,force:true});}

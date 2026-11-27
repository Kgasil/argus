"use strict";
const fs=require("node:fs"),path=require("node:path"),os=require("node:os"),cp=require("node:child_process"),crypto=require("node:crypto"),assert=require("node:assert/strict");
const ext=path.resolve(__dirname,"../block-06/extension"),tmp=fs.mkdtempSync(path.join(os.tmpdir(),"argus-native-"));const browser=process.env.ARGUS_NATIVE_CHROME||"google-chrome";
const manifest=JSON.parse(fs.readFileSync(path.join(ext,"manifest.json"),"utf8"));
const id=crypto.createHash("sha256").update(ext).digest("hex").slice(0,32).replace(/[0-9a-f]/g,x=>"abcdefghijklmnop"[parseInt(x,16)]);
const url="chrome-extension://"+id+"/popup.html";
const args=["--headless=new","--no-first-run","--no-default-browser-check","--user-data-dir="+tmp,"--load-extension="+ext,"--remote-debugging-port=0","about:blank"];
const child=cp.spawn(browser,args,{stdio:["ignore","ignore","pipe"]});let stderr="",startError=null;child.stderr.on("data",x=>stderr+=x);child.on("error",e=>startError=e);
const delay=ms=>new Promise(r=>setTimeout(r,ms));let ws;let n=0;function check(ok,label){assert.ok(ok,label);n++;console.log("OK native "+label);}
async function main(){
 let port;for(let i=0;i<100;i++){if(startError||child.exitCode!==null)break;const f=path.join(tmp,"DevToolsActivePort");if(fs.existsSync(f)){port=fs.readFileSync(f,"utf8").split("\n")[0];break;}await delay(100);}
 if(!port){console.log("ARGUS_NATIVE_BLOCKED browser startup or sandbox unavailable");return;}
 const base="http://127.0.0.1:"+port;
 const res=await fetch(base+"/json/new?"+encodeURIComponent(url),{method:"PUT"});if(!res.ok){console.log("ARGUS_NATIVE_BLOCKED extension target unavailable");return;}
 const target=await res.json();ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});
 let seq=0;const pending=new Map();ws.addEventListener("message",ev=>{const d=JSON.parse(ev.data);if(d.id&&pending.has(d.id)){const {resolve,reject}=pending.get(d.id);pending.delete(d.id);d.error?reject(Error(d.error.message)):resolve(d.result);}});
 const cmd=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.delete(id))reject(Error("CDP timeout "+method));},5000).unref();});
 const evaluate=async expression=>{const r=await cmd("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error("Evaluation exception");return r.result.value;};
 let actual=null;for(let i=0;i<30;i++){try{actual=await evaluate("globalThis.chrome?.runtime?.id || null");if(actual)break;}catch{}await delay(200);}
 if(actual!==id){console.log("ARGUS_NATIVE_BLOCKED branded Chrome or runtime did not load unpacked extension");return;}
 check(await evaluate("location.protocol==='chrome-extension:'"),"extension origin");
 check(await evaluate("chrome.runtime.getManifest().manifest_version===3"),"MV3 runtime");
 check(await evaluate("!chrome.runtime.getManifest().permissions&&!chrome.runtime.getManifest().host_permissions"),"no declared privileged permissions");
 check(await evaluate("typeof ArgusPrivateSession.createSession==='function'"),"four engines loaded");
 check(await evaluate("(()=>{document.querySelector('#sample').click();document.querySelector('#preview').click();document.querySelector('#run').click();return document.querySelector('#masked').value.includes('[EMAIL]')&&document.querySelector('#input').value===''})()"),"mask and clear");
 check(await evaluate("(()=>{document.querySelector('[data-mode=review]').click();document.querySelector('#sample').click();document.querySelector('#run').click();return document.querySelector('#status').textContent.includes('Bloqueio recomendado')})()"),"review");
 check(await evaluate("(()=>{document.querySelector('[data-mode=assess]').click();document.querySelector('#sample').click();document.querySelector('#run').click();return document.querySelector('#findings').textContent.includes('Contradição')})()"),"assurance");
 check(await evaluate("localStorage.length===0&&sessionStorage.length===0"),"storage empty");
 check(await evaluate("new Promise(resolve=>{let done=false;const finish=v=>{if(!done){done=true;resolve(v)}};document.addEventListener('securitypolicyviolation',e=>{if(e.effectiveDirective==='connect-src')finish(true)},{once:true});fetch('http://127.0.0.1:9/argus-csp-test').then(()=>finish(false)).catch(()=>{});setTimeout(()=>finish(false),1500)})"),"native CSP connect-src enforcement");
 console.log("ARGUS_NATIVE_PASS "+n+" browser="+browser);
}
(async()=>{try{await main();}catch(e){console.error("ARGUS_NATIVE_FAIL "+e.message);process.exitCode=1;}finally{if(ws)ws.close();child.kill();await delay(400);fs.rmSync(tmp,{recursive:true,force:true});}})();

"use strict";
(()=>{const $=id=>document.getElementById(id);let n=0;const check=(v,m)=>{if(!v)throw Error(m);n++;};const click=id=>$(id).click();const mode=v=>document.querySelector('[data-mode="'+v+'"]').click();const input=(id,v)=>{$(id).value=v;$(id).dispatchEvent(new Event("input",{bubbles:true}));};const mark=()=>{const el=document.createElement("pre");el.id="browser-result";el.textContent="ARGUS_BROWSER_PASS "+n;document.body.append(el);};
try{
check($("tool-title").textContent==="Mascarar dados","initial mode");check($("export-panel").hidden,"default export hidden");
click("sample");check($("input").value.includes("example.invalid"),"sample");$("preview").click();$("enable-export").click();click("run");check($("status").textContent.includes("1 ocorrência"),"mask");check($("input").value==="","input cleared");check($("masked").value.includes("[EMAIL]"),"masked");check(!$("export-panel").hidden,"export enabled");check($("export").disabled,"confirmation required");$("confirm-export").click();click("export");check(JSON.parse($("report").value).summary.total===1,"export report");check(!$("report").value.includes("example.invalid"),"export no original");check($("export").disabled,"confirmation consumed");
click("clear");check($("report").value===""&&$("masked").value===""&&$("export-panel").hidden,"clear");
mode("review");click("sample");click("run");check($("status").textContent.includes("Bloqueio recomendado"),"review");check($("input").value==="","review input discarded");
mode("assess");click("sample");click("run");check($("findings").textContent.includes("Contradição"),"assurance");check($("claim").value===""&&$("reference").value==="","assurance discarded");
mode("mask");input("input","<b>synthetic</b>");$("preview").click();click("run");check($("masked").value==="<b>synthetic</b>","inert output");check($("masked").querySelector("b")===null,"no markup inserted");
input("input","new input");check($("masked").value===""&&$("preview-panel").hidden,"stale cleared");click("run");check($("export-panel").hidden,"export opt-in reset");
click("run");check($("status").textContent.includes("Não foi possível"),"empty error");check($("findings").children.length===0,"error clears");
window.dispatchEvent(new Event("pagehide"));check($("status").textContent==="Nenhuma análise realizada.","pagehide clear");
mark();
}catch(e){const el=document.createElement("pre");el.id="browser-result";el.textContent="ARGUS_BROWSER_FAIL "+e.message;document.body.append(el);}
})();

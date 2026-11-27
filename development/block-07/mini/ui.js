(function ui(){
 "use strict";
 const $=id=>document.getElementById(id),lab=ArgusMiniLab.createLab();
 const labels={detected:"Padrões detectados",none:"Nenhum padrão",no_signal:"Nenhum sinal previsto",review:"Revisão",block_recommended:"Bloqueio recomendado",compatible:"Compatível",contradiction:"Contradição",mixed_evidence:"Evidências conflitantes",unsupported:"Sem suporte",text_only:"Correspondência textual",email:"E-mail",cpf:"CPF",authorization_missing:"Autorização não declarada",instruction_override:"Substituição de instruções"};
 function option(value,label){const o=document.createElement("option");o.value=value;o.textContent=label;return o;}
 function item(text){const li=document.createElement("li");li.textContent=text;$("findings").append(li);}
 function clear(){
  lab.clear();$("status").textContent="Selecione sua previsão e execute a simulação.";$("observed").textContent="";$("findings").replaceChildren();$("lesson").textContent="";$("preview").value="";$("preview-panel").hidden=true;$("report").value="";$("export-panel").hidden=true;$("confirm").checked=false;$("export").disabled=true;
 }
 function select(){
  clear();const s=ArgusMiniLab.scenario($("scenario").value);$("scenario-title").textContent=s.title;$("scenario-text").textContent=s.prompt;$("question").textContent=s.question;$("prediction").replaceChildren(option("","Selecione sua previsão"),...s.choices.map(([v,l])=>option(v,l)));$("prediction").value="";$("allow-export").checked=false;$("run").disabled=true;
 }
 for(const s of ArgusMiniLab.list())$("scenario").append(option(s.id,s.title));
 $("scenario").addEventListener("change",select);
 $("prediction").addEventListener("change",()=>{clear();$("run").disabled=!$("prediction").value;});
 $("allow-export").addEventListener("change",clear);
 $("clear").addEventListener("click",select);
 $("run").addEventListener("click",()=>{
  clear();const allow=$("allow-export").checked;
  try{
   const r=lab.run($("scenario").value,$("prediction").value,allow);
   $("status").textContent=r.fixtureConsistent?(r.predictionCorrect?"Sua previsão corresponde ao resultado do motor.":"Sua previsão diverge do resultado do motor. Compare a explicação."):"Resultado inesperado do cenário. Revisão técnica necessária.";
   $("observed").textContent="Resultado: "+labels[r.observed];
   if(r.summary.operation==="mask")for(const f of r.summary.findings)item((labels[f.kind]||f.kind)+": "+f.count);
   else if(r.summary.operation==="review")for(const signal of r.summary.signals)item(labels[signal]||signal);
   else for(const [k,v] of Object.entries(r.summary.counts))if(v)item(labels[k]+": "+v);
   $("lesson").textContent=r.lesson;
   if(r.preview!==undefined){$("preview-panel").hidden=false;$("preview").value=r.preview;}
   $("export-panel").hidden=!allow;
  }catch{clear();$("status").textContent="Não foi possível executar o exercício. Selecione uma previsão válida.";}
  $("allow-export").checked=false;
 });
 $("confirm").addEventListener("change",()=>{$("report").value="";$("export").disabled=!$("confirm").checked;});
 $("export").addEventListener("click",()=>{if(!$("confirm").checked)return;try{$("report").value=lab.exportReport(true);}catch{$("report").value="";}$("confirm").checked=false;$("export").disabled=true;});
 window.addEventListener("pagehide",select);select();
})();

/* Argus Mini 0.1.0 — deterministic, local-only helpers. */
(function(root){
"use strict";
const LIMIT=12000;
const rules=[
["credential", /\b(?:senha|password|api[_ -]?key|token|secret)\s*[:=]\s*(?:"[^"\n]+"|'[^'\n]+'|[^\s,;]+)/gi, "[CREDENCIAL]"],
["key", /\b(?:sk-[A-Za-z0-9_-]{16,}|AKIA[A-Z0-9]{16})\b/g, "[CHAVE]"],
["email", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL]"],
["cnpj", /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "[CNPJ]"],
["cpf", /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF]"],
["phone", /(?:\+55\s*)?\(\d{2}\)\s*\d{4,5}-?\d{4}\b|\b\d{2}\s+\d{4,5}-\d{4}\b/g, "[TELEFONE]"]
];
function input(value){if(typeof value!=="string")throw new Error("Texto inválido.");if(value.length>LIMIT)throw new Error("Limite de 12.000 caracteres.");return value;}
function privacy(value){let output=input(value);const findings=[];for(const [kind,pattern,replacement] of rules){let count=0;output=output.replace(pattern,()=>{count++;return replacement;});if(count)findings.push({kind,count});}return {output,findings,total:findings.reduce((a,b)=>a+b.count,0)};}
const risks=[
["override",/\b(?:ignore|ignorar|desconsidere|forget|disregard)\b.{0,75}\b(?:instruções|instrucoes|instructions|rules|regras|políticas|policies)\b/is],
["secrets",/\b(?:revele|exponha|mostre|reveal|expose|print|show|send|envie)\b.{0,70}\b(?:senha|password|secret|segredo|token|api[_ -]?key|system prompt|prompt de sistema)\b/is],
["permissions",/\b(?:bypass|contorne|desative|disable|sem autorização|without permission)\b.{0,70}\b(?:segurança|security|policy|política|permissions|permissões|filtro|filter)\b/is],
["execution",/\b(?:execute|executar|run)\b.{0,70}\b(?:comando|command|script|código|code|shell)\b/is]
];
function review(value){const s=input(value);const flags=risks.filter(([,re])=>re.test(s)).map(([kind])=>kind);const sensitive=privacy(s).total;return {flags,sensitive,attention:flags.length||sensitive?"review":"none"};}
function normalize(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();}
function coverage(answer,reference){const a=normalize(input(answer));const lines=[...new Set(input(reference).split(/\r?\n/).map(s=>s.trim()).filter(Boolean))];if(lines.length>20)throw new Error("Máximo de 20 critérios.");if(!lines.length)throw new Error("Informe pelo menos um critério.");const criteria=lines.map(phrase=>({phrase,found:a.includes(normalize(phrase))}));const matched=criteria.filter(c=>c.found).length;return {criteria,matched,total:criteria.length,percent:Math.round(100*matched/criteria.length)};}
const api={privacy,review,coverage,LIMIT};if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.ArgusMini=api;
})(typeof globalThis!=="undefined"?globalThis:this);

/* Argus Block 03 — experimental local prompt review; no execution or authorization. */
(function(root){
function makeReview(privacyApi){
 "use strict";
 const LIMIT=12000;
 const rules=[
 ["instruction_override",/\b(?:ignore|ignorar|desconsidere|disregard|forget|override|substitua)\b.{0,90}\b(?:instructions?|rules?|policies|policy|instrucoes|regras|politicas?|diretrizes)\b/is],
 ["secret_request",/\b(?:reveal|show|print|send|expose|disclose|extract|revele|mostre|envie|exponha|extraia|divulgue)\b.{0,90}\b(?:secrets?|passwords?|senhas?|segredos?|tokens?|api[ _-]?keys?|chaves? privadas?|private keys?|system prompts?|prompts? de sistema)\b/is],
 ["permission_bypass",/\b(?:bypass|disable|circumvent|contorne|desative|ignore|burle|ignorar)\b.{0,90}\b(?:security|permissions?|approval|authorization|autorizacao|aprovacao|seguranca|permissoes|controls?|controles?|filtros?|filters?)\b/is],
 ["authority_claim",/\b(?:i am (?:the |an? )?(?:administrator|admin|developer)|sou (?:o |um )?(?:administrador|desenvolvedor)|developer mode|modo desenvolvedor|system message|mensagem de sistema)\b/i],
 ["execution_request",/\b(?:execute|executar|run|rode)\b.{0,70}\b(?:commands?|scripts?|shell|codigo|code|comandos?)\b/is],
 ["external_transfer",/\b(?:send|upload|transfer|export|envie|transfira|exporte|carregue)\b.{0,90}\b(?:external|third.party|outside|extern[oa]s?|terceiros?|https?:\/\/)\b/is],
 ["concealment",/\b(?:do not tell|don't tell|hide from|sem avisar|nao informe|nao conte|oculte do)\b.{0,60}\b(?:user|owner|admin|usuario|titular|administrador)\b/is]
 ];
 const sources=["user","external_document","tool_output","unknown"];
 const actions=["none","read_sensitive","external_transfer","execute","change_permissions"];
 function normalize(s){return s.normalize("NFKC").normalize("NFD").replace(/\p{M}/gu,"").toLowerCase().replace(/\s+/gu," ").trim();}
 function review(value,context={}){
  if(typeof value!=="string")throw new TypeError("Texto inválido.");
  if(value.length>LIMIT)throw new RangeError("Limite de 12.000 caracteres.");
  if(context===null||typeof context!=="object"||Array.isArray(context))throw new TypeError("Contexto inválido.");
  const source=context.source===undefined?"unknown":context.source;
  const action=context.action===undefined?"none":context.action;
  const authorized=context.authorized===undefined?false:context.authorized;
  if(!sources.includes(source)||!actions.includes(action)||typeof authorized!=="boolean")throw new TypeError("Metadados inválidos.");
  const text=normalize(value);
  if(text.length>LIMIT*4)throw new RangeError("Texto normalizado excede o limite.");
  const signals=rules.filter(([,re])=>re.test(text)).map(([kind])=>kind);
  const sensitive=privacyApi.privacy(value).total;
  if(sensitive)signals.push("sensitive_pattern");
  const has=k=>signals.includes(k);
  const untrusted=source!=="user";
  const restricted=action!=="none";
  if(restricted&&!authorized)signals.push("authorization_missing");
  if(restricted&&untrusted)signals.push("untrusted_action_source");
  const highSignal=has("instruction_override")||has("secret_request")||has("permission_bypass")||has("concealment");
  const moderateSignal=has("authority_claim")||has("execution_request")||has("external_transfer")||sensitive>0;
  let level="low",decision="no_signal";
  if(signals.length){level="medium";decision="review";}
  if(highSignal||(untrusted&&moderateSignal)||restricted){level="high";decision="review";}
  if((restricted&&(!authorized||untrusted))||(untrusted&&highSignal)){
   level="critical";decision="block_recommended";
  }
  return {level,decision,signals,sensitive,source,action,authorization:authorized?"declared":"not_declared",notice:"Heuristic signals only; not an authorization or safety verdict."};
 }
 return Object.freeze({review,LIMIT});
}
const privacy=typeof module!=="undefined"&&module.exports?require("../block-02/privacy.js"):root.ArgusPrivacyVNext;
if(!privacy)throw new Error("ArgusPrivacyVNext required");
const api=makeReview(privacy);if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.ArgusPromptReview=api;
})(typeof globalThis!=="undefined"?globalThis:this);

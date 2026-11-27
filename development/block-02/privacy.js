/* Argus Block 02 — experimental local masking engine; not production DLP. */
(function(root){
function makePrivacy(){
  "use strict";
  const LIMIT=12000;
  const rules=[
    ["private_key",/-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----[\s\S]*?-----END (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/g],
    ["credential",/"(?:senha|password|passwd|pwd|api[_ -]?key|access[_ -]?token|refresh[_ -]?token|client[_ -]?secret|token|secret)"[ \t\r\n]*:[ \t\r\n]*"((?:\\.|[^"\\\r\n])*)"/gdi,1],
    ["credential",/\b(?:authorization\s*:\s*)?bearer[ \t]+[A-Za-z0-9._~+\/=-]+/gi],
    ["credential",/\b(?:senha|password|passwd|pwd|api[_ -]?key|access[_ -]?token|refresh[_ -]?token|client[_ -]?secret|token|secret)\b[ \t]*[:=][ \t]*(?:"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'|[^\s,;}\]]+)/gi],
    ["credential",/\b(?:senha (?:tempor[áa]ria|provis[óo]ria)|temporary password)[ \t]*[:=][ \t]*(?:"(?:\\.|[^"\\\r\n])*"|\'(?:\\.|[^\'\\\r\n])*\'|[^\s,;}\]]+)/gi],
    ["key",/\b(?:sk-[A-Za-z0-9_-]{16,}|AKIA[A-Z0-9]{16}|gh[pousr]_[A-Za-z0-9_]{20,})\b/g],
    ["person_name",/\b(?:nome(?: completo| pessoal| fict[ií]cio)?|full name|personal name)[ \t]*:[ \t]*([^\r\n;]{2,})/gdi,1],
    ["address",/\b(?:endere[cç]o(?: residencial| fict[ií]cio)?|home address|residential address)[ \t]*:[ \t]*([^\r\n;]{3,})/gdi,1],
    ["credential",/\b(?:senha|password|passwd|pwd)[ \t]+(?:é|is)[ \t]+(?:"(?:\\.|[^"\\\r\n])+"|\'(?:\\.|[^\'\\\r\n])+\'|[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)+)/gi],
    ["email",/(?<![\p{L}\p{M}\p{N}._%+-])[\p{L}\p{M}\p{N}._%+-]+[ \t]*(?:\[at\]|\(at\))[ \t]*[\p{L}\p{M}\p{N}-]+(?:[ \t]*(?:\[dot\]|\(dot\))[ \t]*[\p{L}\p{M}\p{N}-]+)+(?![\p{L}\p{M}\p{N}-])/giu],
    ["email",/(?<![\p{L}\p{M}\p{N}._%+-])[\p{L}\p{M}\p{N}._%+-]+@[\p{L}\p{M}\p{N}.-]+\.[\p{L}\p{M}]{2,}(?![\p{L}\p{M}\p{N}-])/giu],
    ["cnpj",/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g],
    ["phone",/\b(?:telefone|celular|phone|tel)[ \t]*[:=][ \t]*(?:\+55[ \t]*)?(?:\(\d{2}\)|\d{2})[ \t]*\d{4,5}-?\d{4}\b/gi],
    ["phone",/(?:\+55[ \t]*)?\(\d{2}\)[ \t]*\d{4,5}-?\d{4}\b|\+55[ \t]?\d{2}[ \t]?\d{4,5}-?\d{4}\b|\b\d{2}[ \t]+\d{4,5}-\d{4}\b/g],
    ["cpf",/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g],
    ["card",/(?<!\d)(?<!\d[ -])(?:\d[ -]?){12,18}\d(?![ -]?\d)/g]
  ];
  const labels={person_name:"NOME",address:"ENDERECO",private_key:"CHAVE_PRIVADA",credential:"CREDENCIAL",key:"CHAVE",email:"EMAIL",cnpj:"CNPJ",phone:"TELEFONE",cpf:"CPF",card:"CARTAO"};
  function luhn(s){
    const d=s.replace(/\D/g,""); if(d.length<13||d.length>19||/^(\d)\1+$/.test(d))return false;
    let sum=0;for(let i=d.length-1,j=0;i>=0;i--,j++){let x=Number(d[i]);if(j%2){x*=2;if(x>9)x-=9;}sum+=x;}return sum%10===0;
  }
  function cpfValid(d){if(!/^\d{11}$/.test(d)||/^(\d)\1+$/.test(d))return false;for(let len=9;len<=10;len++){let sum=0;for(let i=0;i<len;i++)sum+=Number(d[i])*(len+1-i);const x=(sum*10)%11;if((x===10?0:x)!==Number(d[len]))return false;}return true;}
  function privacy(value){
    if(typeof value!=="string")throw new TypeError("Texto inválido.");
    if(value.length>LIMIT)throw new RangeError("Limite de 12.000 caracteres.");
    const hits=[];
    rules.forEach(([kind,re,group],priority)=>{
      for(const m of value.matchAll(re)){
        if(kind==="card"&&!luhn(m[0]))continue;
        if(kind==="cpf"&&/^\d{11}$/.test(m[0])&&!cpfValid(m[0])&&/\b(?:pedido(?: interno)?|numero do pedido|número do pedido|order(?: id| number)?)[ \t]*[:#]?[ \t]*$/i.test(value.slice(Math.max(0,m.index-80),m.index)))continue;
        const [start,end]=group?m.indices[group]:[m.index,m.index+m[0].length];
        if(start===end)continue;
        hits.push({start,end,kind,priority});
      }
    });
    hits.sort((a,b)=>a.start-b.start||a.priority-b.priority||b.end-a.end);
    const merged=[];
    for(const hit of hits){
      const last=merged[merged.length-1];
      if(last&&hit.start<last.end){
        last.end=Math.max(last.end,hit.end);
        if(hit.priority<last.priority){last.kind=hit.kind;last.priority=hit.priority;}
      }else merged.push({...hit});
    }
    let output="",cursor=0;const counts=new Map();
    for(const hit of merged){
      output+=value.slice(cursor,hit.start)+"["+labels[hit.kind]+"]";
      cursor=hit.end;counts.set(hit.kind,(counts.get(hit.kind)||0)+1);
    }
    output+=value.slice(cursor);
    return {output,findings:[...counts].map(([kind,count])=>({kind,count})),total:merged.length,attention:merged.length?"review":"none"};
  }
  return Object.freeze({privacy,LIMIT});
}
const api=makePrivacy();if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.ArgusPrivacyVNext=api;
})(typeof globalThis!=="undefined"?globalThis:this);

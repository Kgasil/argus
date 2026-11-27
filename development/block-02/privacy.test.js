"use strict";
const assert=require("node:assert/strict");
const next=require("./privacy.js");
const legacy=require("../../extension/core.js");
function runSuite(a,assert){
 const p=s=>a.privacy(s);const cases=[
 ["email","pessoa@example.invalid","[EMAIL]"],
 ["cpf","123.456.789-00","[CPF]"],
 ["cpf compact","12345678900","[CPF]"],
 ["cnpj","12.345.678/0001-99","[CNPJ]"],
 ["cnpj compact","12345678000199","[CNPJ]"],
 ["phone","(12) 99999-1234","[TELEFONE]"],
 ["phone spaced","12 99999-1234","[TELEFONE]"],
 ["phone plus","+5512999991234","[TELEFONE]"],
 ["phone labelled","telefone: 12999991234","[TELEFONE]"],
 ["credential","senha: ficticia123","[CREDENCIAL]"],
 ["quoted","password=\"test example\"","[CREDENCIAL]"],
 ["json quoted",'{"password":"synthetic example"}','{"password":"[CREDENCIAL]"}'],
 ["json escaped",'{"password":"synthetic \\"example\\""}','{"password":"[CREDENCIAL]"}'],
 ["json empty",'{"password":""}','{"password":""}'],
 ["json email",'{"password":"pessoa@example.invalid"}','{"password":"[CREDENCIAL]"}'],
 ["client secret","client_secret=synthetic-value","[CREDENCIAL]"],
 ["access token","access_token: synthetic-value","[CREDENCIAL]"],
 ["refresh token","refresh_token: synthetic-value","[CREDENCIAL]"],
 ["bearer","Authorization: Bearer synthetic.token.value","[CREDENCIAL]"],
 ["standalone bearer","Bearer synthetic.token.value","[CREDENCIAL]"],
 ["key","sk-abcdefghijklmnopqrst","[CHAVE]"],
 ["github key","ghp_abcdefghijklmnopqrst","[CHAVE]"],
 ["aws pattern","AKIAABCDEFGHIJKLMNOP","[CHAVE]"],
 ["private key","-----BEGIN PRIVATE KEY-----\nSYNTHETIC ONLY\n-----END PRIVATE KEY-----","[CHAVE_PRIVADA]"],
 ["rsa pattern","-----BEGIN RSA PRIVATE KEY-----\nSYNTHETIC ONLY\n-----END RSA PRIVATE KEY-----","[CHAVE_PRIVADA]"],
 ["card test","4111 1111 1111 1111","[CARTAO]"],
 ["card compact","4111111111111111","[CARTAO]"],
 ["card hyphens","4111-1111-1111-1111","[CARTAO]"],
 ["card after text","Cartão 4111 1111 1111 1111.","Cartão [CARTAO]."],
 ["card invalid","4111 1111 1111 1112","4111 1111 1111 1112"],
 ["overlap","senha: pessoa@example.invalid","[CREDENCIAL]"],
 ["overlap card","password=\"4111 1111 1111 1111\"","[CREDENCIAL]"],
 ["multiple","a@example.invalid; b@example.invalid","[EMAIL]; [EMAIL]"],
 ["plain","Texto comum","Texto comum"],
 ["empty","",""],
 ["unrelated number","Pedido 12345","Pedido 12345"],
 ["no credential label","token de exemplo","token de exemplo"],
 ["preserve punctuation","Olá, a@example.invalid!","Olá, [EMAIL]!"],
 ["multiline","a@example.invalid\n123.456.789-00","[EMAIL]\n[CPF]"],
 ["existing mask","[EMAIL]","[EMAIL]"],
 ["html inert","<b>texto</b>","<b>texto</b>"]
 ];
 let n=0;for(const [name,input,expected] of cases){assert.equal(p(input).output,expected,name);n++;}
 assert.equal(p("a@example.invalid; b@example.invalid").total,2);n++;
 assert.deepEqual(p("senha: a@example.invalid").findings,[{kind:"credential",count:1}]);n++;
 assert.equal(p("texto").attention,"none");n++;
 assert.equal(p("a@example.invalid").attention,"review");n++;
 assert.equal(p("a".repeat(12000)).output.length,12000);n++;
 assert.throws(()=>p("a".repeat(12001)));n++;
 assert.throws(()=>p(null));n++;
 assert.equal(p(p("a@example.invalid").output).output,"[EMAIL]");n++;
 assert.equal(JSON.parse(p('{"password":"synthetic example"}').output).password,"[CREDENCIAL]");n++;
 assert.equal(JSON.stringify(p("senha: synthetic-value").findings).includes("synthetic-value"),false);n++;
 return n;
}
console.log(runSuite(next,assert)+" candidate checks passed");
const regressions=[
 ['JSON password','{"password":"synthetic example"}','synthetic example'],
 ['Bearer','Authorization: Bearer synthetic.token.value','synthetic.token.value'],
 ['GitHub key','ghp_abcdefghijklmnopqrst','ghp_abcdefghijklmnopqrst'],
 ['Card','Cartão 4111 1111 1111 1111','4111 1111 1111 1111'],
 ['Private key','-----BEGIN PRIVATE KEY-----\\nSYNTHETIC ONLY\\n-----END PRIVATE KEY-----','SYNTHETIC ONLY'],
 ['Phone','+5512999991234','+5512999991234']
];
for(const [name,input,marker] of regressions){assert.ok(legacy.privacy(input).output.includes(marker),"Legacy reproduction: "+name);assert.ok(!next.privacy(input).output.includes(marker),"Candidate correction: "+name);console.log("Legacy reproduced and candidate masked: "+name);}
console.log(regressions.length+" comparative regression cases passed");

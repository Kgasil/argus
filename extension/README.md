# Argus Mini — 0.1.0 (prévia experimental)

Extensão gratuita para navegadores Chromium. Abra a extensão e cole texto fictício para mascarar padrões de e-mail, CPF, CNPJ, telefone e credenciais ou revisar sinais heurísticos de risco em prompts. Não verifica identidade, validade dos documentos, intenção, contexto ou segurança real. Pode gerar falsos positivos e falsos negativos.

## Instalação manual (Chrome / Edge)

**Instalação suspensa (26/11/2026):** o Microsoft Defender removeu o ZIP 0.1.0 com alerta grave de Cavalo de Troia. Não instale, não permita nem restaure o arquivo. A causa ainda está em investigação. Use o [Mini Lab web](https://kgasil.github.io/argus/mini/) para conhecer a proposta. [Acompanhar incidente #1](https://github.com/Kgasil/argus/issues/1).

**Installation paused:** Defender removed the ZIP with a severe Trojan detection. Do not install, allow or restore it. Investigation remains open; the web demo remains available.

Sem permissões declaradas, host permissions, scripts de conteúdo, background, conta, telemetria ou armazenamento persistente. Copiar resultado é uma ação explícita e depende do navegador. Não lê automaticamente páginas, área de transferência ou formulários. Não bloqueia envios. Não tente contornar políticas de instalação. Compatibilidade manual ainda precisa ser testada; não publicada em lojas.

[Tutorial no site](https://kgasil.github.io/argus/#instalar-extensao) · [Mini Lab web](https://kgasil.github.io/argus/mini/) · [Projeto Argus](https://kgasil.github.io/argus/)

## Desenvolvimento

`node tests/mini.test.js` a partir da raiz do repositório. O Mini Lab compartilha o mesmo motor local, com uma terceira ferramenta de cobertura de critérios textuais. A prévia não altera os motores existentes V10.2.

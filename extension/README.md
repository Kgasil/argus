# Argus Mini — 0.1.0 (prévia experimental)

Extensão gratuita para navegadores Chromium. Abra a extensão e cole texto fictício para mascarar padrões de e-mail, CPF, CNPJ, telefone e credenciais ou revisar sinais heurísticos de risco em prompts. Não verifica identidade, validade dos documentos, intenção, contexto ou segurança real. Pode gerar falsos positivos e falsos negativos.

## Instalação manual (Chrome / Edge)

> [!WARNING]
> **AVISO IMPORTANTE DE SEGURANÇA — Argus Mini 0.1.0 (26/11/2026)**
>
> O Microsoft Defender detectou o pacote ZIP 0.1.0 como Trojan:Script/Ulthar.A!ml (ThreatID 2147751841), com alerta grave, e removeu o arquivo. Estamos investigando a causa e preparando a solicitação de análise oficial à Microsoft. Não há confirmação de falso positivo ou liberação. Nunca recomendamos desativar o Windows Defender, ignorar alertas ou restaurar arquivos em quarentena. A instalação permanece suspensa; o laboratório web está disponível sem instalação.
>
> Microsoft Defender detected the 0.1.0 ZIP as Trojan:Script/Ulthar.A!ml (ThreatID 2147751841), rated severe, and removed the file. We are investigating the cause and preparing an official review request to Microsoft. No false-positive determination or clearance has been confirmed. We never recommend disabling Windows Defender, bypassing warnings or restoring quarantined files. Installation remains paused; the web lab is available without installation.
>
> [Incidente oficial](https://github.com/Kgasil/argus/issues/1) · [Mini Lab web](https://kgasil.github.io/argus/mini/)

Sem permissões declaradas, host permissions, scripts de conteúdo, background, conta, telemetria ou armazenamento persistente. Copiar resultado é uma ação explícita e depende do navegador. Não lê automaticamente páginas, área de transferência ou formulários. Não bloqueia envios. Não tente contornar políticas de instalação. Compatibilidade manual ainda precisa ser testada; não publicada em lojas.

[Tutorial no site](https://kgasil.github.io/argus/#instalar-extensao) · [Mini Lab web](https://kgasil.github.io/argus/mini/) · [Projeto Argus](https://kgasil.github.io/argus/)

## Desenvolvimento

`node tests/mini.test.js` a partir da raiz do repositório. O Mini Lab compartilha o mesmo motor local, com uma terceira ferramenta de cobertura de critérios textuais. A prévia não altera os motores existentes V10.2.

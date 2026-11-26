# Argus Mini — 0.1.0 (prévia experimental)

Extensão gratuita para navegadores Chromium. Abra a extensão e cole texto fictício para mascarar padrões de e-mail, CPF, CNPJ, telefone e credenciais ou revisar sinais heurísticos de risco em prompts. Não verifica identidade, validade dos documentos, intenção, contexto ou segurança real. Pode gerar falsos positivos e falsos negativos.

## Instalação manual (Chrome / Edge)

1. Baixe o [ZIP do repositório](https://github.com/Kgasil/argus/archive/refs/heads/main.zip) e extraia em uma pasta permanente.
2. Abra `chrome://extensions/` ou `edge://extensions/`.
3. Ative o modo desenvolvedor, se permitido, e escolha Carregar sem compactação.
4. Selecione a subpasta `extension`, contendo `manifest.json`.
5. Abra Argus Mini pelo menu de extensões. Use o botão Exemplo fictício.

Sem permissões declaradas, host permissions, scripts de conteúdo, background, conta, telemetria ou armazenamento persistente. Copiar resultado é uma ação explícita e depende do navegador. Não lê automaticamente páginas, área de transferência ou formulários. Não bloqueia envios. Não tente contornar políticas de instalação. Compatibilidade manual ainda precisa ser testada; não publicada em lojas.

[Mini Lab web](https://kgasil.github.io/argus/mini/) · [Projeto Argus](https://kgasil.github.io/argus/)

## Desenvolvimento

`node tests/mini.test.js` a partir da raiz do repositório. O Mini Lab compartilha o mesmo motor local, com uma terceira ferramenta de cobertura de critérios textuais. A prévia não altera os motores existentes V10.2.

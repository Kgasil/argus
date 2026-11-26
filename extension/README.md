# Argus Mini — 0.1.0 (prévia experimental)

Extensão gratuita para navegadores Chromium. Abra a extensão e cole texto fictício para mascarar padrões de e-mail, CPF, CNPJ, telefone e credenciais ou revisar sinais heurísticos de risco em prompts. Não verifica identidade, validade dos documentos, intenção, contexto ou segurança real. Pode gerar falsos positivos e falsos negativos.

## Instalação manual (Chrome / Edge)

1. Baixe o [ZIP de instalação v0.1.0](https://github.com/Kgasil/argus/raw/refs/heads/main/downloads/Argus-Mini-v0.1.0-install.zip) e extraia em uma pasta permanente.
2. No Chrome, abra `chrome://extensions/`; no Edge, `edge://extensions/`.
3. Ative o modo desenvolvedor, se permitido, e clique em **Carregar sem compactação** (Load unpacked).
4. Selecione a pasta extraída que contém diretamente `manifest.json` (não o ZIP).
5. Abra Argus Mini no menu de extensões; fixe o ícone se desejar. Clique em Exemplo fictício e teste Privacidade ou Revisão de prompt.

Para atualizar, extraia a nova versão na mesma pasta e clique em Recarregar no gerenciador de extensões. Para remover, clique em Remover. Não contorne políticas administrativas. Validação manual ainda pendente; não disponível nas lojas.

Alternativa: [ZIP do repositório](https://github.com/Kgasil/argus/archive/refs/heads/main.zip); extraia e selecione a subpasta `extension`.

Sem permissões declaradas, host permissions, scripts de conteúdo, background, conta, telemetria ou armazenamento persistente. Copiar resultado é uma ação explícita e depende do navegador. Não lê automaticamente páginas, área de transferência ou formulários. Não bloqueia envios. Não tente contornar políticas de instalação. Compatibilidade manual ainda precisa ser testada; não publicada em lojas.

[Tutorial no site](https://kgasil.github.io/argus/#instalar-extensao) · [Mini Lab web](https://kgasil.github.io/argus/mini/) · [Projeto Argus](https://kgasil.github.io/argus/)

## Desenvolvimento

`node tests/mini.test.js` a partir da raiz do repositório. O Mini Lab compartilha o mesmo motor local, com uma terceira ferramenta de cobertura de critérios textuais. A prévia não altera os motores existentes V10.2.

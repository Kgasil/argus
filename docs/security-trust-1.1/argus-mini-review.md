# GRAAL Security & Trust 1.1 — Etapa 03 / Argus Mini
Data: 2026-11-26. Escopo: revisão estática dos cinco arquivos da extensão original, integridade e testes funcionais. Nenhuma alteração de produto, design ou pacote.

## Pacote original
- Snapshot: 3c498bc9d776fe8c0919e5d003ff23ac22dee0aa (backup-graal-security-trust-1.1-2026-11-26).
- downloads/Argus-Mini-v0.1.0-install.zip: 10.311 bytes, Git blob af5ec6c2df362ac3018cd00afd60b1dc87ccfdc1. Main e backup coincidem.
- SHA-256 recalculado dos bytes recuperados via GitHub: 3248c6c204b5651a9f63c5630547e1a18f021a0ffdc08feaba1566e7925fb8b1.
- Cinco nomes únicos esperados, entradas sem compressão ou criptografia, cabeçalhos locais e centrais consistentes, CRC-32 e correspondência byte a byte com os arquivos-fonte verificadas. Sem executável nativo, caminho inesperado, comentários ou dados adicionais detectados nas estruturas examinadas.

| Arquivo | Bytes | SHA-256 |
|---|---:|---|
| manifest.json | 271 | 709a6fa1ba2da542549af312a8e1b15f1ac0799acd8b3d996634cccec769bbf0 |
| popup.html | 1687 | 17479bfaac0ac46877b20e54442f433b08bc72c8b36716d61282e2bb4daa8cdd |
| style.css | 1752 | 977cfd63e23dbf37f320ac83e978a41f568db3d4b3f39279f9c86a60193866cf |
| core.js | 2767 | 079481ad2a1af69b8f35ac82620adb5387fb6864b503ed8573adf2ce29796b1e |
| ui.js | 3344 | 3798aa3534e16aa2394cc391dd01a5c1420e13e9e232758b9b139db0931cb8b9 |

## Revisão dos arquivos
- Manifest V3, versão 0.1.0, apenas action/default_popup; sem permissions, host_permissions, content_scripts, background ou native messaging declarados.
- popup.html e style.css: recursos locais; dois scripts locais; nenhuma referência remota observada.
- core.js: mascaramento heurístico por regex, revisão textual e cobertura de critérios; limite de entrada de 12.000 caracteres e de 20 critérios. Não executa comandos, instruções ou texto analisado; não acessa rede, arquivos ou armazenamento.
- ui.js: renderização por textContent e value; cópia explícita do resultado via clipboard.writeText, fallback de seleção manual; sem leitura automática da área de transferência, envio de dados ou persistência observados.
- Nenhuma dependência externa de runtime declarada ou incorporada ao ZIP. Não foi identificado comportamento malicioso evidente nos arquivos examinados.
- Limitações funcionais existentes: o mascaramento e a revisão são heurísticos, podem deixar dados sensíveis não reconhecidos e gerar falsos positivos; a cobertura de critérios é textual, não factual. A interface da extensão oferece privacidade e revisão de prompts; cobertura também está disponível no motor e no Mini Lab. Usar apenas dados fictícios. Preservar as funcionalidades e não ampliar escopo desta fase.

## Validação
- Verificador de integridade: python3 tests/verify_mini_package.py; valida hash, nomes, CRC, paridade com fontes e manifesto sem executar os arquivos do ZIP.
- Testes existentes: 23 casos de mascaramento, revisão e cobertura; execução CI e sintaxe de ambos os scripts a confirmar.
- Sem novo scan Defender, teste de instalação em Chrome/Edge, aprovação de loja ou assinatura digital nesta etapa. A revisão estática não comprova ausência de malware. A análise no Windows e a validação de instalação ficam para as etapas previstas. Não contornar alertas. Nenhum custo assumido.

# Argus Block 02 — experimental data protection / proteção de dados
Date: 2026-11-27. Baseline: 795521415839dd5f68232078bef33f081786b974. Development-only branch; no merge, release, packaging or deployment.

## Scope / Escopo
- Independent browser/Node-compatible masking module with no external runtime dependencies, network, persistence, telemetry or model integration.
- Existing extension, Mini Lab, main site, official branding and original ZIP are unchanged. The candidate is deliberately not connected to the released UI. Incident #1 remains open and installation suspended.
- New patterns: quoted JSON credentials, bearer tokens, additional labelled secrets, GitHub-shaped tokens, PEM private-key blocks, Brazilian telephone variants, Luhn-compatible payment-card patterns. Existing email, CPF, CNPJ and credential patterns retained.
- Overlapping spans are merged before replacement; findings expose only category and count. Explicit attention is review/none, not a safety verdict. Input bound: 12,000 UTF-16 code units.
- Use synthetic examples only. Pattern matching does not identify all PII or secrets, validate CPF/CNPJ, guarantee valid structured output, or enforce actual DLP. Card checksum is a heuristic; invalid or unsupported formats may remain. Names, addresses, arbitrary tokens, encoded or obfuscated data, document context and semantic sensitivity remain outside scope. User review required before sharing.
- Portuguese: motor experimental isolado, sem integração à interface publicada. Não é DLP empresarial, garantia de anonimização ou certificação. Dados fictícios apenas; revisão humana obrigatória. Sem alteração do ZIP investigado.
## Tests / Testes
Run node development/block-02/privacy.test.js, node tests/mini.test.js and python3 tests/verify_mini_package.py. Candidate suite (51 checks) executed in an isolated JS runtime before commit; comparative legacy cases and repository tests are independently configured for CI. CI status must be checked from actual logs. No browser, Defender or store validation performed by this document.
## Release gate / Critérios de publicação
No release until incident resolution, exact artifact hash and updated security checks, browser regressions, false-negative/false-positive evaluation on an independent synthetic corpus, human review and documented overall score >=9/10. A passing fixture suite is not a product security score.

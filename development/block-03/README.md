# Argus Block 03 — AI Security / revisão de prompts
Date: 2026-11-27. Development-only, based on a17c05decafa7b90cfe470586aa05b04de979a1f (Block 02). No change to public UI, extension, ZIP, branding or release.

## Design / Projeto
Local deterministic review using Block 02 privacy engine; no external services, persistence, runtime dependencies or command execution. Signals: instruction override, secret request, permission bypass, authority claim, execution request, external transfer, concealment and sensitive patterns. Normalizes NFKC, accents and whitespace for textual review. Returns only labels/counts and constrained context values, never raw input. Input bound 12,000 UTF-16 units.

Context source/action/authorized must be supplied independently by the trusted calling application, never inferred from the text or a model's claims. Unknown source and no authorization are defaults. Authorized is a declared boolean, not verified identity or proof of permission. No source other than user may recommend an action without a block recommendation; even a declared authorized user action requires review. No action is performed. A caller must implement actual independent access control; do not use this module as a sole enforcement mechanism.

Classification: low/no_signal (no matched patterns, not safe), medium/review (limited indicators), high/review (strong indicators or action context), critical/block_recommended (untrusted strong indicators or restricted action without authorization/from untrusted source). These are heuristic triage labels, not CVSS or proven attack severity. Educational quotations may trigger review. Encoded, obfuscated, multilingual, indirect and semantic attacks may be missed; context provenance can be misreported. No protection guarantee. Synthetic data only.

PT: revisão local demonstrativa, não executa prompts, comandos ou ações, não concede autorização, não substitui controles de acesso, nem comprova segurança. Metadados precisam vir de fonte confiável independente. Revisão humana obrigatória. Bloqueio é recomendação, não enforcement. Sem publicação; incidente #1 permanece aberto.

## Tests / Testes
Run node development/block-03/review.test.js (43 cases; pre-commit isolated JS execution), node development/block-02/privacy.test.js, node tests/mini.test.js and python3 tests/verify_mini_package.py. CI checks all suites; consult actual run logs. No browser integration, external attack simulation, native security scan or independent benchmark performed. Overall 9/10 gate remains pending. Main advanced separately by README-only change; reconcile before any future integration.

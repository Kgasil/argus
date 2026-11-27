# Argus Block 04 — AI Assurance / confiabilidade
Date: 2026-11-27. Development-only baseline 3ff5a655e76df11e56ba4a6cdcca03193cde0d40. No production UI integration, ZIP changes, deployment or release.

## Contract / Contrato
evaluate({claims, references}). Claims contain id, fact, exclusive (explicit boolean), optional text. References contain id, facts (array), optional text. A fact contains subject, predicate, scope, unit and value (finite number, boolean or nonempty string). Use synthetic data only. The caller must supply accurately extracted facts and set exclusivity only for relations that admit a single value within the given scope. No automatic extraction or trust in AI-generated metadata is implied. All fields are exact, NFC-normalized, case-sensitive (except optional text hints). Use explicit scope and unit (e.g. "none" for unitless values). No conversions or date inference. Distinct data types are not equated. Identifiers are opaque synthetic labels; do not encode private information in them.

## Results / Resultados
- compatible: at least one matching structured fact and no detected contradiction.
- contradiction: conflicting value for explicitly exclusive relation or inconsistent claims.
- mixed_evidence: both matching evidence and a contradiction (including between claims).
- text_only: phrase occurrence, even in negated or quoted text; NEVER structured support.
- unsupported: no matching structured fact or qualifying textual hint. Not necessarily false.
- Different values for nonexclusive relations are separately reported, not called contradictions.
- Match, conflict and text-hint reference IDs are deduplicated. Human review is always required. Priority labels are workflow guidance, not probability, truth or certification.
- No raw input content is returned apart from caller-supplied identifiers. No network, external dependencies, persistence or model access. Input sizes are bounded. No verification of source authenticity, currency, factual truth, causality, semantic equivalence, completeness, citations or extraction correctness. No automatic claim extraction.
- PT: comparação estruturada de referências fornecidas; sem verificação factual independente. Correspondência textual não é evidência factual; ausência de suporte não prova falsidade. Contradições dependem de escopo, unidade, tipo e exclusividade informados. Revisão humana obrigatória, inclusive para resultados compatíveis. Não é detector universal de alucinações. Não enviar dados reais.

## Validation / Validação
Run node development/block-04/assurance.test.js (54 synthetic cases), prior Block 02/03 suites, original tests and package verifier. New suite passed in isolated JS runtime before commit; CI evidence must be confirmed separately. No browser or antivirus validation here. Incident #1 remains open; original package suspended. Overall 9/10 gate remains pending; reconcile independent README change on main before integration.

# ProofMiner

ProofMiner helps an established expert decide **what evidence to show now** to reduce uncertainty at a specific buyer decision moment.

## Current product model

`Decision Moment → Candidate Claim → Evidence Graph → Proof Move → Representation → Observed Outcome`

The stable atom is **Evidence**, not a fixed Proof Unit. Proof is contextual: the same evidence can support different claims in different decision moments, and one claim may require several pieces of evidence.

## Interactive v2 Preview

The current product branch implements a visible end-to-end prototype of the new experience:

1. describe one real Decision Moment;
2. provide one existing source;
3. receive one Proof Move with an exact source trace;
4. see why the evidence supports the claim and what it does **not** prove;
5. correct the recommendation or choose an alternative;
6. turn the selected proof into a reader-first draft;
7. pass a Truth Check before marking it ready for use.

The current extraction/recommendation logic is still a **client-side prototype**, not the final AI/evidence engine. The product doctrine and Definition of Done explicitly prevent treating it as validated intelligence.

## Source of truth

Read these before changing product behavior:

- `PRODUCT_DOCTRINE.md`
- `docs/PRODUCT_MODEL.md`
- `docs/DEFINITION_OF_DONE.md`
- `docs/ARCHITECTURE_DECISION_LOG.md`

Deployment/orchestration contracts live under `skills/`.

## Run locally

```bash
npm install
npm run dev
```

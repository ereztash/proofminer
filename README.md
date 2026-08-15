# ProofMiner

ProofMiner helps an established expert reduce a buyer's uncertainty at a specific decision moment by finding and deploying the strongest evidence the expert has already earned.

It is **not** a generic content generator and it is no longer modeled as a universal proof-scoring dashboard.

## Current product model

```text
Decision Moment
→ Candidate Claim
→ Evidence Units from real Source Assets
→ SUPPORTS / QUALIFIES / CONTRADICTS
→ Proof Move
→ Representation
→ Publication / Use
→ Observed Outcome
```

The stable atom is an **Evidence Unit**, not a fixed Proof Unit. What evidence proves depends on the claim and the decision context.

## Current architecture status

Product lifecycle state: **ARCHITECTING**.

The current production UI is a functional prototype. Future implementation should derive from the current product doctrine and Definition of Done rather than extending the legacy fixed-weight scoring model.

## Product source of truth

- [`PRODUCT_DOCTRINE.md`](PRODUCT_DOCTRINE.md) — telos, ICP, invariants, UX and epistemic doctrine.
- [`docs/PRODUCT_MODEL.md`](docs/PRODUCT_MODEL.md) — Decision Moment, Evidence Graph, Proof Move and product memory.
- [`docs/DEFINITION_OF_DONE.md`](docs/DEFINITION_OF_DONE.md) — blocking gates for build, field validation and shipping.
- [`docs/ARCHITECTURE_DECISION_LOG.md`](docs/ARCHITECTURE_DECISION_LOG.md) — decisions that supersede earlier product assumptions.

## Delivery orchestration

Application work is routed through:

```text
app-orchestrator
→ Architect provider
→ BUILD_AUTHORIZED contract
→ vercel-app-builder
→ Preview evidence
→ validation
→ ship / revise / kill
```

See [`skills/README.md`](skills/README.md).

## Run locally

```bash
npm install
npm run dev
```

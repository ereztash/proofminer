# ProofMiner

ProofMiner is being rebuilt around a broader job than proof selection or authority planning.

The current conscious problem hypothesis is:

> **I know I need to build authority / professional standing, but I do not know where my limited time, money and attention should go first — or what I should not do yet.**

The current product-value hypothesis is not "give the user an Authority Map".

It is:

> **Improve the user's allocation of scarce resources toward the strongest grounded path to the authority position they want.**

That requires measuring what the user would have done without the product before showing any recommendation.

---

## Current user-state model

```text
A0 — capability / market-response mismatch
  ↓ recognition
A1 — authority need + plausible actions + uncertain allocation
  ↓ counterfactual capture + analysis
B  — grounded allocation decision
     KEEP / ACCELERATE / REORDER / REDUCE / DELAY / STOP / REPLACE / ADD
  ↓ execution
C  — actual resource allocation + action in the world
  ↓ market evidence + learning
D  — revised allocation / next best action
  ↺
```

The **Authority Map is the explanation/navigation artifact supporting B**. It is not sufficient evidence of value by itself.

---

## Measurement primitive

Before advice, capture:

> **If this product did not exist, what would you actually do over the next relevant planning window?**

That stated counterfactual becomes the before-state.

After recommendation, compare action by action:

- `KEEP`
- `ACCELERATE`
- `REORDER`
- `REDUCE`
- `DELAY`
- `STOP`
- `REPLACE`
- `ADD`

Track time, cash and other scarce commitments separately when material.

Do **not** call stopped or delayed work "saved" merely because the system recommended stopping it.

The current North-Star candidate is the construct:

> **Counterfactual Resource Allocation Delta toward O**

It is intentionally not one universal composite score.

See `docs/RESOURCE_REALLOCATION_CONTRACT.md`.

---

## Current product model

The top-level unit remains an **Authority Project**.

```text
Authority goal
→ stated counterfactual allocation
→ person + field model
→ audience path
→ strategic diagnosis
→ allocation decision
→ dependency-aware Authority Map
→ real-world action
→ market signal / outcome
→ learning
→ revised allocation / map
```

The system should be able to say not only "do X", but also:

- keep doing X;
- move Y earlier;
- reduce Z;
- delay a reasonable action until a prerequisite exists;
- stop an action when the opportunity cost is no longer justified;
- add a higher-leverage action the user had not planned.

Stopping is not inherently good. Evidence may later reverse a prior `STOP` or `DELAY`.

---

## ProofMiner remains as a trust subsystem

The v2 evidence architecture remains useful beneath Authority Actions when a claim needs grounding.

`DecisionMoment`, `EvidenceUnit`, `CandidateClaim`, `EvidenceRelation` and `ProofMove` support provenance, contradiction handling, privacy and inference discipline.

Proof is one authority-building mechanism, not the product's top-level telos.

---

## Governing rule

The repository is governed by a telos-first recursive stop rule.

Every meaningful phase ends with one of:

- `CONTINUE` — a material internal gap remains and is resolvable now;
- `REPLAN` — the current framing / architecture / metric / sequence blocks O;
- `FIELD` — reality is now the highest-value information source;
- `STOP` — no further justified action or reallocation is currently expected to materially improve O.

The Stop Rule now explicitly asks not only "what should happen next?" but also **where further resources are justified and where they are not**.

A completed checklist or improving metric cannot authorize `STOP`.

---

## Current lifecycle state

**FIELD — counterfactual → allocation-delta validation**

The latest Telos Governance iteration invalidated `Decision-Ready Authority Map` as a sufficient B-state. A user can understand a map perfectly while receiving no additive value if they would execute the same plan anyway.

The current field question is therefore:

> **Does a grounded personalized analysis materially change where a target user intends to allocate scarce resources — and does later evidence support, weaken or reverse that reallocation?**

The scripted low-fidelity prototype tests whether the before/after semantics are understandable. Personalized strategic value must be tested with Wizard-of-Oz analysis, not simulated intelligence.

---

## Source of truth

Read these before changing product behavior:

1. `docs/TELOS_GOVERNANCE.md` — highest-authority governing rule.
2. `docs/RESOURCE_REALLOCATION_CONTRACT.md` — counterfactual baseline, allocation delta and validation contract.
3. `docs/UX_TRANSITION_CONTRACT.md` — A0→A1→B→C→D user-state transitions.
4. `docs/DEFINITION_OF_DONE.md` — current falsifiable gates.
5. `docs/FIRST_SESSION_FLOW_V3.md` — current counterfactual-first session flow.
6. `docs/FIELD_PROTOCOL_V3.md` — preregistered comprehension + personalized allocation-value tests.
7. `PRODUCT_DOCTRINE.md` — broader product doctrine and mechanism hypotheses.
8. `docs/PRODUCT_MODEL.md` — Authority Project, Authority Map and evidence/trust subsystem.
9. `docs/ARCHITECTURE_DECISION_LOG.md` — invalidated assumptions and architecture decisions.

Deployment/orchestration contracts live under `skills/`.

---

## Prototype status

Current FIELD instrument:

`public/authority-prototype-v3-2.html`

It is intentionally low fidelity and its strategic recommendation is scripted.

It is **not production UI** and **not validated intelligence**.

Its job is to test whether users understand:

```text
what I planned to do without the product
→ what changed
→ where resources moved
→ why
→ what evidence should change the allocation again
```

The personalized Wizard-of-Oz test is the next evidence gate.

## Run locally

```bash
npm install
npm run dev
```

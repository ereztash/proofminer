# ProofMiner

ProofMiner is being rebuilt around a broader job than proof selection or authority planning.

The current conscious problem hypothesis is:

> **I know I need to build authority / professional standing, but I do not know where my limited time, money and attention should go first — or what I should not do yet.**

The current product-value hypothesis is not "give the user an Authority Map".

It is:

> **Improve the user's allocation of scarce resources toward the strongest grounded path to the authority position they want.**

That requires measuring what the user would have done without the product before showing any recommendation.

A second governing insight now sits above the analytical stack:

> **The system must also decide how to decide — and use the least-complex reasoning process sufficient for the live allocation decision.**

MCDA, optimization, Value of Information, robust analysis, adaptive pathways and simple rules are tools. None has default authority.

---

## Current user-state model

```text
A0 — capability / market-response mismatch
  ↓ recognition
A1 — authority need + plausible actions + uncertain allocation
  ↓ counterfactual capture + decision framing
META — decide how this decision should be decided
  ↓ requisite reasoning
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

## Meta-decision architecture

Before choosing a framework or algorithm, the system frames the live decision and characterizes only what is needed to select a sufficient reasoning mode.

Examples:

```text
hard prerequisite / dominance
→ simple rule or dependency reasoning

finite resource portfolio
→ marginal allocation reasoning

multiple real trade-offs
→ multi-criteria reasoning

one missing fact could flip the choice
→ Value of Information / targeted research

probabilities are not defensible
→ robust / vulnerability-oriented reasoning

future signals can justify changing course
→ adaptive pathways / triggers
```

At every escalation the system asks:

> **What material allocation decision could this additional analytical layer change?**

If none, analytical escalation stops.

This is the Stop Rule applied to reasoning itself.

See `docs/META_DECISION_GOVERNANCE.md`.

---

## Current product model

The top-level unit remains an **Authority Project**.

```text
Authority goal
→ stated counterfactual allocation
→ live decision frame
→ requisite method selection
→ person + field model
→ audience path
→ strategic diagnosis
→ allocation decision
→ dependency-aware Authority Map
→ real-world action
→ market signal / outcome
→ learning
→ revised allocation / map / method if needed
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

## 95% assurance boundary

Behind-the-scenes systems are not allowed to vote on strategic truth merely because they are sophisticated or agree with each other.

They may be treated as high-confidence assurance only for claim classes they can directly observe or deterministically test in a defined scope.

Good targets include:

- baseline was captured before recommendation;
- a hard constraint was represented;
- a method was invoked without its required preconditions;
- a refuted assumption still feeds an active recommendation;
- a map/allocation change has no recorded evidence trigger.

Deterministic guards, mutation/contract tests, refutation propagation and provenance checks are appropriate here.

Blind-review agreement, model confidence and cross-model consensus can test reproducibility or ambiguity, but are **not** >95% evidence that a strategic recommendation is true unless independently calibrated for that exact claim class.

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
- `REPLAN` — the current framing / architecture / metric / decision process blocks O;
- `FIELD` — reality is now the highest-value information source;
- `STOP` — no further justified action, reallocation, information request or analytical escalation is currently expected to materially improve O.

A completed checklist, improving metric or more sophisticated model cannot authorize `STOP`.

---

## Current lifecycle state

**FIELD — adaptive meta-decision value**

The latest Telos Governance iteration found that the prior resource-allocation architecture still left method choice implicit.

The current architecture now treats method selection as a governed meta-decision and adopts a requisite principle: use the least-complex process sufficient for the live problem.

The next material question is empirical:

> **Does context-sensitive selection of the reasoning process materially improve allocation decisions versus a simpler fixed advisory process?**

Do not build a full MCDA / optimization / VOI stack before that survives FIELD.

---

## Source of truth

Read these before changing product behavior:

1. `docs/TELOS_GOVERNANCE.md` — highest-authority governing rule.
2. `docs/META_DECISION_GOVERNANCE.md` — how the system decides how to decide.
3. `docs/RESOURCE_REALLOCATION_CONTRACT.md` — counterfactual baseline, allocation delta and validation contract.
4. `docs/UX_TRANSITION_CONTRACT.md` — A0→A1→B→C→D user-state transitions.
5. `docs/DEFINITION_OF_DONE.md` — current falsifiable gates.
6. `docs/FIRST_SESSION_FLOW_V3.md` — current counterfactual-first session flow.
7. `docs/FIELD_PROTOCOL_V3.md` — preregistered comprehension + personalized allocation-value tests.
8. `PRODUCT_DOCTRINE.md` — broader product doctrine and mechanism hypotheses.
9. `docs/PRODUCT_MODEL.md` — Authority Project, Authority Map and evidence/trust subsystem.
10. `docs/ARCHITECTURE_DECISION_LOG.md` — invalidated assumptions and architecture decisions.

Deployment/orchestration contracts live under `skills/`.

---

## Prototype status

Current UI FIELD instrument:

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

The personalized Wizard-of-Oz test remains the evidence gate for strategic value; structural router fixtures are the evidence gate for method-selection implementation rules.

## Run locally

```bash
npm install
npm run dev
```

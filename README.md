# ProofMiner

ProofMiner is being rebuilt around a broader job than proof selection or authority planning.

The current conscious problem hypothesis is:

> **I know I need to build authority / professional standing, but I do not know where my limited time, money and attention should go first — or what I should not do yet.**

The product-value hypothesis is now:

> **Help the user form a better-grounded model of the authority problem and allocate scarce resources toward the strongest grounded path — without replacing the user's authorship of the decision.**

The product therefore has to change more than a task list.

It must be able to explain:

- what the user believed before;
- what evidence changed that representation;
- what allocation changed because of it;
- what remains contestable;
- what evidence should change the decision again.

---

## Current user-state model

```text
A0 — capability / market-response mismatch
  ↓ recognition
A1 — authority need + plausible actions + uncertain representation/allocation
  ↓ project boundary + frozen counterfactual representation/allocation
META — decide how this decision should be decided
  ↓ requisite reasoning
B  — grounded, contestable allocation decision
     + explicit Representation Delta
     + KEEP / ACCELERATE / REORDER / REDUCE / DELAY / STOP / REPLACE / ADD
  ↓ user commitment + execution
C  — actual resource allocation + action in the world
  ↓ market evidence across affected authority surfaces
D  — revised representation / allocation / next best action
  ↺
```

The **Authority Map is an explanation/navigation artifact supporting B**. It is not sufficient evidence of value by itself.

User agreement is not sufficient evidence of decision authorship.

---

## Measurement and metric governance

Before advice, capture:

> **If this product did not exist, what would you actually do over the next relevant planning window?**

Also capture the minimum useful version of:

> **Why do you currently think those actions will work, what is the bottleneck, and what would change your mind?**

This creates two frozen baselines:

- stated counterfactual **representation**;
- stated counterfactual **allocation**.

After recommendation, compare them with the revised representation and allocation.

Current evaluation constructs include:

- Representation Delta;
- Decision Delta;
- Priority Delta;
- Resource Allocation Delta;
- Premature-Work Reallocation;
- New-Leverage Allocation;
- Decision Authorship / Contestability;
- Reversal / Regret.

**Counterfactual Resource Allocation Delta is not a North Star or routing objective.**

Until prospective field evidence establishes a justified use:

```text
measurement_use: observational / evaluation
routing_use: prohibited
governance_use_as_optimization_target: prohibited
```

A large delta is not success. A zero delta is not failure.

See `docs/RESOURCE_REALLOCATION_CONTRACT.md`.

---

## Meta-decision architecture

Before choosing a framework or algorithm, the system frames the live decision and uses the least-complex reasoning process sufficient for it.

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

At every escalation:

> **What material decision or resource allocation could this additional analytical layer change?**

If none, analytical escalation stops.

See `docs/META_DECISION_GOVERNANCE.md`.

---

## COR-SYS graph audit

The current architecture has been audited through the COR-SYS System Grammar:

`BND / ACT / REL / GOAL / REP / RES / RULE / MEM / OUT + EVT`

with orthogonal `Structure / Phenomenon / Intervention / Epistemic / Governance` lenses.

The audit exposed five material gaps:

1. `REP` — allocation change was measured more strongly than change in the user's decision representation;
2. `ACT / Governance` — acceptance could be mistaken for authorship; recommendations need first-class contestability;
3. `metric_governance` — Allocation Delta must not become the objective that recommendations optimize;
4. `BND` — project/field/surface boundaries need to be inspectable;
5. `EVT / MEM` — one real-world event may update multiple authority surfaces and should be recorded once.

The graph is used here as a falsification / representation instrument, **not as an empirical truth oracle**.

See `docs/COR_SYS_GRAPH_AUDIT_V1.md`.

---

## Current product model

The top-level unit remains an **Authority Project**.

```text
Authority goal
→ project / decision boundary
→ stated counterfactual representation + allocation
→ live decision frame
→ requisite method selection
→ person + field model
→ strategic diagnosis
→ representation + allocation decision
→ contestable dependency-aware Authority Map
→ user commitment / real-world action
→ one event linked to affected authority surfaces
→ market signal / outcome
→ learning
→ revised representation / allocation / map
```

Stopping is not inherently good. Evidence may later reverse a prior `STOP` or `DELAY`.

---

## 95% assurance boundary

Behind-the-scenes systems may be treated as high-confidence assurance only for claim classes they can directly observe or deterministically test in a defined scope.

Good targets include:

- baseline captured before recommendation;
- project/decision boundary recorded;
- hard constraint represented;
- method invoked without required preconditions;
- prohibited metric used as a routing input;
- refuted assumption still feeds an active recommendation;
- route/allocation change has no evidence trigger;
- blocked action recommended as executable.

Deterministic guards, mutation/contract tests, refutation propagation and provenance checks are appropriate here.

Blind-review agreement, model confidence and cross-model consensus can test reproducibility or ambiguity, but are **not** >95% evidence that a strategic recommendation is true unless independently calibrated for that exact claim class.

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

**FIELD — representation + allocation + authorship validation**

The latest COR-SYS graph iteration reopened `REPLAN` and closed it after changing the contracts for representation, contestability, metric authority, boundaries and multi-surface events.

The next material questions are empirical:

> **Does personalized analysis create a useful change in the user's decision representation and resource allocation without replacing the user's authorship?**

and, only where it can discriminate:

> **Does context-sensitive selection of the reasoning process materially improve that result versus a simpler fixed process?**

Do not build a full MCDA / optimization / VOI stack or polished production UI before these survive FIELD.

---

## Source of truth

Read these before changing product behavior:

1. `docs/TELOS_GOVERNANCE.md` — highest-authority governing rule.
2. `docs/COR_SYS_GRAPH_AUDIT_V1.md` — graph-based system audit and current structural findings.
3. `docs/META_DECISION_GOVERNANCE.md` — how the system decides how to decide.
4. `docs/RESOURCE_REALLOCATION_CONTRACT.md` — representation/counterfactual baseline and allocation validation contract.
5. `docs/DEFINITION_OF_DONE.md` — current falsifiable gates.
6. `docs/FIELD_PROTOCOL_V3.md` — personalized representation/allocation/authorship tests.
7. `docs/UX_TRANSITION_CONTRACT.md` — user-state transitions.
8. `docs/FIRST_SESSION_FLOW_V3.md` — current first-session flow.
9. `PRODUCT_DOCTRINE.md` — broader product doctrine and mechanism hypotheses.
10. `docs/PRODUCT_MODEL.md` — Authority Project, Authority Map and evidence/trust subsystem.
11. `docs/ARCHITECTURE_DECISION_LOG.md` — invalidated assumptions and architecture decisions.

---

## Prototype status

Current UI FIELD instrument:

`public/authority-prototype-v3-2.html`

It is intentionally low fidelity and its strategic recommendation is scripted.

It is **not production UI** and **not validated intelligence**.

The personalized Wizard-of-Oz test is the next evidence gate.

## Run locally

```bash
npm install
npm run dev
```

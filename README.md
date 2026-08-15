# ProofMiner

ProofMiner is being rebuilt around a broader job than proof selection.

The current product hypothesis is:

> **I know I need to build authority / professional standing, but I do not know what is actually right for me to do, or what should come first.**

The product aims to move that user from an authority ambition without a route to a **Decision-Ready Authority Map**: a personalized strategic path that explains who to build authority with, what the main gap is, what to do now, what can happen in parallel, what is blocked or premature, and why.

## Current user-state model

```text
A0 — capability / market-response mismatch
  ↓ recognition
A1 — "I need to build authority, but I do not know the right path or sequence"
  ↓ activation
B  — Decision-Ready Authority Map
  ↓ execution
C  — real authority-building action in the world
  ↓ market evidence + learning
D  — revised map / next best action
  ↺
```

The primary first-session job is currently **A1 → B**.

The acquisition / first-screen hierarchy should therefore begin with the user's conscious pain, not with our internal product model:

```text
conscious pain
→ promise of a personalized route
→ minimal input
→ first strategic value
→ explanation
→ deeper mechanism
→ compounding learning
```

## Current product model

The top-level unit is an **Authority Project**, not a post, score, Proof Move or isolated Decision Moment.

```text
Authority goal
→ audience path
→ person + field model
→ strategic diagnosis
→ dependency-aware Authority Map
→ next highest-leverage action
→ artifact / real-world behavior
→ market signal / outcome
→ learning
→ revised map
```

The Authority Map must distinguish:

- available now;
- sequential dependencies;
- parallel work;
- blocked actions;
- premature actions;
- unlocks;
- the current highest-leverage action.

It is a dependency graph, not a generic checklist.

## ProofMiner remains as a trust subsystem

The v2 evidence work is not discarded. It now sits below the Authority Project when an action requires a capability, outcome or credibility claim.

`DecisionMoment`, `EvidenceUnit`, `CandidateClaim`, `EvidenceRelation` and `ProofMove` remain useful for provenance, contradiction handling, privacy and inference discipline.

Proof is one authority-building mechanism. It is no longer the product's top-level telos.

## Governing rule

The repository is governed by a telos-first recursive stop rule.

The current DOD, product model, UX plan and implementation are hypotheses about how to realize the end-to-end telos. They may be rewritten when they block it.

Every meaningful phase ends with one of four outcomes:

- `CONTINUE` — a material internal gap remains and can be resolved now;
- `REPLAN` — the current framing / sequence / architecture itself blocks the telos;
- `FIELD` — reality is now the highest-value source of information;
- `STOP` — no further justified action is currently expected to materially improve telos realization.

A completed checklist is not sufficient for `STOP`.

## Current lifecycle state

**LOW-FIDELITY UX REPLAN → FIELD**

The latest finding reopened the entry experience: starting directly with "I want to become an authority in X" is still a useful input, but it is no longer assumed to be the right first message.

The next field instrument must test:

> **conscious pain → promise → input → Decision-Ready Authority Map**

before a polished UI or full AI engine is justified.

## Source of truth

Read these before changing product behavior:

1. `docs/TELOS_GOVERNANCE.md` — highest-authority governing rule.
2. `PRODUCT_DOCTRINE.md` — current product doctrine and mechanism hypotheses.
3. `docs/UX_TRANSITION_CONTRACT.md` — trigger, A0→A1→B→C→D transitions and measurable UX lenses.
4. `docs/DEFINITION_OF_DONE.md` — current falsifiable gates, subordinate to telos governance.
5. `docs/PRODUCT_MODEL.md` — Authority Project, Authority Map and evidence/trust subsystem.
6. `docs/ARCHITECTURE_DECISION_LOG.md` — important invalidated assumptions and architecture decisions.

Deployment/orchestration contracts live under `skills/`.

## Prototype status

The repository contains low-fidelity FIELD instruments intended to test comprehension and strategic decision readiness cheaply.

They are **not production UI** and must not be treated as validated intelligence.

A low-fidelity test passes because users understand the problem, recommendation, dependencies and next action — not because they say the interface is interesting or attractive.

## Run locally

```bash
npm install
npm run dev
```

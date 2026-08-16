# Telos Governance — Governing Rule v1.7

Date: 2026-08-16

## Authority

This document outranks product category, feature set, UX, UI, integrations, commercial model, research plan, simulation, semantic model, implementation plan and Definition of Done.

No current mechanism is protected by implementation effort.

---

# O — end-to-end user telos

The system exists to make consequential professional commitments **safer to enter and more useful to learn from**.

The desired end state is not frequent app use.

It is:

> **At the moment a professional commitment becomes expensive enough to matter, the user has the smallest decision-relevant check needed to expose what is being risked, what the commitment relies on, what is known versus inferred, and what future observation would justify reversal — without having to reconstruct the decision after the fact.**

The product should reduce avoidable commitment to weakly grounded strategic bets while preserving agency and allowing cheap, reversible action to proceed without ceremonial analysis.

---

# Indispensability ambition

> **Unskippable by value, skippable by design.**

A user must always be able to bypass the product.

The product may not manufacture indispensability through lock-in, streaks, anxiety, hidden switching costs, notification pressure, forced waiting or unnecessary approval gates.

The governing product DOD is behavioral:

> **After experiencing real value, a suitable user voluntarily routes later material commitments through ProofMiner because the expected loss from bypassing the check or losing the pre-commitment record is now meaningful to them.**

If the user does not notice when the capability disappears, the product is not indispensable.

---

# Category hypothesis

Working category:

> **Commitment Safety Layer**

ProofMiner is not primarily a journal, chat, dashboard, canvas, strategy report, pre-mortem engine or recommendation generator.

Those may exist as subordinate surfaces or methods.

The product belongs **between intention and consequential commitment**, then remains linked to execution and outcome.

---

# Canonical flow

```text
INTENT FORMS IN EXISTING WORK
        ↓
CANDIDATE COMMITMENT
        ↓
SUPPORT-VALUE ROUTER
   ├─ LOW VALUE → SILENT PASS
   └─ MATERIAL
        ↓
FREEZE PRE-INFLUENCE STATE
        ↓
EXPOSE COMMITMENT + RESOURCE EXPOSURE
        ↓
INFER CANDIDATE LOAD-BEARING BET
        ↓
USER CORRECTS / REJECTS
        ↓
EVIDENCE / ALTERNATIVE / UNKNOWN / REVERSAL
        ↓
PASS | MODIFY | PROBE
        ↓
REAL EXECUTION
        ↓
EXPECTED SIGNAL / OUTCOME
        ↓
DECISION FLIGHT RECORDER
        ↓
NEXT COMMITMENT RECEIVES BETTER CONTEXT
```

---

# Governing invariants

## 1. The system comes to the commitment

The user should not need to remember to open a blank decision app and reconstruct context.

An explicit one-click handoff is an acceptable first wedge. Over time, integrations may surface candidate commitments from existing work surfaces.

## 2. Silence is a valid product behavior

Most actions should not trigger a strategic intervention.

The system must minimize both:

- **missed-support error** — acting without help when help would materially improve the commitment;
- **unnecessary-support burden** — interrupting when the check cannot justify its cost.

## 3. Temporal integrity matters

The true pre-commitment state must be preserved before system influence and before outcomes contaminate memory.

This is a core product asset, not journaling ceremony.

## 4. Provenance remains explicit

Always distinguish:

- user-owned statement / action;
- system inference;
- external observation / evidence;
- unresolved hypothesis;
- real outcome.

No lower evidence class silently inherits higher authority.

## 5. Every intervention has commitment consequence

Valid outputs:

- `PASS` — proceed;
- `MODIFY` — alter commitment, sequence, scope, prerequisite or resource allocation;
- `PROBE` — acquire a smaller discriminating observation before a larger commitment.

Insight without commitment consequence is not enough.

## 6. Analysis must not become avoidance

`PROBE` is invalid when direct action is cheaper, reversible and at least as informative.

## 7. Memory compounds only from reality

Outcome-linked history may improve future support, but prior decisions remain source-linked, contestable and transferability-bounded.

The product may not turn repetition into authority by default.

---

# Creative × Adversarial governance

Every substantial product hypothesis is generated and attacked in the same iteration.

## Creative role

Ask:

> **What structurally different mechanism could make the product dramatically more valuable at the user’s real moment of need?**

It is allowed to change category, interaction surface, business model, workflow and product boundary.

## Adversarial role

For every creative proposal ask:

> **Why would a rational user still skip this, replace it with a general AI/template/human, disable it, distrust it, or fail to notice its absence?**

Also attack privacy, burden, false positives, epistemic overclaim, cold start, integration cost, analysis paralysis and commoditization.

A surviving idea must answer both voices simultaneously.

---

# Anti-recursion rule

Another internal iteration is justified only if it can change:

- the product category;
- the commitment surface;
- the support-routing rule;
- the intervention mechanism;
- the before-state capture;
- the real commitment outcome;
- the outcome-linking loop;
- the FIELD test.

If not, move to FIELD.

---

# Current FIELD boundary

The current hypothesis is **not proven indispensable**.

The next evidence must test whether users who experience value voluntarily seek or accept the layer at a later consequential commitment before the outcome is known, and whether its absence produces compensatory behavior.

Read with:

- `docs/INDISPENSABILITY_DOD_V1.md`
- `docs/CREATIVE_ADVERSARIAL_PRODUCT_RUN_V1.md`
- `docs/DOD_COMMITMENT_GATE_V1.md`
- `docs/COMMITMENT_GATE_FIELD_PROTOCOL_V1.md`

Current governance outcome:

> **REPLAN → COMMITMENT SAFETY LAYER → FIELD**

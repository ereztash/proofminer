# ProofMiner — Definition of Done v3

## Governing rule

This DOD is subordinate to `docs/TELOS_GOVERNANCE.md`.

It is the current best hypothesis about what must be true to realize the product telos. It is not the authority that defines the telos.

**Passing every item in this document does not authorize STOP if the Telos Governance Loop still finds a material end-to-end gap.**

**An item in this document should be removed rather than completed if the Telos Governance Loop shows that it no longer contributes materially to O.**

---

# O recalled

The product exists to help a person move from wanting to become recognized as an authority in a domain to an evidence-backed, personalized and continuously learning strategic journey that increases the likelihood that the relevant audience actually perceives that person as a credible, differentiated authority and acts accordingly.

The product is responsible for the quality of diagnosis, route, execution support and learning.

It does not guarantee that the market grants authority.

---

# Current stage

Current stage: **PRODUCT + UX ARCHITECTURE / REPLAN**.

The next build must not begin merely because the prior Preview exists.

The current phase is Done only when the product can be handed to a UX/product team without requiring that team to invent material product strategy in order to create a low-fidelity prototype.

---

# PHASE A — PRODUCT + UX ARCHITECTURE DOD

## A1 — Authority Project is the stable top-level unit

The product is organized around one desired authority position, not around one post, one proof, one Decision Moment or one session.

### Pass condition

It is clear:

- what belongs to an Authority Project;
- what may persist across projects at Person level;
- how multiple authority identities can coexist;
- what the project is trying to change in audience perception and behavior.

---

## A2 — Entry value is legible before system complexity

A first-time user should understand why entering the product is useful before being asked to understand an internal framework.

The first substantive input can be expressed naturally as:

> "I want to become an authority in the field of ____."

### Pass condition

The entry experience can be described without the terms EvidenceUnit, ProofMove, positioning framework, authority score or similar internal taxonomy.

---

## A3 — Audience strategy is assisted

The user is not required to know the best audience in advance.

The system creates candidate audience paths from the intersection of:

- existing assets / right to speak;
- market need;
- commercial or career potential;
- competitive difficulty;
- credible distance / speed.

It may express candidates as Natural / Commercial / Fast paths.

### Pass condition

- The system recommends when one path is sufficiently supported.
- It does not fabricate three options when one dominates.
- It asks a discriminating question only when the answer can change the recommendation.

---

## A4 — Minimum useful knowledge acquisition is defined

The system can start from public footprint, user-provided sources, guided interview or a combination.

It does not require a complete archive before value.

### Pass condition

Every question or requested source in the initial journey has an explicit decision/capability justification:

> "If we know this, what material decision becomes better?"

If no answer exists, remove the request.

---

## A5 — Zero-data user has a productive path

A user with no prepared files, case studies or content must not reach an empty dashboard.

### Pass condition

The product has a guided interview/discovery route capable of surfacing experience, methodology hypotheses, desired authority field and initial audience options without requiring pre-packaged assets.

---

## A6 — Authority Asset Map is broader than proof

The system can model at least:

- evidence;
- methodology;
- experience;
- perspective;
- relationship/distribution assets;
- market-response assets.

### Pass condition

A scenario such as "former bookstore team manager wants to become known for management" can produce useful methodology/experience assets even when no formal case study exists.

---

## A7 — Desired identity and perceived identity remain distinct

The product does not confuse what the user wants to be known for with what the market currently appears to associate with them.

### Pass condition

The system can record both states and can identify a meaningful gap between them without presenting the desired identity as established fact.

---

## A8 — Field model is defined

The product can develop a working model of the selected field and audience, including:

- recognized authorities;
- what they appear to be known for;
- points of parity;
- points of difference;
- audience needs;
- category norms;
- channels / intermediaries;
- comparable authority journeys;
- under-served positions.

### Pass condition

Observed facts, public self-reports and inferred mechanisms are distinguishable.

The system does not turn chronology in a comparable journey into a causal recipe.

---

## A9 — Strategic model is selected by the gap

SWOT or any other framework is a tool, not a fixed product template.

### Pass condition

For materially different cases, the system can justify different diagnostic lenses or combinations of lenses.

The user sees the strategic conclusion first and can inspect "how this map was built" second.

---

## A10 — Authority Map is a dependency graph

The strategic map distinguishes:

- available now;
- sequential dependencies;
- parallel actions;
- blocked actions;
- premature actions;
- unlocks;
- current highest-leverage action.

### Pass condition

The route cannot be reduced to an unordered checklist without losing important meaning.

---

## A11 — One dominant next action exists

The dashboard is a strategic navigation surface, not a wall of information.

At any main state, the system should be able to answer:

> "What should I do now, and why?"

### Pass condition

A user never needs to understand the whole system in order to identify the current primary action.

---

## A12 — Progressive disclosure is specified

Most system complexity is hidden until relevant.

### Pass condition

For each primary screen/state, the architecture distinguishes:

1. bottom line;
2. meaning / rationale;
3. action;
4. optional deeper explanation.

No essential decision depends only on low-contrast decoration, color, or specialist vocabulary.

---

## A13 — Gamification represents strategic resolution

The product does not reward activity merely because it increases engagement.

### Pass condition

Every reward/progress state corresponds to at least one of:

- reduced material uncertainty;
- new usable AuthorityAsset;
- new model capability;
- newly unlocked AuthorityAction;
- meaningful market feedback.

"Uploaded five files" is not sufficient on its own.

---

## A14 — Evidence / trust subsystem remains rigorous

When an AuthorityAction requires a capability or outcome claim, the v2 evidence model applies beneath the Authority Project.

### Pass condition

- factual claims retain exact provenance;
- self-report is not external validation;
- chronology is not causality;
- contradictory evidence can surface;
- private evidence cannot silently become public;
- the system may conclude there is not enough evidence.

---

## A15 — Learning loop is end-to-end

The canonical loop must reach reality and return:

```text
Authority goal
→ audience path
→ current/field model
→ diagnosis
→ dependency map
→ action
→ artifact / behavior
→ market signal / outcome
→ learning
→ revised model / map
```

### Pass condition

A plausible new market signal can materially change a later recommendation in at least one scenario.

If later sessions are identical to first-session reasoning, compounding value is not demonstrated.

---

## A16 — Privacy and persistence are explicit

The product's memory is a benefit only if the user understands and controls it.

### Pass condition

The architecture specifies:

- what may be stored;
- what is source truth versus derived inference;
- disclosure state;
- deletion;
- correction;
- user approval / consent for persistence where appropriate.

---

## A17 — Internal scenario falsification passes

Before another designed UI, run at least these cases:

1. experienced expert with strong work but almost no visibility;
2. visible creator with weak proof / depth;
3. salaried manager converting experience into a new authority identity;
4. consultant whose business already comes mainly through referrals;
5. person entering a field where they currently have little legitimate authority capital.

### Pass condition

The cases produce meaningfully different diagnoses, maps, data requests and next actions.

If all five receive essentially the same journey, the architecture is not sufficiently adaptive.

---

## A18 — UX decisions are coherent as a system

Examples of blocking contradictions:

- doctrine says few choices but the main screen shows many equivalent actions;
- doctrine says framework complexity is hidden but onboarding asks users to choose frameworks;
- doctrine says system recommends but the user must perform the strategic diagnosis manually;
- doctrine says persistent project but every session restarts from zero;
- doctrine says bottom-line-first but the recommendation appears below analytics.

### Pass condition

No known contradiction remains that changes user action, product action, required information, dependency structure or field test.

---

# PHASE B — LOW-FIDELITY EXPERIENCE DOD

Do not start Phase B until Phase A reaches FIELD or STOP under Telos Governance.

Phase B should initially be low-cost and reversible.

## B1 — First-session flow exists end to end

A clickable or equivalent prototype covers:

- authority-domain entry;
- audience-path recommendation;
- discriminating question only if needed;
- minimal knowledge acquisition;
- first diagnosis;
- first Authority Map;
- highest-leverage action;
- optional explanation;
- data/persistence consent.

## B2 — User does not need UX/strategy vocabulary

Users can complete the flow in ordinary language.

## B3 — Attention hierarchy works behaviorally

Users can identify the intended primary action without facilitator explanation.

## B4 — Strategic map is comprehensible

Users can distinguish what is now, next, parallel, blocked and premature.

## B5 — Explanation creates trust without becoming the default workload

Users who want to inspect rationale can do so; users who do not can still act.

### Phase B exit evidence

Use real target users.

The exact sample size and thresholds are experimental design decisions, but the test must generate evidence about:

- value comprehension;
- audience recommendation credibility;
- map comprehension;
- next-action clarity;
- trust;
- cognitive load;
- willingness to add more data;
- perceived usefulness of compounding memory.

Do not interpret compliments as pass evidence.

---

# PHASE C — FUNCTIONAL PRODUCT DOD

## C1 — Real data ingestion

The product can ingest at least the sources needed for the first field experiment and preserve provenance.

## C2 — Adaptive diagnosis

Different user states can produce different strategic diagnoses and route structures.

## C3 — Real dependency-aware actions

The system can update blocked/available/parallel states as information and actions change.

## C4 — Authority asset creation

At least one action can transform existing experience/evidence into a real usable authority asset without fabricating facts.

## C5 — Real-world execution

Users can perform or export a recommended action/artifact outside the product.

## C6 — Market-signal return path

Users can record or connect meaningful outcomes.

## C7 — Learning changes the route

New evidence or market response changes a subsequent map/recommendation when it should.

## C8 — Reliability, recovery and security

The product handles failure without silent work loss and treats uploaded/public content as untrusted data rather than instructions.

## C9 — RTL/mobile/accessibility

The core flow works in Hebrew, mixed Hebrew/English/numeric content, desktop and mobile, with usable keyboard/focus states.

---

# PHASE D — FIELD + COMMERCIAL VALIDATION DOD

The system is not validated because users understand the prototype or say they like it.

Evidence should ultimately demonstrate a chain such as:

1. user understands and accepts a strategic route;
2. user performs a recommended real-world action;
3. authority-relevant market signals can be observed;
4. later recommendations improve from prior data;
5. target users choose to continue using the product;
6. some target users pay for the continuing strategic value.

The exact business thresholds should be preregistered for each experiment rather than hardcoded permanently into doctrine.

---

# GLOBAL RELEASE / TERMINATION RULE

At the end of every phase, run the full Telos Governance Loop.

A phase can produce only one of four outcomes:

## CONTINUE

A material internal gap remains and can be resolved now.

## REPLAN

The current model, sequence, framework or product framing itself blocks O.

Move backward. Previously closed decisions may be invalidated.

## FIELD

Internal work has reached diminishing epistemic returns and a material uncertainty can now be resolved only through users, market behavior, deployment or another external source.

Do not substitute further internal refinement for FIELD.

## STOP

STOP is authorized only when:

1. O has been explicitly recalled;
2. the target state has been reconstructed from O rather than inherited from the current checklist;
3. backward planning from target state has been re-run;
4. no material internal gap remains that could improve end-to-end realization of O;
5. no feasible, material field uncertainty remains unresolved for the current stage;
6. all remaining work is lower-value than stopping or belongs to a later stage;
7. the current state is supported by the strongest evidence reasonably obtainable now.

**The location of STOP is therefore not the end of this file. It is the point at which the product has exhausted the justified path from O through reality and back to learning.**

A completed checklist without that condition is not Done.

---

# Required DOD closeout record

Any claim that a phase is Done must include:

- O recalled;
- reconstructed target state;
- gaps tested;
- invalidated assumptions;
- evidence used;
- governance outcome: CONTINUE / REPLAN / FIELD / STOP;
- next action if not STOP.

"All boxes checked" is explicitly invalid as a closeout argument.
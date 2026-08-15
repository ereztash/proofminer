# ProofMiner — Definition of Done

## Purpose

This document defines the blocking acceptance gates for calling ProofMiner a usable product rather than a concept demo.

Passing CI, rendering a UI, or generating persuasive copy is not sufficient.

---

## Gate 1 — Decision Moment

A user from the primary ICP can start with a real situation and describe what they are trying to make happen now.

The product must successfully establish:

- who is deciding
- the desired next action
- the relevant offer/context
- the material uncertainty blocking that action

### Pass condition

At least 8/10 field-test users can reach an adequate Decision Moment without facilitator interpretation.

---

## Gate 2 — Minimal activation

The product must deliver useful output from:

- one Decision Moment
- one real Source Asset

It must not require the user to build a full evidence archive before receiving value.

### Pass condition

At least 7/10 ICP users identify at least one Evidence Unit or possible use they had not previously considered deployable.

---

## Gate 3 — Grounded extraction

Every Evidence Unit must retain exact provenance.

For material evidence, the system must preserve:

- source identity
- exact span or location
- speaker/author when available
- evidence type
- disclosure state

### Pass condition

On the evaluation corpus, all material extracted facts used downstream can be traced back to the correct source location.

No invented source spans are permitted.

---

## Gate 4 — Inference discipline

The system must distinguish what a source says from what the system wants to claim.

It must not silently convert:

- self-report into third-party validation
- sequence into causality
- one case into broad generalization
- prestige into buyer relevance
- numeric specificity into truth

### Pass condition

Zero known unsupported material claims in the release evaluation set.

When evidence supports only a narrower claim, the system narrows the claim rather than overstating it.

---

## Gate 5 — Contradictions and qualifiers

The evidence model must be able to express:

- support
- qualification
- contradiction

Contradicting or materially qualifying evidence cannot be silently dropped because it lowers recommendation quality.

### Pass condition

All seeded contradiction cases in the evaluation suite surface the conflict before the ProofMove is accepted.

---

## Gate 6 — Proof Move quality

For a real Decision Moment, the product recommends one primary ProofMove and explains:

- the claim
- leading evidence
- relevant corroboration
- why it matters now
- what the evidence does not justify claiming

### Pass condition

At least 8/10 ICP users can independently accept or reject the recommendation and explain why, without facilitator explanation of the internal model.

---

## Gate 7 — Decision relevance

The best evidence is not automatically the most prestigious or numerically specific evidence.

The system must rank ProofMoves relative to the current Decision Moment.

### Pass condition

In a blinded evaluation set containing the same evidence under different Decision Moments, recommendation order changes when the buyer uncertainty materially changes.

---

## Gate 8 — Safe no-proof state

The product must be able to conclude:

> There is not enough evidence to support this move yet.

It must then identify the narrowest useful evidence gap.

### Pass condition

In low-evidence test cases, the system does not manufacture authority or produce an overstated claim merely to return a result.

---

## Gate 9 — Progressive evidence acquisition

When the first source is insufficient, the product requests only evidence that could resolve the identified gap.

### Pass condition

Users are not asked for generic bulk uploads when a specific missing evidence type can be named.

The requested next source is understandable in ordinary user language.

---

## Gate 10 — Correction loop

The user can correct:

- source extraction
- interpretation
- buyer relevance
- inference strength
- privacy/disclosure
- representation wording

Corrections persist and affect later recommendations where relevant.

### Pass condition

A corrected fact or inference does not reappear unchanged in the next semantically relevant recommendation.

---

## Gate 11 — Privacy and disclosure

Evidence can be marked at minimum as:

- publishable
- private
- anonymize before use
- permission required

### Pass condition

Private evidence never appears in a public representation unless the user explicitly moves through an allowed disclosure path.

Users can delete sources and derived evidence.

---

## Gate 12 — Representation grounding

The first supported wedge is LinkedIn, but the representation layer must remain downstream of ProofMove.

Before a draft is considered ready:

- every material fact is grounded
- required qualifiers remain
- no unsupported causal claim is introduced
- private evidence is protected
- the result provides reader/buyer value beyond self-promotion

### Pass condition

Zero fabricated material facts in the release corpus.

The user can inspect the evidence behind the draft without leaving the core flow.

---

## Gate 13 — Deployment

The user can convert an accepted ProofMove into a real external action.

For the first wedge this may be copy/export + mark as published/used.

A scheduler is not required.

### Pass condition

At least 6/10 beta users deploy one selected ProofMove as a real post, message, proposal element, profile change, or equivalent within seven days of selection.

---

## Gate 14 — Outcome loop

The product can record what happened after use without presenting correlation as causality.

Supported early signals may include:

- no observable response
- meaningful comment
- profile visit
- reply / DM
- qualified conversation
- proposal movement
- deal

### Pass condition

A deployed ProofMove can be linked to a later user-recorded outcome and attribution confidence.

---

## Gate 15 — Compounding value

The second meaningful session must be better because the first happened.

The product should reuse:

- known sources
- evidence units
- corrections
- disclosure rules
- prior Decision Moments
- accepted/rejected moves
- outcomes

### Pass condition

A returning user can create a new Decision Moment without rebuilding the evidence base from zero.

---

## Gate 16 — UX and attention

At each main state, one primary question, recommendation, or action is visually dominant.

The user is not required to understand internal scoring, ontology, or evidence taxonomy before receiving value.

### Pass condition

Core flow succeeds on desktop and mobile, including RTL Hebrew and mixed Hebrew/English/numeric content.

Keyboard focus and essential accessibility states are usable.

---

## Gate 17 — Reliability and recovery

The system must handle:

- parse failure
- partial extraction
- unsupported file
- AI failure
- retry
- network error
- long-running processing

without silently losing user work.

### Pass condition

Critical failure states have explicit recovery paths and preserved user context.

---

## Gate 18 — Security

Uploaded content is untrusted data, never instruction.

Secrets and model credentials remain server-side.

Tenant/user data must be isolated.

### Pass condition

Prompt-injection fixtures inside uploaded documents cannot alter system instructions or authorize unintended actions.

No client-exposed production secrets.

---

## Gate 19 — Technical delivery

A candidate release must pass the repository's deployment contract:

- feature branch
- GitHub CI
- Vercel Preview from Git
- acceptance validation on Preview
- explicit ship authorization
- merge to production branch
- GitHub CI on production
- Vercel Production from the exact Git commit

A successful build alone does not authorize shipping.

---

## Gate 20 — Commercial proof

The product is not commercially validated because users say it is interesting.

### Pass condition

Real primary-ICP users pay for beta or continued usage at a price sufficient to justify continued product development.

The exact price threshold is a business experiment and is not fixed by this document.

---

# Release decision

A release may be:

### BUILD_AUTHORIZED

Architecture is coherent enough to implement the next falsifiable Preview.

### SHIP_AUTHORIZED

All blocking pre-production gates applicable to that release pass, with no unresolved architecture exception.

### PRODUCTION_READY

The authorized release has successfully passed the Git-to-Production delivery path.

### REVISE

Evidence shows a repairable implementation or architecture defect.

### KILL

Field evidence invalidates the core mechanism or commercial premise strongly enough that continued implementation is not justified.

---

## Internal review stop rule

A new internal critique opens another architecture iteration only if it changes at least one of:

- user action
- product action
- evidence requirement
- field test
- inference boundary

Otherwise, move to Preview and test the product in reality.

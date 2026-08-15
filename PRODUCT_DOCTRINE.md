# ProofMiner — Product Doctrine v2

## Status

This document is the current product source of truth for ProofMiner.

It supersedes the earlier framing of ProofMiner as a scoring system, content generator, or fixed `Proof Unit` miner.

Current lifecycle state: **ARCHITECTING**.

The product is not `BUILD_AUTHORIZED` until implementation work is derived from this doctrine and its Definition of Done.

---

## Telos

ProofMiner helps an established expert reduce a buyer's uncertainty at a specific decision moment by finding and deploying the strongest evidence the expert has already earned.

The user-facing job is not "change a belief" and not "create content".

The practical question is:

> **What should I show this person now so they have enough confidence to take the next decision?**

Belief change remains an internal explanatory mechanism. The observable target is a decision or next action.

---

## Primary user

The primary ICP is an established B2B expertise-based independent professional:

- consultant
- fractional executive
- senior freelancer
- advisor
- coach or specialist selling expertise
- small professional-services / agency owner

They already have real work, clients, outcomes, talks, testimonials, proposals, transcripts, credentials, publications, or external mentions.

Their problem is not primarily lack of ideas. Their problem is that useful evidence is fragmented, underinterpreted, and poorly matched to the decision they are trying to influence now.

### Core user condition

The user should be able to say:

> "I have done enough real work that there should already be evidence somewhere — I just do not know what matters most here."

ProofMiner is not primarily for someone who has no evidence yet and wants AI to manufacture authority.

---

## Core job

For one concrete decision moment:

1. Understand who is deciding.
2. Understand what next action the user wants to make easier.
3. Identify the uncertainty preventing that action.
4. Accept one existing source with minimal setup.
5. Extract factual evidence without assigning it a permanent meaning.
6. Construct candidate claims relevant to the decision moment.
7. Compare which evidence supports, qualifies, or contradicts those claims.
8. Recommend one **Proof Move**.
9. Show why the move is supported and where inference must stop.
10. Convert the move into an external representation without inventing facts.
11. Let the user correct the system.
12. Record whether the move was actually deployed and what happened afterward.

---

## The fundamental unit is evidence, not proof

A document is a container.

A sentence is not automatically a proof.

A `Proof Unit` is not stable across contexts.

The stable atomic object is an **Evidence Unit**: an attributable observation or statement extracted from a source with exact provenance.

The meaning of an Evidence Unit depends on the decision being influenced.

The same client outcome may support different claims for different buyers, stages, offers, or decisions.

Therefore:

`Source Asset -> Evidence Unit`

is stable, while:

`Evidence Unit -> Claim -> Proof Move`

is contextual.

---

## Decision Moment

The top-level working context is a **Decision Moment**.

A Decision Moment contains:

- decision actor or audience
- relationship / stage
- desired next action
- relevant offer or proposition
- current uncertainty / objection / risk
- constraints on what may be disclosed

Examples:

- A CEO considering whether to book a first call.
- A buyer evaluating a proposal after a sales conversation.
- A LinkedIn reader deciding whether this expert is worth following or contacting.
- An existing lead deciding whether the expert can credibly handle a specific problem.

The same evidence can rank differently across these moments.

---

## Proof Move

A **Proof Move** is the product's primary recommendation object.

It contains:

1. a candidate claim that matters in the current Decision Moment
2. one or more Evidence Units that support it
3. relevant qualifying or contradicting evidence
4. provenance for every factual statement
5. the inference boundary: what the evidence does **not** justify claiming
6. the recommended external representation or next action

A Proof Move is not a truth score.

It is a disciplined, contextual argument backed by traceable evidence.

---

## Evidence graph

The internal model should support many-to-many relationships:

`Source Asset`
→ `Evidence Unit`
→ `SUPPORTS / QUALIFIES / CONTRADICTS`
→ `Candidate Claim`
→ `Proof Move`
→ `Representation`
→ `Publication / Use`
→ `Observed Outcome`

One claim may require multiple Evidence Units.

One Evidence Unit may support multiple claims.

A source may contradict another source.

The model must preserve these relationships rather than flattening them into one score.

---

## Epistemic contract

ProofMiner does **not** promise to prove what is true in the world.

It promises provenance and disciplined inference.

For every material factual claim, the system should be able to answer:

- Who or what source asserted this?
- Where exactly in the source?
- Is this self-report, client report, external validation, observed outcome, credential, or another evidence type?
- Does the evidence directly support the claim, only partially support it, or contradict it?
- What cannot safely be inferred from the evidence?

### Non-negotiable epistemic rules

- Self-authored material is not third-party validation merely because it is written in a document.
- Chronological sequence is not automatically causality.
- A client result is not automatically attributable solely to the user's work.
- Prestige is not automatically decision relevance.
- A source with numbers is not automatically high-confidence evidence.
- Absence of sufficient evidence must be allowed to produce: **"There is not enough evidence yet."**
- Contradicting evidence must not be silently discarded.

---

## Uncertainty must remain decomposed

Do not collapse confidence into one number.

At minimum the system must distinguish:

### Source fidelity
Did the system correctly extract what the source actually says?

### Claim support
Does the evidence actually justify the proposed claim?

### Decision relevance
Is there a good reason to think this claim matters in the current Decision Moment?

These may be represented qualitatively or comparatively. They must not be collapsed into pseudo-objective certainty.

---

## Ranking doctrine

There is no universal weighted score such as:

`35% evidence + 35% fit + 20% proximity + 10% freshness`.

Ranking is contextual and comparative.

The product should prefer:

- stronger support over weaker support
- more decision-relevant evidence over prestigious but irrelevant evidence
- independent corroboration when the claim requires it
- evidence close to the offered outcome when appropriate
- safe, publishable evidence when two candidates are otherwise comparable
- evidence that meaningfully reduces the target uncertainty

### Time relevance

Recency is conditional, not a global weight.

A dated market result may decay quickly. A credential or enduring professional event may remain relevant for years.

Freshness must therefore be interpreted by evidence type and Decision Moment.

---

## UX doctrine

The user's attention is scarce.

The user should not have to understand the evidence model before receiving value.

### Entry experience

Start with:

> **What are you trying to make happen now?**

Allow natural language.

Infer actor, desired action, likely uncertainty, and offer context where possible. Ask only for the missing decision-critical information.

Then ask for one source:

> **Give me one thing that already exists. You do not need to organize it.**

Do not begin with a bulk archive project.

### Progressive evidence acquisition

After analyzing the first source, ask for another source only if it resolves a specific gap.

Example:

> "This is good evidence that you identify the problem well, but it does not show an outcome. If you have a testimonial or before/after case, that is the only thing I would add next."

### Result experience

The primary result should be one recommendation:

> **The move I would make now**

Then show:

- the claim
- the leading evidence
- what this helps the buyer understand
- why the evidence supports the claim
- what it still does not justify claiming
- exact source provenance

Primary actions:

- Use this
- This is not accurate
- I cannot publish this
- Show me another option

Do not lead with a large numeric score.

### Correction is part of the product

Corrections are not merely error handling.

They are durable product data.

Useful correction reasons include:

- the system inferred too much
- missing context
- wrong buyer relevance
- private / confidential
- wording overstates the evidence
- causality is not justified
- source attribution is wrong

---

## Representation doctrine

LinkedIn is the initial wedge, not the product boundary.

A Proof Move may become:

- LinkedIn post
- proposal proof block
- case-study section
- About / bio line
- sales follow-up
- DM
- landing-page proof
- pitch-deck evidence

The representation must remain visibly grounded in the Proof Move.

For content, reader value comes before self-promotion.

Useful transformation pattern:

`Proof Move -> useful mechanism / lesson -> implication for reader -> restrained evidence`

---

## Outcome doctrine

The system may record what happened after a Proof Move was deployed:

- no observable response
- meaningful comment
- profile visit
- reply / DM
- qualified conversation
- proposal movement
- deal

These outcomes are learning signals, not automatic causal proof that the Proof Move caused the result.

Repeated use should improve contextual recommendations through accumulated evidence, corrections, Decision Moments, and outcomes.

---

## Compounding value / moat

The durable product asset is not generated copy.

It is the user's growing map of:

- source assets
- evidence units
- claims
- decision contexts
- corrections
- disclosure constraints
- proof moves used
- outcomes observed

A generic writing model can generate prose from one document.

ProofMiner should become more valuable because it remembers what the business has already earned, what it actually supports, where it worked, where it failed, and which uncertainty remains unproven.

---

## Privacy and disclosure

Professional evidence often contains client-sensitive material.

The product must support evidence-level disclosure state, including at minimum:

- publishable
- private
- anonymize before use
- permission required

The system must never turn private evidence into public copy without an explicit permitted path.

Users must be able to remove their sources and derived evidence.

---

## Anti-build

Do not add features merely because they are common in content tools.

Specifically, do not prioritize:

- scheduling
- virality scoring
- hashtag generation
- generic content calendars
- engagement automation
- vanity analytics
- broad social publishing infrastructure

unless field evidence shows they materially improve the core Decision Moment job.

---

## Product success hierarchy

Early success is measured in this order:

1. **Discovery** — user finds evidence they had not considered usable.
2. **Decision** — user can accept or reject one Proof Move without expert assistance.
3. **Decision clarity** — user understands what uncertainty the move is intended to reduce.
4. **Grounding** — user can inspect where every material claim comes from.
5. **Deployment** — the Proof Move becomes a real external artifact or sales action.
6. **Compounding** — a later session benefits from prior sources, corrections, and contexts.
7. **Downstream signal** — the user records what happened after deployment.
8. **Commercial proof** — ICP users pay for continued access/use.

Impressions are secondary unless reach is explicitly the current Decision Moment objective.

---

## Stop rule

Internal review should continue only when a new objection changes at least one of:

- user action
- product action
- evidence requirement
- field test
- inference boundary

If another perspective only suggests additional elegance, theoretical refinement, or cosmetic polish without changing one of those, it does not open another architecture iteration.

Once no blocking internal objection remains, build a Preview and let real ICP behavior become the next falsification layer.

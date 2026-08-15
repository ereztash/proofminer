# ProofMiner Product Model

## Purpose

This document defines the current conceptual and data model derived from `PRODUCT_DOCTRINE.md`.

It is intentionally implementation-agnostic. UI and storage choices may change; these semantic distinctions should not collapse without an explicit architecture decision.

---

## Core objects

### DecisionMoment

Represents one concrete decision the user wants to make easier for another person or audience.

Suggested fields:

- `id`
- `actor`
- `stage`
- `desired_next_action`
- `offer_context`
- `target_uncertainty`
- `disclosure_constraints`
- `created_at`

### SourceAsset

A container supplied or discovered by the user.

Examples: PDF, CV, testimonial, transcript, proposal, article, webpage, email export, case study, pasted text.

Suggested fields:

- `id`
- `source_type`
- `title`
- `origin`
- `owner / author`
- `captured_at`
- `content_hash`
- `privacy_state`

A SourceAsset is not itself proof.

### EvidenceUnit

An attributable factual observation or statement extracted from a SourceAsset.

Suggested fields:

- `id`
- `source_asset_id`
- `verbatim_span`
- `normalized_observation`
- `source_location`
- `speaker_or_author`
- `evidence_type`
- `time_context`
- `disclosure_state`
- `source_fidelity_state`

Possible evidence types include:

- self-report
- client report
- third-party mention
- observed result
- credential
- publication / professional output
- public stage / speaking evidence
- testimonial
- process evidence

Evidence type is descriptive, not a universal rank.

### CandidateClaim

A contextual proposition that would reduce uncertainty in a DecisionMoment if sufficiently supported.

Suggested fields:

- `id`
- `decision_moment_id`
- `statement`
- `target_uncertainty`
- `claim_type`
- `inference_risk`

CandidateClaims are contextual and may be temporary.

### EvidenceRelation

Connects an EvidenceUnit to a CandidateClaim.

Relation types:

- `SUPPORTS`
- `QUALIFIES`
- `CONTRADICTS`

Suggested fields:

- `evidence_unit_id`
- `candidate_claim_id`
- `relation_type`
- `reason`
- `claim_support_state`

This is many-to-many.

### ProofMove

A contextual recommendation for one DecisionMoment.

Suggested fields:

- `id`
- `decision_moment_id`
- `candidate_claim_id`
- `leading_evidence_ids[]`
- `corroborating_evidence_ids[]`
- `qualifying_evidence_ids[]`
- `contradicting_evidence_ids[]`
- `inference_boundary`
- `decision_relevance_rationale`
- `recommended_action`
- `status`

Possible status values:

- proposed
- accepted
- rejected
- private
- needs_more_evidence
- deployed

### Correction

A durable user correction to an extraction, relation, recommendation, disclosure state, or representation.

Suggested fields:

- `id`
- `target_type`
- `target_id`
- `reason_code`
- `user_explanation`
- `created_at`

Corrections should affect future recommendations where semantically relevant.

### Representation

A concrete outward expression of a ProofMove.

Possible types:

- LinkedIn post
- proposal section
- DM
- follow-up message
- About / bio
- case study
- landing-page block
- pitch slide

Suggested fields:

- `id`
- `proof_move_id`
- `type`
- `content`
- `grounding_check_state`
- `disclosure_check_state`

### PublicationOrUse

Records that a Representation was actually deployed.

Suggested fields:

- `id`
- `representation_id`
- `channel`
- `url_or_reference`
- `used_at`

### ObservedOutcome

A user-recorded signal after use.

Suggested fields:

- `id`
- `publication_or_use_id`
- `outcome_type`
- `description`
- `observed_at`
- `attribution_confidence`

Outcome is not automatically causal evidence.

---

## Canonical graph

```text
DecisionMoment
    |
    v
CandidateClaim
    ^
    | SUPPORTS / QUALIFIES / CONTRADICTS
    |
EvidenceUnit <--- SourceAsset
    |
    +----------------------+
                           |
                           v
                       ProofMove
                           |
                           v
                    Representation
                           |
                           v
                    PublicationOrUse
                           |
                           v
                    ObservedOutcome

Correction may target extraction, relation, proof move, disclosure, or representation.
```

---

## Three independent uncertainty states

These concepts must remain separate in implementation.

### Source fidelity

Question: Did we correctly understand what the source says?

Failure examples:

- wrong speaker attribution
- OCR / parsing mistake
- sentence removed from essential context
- wrong numeric extraction

### Claim support

Question: Given what the source says, does it justify the proposed claim?

Failure examples:

- treating chronology as causality
- turning a self-report into third-party validation
- generalizing one case beyond what it supports

### Decision relevance

Question: Even if the claim is supported, does it matter for this DecisionMoment?

Failure examples:

- prestigious credential when buyer uncertainty is about implementation ability
- old result in a market where current relevance matters
- strong evidence of a different capability than the offer being considered

No single confidence score may substitute for these distinctions.

---

## Comparative recommendation logic

The system should compare candidate ProofMoves rather than compute a universal truth score.

A recommendation may prefer A over B because:

- A more directly addresses the target uncertainty.
- A has stronger or more independent support.
- A requires fewer unsafe inferences.
- A is more publishable under current disclosure constraints.
- A is closer to the current offer or decision stage.
- B has contradicting or qualifying evidence that materially weakens it.

The explanation should be human-readable and inspectable.

---

## Progressive evidence acquisition

The system should not require a complete evidence library before value.

Canonical loop:

```text
Decision Moment
-> one Source Asset
-> extract Evidence Units
-> attempt candidate ProofMove
-> identify exact evidence gap
-> request one additional source only when useful
-> revise ProofMove
```

The gap request itself is a product output.

Examples:

- "I can support expertise, but not outcome. A client result would resolve the gap."
- "I can support the result, but attribution is weak. A client quote or external source would strengthen it."
- "This evidence is strong but private. We need a publishable equivalent or anonymized representation."

---

## Safe failure states

The system must explicitly support:

### Not enough evidence

No adequate ProofMove can be justified.

### Evidence conflict

Sources materially disagree.

### Evidence available but private

The best evidence cannot be disclosed in the current representation.

### Decision context unclear

Evidence exists, but the system cannot rank relevance without one additional contextual answer.

### Claim too strong

Evidence supports a narrower claim than the user or system initially proposed.

These are valid product outcomes, not model failures.

---

## Representation grounding

Before a Representation is considered ready:

1. Every material factual statement maps to one or more Evidence Units.
2. Generated causal language must have explicit support.
3. Names, organizations, amounts, dates, and outcomes must match provenance.
4. Private evidence must not leak.
5. Qualifiers required by the evidence must survive rewriting.
6. The representation must still provide value to the reader / buyer beyond self-promotion.

---

## Product memory

What should compound across sessions:

- SourceAssets already ingested
- EvidenceUnits and provenance
- user corrections
- disclosure restrictions
- DecisionMoments
- EvidenceRelations
- accepted/rejected ProofMoves
- deployed Representations
- ObservedOutcomes

The product should not force the user to reconstruct this map each session.

---

## What remains non-canonical

The following are implementation choices, not doctrine:

- database vendor
- embedding model
- LLM provider
- exact ranking algorithm
- visual layout
- whether internal states are numeric, categorical, or model-generated

They may change as long as the semantic boundaries above and the Definition of Done remain intact.

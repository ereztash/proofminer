# ProofMiner — Architecture Decision Log

## AD-001 — Product job is a decision, not content generation

**Decision:** ProofMiner optimizes for reducing uncertainty at a concrete Decision Moment.

**Rejected framing:** generic AI writer / content generator.

**Reason:** content is one downstream representation; the valuable decision happens before writing.

---

## AD-002 — Decision Moment replaces Buyer Moment as top-level context

**Decision:** The primary context includes actor, stage, desired next action, offer context, and uncertainty.

**Rejected framing:** buyer identity alone determines the best evidence.

**Reason:** the same buyer may require different evidence before a first call, after a proposal, or during procurement.

---

## AD-003 — Evidence Unit is the stable atom

**Decision:** Extract stable Evidence Units from sources; construct contextual proof later.

**Rejected framing:** fixed Proof Units exist independently inside documents.

**Reason:** what an observation proves depends on the claim and Decision Moment. One Evidence Unit may support multiple claims; one claim may require multiple Evidence Units.

---

## AD-004 — Proof Move is the recommendation object

**Decision:** Recommend a Proof Move containing claim, evidence, qualifiers/contradictions, inference boundary, and recommended representation/action.

**Rejected framing:** "best proof" as one isolated sentence with a universal score.

---

## AD-005 — Remove universal weighted scoring from doctrine

**Decision:** recommendations are contextual and comparative.

**Rejected model:** fixed global weights such as `35% evidence + 35% fit + 20% proximity + 10% freshness`.

**Reason:** evidence types age differently; relevance changes by stage; hard inference/disclosure constraints cannot be represented safely as additive weights.

---

## AD-006 — Confidence remains decomposed

**Decision:** preserve at least Source Fidelity, Claim Support, and Decision Relevance as separate uncertainty states.

**Rejected framing:** one confidence number.

**Reason:** a source can be parsed accurately while supporting the wrong claim; a strongly supported claim can still be irrelevant to the buyer's decision.

---

## AD-007 — Provenance, not truth certification

**Decision:** ProofMiner promises traceability and disciplined inference.

**Rejected claim:** ProofMiner can prove that uploaded claims are objectively true in the world.

**Reason:** a perfectly traceable source may itself contain self-report or an incorrect assertion.

---

## AD-008 — Progressive evidence acquisition

**Decision:** start with one Decision Moment and one Source Asset. Request additional evidence only to resolve a named gap.

**Rejected onboarding:** require users to upload their full archive before value.

**Reason:** bulk ingestion imposes high activation cost before demonstrating the product's unique value.

---

## AD-009 — Corrections are durable product data

**Decision:** user corrections persist and influence future recommendations.

**Rejected framing:** correction is merely transient UI error handling.

**Reason:** corrections create user-specific epistemic calibration and compounding product value.

---

## AD-010 — Outcomes are learning signals, not causal proof

**Decision:** record downstream outcomes with attribution uncertainty.

**Rejected inference:** a response/deal after a Proof Move proves that the Proof Move caused it.

---

## AD-011 — Current implementation status

The existing `main` application and draft PR #1 are prototypes, not the current semantic source of truth.

PR #1 improved the original dashboard/content-generator framing but still contains assumptions superseded by this log, particularly:

- belief as the primary observable job
- one best proof as the principal unit
- fixed weighted scoring
- one confidence signal
- globally weighted freshness

Future implementation should derive from `PRODUCT_DOCTRINE.md`, `docs/PRODUCT_MODEL.md`, and `docs/DEFINITION_OF_DONE.md` rather than extending those superseded assumptions.

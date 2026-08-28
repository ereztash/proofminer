# What is in here

Sixteen documents accumulated without an organising principle and eight of them
landed in a single working session. This page is the map. It exists because
`README.md` linked five of them and the other eleven were undiscoverable.

Three things are worth knowing before reading any of them:

- **`METHOD.md` is load-bearing.** `tests/engine/appendix.test.js` reads it at
  run time and fails if a published constant drifts from the code. Do not move
  or rename it without changing that test.
- **Roughly fifty comments in `src/` and `tests/` cite these files by path**
  (`METHOD.md`, `UX.md`, `TELOS.md`, `MARKET.md`). A rename is a repo-wide edit,
  not a file move.
- **A document is not evidence.** Several of the files below record what was
  measured, and several record what was only argued. The difference is marked.

---

## The product: what it is and what it may do

| File | What it is |
|---|---|
| [`TELOS.md`](TELOS.md) | Why this exists, who it is for, definition of done. The anti-goals here are binding — the phrase-library prohibition is enforced by tests. |
| [`METHOD.md`](METHOD.md) | The measurement specification. Every number the product shows a user traces to a constant here. **Read by a test.** |
| [`AUTHORITY.md`](AUTHORITY.md) | How the product decides what a piece of evidence is allowed to become. Trust preservation: a weak trace may not turn into a confident outbound asset because the interface allowed it. |
| [`UX.md`](UX.md) | Designing for the pain the user already feels. Credit before critique; Hebrew is the source copy, not a translation. |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Module shape and the tradeoffs behind it. |

## Deployment

| File | What it is |
|---|---|
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | How code reaches production, why the browser smoke only runs against the production domain, what the smoke asserts, and the decision rule. Merged from a root `DEPLOYMENT.md` and a separate `PROD_VERIFICATION.md` that covered the same subject in two places. |

## Measurement

Two files whose names used to collide. They are not the same subject.

| File | What it is |
|---|---|
| [`MEASUREMENT_HEBREW_ORGS.md`](MEASUREMENT_HEBREW_ORGS.md) | One measured number: what share of Hebrew organisation names the detector finds, against 184 pinned Wikipedia revisions nobody here annotated. Reproducible with `npm run measure:hebrew-orgs`. Was `MEASUREMENT.md`. |
| [`MEASUREMENT_MODEL.md`](MEASUREMENT_MODEL.md) | What the product can observe, what it can only influence, and what it has decided it will never see. Includes the constructs that were named and then deleted for having no eligible design. |

## Market and position — argued, not measured

| File | What it is |
|---|---|
| [`MARKET.md`](MARKET.md) | What the outside says and the plan it does or does not justify. |
| [`PRODUCT_THESIS.md`](PRODUCT_THESIS.md) | Four falsifiable theses. **None is selected**, deliberately. Part 1 was written before the starting hypothesis was read, to keep the derivation honest. |
| [`COMPETITIVE_RESEARCH.md`](COMPETITIVE_RESEARCH.md) | What neighbouring categories do badly. Every claim carries its source and the date it was read; vendor marketing is labelled as such. |

## How the work was done — process record, not product documentation

These describe a session rather than the product. They are kept because they
carry the reasoning behind decisions that are otherwise unexplained, and because
several record things that turned out to be wrong.

| File | What it is |
|---|---|
| [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md) | The scorecard. Currently **engineering-ready, market thesis unvalidated** — 68/100. Every score carries its evidence, the risk holding it down, and the observation that would raise it. |
| [`EXPERIMENTS.md`](EXPERIMENTS.md) | Preregistrations. Prediction, exclusions and decision rule written **before** exposure. E1, the five-person trial, is the outstanding one. |
| [`RESEARCH_LEDGER.md`](RESEARCH_LEDGER.md) | Sources, what was taken from each, and the fields that were absent from the frame. |
| [`PROMPT_EVOLUTION.md`](PROMPT_EVOLUTION.md) | Adversarial critique of the instructions the work ran under, including the concession that the metric most improved was chosen for being measurable rather than decisive. |

## Design work in flight

| File | What it is |
|---|---|
| [`UX_AUDIT_2026-08.md`](UX_AUDIT_2026-08.md) | Baseline audit of the onboarding path, read before any change. Records three places where the brief describing this codebase did not match it — most importantly that the pre-analysis questions were never a gate, only a wall, and that the recall route the brief asks for is already built and merely de-ranked. **The baseline above the rule is never edited**; outcomes for each finding, the registered fit-gate debt, and the audit that closed Patch 4 as already-discharged are appended below it. |

## Unintegrated

| File | Status |
|---|---|
| [`SLP_KNOWLEDGE_TRANSFER.md`](SLP_KNOWLEDGE_TRANSFER.md) | Applies an evidence-transfer protocol from speech-language, literacy and memory research. Arrived via PR #26. **Still deliberately unintegrated** — no change has been made on its basis. Its five proposals are now classified at the end of the file: four are trial instrumentation and wait on E1; `HE-NER-1`, a fixed Hebrew organisation benchmark, is the only one that needs no users. Nothing from it has been added to E1, which is preregistered. |

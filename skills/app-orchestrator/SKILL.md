---
name: app-orchestrator
description: Orchestrate end-to-end application work by separating product/architecture authority from implementation/deployment authority. Prefer AGT Architect as the upstream architecture provider when available, then hand an explicit BUILD_AUTHORIZED contract to vercel-app-builder. Use when the user asks to build, redesign, continue, or ship an app and the task spans product intent, UX/architecture, implementation, validation, GitHub, and Vercel.
---

# App Orchestrator

## Purpose

Coordinate the application lifecycle without collapsing product governance into code generation.

Canonical pipeline:

`INTAKE -> ARCHITECTING -> BUILD_AUTHORIZED -> IMPLEMENTING -> PREVIEW_READY -> VALIDATING -> SHIP_AUTHORIZED -> PRODUCTION_READY`

Revision paths:

- semantic/product contradiction -> return to `ARCHITECTING`
- implementation/build failure -> remain in `IMPLEMENTING`
- preview evidence failure -> return to `IMPLEMENTING`
- field-test invalidation -> return to `ARCHITECTING` or `KILL`

## Separation of authority

### Architect provider

Preferred provider: **AGT Architect** when it is available and can be invoked.

The Architect owns:

- product telos
- exact user / actor
- desired user or buyer state change
- mechanism and experience architecture
- scope and non-goals
- evidence requirements
- acceptance criteria
- product-level stop / revise / kill decisions

The Architect must not silently perform deployment work that belongs to the Builder.

### Builder provider

Default provider: **vercel-app-builder**.

The Builder owns:

- repository implementation
- branch/commit/PR mechanics
- CI and build correctness
- framework-specific code
- Preview deployment
- technical QA
- Production deployment after authorization
- deployment evidence

The Builder must not silently redefine product telos, ICP, success criteria, or product claims.

## Contract boundary

The Architect hands the Builder a `BuildContract` conforming to:

`contracts/build-contract.schema.json`

The Builder returns `BuildEvidence` conforming to:

`contracts/build-evidence.schema.json`

No prose-only handoff counts as `BUILD_AUTHORIZED` when the task is substantial enough to require orchestration.

## Architect adapter

If AGT Architect is available:

1. invoke/load it for the architecture phase;
2. require its output to be normalized into the BuildContract;
3. reject incomplete contracts instead of guessing critical product decisions.

If AGT Architect is unavailable:

- keep the same interface;
- run an explicit temporary architect phase in the current agent;
- mark `architect.provider` as `inline-architect`;
- do not merge that role into the Builder.

This preserves replaceability.

## Minimal state machine

### INTAKE

Resolve from conversation and connected sources before asking the user again:

- app/product identity
- repository and branch state
- current deployment state
- user goal
- whether this is new build, redesign, continuation, or infrastructure-only work

### ARCHITECTING

Produce or obtain the BuildContract.

Required product fields must include at minimum:

- telos
- primary actor
- desired state change
- core mechanism
- in-scope behavior
- non-goals
- acceptance criteria

Do not begin substantive implementation while any required field is unresolved.

### BUILD_AUTHORIZED

This state exists only when:

- BuildContract validates structurally;
- `authorization.status = BUILD_AUTHORIZED`;
- no blocking architecture issue is open.

### IMPLEMENTING

Invoke `vercel-app-builder` and pass the BuildContract as authority.

Builder may make local implementation decisions only inside the authorized scope.

If implementation reveals a product contradiction, emit `ARCHITECTURE_EXCEPTION` with:

- contradiction
- affected requirement
- implementation evidence
- decision needed

Then route back to Architect.

### PREVIEW_READY

Requires:

- successful CI/build
- Vercel Preview deployment generated from Git
- preview URL reachable
- exact commit SHA recorded

### VALIDATING

Validate against BuildContract acceptance criteria, not generic aesthetics.

Use browser/runtime inspection where available.

Classify failures:

- `IMPLEMENTATION_DEFECT`
- `ARCHITECTURE_DEFECT`
- `EVIDENCE_GAP`
- `ENVIRONMENT_FAILURE`

Route accordingly.

### SHIP_AUTHORIZED

Production merge/deploy requires:

- required technical checks green
- no blocking acceptance criterion failed
- architecture/product authority has not revoked the build

For user-facing product changes, do not infer field validation from a successful build.

### PRODUCTION_READY

Requires the Vercel production deployment to be proven from Git and READY, following the downstream builder acceptance test.

## Orthogonal review interface

The Orchestrator may request multiple independent review lenses from the Architect phase, but the review system must return decision-relevant deltas rather than endless commentary.

A review lens output must state:

- `decision`: PASS | REVISE | BLOCK
- `blocking_issue`: optional
- `change_required`: optional
- `criterion_affected`
- `confidence`

Convergence belongs to the Architect phase, not the Builder.

If additional review lenses no longer change scope, acceptance criteria, risk controls, or the next field test, stop iterating and authorize the next external test.

## Technical routing rules

- Infrastructure-only task -> Builder directly; Architect may be bypassed when telos/scope are unchanged.
- Product copy/layout tweak with no behavior or scope change -> Builder may execute under the latest valid BuildContract.
- New feature / changed user behavior / changed product promise -> Architect required.
- Build failure -> Builder.
- User confusion caused by product model -> Architect.
- Vercel/GitHub/CI failure -> Builder.
- Need to decide whether feature should exist -> Architect.

## Canonical outputs

Persist when useful:

- `BUILD_CONTRACT.json`
- `BUILD_EVIDENCE.json`
- architecture exceptions or decision records

The filenames may vary by repository convention, but their semantics must remain distinct.

## Completion rule

Do not report “the app is done” merely because code exists or Vercel is READY.

Report separately:

- architecture state
- implementation state
- preview/production state
- evidence/field-test state

The system is technically orchestrated when the authority boundary, handoff contract, routing rules, and downstream deployment pipeline are all explicit and testable.

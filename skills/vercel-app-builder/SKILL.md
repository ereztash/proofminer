---
name: vercel-app-builder
description: Implement and wire a web application from GitHub to Vercel with GitHub as the source of truth, automatic CI, Preview deployments for branches/PRs, Production deployments from the production branch, and an end-to-end canary that proves the pipeline. In orchestrated product work, consume a BUILD_AUTHORIZED BuildContract from app-orchestrator/AGT Architect and return BuildEvidence without redefining product intent.
---

# Vercel App Builder

## Purpose

Be the implementation/deployment authority, not the product authority.

Deployment invariant:

`feature branch -> GitHub CI -> Vercel Preview -> PR -> merge to production branch -> GitHub CI -> Vercel Production`

GitHub is the source of truth. Vercel is downstream deployment infrastructure.

Do not report the pipeline as complete until it has been proven end to end with a real branch/commit.

## Orchestrated mode

When invoked by `app-orchestrator`, the Builder receives a BuildContract conforming to:

`../app-orchestrator/contracts/build-contract.schema.json`

Before substantive implementation, require:

- `authorization.status = BUILD_AUTHORIZED`
- no blocking architecture issue
- product telos, primary actor, desired state change, scope and acceptance criteria present

Treat those fields as upstream authority.

The Builder may choose implementation details inside the authorized scope, including component boundaries, file organization, framework-appropriate patterns, CI mechanics and Vercel configuration.

The Builder must **not** silently change:

- product telos
- target actor/ICP
- desired user state change
- product promise
- in-scope behavior/non-goals
- blocking product acceptance criteria

If implementation reveals a contradiction in those fields, return an `ARCHITECTURE_EXCEPTION` rather than patching around the contradiction.

After implementation/validation, return BuildEvidence conforming to:

`../app-orchestrator/contracts/build-evidence.schema.json`

## Direct mode

Direct invocation is valid for infrastructure-only work or implementation work that does not alter product intent, behavior, promise, scope or acceptance criteria.

If the requested change would alter one of those, route back through `app-orchestrator` / Architect.

## Required inputs

Resolve from conversation or connected tools whenever possible instead of asking the user to repeat them:

- GitHub owner/account
- repository/app identity
- existing Vercel project
- production branch
- framework/build system
- BuildContract when orchestrated

Detect rather than guess.

## Tool prerequisites

Prefer connected GitHub and Vercel apps.

1. Load the relevant GitHub skill before repository/PR publishing work.
2. Load the Vercel API skill before Vercel project/deployment work.
3. Use Vercel native Git integration when available. Do not default to long-lived Vercel tokens in GitHub Actions when native Git integration provides the required behavior.

## Workflow

### 1. Establish source of truth

- inspect the target GitHub repository
- reuse intended repositories/projects instead of creating duplicates
- confirm default/production branch
- inspect existing code patterns before writing

### 2. Separate product and infrastructure changes

- work on a feature branch for substantive changes
- keep CI/CD infrastructure separable from unfinished product changes when useful
- do not merge product work merely to activate infrastructure

### 3. Implement only authorized scope

- map each blocking acceptance criterion to implementation/verification work
- keep traceability from requirement to code/test/evidence
- if a product contradiction emerges, raise `ARCHITECTURE_EXCEPTION`

### 4. Add/maintain build gate

CI should run on PRs and production-branch pushes.

Minimum applicable checks:

1. checkout
2. runtime setup
3. syntax/static/type/lint checks appropriate to the stack
4. deterministic dependency install
5. production build
6. tests when the repository has meaningful automated tests

Do not claim CI works merely because workflow YAML exists. Verify a real workflow run succeeds.

### 5. Pin Vercel configuration only when useful

Keep `vercel.json` minimal and framework-specific.

For a simple Vite app it may contain:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "git": { "deploymentEnabled": true }
}
```

Do not blindly apply this to Next.js, Nuxt, SvelteKit, monorepos or custom roots.

### 6. Ensure native Git integration

Desired relationship:

- Vercel project -> GitHub repository
- production branch -> Vercel Production
- feature branches/PRs -> Vercel Preview

If the connector cannot link Git directly, request only the unavoidable one-time UI action. Then prove the link with a canary; do not trust configuration intent alone.

### 7. Prove Preview path

For a new pipeline or materially changed deployment setup:

1. create a harmless branch/commit
2. open a PR
3. verify GitHub CI starts and succeeds
4. verify Vercel creates a Git-origin Preview automatically
5. verify repo/branch/commit metadata
6. fetch Preview and confirm successful HTTP/app shell

### 8. Validate product acceptance in orchestrated mode

Evaluate BuildContract criteria that are testable in Preview.

Classify failures as:

- `IMPLEMENTATION_DEFECT`
- `ARCHITECTURE_DEFECT`
- `EVIDENCE_GAP`
- `ENVIRONMENT_FAILURE`

Repair implementation defects locally. Route architecture defects upstream.

A green build does not equal product acceptance.

### 9. Prove Production path

Only after ship authorization when orchestration applies:

1. merge/push to production branch
2. confirm exact production SHA
3. verify GitHub CI
4. verify Vercel creates Production automatically from Git
5. verify READY
6. verify deployment metadata points to exact SHA and Git source
7. verify stable production alias/domain

## Non-negotiable checks

- A manual/API Vercel deployment does not prove Git integration.
- Never say “automatic” before a Git commit demonstrably triggers Vercel without a manual deploy call.
- Never confuse Preview URL with stable production domain.
- Never add Vercel tokens/secrets unless native Git integration is unavailable and the user explicitly chooses the alternative.
- Never redefine upstream product authority to make implementation easier.
- Never report “app complete” solely because deployment is READY.

## Output

In direct mode, report compactly:

- repository/branch/commit
- CI status
- Vercel project/deployment
- Preview/Production URLs as applicable
- evidence that automation was tested

In orchestrated mode, return BuildEvidence with:

- exact source branch/SHA/PR
- CI evidence
- deployment evidence
- acceptance-criterion results
- architecture exception if any
- result: `PREVIEW_READY`, `PRODUCTION_READY`, `REVISE`, or `BLOCKED`

## References

- Deployment acceptance test: `references/acceptance-test.md`
- Orchestration state machine: `../app-orchestrator/references/state-machine.md`

# Application skill routing

This repository keeps product/architecture authority separate from implementation/deployment authority.

## Default route for app work

`app-orchestrator`
→ Architect provider (`AGT Architect` preferred when available)
→ `BUILD_AUTHORIZED` BuildContract
→ `vercel-app-builder`
→ BuildEvidence
→ Orchestrator state transition

## Skill responsibilities

### `app-orchestrator`
Owns lifecycle state, routing, authority boundaries, handoff normalization, and acceptance-state transitions.

It does **not** replace the Architect or Builder.

### Architect provider
Preferred binding: `AGT Architect`.

Owns telos, actor, desired state change, product mechanism, scope/non-goals, product acceptance criteria, and revise/kill/ship decisions.

Any future Architect implementation can replace it if it emits the same BuildContract semantics.

### `vercel-app-builder`
Owns GitHub implementation, CI, Vercel Preview/Production deployment, and technical evidence.

It consumes an authorized BuildContract in orchestrated mode and must raise an architecture exception instead of redefining product intent.

## Direct-builder exception

The orchestrator may route directly to `vercel-app-builder` for infrastructure-only tasks or implementation changes that do not alter product intent, user behavior, product promise, scope, or acceptance criteria.

## Contracts

- `app-orchestrator/contracts/build-contract.schema.json`
- `app-orchestrator/contracts/build-evidence.schema.json`
- `app-orchestrator/references/state-machine.md`

These contracts are the technical seam between reasoning architecture and deployment architecture.

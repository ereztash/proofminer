# App orchestration state machine

## States

`INTAKE`
→ `ARCHITECTING`
→ `BUILD_AUTHORIZED`
→ `IMPLEMENTING`
→ `PREVIEW_READY`
→ `VALIDATING`
→ `SHIP_AUTHORIZED`
→ `PRODUCTION_READY`

Terminal alternative: `KILL`.

Revision loops:

- `IMPLEMENTING -> ARCHITECTING` only through `ARCHITECTURE_EXCEPTION`.
- `VALIDATING -> IMPLEMENTING` for `IMPLEMENTATION_DEFECT`.
- `VALIDATING -> ARCHITECTING` for `ARCHITECTURE_DEFECT`.
- `VALIDATING -> ARCHITECTING` or `KILL` for field evidence that invalidates the product mechanism.

## Gate definitions

### BUILD_AUTHORIZED

Required evidence:

- BuildContract conforms structurally.
- `authorization.status = BUILD_AUTHORIZED`.
- `blockingIssues` is empty.
- At least one blocking acceptance criterion exists for a substantive product build.

### PREVIEW_READY

Required evidence:

- exact commit SHA
- GitHub CI/build success
- Git-origin Vercel Preview
- deployment READY
- preview responds successfully

### SHIP_AUTHORIZED

Required evidence:

- all blocking technical/behavior/UX acceptance criteria that are testable pre-production pass
- no unresolved architecture exception
- Architect authorization has not been revoked

A successful build alone does not authorize shipping.

### PRODUCTION_READY

Required evidence:

- production deployment generated automatically from the production branch
- deployment source is Git
- deployment SHA equals the production merge/push SHA
- deployment READY
- production CI succeeds

## Authority matrix

| Decision | Architect | Builder | Orchestrator |
|---|---:|---:|---:|
| Should this capability exist? | owns | no | routes |
| Who is the user / actor? | owns | no | enforces contract |
| Desired behavior/state change | owns | no | enforces contract |
| Product acceptance criteria | owns | informs feasibility | normalizes |
| Component/code design | constraints | owns | routes |
| Repository/branch/PR mechanics | no | owns | observes |
| CI/Vercel deployment | no | owns | verifies gate |
| Architecture contradiction found in code | decides | raises exception | routes |
| Technical implementation defect | informed if material | owns repair | routes |
| Ship/revise/kill after evidence | owns product decision | reports evidence | transitions state |

## Provider abstraction

The `Architect` is a provider role, not a hard-coded implementation.

Preferred provider may be `AGT Architect`. If another architect agent later replaces it, the downstream integration remains stable as long as it emits the BuildContract semantics.

The `Builder` default provider is `vercel-app-builder`.

This prevents a change in reasoning architecture from forcing a change in deployment architecture.

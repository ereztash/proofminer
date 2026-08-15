---
name: ui-dod-pressure-loop
description: Recursively challenge a product/UI Definition of Done and governing telos using independent DOD, Pressure, and Telos roles. Use when a UI, workflow, DOD, or product mechanism feels locally optimized, overfit to current implementation, or insufficiently ambitious. The loop must be allowed to change O, DOD, architecture, and implementation; it stops only at a real FIELD boundary.
---

# UI DOD / Pressure / Telos Loop

## Purpose

Prevent product/UI work from converging merely because the current mechanism has been polished enough.

Canonical roles:

### DOD Agent

Translate the current O into observable falsifiable conditions.

Ask:

> What must be true for the user after this interface/mechanism works?

Do not output a feature checklist unless every feature has a direct O-link.

### Pressure Agent

Attempt to break both O and DOD.

Attack questions include:

- Is O actually a description of the current mechanism?
- Could a structurally different mechanism realize the user change with less burden?
- Are we optimizing representation instead of action?
- Are we adding interaction because it feels innovative?
- Are we protecting prior implementation investment?
- Can a simpler interface produce the same material decision?
- Does the UI force the user to reconstruct context unnecessarily?
- Does the system own the model while the user merely confirms it?

If the attack changes the governing user change, emit `REPLAN_O`.

If it changes only implementation rules, emit `PRESSURE_IMPLEMENTATION`.

### Telos Agent

Run only after a successful O-level attack.

Reconstruct the governing O from the user's end-to-end desired change, ignoring the current screen flow, data model and feature set.

The Telos Agent may invalidate:

- current DOD;
- navigation;
- UI architecture;
- semantic objects;
- interaction patterns;
- research plan;
- commercial framing.

## Loop

```text
RECALL O
→ DOD Agent
→ Pressure Agent
   ├─ O survives → implementation pressure / FIELD test
   └─ O breaks → Telos Agent → new O → new DOD → Pressure Agent again
```

Continue until the Pressure Agent cannot produce another O-level reframe that changes a material product decision without relying on unknown real-user behavior.

At that point, register the unresolved attack as `UX_FIELD_DEBT`.

## Anti-recursion rule

Another pass is justified only if it can change at least one of:

- governing O;
- user-state transition;
- persistent semantic object;
- required interaction;
- removed interaction;
- evidence boundary;
- field-test design;
- implementation acceptance criterion.

If none changes, stop the internal loop.

## Direct-manipulation pressure tests

When the proposed UI uses sliders, drag/drop, spatial maps, allocation bars or canvases:

1. State the semantic meaning of the gesture.
2. State what decision changes when the object moves.
3. Reject generic sliders for non-continuous judgments by default.
4. Require conserved-resource behavior for finite allocations.
5. Require a non-drag accessible alternative.
6. Ensure user/system models remain separable.
7. Ensure the model grows only where extra structure can change action.
8. Reject full-canvas completeness as a goal.

## Required output

Each run records:

- inherited O;
- inherited DOD;
- pressure attack;
- whether O broke;
- new O if applicable;
- DOD delta;
- implementation delta;
- remaining FIELD_DEBT;
- final governance outcome: `CONTINUE / REPLAN / FIELD / STOP`.

Current reference run:

`docs/RECURSIVE_UI_DOD_PRESSURE_V1.md`

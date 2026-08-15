# DOD UI Delta — v2 / effective DOD v5.2

Date: 2026-08-16

## Authority

This delta is subordinate to `TELOS_GOVERNANCE.md` v1.5 and augments `DEFINITION_OF_DONE.md` v5.0.

For interface / first-session work, the effective DOD is **v5.2**.

Read with:

- `RECURSIVE_UI_DOD_PRESSURE_V1.md`
- `UX_STRATEGIC_WIND_TUNNEL_V1.md`

---

# UI telos

> **Help the user move from professional ambiguity to grounded action with the least unnecessary cognitive work, while keeping commitments, trade-offs, evidence and reasons visible and manipulable enough to challenge and revise without starting over.**

The interface is not required to be minimal in clicks. It is required to avoid **unnecessary cognitive reconstruction**.

The current design class is:

> **Progressively revealed manipulable decision workspace.**

---

# DOD Agent — observable target state

The interface succeeds only when the user can, without reconstructing the session from prose:

1. see the target professional change;
2. see the actions currently competing for resources;
3. change their order / state directly;
4. allocate a real scarce resource when a quantity is known;
5. see what is unallocated / displaced when resources move;
6. expose a dependency only where sequence matters;
7. distinguish their model from system inference / external evidence;
8. inspect why the system challenges an action;
9. change the plan without losing the rationale / evidence linked to it;
10. leave with a user-owned current plan + unresolved test / reversal condition.

---

# Core interaction gates

## UI1 — Objects before fields

Persistent state is represented as explicit objects where possible:

- target;
- action;
- resource allocation;
- action state;
- dependency;
- evidence / unknown;
- reversal trigger.

Free text may create / edit these objects. The text itself is not the only state store.

## UI2 — Minimum model first

Default first-use surface exposes only the smallest useful model:

```text
target
+ action candidates
+ scarce resource / reserve
```

Dependencies, evidence traces, professional mirror, scenario and uncertainty detail appear only when they can change action.

**Fail:** showing a complete strategy canvas merely because the data model can support it.

## UI3 — Direct manipulation must be semantic

A gesture survives only when the gesture itself changes the represented decision.

Examples:

- reorder actions because sequence matters;
- move an action between `NOW / LATER / LEARN` because status matters;
- allocate hours / budget because scarcity matters;
- connect prerequisite because dependency matters.

**Hard fail:** draggable / animated controls added only to increase delight or engagement.

## UI4 — Conserved-resource controls

When hours / money / another finite resource is allocated, the interface preserves conservation visibly.

Increasing one action's allocation must reduce:

- another action; or
- the visible unallocated reserve.

**Hard fail:** every action can independently receive `9/10 importance` or arbitrary hours without showing opportunity cost.

## UI5 — Slider legitimacy

Sliders are allowed only for genuine continuous quantities with meaningful endpoints, such as:

- hours;
- money;
- planning horizon;
- bounded numeric capacity.

Generic importance, confidence, attractiveness, strategic correctness or priority do not become sliders by default.

If a slider requires precision, display the numeric value and provide an accessible non-drag alternative.

## UI6 — Reorderability where sequence matters

Actions can be reordered directly when order changes execution / dependency meaning.

Drag is optional; keyboard / button alternatives must exist.

## UI7 — User model and system model remain separable

The system may propose a different order, status, dependency or allocation.

It may not silently overwrite the user's arrangement.

A disagreement should be inspectable as:

```text
YOU
vs
SYSTEM CHALLENGE
```

with the reason / evidence class attached.

## UI8 — Baseline integrity

Where before/after evidence matters, the user's pre-intervention arrangement must be frozen before the system challenge appears.

The frozen baseline is stored as object state, not reconstructed from memory after recommendation.

## UI9 — Progressive model growth

Adding another object / layer requires an explicit reason:

> **Which action or allocation can change if this structure becomes visible?**

If none, do not add it.

## UI10 — Dependencies are conditional UI

Dependency edges / prerequisite controls appear only when a dependency can:

- block;
- reorder;
- delay;
- unlock

a current action.

Do not turn the workspace into a generic graph editor.

## UI11 — Uncertainty is actionable

Uncertainty appears as:

- unresolved decision-relevant question;
- missing evidence;
- conflicting evidence;
- reversal / test condition.

It is not a decorative confidence percentage.

## UI12 — Text is an alternative interaction

Any manipulable object can be created / edited through simple text when direct manipulation is difficult or undesired.

The user is never forced to drag.

## UI13 — One manipulation, immediate feedback

After a resource, order or state change, show the consequence immediately:

- remaining hours / money;
- changed sequence;
- newly blocked / unlocked action;
- changed next action;
- unresolved contradiction.

Avoid hidden recomputation that changes the plan with no visible trace.

## UI14 — No recommendation report before action consequence

The primary view is the working plan, not a consulting report.

Rationale and provenance use progressive disclosure.

## UI15 — KEEP remains valid

If the user's arrangement survives evidence / challenge, preserving it is a valid outcome.

Do not manufacture movement to demonstrate product value.

## UI16 — User authorship is structural

The session ends with the user's current arrangement, not an `Accept recommendation` action.

The system records:

- what the user actually kept / moved / delayed / added;
- where resources now go;
- any unresolved disagreement;
- what evidence should trigger another change.

## UI17 — Mobile preserves the model

On mobile, semantic order survives even when drag / spatial layout collapses.

Accessible controls must preserve:

- action order;
- state;
- allocation;
- rationale;
- reversal condition.

## UI18 — Preview honesty

Until automated research / decision intelligence exists, the UI labels prototype inference correctly and does not imply validated market observation.

---

# Pressure Agent kill conditions

The richer workspace must be collapsed toward a strong guided interface if FIELD repeatedly shows any of:

- users spend more effort arranging objects without improving a material decision;
- manipulation feels satisfying but does not improve explanation / authorship / action;
- allocation controls create fake precision;
- drag/reorder mechanics bias choices in ways users cannot explain;
- users cannot tell what object to manipulate first;
- the workspace requires more coaching than a strong guided flow;
- system/user overlays create confusion rather than contestability;
- users rebuild the model in conversation because the objects are not expressive enough;
- a simpler guided flow yields comparable decisions at lower cognitive cost.

---

# Structural acceptance tests

A current implementation passes implementation-level DOD only when:

1. the legacy five-step wizard is no longer the canonical state architecture;
2. action candidates exist as independent editable objects;
3. action order can change without rewriting a textarea;
4. a finite resource can be allocated across actions with visible reserve / conservation;
5. allocation has a non-drag accessible control;
6. action state can change directly (`NOW / LATER / LEARN` or equivalent);
7. user's baseline arrangement can be frozen before system challenge;
8. system challenge does not overwrite the user's arrangement;
9. rationale / evidence / reversal condition can attach to an action;
10. optional advanced structure is progressively revealed;
11. no generic confidence / importance slider is used;
12. page metadata reflects the current transition / decision product;
13. responsive behavior preserves action semantics;
14. CI syntax + production build succeed;
15. exact deployed commit is verified before claiming Vercel deployment.

---

# UX FIELD_DEBT

The internal DOD / Pressure / Telos loop can no longer resolve:

1. whether the manipulable workspace reduces or increases cognitive burden versus a strong guided flow;
2. whether conserved-resource allocation reveals real trade-offs users would not otherwise articulate;
3. whether direct reordering improves sequence reasoning or merely creates interaction bias;
4. whether users understand system-vs-user disagreement without coaching;
5. whether progressive model growth reveals enough structure without feeling hidden / unpredictable;
6. whether users prefer text fallback or manipulation for each object type;
7. whether the richer model improves actual execution / reversal behavior at follow-up.

Compare:

- **Arm G — Strong Guided**: concise progressive prompts producing the same semantic objects.
- **Arm M — Manipulable Workspace**: direct manipulation of the same objects.

The richer interface survives only if it produces material improvement in decision understanding, trade-off quality, authorship, research targeting or execution that justifies its complexity.

---

# Current outcome

`REPLAN → IMPLEMENT → FIELD`

The previous progressive wizard is now a historical implementation hypothesis. It is not protected by prior work.

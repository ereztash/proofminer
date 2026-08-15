# Recursive UI DOD / Pressure / Telos Loop — v1

Date: 2026-08-16

## Purpose

This artifact records a recursive adversarial design loop between three independent roles:

- **DOD Agent** — asks what must be observably true for the interface to realize the current O.
- **Pressure Agent** — attacks the current O, DOD and UI mechanism; it is rewarded for proving that the current framing is local, ceremonial, over-modeled or replaceable by a simpler mechanism.
- **Telos Agent** — reconstructs O from the user's end-to-end desired change after a successful attack. It may invalidate the DOD and interface architecture.

The loop stops only when another internal reframe cannot be shown to change the next interface decision and the remaining uncertainty requires human use.

---

# Round 0 — inherited framing

Inherited UI O:

> Help the user form and own a better consequential professional decision.

Inherited mechanism:

```text
transition
→ baseline form
→ optional professional mirror
→ system decision board
→ user commitment
```

### Pressure Agent attack

This still models the product as a **workflow that delivers a recommendation**. The user mostly describes state in text, then receives system-authored cards.

It preserves authorship at the end, but the system still owns the central representation.

### Verdict

`REPLAN`

---

# Round 1 — Decision Environment

Telos candidate:

> Make the structure of the consequential decision visible and manipulable so the user can inspect and change it rather than merely answer questions about it.

### DOD implication

The interface should expose manipulable objects for:

- candidate actions;
- ordering;
- resource allocation;
- uncertainty;
- dependencies;
- user/system disagreement.

### Pressure Agent attack

This remains too decision-local. A professional transition is not one choice between cards. It is a system of commitments whose dependencies and resource consequences change together.

### Verdict

`REPLAN`

---

# Round 2 — Live Action Model

Telos candidate:

> Turn an ambiguous professional transition into a live action model the user can manipulate, challenge, stress-test and revise until the next action / experiment follows from the model.

### DOD implication

The primary artifact becomes a persistent strategy surface rather than a wizard page.

### Pressure Agent attack

This can become **modeling theater**. A rich canvas can increase cognitive load, reward completeness, and cause the product to optimize the model instead of helping the user act.

If the same decision can be reached with two direct manipulations, a full map is waste.

### Verdict

`REPLAN`

---

# Round 3 — Minimum Manipulable Model

Telos candidate:

> Build only the smallest manipulable model needed to expose the current trade-off, then grow the model only where a dependency, disagreement or uncertainty can change action.

### DOD implication

Progressive disclosure applies to **model complexity itself**, not only to explanatory text.

Default surface:

1. target transition;
2. action candidates;
3. scarce-resource allocation.

Only then, if decision-relevant:

- dependency edges;
- uncertainty / evidence state;
- competing lens;
- scenario / reversal condition.

### Pressure Agent attack

"Smallest model" can become a speed objective. The interface may remove necessary friction and push premature action merely because fewer elements feel simpler.

### Verdict

`REPLAN`

---

# Round 4 — Current surviving O

The Telos Agent reconstructs the UI O as:

> **Help the user move from professional ambiguity to grounded action with the least unnecessary cognitive work, while keeping the commitments, trade-offs, evidence and reasons sufficiently visible and manipulable that the user can challenge and revise them without starting over.**

This is not a mandate for minimal clicks. Necessary friction survives when it protects:

- uncontaminated baseline;
- a real trade-off;
- authorship;
- evidence boundaries;
- reversal / learning conditions.

The interface is therefore neither:

- a form;
- a chat transcript;
- a dashboard;
- a full systems canvas;
- a recommendation report.

The current design class is:

> **Progressively revealed manipulable decision workspace.**

---

# Round 5 — Pressure to failure boundary

The Pressure Agent attacks the surviving O:

1. Direct manipulation may feel satisfying without producing a better decision.
2. Budget bars may force false precision when the user does not know real resource amounts.
3. Spatial placement may imply quantitative meaning that the user does not intend.
4. Dragging can alter judgment merely through interaction mechanics.
5. A user may prefer to describe rather than manipulate.
6. A user may understand the transition only after conversation, not before it.

### Internal response

These attacks change implementation rules but no longer justify a higher O:

- direct manipulation is used only when the manipulation has semantic identity with the decision;
- sliders only represent real continuous quantities (time, money, horizon), never generic importance / confidence scores;
- drag/reorder always has button / keyboard alternatives;
- the user may switch between direct manipulation and text at the same semantic object;
- unknown quantities may stay qualitative / unallocated;
- spatial layouts must state their axes explicitly or avoid implying measurement;
- every interaction must have a `decision_consequence` or lose its claim to UI space.

### Remaining uncertainty

Whether users actually think more clearly and with less friction through this workspace rather than a strong simple guided flow cannot be resolved internally.

This is now **UX FIELD_DEBT**, not another reason to invent a more complex interface.

### Outcome

`REPLAN → IMPLEMENT → FIELD`

---

# Current interface invariants

1. **Manipulation must mean something.** No gesture exists only to feel interactive.
2. **Resource controls conserve the resource.** Adding hours/money to one action visibly removes them from another or from an unallocated reserve.
3. **Order is manipulable when sequence matters.** Reordering must change the represented plan.
4. **Dependencies appear only when they can block/reorder action.**
5. **Uncertainty is not a decorative score.** It appears as evidence state / unresolved question / reversal trigger.
6. **User and system models remain separable.** The system may challenge the user's placement without silently overwriting it.
7. **Model complexity is progressive.** The workspace grows only when another distinction can change action.
8. **Text remains an alternative, not the canonical state.** Free text can create/edit objects; explicit objects remain the persistent model.
9. **The user's final state is not `accepted recommendation`.** It is a user-owned arrangement of actions/resources/tests plus explicit disagreement where relevant.
10. **Necessary friction is allowed; ceremonial friction is not.**

---

# New UX FIELD comparison

Compare:

### Arm G — Strong Guided

A well-written progressive form/wizard producing the same semantic model.

### Arm M — Manipulable Workspace

The same objects are directly reorderable / allocatable / challengeable.

Primary discrimination:

- time to first coherent plan;
- number of clarification turns;
- ability to explain the trade-off without coaching;
- material change from initial plan;
- authorship / challenge quality;
- errors caused by interaction affordances;
- user effort;
- actual execution at follow-up.

Kill the richer workspace if it does not improve a material decision / understanding / authorship dimension enough to justify its complexity.

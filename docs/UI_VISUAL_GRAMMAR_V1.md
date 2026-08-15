# UI Visual Grammar v1

Date: 2026-08-16
Status: FIELD hypothesis
Authority: subordinate to `TELOS_GOVERNANCE.md` and additive to `DOD_UI_DELTA_V1.md`

## Visual O

> **At a glance, before reading explanatory prose, the user should be able to distinguish: (1) their own decision model, (2) the scarce-resource constraint, (3) system challenge / inference, and (4) what can be manipulated now.**

The UI is not optimized for decorative novelty. It is optimized for **legible state, manipulability, provenance and low reconstruction cost**.

A visually beautiful interface fails if it makes user-owned state and system-generated state look equivalent.

---

## Research basis

This visual grammar is informed by current primary/authoritative guidance:

- Apple Human Interface Guidelines — hierarchy, typography, color, motion, accessibility, right-to-left layout.
- W3C/WAI WCAG 2.2 — contrast, focus, target size, dragging alternatives, cognitive accessibility, clear page structure and consistent visual design.
- IBM Carbon Design System — productive vs expressive typography, spacing as hierarchy, semantic color roles, purposeful motion.
- Material Design 3 / M3 Expressive — expressiveness may improve usability, but decorative expression is not itself a product goal.

Interpretation for ProofMiner:

> **Use expressive visual treatment only when it clarifies decision state or interaction. Default to productive UI.**

---

# Pressure Agent findings on the previous UI

## V1 — Card soup

Almost every section used:

- background surface;
- border;
- radius;
- shadow;
- badge.

This weakened hierarchy because everything looked equally important.

### Replan

Use whitespace and dividers for major sections. Reserve bordered surfaces for:

- scarce-resource constraint;
- manipulable action objects;
- system challenge / proposal;
- frozen baseline.

---

## V2 — Tiny support text

Multiple labels and helper texts were 9–11 px.

### Replan

Product UI minimums in the current implementation:

- body / explanatory text: 14–16 px;
- labels / helper text: 12–13 px;
- object titles: ~15 px;
- lane titles: ~16 px;
- primary headings: 24–40 px depending on hierarchy / viewport.

Do not use tiny typography to make a dense layout appear cleaner.

---

## V3 — One accent doing too many jobs

Green previously represented brand, interaction, state and positive meaning.

### Replan

Canonical visual roles:

```text
NEUTRAL
content / user-owned state / structure

ACCENT GREEN
primary action + scarce-resource allocation + current commitment

SYSTEM BLUE
system inference / challenge / proposed action

DANGER RED
irreversible / destructive action only
```

Color is never the only state carrier.

---

## V4 — Manipulability was visually weak

The draggable object had a tiny grip and many controls competing for attention.

### Replan

Manipulable action objects must have:

- clearly bounded object surface;
- visible grab affordance;
- hover / focus elevation;
- direct state controls;
- accessible non-drag movement controls;
- immediate resource feedback.

The object itself, not decorative chrome, receives visual priority.

---

## V5 — User state and system state were too visually similar

Logical provenance existed in the data model, but visual provenance was too subtle.

### Replan

System-generated content uses a dedicated visual grammar:

- system-blue border / background role;
- explicit textual label;
- embedded challenge block attached to the relevant user object;
- no silent replacement of the user object.

Accepted system proposals become user-owned only after explicit user action.

---

## V6 — RTL was treated mainly as text direction

For Hebrew, visual order, progress controls and directional meaning also need to follow RTL semantics.

### Replan

- primary reading / scan order is right → left;
- progress / range controls inherit RTL where their progression is conceptual, not geographic;
- numbers themselves are never reversed;
- paragraphs align according to their language where mixed-language content is substantial;
- logical CSS properties (`inline-start`, `inline-end`) are preferred for semantic edges.

---

# Canonical visual hierarchy

The interface has four visual levels.

## L0 — Environment

Quiet neutral background. No decorative texture.

Purpose: establish a stable workspace.

## L1 — Structure

Major sections are primarily separated by:

- whitespace;
- headings;
- alignment;
- occasional dividers.

Purpose: show workflow / relationship without repeated containers.

## L2 — Decision objects

Action cards, finite-resource bar and frozen baseline receive explicit surfaces.

Purpose: make persistent state feel tangible and editable.

## L3 — Intervention

System challenge / proposed action has a distinct semantic treatment.

Purpose: make epistemic authorship visible.

---

# State grammar

## NOW

Meaning: currently committed / executable.

Visual carrier:

- filled accent state control;
- solid accent lane edge;
- solid-dot marker + text.

## LATER

Meaning: plausible but not receiving current commitment.

Visual carrier:

- neutral state control;
- solid neutral lane edge;
- hollow-circle marker + text.

## LEARN

Meaning: action whose purpose is to resolve decision-relevant uncertainty.

Visual carrier:

- system/knowledge blue;
- dashed lane edge;
- question marker + text.

The state is not encoded by color alone.

---

# Typography rules

1. Hebrew is the primary interface language; avoid decorative negative letter-spacing that may reduce Hebrew legibility.
2. Use the platform/system font stack before importing a branded webfont during FIELD.
3. Use a small number of typographic roles.
4. Weight communicates hierarchy before color does.
5. Supporting text must remain readable; do not shrink prose to visually hide complexity.
6. At larger text / zoom levels, multi-column layouts may collapse before truncating meaningful content.

---

# Spacing rules

Spacing communicates relationship before borders do.

Canonical principle:

> **More whitespace around an object means more conceptual independence / importance. Less whitespace means stronger grouping.**

Do not add a card solely to create separation that spacing can communicate.

---

# Motion rules

Motion is productive only.

Allowed:

- immediate resource-bar reconciliation;
- subtle hover / focus response;
- drag feedback;
- progressive disclosure transitions when they clarify where content came from.

Not allowed:

- decorative floating;
- looping attention animation;
- large cinematic transitions;
- motion as the only indication of changed state.

Respect `prefers-reduced-motion`.

---

# Accessibility gates

Current visual system must target at least:

- 4.5:1 contrast for normal text;
- 3:1 for large text where applicable;
- 3:1 for visually necessary UI boundaries / state indicators;
- visible focus ring with sufficient contrast;
- at least 24×24 CSS px pointer targets under WCAG 2.2, with larger targets preferred for frequent controls;
- drag alternatives for every essential drag operation;
- no information communicated by color alone.

Current implementation intentionally uses 38–44 px frequent manipulation targets.

---

# Visual complexity budget

A new visual distinction may be added only if it answers one of:

1. Does it distinguish user state from system state?
2. Does it distinguish persistent object from explanation?
3. Does it reveal a scarce-resource consequence?
4. Does it clarify interactive affordance?
5. Does it make a decision-relevant state easier to scan?
6. Does it improve accessibility / error prevention?

If none, the distinction is decorative debt.

---

# Kill conditions

Collapse / simplify this visual system if FIELD shows:

- users cannot identify what is draggable / editable without coaching;
- users confuse system-blue content with external evidence;
- users interpret NOW / LATER / LEARN differently from intended semantics;
- stronger state styling creates anchoring stronger than the underlying decision evidence;
- the visual hierarchy causes users to skip target / resource constraints;
- the system challenge visually dominates the user-owned model;
- card flattening makes section boundaries unclear;
- the three-column board is harder to scan than a simpler list at realistic action counts;
- users spend attention interpreting the interface instead of the decision.

---

# Current implementation delta

The current code changes:

- removes shadows / card framing from major structural sections;
- increases Hebrew text and helper sizes;
- removes decorative negative tracking from Hebrew hierarchy;
- narrows color semantics to neutral / accent / system / danger roles;
- strengthens input and manipulation boundaries;
- increases frequent control targets;
- gives NOW / LATER / LEARN distinct non-color visual markers;
- gives system challenge a dedicated provenance layer;
- makes RTL explicit for conceptual range controls;
- adds reduced-motion handling;
- preserves responsive collapse to one-column lanes.

---

# Outcome

`REPLAN_VISUAL_O → IMPLEMENT → FIELD`

The UI is now a falsifiable visual hypothesis. Visual polish is not a completion criterion; **correct visual interpretation by real users is.**

# DOD UI Visual Delta v1 — effective UI DOD v5.3

Date: 2026-08-16

This is additive to `DOD_UI_DELTA_V1.md` v2 / effective DOD v5.2.

For visual-interface work, the effective DOD is now **v5.3**.

Read with:

- `UI_VISUAL_GRAMMAR_V1.md`
- `RECURSIVE_UI_DOD_PRESSURE_V1.md`
- `TELOS_GOVERNANCE.md`

---

# Visual O

> **Before reading explanatory prose, the user can distinguish their own decision model, the scarce-resource constraint, system challenge/inference, and the objects that can be manipulated now.**

Visual design is part of epistemic governance. A correct data model with misleading visual provenance fails DOD.

---

# Visual gates

## VUI1 — Hierarchy before decoration

Major hierarchy must be visible through typography, spacing, alignment and surface role before decorative effects.

**Fail:** every section is independently carded / shadowed / badged with comparable visual weight.

## VUI2 — Productive typography

Supporting text remains legible in realistic desktop/mobile use and browser zoom.

**Fail:** helper text is made tiny merely to reduce apparent density.

## VUI3 — Semantic color roles

Color roles are stable:

- neutral = content / user state;
- accent = primary interaction / current commitment / finite allocation;
- system = system inference / challenge / proposal;
- danger = destructive action.

**Fail:** the same accent is reused decoratively or to imply unrelated meanings.

## VUI4 — Color is redundant, never sole

Critical state has a non-color carrier: text, icon/shape, border style or spatial role.

## VUI5 — User/system provenance is visually obvious

A reasonable first-time user should not need to inspect metadata to distinguish:

- what they entered / chose;
- what the system inferred / proposed;
- what is external evidence.

**Hard fail:** system inference visually masquerades as user-owned or externally observed truth.

## VUI6 — Manipulable objects look manipulable

Objects supporting drag/reorder/allocation expose a clear interaction affordance and immediate response.

Essential drag actions retain non-drag alternatives.

## VUI7 — Scarcity is visually conserved

The finite-resource representation makes unallocated reserve / displacement visible.

**Fail:** allocation appears independent per action.

## VUI8 — State is scan-readable

`NOW / LATER / LEARN` or equivalent states are distinguishable at lane and control level without opening detail.

## VUI9 — RTL is semantic

Hebrew layout uses RTL reading order and logical direction for conceptual progress / navigation where appropriate.

Digits are never reversed internally.

Mixed-language paragraphs may follow their own language direction when necessary for readability.

## VUI10 — Focus is visible

Keyboard focus is never hidden by subtle hover-only styling. Focus indicators must remain visible against adjacent colors.

## VUI11 — Frequent targets are comfortably operable

Meet WCAG 2.2 target-size rules; for frequent manipulation controls, prefer substantially larger than the bare minimum.

## VUI12 — Motion explains state

Motion survives only if it clarifies:

- direct manipulation;
- state transition;
- progressive disclosure origin;
- resource consequence.

Respect reduced-motion preference.

## VUI13 — Visual density has a budget

A new badge, border, icon, tint, shadow or animation must justify which decision-relevant distinction it makes easier to perceive.

If none, remove it.

## VUI14 — System challenge cannot dominate authorship

The visual weight of system intervention may be distinct, but it must not make the user-owned plan look secondary or obsolete before explicit adoption.

## VUI15 — Responsive collapse preserves meaning

When the board collapses to one column, semantic order, state identity and manipulation controls survive.

---

# Structural acceptance tests

Implementation-level visual DOD passes only when:

1. normal body/helper text is not dependent on 9–11px sizing;
2. core inputs have perceptible boundaries and focus states;
3. frequent manipulation targets meet minimum target guidance;
4. major sections are not all given equal card/shadow treatment;
5. action objects are visually distinct from structural layout;
6. system challenge is visually distinct from user state;
7. NOW / LATER / LEARN use more than color alone;
8. range controls follow RTL conceptual direction in Hebrew;
9. reduced motion is supported;
10. no decorative motion is required to understand state;
11. contrast-critical text and controls meet intended WCAG thresholds;
12. production build passes;
13. deployed commit is verified before deployment claims.

---

# FIELD debt

Internal visual reasoning cannot resolve:

- whether users correctly identify manipulation affordances at first glance;
- whether visual state strength creates anchoring bias;
- whether the three-lane structure improves scanning at realistic action counts;
- whether system-blue is understood as inference rather than verified evidence;
- whether the reduced card framing makes section structure clearer or weaker;
- whether the typography scale feels calm or oversized in actual browser use;
- whether the workspace remains usable at 200% zoom and on mobile;
- whether user attention goes first to target, actions or system intervention in the desired order.

These are now explicit visual FIELD questions, not reasons for another internal styling pass.

---

# Current outcome

`REPLAN_VISUAL_O → IMPLEMENT → FIELD`

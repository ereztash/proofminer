# UX Transition Contract — v1

## Authority

This document is subordinate to `docs/TELOS_GOVERNANCE.md` and operationalizes the user-state transitions the product experience is currently expected to produce.

It is a falsifiable hypothesis. If field evidence shows that the ICP enters with a different conscious problem, this contract must change.

---

# Trigger hypothesis

The primary acquisition trigger is not "I need content" and not the product's internal concept of an Authority Project.

The working trigger is:

> **A meaningful gap exists between the professional position / authority I want and the opportunities or recognition I receive now, and I do not know which actions will close that gap most effectively or in what order.**

The most consciously legible version for the current ICP is expected to be approximately:

> **"I know I need to build authority / professional standing, but I do not know what is actually right for me to do, or what should come first."**

The exact wording is not doctrine. Recognition of this problem is.

---

# Four user-state transitions

## A0 → A1 — Recognition

### A0
The user experiences some mismatch between capability and market response but may not yet frame it as an authority-building problem.

### A1
The user recognizes:

> "I need to strengthen how the relevant market understands and trusts my expertise, and I need a path rather than more generic tactics."

### UX job
The acquisition / first-screen experience should create self-recognition without requiring the user to learn product vocabulary.

---

## A1 → B — Activation / primary conscious job

### A1
The user knows they need to build authority or professional standing but lacks a personalized route.

Typical uncertainty:

- for whom should I build it?
- what already gives me a right to speak?
- what is actually missing?
- what should I do first?
- what can happen in parallel?
- what is premature?

### B — Decision-Ready Authority Map

The user can state, without facilitator interpretation:

1. what they want to become known for;
2. by whom;
3. what their current strategic gap is;
4. what action they should take now;
5. why that action has priority;
6. what can happen in parallel;
7. what is blocked or premature;
8. what additional information could materially change the map.

This is the primary first-session UX outcome.

---

## B → C — Execution

### B
The user has a decision-ready map.

### C
The user performs a real authority-building action outside the product or produces/deploys an asset that materially advances the map.

### UX job
Reduce the distance between recommendation and execution without replacing strategic judgment with engagement mechanics.

---

## C → D — Learning / retention

### C
A real action has occurred.

### D
The system incorporates relevant evidence or market response and updates the map when warranted; the user understands the change as learning rather than arbitrary inconsistency.

This is a retention / compounding-value hypothesis, not the primary acquisition promise.

---

# Product hierarchy implied by the transitions

The experience should normally reveal value in this order:

```text
CONSCIOUS PAIN
"I need to build authority but don't know what is right for me or what comes first"
        ↓
PROMISE
"Build the path that is right for you"
        ↓
FIRST VALUE
"Here is your current gap and what to do first"
        ↓
EXPLANATION
"Here is why this recommendation is specific to you"
        ↓
DEEP MECHANISM
field model + assets + diagnosis + dependency map + provenance
        ↓
COMPOUNDING VALUE
market evidence changes the route
```

Internal sophistication must not outrank the user's conscious pain in the visual or conceptual hierarchy.

---

# UX evaluation lenses

Evaluate the experience primarily through these functional lenses:

1. **Trigger Fit** — does the user recognize the problem as theirs?
2. **Promise Legibility** — can the user explain what change the product offers?
3. **Diagnostic Efficiency** — does each requested input change a decision or capability?
4. **Personal Relevance** — can the user explain why the recommendation is specific to them rather than a generic template?
5. **Strategic Orientation** — do they understand current state, target state and primary gap?
6. **Dependency Comprehension** — can they distinguish now / sequential / parallel / blocked / premature?
7. **Decision Compression** — can they identify one next action and why it has priority?
8. **Trust & Inspectability** — can they distinguish source data, system inference and recommendation?
9. **Replanning Legibility** — after new evidence, does a changed route feel like justified learning rather than contradiction?

Visual polish is evaluated only insofar as it improves or damages one of these jobs, accessibility, or product trust.

---

# Working field thresholds for the next low-fidelity test

These are preregistered experimental thresholds, not permanent doctrine.

For target users completing the first-session test without facilitator explanation:

- >= 80% can explain the product promise in their own words;
- >= 80% can recall the selected audience, primary gap and next action;
- >= 80% can explain why the next action has priority;
- >= 70% can correctly reconstruct sequential versus parallel work;
- >= 70% can distinguish `blocked` from `premature`;
- >= 80% can explain why the next requested data would be useful;
- 0 users should need internal terms such as SWOT, EvidenceUnit, ProofMove or ontology to complete the core flow.

The first behavioral execution metric after activation is:

> **What proportion of activated users perform the recommended real-world action within the preregistered observation window?**

The initial working observation window is 7 days unless the recommended action itself reasonably requires a different horizon.

---

# UI decision rule

For every meaningful UI element, ask:

> **Which transition — A0→A1, A1→B, B→C, or C→D — is this element intended to improve?**

If it has no defensible answer and is not required for accessibility, safety, privacy or basic usability, it has no default claim to screen priority.

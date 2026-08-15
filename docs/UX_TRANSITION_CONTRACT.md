# UX Transition Contract — v2

## Authority

This document is subordinate to `docs/TELOS_GOVERNANCE.md` and operationalizes the user-state transitions the product experience is currently expected to produce.

It is falsifiable. If field evidence shows that the ICP enters with a different conscious problem or that resource reallocation is not material value, this contract must change.

See also `docs/RESOURCE_REALLOCATION_CONTRACT.md`.

---

# Trigger hypothesis

The primary acquisition trigger is not "I need content" and not the product's internal concept of an Authority Project.

The working trigger is:

> **A meaningful gap exists between the professional position / authority I want and the opportunities or recognition I receive now, and I do not know which actions deserve my time, money and attention first.**

The consciously legible version for the current ICP is expected to be approximately:

> **"I know I need to build authority / professional standing, but I do not know what is actually right for me to do, what should come first, or what I should stop wasting effort on."**

The exact wording is not doctrine. Recognition of the decision/resource-allocation problem is.

---

# Four user-state transitions

## A0 → A1 — Recognition

### A0
The user experiences some mismatch between capability and market response but may not yet frame it as an authority-building or resource-allocation problem.

### A1
The user recognizes:

> "I need to strengthen how the relevant market understands and trusts my expertise, and I need to decide where my limited resources should go rather than just collect more tactics."

### UX job
The acquisition / first-screen experience should create self-recognition without requiring the user to learn product vocabulary.

---

## A1 → B — Activation / primary conscious job

### A1
The user knows they need to build authority or professional standing.

They usually have plausible candidate actions — content, profile work, networking, a podcast, talks, case studies, outreach, research, partnerships, a methodology, a website, etc. — but do not know which deserve scarce resources now or in what sequence.

Before the system advises, capture a **stated counterfactual plan**:

> "If this system did not exist, what would you actually do next?"

This creates the measurable before-state.

### B — Grounded Allocation Decision

The user can state, without facilitator interpretation:

1. what they want to become known for;
2. by whom;
3. what their current strategic gap is;
4. what they planned to do before the system;
5. what they will now `KEEP`, `ACCELERATE`, `REORDER`, `REDUCE`, `DELAY`, `STOP`, `REPLACE` or `ADD`;
6. which action receives resources first;
7. why that allocation changed or stayed the same;
8. what can happen in parallel;
9. what is blocked or premature;
10. what information could materially change the allocation again.

The **Authority Map remains the principal explanation/navigation artifact**, but the B-state is a decision and allocation state, not possession of an artifact.

---

## B → C — Execution

### B
The user has made a grounded allocation decision.

### C
The user actually allocates resources and performs the intended real-world authority-building action(s).

### UX job
Reduce the distance between allocation decision and execution without replacing judgment with engagement mechanics.

The product should preserve the difference between:

- intended revised allocation;
- actual allocation;
- action completion.

---

## C → D — Learning / retention

### C
A real allocation/action has occurred.

### D
The system incorporates relevant evidence or market response and updates the route/resource allocation when warranted; the user understands the change as learning rather than arbitrary inconsistency.

A prior `STOP` or `DELAY` decision may be reversed if new evidence justifies it.

This is a retention / compounding-value hypothesis, not the primary acquisition promise.

---

# Product hierarchy implied by the transitions

The experience should normally reveal value in this order:

```text
CONSCIOUS PAIN
"I need to build authority but don't know where to spend my effort first"
        ↓
COUNTERFACTUAL
"What would you do if this product did not exist?"
        ↓
PROMISE
"We will determine what deserves resources now — and what does not yet"
        ↓
FIRST VALUE
"Here is the allocation decision I would change, and why"
        ↓
MAP / EXPLANATION
"Here is the dependency logic behind that change"
        ↓
DEEP MECHANISM
field model + assets + diagnosis + provenance + opportunity cost
        ↓
COMPOUNDING VALUE
market evidence changes the route and allocation
```

Internal sophistication must not outrank the user's conscious pain or the allocation decision it exists to improve.

---

# UX evaluation lenses

Evaluate the experience primarily through these functional lenses:

1. **Trigger Fit** — does the user recognize the problem as theirs?
2. **Promise Legibility** — can the user explain what decision the product improves?
3. **Counterfactual Capture Quality** — can the product capture what the user would really have done without contaminating the baseline with advice?
4. **Diagnostic Efficiency** — does each requested input change a live allocation decision or useful capability?
5. **Personal Relevance** — can the user explain why the recommendation is specific to their state rather than a generic template?
6. **Strategic Orientation** — do they understand current state, target state and primary gap?
7. **Dependency Comprehension** — can they distinguish now / sequential / parallel / blocked / premature?
8. **Decision Compression** — can they identify the allocation decision and why it has priority?
9. **Resource Reallocation** — does the experience materially change time, money, attention or another scarce commitment?
10. **Trust & Inspectability** — can they distinguish source data, system inference and recommendation?
11. **Replanning Legibility** — after new evidence, does a changed allocation feel like justified learning rather than contradiction?

Visual polish is evaluated only insofar as it improves or damages one of these jobs, accessibility, usability or trust.

---

# Working field thresholds for the next low-fidelity / Wizard-of-Oz tests

These are preregistered experimental thresholds, not permanent doctrine.

For target users completing the comprehension flow without facilitator explanation:

- >= 80% can explain the product promise in their own words;
- >= 80% can recall the selected audience, primary gap and next allocation decision;
- >= 80% can explain why the next action has priority;
- >= 70% can correctly reconstruct sequential versus parallel work;
- >= 70% can distinguish `blocked` from `premature`;
- >= 80% can explain why the next requested data could change a decision;
- 0 users should need internal terms such as SWOT, EvidenceUnit, ProofMove or ontology to complete the core flow.

For personalized value tests, add action-level before/after evidence:

- baseline intended actions captured before recommendation;
- revised intended actions captured after recommendation;
- material changes classified as `KEEP / ACCELERATE / REORDER / REDUCE / DELAY / STOP / REPLACE / ADD`;
- time and cash deltas recorded separately when material;
- no "saved" claim made merely because work was stopped or delayed;
- later evidence can support, weaken or reverse the reallocation.

Do not average these into one vanity score.

---

# UI decision rule

For every meaningful UI element, ask:

> **Which transition — A0→A1, A1→B, B→C, or C→D — and which allocation decision is this element intended to improve?**

If it has no defensible answer and is not required for accessibility, safety, privacy or basic usability, it has no default claim to screen priority.

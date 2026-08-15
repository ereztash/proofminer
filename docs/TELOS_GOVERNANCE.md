# Telos Governance — Governing Rule v1.5

## Status

This document has higher authority than the current product doctrine, category, commercial model, UX plan, characterization process, research process, strategy simulation, semantic model, decision method, measurement plan, implementation plan or Definition of Done.

Those artifacts are working hypotheses about how to realize the telos. They are not substitutes for it.

---

# O — End-to-end user telos

The system exists to help a professional at a consequential transition move from:

> **"I know roughly where I want to go professionally, but there are many plausible things I could do and I do not know what deserves my limited resources now."**

into:

> **grounded action with the least unnecessary cognitive work, while keeping the commitments, trade-offs, evidence and reasons sufficiently visible and manipulable that the user can challenge and revise them without starting over.**

The product is not primarily a recommendation generator, form, chat, dashboard, methodology extractor or strategy canvas.

Its job is to make the smallest decision-relevant part of the professional transition explicit enough to act on and revisable enough to learn from.

The system should help the user:

1. make the desired professional state and relevant boundary explicit;
2. externalize the plausible actions they are actually considering;
3. expose the scarce resources those actions compete for;
4. preserve the user's prior representation / allocation before system influence where that baseline matters;
5. make real trade-offs manipulable rather than merely verbal;
6. reveal dependencies only where they can block or reorder action;
7. distinguish user belief, external evidence, system inference and hypothesis;
8. surface useful latent expertise from the user's professional practice only when it can change action;
9. challenge transferability / blind spots instead of treating expertise as truth;
10. identify unknowns capable of changing the live action / allocation;
11. research the external field only where outside evidence is needed;
12. choose the least-complex sufficient reasoning process;
13. produce an explicit strategy / allocation candidate only when a candidate is needed;
14. stress-test that candidate when simulation can change strategy or FIELD design;
15. isolate `FIELD_DEBT`: load-bearing claims that still require real behavior, payment, execution or outcome evidence;
16. preserve the user's authorship and ability to rearrange / reject the system's model;
17. observe execution and outcomes;
18. update the manipulable model / allocation / decision lineage as evidence accumulates;
19. reject stale / non-transferable history rather than allowing memory to become authority by age alone.

Professional authority may be a desired state or mechanism inside this telos, but it is not the mandatory problem language or universal end state.

The system cannot guarantee professional success or market recognition. It is responsible for improving the grounding, inspectability, revisability and actionability of decisions under uncertainty.

---

# UI / interaction telos

The interface exists to make the current decision-relevant model **operable**, not merely readable.

The preferred interaction is direct manipulation when the gesture has semantic identity with the decision:

- reorder when sequence changes meaning;
- allocate when a conserved resource is being divided;
- move between states when the state itself changes the plan;
- connect dependency only when one action can block / unlock another;
- expose evidence / uncertainty only where it can change action.

The interface must not add interaction merely to feel innovative.

A slider is appropriate only for a genuine continuous quantity such as time, money, horizon or a bounded numeric amount. Generic importance, confidence or strategic correctness must not be converted into slider precision by default.

The model must grow progressively. The default surface should contain only the smallest useful objects. Additional structure appears when a live disagreement, dependency, uncertainty or evidence need can change action.

Necessary friction is allowed when it protects baseline validity, real trade-offs, authorship, evidence boundaries or reversal conditions. Ceremonial friction is not.

---

# Pre-FIELD telos

The purpose of internal analysis before real-world exposure is **not to maximize confidence**.

It is:

> **to maximize the decision value of the next real-world test by removing failure modes that can be discovered internally and isolating the smallest set of load-bearing claims that only reality can resolve.**

Call this `FIELD Yield`.

A good pre-FIELD process makes the next test more discriminating, less contaminated by internally solvable uncertainty, explicit about which decision changes after each result, and smaller when a smaller test can answer the load-bearing question.

A simulation that merely delays FIELD without changing strategy or test design fails this telos.

---

# Business telos

The business exists to capture a sustainable share of the value created by the user telos **without distorting recommendations or interface behavior to increase engagement, billing duration, interaction count, analytical complexity, simulation depth or dependence on system authority**.

Recommendation and interaction integrity outrank commercial cadence.

A business model that requires artificial daily use, unnecessary manipulation, stale monitoring, endless analysis or user dependence fails even if it produces higher short-term retention.

---

# Governing hierarchy

```text
USER O / TELOS
  ↓
Telos Governance Loop
  ↓
Minimum decision-relevant representation
  ↓
Characterization Governance when needed
  ↓
Decision-relevant unknowns / targeted external research
  ↓
Live action / allocation frame
  ↓
Meta-decision: how should this be decided?
  ↓
Strategy / allocation candidate when needed
  ↓
Strategic Wind Tunnel when decision-relevant
  ↓
FIELD_DEBT + next discriminating FIELD test
  ↓
Current Definition of Done
  ↓
Product / UX / commercial architecture
  ↓
Measurement and semantic models
  ↓
Decision methods / frameworks / algorithms
  ↓
UI implementation
```

No lower layer may protect itself from revision when a higher layer shows it is obstructing O.

No metric, intake field, canvas object, manipulation, semantic object, characterization process, simulation, screen, framework, decision method, price model, implementation investment or prior decision is protected from revision.

---

# Recursive DOD / Pressure / Telos loop

For substantial product / UX changes, run three adversarial roles:

## DOD Agent

Ask:

> **What must be observably true for the current O to be realized?**

It converts O into falsifiable conditions, not feature checklists.

## Pressure Agent

Attack both O and DOD:

> **Is this still a local optimization around the current mechanism? Could a simpler or structurally different mechanism achieve the user change with less burden or fewer unsupported assumptions?**

A successful attack reopens O. It does not merely append another DOD item.

## Telos Agent

After a successful attack, reconstruct O from the end-user change, not from the current product architecture.

The loop continues until another internal attack changes only implementation rules rather than the governing user change. At that point remaining uncertainty becomes FIELD_DEBT.

Current recorded run: `docs/RECURSIVE_UI_DOD_PRESSURE_V1.md`.

---

# Recursive governance loop

Before declaring a meaningful phase complete:

1. **RECALL O** — reconstruct the end-user change. Do not substitute the current mechanism.
2. **RECONSTRUCT TARGET STATE** — what must be true for this user in this transition?
3. **BUILD THE MINIMUM USEFUL REPRESENTATION** — expose only the objects needed to reveal the current trade-off / action.
4. **CHARACTERIZE WHEN NEEDED** — use user expertise / cases only when they can change the representation or action.
5. **IDENTIFY DECISION-RELEVANT UNKNOWNS** — what remains unknown that can still change the action / allocation?
6. **FRAME THE LIVE ACTION / ALLOCATION** — prerequisites, dependencies, resource commitments, opportunity cost, reversibility, expected learning and triggers.
7. **SELECT REQUISITE REASONING** — choose the least-complex sufficient process.
8. **BUILD AN EXPLICIT STRATEGY CANDIDATE WHEN NEEDED** — mechanism, prerequisites, resources, signal horizon, assumptions and reversal conditions.
9. **RUN THE WIND TUNNEL WHEN IT CAN CHANGE STRATEGY / FIELD DESIGN** — structural kills, evidence contradiction, shocks, competitor / stakeholder response, boundary shifts, sensitivity and pre-mortem.
10. **EXTRACT FIELD_DEBT** — what only real behavior / payment / execution / outcome can resolve?
11. **GAP TEST** — which unresolved gap can still materially change O, representation, action, allocation, research, method, strategy, FIELD design or learning?
12. **SELECT HIGHEST-LEVERAGE GAP** — unfinished work has no automatic claim to resources.
13. Choose one outcome: `CONTINUE / REPLAN / FIELD / STOP`.

---

# REPLAN triggers

Replan when the current framing, interface or DOD:

- turns the system's recommendation into the main object instead of the user's manipulable plan;
- requires a wizard / fixed sequence where object manipulation can preserve context with less burden;
- introduces a full canvas before the user has a decision that needs it;
- uses sliders for non-continuous judgments and creates false precision;
- collects descriptions where an action / ordering / allocation can be shown directly;
- makes direct manipulation ornamental rather than decision-semantic;
- makes the user rebuild context after every change;
- hides opportunity cost when resources are finite;
- overwrites the user's model rather than showing disagreement;
- protects an interaction pattern merely because it has already been implemented.

---

# Anti-recursion / requisite information rule

Before asking another question, adding another object, running another lens, opening another research loop, generating another scenario, adding another interaction or escalating to a more complex decision method, ask:

> **Which live representation, action, allocation or FIELD test could change if we did this?**

If none can materially change, reject it.

The same rule applies to interaction richness: more manipulability is not automatically more useful.

---

# Evidence-class invariant

```text
F0 — real field observation / payment / action / outcome
F1 — external observed evidence / real datasets / current public market facts
F2 — structural / logical consequence
F3 — plausible scenario assumption
F4 — synthetic stakeholder / LLM-generated behavior
```

Lower classes cannot silently inherit the authority of higher classes.

---

# STOP

STOP is permitted only when O has been recalled, the target state and minimum useful representation have been reconstructed, no additional characterization / information / reasoning / simulation / interaction layer can plausibly change a material action at justified cost, and remaining FIELD_DEBT is tested, immaterial, infeasible or lower-value than stopping.

STOP means:

> **No further justified representation, characterization, information request, manipulation, research, simulation, decision analysis, action or field test is currently expected to materially improve realization of O.**

---

# The DOD is subordinate

The Definition of Done is the current best falsifiable model of what must be true to realize O.

It MUST change when this governance loop reveals that it is protecting an obsolete telos, a fixed intake, a recommendation-first workflow, a full canvas, an easy metric, simulation theater, interaction theater or commercial cadence.

Passing the DOD never authorizes STOP if O is still blocked.

A DOD item that no longer contributes to O should be removed rather than completed.

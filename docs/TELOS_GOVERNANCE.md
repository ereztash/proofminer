# Telos Governance — Governing Rule v1.1

## Status

This document has higher authority than the current product doctrine, UX plan, semantic model, implementation plan, measurement plan, or Definition of Done.

Those artifacts are working hypotheses about how to realize the telos. They are not allowed to become substitutes for it.

---

## O — End-to-end telos

The system exists to help a person move from:

> **"I want to become recognized as an authority in this domain."**

into an evidence-backed, strategically directed and continuously learning process that increases the likelihood that a chosen audience actually comes to perceive that person as a credible, differentiated authority — and acts accordingly.

Because the user has scarce time, money and attention, realizing O also requires improving how those resources are allocated: toward actions with the strongest grounded expected contribution to the desired authority state, and away from work that is currently blocked, premature or lower-leverage.

The system must do this by:

1. understanding the authority position the person wants to occupy;
2. identifying the audience whose perception matters;
3. reconstructing the person's real starting position from existing experience, assets, public footprint, relationships and past market response;
4. understanding the relevant field, alternatives, recognized authorities, audience needs and category expectations;
5. selecting or composing the strategic model best suited to the actual gap rather than forcing one universal framework;
6. producing a dependency-aware route from current state to desired state, distinguishing what is sequential, parallel, blocked and premature;
7. when a material decision is being made, reconstructing the user's stated counterfactual plan: what they would otherwise do and where they would otherwise spend scarce resources;
8. directing not only the next highest-leverage action, but also which plausible actions should be continued, accelerated, reordered, reduced, delayed, stopped or newly added;
9. converting latent experience, evidence and tacit methodology into usable authority assets when that serves the route;
10. observing market signals and business outcomes after actions are taken;
11. updating the route and resource allocation as evidence accumulates;
12. preserving provenance, uncertainty, privacy, opportunity-cost awareness and inference boundaries throughout.

The system cannot guarantee that the market will grant authority. It is responsible for producing and adapting the best grounded path available, improving allocation decisions under uncertainty, and distinguishing observed market response from causal claims.

---

# Governing hierarchy

```text
O / Telos
  ↓
Telos Governance Loop
  ↓
Current reconstruction of target state
  ↓
Current Definition of Done
  ↓
Product / UX architecture
  ↓
Measurement and semantic models
  ↓
Plans and frameworks
  ↓
UI / implementation
```

A lower layer may never veto a change required by a higher layer merely because work has already been completed there.

No metric, semantic field, screen, object model, framework, branch, implementation investment or prior decision is protected from revision if it prevents end-to-end realization of O.

---

# Recursive governance loop

The loop MUST run before declaring any meaningful phase complete.

## 1. RECALL O

Reconstruct the end-to-end change the system exists to produce.

Do not substitute the local task for O.

Examples of invalid substitutions:

- "finish the UX"
- "finish the dashboard"
- "complete the evidence graph"
- "maximize work avoided"
- "ship the Preview"
- "fill every DOD field"

These may be means or measurements. They are never the governing end.

## 2. RECONSTRUCT TARGET STATE

Ask from first principles:

> If O were realized as far as this product can responsibly realize it, what would have to be true for the user and in the system?

Reconstruct this state without assuming that the current architecture, metric, map or plan is correct.

For a resource-constrained user, the target state must include not only a route, but a defensible allocation decision: what receives resources now, what waits, what is rejected, and what evidence could change that allocation.

## 3. PLAN BACKWARD

Work backward from the reconstructed target state to the current state.

Identify dependencies, required information, candidate actions, opportunity costs, resource commitments, evidence and market feedback.

A prior plan has no special authority. Rebuild it when necessary.

## 4. GAP TEST

Compare the current state to the reconstructed target state.

A gap is blocking if resolving it could materially change any of:

- the user's path;
- the user's allocation of time, money, attention or other scarce capacity;
- the system's path;
- the required information;
- the strategic diagnosis;
- the dependency map;
- a continue / accelerate / reorder / reduce / delay / stop / add decision;
- the evidence or inference boundary;
- the next experiment;
- the ability to learn from market response;
- the ability to realize O end to end.

## 5. SELECT THE HIGHEST-LEVERAGE GAP

Do not continue merely because unfinished work exists.

Choose the actionable gap whose resolution is expected to increase end-to-end telos realization the most.

When two gaps compete, explicitly consider opportunity cost: working on one prevents using the same scarce resources elsewhere.

Elegance, completeness, taxonomy depth, metric availability and cosmetic polish do not justify work on their own.

## 6. CHOOSE ONE GOVERNANCE OUTCOME

### CONTINUE

Use when a material internal gap exists and can be resolved with available reasoning, research, design, data or implementation work.

### REPLAN

Use when the current architecture, model, framing, metric, sequence or plan itself prevents realization of O.

REPLAN explicitly authorizes moving backward and invalidating previously closed decisions.

### FIELD

Use when no further internal reasoning can responsibly resolve the blocking uncertainty and evidence from real users, market behavior, external systems or deployment is required.

FIELD is not failure and is not an excuse to keep refining internally.

It is the correct transition when reality has become the highest-value source of information.

### STOP

STOP is permitted only when all of the following are true:

1. O has been recalled explicitly;
2. the target state has been reconstructed from O rather than copied from the current plan;
3. a backward plan has been regenerated or revalidated;
4. no material internal gap remains whose resolution could improve end-to-end telos realization or materially improve resource allocation toward O;
5. no unresolved field uncertainty remains that is both material and feasible to test at the current stage;
6. remaining improvements are cosmetic, theoretical, duplicative or lower-value than stopping;
7. the current state is supported by the strongest evidence reasonably available for the current stage.

STOP never means "nothing could ever be improved." It means:

> **No further justified action or reallocation is available now that is expected to materially improve realization of O.**

---

# The DOD is subordinate

The Definition of Done is the current best model of what must be true to realize O.

It MUST be rewritten when the governance loop reveals that it is incomplete, overfitted to a prior solution, overfitted to an easy metric, or contains requirements that no longer serve O.

Therefore:

> **Passing the DOD does not authorize STOP if O is still blocked.**

And conversely:

> **A DOD item that no longer contributes to O may be removed rather than completed.**

---

# Anti-recursion and value-of-information rule

Recursive telos governance must not become infinite refinement.

A new iteration is justified only when it can change an end-to-end decision, behavior, resource allocation, requirement, dependency, evidence boundary, experiment, or field action.

Before requesting material new information or opening another research/refinement loop, ask:

> **Which live decision or resource allocation could change if we knew this?**

If no material decision can change, the information request has no default claim to resources.

If a proposed iteration only makes the model more elegant, more complete, more academically satisfying, more granular, easier to score, or more visually polished without changing one of those, reject the iteration.

---

# Required completion statement

Whenever a phase is declared complete, the responsible agent must record:

1. **O recalled:** the end-to-end telos used for the decision;
2. **Target state:** what had to be true;
3. **Highest-leverage gaps tested:** what could still have blocked O;
4. **Resource-allocation implication:** what should receive more, less or no further resources now;
5. **Outcome:** CONTINUE / REPLAN / FIELD / STOP;
6. **Evidence:** why that outcome is justified;
7. **Invalidated prior assumptions:** if any;
8. **Next action:** only if outcome is CONTINUE, REPLAN or FIELD.

A statement such as "the checklist is complete" or "the metric improved" is never sufficient.
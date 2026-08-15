# Telos Governance — Governing Rule v1.3

## Status

This document has higher authority than the current product doctrine, category, commercial model, UX plan, characterization process, semantic model, decision method, measurement plan, implementation plan or Definition of Done.

Those artifacts are working hypotheses about how to realize the telos. They are not substitutes for it.

---

# O — End-to-end user telos

The system exists to help a professional at a consequential transition move from:

> **"I know roughly where I want to go professionally, but there are many plausible things I could do and I do not know what deserves my limited resources now."**

into a grounded, contestable and continuously learning decision process that improves the likelihood of reaching the desired professional market position / opportunity state.

The system should help the user:

1. make the target professional state and relevant boundary explicit;
2. reconstruct what they currently believe about how to get there;
3. reconstruct what they would otherwise do and where scarce resources would otherwise go;
4. **discover the user's own professional operating model from real experience when that model may contain useful latent expertise;**
5. apply that model to the user's own professional / business system when useful;
6. challenge the transferability and blind spots of that self-application rather than treating expertise as automatic truth;
7. identify which unknowns are genuinely capable of changing the live decision;
8. research the external field only where outside evidence is needed;
9. frame the live decision before choosing how to decide it;
10. select the least-complex sufficient reasoning process;
11. compare plausible actions through constraints, dependencies, opportunity cost, reversibility, expected learning and expected contribution to O;
12. direct what to keep, accelerate, reorder, reduce, delay, stop, replace or add;
13. preserve the user's authorship and ability to contest the recommendation;
14. observe actual execution and real-world outcomes;
15. update the user's representation, route, resource allocation and reusable decision lineage as evidence accumulates;
16. reject stale / non-transferable history rather than allowing accumulated memory to become authority by age alone.

Professional authority may be a desired state or mechanism inside this telos, but it is not the mandatory problem language or the universal end state.

The system cannot guarantee professional success or market recognition. It is responsible for improving the quality, grounding, inspectability and adaptation of decisions under uncertainty.

---

# Business telos

The business exists to capture a sustainable share of the value created by the user telos **without distorting recommendations to increase engagement, billing duration, analytical complexity or dependence on system authority**.

Recommendation integrity outranks commercial cadence.

A business model that requires unnecessary decisions, artificial daily use, stale monitoring or user dependence fails even if it produces higher short-term retention.

---

# Governing hierarchy

```text
USER O / TELOS
  ↓
Telos Governance Loop
  ↓
Current reconstruction of target state / boundary
  ↓
Characterization Governance
  ↓
Decision-relevant unknowns / external research
  ↓
Live decision framing
  ↓
Meta-decision: how should this decision be decided?
  ↓
Current Definition of Done
  ↓
Product / UX / commercial architecture
  ↓
Measurement and semantic models
  ↓
Decision methods / frameworks / algorithms
  ↓
UI / implementation
```

`Characterization Governance` does not outrank O. It is a mechanism for discovering the representation / information required to serve O.

A lower layer may never veto a change required by a higher layer merely because work has already been completed there.

No metric, intake field, semantic object, characterization process, screen, framework, decision method, price model, library, branch, implementation investment or prior decision is protected from revision if it prevents end-to-end realization of O.

---

# Recursive governance loop

The loop MUST run before declaring any meaningful phase complete.

## 1. RECALL O

Reconstruct the end-to-end user change the system exists to produce.

Do not substitute the current mechanism for O.

Invalid substitutions include:

- "finish the authority map";
- "extract the user's methodology";
- "run self-application";
- "complete the research";
- "maximize allocation delta";
- "implement MCDA";
- "maximize retention";
- "finish onboarding";
- "fill every DOD field".

These may be useful means. None is the governing end.

## 2. RECONSTRUCT TARGET STATE

Ask from first principles:

> **If O were realized as far as this product can responsibly realize it, what would have to be true for this user in this transition?**

The target state should normally make explicit:

- desired professional outcome / market position;
- relevant audience / environment;
- boundary and horizon;
- user's current representation;
- plausible actions;
- scarce resources / constraints;
- current allocation decision;
- rationale and evidence;
- authorship / contestability;
- reversal / learning conditions.

Do not assume that the current professional lens, authority model, metric, framework or commercial plan is correct.

## 3. CHARACTERIZE BEFORE OVER-RESEARCHING

Before requesting broad data or running broad external research, ask:

> **Can the live uncertainty be resolved by extracting / applying knowledge already embedded in the user's real professional practice?**

When useful, use the smallest sufficient characterization process:

```text
real cases
→ professional operating model
→ self-application
→ boundary / competing-lens challenge
```

Do not use self-application when it cannot change a live representation or decision.

Do not treat the user's expertise as external corroboration merely because it is expert.

## 4. IDENTIFY DECISION-RELEVANT UNKNOWNS

After characterization ask:

> **What remains unknown that could still change the live decision?**

Only then allocate user effort or external research to those unknowns.

Every material question / search request should be able to identify its `decision_affected` or `representation_affected`.

## 5. PLAN BACKWARD

Work backward from the reconstructed target state to the current state.

Identify:

- prerequisites;
- dependencies;
- candidate actions;
- resource commitments;
- opportunity costs;
- reversibility / lock-in;
- expected learning;
- evidence and market feedback;
- decision / reversal triggers.

Before selecting a reasoning method, characterize the live decision sufficiently to answer whether a simple rule, dependency reasoning, marginal allocation, multi-criteria reasoning, targeted information, robust reasoning or adaptive pathway is actually needed.

Choose the least-complex sufficient process. A prior framework has no special authority.

## 6. GAP TEST

A gap is blocking when resolving it could materially change any of:

- target-state definition;
- project / decision boundary;
- user's representation;
- professional operating model used in the case;
- transferability judgment;
- external research required;
- live decision frame;
- alternatives;
- constraints / dependencies;
- reasoning method;
- resource allocation;
- evidence / inference boundary;
- execution;
- reversal condition;
- ability to learn from outcomes;
- commercial willingness to pay for the resulting value.

## 7. SELECT THE HIGHEST-LEVERAGE GAP

Do not continue merely because unfinished work exists.

Choose the actionable gap whose resolution is expected to improve end-to-end telos realization the most.

Consider opportunity cost across:

- user questions;
- internal analysis;
- external research;
- implementation;
- field tests;
- commercial experiments.

Analytical or characterization sophistication has no intrinsic value.

## 8. CHOOSE ONE GOVERNANCE OUTCOME

### CONTINUE

Use when a material internal gap exists and can be resolved now with available reasoning, research, design or implementation work.

### REPLAN

Use when the current telos interpretation, architecture, characterization process, model, framing, metric, sequence or commercial hypothesis itself prevents realization of O.

### FIELD

Use when reality is the highest-value remaining information source: real users, market behavior, execution, outcomes or real payment / refusal.

### STOP

STOP is permitted only when all are true:

1. O has been recalled explicitly;
2. the target state has been reconstructed from O rather than copied from the current plan;
3. the characterization need has been reconsidered rather than assumed complete;
4. no additional characterization process could plausibly change a material representation / decision at justified cost;
5. decision-relevant unknowns have been identified;
6. remaining external uncertainty is either immaterial or not currently worth testing;
7. the live decision has been framed sufficiently;
8. no simpler decision process would responsibly produce the same result at materially lower cost;
9. no additional analytical layer can plausibly change a material decision;
10. no material internal or field gap remains whose expected value justifies further work;
11. the current state is supported by the strongest evidence reasonably available for the stage.

STOP means:

> **No further justified characterization, information request, research, decision analysis, action or field test is currently expected to materially improve realization of O.**

---

# The DOD is subordinate

The Definition of Done is the current best model of what must be true to realize O.

It MUST change when the governance loop reveals that it is:

- tied to an obsolete telos;
- overfitted to authority as the only outcome;
- overfitted to a fixed intake;
- overfitted to a characterization technique;
- overfitted to an easy metric;
- protecting a commercial cadence rather than user value.

Passing the DOD does not authorize STOP if O is still blocked.

A DOD item that no longer contributes to O should be removed rather than completed.

---

# Anti-recursion / requisite information rule

Before asking another question, reconstructing another case, running another lens, opening another search loop or escalating to a more complex decision method, ask:

> **Which live representation, decision, allocation or field action could change if we did this?**

If none can materially change, reject the iteration.

The same rule applies to characterization itself: do not keep eliciting expertise merely because more tacit knowledge exists.

---

# 95% assurance boundary

Internal systems may strongly confirm/refute only claims they can directly observe or deterministically test in a defined scope.

Suitable structural claims include:

- advice preceded baseline capture;
- self-application was used without a source professional model;
- a professional rule was treated as transferable without transferability state;
- external research began without a decision-relevant unknown;
- a hard constraint was ignored;
- a method was invoked without its required preconditions;
- a prohibited metric influenced routing;
- a refuted assumption still feeds an active recommendation.

Internal agreement or expert self-description must not be upgraded into >95% strategic or causal truth without independent calibration / field evidence for that exact claim class.

---

# Required completion statement

Whenever a meaningful phase is declared complete, record:

1. **O recalled**;
2. **target state / boundary**;
3. **characterization process used or explicitly rejected, and why**;
4. **what representation changed / did not change**;
5. **decision-relevant unknowns remaining**;
6. **external research justified / rejected**;
7. **live decision frame**;
8. **decision-process justification**;
9. **highest-leverage gaps tested**;
10. **resource-allocation implication**;
11. **outcome:** CONTINUE / REPLAN / FIELD / STOP;
12. **evidence**;
13. **invalidated prior assumptions**;
14. **next action** only when justified.

"The intake is complete", "the user agreed", "the model produced a score", or "the research is comprehensive" is never sufficient.
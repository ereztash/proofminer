# Meta-Decision Governance — v1

## Authority

This document is subordinate only to `docs/TELOS_GOVERNANCE.md` and governs the choice of reasoning / decision method used to produce an allocation recommendation.

It exists because a decision method is itself a resource-consuming intervention. MCDA, optimization, Value of Information, robust scenario analysis, adaptive pathways, scoring, or a simple rule are not neutral tools. Each creates cognitive, data, implementation and explanation cost.

Therefore no decision method has default authority merely because it is available.

---

# Governing claim

> **Choose the least-complex decision process that is sufficient to resolve the live allocation decision responsibly.**

The product is not trying to maximize analytical sophistication.

It is trying to improve allocation toward O.

A more complex method is justified only when it can plausibly change a material allocation decision, expose a decision-relevant uncertainty, or prevent an error that a simpler method would miss.

This is the meta-decision analogue of the product STOP RULE.

---

# Research grounding

This contract is informed by established decision-analysis ideas rather than a ProofMiner-specific invention.

## Requisite decision modelling

Phillips defines a requisite model as one whose form and content are sufficient to solve the particular problem. Model development proceeds iteratively; sensitivity analysis is used while it continues to generate new insight, and modelling stops when further development no longer resolves material unease or changes the decision understanding.

This supports a sufficiency principle rather than a maximum-complexity principle.

Primary references:

- Phillips, L. D. (1984), *A theory of requisite decision models*, Acta Psychologica 56, 29–48. DOI: 10.1016/0001-6918(84)90005-2.
- Phillips, L. D. (2025), *Decision Analysis for Practitioners*, Decision Analysis 22(4), 255–272. DOI: 10.1287/deca.2025.0356.

## Decision Quality

Decision Quality treats framing, alternatives, information, values/trade-offs, sound reasoning and commitment as distinct links. It does not imply that every decision requires the same analytical technique.

## Value of Information

Additional information is justified when its expected reduction in decision loss can exceed the cost of obtaining it. More information is not intrinsically better.

## Dynamic Adaptive Policy Pathways

Under deep uncertainty, a single static optimal plan may be inappropriate. Adaptive planning instead uses short-term actions, pathways, signposts and triggers that determine when the plan should change.

---

# The meta-decision object

For every material allocation decision, construct a lightweight `DecisionProblemProfile` before selecting a method.

Minimum fields:

- `decision_statement` — what allocation decision is actually live now;
- `O_link` — how this decision could affect the project telos;
- `alternatives_state` — known / incomplete / must-generate;
- `objectives_state` — single dominant objective / multiple trade-offs;
- `hard_constraints[]` — prerequisites, budget, capacity, deadlines, privacy, legitimacy constraints;
- `dependency_state` — independent / sequential / networked;
- `uncertainty_type` — low / probabilistic-risk / deep-uncertainty;
- `reversibility` — cheap-to-reverse / costly / irreversible;
- `decision_horizon` — now / staged / long-lived;
- `information_gaps[]` — unknowns capable of changing the choice;
- `feedback_speed` — how quickly reality can return a useful signal;
- `stakes` — magnitude of downside / opportunity cost;
- `explanation_requirement` — how inspectable the recommendation must be;
- `current_baseline` — what the user would do without the system.

Do not ask the user for fields the system can infer or research reliably.

---

# Decision Policy Router

The router selects a reasoning mode from the DecisionProblemProfile.

It is not a universal score and not a fixed sequence of methods.

## R0 — Simple dominance / rule reasoning

Use when one alternative clearly dominates after hard constraints and O-link are considered.

Examples:

- an action is impossible because a prerequisite is absent;
- an action violates a non-negotiable constraint;
- one alternative has equal-or-better expected contribution at lower material cost and no important hidden trade-off.

**Rule:** if a simple dominance argument resolves the live decision, STOP method escalation.

## R1 — Constraint / dependency reasoning

Use when the central question is feasibility, prerequisites, scheduling, sequencing, capacity or lock-in.

Typical output:

- blocked / available;
- serial / parallel;
- earliest useful action;
- resource conflict;
- path dependency.

Do not invoke MCDA merely because several feasible actions exist if dependencies already determine the order.

## R2 — Marginal resource-allocation reasoning

Use when the problem is primarily how to move a finite resource from the current portfolio to a better portfolio.

Compare marginal expected contribution and opportunity cost relative to the baseline rather than scoring actions in isolation.

Typical output:

- KEEP / ACCELERATE / REORDER / REDUCE / DELAY / STOP / REPLACE / ADD.

## R3 — Multi-criteria trade-off reasoning

Use when multiple feasible alternatives remain and no single criterion legitimately dominates.

Possible techniques include structured MCDA, but the technique must fit the information/preferences available.

Required before use:

- criteria are decision-relevant and non-duplicative enough to be useful;
- trade-offs actually matter to the choice;
- weights/preferences are not fabricated;
- the recommendation is sensitivity-tested where material.

Do not use an elaborate MCDA method merely because the software supports it.

## R4 — Value-of-Information reasoning

Use when the decision is sensitive to an uncertainty that can be reduced before committing resources.

Ask:

1. Which live allocation decision could change?
2. What information would discriminate between the competing actions?
3. What is the cost / delay / user burden of getting it?
4. Is the expected decision value plausibly greater than that cost?

If not, act with current information.

## R5 — Robust / deep-uncertainty reasoning

Use when probabilities or forecasts are not defensible enough to optimize against one predicted future.

Prefer strategies that remain acceptable across plausible futures, expose vulnerabilities, and avoid brittle dependence on a single assumption.

Do not manufacture precise probabilities to make a familiar optimization method usable.

## R6 — Adaptive pathway reasoning

Use when:

- the decision unfolds over time;
- future information is expected;
- actions have path dependencies / lock-in;
- committing everything now is unnecessary.

Output must include:

- action now;
- options preserved;
- signposts to monitor;
- trigger condition(s);
- contingency / next-path action.

## R7 — Experiment / explore-exploit reasoning

Use only when feedback is repeated, reasonably fast, and experimentation costs are bounded enough that learning-by-doing is preferable to prolonged analysis.

This is not yet a production-authorized policy for ProofMiner. It remains a later-stage hypothesis.

---

# Router precedence

The router should normally test from cheapest / strongest discriminator upward:

```text
O / live decision
   ↓
hard constraints or dominance resolve it? ── yes → decide
   ↓ no
dependencies / capacity resolve order? ───── yes → decide
   ↓ no
is this primarily marginal reallocation? ─── yes → marginal reasoning
   ↓
multiple real trade-offs remain? ──────────── yes → multi-criteria reasoning
   ↓
would one missing fact change the choice? ─── yes → VOI / targeted information
   ↓
are forecasts too uncertain to optimize? ─── yes → robust reasoning
   ↓
does the problem unfold through future triggers? → adaptive pathway
```

This is a default search order, not a rigid ontology. Multiple modes may compose when each changes a material part of the decision.

---

# Requisite stop rule for reasoning

At every method escalation ask:

> **What material allocation decision could this additional analytical layer change?**

If the answer is none, STOP.

After a model or method is run, use sensitivity / adversarial checks to ask whether plausible changes in assumptions change the recommendation.

- If no plausible variation changes the recommendation, additional precision has low default value.
- If small plausible changes flip the recommendation, the uncertainty becomes decision-relevant and may justify VOI, a more robust policy, or a field experiment.

The system must be allowed to return:

> **The current decision does not justify a more sophisticated model.**

---

# 95% assurance boundary

The product must distinguish two categories of claims.

## A. Mechanism / structural claims

These can sometimes be confirmed or refuted with >95% confidence when the scope is finite and directly observable.

Examples:

- the counterfactual was captured before recommendation;
- a required hard constraint was represented;
- a router rule selected R4 because a specified decision-changing information gap existed;
- a recommendation was produced without a stated O-link;
- a refuted assumption still feeds an active recommendation;
- a map change has no recorded evidence trigger;
- an action classified `blocked` is nevertheless recommended as immediately executable.

These are appropriate targets for deterministic guards, contract tests, mutation tests and provenance checks.

## B. Strategic-truth / causal claims

Do **not** claim >95% confirmation from internal systems alone.

Examples:

- this is the strategically best action for this person;
- this allocation will create more authority;
- this audience will respond positively;
- the user's stated counterfactual is what they would truly have done;
- a market outcome was caused by one recommended action;
- MCDA / RDM / VOI was objectively the uniquely correct reasoning method.

These require field evidence and remain uncertainty-bearing claims.

---

# Reuse of existing behind-the-scenes systems

Existing systems should be reused only where they cross the 95% assurance boundary for the specific claim under test.

## 1. Deterministic guard pattern — USE

The existing `apply_guard` style is useful as a pattern for finite structural invariants.

Apply it to rules such as:

- no recommendation before baseline capture;
- no `STOP`/`DELAY` without rationale + O-link + dependency/opportunity-cost record;
- no method escalation without a recorded decision-changing reason;
- no field-sensitive claim without provenance state.

This layer can falsify implementation-policy violations with very high confidence when the rule and execution trace are directly inspectable.

It cannot prove strategic correctness.

## 2. Refutation propagation graph — USE

The refutation machinery is highly relevant when a load-bearing decision-policy assumption falls.

If a claim such as `method_selection_rule_X` is refuted, dependent routes, scoring logic, UI claims or recommendations should inherit a block / scope restriction rather than continue silently.

This is a structural assurance mechanism, not a truth oracle.

## 3. Evidence / decision pipeline — USE

Reuse the existing separation of source evidence, derived features, aggregate evidence and decision layer to preserve:

- observation vs inference;
- baseline vs recommendation;
- recommendation vs actual execution;
- actual execution vs outcome;
- outcome vs causal interpretation.

Drift/regression checks can detect pipeline changes that alter recommendations unexpectedly.

## 4. Competing-bottleneck / operational gates — PARTIAL USE

The existing Input Readiness, Competing Bottleneck, Execution Fit and Transferability patterns can become preconditions for a decision recommendation.

They are particularly useful for falsifying premature certainty.

However, model confidence scores, cross-model agreement or blind-review agreement must not be treated as >95% truth evidence unless independently calibrated for the exact claim class.

## 5. Blind reviewers / cross-model agreement — DO NOT COUNT AS >95% TRUTH

Agreement can test reproducibility, ambiguity or rubric quality.

It does not establish strategic truth. Multiple models can share the same bias or unsupported assumption.

Therefore this system may influence a claim only when the claim under test is about reproducibility / interpretation consistency, not about whether the recommendation is correct.

---

# Falsification requirements for the router

Before automating the router, construct decision fixtures where the intended reasoning mode is determined by a directly observable structural property.

Examples:

1. hard prerequisite absent → R1 must beat scoring;
2. one unknown can flip the decision and is cheap to acquire → R4 must be considered;
3. no defensible probabilities + many plausible futures → precise expected-value optimization must be rejected;
4. staged decision + observable future trigger → adaptive pathway must be considered;
5. simple dominance resolves choice → complex method escalation must be rejected.

Use mutation tests that deliberately remove or alter the key property and verify that the router changes accordingly.

A fixture should test the rule, not simulate evidence that the strategic recommendation will succeed in the market.

---

# Kill conditions

Revise or kill the meta-decision router if:

- a much simpler fixed reasoning process produces the same allocation decisions across materially different decision structures;
- router selection is unstable under irrelevant wording changes;
- method labels change but recommendations do not;
- the router adds data burden without changing decisions;
- sensitivity testing repeatedly shows that selected methods add no decision value;
- field users receive no additional decision value from adaptive method selection versus a simpler advisory process.

---

# Current status

**REPLAN → FIELD boundary.**

The internal architecture gap can be closed by making method selection explicit, requisite and falsifiable.

The next material uncertainty after structural fixture tests is empirical:

> **Does selecting the reasoning process from the decision structure produce materially better allocation decisions than a simpler fixed process?**

Do not build a full optimization/MCDA/VOI stack before that question survives FIELD.

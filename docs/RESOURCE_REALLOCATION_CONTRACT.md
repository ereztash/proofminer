# Resource Reallocation Contract — v1.1

## Authority

This document is subordinate to `docs/TELOS_GOVERNANCE.md` and complements `docs/UX_TRANSITION_CONTRACT.md` and `docs/COR_SYS_GRAPH_AUDIT_V1.md`.

It defines the current measurable value hypothesis created by the latest Telos Governance iterations.

---

# Core finding

A clear Authority Map is not sufficient evidence of product value.

The product creates material strategic value only when it improves how a user allocates scarce resources toward the authority telos **and the user can understand / contest the decision model that produced that allocation**.

The current value hypothesis is:

> **The system helps the user form a better-grounded representation of the authority problem and reallocate time, money and attention away from premature, blocked or lower-leverage authority work and toward actions with a stronger grounded expected contribution to O.**

This is broader and safer than "avoided wrong work".

Stopping work is not inherently valuable. A system may stop too much, stop too early, or discourage a useful experiment.

The product therefore receives no credit merely for issuing `STOP` or for producing a large allocation delta.

---

# Measurement primitive 1 — stated counterfactual plan

Before the system reveals a strategic recommendation, capture:

> **If this product did not exist, what would you actually do over the next relevant planning window to build this authority position?**

The default field-test horizon is 30 days unless the user's real decision horizon suggests another period.

For each intended action capture, as lightly as possible:

- action;
- intended order / priority;
- approximate time commitment;
- approximate cash commitment when material;
- other scarce commitment when material (e.g. social capital, attention, team capacity);
- why the user believes the action matters;
- confidence that this is the right action now;
- known dependency assumptions.

This is a **stated counterfactual**, not objective proof of what the user would certainly have done.

Do not silently upgrade it into causal evidence.

---

# Measurement primitive 2 — stated decision representation

Before advice, capture only the minimum useful representation of how the user currently thinks the route works.

Possible prompts:

- what do you think is the main thing preventing the authority position today?
- what do you believe must happen before something else can work?
- why do you think your planned actions should create authority?
- what evidence would make you change that view?

Do not turn this into a long questionnaire.

The purpose is to distinguish later between:

- changed allocation because the user's model changed;
- blind compliance with the system;
- wording-level agreement;
- durable learning.

Call the inspectable before/after change **Representation Delta**.

Representation Delta is not a scalar score.

---

# Post-recommendation allocation

After diagnosis and route recommendation, capture the revised plan using the same action-level representation.

Each baseline action may become:

- `KEEP` — remains materially unchanged;
- `ACCELERATE` — moves earlier / receives more resources;
- `REORDER` — remains, but its priority changes;
- `REDUCE` — receives fewer resources;
- `DELAY` — intentionally waits for a condition / prerequisite;
- `STOP` — removed from the current plan;
- `REPLACE` — displaced by another action;
- `ADD` — a materially new action appears.

The product should make the reason for a material change inspectable and contestable.

---

# Primary value evidence

Do not collapse all value into one score.

Track these separately.

## 1. Representation Delta

Did the participant's model of the problem, bottleneck, dependencies or change conditions materially change?

A copied explanation is not sufficient. The participant should be able to explain the changed assumption in their own words and identify what evidence could reverse it.

## 2. Decision Delta

Did the product materially change what the user intends to do?

A wording change is not a material Decision Delta.

## 3. Priority Delta

Which actions changed order, and why?

## 4. Resource Allocation Delta

How much planned resource moved between actions?

Track resource types separately, for example:

- hours;
- cash;
- team capacity;
- high-stakes relationship / reputation commitments.

Do not convert unlike resources into a universal composite without an explicit defensible conversion rule.

## 5. Premature-Work Reallocation

How much planned resource moved out of work the system judged premature or blocked?

Call this **reallocated**, not **saved**, until later evidence supports the judgment.

## 6. New-Leverage Allocation

How much planned resource moved into an action the user had not intended to perform or had materially underweighted?

## 7. Decision Authorship / Contestability

Can the participant:

- explain the criterion they are now using;
- disagree with the system without losing the route;
- identify an assumption they would challenge;
- state what evidence would change their mind;
- revise a constraint and understand why the allocation should change?

Acceptance is not authorship.

## 8. Recommendation Reversal / Regret

Did later evidence cause the system or user to reverse a prior reallocation because the recommendation was weak, premature, or wrong?

This is first-class negative evidence.

---

# Metric-governance status

`Counterfactual Resource Allocation Delta toward O` is an **evaluation construct**, not a product objective.

Until prospective field evidence establishes a defensible decision use:

```text
measurement_use: observational / evaluation
routing_use: prohibited
governance_use_as_optimization_target: prohibited
```

The system must not choose a recommendation because it creates a larger delta.

A large delta is not success.

A zero delta is not failure.

The allocation recommendation must be justified by O, constraints, evidence, opportunity cost and decision structure independently of the metric later used to describe the change.

---

# Decision quality versus outcome quality

The product must not judge a decision solely by the eventual market outcome.

Authority-building occurs under uncertainty. A well-grounded action can receive a weak market signal; a poor action can receive a lucky signal.

Therefore preserve four distinct evaluation layers:

## Representation evidence

What model did the user/system hold about the problem and what changed it?

## Process evidence

Was O explicit? Were alternatives considered? Were relevant constraints, evidence, opportunity costs, dependencies and uncertainty represented responsibly? Could the user contest the reasoning?

## Decision evidence

Did the user make a materially different allocation decision, understand why, and commit accordingly?

## Outcome evidence

What happened in the market after execution, and what did that evidence justify changing?

Outcome evidence updates the model. It does not retroactively make every lucky decision high quality or every unlucky decision low quality.

---

# The B state

`Decision-Ready Authority Map` remains a useful artifact, but it is not sufficient as the primary B-state.

The user-state transition is now:

```text
A1 — I know I need to build authority, I have plausible things I could do,
     but I do not know where my scarce resources should go first or which assumptions should govern that choice.

            ↓ system reconstructs O, state, field, boundaries, dependencies and alternatives

B — I have made a grounded, contestable resource-allocation decision:
     what to do now,
     what to increase,
     what to reduce,
     what to delay or stop,
     what to add,
     why,
     which prior assumption changed,
     and what evidence would make me change the decision again.
```

The Authority Map is the primary explanation / navigation artifact supporting B.

---

# Product magic-moment hypothesis

The strongest early magic moment is not necessarily a recommendation to do more.

It may be:

> **"You were about to invest in X. X is reasonable, but not yet. Y has to happen first, and here is the assumption that makes that true."**

or:

> **"You planned X, Y and Z because you assumed visibility was the bottleneck. The evidence suggests legitimacy is the bottleneck; moving resources from X to Z follows from that change in model."**

The product should be capable of creating value through `START`, `CONTINUE`, `REORDER`, `DELAY` and `STOP` — not only through adding work.

---

# Value-of-information rule

A request for more data is justified only when the expected decision value of the information can plausibly exceed its acquisition cost.

Operationally, before requesting material new data, the system should be able to state:

> **Which live allocation decision or decision representation could change if we knew this?**

If no material decision can change, the request should normally be rejected.

This applies the existing anti-refinement principle at user level.

---

# FIELD validation

The counterfactual plan and minimum decision representation must be captured **before** revealing the recommendation.

After reveal, capture the revised representation and revised plan before discussing whether the participant "likes" the result.

Then compare action by action and assumption by assumption.

At follow-up, capture:

- what was actually executed;
- actual resources spent when reasonably knowable;
- which planned actions were not executed;
- what market / authority signals appeared;
- what new evidence changed the user's representation;
- what new evidence changed the route;
- whether any prior resource reallocation was reversed.

The field test must preserve the difference between:

1. stated counterfactual representation;
2. stated counterfactual allocation;
3. revised representation;
4. revised intended allocation;
5. actual allocation;
6. observed outcome;
7. later learning.

---

# Kill conditions

This mechanism hypothesis should be revised or killed if field evidence shows that:

- personalized analysis rarely changes a material representation or allocation;
- users value clarity but still execute the same plan they already had;
- users follow recommendations but cannot explain or contest the governing criterion;
- changes are mostly cosmetic reorderings with negligible resource consequence;
- the system systematically over-stops or discourages productive experimentation;
- later evidence frequently reverses the system's reallocation recommendations;
- collecting the counterfactual plan/representation adds more friction than decision value;
- a simpler static advisory process creates comparable allocation improvement;
- optimization pressure toward larger allocation deltas degrades decision quality.

---

# Current evaluation construct

The current measurement family is:

> **Representation + Counterfactual Resource Allocation Delta toward O**

It is intentionally not one universal composite score and it has no routing authority.

It records what the user believed and would have allocated without the system versus what they believe and allocate after a grounded recommendation, followed by later evidence about whether both the representation and allocation should persist, reverse or change again.

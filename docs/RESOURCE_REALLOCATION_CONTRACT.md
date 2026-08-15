# Resource Reallocation Contract — v1

## Authority

This document is subordinate to `docs/TELOS_GOVERNANCE.md` and complements `docs/UX_TRANSITION_CONTRACT.md`.

It defines the current measurable value hypothesis created by the latest Telos Governance iteration.

---

# Core finding

A clear Authority Map is not sufficient evidence of product value.

The product creates material strategic value only when it improves how a user allocates scarce resources toward the authority telos.

The current value hypothesis is:

> **The system helps the user reallocate time, money and attention away from premature, blocked or lower-leverage authority work and toward actions with a better grounded expected contribution to O.**

This is broader and safer than "avoided wrong work".

Stopping work is not inherently valuable. A system may stop too much, stop too early, or discourage a useful experiment.

The product therefore receives no credit merely for issuing `STOP`.

---

# Measurement primitive: the stated counterfactual plan

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

The product should make the reason for a material change inspectable.

---

# Primary value evidence

Do not collapse all value into one score.

Track these separately.

## 1. Decision Delta

Did the product materially change what the user intends to do?

A wording change is not a material Decision Delta.

## 2. Priority Delta

Which actions changed order, and why?

## 3. Resource Allocation Delta

How much planned resource moved between actions?

Track resource types separately, for example:

- hours;
- cash;
- team capacity;
- high-stakes relationship / reputation commitments.

Do not convert unlike resources into a universal composite without an explicit defensible conversion rule.

## 4. Premature-Work Reallocation

How much planned resource moved out of work the system judged premature or blocked?

Call this **reallocated**, not **saved**, until later evidence supports the judgment.

## 5. New-Leverage Allocation

How much planned resource moved into an action the user had not intended to perform or had materially underweighted?

## 6. Recommendation Reversal / Regret

Did later evidence cause the system or user to reverse a prior reallocation because the recommendation was weak, premature, or wrong?

This is first-class negative evidence.

---

# Decision quality versus outcome quality

The product must not judge a decision solely by the eventual market outcome.

Authority-building occurs under uncertainty. A well-grounded action can receive a weak market signal; a poor action can receive a lucky signal.

Therefore preserve three distinct evaluation layers:

## Process evidence

Was O explicit? Were alternatives considered? Were relevant constraints, evidence, opportunity costs, dependencies and uncertainty represented responsibly?

## Decision evidence

Did the user make a materially different allocation decision, understand why, and commit accordingly?

## Outcome evidence

What happened in the market after execution, and what did that evidence justify changing?

Outcome evidence updates the model. It does not retroactively make every lucky decision high quality or every unlucky decision low quality.

---

# The new B state

`Decision-Ready Authority Map` remains a useful artifact, but it is no longer sufficient as the primary B-state.

The user-state transition is now:

```text
A1 — I know I need to build authority, I have plausible things I could do,
     but I do not know where my scarce resources should go first.

            ↓ system reconstructs O, state, field, dependencies and alternatives

B — I have made a grounded resource-allocation decision:
     what to do now,
     what to increase,
     what to reduce,
     what to delay or stop,
     what to add,
     and why.
```

The Authority Map is the primary explanation / navigation artifact supporting B.

---

# Product magic-moment hypothesis

The strongest early magic moment is not necessarily a recommendation to do more.

It may be:

> **"You were about to invest in X. X is reasonable, but not yet. Y has to happen first, and here is what that changes."**

or:

> **"You planned X, Y and Z. The evidence suggests Z is the bottleneck; moving resources from X to Z changes the route."**

The product should be capable of creating value through `START`, `CONTINUE`, `REORDER`, `DELAY` and `STOP` — not only through adding work.

---

# Value-of-information rule

A request for more data is justified only when the expected decision value of the information can plausibly exceed its acquisition cost.

Operationally, before requesting material new data, the system should be able to state:

> **Which live allocation decision could change if we knew this?**

If no material allocation decision can change, the request should normally be rejected.

This applies the existing anti-refinement principle at user level.

---

# FIELD validation

The counterfactual plan must be captured **before** revealing the recommendation.

After reveal, capture the revised plan before discussing whether the participant "likes" the result.

Then compare action by action.

At follow-up, capture:

- what was actually executed;
- actual resources spent when reasonably knowable;
- which planned actions were not executed;
- what market / authority signals appeared;
- what new evidence changed the route;
- whether any prior resource reallocation was reversed.

The field test must preserve the difference between:

1. stated counterfactual allocation;
2. intended revised allocation;
3. actual allocation;
4. observed outcome;
5. later learning.

---

# Kill conditions

This mechanism hypothesis should be revised or killed if field evidence shows that:

- personalized maps rarely change material resource allocation;
- users value clarity but still execute the same plan they already had;
- changes are mostly cosmetic reorderings with negligible resource consequence;
- the system systematically over-stops or discourages productive experimentation;
- later evidence frequently reverses the system's reallocation recommendations;
- collecting the counterfactual plan adds more friction than decision value;
- a simpler static advisory process creates comparable allocation improvement.

---

# Current North-Star candidate

Do **not** use `Avoided Wrong Work` as a standalone North Star.

The current candidate is the broader construct:

> **Counterfactual Resource Allocation Delta toward O**

It is not one universal scalar.

It is an action-level before/after record of what scarce resources the user would have allocated without the system versus what they allocate after a grounded recommendation, followed by later evidence about whether the reallocation should persist, reverse or change again.

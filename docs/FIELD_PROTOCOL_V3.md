# FIELD Protocol v3.3

## Purpose

This protocol exists to answer material uncertainties that internal reasoning can no longer resolve efficiently.

It separates four questions that must not be conflated:

1. **Does the target user recognize the problem immediately as relevant to them?**
2. **Can the target user understand the counterfactual → allocation-delta experience?**
3. **Does a genuinely personalized strategic analysis create material allocation value?**
4. **Does context-sensitive selection of the reasoning process create more decision value than a simpler fixed advisory process?**

A scripted low-fidelity prototype can test questions 1–2. It cannot validate questions 3–4 by pretending scripted recommendations are personalized intelligence.

---

# Governing rules

- Do not ask users to validate the architecture in abstract language.
- Do not explain what they were supposed to understand before observing their behavior.
- Do not treat compliments, founder agreement, "interesting", or visual preference as evidence that a transition succeeded.
- Do not let a polished UI rescue an unclear value mechanism.
- Do not infer strategic truth from model agreement or reviewer consensus.
- Preserve the 95% assurance boundary from `docs/META_DECISION_GOVERNANCE.md`.

---

# Wave 0 — Trigger / entry comprehension

Test whether the user recognizes the conscious problem before solution vocabulary appears.

Ask before interaction:

> **What problem do you think this product is trying to solve for someone like you?**

Then:

> **What do you expect it to change if it works?**

Repeated mismatch triggers `REPLAN`.

---

# Wave 1 — Counterfactual / allocation semantics

Current instrument:

`public/authority-prototype-v3-2.html`

It is scripted and low fidelity.

Its job is to test whether a participant understands:

```text
what I would have done without the product
→ what the system changed
→ where resources moved
→ why
→ what evidence should change the allocation again
```

Before any recommendation, capture a stated counterfactual action portfolio and material resource commitments.

Do not call reallocated resources "saved" at this stage.

Wave 1 does not validate strategic correctness.

---

# Wave 2 — Personalized Wizard-of-Oz allocation value

## Core rule

The counterfactual must be frozen **before** the participant sees the personalized recommendation.

For each participant capture:

1. desired authority position / association;
2. target audience / desired consequence where relevant;
3. actual planning horizon;
4. stated counterfactual actions;
5. intended order / priority;
6. material time / cash / other scarce commitments;
7. why the participant believes each action matters;
8. confidence in the baseline plan.

Then create the personalized analysis using person evidence, field evidence, constraints, dependencies, opportunity cost and uncertainty.

After reveal capture the revised allocation using:

`KEEP / ACCELERATE / REORDER / REDUCE / DELAY / STOP / REPLACE / ADD`.

Record what changed, why, and how much resource moved.

At follow-up capture actual execution, actual allocation where feasible, market evidence and recommendation reversal/regret.

---

# Wave 3 — Meta-decision discrimination

This wave tests the new claim introduced by `docs/META_DECISION_GOVERNANCE.md`:

> **Choosing the reasoning process from the structure of the live decision can create more decision value than applying one strong fixed process everywhere.**

Do not test this by asking whether the adaptive process "feels smarter".

## Comparison design

For the same or carefully matched decision case, produce two independent advisory outputs before revealing either to the participant:

### Arm F — fixed process

Use one predeclared strong fixed advisory process across cases.

It may include a consistent sequence such as:

- define goal;
- map current state;
- compare actions;
- recommend allocation.

Do not deliberately weaken it.

### Arm A — adaptive meta-decision

First construct a `DecisionProblemProfile`, then select the least-complex sufficient reasoning mode according to `META_DECISION_GOVERNANCE`.

Possible modes include:

- dominance / simple rule;
- dependency / constraint reasoning;
- marginal resource allocation;
- multi-criteria trade-off reasoning;
- Value of Information;
- robust/deep-uncertainty reasoning;
- adaptive pathway reasoning.

## Blindness rule

The participant should not be told which arm is more sophisticated or which one is the new product hypothesis before evaluating the decisions.

When feasible, the person preparing/scoring one arm should not use the other arm's conclusion as input.

## Primary comparison evidence

Compare arms on decision consequences, not prose quality:

- material Decision Delta relative to the participant's frozen baseline;
- action ordering / Priority Delta;
- Resource Allocation Delta;
- identification of a real blocked/premature action;
- discovery of a decision-changing information need;
- preservation of useful optionality / reversibility;
- participant's ability to explain the recommendation;
- actual execution at follow-up;
- later recommendation reversal/regret.

## Key falsification patterns

The adaptive meta-decision hypothesis weakens if:

- Arm A selects different method labels but produces essentially the same allocation as Arm F;
- Arm A asks for more data / time without materially changing the decision;
- Arm A creates greater apparent rigor but no additional decision value;
- method choice is unstable under irrelevant wording changes;
- Arm A overfits the case and produces more reversals/regret;
- Arm F repeatedly creates comparable or better allocation decisions at materially lower analytical/user cost.

The hypothesis strengthens when Arm A repeatedly catches decision-relevant structure that Arm F misses, such as:

- a hard dependency hidden by generic ranking;
- one cheap piece of information that should be gathered before committing;
- a need for robustness because precise probabilities are indefensible;
- a staged path/trigger that avoids premature irreversible commitment.

Do not claim >95% superiority from a small qualitative sample. This wave determines whether the hypothesis deserves more investment, not a universal statistical truth claim.

---

# 95% behind-the-scenes assurance layer

Use existing systems only for claim classes they can confirm/refute above the requested confidence threshold in a defined scope.

## Deterministic guard / contract pattern — eligible

Appropriate for claims such as:

- counterfactual captured before recommendation;
- `STOP` emitted without rationale / O-link;
- router mode invoked without required structural preconditions;
- method escalation occurred without a recorded decision-changing reason;
- blocked action recommended as immediately executable.

These are finite structural properties and can be tested with deterministic traces, contract tests and mutation fixtures.

## Refutation propagation — eligible

If a load-bearing policy claim is refuted, dependent recommendations / route rules / user-facing claims should inherit block or scope restriction.

Use this to prevent a fallen method-selection assumption from continuing silently.

## Evidence / decision pipeline — eligible

Use to preserve and test boundaries between:

- source observation;
- stated counterfactual;
- derived inference;
- recommendation;
- intended revised allocation;
- actual execution;
- observed outcome;
- causal interpretation.

## Blind reviewers / cross-model agreement — not eligible for strategic truth

They can test reproducibility, ambiguity and rubric quality.

They do not establish that an allocation recommendation or decision method is strategically correct with >95% confidence unless independently calibrated for that exact claim class.

---

# FIELD stop rule

After each wave re-run Telos Governance.

Continue only when another case can plausibly change the product decision.

Stop a wave when:

1. the live hypotheses have enough evidence to choose the next product action;
2. additional similar cases are no longer changing that action;
3. the next uncertainty requires a different test rather than more of the same.

Do not run additional participants to improve a vanity percentage.

---

# Required participant record

Capture:

- participant fit / context;
- test wave;
- planning horizon;
- frozen counterfactual;
- live decision frame;
- arm / reasoning mode when relevant;
- what changed intended allocation;
- resource delta;
- rejected/accepted recommendations and why;
- evidence or information that could reverse the decision;
- actual execution when followed up;
- market evidence;
- reversal/regret;
- whether the evidence changes the next product decision.

Do not reduce the session to satisfaction or sophistication scores.

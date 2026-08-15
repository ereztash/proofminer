# FIELD Protocol v3.4

## Purpose

This protocol exists to answer material uncertainties that internal reasoning can no longer resolve efficiently.

It separates five questions that must not be conflated:

1. **Does the target user recognize the problem immediately as relevant to them?**
2. **Can the target user understand the counterfactual → allocation-delta experience?**
3. **Does a genuinely personalized strategic analysis create material representation + allocation value?**
4. **Does the user understand, endorse and remain able to contest the governing decision logic rather than merely comply with it?**
5. **Does context-sensitive selection of the reasoning process create more decision value than a simpler fixed advisory process?**

A scripted low-fidelity prototype can test questions 1–2. It cannot validate questions 3–5 by pretending scripted recommendations are personalized intelligence.

---

# Governing rules

- Do not ask users to validate the architecture in abstract language.
- Do not explain what they were supposed to understand before observing their behavior.
- Do not treat compliments, founder agreement, "interesting", or visual preference as evidence that a transition succeeded.
- Do not let a polished UI rescue an unclear value mechanism.
- Do not infer strategic truth from model agreement or reviewer consensus.
- Preserve the 95% assurance boundary from `docs/META_DECISION_GOVERNANCE.md`.
- Preserve the graph-audit distinction between user acceptance and user authorship.
- `Counterfactual Resource Allocation Delta` is observational only; never optimize a recommendation for a larger delta.

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

Wave 1 does not validate strategic correctness, representation change or authorship.

---

# Wave 2 — Personalized Wizard-of-Oz representation + allocation value

## Core rule

The counterfactual plan and minimum decision representation must be frozen **before** the participant sees the personalized recommendation.

For each participant capture:

1. desired authority position / association;
2. target audience / desired consequence where relevant;
3. actual planning horizon;
4. stated counterfactual actions;
5. intended order / priority;
6. material time / cash / other scarce commitments;
7. why the participant believes each action matters;
8. confidence in the baseline plan;
9. current bottleneck hypothesis in their own words;
10. one or more dependency / causal assumptions when material;
11. what evidence they currently think should change their mind.

Then create the personalized analysis using person evidence, field evidence, explicit project/decision boundaries, constraints, dependencies, opportunity cost and uncertainty.

After reveal capture:

- revised representation: what they now think the bottleneck / dependency / mechanism is;
- revised allocation using `KEEP / ACCELERATE / REORDER / REDUCE / DELAY / STOP / REPLACE / ADD`;
- what changed and why;
- how much resource moved;
- which system assumption they reject or remain uncertain about.

At follow-up capture actual execution, actual allocation where feasible, market evidence and recommendation reversal/regret.

---

# Wave 2A — Authorship / contestability check

Do not infer authorship from agreement.

After the participant has seen the recommendation, ask without showing the system's explanation again:

> **What criterion are you using now to decide what gets resources first?**

> **Which part of the recommendation would you be most willing to challenge? Why?**

> **What evidence would make you reverse this decision?**

> **If one of your constraints changed, what would you expect the recommendation to do?**

Record whether the participant can:

- state the governing criterion in their own language;
- separate their goal from the system's recommendation;
- reject one recommendation coherently;
- identify a change condition;
- revise a constraint without losing orientation.

### Hollow-ownership failure

Record a failure when the participant can repeat the recommendation but cannot explain or contest the criterion that governs it.

A click on Accept / "sounds right" / verbatim recall is not evidence of self-authorship.

---

# Wave 2B — Multi-surface outcome capture

One real-world event may affect multiple authority surfaces.

Record the event once and link all affected contexts rather than duplicating the event.

For each meaningful event capture, where relevant:

- affected buyer / relationship;
- referral network;
- professional community;
- public/digital surface;
- organizational/internal surface;
- stage/media/intermediary surface.

Do not infer that one signal has the same meaning across all surfaces.

---

# Wave 3 — Meta-decision discrimination

This wave tests the claim introduced by `docs/META_DECISION_GOVERNANCE.md`:

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

- material Representation Delta relative to the participant's frozen baseline;
- material Decision Delta;
- action ordering / Priority Delta;
- Resource Allocation Delta;
- identification of a real blocked/premature action;
- discovery of a decision-changing information need;
- preservation of useful optionality / reversibility;
- participant's ability to explain and contest the recommendation;
- actual execution at follow-up;
- later recommendation reversal/regret.

## Router-collapse / discriminative-power test

Do not reward the adaptive arm for using more method labels.

Track:

- how often the functional decision bottleneck is actually known enough to select a method;
- how many method families are materially used;
- whether a different method family changed the next action / information request / allocation;
- whether the same result could have been produced by a simpler family.

If the router repeatedly collapses to a simpler process, collapse the architecture rather than protect the taxonomy.

## Key falsification patterns

The adaptive meta-decision hypothesis weakens if:

- Arm A selects different method labels but produces essentially the same representation/allocation as Arm F;
- Arm A asks for more data / time without materially changing the decision;
- Arm A creates greater apparent rigor but no additional decision value;
- method choice is unstable under irrelevant wording changes;
- Arm A overfits the case and produces more reversals/regret;
- the functional bottleneck remains unknown in most cases;
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
- recommendation emitted without explicit project/decision boundary;
- `STOP` emitted without rationale / O-link;
- router mode invoked without required structural preconditions;
- method escalation occurred without a recorded decision-changing reason;
- blocked action recommended as immediately executable;
- Allocation Delta used as a routing / optimization input while prohibited.

These are finite structural properties and can be tested with deterministic traces, contract tests and mutation fixtures.

## Refutation propagation — eligible

If a load-bearing policy claim is refuted, dependent recommendations / route rules / user-facing claims should inherit block or scope restriction.

Use this to prevent a fallen method-selection assumption from continuing silently.

ProofMiner does not yet implement a full claim-dependency registry. This is not required before the current Wizard-of-Oz FIELD, but becomes required before automated promotion of load-bearing strategic mechanisms.

## Evidence / decision pipeline — eligible

Use to preserve and test boundaries between:

- source observation;
- stated counterfactual representation;
- stated counterfactual allocation;
- derived inference;
- recommendation;
- revised representation;
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
- project/decision boundary;
- planning horizon;
- frozen counterfactual representation;
- frozen counterfactual allocation;
- live decision frame;
- arm / reasoning mode when relevant;
- revised representation;
- what changed intended allocation;
- resource delta;
- accepted/rejected recommendations and why;
- authorship / contestability evidence;
- evidence or information that could reverse the decision;
- actual execution when followed up;
- one event with all affected authority surfaces;
- market evidence by surface;
- reversal/regret;
- whether the evidence changes the next product decision.

Do not reduce the session to satisfaction, sophistication or delta scores.

# Strategic Wind Tunnel Governance — v1

Date: 2026-08-16

## Authority

This document is subordinate to `docs/TELOS_GOVERNANCE.md` and governs **pre-FIELD strategy stress testing**.

It complements:

- `docs/CHARACTERIZATION_GOVERNANCE_V1.md`;
- `docs/META_DECISION_GOVERNANCE.md`;
- `docs/FIELD_PROTOCOL_V3.md`;
- `skills/strategy-wind-tunnel/SKILL.md`.

---

# Telos of the Wind Tunnel

> **Increase the decision value of the next real-world FIELD exposure by removing internally discoverable failure modes and isolating the smallest set of load-bearing uncertainties that only reality can resolve.**

The Wind Tunnel does **not** exist to maximize confidence before FIELD.

It exists to make FIELD more discriminating.

A simulation that delays the real test without changing its design, strategy, or expected information value is waste.

---

# Why this layer exists

A field test can be expensive in:

- user time;
- reputation / social capital;
- cash;
- analyst effort;
- elapsed time;
- opportunity cost;
- scarce access to suitable participants.

Before spending that exposure, the system should eliminate failures that can already be discovered through:

- hard constraints;
- dependency analysis;
- current external evidence;
- counterfactual comparison;
- scenario stress testing;
- sensitivity / assumption mutation;
- adversarial reasoning.

The remaining uncertainty becomes `FIELD_DEBT`.

---

# Research grounding

## Strategic foresight / wind-tunnelling

OECD's Strategic Foresight Toolkit explicitly treats scenarios as hypothetical futures rather than predictions and uses them to challenge assumptions, stress-test strategies and develop actions that remain more resilient across possible conditions.

Relevant sources:

- OECD (2025), *Strategic Foresight Toolkit for Resilient Public Policy*: https://www.oecd.org/en/publications/foresight-toolkit-for-resilient-public-policy_bcdd9304-en.html
- OECD, *Building Anticipatory Capacity with Strategic Foresight in Government*: https://www.oecd.org/en/publications/building-anticipatory-capacity-with-strategic-foresight-in-government_d7eb0bb6-en.html
- MIT Science Impact, *Scenario Planning*: https://scienceimpact.mit.edu/labs/scenario-planning

This supports stress-testing / robustness as a pre-decision process. It does not imply that scenario outputs predict the market.

## Synthetic-agent limitation

Recent evaluations show that LLM agents can produce believable behavior while remaining poor proxies for real individual behavior.

A large 2026 ACL study evaluated prompt-based LLMs against 31,865 real online-shopping sessions and reported only 11.86% step-by-step human action accuracy for prompt-only models.

Other 2025 work reports persistent gaps in behavioral variability / adaptation and explicitly describes a `Behavior-Realism Gap` in language-agent simulation.

Relevant sources:

- Lu et al. (ACL 2026), *Can LLM Agents Simulate Multi-Turn Human Behavior? Evidence from Real Online Customer Behavior Data*: https://aclanthology.org/2026.acl-long.2034/
- Feng et al. (EMNLP 2025), *Noise, Adaptation, and Strategy: Assessing LLM Fidelity in Decision-Making*: https://aclanthology.org/2025.emnlp-main.391/
- Wang et al. (EMNLP 2025), *Implicit Behavioral Alignment of Language Agents in High-Stakes Crowd Simulations*: https://aclanthology.org/2025.emnlp-main.1562/

Therefore ProofMiner MUST NOT treat synthetic buyer / stakeholder behavior as FIELD evidence by default.

---

# Field-likeness ladder

The Wind Tunnel should maximize realism by moving **up the evidence ladder**, not by adding more agents.

```text
F0  actual field behavior / payment / outcome
↑
F1  current external observations / credible datasets / real public market evidence
↑
F2  structural constraints / dependencies / logical implications
↑
F3  plausible scenario assumptions
↑
F4  synthetic stakeholder / LLM-generated behavior
```

`F4` may reveal questions. It cannot override `F0/F1` or close a FIELD gate.

---

# The strategy object

The Wind Tunnel requires an explicit strategy candidate rather than a theme.

Minimum representation:

```text
StrategyCandidate
- O contribution
- target actor / environment
- mechanism hypothesis
- prerequisites
- actions / sequence
- resource commitment
- opportunity cost
- expected signal
- signal horizon
- reversibility / lock-in
- load-bearing assumptions
- stop / reversal conditions
```

If these cannot be expressed, route backward to Characterization / Strategy Framing.

---

# Required tests

Run only the material subset.

## 1. Structural kill test

Can the strategy fail without any uncertain human reaction because a prerequisite, resource, authority, sequence or boundary condition is missing?

## 2. Evidence contradiction test

Does current F0/F1 evidence already contradict a load-bearing assumption?

## 3. Scenario robustness test

How does the strategy behave under materially different plausible conditions?

## 4. Competitor / substitute response test

What happens if a rational alternative reacts, copies, undercuts, bundles, blocks access, or makes the proposed differentiation less scarce?

## 5. Stakeholder veto test

Which buyer / gatekeeper / partner criterion could make the strategy non-viable even if execution is correct?

## 6. Resource-shock test

Does the strategy survive lower capacity / higher cost / slower signal?

## 7. Mechanism-failure test

What if the action occurs but the assumed causal mechanism does not?

## 8. Sensitivity / assumption-flip test

Which small plausible assumption changes reverse the preferred choice?

## 9. Pre-mortem

Assume failure and identify only failure explanations that change current action, monitoring, or FIELD design.

---

# Synthetic stakeholder governance

Synthetic stakeholders are optional and late-stage.

They may be useful for:

- generating objections;
- discovering missing criteria;
- producing competitor counter-moves;
- testing whether a message is ambiguous;
- proposing failure modes;
- generating hypotheses for real interviews.

They are prohibited as direct evidence for:

- purchase intent;
- willingness to pay;
- conversion;
- actual execution;
- retention;
- causal market response;
- prevalence of a buyer objection;
- population segmentation.

Multiple agents agreeing does not upgrade the evidence class.

---

# FIELD_DEBT

Every Wind Tunnel pass must end with a `FIELD_DEBT` registry.

A field-debt item is a load-bearing claim for which:

1. the claim can change strategy / allocation;
2. internal reasoning has been exhausted to the point of diminishing decision value;
3. current external evidence is insufficient;
4. synthetic simulation cannot responsibly resolve it;
5. a feasible real-world observation could update the claim.

Example:

```text
claim: suitable buyer will pay $1,500 after experiencing the intervention
current evidence: adjacent service prices only
simulation limit: synthetic purchase intent is not behavioral evidence
field test: make exact offer to suitable participant after frozen-baseline intervention
strategy changed by: paid / refused + reason
```

---

# FIELD Yield

The purpose of the Wind Tunnel is not to minimize uncertainty to zero.

It should increase **FIELD Yield**:

> the amount of decision-changing evidence obtained from a scarce real-world test relative to the burden / exposure required.

Do not reduce FIELD Yield to a universal score.

Operational questions:

- Does the next test attack a load-bearing claim?
- Can the observation discriminate competing strategies?
- Are we testing something already knowable internally?
- Are several unrelated uncertainties contaminating the same test?
- What decision changes for each possible outcome?

A field test with no predeclared decision consequence fails even if it generates interesting feedback.

---

# Recursive routing

After each Wind Tunnel pass:

## RECHARACTERIZE

The simulated failure reveals that the person / problem / boundary is represented incorrectly.

## RESEARCH

A factual external uncertainty can be resolved cheaply before exposing a user / market.

## REPLAN

The strategy itself is brittle, circular, dominated, or relies on an invalid mechanism.

## FIELD

The remaining highest-value uncertainty requires real behavior / payment / execution / outcome.

## STOP

No internal or feasible external test can materially change the current strategy decision.

---

# Anti-recursion invariant

> **A Wind Tunnel pass is justified only if it can change the strategy or the next FIELD test.**

Do not add more scenarios, stakeholder agents, competitor personas or research sources merely to make the simulation feel realistic.

When the remaining uncertainty is genuinely behavioral, go to reality.

---

# 95% assurance boundary

The Wind Tunnel may support >95% confidence only for finite structural properties where the full relevant state is inspectable, for example:

- a strategy violates an explicit hard constraint;
- a required prerequisite is missing;
- the same scarce resource is double-booked;
- a FIELD test cannot discriminate the registered hypotheses;
- synthetic output was incorrectly promoted into F0/F1 evidence;
- a field-debt claim has no real observation capable of changing the decision.

It cannot internally establish >95% confidence that:

- a buyer will pay;
- a market will respond;
- a strategy will generate the intended professional outcome;
- a synthetic stakeholder represents the real population;
- a causal mechanism will hold in the field.

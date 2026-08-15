---
name: strategy-wind-tunnel
description: Stress-test a live strategy before consuming real FIELD exposure. Use evidence-grounded scenarios, assumption mutation, competitor/stakeholder response hypotheses, resource shocks and red-team analysis to eliminate internally resolvable failure modes and isolate FIELD-only uncertainty. Never treat synthetic personas or LLM agents as market evidence.
---

# Strategy Wind Tunnel

## Purpose

Increase the decision value of the **next real-world field exposure**.

The Wind Tunnel is not a replacement for FIELD. It exists to prevent wasting scarce user / market exposure on failures that could have been discovered internally and to isolate the smallest set of load-bearing claims that only reality can resolve.

Canonical outcome:

```text
strategy candidate
→ evidence grounding
→ structural stress tests
→ scenario / adversarial tests
→ synthetic stakeholder hypotheses (bounded)
→ sensitivity / assumption mutation
→ strategy revision
→ FIELD_DEBT
→ next discriminating FIELD test
```

If the remaining uncertainty is buyer behavior, willingness to pay, real execution, causal market response, or longitudinal outcome, return `FIELD` rather than simulating harder.

---

# Epistemic ladder

Every input / output claim MUST retain an evidence class.

## F0 — Real field observation

Examples:

- actual payment / refusal;
- real user action;
- real conversion / response;
- observed market outcome;
- actual interview quote;
- execution / follow-up behavior.

Highest field relevance. Preserve provenance and sampling limits.

## F1 — External observed evidence

Examples:

- current competitor pricing / product behavior;
- public buyer language;
- job postings / RFPs;
- public market behavior;
- credible research / datasets;
- observed comparable cases.

Useful grounding, but not direct evidence that the current target user will behave the same way.

## F2 — Structural / logical consequence

Examples:

- hard dependency;
- budget impossibility;
- time conflict;
- mutually exclusive actions;
- one event cannot precede its prerequisite;
- a test cannot discriminate two hypotheses if both predict the same outcome.

Can often support high-confidence structural falsification.

## F3 — Plausible scenario assumption

A deliberately hypothetical future / condition used for stress testing.

Never presented as prediction.

## F4 — Synthetic stakeholder / LLM behavior

A generated reaction from a role-conditioned agent.

**Hypothesis generator only.** It may expose objections, missing variables, possible counter-moves or wording ambiguity. It may not close a buyer / market / WTP / causal FIELD gate.

---

# Non-negotiable rule

> **Believability is not behavioral validity.**

Do not treat a convincing synthetic customer quote, simulated purchase decision, or multi-agent consensus as evidence that real users will behave that way.

Synthetic output can create a new hypothesis or test. It cannot validate the hypothesis it generated.

---

# Required input — StrategyCase

Minimum fields:

```text
O / user telos
strategy_decision
current_strategy
alternatives[]
boundary
resources / constraints
known_dependencies[]
frozen_baseline
load_bearing_assumptions[]
known_external_evidence[]
known_real_field_evidence[]
current_FIELD_questions[]
```

Optional:

```text
professional_operating_model
stakeholders[]
competitors[]
channels[]
current_offer / price
retention hypothesis
commercial model
history / prior outcomes
```

If the strategy decision itself is unclear, route backward to Characterization / Decision Framing before running the Wind Tunnel.

---

# Stage 0 — Recall O and protect baseline

State:

1. the end-to-end O;
2. what strategy / allocation would be chosen without this Wind Tunnel;
3. what evidence or simulated finding is allowed to change that choice.

Do not let the Wind Tunnel create value merely by producing more changes.

---

# Stage 1 — Evidence grounding

Build an `EvidencePacket` before synthetic simulation.

For every load-bearing assumption ask:

- What do we already observe?
- Is this internal / external / structural / hypothetical?
- Is there a cheap real source that can resolve it now?
- Which decision changes if it is false?

Prefer F0/F1/F2 evidence over F4 simulation.

If a web / connected-data lookup can cheaply resolve a load-bearing factual uncertainty, research it before simulation.

---

# Stage 2 — Strategy decomposition

Represent each candidate strategy as:

```text
StrategyCandidate
- intended contribution to O
- target actor / environment
- mechanism hypothesis
- required prerequisites
- resource commitments
- opportunity costs
- key assumptions
- expected signals
- time to signal
- reversibility / lock-in
- competitor / stakeholder dependencies
- stop / reversal conditions
```

Do not compare strategies as prose blobs.

---

# Stage 3 — Structural kill tests

Before scenarios, attempt deterministic / near-deterministic falsification.

Test at least the material subset of:

- missing prerequisite;
- resource infeasibility;
- sequencing contradiction;
- boundary / transferability mismatch;
- circular evidence;
- metric gaming;
- action that cannot produce the claimed signal;
- test design that cannot discriminate the competing hypotheses;
- strategy whose success requires an unowned resource / authority.

If one candidate is structurally blocked, mark it without needing synthetic stakeholders.

---

# Stage 4 — Scenario Wind Tunnel

Use scenario planning to test robustness, not to predict one future.

Minimum scenario families when material:

## S0 — Current/base case

Known environment continues approximately as observed.

## S1 — Resource shock

Less time / cash / attention / capacity than expected.

## S2 — Signal delay

The chosen action produces feedback much later or noisier than expected.

## S3 — Competitor / alternative response

A competitor, substitute, employer, platform or intermediary reacts rationally against the strategy.

## S4 — Stakeholder veto

A buyer / gatekeeper / partner / user rejects one key assumption or requires an unmodeled criterion.

## S5 — Boundary shift

Audience, professional target, channel, role, regulation, platform or market context changes enough to threaten transferability.

## S6 — Mechanism failure

The action executes as planned but the assumed mechanism does not produce the desired effect.

Do not run every scenario when it cannot change the strategy.

For each scenario record:

- assumption changed;
- candidate affected;
- consequence;
- strategy response;
- whether the action remains useful / becomes conditional / fails;
- evidence needed to know whether this scenario matters.

---

# Stage 5 — Adversarial stakeholder simulation

Only after grounding and structural/scenario testing, optionally run synthetic roles.

Useful roles may include:

- skeptical target buyer;
- economic buyer / budget owner;
- competitor / substitute;
- referral intermediary;
- execution operator;
- domain expert with a competing lens;
- critic trying to make the strategy fail.

Each role receives only the relevant EvidencePacket + explicit scenario conditions.

Required role output:

```text
observed evidence used[]
hypotheses / objections[]
missing information[]
possible response / counter-move[]
what real evidence would test this[]
confidence_class = synthetic_only
```

Never ask the synthetic role for a fake probability such as "how likely are you to buy?" unless it is used only as an internal prompt device and is discarded from evidence.

Do not average synthetic agents into a market score.

---

# Stage 6 — Assumption mutation / sensitivity

For each load-bearing assumption, deliberately mutate it across a plausible range or state set.

Ask:

> **At what change does the preferred strategy flip?**

Classify:

- `ROBUST` — plausible changes do not alter the core action;
- `CONDITIONAL` — action remains useful only under an explicit condition;
- `FRAGILE` — small plausible changes reverse the decision;
- `BLOCKED` — known constraint invalidates it;
- `FIELD_ONLY` — the load-bearing state cannot be resolved responsibly without reality.

Do not convert these labels into a composite score by default.

---

# Stage 7 — Counterstrategy / pre-mortem

Assume the strategy failed after the relevant horizon.

Generate the smallest set of materially distinct failure explanations.

For each:

- what would have to be true;
- whether current evidence already supports / contradicts it;
- earliest signpost;
- prevention / contingency action;
- whether prevention changes current allocation.

Reject failure stories that do not change action, monitoring or FIELD design.

---

# Stage 8 — Strategy revision

Produce a delta, not a new essay.

For each current action:

`KEEP / ACCELERATE / REORDER / REDUCE / DELAY / STOP / REPLACE / ADD`.

Also record:

- representation change;
- assumption invalidated;
- evidence class that caused the change;
- conditions under which the prior action returns.

---

# Stage 9 — FIELD_DEBT

This is the central output.

`FIELD_DEBT` is the set of load-bearing claims that remain unresolved **and cannot responsibly be closed by more internal reasoning / public research / structural simulation**.

Examples:

- will the buyer pay $1,500 after experiencing the decision intervention?
- will characterization-first produce a distinction a strong simple advisor misses for this person?
- will the user actually execute the revised allocation?
- will a specific market signal appear after execution?
- will prior lineage materially improve decision #2?

For every field-debt item record:

```text
claim
why load-bearing
current evidence
why simulation is insufficient
smallest real-world test
observable discriminating outcome
what decision changes after result
```

---

# Stage 10 — Next FIELD test

Design the smallest ethical real-world test that attacks the highest-value FIELD_DEBT item.

A valid test must:

- preserve pre-test baseline;
- create a discriminating observation;
- avoid testing several load-bearing claims unnecessarily at once when a smaller test exists;
- define what result changes product strategy;
- avoid vanity feedback / generic satisfaction as the primary endpoint.

---

# Recursive loop

After a Wind Tunnel pass choose exactly one:

## RECHARACTERIZE

The strategy failed because the person / system was represented incorrectly.

Route to Characterization Governance.

## RESEARCH

A load-bearing external factual uncertainty is cheap enough to resolve before FIELD.

Research it, update evidence, and rerun only the affected stages.

## REPLAN

The strategy / business model / architecture itself is brittle or contradictory.

Revise it and rerun the Wind Tunnel.

## FIELD

Only real human / market / execution / payment / outcome evidence can resolve the highest-value remaining uncertainty.

## STOP

No remaining justified internal stress test or feasible field test can materially change the current decision.

---

# Anti-recursion rule

At every additional scenario, agent, research query or failure story ask:

> **Which live strategy decision or FIELD test could this change?**

If none, stop.

The Wind Tunnel exists to reach FIELD **faster and with a better experiment**, not to replace FIELD with infinite simulated rigor.

---

# Required output

```text
O_RECALLED
BASELINE_STRATEGY
EVIDENCE_PACKET
STRATEGY_CANDIDATES
STRUCTURAL_FAILURES
SCENARIO_RESULTS
SYNTHETIC_HYPOTHESES
SENSITIVITY / ASSUMPTION_FLIPS
PREMORTEM_FAILURES
STRATEGY_DELTA
ROBUST_CORE
CONDITIONAL_MOVES
FIELD_DEBT
NEXT_FIELD_TEST
GOVERNANCE_OUTCOME
```

Always identify which conclusions came from F0/F1/F2 versus F3/F4.

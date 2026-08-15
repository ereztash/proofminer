# FIELD Protocol v3.2 — Trigger → Counterfactual → Allocation Delta

## Purpose

This protocol answers four material questions that must not be conflated:

1. **Does the target user recognize the problem immediately?**
2. **Can the target user state a usable counterfactual plan before advice?**
3. **Can the user understand the experience and the resulting allocation decision?**
4. **Does genuinely personalized analysis materially improve allocation of scarce resources toward O?**

A scripted low-fidelity prototype can test 1–3 structurally. It cannot validate 4 by pretending scripted recommendations are real intelligence.

---

# Governing rules

- Do not explain what the participant was supposed to understand before observing behavior.
- Do not reveal recommendations before the baseline counterfactual is captured.
- Do not suggest candidate baseline actions unless the participant truly cannot state any; if rescue occurs, mark the baseline contaminated.
- Do not treat compliments, "interesting", visual preference or map comprehension as sufficient value evidence.
- Do not call stopped/delayed work "saved" merely because the system recommended stopping it.
- Preserve decision quality separately from later outcome quality.

---

# Wave 0 — Trigger / entry comprehension

## Objective

Test whether the entry hierarchy reaches a consciously available pain:

> **"I need to build authority / professional standing, but I do not know where my limited effort should go first."**

Before clicking ask:

> **"What problem do you think this product is trying to solve for someone like you?"**

Then:

> **"What decision do you expect it to help you make?"**

Repeated interpretation as content generation, generic personal branding or a scorecard is a `REPLAN` signal.

---

# Wave 1 — Low-fidelity allocation comprehension

## Instrument requirement

The next low-fidelity instrument must implement:

```text
pain
→ authority direction / outcome
→ stated counterfactual plan
→ minimal evidence
→ diagnosis
→ allocation delta
→ Authority Map
→ next action
→ simulated re-plan
```

It should remain deliberately low fidelity.

## Participants

Initial falsification wave: **5 primary-ICP participants**.

This is not statistical inference. After the wave, run Telos Governance and continue only if another similar session can still change the next product decision.

---

## Task 1 — Trigger / promise

Capture verbatim:

- what problem the participant thinks this is for;
- what decision/change they expect.

## Task 2 — Authority direction / consequence

Participant states what they want to become known for and what they want that position to unlock.

## Task 3 — Counterfactual baseline — MUST precede advice

Ask:

> **"If this product did not exist, what would you actually do over the next 30 days to build that position?"**

Use another horizon if their real planning window differs.

Let them answer freely first.

For each material intended action, capture only as needed:

- action;
- priority / order;
- approximate hours;
- approximate cash;
- other material scarce commitment;
- why they think it matters;
- confidence it is right now.

Record whether any moderator prompt contaminated the baseline.

## Task 4 — Starting evidence

Participant chooses how the system should learn about them.

Ask after choice:

> **"Which decision do you expect this information to improve?"**

## Task 5 — Diagnosis / audience recommendation

Before accepting, ask participant to explain:

- what the system thinks is limiting them;
- who it recommends building authority with;
- which baseline-plan assumption is being challenged, if any.

## Task 6 — Allocation Delta

Show the system recommendation relative to the participant's baseline.

Ask:

> **"What changed between what you planned and what the system recommends now?"**

Classify every material action as:

- KEEP
- ACCELERATE
- REORDER
- REDUCE
- DELAY
- STOP
- REPLACE
- ADD

Capture time and cash deltas separately when meaningful.

## Task 7 — Authority Map

Without explanation ask participant to identify:

- what can start now;
- what follows a dependency;
- what can run in parallel;
- what is blocked;
- what is premature;
- what the allocation decision unlocks.

## Task 8 — Commitment

Ask:

> **"Given this, what would you actually do next, and what would you no longer spend time or money on yet?"**

This is intended revised allocation, not actual behavior.

## Task 9 — Data unlock

Ask:

> **"Would you provide this additional information? Which live decision could it change?"**

## Task 10 — Simulated re-plan

Introduce new evidence.

Ask:

> **"What allocation changed, and why? Does this feel like learning or arbitrary inconsistency?"**

---

# Wave 1 evidence

Track separately:

## Comprehension

- promise understood;
- baseline understood as "what I would otherwise do";
- allocation delta understood;
- map dependencies understood;
- observation / counterfactual / inference / recommendation distinguished.

## Decision Delta

Did intended action materially change?

## Resource Allocation Delta

How much intended time / cash / other capacity moved between actions?

Do not combine unlike resources into one universal score.

## Zero-delta cases

A zero delta is not automatically failure.

Possible interpretations:

- the user's original plan was already strong and the system correctly confirmed it;
- the personalized analysis is generic / adds no value;
- insufficient evidence was collected to challenge the plan.

The session record must classify which interpretation is supported.

---

# Wave 1 blocking failures

- counterfactual collected after advice or contaminated by suggestions;
- user cannot state what changed in their plan;
- map looks sophisticated but allocation is unchanged for generic reasons;
- system issues STOP/DELAY without defensible dependency/opportunity-cost rationale;
- user cannot distinguish "reallocated" from "saved";
- baseline and revised plan use incompatible units / horizons;
- repeated users understand the map but would do exactly the same work for the same reasons;
- map update feels arbitrary.

---

# Wave 1 exit decision

### REPLAN
Repeated evidence shows that the value mechanism, counterfactual capture, allocation semantics or hierarchy is wrong.

### CONTINUE
A low-cost instrumentation / comprehension repair remains.

### FIELD-2
The structure is understandable enough that the highest-value uncertainty is whether **personalized analysis creates real allocation value**.

---

# Wave 2 — Personalized Wizard-of-Oz allocation-value test

## Why Wizard-of-Oz

The strongest product hypothesis is adaptive strategic resource allocation, not automated report generation.

Do not build the full AI/data engine before proving that the resulting decision changes are valuable.

---

# Wave 2 session order

## Step 1 — Goal / constraints

Capture desired authority position, audience/outcome context and relevant planning horizon.

## Step 2 — Counterfactual baseline BEFORE analyst work is revealed

Capture the participant's actual intended plan and resource commitments using the same fields defined above.

Freeze the baseline before recommendation reveal.

## Step 3 — Behind-the-scenes personalized analysis

Using human/agent-assisted research, develop:

- PersonState;
- FieldModel;
- audience-path recommendation;
- strategic diagnosis;
- dependencies;
- opportunity costs;
- proposed allocation changes;
- provenance / uncertainty notes.

Do not force a change merely to demonstrate value.

## Step 4 — Reveal Allocation Delta first

Show, relative to the participant's own baseline:

- what stays;
- what moves earlier/later;
- what receives more/less resources;
- what stops;
- what is added;
- why.

Do not begin with a large dashboard.

## Step 5 — Reveal Authority Map as explanation

Ask participant which dependencies they reject and what evidence would change trust.

## Step 6 — Freeze revised intended allocation

Before satisfaction questions, record what the participant now intends to do and allocate.

## Step 7 — Execution follow-up

At the preregistered horizon capture:

- what was actually done;
- actual resources spent when reasonably knowable;
- which baseline actions were avoided/delayed;
- new actions executed;
- market/authority signals;
- participant corrections;
- whether the system now reverses or changes any prior allocation recommendation.

---

# Wave 2 evidence categories

## Discovery value
Did the analysis reveal a meaningful asset, gap, audience, dependency or opportunity the user had not recognized?

## Decision value
Did it materially change the intended action portfolio?

## Allocation value
Did time, cash or another scarce commitment move materially?

## Opportunity-cost value
Did the user understand what they would be giving up by funding one action rather than another?

## Dependency value
Did sequencing prevent or expose premature work?

## Trust value
Did provenance / uncertainty visibility affect willingness to follow the allocation recommendation?

## Execution value
Did intended reallocation become actual behavior?

## Learning value
Did later evidence improve, preserve or reverse the allocation in a way the user could understand?

## Negative evidence
Track recommendation regret / reversal explicitly.

---

# Decision quality versus outcome

Do not label a reallocation correct solely because a good outcome followed.

At follow-up assess separately:

1. quality of the decision process at the time;
2. whether the user committed to the revised allocation;
3. actual execution;
4. observed outcome;
5. what the outcome legitimately teaches.

A lucky signal does not certify a weak decision. A weak signal does not automatically invalidate a well-grounded decision under uncertainty.

---

# Competitive kill tests

Revise or kill the mechanism if FIELD shows:

- users understand the analysis but material allocation rarely changes;
- a strong static roadmap creates comparable allocation change;
- the system over-stops productive experimentation;
- counterfactual capture creates prohibitive friction;
- later evidence frequently reverses recommendations because the initial analysis was weak;
- users mainly value execution/ghostwriting rather than allocation guidance;
- dynamic reallocation feels unstable rather than intelligent.

---

# FIELD stop rule

Continue collecting participants only when another session can plausibly discriminate among live hypotheses or change the next product action.

Stop a wave when:

1. material hypotheses have enough behavioral evidence to choose the next action;
2. similar sessions no longer change that action;
3. the next uncertainty requires another test type.

Evidence saturation is relative to the decision, not an arbitrary N.

---

# Required participant record

Capture:

- participant fit / context;
- authority goal and planning horizon;
- verbatim problem / promise interpretation;
- **stated counterfactual action portfolio before advice**;
- counterfactual contamination flag;
- baseline time / cash / other material resources;
- system-recommended action-level deltas;
- revised intended allocation;
- actual allocation at follow-up;
- accepted / rejected recommendations and why;
- map misunderstandings;
- provenance use;
- market signals;
- recommendation reversals / regret;
- new product hypothesis;
- whether that hypothesis changes the next decision.

Do not reduce the session to satisfaction or one composite score.

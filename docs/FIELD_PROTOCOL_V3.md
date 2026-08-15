# FIELD Protocol v3

## Purpose

This protocol exists to answer the material uncertainties that internal reasoning can no longer resolve efficiently.

It explicitly separates two questions that must not be conflated:

1. **Can a target user understand and navigate the proposed experience?**
2. **Does a personalized strategic diagnosis/map create enough value and trust to justify the product?**

The scripted low-fidelity prototype can test the first question. It cannot, by itself, validate the second.

---

# Governing rule

Do not ask users to validate the architecture in abstract language.

Do not explain what they were "supposed" to understand before observing their behavior.

Do not treat compliments, founder agreement or visual preference as evidence of product value.

Record:

- wrong interpretations;
- hesitation;
- facilitator rescue;
- rejected recommendations;
- trust breakdowns;
- actions users expect but cannot find;
- information they refuse to provide;
- what they believe the product learned;
- what would make them return.

---

# Wave 1 — Experience comprehension

## Instrument

`public/authority-prototype-v3.html`

The instrument is intentionally low fidelity and scripted.

It contains three materially different user states:

- experienced expert with low public visibility;
- referral-driven consultant with existing private-market authority;
- professional entering an adjacent/new field with weak direct legitimacy.

It also deliberately includes:

- a case with three distinct audience paths;
- a case where one audience occupies more than one path role, so only two distinct choices are shown;
- available, parallel, blocked and premature map states;
- a simulated learning event that changes the route.

## Participants

Initial wave: **5 primary-ICP participants**.

The purpose of this number is not statistical inference. It is an early falsification wave small enough to run before visual investment.

After 5 participants, re-run Telos Governance.

Continue Wave 1 only if new sessions are still producing materially new blocking comprehension failures.

Do not continue merely to improve a percentage.

## Moderator rule

The moderator may say only:

> "Use this as if you were trying to understand what the system wants you to do. Say out loud what you think is happening."

Do not explain:

- Authority Project;
- Natural / Commercial / Fast paths;
- dependency maps;
- perceived identity;
- why a recommendation is supposed to be good.

If explanation is required, mark `FACILITATOR_RESCUE` before helping.

---

## Wave 1 tasks

### Task 1 — Entry

Participant opens the prototype.

Before clicking, ask:

> "What do you think this will help you do?"

Record their answer verbatim.

### Task 2 — Goal

Participant names/interprets the authority field and desired real-world consequence.

Observe whether "authority" is understood as a useful outcome or as vague personal-brand language.

### Task 3 — Starting data

Participant chooses how the system should learn about them.

Ask only after choice:

> "Why did you choose that? What do you expect the system to learn from it?"

### Task 4 — Audience path

Participant sees the recommendation.

Before allowing selection, ask:

> "What is the system recommending, and why?"

Observe whether path-role labels clarify or confuse.

### Task 5 — Strategic diagnosis

Ask:

> "What does the system think is your main problem right now?"

Then:

> "Which part here is a fact and which part is the system's interpretation?"

### Task 6 — Authority Map

Do not explain the map.

Ask participant to point to:

- what can start now;
- what can run in parallel;
- what is blocked;
- what is merely premature;
- what they believe will unlock next.

### Task 7 — Highest-leverage action

Ask:

> "What would you do next if you followed this product? Why that before something else?"

### Task 8 — Data unlock

Ask:

> "Would you give the system this additional information? Why / why not?"

Record whether the capability-unlock explanation changes willingness.

### Task 9 — Learning/re-plan

Apply the simulated new evidence.

Ask:

> "What changed? Does this feel like the system learned something, or like it changed its mind arbitrarily?"

---

# Wave 1 blocking failures

Any of the following is blocking if repeated or structurally caused:

- user cannot state the product's job without moderator explanation;
- user believes the product is primarily a content generator;
- user cannot explain why a target audience was recommended;
- user interprets path roles as fixed scoring categories rather than strategic alternatives;
- user cannot distinguish sequential/parallel/blocked/premature states;
- user cannot identify one dominant next action;
- user thinks system inference is source fact;
- user cannot explain why new data is requested;
- map update feels arbitrary because the causal/learning link is invisible;
- user experiences the project as a one-time report rather than a learning system.

One isolated wording confusion does not automatically trigger architecture REPLAN.

Look for mechanism-level failure.

---

# Wave 1 exit decision

After the initial wave, run Telos Governance.

Possible outcomes:

### REPLAN

Use when a repeated failure changes the required product action, user action, information hierarchy, map semantics, or learning mechanism.

### CONTINUE

Use when a correctable low-fidelity issue remains that can be repaired and re-tested cheaply.

### FIELD-2

Use when the experience is comprehensible enough that the highest-value uncertainty is now whether **personalized strategy is actually valuable**.

Do not go to polished UI merely because Wave 1 comprehension passes.

---

# Wave 2 — Personalized Wizard-of-Oz value test

## Why Wizard-of-Oz

The product's strongest hypothesis is adaptive strategic orchestration.

Building the full AI/data engine before testing whether users value its output would be premature.

Therefore the first personalized validation should simulate the future system with human/agent-assisted research while preserving the intended UX contract.

The participant should evaluate the **resulting strategic experience**, not whether the automation is already real.

---

## Participant input

For each participant, collect only information that has a decision-use justification.

Minimum candidate inputs:

1. desired authority field;
2. desired business/career consequence;
3. one or more existing public/professional sources (LinkedIn/CV/site) or guided interview;
4. how recent clients/opportunities arrived when relevant;
5. permission for public-footprint research if used.

Do not require a bulk archive.

---

## Behind-the-scenes preparation

For each participant, produce a temporary personalized model containing:

### Person state

- current assets;
- possible latent methodology;
- perceived-identity hypotheses;
- current authority surfaces;
- known distribution/relationships;
- meaningful evidence/capability gaps.

### Field state

- plausible audiences;
- recognized authorities / comparable journeys;
- category expectations;
- points of parity/difference;
- important channels/intermediaries.

### Audience path recommendation

Compare candidate paths using existing asset fit, market need, business/career potential and credible distance.

Do not force three distinct paths.

### Strategic diagnosis

Select the minimum useful lenses for the actual gap. Do not produce a framework catalogue.

### Dependency-aware map

Include:

- available now;
- serial prerequisites;
- parallel work;
- blocked actions;
- premature actions;
- highest-leverage next action;
- what new information would unlock.

### Provenance layer

For every material conclusion, keep a private operator note of:

- observed source;
- user report;
- external source;
- inference;
- recommendation;
- uncertainty.

This allows the user to challenge the recommendation without pretending automation already exists.

---

# Wave 2 session

## Step 1 — Prediction before reveal

Ask participant:

> "If a strong advisor looked at your situation, what do you expect they would tell you to do first?"

Record before showing the system recommendation.

This creates a baseline for whether the product produces non-obvious value.

## Step 2 — Reveal audience recommendation

Ask:

- What surprises you?
- What do you disagree with?
- What evidence would you need to trust this more?

Do not defend the recommendation immediately.

## Step 3 — Reveal diagnosis

Ask participant to restate it in their own words.

Then expose provenance/assumptions only if requested or after the first reaction.

## Step 4 — Reveal Authority Map

Ask participant to identify:

- what they would actually do next;
- what they would refuse to do;
- which dependency feels wrong;
- what is missing.

## Step 5 — Counterfactual

Ask:

> "If you did not have this system, what would you have done during the next two weeks?"

The product creates strategic value only if the map changes or sharpens action enough to matter.

## Step 6 — Data-unlock test

Offer one additional data request with an explicit capability unlock.

Measure willingness to provide it.

## Step 7 — Re-plan simulation

Introduce one plausible new market signal or participant correction.

Update the map.

Ask whether the change increases trust (learning) or reduces trust (instability).

---

# Wave 2 evidence categories

For each participant classify:

## Discovery value

Did the system surface a meaningful asset, methodology, audience or gap the user had not already recognized?

## Decision value

Did the system change, narrow or reorder what the user intends to do?

## Dependency value

Did serial/parallel/blocked reasoning prevent a premature or low-leverage action?

## Trust value

Did provenance/assumption visibility materially affect willingness to follow the recommendation?

## Compounding value

Did the participant understand why future evidence could make the project better rather than simply generate another report?

## Commercial signal

Would the participant choose to continue using the system when the next real authority decision occurs?

Do not use hypothetical willingness-to-pay as final commercial proof.

---

# Competitive kill tests in FIELD

The v3 mechanism should be revised or killed if the personalized sessions show:

### K1 — Fixed roadmap is enough

Users receive no meaningful additional value from adaptive dependencies/re-planning over a strong static/custom authority blueprint.

### K2 — Execution dominates strategy

Users understand the map but primarily want done-for-you content, PR or execution and do not value ongoing strategic orchestration.

### K3 — Dynamic route is not trusted

Users experience re-planning as inconsistency rather than evidence-sensitive learning.

### K4 — Market signals are too noisy

Outcome data does not allow useful future decisions to change without overclaiming causality.

### K5 — Methodology extraction is decorative

Users enjoy discovering a framework but it does not affect positioning, authority action or opportunity.

### K6 — Provenance is not decision-relevant

Inspectability creates complexity without materially improving trust or action.

---

# FIELD stop rule

Do not run an arbitrary large number of sessions.

After each completed wave, re-run Telos Governance.

Continue collecting participants only when another session can plausibly discriminate between live competing hypotheses or reveal a still-open blocking failure.

Stop the current wave when:

1. the currently material hypotheses have enough behavioral evidence to choose the next product action;
2. additional similar sessions are no longer changing that action;
3. the next uncertainty requires a different test rather than more of the same participants.

This is evidence saturation relative to the decision — not "we spoke to N people."

---

# Required session record

For every participant capture:

- participant fit / context;
- test wave;
- scenario or personalized project;
- verbatim first interpretation of product value;
- facilitator rescues;
- rejected/accepted recommendations and why;
- map misunderstandings;
- data refused/accepted and why;
- provenance use;
- what changed their intended action;
- response to re-planning;
- new product hypothesis created;
- whether that hypothesis changes the next decision.

Do not reduce the session to a satisfaction score.
# FIELD Protocol v3.1

## Purpose

This protocol exists to answer material uncertainties that internal reasoning can no longer resolve efficiently.

It separates three questions that must not be conflated:

1. **Does the target user recognize the problem immediately as relevant to them?**
2. **Can the target user understand and navigate the proposed experience to a Decision-Ready Authority Map?**
3. **Does a genuinely personalized strategic diagnosis/map create enough value and trust to justify the product?**

A scripted low-fidelity prototype can test questions 1–2. It cannot validate question 3 by pretending scripted recommendations are personalized intelligence.

---

# Current trigger + transition hypothesis

The working conscious trigger is:

> **"I know I need to build authority / professional standing, but I do not know what is actually right for me to do, or what should come first."**

The primary first-session transition is:

```text
A1 — authority need without a personalized route
→
B — Decision-Ready Authority Map
```

See `docs/UX_TRANSITION_CONTRACT.md` for the full A0→A1→B→C→D model and current experimental thresholds.

---

# Governing rules

- Do not ask users to validate the architecture in abstract language.
- Do not explain what they were supposed to understand before observing their behavior.
- Do not treat compliments, founder agreement, "interesting", or visual preference as evidence that the transition succeeded.
- Do not let a polished UI rescue an unclear product hierarchy during the first wave.

Record:

- first interpretation of the problem;
- first interpretation of the promise;
- wrong interpretations;
- hesitation;
- facilitator rescue;
- rejected recommendations;
- trust breakdowns;
- map misunderstandings;
- actions users expect but cannot find;
- information they refuse to provide;
- what they believe the product learned;
- what would make them return.

---

# Wave 0 — Trigger / entry comprehension

This wave is lightweight and precedes interpretation of the rest of the prototype.

## Objective

Test whether the entry hierarchy reaches the most consciously available pain before exposing the product model.

## Instrument requirement

The first screen must present:

```text
conscious pain
→ promise of a personalized route
→ primary action
```

before asking for the authority domain.

## Participant task

Open the experience and do not click yet.

Ask:

> **"What problem do you think this product is trying to solve for someone like you?"**

Then:

> **"What do you expect it to give you if it works?"**

Record verbatim before explaining anything.

## Blocking trigger failures

- participant believes the product is primarily a content generator;
- participant believes it only scores their current personal brand;
- participant cannot tell what uncertainty it is meant to reduce;
- participant understands the internal solution but cannot connect it to a pain they recognize;
- moderator must explain why the product would be useful.

One wording failure may be copy. Repeated conceptual mismatch is a `REPLAN` signal.

---

# Wave 1 — Experience comprehension / A1 → B

## Instrument

Use the latest low-fidelity conscious-pain-first prototype on the v3 branch.

It should remain deliberately low fidelity.

It should contain materially different user states, including:

- experienced expert with low public visibility;
- referral-driven consultant with existing private-market authority;
- professional entering an adjacent/new field with weak direct legitimacy.

Across scenarios the instrument must demonstrate that the system can vary:

- audience recommendation count when one audience dominates multiple roles;
- strategic diagnosis;
- data request;
- highest-leverage action;
- available / parallel / blocked / premature route states;
- route update after new evidence.

## Participants

Initial falsification wave: **5 primary-ICP participants**.

This is not a statistical sample claim. It is an early wave intended to reveal mechanism-level comprehension failures before visual investment.

After the initial wave, run Telos Governance.

Continue only if additional sessions can still discriminate among live competing hypotheses or reveal unresolved blocking failures.

---

## Moderator rule

The moderator may say only:

> **"Use this as if you were deciding whether it can help you understand what to do about your professional authority. Say out loud what you think is happening."**

Do not explain:

- Authority Project;
- Natural / Commercial / Fast path roles;
- dependency maps;
- perceived identity;
- why a recommendation is supposed to be correct.

If explanation is required, record `FACILITATOR_RESCUE` before helping.

---

# Wave 1 tasks

## Task 1 — Trigger + promise

Before interaction, capture:

- what problem the participant thinks this is for;
- what output / change they expect.

This is evaluated before asking them to provide an authority domain.

## Task 2 — Desired authority direction

Participant states what they want to become known for.

Observe whether the transition from pain → promise → input feels natural, or whether the authority question feels like the user has suddenly entered a different product.

## Task 3 — Desired real-world consequence

When asked, participant identifies what authority should unlock.

Observe whether this changes how they interpret the purpose of the route.

## Task 4 — Starting data

Participant chooses how the system should learn about them.

After choice ask:

> **"Why did you choose that? What do you expect it to let the system understand?"**

## Task 5 — Audience path

Before selection ask:

> **"What is the system recommending, and why?"**

Observe whether path-role labels clarify or create unnecessary taxonomy.

## Task 6 — Strategic diagnosis

Ask:

> **"What does the system think is the main thing limiting you right now?"**

Then:

> **"Which part here is observation and which part is interpretation?"**

## Task 7 — Authority Map

Without explanation ask participant to identify:

- what can start now;
- what must follow something else;
- what can run in parallel;
- what is blocked;
- what is merely premature;
- what they believe will unlock next.

## Task 8 — Highest-leverage action

Ask:

> **"If you followed this product, what exactly would you do next? Why that before something else?"**

## Task 9 — Data unlock

Ask:

> **"Would you give the system this additional information? What do you believe it would improve?"**

## Task 10 — Learning / re-plan

Apply simulated evidence and ask:

> **"What changed? Why did it change? Does this feel like learning or like the system changed its mind arbitrarily?"**

---

# Wave 1 measurable transition evidence

Current experimental thresholds for target users, without facilitator explanation:

- >=80% explain the product promise in their own words;
- >=80% recall selected audience, primary gap and next action;
- >=80% explain why the next action has priority;
- >=70% correctly reconstruct sequential versus parallel work;
- >=70% distinguish blocked versus premature;
- >=80% explain why the next requested data would be useful;
- 0 users need internal terminology such as SWOT, EvidenceUnit, ProofMove or ontology to complete the core flow.

These are decision thresholds for this experiment, not permanent doctrine.

Do not average them into one vanity UX score. A repeated blocking failure can trigger `REPLAN` even if an aggregate percentage looks good.

---

# Wave 1 blocking failures

Any repeated / structural version of the following is blocking:

- conscious pain is not recognized before solution vocabulary appears;
- promise is mistaken for content generation, generic personal branding or a static scorecard;
- user cannot state what decision uncertainty the system reduces;
- user cannot explain why the recommended audience is plausible;
- user cannot identify main strategic gap;
- user cannot distinguish sequential / parallel / blocked / premature;
- user cannot identify one dominant next action;
- user cannot explain why that action has priority;
- user confuses system inference with source truth;
- user cannot explain why new data is requested;
- map update feels arbitrary;
- user experiences the product only as a one-time report.

Look for mechanism-level failure, not isolated copy preference.

---

# Wave 1 exit decision

Run Telos Governance after the initial wave.

### REPLAN
Use when repeated evidence changes required user action, product action, information hierarchy, map semantics or learning mechanism.

### CONTINUE
Use when a low-cost repair remains and another similar test can discriminate whether the repair worked.

### FIELD-2
Use when trigger + A1→B comprehension are strong enough that the highest-value uncertainty becomes whether **personalized strategy creates material decision value**.

Do not jump to polished UI merely because participants like the concept.

---

# Wave 2 — Personalized Wizard-of-Oz value test

## Why Wizard-of-Oz

The central product hypothesis is adaptive strategic orchestration.

Building the complete AI / data system before testing whether people value the strategic result is premature.

The participant evaluates a personalized strategic experience produced with human/agent-assisted research while automation remains intentionally incomplete.

---

## Participant input

Collect only information with a decision-use justification.

Candidate minimum inputs:

1. desired authority field / association;
2. desired business or career consequence;
3. one or more existing professional/public sources or guided interview;
4. recent client / opportunity acquisition paths when relevant;
5. permission for public-footprint research when used.

Do not require bulk archives.

---

## Behind-the-scenes personalized model

For each participant create a temporary model containing:

### Person state
- current authority assets;
- latent methodology hypotheses;
- perceived-identity hypotheses;
- current authority surfaces;
- distribution / relationships;
- evidence / capability gaps.

### Field state
- plausible audiences;
- recognized authorities / comparable journeys;
- category expectations;
- points of parity / difference;
- important channels / intermediaries.

### Audience path recommendation
Compare existing-asset fit, market need, business/career value and credible distance. Do not force three paths.

### Strategic diagnosis
Use only the minimum useful lenses for the actual gap.

### Dependency-aware map
Include available now, serial prerequisites, parallel work, blocked, premature, highest-leverage action and useful data unlocks.

### Provenance layer
For every material conclusion keep operator notes distinguishing:

- observed source;
- user report;
- external source;
- inference;
- recommendation;
- uncertainty.

---

# Wave 2 session

## Step 1 — Baseline prediction

Before reveal ask:

> **"If a strong advisor looked at your situation, what do you expect they would tell you to do first?"**

This creates a baseline against which to judge non-obvious strategic value.

## Step 2 — Audience recommendation

Ask what surprises them, what they reject and what evidence would change trust.

Do not defend first.

## Step 3 — Diagnosis

Participant restates the diagnosis in their own words before provenance is opened.

## Step 4 — Authority Map

Participant identifies what they would actually do, refuse, reorder and challenge.

## Step 5 — Counterfactual

Ask:

> **"Without this system, what would you have done during the next two weeks?"**

Decision value exists when the system materially changes, narrows or reorders intended action.

## Step 6 — Data unlock

Offer one additional data request with an explicit capability unlock and measure willingness.

## Step 7 — Re-plan simulation

Introduce one plausible new market signal or participant correction, update the map and test whether the change increases perceived intelligence or decreases trust.

---

# Wave 2 evidence categories

## Discovery value
Did the system surface a useful asset, methodology, audience or gap the user had not already recognized?

## Decision value
Did it change, narrow or reorder intended action?

## Dependency value
Did sequencing prevent a premature / low-leverage move?

## Trust value
Did provenance or assumption visibility materially affect willingness to follow the route?

## Compounding value
Does the user understand why future evidence can improve the route rather than merely produce another report?

## Commercial signal
Would they choose to use the system again at the next real authority decision?

Do not treat hypothetical willingness to pay as final commercial proof.

---

# Competitive kill tests

Revise or kill the mechanism if FIELD shows:

- a high-quality fixed roadmap produces comparable decision value;
- users primarily value done-for-you execution rather than strategic orchestration;
- dynamic re-planning is experienced as inconsistency;
- market signals are too noisy to improve the route responsibly;
- latent methodology extraction is interesting but does not change action;
- recommendation provenance creates complexity without changing trust or decisions.

---

# FIELD stop rule

Do not run an arbitrary large number of sessions.

After each wave re-run Telos Governance.

Continue collecting participants only when another session can plausibly discriminate among live hypotheses or expose a still-open blocking failure.

Stop the current wave when:

1. material hypotheses have enough behavioral evidence to choose the next product action;
2. similar additional sessions no longer change that action;
3. the next uncertainty requires a different test rather than more of the same.

This is evidence saturation relative to the decision — not completion of an arbitrary N.

---

# Required participant record

Capture:

- participant fit / context;
- test wave;
- verbatim first interpretation of problem;
- verbatim first interpretation of promise;
- facilitator rescues;
- accepted/rejected recommendations and why;
- map misunderstandings;
- data accepted/refused and why;
- provenance use;
- what changed intended action;
- response to re-planning;
- new product hypothesis;
- whether that hypothesis changes the next decision.

Do not reduce the session to a satisfaction score.

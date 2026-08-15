# ProofMiner — Definition of Done v3.3

## Governing rule

This DOD is subordinate to `docs/TELOS_GOVERNANCE.md`.

It is the current best hypothesis about what must be true to realize O. It does not define O, and passing every gate does not authorize `STOP` if Telos Governance still finds a material end-to-end gap.

The measurable user-state transitions are defined in `docs/UX_TRANSITION_CONTRACT.md`.

The current resource-allocation value hypothesis is defined in `docs/RESOURCE_REALLOCATION_CONTRACT.md`.

---

# O recalled

The product exists to help a person move from wanting greater authority / professional standing in a domain to an evidence-backed, personalized and continuously learning strategic journey that increases the likelihood that the relevant audience actually perceives that person as a credible, differentiated authority and acts accordingly.

Because time, money and attention are scarce, the product must also improve which authority-building actions receive those resources, which wait, which stop, and which are newly discovered.

The system cannot guarantee that the market grants authority. It is responsible for producing, explaining and adapting the best grounded route and resource-allocation decision available under uncertainty.

---

# Current conscious-job hypothesis

The current ICP is expected to be most aware of this problem:

> **"I know I need to build authority / professional standing, but I do not know what is actually right for me to do, what should come first, or what I should stop wasting effort on."**

The primary first-session transition is now:

```text
A1 — authority need + plausible actions + uncertain allocation
→
B — grounded allocation decision supported by an Authority Map
```

`B` is not satisfied merely because a map exists.

The user must be able to explain, without facilitator interpretation:

- what they want to become known for;
- by whom;
- what they would have done without the system;
- what their main strategic gap is;
- what they will now keep / accelerate / reorder / reduce / delay / stop / replace / add;
- where scarce resources go first;
- why the allocation changed or remained the same;
- what can happen in parallel;
- what is blocked or premature;
- what information could materially change the allocation again.

---

# Product hierarchy invariant

The product should reveal value in this order:

```text
CONSCIOUS PAIN
→ AUTHORITY DIRECTION / OUTCOME
→ STATED COUNTERFACTUAL PLAN
→ MINIMAL DATA NEEDED TO CHALLENGE THAT PLAN
→ ALLOCATION DECISION
→ AUTHORITY MAP / EXPLANATION
→ EXECUTION
→ MARKET EVIDENCE
→ RE-ALLOCATION / LEARNING
```

Internal sophistication must not outrank the pain or decision the user already has.

A map is an explanatory/navigation artifact. It is not the value claim by itself.

---

# PHASE A — PRODUCT / UX ARCHITECTURE GATES

## A1 — Stable top-level unit

The persistent system unit is an `AuthorityProject`, not a post, score, ProofMove, DecisionMoment or session.

**Pass:** project scope, person-level memory, desired audience perception and intended real-world outcomes are clear.

## A2 — Trigger is explicit and falsifiable

**Pass:** the entry experience makes the target user recognize an authority/resource-allocation problem without teaching the internal product model.

## A3 — Counterfactual baseline exists before advice

Before recommendation, the product can capture what the user would otherwise do during the relevant planning window.

**Pass:** baseline actions, order and material resource commitments can be captured without contaminating the baseline with system advice.

The counterfactual is labeled as stated/self-reported, not causal truth.

## A4 — A1→B contract is an allocation transition

**Pass:** the first session can produce a material allocation decision, not merely information, content, a score or a map.

A material decision may be `KEEP`, `ACCELERATE`, `REORDER`, `REDUCE`, `DELAY`, `STOP`, `REPLACE` or `ADD`.

## A5 — Audience selection is assisted

The system compares routes using current authority capital, market need, commercial/career potential, competitive difficulty and credible distance.

**Pass:** it recommends when possible, does not fabricate options, and asks only discriminating questions that can change a material recommendation.

## A6 — Minimum useful knowledge acquisition

Every requested answer/source must change a live decision, resource allocation or useful capability.

**Pass:** if the system cannot answer "which allocation could change if we knew this?", the request is removed by default.

## A7 — Zero-data path

**Pass:** a user with no prepared files can begin productively through guided discovery/interview.

## A8 — Authority assets are broader than proof

The system can model evidence, methodology, experience, perspective, relationship/distribution and market-response assets.

**Pass:** real experience can become useful authority capital without being mislabeled as proof.

## A9 — Desired vs perceived authority remain distinct

**Pass:** what the user wants to be known for is not silently presented as what the market already believes.

## A10 — Field model is inspectable

**Pass:** audiences, recognized authorities, known-for associations, category expectations, differentiation opportunities, channels/intermediaries and comparable journeys can inform allocation while observation, public self-report and inference remain distinguishable.

## A11 — Strategic model follows the gap

**Pass:** different states justify different lenses; the user sees the decision-relevant conclusion before framework detail.

## A12 — Authority Map is a dependency graph

It distinguishes available now, sequential, parallel, blocked, premature, unlocks and highest-leverage action.

**Pass:** flattening it into an unordered checklist would remove material allocation meaning.

## A13 — Opportunity cost is visible when material

**Pass:** when recommending one action over another, the system can explain what the user is giving up or delaying by allocating resources there.

## A14 — One dominant allocation decision

**Pass:** at any primary state the user can answer, "Where should I put my next unit of meaningful effort, what should not receive it yet, and why?"

## A15 — Progressive disclosure

Default hierarchy: bottom line → allocation change → rationale → action → optional depth.

**Pass:** specialist vocabulary is never required for the core flow.

## A16 — UI elements have a transition/decision job

Each meaningful UI element supports `A0→A1`, `A1→B`, `B→C`, `C→D`, a live allocation decision, or accessibility/safety/privacy/basic usability.

**Pass:** elements without a defensible job have no default claim to screen priority.

## A17 — Gamification represents strategic resolution

**Pass:** progress corresponds to reduced uncertainty, a new usable asset/capability, an unlocked action, improved allocation or meaningful market evidence — not raw activity.

## A18 — Evidence/trust subsystem remains rigorous

**Pass:** provenance, contradiction, privacy and inference limits survive beneath authority claims. Self-report is not external validation and chronology is not causality.

## A19 — Learning reaches reality and returns

```text
counterfactual plan → allocation decision → actual allocation/action
→ market signal → learning → revised allocation
```

**Pass:** plausible new evidence can materially change a later allocation when warranted, including reversing a prior `DELAY` or `STOP`.

## A20 — Privacy/persistence are explicit

**Pass:** stored source truth, stated counterfactual, derived inference, correction, deletion, disclosure and consent are specified.

## A21 — Scenario falsification remains adaptive

At minimum test strong expert/low visibility, high visibility/weak depth, experience-to-new-authority transition, referral-driven authority and low-legitimacy field entry.

**Pass:** they produce meaningfully different diagnoses, allocation changes, data requests, maps and next actions.

## A22 — UX coherence

Blocking contradictions include:

- pain-first doctrine with solution-first entry;
- map-as-value language with no measured decision change;
- resource-allocation claim with no pre-advice baseline;
- "work saved" claims merely because the system stopped something;
- few choices with many equivalent CTAs;
- system-recommends doctrine with user-performs-diagnosis flow;
- persistent project with session reset;
- adaptive route with unexplained reallocation.

**Pass:** no known contradiction remains that changes user action, product action, required information, resource allocation, dependency structure or field experiment.

---

# PHASE B — LOW-FIDELITY FIELD GATES

The next instrument must supersede the current v3.1 comprehension-only flow by adding counterfactual allocation capture before recommendation.

It should remain intentionally low fidelity.

## B1 — Trigger recognition

Target user can explain what pain/decision the product is for.

## B2 — Counterfactual capture

Before advice, user can state what they would actually do during the planning window and approximately where material time/cash would go.

## B3 — Promise legibility

User understands that the product aims to improve what deserves resources now, not simply generate an authority plan.

## B4 — End-to-end A1→B flow

`pain → authority goal → counterfactual plan → minimal evidence → diagnosis → allocation delta → map → next action`.

## B5 — Allocation recall

After leaving the interface, user can state what changed in their plan and why.

## B6 — Dependency comprehension

User distinguishes sequential, parallel, blocked and premature states.

## B7 — Diagnostic efficiency

User understands why material data requests could change a live decision.

## B8 — Personal relevance

User can explain why the allocation change is specific to their state rather than a generic checklist.

## B9 — Trust / inspectability

User can distinguish observation, stated counterfactual, inference and recommendation.

## B10 — Replanning legibility

When new evidence changes allocation, user can explain why. Arbitrary-feeling change is a failure.

---

# Working thresholds for the next FIELD wave

These are experiment thresholds, not permanent doctrine:

- `>=80%` explain the product decision promise in their own words;
- `>=80%` can state the main allocation change after the session;
- `>=80%` explain why the highest-priority action has priority;
- `>=70%` reconstruct sequential versus parallel work;
- `>=70%` distinguish blocked versus premature;
- `>=80%` explain which decision the next requested data could change;
- `0` users require internal terminology such as SWOT, EvidenceUnit, ProofMove or ontology.

For personalized tests, every participant record must include:

- stated baseline action portfolio before reveal;
- revised action portfolio after reveal;
- action-level delta classification;
- time/cash deltas separately where material;
- actual allocation at follow-up where feasible;
- later evidence that supports, weakens or reverses the reallocation.

Do not average these into one vanity score.

Do not call reallocated resources "saved" until the judgment has survived later evidence strongly enough to justify that wording.

---

# PHASE C — FUNCTIONAL PRODUCT GATES

A functional product must eventually demonstrate:

1. real counterfactual-plan capture without recommendation contamination;
2. real data ingestion with provenance;
3. adaptive diagnosis across user states;
4. real dependency and allocation-state updates;
5. at least one real authority-asset transformation without fabricated facts;
6. real-world execution/export;
7. actual resource allocation tracking at a practical level;
8. market-signal return path;
9. later recommendations changing appropriately from new evidence;
10. reliability, recovery, security and prompt-injection resistance;
11. RTL/mobile/accessibility.

Feature completeness cannot compensate for failure to create material allocation value.

---

# PHASE D — BEHAVIORAL + COMMERCIAL VALIDATION

Ultimately demonstrate a chain such as:

1. target users recognize the trigger;
2. baseline intended allocation is captured;
3. personalized analysis produces a material, understandable allocation decision;
4. users actually reallocate resources and execute;
5. authority-relevant market signals appear and can be recorded responsibly;
6. later evidence improves or reverses subsequent allocation appropriately;
7. users return because ongoing reallocation/learning is useful;
8. some users pay for continuing strategic value.

Primary value evidence is not merely action completion.

Track separately:

- Decision Delta;
- Priority Delta;
- Resource Allocation Delta by resource type;
- Premature-Work Reallocation;
- New-Leverage Allocation;
- Recommendation Reversal / Regret;
- later authority / business signals.

Do not collapse these into one composite without explicit justification.

---

# GLOBAL TERMINATION RULE

At the end of every meaningful phase, run the full Telos Governance Loop.

Possible outcomes:

- `CONTINUE` — a material internal gap remains and is resolvable now;
- `REPLAN` — current framing / architecture / metric / hierarchy itself blocks O;
- `FIELD` — reality is now the highest-value source of information;
- `STOP` — no further justified action or reallocation is currently expected to materially improve O.

A checklist or improved metric cannot authorize `STOP`.

---

# Current closeout — 2026-08-15, resource-allocation iteration

**O recalled**  
Increase the likelihood that the relevant market grants the desired authority position and acts accordingly, while allocating scarce user resources toward the strongest grounded path under uncertainty.

**Material finding**  
`Decision-Ready Authority Map` was an artifact-level B-state. It could pass even when the user would have executed exactly the same plan without the product. Therefore it did not prove additive value.

**Highest-leverage unmeasured primitive**  
The user's **stated counterfactual resource allocation before advice**.

Without it, the product cannot measure whether it changed a decision, prevented premature work, discovered a higher-leverage action, or merely explained an existing plan.

**Invalidated assumption**  
`Avoided Wrong Work` is not sufficient as a North Star because stopping is not inherently good and can be premature. The broader construct is `Counterfactual Resource Allocation Delta toward O`.

**Governance action taken**  
`REPLAN` opened for activation value and measurement.

Updated:

- Telos Governance to make resource allocation and opportunity cost explicit;
- Resource Reallocation Contract created;
- UX transition B-state changed from map possession to grounded allocation decision;
- DOD gates changed to require pre-advice counterfactual and post-advice allocation delta.

**Remaining highest-leverage internal gap**  
The FIELD instrument and protocol must capture the counterfactual **before** recommendation and compare it with the revised plan. Until that instrument exists, returning to FIELD would test the old value hypothesis.

**Current governance outcome:** `CONTINUE`.

**Next justified action:** update FIELD protocol / first-session instrument to measure baseline → allocation delta → later validation. Do not invest in UI polish.

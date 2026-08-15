# ProofMiner — Definition of Done v3.5

## Governing rule

This DOD is subordinate to `docs/TELOS_GOVERNANCE.md`.

It is the current best hypothesis about what must be true to realize O. It does not define O, and passing every gate does not authorize `STOP` if Telos Governance still finds a material end-to-end gap.

Use together with:

- `docs/META_DECISION_GOVERNANCE.md`
- `docs/UX_TRANSITION_CONTRACT.md`
- `docs/RESOURCE_REALLOCATION_CONTRACT.md`
- `docs/FIELD_PROTOCOL_V3.md`

---

# O recalled

The product exists to increase the likelihood that a relevant audience comes to perceive the user as a credible, differentiated authority in the desired domain and acts accordingly.

Because the user has scarce time, money and attention, the system must improve how those resources are allocated toward that end under uncertainty.

The system must also avoid spending user/system resources on analytical machinery that does not improve the live decision.

The system cannot guarantee authority. It is responsible for producing, explaining and adapting the best grounded allocation/route available and for learning responsibly from market evidence.

---

# Primary first-session transition

```text
A1 — authority need + plausible actions + uncertain allocation
→
B — grounded allocation decision supported by the least-complex sufficient reasoning process and an Authority Map
```

`B` is not "the user received a map" and not "the system ran an advanced framework".

The user should be able to state:

- what they want to become known for and by whom;
- what they would have done without the product;
- what main gap was found;
- what they will now `KEEP / ACCELERATE / REORDER / REDUCE / DELAY / STOP / REPLACE / ADD`;
- where scarce resources go first;
- why;
- what is parallel, blocked or premature;
- what information/evidence could change the allocation again.

The system should be able to state:

- what decision was actually live;
- why the selected reasoning process was sufficient;
- why a simpler method was insufficient, if escalation occurred;
- why a more complex method was not justified, if escalation stopped.

---

# Product hierarchy invariant

```text
CONSCIOUS PAIN
→ AUTHORITY DIRECTION / OUTCOME
→ STATED COUNTERFACTUAL PLAN
→ LIVE DECISION FRAME
→ MINIMUM DECISION-RELEVANT DATA
→ DECIDE HOW TO DECIDE
→ DIAGNOSIS / ALLOCATION DELTA
→ AUTHORITY MAP
→ EXECUTION
→ MARKET EVIDENCE
→ RE-ALLOCATION / METHOD UPDATE IF NEEDED
```

A lower-level model, metric, framework, algorithm, library or UI element may not outrank this transition.

---

# PHASE A — PRODUCT / DECISION / UX ARCHITECTURE GATES

## A1 — Stable project unit

`AuthorityProject` remains the persistent top-level project context.

## A2 — Trigger is falsifiable

The ICP should recognize an authority/resource-allocation problem without learning product vocabulary first.

## A3 — Counterfactual is captured before advice

The system can record what the user says they would otherwise do during the relevant horizon, including order and material time/cash commitments when useful.

The counterfactual is labeled as stated/self-reported, not causal truth.

## A4 — Live decision is framed before method selection

Before invoking a decision framework, the system records the specific allocation decision being made and its link to O.

**Fail:** running MCDA, optimization, VOI, robust analysis or another framework before the live decision is explicit.

## A5 — DecisionProblemProfile is sufficient

The system can characterize at least the decision-relevant subset of:

- alternatives state;
- objectives / trade-offs;
- hard constraints;
- dependencies;
- uncertainty type;
- reversibility / lock-in;
- information gaps;
- feedback speed;
- stakes / opportunity cost;
- decision horizon.

Do not require every field when a simpler discriminator already resolves method choice.

## A6 — Requisite method selection

The system chooses the least-complex reasoning process sufficient to resolve the live decision responsibly.

**Pass:** method escalation has an explicit decision-changing justification.

**Hard fail:** method escalation exists only because the method is available, prestigious, technically interesting or easier to score.

## A7 — Simple dominance / hard constraints can terminate escalation

If hard constraints, prerequisites or clear dominance resolve the decision, the system can decide without invoking a more complex trade-off model.

## A8 — Dependency reasoning precedes unnecessary scoring

If sequence / feasibility / capacity determines what can happen now, the system does not hide that fact inside a weighted score.

## A9 — Material allocation change is representable

The product can represent `KEEP / ACCELERATE / REORDER / REDUCE / DELAY / STOP / REPLACE / ADD` at action level.

Stopping is not automatically valuable.

## A10 — Opportunity cost is decision-relevant

When recommending one action over another, the system can explain what is displaced, delayed or forgone when material.

## A11 — Data requests have value-of-information logic

Before requesting material new information, the system can answer:

> **Which live allocation decision could change if we knew this?**

If none, the request has no default claim to user effort.

If an unknown can flip the decision and is reasonably obtainable, the system can choose targeted information gathering instead of false certainty.

## A12 — Multi-criteria reasoning has preconditions

When multiple feasible alternatives remain with genuine conflicting objectives, the system may use MCDA-like reasoning.

**Pass:** relevant criteria/trade-offs are explicit, preferences are not fabricated, and material sensitivity is inspectable.

**Fail:** criteria are added merely to make the decision look rigorous.

## A13 — Deep uncertainty does not receive fake precision

When probabilities/forecasts are not defensible enough for expected-value optimization, the system can choose robust/vulnerability-oriented reasoning instead of manufacturing precise inputs.

## A14 — Staged decisions can preserve options

When the problem unfolds over time and future evidence can change the route, the system can represent:

- action now;
- options preserved;
- signposts;
- trigger conditions;
- contingency actions.

## A15 — Sensitivity controls analytical escalation

After a material recommendation, plausible changes in assumptions are tested when useful.

- If no plausible variation changes the recommendation, additional precision has low default value.
- If small plausible changes flip the recommendation, that uncertainty becomes decision-relevant and should route to VOI, robust reasoning or FIELD as appropriate.

## A16 — Strategy remains adaptive

Different user states can produce different audience recommendations, diagnoses, dependencies, allocations, reasoning processes and next actions.

## A17 — Map semantics remain explicit

Available, sequential, parallel, blocked, premature and unlocked states remain distinguishable and inspectable.

## A18 — Evidence/trust remains rigorous

Observation, user report, stated counterfactual, inference, recommendation and market outcome remain distinct.

Chronology is not causality; self-report is not external validation.

## A19 — Learning can reverse prior advice

New evidence may preserve, weaken or reverse a prior `STOP`, `DELAY`, `ACCELERATE` or other allocation decision.

The system receives no credit for stubborn consistency.

## A20 — No composite vanity metric

Time, cash and other scarce resources remain separately observable unless an explicit defensible conversion is defined.

`Avoided Wrong Work` is not a standalone North Star.

Current construct: **Counterfactual Resource Allocation Delta toward O**.

## A21 — 95% assurance boundary is enforced

Internal systems may strongly confirm/refute only claim classes for which the relevant evidence is directly observable / deterministically testable or independently calibrated above the required confidence threshold.

Appropriate >95% assurance targets include finite structural claims such as:

- baseline precedes recommendation;
- hard constraint is represented;
- router precondition is violated;
- refuted policy assumption still reaches a recommendation;
- route change has no recorded evidence trigger.

Model confidence, reviewer agreement or cross-model consensus are not >95% strategic-truth evidence by default.

## A22 — UX coherence

Blocking contradictions include:

- map-as-value without measured decision change;
- resource-allocation promise without pre-advice baseline;
- recommendation contaminating the baseline;
- "saved" claims merely because work was stopped;
- adaptive doctrine with unexplained allocation changes;
- complex decision method without a live decision-changing reason;
- MCDA/optimizer output hiding a hard dependency;
- UI elements with no user-state or live-decision job.

---

# PHASE B — STRUCTURAL / FIXTURE FALSIFICATION GATE

Before automating the full decision-policy router, use fixtures whose method-discriminating property is directly observable.

Minimum fixture classes:

1. **hard prerequisite absent** — constraint/dependency reasoning must precede scoring;
2. **simple dominance** — complex method escalation must be rejected;
3. **genuine multi-objective trade-off** — simplistic single-criterion ranking must be rejected;
4. **cheap decision-changing unknown** — targeted VOI/information path must be considered;
5. **deep uncertainty without defensible probabilities** — fake precise expected-value optimization must be rejected;
6. **staged decision with observable future trigger** — adaptive-pathway reasoning must be considered;
7. **irrelevant wording mutation** — selected reasoning mode should remain stable;
8. **decision-relevant structural mutation** — selected reasoning mode should change.

These fixtures validate the router contract, not the strategic truth of the resulting authority recommendation.

A deterministic fixture pass can support >95% confidence about a finite implementation rule when the input property and expected rule are directly inspectable and mutation coverage is adequate.

---

# PHASE C — LOW-FIDELITY / PERSONALIZED FIELD GATE

Current UI instrument remains:

`public/authority-prototype-v3-2.html`

It is scripted and intentionally low fidelity.

It tests the semantics of:

```text
what I would have done
→ what the system changed
→ where resources moved
→ why
→ what should change the allocation again
```

It does **not** validate personalized strategic intelligence or meta-decision superiority.

For personalized Wizard-of-Oz participants capture:

1. authority goal and planning horizon;
2. stated counterfactual action portfolio **before reveal**;
3. material baseline time/cash commitments;
4. live decision frame;
5. method / reasoning mode used and why;
6. personalized person/field/diagnosis/dependency analysis;
7. action-level recommended delta;
8. revised intended allocation;
9. actual allocation at follow-up;
10. observed market/authority signals;
11. recommendation reversal/regret when applicable.

Track separately:

- Decision Delta;
- Priority Delta;
- Resource Allocation Delta by resource type;
- Premature-Work Reallocation;
- New-Leverage Allocation;
- Recommendation Reversal / Regret;
- later authority/business signals.

Where feasible, compare the adaptive/meta-decision process against a simpler fixed advisory process on equivalent cases.

The next empirical question is not whether users like the sophistication. It is:

> **Does context-sensitive selection of the reasoning process materially improve allocation decisions versus a simpler fixed process?**

---

# PHASE D — FUNCTIONAL / COMMERCIAL VALIDATION

Only after personalized decision value survives FIELD should a functional product be expected to automate:

- counterfactual capture;
- live decision framing;
- DecisionProblemProfile construction;
- requisite decision-policy selection;
- person/field research;
- diagnosis;
- dependency-aware allocation;
- provenance;
- execution bridge;
- actual allocation / signal return;
- evidence-sensitive re-planning;
- reliability, security, privacy, RTL/mobile/accessibility.

Commercial validation ultimately requires users to return and some users to pay for continuing strategic allocation/learning value, not merely generated artifacts or sophisticated reasoning traces.

---

# Decision quality versus outcome quality

Do not label a decision good solely because a good outcome followed.

Evaluate separately:

1. quality of the decision framing / process at the time;
2. intended allocation change;
3. actual allocation / execution;
4. observed outcome;
5. what that outcome legitimately teaches.

A lucky outcome does not certify weak reasoning; an unlucky outcome does not automatically invalidate a well-grounded decision under uncertainty.

---

# GLOBAL TERMINATION RULE

At the end of every meaningful phase, run `TELOS_GOVERNANCE`.

Possible outcomes:

- `CONTINUE` — a material internal gap remains and can be resolved now;
- `REPLAN` — current framing / architecture / metric / decision process itself blocks O;
- `FIELD` — reality is now the highest-value source of information;
- `STOP` — no further justified action or analytical escalation is currently expected to materially improve O.

A checklist cannot authorize `STOP`.

---

# Current closeout — 2026-08-15

**O recalled**  
Improve the user's allocation of scarce resources toward a desired authority state, learn from reality, and avoid analytical work that does not improve that allocation.

**Material finding**  
The prior architecture correctly introduced counterfactual resource allocation, but still left an important hidden assumption: that the system could choose its reasoning method ad hoc. Research on requisite decision modelling, Decision Quality, Value of Information and adaptive pathways supports treating method selection itself as a governed decision.

**Invalidated assumption**  
"Choose a strong decision framework and apply it" is too coarse. No framework or algorithm has default authority.

**Governance action taken**  
`REPLAN` was opened for the intelligence architecture and closed by:

- adding `docs/META_DECISION_GOVERNANCE.md`;
- making the selected decision process subordinate to O;
- adopting least-complex-sufficient / requisite reasoning;
- defining structural method-selection preconditions;
- introducing a strict 95% assurance boundary for behind-the-scenes systems;
- separating structural assurance from strategic truth.

**Existing systems judged useful above the 95% boundary**  
Deterministic guards, finite contract/mutation tests, refutation propagation and provenance/evidence separation can strongly falsify structural violations in their defined scope. Blind reviewers, model confidence and cross-model agreement do not qualify as >95% strategic-truth evidence without independent calibration for that claim class.

**Remaining highest-leverage uncertainty**  
Whether adaptive selection of the reasoning process improves real allocation decisions more than a simpler fixed advisory process cannot be established internally.

**Current governance outcome:** `FIELD` after structural fixture specification.

**Next justified action:** use structural fixtures for implementation assurance when a router exists, and test the adaptive meta-decision hypothesis in personalized Wizard-of-Oz cases before building a full MCDA/optimization/VOI stack.

# ProofMiner — Definition of Done v3.4

## Governing rule

This DOD is subordinate to `docs/TELOS_GOVERNANCE.md`.

It is the current best hypothesis about what must be true to realize O. It does not define O, and passing every gate does not authorize `STOP` if Telos Governance still finds a material end-to-end gap.

Use together with:

- `docs/UX_TRANSITION_CONTRACT.md`
- `docs/RESOURCE_REALLOCATION_CONTRACT.md`
- `docs/FIELD_PROTOCOL_V3.md`

---

# O recalled

The product exists to increase the likelihood that a relevant audience comes to perceive the user as a credible, differentiated authority in the desired domain and acts accordingly.

Because the user has scarce time, money and attention, the system must improve how those resources are allocated toward that end under uncertainty.

The system cannot guarantee authority. It is responsible for producing, explaining and adapting the best grounded allocation/route available and for learning responsibly from market evidence.

---

# Primary first-session transition

```text
A1 — authority need + plausible actions + uncertain allocation
→
B — grounded allocation decision supported by an Authority Map
```

`B` is not "the user received a map".

The user should be able to state:

- what they want to become known for and by whom;
- what they would have done without the product;
- what main gap was found;
- what they will now `KEEP / ACCELERATE / REORDER / REDUCE / DELAY / STOP / REPLACE / ADD`;
- where scarce resources go first;
- why;
- what is parallel, blocked or premature;
- what information/evidence could change the allocation again.

The Authority Map is the main explanatory/navigation artifact for this decision state.

---

# Product hierarchy invariant

```text
CONSCIOUS PAIN
→ AUTHORITY DIRECTION / OUTCOME
→ STATED COUNTERFACTUAL PLAN
→ MINIMUM DECISION-RELEVANT DATA
→ DIAGNOSIS
→ ALLOCATION DELTA
→ AUTHORITY MAP
→ EXECUTION
→ MARKET EVIDENCE
→ RE-ALLOCATION
```

A lower-level model, metric, framework or UI element may not outrank this transition.

---

# PHASE A — PRODUCT / UX ARCHITECTURE GATES

## A1 — Stable project unit

`AuthorityProject` remains the persistent top-level project context.

## A2 — Trigger is falsifiable

The ICP should recognize an authority/resource-allocation problem without learning product vocabulary first.

## A3 — Counterfactual is captured before advice

The system can record what the user says they would otherwise do during the relevant horizon, including order and material time/cash commitments when useful.

The counterfactual is labeled as stated/self-reported, not causal truth.

## A4 — Material allocation change is representable

The product can represent `KEEP / ACCELERATE / REORDER / REDUCE / DELAY / STOP / REPLACE / ADD` at action level.

Stopping is not automatically valuable.

## A5 — Opportunity cost is decision-relevant

When recommending one action over another, the system can explain what is displaced, delayed or forgone when material.

## A6 — Data requests have value-of-information logic

Before requesting material new information, the system can answer:

> **Which live allocation decision could change if we knew this?**

If none, the request has no default claim to user effort.

## A7 — Strategy remains adaptive

Different user states can produce different audience recommendations, diagnoses, dependencies, allocations and next actions.

## A8 — Map semantics remain explicit

Available, sequential, parallel, blocked, premature and unlocked states remain distinguishable and inspectable.

## A9 — Evidence/trust remains rigorous

Observation, user report, stated counterfactual, inference, recommendation and market outcome remain distinct.

Chronology is not causality; self-report is not external validation.

## A10 — Learning can reverse prior advice

New evidence may preserve, weaken or reverse a prior `STOP`, `DELAY`, `ACCELERATE` or other allocation decision.

The system receives no credit for stubborn consistency.

## A11 — No composite vanity metric

Time, cash and other scarce resources remain separately observable unless an explicit defensible conversion is defined.

`Avoided Wrong Work` is not a standalone North Star.

Current construct: **Counterfactual Resource Allocation Delta toward O**.

## A12 — UX coherence

Blocking contradictions include:

- map-as-value without measured decision change;
- resource-allocation promise without pre-advice baseline;
- recommendation contaminating the baseline;
- "saved" claims merely because work was stopped;
- adaptive doctrine with unexplained allocation changes;
- UI elements with no user-state or live-decision job.

---

# PHASE B — LOW-FIDELITY FIELD GATES

Current instrument:

`public/authority-prototype-v3-2.html`

It is scripted and intentionally low fidelity.

Its job is to test the semantics of:

```text
what I would have done
→ what the system changed
→ where resources moved
→ why
→ what should change the allocation again
```

It does **not** validate personalized strategic intelligence.

## B1 — Trigger comprehension

User can explain the problem/decision the product is for.

## B2 — Baseline capture

User can state a plausible real counterfactual before recommendation without facilitator contamination.

## B3 — Allocation-delta comprehension

User can explain what changed and classify material action changes.

## B4 — Dependency comprehension

User distinguishes parallel, sequential, blocked and premature.

## B5 — No false savings claim

User understands that resources moved out of an action are initially **reallocated**, not automatically saved.

## B6 — Replanning comprehension

User understands why later evidence could reverse or change a prior allocation.

---

# PHASE C — PERSONALIZED WIZARD-OF-OZ VALUE GATE

Before building a full AI engine, run personalized analysis with target users.

For each participant capture:

1. authority goal and planning horizon;
2. stated counterfactual action portfolio **before reveal**;
3. material baseline time/cash commitments;
4. personalized person/field/diagnosis/dependency analysis;
5. action-level recommended delta;
6. revised intended allocation;
7. actual allocation at follow-up;
8. observed market/authority signals;
9. recommendation reversal/regret when applicable.

Track separately:

- Decision Delta;
- Priority Delta;
- Resource Allocation Delta by resource type;
- Premature-Work Reallocation;
- New-Leverage Allocation;
- Recommendation Reversal / Regret;
- later authority/business signals.

A zero delta is not automatically failure: the original plan may have been strong. But repeated zero delta from generic analysis is evidence against additive value.

---

# PHASE D — FUNCTIONAL / COMMERCIAL VALIDATION

Only after personalized decision value survives FIELD should a functional product be expected to automate:

- counterfactual capture;
- person/field research;
- diagnosis;
- dependency-aware allocation;
- provenance;
- execution bridge;
- actual allocation / signal return;
- evidence-sensitive re-planning;
- reliability, security, privacy, RTL/mobile/accessibility.

Commercial validation ultimately requires users to return and some users to pay for continuing strategic allocation/learning value, not merely generated artifacts.

---

# Decision quality versus outcome quality

Do not label a decision good solely because a good outcome followed.

Evaluate separately:

1. quality of the decision process at the time;
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
- `REPLAN` — current framing / architecture / metric / sequence blocks O;
- `FIELD` — reality is now the highest-value source of information;
- `STOP` — no further justified action or reallocation is currently expected to materially improve O.

A completed checklist, attractive prototype, changed plan or improved metric cannot authorize `STOP` on its own.

---

# Current closeout — 2026-08-15, full resource-allocation iteration

**O recalled**  
Increase the likelihood that the relevant market grants the desired authority position and acts accordingly, while improving allocation of scarce user resources toward the strongest grounded path under uncertainty.

**Target state reconstructed**  
The user must not merely possess a map. They must make a defensible allocation decision relative to what they would otherwise have done, execute it, and allow later evidence to update it.

**Highest-leverage gap found**  
We had no uncontaminated before-state. Without a pre-advice counterfactual, we could not distinguish product-created decision value from a map that merely restated the user's existing plan.

**Research challenge to the initial metric**  
Stopping work can be valuable when it prevents escalation of commitment or exposes opportunity cost, but stopping can also occur too early. Therefore `Avoided Wrong Work` was rejected as a standalone North Star.

**Invalidated prior assumption**  
`Decision-Ready Authority Map = sufficient first-session value` is false as a DOD claim.

**Changes made**

- Telos Governance now explicitly governs scarce-resource allocation and opportunity cost;
- `RESOURCE_REALLOCATION_CONTRACT.md` created;
- UX B-state changed to grounded allocation decision;
- first-session flow captures counterfactual before advice;
- FIELD protocol captures baseline → revised allocation → actual allocation → learning;
- DOD rewritten around measurable additive decision value;
- low-fidelity `authority-prototype-v3-2.html` created;
- README aligned.

**Technical evidence**

- v3.2 deployment is `READY` on Vercel;
- direct fetch returns HTTP 200;
- GitHub CI for the v3.2 commit completed successfully.

Interactive browser automation could not be run in the current runtime because the documented `agent-browser` CLI is unavailable; this is not being treated as completed evidence.

**Remaining highest-leverage uncertainties**

They now require reality:

1. can target users state a usable counterfactual without excessive friction?
2. does personalized analysis materially change allocation rather than merely explain it?
3. how much time/cash/attention moves, and in which direction?
4. do users actually execute the revised allocation?
5. does later evidence support, weaken or reverse the recommendation?
6. does a simpler static advisor produce comparable value?

Further internal refinement cannot responsibly answer these.

**Resource-allocation implication for the project itself**  
Allocate no further effort to UI polish, taxonomy expansion or AI-engine implementation yet. Allocate the next effort to personalized Wizard-of-Oz FIELD sessions with pre-advice counterfactual capture.

**Current governance outcome:** `FIELD`.

**Next justified action:** run the preregistered personalized baseline → allocation-delta → follow-up test with target users.

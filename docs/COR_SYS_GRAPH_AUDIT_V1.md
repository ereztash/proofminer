# COR-SYS Graph Audit of ProofMiner — v1

Date: 2026-08-15

## Scope

This audit applies the strongest reusable COR-SYS graph structures available from prior graph work to the current ProofMiner / Authority Journey architecture.

It is **not** a claim that COR-SYS itself is empirically mature. The graph's own promotion audit reported zero canonical mature (`🌳`) load-bearing claims, many coherence-only / untested claims, and no external-verified claims in the audited state. Therefore the graph is used here primarily as a **representational, governance and falsification instrument**, not as an authority oracle.

The audit uses:

- System Grammar: `BND / ACT / REL / GOAL / REP / RES / RULE / MEM / OUT + EVT`;
- orthogonal lenses `S / P / I / E / G`;
- refutation propagation / promotion discipline;
- anti-self-loop / new-field rule;
- A/D/G distinction: authorship, differentiation, agency are not one score;
- hollow-ownership risk;
- decision-event / discriminative-power logic;
- metric-governance / metric-gaming distinction;
- observer-before-controller / additive-first / explicit write authority.

---

# 1. System Grammar projection

## BND — Boundary & environment

### Current support

ProofMiner already carries:

- authority domain;
- selected audience;
- authority surfaces;
- transferability state;
- constraints.

### Gap

The architecture represents **targets inside the boundary** better than the boundary itself.

It does not yet explicitly represent:

- who / what is outside the target authority field;
- what adjacent experience is not allowed to count as direct legitimacy;
- which authority surfaces are in scope for the current project and which are not;
- what time / market / evidence horizon bounds the current recommendation;
- when a change of audience/domain/surface is a new project versus an update to the current one.

### Why material

A boundary error can change:

- audience choice;
- transferability judgment;
- field research corpus;
- perceived competition;
- allowed evidence;
- resource allocation.

### Verdict

`PARTIAL / LOAD-BEARING GAP`

Do not add a new ontology object automatically. First make the boundary hypothesis inspectable at project / decision level.

---

## ACT — Actors, states & capabilities

### Current support

`Person`, `PersonState`, `AuthorityAsset`, target audience, intermediaries and user constraints cover much of ACT.

### Gap

The system models capability and action readiness better than **decision-level agency**.

It can currently record that a user accepted/rejected an allocation, but it does not distinguish:

- `user chose because they endorse the rationale`;
- `user complied because the system sounded authoritative`;
- `user could explain / contest the criteria`;
- `user merely confirmed a system-authored route`.

### Verdict

`REPLAN REQUIRED`

Acceptance is not authorship.

---

## REL — Roles, relations & network

### Current support

The architecture contains audiences, relationships/distribution, intermediaries, referral sources and authority surfaces.

### Gap

Relations are mostly treated as attributes/resources rather than as a changing network through which authority is granted, transferred, contested or amplified.

This is not blocking for the current Wizard-of-Oz stage, but it becomes material when modeling referral authority, third-party legitimacy and intermediary effects.

### Verdict

`ADEQUATE FOR FIELD / FUTURE MODEL GAP`

---

## GOAL — Goals & stakes

### Current support

Telos Governance, `AuthorityGoal`, desired association, desired audience actions and business/career outcomes are strong.

### Gap

The architecture does not consistently record **goal authorship / criterion authorship**.

Who supplied:

- the goal;
- the success criterion;
- the trade-off preference;
- the threshold at which an action becomes unacceptable?

If the system supplies these and the user only approves wording, the project can exhibit hollow ownership.

### Verdict

`PARTIAL / MUST LINK TO AUTHORSHIP`

---

## REP — Representations & common ground

### Current support

- perceived-identity hypotheses;
- field model;
- evidence/provenance;
- counterfactual rationale;
- strategic diagnosis.

### Main gap

The product currently measures mainly **allocation change**, not **representation change**.

The user arrives with an implicit model such as:

> visibility -> content -> authority

or:

> experience -> credibility -> referrals

The product may change the allocation only because it changes this causal representation.

If that change is not captured, we cannot distinguish:

- informed decision change;
- blind compliance;
- temporary persuasion;
- durable learning.

### New measurement candidate

`Representation Delta` — not a score, but an inspectable before/after change in the user's decision model:

- what they believed would create authority;
- what dependencies they believed existed;
- what they believed the bottleneck was;
- what evidence they believed should change course.

### Verdict

`HIGHEST-LEVERAGE GAP`

Resource Allocation Delta without Representation Delta can be behavior change without learning or authorship.

---

## RES — Resources & flows

### Current support

Strong.

Time, cash, attention, team capacity, social capital and opportunity cost are already represented as scarce resources.

### Gap

No material grammar gap identified.

### Verdict

`STRONG`

---

## RULE — Rules, rights & authority

### Current support

Telos Governance and Meta-Decision Governance are unusually strong internal RULE layers.

### Main gap

Internal agent governance is stronger than **user-facing decision governance**.

The user needs explicit contestability rights:

- challenge a recommendation;
- expose the assumption it depends on;
- correct a false representation;
- change a goal / constraint;
- refuse a recommendation without being treated as error;
- ask what evidence would make the system change its mind.

### Invariant candidate

> **No recommendation is authoritative merely because the system produced it. A material allocation recommendation must remain inspectable and contestable by the user.**

### Verdict

`REPLAN REQUIRED`

---

## MEM — Feedback & memory

### Current support

`LearningUpdate`, market signals, prior action history and map revision provide a good MEM structure.

### Gap

Memory currently risks becoming project-flat rather than system-nested.

One market event can update several authority contexts simultaneously.

Example:

A conference talk may affect:

- one buyer relationship;
- one professional community;
- a referral network;
- public search footprint.

The event should be recorded once and linked to every affected surface/system, not duplicated as separate events.

### Verdict

`MODEL PATCH REQUIRED`

---

## OUT — Outcomes & distribution

### Current support

MarketSignal / Outcome distinguishes signal types and attribution uncertainty.

### Gap

The product needs to preserve the distinction between:

- visibility outcomes;
- perceived-association outcomes;
- authority/legitimacy outcomes;
- business/career outcomes;
- distribution of costs / benefits across user and audience.

The current model largely supports this but field evidence is absent.

### Verdict

`ADEQUATE / FIELD-DEPENDENT`

---

## EVT — Event / action / intervention

### Current support

AuthorityAction, real-world action, MarketSignal and LearningUpdate form an event spine.

### Gap

Current `MarketSignal.authority_surface` is singular. This conflicts with the System Grammar rule that one event may update several nested System Instances.

### Required patch

Represent one event once, with `affected_authority_surfaces[]` / system links.

### Verdict

`STRUCTURAL PATCH REQUIRED`

---

# 2. Orthogonal lens audit

## S — Structure

Strong. The product has a clear object graph, route states, allocation semantics and governance hierarchy.

## P — Phenomenon

Partial. Several mechanisms remain hypotheses:

- why authority emerges for a specific audience;
- how private/referral authority transfers to public authority;
- when visibility creates legitimacy versus noise;
- how the user's own decision model changes.

Do not hide mechanism uncertainty behind structural completeness.

## I — Intervention

Strong. The system has explicit action / allocation / data-gathering intervention vocabulary.

## E — Epistemic

Strong internal discipline, weak empirical maturity.

The graph's own history warns that coherence, cross-model agreement and repeated corpus mining can create false confidence. Current ProofMiner must preserve observation / inference / recommendation / outcome separation and avoid treating internal agreement as field proof.

## G — Governance

Strong for agent/process governance; incomplete for user governance.

The missing user-facing component is contestability + authorship propagation.

---

# 3. A / D / G audit

These remain orthogonal dimensions and must not be collapsed into one "user empowerment" score.

## A — Self-authorship / authorship

Question:

> Whose criterion is governing the decision?

Risk:

The system can become the external authority that defines the user's priorities while the user only confirms the wording.

Required distinction:

- system-generated option;
- system-generated rationale;
- user-endorsed criterion;
- user-authored goal;
- user commitment.

## D — Differentiation

Question:

> Can the system distinguish the user's own position, field expectations, audience needs and external authority without collapsing them into one representation?

Current state:

Relatively strong through PersonState vs FieldModel and transferability logic.

Main warning:

Do not convert "differentiation" into a generic objective to be maximized. Sometimes parity is required before difference matters.

## G — Agency

Question:

> Can the user originate, refuse, revise and enact the decision?

Agency must be evaluated at least across:

- decision formation;
- action execution;
- outcome interpretation.

A user who executes the system's recommendation may have high action execution and low decision authorship.

### Verdict

The current architecture measures execution/allocation more strongly than decision authorship.

---

# 4. Hollow ownership test

Prior graph work distinguished ownership of representation/wording from ownership that propagates into price, commitment or action.

Apply the same falsification here.

```text
GOAL wording owned by user
        ↓ ?
criterion / trade-off owned by user
        ↓ ?
allocation decision owned by user
        ↓ ?
commitment owned by user
        ↓ ?
real-world action
```

If ownership stops at confirmation of the goal/map while the system owns the criterion and commitment logic, this is **hollow decision ownership**.

Do not count:

- "sounds right";
- clicking Accept;
- repeating the recommendation;

as proof of self-authorship.

Field evidence should test whether the user can:

- explain the criterion in their own words;
- reject a recommendation for a coherent reason;
- state what evidence would change their mind;
- modify a constraint and predict how the decision should change.

---

# 5. Metric-governance audit

The System Grammar explicitly distinguishes `metric_governance` from `metric_gaming`.

Current risk:

`Counterfactual Resource Allocation Delta toward O` is called a North-Star candidate.

If the product is optimized to increase that delta, a trivial strategy exists:

> produce surprising recommendations that cause larger allocation changes.

This can increase the proxy without improving O.

### Required governance state

Until field evidence shows that a specific use of Allocation Delta predicts or helps discriminate material value:

```text
metric: Counterfactual Resource Allocation Delta
measurement_use: observational / evaluation
routing_use: PROHIBITED
governance_use: PROHIBITED as optimization objective
```

A zero delta is not failure; a large delta is not success.

The metric can describe change. It cannot authorize the change.

---

# 6. Refutation-propagation audit

COR-SYS has a real refutation propagation mechanism with load-bearing dependents, blocking and scope restriction.

ProofMiner currently documents the principle but has no comparable claim-dependency/refutation registry in the repository.

### Consequence

A load-bearing product claim can be invalidated in a FIELD test without mechanically identifying all dependent:

- router rules;
- DOD gates;
- UX copy;
- product claims;
- prototype behavior;
- metrics.

### Governance verdict

`NOT BLOCKING FOR CURRENT WIZARD-OF-OZ FIELD`

Do not build a full claim graph yet.

Before production automation or promotion of a mechanism as validated, implement at least a minimal claim → dependent registry or equivalent audit path.

---

# 7. Anti-self-loop audit

COR-SYS previously found that repeated mining of the same corpus generated recombinations of existing heuristics and projections of its own meta-charter rather than new invariants.

Apply that lesson here.

The similarity between:

- Telos Governance;
- Meta-Decision Governance;
- COR-SYS Stop Rule;
- Requisite decision modelling;

is **not** evidence that the current product mechanism is correct.

It is at most conceptual convergence.

The adaptive meta-decision hypothesis must be tested against a strong fixed process in new real cases.

If the adaptive router mostly re-labels the same decision or collapses to a simpler family, collapse it rather than protecting the taxonomy.

---

# 8. Router discriminative-power test

Prior COR-SYS routing work failed a gate when:

- the functional bottleneck was unknown in most events;
- a seven-operator router collapsed to only a few actually selected families.

The same kill condition should apply here.

Do not ask:

> Does the router classify cases into all method families?

Ask:

> Does knowing the decision structure change the next decision, information request, or resource allocation compared with a simpler process?

If not, the router is taxonomy without discriminative power.

---

# 9. Current strongest invariants after audit

These are architecture-level invariants / hypotheses, not empirical authority claims about the market.

1. **Telos outranks plan, model, metric and UI.**
2. **A measured proxy cannot govern the behavior it measures without an explicit decision-use gate.**
3. **One real-world event is recorded once and may update multiple authority surfaces/systems.**
4. **Allocation change without representation change / user endorsement is insufficient evidence of learning or authorship.**
5. **User acceptance is not equivalent to user authorship.**
6. **A recommendation must remain contestable: assumptions, evidence and change conditions must be inspectable.**
7. **A decision method has no authority merely because it exists; it must demonstrate discriminative value for the live decision.**
8. **Refuted load-bearing assumptions must not continue silently into active recommendations.**
9. **New analytical complexity must change a live decision or lose its claim to resources.**
10. **Internal coherence / repeated self-analysis is not external corroboration.**

---

# 10. Governance result

## O recalled

Increase the likelihood that the target audience perceives the user as a credible differentiated authority and acts accordingly, while improving the user's resource allocation under uncertainty without replacing the user's decision authorship.

## Target state reconstructed

The product must produce not merely a changed action portfolio, but a **contestable, user-endorsed decision model** linking:

```text
O
→ boundary / context
→ user's prior representation
→ evidence / field state
→ decision frame
→ sufficient reasoning method
→ allocation decision
→ user commitment
→ action
→ multi-surface outcomes
→ learning
```

## Highest-leverage gaps

1. `REP`: Representation Delta missing.
2. `G/ACT`: user contestability / authorship propagation missing.
3. `metric_governance`: Allocation Delta lacks explicit no-routing/no-optimization status.
4. `BND`: target boundary is implicit rather than inspectable.
5. `EVT/MEM`: one event can affect multiple authority surfaces but model is currently singular.

## Resource implication

Do **not** allocate resources to:

- more decision-method taxonomies;
- MCDA / optimizer implementation;
- UI polish;
- full refutation infrastructure.

Allocate only enough internal work to patch the five architecture contracts above, then return to FIELD.

## Outcome

`REPLAN → FIELD`

The graph changed the product contract but did not justify a new implementation phase.

The next world-facing tests should measure:

- baseline Representation + Allocation;
- revised Representation + Allocation;
- authorship / contestability;
- actual action;
- outcomes by affected authority surface;
- whether new evidence changes both the representation and the allocation.

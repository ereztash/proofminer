# Product Model Graph Delta — v3.1

## Authority

This document is an **additive-first delta** over `docs/PRODUCT_MODEL.md` created by the COR-SYS graph audit.

Until these deltas are folded into a later canonical product-model rewrite, this document overrides only the conflicting fields / semantics named below.

It does not authorize a broad ontology rewrite.

---

# 1. AuthorityProject / decision boundary

The current project model must make the relevant boundary inspectable when it can change a material decision.

Add or derive the following as lightweight project / decision state:

- `in_scope_authority_domains[]`
- `excluded_or_adjacent_contexts[]`
- `target_authority_surfaces[]`
- `decision_horizon`
- `transferability_boundary_notes[]`
- `boundary_uncertainties[]`

Do not require every field on every project.

The boundary exists to prevent evidence, competitors, audiences or actions from silently crossing from an adjacent context into the current authority claim.

---

# 2. DecisionRepresentationSnapshot

Add a provisional representation object rather than treating allocation alone as the user's state.

Suggested fields:

- `id`
- `project_id`
- `captured_at`
- `stage` — `counterfactual_before` / `revised_after` / `followup`
- `stated_primary_bottleneck`
- `stated_causal_or_dependency_assumptions[]`
- `stated_reason_actions_should_work[]`
- `stated_change_conditions[]`
- `source_state` — user-stated / system-inferred / jointly-revised
- `uncertainties[]`

This is not a psychological score.

It exists so the system can distinguish changed understanding from blind compliance.

---

# 3. Decision authorship / contestability state

For each material allocation recommendation, preserve:

- `goal_source` — who originated the goal / criterion;
- `system_recommendation`
- `user_endorsement_state`
- `user_challenge_or_correction`
- `assumption_challenged`
- `change_conditions[]`
- `final_commitment_state`

Do not infer authorship from an accept/confirm action.

A recommendation remains advisory and contestable unless a separate real-world rule gives it authority.

---

# 4. MarketSignal / event identity

Override the singular field:

```text
authority_surface
```

with an event-linked representation equivalent to:

```text
affected_authority_surfaces[]
affected_context_refs[]
```

One real-world event has one event identity.

It may update several nested authority contexts / surfaces.

Do not duplicate the event merely to fit one row per surface.

Surface-specific interpretation may differ and should be attached as per-surface observations / relations.

---

# 5. LearningUpdate

A LearningUpdate may change:

- `DecisionRepresentationSnapshot` / current representation;
- PersonState;
- FieldModel;
- AuthorityMap;
- allocation;
- decision method when the decision structure itself changed.

The system should record which object changed and why.

---

# 6. Metric-governance status

`Counterfactual Resource Allocation Delta` and `Representation Delta` are **measurements about product/user change**, not recommendation inputs by default.

Until separately validated:

```text
routing_use: prohibited
optimization_target_use: prohibited
```

No object graph edge should allow a larger delta to become evidence that the underlying recommendation is better.

---

# 7. Refutation / dependency note

The current repository does not yet contain a full strategic claim-dependency/refutation registry comparable to COR-SYS.

Do not build it merely for architectural symmetry.

Before automated promotion of a load-bearing mechanism as validated, the product must have at least one auditable path from:

```text
claim / policy assumption
→ dependent decision rules / UX claims / product claims
→ refutation or scope restriction
```

so a fallen assumption cannot continue silently.

---

# Current status

These deltas close the representational contradictions exposed by `docs/COR_SYS_GRAPH_AUDIT_V1.md` sufficiently for the current Wizard-of-Oz FIELD stage.

They are not evidence that the mechanisms are strategically correct.

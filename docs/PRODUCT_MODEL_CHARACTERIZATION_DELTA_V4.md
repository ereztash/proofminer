# Product Model Characterization Delta — v4

Date: 2026-08-15

## Authority

This is an additive-first delta over `docs/PRODUCT_MODEL.md` and `docs/PRODUCT_MODEL_GRAPH_DELTA_V3_1.md`.

It overrides only the conflicting top-level project semantics and adds the minimum characterization objects required by `TELOS_GOVERNANCE v1.3` and `CHARACTERIZATION_GOVERNANCE_V1`.

Do not rewrite the full ontology during FIELD merely for naming consistency.

---

# 1. Top-level project unit

The canonical logical top-level project is now:

## `ProfessionalTransitionProject`

It represents one bounded professional / market-position transition in which the user is trying to move from a current opportunity / perception / business state to a desired one.

Suggested fields:

- `id`
- `person_id`
- `desired_professional_state`
- `desired_market_or_opportunity_outcomes[]`
- `target_audiences_or_environments[]`
- `in_scope_surfaces[]`
- `excluded_or_adjacent_contexts[]`
- `decision_horizon`
- `status`
- `created_at`
- `updated_at`

Possible statuses:

- discovery
- characterizing
- researching
- deciding
- executing
- learning
- paused
- achieved_for_now
- abandoned

`AuthorityProject` becomes a **legacy / specialized vertical representation** that may be mapped into a `ProfessionalTransitionProject` when authority is the actual desired state.

Do not require authority language for projects where the user's actual job is moving upmarket, changing role, entering a field, repositioning or launching a new professional offer.

---

# 2. ProfessionalCase

A real episode from the user's professional practice used to reconstruct how they create value / diagnose / decide.

Suggested fields:

- `id`
- `person_id`
- `project_id`
- `case_type` — success / failure / difficult / surprising / contrasting
- `initial_state`
- `goal`
- `cues_noticed[]`
- `information_used[]`
- `information_ignored[]`
- `alternatives_considered[]`
- `dominant_constraints[]`
- `decision`
- `action_sequence[]`
- `reversal_conditions[]`
- `observed_outcome`
- `source_refs[]`
- `uncertainties[]`

A case is evidence about an episode. It is not itself a reusable rule.

---

# 3. ProfessionalOperatingModel

A provisional abstraction of how the person tends to solve systems in their professional domain.

Suggested fields:

- `id`
- `person_id`
- `project_ids[]`
- `source_case_ids[]`
- `acted_on_system_type`
- `desired_state_pattern`
- `diagnostic_questions[]`
- `decision_cues[]`
- `hard_constraints[]`
- `failure_modes[]`
- `action_families[]`
- `dependency_rules[]`
- `success_signals[]`
- `reversal_conditions[]`
- `known_blind_spots[]`
- `abstraction_scope`
- `confidence_state`
- `last_updated_at`

This is not a psychometric profile and not an immutable identity claim.

---

# 4. CharacterizationRun

One justified characterization intervention.

Suggested fields:

- `id`
- `project_id`
- `process_family`
- `representation_or_decision_affected`
- `why_selected`
- `inputs[]`
- `outputs[]`
- `new_distinctions[]`
- `questions_avoided[]`
- `research_avoided[]`
- `remaining_unknowns[]`
- `stop_reason`

Possible `process_family` values:

- direct_clarification
- critical_case_reconstruction
- cross_case_abstraction
- self_application
- resource_decision_reconstruction
- external_mirror
- competing_lens
- backward_from_o

A CharacterizationRun without a live representation / decision purpose is invalid.

---

# 5. SelfApplicationHypothesis

Represents a mapping from the user's professional operating model onto their own business / transition.

Suggested fields:

- `id`
- `project_id`
- `professional_operating_model_id`
- `source_system_type`
- `target_system_description`
- `mapped_elements[]`
- `non_mapped_elements[]`
- `resulting_hypotheses[]`
- `decision_implications[]`
- `transferability_state`
- `transferability_rationale`
- `competing_lenses[]`
- `external_evidence_required[]`
- `user_challenges[]`

Possible `transferability_state`:

- directly_useful
- useful_with_boundary
- hypothesis_only
- not_transferable
- contradicted

No self-application hypothesis may silently become a strategic fact.

---

# 6. DecisionRelevantUnknown

The bridge between characterization and external research.

Suggested fields:

- `id`
- `project_id`
- `unknown_type`
- `statement`
- `decision_affected`
- `representation_affected`
- `evidence_that_could_change_decision`
- `source_types_needed[]`
- `acquisition_cost_or_burden`
- `stop_condition`
- `status`

Possible `status`:

- unresolved
- resolved_from_user
- resolved_from_existing_source
- external_research_needed
- not_worth_resolving
- resolved_in_field

---

# 7. Decision-directed research relation

External research should be linked:

```text
DecisionRelevantUnknown
→ SourceAsset / external source
→ EvidenceUnit / observation
→ inference
→ transferability
→ decision use
```

A SourceAsset may still exist independently, but broad discovery does not authorize decision use unless the relationship is explicit.

---

# 8. Updated canonical graph

```text
Person
  |
  +--> ProfessionalTransitionProject
          |
          +--> target state / boundary
          |
          +--> counterfactual representation + allocation
          |
          +--> ProfessionalCase(s)
          |        |
          |        +--> ProfessionalOperatingModel
          |                   |
          |                   +--> SelfApplicationHypothesis
          |
          +--> CharacterizationRun(s)
          |        |
          |        +--> DecisionRelevantUnknown(s)
          |
          +--> PersonState / external FieldModel
          |
          +--> live DecisionProblemProfile
          |
          +--> StrategicDiagnosis / allocation decision
          |
          +--> dependency-aware route / actions
          |
          +--> real-world Event / Outcome
          |
          +--> LearningUpdate
                   |
                   +--> updates representation / model / allocation / lineage
```

Authority-specific assets / surfaces remain valid when they are actually part of the transition.

---

# 9. Migration / implementation rule

Do not rename every legacy code / document object before FIELD.

For current experiments:

- treat existing `AuthorityProject` storage / prototype semantics as historical / vertical-specific;
- use `ProfessionalTransitionProject` as the canonical conceptual model in new FIELD records;
- implement database migration only if characterization + commercial FIELD survives strongly enough to justify a production build.

---

# Current status

This delta closes the internal semantic contradiction sufficiently for FIELD.

It does not prove that characterization-first is strategically better than a strong simple intake.

# ProofMiner — Product Model v3

## Authority

This model is subordinate to:

1. `docs/TELOS_GOVERNANCE.md`
2. `PRODUCT_DOCTRINE.md`

It supersedes the v2 assumption that `DecisionMoment` is the top-level product object.

---

# Canonical system graph

```text
Person
  |
  +--> AuthorityProject
          |
          +--> AuthorityGoal
          |
          +--> AudiencePathCandidate(s)
          |        |
          |        +--> selected TargetAudience
          |
          +--> PersonState <--- SourceAsset(s)
          |        |
          |        +--> AuthorityAsset(s)
          |
          +--> FieldModel
          |
          +--> StrategicDiagnosis
          |
          +--> AuthorityMap
          |        |
          |        +--> AuthorityAction(s)
          |                 |
          |                 +--> DecisionMoment (when relevant)
          |                 +--> ProofMove (when evidence is needed)
          |                 +--> AuthorityArtifact / RealWorldAction
          |
          +--> MarketSignal / Outcome
          |
          +--> LearningUpdate
                   |
                   +----> updates PersonState / FieldModel / AuthorityMap
```

The product's persistent memory belongs primarily to the Authority Project and Person, not to isolated content sessions.

---

# Core objects

## Person

Represents the professional using the system.

Suggested fields:

- `id`
- `name`
- `professional_context`
- `consent_state`
- `data_retention_preferences`
- `created_at`

Person-level information may be reused across Authority Projects only when semantically relevant and allowed by the user's privacy settings.

---

## AuthorityProject

One desired authority position in one field for one meaningful audience strategy.

Suggested fields:

- `id`
- `person_id`
- `authority_domain`
- `desired_perceived_identity`
- `desired_business_or_career_outcomes[]`
- `target_authority_surfaces[]`
- `selected_audience_path_id`
- `status`
- `created_at`
- `updated_at`

`target_authority_surfaces` prevents the product from equating authority with public social visibility. Possible surfaces include:

- referral network
- selected professional community
- public digital audience
- organizational/internal field
- industry stage/media ecosystem
- buyer shortlist / sales context

Possible status values:

- discovery
- diagnosing
- mapped
- executing
- learning
- paused
- achieved_for_now
- abandoned

`achieved_for_now` does not imply objective permanent authority. It means the project's current operational success criteria have been met strongly enough to stop active execution.

---

## AuthorityGoal

Operationalizes what "becoming an authority" means for this project.

Suggested fields:

- `project_id`
- `domain`
- `desired_association`
- `target_audience_definition`
- `target_authority_surfaces[]`
- `desired_audience_actions[]`
- `observable_authority_signals[]`
- `business_or_career_signals[]`
- `time_horizon` optional
- `constraints[]`

The system must distinguish:

1. desired perception;
2. perceived-identity evidence;
3. observable authority signals;
4. downstream business/career outcomes.

There is no universal authority score. Each Authority Project defines a relevant signal bundle.

---

## AudiencePathCandidate

A candidate strategic audience generated after the user names the authority domain.

Suggested fields:

- `id`
- `project_id`
- `audience_definition`
- `path_role[]` such as `natural`, `commercial`, `fast`
- `existing_asset_fit`
- `market_need_rationale`
- `commercial_or_career_potential`
- `credible_distance_rationale`
- `competitive_context`
- `uncertainties[]`
- `recommendation_state`

These dimensions do not require universal numeric weights.

The system compares paths contextually.

If two candidates are genuinely close and one missing answer can change the choice, create a `DiscriminatingQuestion` rather than presenting false certainty.

---

## DiscriminatingQuestion

A question justified only because its answer can change a material recommendation.

Suggested fields:

- `id`
- `project_id`
- `question`
- `decision_affected`
- `candidate_outcomes[]`
- `answer`

The system should minimize these questions.

---

## SourceAsset

A source supplied by the user or discovered with permission / appropriate public access.

Examples:

- LinkedIn profile
- CV
- website
- article
- public mention
- testimonial
- proposal
- client transcript
- sales transcript
- post
- podcast / interview transcript
- user interview
- referral history

Suggested fields:

- `id`
- `person_id`
- `project_ids[]`
- `source_type`
- `origin`
- `title`
- `author_or_speaker`
- `captured_at`
- `content_hash`
- `privacy_state`
- `permission_state`

---

## EvidenceUnit

Stable attributable observation extracted from a SourceAsset.

This object survives from v2.

Suggested fields:

- `id`
- `source_asset_id`
- `verbatim_span`
- `normalized_observation`
- `source_location`
- `speaker_or_author`
- `evidence_type`
- `time_context`
- `disclosure_state`
- `source_fidelity_state`

EvidenceUnit is evidence about what a source says or records. It is not automatically proof of a broader claim.

---

## AuthorityAsset

A reusable asset that may help the user become legible as an authority.

An AuthorityAsset may be source-derived, inferred from multiple sources, or intentionally developed through an AuthorityAction.

Suggested fields:

- `id`
- `person_id`
- `project_ids[]`
- `asset_class`
- `description`
- `source_context`
- `supporting_evidence_unit_ids[]`
- `confidence_state`
- `disclosure_state`
- `maturity_state`
- `transferability_state`
- `transferability_rationale`
- `strategic_uses[]`

`transferability_state` may be:

- directly_applicable
- adjacent_bridgeable
- weakly_transferable
- not_currently_justified

This is essential when prior experience comes from a different role, industry or authority field.

Initial asset classes:

### Evidence

Outcomes, testimonials, credentials, third-party validation, visible work and other support for claims.

### Methodology

Recurring diagnostic, decision or execution patterns that can be reconstructed from experience.

### Experience

Roles, exposures, responsibilities and situations that create legitimate perspective.

### Perspective

Distinctive concepts, interpretations, frameworks, questions or mechanisms the user can teach.

### Relationship / distribution

Communities, partners, clients, institutions, platforms, stages and information intermediaries that can carry or validate authority.

### Market-response

Observed prior events where content, referrals, talks, relationships or other actions preceded meaningful opportunity.

Asset classes are descriptive. Do not impose a universal total score.

---

## PersonState

The current working model of the person's authority-relevant position.

Suggested fields:

- `project_id`
- `known_assets[]`
- `known_gaps[]`
- `perceived_identity_hypotheses[]`
- `perceived_identity_evidence_refs[]`
- `existing_audiences[]`
- `existing_authority_surfaces[]`
- `existing_distribution[]`
- `existing_external_validation[]`
- `client_acquisition_patterns[]`
- `referral_language_patterns[]`
- `unresolved_uncertainties[]`
- `last_updated_at`

`perceived_identity_hypotheses` must be grounded where possible in observational data such as referral language, client language, external mentions, audience behavior or repeated inbound themes rather than only the user's self-description.

PersonState is derived and revisable.

It must never overwrite immutable source truth.

---

## FieldModel

A working model of the authority field and selected audience.

Suggested fields:

- `project_id`
- `target_audience`
- `relevant_authority_surfaces[]`
- `recognized_authorities[]`
- `known_for_associations[]`
- `points_of_parity[]`
- `points_of_difference[]`
- `audience_needs[]`
- `category_norms[]`
- `important_channels[]`
- `information_intermediaries[]`
- `comparable_journeys[]`
- `under_served_positions[]`
- `source_references[]`
- `uncertainties[]`

The FieldModel must preserve the difference between observation and inferred mechanism.

---

## ComparableAuthorityJourney

A public or researched sequence describing how another person appears to have built recognition in a relevant field.

Suggested fields:

- `id`
- `subject`
- `relevance_rationale`
- `observed_events[]`
- `public_claimed_mechanisms[]`
- `inferred_mechanisms[]`
- `source_references[]`
- `transferability_limits[]`

A ComparableAuthorityJourney is a benchmark, not a recipe and not causal proof.

---

## StrategicDiagnosis

The system's current explanation of the highest-leverage authority gap.

Suggested fields:

- `id`
- `project_id`
- `primary_gap`
- `secondary_gaps[]`
- `selected_lenses[]`
- `key_findings[]`
- `assumptions[]`
- `evidence_refs[]`
- `uncertainties[]`
- `cross_context_transferability_findings[]`
- `why_this_model`

`selected_lenses` may include SWOT or other strategic frameworks, but the user should not have to choose a framework.

The model is chosen because it helps resolve the actual gap.

---

## AuthorityMap

Dependency-aware route from current state to desired authority state.

Suggested fields:

- `id`
- `project_id`
- `current_state_summary`
- `target_state_summary`
- `nodes[]`
- `highest_leverage_action_id`
- `blocked_nodes[]`
- `parallel_groups[]`
- `last_recomputed_at`

Each node should be an `AuthorityAction` or a meaningful milestone.

---

## AuthorityAction

One action on the strategic route.

Suggested fields:

- `id`
- `authority_map_id`
- `action_type`
- `statement`
- `rationale`
- `prerequisite_ids[]`
- `unlocks_ids[]`
- `can_run_in_parallel_with_ids[]`
- `premature_until_ids[]`
- `required_information[]`
- `expected_learning`
- `expected_authority_mechanism`
- `status`

Foundational `action_type` values may include:

- capability_building
- learning
- real_project_or_pilot
- collaboration
- original_research
- contribution
- methodology_extraction
- evidence_collection
- external_validation
- positioning
- distribution
- relationship_building
- artifact_creation
- outreach
- feedback_collection

This prevents the system from treating all authority gaps as communication problems.

Possible status values:

- available_now
- in_progress
- blocked
- premature
- completed
- rejected
- invalidated

The dashboard's dominant recommendation is usually one `available_now` AuthorityAction chosen for highest expected leverage.

---

## AuthorityArtifact

An external or internal artifact produced as part of an AuthorityAction.

Possible types:

- profile positioning
- methodology document
- public framework
- LinkedIn post
- case study
- original research
- talk / webinar
- podcast appearance
- proposal proof block
- article
- guide
- landing page
- outreach message

Suggested fields:

- `id`
- `authority_action_id`
- `type`
- `content_or_reference`
- `grounding_state`
- `disclosure_state`
- `deployed_at`

Artifacts are means, not top-level success units.

---

# Evidence / trust subsystem

The following v2 objects remain valid beneath an AuthorityAction when evidence is needed.

## DecisionMoment

A specific moment where another person or audience is deciding something relevant.

## CandidateClaim

A claim that may reduce uncertainty in that DecisionMoment.

## EvidenceRelation

`SUPPORTS / QUALIFIES / CONTRADICTS` relation between EvidenceUnit and CandidateClaim.

## ProofMove

A contextual recommendation combining a claim, supporting evidence, qualifiers, inference boundary and recommended representation/action.

Canonical subgraph:

```text
AuthorityAction
   |
   +--> DecisionMoment
            |
            v
      CandidateClaim
            ^
            | SUPPORTS / QUALIFIES / CONTRADICTS
            |
      EvidenceUnit
            |
            v
         ProofMove
            |
            v
      AuthorityArtifact
```

ProofMove is invoked when it serves the Authority Map. It is not the product's top-level unit.

---

## MarketSignal

Observable response after an AuthorityAction or AuthorityArtifact.

Suggested types:

- no observable response
- relevant engagement
- profile visit
- follow / subscription
- inbound message
- referral
- invitation
- qualified conversation
- proposal movement
- deal
- career opportunity
- third-party mention
- repeated association with target expertise

Suggested fields:

- `id`
- `project_id`
- `action_or_artifact_id`
- `signal_type`
- `description`
- `observed_at`
- `source`
- `authority_surface`
- `audience_match_state`
- `desired_association_match_state`
- `attribution_state`

A signal matters only relative to the project's audience, desired association and authority surface.

---

## LearningUpdate

Records how new evidence changes the model.

Suggested fields:

- `id`
- `project_id`
- `trigger`
- `prior_assumption`
- `new_evidence`
- `updated_belief`
- `objects_changed[]`
- `map_change`
- `created_at`

The product's compounding value depends on LearningUpdates changing future recommendations when warranted.

---

# Independent uncertainty dimensions

Do not collapse these into one universal authority score.

At minimum preserve:

### Source fidelity

Did the system correctly understand the source?

### Asset support

Is the inferred AuthorityAsset actually supported by source material or repeated evidence?

### Transferability

Does an asset from one context legitimately support authority in the target context?

### Strategic relevance

Does this asset/action matter for the selected audience and current authority gap?

### Market-model confidence

How well supported is the FieldModel or comparable-journey inference?

### Perceived-identity confidence

How much observational evidence supports the claim that the relevant audience currently associates the user with a particular capability/topic?

### Outcome attribution

How confidently can a market signal be associated with an action, without overstating causality?

### Route dependency confidence

How certain is the claim that action A must precede action B rather than merely being preferable?

These states may be qualitative or comparative.

---

# Progressive knowledge acquisition

The system should request new data only when it can explain what capability or decision the data will unlock.

Canonical pattern:

```text
Authority goal
-> minimal person / public footprint
-> first strategic model
-> identify highest-value uncertainty
-> request one source / answer
-> unlock or revise map
```

Examples:

- "If we see how your last five clients found you, we can test whether your existing reputation is already strongest around a specific problem."
- "Two audiences remain equally plausible. One answer about the type of work you want more of will change which path I recommend."
- "We can describe your approach, but we do not yet know whether it repeats across cases. One more client story would test that."

---

# UX projection of the model

The user should not see this ontology by default.

Primary UI concepts should be ordinary-language projections of:

- Where you want to become known
- Who you want to be known by
- Where that authority needs to exist
- What the market appears to know you for today
- What you already have
- What is missing
- The route
- What to do now
- What this unlocks
- What happened
- What changed because we learned it

Internal model detail belongs behind progressive disclosure.

---

# Safe failure states

Valid outcomes include:

- target authority field too broad to map usefully
- no credible audience path yet
- insufficient information to distinguish paths
- no evidence for a proposed claim
- methodology hypothesis not yet supported across cases
- prior experience does not transfer strongly enough to the target field
- best authority asset cannot be disclosed
- benchmark journey is not transferable
- market response is ambiguous
- current action produced no meaningful signal
- current strategic model is contradicted by new evidence
- desired authority requires competence/evidence that must be built before communication should scale

The correct response is to expose the gap and update the route, not manufacture certainty.

---

# Non-canonical implementation choices

The following remain implementation choices unless field evidence makes them product doctrine:

- database vendor
- LLM provider
- exact retrieval stack
- exact strategic-model selection algorithm
- exact visual representation of dependency graph
- numeric versus categorical internal states
- framework library implementation
- external search provider

Implementation must preserve the semantic boundaries and telos governance above.
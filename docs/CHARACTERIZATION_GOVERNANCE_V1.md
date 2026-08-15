# Characterization Governance — v1

Date: 2026-08-15

## Authority

This document is subordinate to `docs/TELOS_GOVERNANCE.md` and governs **how the system learns what it needs to know about the person / professional system before diagnosis, research and recommendation**.

It exists because a fixed intake form silently assumes in advance which variables matter. The current product hypothesis requires the system to discover the relevant variables from the live professional transition and from the user's own domain expertise where useful.

---

# Governing claim

> **Do not begin by asking for all potentially useful information. Begin by selecting the characterization process most likely to reveal a decision-relevant distinction.**

The system should characterize the user through **meta-processes**, not through a universal questionnaire.

A characterization process is justified only when its output can change one or more of:

- the problem representation;
- project / decision boundary;
- candidate alternatives;
- hard constraints;
- dependencies;
- required external research;
- decision method;
- resource allocation;
- evidence / reversal condition.

If none can change, do not run the characterization process.

---

# Core insight — the user's profession is a high-resolution lens

A professional already applies a structured or partly tacit process to other systems.

Examples:

- project manager → scope, dependencies, critical path, risk, capacity, milestones;
- marketer → audience, positioning, offer, message, channel, funnel, measurement;
- salesperson → pipeline, qualification, objections, conversion, next action;
- UX designer → user, job, journey, friction, decision point, feedback;
- organizational consultant → actors, relationships, goals, resources, rules, bottlenecks, feedback;
- financial professional → cash flows, constraints, scenarios, risk, return, timing.

The product can use this expertise as an endogenous characterization instrument.

But the user's professional lens has **no default authority**. Expertise can create blind spots, procedural rigidity and domain-transfer errors. Therefore self-application must always remain a hypothesis-generating / characterization mechanism, not a truth oracle.

---

# Canonical characterization loop

```text
LIVE PROFESSIONAL TRANSITION
        ↓
1. EXTRACT
   reconstruct how the user actually creates value / makes judgments in real cases
        ↓
2. ABSTRACT
   derive the smallest useful professional operating model
        ↓
3. SELF-APPLY
   treat the user's own business / professional system as the object of that process
        ↓
4. CHALLENGE
   test boundary, transferability, blind spots and competing lenses
        ↓
5. GAP
   identify what still cannot be decided from endogenous knowledge
        ↓
6. RESEARCH
   acquire only external information capable of changing the live decision
        ↓
7. DECIDE / ACT
        ↓
8. OUTCOME
   use reality to update both the decision and the characterization model
        ↺
```

This loop sits **before and around** Meta-Decision Governance. Characterization determines what kind of decision problem is actually present; Meta-Decision Governance determines the least-complex sufficient reasoning process for that problem.

---

# C1 — EXTRACT: reconstruct expertise from real cases

Do not ask only:

> "How do you work?"

Experts often cannot fully verbalize procedural / tacit knowledge in abstract form.

Prefer actual episodes:

- a successful client / project case;
- a difficult case;
- a surprising failure;
- a moment where the expert changed their mind;
- two superficially different cases that used the same underlying judgment.

For each case elicit, only as needed:

- initial situation / goal;
- cues noticed;
- information ignored or discounted;
- hypotheses / alternatives considered;
- constraint that dominated;
- decision made;
- action sequence;
- what would have changed the decision;
- outcome / feedback;
- what the expert learned.

This is a product adaptation of Cognitive Task Analysis / Critical Decision Method style elicitation, not a claim that one interview can fully recover expertise.

---

# C2 — ABSTRACT: derive the professional operating model

The goal is not a transcript summary.

Derive the **minimum reusable structure** that explains how the person normally creates value.

Suggested representation:

```text
ProfessionalOperatingModel
- system / object acted on
- desired state
- diagnostic questions
- decision cues
- hard constraints
- common failure modes
- action families
- dependencies / ordering rules
- evidence / success signals
- reversal conditions
- known blind spots
- source cases
```

Do not create a universal score.

Do not over-generalize from one case when the structure may be case-specific.

When possible, compare at least two cases before treating a pattern as transferable.

---

# C3 — SELF-APPLY: use the professional model on the user's own system

Core prompt form:

> **If this business / professional transition belonged to a client and you had to apply your own professional process to it, what would you inspect, diagnose and do?**

Examples:

### Project manager

Treat the business / transition as a project:

- target state;
- scope;
- stakeholders;
- dependencies;
- critical path;
- resource bottleneck;
- risk;
- milestones;
- blocked / premature work.

### Marketer

Treat the business as the marketing problem:

- audience;
- market problem;
- positioning;
- offer;
- message;
- channel;
- funnel;
- measurement.

### UX professional

Treat the business as a product / experience:

- target user;
- job;
- journey;
- friction;
- decision point;
- feedback loop.

Self-application is valuable when it creates a new decision-relevant representation or exposes a contradiction between what the user professionally demands from others and what they tolerate in their own system.

It is **not** automatically valuable because it feels insightful.

---

# C4 — CHALLENGE: prevent professional-lens capture

Every material self-application result must be challenged before it governs allocation.

Ask:

## Boundary

- Is the user's business genuinely a system of the same type as the systems they normally work on?
- Which parts map cleanly?
- Which parts do not?

## Transferability

- Which professional rule is supported across multiple source cases?
- Which rule may depend on a client context absent here?

## Competing lens

- Which plausible alternative characterization could change the diagnosis?
- What would a different profession / stakeholder see that this lens systematically ignores?

## External reality

- Which part requires market / audience / competitor / channel evidence rather than self-knowledge?

## Self-authorship

- Is the user discovering their own criterion, or merely complying with the system's reinterpretation of their expertise?

A self-application result may be classified:

- `directly_useful`
- `useful_with_boundary`
- `hypothesis_only`
- `not_transferable`
- `contradicted_by_external_evidence`

---

# C5 — GAP: decide what must be learned next

After endogenous characterization ask:

> **What remains unknown that could still change the live decision?**

Unknowns should be typed where useful:

- person / capability unknown;
- field / market unknown;
- audience unknown;
- resource / constraint unknown;
- dependency unknown;
- outcome-mechanism unknown;
- transferability unknown.

This step prevents the system from researching facts already available through the user's expertise and prevents self-application from substituting for external evidence.

---

# C6 — RESEARCH: decision-directed external research

External research begins only after the characterization loop identifies a decision-relevant unknown.

Each research request must record:

- `decision_affected`;
- `unknown`;
- `evidence_that_would_change_choice`;
- `source_types_needed`;
- `stop_condition`.

The research engine should prefer the smallest evidence set capable of discriminating between current alternatives.

Do not reward breadth of search.

---

# Characterization-process router

Do not expose a taxonomy to the user.

Select from a small set of process families based on the unresolved uncertainty.

## P0 — Direct clarification

Use when one concrete answer can resolve the representation.

## P1 — Critical-case reconstruction

Use when the person's tacit expertise / decision cues are unknown.

## P2 — Cross-case abstraction

Use when one case may be too idiosyncratic to infer a reusable process.

## P3 — Self-application / role reversal

Use when the user's own professional operating model could illuminate their current system.

## P4 — Resource / decision reconstruction

Use when the main uncertainty is what the user is actually prioritizing / sacrificing.

## P5 — External mirror

Use when the internal representation may differ materially from how buyers / peers / market actually perceive the person.

## P6 — Competing-lens / boundary challenge

Use when one professional lens may be overfitting the problem.

## P7 — Backward-from-O

Use when the current discussion is tactic-first and the necessary conditions of the target state are unclear.

These are process families, not a mandatory sequence.

The canonical `EXTRACT → ABSTRACT → SELF-APPLY → CHALLENGE` sequence is most relevant when the user's existing expertise is expected to be a material source of latent diagnostic value.

---

# Stop rule for characterization

At every extra question / case / process ask:

> **What live representation or decision could this additional characterization change?**

STOP characterization when:

- the live decision is sufficiently framed;
- another characterization process would not plausibly change the representation / decision;
- the remaining uncertainty requires external evidence rather than more introspection.

Return `RESEARCH` / `FIELD` rather than continuing to interview the user indefinitely.

---

# 95% assurance boundary

High-confidence structural checks may include:

- a material self-application recommendation exists without any source case / professional model;
- an abstract professional rule is treated as transferable without recorded transferability state;
- a process is run without a `decision_affected` or representation purpose;
- external research begins without a decision-relevant unknown;
- a `hypothesis_only` characterization is presented as established fact;
- the system requests information it already has in a higher-fidelity source without justification.

Internal systems cannot establish with >95% confidence that:

- the extracted professional model is complete;
- self-application is strategically correct;
- one competing lens is the true model of the business;
- the resulting recommendation will improve market position.

Those remain field / outcome questions.

---

# Research grounding

The direction is consistent with established knowledge-elicitation work:

- Hoffman, Shadbolt, Burton & Klein (1995), *Eliciting Knowledge from Experts: A Methodological Analysis*, Organizational Behavior and Human Decision Processes, describes complementary elicitation families including task analysis, interviews and contrived/process-revealing tasks.
- Cognitive Task Analysis is used to model mental representations, strategies, goals and decision processes underlying expert performance; Critical Decision Method reconstructs real incidents to elicit cues, alternatives and reasoning.
- A 2022 systematic review of CTA in clinical / health-services research found CTA/CDM widely used to understand expert real-world decision making and to inform decision-support design.
- Analogical-transfer research warns that expertise does not guarantee flexible transfer; highly proceduralized expert rules can interfere with transfer to a new problem.
- Classic schema-induction work suggests cross-case comparison can be more useful than relying on one analogy for abstracting transferable structure.
- Self-distancing research provides limited but relevant support for the intuition that reasoning about one's own problem from a more distanced perspective can reduce egocentric bias in some contexts.

These sources support the **mechanism family**, not the strategic correctness of the product.

---

# Kill conditions

Revise or kill this architecture if FIELD shows that:

- direct high-quality professional-transition interviews produce the same decisions with materially less effort;
- users' professional processes are too tacit / inconsistent to reconstruct usefully;
- self-application mostly reproduces existing beliefs rather than changing representation;
- professional-lens capture creates more errors than useful distinctions;
- external market evidence dominates endogenous expertise in nearly every case;
- the characterization router mostly collapses to one simple interview process;
- participants experience the process as clever reflection but it does not alter allocation, research requests or decision quality.

---

# Current governance conclusion

**REPLAN.**

The previous architecture implicitly assumed that the system could move from intake / baseline to person + field analysis. That is underspecified.

The new architecture inserts a governed characterization layer:

```text
TRIGGER / O
→ CHARACTERIZE HOW THIS PERSON SEES / SOLVES SYSTEMS
→ SELF-APPLY WHEN USEFUL
→ CHALLENGE THE LENS
→ IDENTIFY DECISION-RELEVANT UNKNOWNS
→ EXTERNAL RESEARCH
→ FRAME DECISION
→ DECIDE HOW TO DECIDE
→ ALLOCATE
→ ACT / LEARN
```

After this internal contract exists, the next uncertainty is empirical: whether this process creates materially better representation / allocation than a simpler strong intake + advisory process.

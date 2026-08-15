# Characterization Research Grounding — v1

Date: 2026-08-15

## Purpose

Ground the characterization-first architecture in established research without upgrading conceptual similarity into product validation.

This document supports **mechanism choice and constraints**. It does not prove that ProofMiner's self-application / characterization process improves professional-transition decisions.

---

# 1. Expert knowledge should not be elicited through one generic self-report method

Hoffman, Shadbolt, Burton & Klein (1995), *Eliciting Knowledge from Experts: A Methodological Analysis*, reviews knowledge-elicitation work across judgment/decision making, human factors, cognitive science and expert systems.

The paper organizes elicitation methods broadly around:

- analysis of tasks experts actually perform;
- interviews;
- contrived / process-revealing tasks.

Product implication:

> A universal `tell me your methodology` prompt is methodologically weak as the only source of a Professional Operating Model.

The product should select the smallest elicitation family capable of revealing a decision-relevant distinction.

Reference: DOI `10.1006/obhd.1995.1039`.

---

# 2. Cognitive Task Analysis supports extracting mental representations / strategies from real work

Cognitive Task Analysis (CTA) is used to investigate the mental representations, strategies, goals and decision processes underlying skilled performance.

Critical Decision Method (CDM) is one CTA-family technique that reconstructs actual incidents in increasing detail to elicit cues, alternatives, interpretations and decision logic.

A 2022 systematic review of CTA in clinical / health-services research included 81 articles / 80 unique studies from 13 countries and found CDM / CTA interviews among the most commonly used approaches for understanding real-world expert decision making and informing decision-support design.

Product implication:

> When the user's professional process is load-bearing, prefer reconstruction of actual cases over abstract identity / methodology claims.

Reference:

- systematic review PMID `35260195`.
- CDM examples / related review PMID `24444010`, `23644263`.

---

# 3. Experts may not fully know or verbalize what they do

CTA / knowledge-elicitation literature repeatedly distinguishes observed / reconstructed expertise from what experts can simply describe abstractly.

Product implication:

Do not equate:

```text
user says "this is how I work"
```

with:

```text
validated Professional Operating Model
```

The model remains provisional, source-linked and revisable.

---

# 4. Analogical transfer is useful but expertise can create rigidity

Marchant et al. (1991), *Analogical transfer and expertise in legal reasoning*, found that transfer-facilitating manipulations did not uniformly help experts; for more experienced experts, highly proceduralized rules could interfere with transfer to the target problem.

Product implication:

> `SELF-APPLICATION` cannot receive authority merely because the user is an expert.

Required companion checks:

- source vs target system mapping;
- non-mapped elements;
- transferability state;
- competing lens;
- external evidence.

Reference: DOI `10.1016/0749-5978(91)90015-L`.

---

# 5. Cross-case comparison can support abstraction better than one analogy alone

Gick & Holyoak (1983), *Schema induction and analogical transfer*, found that comparison across multiple source analogs could support induction of a more abstract schema, and schema quality predicted later transfer performance.

Product implication:

A second professional case may be valuable **when** one-case abstraction is load-bearing and uncertain.

Do not convert this into a rule requiring multiple cases for every user.

Reference: DOI `10.1016/0010-0285(83)90002-6`.

---

# 6. Self-distancing gives limited support to role reversal, not proof

Research on self-distancing suggests that reasoning about personally relevant situations from a more distanced perspective can, in some contexts, support more balanced / wiser reasoning and reduce egocentric processing.

The evidence is context-dependent and does not show that `treat yourself as your own client` will improve business decisions.

Product implication:

Role reversal / self-application is plausible enough to test, but must remain falsifiable and must not be sold as established psychology.

Example reference: Grossmann, Sahdra & Ciarrochi (2016), PMCID `PMC4824766`.

---

# 7. Structured expert elicitation requires discipline around uncertainty

Research / guidance on structured expert elicitation emphasizes that expert judgment is useful only for questions where expertise is meaningful, and protocols should be designed / tested carefully because judgment remains vulnerable to heuristics, overconfidence and model-form uncertainty.

Product implication:

The user's professional model can generate hypotheses / criteria. It does not automatically provide calibrated probabilities or strategic truth.

References:

- Morgan (2014), PNAS, PMCID `PMC4034232`.
- ISPOR Structured Expert Elicitation good-practices report, PMID `39505473`.

---

# 8. Knowledge Acquisition Tool pattern — relevant structural analogy

Published knowledge-elicitation work describes a recursive pattern in which the elicitor identifies an expert's default belief / decision hypothesis and then asks for the conditions that would overturn it, recursively exposing domain-specific decision knowledge.

Product implication:

This supports a useful elicitation primitive:

```text
what is your normal default?
→ under what condition would you do something else?
→ what would overturn that new rule?
```

This resembles ProofMiner's existing reversal-condition / Stop-Rule architecture, but conceptual convergence is not independent validation of the product.

Reference: *Knowledge elicitation as a route to understanding the decision making landscape in monoclonal antibody manufacturing* (2022), Biochemical Engineering Journal / related process-systems literature.

---

# Research-derived architecture constraints

The research supports these constraints strongly enough to use as design hypotheses:

1. no single generic elicitation method is universally sufficient;
2. real-case reconstruction is preferable to abstract self-description when tacit expertise matters;
3. extracted expert models remain provisional;
4. self-application requires explicit transferability checks;
5. multiple cases are justified only when they can resolve abstraction uncertainty;
6. external reality cannot be replaced by endogenous expertise;
7. role reversal / self-distancing is a testable mechanism, not an established business-decision intervention;
8. characterization should elicit reversal conditions, not only default rules.

---

# What the research does NOT establish

Do not claim from these sources that:

- professionals make better decisions when they treat themselves as clients;
- the extracted operating model is complete;
- self-application increases revenue / authority / career success;
- characterization-first beats a strong direct advisory interview;
- one user's professional expertise transfers to running their own business;
- the proposed process has commercial willingness to pay.

Those are FIELD claims.

---

# Current research verdict

**Strengthen the architecture enough to FIELD-test it; do not promote it as validated product value.**

The strongest next test remains:

> Does a governed real-case → operating-model → self-application → challenge loop reveal a material decision distinction that a strong simple professional-transition intake misses at justified cost?

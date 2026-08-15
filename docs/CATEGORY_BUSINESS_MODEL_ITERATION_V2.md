# Category + Business Model Iteration — v2

Date: 2026-08-15

## Governance status

This is a new iteration over `CATEGORY_BUSINESS_MODEL_ITERATION_V1.md`.

It is subordinate to `TELOS_GOVERNANCE.md` and does not broaden the live product to generic life decisions.

The iteration re-runs:

`O → target state → backward plan → competitor / substitute falsification → business-model fit → retention fit → DOD update → FIELD`.

---

# 1. Separate the two teloi

The prior work implicitly mixed user value and commercial recurrence.

They must remain distinct.

## User telos

> **Help a professional move toward a desired market position by improving a contestable representation of the live problem and allocating scarce resources to the strongest grounded actions, while learning from real outcomes without replacing the user's decision authorship.**

## Business telos

> **Capture a sustainable share of the value created by those improved decisions through a repeatable commercial model that does not distort recommendations, manufacture engagement, or create dependency.**

A business-model choice may not modify the decision engine merely to increase engagement, allocation delta, recommendation count or billing duration.

If user telos and business telos conflict, product recommendation integrity wins; the commercial model must change.

---

# 2. Category falsification

## Retain as architectural family

`Personal Decision Intelligence` remains a useful architecture label because the system maintains longitudinal decision state and uses it to improve future decisions.

## Reject as primary customer-facing promise

`Personal Decision Intelligence` is not a strong first purchase trigger.

Direct competitors already offer:

- decision profiles;
- framework routing;
- decision histories;
- scenarios;
- personalized recommendations;
- outcome reflection.

Therefore the category label itself carries little defensible commercial differentiation.

## Customer-facing job

The paid job should be described from the professional transition, not from the decision-technology category.

Current best job statement:

> **I am trying to change how the market sees / chooses me, several plausible moves compete for my limited resources, and I need to know what deserves investment now, what should wait, and what evidence should make me change course.**

---

# 3. Wedge replan

## Previous wedge

`Professional Authority / Market Position`

## New hierarchy

```text
Architecture: Personal Decision Intelligence
        ↓
Commercial domain: Professional Market Position
        ↓
High-density trigger: Professional Inflection / Transition Episode
        ↓
Initial ICP: independent experts / consultants / fractional leaders
        ↓
Authority-building: one important mechanism / desired state inside the domain
```

### Why remove "authority" from the top of the commercial wedge?

A buyer may want:

- to move upmarket;
- launch / reposition an offer;
- enter a new field;
- become the obvious choice for a narrower problem;
- shift from outbound/referral dependence to inbound;
- increase pricing power;
- convert existing experience into visible credibility.

Authority can serve those outcomes, but making `authority` mandatory risks turning a solution mechanism into the buyer's problem definition.

### Boundary

This is not permission to become a generic business adviser.

The initial domain remains decisions that affect **professional market position / reputation-to-opportunity**, including positioning, audience, evidence, methodology, channels, relationships and authority surfaces.

Pricing, product, hiring and broad GTM decisions remain out of scope unless they directly participate in the current market-position decision.

---

# 4. Commercial unit: Professional Transition Episode

The strongest business-model insight from this iteration is that meaningful decisions may be **clustered rather than evenly recurring**.

A professional transition often creates a dense sequence such as:

```text
what position do I want?
→ which audience?
→ which claims are legitimate?
→ what evidence is missing?
→ what should I build first?
→ which channel / relationship surface?
→ what should I stop / delay?
→ what did the market signal?
→ what changes now?
```

That can support intensive recurring value for 60–180 days even if the user does not need strategic advice every month forever.

Therefore the default commercial unit should be tested as an **active episode**, not assumed to be an eternal monthly subscription.

---

# 5. Retention architecture

There are three different forms of retention. Do not collapse them.

## A. Within-episode continuation

During an active transition, multiple related decisions occur.

Measure:

- second material decision rate;
- third material decision rate;
- time between consequential decisions;
- how often prior episode state changes the next decision.

## B. Between-episode persistence

After the immediate transition stabilizes, the system may become quiet.

Persistence can preserve:

- decision lineage;
- evidence / outcome history;
- current market-position state;
- unresolved triggers;
- user-approved monitoring state.

Quiet periods are not churn failures by definition.

## C. Reactivation

A new inflection point, material outcome or boundary change can reactivate the system.

Measure:

- natural reactivation rate;
- paid reactivation rate;
- whether the prior history materially improves the new episode.

This may be more important than monthly active use.

---

# 6. Compounding value requires transferability, not memory alone

The v1 thesis said prior history should improve future recommendations.

This iteration adds a missing safety condition:

> **Past decision evidence may update a new decision only when its transferability is justified.**

A history of LinkedIn content decisions may not legitimately govern a move into enterprise procurement. A prior audience-response pattern may not transfer after the user changes domain, offer or authority surface.

For every material use of history, record:

- prior event / decision used;
- similarity / relevance rationale;
- boundary changes since then;
- transferability state;
- what would make the historical analogy invalid.

### One-year value test v2

Do not ask only:

> Would deletion of the first 11 months degrade the next recommendation?

Also ask:

> **Which parts of the first 11 months are legitimately transferable to this decision, and which must be ignored?**

A product that remembers everything but cannot forget / scope old evidence can become worse over time.

---

# 7. Personal Decision Model must be versioned

Do not build a static `Decision Profile` that assumes durable traits.

Goals, constraints, desired identity, risk tolerance, economics and audience can change.

The compounding object should be a **versioned Personal Decision State + lineage**, not a timeless personality profile.

Minimum principles:

- every important preference / goal has source + timestamp / validity context;
- later user-authored changes supersede earlier state without erasing history;
- historical patterns carry transferability limits;
- the system can say `this old pattern is no longer relevant`;
- no inferred trait silently becomes permanent.

---

# 8. Monitoring is not yet proven subscription value

Enterprise decision-intelligence products remain continuously useful because they are connected to live operational systems and continuously receive new data.

ProofMiner does not yet have equivalent automatic signal ingestion.

Therefore do not promise ongoing monitoring value unless at least one of these is true:

- the product receives a real external signal feed;
- the user can return outcome/evidence with very low friction;
- a scheduled review repeatedly changes decisions;
- a human-in-loop service is explicitly part of the paid offer.

`Monitoring` without a real information channel is marketing language, not retention infrastructure.

---

# 9. Business-model architecture — revised

## Model 1 — Active Transition Engagement — current priority

Early Wizard-of-Oz offer.

Suggested FIELD band:

- **$900–$2,400 for 90 days**;
- human-in-loop is explicit;
- initial decision model + person/field research;
- multiple material decision reviews during the active episode;
- outcome / evidence review;
- persistent lineage at close.

This band is not validated. It is supported only as a plausible test range by adjacent authority / career / mentoring markets.

## Model 2 — Setup + Active Mode

Possible structure:

- initial state / project setup: **$500–$1,500**;
- active decision mode: **$99–$249/month** only while the user has enough decision density / monitoring value;
- pause allowed without destroying lineage.

## Model 3 — Episodic Decision Review

If decision density proves too low for subscription:

- persistent account / history at free or low cost;
- consequential decision review charged per event;
- optional paid reactivation episode.

Test price only after the user has experienced real decision value.

## Model 4 — Ongoing concierge / adviser substitute

For users who value human judgment and high-touch research:

- monthly / quarterly professional intelligence retainer;
- likely competes with mentoring / coaching / strategy support rather than software.

This is a valid business even if autonomous SaaS never becomes the dominant model.

---

# 10. Pricing interpretation

Public comparables currently show three qualitatively different willingness-to-pay bands:

1. generic individual decision support: low consumer / productivity pricing;
2. human professional mentoring / career support: roughly low hundreds per month, with higher expert tiers;
3. authority / personal-brand strategic builds: hundreds to several thousand dollars as one-time projects.

This supports testing a paid professional transition episode, but **does not validate any exact ProofMiner price**.

Price must be updated by actual payment / refusal behavior.

---

# 11. Customer experience model

The strongest first-session experience is not a generic dashboard.

## Entry

Recognize the live inflection point:

> "What are you trying to change about how the market sees / chooses you right now?"

## Freeze before-state

Capture:

- current representation;
- actions already planned;
- resources already intended;
- important assumptions;
- decision boundary.

## System work

The system should research / reconstruct what the user should not have to manually populate.

## Decision object

Return one live consequential decision with:

- what changed in the model;
- what gets resources;
- what waits;
- what is blocked/premature;
- evidence / uncertainty;
- explicit contestability;
- trigger for revisiting.

## After action

Capture execution and outcome with minimum friction.

## Next visit

Do not reopen with a generic dashboard if a trigger exists.

Open with:

> **"Since the last decision, X changed. This may affect Y. Review?"**

The product should feel like a longitudinal adviser with memory and evidence, not a journaling habit.

---

# 12. Competitive differentiation — revised

The defensible hypothesis is not any single feature.

It is the following system behavior:

> **A domain-grounded professional transition decision system that freezes the user's prior representation and allocation, researches external market state, makes a contestable allocation decision, records actual execution/outcomes, and uses only transferable longitudinal evidence to improve later decisions while preserving user authorship.**

Potentially distinctive clauses that require FIELD validation:

- external market research as part of the decision state;
- counterfactual representation + allocation before advice;
- explicit user authorship / contestability;
- resource allocation rather than generic verdict/scoring;
- outcome-linked lineage;
- transferability-gated use of personal history;
- event-driven reactivation rather than engagement maximization.

If users do not value these distinctions, collapse the architecture.

---

# 13. New kill conditions

## Kill monthly subscription as default if

- active episodes are intense but separated by long quiet periods;
- users repeatedly say `nothing to decide this month`;
- monitoring without integrations rarely changes a decision;
- users happily pay per episode / review but resist ongoing billing;
- pauses/reactivations produce healthier economics than forced continuous subscription.

## Kill long-term memory as moat if

- prior history rarely changes later recommendations;
- useful history can be reconstructed cheaply from a fresh intake;
- transferability restrictions eliminate most prior history;
- remembered history introduces more stale assumptions than useful signal.

## Kill Professional Market Position wedge if

- users' urgent paid job is mostly execution/content production;
- decisions do not cluster enough during transitions;
- market-position outcomes are too slow/noisy for learning;
- a narrower subproblem shows stronger willingness-to-pay and learning density.

## Kill Personal Decision Intelligence category language externally if

- target buyers do not understand it quickly;
- it increases explanation cost without improving willingness-to-pay;
- the category encourages comparison to cheap generic decision apps.

The architecture can remain even if the label disappears from marketing.

---

# 14. Highest-value FIELD questions

Ordered by information value:

1. **Will the ICP pay a meaningful amount after experiencing one real decision change?**
2. **Does a professional transition produce a second consequential decision soon enough for continuation value?**
3. **Does prior lineage materially improve decision #2 compared with a fresh analysis?**
4. **Is the relevant history transferable, or mostly stale/context-specific?**
5. **Do users prefer active-episode pricing, per-decision pricing, or ongoing subscription after experiencing the product?**
6. **Does the user describe the job as market-position / opportunity decisions rather than authority-building?**
7. **Can outcome capture happen with low enough friction to sustain the learning loop?**

---

# 15. Governance outcome

## O recalled

User O and Business O were separated.

## Target state

A viable product must create material professional decision value, preserve authorship, learn safely from transferable history, and monetize in a way that matches the natural frequency of the decision episode.

## Invalidated assumptions

- `monthly subscription` is not the default commercial shape;
- `authority` should not be mandatory customer problem language;
- `more memory` is not automatically more long-term value;
- `monitoring` is not real retention value without a signal channel;
- `one-year relevance` requires selective transferability and versioned state, not mere context retention.

## Current best model

```text
Personal Decision Intelligence architecture
→ Professional Market Position domain
→ Professional Transition Episode
→ paid active engagement
→ persistent versioned lineage
→ natural trigger / reactivation
→ new episode or paid decision review
```

## Outcome

**REPLAN → FIELD**

No further internal category / pricing refinement is justified before paid and longitudinal evidence.

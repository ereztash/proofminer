# First Session Flow v3.2 — Conscious Pain → Counterfactual → Allocation Decision

## Purpose

This is not visual design.

It defines the minimum first-session experience that must be represented in the next low-fidelity FIELD instrument before another high-fidelity UI or production build.

The flow is subordinate to:

1. `docs/TELOS_GOVERNANCE.md`
2. `docs/UX_TRANSITION_CONTRACT.md`
3. `docs/RESOURCE_REALLOCATION_CONTRACT.md`
4. `docs/DEFINITION_OF_DONE.md`

The material change from v3.1 is that the product must capture what the user would otherwise do **before** strategic advice is revealed.

---

# Primary first-session transition

```text
A1
"I know I need to build authority,
and I have plausible things I could do,
but I do not know where my limited resources should go first."

        ↓

B
Grounded Allocation Decision
```

The Authority Map explains and navigates B. It is not B by itself.

The user should leave able to explain:

- what they want to become known for;
- by whom;
- what they had planned to do without the product;
- what main gap was found;
- what changed in their plan;
- what receives resources first;
- what is delayed / stopped / added / reordered;
- why;
- what can happen in parallel;
- what evidence could change the allocation again.

---

# Design invariant

At every state the user should understand, in this order when relevant:

1. why this matters to the problem they came with;
2. what decision is being improved;
3. what the system needs from them now;
4. the bottom line;
5. what changed in their allocation;
6. why;
7. optional deeper reasoning.

Internal sophistication must not outrank the conscious pain or the live allocation decision.

---

# State 0 — Problem recognition

## User sees

A statement equivalent in function to:

> **There are dozens of ways to build authority. The hard part is knowing which ones deserve your effort now — and which ones do not yet.**

Exact copy is a hypothesis.

## Primary action

> **Help me decide what to do first**

## Pass question

Before clicking:

> "What problem do you think this product is trying to solve for you?"

---

# State 1 — Authority direction

Only after recognition does the system ask:

> **I want to become known for ______.**

Natural language is allowed.

The system forms an initial AuthorityGoal hypothesis.

---

# State 2 — Desired real-world consequence

Ask only when the answer can change audience strategy or resource allocation.

Possible outcomes:

- warm client inquiries;
- career opportunities;
- invitations / collaborations;
- professional influence / recognition;
- another concrete consequence.

---

# State 3 — Stated counterfactual plan

This state MUST occur before strategic advice, audience recommendation, diagnosis or route reveal.

## User sees

A prompt equivalent to:

> **Before I recommend anything: if this product did not exist, what would you actually do in the next 30 days to build this position?**

Use the user's real decision horizon when 30 days is inappropriate.

Start with natural language. Do not force project-management detail.

The system extracts candidate actions and, only when material, asks lightweight follow-ups for:

- order / priority;
- approximate hours;
- approximate cash commitment;
- other scarce commitments;
- why the user thinks each action matters;
- confidence that the action is right now.

## Critical rule

Do not suggest candidate actions while collecting the baseline.

The baseline is a **stated counterfactual**, not objective causal truth.

---

# State 4 — Minimum starting data

Now the product asks only for data capable of challenging or confirming a live allocation decision.

Possible routes:

- LinkedIn / profile;
- CV;
- website;
- case / testimonial / document;
- guided authority interview;
- consented public-footprint research.

Each route explains which decision it could improve.

Example:

> "Your LinkedIn profile can test whether rewriting the profile is actually the bottleneck, or whether the missing piece sits earlier."

Data volume is never progress by itself.

---

# State 5 — Person + field reconstruction

The system develops provisional Person and Field models.

It should explicitly evaluate the user's baseline actions against:

- authority assets;
- current perceived-identity evidence;
- field expectations;
- audience options;
- dependencies;
- opportunity costs;
- transferability;
- uncertainty.

Do not expose a large analytics dashboard merely to prove work is happening.

---

# State 6 — Audience-path recommendation

Bottom line first:

> **If I were choosing where to build first, I would start here.**

Do not force three paths.

Ask one discriminating question only when it can change a material allocation decision.

---

# State 7 — Strategic diagnosis

Example:

> **Your main gap is not visibility. It is that the method behind your results is not yet legible.**

Then show:

- strongest current advantage;
- primary limiting gap;
- which baseline-plan assumptions this challenges;
- what supports the interpretation.

Secondary affordance:

> **How did you reach this?**

---

# State 8 — Allocation Delta / magic moment

Before showing the full map, make the recommendation relative to the user's own baseline plan.

Example:

```text
YOU PLANNED
• 12 posts — ~20h
• podcast setup — ~15h + cash
• website rewrite — ~10h

I WOULD CHANGE
KEEP      → some useful distribution work
DELAY     → podcast until a flagship asset exists
REDUCE    → website rewrite until positioning is clearer
ADD FIRST → extract recurring methodology from 3 real cases
```

For every material change show:

- what changed;
- why;
- prerequisite / opportunity-cost logic;
- uncertainty.

Do not call delayed/stopped resources "saved" yet.

---

# State 9 — Authority Map

Now show the dependency graph that explains the allocation decision.

It must distinguish:

- available now;
- sequential;
- parallel;
- blocked;
- premature;
- complete / learned;
- unlocks.

The map is a strategic hypothesis, not deterministic truth.

---

# State 10 — Highest-leverage action

One action dominates.

Show:

### What receives resources now
Specific action.

### Approximate commitment
When useful, reflect the resource envelope already discussed.

### Why now
What gap it resolves and which alternative work it displaces.

### What it unlocks
Dependencies that become available afterward.

### What not to fund yet
Name tempting premature work when decision-relevant.

---

# State 11 — Progressive data unlock

New information is requested only when it can change a live allocation decision.

Prompt structure:

> **One piece of information could change whether X stays delayed or becomes available.**

Then explain what information and why.

---

# State 12 — Execution bridge

Turn the allocation decision into action without forcing all execution into the product.

Capture intended revised allocation:

- what action;
- intended resource commitment;
- order;
- what will not be done yet.

---

# State 13 — Return signal + re-plan

After action / observation, capture:

- what was actually done;
- actual resources spent when reasonably knowable;
- relevant market signal;
- attribution uncertainty;
- what new evidence was learned.

If the allocation changes, explain why.

A prior `STOP` / `DELAY` can become `START`; an `ACCELERATE` can be reduced.

The system receives credit for evidence-sensitive reallocation, not stubborn consistency.

---

# Persistent project navigation — low-fidelity hypothesis

Secondary functions may include:

### Now
Current allocation decision + highest-leverage action.

### Map
Dependencies and route.

### Assets
Evidence, methodology, experience, perspective, relationship/distribution and market-response assets.

### Field
Audience, authorities, norms, comparable journeys and opportunities.

### Learning
Baseline plans, allocation changes, actual actions, signals and replans.

Names and navigation remain hypotheses.

---

# What the first session must NOT contain

- solution-first entry;
- recommendation before counterfactual baseline;
- suggested baseline actions that contaminate the counterfactual;
- a map presented as sufficient proof of value;
- "hours saved" claims because the product stopped something;
- universal authority score;
- framework chooser;
- generic content calendar;
- bulk-upload requirement;
- fake three-choice theater;
- social posting as the universal default;
- meaningless completion percentage.

---

# Low-fidelity acceptance questions

After leaving the interface, test without returning to the screens:

1. What problem is the product for?
2. What did you say you would have done without it?
3. What does it think you should change in that plan?
4. Which action receives resources first?
5. What was delayed, stopped, reduced, reordered or added?
6. Why?
7. What can happen in parallel?
8. What is blocked versus merely premature?
9. Which additional information could change the allocation?
10. What was observation, your own counterfactual, system inference and recommendation?
11. What later evidence should make the system revise its decision?

If these cannot be answered, do not solve the problem with visual polish.

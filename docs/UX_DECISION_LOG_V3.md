# UX Decision Log v3

## Purpose

This log records founder decisions already made in product language rather than forcing UX terminology onto the decision-maker.

It separates:

- **DECIDED** — treat as current product direction;
- **HYPOTHESIS** — reasonable current default, but field-testable;
- **OPEN / DEFERRED** — do not let design silently decide it.

All entries remain subordinate to Telos Governance.

---

# Entry and value

## DECIDED — user must understand the gain immediately

The first seconds should make the pain/value legible before presenting product mechanics.

Working user condition:

- user already understands that professional authority matters;
- user struggles to turn existing experience/assets into a coherent authority-building system that can produce warm inbound or meaningful opportunities.

The product should not open with ontology, analytics, a generic dashboard, or a demand to upload everything.

## DECIDED — first substantive project statement

The user begins from an intention equivalent to:

> "I want to become an authority in the field of ____."

Exact wording remains copy, not doctrine.

## OPEN / DEFERRED — exact first-screen promise

The product must communicate outcome before mechanics, but exact headline/value proposition should be tested in low-fidelity work.

---

# Audience selection

## DECIDED — do not outsource audience strategy to the user

After the authority field is named, the system proposes audience paths.

## DECIDED — combine C + D logic

Candidate audiences are generated from the intersection of:

- current assets / right to speak;
- market need;
- commercial/career potential;
- likely speed / credible distance.

The product then presents strategically different path roles:

- natural path;
- commercial path;
- fast path.

These do not have to be three different audiences.

## DECIDED — recommend when possible

If one option dominates, recommend it.

If two options are materially close, ask one question that can discriminate between them.

Do not create choice theater.

## HYPOTHESIS — allow "someone else"

The user should be able to reject the suggested audiences and specify another.

---

# Product structure

## DECIDED — persistent project, local wizard

The overall experience should feel like a persistent strategic project that accumulates learning.

Individual tasks/onboarding steps may use a wizard so the user sees only the next relevant decision.

## DECIDED — most complexity is hidden

Visible by default:

- direct value;
- necessary input;
- current conclusion;
- next action.

Deeper models, rationale and optional controls appear through progressive disclosure.

## DECIDED — avoid cognitive overload

Do not present the user with a large set of equivalent actions/options.

The system should narrow and recommend.

The number of options is determined by decision value, not a rigid "three options" rule.

---

# Attention hierarchy

## DECIDED — bottom line first

The experience should follow a hierarchy equivalent to:

1. bottom line;
2. meaning / why it matters;
3. what to do now;
4. optional deeper explanation.

The UI should not literally label these "What / So what / Now what" unless later testing justifies it.

## HYPOTHESIS — layered typography can support hierarchy

Opacity, type scale, whitespace and depth may help create visual hierarchy, but essential information must remain legible and accessible.

## OPEN / DEFERRED — final visual grammar

Exact typography, color, layering and map visual metaphor should be determined only after the information hierarchy and low-fidelity route are validated.

---

# Knowledge acquisition

## DECIDED — input depends on the strategic question

The product may learn from:

- LinkedIn;
- CV;
- public search results;
- websites;
- existing content;
- physical/digital assets;
- client/referral history;
- conversation/interview;
- user ideas and recollection.

## DECIDED — guided interview is a first-class source

The product should be able to extract latent methodology from experience rather than expecting users to have already articulated it.

A useful mental model is an "authority couch": the expert temporarily becomes the client and is interviewed about how they actually think and work.

## DECIDED — data requests must be calibrated

Do not ask for data merely because more data could be useful.

Ask when the data can change a recommendation, reduce a meaningful uncertainty or unlock a capability.

## DECIDED — previous client-acquisition paths are strategically important

The system should learn how prior clients/opportunities arrived when available, because existing market response can reveal what the user is already known/trusted for.

## DECIDED — user approves persistence

Accumulating memory is part of the value, but the user must retain control over storing information.

## OPEN / DEFERRED — public-search consent mechanics

Exact rules for when the product automatically researches the user's public footprint versus asks permission should be specified before implementation.

---

# Strategic output

## DECIDED — adaptive strategic model

The dashboard should show the strategic model best suited to moving this specific user from current position to desired authority position.

SWOT is an example for a particular mapping need, not a universal template.

## DECIDED — frameworks are secondary

The user primarily sees the conclusion and map.

An affordance equivalent to "How was this map built?" can expose the frameworks, assumptions and evidence.

## DECIDED — serial versus parallel structure is critical

The map must distinguish:

- what must happen first;
- what can run in parallel;
- what is blocked;
- what is premature;
- what unlocks what.

This is a core part of the product's strategic value.

## DECIDED — highest-leverage next move must dominate

The main view should not merely report status.

It should direct the user toward the current highest-leverage action.

---

# Assets and gamification

## DECIDED — assets are broader than social proof

The system should surface evidence, methodology, experience, perspective, distribution/relationships and prior market response.

## DECIDED — gamification should incentivize useful data contribution

But the reward is not points for uploading.

It should communicate what strategic capability or clarity the new data unlocked.

Examples:

- repeated client-language analysis unlocked;
- external validation now available;
- methodology pattern now testable;
- a previously blocked route node is now actionable.

## OPEN / DEFERRED — whether any points/levels exist at all

Do not add conventional points, streaks, badges or percentage completion until field evidence shows they improve the authority journey rather than distract from it.

---

# Trust and scoring

## DECIDED — system trust begins from grounded user/source data

The system must make clear what comes from the user, what comes from external sources and what is inference.

## DECIDED — do not make raw numbers the primary language

Visual explanations may represent strength, progress or uncertainty, but should not pretend that a universal numerical authority score exists.

## HYPOTHESIS — color may reinforce status, not carry it alone

Use redundant cues such as text, position, length, labels or symbols when meaning matters.

---

# Empty state

## DECIDED — no empty dashboard

If the user has no materials, the product begins a guided discovery / interview flow and progressively fills the strategic model.

---

# Learning and return use

## DECIDED — authority building is a loop

The product should connect:

- authority strategy;
- authority asset/action;
- use in the world;
- market response / lead / opportunity;
- learning;
- updated strategy.

## DECIDED — the next visit benefits from the prior visit

Persistent learning is part of the product, not a convenience feature.

---

# Explicitly invalidated UX assumptions

The following assumptions from earlier prototypes are no longer allowed to define the product:

- top-level dashboard of proof scores;
- Decision Moment as the top-level project;
- a large evidence inventory as the core home screen;
- universal weighted scoring;
- content generation as the primary product job;
- requiring the user to understand ProofMiner terminology before value;
- treating a successful Vercel Preview as evidence that UX architecture is ready.

---

# Founder decisions still needed before high-fidelity design

These do not necessarily block low-fidelity exploration, but design must not silently settle them:

1. Operational meaning of "authority achieved enough" for a project.
2. Whether desired business/career outcome is asked explicitly in the first session or inferred and confirmed later.
3. Exact consent interaction for automatic public-footprint research.
4. Whether the map's default visual metaphor is timeline, dependency graph, path/roadmap, or another representation.
5. How much competitive/expert benchmarking is visible on the home view versus a secondary view.
6. How the system communicates that a strategic recommendation changed because of new evidence without making the product feel unstable.

These should be resolved through founder decision and/or low-fidelity field evidence according to the Telos Governance Loop.
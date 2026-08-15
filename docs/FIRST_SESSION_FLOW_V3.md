# First Session Flow v3 — Low-Fidelity Product Architecture

## Purpose

This is not visual design.

It defines the minimum end-to-end first-session experience that should be represented in a low-fidelity prototype before another high-fidelity UI or production build.

The flow is subordinate to Telos Governance and the UX Decision Log.

---

# Design invariant

At every state the user should understand:

1. why this matters;
2. what the system currently thinks;
3. what the one useful next action is.

The user should not need to understand the full authority model.

---

# State 0 — Value + authority intention

## User sees

A concise promise explaining the pain/gain, followed by one dominant input equivalent to:

> **I want to become known as an authority in ______.**

Do not open with a generic dashboard.

Do not require account configuration, evidence taxonomy or framework selection before this moment.

## User provides

`authority_domain`

Natural language is allowed.

## System learns

Initial AuthorityGoal domain hypothesis.

## Progress condition

The system can interpret the field well enough to begin audience/field discovery, or asks one narrowing question if the field is too broad to generate meaningfully different strategies.

---

# State 1 — What should authority create for you?

This question is asked only when the answer is not already sufficiently inferable and can change audience-path selection.

## User sees

A small set of outcome intentions in ordinary language, for example:

- more warm client inquiries
- stronger career opportunities
- invitations / stages / media
- professional influence / recognition
- something else

Exact options depend on ICP and should be field-tested.

## Why this exists

The system cannot define a meaningful "commercial path" or career path without understanding what value the user wants authority to unlock.

## System learns

`desired_business_or_career_outcomes[]`

---

# State 2 — Give the system a starting point

## User sees

A low-friction choice, not a data-management screen.

Possible routes:

### Use what already exists

- connect / paste LinkedIn
- upload CV
- provide website
- provide another source

### Let the system learn through conversation

- guided authority interview

### Research my public footprint

- only through a consented public-research path

## Key UX rule

The product explains what it will be able to learn from the selected source.

Examples:

> "Your LinkedIn profile helps me see what you already signal publicly."

> "A CV helps me find experience you may not currently be using as authority capital."

> "A short interview can surface methodology that has never been written down."

## Progress condition

Enough information exists to create an initial PersonState and begin FieldModel research.

---

# State 3 — Initial field + person reconstruction

This is primarily a system-working state.

Do not expose an analytics dashboard while the system is processing.

## System works on two models in parallel

### Person model

- current experience / assets
- apparent public associations
- possible methodology / perspective assets
- existing proof / validation
- existing authority surfaces
- current distribution / relationships
- client acquisition patterns if known

### Field model

- relevant audiences
- recognized authorities
- what they are known for
- points of parity / category expectations
- meaningful opportunities for differentiation
- channels / intermediaries
- comparable journeys where useful

## User-facing progress

Prefer meaningful progress statements over fake percentage completion.

Example:

> "I found enough to compare where your current experience gives you the strongest right to speak."

---

# State 4 — Audience path recommendation

## User sees

A bottom-line recommendation first:

> **If I were choosing where to build first, I would start here.**

Then show why.

Potential strategic path roles:

- Natural
- Commercial
- Fast

But do not force three distinct cards if the same audience dominates multiple roles.

## For each meaningful alternative show only

- who the audience is;
- why the user has / lacks a right to speak there;
- why the audience matters;
- what makes the route easier/harder;
- the key tradeoff.

## If evidence is tied

Ask one `DiscriminatingQuestion`.

Example:

> "Two routes are almost equally strong. Which kind of work do you actually want more of next year?"

## Primary action

Accept recommended route.

Secondary action

Choose another route / specify another audience.

---

# State 5 — Authority Project created

This is the first meaningful "project" moment.

## User sees

A compact project header equivalent to:

> **Become known for:** [desired association]
>
> **Among:** [selected audience]
>
> **So that:** [desired outcome]
>
> **Where:** [authority surface(s), if material]

The system should communicate that this project will accumulate learning.

The user confirms persistence / storage according to the consent design.

---

# State 6 — Strategic diagnosis

## User sees bottom line first

Example structure:

> **Your main gap is not expertise. It is that the market cannot currently see the method behind your results.**

Then:

- strongest current advantage;
- main limiting gap;
- why this diagnosis matters;
- what evidence/data supports it.

## Secondary affordance

> "How was this map built?"

This opens the selected strategic lenses, assumptions, evidence and uncertainty.

Do not ask the user to choose SWOT, positioning matrix or other professional frameworks.

---

# State 7 — Authority Map

## The map answers

- where you are;
- where you are trying to get;
- what can begin now;
- what is sequential;
- what is parallel;
- what is blocked;
- what is premature;
- what each action unlocks.

## Required visual semantics

Even before final visual design, the prototype must make these states distinguishable without relying on color alone:

- available now
- in progress
- parallel
- blocked / prerequisite missing
- premature
- complete / learned

## Important

The map is not presented as deterministic truth.

The user should be able to inspect why a dependency exists when it matters.

---

# State 8 — Highest-leverage action

Above or within the map, one action dominates.

Example:

> **The thing I would do first:** interview you on three management cases and extract the method that repeats across them.

Then show:

### Why now

What gap it resolves.

### What it unlocks

Which map nodes become available afterward.

### What I need from you

Only required input.

### Primary action

Start.

---

# State 9 — Progressive data unlock

When new data would materially improve the route, the product may surface a small opportunity rather than a generic "complete your profile" progress bar.

Example:

> **One thing could sharpen this map.**
>
> If you add how your last five clients found you, I can test whether the market already associates you with a narrower problem than your profile suggests.

The user sees the capability unlocked, not points for uploading.

---

# State 10 — First action completion and return loop

After an action is performed or an artifact is deployed:

## Product records

- what was done;
- what was produced;
- where it was used;
- what the system expected to learn.

## Later return prompt

> **What happened after this?**

Possible signals depend on the action.

The product then explains if and how the map changed.

Example:

> "Three referrals described you using the same phrase. I am increasing confidence that this is already part of your perceived identity, so the next step changed from proving it to making it more visible."

Do not present this as causal certainty.

---

# Persistent project navigation — low-fidelity hypothesis

The full product should feel like one persistent Authority Project.

The minimum secondary information architecture to prototype is:

### Map

Current diagnosis, route and next action.

### Assets

Evidence, methodology, experience, perspective, distribution/relationship and market-response assets.

### Field

Audience, recognized authorities, category expectations, comparable journeys and strategic opportunities.

### Learning

Actions performed, signals observed and changes made to the map.

This navigation is a **HYPOTHESIS**. The final number/names of sections should be tested; the semantic functions should not disappear silently.

---

# What the first session must NOT contain

- universal authority score;
- evidence score dashboard;
- generic content calendar;
- large action library;
- framework chooser;
- "upload everything" requirement;
- empty dashboard when no data exists;
- three fake choices when one recommendation is clearly stronger;
- social-media posting as a universal first action;
- a completion percentage that has no strategic meaning.

---

# Low-fidelity acceptance questions

Before visual polish, test whether a target user can answer without facilitator help:

1. What is this product going to help me achieve?
2. Why did it recommend this audience?
3. What does it think my main strategic gap is?
4. What should I do first?
5. Why should I do that before something else?
6. What can happen in parallel?
7. What information would improve the map, and why?
8. What did the system infer versus what did it observe?
9. What will the product remember next time?
10. If I do the recommended action, how will the system learn whether to change course?

If these cannot be answered, do not solve the problem with visual polish.
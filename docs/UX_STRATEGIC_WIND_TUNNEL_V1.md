# UX Strategic Wind Tunnel — v1

Date: 2026-08-16

## Purpose

Apply the Strategic Wind Tunnel recursively to ProofMiner's own interface before spending real-user attention on a UI that represents an obsolete product model.

The UI is not decoration. It is an intervention in the user's representation and therefore sits below Telos Governance but above implementation details.

---

# UX telos

The interface should help a professional at a consequential transition move from:

> "There are many plausible things I could do and I am too close to the situation to know what deserves resources now."

into:

> "I can see the current decision, the assumption behind my prior plan, what deserves resources now, what should wait, what remains unknown, and what evidence would make me change course — without surrendering authorship to the system."

The UI must also preserve a clean pre-intervention baseline for FIELD learning.

---

# Current UI candidate

The current deployed UI is the legacy ProofMiner v2 flow:

```text
Decision Moment
→ One Source
→ Evidence / Claim
→ Draft / Truth Check
```

It is coherent for the old proof-selection product but structurally misaligned with the current Professional Transition telos.

---

# Structural kill tests

## K1 — Wrong top-level object

Current UI asks for a decision moment in order to choose proof.

Current product needs a `ProfessionalTransitionProject` and a live resource-allocation decision.

**Result: FAIL / REPLAN.**

## K2 — Premature solution language

Current interface explains ProofMiner's evidence mechanism before the user has expressed the professional transition in unprompted language.

This contaminates the struggling-moment language we now need to learn from FIELD.

**Result: FAIL.**

## K3 — Wrong action space

The legacy flow terminates in a proof move / content draft.

Current action states must include at least:

- NOW / ACCELERATE;
- KEEP;
- NOT YET / DELAY;
- REDUCE / STOP;
- LEARN FIRST;
- ADD.

**Result: FAIL.**

## K4 — No baseline allocation

The existing UI does not freeze what the user would actually do without the system and where time / money / attention would go.

**Result: FAIL.**

## K5 — No representation baseline

The existing UI does not preserve the user's current bottleneck / causal model before intervention.

**Result: FAIL.**

## K6 — No routed characterization

The interface has no way to exploit the user's own professional process or explicitly skip self-application when it adds no value.

**Result: FAIL.**

## K7 — Weak contestability for current decision job

The legacy correction controls contest evidence interpretation, but the current product must let the user contest the strategic criterion, assumption, boundary and allocation itself.

**Result: FAIL.**

---

# Competing UX strategies

## Strategy A — Dashboard-first

Open with a persistent dashboard of goals, actions, resources and evidence.

### Strength

Strong for returning users and longitudinal value.

### Failure risk

Bad first-use experience. Requires state the system does not yet have; invites empty-dashboard syndrome and makes FIELD baseline contamination likely.

### Verdict

**Reject for first session; preserve as later-state candidate.**

---

## Strategy B — Chat-first

Open as a general AI conversation and let the model discover everything through dialogue.

### Strength

Flexible and low schema burden.

### Failure risk

Hides the product mechanism, makes baseline contamination hard to police, encourages verbose meandering, and reduces decision lineage to chat history.

### Verdict

**Reject as canonical first-session structure. Conversation may exist inside bounded steps.**

---

## Strategy C — Progressive Decision Episode

Use a short sequence that preserves the before-state, routes characterization only when useful, and terminates in a contestable decision board.

Canonical first-session path:

```text
1. TRANSITION
   What is changing professionally now?

2. BASELINE
   What would you do without us?
   Why do you think that will work?
   What scarce resource is at stake?

3. MIRROR / CHARACTERIZATION — only when useful
   What do you do for others?
   Apply one useful professional lens to your own transition.
   Show what maps and what may not.

4. DECISION BOARD
   NOW
   NOT YET
   LEARN FIRST
   + why / evidence class / reversal trigger

5. COMMIT / CONTEST
   What will you actually do?
   What do you reject?
   What would change your mind?
```

### Verdict

**SELECT.**

---

# Scenario stress tests

## Scenario 1 — Busy expert, simple decision

Risk: forced characterization becomes performative and slow.

Required UI behavior:

- allow direct baseline → decision when simple structure is sufficient;
- self-application is offered/triggered only when it can change the decision.

## Scenario 2 — Expert trapped in professional lens

Risk: marketer diagnoses everything as marketing; project manager treats the business as a project.

Required UI behavior:

- label self-application as a lens, not truth;
- expose a `where this analogy may fail` block;
- make competing/external evidence visible.

## Scenario 3 — User wants execution, not decision support

Risk: user experiences the product as extra thinking before the work they actually want done.

Required UI behavior:

- first screen must reveal the struggling moment without teaching the category;
- later FIELD must test whether decision support is the paid job or a substitute service should be offered.

## Scenario 4 — Recommendation mostly preserves existing plan

Risk: user perceives no value because delta is small.

Required UI behavior:

- value cannot be represented by amount of change;
- show `KEEP` when the prior plan survives stress testing and explain why;
- do not manufacture surprising recommendations.

## Scenario 5 — High uncertainty

Risk: UI pressures the system to produce a confident action because every screen needs a result.

Required UI behavior:

- `LEARN FIRST` is a first-class outcome;
- missing information is tied to the decision it can change;
- uncertainty remains visible.

---

# Evidence / trust hierarchy in UI

User-facing evidence labels should be simple and non-academic:

- **ממך** — stated by the user / their history;
- **מהשטח** — externally observed evidence;
- **מסקנה** — system inference;
- **השערה לבדיקה** — scenario / synthetic / unverified hypothesis.

Never display a synthetic stakeholder statement as if it were buyer research.

---

# Selected experience architecture

## Screen 1 — Transition

Primary question:

> **מה משתנה אצלך מקצועית עכשיו?**

Secondary helper:

> ספר על שינוי אמיתי שאתה מנסה לייצר — לקוחות אחרים, תפקיד אחר, הצעה חדשה, קהל חדש או שלב חדש בעסק.

Do not mention Personal Decision Intelligence, authority, characterization or frameworks.

Optional fields:

- what the professional does;
- desired state / consequence.

## Screen 2 — Before us

Headline:

> **אם לא היינו כאן — מה היית עושה ב־30 הימים הקרובים?**

Capture:

- planned actions;
- approximate time / money commitment;
- why the user thinks it will work;
- current bottleneck hypothesis.

This screen is explicitly marked as `לפני ההמלצה`.

## Screen 3 — Professional mirror

Headline:

> **בוא נבדוק רגע דרך העיניים המקצועיות שלך.**

Prompt:

> אם אדם במצב שלך היה מגיע אליך כלקוח — מה היית בודק קודם?

Then show a provisional extracted lens and ask whether to use it.

The UI must state:

> זו עדשה, לא תשובה. נבדוק גם איפה היא לא מתאימה.

Allow skip.

## Screen 4 — Decision board

Primary visual object is not a report. It is a three-lane decision board:

### לעשות עכשיו

One or two actions with resource commitment.

### לא עכשיו

Plausible work intentionally delayed / reduced / stopped, with prerequisite.

### לברר לפני שמחליטים

Only decision-relevant unknowns.

Each card can reveal:

- why;
- evidence source class;
- dependency;
- what would reverse the decision.

## Screen 5 — User authorship

Before completion ask:

- what will you actually do first?
- what in this recommendation do you reject / change?
- what evidence would make you reverse course?

The system records the user's final commitment, not merely its own recommendation.

---

# Visual strategy

The UI should feel like a calm strategic workspace, not a chatbot and not a consulting slide deck.

Principles:

- high information hierarchy, low ornament;
- warm neutral canvas + dark ink + restrained green/amber semantic accents;
- large type only for the current decision, not for marketing copy;
- cards represent decision objects, not generic content containers;
- progressive disclosure for rationale / evidence;
- show one dominant task per screen;
- avoid dense progress taxonomy; use a simple four-step episode indicator;
- mobile layouts preserve the same decision hierarchy rather than stacking decorative panels.

---

# UX FIELD_DEBT

The redesign cannot internally resolve:

1. does the first question produce the buyer's real struggling-moment language without prompting?
2. is the 30-day baseline easy enough to answer without feeling like homework?
3. does the professional mirror reveal a material distinction or merely feel clever?
4. do users understand `NOT YET` as a valuable decision rather than missing functionality?
5. does `LEARN FIRST` feel trustworthy or evasive?
6. can users explain the decision board in their own words?
7. does the contestability step preserve authorship or add friction?
8. does the redesigned flow create enough perceived value to justify the paid offer?

---

# Wind Tunnel outcome

`REPLAN → IMPLEMENT → FIELD`

The current legacy UI cannot represent the present product telos and should not be cosmetically refined.

Build one coherent progressive-decision prototype, deploy it to a Vercel Preview, verify structural/runtime behavior, then expose it to the next real FIELD case. Do not create multiple polished visual variants before the core experience survives.

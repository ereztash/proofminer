# METHOD — how authority is measured

This document is the specification the engine implements. Every number the
product shows a user must be derivable from what is written here.

## Honesty rules (binding on all engine code)

1. **No score without inputs.** A layer with no observations reports
   `score: 0, confidence: 0` and says which input is missing. It never
   guesses a plausible number.
2. **Confidence travels with every score.** Anything computed from fewer than
   the stated minimum observations is marked low-confidence in the data model
   and in the UI.
3. **No claim the user did not supply.** Draft generation may reframe, order,
   and connect the user's own proof text. It may never introduce a fact,
   number, client, or outcome that is not present in a cited proof unit.
   **Mechanically enforced for:** magnitudes (digits and words) and named
   entities, plus a warning on superlatives. **Not mechanically enforceable:**
   a correct number attached to the wrong subject, an invented title made of
   ordinary words, a claim stitched across two separately-true proofs. The UI
   states this limit rather than implying the check verifies truth.
4. **Provenance is not optional.** Every generated artifact carries the IDs of
   the proof units it is grounded in.
5. **Priors are labelled as priors.** This applies to *every* constant in the
   method, not only the nine dimension weights: the foundation/built splits,
   the Liebig gate width, the `DEVELOPED` and band thresholds, the layer
   composition mixes, the saturation half-points, the reception anchors and the
   decay half-lives are all informed guesses. The dimension weights are the
   only ones a user's own data can move. The band boundaries are the one set
   calibrated against measurement — against the score distribution the engine
   actually produces, not against round numbers.
6. **Demo data is marked in the data itself**, not only in the UI, and marked
   proof is excluded from calibration.

## The six measurable layers

Authority is modelled as a stack. Each layer is scored 0–100 with a
confidence 0–1.

| # | Layer | Question it answers | Primary observables |
|---|---|---|---|
| L1 | **PROOF** — הון הוכחות | What evidence do you actually hold? | proof units, their scored quality, archetype coverage, decay |
| L2 | **POSITION** — מיצוב | What single claim do you own? | claim specificity, audience specificity, transformation clarity, non-genericity |
| L3 | **ARTIFACT** — תוצר | What have you put into the world? | publish cadence, groundedness ratio, format mix |
| L4 | **RECEPTION** — קליטה | How did it land? | engagement rate vs. own baseline, comment depth, saves |
| L5 | **CONVERSION** — המרה | Who moved? | DMs, calls, interviews, offers, deals |
| L6 | **RECOGNITION** — הכרה | Who vouches for you? | citations, invitations, referrals, features |

L1–L2 are the **foundation**. L3–L6 are **built** standing.

## L1 — proof unit scoring

A source document is a *container*. The atomic object is a **proof unit**: one
claim that can stand alone.

Each proof unit is scored on nine dimensions. Weights below are **priors** and
sum to 100.

| Dimension | Prior | Rationale | Calibratable |
|---|---:|---|:--:|
| `verification` — אימות חיצוני | 18 | A claim someone else made about you outranks a claim you made about yourself. This is the single strongest driver of perceived credibility and the one users most systematically under-supply. | ✅ |
| `icpFit` — רלוונטיות ל-ICP | 16 | Evidence is not good in the abstract. It is good *for an audience with a problem*. Measured as semantic overlap with the user's declared ICP, transformation and offer. | ✅ |
| `outcome` — עוצמת התוצאה | 15 | Did something change in the world? Change verbs plus a stated delta. Distinguishes "I ran a project" from "revenue moved". | ✅ |
| `specificity` — ספציפיות | 13 | Numbers, timeframes, named entities. Concreteness is what makes a claim feel checkable rather than asserted. | ✅ |
| `differentiation` — בידול | 10 | How many people in the ICP's field could say the same sentence? Rare intersections beat strong-but-common claims. | ✅ |
| `falsifiability` — ניתנות לבדיקה | 8 | Could a sceptic check this? A URL, a publication, a named org, a date. **This dimension has no equivalent in any competing tool** and is the main structural defence against hollow authority. | ❌ (integrity floor) |
| `commercialProximity` — קרבה להמרה | 8 | Distance between the proof and the thing being sold or hired for. | ✅ |
| `recency` — עדכניות | 6 | Evidence decays. See decay model below. | ❌ (time-derived) |
| `narrative` — פוטנציאל סיפורי | 6 | Before/after structure, tension, a turn. Determines whether the proof can carry an artifact at all. | ✅ |

### Signals

Dimension scores are computed from a **signal extraction** pass, not from
one regex per dimension. Signals are language-aware (Hebrew and English) and
include: numeric quantities with units (currency, percent, count, duration),
dates and relative time markers, third-party-validation markers, outcome verbs,
before/after contrast markers, credential markers, generic-trait markers,
hedging language, verifiability markers (URL, publication, named org), and
demo markers.

Generic traits ("creative", "strategic", "passionate", "years of experience")
and hedging ("I believe", "kind of") are **negative** signals. They are the
most common thing users write and the least useful thing they can publish.

### Decay

Evidence loses persuasive value at different rates by kind. Modelled as
exponential half-life:

| Proof kind | Half-life | Reasoning |
|---|---:|---|
| `credential` | 1460d (4y) | A degree ages slowly |
| `media` | 540d | A feature or interview stays quotable for a while |
| `outcome` | 730d | A client result ages, but slowly |
| `event` | 365d | A talk is current-season evidence |
| `traction` | 180d | Reach and engagement numbers stale fast |
| `experience` | 1095d | Background context |

The implemented form is an affine remap rather than a floored exponential:

```
factor = 0.35 + 0.65 · 0.5 ^ (ageDays / halfLife)
```

so the tabulated half-life is the half-life of the *decaying component* (65% of
the value), not of the score. At one half-life a proof retains 67.5%, and the
floor is approached asymptotically rather than reached. Stated here because the
simpler formula this table used to describe is not what the engine computes.

## L2 — positioning scoring

The positioning statement is scored on five components: audience specificity,
transformation clarity, claim specificity, offer coupling, and non-genericity
(penalising the "I help X do Y" template and the consultant-noun soup:
*strategic, holistic, innovative, passionate, results-driven*).

## L3 — artifact scoring

- **Cadence**: publishing events over a trailing 8-week window, saturating —
  the model rewards consistency, not volume, and stops rewarding above ~3/week.
- **Groundedness ratio**: fraction of published artifacts carrying at least one
  proof unit ID. This is the product's most opinionated metric: publishing that
  is not grounded in evidence does not raise standing here.
- **Format mix**: diversity across post / comment / case study / talk / long form.

## L4 — reception scoring

Measured **relative to the user's own trailing baseline**, never in absolute
terms. A 400-follower account with 6% engagement is doing better than a
20,000-follower account with 0.4%, and any absolute engagement number would say
the opposite.

Weighted: comment depth > saves > shares > reactions. Reactions are the
cheapest signal available and are weighted accordingly.

Scored against **declared fixed anchors** (`RATE_ANCHOR = 0.05` weighted
engagement rate, or `ABSOLUTE_ANCHOR = 30` weighted engagement when the user did
not report impressions), not against the user's own moving mean. A rate already
normalises for audience size, which was the only reason to avoid absolute
figures; scoring each record against a baseline built from the user's other
records made the layer self-referential, so a uniform improvement was invisible
and publishing a genuine hit *lowered* the score.

Relative-to-your-own-norm comparison still happens, in compounding and
calibration, where that is the question actually being asked.

Locked below 3 reception records. Impressions are optional: records with and
without them are compared only against others in the same mode.

## L5 — conversion scoring

Funnel events weighted by commitment: `dm` 1 → `call` 3 → `interview` 5 →
`proposal` 6 → `offer` 9 → `deal` 10. Scored on trailing 90 days, saturating.

## L6 — recognition scoring

Third-party authority transfer: `citation`, `invite`, `referral`, `feature`,
`endorsement`. Decayed. This is the layer that most distinguishes actual
authority from output volume, and the one no personal-branding tool tracks.

## The Authority Index

```
foundation     = 0.55·L1 + 0.45·L2
built          = 0.30·L3 + 0.25·L4 + 0.25·L5 + 0.20·L6

# Liebig gate — a law-of-the-minimum constraint
effectiveBuilt = min(built, foundation + 25)

index          = 0.45·foundation + 0.55·effectiveBuilt
```

The gate is the mechanism that implements the anti-goal in `TELOS.md`.
Built standing cannot exceed the evidence foundation by more than 25 points.
Publishing harder on a thin base does not raise the index — it triggers a
diagnosis.

### The Visibility Gap — the headline number

```
gap = foundation − built
```

The index is the composite. The **gap** is what the product leads with, because
the gap is the user's own conscious pain expressed as a number (see `UX.md`):

- `gap > 0` — the evidence supports more standing than the person has.
  *"Your evidence supports 72. The world sees 19."*
- `gap < 0` — visibility exceeds the evidence base. The product stops
  recommending publishing and switches to evidence acquisition.

A signed gap is deliberate. Most users of this product will open it with a
large positive gap, and naming that precisely is the entire motivational
mechanism.

### Diagnosis (2×2)

| | built low | built high |
|---|---|---|
| **foundation low** | `STALLED` — start by mining evidence | `HOLLOW` — you are louder than your proof |
| **foundation high** | `BURIED` — you hold evidence nobody has seen | `COMPOUNDING` — scale and convert |

`BURIED` is the original ProofMiner insight, now a formal diagnosable state.
`HOLLOW` is the state the rest of the market actively produces.

### Confidence

The index carries a confidence = weighted mean of layer confidences. Below
0.35 the UI presents the index as an *estimate* and the product's language
changes accordingly.

## Cross-layer integrations

This is the part of the method with no equivalent in competing products. Each
is a directed edge between layers that carries data, not just a UI adjacency.

### I1. L4 → L1 · Compounding (output becomes input)
An artifact that performs meaningfully above the user's baseline **becomes a new
proof unit** of kind `traction`. Reach is evidence. Authority is a system whose
output is its own input, and no tool in this category models that.

### I2. L4 → L1 · Calibration (learn the user's own leverage model)
For each published, grounded artifact we hold the *dimension breakdown* of its
source proof and the *reception score* it earned. With ≥5 such observations the
engine regresses reception on dimensions and shrinks toward the priors:

```
w = prior·(k/(k+n)) + empirical·(n/(k+n)),  k = 8
```

The result is a **per-user leverage model**: which proof qualities actually move
*this person's* audience. The priors stop being the answer and become the
starting point. `falsifiability` and `recency` are excluded from calibration —
they are integrity and time constraints, not preference parameters.

### I3. L2 → L1 · Gap engine (what evidence are you missing?)
Eight proof archetypes are required for a complete case: `OUTCOME`,
`VALIDATION`, `SCALE`, `METHOD`, `CREDENTIAL`, `PEER`, `FAILURE`, `ORIGIN`.
The engine computes coverage against the declared positioning and emits
**acquisition plays** — concrete, dated actions that would create the missing
evidence, ranked by impact ÷ effort. This is the hand-holding mechanism: the
product does not only rank what you have, it tells you what to go get.

### I4. L5 → L2 · Claim validation (drift detection)
What actually converted is compared against the claim the user says they own.
Divergence surfaces as positioning drift — the market is buying something other
than what you are selling.

### I5. L1 decay → L3 scheduling (publish before it stales)
High-value proof approaching its half-life is prioritised in the publishing
queue. Evidence has a shelf life and the plan respects it.

### I6. L6 → L2 · Defensibility lift
Third-party recognition raises the defensibility component of positioning.
Someone else calling you the thing is worth more than you calling yourself it.

## What this method deliberately does not do

- It does not predict virality. Reach is not the goal and the model does not
  pretend to forecast it.
- It does not benchmark the user against other users. There is no leaderboard;
  standing is measured against the user's own evidence base.
- It does not automate publishing or engagement. Platform-side automation is
  both against LinkedIn's terms and against the telos.
- It does not score personality, tone, or "brand voice". Not measurable, not
  load-bearing.

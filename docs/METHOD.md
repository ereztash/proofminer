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
   **Blocks publishing:** magnitudes only — digits and number words — because
   that comparison is exact and blocking on it is fair.
   **Warns but does not block:** named entities and superlatives. Name
   detection is heuristic, and in Hebrew, which has no capitalisation, it is
   weaker still; a check that disabled the primary action over the word
   "Onboarding" trained users to ignore the one check that matters. The UI
   reports how complete the name check could be on the given text.
   **Not mechanically detectable at all:** a correct number attached to the
   wrong subject, an invented title made of ordinary words, a claim stitched
   across two separately-true proofs — and, the widest case, a sentence
   containing no number and no name, which is invented freely and passes.
   The UI states these limits rather than implying the check verifies truth.
4. **Provenance is not optional.** Every generated artifact carries the IDs of
   the proof units it is grounded in, and every proof unit records whether its
   boundaries were found by deterministic splitting or by model-assisted
   extraction.
5. **No claim the user did not write.** Where rule 3 governs what a draft may
   *say*, this governs what may *enter the inventory*. A proof unit's text is
   always a substring of a source document the user supplied. Model-assisted
   extraction chooses spans and never authors them; a candidate that is not
   present verbatim in the source is discarded and counted, and the count is
   shown. Unlike rule 3, this comparison is exact in both directions and has no
   heuristic tier — which is why it blocks unconditionally.
6. **Priors are labelled as priors.** This applies to *every* constant in the
   method, not only the nine dimension weights: the foundation/built splits,
   the Liebig gate width, the `DEVELOPED` and band thresholds, the layer
   composition mixes, the saturation half-points, the reception anchors and the
   decay half-lives are all informed guesses. The dimension weights are the
   only ones a user's own data can move. The band boundaries are the one set
   calibrated against measurement — against the score distribution the engine
   actually produces, not against round numbers.
7. **Demo data is marked in the data itself**, not only in the UI, and marked
   proof is excluded from calibration.
8. **Recall is not evidence.** Rules 3 and 5 both check something the product
   produced against something the user supplied. Neither has anything to say
   about the supplied side, and there is one input class where that gap
   matters: text the user types *now, from memory*, in a box the product put in
   front of them. It passes the verbatim gate trivially — it is present word
   for word in the source, because it **is** the source — so "the client said I
   saved them four months" would enter the inventory and score well, carrying a
   magnitude, an attribution and an outcome. That would make the Visibility Gap
   a number the user can raise by writing a nicer sentence about themselves,
   which is the category this product refuses to be.
   So a memory-elicitation screen may not produce proof units. What the recall
   route (`engine/recall.js`) produces instead is **retrieval tasks with a
   named recipient**: a person who can supply the same fact in their own
   words, in a document. Those records live outside every measured array, no
   layer reads them, and the evidence enters later through the ordinary paste
   box. The invariant is pinned in `tests/engine/recall.test.js`: the whole
   authority computation is byte-identical with and without them.

## The six measurable layers

Authority is modelled as a stack. Each layer is scored 0–100 with a
confidence 0–1.

| # | Layer | Question it answers | Primary observables |
|---|---|---|---|
| L1 | **PROOF** — הון הוכחות | What evidence do you actually hold? | proof units, their scored quality, archetype coverage, decay |
| L2 | **POSITION** — מיצוב | What single claim do you own? | claim specificity, audience specificity, transformation clarity, non-genericity |
| L3 | **ARTIFACT** — תוצר | What have you put into the world? | publish cadence, groundedness ratio, format mix |
| L4 | **RECEPTION** — קליטה | How did it land? | engagement rate against a declared anchor, comment depth, saves |
| L5 | **CONVERSION** — המרה | Who moved? | DMs, calls, interviews, offers, deals |
| L6 | **RECOGNITION** — הכרה | Who vouches for you? | citations, invitations, referrals, features |

L1 is the **foundation**. L3–L6 are **built** standing. L2 is diagnostic: it
reaches the index only by re-ranking the evidence in L1, through the `icpFit`
and `commercialProximity` dimensions.

## L1 — proof unit scoring

A source document is a *container*. The atomic object is a **proof unit**: one
claim that can stand alone.

### Where a proof unit's boundaries come from

Two passes can decide where one claim ends and the next begins, and they are
not equally good at it.

The default is **deterministic splitting**: terminators, bullets, wrapped-line
rejoining, a 30-character floor, and a contact-furniture filter. It is free,
private, reproducible, and it cannot see that a proof runs across two
sentences, that a paragraph of pleasantries contains one buried outcome, or
that "responsible for the onboarding process" is a duty rather than evidence.

The optional second pass is **model-assisted extraction** (`engine/extract.js`),
off by default and behind its own consent. A model is asked to point at
passages — never to write, summarise or characterise them — and every candidate
must be located **verbatim** in the source document. What enters the inventory
is the document's own characters, sliced at the located offsets, never the
string the model returned. A paraphrase, a stitched claim, an invented number
and a hallucinated employer all fail identically: they are not in the text.

Two things are done to a located span, and neither can add information: a
leading bullet is removed and internal whitespace is collapsed.

The division is the point. **Boundaries are a judgement; worth is a
measurement.** The model gets the judgement and never touches the measurement:
every span it proposes is then scored by the same nine dimensions, with the
same weights, as a split sentence — and honesty rule 5 above governs both.

The gate runs at **mining time**, not only when the model answers, so spans
that arrive in an imported state file are re-verified against their source on
every pass. A hand-edited backup cannot inject a claim either.

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
factor = 0.35 + 0.65 · 0.5 ^ (ageDays · rate / halfLife)
```

so the tabulated half-life is the half-life of the *decaying component* (65% of
the value), not of the score. At one half-life a dated proof retains 67.5%, and
the floor is approached asymptotically rather than reached. Stated here because
the simpler formula this table used to describe is not what the engine computes.

`rate` is 1 for dated evidence and **0.5 for undated evidence**, anchored to
when the user first captured it rather than to an occurrence date we do not
have. Most proofs mined from a real CV are undated, so this is the common case,
not the exception: an undated `outcome` at 730 days retains 81%, not 67.5%. The
half-rate is a deliberate refusal to punish evidence for a missing date — with
the consequence, stated plainly, that integration I5 rarely fires on undated
material.

## L2 — positioning scoring

The positioning statement is scored on six components: audience specificity,
transformation clarity, claim specificity, offer coupling, and non-genericity
(penalising the "I help X do Y" template and the consultant-noun soup:
*strategic, holistic, innovative, passionate, results-driven*).

## L3 — artifact scoring

- **Cadence**: publishing events, recency-weighted at a 40-day half-life, saturating —
  the model rewards consistency, not volume, and saturating at 0.75/week — 80 at 3/week, 94 at 12/week.
- **Groundedness ratio**: fraction of published artifacts carrying at least one
  proof unit ID. This is the product's most opinionated metric: publishing that
  is not grounded in evidence does not raise standing here.
- **Format mix**: diversity across post / comment / case study / talk / long form.

## L4 — reception scoring

Measured as an **engagement rate**, which normalises for audience size: a
400-follower account at 6% is doing better than a 20,000-follower account at
0.4%, and a raw engagement count would say the opposite.

Weighted by what the response costs the reader: comment depth > saves > shares
> reactions.

Scored against a **single declared anchor**, `RATE_ANCHOR = 0.05` — the
weighted engagement rate at which a post scores 50. Not against the user's own
moving mean: scoring each record against a baseline built from the user's other
records made the layer self-referential, so a uniform improvement was invisible
and publishing a genuine hit *lowered* the score.

Relative-to-your-own-norm comparison still happens, in compounding and
calibration, where that is the question actually being asked.

Records are **recency-weighted** with a 90-day half-life rather than swapped in
and out of a hard window, which used to step the layer 23–38 points in a single
day at unchanged confidence purely because a record crossed the boundary.

Confidence is the **sum of those recency weights**, not the row count and not
Kish's effective sample size. The row count reported a settled pattern from six
records that were all five years old. Kish's ESS fixed that and broke the
mirror: it corrects weight *imbalance*, so adding one fresh measurement beside
five stale ones made the sample less balanced and dropped confidence more than
fourfold — the product punishing obedience to its own instruction. Summing the
weights answers the question actually being asked: how much recent evidence
stands behind this number.

**Impressions are required for this layer and optional everywhere else.** A
record without them still counts for cadence and for conversion attribution,
but it is not scored for reception and is excluded from the baseline. Giving it
a second, independently-chosen anchor made the two agree at exactly 600
impressions and diverge in both directions — the same post scoring 9 or 61 at
10,000 impressions depending on whether the user filled the field, rewarding
larger audiences for omitting it.

Locked below 3 scorable records. Records are weighted by recency with a 90-day
half-life rather than a hard window, so no record crossing a boundary steps the
layer.

## L5 — conversion scoring

Funnel events weighted by commitment: `dm` 1 → `call` 3 → `interview` 5 →
`proposal` 6 → `offer` 9 → `deal` 10. Recency-weighted at a 60-day half-life, saturating.

## L6 — recognition scoring

Third-party authority transfer: `citation`, `invite`, `referral`, `feature`,
`endorsement`. Decayed. This is the layer that most distinguishes actual
authority from output volume, and the one no personal-branding tool tracks.

## The Authority Index

```
foundation     = L1.score          # the evidence layer, and nothing else
built          = 0.30·L3 + 0.25·L4 + 0.25·L5 + 0.20·L6

# Liebig gate — a law-of-the-minimum constraint
effectiveBuilt = min(built, foundation + 25)

index          = 0.45·foundation + 0.55·effectiveBuilt
```

The gate is the mechanism that implements the anti-goal in `TELOS.md`.
Built standing cannot exceed the evidence foundation by more than 25 points.
Publishing harder on a thin base does not raise the index — it triggers a
diagnosis.

**Why the foundation is L1 alone.** Two earlier shapes were tried and both were
wrong, in ways worth recording because both are tempting.

Weighting L1 and L2 as peers made the gate defeasible by typing: on a single
weak CV line, completing the four positioning fields moved the foundation from
18 to 71 and the index from 32 to 67, and `gated` went from true to false.

Replacing the blend with a bounded multiplier — at most a quarter more — shrank
that without removing it: with no new evidence, filling the form still moved a
user from `HOLLOW` to `COMPOUNDING` and, in another state, flipped `gated` off.
It was also **double counting**. Positioning already reaches the evidence score
through the route this method actually names: `icpFit` (prior 16) and
`commercialProximity` (prior 8) score every proof unit against the declared
audience and offer, so a sharp positioning raises L1 by re-ranking the evidence
it aims. The multiplier paid for that work twice, and it was the second payment
that bought the gate.

So the foundation is L1, and L2 reaches the index only through those two
dimensions, per proof unit, where the effect can be explained.

**The measured bound, stated honestly.** That route is not zero. `icpFit` uses
60% containment of the positioning in the claim, so a user who pastes their own
evidence's words into the audience and offer fields drives it to its ceiling: on
a single-unit inventory the foundation moves about 6 points, which is enough to
flip `gated` at the boundary. It is roughly a tenth of the original defect and
it is not nothing. Text cannot carry the evidence half; it can still nudge it.

Foundation confidence is L1's confidence: the foundation is a statement about
evidence, and how sure we are of it is how much evidence we have seen.

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

### Diagnosis

Keyed to the **gap**, not to absolute thresholds on each half. Absolute cliffs
put a hard boundary on a continuous quantity: a user told "we found six pieces
of evidence" read "you haven't started yet" one screen later, because their
foundation came out at 44 against a threshold of 45.

| condition | diagnosis |
|---|---|
| only bundled fixtures loaded | `DEMO` — these numbers describe our sample, not you |
| both halves below `STARTED` (18) | `STALLED` — nothing to work with yet |
| `gap ≥ GAP_THRESHOLD` (12) | `BURIED` — you hold evidence nobody has seen |
| `gap ≤ −GAP_THRESHOLD`, foundation measured | `HOLLOW` — louder than your proof |
| `gap ≤ −GAP_THRESHOLD`, foundation **not** measured | `UNCATALOGUED` — not written down, not absent |
| balanced, both halves ≥ `DEVELOPED` (45) | `COMPOUNDING` — scale and convert |
| balanced, below that | `EARLY` — moving together, still small |

`BURIED` is the original ProofMiner insight, now a formal diagnosable state.
`HOLLOW` is the state the rest of the market actively produces.

`UNCATALOGUED` exists because the arithmetic could not otherwise tell
*inflated* from *not yet written down*. The built side fills from a few
dropdown clicks; the foundation side requires pasting documents. Reading that
asymmetry as inflation calls an honest person a fraud, so `HOLLOW` is returned
only when L1 confidence reaches `MEASURED_FOUNDATION` (0.5).

### Confidence

The index carries a confidence = the **minimum** of the two halves, not their
mean. The headline sentence asserts both numbers, and a fully-measured
foundation was buying off the hedge on a built half computed entirely from
layers with no observations. Below `LOW_CONFIDENCE` (0.55) the UI presents the
index as an *estimate* and the product's language changes accordingly.

Positioning does not enter the foundation directly at all — see "Why the
foundation is L1 alone" above.

## Cross-layer integrations

This is the part of the method with no equivalent in competing products. Each
is a directed edge between layers that carries data, not just a UI adjacency.

### I1. L4 → L1 · Compounding (output becomes input)
An artifact that performs meaningfully above the user's baseline **becomes a new
proof unit** of kind `traction`. Reach is evidence. Authority is a system whose
output is its own input, and no tool in this category models that.

### I2. L4 → L1 · Calibration (learn the user's own leverage model)
For each published, grounded artifact we hold the *dimension breakdown* of its
source proof and the *reception score* it earned. With ≥8 such observations the
engine regresses reception on dimensions and shrinks toward the priors:

```
w = prior·(k/(k+n)) + empirical·(n/(k+n)),  k = 8
```

with `MIN_OBSERVATIONS = 8` **distinct artifacts** — one post measured five
times is one observation, not five. At that sample size roughly half the weight
is empirical and, under noise, that half is noise: about 28% of users whose
results are pure noise will see one dimension reach conventional significance
across seven uncorrected comparisons.

Four things contain that, and one earlier claim about it was false and has been
withdrawn:

1. **Shrinkage toward the priors**, above, so eight observations move the
   weights halfway at most.
2. **`MAX_WEIGHT_DRIFT = 2.5`** points per dimension per calibration pass, so
   no single round can rewrite the model.
3. **`falsifiability` and `recency` are excluded** from calibration entirely,
   so the model cannot learn to reward unverifiable or stale claims however
   well they happen to perform.
4. **The panel presents itself as a hypothesis** until n ≥ 15, and says so.

**Withdrawn:** this section used to claim "no pairwise inversions" under noise.
That is not true — adversarial review measured a re-ranking in roughly a
quarter of noise trials on a real Hebrew CV inventory, with the top-ranked unit
itself stable. The honest statement is that calibration *can* reorder the middle
of the inventory on a small sample; the containment is that it moves composites
by a few points rather than many, and that the user is told the panel is
provisional. This is an engineering compromise, not a sound estimator, and the
UI says so.

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

#### The route that carries no magnitude

Some people cannot produce a number. Not "have not yet" — cannot: a designer
whose unchosen concepts are never measured, a coach who refuses to let a price
carry meaning. An instruction that opens *give me a figure* is, for them, the
same instruction re-issued forever.

Seven of the eight plays can be satisfied without one. Measured on
best-practice evidence written with no magnitude at all, against each
archetype's own bar (pinned in `tests/engine/gaps.test.js`):

| | bar | without a magnitude | what carries it |
|---|---|---|---|
| `OUTCOME` | 45 | 54 | a stated before → after, in words |
| `PEER` | 45 | 53 | name, role, place |
| `VALIDATION` | 45 | 51 | an attributed quotation |
| `FAILURE` | 42 | 47 | date and named party |
| `METHOD` | 40 | 43 | dated, attributed, linked |
| `ORIGIN` | 30 | 31 | year, place, what you saw |
| `CREDENTIAL` | 42 | — | never required one; a year is a date |
| `SCALE` | 45 | **none** | `hasScaleUnit` needs a digit beside the unit |

`SCALE` is the exception and the copy says so rather than inventing a route:
`inferArchetypes` reaches it only through `hasScaleUnit`, which requires an
actual digit, so a magnitude-free claim is not classified as `SCALE` at all.

**What this does not do is lower a bar.** Coverage thresholds, `BAND_USABLE`
and the Liebig gate are untouched. Holding a claim still and removing its
figure lowers its score — `specificity` and `outcome` reward magnitude and
that is not adjusted — and `plays.*.without` states that cost instead of
implying the two routes are equal. The narrower claim is the true one: a
well-written claim with no number routinely outscores a terse one with a
number, so the product only ever asserts the controlled comparison.

The single ranking effect: when `magnitudeDensity` shows that **no** unit in an
inventory of at least three carries a magnitude, the `SCALE` play's value is
multiplied by `MAGNITUDE_ONLY_DISCOUNT`. Nothing else moves. `SCALE` sorts
third for an independent user and second for a job seeker on cheapness alone,
so without this the one play they cannot perform is offered before the ones
they can.

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


## Appendix — every constant the product shows a user

This document opens by claiming that every number the product shows must be
derivable from what is written here. That is only true if the constants are
written here, so they are, in one place. Where a value is a prior rather than a
measurement, it is a prior — see honesty rule 5.

| Layer | Composition | Confidence | Notes |
|---|---|---|---|
| L1 PROOF | `0.5·quality + 0.2·volume + 0.3·coverage` | `Σ min(1, score/45) / 8` | quality = mean of top 10 decayed; volume = `saturate(count, 12)` |
| L2 POSITION | `0.21·audience + 0.19·transformation + 0.21·claim + 0.10·offerCoupling + 0.16·nonGenericity + 0.13·defensibility` | `min(filled/4, 2·mean(substantive)/100)` | defensibility is I6's channel and is the only component the user cannot raise by typing |
| L3 ARTIFACT | `0.4·cadence + 0.45·groundedness + 0.15·mix` | `published / 6` | cadence recency-weighted, 40-day half-life, saturating at 0.75/week; mix saturates at 2 formats |
| L4 RECEPTION | rate against `RATE_ANCHOR = 0.05` | `Σ recency weights / 6` | engagement weights: substantive comment 6, saves 4, shares 3, comment 2, reaction 1; denominator floored at `MIN_AUDIENCE = 50`; 90-day half-life; locked below 3 records |
| L5 CONVERSION | `saturate(Σ weighted, 18)` | `Σ recency weights / 4` | weights: deal 10, offer 9, proposal 6, interview 5, call 3, dm 1, reply 1; 60-day half-life |
| L6 RECOGNITION | `saturate(Σ weighted, 8)` | `count / 3` | weights: feature 4, invite 4, referral 3, citation 2, endorsement 1; decay `0.4 + 0.6·0.5^(age/540)` |

| Constant | Value | Where |
|---|---|---|
| `LIEBIG_GATE` | 25 | the ceiling on built standing above the foundation |
| `BAND_STRONG` / `BAND_USABLE` | 68 / 45 | proof bands, calibrated against the measured distribution |
| `STARTED` / `DEVELOPED` / `GAP_THRESHOLD` | 18 / 45 / 12 | diagnosis thresholds |
| `MEASURED_FOUNDATION` | 0.5 | L1 confidence below which `HOLLOW` is withheld |
| `LOW_CONFIDENCE` | 0.55 | index presented as an estimate below this |
| `DECAY_FLOOR` | 0.35 | decay never removes more than 65% of a proof's value |
| half-lives | credential 1460, experience 1095, outcome 730, media 540, event 365, traction 180 | days, by proof kind |
| coverage thresholds | 45 default; ORIGIN 30, METHOD 40, CREDENTIAL 42, FAILURE 42 | measured from best-practice evidence per archetype |
| `SPARSE_MAGNITUDE` / sample floor | 0.20 / 3 units | share of units carrying a magnitude below which the inventory reads as one the user cannot add numbers to |
| `MAGNITUDE_ONLY_DISCOUNT` | 0.5 | applied to the `SCALE` play's rank value only, never to a threshold |
| `MIN_OBSERVATIONS` / `SHRINKAGE_K` / `CONFIDENT_OBSERVATIONS` | 8 / 8 / 15 | calibration |
| `MAX_WEIGHT_DRIFT` | 2.5 | points per dimension per calibration pass |
| `COMPOUND_THRESHOLD` / `COMPOUND_MIN_ENGAGEMENT` / min impressions | 1.6 / 40 / 500 | compounding gates |
| `POSITIONING_LIFT` | *removed* | positioning reaches the foundation only through `icpFit` and `commercialProximity` |
| `MAX_RETRIEVALS` / `MAX_RECIPIENT_CHARS` | 6 / 60 | recall route: tasks created per pass, and the longest a line may be and still be read as a name. Neither reaches any score — see honesty rule 8 |

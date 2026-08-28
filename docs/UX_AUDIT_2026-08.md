# Phase 0 — baseline UX audit

Read before any change, as the plan requires. Every claim below was checked
against the code, not against the plan's description of the code.

## Surfaces

| Surface | Current job | Cognitive demand | Needed before First Light? | Proposed change |
|---|---|---|---|---|
| `onboarding.js` situation fieldset | Fit gate: consultant / expert / **not me** | one choice | **Yes** — the `not me` branch is the honest exit and nothing else offers it | Keep. Stop it also carrying segmentation |
| `onboarding.js` step 1 · confidence slider | Writes `profile.fitConfidence` | a self-rating | **No** | **Nothing reads this field.** Move off the main path |
| `onboarding.js` step 1 · claim textarea | Writes `positioning.claim` | formulate the thing they came unable to formulate | **No** — never blocked | Move below the material |
| `onboarding.js` step 2 · expected evidence | Feeds `expectedCard` on First Light | guess what evidence exists | **No** — card returns `''` when empty | Move below the material |
| `onboarding.js` step 3 · weeks | Feeds dashboard `urgency` only | one choice | **No** | Move below the material |
| `onboarding.js` step 3 · `cold-paste` | The material | paste | **Yes** — the only hard requirement besides situation | **Promote to first block after the gate** |
| `recallExit()` | Route B | — | — | It is a ghost link inside a `<p>` at the bottom of step 3. **Promote to a peer CTA** |
| `views/recall.js` | project / who was there / how it ended → retrieval errands | three short answers | — | **Already exists and already matches the plan.** Reached badly |
| `firstLightView` | title → subtitle → scope note → primary proof card → 2 more → expected card | high | — | Patch 2 |
| `dashboard.js` | urgency, gap, next move, diagnosis, layers | high | — | Patch 3 |

## The three places the plan contradicts the code

**1. The pre-analysis fields do not block anything, and never did.**
`readColdProfile()` (`src/ui/app.js`) requires **only** the situation radio.
`fit-claim`, `fit-evidence`, `fit-confidence` and `weeks` are all read with
fallbacks. The code says so itself:

> *"Asked, never required. The move that loses this audience most reliably is
> demanding a finished formulation as the price of proceeding… This screen was
> doing the failed move as a hard gate."*

So Phase 1's instruction — *"the following must no longer block First Light"* —
is already satisfied. **The defect is not a gate. It is a wall.** The three
questions are rendered as wizard steps 1 and 2, above the paste box in step 3,
so the person who has material must read and scroll past a self-rating, a claim
box and an evidence box to reach the only field that matters. Ordering, not
permission.

**2. The recall flow the plan asks for is already built.**
`views/recall.js` exports `RECALL_FIELDS = ['recall-project', 'recall-room',
'recall-ending']` and asks, in this order: what was the project, who was in the
room, how did it end — then produces retrieval errands addressed to the people
just named. That is Phase 2, Steps 1–3, almost verbatim. What is wrong is the
route to it: a ghost link inside a paragraph at the bottom of the wizard, which
lands on the Sources screen where the recall card sits **below** the paste box.
Route B is de-ranked exactly as the plan warns against, and the fix is
navigation, not construction.

**3. `fitConfidence` is written and never read.**
Grep finds three sites: the input, `readColdProfile`, `applyColdProfile`. No
consumer anywhere. The file's own comment admits the intended use "is not built".
It is a self-rating collected for nothing — the clearest possible instance of
the plan's own P1, and it costs nothing to take off the surface.

## What the plan gets right against the code

- `practiceMode` **changes nothing before First Light.** It sets a label string
  on `positioning.offer` and is passed as `mode` to `extractClaims`, which runs
  later, on the Sources screen, behind an explicit confirmation. By the plan's
  own test it should not be a Screen 0 setup question. **But** the same radio is
  the fit gate whose third option is the honest exit, so it cannot simply move.
  The finding is precise: **one control is doing two jobs, and only one of them
  is needed before First Light.**
- Nothing on First Light is destructive; `expectedCard` degrades to empty.

## Required interactions before material can be analysed

1. choose consultant / expert (**blocking**)
2. paste material (**blocking**)

Everything else is optional already. Two blocking steps, one of which is the
product's own qualification decision.

## Self-diagnosis asked before evidence

- the confidence slider (dead field)
- "what does the client need to believe?" (`fit-claim`)
- "what evidence holds it up?" (`fit-evidence`)

All three ask the person to produce the output the product exists to produce.

## Competing actions

On the onboarding screen: `coldStart` (primary), `coldSample` (ghost),
`coldRecall` (ghost, inside a paragraph). Three, and the one the plan wants
first-class is the least visible.

## Scores shown before their meaning

Not on onboarding. First Light shows a score inside the proof card before the
action — Patch 2.

## Non-reversible editing

None found on this path. `cold-paste` is rendered from `ui.formCache`, so
answering the question above it does not empty it — a bug already fixed here.


---

## Debt, recorded rather than paid

**One control does two jobs.** The consultant / expert / not-me radio is both the
**fit gate** — its third branch is the honest exit, and nothing else offers one —
and a **segmentation field**, writing `profile.practiceMode`. Only the first is
needed before First Light: `practiceMode` sets a label string on
`positioning.offer` and is passed as `mode` to `extractClaims`, which runs later,
on the Sources screen, behind an explicit confirmation.

Splitting them is deferred deliberately. Moving the question would delete the
exit; keeping it means a person who has material still answers a segmentation
question first. **Do not resolve this before an alternative has been tested** —
the exit is a product decision with its own history and is not worth trading for
one fewer click on an untested guess.

**Orphaned copy.** Removing the confidence slider left `onboarding.fitQuestion`,
`fitLow` and `fitHigh` with no consumer in either bundle. `fitNote` keeps one
reference — a guard in `tests/ui/html.test.js` asserting the copy never promises
a risk/opportunity comparison. All four are left in place: deleting them widens
a patch that was scoped to the UI, and the standing refusal they relate to is
recorded where it belongs, in `core/schema.js`.


---

## Patch 2 pre-finding — the strongest proof renders twice

Verified before changing anything, and by measurement rather than by reading:

    PRIMARY (score 62) appears : 2 times
    SECOND  (score 55) appears : 1 time
    reveal list items          : 2

`firstLightView` computes

```js
const strong  = top3.filter((p) => p.score >= BAND_USABLE);
const shown   = demo ? top3 : strong;
const primary = top3.find((p) => p.score >= BAND_USABLE) || …;
```

then renders `proofLoopCard(primary, …)` **and** `shown.map(revealCard)`. Since
`primary` is selected from `top3` by the same threshold that builds `strong`,
the strongest proof is in both. Whenever anything clears the band — the ordinary
case — the first result a person sees is printed once as the proof loop and
again as item 1 of the list beneath it.

**Why this matters beyond tidiness.** The screen exists to produce *"I didn't
know that counted."* Saying the same sentence twice, in two different framings,
within one viewport, spends the one moment the product has on making the reader
wonder whether they missed a difference between the two cards. It also inflates
the apparent yield: a paste that produced two usable units presents as three
cards.

Not changed here. Recorded so that Patch 2 begins from a measured defect rather
than from a redesign impulse.

---

# Outcomes — appended 28 August 2026, nothing above rewritten

This file is the **baseline**. Everything above it is what was true on 27–28
August before any patch, and it stays that way on purpose: a baseline edited to
match the outcome cannot be used to check the outcome. What follows is what
happened to each finding, and where to look.

| Finding above | Outcome | Where |
|---|---|---|
| The pre-analysis questions are a wall, not a gate | **Fixed.** Material first; the four optional inputs moved into a closed disclosure below it, unchanged, still written to the same fields | Patch 1, PR #28 |
| `fitConfidence` is written and read by nothing | **Removed from the UI only.** `core/schema.js` keeps the field so old saves load; the question is not asked | Patch 1, PR #28 |
| The recall route already exists and was a ghost escape hatch | **Promoted** to a bordered peer button beside the primary | Patch 1, PR #28 |
| The strongest proof prints **twice** — measured at 2 usable units presenting as 3 cards | **Fixed.** `rest = shown.filter(p => p.id !== primary?.id)` | Patch 2, PR #29 |
| The verdict and the allowed action level are met **before** the person's own sentence | **Fixed.** `SOURCE → MEANING → one ACTION`, apparatus inside a closed disclosure | Patch 2, PR #29 |
| The situation radio does two jobs — qualification and `practiceMode` segmentation | **Not fixed, and deliberately.** See below | — |

## Three things this audit did not predict, found while doing the work

**A score with no scope.** `scoreScope` was moved into the disclosure on the
stated grounds that no score was visible outside it. That was untrue the moment
a second finding rendered: `revealCard` printed a chip for every secondary
proof. The worst available combination — a number with its scope removed —
arrived by way of a change whose whole argument was that scores are subordinate.
Fixed in PR #29; the chip is gone from the secondary list.

**A regression test written to pass.** The test that should have caught the
above searched inside `.proof-card`; the reveal list is a *sibling* of that
element, so it could not have failed and did not, while the defect sat in front
of it. **A test that scopes its query to the wrong subtree cannot fail.** The
rule taken from it: prove a new guard red against the broken version before
trusting it — done by restoring the chip and watching it go red.

**The same stale-selector defect, three times in one file, caught twice.** Two
production smoke tests were still typing into `#fit-claim` / `#fit-evidence`
after Patch 1 folded them behind a closed disclosure — the same defect Patch 1
had already fixed once in that file. The rule: **when a UI change hides or moves
a field, grep the whole file for every id it touches, not only the occurrence
visible in the diff.**

## Registered debt — the fit gate

`consultant / expert / not-me` is one control doing two jobs: qualification, and
segmentation into `practiceMode`. Only the first is needed before First Light.

It is **not** being split. The third branch is the honest exit, and moving the
control without a replacement deletes that trust boundary — the product would
lose the one place it tells someone this is not for them. `BLOCKED_BY_UNTESTED_ALTERNATIVE`:
the next evidence that should move it is user behaviour in `docs/EXPERIMENTS.md`
E1, not another implementation guess.

## Patch 3 — the dashboard, audited the same way

The order was `urgency → Visibility Gap → bridge → Next Move → diagnosis → six
layers`, with the file's own comment stating the reasoning. The defect is the
same shape as First Light's: the screen opened by asking the reader to interpret
the product — a figure, a delta, two sub-scores and an index before anything
they wrote and before anything to do.

Fixed in PR #30: `bridge → stop-if-gated → move → gap → closed disclosure`.
Measured in a real browser at `bridge 102 · move 258 · hero 460 · disclosure
715`. The Gap is demoted, not deleted; no formula moved.

## Patch 4 — the epistemic surfaces: `ALREADY_DISCHARGED`

The plan reserved a patch for making the interface distinguish `SOURCE` from
`INFERENCE` from `MISSING` from `ACTION`. Audited by measuring the rendered
styles in a browser rather than by reading the code:

| Surface | SOURCE | INFERENCE / MISSING |
|---|---|---|
| First Light | quotation **23.2px / 650**, full ink, 3px accent border; provenance beneath it | meaning **16px / 400**, soft ink, no border |
| Inventory | claim **16px / 600**, full ink | `חזק:` and `מה יחזק:` at 13.28px / 400, soft ink, each behind a **bold label** |
| Dashboard | bridge line 16px, full ink, under the note *"your words, exactly as you pasted them, not a summary and not a rephrasing"* | the move's reasoning inside the accent card; the hero sentence at 18.4px / 600 |
| Studio | the cited proof | grounding stop/warn notices, authorship share, `via model` tag |
| Gaps | — | covered / not-covered per archetype, the play, its cost |

Every SOURCE rendering is in full ink and is either the largest element on its
card, the heaviest weight in it, or explicitly labelled as verbatim. Every
inference is soft ink, smaller, or label-prefixed. **No user-visible ambiguity
was found, so no code was written.** Adding a badge row to satisfy the name
"Patch 4" would be badge proliferation against a problem that is already solved
by typography.

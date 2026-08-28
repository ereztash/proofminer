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

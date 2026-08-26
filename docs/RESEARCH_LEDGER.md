# RESEARCH_LEDGER

Ledger version 1.0 · commit `e05a442`, 26 August 2026.

Sources, what was taken from each, and — the part that earned its place — the
fields that were **absent from the frame** and what happened when they were
brought in.

Facts, inferences and hypotheses are labelled. A row's tier is what licenses
what may be said about it.

---

## 1 · Source tiers

| Tier | Meaning | May support |
|---|---|---|
| **A** | Original study, official dataset, or a measurement run here against ground truth this project did not author | A stated finding |
| **B** | First-party product documentation, for capability claims only | What a tool does |
| **C** | Independent analysis with a disclosed method | A directional claim, hedged |
| **D** | Reviews, forums, vendor comparisons | An anecdotal signal, never alone |

**Rule 3 applies throughout: `README.md`, `docs/TELOS.md`, `docs/METHOD.md`,
this repository's code and its tests are one lineage.** Agreement between them
is not corroboration and is never counted as such.

## 2 · What is actually held

| # | Source | Tier | What it supports | Read |
|---|---|---|---|---|
| S1 | 520 real self-written pitches, Hacker News "SEEKING WORK" threads | **A** | 78% carry a magnitude, 3% carry anything anybody else said. Population is English-writing software freelancers — **adjacent to the ICP, not it** | 25 Aug 2026 |
| S2 | Hebrew Wikipedia, 184 articles at pinned revisions | **A** | Hebrew organisation-detector recall, with ground truth from Wikipedia's own links and infoboxes. Reproducible: `npm run measure:hebrew-orgs` | 26 Aug 2026 |
| S3 | Perturbation of scored sentences under meaning-preserving rewrites | **A** | Score stability, and one defect it exposed. `tests/engine/score-stability.test.js` | 26 Aug 2026 |
| S4 | DictaBERT-NER over the same labelled instances | **A** | The ceiling a Hebrew morphological model reaches at the same positions; 0/20 fabrications on a negative set | 26 Aug 2026 |
| S5 | Buyer-behaviour figures in `docs/MARKET.md` — ~70% through their own process, 84% to the first vendor, 56.5% colleague recommendation, 38.1% "made it understandable" | **C** | The ordering of the funnel. Single secondary source; flagged there | earlier |
| S6 | Stanford hallucination range 17–34%; Charlotin sanctions database at 1,769 cases (17 Jul 2026) | **C** | That trusting unread model output is a measured, consequential failure | 26 Aug 2026 |
| S7 | Pangram Labs, July 2026: >40% of long-form LinkedIn posts entirely AI-generated | **C** | The adjacent market is saturating; the platform now penalises it | 26 Aug 2026 |
| S8 | Research-repository comparisons — Dovetail, Condens, EnjoyHQ, Marvin | **D** | Recurring complaints: time to value, manual upkeep. Several published by competing vendors; reported only where sources with opposing interests agree | 26 Aug 2026 |
| S9 | Local-first AI state of the art, 2026 | **C** | Browser-side inference is production-practical this year, which prices one open decision | 26 Aug 2026 |
| S10 | 12 real client transcripts | **contaminated** | **Excluded from every claim.** They came from guided conversations with the practitioner in the room, and this product is a person alone in a tab. Kept out of the repository entirely; one contains a private medical matter and is excluded from analysis outright |

**COR-SYS Graph: not available.** No `bridge_out/`, no evidence packet, no route
output. Nothing in this document rests on a graph claim, and no graph-derived
vocabulary was adopted. Recorded as absent rather than substituted for.

---

## 3 · Semantic frontier pass

The question asked: **what would somebody from a field this project has never
consulted notice immediately?** Three were tried. Two paid, within the hour.

### Lens 1 — Psychometrics · **paid, and produced a fix**

> *You are reporting an individual score against two thresholds and you have
> never published its measurement error. In my field that is malpractice.*

Nothing in this repository had asked how far a score moves when the sentence
means the same thing. A prediction was written down first — median under five
points, but more than a tenth of near-threshold rewrites crossing a band — and
then it was run.

**Result: the prediction was wrong in both directions, and the second run
mattered more than the first.** On the repository's own fixtures, 126 of 127
rewrites moved the score by exactly zero and nothing crossed a band. On
sentences written fresh, two crossed — and one of them crossed *upward*:

> `All in all, ` in front of an English claim produced a proper noun called
> **"All"**, lifting `falsifiability` 24→46, `verification` 62→74,
> `specificity` 24→36 and `narrative` 58→64, carrying the claim from `weak`
> across `BAND_USABLE`.

Three words carrying no information upgraded the evidence beneath them. Fixed in
`CAPITALISED_FUNCTION_WORDS`; pinned in `tests/engine/score-stability.test.js`.

**And the first run was the day's own error repeated.** It used fixtures written
by somebody who already knew the scorer — the exact failure this project spent
the day chasing in `recall-floor.test.js`. A stability result measured on
in-repo text said "perfectly stable" and was wrong.

### Lens 2 — Evidence law · **paid, and produced a second fix**

> *You have one signal where my field has two distinctions: authentication
> versus weight, and the document itself versus somebody's account of it.*

Tested rather than assumed. `The client told me the process changed their
quarter` earned full `thirdParty` — **+40, the largest single term in
`verification`** — for a sentence the author wrote about themselves. The same
shape as the defect fixed a day earlier, where a link to your own CV counted as
somebody vouching for you.

The line now drawn is **named or anonymous**, not quoted or reported: *the COO at
Alpha Logistics confirmed* is checkable because there is a company to ask; *the
client told me* is not, because there is nobody in it.

**A second thing surfaced on the way.** The comment in `signals.js` claimed
attribution earns `thirdParty` only where *the document marks the words* — a
rule the Hebrew lexicon has never honoured, since `לקוח סיפר` is reported speech
and has always paid. **A documentation-versus-code contradiction in the file's
own comment.** Corrected there.

### Lens 3 — Archival appraisal · **recorded, not acted on**

> *You are appraising items. We appraise series. A project's evidence is a set —
> the brief, the mail, the invoice, the retrospective — and its value is not the
> maximum of its parts.*

This product has no concept of an evidence **case**: `analyzeClaim` scores
isolated sentences and the inventory is a flat list. Four sentences that
together establish one project score independently, and the strongest of them
carries the archetype.

Not acted on, and the reason is a rule this project already keeps: it would be a
new construct with no eligible design and no user to falsify it. Logged in the
register below with the cheapest observation that would decide it.

---

## 4 · Unknown-unknown register

| Absent field | How it surfaced | Why the frame hid it | Decision it changes | Cheapest discriminating observation | Disposition |
|---|---|---|---|---|---|
| **Measurement error on an individual score** | Psychometric lens | The vocabulary is *measure* and *gap*; neither word contains *error* | Whether a number may be shown at all, or only a band | Perturbation of scored sentences — **done, and it found a defect** | **Investigated · closed** |
| **Named versus anonymous attribution** | Evidence-law lens | `thirdParty` is one boolean; two constructs fit inside it | Whether an author's report of praise counts as outside evidence | Score four sentences — **done, and it found a defect** | **Investigated · closed** |
| **The evidence case as a unit** | Archival lens | The schema's atom is a proof unit; nothing above it exists | Whether the inventory should group by project | At day 0, count how many participants paste material about one project versus many | **Defer to the trial** |
| **The comparison-class error** | The user's own second sentence — *"anyway it's pretty basic, everyone works like this"* | The frame models retrieval, and this is a *comparison* failure: they measure themselves against peers who do the same work, not against a buyer who does not | Whether a second mechanism is needed beside retrieval | At day 0, unprompted: does the participant say a version of it? | **Defer to the trial** |
| **The trigger has a date** | Anti-anchor derivation | A chronic frame has no place for a deadline | Whether this is a budgeted purchase or an unbudgeted ache — which decides the whole commercial story | One question at day 0: *what happens in the next thirty days that makes this matter?* — already in the script | **Scheduled** |
| **Refusal populations** | Prompt lane, checked | Screen 0 has a "this is not for me" exit; nothing beyond it | Whether anyone should be actively turned away | The product already refuses honestly and ends the flow. **No further population identified**; recorded so the lane is not reopened without a reason | **Closed** |
| **Whether the buyer ever reads any of it** | Thesis T4 | Every node in the frame is on the seller's side | Whether to keep building at all | The intake question, over twelve months | **Deferred — the horizon is the instrument** |

## 5 · Lanes closed, and why further search would not change the decision

- **Pricing comparison.** The product is free and `docs/MARKET.md` says it stays
  free. No competitor price changes an action here.
- **Feature parity with repositories.** Collaboration, archive and export are
  refused by design, not missing. More detail on how Dovetail does them cannot
  change that.
- **More competitor reviews.** The complaints converged after four sources from
  opposing commercial interests. A fifth would move confidence, not the decision.
- **Hebrew NER alternatives beyond Dicta.** The ceiling is already measured at
  85% and the decision is blocked on the trial, not on which model. A second
  model would refine a number nobody is acting on yet.

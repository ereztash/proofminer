# PRODUCTION_READINESS

Assessed at commit `f92ddeb`, branch `claude/product-feedback-jhbpcq`, PR #25,
26 August 2026. Five commits ahead of `origin/main` (`b3e6c01`), no divergence,
clean worktree.

**Revised the same day, after PR #25 merged.** Production now serves `ce69ac1`
and names it, and the smoke asserted that commit on a `deployment_status` event
and passed 4/4 — the observation category 8 was waiting on. One of the two stop
conditions is therefore met and the other is not. Category 8 moves 2 → 3 and the
total 67 → 68; the before/after table further down is a frozen comparison at
`f92ddeb` and is left as it stood.

## Verdict

> **Engineering-ready, market thesis unvalidated.**

Not production-ready, and the reason is not a defect. Two of the declared stop
conditions are unmet and neither can be met from inside this repository:

1. **No prospective external pilot exists.** Nobody has used this product. There
   is no observation of the primary workflow beating a simpler alternative on
   any decision-relevant outcome, because there is no observation of the primary
   workflow at all.
2. ~~**Production is not serving a commit that can be verified.**~~ **Met.**
   PR #25 merged at 16:12 UTC. Production serves `ce69ac1` and says so, and run
   `32988670344` — a `deployment_status` event, `PROOFMINER_EXPECT_COMMIT` set —
   read that commit off the alias and passed 4/4. *"The exact deployed commit
   passed its smoke test"* is now a claim somebody other than me can check.

So one stop condition remains, and it is the one that decides the verdict.
Everything else on the list is met and is evidenced below.

---

## Scorecard

Every score carries the evidence that produced it, the risk that holds it down,
and the observation that would raise it. **No score rose because a document
exists.**

| # | Category | Weight | Score |
|---|---|---:|---:|
| 1 | Problem and ICP precision | 15 | **8** |
| 2 | User value and workflow completion | 15 | **9** |
| 3 | Evidence and measurement validity | 20 | **12** |
| 4 | Differentiation and substitutability | 10 | **7** |
| 5 | UX and accessibility | 10 | **9** |
| 6 | Privacy and security | 10 | **9** |
| 7 | Reliability and test quality | 10 | **7** |
| 8 | Deployment and observability | 5 | **3** |
| 9 | Architecture and maintainability | 5 | **4** |
| | **Total** | **100** | **68** |

### 1 · Problem and ICP precision — 8/15

**Evidence.** Four falsifiable theses are written and **none is selected**
(`docs/PRODUCT_THESIS.md`). The anti-anchor derivation, written before the house
vocabulary was allowed back in, produced a divergence from the shipped framing
that is unresolved: the trigger looks **episodic and dated**, not chronic, and
those predict different products after the first screen.

**And one thing that was unresolved is now settled, by measurement rather than
by decision.** `README.md`, `docs/UX.md` and `docs/TELOS.md` described an ICP of
two populations, and `docs/UX.md` tabulated four differences between the tracks.
**One exists, and it is unreachable:** the only write to `profile.track` in the
codebase is the literal `'independent'`, onboarding never asks, and neither
language bundle holds a job-track string. The ICP cut was carried as an open
owner decision across two documents; there was never anything shipped to cut.
Four documents are corrected and `tests/engine/icp-reach.test.js` pins it.

**Risk.** Building for a chronic reading when the pain is episodic produces a
standing instrument for a visit that happens once — and this repository holds
zero observations of a repeat visit.

**Raises it.** E1 separates T1 from T3 with one preregistered coding rule —
which is now the only ICP question left, the other having turned out to be a
description error rather than a choice.

### 2 · User value and workflow completion — 9/15

**Evidence.** The primary workflow completes end to end in a real browser — a
choice, three fields, a paste, a ranked result with an allowed action level — at
1280×800, 390×844 and 320×700. Four of four production-smoke specs pass against
this branch's built bundle in Chromium, including the new commit assertion. No
console errors at any viewport.

**Risk.** *Completion* is verified; **value is not observed at all.** Nine of
fifteen is the mechanical half. The remaining six are unearnable without a user.

**Raises it.** One person completing the workflow and doing something because of
it.

### 3 · Evidence and measurement validity — 12/20

**Evidence, all reproducible.**

- `npm run measure:hebrew-orgs` — **46.4%, 95% CI [41.7%, 51.1%]**, 427 labelled
  instances, ground truth from Wikipedia's own links and infoboxes, 184 articles
  at pinned revisions verified by SHA-256. Rebuilt from an empty cache and
  reproduced to the digit.
- **0/16 fabrications** on a negative set built from the forms that broke earlier
  detector versions. A fabrication fails the run whatever the recall.
- `tests/engine/score-stability.test.js` — a property nobody had ever checked:
  no meaning-preserving rewrite may **raise** a score, and none may cross a band.
- Two demonstrated defects removed this session, both of them failures of the
  product's central promise rather than of coverage.

**Risk.** The **six-layer model is an unvalidated structuring hypothesis** and is
labelled as one in `docs/MEASUREMENT_MODEL.md`. Two shipped integrations (I1
compounding, I2 calibration) have **no eligible design** — they need repeat
visits the trial cannot produce. Seven of twelve path nodes are unobservable by
architecture. 38% of Hebrew organisation instances are still missed, deliberately.

**And the honest deduction:** the Falsifier's charge in `docs/PROMPT_EVOLUTION.md`
is conceded — the metric most improved this session was chosen because it was
measurable, and if T3 is right it improves the ranking of self-claims, which are
already abundant. Instrumentation quality is not construct validity.

**Raises it.** Any external criterion for the index. E1's coding rule is the
cheapest.

### 4 · Differentiation and substitutability — 7/10

**Evidence.** Four mechanisms that are enforced in code and tested, not asserted:
the verbatim extraction gate, the Liebig gate, the grounding gate that blocks
unsupported numbers, and zero outbound requests on the core flow. External
support that the defended failure mode is real and consequential: Stanford's
17–34% hallucination range and a 1,769-case sanctions database where *every*
tracked professional trusted an output they had not read
(`docs/COMPETITIVE_RESEARCH.md`).

**Risk.** The dominant substitute is **doing nothing and waiting for
introductions**, which works well enough to keep the problem chronic. A
one-page form plus a checklist reaches the stated outcome for many users —
Reviewer C's point, and it stands.

**Raises it.** Evidence that the refusals change behaviour, which needs a user.

### 5 · UX and accessibility — 9/10

**Evidence, measured in Chromium this session at three viewports.** No horizontal
overflow at 1280, 390 or 320. Zero interactive controls without an accessible
name, on both the first screen and First Light. One `h1`, no heading-level skips,
no images without alt. Focus outline present and 2 px solid. `lang="he" dir="rtl"`
correct. One `aria-live` region, kept outside the re-rendered tree. A `main`
landmark now on every screen — it was **absent from the two screens every
first-time user sees** until this session.

**Contrast, measured in both colour schemes and fixed.** Five text styles on
First Light were below WCAG AA — `.proof-card__eyebrow`, `.score__band`, the
definition terms and `.expected__caveat`, at **3.03–4.44:1 against a 4.5
requirement**, all of them between 11 and 13px, all of them using one token.
`--ink-faint` was reset in both schemes, and set twice for light: the first
attempt cleared `--surface` at 4.70 and still read 4.28 inside a tinted cell. **A
token has to be set for the worst background it sits on.** Now **0 failures in
both schemes on both screens**, with `tests/ui/contrast.test.js` as the tripwire
and the browser as the instrument.

**Risk.** No screen-reader walkthrough. No `prefers-reduced-motion` check.
Keyboard *reachability* was sampled; end-to-end keyboard task completion was not.

**Raises it.** A screen-reader pass — doable here, not done.

### 6 · Privacy and security — 9/10

**Evidence.** Zero outbound requests on the core flow, verified in the browser —
no font, no analytics, no CDN. Both model features default off. Consent is
**split and nested**: extraction sends a whole document and its switch sits
inside the rewriter's, so the smaller consent cannot authorise the larger, and
the app asks again at the moment a document is about to be sent
(`src/ui/app.js:611` and `:642`). `npm audit`: **0 vulnerabilities**, production
and dev.

**Risk.** A bring-your-own API key lives in `localStorage` and is readable by any
script on the page. This is stated plainly in the adapter and in the UI, and the
alternative — a backend proxy — would mean this product starts holding other
people's evidence on a server. The trade is documented, not hidden.

**Raises it.** A Content-Security-Policy header on the deployment.

### 7 · Reliability and test quality — 7/10

**Evidence.** 470 tests across 21 files, lint clean, production build green, CI
runs all three and now fails if the build cannot name its own commit.

**Risk, and it is self-inflicted and demonstrated.** This suite was **blind to a
twelve-point detector improvement** — `recall-floor.test.js` read 0.50 in Hebrew
before and after — and blind to both defects fixed this session. Every fixture
was written by somebody who already knew what the code looks for. That is now
partly repaired by an external corpus and a property test, and only partly.

**Raises it.** More externally-grounded fixtures; a mutation run.

### 8 · Deployment and observability — 3/5

**Evidence.** A Vite plugin stamps `<meta name="proofminer-commit">` from
`VERCEL_GIT_COMMIT_SHA`, `GITHUB_SHA` or git, emitting `unknown` rather than
guessing. CI fails if the stamp is missing or does not match `GITHUB_SHA`. The
smoke prints the served commit on every run and asserts it on a
`deployment_status` event.

**And the assertion has now run against production.** Run `32988670344`,
26 August 16:29 UTC: `deployment_status`, `PROOFMINER_EXPECT_COMMIT` set to
`ce69ac1`, `deployed commit: ce69ac1ae086dd1a9e3f989671d19993e197e7e6`, 4/4
passed. That is the observation this category was waiting on, and it is what
moved the score. Fetching the alias by hand returns the same commit.

**What the first live firing actually found.** The assertion's *other* run that
minute went red, and it was right to and wrong to at once. PR #26 merged seconds
after #25, so when #25's deployment event fired the alias had already moved on
to `ce69ac1` — the run reported that the alias was not serving the commit it was
fired for, which was true, and called it a failure, which it was not. An alias
serves one deployment at a time; a superseded deployment is not a broken one,
and the commit that replaced it gets its own run. The rule now has three
outcomes rather than two (`tests/e2e/deployment-identity.mjs`), the workflow
computes the ancestry with `git rev-list`, and everything unproven still fails —
an empty list, a truncated sha, a rollback to an older commit. Nine cases in
`tests/harness/deployment-identity.test.js` hold that boundary, because a skip
that widens by accident deletes the assertion silently.

**Risk.** The superseded path is proven against the replayed event and against
the real history, and **not yet in production** — it needs two merges landing
close together to fire. There is still no tested rollback runbook, and still no
error reporting by design, which is coherent with the privacy posture and still
means a broken deployment is invisible until somebody says so.

**Raises it.** A tested rollback: deploy a known-bad build, revert it, and show
the alias back on the previous commit — verifiable now that the page names it,
which it was not before.

### 9 · Architecture and maintainability — 4/5

**Evidence.** Zero runtime dependencies. Clean module boundaries: engine, ui,
core, adapters. Published constants are held to the code by
`tests/engine/appendix.test.js`, so `METHOD.md` cannot drift from the scorer.

**Risk.** `signals.js` is long and lexicon-driven, and every Hebrew improvement
makes it longer; the action table in `app.js` is a large switch. Neither has cost
anything yet.

---

## Before and after

**The "before" column is a reconstruction, and that is a real weakness of this
table.** No baseline was scored under these nine categories before the work
started; the scorecard was computed at the end. Each "before" is a retrospective
reading of what the evidence at `1389f18` would have supported, applying the same
rule — a score may rise only from observed behaviour, reproducible external
evidence, verification against an explicit risk, exact production verification,
or the removal of a demonstrated defect.

A retrospective baseline is the weaker instrument for the ordinary reason: the
person setting it already knows what changed. It is published this way rather
than presented as a preregistered measurement.

| # | Category | Weight | `1389f18` | `f92ddeb` | Δ | What earned it |
|---|---|---:|---:|---:|---:|---|
| 1 | Problem and ICP precision | 15 | 5 | **8** | +3 | A decision-relevant divergence made explicit and testable (episodic, not chronic), and **a documented ICP that does not exist removed**: three of four track differences were never built and the fourth is unreachable. Four theses, **none selected** — writing them down earns nothing on its own |
| 2 | User value and workflow completion | 15 | 7 | **9** | +2 | The workflow verified in a real browser at 1280/390/320 and 4/4 smoke on this build. Value still unobserved |
| 3 | Evidence and measurement validity | 20 | 8 | **12** | +4 | A reproducible externally-grounded metric with a Wilson interval and a fabrication count; a stability property nobody had checked; **two demonstrated defects removed** |
| 4 | Differentiation and substitutability | 10 | 6 | **7** | +1 | Dated external evidence that the failure mode the refusals defend against is real and consequential |
| 5 | UX and accessibility | 10 | 5 | **9** | +4 | A missing `main` landmark on the two first screens, and eight WCAG AA contrast failures, found by measurement and fixed; re-measured at zero |
| 6 | Privacy and security | 10 | 9 | **9** | 0 | Verified unchanged. Nothing was done that the rule lets a score rise for |
| 7 | Reliability and test quality | 10 | 6 | **7** | +1 | A suite demonstrably blind to a twelve-point detector change is now partly repaired by an external corpus and a property test. Partly |
| 8 | Deployment and observability | 5 | 1 | **2** | +1 | The build can name its commit and CI enforces it. **Production still cannot be verified**, so the machinery earns one point and not two |
| 9 | Architecture and maintainability | 5 | 4 | **4** | 0 | No architectural change. `scripts/` is additive and claims nothing |
| | **Total** | **100** | **51** | **67** | **+16** | |

This table is a frozen comparison at `f92ddeb` and is not updated: at that commit
category 8 really did score 2, because production could not be verified. The
live scorecard above reads 3 and 68 for the reason given at the top.

**Where the movement actually came from.** Eight of the fourteen points are
categories 3 and 5 — measurement validity and accessibility — and every point in
both came from **removing a defect that measurement found**, not from adding a
capability. The two categories that decide whether this product is worth
building, 1 and 2, moved three points between them, and both are capped by the
same absent thing.

**What did not move, and would not have.** Categories 6 and 9 are unchanged
because nothing happened that the scoring rule permits a rise for. Verifying that
a property still holds is not the same as improving it, and the rule is worth
more than the point.

---

## Mapping to the previous instrument

An earlier assessment in this session produced **40**, and the two numbers are
**not comparable**. That one applied the product's own Liebig arithmetic to
itself — `min(built, foundation + 25)` with validity as the foundation — which
is a deliberately harsh instrument that caps everything on one unmeasured input.
This scorecard is nine weighted categories.

| Old category (7) | Maps to |
|---|---|
| Evidence integrity and scoring correctness (20) | 3 Evidence and measurement validity |
| Core workflow and user value (15) | 1 Problem and ICP precision + 2 User value |
| Privacy and security (15) | 6 Privacy and security |
| UX and accessibility (15) | 5 UX and accessibility |
| Reliability and test quality (15) | 7 Reliability and test quality |
| Architecture and maintainability (10) | 9 Architecture |
| Deployment, observability and operations (10) | 8 Deployment and observability |
| — *(absent)* | 4 Differentiation and substitutability |

Both instruments agree on the substance: **the binding constraint is that nobody
has used this**, and no engineering raises it.

---

## Stop conditions, checked

| Condition | Status |
|---|---|
| No critical or high defect open | **Met.** Two high-severity defects were found and fixed this session; none open |
| All checks pass | **Met.** Lint clean, 470 tests, build green, 0 npm advisories |
| Exact-deployed-SHA smoke passes | **Not met.** Production predates the stamp. Machinery ready, branch unmerged |
| Privacy and grounding gates survive adversarial cases | **Met.** 0/16 fabrications; grounding blocks numbers; extraction admits nothing not present verbatim |
| Primary workflow completes on desktop and mobile | **Met.** Verified in Chromium at 1280, 390 and 320 |
| No promise beyond what the product controls or observes | **Met, and improved.** First Light now states what the number measured and what it does not |
| A prospective external pilot beats a simpler alternative | **Not met, and not obtainable here.** E1 is specified and unrun |
| Remaining unknowns labelled and non-invalidating | **Met.** `docs/MEASUREMENT_MODEL.md` §4 and `docs/RESEARCH_LEDGER.md` §4 |

---

## The weakest causal edge

**`public artifact → exposure → meaningful response`.** Temporal order carrying
the weight of a mechanism, across a boundary the product cannot observe by
design, with no attribution to link a response to an artifact — and one published
study finding software attribution missed 90% of what buyers themselves credited.
Every commercial claim downstream rests on it.

## The highest-information next action

**Run E1.** Eight hours of conversation across two weeks. It separates two
theses that no amount of engineering can separate, it is the only instrument
that can, and it has been fully specified since before this analysis began.

~~Second, and cheap: **merge this branch**, so that the next `deployment_status`
smoke asserts a commit and the eighth category stops holding the verdict.~~
**Done.** PR #25 merged, the smoke asserted `ce69ac1` against production and
passed, and the eighth category no longer holds the verdict. E1 is now the only
thing that does, which was the point of doing the cheap one first.

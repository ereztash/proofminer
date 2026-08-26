# MEASUREMENT — the Hebrew organisation detector

One command:

```bash
npm run corpus:hebrew-orgs     # rebuild the corpus (once, ~4 minutes)
npm run measure:hebrew-orgs    # verify it, then measure
```

Current result, at commit `e05a442`, 26 August 2026:

```
corpus            : 184 articles, he.wikipedia.org
labelled instances: 427
found             : 198
RECALL            : 46.4%   95% CI [41.7%, 51.1%]  (Wilson)
fabrications      : 0/16 negatives yielded an organisation
```

This is the only figure in this project computed against ground truth nobody
here wrote, over material anybody can rebuild byte for byte.

---

## The metric, defined before it was computed

> Of the organisations named in the corpus with a bare `ב` prefix — the form
> Hebrew uses for a workplace — what share does `extractSignals` return as a
> proper noun, in the sentence where the name appears?

| | |
|---|---|
| **Numerator** | instances where a returned proper noun contains every token of the labelled name |
| **Denominator** | labelled bare-`ב` instances, capped at two sentences per name per article so one much-repeated employer cannot dominate |
| **Observation unit** | one (article, organisation, sentence) triple |
| **Window** | none; the corpus is fixed at pinned revisions |
| **Uncertainty** | Wilson score interval. The normal approximation is wrong at this n and this is the standard repair |

**What counts as a hit.** The detector consumes the type word it triggered on
and returns the name after it — `אוניברסיטת מקגיל` comes back as `מקגיל` — so
the label is normalised the same way before comparing. Demanding it echo its own
trigger measures the convention rather than the detection, and produced **0.4%**
the first time this was written that way.

**What the interval is about.** The corpus is fixed, so re-running is
deterministic and there is no run-to-run variance. The interval is about
generalising to other Hebrew text of this kind — and even that is bounded by the
sampling caveat below.

---

## Where the labels come from

Not from this project, which is the entire point.

In Wikipedia's markup a workplace written `ברשת 13` is `ב[[רשת 13]]`. The linked
article's own `[[קטגוריה:…]]` lines and its entity infobox say whether the thing
is an organisation. Both decisions are Wikipedia's; nobody here annotated
anything.

**Why that matters more than the number.** Every fixture in this repository was
written by somebody who already knew what the detector looks for, and a suite
built that way cannot see what the detector does not do.
`tests/engine/recall-floor.test.js` read **0.50 in Hebrew both before and after**
a change worth twelve points here. A green suite is evidence that a detector
matches its author's expectations, and nothing more.

### Two errors in the labelling, found and fixed before the number meant anything

| What was wrong | Effect |
|---|---|
| `ארצות הברית` and `רואנדה` were labelled organisations — the substring `ארגון` matches `קטגוריה:מדינות חברות בארגון האומות המאוחדות` | ground truth inflated |
| `אקזיט`, `חברות הזנק` — concept articles, not entities. An entity infobox is now required | ground truth inflated |

---

## Reproducibility

**Pinned revisions, not a copy.** Every article is fetched at a fixed `oldid`,
which Wikipedia serves immutably, and every fetch is checked against a SHA-256
in `scripts/hebrew-org-corpus.manifest.json`. An article edited tomorrow changes
nothing. A hash that does not match is reported as drift and the run fails
rather than quietly measuring something else.

**What is in this repository and what is not.** The manifest holds article
titles, revision ids, hashes, and the organisation names labelled in each —
entity names, not prose. **Not one sentence of the article text is committed.**
That is the rule the client material and the Hacker News pitches are held to,
for the same reason: this repository does not become a bank of other people's
wordings, and `docs/TELOS.md` forbids exactly that.

The text is CC BY-SA 4.0 from he.wikipedia.org. It is rebuilt into `.corpus/`,
which is gitignored.

**Verified from empty on 26 August 2026:** cache deleted, 184 articles refetched
from their pinned revisions, all 184 hashes matched, recall reproduced at 46.4%.
Two independently written pipelines — one in the scratchpad, one in `scripts/` —
agree to the digit.

---

## Fabrications, measured alongside

A recall figure published on its own is half a result: a detector reaches any
recall by calling everything an organisation. Sixteen sentences that must never
yield one — six verbs opening with `ב`, a generic industry, something published
rather than somewhere worked, a school run, a person, an unnamed client, a
department, a meeting, a role, a skill list — are scored on every run.

**0/16.** A fabrication fails the run outright whatever the recall: this product
may miss an organisation and may not invent one.

---

## What this measurement is not

**Not a sample of the population this product serves.** Wikipedia biographies
are third-person encyclopedic prose written by strangers. This corpus calibrates
**one component** and may not be used for band thresholds, coverage ceilings or
archetype distribution. The rate says what the detector does with Hebrew
organisation names; it says nothing about what people write about themselves.

**Not a claim about the product's value.** A detector that finds 46% of
organisation names is a detector with a known deficiency, published rather than
implied away.

---

## What is still missed, and why some of it is on purpose

Splitting the misses by what each would need:

| | Missing | Share | Status |
|---|---|---|---|
| A | A trigger already on the list, carrying a `ב` — `בבית הספר`, `בבנק` | 9% | **Fixed** |
| B | A type word absent entirely — `ערוץ`, `בית החולים`, `מכללה`, `מכון`, `סמינר` | 18% | **Fixed** |
| C | A bare `ב` straight onto the name — `בניקלודיאון` | 38% | **Refused** |

**C is refused deliberately.** On an arbitrary word there is a guess to make:
`ב` is also the first letter of `בניתי`, and the attempt reported a company
called *"ניתי תהליך"*. On a word from a closed list there is no guess, which is
why A was safe and C is not. Filing them together as one problem is what hid A
for as long as it was hidden.

**The ceiling on C is known.** DictaBERT-NER, run over the same labelled
instances on 26 August 2026, reaches **71.3%** on category C by full name and
**85.4%** measured as *an organisation detected at the right offset* — which is
the number that matters, since the product would take the verbatim span from the
text itself. It produced **0 fabrications on 20 negatives**, including every
form that broke the rule-based attempts.

It is **not shipped**, and the reason is cost rather than doubt: 735 MB at fp32,
roughly 184 MB quantised, against a 223 KB bundle, with no ONNX build published.
It runs in the browser, so it would not break the no-transmission refusal — only
the lightweight one. The decision is priced and belongs to the owner after the
trial in `docs/TELOS.md`.

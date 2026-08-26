# MEASUREMENT_MODEL

Model version 1.0 · commit `e05a442`, 26 August 2026.

What this product can observe, what it can only influence, and what it has
decided it will never see. Facts, inferences, hypotheses and targets are kept
visibly apart; a row's **class** column is the only thing licensing what may be
said about it.

---

## 1 · The candidate path, node by node

The path under test:

```
source → proof unit → buyer problem → claim → public artifact → exposure
  → meaningful response → lead capture → qualified conversation → paid
  → realized value → independent recognition
```

| Node | Observable event | Denominator | ProofMiner's relation | Class |
|---|---|---|---|---|
| source | a document pasted | sessions started | **controls** | capability |
| proof unit | a span located verbatim and scored | spans proposed | **controls** | capability |
| buyer problem | a claim typed into screen 0 | sessions | **observes**, unverified | hypothesis |
| claim | positioning fields | sessions | **observes**, unverified | hypothesis |
| public artifact | a draft the user exported | drafts generated | **influences** | capability |
| exposure | somebody read it | artifacts published | **cannot observe** | outcome |
| meaningful response | a reply, a comment, a forward | exposures | **cannot observe** | outcome |
| lead capture | contact details recorded | responses | **refused by design** | — |
| qualified conversation | a call that happened | leads | **cannot observe** | outcome |
| paid | an invoice | qualified | **cannot observe** | outcome |
| realized value | the work went well | paid | **cannot observe** | outcome |
| independent recognition | somebody else said it in public | realized | **cannot observe** | outcome |

**Seven of twelve nodes are `cannot observe` and one is `refused by design`.**
That is not a gap to close. It is the product's architecture — no server, no
account, no telemetry — stated as a measurement fact. Any dashboard that appears
to show those nodes is showing something the user typed.

---

## 2 · Model break pass

Run before implementing anything against the path. Five of the eight questions
returned something.

### What important event does the path omit?

**Three.**

1. **Retrieval that has not happened yet.** The path begins at `source`,
   assuming a document exists. The product's own copy predicts the commonest
   first paste — a CV or profile — holds nothing checkable, and the way out is
   an errand addressed to another person, which takes days. The recall route
   *is* a node and the path has no place for it.
2. **Abandonment, and the legitimate kind.** `docs/TELOS.md` states that relief
   is allowed to look like somebody closing the tab, and deliberately refuses a
   returning-visit criterion. A path with no exit node treats every departure as
   a failure of the next edge.
3. **The comparison-class error.** *"Anyway it's pretty basic, everyone works
   like this"* is half of the complaint people actually arrive with
   (`docs/PRODUCT_THESIS.md` Part 1). It is not a retrieval failure and no node
   here addresses it: the person is comparing themselves to peers who do the
   same work rather than to a buyer who does not.

### Which node combines two distinct constructs?

- **`lead capture`** fuses *the buyer acted* with *we recorded it*. This product
  refuses the second, so the fused node reads as a missing capability when it is
  a deliberate refusal. Split, or the refusal looks like a defect forever.
- **`proof unit`** fuses *a span was located* with *a span cleared a bar*. The
  extraction gate governs the first and the nine dimensions the second, and they
  fail in different ways: `acceptSpans` rejecting a hallucinated span is a
  success, a real span scoring 31 is a miss.

### Which edge is merely temporal order?

- `public artifact → exposure → meaningful response`. Temporal, not causal, and
  the product observes none of it. Without attribution, nothing connects a given
  response to a given artifact — and `docs/MARKET.md` cites a study where
  software attribution missed 90% of what buyers themselves credited.
- `paid → realized value`. Sequence, not mechanism.

### Which metric could be gamed, and which rewards the wrong thing?

| Risk | Where | Status |
|---|---|---|
| Input manufactures the ceiling | anything scored from typed text | **Known, measured, published.** `icpFit` moves the foundation ~6 points by pasting your own words into the positioning fields — about a tenth of the original defect. In `README.md`, not rounded away |
| Volume | any count of artifacts | **Structurally refused.** The Liebig gate caps `built` at `foundation + 25` |
| Silence | a returning-visit metric | **Refused.** Would reward the user *not* being relieved |
| Self-report | the intake question | **Accepted knowingly.** It is the only instrument available once capture is refused, and it is labelled self-report wherever it appears |

### Which edge lies outside the product's control?

Everything from `exposure` rightward — eight of eleven edges. Stated here so no
later document can quietly narrate them.

### What simpler model explains the same observations?

**Two nodes:**

```
can they say something specific and true today?  →  did anyone else say it about them?
```

Across 520 real self-written pitches, 78% carried a magnitude and 3% carried
anything anybody else had said. That two-node model accounts for the strongest
measurement this project holds; the twelve-node path adds ten nodes and explains
no additional observation. **The twelve-node path is retained as a map of what is
*not* observable, and the two-node model is what any experiment is powered
against.**

### What would the user do without the product?

Rewrite the CV; ask a general model to improve it; wait for an introduction. The
third works well enough to keep the problem chronic. See
`docs/PRODUCT_THESIS.md` Part 1.

---

## 3 · Candidate constructs, kept or deleted

The rule applied: **delete the metric if it does not change a next action**, and
**graph structure is never an observation.**

| Construct | Decision it changes | Verdict |
|---|---|---|
| **Evidence Lineage Coverage** — share of proof units traceable to a located span | none; it is 100% by construction, since `acceptSpans` admits nothing else | **Delete.** A metric that cannot vary is an assertion. The *rejection count* is already shown, and that one varies |
| **Claim Fidelity** (source, subject, magnitude, scope, time, uncertainty) | whether a draft may be published | **Keep the one sixth that is exact.** Magnitude is implemented and blocks. Subject and scope are the documented uncontrollable cases — a true number on the wrong subject. Publishing a "fidelity score" over five unmeasurable components would be the product's own anti-goal |
| **Authority Debt** — exposure-weighted unsupported claims | none available: exposure is unobservable | **Delete** until an exposure signal exists. The Liebig gate already does the unweighted version and does it by refusing |
| **Proof Activation Rate / time-to-first-grounded-artifact** | whether onboarding works | **Keep as a trial observation, not a product feature.** Measuring it in-product needs session tracking. A person with a notebook can time it, and `docs/TELOS.md` already asks them to |
| **Proof-to-Qualified-Journey Yield** | whether to keep building | **Defer.** Requires the whole right-hand side of the path. Not measurable without capture |
| **Claim-to-Lead Fit** via self-reported attribution | whether the tool creates demand at all | **Keep — it is the only demand instrument that survives the no-capture rule.** One free-text question at intake: *what made you reach out?* Twelve months with no answer naming the tool is the falsifier in `docs/MARKET.md` |
| **Recognition Independence** by source family and relationship distance | whether third-party evidence is genuinely third-party | **Keep the cheap half.** The detector already separates a self-claim from an attributed one, and the session that added `cited my work` found the distinction was broken for a colleague citing you at a conference. Relationship distance needs a graph and there is no graph here |
| **Ownership Persistence** — transformed, self-initiated reuse, echo, disappeared | whether the person took ownership of the evidence | **Keep one binary, as a trial observation:** did they correct the extraction unprompted? *"No, it was twenty-one days, not nineteen."* A correction is a far stronger signal than agreement, and it costs nothing to record. Already in the day-0 script |
| **Bottleneck Confidence Vector** across the path | which layer to work on | **Keep the vector; refuse the scalar.** This is what the product already does — `STALLED / HOLLOW / BURIED / COMPOUNDING` plus one next move. A single blended number would make a worse decision and would be gameable in exactly the way the Liebig gate exists to prevent |

**No single Authority Score is introduced.** The prompt's condition — that it
demonstrably makes a better decision than a vector — is not met, and the four
quadrants plus one next move already are the vector.

---

## 4 · Constructs with no eligible design, named as such

Under rule 9, a causal claim needs preregistration, assignment, comparison, a
controlled window, a denominator and an outcome. Three shipped constructs have
none, and are recorded here rather than quietly counted.

| Construct | Status |
|---|---|
| **I1 compounding** (L4 → L1, a post that beat baseline becomes new evidence) | Built, tested, **unfalsifiable by the planned trial**: it requires repeat visits, and this repository holds zero observations of one. `docs/TELOS.md` already excludes it from the definition of done |
| **I2 calibration** (L4 → L1, reception re-weights ranking) | Same. The panel already presents itself as a hypothesis rather than a finding, which is the correct behaviour and does not make the construct measured |
| **The six-layer model itself** | A structuring hypothesis with no external validation. Nobody has shown that L1–L6 carve the problem at its joints, or that movement on the index corresponds to anything outside the app. **Marked as hypothesis in this document and in `docs/PRODUCTION_READINESS.md`; it must not be described as measurement anywhere** |

---

## 5 · The one construct that *is* measured, and how

The Hebrew organisation detector's recall is the only number in this project
computed against ground truth nobody here authored, over a corpus anybody can
rebuild byte for byte.

- **Definition, numerator, denominator, ground truth, uncertainty, and the
  command:** `docs/MEASUREMENT.md`.
- **Why it exists:** every fixture in this repository was written by somebody
  who already knew what the detector looks for, and
  `tests/engine/recall-floor.test.js` read 0.50 in Hebrew both before and after
  a change worth twelve points against the external corpus. A green suite is
  evidence that a detector matches its author's expectations, and nothing more.
- **What it is not:** a statement about the population this product serves.
  Wikipedia biographies are third-person encyclopedic prose. The corpus
  calibrates one component and may not be used for bands, ceilings or archetype
  distribution.

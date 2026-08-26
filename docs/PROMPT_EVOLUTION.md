# PROMPT_EVOLUTION

Prompt version 2.0 · critiqued at commit `dac7465`, 26 August 2026.

---

## 1 · Prompt critique, from having executed it

### Assumptions it caused me to preserve without evidence

- **That the twelve-node path is the right shape.** The model-break pass was in
  the prompt, so I ran it — and it retired three constructs and produced a
  two-node model that explains more of the measured data. But I ran the break
  pass *against* a path the prompt had already drawn. A prompt that named no
  path would have produced the two-node model first and cheaper.
- **That a scorecard should exist.** Nine weighted categories summing to 100 is
  itself a scalar, and the prompt's own instruction — *prefer a bottleneck
  diagnosis with confidence over a single score* — applies to the scorecard as
  much as to the product's index. I complied with both and they contradict.

### Discoveries its vocabulary made hard to see

- **The trigger has a date.** Only the anti-anchor pass surfaced it, and only
  because the pass forbade five specific words. Every other section of the
  prompt is written in standing-state language — *coverage*, *rate*, *yield* —
  which has no place to put a deadline.
- **The practitioner is a user.** The prompt has one user and one buyer and they
  are the same person. The only thesis with a payer (T2) makes the operator the
  buyer, and I had to leave the prompt's frame to write it.

### Dimensions over-weighted because they were named

- **Graph-native constructs got a full section** and there is no graph in this
  environment. I spent real attention evaluating ten metrics against a lens that
  does not exist here, and deleted or deferred eight of them.
- **"Deployment and observability" at 5 points** understates its role: it is the
  only category that gates a stop condition. A five-point category holding a
  veto is a weighting error.

### Evidence classes and stakeholders omitted

- **The cost of being wrong to the user.** `AUTHORITY.md` has five reversibility
  levels and the scorecard has no harm dimension at all. Telling somebody their
  evidence is weak when it is not has a cost, and nothing here measures or
  weights it.
- **Locale as a market rather than a feature.** Hebrew-first is treated
  throughout as an implementation detail. It is plausibly the whole moat or the
  whole ceiling, and no lane asks which.

### Instructions that encouraged the wrong work

- **"Score 0–100 with evidence for every point"** rewards instrumentation.
  Two of the three score movements this session came from *measuring better*,
  not from a user getting more. See the Falsifier below, who is right.
- **"Maintain six documents"** produced six documents. They are load-bearing —
  each holds a decision or a refusal — but the instruction would have produced
  them either way, which is the problem with it.

### Contradictions inside the prompt

| | |
|---|---|
| *Work recursively / do not stop* | vs *stop when the next uncertainty requires external users* — which was true from the first minute |
| *Prefer a vector over a score* | vs *score 0–100 across nine weighted categories* |
| *Do not expand indefinitely* | vs *actively look for constructs outside this list* |

### Steps that produced no decision-relevant information

The graph-native metric evaluation, in this environment. Eight of ten were
deleted or deferred and none changed an action.

### Questions that emerged only after implementing

- If a detector improvement cannot change a user outcome, does measuring it well
  make the product better or only the repository more defensible?
- What is the standard error of the number the product shows a person? Nobody
  had asked, and asking produced a defect.

---

## 2 · Three adversarial reviews

Run **serially, each from a brief written before it and without sight of the
others**. This is *simulated independence* and is labelled as such: one reader
produced all three, and correlated blind spots are not ruled out.

### Reviewer A — Boundary Breaker

*Brief: name relevant semantic fields the prompt does not contain.*

1. **The operator is missing.** Every artifact concerns the end user. The only
   actor with a budget is the practitioner who would put this in front of a
   client, and the prompt has no stakeholder slot for them.
2. **Harm has no dimension.** A false *weak* verdict discourages somebody who
   was right. A false *usable* verdict sends thin evidence to a client. These
   are different costs and nothing weighs either.
3. **The buyer's decision process is absent from the path.** The path is
   entirely seller-side, and the one measured fact about buyers says 84% of the
   outcome is settled by ordering rather than content.
4. **Language is treated as a feature.** Hebrew-first may be the moat or the
   ceiling. No lane asks.
5. **No lane for the tool being wrong in a way the user cannot detect.** The
   product documents what it cannot catch; the prompt never asks how often.

### Reviewer B — Falsifier

*Brief: build the strongest case that the thesis or the chosen metric is wrong.*

**The metric this session most improved may be worth nothing.**

Hebrew organisation recall went 34% → 46% and is now reproducible with an
interval. Suppose T3 is right and the binding constraint is attestation. Then
organisation-name detection improves the ranking of **self-claims** — the thing
already abundant, at 78% of 520 real pitches. Every hour spent on it improved a
number attached to the wrong half of the problem.

**And the reason it was chosen is visible in the record.** It was chosen because
it was *measurable*, not because it was decisive. The stated justification — that
a Hebrew trial cannot separate definition-blocked from detector-blocked at a 59%
miss rate — is real, but it is a prerequisite argument, and prerequisite
arguments are how measurable work gets prioritised over decisive work.

**The scorecard rewards exactly this.** *Evidence and measurement validity* is
the heaviest category at 20 points, and it rises when instrumentation improves
whether or not a user is better off. Two of three movements this session are
that.

**The strongest version:** the entire document set is a mechanism for converting
an unresolved commercial question into pages that feel like progress. Four
theses and no selection is intellectually honest and operationally identical to
not deciding.

### Reviewer C — Minimalist

*Brief: can the same user outcome be reached with a service, a template, or a
much smaller product?*

1. **The five-person trial is the product.** If the practitioner sits with five
   people and does by hand what the app does, they get the answer faster and
   with better data, and the code is not on the critical path.
2. **The stated outcome fits on one page.** *"Something specific to say, and it
   is true"* needs three questions and a checklist. Not nine dimensions, not six
   layers, not an index.
3. **The recall route is an email template.** "Go ask Ronit for the message she
   sent after the project" is a sentence, not software.
4. **The strongest asset is a refusal, and refusals do not need a product.**
   *We will not let your visibility run ahead of your evidence* is a positioning
   statement a consultant can say out loud.

---

## 3 · Reconciliation

The three disagree, and they are not averaged.

**The Falsifier is substantially right and the concession is recorded rather
than argued down.** The Hebrew recall work was chosen because it was measurable.
The prerequisite argument is true and was also convenient. What partly rescues
it: the same instrumentation caught two defects — a filler phrase upgrading a
claim across a band, and an author's own report of praise scoring as outside
evidence — and both are failures of the product's central promise, not of a
detector's coverage. **Measuring better did not only produce numbers here; it
produced the two most serious defects found all session.** That is a real
counter-argument and it does not fully answer the charge.

**The Minimalist does not kill anything but resets the order**, and every
document already concludes what he concludes: run the trial before building.
Where he overreaches: a template cannot refuse. The verbatim gate and the Liebig
gate are mechanisms that hold when the user is tired and under a deadline, which
is exactly when a checklist stops being followed.

**The Boundary Breaker's harm dimension is the one adopted**, because it is
absent from both the prompt and the product's own scorecard while the product
has a five-level reversibility model sitting unused by any metric.

---

## 4 · Proposed prompt diff, v2.0 → v2.1

Only changes that alter search coverage, a decision rule, an evidence standard,
a safety boundary or execution behaviour.

1. **Add a decision gate before any implementation:** *does this change a user
   outcome, or only a number this repository reports about itself?* If only a
   number, it must be justified as a prerequisite to a specific named
   experiment, and that justification recorded. — *Addresses the Falsifier.*
2. **Add a harm dimension to the scorecard, 5 points, taken from Evidence and
   measurement validity (20 → 15):** the cost of a false verdict in both
   directions, and whether the product's stated reversibility levels are
   enforced anywhere a metric can see. — *Boundary Breaker.*
3. **Add a stakeholder lane for the operator** — whoever puts the product in
   front of the end user — with its own job, trigger and failure mode.
4. **Re-weight Deployment and observability 5 → 8**, taken from *Reliability and
   test quality* (10 → 7). It holds a veto over the stop condition; a category
   that can veto cannot be the smallest.
5. **Drop the graph-native metric section to a conditional**: run it only when a
   graph is actually present. Eight of ten constructs were deleted or deferred
   against a lens that does not exist in this environment.
6. **Require the anti-anchor pass to run before *any* section that names a
   construct**, not only before the product hypothesis. It was the single
   highest-yield instruction in the prompt and it ran once.

**Not changed:** privacy, source integrity, truth labelling, non-destructive git,
and the requirement to verify the exact deployed SHA. The meta loop may not
relax those and does not.

---

## 5 · Testing the revision against a prior decision

Re-running proposal 1 against a decision already taken: **the Hebrew
organisation work.**

Under v2.0 it proceeded on a prerequisite argument stated in a PR body. Under
v2.1's gate it would have had to name the experiment it unblocks (E1, the
five-person trial), state the threshold at which the trial becomes readable, and
record that justification before implementing.

**It would have proceeded — and it would have been visibly second in line behind
running the trial itself.** The gate does not forbid the work; it makes the
ordering explicit, which is the failure the Falsifier identified. That is a real
improvement in reasoning rather than a broader-sounding rule.

Re-running proposal 2 against the same session: a harm dimension would have
scored the *upward* band crossing far more seriously than the downward one,
because a false *usable* sends thin evidence to a client while a false *weak*
discourages somebody. I treated them as symmetric until the fix, and the
asymmetry only entered the test afterwards. **The dimension would have found the
right shape sooner.**

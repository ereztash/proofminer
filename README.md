# ProofMiner

**אתה יודע שאתה טוב. אף אחד אחר לא יודע.**

ProofMiner לוקח אדם שמנסה להתבסס כעצמאי או להשיג עבודה, ומחזיק לו את היד עד
שהוא ממוצב כאוטוריטה — לא על ידי פרסום יותר, אלא על ידי הפיכת הראיות שכבר יש
לו לנראות, מדידות ומצטברות.

> Authority is not produced by publishing more. It is produced by converting
> evidence you already own into visible, verifiable, compounding standing —
> and the bottleneck is almost never ideas.

## The headline number: the Visibility Gap

```
gap = foundation − built
```

*"הראיות שלך תומכות ב-72. העולם רואה 19."*

That gap is the user's own conscious pain, measured. Most people who open this
product open it with a large positive gap, and naming it precisely is the whole
motivational mechanism.

## Six measurable layers

| | Layer | Question |
|---|---|---|
| L1 | PROOF | What evidence do you actually hold? |
| L2 | POSITION | What single claim do you own? |
| L3 | ARTIFACT | What have you put into the world? |
| L4 | RECEPTION | How did it land? |
| L5 | CONVERSION | Who moved? |
| L6 | RECOGNITION | Who vouches for you? |

L1–L2 are the **foundation**. L3–L6 are **built** standing.

## The Liebig gate — what it does and does not prevent

```
effectiveBuilt = min(built, foundation + 25)
```

Built standing is capped by the evidence that supports it. **Publishing harder
on a thin evidence base does not raise the score.** It produces a `HOLLOW`
diagnosis and an evidence-acquisition plan instead.

Every other tool in this category rewards volume. This one refuses to — and
that is also what makes it usable by people who would rather stay invisible
than become "one of those people on LinkedIn".

**What the gate does not do** is verify the foundation. `L2` is scored from
text boxes and `L1` from text you supply, so someone determined to type
impressive sentences can raise their own ceiling. The gate stops *output* from
manufacturing standing; it does not stop *input* from doing so, and no
client-side tool can. What it does provide against that is the
`falsifiability` dimension, which rewards the presence of a link, a date, a
named source — the things a fabricator has to invent in a checkable form.

| | built low | built high |
|---|---|---|
| **foundation low** | `STALLED` — start by mining | `HOLLOW` — louder than your proof |
| **foundation high** | `BURIED` — evidence nobody has seen | `COMPOUNDING` — scale and convert |

## Cross-layer integrations

The differentiation is not any single measurement — it is the edges between
them. Six directed integrations carry data between layers:

| | Edge | What it does |
|---|---|---|
| I1 | L4 → L1 | A post that beat your baseline **becomes new evidence**. Output is input. |
| I2 | L4 → L1 | Reception **recalibrates the ranking weights** to your own audience. |
| I3 | L2 → L1 | Gap engine: eight evidence archetypes → concrete acquisition plays. |
| I4 | L5 → L2 | What converted vs. what you claim — positioning drift detection. |
| I5 | L1 → L3 | Evidence has a shelf life; the queue prioritises what is going stale. |
| I6 | L6 → L2 | Third-party recognition raises claim defensibility. |

## Hand-holding: exactly one next move

Every screen answers *"what do I do now?"* with one action, never a menu — with
the reason, the layer it lifts, and the effort in minutes. Doing the Next Move
repeatedly *is* the product.

## Honesty guarantees, and their limits

Stated as precisely as the code implements them, because a product whose axis
is anti-hype cannot overstate its own integrity.

- **Drafts cannot acquire a checkable fact you did not supply.**
  `validateGrounding()` rejects any draft containing a number — digits or
  spelled out — or a named entity absent from its cited proof, and flags
  superlatives. Tested across every angle × CTA × locale, and the optional
  model rewriter passes through the same gate.
  **What it cannot catch:** a real number attached to the wrong subject, an
  invented job title made of ordinary words, or a claim stitched across two
  separately-true proofs. Those need a reader. The studio says so on screen
  rather than implying the check is a truth gate.
- **No score without inputs.** A layer with no data reports zero confidence and
  says what unlocks it — never a red zero. The foundation renormalises over
  layers that have data, so an unfilled form is not read as an absent claim.
- **The product refuses to call you a fraud for under-reporting.** `HOLLOW` is
  only ever returned when the evidence base has actually been measured;
  otherwise the answer is `UNCATALOGUED` — *not written down, not absent*.
- **Demo material cannot be laundered.** It is excluded from calibration
  unconditionally, dropped from scoring the moment any real evidence exists,
  refused by the compounding loop, kept out of the primary action, and its
  marker survives into draft bodies and provenance footers.
  **Deliberate exception:** with *only* the sample loaded, the sample is scored
  so it can demonstrate anything at all — and every screen carries a demo
  banner while that is true.
- **Integrity dimensions are never tuned.** `falsifiability` and `recency` are
  excluded from calibration by design, so the model can never learn to reward
  unverifiable claims.
- **Calibration presents itself as a hypothesis** until it has the sample to be
  anything more. Seven correlations on a small sample is mostly noise, and the
  panel says that instead of asserting a finding.
- **Your data never leaves your device** — no server, no account, no telemetry,
  no external font, zero outbound requests. **Unless** you explicitly enable the
  optional model rewriter, which sends the draft *and the evidence it cites* to
  the provider you configured. That is stated at the point of the toggle.

## Run locally

```bash
npm install
npm run dev      # dev server
npm run check    # lint + tests + production build
```

## Documentation

- [`docs/TELOS.md`](docs/TELOS.md) — why this exists, who it is for, definition of done
- [`docs/METHOD.md`](docs/METHOD.md) — the full measurement specification
- [`docs/UX.md`](docs/UX.md) — designing for the pain the user already feels
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — decisions and tradeoffs

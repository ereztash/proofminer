# EXPERIMENTS

Preregistrations. Each states its prediction, its exclusions and its decision
rule **before** exposure, because a rule written afterwards resolves to whatever
happened.

Nothing here is running. Every one of them is blocked on external people,
elapsed time or the owner's decision, and that is recorded rather than
substituted for with something measurable in code.

---

## E1 · The five-person trial — separates T1 from T3

**Status** specified, not run. Fully written in `docs/TELOS.md`; this is the
preregistration.

**Question.** Is the binding constraint that people cannot say what they did
(definition), that they can say it and have not shown it (visibility), or that
they can say it and hold nothing anybody else said (attestation)?

| | |
|---|---|
| **Population** | five Hebrew-speaking people from the ICP, recruited from those who booked a discovery call and did not buy |
| **Unit** | one person |
| **Window** | day 0 (45 min, watched, silent) and day 14 (20 min) |
| **Denominator** | five. Stated because three of five is not a 60% success rate — it is the absence of a wall, which is a much smaller claim |
| **Assignment** | none. This is descriptive, and no causal language may be attached to it |

**Preregistered coding rule.** Every participant is coded into exactly one of
four states from the day-0 recording, before the day-14 conversation:
definition-blocked · visibility-blocked · attestation-blocked · neither. The
fourth exists because the temptation at coding time is to score an ambiguous
transcript as visibility-blocked, which is the reading that confirms the
product.

**Predictions, written now.**

1. **≥3 of 5 code as attestation-blocked** — T3 over T1. Basis: 78% of 520 real
   pitches carried a magnitude and 3% carried anything anybody else said.
   *Confidence: low.* That population is adjacent, not this one.
2. **≤1 of 5 returns unprompted within 14 days.** Basis: this repository holds
   zero observations of a repeat visit. If this is wrong, T1's dependency is not
   the problem it looks like.
3. **≥3 of 5 name a dated trigger** when asked what happens in the next thirty
   days. Basis: the anti-anchor derivation. If they do not, the pain is chronic
   and unbudgeted, and every commercial plan downstream weakens.

**Failure conditions.** If 3 of 5 are definition-blocked, the product measures
the wrong thing and building stops. If nobody says a version of *"I forgot about
that"*, the reveal does not fire and the product is a re-sorter of things people
already knew.

**Exclusions, fixed now.** Past clients (contaminated). Close friends (they
carry the tool for you). Anyone who has seen the method. A session where the
observer answered a question during the silent run — the contract is the
instrument, and a broken one is not a data point.

**What it may not be used for.** Ranking acquisition mechanisms; any statement
about conversion; any causal claim at all.

### Operator checklist — added 28 August 2026

Every element below already existed, in `docs/TELOS.md` and in the
preregistration above. **Nothing here is new and no threshold, prediction,
exclusion or coding category has been altered** — this is the same protocol in
the order it is executed, because the next external action should be runnable
without re-reading forty thousand words to reconstruct it. Where the two differ,
the sections above and `docs/TELOS.md` govern.

**Before anybody is contacted**

- [ ] Production serves the commit being reasoned about. `curl -s
      https://proofminer-gamma.vercel.app/ | grep proofminer-commit` and check it
      against `main`. A trial run against an older build measures an older app.
- [ ] **Send the production URL only.** Preview deployments sit behind Vercel SSO
      and serve a login page; a participant who receives one concludes the tool
      is broken and you never hear why.
- [ ] Recruit **five**, Hebrew-speaking, from the ICP. Cleanest source: booked a
      discovery call, did not buy.
- [ ] Exclusions applied: past clients, close friends, anyone who has seen the
      method.
- [ ] **Two first, then the five.** The first two test the protocol and can be
      anyone adjacent. Not in parallel — if the first two hit the same wall at
      minute three, stop and fix it rather than spending a scarce sample proving
      it twice.
- [ ] Prepared: recruiting message · day-0 contract script · observation sheet
      with the four criteria · the preregistered coding rule · the day-14 script
      with its three questions in order.
- [ ] **Build nothing during the trial.** If you want their proof units, take a
      screenshot of First Light. The JSON export exists and contains the client
      mail they pasted — do not ask for it.

**Day 0 — 45 minutes, watched, silent**

- [ ] 8 minutes, unguided, recorded: *what is bothering you most about work right
      now?* This recording is what the falsifier is coded from. Nothing before it.
- [ ] Then, still before they touch the tool: *what happens in the next thirty
      days that makes this matter?* Second because the first eight must stay
      unguided; before the tool because afterwards they answer in its vocabulary.
- [ ] State the contract out loud: *I will not answer questions while you use it;
      if you get stuck, that is what I need to see.* **The silence is the
      instrument.** Every unanswered question is a finding. An observer who
      answers one has broken the instrument, and that session is not a data point.
- [ ] Watch. Record without asking: **which track they chose on screen 0**, and
      **whether they corrected the extraction unprompted** — *"no, it was
      twenty-one days, not nineteen."* A correction is a far stronger signal than
      agreement.
- [ ] 10 minutes afterwards for criterion 2 — a version of ***"I forgot about
      that."***
- [ ] Code into exactly one of four states **before** day 14:
      definition-blocked · visibility-blocked · attestation-blocked · neither.
      The fourth exists because the temptation at coding time is to score an
      ambiguous transcript as visibility-blocked, which is the reading that
      confirms the product.

**Day 14 — 20 minutes. Do not say in advance that it is about publishing.**
Criterion 3 is checked in public, not from memory. **The order is load-bearing:**

- [ ] 1 · *Have you said any of this out loud to anyone since?* — every later
      question primes it.
- [ ] 2 · *Why you?* — criterion 4; wants evidence, not an explanation.
- [ ] 3 · For whoever published: *whose words were they — your claim, or
      something somebody else said about you?* — separates visibility-blocked
      from attestation-blocked.
- [ ] Then anything they want to say.

**Reading it — thresholds unchanged, restated for the sheet**

| | Denominator **five**, always stated |
|---|---|
| ≥3 attestation-blocked | T3 over T1 |
| ≤1 returns unprompted in 14 days | as predicted; if wrong, T1's dependency is not the problem it looks like |
| ≥3 name a dated trigger | the pain has a date |
| **3 of 5 definition-blocked** | **the product measures the wrong thing and building stops** |
| **nobody says a version of "I forgot about that"** | **the reveal does not fire; the product is a re-sorter of things people already knew** |
| ≥2 repeated a number to somebody unprompted | the quotability directive is live, and the trial already collected what they quoted |

Three of five is **not a 60% success rate.** It is the absence of a wall, which
is a much smaller claim.

---

## E2 · Three discovery calls with the tool as intake — tests T2

**Status** blocked on the owner's decision. Not started.

**Question.** Does a client arriving with their own material already retrieved
and ranked change what the first fifteen minutes of a discovery call are spent
on?

| | |
|---|---|
| **Unit** | one discovery call |
| **n** | three, then stop and look |
| **Comparison** | the practitioner's own recollection of the previous three calls, written down **before** the first instrumented one |
| **Window** | the first fifteen minutes |
| **Measure** | minutes elapsed before a specific, checkable claim about the client's own work is said out loud |

**Prediction.** The elapsed time falls. **Failure condition.** It does not fall,
or it falls and the call gets worse — the client feels examined rather than
helped.

**This is a matched recollection, not a control.** It cannot support a causal
claim and none will be made from it. It is powered to notice a large effect and
nothing else.

**The ethical failure mode is the reason this is not simply switched on.** The
tool's credibility comes from having nothing to sell. Using it as a funnel while
screen 0 still says so is the one move that destroys the asset. **If E2 runs,
screen 0 has to say what the tool is for first.**

---

## E3 · The intake question — the twelve-month falsifier

**Status** running the moment there is a first conversation. Costs nothing.

**Instrument.** One free-text question at the intake of every conversation:
*what made you reach out?* Unprompted, never a list to choose from.

| | |
|---|---|
| **Denominator** | every intake, including the ones that go nowhere |
| **Window** | twelve months from the tool being in front of people |
| **Preserved** | no-response, negative-response and not-qualified cases. A ledger of only the conversations that happened measures the ledger |

**Decision rule, fixed now.** Twelve months with **not one** answer that mentions
the tool falsifies the demand-creation story the no-capture rule rests on. The
correct response is to say so, not to wait longer.

**Why this is the only instrument available.** Refusing capture means there is no
way to tell *working slowly and invisibly* apart from *not working* — the
condition in which people kill a working asset or keep feeding a dead one.
Self-report is weak and it is what is left. One published study found software
attribution missing 90% of what buyers themselves credited.

**Labelled self-report wherever it appears.** It may never be described as
attribution.

---

## E4 · Trial observations that cost nothing and cannot be recovered later

Already in the day-0 and day-14 scripts in `docs/TELOS.md`. Listed here because
each is unrecoverable the day after.

| Observation | Tests | When |
|---|---|---|
| Did they repeat a number to anybody, unprompted? | whether engineering for quotability is worth anything | day 14, asked first — every later question primes it |
| Did they correct the extraction unprompted? | ownership of the evidence. A correction is a far stronger signal than agreement | day 0 |
| Which track did they choose on screen 0? | the ICP cut. Nothing transmits it to us afterwards | day 0 |
| What happens in the next thirty days? | whether the pain has a date | day 0, after the eight unguided minutes |
| Did they take the recall route, and did what came back move them? | T3 confirming itself from inside the trial | both |

---

## What is deliberately not being run

- **Any A/B test in the product.** It has no users, no server and no assignment
  mechanism. An A/B test here would be a simulation.
- **Any acquisition-channel comparison.** `docs/MARKET.md`'s rule stands: no
  ranking before an adequate linked baseline exists, and there is none.
- **Any metric built on repeat visits.** Two shipped integrations depend on
  them and both are marked as constructs with no eligible design in
  `docs/MEASUREMENT_MODEL.md`. Measuring them would require building the
  telemetry the product refuses.

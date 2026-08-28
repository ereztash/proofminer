# JOURNEY FRICTION — JF1

Observation layer version 1.0 · written 28 August 2026 against commit `c829d80`.

What happens between first exposure to ProofMiner and a useful external action,
which parts of that journey cost human effort, and — the part that decides
anything — which of those costs may safely disappear.

**The objective is not a frictionless application. It is zero unexplained
friction.** A step that protects eligibility, provenance, authorship or privacy
is doing work; removing it because it takes time is how a product loses the
thing it was trusted for.

---

## 0 · The boundary with E1, stated first because it is the easy mistake

**E1 is preregistered in `docs/EXPERIMENTS.md` and nothing here touches it.** Its
prediction, thresholds, exclusions, coding rule, failure conditions and decision
rule are unchanged, and no journey-friction outcome has been added to them. A
preregistration edited after exposure to later theory resolves to whatever the
later theory expected, and this document is later theory.

JF1 is a **separate observational layer** with its own identifier, its own
questions and its own register. It may run in the same room as an E1 day-0
session on one condition: **it changes neither participant behaviour nor
observer behaviour.** In practice that means JF1 adds no question during the
silent run, no prompt, no screen, and no instruction. It adds a second column to
what the observer writes down, and a debrief that happens after the E1 material
is already collected.

Where the two disagree about what a session means, they are analysed separately
and reported separately. E1 answers *what is the binding constraint*. JF1
answers *where does the effort go*.

---

# Phase A — the journey, reconstructed from the implementation

The provisional model in the brief was

```
Exposure → Comprehension → Trust/qualification → Input route
  → Material acquisition or Recall → Processing → First Light
  → Next Move → External Action
```

Six things in the code contradict it. Each is stated with what says so.

**1 · Qualification is a rendering gate, and trust is not a stage at all.**
`onboardingView` renders the paste box only once the situation radio is
answered — `situation && situation !== NOT_ME ? coldStartBody(...)`. Until then
the screen is a headline, a paragraph and three options. The pledge — *"הכל
נשאר במחשב שלך — אין שרת ואין חשבון"* — is in a **closed `<details>` below the
paste box**. So qualification precedes the route, and trust is offered
optionally, after the ask. Trust is not a stage in this journey; it is a
disclosure the person may never open.

**2 · The input route is not a question anybody is asked.** Three routes leave
screen 0 and they are three buttons of decreasing weight under one paste box:
`coldStart` (primary), `coldRecall` (secondary), `coldSample` (ghost), with
`routeNote` — *“אין לך מסמך להדביק? ‘התחל משחזור’ עושה את אותה עבודה מתוך
מקרה אחד שאתה זוכר”* — as a paragraph between them. The default route is *paste*, and
taking any other one requires reading past the primary action. The route
decision is real and it is never posed as a decision.

**3 · "Provide material" is answered on screen before it is attempted.**
`firstStepBody` already names what qualifies: *client emails, a thread about a
project, an old proposal, a meeting summary, a message you wrote to your team* —
and says outright that a CV works but that you already know its three best
lines. The product does not withhold the answer. **Whether the cost here is not
knowing (SEARCH) or knowing and having to go and get it (IMPLEMENTATION) is
therefore an open question with a clean falsifier**, and it is the single most
valuable thing JF1 can decide. See F-1 in the register.

**4 · Processing is sub-perceptual on the default route.** `coldStart` calls
`remine()` synchronously and sets `ui.screen = 'firstLight'` inside the same
click handler. There is no spinner because there is nothing to wait for.
Measured below. The one perceptible processing state in the product is
`extractSource`, which is a network call, off by default, behind an explicit
confirm, and unreachable for a participant without an API key.

**5 · First Light is three screens, not one.** `firstLightView` branches on the
inventory:

| Branch | Condition | What is on screen | Only action offered |
|---|---|---|---|
| **empty** | `!proofs.length` | `emptyTitle` / `emptyBody` + the recall bridge | go to Sources · ask someone who was there |
| **thin** | proofs exist, none `≥ BAND_USABLE` | `thinTitle` / `thinBody` + a blocked proof card + the recall bridge | strengthen (→ Sources) · ask someone who was there |
| **reveal** | something clears the band | primary proof card, secondary findings, expected-vs-found | draft it · see the full picture |

Two of the three branches are dead ends with respect to the reveal, and
`docs/TELOS.md` already argues that the honest way out of them — the errand —
cannot beat a ten-minute clock. **A journey model with one First Light node
cannot see which of these three a participant met.**

**6 · There are three external actions, not one.** The brief's terminal node is
singular. The product produces three, and they are not substitutes:

| | External action | Where it is produced | What it costs the participant |
|---|---|---|---|
| **X-A** | Publish a grounded artifact | `studio` → copy → paste into a platform → `markPublished` | writing, exposure, a public claim |
| **X-B** | Send a retrieval errand to a named person | `recall` → `retrievalSent` | asking somebody for something |
| **X-C** | Execute an acquisition play | `gaps` → the play's own instruction | 5–45 minutes of outside-world work |

E1's criterion 3 measures **X-A only**. `docs/TELOS.md`'s third-state
hypothesis — that the actor's problem is the acquisition of testimony rather
than the ranking of their own account — is a claim that **X-B is the spine**.
JF1 must be able to tell them apart, which means it counts all three and never
reports a participant who sent two retrieval errands as having taken no external
action.

## The journey as implemented

```
Exposure  (OUTSIDE_PRODUCT_OBSERVABILITY)
  → Comprehension        screen-0 headline + body
  → Qualification        consultant / expert / NOT-ME  ── gates rendering
  → [Trust]              optional, folded, below the ask
  → Route                paste (default) · recall · sample
  → Material acquisition mostly outside the tab
  → Submission           coldStart / coldRecall / coldSample
  → Processing           deterministic, sub-perceptual
  → First Light          empty | thin | reveal
  → Next Move            one deterministic instruction from nextMove()
  → External action      X-A publish · X-B errand · X-C play
  → Response             cannot observe
```

## Micro-behaviour map

The unit of analysis. Not screens, not routes.

| # | Stage | Micro-behaviour |
|---|---|---|
| M01 | Exposure | encounter the link somewhere |
| M02 | Exposure | decide it is worth opening now |
| M03 | Comprehension | read the headline · decide whether it describes them |
| M04 | Comprehension | read `painBody` · decide whether the second sentence — *"וממילא זה די בייסיק"* — is theirs |
| M05 | Qualification | read three options · locate themselves among consultant / expert / not-me |
| M06 | Qualification | notice that answering it opened the rest of the screen |
| M07 | Trust | notice the folded pledge exists |
| M08 | Trust | open it · decide whether pasting client material here is safe |
| M09 | Route | read `firstStepTitle` and understand what is being asked for |
| M10 | Route | read `firstStepBody` and learn what qualifies as material |
| M11 | Route | notice the three buttons differ · decide which route is theirs |
| M12 | Material | decide **which** document · recall that it exists |
| M13 | Material | decide **where** it is — mail, drive, phone, a thread |
| M14 | Material | leave the tab |
| M15 | Material | find and open it |
| M16 | Material | select the relevant part · decide how much is relevant |
| M17 | Material | copy |
| M18 | Material | return to the tab · find it again |
| M19 | Material | paste |
| M20 | Material | decide it is enough · stop adding |
| M21 | Submission | press *מצא לי את הראיות* |
| M22 | Submission | understand that something happened |
| M23 | Processing | wait (measured: not perceptible on this route) |
| M24 | First Light | read the headline · learn which of the three branches they are in |
| M25 | First Light | read their own sentence back |
| M26 | First Light | decide whether they recognise it — **E1 criterion 2 lives here** |
| M27 | First Light | decide whether to open *how this was read* |
| M28 | First Light | correct the extraction, or not — **E1 day-0 observation** |
| M29 | First Light | choose between the offered action and the full picture |
| M30 | Recall entry | understand that the errand is not a diary entry (`recall.notEvidence`) |
| M31 | Recall | remember one case · name the project |
| M32 | Recall | name who was in the room — **the only required field in the product** |
| M33 | Recall | read the drafted errand · decide whether they would send it |
| M34 | Recall | send it outside the product · mark it sent |
| M35 | Recall | receive material back · paste it (`retrievalArrived` closes the errand and adds nothing to the evidence base) |
| M36 | Next Move | read one instruction · decide whether to obey it |
| M37 | Next Move | find the thing the instruction names |
| M38 | Studio | choose an angle · read the draft |
| M39 | Studio | edit it into their own words |
| M40 | Studio | read the grounding verdict · decide whether it blocks them |
| M41 | Studio | copy — with or without the provenance footer |
| M42 | External | leave · open the platform · paste · **publish** |
| M43 | External | return · mark published · supply a URL, or not |
| M44 | Measure | go and read the post's analytics · copy the block · paste it |
| M45 | Measure | decide whether nothing came in, and say so (`noInbound`) |

---

# Phase B — observability audit

**Observable now** means: recoverable, without asking the participant to do
anything and without adding code, from one of

- **OBS** — direct observation by the person in the room (E1 already requires them to be there, silent, for 45 minutes);
- **STATE** — the persisted `localStorage` entry, which already carries the timestamps below;
- **DOM** — the served page, including `meta[name="proofminer-commit"]`, which names the build without any request;
- **PW** — the existing Playwright production smoke;
- **DEBRIEF** — labelled self-report after the unassisted run.

| Stage | Micro-behaviour | Observable now? | Existing evidence source | Missing information | Needed for a decision at n≈5? |
|---|---|---|---|---|---|
| Exposure | M01–M02 | **No** | — | everything | **Yes**, and it is unobservable in principle → `OUTSIDE_PRODUCT_OBSERVABILITY`, captured as `SELF_REPORT` |
| Comprehension | M03–M04 | Partly | OBS (where the eyes stop, what is said) | whether the second sentence landed | Yes — DEBRIEF Q2 |
| Qualification | M05–M06 | **Yes** | OBS + STATE (`profile.practiceMode`, `profile.declined`) | why they chose it | Yes — one debrief probe |
| Trust | M07–M08 | **Yes** | OBS (did they open the pledge) | — | Yes, and observation is sufficient |
| Route | M09–M11 | **Yes** | OBS + STATE (`sources[].demo`, `retrievals.length`) | — | Yes — E1 already records the track choice |
| Material | M12–M13 | **Only by OBS** | OBS | which application they opened | **Yes.** No product telemetry can see this |
| Material | M14–M18 | **Only by OBS** | OBS | duration outside the tab | **Yes.** Happens outside the product entirely |
| Material | M19–M20 | **Yes** | OBS + STATE (`sources[].addedAt`, char count) | — | Yes |
| Submission | M21–M22 | **Yes** | OBS + STATE (`profile.onboarded`, `sources[]`) | — | Yes |
| Processing | M23 | **Yes** | measured synthetically below | real-device latency | **No** — see *Technical friction* |
| First Light | M24 | **Yes** | OBS + STATE (branch is derivable: `proofs` × `BAND_USABLE`) | — | Yes |
| First Light | M25–M26 | **Only by OBS** | OBS — this is E1 criterion 2 | — | **Yes**, and only a human can hear it |
| First Light | M27–M28 | **Yes** | OBS — E1 already records unprompted correction | — | Yes |
| First Light | M29 | **Yes** | OBS + STATE (`profile.sawFirstLight`) | — | Yes |
| Recall | M30–M33 | **Yes** | OBS + STATE (`retrievals[].createdAt`, `recipient`, `about`) | — | Yes |
| Recall | M34 | Partly | STATE (`retrievals[].askedAt`) — **self-declared** | whether the message was actually sent | Yes — verified at day 14, not from state |
| Recall | M35 | Partly | STATE (`closedAt`, plus a new source) | what came back | Yes — the new source is the evidence |
| Next Move | M36–M37 | **Yes** | OBS + STATE (`playLog`) | — | Yes |
| Studio | M38–M41 | **Yes** | OBS + STATE (`artifacts[].angle/channel/body`) | — | Yes |
| External | M42 | **No** | — | whether it was published | **Yes** — E1 criterion 3 verifies this **in public at day 14** |
| External | M43 | Partly | STATE (`artifacts[].status`, `publishedAt`, `url`) — **self-declared** | — | Yes, with the caveat below |
| Measure | M44–M45 | **Yes** | STATE (`receptions`, `profile.noInboundAt`) | — | Unlikely to be reached inside a 14-day window; recorded if it is, never chased |

## What was measured rather than asserted

Run against the real app in the existing jsdom harness, on commit `c829d80`.

**1 · The persisted state already carries the journey clock.** Walking screen 0
→ paste → First Light → studio → published and dumping every timestamp after
each step:

```
state.createdAt        first open, preserved across reloads by normalizeState
sources[].addedAt      the paste landed
sources[].minedAt      the mining pass that produced First Light
proofs[].createdAt     preserved across re-mining
artifacts[].createdAt  a draft became a record
artifacts[].publishedAt  self-declared publication
retrievals[].createdAt / askedAt / closedAt   the errand's three states
receptions[].capturedAt · conversions[].at · replies[].at · recognitions[].at
profile.noInboundAt · playLog[archetype]
```

`minedAt − createdAt` **is** time-to-First-Light, already recorded, with no
instrumentation. It is reconstructible from the participant's own device
without anybody adding a line of code.

**2 · The interval most likely to hold the friction leaves no trace at all.**
The persisted entry after the qualifying question is answered is **byte-identical**
to the entry before it — 668 bytes either side, for `consultant` and for `expert`
alike. Nothing is written between screen-0 render and the paste
landing. So M12–M18 — decide which document, decide where it is, leave, find,
open, select, copy, come back — are invisible to the product's own persisted
state, and would remain invisible to any event ledger, **because most of them
happen in another application.** The only instrument that can see them is the
person in the room. This is the audit's central finding.

**3 · `profile.sawFirstLight` does not mean First Light was shown.** It is set
by `draft` and by `firstLightDone` — the two ways *out* of the reveal — and
deliberately left alone by `coldRecall` and `gotoRecall`. It reads *the reveal
was spent*, not *the reveal appeared*. Anything that treats it as a render
signal will misclassify exactly the participants JF1 cares most about.

**4 · `artifacts[].status = 'published'` is a claim, not an event.** The walk
above reached `status: 'published', publishedAt: <ts>, url: ''` without anything
leaving the device. Per §11 of the brief this is **PREPARED plus a self-report**,
never COMPLETED. `docs/MEASUREMENT_MODEL.md` already classifies `exposure` as
*cannot observe*; JF1 inherits that and does not soften it.

## Missing observability, in full

Six things. Five of them are missing on purpose or in principle.

| # | Missing | Why | Can product code fix it? |
|---|---|---|---|
| 1 | What happened before the tab opened | no server, no referrer story, and attribution software misses ~90% of what buyers themselves credit (`docs/MARKET.md`) | **No.** `SELF_REPORT` only |
| 2 | Where the minutes go inside M12–M18 | most of it happens in another application | **No.** Observation only |
| 3 | Why a participant paused | psychology is not inferable from a duration | **No.** Wording or nothing (§6) |
| 4 | Whether an external action really occurred | the product cannot see outside itself | **No.** Verified in public at day 14 |
| 5 | Wall-clock duration between in-app steps | — | **Yes, and it already is:** the STATE timestamps above |
| 6 | Retries and backtracks inside the app | — | **Partly:** repeated `sources[]`, repeated `artifacts[]`; fully visible to OBS |

---

# Instrumentation necessity decision

## NEW INSTRUMENTATION REQUIRED: **NO**

Not "not yet", and not "deferred pending budget". For JF1 at n≈5 the correct
amount of new product instrumentation is zero, and the reasoning is per
candidate rather than general.

The gate: instrumentation is permitted only when **(A)** the information cannot
be reconstructed reliably from existing evidence, **(B)** it is likely to change
a product decision, and **(C)** it can be added without materially increasing
friction, privacy risk or complexity. All three must hold.

| Candidate event | A | B | C | Verdict |
|---|---|---|---|---|
| `first_light.rendered` with duration | **fails** — `minedAt − createdAt` is already in state, and an observer with a notebook is required to be in the room by E1 | passes | passes | **Refused** |
| `route.chosen` (paste / recall / sample) | **fails** — three visually distinct buttons watched by a silent observer; also derivable from `sources[].demo` and `retrievals` | passes | passes | **Refused** |
| `material.acquisition_duration` | **fails and passes at once** — irreducible, but the part that matters happens in another application, so the event would time *absence from the tab* and call it acquisition | **fails** — a number that cannot separate "hunting through Gmail" from "reading the pledge" changes no decision | passes | **Refused** |
| `stage.dwell_ms` per screen | fails | **fails** — at n=5 a dwell time with no reason attached invites exactly the inference §6 forbids: psychology from telemetry | passes | **Refused** |
| `backtrack` / `retry` | fails — visible to OBS, and repeated records are already in state | passes | passes | **Refused** |
| `help_requested` | **passes** — nothing in the app can see it | passes | **fails** — the only way to record it in-product is to add a control that invites it, which changes the behaviour being measured | **Refused** |
| `external_action.*` | passes | passes | **fails** — the product cannot observe outside itself; an event here would record a claim and dress it as an observation | **Refused** |
| Web Vitals / RUM | passes | **fails** — see below | fails (remote transport, or a surface nobody asked for) | **Refused** |
| Session replay (rrweb) | passes | passes | **fails hard** — the replay would capture pasted client mail | **Refused** · `DEFERRED_PRIVACY_RISK` |
| PostHog / GrowthBook / OpenTelemetry | passes | fails at n=5 | fails — a server, an account and a network path, in a product whose first screen pledges none of the three | **Refused** |

**The general reason, stated once.** With five participants and a silent
observer already contracted to sit in the room for 45 minutes, the human is a
higher-resolution instrument than an event ledger, and it can answer the one
question the ledger structurally cannot: *why*. An event stream would add
precision to durations that nobody will act on and would supply no reason for
any of them. It would also spend the product's scarcest asset — a first screen
that says *no server, no account* and is telling the truth — to buy that.

**What would reverse this decision.** Written now, so it is not settled
afterwards by whichever reading is convenient:

1. JF1 runs beyond the room — participants using the tool unobserved, where no
   human is present to see M12–M18; **and**
2. a friction candidate survives five participants with `necessary_status:
   UNKNOWN` and two competing mechanisms that a duration would separate; **and**
3. the duration can be recorded locally, exported only on the participant's own
   deliberate action, and contains no content.

Two of the three are not enough. All three, and the ledger schema in the brief's
§14 is the right shape to build — allowlisted fields, `schema_version`,
behaviour and not content, and a failure mode that never blocks the app.

---

# Technical friction — ruled out for now, with the number

`docs/METHOD.md`'s engine is deterministic and local; the whole runtime is one
zero-dependency bundle, 78 kB gzipped at this commit. The only network call in `src/`
is `src/adapters/llm.js:79`, which is off by default and behind two nested
consents.

Mining cost, measured in the jsdom harness on varied Hebrew evidence prose:

| Input | Cost | Units produced |
|---|---|---|
| 498 chars (≈ a short mail) | 5 ms | 5 |
| 2,018 chars (≈ a client mail) | 8 ms | 20 |
| 6,064 chars (≈ a long thread) | 22 ms | 37 |
| 15,168 chars (≈ a CV plus a proposal) | 55 ms | 47 |
| 40,453 chars | 142 ms | 49 |

**This is synthetic and is labelled as such.** It is not evidence that the
product feels fast on a five-year-old phone on hotel wifi. It is enough to say
that *the deterministic path is not a plausible friction mechanism*, which is a
much smaller claim and the only one needed to keep Web Vitals out of the
product for now.

**Never concluded from this:** that the UX is good because the numbers are
small. **Never concluded from a slow synthetic number:** that the UX is bad.

**What re-opens it.** Any participant who waits visibly, or says a version of
*"it's stuck"*, or whose First Light does not appear on the first press. Then
the mechanism is measured on the actual device, once, before anything is
redesigned.

---

# Privacy analysis

The material this product handles is client correspondence, salary-relevant
outcomes and unpublished evidence, pasted by somebody who is frequently between
jobs. That is the reason for no server, no account and no telemetry, and it is
the reason JF1's answer above is the one it is.

| Asset | JF1's treatment |
|---|---|
| Pasted source text | **Never leaves the device, never enters a JF1 record, never quoted in the register.** The register may name a *class* — "a client mail" — never a line of it |
| The JSON export | **Not requested.** `docs/TELOS.md` already forbids asking for it during the trial, because it contains the client mail. JF1 does not create an exception |
| Screen recording | Not taken by default. If a session is recorded, the recording is a research artifact under the participant's control and is never a substitute for the observation sheet |
| Session replay | `DEFERRED_PRIVACY_RISK`. rrweb would capture exactly the material the product exists to protect |
| Participant identity | `participant_code` only — `P1…P5`. No name, no employer, no client name in any JF1 file |
| Quotes | Verbatim wording is the strongest evidence JF1 has and is preserved, **with any client or employer name replaced by a bracketed role** — `[לקוח]`, `[מעסיק]` |
| Exposure | `SELF_REPORT`. It may never be written down, summarised or spoken about as `ATTRIBUTION` |
| Anything a participant asks to be struck | Struck, including from the register, with the fact of the strike recorded |

The observation sheet holds behaviour and wording. It does not hold evidence.

---

# JF1 observer protocol

## Before

- Read `docs/EXPERIMENTS.md` E1 and the operator checklist. **E1's contract
  governs the room.** JF1 adds nothing to the silent run.
- Have the build identity to hand: `curl -s <production URL> | grep
  proofminer-commit`. A session is a data point about a commit.
- One sheet per participant, two layers, in this order. The second layer is
  filled in **after** the session, never during it.

## Layer 1 — during the silent run · behaviour only

| Timestamp | Micro-behaviour (M##) | Observation | Exact wording if spoken | Assistance? |
|---|---|---|---|---|

Rules, and they are the instrument:

- **No interpretation in this table.** *"Scrolled to the top twice"* is an
  observation. *"Was confused"* is not, and does not go here or anywhere until
  layer 2 has an alternative explanation beside it.
- **Wording is copied, not paraphrased.** It is the only evidence that can
  support a psychological reading (§6), and a paraphrase destroys it.
- **Every unanswered question is a finding**, and it is E1's rule before it is
  JF1's. If the observer answers one, the session is not an E1 data point;
  record that it happened and why.
- **Note the absences too**: the pledge never opened, `firstStepBody` never
  read, the secondary route never looked at.
- **M14 is a real row.** When the participant leaves the tab, write down what
  they opened and when they came back. That interval is the thing no ledger can
  see.

## Layer 2 — after the session · interpretation, kept separate

| Observation | Candidate interpretation | Alternative explanation | Confidence |
|---|---|---|---|

Worked example, in the form required:

> **OBSERVATION** · 00:04:12 · M12–M13 · pause 34 s, scrolled up twice, asked
> *"איזה חומר מתאים פה?"*
> **CANDIDATE INTERPRETATION** · search/evaluation cost at "which document".
> **ALTERNATIVE** · they know exactly which document and are recalling *where*
> it is — an implementation cost wearing a search cost's clothes. The scroll may
> also be a re-read of `firstStepBody`, which answers the question asked.
> **CONFIDENCE** · LOW. One participant, two mechanisms, no discriminator yet.

**Do not rewrite layer 1 from layer 2, ever.** And do not rewrite either from
the debrief — a participant's later account of a pause is a separate,
lower-tier observation, not a correction of the record.

## Debrief — after the unassisted run only

Stored as `SELF_REPORT`. Asked in Hebrew, in this order, after E1's own material
is collected so that nothing here primes it.

| | Question | What it is for |
|---|---|---|
| 0 | *מה גרם לך לפתוח את ProofMiner עכשיו?* | Exposure. **`SELF_REPORT`, never `ATTRIBUTION`** |
| 1 | *איפה היית צריך לחשוב הכי קשה?* | locates cost without naming a stage for them |
| 2 | *האם היה שלב שלא היה ברור למה הוא נדרש?* | candidate sludge |
| 3 | *האם היה משהו שציפית שהמערכת תדע לבד?* | the automation table, in the participant's words |
| 4 | *מה כמעט גרם לך לעצור?* | severity, and it is the question that finds abandonment |
| 5 | *מה הרגיש כמו עבודה שלא היית אמור לעשות?* | implementation friction, self-reported |
| 6 | *האם היה חיכוך שדווקא גרם לך לסמוך יותר על התוצאה?* | **necessary friction.** The one question that protects the guardrails |
| 7 | *מה הדבר הראשון שהיית רוצה לקחת מכאן ולעשות איתו משהו?* | which external action, of the three, is theirs |

Question 6 is not optional and is not moved later. Without it the debrief is a
list of complaints, and a list of complaints removed one by one is how a product
loses its protective structure.

---

# Friction taxonomy

Every candidate gets exactly one **primary** type. Where two mechanisms are
plausible, both are recorded as competing hypotheses and neither is chosen.

| Type | The person… | In this product, typically |
|---|---|---|
| **SEARCH** | does not know what they need, where it is, or where to begin | M09–M13, M37 |
| **EVALUATION** | has options and cannot tell which is best or good enough | M16, M20, M29, M38 |
| **IMPLEMENTATION** | knows what to do and doing it costs unnecessary effort | M14–M19, M41–M44 |
| **PSYCHOLOGICAL** | distrust, exposure, discomfort, fear of the outside | M04, M08, M26, M42 |
| **TECHNICAL** | latency, error, state loss, keyboard or accessibility failure | M23, and anywhere focus is lost |

**PSYCHOLOGICAL requires wording, behaviour or labelled self-report.** A
duration is not evidence of a feeling. This is the rule most likely to be broken
under time pressure and it is the one that makes the rest of the register worth
reading.

## Necessary status

Every candidate also carries `SLUDGE` / `NECESSARY` / `UNKNOWN`, and the default
for anything uncertain is **UNKNOWN**.

The question is never *does this take time*. It is: **what failure becomes
possible if this friction disappears?**

Friction already known to be load-bearing in this product, listed so nobody
proposes removing it without an argument:

| Friction | What it protects | Removing it would |
|---|---|---|
| The qualifying question gating the screen | the honest exit — `NOT_ME` is a first-class option, and `profile.declined` persists it | delete the one place the product says *this is not for you*, which is what licenses it to say what evidence is worth |
| `BAND_USABLE` blocking the draft action | evidence quality | let a weak trace become a confident outbound asset (`docs/AUTHORITY.md`) |
| The Liebig gate capping `built` | truth | reward volume over standing |
| The grounding validator blocking `markPublished` | authorship and truth | publish a number no cited proof contains |
| The two nested LLM consents | privacy | let a small consent authorise a whole document leaving the device |
| Naming a recipient before an errand is drafted | the errand existing at all | turn a retrieval into a diary entry (`engine/recall.js`) |
| `confirm()` before refine / extract / reset | consent and irreversibility | move data or destroy it without a decision |

These are `NECESSARY` until an observation says otherwise. **JF1 may find their
burden too high and propose reducing the cost while keeping the function. It may
not propose deleting them on the grounds that they were slow.**

---

# The automation question

For every human action: what may the system take over? Produced **before** any
UX recommendation, because it is the question that decides whether a UX change
is even the right class of answer.

| Micro-behaviour | Classification | Why |
|---|---|---|
| M03–M04 read and recognise | **HUMAN MUST DO** | recognition is the qualification |
| M05 locate themselves among three options | **HUMAN MUST DO** | it is a self-description and a consent to proceed; a default answered it once and the product removed the default deliberately |
| M08 decide the tool is safe | **HUMAN MUST DO** | trust is not delegable |
| M09–M10 learn what qualifies | **SYSTEM CAN SUGGEST** | already suggested by `firstStepBody`; whether it is *read* is the open question |
| M11 choose a route | **SYSTEM CAN SUGGEST** | the state needed to recommend one — *do you hold a document* — is knowable from one answer the person can give in a second. Confirmation must remain |
| M12–M13 decide which document and where | **HUMAN MUST DO** | it is their memory of their own life |
| M14–M18 leave, find, open, select, copy, return | **HUMAN MUST DO** *in the current architecture* | the alternative is reading the person's mail, which is the product this one refuses to be |
| M19 paste | **HUMAN MUST DO** | it is the consent |
| M20 decide it is enough | **SYSTEM CAN SUGGEST** | the product already knows the inventory is thin and says so; it may say so earlier |
| M21–M22 submit and understand it worked | **SYSTEM CAN DO DETERMINISTICALLY** | already does — First Light is the receipt |
| M23 processing | **SYSTEM CAN DO DETERMINISTICALLY** | already does, in milliseconds |
| M24 learn which branch they are in | **SYSTEM CAN DO DETERMINISTICALLY** | already does |
| M25–M26 recognise their own line | **HUMAN MUST DO** | this is the entire product |
| M28 correct the extraction | **HUMAN MUST DO** | a correction is ownership; a system that corrected itself would delete the strongest signal the trial collects |
| M29 choose the next action | **SYSTEM CAN SUGGEST** | already does — one move, and the second option is *see everything* |
| M31–M32 name the case and the people | **HUMAN MUST DO** | there is nobody in the errand otherwise |
| M33 approve the drafted errand | **SYSTEM CAN SUGGEST** | drafting is legitimate; sending is not |
| M34 send the errand | **SYSTEM MUST NOT DO** | messaging a named person in the user's name, about their own work, without them |
| M35 paste what came back | **HUMAN MUST DO** | it is a new document and it enters the way every other document does; closing the errand deliberately adds nothing to the evidence base |
| M36 obey or refuse the move | **HUMAN MUST DO** | the product offers one move and never enforces it |
| M38–M39 shape the draft | **SYSTEM CAN SUGGEST** | templates and the optional rewriter, both grounded-gated |
| M40 read the grounding verdict | **SYSTEM CAN DO DETERMINISTICALLY** | already does, live, while typing |
| M41 copy | **SYSTEM CAN DO DETERMINISTICALLY** | already does, with and without provenance |
| M42 publish | **SYSTEM MUST NOT DO** | authorship, consent, and a public claim in someone's name |
| M43 declare it published | **HUMAN MUST DO** | the product cannot see outside itself, and a system that inferred publication would be manufacturing an observation |
| M44 fetch and enter reception | **SYSTEM CAN SUGGEST** | already reduced from six typed numbers to one paste (`engine/analytics.js`) |
| M45 record that nothing came in | **HUMAN MUST DO** | a null result is a result and only they hold it |

**Nothing in this table licenses a change.** It says what automation would be
*legitimate*, not what is *needed*. Need is decided by the register.

---

# Friction register

One record per candidate, per participant. Fields:

```
friction_id                 F-<n>
participant_code            P1…P5
journey_stage               from the journey map
micro_behaviour             M## (one; if it spans several, record the first)
observation                 behaviour and wording only, from layer 1
evidence_type               OBS | STATE | DEBRIEF(SELF_REPORT) | PW | DOM
friction_type               SEARCH | EVALUATION | IMPLEMENTATION | PSYCHOLOGICAL | TECHNICAL
alternative_explanation     required, never empty; "none identified" is a finding in itself
necessary_status            SLUDGE | NECESSARY | UNKNOWN   (default UNKNOWN)
candidate_intervention_class REMOVE | DETERMINISTIC | TECHNICAL | FLOW | UI | AI | OUTSIDE_PRODUCT
risk_of_removal             what failure becomes possible
confidence                  LOW | MEDIUM | HIGH
frequency                   LOW | MEDIUM | HIGH   (with the count: "3 of 5")
severity                    LOW | MEDIUM | HIGH   (delay | error | assistance | abandonment | downstream)
addressability              LOW | MEDIUM | HIGH
change_cost                 LOW | MEDIUM | HIGH
falsifier                   the next observation that would say this diagnosis is wrong
```

**No decimals, no composite scores, no percentages.** Five people do not produce
a rate. `3 of 5` is the only permitted form, and the denominator is always
stated.

## The one candidate that exists before any participant

Recorded now, from the code, so it can be tested rather than discovered
conveniently:

```
friction_id                  F-1
participant_code             (none yet — derived from implementation)
journey_stage                Material acquisition
micro_behaviour              M12–M13
observation                  Screen 0 answers "what qualifies" in firstStepBody and then
                             asks for something that, for this audience, is usually in
                             another application. The persisted state is byte-identical
                             before and after this interval: nothing in the product can
                             see it.
evidence_type                STATE (measured) + implementation reading
friction_type                UNDECIDED — SEARCH and IMPLEMENTATION are both live
alternative_explanation      EVALUATION: they hold three candidate documents and cannot
                             tell which is strongest. PSYCHOLOGICAL: the document exists,
                             is findable, and pasting a client's mail is the problem.
necessary_status             UNKNOWN
candidate_intervention_class differs per mechanism, which is why the mechanism must be
                             decided first:
                               SEARCH        → UI/FLOW (make firstStepBody unmissable)
                               IMPLEMENTATION→ DETERMINISTIC or OUTSIDE_PRODUCT
                                               (recommend a route; or say what to bring
                                               in the recruiting message, before arrival)
                               EVALUATION    → the product already accepts everything;
                                               the fix is to say so louder
                               PSYCHOLOGICAL → the pledge, which is currently folded
                                               below the ask
risk_of_removal              Telling people what to bring deletes "material they chose
                             themselves", which docs/TELOS.md names as the clause doing
                             the real work. That is a protective function of the current
                             silence and it is why this is UNKNOWN, not SLUDGE.
confidence                   LOW
falsifier                    Participants who read firstStepBody aloud, name the exact
                             document immediately, and still take minutes to produce it
                             falsify SEARCH. Participants who ask "what should I paste?"
                             with the answer on screen falsify IMPLEMENTATION.
```

---

# Reporting five people

For every recurring friction, in this order and no other:

1. **Observation** — what actually happened, in behaviour and wording.
2. **Frequency** — *"3 of 5"*. Never *"60%"*.
3. **Severity** — delay · error · assistance requested · abandonment · downstream effect.
4. **Mechanism hypothesis** — one of the five types.
5. **Alternative explanation** — always.
6. **Necessary status** — sludge · necessary · unknown.
7. **Cheapest intervention** — the smallest reversible one.
8. **Falsifier** — the observation that would say this was wrong.

**Five is enough to kill and not enough to bless.** Four of five hitting the
same wall is a wall. Three of five getting through is the absence of a wall,
which is a much smaller claim. That sentence is `docs/TELOS.md`'s and it governs
JF1 unchanged.

## Prioritisation

At most **three** candidates carry forward. Ranked qualitatively:

```
frequency × severity × addressability × evidence confidence ÷ change cost
```

evaluated by judgement, written as words, never as a number. A friction that
occurs **once** and completely prevents the task outranks one that occurs five
times and costs three seconds. The question is not *how often is this
annoying*; it is *what changes behaviour*.

## The solution ladder

Only after a mechanism has evidence, and strictly in order. The first rung that
solves it wins.

1. **REMOVE THE WORK** — can the task stop existing?
2. **DETERMINISTIC CODE** — can the system infer, validate, prefill, skip, persist, branch or default, safely? *If deterministic logic suffices, AI is not used.*
3. **TECHNICAL OPTIMIZATION** — they know what to do and the system is in the way.
4. **FLOW / UX** — the sequence or the decision structure creates the work.
5. **UI** — salience, affordance, focus, labelling, accessibility, hierarchy.
6. **AI / SEMANTIC REASONING** — only where the problem genuinely requires interpreting unstructured material. In this product that boundary is already drawn and defended in `docs/ARCHITECTURE.md`: **boundaries are a judgement, worth is a measurement.**
7. **OUTSIDE PRODUCT** — message, acquisition context, expectation setting, timing. **Do not change First Light to repair a recruiting message.**

## Decision cases after five

| Case | Reading | What happens |
|---|---|---|
| **A · dominant friction** | one or two micro-behaviours repeatedly cost dearly | fix those; do not widen the product |
| **B · distributed friction** | everyone struggles somewhere different | the problem is ICP, task definition or promise — not ten fixes |
| **C · flow easy, external action low** | the product works and nobody acts | stop polishing; the question is value, urgency, trust, relevance |
| **D · technical dominates** | reliability or performance | fix that before any redesign |
| **E · they act anyway** | friction exists and behaviour is unchanged | leave it. Inconvenience is not a defect |
| **F · protective friction is the cost** | the guardrails are the burden | reduce the burden, keep the function |

---

# Change license

JF1 authorises no product change by itself. A change is licensed only when this
chain can be written in full, in this order:

1. **This observed micro-behaviour** (M##, with the layer-1 record)
2. **creates this cost** (delay · error · assistance · abandonment · downstream)
3. **The evidence supports this mechanism** (and here is the alternative it beats, and why)
4. **This intervention addresses that mechanism** (at the lowest rung of the ladder that can)
5. **Removing or changing it does not obviously destroy a protective function** (named, and checked against the necessary-friction table)
6. **This is the smallest reversible test** (and here is what would tell us it failed)

If the chain cannot be written, the change is not made. A gap at step 3 is the
commonest failure and it always looks like step 4 being obvious.

## Stop conditions

Measurement stops when JF1 can reconstruct enough of the journey to answer its
question. It does **not** continue because another event might be interesting,
because a platform supports more fields, because replay looks powerful, or
because an experiment framework exists. Additional instrumentation is finished
when its expected decision value is low, and for JF1 that point is **now**.

## Phase-1 definition of done

Participant #1 can be run, and afterwards — without any of their source content
being stored, transmitted or requested — the following is reconstructible:

- what they encountered (`SELF_REPORT`) → what they attempted → which route they took
- where measurable time accumulated (STATE timestamps + the observation sheet)
- where they retried or backtracked
- whether they asked for help, and whether it was refused as the contract requires
- whether First Light appeared, and **which of its three branches**
- whether they understood the next action
- whether an external action was **PREPARED · INITIATED · COMPLETED · RESPONDED**, with each state evidenced separately and no state inferred from an earlier one

while the observer separately records, in layer 2, the reasons no telemetry
could have known.

---

# What this work changed in the repository

| File | Change |
|---|---|
| `docs/JOURNEY_FRICTION.md` | this document |
| `docs/EXPERIMENTS.md` | JF1 registered as an observation layer, **dated, after E1**, with E1 untouched |
| `docs/README.md` | the map, so this file is discoverable |
| `tests/engine/no-measurement-transport.test.js` | the guard described below |

**Product code: unchanged.** No view, no engine module, no state field and no
copy was altered. At zero participants the change license above cannot be
written for anything, and writing it anyway is the failure mode this document
exists to prevent.

## Tests

One guard, and it protects the decision this audit reached rather than counting
upward.

`tests/engine/no-measurement-transport.test.js` asserts that `src/` contains
exactly one outbound-request call site — `adapters/llm.js`, consent-gated and
off by default — and no beacon, image-pixel, `XMLHttpRequest`, `WebSocket`,
`EventSource` or third-party analytics import. Three documents already assert
this invariant in prose (`docs/ARCHITECTURE.md`, `docs/MEASUREMENT_MODEL.md`,
and the pledge on screen 0) and nothing tested it, which is precisely the
"discipline held by hand" that `tests/engine/appendix.test.js` exists to end.

It was proved red before being trusted: adding `navigator.sendBeacon('/t', …)`
to a source file fails it and names the file.

## Non-goals

- Making ProofMiner frictionless.
- Any product instrumentation, analytics platform, replay, RUM or experiment framework for JF1.
- Any change to E1's prediction, thresholds, exclusions, coding rule, failure conditions or decision rule.
- A/B testing at n≈5, in a product with no assignment mechanism and no server.
- Inferring psychological state from durations or clicks.
- Inferring an external action from an in-product click.
- Treating `dashboard viewed`, `copy clicked` or `artifacts[].status = 'published'` as product success.
- Removing a step because it is slow.
- Redesigning any surface during the measurement phase.

# PRODUCT_THESIS

Thesis version 1.0 · derived at commit `e05a442`, 26 August 2026.

Three sections, in the order they were written. **Part 1 was written and saved
before the prompt's starting hypothesis was read as a proposed answer**, and is
not edited afterwards; Parts 2 and 3 may reference it, and it may not reference
them.

---

# Part 1 — Derivation, written without the house vocabulary

Written under a constraint: no use of *authority*, *visibility gap*, *evidence
bottleneck*, *six layers* or *proof-to-demand*. The constraint is the method,
not a stylistic exercise. Those five phrases appear in `README.md`,
`docs/TELOS.md` and `docs/METHOD.md`, which are one lineage, and a derivation
that reuses them cannot disagree with them.

**Independence caveat, stated first because it limits everything below.** This
derivation was produced by a reader who has spent a long session inside those
documents. It is *de-anchored*, not independent. Where it agrees with the house
framing that agreement is worth nothing; where it diverges, the divergence is
the only part carrying information, and it is marked.

## The job, in the words of the person doing it

Someone self-employed needs to be **chosen for one specific piece of work by a
person who has not worked with them before**. To be chosen they have to put
words in front of that person at some point — a proposal, a profile, a reply to
an introduction, a message. Those words have to make the reader believe the
work will go well.

Their own formulation, from the material this project has read:

> *"I don't know how to explain what I actually do — and anyway it's pretty
> basic, everyone works like this."*

Two halves, and they are different problems. The first is about retrieval. The
second is about calibration: they have compared themselves to their peers, who
do the same work, rather than to the buyer, who does not.

## The trigger

**Not a mood. A date.** The material shows people arriving when something
external has a deadline attached: a proposal is due, a call is booked, an
introduction has landed with *"send me something"*, a contract ended and next
month is empty.

This matters more than it looks. A problem that is chronic has no budget and no
moment; a problem with a date has both. This is the single most consequential
thing in Part 1 and it is currently **unverified** — it is inferred from how
people describe arriving, not from a question anybody has asked them. The
cheapest test is one sentence at intake, which `docs/EXPERIMENTS.md` now carries.

## The failure, described mechanically

Under time pressure they write from memory. Memory returns **roles and
adjectives** — "experienced", "leads change", "works closely with management" —
because that is what is retained about one's own work. The specifics that would
tell them apart from the next three candidates are stored in artefacts nobody
re-reads: old mail, project folders, invoices, threads. Retrieving those is slow
and unpleasant, and nothing in normal work forces it.

So the text they produce is **interchangeable**. The reader cannot separate them
from the alternatives, and falls back on the two things that do separate:
whoever was recommended, and whoever answered first.

## What they do instead, today

| Substitute | What it costs them |
|---|---|
| Rewrite the CV or profile again | Produces the same interchangeable text, slower |
| Ask a general-purpose model to "make this sound better" | Produces it faster, and now it also reads as machine-written |
| Hire a ghostwriter | Money, and the specifics still have to come from them |
| Ask a friend to look at it | One opinion, socially expensive to ask twice |
| Do nothing; wait for introductions | Works, and is why the problem stays chronic rather than urgent |

The last row is the real competitor. **Most of this population is not failing.
They are getting work through people who already know them**, which is slow,
uneven, and good enough that the problem never becomes a purchase.

## The buyer is a different person with a different job

The person who *pays* is trying to **reduce the risk of choosing wrong on a
specific problem, quickly, on thin information**. Their dominant strategy is to
prefer somebody vouched for, and to stop looking once they have one. Two
measured facts about them sit in `docs/MARKET.md`: they make contact roughly 70%
of the way through their own process, and 84% of deals go to the first vendor
contacted.

**These two actors are not the same person, and the product only ever meets the
first one.**

## Desired outcome, in the seller's words

> *"So that when somebody asks what I do, I have something specific to say, and
> it's true."*

Note what is absent from that sentence: any volume, any channel, any audience.

## Where this derivation diverges from the house framing

Recorded because only the divergence carries information.

| | House framing | This derivation |
|---|---|---|
| Shape of the pain | Chronic — a standing distance between what was done and what is seen | Episodic — a retrieval failure that binds on a **date** |
| Location of the miss | The specifics exist and are not shown | The specifics exist and cannot be **reached in time** |
| What the product is | A standing instrument you return to | A thing you use once, under pressure, and may never open again |
| Second half of the complaint | Not modelled | *"everyone works like this"* is a **comparison-class error**, not a retrieval failure, and needs a different move |

The house framing and this one predict the same first screen and diverge sharply
on everything after it. A chronic reading justifies a returning user, a compound
index and a dashboard. An episodic reading justifies none of those, and says the
product should be excellent once and forgettable.

**The repository already contains evidence for the episodic reading and has not
acted on it:** `docs/TELOS.md` excludes calibration and compounding from its
definition of done because *there is not one observation of a repeat visit
anywhere*, and it deliberately refuses a returning-visit criterion.

---

# Part 2 — Four competing theses

Each is falsifiable, and each implies different code. They are not averaged.

## T1 — The standing instrument *(preserves the current broad ICP)*

**User** independents and jobseekers who feel under-recognised. **Buyer** the
same person; free. **Trigger** chronic discomfort. **Transformation** what they
already hold becomes measured, ranked and visible, one move at a time.
**Substitute** posting more, or nothing. **Observable outcome** a grounded
artifact published within 14 days, unprompted.

- **Strongest support** it is the only thesis the product currently implements
  end to end, and the parts are built and tested: 465 tests, the Liebig gate,
  the extraction gate, the recall route.
- **Strongest contradiction** it requires repeat use, and *this repository
  contains zero observations of a repeat visit* (`docs/TELOS.md`). Calibration
  and compounding are excluded from its own definition of done for that reason,
  which means two of the six integrations are unfalsified features.
- **Implies** keep everything; add nothing until the trial.
- **Cheapest test** the five-person trial already specified in `docs/TELOS.md`.
- **Failure mode** a beautiful instrument for a visit that happens once. Nobody
  is harmed; the effort is wasted.

## T2 — The intake instrument for a paid engagement *(commercial beachhead)*

**User** a person about to buy, or considering buying, a differentiation sprint.
**Buyer** the practitioner who runs the sprint — the only actor in this whole
document with a budget. **Trigger** a discovery call is booked. **Transformation**
the client arrives with their own specifics already retrieved and ranked, so the
call starts past the part that usually consumes it. **Substitute** the
practitioner does that retrieval by hand, in the call, for free.

- **Strongest support** `docs/MARKET.md`, from three independent directions:
  willingness to pay for evidence tracks the liability of getting it wrong, and
  an individual bears none — but **the person who vouched for them does**. In
  this practice that person is the practitioner. It is the only framing found in
  which the product's structure and the money point at the same actor. It also
  costs nothing to adopt and changes no code.
- **Strongest contradiction** it makes the product an input to a service, which
  caps its value at the service's value and quietly ends the case for building
  more of it. It also contaminates the trial: `docs/TELOS.md` requires that the
  trial not be a sales motion.
- **Implies** no new features. A different sentence on the first screen, a
  different recruiting channel, and the sprint's intake form pointing at it.
- **Cheapest test** run it as intake for the next three discovery calls and
  time the call. Prediction: the first fifteen minutes stop being spent on
  "what do you actually do".
- **Failure mode, ethical** the tool's credibility comes from having nothing to
  sell. Using it as a funnel while it still says that is the one move that
  destroys the asset. If T2 is taken, screen 0 has to say so.

## T3 — Retrieval under deadline *(does not assume the pain is being unseen)*

**User** the same person. **Trigger** a dated ask — a proposal, a booked call, an
introduction. **Transformation** in one sitting, the specifics that answer *this*
ask are recovered from material they already have, and the ones that do not exist
yet are turned into two named errands. **Substitute** writing from memory, which
returns adjectives. **Observable outcome** a specific, true sentence they did not
have an hour earlier, and — the harder half — a message actually sent to a named
person.

- **Strongest support** measured, from a population nobody here wrote: across
  520 real self-written pitches, **78% carried a magnitude and 3% carried
  anything anybody else had said**. They can name numbers about their own work.
  What is scarce is somebody else's word for it, which is an **acquisition**
  problem, not a display problem. The recall route is the only part of this
  product that produces acquisition, and it was built late, as a way out of a
  dead end.
- **Strongest contradiction** the 520 are English-writing software freelancers —
  adjacent to this population, not it. And a person under deadline may simply
  not stop to use a tool.
- **Implies** the recall route stops being a fallback and becomes the spine.
  First Light's job changes from *rank what you brought* to *name what is
  missing and who can supply it*. The standing index becomes optional.
- **Cheapest test** already in `docs/TELOS.md` as the third bucket in the
  falsifier: code each trial participant as definition-blocked,
  visibility-blocked, **attestation-blocked**, or neither. If attestation wins,
  T3 wins.
- **Failure mode** sending people to ask former clients for testimonials is a
  socially expensive errand. Get the framing wrong and the product costs the
  user a relationship.

## T4 — The seller's words barely matter *(the disconfirming thesis)*

**User** irrelevant. **Buyer** decides from a shortlist assembled before any of
this text is read. **Mechanism** buyers make contact ~70% through their own
process and 84% of deals go to the first vendor contacted; what gets somebody
onto the list is a colleague's recommendation (56.5%) and having made a
complicated subject understandable (38.1%) — neither of which is a profile.

- **Strongest support** those are measured figures across ~1,000 buyers, and
  they say selection happens **before** the artifact is read.
- **Strongest contradiction** the same data has "made a complicated subject
  understandable" at 38.1%, which is produced by publishing something — and
  publishing something specific is exactly what T1 and T3 are for. T4 explains
  the *ordering* of the funnel, not the absence of a mechanism.
- **Implies** the product's leverage is near zero and the effort belongs in
  distribution. If T4 is right, the correct action is to stop building.
- **Cheapest test** the intake question already in `docs/MARKET.md`: *what made
  you reach out?* Twelve months with no answer that mentions the tool falsifies
  the whole demand-creation story.
- **Failure mode** taking T4 too early kills a working asset that is slow rather
  than dead. This is precisely the condition `docs/MARKET.md` warns about, and
  it is why the falsifier there has a twelve-month horizon.

---

# Part 3 — Comparison, without averaging

| | T1 standing | T2 intake | T3 retrieval | T4 no leverage |
|---|---|---|---|---|
| Someone with a budget exists | no | **yes** | no | n/a |
| Requires a repeat visit | **yes** | no | no | n/a |
| Implemented today | **yes** | yes, as-is | partly | n/a |
| Contradicted by repo's own data | **yes** — zero repeat visits | no | no | no |
| Contradicted by outside data | partly | no | partly — adjacent population | partly |
| Decided by the five-person trial | yes | no | **yes** | no |

**No thesis is selected, and that is the finding.** The prompt's rule is to
select only if the evidence changes a concrete decision. It does not yet: T1 and
T3 are separated by exactly one observation that the trial already collects, and
running the trial costs eight hours against a rebuild costing weeks.

**Two decisions are unblocked now, and both are taken below.**

1. **T1's repeat-visit dependency is a defect in the definition of done, not a
   preference.** Two of six integrations (I1 compounding, I2 calibration) are
   built, shipped and unfalsifiable by the trial that is supposed to decide
   whether the product works. That is recorded in `docs/MEASUREMENT_MODEL.md`
   as a construct with no eligible design, not as a feature.
2. **T2 costs nothing and is not exclusive with T1 or T3.** It changes a
   sentence and a recruiting channel. It is the only path with a payer, and it
   is the owner's decision, put in `docs/EXPERIMENTS.md` as a three-call test.

**The highest-information next action is unchanged by all of this and is not a
code change:** run the five-person trial. It separates T1 from T3, it is the
only instrument that can, and it has been fully specified since before this
analysis started.

**What this section refuses to do** is average T1 and T3 into a product that
ranks what you brought *and* sends you on errands with equal weight. They imply
different first screens. Building both is how a product ends up with two
half-mechanisms and no way to tell which one failed.

# TELOS — why this product exists

## The situation it is built for

2026 is a layoff market. Two populations are trying to solve the same problem
with the same broken tools:

1. **People trying to become independent** — consultants, coaches, freelancers,
   fractional operators. They have real expertise and no visible standing.
2. **People trying to get hired** — who have understood that a CV in a stack of
   900 loses, and that being *known for something* is now the shortest path to
   an interview.

Both are being sold the same thing: content tools. Post more. Post better.
Use a hook library. The market's implicit theory is that **authority is a
volume problem**.

It is not. Authority is an **evidence problem with a distribution bottleneck**.

## The claim this product owns

> Authority is not produced by publishing more. It is produced by converting
> evidence you already own into visible, verifiable, compounding standing —
> and the bottleneck is almost never ideas.

## Telos

**Take a person from "competent but invisible" to "positioned as an authority",
holding their hand the entire way, by measuring every layer of the process
that can be measured — and by connecting layers that no existing tool
connects.**

Three words matter in that sentence:

- **Hand-holding** — at every moment the product must answer one question:
  *what is the single next move?* Not a dashboard of options. One move.
- **Measuring** — every claim the product makes about progress must be
  traceable to an observable input. No vibes, no vanity metric presented as
  standing.
- **Connecting** — the differentiation is not in any single measurement.
  Competitors measure engagement. Some measure content quality. Nobody closes
  the loop between *the evidence you hold*, *the claim you make*, *what you
  publish*, *how it lands*, *who moves*, and *who vouches for you* — and feeds
  the far end back into the near end.

## Primary actor

**The ICP is defined by awareness before it is defined by anything else: this
product is for someone who already knows it hurts.**

That is the qualifying condition, and everything below is secondary to it. Not
someone who *would* benefit. Not someone who *should* care. Someone who has
already felt the specific loss — the application that went unanswered, the
work that only ever arrives through people who already know them, the less
experienced person who got the thing they wanted — and has named it to
themselves.

The rest of the description, given that condition holds. A professional,
28–55, mid-career, Hebrew or English speaking, who:

- has 5+ years of real work behind them that produced real outcomes,
- has never systematically catalogued that work as evidence,
- is either newly out of a job or actively building an independent practice,
- has a LinkedIn profile and 300–3,000 connections,
- is not a content creator and does not want to become one.

Explicitly **not** the actor: full-time creators optimising reach, agencies
running client accounts, B2B marketing teams producing customer proof at scale.
Those are served — well — by Taplio, AuthoredUp, Supergrow, and UserEvidence.

Also explicitly not the actor, and this is the sharper exclusion: **the
problem-unaware.** The comfortable senior employee, the consultant whose
pipeline is currently full, the person who is merely curious. They may have the
identical objective situation as a qualified user. They are still out of scope.

### An open question about which gap this actually is

The product measures a **visibility gap**: evidence held, standing not granted.
Asked to describe their own blocker in their own words, people in this audience
mostly describe something else — an inability to *say* what they do. "I cannot
explain exactly what I do." "It is hard for me to define." Very few describe
holding evidence that nobody sees.

Most of them then add the sentence this product exists to overturn: *what I do
is basic, everybody works this way.* So the thesis is not contradicted — that
belief is exactly what a catalogued evidence base disproves. What is in question
is the **order**: the felt complaint is definition, and the discovery of
uncounted evidence is the mechanism that answers it, not the symptom the person
arrives with. Screen 0 is written accordingly; the deeper question is not
settled.

**The selection caveat matters as much as the observation.** Anyone reached
through a conversation had already decided to seek help with this, which is the
opposite selection from someone who lands alone on a free tab — and deciding to
seek help is itself an act that frames the problem as definition-shaped. No
amount of talking to people who already asked can close it. The five-person
trial can, and until it does, nothing here settles whether the ICP narrows to
people whose gap really is visibility, or the product learns to measure a
definition gap as well.

### What follows from an awareness-defined ICP

This is not a positioning nicety. It is a set of build constraints:

1. **The product never sells the problem.** No screen argues that the user has
   a problem. Persuading someone they are in pain is a different product with
   different mechanics (fear-based marketing) and it is one we will not build.
2. **The first screen qualifies, it does not educate.** Its job is recognition:
   a sentence the right person answers instantly with *yes, that's me*. If the
   sentences do not land, that is information, not a funnel leak.
3. **A real exit exists, and it is not a dark pattern.** "None of these
   describes me" is a first-class option on the first screen. Choosing it
   produces an honest page that says who the tool is for and when to come back
   — no waitlist capture, no reframing, no second attempt at persuasion.
   A product that refuses to say "this is not for you" cannot be believed when
   it says "this is what your evidence is worth."
4. **Copy is written for someone mid-pain, not mid-consideration.** No feature
   tours, no benefit stacking, no proof of category. Someone who already knows
   it hurts wants the thing to start working; anything before that reads as a
   delay.
5. **Urgency is measured in how long it has been hurting**, not in how long the
   user has been working on it. The onboarding question is "how long has this
   been bothering you", and it sets the register of every later prompt.
6. **Retention follows relief, not habit.** No streaks, no re-engagement
   nudges. When the pain resolves, the honest outcome is that the user leaves.

## Desired state change

| From | To |
|---|---|
| "I don't know what to post" | "I know exactly which of my 43 proof units to publish next, and why that one" |
| "I have nothing impressive to show" | "I have a catalogued inventory of evidence with a measured value on each item" |
| "I post and nothing happens" | "I know which proof archetypes move my ICP, because it was measured on my own data" |
| "I'm building a personal brand" | "I'm closing a measurable gap between the standing I have and the standing my evidence supports" |
| Loud but hollow | Grounded and compounding |

## The anti-goal that defines the product

**This product must never help anyone manufacture authority they have not
earned.**

That is not a values statement bolted on afterwards. It is a load-bearing
design constraint, and it produces the product's core mechanic: the
**Liebig gate** in the Authority Index (see `METHOD.md`). Expression and
outcome layers are *capped by* the foundation layers. A user who publishes
aggressively on a thin evidence base does not get a rising score — they get a
`HOLLOW` diagnosis and an evidence-acquisition plan.

Every competitor in this category rewards volume. This one refuses to.

### The second refusal: it does not measure your absence

Nothing in the state records when the user was last here. There is no
`lastActiveAt`, no streak, no "welcome back", and no screen that behaves
differently because a month went by.

This is the same constraint pointing at retention instead of at standing.
The desired state change above is that a person stops feeling invisible — and
for some of them the honest form of that is *closing the tab and going back to
work*. A product that measures the gap between visits will eventually act on
it, and acting on it means treating a legitimate outcome as a lapse.

So the return bridge on the dashboard (`bridgeCard` in
`ui/views/dashboard.js`) shows the user their own unpublished sentences on
**every** visit rather than on a returning one. It is worth showing to someone
who was here yesterday, which is exactly why it does not need a clock.

## How this is worth money

Everything above is written as integrity. Read commercially it says something
sharper, and that is worth writing down before somebody tries to fix this
product into a business.

This section was first written from reasoning alone. It has since been checked
against the market, and roughly half of it was wrong. What follows is the
corrected version, with the evidence attached — because a document that
forbids vanity metrics cannot make unsourced claims about its own worth.

**`MARKET.md` holds the work underneath it**: what was searched, what could not
be found, the two findings that appear only when separate lines of evidence are
laid on top of each other, and the plan for turning any of it into a change to
this repository — including which changes are not allowed to start yet, and what
would falsify the whole reading.

### As software, it is close to unsellable, and building more will not change it

Not because it is badly built. Because it is built, deliberately, against every
mechanism that produces value in software.

| What software value wants | What this document refuses |
|---|---|
| Accounts and retention | No server, no account, no telemetry |
| Switching cost | Everything local; the user holds the data |
| Measured return visits | *Relief is allowed to look like closing the tab* |
| Something hard to copy | A public repository, and a bundle a competent developer can read in an afternoon |

The numbers are unambiguous. A working product with no users prices at
**$500–$3,000** on the published pre-revenue ladder; a public permissive repo
pushes that toward zero, because what a buyer of pre-revenue software purchases
is the right not to rebuild, and that right is already free. Empire Flippers
requires $2,000/month net profit over twelve months. Acquire.com's pre-revenue
exception requires active customers. Neither would list it. Microns.io, the one
marketplace specialising in pre-revenue, has moved ~$500K across 100+ deals —
an average near $5,000.

**The first paying customer is worth more than every subsequent feature**, because
it moves the asset from unlistable to listable, and micro-scale software trades
at 24–40× *monthly* revenue.

### The refusals also close the one proven route

This is the correction that matters most, and the first draft of this section
missed it.

Open source monetises through one reliable mechanism, and Plausible states it
plainly: people are not paying for the code, they are paying **not to run it**.
A local-only tool with no server has nothing to sell in that slot. The refusals
are not merely uncommercial — they specifically foreclose the only open-source
business model with a track record.

What that looks like at the limit: core-js is downloaded ~43 million times a
week and runs on three quarters of the top hundred websites. Its maintainer
earned about **$57 a month**. Sixty per cent of open-source maintainers are paid
nothing at all. **Downloads and stars convert to zero at any scale.**

### The shape is the problem, not the principles

Refusal as a market position has a clear record, and it splits on one variable.

**It works when refusal is welded to something opened daily** — Obsidian, Kagi,
Are.na all sustain real revenue on local-first, no-ads, no-algorithm positions.

**It fails when refusal is the product.** Ello raised $5.5M on "you are not a
product" and is dead. Cara went from 40,000 to 650,000 users in a week on
anti-AI sentiment, ran up a $96,000 server bill, and funds itself on donations —
enormous ideological demand, no willingness to pay.

**This product is episodic.** Paste, see the gap, done. There is no recurring
reason to open it, which is by design — the second refusal requires it. So on
the one variable that separates the two lists, this sits with Cara and not with
Obsidian, and no pricing decision changes that.

### What the graveyard says

Individual authority scoring has been tried, at scale, with money.

**Klout** is the direct precedent: it scored a person's authority across layers
and showed them the number. It sold for $200M in 2014 and was **shut down in
2018** — the score was contested, gameable, and lost credibility. Kred and
PeerIndex went the same way. Polywork raised $44.5M including an a16z Series B
and closed in January 2025. Read.cv was acquired and wound down.

The one exit in the category that worked, **Portfolium at $43M, sold to
institutions rather than to individuals** — which is the pattern underneath all
of it:

> **Every commercial success in proof sells to whoever bears the risk of a false
> claim.** Veremark raised $26M on stopping AI fakes in hiring — the employer
> pays. Certn, $125M. UserEvidence, $21M — B2B marketing teams pay. This product
> sells the input to the party with the least money at stake.

That is not a reason to abandon the actor defined above. It is the reason this
cannot be a software business aimed at them, and it should be read alongside the
open question about which gap this is.

### The strongest evidence against the anti-goal

Recorded here rather than argued away, because a document with a falsifier for
its product should hold one for its ethics too.

NBER working paper 30886 ran a field experiment across roughly **500,000
jobseekers**. Algorithmic writing assistance produced **8% more hires and 10%
higher wages, with no measured drop in employer satisfaction.**

For the hiring half of the stated ICP, "we will not write it for you" asks a
person to accept a measurably worse outcome in exchange for a principle. That
does not make the anti-goal wrong — the product's claim is about durable
standing, not about one application — but it does mean **this is a values sale
for that half of the audience, and it has to be priced and spoken as one.** If
the trial recruits from the hiring track, expect this to be the wall.

### The strongest evidence for

The scarcity the product exists to exploit is real, measured, and worsening.

Pangram scanned 1,002,627 posts: **over 40% of LinkedIn posts longer than 250
words are fully AI-generated**, and LinkedIn produces about two thirds of all
AI-flagged content while being one third of what was scanned. Originality.ai put
it at 81.2% "likely AI" on posts over 100 words.

And the preference is showing up in money rather than in surveys: on CGTrader,
AI-generated 3D models were one in six uploads and earned **one dollar in every
ninety** — 2.6% of sales.

When the medium saturates, verifiable specificity is the only differentiator
left, and that is exactly what a verbatim span is. **No product anywhere was
found marketing verbatim extraction with an explicit refusal to write.** Read
that carefully: it is an empty space, not a proven one.

### What the method is actually worth

The first draft of this section called the method the asset. That was half
wrong.

**A methodology cannot be copyrighted.** Six layers, eight archetypes and a
capping rule are, as intellectual property, worth nothing — anyone may use them,
and a published framework can now be reproduced by a language model in under a
minute. What is ownable is the **name**, which is trademarkable, and the written
expression. The barrier is reputational, not legal, and this document should not
have implied otherwise.

What *is* true, and is the encouraging half: **a documented, named diagnostic
methodology is one of the things buyers pay a premium for when acquiring a
consulting practice.** But it raises the multiple on transferable revenue; it
does not substitute for it. A solo practice built on personal relationships is
roughly 100% personal goodwill, which is legally the owner's property and not an
asset of the business — in valuation terms it is a job.

And the ladder that method-businesses climb runs in one direction only. EOS
reached 738 implementers averaging $392,658 each — after **eighteen years and a
bestselling book**. StoryBrand charges $10,000 a seat on the back of a *New York
Times* bestseller. In every documented case the audience came first.
**Certification harvests demand; it cannot create it.** With no audience and no
published results, seats sold is zero.

### Where value is captured, and the rule that protects it

The app is free and stays free. What it produces — somebody holding their own
measured gap and one named next move — qualifies them for work that is already
being sold, better than a discovery call does, because the ambiguity is gone
before the conversation starts. The shape is well attested: a paid roadmap at
roughly one sixteenth the price of the engagement it qualifies for; a free
positioning diagnostic feeding a workshop priced in five and six figures.

One rule makes it survivable, and it now has evidence behind it rather than only
principle:

> **The app never mentions the paid thing.**

No "book a call", no upsell, no captured address, no footer. The moment First
Light carries an offer, the anti-hype pledge on screen 0 is false, and the
authenticity barrier the whole cold start exists to lower fires instead.

The obvious objection — that a tool capturing nothing generates nothing — was
tested and does not hold. Refusing capture does not kill the funnel; **it changes
which funnel this is in**, from lead capture (fast, measurable, low-trust) to
demand creation (slow, unmeasurable, high-trust). And the second is where
decisions of this kind are actually made: B2B buyers reach out roughly 70%
through their process — eight months into eleven — and **84% of deals go to the
first vendor contacted.** Across 1,028 buyers of professional services, what
convinces someone you are an expert is a recommendation from a colleague (56.5%)
and **"they made a complicated subject seem understandable" (38.1%)** — ahead of
publications and certifications. Neither is an email address.

There is also a hard reason capture would backfire here specifically. At a price
of zero, people perceive *higher benefit*, not merely lower cost; any friction
moves you off that point. And an email field visually contradicts the pledge to
transmit nothing, whatever the technical truth. **Capture would cost usage and
credibility at the same time.**

**What the rule really costs is measurement, and that is fixed elsewhere.** With
no capture there is no way to tell "working slowly and invisibly" apart from "not
working" — the condition in which people kill a working asset or keep feeding a
dead one. The instrument is one free-text question at intake — *what made you
reach out?* — not a form in the tool. Self-reported attribution routinely finds
what software attribution cannot: one published study found a 90% gap, with a
channel buyers credited for 53% of revenue recorded by the software as zero.

Two things follow for how this is judged. **The horizon is six to twelve months,
not weeks.** And **the tool is not a channel** — it feeds recommendation and
recall, and outreach still has to happen somewhere else. Roughly 70% of
consultants get no leads at all from their website.

**None of it begins until the trial is over.** The Definition of Done below
requires that the trial not be a sales motion; running the two together spends
the sample and the relationships and yields data worth nothing.

### The public repository is the claim, applied to its author

The repository is public, and that was treated as an exposure. It is the
opposite. This product tells a person that authority comes from evidence they
already hold and do not show, and that the move is to put a grounded piece of it
where people can see it. **A public repository containing this file and
`METHOD.md` is that move, made by whoever built it.**

The pattern holds wherever it has been tried at length. Nielsen Norman Group
published 1,139 free articles into 230 million page views and trained 44,283
people. DORA gave away the report, the assessment and the book, and was acquired
by Google Cloud inside three years without investors. And it lines up with the
38.1% finding above: publishing the method *is* the demonstration.

No case was found of a consultant whose paid demand measurably fell because they
published their method. What was worth removing from this repository was the
client material that was never ours to publish, and that is already out.

### The data asset that is allowed

A bank of real client wordings is forbidden outright. That is a phrase library —
the thing this product refuses to be — sitting one import away from `drafts.js`.

What is allowed, and compounds further than any wording would, is **aggregate
structure recorded by hand**: which layer was the binding constraint, which
archetype was missing, which play was chosen. No wordings, no telemetry, nothing
gathered by the software. After thirty people that is a sentence about this
market nobody else can say — and it is evidence held rather than a claim
asserted, which is the only kind this product respects.

### The fork that is not taken

The engine's core rule — expression may not exceed the evidence beneath it — is
not a metaphor at organisational scale. It is a funded, regulated, productised
category: pharmaceutical and consumer-goods claim substantiation, where private
challenge fees alone run from $8,000 to $63,200 per case, and where **Veeva
shipped this exact product in 2019** and now books over $3B a year.

Three things follow, and all three say *not now*.

- **The incumbent cannot be met head-on**, and the buyer — general counsel,
  regulatory affairs — purchases liability transfer. A solo founder fails the
  vendor-risk questionnaire before the demo.
- **The adjacent markets are thinner than they look.** The EU Green Claims
  Directive was effectively withdrawn in June 2025 and CSRD's scope was cut to
  firms above 1,000 employees and €450M in February 2026, which removes the
  entire European mid-market. Employer-brand substantiation has no regulator, no
  penalty and no budget owner — it is not a market. Content provenance is
  becoming free infrastructure, not a product.
- **The algorithm is roughly a fifth of what such a buyer purchases.** The rest
  is workflow, integrations, audit trail and a trust apparatus that does not
  exist here.

If it is ever taken, the entry is the cheap pre-review layer that sits *before*
somebody else's system of record — telling an agency which claim has no linkable
evidence and will bounce — because that is the only rung where being solo is not
disqualifying. One dated opportunity is on the calendar regardless: EU Directive
2024/825 applies from **27 September 2026** and bans unsubstantiated generic
environmental claims. It is a compliance sprint, not a subscription.

**This is recorded so it is not rediscovered enthusiastically in six months. It
is a different product with the same core algorithm, and the trial below comes
first.**

### What actually raises the value

Not a feature. **Five documented cases.**

A product where five people published something they had forgotten they had is
worth a large multiple of the same product with none, and the difference is not
in the code. Everything above converges on it: the certification ladder needs an
audience and published results, the consulting multiple needs transferable
revenue, and the first paying customer needs a reason to be the first.

This is the thesis pointed at itself: value is evidence, the evidence is missing,
and the instrument for producing it is specified directly below.

## Readiness — may it meet a person yet?

This section used to be called "Definition of Done", and it is not one. Five
review agents reading the same repository and agreeing is a statement about
internal consistency; there is no user anywhere in it, and the whole of it can
be satisfied by something nobody has ever opened. It is a **build gate**, and
under its real name it is a good one.

| Agent | Axis | Converges when |
|---|---|---|
| Telos Architect | Does it serve the stated purpose? | The mechanism actually moves a person to authority; nothing in the build is feature-decoration |
| Market / ICP Realist | Would the actor adopt? | Time-to-first-value is minutes, the wedge is defensible, the honest failure modes are named |
| Measurement Methodologist | Are the numbers real? | Every score traces to observable inputs; confidence is reported; no vanity metric is laundered into standing |
| Software Engineer | Is it built? | Tested, typed-at-the-edges, safe against injection, deterministic core, reproducible build |
| Ethics / Anti-Hype | Does it corrupt? | Cannot fabricate evidence; cannot inflate standing; data stays with the user; claims about the product are true |

*Adopt*, not *adopt and stay*. That axis used to ask about retention, which
the second refusal forbids measuring — and an agent cannot hold a blocking
objection on a question this product has decided not to ask.

Convergence means: no agent holds a blocking objection. Part of it is now
mechanical and runs in CI: every move id resolves to copy, the two bundles stay
aligned, the guidance never takes a shape known to fail readers, and the
honesty-rule-8 invariants hold byte for byte. Part of it is still a discipline
held by hand — notably the promise that every number shown to a user is
derivable from `METHOD.md`, which is maintained by writing each constant into
the appendix and has no test behind it.

**Readiness is met when the pipeline is green and that discipline has been
kept.** It is met today. That is permission to put this in front of somebody.
It is not done.

## Definition of Done — the app

> **Five people who are not you, recruited by the qualifying question alone,
> each reach First Light, recognise something of their own in it, and put one
> grounded piece of it into the world within a fortnight.**

Two rules make that a measurement rather than a hope, and both are consequences
of things already written above.

**It is measured in events this product cannot produce.** A definition of done
that reads "the Authority Index rises" is the instrument grading itself — the
Liebig gate's own failure mode, one level up. The product must not be able to
declare itself finished by moving its own number. What it cannot produce: a
message sent to a named person, a reply that came back, a conversion, a
recognition, a post that exists in public.

**It is measured by a person, because this product reports nothing.** There is
no server, no account and no telemetry, so time-to-First-Light, whether anyone
published, and whether anyone returned are all invisible to us by design. The
instrument is a notebook and two conversations. Nothing in the trial justifies
building an analytics surface to make the trial easier: that is precisely the
over-building this section exists to stop.

### The four criteria

For each of the five, all four:

| # | Criterion | How it is observed |
|---|---|---|
| 1 | Reaches First Light within **10 minutes** of opening the link, holding at least one proof unit above `BAND_USABLE`, from material they chose themselves | Watched, day 0 |
| 2 | Points at a line and says a version of ***"I forgot about that"*** | Heard, day 0 |
| 3 | One grounded artifact is **public within 14 days**, with no reminder from you | Verified in public, day 14 |
| 4 | Asked *why you* at the end, answers with **a piece of evidence rather than an explanation** | Heard, day 14 |

Criterion 2 is the one that cannot be traded away. It is the entire promise —
*you already had this* — and if nobody says it, the product is a re-sorter of
things people already knew about themselves, however well the arithmetic works.

**A returning-visit criterion is deliberately absent.** It is the obvious fifth
line and it contradicts the second refusal above: measure the gap between
visits and you will eventually act on it. Relief is allowed to look like
someone closing the tab.

### The fork inside criterion 1

Criterion 1 asks for three things at once: First Light inside ten minutes, at
least one proof unit above `BAND_USABLE`, and material the person chose. The
product's own copy says the first and the third collide.

> **`firstLight.emptyBody`** — *A CV or a profile has already been edited, and
> those lines usually fell out along the way.*

Told to bring their own material, most people reach for the CV or the profile.
That is the document this product states, in its own voice and on its own
screen, will not hold anything checkable. So the likeliest first paste is the
one already predicted to fail, and criterion 1 is in part a measurement of
which file somebody happened to have open.

**The honest recovery cannot beat the clock.** The way out of that screen is
the recall room, and what it produces is an errand addressed to a person who
has to answer it. That takes days. No arrangement of the interface fits it into
ten minutes, because the missing thing is not on the screen — it is in somebody
else's inbox. The route that is structurally right therefore fails criterion 1
as written.

**This is the falsifier's problem one level down, and it deserves the same
treatment.** Someone who arrives, is told plainly that the document they
brought holds nothing checkable, understands why, and leaves with a named
person to ask has been served exactly as designed. Scoring that as a failure of
criterion 1 files the product's best available behaviour as a miss. And the
comfortable repair — telling people what to bring — deletes *from material they
chose themselves*, which is the clause doing the real work: what someone
reaches for unprompted is itself one of the findings this trial exists to
collect.

**Three ways out, one of which has to be chosen in writing.**

| | Option | What it costs |
|---|---|---|
| A | Split it: *reaches First Light inside ten minutes* and *holds a proof above `BAND_USABLE`* scored separately, the second with no clock | Two numbers where there was one, and the second stays open past day 0 |
| B | Tell them what to bring | Deletes "material they chose themselves", and stops collecting what people reach for on their own |
| C | Scope the trial to people who already hold a document | The result no longer speaks for anyone who arrives empty-handed, and that limit has to travel with every conclusion drawn from it |

**A is what this section recommends**, because it is the only one that keeps
both clauses honest. The ten-minute clock is a claim about this product's
onboarding; the band is a claim about the person's material. They were ever one
line only because they usually arrive together, and splitting them does not
weaken the criterion — it stops the easier half from concealing the harder one.

It is a recommendation and not a decision. Whoever runs the trial makes it, and
makes it **before the first person opens the link**, for the same reason the
coding rule is written first: settled afterwards, this fork resolves to
whichever reading the five people happened to satisfy.

### The falsifier

**If three or more of the five turn out to be blocked by definition rather than
by visibility, the conclusion is not "fix the app".** It is that the product
measures the wrong gap, and the fork recorded above — narrow the ICP, or learn
to measure a definition gap — becomes the next decision. That is the outcome
this trial exists to make possible; a definition of done with no result that
would falsify it is a plan to feel finished.

**The coding rule is written down before anyone runs.** What counts as
definition-blocked, what counts as visibility-blocked, and what counts as
neither, decided in advance and in writing. Deciding it after five
conversations is not analysis, it is choosing the reading that is comfortable.

### The protocol

**Recruitment.** Five Hebrew-speaking people from the ICP, qualified by the
screen-0 question and nothing else — no discovery call from you first. The
cleanest available source is **people who booked a discovery call and did not
buy**: they have the awareness, they are uncontaminated by the method, and a
free thirty minutes is an easy yes. Past clients are contaminated and close
friends will carry the tool for you. Whatever the source, this cannot be a
sales motion — if it is, the data is worthless and the relationship is spent.

**Day 0 — 45 minutes, watched, silent.** Eight minutes before they touch
anything, one open question: *what is bothering you most about work right now?*
Recorded, unguided; this is the material the falsifier is coded from. Then they
run it while you watch and **do not intervene**, under a contract stated out
loud in advance: *I will not answer questions while you use it; if you get
stuck, that is what I need to see.* The silence is the instrument, and every
question they ask that you do not answer is a finding. Ten minutes afterwards
for criterion 2.

This is the answer to the flaw that runs through every prior observation
behind this product: they all came out of guided conversations with an expert
in the room, and this product is a person alone in a tab. Here you are in the
room but not in the conversation, and they have been told so.

**Day 14 — 20 minutes.** Do not tell them in advance that it is about whether
they published; criterion 3 is checked in public, not from memory. One question
for criterion 4, then anything they want to say.

**Sequencing: two, then five.** The first two test the *protocol* — that the
contract is clear, the timings work, the questions land — and can be anyone
adjacent. Then the five. Do not run the five in parallel: if the first two hit
the same wall at minute three, stop and fix it rather than spending the rest of
a scarce sample proving the same thing.

### Before the first person

1. **Merge the work.** Production serves `main`. Until it does, the trial
   measures an older app than the one being reasoned about here.
2. **Send only the production URL.** Preview deployments sit behind Vercel SSO
   and serve a login page; a participant who gets one concludes the tool is
   broken, and you will never hear why.
3. The recruiting message, the day-0 contract script, an observation sheet with
   the four criteria and timestamps, the pre-registered coding rule, the day-14
   script.
4. **Build nothing.** If you want their proof units, a screenshot of First
   Light. The JSON export exists but contains the client mail they pasted — do
   not ask for it.

### What the result means

| Result | Reading | Next |
|---|---|---|
| **Green** — 4/5 on criteria 1, 2, 4 and 3/5 on criterion 3 | The mechanism works on somebody alone | Freeze features. The next question is distribution, not product |
| **A wall** — the same failure in 3/5 | One thing is broken and you have seen it | Fix that, run three fresh people |
| **The falsifier fires** — definition-blocked in 3/5 | The gap being measured is the wrong one | Stop building. Take the fork |

**Five is enough to kill and not enough to bless.** Four of five hitting the
same wall is a real wall. Three of five passing is not a sixty percent success
rate — it is the absence of a wall, which is a much smaller claim. This
instrument is built to falsify, and that is where its strength is.

### Out of scope for this definition

**Calibration (I2) and compounding (I1) are excluded.** Both assume repeat
visits over time and there is not one observation of that anywhere. They are
built, they work, and they are not part of what "done" means. The same goes for
`track: 'job'` — half the stated ICP, no representation at all in anything
observed so far.

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
A pass over the research corpus for how people describe their own blocker,
in their own words, found something else. Four of the five describe it as an
inability to *say* what they do — "I cannot explain exactly what I do", "it is
hard for me to define", "I cannot put my finger on it". Not one describes
holding evidence that nobody sees.

Three of the five then add the sentence this product exists to overturn: *what
I do is basic, everybody works this way.* So the thesis is not contradicted —
that belief is exactly what a catalogued evidence base disproves. What is in
question is the **order**: the felt complaint is definition, and the discovery
of uncounted evidence is the mechanism that answers it, not the symptom the
person arrives with. Screen 0 has been rewritten accordingly; the deeper
question has not been settled.

**The caveat is as important as the finding.** All five had already hired a
consultant to work on precisely this. That is the opposite selection from
someone who lands alone on a free tab, and it is a population that had already
decided their problem was definition-shaped by the act of buying help for it.
The corpus cannot close this. The five-person trial can, and until it does,
nothing here should be treated as settling whether the ICP narrows to people
whose gap really is visibility, or the product learns to measure a definition
gap as well.

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

## Definition of Done

The repository is done when five **orthogonal** review agents converge on it:

| Agent | Axis | Converges when |
|---|---|---|
| Telos Architect | Does it serve the stated purpose? | The mechanism actually moves a person to authority; nothing in the build is feature-decoration |
| Market / ICP Realist | Would the actor adopt and stay? | Time-to-first-value is minutes, the wedge is defensible, the honest failure modes are named |
| Measurement Methodologist | Are the numbers real? | Every score traces to observable inputs; confidence is reported; no vanity metric is laundered into standing |
| Software Engineer | Is it built? | Tested, typed-at-the-edges, safe against injection, deterministic core, reproducible build |
| Ethics / Anti-Hype | Does it corrupt? | Cannot fabricate evidence; cannot inflate standing; data stays with the user; claims about the product are true |

Convergence means: no agent holds a blocking objection.

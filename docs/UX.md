# UX — designing for the pain the user is already feeling

## The qualifying condition: they already know it hurts

The ICP is an **awareness** segment, not a demographic one (`TELOS.md`,
"Primary actor"). The user we design for has already named the loss to
themselves. Everyone else — same job title, same experience, same LinkedIn — is
out of scope.

This changes the first screen from a pitch into a **question**:

> Which of these is true for you right now?
>
> - I keep sending applications, and the silence is getting to me.
> - My clients are happy, and I have no idea where the next ones come from.
> - **None of these. I do not feel I have a problem right now.**

Three properties make that a qualifying question rather than a segmentation one:

- **The options are the pain, not the goal.** "Looking for a role" is a
  category someone selects. "The silence is getting to me" is something someone
  recognises about themselves. Only the second sorts by awareness.
- **The third option is real.** Full width, same visual weight, no small print.
  Choosing it renders the honest exit: who the tool is for, when to come back,
  and nothing else. No email capture, no "are you sure", no second pitch.
- **The answer sets the track.** The same click that qualifies the user also
  configures the archetype weights and the conversion funnel, so qualification
  costs the user nothing.

The disqualification screen is a **feature of the trust model**, not lost
conversion. This product's central claim is a number that tells users
uncomfortable things about themselves — that their visibility exceeds their
evidence, that their strongest proof is one they were embarrassed by. A product
that will not say "this is not for you" has no standing to say any of that.

**Corollary for every screen: never sell the problem.** No screen argues the
user has a problem. The product measures a problem the user brought with them.

## The conscious pain

The pain the target actor can *name* is not the pain our method diagnoses.

| What we diagnose | What they actually feel |
|---|---|
| "Your L1 proof capital is high, your L3 artifact layer is empty" | **"I know I'm good. Nobody else knows."** |
| "Archetype coverage gap in VALIDATION" | "I sent 60 applications and got 2 replies." |
| "Your positioning lacks specificity" | "I don't know how to describe what I do without sounding like everyone else." |
| "Groundedness ratio is low" | "I look at LinkedIn and feel sick. I'm not going to become one of those people." |

**Design rule: the product speaks in column two. It thinks in column one.**

## The two pains, and they are in tension

**Pain A — invisibility.** Fifteen years of work, and the market behaves as if
it did not happen. Applications go unanswered. Less capable people are getting
what this person wants. Every week that passes makes it worse.

**Pain B — the authenticity barrier.** The obvious solution — self-promotion —
is repellent. In Hebrew-speaking professional culture especially, LinkedIn
self-promotion carries real social cost. The user would rather stay invisible
than become "one of those people."

**Every competing product resolves this tension by ignoring Pain B.** They hand
the user a hook library and a posting streak. Users who feel Pain B strongly
churn immediately, and they are the majority of this ICP.

This product resolves it structurally: **you are not being asked to promote
yourself. You are being asked to stop hiding evidence.** The Liebig gate makes
part of that mechanical: the system will not let visibility run ahead of
evidence, and it says so on the first screen. It cannot verify what the user
types, and the first screen says that too — see `README.md`, "what the gate
does not prevent". The other half of the answer is the authorship readout in
the studio, which measures how much of a draft the tool wrote rather than
denying that it wrote any of it.

## The hero metric is the pain, quantified

Not "Authority Index" as the headline. The headline number is the
**Visibility Gap (פער הנראות)**:

```
gap = foundation − built
```

- **gap > 0** — your evidence supports more standing than you have.
  *"Your evidence supports 72. The world sees 19. Gap: 53."*
  This is Pain A, measured, and it is the most motivating sentence the product
  can say to this person.
- **gap < 0** — you are more visible than your evidence supports. The system
  says so plainly and stops recommending publishing.

The Authority Index still exists and is still the composite — but it is the
*second* number. The gap is the first, because the gap is what the user already
feels at 2am.

## Cold start: never open on a dashboard of zeros

The actor arrives in a shame state. Six layers reading `0` with red indicators
is the single worst possible first screen — it reproduces the exact experience
they came to escape.

**Cold start sequence:**

1. **Screen 0 — mirror the pain, qualify, offer one action.**
   No navigation. No score. One sentence that names what they feel, then the
   qualifying question above, then one paste box and one button. Under the
   button, the anti-hype pledge in plain language, because Pain B has to be
   neutralised before they will paste anything personal. Answering the
   qualifying question re-renders the screen, so the paste box renders from the
   form cache — a box that empties itself when the user answers a question
   above it is the worst possible bug on this screen.

   **What the paste box asks for is a product decision, not a placeholder.**
   Asking for a CV gets a CV, and a CV is the worst available input: it is the
   document the user has already edited, and they can already name its best
   three lines. Nothing in it is a discovery. The screen therefore asks for the
   material they never counted as evidence — client emails, a project thread, an
   old proposal, meeting notes — and says plainly that messier and longer is
   better. That is where the units they forgot they earned actually are, and it
   is the input model-assisted extraction (`docs/METHOD.md`) pays off on:
   sentence splitting cannot tell a buried result from four lines of
   pleasantries, and it cannot see an outcome whose before-state sits in the
   previous sentence.

   **The third answer: "I have nothing to paste."** This is the commonest way
   the product fails a real person, and for a long time screen 0 had two
   replies to it — paste something anyway, or look at our sample — both of
   which tell someone whose work left no file behind that they are not who this
   was built for. (The sample's own copy said as much: *"I have nothing ready —
   show me on a sample"*. It teaches how the ranking works and measures nobody,
   so it now offers only that.)

   The real answer is the recall route. Three questions — the last project, who
   was in the room, what was said when it ended — and what comes out is a list
   of **errands addressed to people the user just named**, not evidence. The
   pivot is the second question: a name is not proof, but it is the address of
   someone who can supply proof, and one message to one named person is a
   smaller ask than finding a file that does not exist. `docs/METHOD.md`
   honesty rule 8 is why it cannot be anything else — a memory typed into a box
   passes the verbatim gate trivially, because it is its own source.

   Two consequences for this screen. The recall panel **says in its first line
   that nothing typed there is counted**, before the boxes, because a box that
   looks like the paste box and behaves differently has to say which one it is
   first. And it sits *below* the two primary actions, in the aside register:
   most people who think they have nothing do have something, and this must not
   talk them out of looking.

   The fourth question the research proposed — *what do you do differently
   since* — is deliberately not asked. It produces no recipient, and under rule
   8 it cannot become evidence either, so it would be a fourth box whose answer
   is written to disk and never read again. That is the exact defect
   `profile.expectedEvidence` was just repaired for.

2. **Screen 1 — First Light.** After the first mine, a dedicated reveal state
   — *not* the dashboard. `"מצאנו 14 הוכחות במה שהדבקת."` Then the three they
   would never have published themselves, with the reason each one is stronger
   than they think. **This is the product's entire hook and it must land inside
   3 minutes of arrival.**

   **After the three, and only after them: what you expected.** Onboarding asks
   which single piece of evidence the user thinks holds their claim. First
   Light shows that answer beside the unit that actually scored highest. A
   match is reported as confirmation — that is credit, not a test they passed.
   A divergence is reported as one line worth looking at, with the caveat that
   the comparison is token overlap and cannot tell a blind spot from a miner
   that missed the line. It renders nothing when the question went unanswered.

   **The version deliberately not built** is the neighbouring one: setting the
   self-reported `fitConfidence` against L1's measured band. "You said 8, your
   evidence says 31" reverses the product's emotional direction — the gap
   exists to say the world undervalues you, not that you overvalue yourself —
   and pairs two scales that are nowhere defined against each other. The
   reasoning is kept next to the field in `core/schema.js` so the idea is
   refused once rather than re-proposed.

   **First Light is postponed for the recall visitor, never skipped.** They had
   nothing to reveal on arrival, so `sawFirstLight` stays false and the reveal
   waits for the day their material lands and gets mined. The hook is the whole
   product; being empty-handed on the first screen is not a reason to forfeit
   it.

   **The honest states name the stage, not the person.** When the first pass
   finds nothing usable, or finds only weak lines, the screen says so as *the
   expected result of a first pass over one document* — not as a verdict on
   what the user brought. It used to read "the material you pasted is not
   concrete enough" and "what you pasted mostly describes roles", which is a
   judgement delivered within three minutes of arrival to someone in a shame
   state. Stating a limitation in advance is what turned the identical
   experience from a complaint into reassurance for a client in the corpus.
   The advice underneath also no longer opens with *paste something with a
   number in it*: seven of the eight evidence routes need no magnitude, and
   this screen was contradicting the plays copy one click away.

   (The neighbouring idea — putting the same expectation-setting on screen 0 —
   is deliberately not built. It collides head-on with *the first screen
   qualifies, it does not educate*: a pre-emptive explanation of a limitation
   is selling the problem in the wrong direction.)

3. **Screen 2+ — the dashboard**, unlocked only once L1 exists.

## The dashboard opens on the gap, then on the user's own words

Order: the Visibility Gap, then the **return bridge**, then the single Next
Move. The bridge is up to three of the user's own unpublished sentences,
verbatim — the gap in their handwriting, sitting directly above the thing they
are being told to do about it. The move that produced the richest turns in the
corpus was reading a person's own words back to them, and the dashboard had
nothing of theirs anywhere on it.

It carries **no clock** — see `docs/TELOS.md`, "it does not measure your
absence" — and renders nothing on bundled fixtures, because "what you already
wrote" over eight sample sentences is the lie First Light was repaired for.

Layers L3–L6 stay visibly **locked, not failed**. A locked layer says
*"unlocks when you publish your first grounded artifact"* — it never says `0`.
Absence of data is never rendered as poor performance.

## Two tracks, because the ICP is two populations

At onboarding the user picks a track. It changes vocabulary, the conversion
funnel, and the recommended plays:

| | `job` — מחפש עבודה | `independent` — בונה עצמאות |
|---|---|---|
| Conversion events | reply, screening call, interview, offer | DM, discovery call, proposal, deal |
| Winning archetypes | OUTCOME, METHOD, CREDENTIAL | OUTCOME, VALIDATION, PEER |
| Recommended surface | profile headline, About, targeted posts | posts, comments, case studies |
| Urgency framing | weeks since last interview | pipeline conversations open |

A second field — **how long has this been bothering you** — sets the urgency
register. Deliberately phrased about the pain rather than about the activity:
"how long have you been at this" measures effort, and someone can be six months
into a search while only recently feeling it, or feeling it acutely without
having started. The awareness clock is the one that should set the tone, and
asking about it also re-confirms the qualifying condition without a second
screen.

## Emotional register

- **Calm and adult.** No confetti, no mascots, no exclamation marks, no
  gamified streaks. Streak mechanics turn Pain A into guilt.
- **Never scold.** The product never says "you haven't posted in 12 days."
  It says "there are 4 proof units approaching their shelf life."
- **Credit before critique.** Every proof unit shows what is strong before what
  is missing. The actor has spent months being told they are not enough.
- **Banned vocabulary**, because it triggers Pain B directly:
  *מיתוג אישי, מותג אישי, להפוך למשפיען, ויראלי, האקים, לפרוץ,
  personal brand, thought leader, influencer, hack, viral, crush it.*
- **Preferred vocabulary:** ראיות, עקבות, מה שכבר עשית, נראות, מה שאפשר לבדוק,
  standing, evidence, traces, what you already did.

## Hebrew and RTL are native, not a translation layer

- `dir="rtl"` on the document, logical CSS properties throughout
  (`margin-inline`, `padding-inline`, `inset-inline`) so the LTR mirror is
  free and correct.
- Hebrew is the **source** copy; English is the translation. Written in the
  register of an Israeli professional in their forties — direct, unsentimental,
  no marketing cadence.
- Numerals and Latin fragments inside Hebrew sentences are wrapped so
  bidirectional reordering does not mangle them.
- The signal extractor treats Hebrew as a first-class language: niqqud
  stripping, final-letter normalisation, prefix stripping (ו/ה/ב/ל/מ/ש/כ),
  Hebrew stopwords, Hebrew currency and date formats.

## A finding names the thing it found

The positioning screen used to report *"there are words here that everyone in
your field uses"* — computed by counting regex matches and throwing the matches
away. The user cannot act on that. They cannot even tell whether the product
means `אסטרטגי` or `פתרונות`, and a finding they cannot locate reads as the
product being clever at them.

It now names the words, in the user's own spelling and inflection, and asks a
question about them rather than passing sentence: *"how many people in your
field could write exactly that about themselves?"* The words are what makes it
answerable.

This is the same defect the gap plays were repaired for (`docs/METHOD.md`, I3),
and it generalises: **if the engine had to identify something in order to
report it, the report says what it identified.** Where naming is impossible —
the drift check, which compares distributions rather than strings — the copy
says what it counted instead.

## A box that takes prose says what it does with the prose

There are now two places where the product asks for the user's own writing and
then deliberately does nothing arithmetic with it: the recall panel on the
sources screen, and the reply bank on the measurement screen. Both are the same
UI hazard — they look exactly like the paste box, which *is* measured — so both
follow the same three rules.

**The boundary is stated above the box, not below it.** A person decides what
to type before they read the caption underneath. The reply bank matters most
here: it sits four fields below `substantiveComments`, which carries weight 6
in L4, and a user could reasonably assume the two are the same act.

**The honest route is named in the same breath.** "If those words arrived in an
email, paste the email into sources — that is where it gets measured." A
refusal with no alternative reads as the product being difficult; a refusal
with a route reads as the product being careful.

**Verbatim means verbatim.** The reply bank never truncates, never reflows, and
renders with line breaks intact, while every other list on that screen shows a
sixty-character preview. Truncating the market's exact sentence would break the
only thing that field is for.

## Hand-holding: exactly one next move

Every screen answers *"what do I do now?"* with one action, never a menu.
The Next Move card is the only element on the dashboard styled as primary. It
carries: the action, why this one, which layer it lifts, expected lift, and
effort in minutes.

If the user does nothing else, doing the Next Move repeatedly is the whole
product.

## Accessibility floor

Keyboard reachable throughout, focus visible, focus trapped and restored in
dialogs, `Escape` closes, live regions announce state changes, `prefers-reduced-motion`
respected, contrast ≥ 4.5:1, no meaning conveyed by colour alone (every score
band carries a text label as well as a hue).

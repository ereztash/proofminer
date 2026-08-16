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

2. **Screen 1 — First Light.** After the first mine, a dedicated reveal state
   — *not* the dashboard. `"מצאנו 14 הוכחות במה שהדבקת."` Then the three they
   would never have published themselves, with the reason each one is stronger
   than they think. **This is the product's entire hook and it must land inside
   3 minutes of arrival.**

3. **Screen 2+ — the dashboard**, unlocked only once L1 exists.

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

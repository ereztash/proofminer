# COMPETITIVE_RESEARCH — what the neighbouring categories do badly

Searched 26 August 2026. Every claim below carries its source and the date the
source was read. Where a number is a vendor's own marketing it is labelled as
such and is not treated as a finding.

This is not a feature comparison. ProofMiner is a single-user, browser-only,
Hebrew-first diagnostic with no account; the tools below are mostly
multi-seat SaaS. Copying their feature lists would be the wrong instrument.
What is worth taking from them is **the complaints that recur**, because a
complaint that recurs across a category is usually structural, and a structural
complaint in a neighbouring category is the clearest available prior about what
will go wrong here.

## What was compared, and why each is a neighbour

| Category | Why it is a neighbour |
|---|---|
| Research repositories — Dovetail, Condens, EnjoyHQ, Marvin | Same core act: raw material in, an evidence unit out, and something has to decide which passage counts |
| AI-assisted qualitative research | Same trust problem: a model proposing what the evidence *is* |
| Case-study / proof generation | Same output: a claim that must stay attached to what supports it |
| Personal branding / LinkedIn content tools | Same user, opposite mechanism — they reward volume, this one caps it |
| Local-first AI | Same architectural refusal |

## The complaints that recur

**Time to first value is the category's wound.** Condens "is the fastest tool
to get running on day one" is offered as its *distinguishing* virtue, which
tells you what the rest are like; Dovetail is described as "very manual,
especially for newbies and non-researchers"; EnjoyHQ is being left over "manual
upkeep". ([Koji, 2026](https://www.koji.so/blog/best-ux-research-repository-tools-2026);
[Looppanel](https://www.looppanel.com/blog/dovetail-user-research);
[Perspective AI](https://getperspective.ai/blog/best-dovetail-alternatives-in-2026-from-research-repository-to-real-answers))

> **Where ProofMiner already sits:** paste one document, get a ranked result on
> the same screen. The whole onboarding is three fields and a paste box, and the
> production smoke walks it end to end in under seven seconds. This is the one
> axis where the product is not behind — it is structurally ahead, because it
> refuses the multi-source ingestion that creates the upkeep.

**The category is moving from storage to decision.** Several 2026 comparisons
describe the same shift: from "archive every interview" to "surface the right
insight at the moment of decision".
([Perspective AI](https://getperspective.ai/blog/ux-research-repository-tools-2026-8-platforms-compared))

> ProofMiner is already on the far side of that shift — it holds no archive and
> answers one question per screen. That is a convergence, not an advantage: the
> incumbents are moving toward where this product started.

**Model output is trusted without being read, and that is measured.** Stanford
research cited across the 2026 legal-AI coverage puts hallucination at **17–34%
of queries even for the best-performing legal tools**, and the Charlotin
sanctions database had reached **1,769 tracked cases as of 17 July 2026**. The
line that matters for this product's design: *every* lawyer in that database
"trusted an output they had not read".
([GC AI](https://gc.ai/blog/ai-hallucination-legal-cases);
[HAQQ](https://www.haqq.ai/blog/ai-legal-hallucination-audit);
[Open](https://www.open.cx/blog/ai-hallucination-examples))

> **This is the strongest external support the architecture has.** ProofMiner's
> extraction gate does not ask the model to be accurate; it discards anything
> not present verbatim in the user's own document and stores the document's
> characters rather than the model's string. A product whose failure mode is
> "the user did not read the output" is defended by making the output
> incapable of being new text. See `docs/METHOD.md` honesty rule 2 and
> `src/engine/extract.js`.
>
> **The limit, stated:** that defends against fabrication, not against a true
> sentence used wrongly. The product says so on screen; the sources above are
> about a failure it does defend against, and should not be read as covering
> the one it does not.

**The adjacent consumer market is saturating with generated text, and the
platform has started policing it.** A Pangram Labs study reported in July 2026
classified **over 40% of long-form LinkedIn posts as entirely AI-generated**;
LinkedIn now offers a way to flag "AI slop" and penalises content that reads as
fully automated. The recurring critique is content that "sounds good, but
doesn't always say something that only that person could say".
([Rewarx](https://www.rewarx.com/blogs/ai-content-strategy-punished-by-linkedin);
[Andy Stalman](https://andystalman.com/en/on-linkedin-ai-produces-content-but-personal-branding-builds-trust/);
[Bloomberry](https://www.bloomberry.ai/blog/best-ai-personal-branding-2026))

> **This is a tailwind for the anti-goal and it is the first external evidence
> for it.** `docs/TELOS.md` argues that a tool which rewards volume is the wrong
> product for someone who would rather stay invisible than "become one of those
> people on LinkedIn". The market is now producing that reaction at scale, and
> the platform is pricing it.
>
> **Not to be overread.** Saturation is not demand. It says the anti-goal is not
> eccentric; it does not say anyone will pay for the alternative. The liability
> finding in `docs/MARKET.md` still stands and still points the other way.

**Local-first crossed from demo to production this year.** WebGPU compute
pipelines and WebAssembly transformer runtimes are described as making
client-side inference practical for production in 2026 rather than only for
conference demos, with the EU AI Act in active enforcement and cloud inference
costs up 15–30% year on year since 2024.
([SitePoint](https://www.sitepoint.com/definitive-guide-local-first-ai-2026/);
[privacytools.io](https://privacytools.io/ai))

> **This changes the price of one open decision.** The Hebrew organisation
> detector reaches 46% and a Hebrew NER model reaches 85% at the same position
> (`docs/MEASUREMENT_HEBREW_ORGS.md`). Running that model in the browser would not break
> the no-transmission refusal — nothing leaves the device — only the
> lightweight one. The category moving this way is a reason the option stays
> open, not a reason to take it before the trial in `docs/TELOS.md` has run.

## Where ProofMiner is genuinely differentiated

Stated as claims with the evidence for each, because a differentiation nobody
can check is positioning rather than engineering.

| Claim | Evidence | Confidence |
|---|---|---|
| Output cannot contain text the user did not write | `acceptSpans` locates every candidate verbatim and slices the source's own characters; re-run at mining time so an edited backup cannot inject either | **High** — enforced in code, tested |
| Publishing cannot manufacture standing | Liebig gate caps `built` at `foundation + 25`; `HOLLOW` rather than a higher score | **High** — enforced, tested |
| A generated draft cannot acquire a number | `validateGrounding` blocks on any digit or number word absent from the cited proof, model rewriter included | **High** — enforced, tested |
| Nothing is transmitted | Zero outbound requests; both model features off by default, each behind its own consent, the larger nested inside the smaller | **High** — verified in the browser, no network calls on the core flow |
| Time to first value | Paste → ranked result on one screen | **High** — smoke walks it in under 7s |
| Hebrew-first | Every string, RTL, and a Hebrew organisation detector measured against an external corpus | **Medium** — measured at 46% recall, which is not good; see `docs/MEASUREMENT_HEBREW_ORGS.md` |

## Where it is behind, and the honest reason

| Gap | Reason |
|---|---|
| No collaboration, no export to a team, no sharing | Deliberate. It is a single-user diagnostic; adding these makes it a worse version of Dovetail |
| No archive, no search across past material | Deliberate, and now converging with where the category is going anyway |
| Nobody has used it | **Not deliberate.** This is the binding constraint on every score in `docs/PRODUCTION_READINESS.md` and no amount of engineering moves it |

## What this research does not establish

- **No pricing comparison was attempted.** ProofMiner is free and the plan in
  `docs/MARKET.md` says it stays free, so competitor pricing is not a decision
  input here.
- **No head-to-head test was run.** Nobody has put the same document through
  ProofMiner and through Dovetail. Everything above is a category-level prior.
- **The complaints are drawn from comparison articles, several published by
  competing vendors.** They agree with each other across sources with opposing
  commercial interests, which is why they are reported; a single vendor's
  characterisation of a rival is not evidence and none is cited alone.

---

# Addendum — 28 August 2026: directional priors with no citations

**Source: the owner's own external review, relayed 28 August 2026. No URLs, no
publication dates and no study identifiers were supplied with it.**

That is recorded first because it decides how these may be used. Everything
above this line carries a source and the date it was read; the five items below
do not, and they are therefore **not findings and may not be cited as external
evidence.** They are directional priors — worth writing down because each one
already has a matching decision in this repository, and a prior that agrees with
a decision you already made is exactly the kind that needs its tier stated
plainly rather than quietly upgraded.

**Two of the five are already covered above, with sources, and are not repeated
here:** *AI genericness / LinkedIn hostility to generated content* (see the
Pangram Labs and LinkedIn policing entry) and *repository upkeep becoming the
user's work* (see the time-to-first-value entry). Only the three genuinely new
ones are listed.

| Prior | Evidence tier | The decision it matches | What would raise the tier |
|---|---|---|---|
| **Score chasing.** Users of adjacent scoring tools optimise the number rather than the outcome it stands for | **Low** — unsourced, and the mechanism is plausible enough to be believed too easily | *Score subordinate.* Enforced and tested: no score renders outside its explanation on First Light, and Patch 3 demoted the Visibility Gap below the evidence and the action | A named tool, a dated source, and ideally a measured behaviour rather than a reviewer's impression |
| **Attestation friction.** Testimonial tools are valued when *giving* evidence is trivially easy, and resented when *collecting* it becomes account and setup work | **Low** — unsourced. Directionally consistent with the time-to-value complaints above, which are sourced | *Evidence acquisition from another person must be easier than evidence management.* The recall route already produces addressed errands rather than a collection workflow | A source, and a distinction between the giver's friction and the asker's — they are different products |
| **Platform dependence.** Professional profile and portfolio destinations disappear or pivot, taking hosted work with them | **Low** — unsourced as relayed, though the underlying class of event is well known | *Launchpad, not destination.* The product holds no audience, no feed and no profile; JSON export/import/reset already exist in settings | A named shutdown with a date, and evidence about what users actually lost |

## What this addendum must not be used for

- **It may not be cited as external validation of any of the three decisions.**
  Each decision was made on this repository's own reasoning, recorded in
  `docs/TELOS.md`; a prior arriving afterwards that agrees with it is not
  evidence for it. Writing an unsourced agreement down next to a decision is
  how a house view starts to look externally confirmed.
- **It may not license a feature.** In particular, "platform dependence" is not
  an argument for building a human-readable export. The JSON snapshot already
  makes the state portable, and whether that fails a real user job is a question
  for the trial in `docs/EXPERIMENTS.md`, not for this table.
- **It should be deleted or promoted, not left.** If the sources arrive, these
  move up into the body of this document with their citations. If they do not,
  this section stays exactly where it is, at the tier it was given.

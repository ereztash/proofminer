# Speech-language / memory evidence transfer into ProofMiner

This document applies an evidence-to-repository transfer protocol to ProofMiner. It deliberately does **not** turn a true fact from speech-language pathology, literacy, or memory research directly into a feature. Every transfer below is written as:

`source claim -> mechanism -> current repo contact point -> discriminating measurement -> stopping rule -> only then a product change`

The primary source is the uploaded Hebrew 2020 speech-language pathology licensing summary. External research is used only to test or sharpen a transfer, not to silently replace the source.

## Executive verdict

The source does **not** justify adding another score, another content generator, or a diagnostic label to ProofMiner.

It does strengthen three narrower product hypotheses:

1. **The recall route is probably a retrieval-cue problem, not a blank-box problem.** The current route already has the right integrity boundary — recalled prose does not become evidence — but its prompts can be tested as memory cues rather than treated as copy.
2. **A single pasted document is not a sufficient sample of a person's evidence ecology.** The source repeatedly separates performance across natural/open versus structured/elicited contexts and warns against confusing transient non-language factors with stable deficits. ProofMiner should therefore measure source diversity and source-dependent yield before interpreting a low inventory as low evidence.
3. **Hebrew entity extraction has a real morphology boundary problem.** The repo already encountered this empirically with bare `ב` prefixes. External Hebrew NER research independently shows that named-entity boundaries in Hebrew frequently do not coincide with whitespace-token boundaries. This is a measured engineering constraint, not a reason to add a full morphology stack today.

The highest-value next work is therefore **measurement around recall yield, source ecology, and Hebrew extraction misses**, not more scoring logic.

---

## T1 — Recall route: test cue quality, not prose quality

### Source-derived claim

The licensing summary treats retrieval as separable from knowledge: a person may possess lexical/semantic knowledge yet have difficulty retrieving it, and evaluation should distinguish the two. It also describes semantic networks and multiple relation types between concepts rather than a flat list of words.

Relevant source areas:
- semantic lexicon organisation and retrieval: pp. 44–46
- retrieval difficulties and use of semantic / phonological cues: p. 46
- working memory / executive processes as contributors to performance: learning-disability section, pp. 59–64

### External check

A review of self-generated retrieval cues argues that recall improves when cues overlap with the original encoding context and when the cues are distinctive; self-generated cues can outperform generic interviewer-provided cues because they carry idiosyncratic episodic detail. This is a memory mechanism, not a ProofMiner result.

### Current repo contact point

`engine/recall.js` and the cold-start recall route described in `docs/UX.md` already enforce the correct epistemic boundary:

- recalled material is **not evidence**;
- the route exists only to produce an errand addressed to a person who can return independent material;
- the authority computation is invariant to recall-route prose.

That should not change.

### Product hypothesis

The current three recall questions may be valuable because they reinstate event context, not because there are exactly three of them or because their wording is intrinsically good.

A better cue family to test is episodic and relational:

- **event** — what project / incident are you thinking of?
- **people** — who else was there or received the work?
- **turn** — what changed, surprised someone, or caused a decision?
- **trace** — where would a trace of that event plausibly exist: email, WhatsApp, proposal, calendar, invoice, deck, ticket, document?

The fourth cue is not asking the user to remember a flattering claim. It asks where an external trace might exist.

### Measurement before build

Run the next five-person trial with recall visitors using two frozen prompt sets, alternated by participant:

- **A: current three prompts**
- **B: context-reinstatement prompts** above

Primary outcome:

`independent evidence returned within 14 days / recall visitors`

Secondary outcomes:
- number of distinct named recipients or trace locations produced;
- time to first actionable errand;
- proportion of errands that return a document versus only a self-report;
- participant correction of the prompt framing without being asked.

### Stopping rule

Do **not** change the recall route if B does not produce a larger independent-evidence return rate or a clearly lower time-to-errand. With five people this cannot establish a stable effect; it can only decide whether the mechanism deserves a larger test.

### Not allowed from this finding

- recalled prose entering L1;
- scoring autobiographical detail;
- inferring memory impairment;
- adding a cognitive profile to the user;
- treating recall difficulty as evidence scarcity.

---

## T2 — Evidence ecology: low inventory may be a sampling failure

### Source-derived claim

The source repeatedly distinguishes performance across different contexts and task forms. In language assessment, production should be examined in both open/natural interaction and structured elicitation; a poor performance can also reflect attention, memory, hearing, cooperation, or situational factors rather than the target language ability itself.

The important transfer is methodological:

> **an observed sample is not automatically the latent capacity.**

### Current repo contact point

ProofMiner currently mines what the user pastes. The README and UX already recognise that a CV is a biased source and explicitly prefer messier material such as client emails, threads, old proposals and meeting notes.

But the product still risks turning one source container into a statement about the person's evidence base.

### Product hypothesis

The strongest cold-start finding may not be `how many proof units were found`, but **how source-dependent the yield is**.

A professional's evidence may be distributed across distinct source classes:

| source class | likely evidence shape |
|---|---|
| CV / profile | duties, credentials, compressed achievements |
| client email / testimonial | third-party validation, outcome language |
| proposal / SOW | promised transformation, positioning |
| project thread / chat | decisions, problem solving, peer evidence |
| calendar / invitation / agenda | recognition, talks, trusted roles |
| invoice / contract / offer | commercial conversion |
| post / publication | artifact + reception traces |

This is an evidence-ecology hypothesis, not a new score.

### Measurement before build

For every source document in the trial, store only a coarse user-selected source type locally and compute:

- proof units per 1,000 characters;
- archetype yield by source type;
- third-party-attested units by source type;
- highest-scoring unit by source type;
- marginal new archetypes contributed by the second, third and fourth source classes.

The key quantity:

`marginal evidence gain from source diversity`

If the second or third source class repeatedly unlocks evidence that the first source class could not contain, the onboarding problem is not "paste more". It is **sample another context**.

### Stopping rule

Do not build source-type guidance if source diversity does not add materially new proof archetypes or stronger independent attestation in the trial.

### Product change only if unlocked

Replace generic "paste more" guidance with exactly one next-source recommendation chosen by what the current inventory lacks.

Example:

`You have outcomes but almost no third-party wording. The next place to look is a client email or message thread.`

This is allowed only if the missing archetype -> source-class relationship is observed in real users rather than inferred from the table above.

---

## T3 — The first-light reveal should test discovery, not agreement

### Source-derived claim

The source distinguishes receptive knowledge, expressive performance and retrieval. A person can possess knowledge that is not immediately produced, and a produced response is not a complete measure of the underlying representation.

### Current repo contact point

ProofMiner already refuses `does that sound right?` as evidence. `docs/UX.md` explicitly says agreement is not confirmation and records unprompted correction as a stronger trial observation.

### Product hypothesis

First Light should be evaluated as a **discovery instrument**:

- did it surface something the person had not counted?
- did the person correct it?
- did it cause retrieval of a better source?
- did they later use or repeat it?

Not:

- did they like it?
- did they agree with the score?
- did they say it felt accurate?

### Measurement

For each of the three revealed proof units, record during the observed trial:

1. `already-counted / forgotten / disputed / misunderstood-by-miner`
2. whether the participant spontaneously names a richer source after seeing it;
3. whether they repeat the unit or its underlying fact at day 14.

### Stopping rule

If most top units are `already-counted`, First Light is ranking, not discovery. The product's current hook claim then needs narrowing even if users like the screen.

---

## T4 — Hebrew organisation extraction: this is a morphology problem with a bounded test

### Repo evidence already present

The recent commits record a stubborn Hebrew miss: an organisation introduced with a bare `ב` prefix can be invisible, while naively stripping `ב` creates fabricated organisation names from ordinary words. The repo correctly chose a false negative over a false positive that violates the anti-goal.

### External check

Modern Hebrew NER research independently demonstrates that entity boundaries in morphologically rich Hebrew often **do not coincide with whitespace token boundaries**. Bareket & Tsarfaty's NEMO² work reports better Hebrew NER when morphological boundaries are explicitly modeled and shows that pipeline errors in morphological segmentation matter. Their NEMO corpus provides token-level and morpheme-level labels for entities including `ORG`.

This validates the *class of problem*. It does not validate adding their neural architecture to ProofMiner.

### Product hypothesis

Before accepting the current miss as permanent, benchmark the existing detector against a **small, purpose-built Hebrew organisation slice** derived from an external annotated corpus.

The question is not "can NER be improved?" It is:

> `How much of ProofMiner's current archetype miss rate is specifically attributable to clitic-attached organisation boundaries?`

### Minimal experiment

Construct a fixed evaluation slice with at least these classes:

1. bare organisation: `אלפא לוגיסטיקה`
2. preposition + organisation: `באלפא לוגיסטיקה`
3. preposition + article + organisation where grammatical
4. ordinary verb beginning with `ב`
5. person names beginning with letters that look like removable clitics
6. common-noun organisation descriptions that must **not** become named entities

Compare:

- current heuristic;
- a conservative lexicon / pattern patch;
- an external Hebrew morphological/NER component if it can run fully client-side within the product's privacy and size constraints.

Primary metric must weight false-positive entity invention more heavily than misses, because invention violates ProofMiner's anti-goal.

### Stopping rule

Do not adopt morphology if the observed recall gain is small, if bundle/privacy cost is large, or if false entity invention rises. A named miss is preferable to a fabricated proof signal.

---

## T5 — Do not let a single score alias several mechanisms

### Source-derived claim

The source's assessment sections repeatedly use differential diagnosis: similar surface difficulty can arise from different mechanisms, and evaluation tries to separate input, processing and output rather than assigning one cause from one behavior.

### Current repo contact point

ProofMiner's strongest methodological risk is analogous: a low layer score can be produced by different states.

For example, low L1 can mean:
- genuinely thin evidence;
- rich evidence in an un-sampled source class;
- extraction miss;
- recalled but unverified claims waiting on another person;
- evidence present but low on the current scoring priors.

These states should not collapse into one behavioural recommendation.

### Proposed invariant

Before a Next Move is produced from a low layer, it should identify which of three classes the observation actually supports:

`ABSENT` — the searched evidence class is genuinely not present in sampled material.

`UNSAMPLED` — the relevant source context has not been provided.

`UNRESOLVED` — candidate material exists but extraction / verification cannot yet classify it safely.

This is conceptually similar to the repo's existing distinction between `HOLLOW` and `UNCATALOGUED` and should extend that discipline rather than create another score.

### Measurement before code

Code the five-person trial's low-L1 moments into these three buckets manually. If the buckets rarely change the next action, no new state is needed. If they repeatedly produce different actions, then encode the distinction.

---

## T6 — What the source does *not* justify

The following ideas are attractive transfers and should remain rejected by default:

| tempting idea | why it is not licensed |
|---|---|
| detect dyslexia / language disorder from ProofMiner behaviour | the product has no validated diagnostic instrument and the source does not license inference from ordinary app use |
| use linguistic complexity as evidence quality | linguistic sophistication is not proof strength |
| reward more elaborate prose | conflicts with the anti-goal and can punish concise strong evidence |
| infer expertise from vocabulary depth | construct aliasing: lexical performance is not professional standing |
| add a semantic network UI because the mental lexicon is networked | a cognitive description is not evidence of interface utility |
| revive generic Hebrew morphology everywhere | the current measured problem is bounded to extraction misses; solve only the measured slice |
| let recall answers become proof because cueing improved recall | better recall is still recall, and `METHOD.md` honesty rule 8 remains binding |

---

# Ordered backlog

The source changes the research order more than the feature list.

## Now — trial instrumentation only

1. **RT-1 Recall cue A/B:** current prompts vs context-reinstatement prompts.
2. **EC-1 Evidence ecology:** source class x proof/archetype yield.
3. **FL-1 First Light discovery coding:** already-counted / forgotten / disputed / miner miss.
4. **DX-1 Low-L1 manual differential:** ABSENT / UNSAMPLED / UNRESOLVED.

All four can be observed without changing the scoring model.

## Parallel engineering benchmark

5. **HE-NER-1:** fixed Hebrew organisation/clitic evaluation slice against current extraction.

This may justify a bounded extraction improvement. It does not wait on user behaviour because the repo already has a measured Hebrew detector miss; the external work only supplies a better benchmark and mechanism.

## Explicitly blocked

- new authority dimensions;
- new composite scores;
- morphology stack in production;
- cognitive/clinical profiling;
- recall-derived proof;
- source-diversity guidance before source-yield evidence exists.

---

# Decision consequence

The uploaded source is more useful to ProofMiner than to a content generator because it reinforces a principle the repository already has but has not fully generalized:

> **Do not confuse what you observed with why it happened.**

In this product that means:

- low proof inventory is not automatically low proof capital;
- failed retrieval is not absence;
- an extraction miss is not a missing entity;
- agreement is not validation;
- one document is not the person;
- a score is not a mechanism.

The highest-leverage transfer is therefore not a feature. It is a stricter chain from **observation -> discriminating question -> next action**, with the trial deciding which distinctions deserve to become product state.

## External references used to test the transfer

- Wheeler, R. L. & Gabbert, F. (2017). *Using Self-Generated Cues to Facilitate Recall: A Narrative Review*. Frontiers in Psychology 8:1830. Used only for the retrieval-cue mechanism.
- Bareket, D. & Tsarfaty, R. (2021). *Neural Modeling for Named Entities and Morphology (NEMO²)*. Transactions of the Association for Computational Linguistics 9:909–928. Used only to test the Hebrew morphology/NER mechanism.
- NEMO Corpus / NEMO code repositories (OnlpLab). Used as candidate benchmark infrastructure, not as production dependencies.

---

# Integration status — 28 August 2026

This file is a **research transfer, and it is deliberately not integrated.**
Nothing in it has become a feature and nothing should, quietly. The question
applied to each proposal below is the only one that matters at this stage:

> **Does it change a decision available *before* external users exist?**

| | Proposal | Changes a decision now? | Status |
|---|---|---|---|
| RT-1 | Recall cue A/B — current prompts vs context reinstatement | **No.** It compares two cue sets by what people retrieve, and nobody has used either | `BLOCKED_EXTERNAL` — trial instrumentation |
| EC-1 | Evidence ecology — source class × proof/archetype yield | **No.** Needs a spread of real source classes; the repo has fixtures and one external corpus | `BLOCKED_EXTERNAL` |
| FL-1 | First Light discovery coding — already-counted / forgotten / disputed / miner miss | **No**, and it is the most valuable of the four. It is the instrument that would tell whether the reveal fires | `BLOCKED_EXTERNAL` |
| DX-1 | Low-L1 differential — ABSENT / UNSAMPLED / UNRESOLVED | **No.** Distinguishing them requires asking a person which one they are in | `BLOCKED_EXTERNAL` |
| HE-NER-1 | Fixed Hebrew organisation/clitic evaluation slice | **Yes** — it is a benchmark, not a behaviour. It needs no users | `READY_NOW`, not started |

**HE-NER-1 is the only one that does not wait on people**, and it is genuinely
available: `docs/MEASUREMENT_HEBREW_ORGS.md` already measures the current
detector at 46% recall against an external corpus, and the transfer supplies a
better benchmark and a mechanism for the miss. It is not being started in this
sweep because it is an engine change with its own measurement design, and this
sweep's licence is UX hierarchy and repository-internal debt. It belongs in its
own piece of work with its own before/after number.

## The E1 boundary, stated because it is the easy mistake

**E1 is preregistered.** Four of the five proposals above are trial
instrumentation, which makes it tempting to fold them into the day-0 and day-14
scripts now that they have been read. **That is exactly the move a
preregistration exists to prevent** — a prediction edited after exposure to
later reasoning resolves to whatever the later reasoning expected.

If an SLP-derived measure is worth adding to the trial, it gets a **dated
amendment or a new experiment identifier** (E5, E6…), recorded as arriving after
E1 was written and after this transfer was read. The original predictions,
exclusions, denominators and failure conditions in `docs/EXPERIMENTS.md` are not
to be rewritten as though they had been there from the start.

Nothing in this file has been added to E1.

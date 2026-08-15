# Scenario Falsification v3

## Question

Does the current Authority Project architecture produce meaningfully different diagnoses, data requests, maps and next actions for materially different users?

If the answer is no, the architecture is generic strategy theater.

---

# Scenario 1 — Strong expert, almost no visibility

## Starting state

An experienced B2B specialist has:

- 12 years of client work;
- strong results;
- several testimonials;
- a repeatable way of working that has never been named;
- weak LinkedIn/profile positioning;
- almost no publishing or public appearances.

Goal: become recognized by a defined buyer audience for the expertise already demonstrated privately.

## Likely diagnosis

Primary gap: **legibility + distribution**, not competence.

Secondary gap: tacit methodology is not yet converted into a recognizable authority asset.

## Highest-value additional data

- representative client cases;
- existing testimonials;
- one or two examples of how the expert approaches problems;
- current public footprint.

No need to begin by asking for more credentials.

## Map shape

Parallel foundation:

```text
Extract methodology ───────┐
                           ├─> flagship authority asset ─> repeated distribution
Build grounded case study ─┘                           └─> selected external stages

Profile positioning ──────────────────────────────────────┘
```

## Highest-leverage initial action

Run a guided methodology extraction from existing cases, because publishing before the expertise becomes legible risks increasing visibility without strengthening the intended association.

## What should NOT be recommended

- "post more" as the first answer;
- collect basic credibility proof already abundant;
- a generic content calendar.

---

# Scenario 2 — High visibility, weak depth/proof

## Starting state

A creator has:

- a large LinkedIn audience;
- frequent posts;
- strong engagement;
- clear personality and point of view;
- few real client outcomes;
- weak external validation;
- no stable methodology.

Goal: become recognized by senior buyers as a credible expert rather than an interesting creator.

## Likely diagnosis

Primary gap: **credibility / depth**, not visibility.

Secondary gap: methodology and proof are underdeveloped relative to reach.

## Highest-value additional data

- real engagements/projects;
- depth of actual practice;
- available external validation;
- which audience segments currently engage versus which ones buy.

## Map shape

```text
Real practice / pilot work
        |
        +--> evidence + external validation
        |
        +--> methodology tested across cases
                    |
                    v
           evidence-backed flagship content
                    |
                    v
             senior-buyer distribution
```

Existing content production can continue selectively, but should not dominate the route.

## Highest-leverage initial action

Identify the narrowest high-value practice area where the creator can build real evidence quickly and credibly.

## What should NOT be recommended

- grow audience first;
- optimize posting frequency;
- turn engagement numbers into an authority score.

---

# Scenario 3 — Salaried manager becoming known for management expertise

## Starting state

A person managed a retail team for several years.

They have:

- no consulting clients;
- no case studies;
- no public methodology;
- real management decisions and repeated experience;
- possibly former colleagues who can corroborate parts of the story.

Goal: become recognized for practical management expertise.

## Likely diagnosis

Primary gap: **translation of experience into transferable methodology and public legitimacy**.

This user is not a "no evidence" user. Their evidence is embedded in experience and may need reconstruction.

## Highest-value additional data

A guided interview about:

- recurring people problems;
- decisions made;
- how new employees were trained;
- conflict resolution;
- performance management;
- what repeatedly worked/failed;
- feedback from team members/managers.

## Map shape

```text
Experience interview
      |
      +--> methodology hypotheses
      |          |
      |          +--> corroborate with examples / people
      |
      +--> distinctive management perspective
                     |
                     v
             publish useful framework
                     |
                     +--> discussion / community participation
                     +--> small real-world advisory/pilot applications
                                   |
                                   v
                              stronger proof
```

## Highest-leverage initial action

Extract and test a management methodology from repeated real decisions before trying to manufacture "client results" that do not exist.

## What should NOT be recommended

- pretend prior employment is third-party proof of consulting ability;
- require a case-study library before the user can start;
- position the person as a proven consultant before such evidence exists.

---

# Scenario 4 — Referral-driven consultant already trusted privately

## Starting state

A consultant receives most work through referrals.

They have:

- steady client work;
- sparse public content;
- several strong referrers;
- unclear understanding of why people refer them;
- inconsistent self-description online.

Goal: make existing private-market reputation legible and scalable beyond the referral network.

## Likely diagnosis

Primary gap: **reputation transfer / codification**, not proof creation from zero.

Secondary gap: public representation may not match the actual reason clients/referrers trust the person.

## Highest-value additional data

- last 5–10 client acquisition paths;
- who referred whom;
- language referrers/clients used;
- what problem they believed the consultant solved;
- testimonials or call transcripts where available.

## Map shape

```text
Referral-path analysis ──> actual perceived identity
                                  |
                                  +--> positioning correction
                                  +--> extract repeated methodology/proof
                                              |
                                              v
                                 public authority assets
                                              |
                                              +--> distribution beyond current network
```

## Highest-leverage initial action

Reconstruct what the market already appears to know the consultant for before deciding what new identity to broadcast.

## What should NOT be recommended

- invent positioning from a blank canvas;
- assume low social visibility means low authority;
- treat referrals as an unstructured channel metric only.

---

# Scenario 5 — Wants authority in a field with little current legitimacy

## Starting state

A professional wants to become an authority in a new field.

They have:

- interest and some transferable experience;
- little direct work in the target field;
- no strong target-field proof;
- no meaningful target-field audience.

Goal: eventually become credibly recognized in the new field.

## Likely diagnosis

Primary gap: **legitimate authority capital**, not packaging.

The system must not optimize appearance ahead of competence/evidence.

## Highest-value additional data

- transferable adjacent experience;
- actual target-field competence;
- existing relationships in the target field;
- realistic opportunities for projects, collaborations, research or contribution;
- exact audience and desired role.

## Map shape

```text
Adjacency / transferable-capital analysis
          |
          +--> credible bridge position
          |        |
          |        +--> learning / contribution / collaboration
          |        +--> real project / pilot / research
          |                       |
          |                       v
          |                  target-field evidence
          |                       |
          +-----------------------+--> stronger positioning
                                      |
                                      v
                              authority distribution
```

## Highest-leverage initial action

Choose a credible bridge from existing capital into the new field and build real target-field work/evidence before claiming established authority.

## What should NOT be recommended

- content volume as a substitute for legitimacy;
- authority language that overstates current position;
- a fast-path promise when the necessary capital does not yet exist.

---

# Falsification result

## PASS — architecture produces different routes

The five cases produce materially different:

- primary gaps;
- data requests;
- route dependencies;
- first actions;
- prohibited actions.

The architecture therefore survives this first internal heterogeneity test.

However, the scenarios expose additional requirements.

---

# New gaps exposed by the scenarios

## GAP 1 — public visibility is not equivalent to authority

Scenario 4 can already have strong private/network reputation while looking weak on LinkedIn.

### Required change

AuthorityGoal / PersonState should distinguish **authority context / surface**, for example:

- referral network;
- selected professional community;
- public digital audience;
- organizational/internal field;
- industry stage/media ecosystem.

The product must not force every journey toward public social-media fame.

---

## GAP 2 — authority capital may need to be built before it can be expressed

Scenario 5 reveals that some maps must contain capability/evidence acquisition, not merely packaging/distribution.

### Required change

AuthorityAction must support foundational actions such as:

- learning;
- real project/pilot;
- collaboration;
- original research;
- contribution;
- obtaining external validation.

---

## GAP 3 — transferability matters

Scenario 3 and 5 require the system to reason about whether experience from one context legitimately transfers to another.

### Required change

AuthorityAsset and StrategicDiagnosis need a transferability boundary:

- directly applicable;
- adjacent / bridgeable;
- weakly transferable;
- not currently justified.

---

## GAP 4 — perceived identity needs observational data

Scenario 4 demonstrates that the user's self-description may be less informative than referral/client language.

### Required change

The initial data model must allow market-language evidence to update `current_public_associations` / `perceived_identity_hypotheses`.

---

## GAP 5 — success criteria must be project-relative

Different scenarios require different authority signals.

Examples:

- target buyers begin making relevant inbound inquiries;
- recognized practitioners invite the person to contribute;
- referrals increasingly use the intended expertise association;
- target-field stages/media begin inviting the person;
- qualified opportunities improve.

### Required change

Do not define one global authority score. Each AuthorityProject needs an explicit observable-signal bundle.

---

# Governance outcome after this test

**CONTINUE.**

The architecture survived the diversity test, but the five new requirements above materially change the data model and journey.

They must be incorporated before moving to FIELD.
# ProofMiner — Recursive Magic-Moment Iteration v1

Date: 2026-08-16
Status: **REPLAN → vertical slice → FIELD**

## Trigger

The current manipulable workspace improved UX/UI but did not yet answer the more important question:

> **Why should a professional use this product rather than a notebook, Notion, a consultant, or a strong ChatGPT conversation?**

This run applies the full `DOD Agent → Pressure Agent → Telos Agent → Tool/Mechanism Agent` loop to the first-session value moment itself.

---

# Round 0 — candidate from prior discussion

Candidate promise:

> Discover what is *really* limiting the user's next professional move and prevent wasted resources.

### Pressure attack

This overclaims epistemic access. In ambiguous strategic environments there may be no uniquely identifiable `real bottleneck`, causal attribution may be underdetermined, and an AI can easily produce a compelling but unsupported root-cause story.

A product that wins by sounding diagnostically certain fails the evidence contract.

**Outcome:** `KILL` as governing formulation.

---

# Round 1 — diagnostic reveal

Candidate mechanism:

```text
USER MODEL
→ COMPETING EXPLANATIONS
→ EVIDENCE
→ REVEAL
→ ALLOCATION DELTA
```

The user states what they think the bottleneck is, the system generates alternatives, and external evidence discriminates between them.

### Pressure attack

This is better, but still asks the user to formulate a diagnosis before the product has created value. It also encourages the system to manufacture a dramatic `X → Y` reframing even when evidence is weak.

A forced surprise is worse than a justified `KEEP`.

**Outcome:** `REPLAN`.

---

# Round 2 — plan as evidence of an implicit theory

Observation:

A resource-using action is not neutral. It normally only pays off under some mechanism hypothesis.

Examples:

- `publish more` spends resources as if exposure / visibility is limiting;
- `rewrite site / positioning` spends resources as if translation / message is limiting;
- `build case study / testimonials` spends resources as if proof / legitimacy is limiting;
- `network / outbound` spends resources as if access is limiting;
- `take another course` spends resources as if capability is limiting;
- `change pricing / packaging` spends resources as if offer architecture is limiting.

The system does **not** infer that the user consciously believes that hypothesis. It states:

> **Your current plan behaves as if this were true.**

This is a contestable system inference, not user-owned state and not market fact.

### Pressure attack

A single action can serve multiple mechanisms. Therefore action → assumption mapping must remain provisional and correctable.

The system may use the action portfolio to identify a *candidate load-bearing bet*, but it cannot silently treat the mapping as truth.

**Outcome:** `SURVIVES WITH CONTESTABILITY`.

---

# Round 3 — is assumption surfacing enough?

Candidate value:

> Surface the hidden assumptions behind the plan.

### Pressure attack

Interesting assumptions do not necessarily change behavior. This can become sophisticated reflection theater.

A reveal earns product surface only when it changes one of:

- whether the current plan should proceed;
- ordering;
- resource allocation;
- evidence request;
- smallest real-world test;
- reversal condition.

**Outcome:** add mandatory decision consequence.

Canonical outcome set:

```text
KEEP
CHANGE
TEST_FIRST
```

No fourth `interesting insight` state.

---

# Round 4 — strongest surviving first-session job

## User-facing job

> **Before I spend scarce time, money or attention on a plausible professional plan, show me what that plan is implicitly betting on, whether that bet is justified enough to act on, and what I should keep, change or test first.**

## Product O contribution

Reduce **avoidable commitment to weakly grounded strategic bets** during consequential professional transitions.

The product does not promise to know the true root cause.

It promises to make the user's current commitment logic inspectable early enough that weak assumptions can be challenged before their cost is paid.

---

# Canonical first-session mechanism — Commitment Gate

```text
1. TRANSITION
   What change are you trying to make?

2. CURRENT PLAN
   What are you actually about to do?

3. RESOURCE EXPOSURE
   What time / money / attention are you about to commit?

4. FREEZE
   Preserve the pre-system plan.

5. IMPLIED BET
   What must be sufficiently true for this allocation to make sense?

6. USER CORRECTION
   Does that interpretation actually fit your reasoning?

7. COMPETING EXPLANATION
   What other mechanism could produce the same current state?

8. EVIDENCE LANDSCAPE
   What currently supports / contradicts / fails to distinguish the bets?

9. DECISION CONSEQUENCE
   KEEP / CHANGE / TEST_FIRST.

10. REVERSAL CONDITION
    What observation would make us change again?

11. FIELD
    Act or run the smallest discriminating test.
```

---

# Candidate magic moment

The desired experience is **not**:

> "The AI knows my real problem."

It is:

> **"I had not noticed that my whole plan was spending resources as if X were already established. Now I can see what would have to be true, what could make it wrong, and what I should do before paying the full cost."**

Example:

```text
TARGET
Move from small-business consulting to organizational consulting.

CURRENT ALLOCATION
16h website
14h LinkedIn
10h webinar
10h reserve

SYSTEM INFERENCE — contestable
40 of 50 planned hours alter message / visibility before obtaining new buyer evidence.

IMPLIED BET
The transition is mainly blocked by how the user is seen / reached,
not by buyer criteria, proof requirements, access, offer fit or another prerequisite.

EVIDENCE STATE
No decision-grade external evidence is yet attached to that bet.

OUTCOME
TEST_FIRST

SMALLEST TEST
Reallocate a bounded amount to evidence that can discriminate message/visibility
from buyer-criteria / proof / access alternatives before committing the remaining hours.
```

The value is the **commitment contradiction**, not a theatrical alternative diagnosis.

---

# DOD Agent — magic-moment gates

A first session passes only if:

1. a real user transition exists;
2. a real intended action / allocation is frozen before system influence;
3. the system identifies at least one candidate load-bearing bet tied directly to those actions / resources;
4. the bet is visibly marked as system inference and can be corrected by the user;
5. at least one plausible competing explanation is considered when it can change action;
6. evidence is shown as supporting / contradicting / non-discriminating / missing rather than collapsed into confidence theater;
7. the output is exactly `KEEP`, `CHANGE` or `TEST_FIRST`;
8. `CHANGE` changes an actual action / sequence / allocation;
9. `TEST_FIRST` specifies the smallest observation capable of discriminating a load-bearing uncertainty;
10. `KEEP` is treated as a successful result when the prior plan survives scrutiny;
11. a reversal condition is explicit;
12. no unsupported root-cause claim is presented as fact.

---

# Pressure Agent — kill tests

Kill or collapse the mechanism if FIELD shows any of the following:

- users already see the same load-bearing bet without the system;
- action → bet inference is wrong often enough to create correction burden greater than value;
- the system increases indecision / analysis paralysis without preventing costly commitments;
- `TEST_FIRST` becomes a reflexive delay mechanism even when action is cheap / reversible;
- a strong simple prompt or advisor produces the same decision consequence with materially less burden;
- users enjoy the reveal but do not change action, test, evidence acquisition or commitment;
- the system creates false causal confidence through polished explanations;
- resource exposure is too small for the avoided-error value to matter;
- users primarily want execution rather than commitment support.

---

# Tool / mechanism agent

The smallest viable mechanism is **not** a full decision canvas.

Minimum first-session objects:

```text
Transition
CurrentAction[]
ResourceExposure
FrozenPlan
ImpliedBet[]
CompetingBet[]
EvidenceRelation[]
DecisionConsequence = KEEP | CHANGE | TEST_FIRST
ReversalCondition
```

Characterization, professional operating models, web research, Wind Tunnel and richer allocation tools are routed **after** this minimum layer, only if required to discriminate the current bet.

---

# UI consequence

The first visual hierarchy should be:

```text
WHAT YOU ARE ABOUT TO DO
↓
WHAT YOUR PLAN IS BETTING ON
↓
WHAT WE ACTUALLY KNOW
↓
KEEP / CHANGE / TEST FIRST
↓
WHAT WOULD REVERSE THIS
```

The workspace remains useful after the reveal, but it is no longer the entry promise.

The primary visual contrast is:

```text
YOUR COMMITMENT     SYSTEM INFERENCE     EVIDENCE / UNKNOWN
```

Never visually merge them.

---

# Research grounding — bounded use

Relevant research supports the **process family**, not product efficacy:

- comparing evidence against explicit hypotheses is a core decision-support problem;
- graphical evidence landscapes can reduce biased evidence selection in ambiguous analytical tasks;
- `consider the opposite / alternative` can reduce some forms of confirmation bias, but effects are contextual;
- cognitive-forcing interventions have mixed empirical results and can feel useful without improving accuracy;
- deliberate reflection and competing-hypothesis review are more defensible than unilateral AI recommendation;
- assumption-based planning and theories of change treat plans as dependent on load-bearing assumptions that can be surfaced and monitored.

None of this validates ProofMiner's commercial or causal value. That remains FIELD.

---

# FIELD design generated by this run

Compare on the same real transition:

### Arm S — Strong Simple

A competent advisor / strong LLM asks goal, options, constraints and recommends next action.

### Arm G — Commitment Gate

Freeze current plan → surface candidate implied bet → user corrects → competing bet → discriminating evidence → `KEEP / CHANGE / TEST_FIRST`.

Primary discriminative questions:

1. Did G expose a load-bearing commitment assumption that S did not?
2. Was the inferred bet accepted / corrected / rejected by the user?
3. Did the reveal change action, allocation, evidence acquisition or test design?
4. Did it prevent or reduce a material commitment that later evidence would have made unnecessary?
5. What extra user effort did G require?
6. Did G increase indecision?
7. Would the user pay for this before making a consequential commitment?

No credit for surprise, depth, elegance or enthusiasm alone.

---

# Recursive closeout

The Pressure Agent can still attack implementation and mapping quality, but the next higher-level attack requires real user behavior:

- whether professionals experience the implied-bet reveal as novel;
- whether it changes commitments;
- whether avoided commitment is economically meaningful;
- whether a simpler advisor produces the same result;
- whether `TEST_FIRST` improves later decisions rather than merely delaying them.

Therefore:

> **Current outcome: REPLAN → implement minimum Commitment Gate vertical slice → FIELD.**

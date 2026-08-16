# Commitment Gate — FIELD Protocol v1

Date: 2026-08-16
Status: pre-registered FIELD protocol for the current vertical slice.

## Question

Does exposing the load-bearing bet implicit in a professional's current plan produce a decision-relevant benefit beyond a strong simple advisory conversation, at justified cognitive cost?

---

# Eligible case

Use a real professional transition where:

1. the person has a desired near-term professional change;
2. they are considering at least two plausible actions or one material commitment;
3. time / money / attention / lock-in is meaningful;
4. they control the commitment;
5. the commitment is not already made irreversibly;
6. a meaningful real action can occur after the session.

Do not select a case merely because it makes the mechanism look good.

---

# Freeze before intervention

Record verbatim before advice:

```text
transition
current explanation if volunteered
planned actions
planned sequence
planned resource allocation
reasons
what would change their mind, if they already have a condition
```

Do not force the user to name a bottleneck if they do not already have one.

---

# Arm S — Strong Simple

A competent advisor / strong LLM receives the same baseline and may:

- clarify goal;
- identify constraints;
- compare options;
- use external evidence when useful;
- recommend what to do next.

Do not deliberately weaken S.

Record S's recommendation and user effort.

---

# Arm G — Commitment Gate

1. infer a candidate load-bearing bet from current action / allocation;
2. show it as `your plan behaves as if...`;
3. ask the user to accept / correct / reject the mapping;
4. consider one competing explanation only if material;
5. map existing evidence as SUPPORTS / CONTRADICTS / NON_DISCRIMINATING / MISSING;
6. obtain targeted external evidence only when it can change the commitment;
7. emit `KEEP / CHANGE / TEST_FIRST`;
8. state reversal condition;
9. record actual allocation / action delta.

---

# Primary observations

Record:

```text
unique_bet_revealed: yes/no
bet_response: accepted/corrected/rejected
unique_vs_S: none / representation / research_question / action / allocation / prevented_error
outcome: KEEP / CHANGE / TEST_FIRST
before_commitment
post_gate_commitment
resource_delta
extra_user_effort
clarification_count
self_reported_indecision_before_after
next_real_action
```

Do not use a composite score.

---

# Follow-up

After the next real action / test, record:

- what actually happened;
- whether the registered reversal condition fired;
- whether the user reverted toward the original plan;
- whether the changed / delayed commitment appears to have saved meaningful resources;
- whether the Gate caused harmful delay;
- whether the user would use / pay for the mechanism before a comparable future commitment.

Outcome evidence does not retroactively prove the inferred mechanism was the one true cause.

---

# Success evidence

The mechanism earns another iteration when it uniquely causes at least one of:

- a material action / allocation change that Strong Simple missed;
- a smaller discriminating test replacing a substantially larger commitment;
- a robust KEEP with a useful new reversal condition;
- identification of an assumption that later field evidence shows was materially consequential.

At least one such observation is required before investing in richer automation around the Gate.

---

# Kill / collapse evidence

Collapse toward Strong Simple if:

- S repeatedly finds the same commitment-relevant distinction with less effort;
- bet inference is frequently corrected / rejected and creates more burden than value;
- users become more hesitant without improved field learning;
- `TEST_FIRST` delays cheap reversible actions;
- users like the reveal but do not change action / evidence acquisition / commitment;
- avoided commitment is economically trivial;
- primary demand is execution service rather than decision support.

---

# Current highest-value FIELD case

One real eligible professional transition.

Do not broaden the sample before the first case reveals whether the mechanism creates a unique decision-relevant distinction at all.

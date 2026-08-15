# DOD UI Delta — v1 / effective DOD v5.1

Date: 2026-08-16

## Authority

This delta is subordinate to `TELOS_GOVERNANCE.md` and augments `DEFINITION_OF_DONE.md` v5.0.

For interface / first-session work, the effective DOD is **v5.1**.

Read with `UX_STRATEGIC_WIND_TUNNEL_V1.md`.

---

# UI telos

The interface exists to help the user form and own a better consequential professional decision — not to expose the internal architecture, maximize interaction, display sophistication, or collect every field the data model can represent.

It must also preserve the validity of the FIELD experiment by keeping the user's pre-intervention representation / allocation uncontaminated until frozen.

---

# UX gates

## UI1 — The first screen uses buyer language, not system language

The first prompt must allow unprompted description of the professional transition.

**Hard fail:** first-use copy requires understanding `authority`, `Personal Decision Intelligence`, `characterization`, `FIELD_DEBT`, decision frameworks or internal taxonomy.

## UI2 — Baseline is visibly frozen before advice

The interface captures the plan the user would otherwise execute, its rationale and material resource commitment before recommendation / self-application output.

**Hard fail:** any recommendation contaminates this baseline.

## UI3 — One dominant task per screen

A screen exists around one user-state transition, not around the number of fields available in the model.

## UI4 — Characterization is routed, not ceremonial

The professional mirror / self-application step can be skipped and must not imply that the user's profession is the true frame of the problem.

The UI states that it is an **עדשה, לא תשובה**.

## UI5 — No fake field evidence

User-facing source classes remain visibly distinct:

- `ממך`;
- `מהשטח`;
- `מסקנה`;
- `השערה לבדיקה`.

**Hard fail:** synthetic / inferred content appears as buyer or market observation.

## UI6 — Decision output is action-oriented, not report-oriented

Primary decision view must distinguish at least:

- `לעשות עכשיו`;
- `לא עכשיו`;
- `לברר לפני שמחליטים`.

The interface may later expand to the canonical allocation states, but it must not require the user to parse a consulting report before knowing what changes.

## UI7 — KEEP is a valid result

The interface must not manufacture novelty or a larger delta to demonstrate value.

If the prior plan survives the available evidence, preserving it with clearer conditions is a valid output.

## UI8 — Uncertainty has a first-class visual state

`לברר לפני שמחליטים` is not an error or missing feature.

Every research request shown there must be capable of changing a live decision.

## UI9 — Reversal condition is available at action level

A material recommendation can reveal what evidence would change / reverse it.

## UI10 — User authorship closes the episode

The system's recommendation is not the final record.

The user must be able to state:

- what they will actually do;
- what they reject / change;
- what evidence would make them change course.

**Hard fail:** `Accept recommendation` is treated as authorship.

## UI11 — Progressive disclosure protects cognitive load

Rationale, evidence trace and reversal detail may be hidden behind disclosure controls until requested.

The action consequence must remain visible without opening them.

## UI12 — Dashboard is not first-session default

Persistent dashboards may become useful after longitudinal state exists.

**Fail for current FIELD:** first-use experience opens into an empty / fabricated dashboard requiring historical state the product does not yet possess.

## UI13 — Chat is not the canonical state model

Conversation may support bounded steps, but the system must preserve explicit decision objects / baseline / actions / evidence conditions outside free-form chat history.

## UI14 — Mobile preserves decision hierarchy

On small screens:

1. current decision headline;
2. NOW;
3. NOT YET;
4. LEARN FIRST;
5. rationale / evidence details.

Decorative elements may collapse before decision meaning does.

## UI15 — Preview does not overclaim intelligence

Until automated research / decision intelligence exists, the UI must disclose that the current prototype is experimental / illustrative.

It must not imply that a scripted heuristic is validated market analysis.

---

# Structural acceptance tests

The current prototype passes implementation-level DOD only when all are true:

1. no legacy `ראיה לפני ניסוח` / proof-mining first-session flow remains as the canonical UI;
2. transition input exists before system interpretation;
3. baseline plan exists before recommendation;
4. baseline includes user rationale and at least one resource field;
5. professional mirror is optional;
6. mirror explicitly includes a transferability / lens warning;
7. decision board contains NOW / NOT YET / LEARN FIRST;
8. evidence classes shown in the UI cannot imply synthetic field evidence;
9. action rationale and reversal condition are inspectable;
10. a final authorship step records the user's own commitment / challenge / reversal condition;
11. page metadata no longer describes the obsolete proof-selection product;
12. responsive CSS retains semantic order on mobile;
13. CI/build succeeds;
14. a Vercel Preview exists for the exact implementation commit.

---

# UX FIELD_DEBT

Do not close these with internal review:

1. first-question comprehension / struggling-moment language;
2. baseline completion friction;
3. professional-mirror unique contribution;
4. perceived value of NOT YET;
5. perceived trustworthiness of LEARN FIRST;
6. ability to explain the decision board without coaching;
7. authorship-step value versus friction;
8. value perception strong enough to support the commercial test.

---

# Collapse / replan conditions

Replan the UI when real FIELD shows any repeated pattern:

- users cannot state what decision the product is helping with after the first two screens;
- baseline completion feels disproportionate to expected value;
- professional mirror is described as clever but does not change decision / research;
- users interpret `לא עכשיו` as arbitrary AI veto;
- `לברר` feels like the product refusing to help;
- users simply copy the system commitment rather than authoring one;
- most relevant users actually want execution and the decision workflow adds avoidable friction.

---

# Current outcome

`REPLAN → IMPLEMENT → FIELD`

The legacy v2 proof-selection UI is invalid for the current telos. One progressive-decision prototype is authorized. Additional visual variants are not authorized until this version receives real comprehension / decision evidence.

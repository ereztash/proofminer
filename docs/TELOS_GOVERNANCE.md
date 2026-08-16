# Telos Governance — Governing Rule v1.8

Date: 2026-08-16

## Authority

This document outranks product category, feature set, UX, UI, integrations, commercial model, research plan, simulation, semantic model, implementation plan and Definition of Done.

No current mechanism or delivery surface is protected by implementation effort.

---

# O — end-to-end user telos

The system exists to reduce avoidable loss from consequential professional commitments made under uncertainty, while preserving the user's ability to act quickly when direct action is cheap, reversible and informative.

The desired end state is **not app use**.

It is:

> **When a commitment becomes expensive enough to matter, the user has the smallest decision-relevant capability needed to expose what is being risked, what the commitment relies on, what is known versus inferred, and what future observation would justify reversal — delivered at lower cognitive and workflow cost than the expected loss it helps avoid.**

The product may be an app, plugin, agent, inline check, workflow, API, human service or no software surface at all.

---

# App non-entitlement invariant

> **A standalone application has no default right to exist.**

Always separate:

```text
USER NEED
  ↓
DECISION-SAFETY CAPABILITY
  ↓
BEST TRIGGER / PLACEMENT
  ↓
MINIMUM INTERACTION
  ↓
OPTIONAL APP SURFACE
```

If a general AI, template, host-platform agent, direct field action or human service delivers equivalent commitment value at lower burden, the standalone application must collapse toward that simpler form.

The application is secondary unless FIELD demonstrates that a dedicated manipulation/history surface itself creates unique value.

---

# Indispensability ambition

> **Unskippable by value, skippable by design — at the capability level, not necessarily at the app level.**

The user must always be able to bypass the capability.

The product may not manufacture dependence through lock-in, streaks, anxiety, hidden switching costs, notification pressure, forced waiting or unnecessary approval gates.

The governing behavioral test is:

> **After experiencing real value in one recurring commitment class, a suitable user does not want to make that class of commitment again without the decision-safety capability, regardless of which surface delivers it.**

If removal of the capability produces no compensatory behavior or observable loss, the product is not indispensable.

---

# Category hypothesis

Working capability:

> **Commitment Safety Layer**

Working surface: **unresolved**.

Do not treat `app`, `workspace`, `dashboard`, `plugin`, `agent` or `integration` as the product category until a recurring commitment wedge earns that form.

---

# Wedge-before-app rule

Before expanding the application, prove one recurring commitment class with:

1. material stakes;
2. an observable trigger in one bounded work surface;
3. enough local context to support a useful check;
4. enough recurrence to justify integration / learning;
5. a bounded enough signal horizon to learn from outcomes;
6. pre-commitment state that cannot be cheaply reconstructed later;
7. plausible PASS / MODIFY / PROBE consequences;
8. intervention cost below expected decision value;
9. an advantage over general AI + a simple template;
10. a measurable removal consequence.

If no commitment class passes, kill the software-product hypothesis and retain the capability as service / protocol / agent method.

Current falsification record: `docs/APP_NECESSITY_FALSIFICATION_V1.md`.

---

# Selective support invariant

Most actions should receive no intervention.

The system must minimize both:

- **missed-support error** — acting alone where support would materially improve the commitment;
- **unnecessary-support burden** — interrupting where support cannot justify its cost.

Silence is valid product behavior.

Selective support is not assumed behaviorally neutral; routing must be tested in FIELD.

---

# Temporal integrity invariant

When support is justified, preserve the true pre-influence state before system interpretation and before outcome knowledge contaminates memory.

Distinguish explicitly:

- user statement / action;
- system inference;
- external observation / evidence;
- hypothesis;
- later execution / outcome.

History may support later decisions only while source-linked and contestable.

---

# Intervention outcomes

Every material check terminates in exactly one:

- `PASS` — act;
- `MODIFY` — change scope / sequence / allocation / prerequisite;
- `PROBE` — acquire a smaller discriminating observation before a materially larger commitment.

`PROBE` is prohibited when direct action is cheaper, reversible and at least as informative.

---

# STOP / FIELD

Do not add richer app UI, more canvas objects, more integrations or more simulation merely because they are implementable.

The next justified question is:

> **For which narrow recurring commitment class is the expected loss from acting without this capability meaningful enough that users behaviorally recreate or seek the capability when it is absent?**

Until one class survives, outcome = `FIELD / WEDGE DISCOVERY`, not `BUILD MORE APP`.

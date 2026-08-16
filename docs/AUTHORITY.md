# ProofMiner Authority Constitution

This document defines how ProofMiner decides what the product is allowed to do with a piece of evidence.

The purpose is trust preservation. A weak trace should not become a confident outbound asset just because the interface can generate one. The product should pay short-term friction when that prevents wasted effort, disappointment, or a false sense of authority.

## Product Rule

Every recommendation is classified by:

| Axis | Product question |
| --- | --- |
| Impact | What is the cost if this action is wrong in front of a real client? |
| Reversibility | Can the user undo or revise it before anyone else sees it? |
| Certainty | How much does the current evidence actually support the claim? |
| Sensitivity | Is this a public, client-facing, financial, legal, medical, or personal action? |
| User preference | Has the user already stated the goal and acceptable risk? |
| External context | Does the product need information only the user knows? |

## MVP Levels

| Level | Meaning in ProofMiner | Current product behavior |
| --- | --- | --- |
| R1 | Safe internal computation | score, sort, explain, preserve local state |
| R2 | Reversible internal organization | show evidence inventory and gap diagnosis |
| R3 | Draft for user review | generate a draft from usable evidence only |
| R4 | Explicit human approval or strengthening first | weak evidence routes to source strengthening, not draft generation |
| R5 | User-only decision | publishing, sending to a client, pricing claims, legal/medical/financial claims |

## First Light Gate

First Light is not allowed to promise more than the evidence supports.

- If no proof is found, the user gets a concrete explanation of what is missing.
- If only weak traces are found, the product names that directly and routes to evidence strengthening.
- If usable evidence is found, the product may create a draft, but the draft remains an R3 action: the user approves before anything external happens.

## Operating Principle

The product optimizes for evidence-aligned action, not maximum automation.

The core loop is:

finding -> decision -> allowed action -> result -> learning

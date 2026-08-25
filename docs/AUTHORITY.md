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
| R2 | Reversible internal organization | show evidence inventory and gap diagnosis; model-assisted extraction, which only chooses which passages of the user's own document become units and can be re-run or reverted to deterministic splitting |
| R3 | Draft for user review | generate a draft from evidence that is both usable and relevant to the stated claim |
| R4 | Explicit human approval or strengthening first | weak or mismatched evidence routes to source strengthening, not draft generation |
| R5 | User-only decision | publishing, sending to a client, pricing claims, legal/medical/financial claims |

## First Light Gate

First Light is not allowed to promise more than the evidence supports.

- If no proof is found, the user gets a concrete explanation of what is missing.
- If only weak traces are found, the product names that directly and routes to evidence strengthening.
- If a concrete trace does not match the user's stated claim, the product treats it as R4 even if the trace itself is strong.
- If relevant usable evidence is found, the product may create a draft, but the draft remains an R3 action: the user approves before anything external happens.

## Sending material outside the device

Two actions send the user's material to an external provider, and they are not
the same size. Rewriting sends one draft and the evidence cited under it.
Extraction sends a whole source document. Consent is therefore split: the
extraction switch is nested inside the rewriting one, defaults off, and the
product asks again at the moment a document is about to be sent.

What comes back from extraction is gated before it is stored: a passage is kept
only if it is present verbatim in the document it came from, and what is kept is
that document's characters rather than the model's string. This is the one model
output in the product that is safe without review, because it cannot be anything
other than text the user already wrote.

## Operating Principle

The product optimizes for evidence-aligned action, not maximum automation.

The core loop is:

finding -> decision -> allowed action -> result -> learning

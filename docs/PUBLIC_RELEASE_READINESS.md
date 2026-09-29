# Public Release Readiness

Status: **PUBLIC SOURCE / OSS LICENSE NOT YET VERIFIED**

The source is public. A root open-source license was not found during the 2026-09-29 portfolio audit, so visibility must not be described as an open-source grant until licensing is resolved.

## Public value

ProofMiner is a useful reference for builders working on evidence-grounded authority, reputation, or content systems.

The strongest reusable ideas are:

- separate evidence foundation from visible standing;
- cap output-side standing when the evidence base is thin;
- require every model-extracted proof unit to resolve verbatim to user-supplied source text;
- never let the model score worth;
- distinguish "not catalogued" from "absent";
- preserve provenance through the content-generation loop;
- give the user one next move rather than a dashboard of possibilities.

## Evidence boundary

ProofMiner can verify that a proposed proof span came from supplied text. It cannot verify that the supplied text is true. This distinction must remain explicit in every public description.

## Stranger path

A new reader should be able to:

1. understand the Visibility Gap in under a minute;
2. load sample evidence;
3. see how proof units are extracted and scored;
4. observe the grounding gate reject a fabricated number;
5. understand which calculations are deterministic and which optional model features exist.

Start with `README.md`, then `docs/TELOS.md`, `docs/METHOD.md`, and `docs/ARCHITECTURE.md`.

## Before OSS spotlight

1. **License decision** — add an explicit root license or describe the project as source-visible.
2. **Tiny reproducible demo** — one fixture showing source text -> proof units -> score -> next move.
3. **Contribution guide** — especially around integrity dimensions, grounding invariants, and privacy guarantees.

## Public one-liner

> A local-first system for turning evidence you already own into visible, traceable authority without allowing generated output to outrun its sources.

## Do not claim

- that the evidence supplied by a user is objectively true;
- that the score measures professional worth;
- that model-assisted extraction is required;
- that publishing volume is itself authority.

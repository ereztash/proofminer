# Deployment and production verification

GitHub is the source of truth; Vercel hosts. Nothing here needs a manual deploy.

- Pull requests and pushes to `main` run GitHub Actions CI.
- Feature branches and pull requests get Vercel preview deployments through the
  native Git integration.
- Merges to `main` deploy to Vercel production automatically.
- `vercel.json` configures the project.

## Why the smoke only runs against production

The browser smoke (`.github/workflows/prod-smoke.yml`) runs against the
**production domain only**. Vercel SSO protection covers every deployment URL
except the assigned custom domain, so a preview URL serves the Vercel login page
to a headless browser and every spec fails against an `<h1>Log in to Vercel</h1>`
regardless of what the commit changed. Preview deployments therefore skip the
job rather than failing it.

To check a preview by hand, run the workflow with `base_url` set, or open the
preview in a logged-in browser.

## What the smoke actually asserts

CI proves only that the repository lints, tests and builds. The smoke is the
product gate: it drives a deployed URL the way a person does.

A deployment is not ready for a human decision until the smoke verifies:

1. The first screen renders the expert/consultant fit gate.
2. A choice claim, expected evidence and source material can be entered.
3. First Light renders an allowed action level.
4. Weak material cannot jump straight into a sendable draft.
5. Material that is concrete but unrelated to the stated claim is held at R4
   rather than drafted.

On a `deployment_status` event it also asserts **which commit is being served**,
read from the `<meta name="proofminer-commit">` stamp that `vite.config.js`
writes at build time. See `tests/e2e/deployment-identity.mjs` for the three
outcomes that assertion can reach and why a superseded deployment is a skip
rather than a failure.

## Running it by hand

```bash
PROOFMINER_BASE_URL=https://your-deployment.vercel.app npm run smoke:prod
```

## The decision rule

- CI green means the code is internally coherent.
- Smoke green means the deployed product flow works, on a named commit.
- Neither means "ship". Shipping stays a human decision.

## Rollback — written, **not tested**

`docs/PRODUCTION_READINESS.md` category 8 counts a rollback runbook as missing
because none had been written. This is the procedure. Writing it down is not
testing it, and the category does not move until the drill below has actually
been run.

### What was checked, 28 August 2026

The Vercel deployment list was inspected read-only. Every production build stays
`READY` and addressable at its own immutable URL, so no rebuild is needed to
serve an older commit. **But `isRollbackCandidate` was `true` on exactly two
deployments — the current production and the one immediately before it — and
`false` on every production older than that.**

That is the fact worth knowing before an incident: **the one-click instant
rollback reaches one deployment back.** Going further is a different, slower
operation. Discovering that mid-incident is how a five-minute problem becomes a
thirty-minute one.

### The procedure

1. **Identify what is actually being served.** `curl -s <production-url> | grep
   proofminer-commit`. The page names its own commit; do not infer it from the
   last green pipeline. If it reads `unknown`, the build did not receive a sha
   and that is itself the finding.
2. **Decide which commit should be serving.** Usually the previous merge into
   `main`.
3. **If that is the immediately previous production** — instant rollback in the
   Vercel dashboard, or promote its immutable deployment URL to the alias.
   Seconds, no rebuild.
4. **If it is older than one deployment back**, instant rollback will not reach
   it. Promote that deployment explicitly, or `git revert` the offending merge
   on `main` and let the ordinary pipeline deploy the revert. The revert route
   is slower but leaves `main` and production telling the same story, which
   matters more than the minutes.
5. **Prove it landed** the same way anything else is proved here: the
   `deployment_status` event fires the smoke against the new production commit,
   and `tests/e2e/deployment-identity.mjs` classifies it. A rollback to an
   **older** commit classifies as `stale` and **fails by design** — the
   classifier is asserting that the alias moved backwards, which during a
   deliberate rollback is true and expected. Read the red, do not silence it.
6. **Re-check by hand:** `curl` the stamp again and confirm it names the commit
   you promoted.

### What would prove this works

A drill: deploy a deliberately broken build, observe the smoke go red, roll it
back, and show the alias back on the previous commit with the stamp naming it.

**Not run, and not to be run without the owner's explicit authorisation** — it
puts a knowingly broken build in front of anyone holding the production URL. It
is cheap and it is the only thing that converts this section from a plan into
evidence. Until then category 8 stays at 3/5 on this count.

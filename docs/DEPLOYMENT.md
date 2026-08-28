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

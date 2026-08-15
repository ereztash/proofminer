---
name: vercel-app-builder
description: Build or wire a web application from GitHub to Vercel with GitHub as the source of truth, automatic CI, Preview deployments for branches/PRs, Production deployments from main, and an end-to-end canary that proves the pipeline really works. Use when the user asks to create, publish, deploy, host, or continue developing an app on Vercel, especially when GitHub and Vercel are connected.
---

# Vercel App Builder

## Purpose

Create a durable development pipeline, not a one-off deployment.

The invariant is:

`feature branch -> GitHub CI -> Vercel Preview -> PR -> merge to main -> GitHub CI -> Vercel Production`

GitHub is the source of truth. Vercel is downstream deployment infrastructure.

Do not report the pipeline as complete until it has been proven end to end with a real branch/commit.

## Required inputs

Resolve these from the conversation or connected tools whenever possible instead of asking the user to repeat them:

- GitHub owner/account.
- Repository name or desired app name.
- Existing repository URL, if one already exists.
- Existing Vercel project, if one already exists.
- Production branch; default to `main` only when the repository actually uses `main`.
- Framework/build system from the repository; detect rather than guess.

## Tool prerequisites

Prefer connected GitHub and Vercel apps.

1. Load the relevant GitHub skill before repository/PR publishing work.
2. Load the Vercel API skill before Vercel project/deployment work.
3. Use Vercel native Git integration when available. Do not default to GitHub Actions deployments with long-lived Vercel tokens when native Git integration can provide the same behavior.

## Workflow

### 1. Establish the source of truth

- Inspect the target GitHub repository.
- If no repository exists, create one if the available GitHub tool exposes repository creation. If it does not, ask the user for the single unavoidable manual creation action, then continue automatically.
- Confirm the default/production branch.
- Never create a duplicate repository when an intended repository already exists.

### 2. Keep product and infrastructure changes separable

- Work on a feature branch, not directly on `main`, unless the user explicitly requests otherwise and the change is trivial/safe.
- Keep CI/CD infrastructure changes in a separate PR from substantive product changes when possible.
- This allows infrastructure to be activated without accidentally shipping unfinished product work.

### 3. Add the build gate

Add `.github/workflows/ci.yml` that runs on:

- `pull_request`
- pushes to the production branch

Minimum checks:

1. checkout
2. set up the Node version appropriate for the project
3. syntax/static check when applicable
4. deterministic dependency install (`npm ci` when a lockfile exists; otherwise use the project's package manager correctly)
5. production build

Use concurrency cancellation for superseded commits on the same branch when appropriate.

Do not claim CI works merely because the YAML file exists. Verify that GitHub registered a workflow run and that the build job completed successfully.

### 4. Pin Vercel project configuration in the repository

Add `vercel.json` only when useful for the detected framework/project. Keep it minimal.

For a simple Vite app this generally includes:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "git": {
    "deploymentEnabled": true
  }
}
```

Do not blindly apply this template to Next.js, Nuxt, SvelteKit, monorepos, or projects with custom roots. Detect and adapt.

### 5. Create or identify the Vercel project

- List the user's Vercel teams and projects.
- Reuse an existing intended project instead of creating duplicates.
- If a project must be created, create/deploy it under the correct team and detected framework.
- Record the Vercel project ID and stable production aliases/domains.

### 6. Ensure native Git integration

The desired relationship is:

- Vercel project -> GitHub repository
- Production branch -> repository production branch
- feature branches/PRs -> Preview deployments
- production branch -> Production deployments

If the connected Vercel tools expose Git repository linking, perform it directly.

If they do not expose that write action, give the user only the minimal one-time UI step needed to connect the existing Vercel project to the existing GitHub repository. Do not ask them to create another Vercel project.

After the user reports the link is complete, do not trust the report alone. Prove it with a canary.

### 7. Run the end-to-end canary

Create a harmless branch such as `agent/deployment-canary` from the production branch.

Make a harmless, durable change, preferably documentation (for example `DEPLOYMENT.md`).

Open a PR.

Verify all of the following independently:

1. GitHub CI starts for the branch/PR.
2. GitHub CI completes successfully.
3. Vercel creates a new Preview deployment automatically.
4. Vercel deployment metadata identifies the expected GitHub repo, branch, commit SHA, and PR when available.
5. Fetch the Preview URL and confirm HTTP 200 / expected application HTML.
6. Merge the canary PR only after Preview + CI are healthy.
7. Confirm the merge commit on the production branch starts a new Vercel Production deployment automatically.
8. Confirm that Production deployment reaches `READY`.
9. Confirm Production metadata points to the exact merge commit SHA and reports `source: git` (or equivalent Git source evidence).
10. Confirm CI on the production branch succeeds.

Only then declare the pipeline complete.

### 8. Final state to preserve

The repository should contain, when applicable:

- `.github/workflows/ci.yml`
- `vercel.json`
- a short `DEPLOYMENT.md` or equivalent deployment contract

The Vercel project should have:

- native GitHub repository connection
- correct production branch
- automatic Preview deployments
- automatic Production deployments
- stable production alias/domain

## Non-negotiable checks

- Never say “connected to Vercel” merely because a manual/API deployment succeeded.
- A direct Vercel API deployment does not prove Git integration.
- Never say “automatic” before a new Git commit demonstrably produces a Vercel deployment without a manual deploy call.
- Never confuse a Vercel Preview URL with the stable production domain.
- Never add Vercel tokens/secrets to GitHub unless native Git integration is unavailable and the user explicitly chooses a token-based alternative.
- Never merge substantive product work merely to activate infrastructure.
- Keep deployment configuration versioned in Git wherever possible.

## Output after completion

Report compactly:

- GitHub repository.
- Production branch.
- CI status and what it validates.
- Vercel project ID/name.
- Stable production domain.
- Evidence that Preview automation was tested.
- Evidence that Production automation was tested.
- Any remaining manual dependency, if one genuinely remains.

Do not present configuration intent as verified behavior.

## Reference

For the exact acceptance test used to prove the pipeline, read `references/acceptance-test.md`.
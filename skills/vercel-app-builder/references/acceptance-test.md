# GitHub → Vercel acceptance test

A deployment pipeline is accepted only when every applicable check below is evidenced by live tool output.

## Repository

- [ ] Intended GitHub repository exists and is accessible.
- [ ] Correct production branch identified.
- [ ] CI workflow exists on the production branch.
- [ ] Deployment configuration is versioned in the repository when applicable.

## Pull request / Preview path

- [ ] Create harmless canary branch from production branch.
- [ ] Push harmless commit.
- [ ] Open PR.
- [ ] GitHub Actions registers a run for the exact canary commit SHA.
- [ ] CI build job concludes `success`.
- [ ] Vercel creates a deployment without a manual deploy API/CLI call.
- [ ] Vercel metadata names the expected GitHub repo.
- [ ] Vercel metadata names the expected feature branch.
- [ ] Vercel metadata contains the exact canary commit SHA.
- [ ] Vercel deployment is a Preview/non-production deployment.
- [ ] Preview reaches READY.
- [ ] Preview URL returns HTTP 200 and expected app shell/content.

## Merge / Production path

- [ ] Merge the canary PR after checks pass.
- [ ] Record exact merge commit SHA.
- [ ] GitHub CI starts on the production branch for that SHA.
- [ ] Vercel creates a new deployment automatically from the production branch.
- [ ] Deployment target is production.
- [ ] Vercel metadata contains the exact merge commit SHA.
- [ ] Deployment source is Git/native Git integration.
- [ ] Production reaches READY.
- [ ] Stable production alias/domain points at the new production deployment.
- [ ] GitHub CI on production concludes `success`.

## Failure interpretation

- Preview deploy missing but CI runs: GitHub is wired; Vercel Git integration is not complete or preview deployments are disabled.
- Production deploy missing after merge: check Vercel production branch and Git connection.
- Direct API deployment works but Git deployment does not: do not call the pipeline automatic.
- Vercel deployment exists but metadata has no Git source: treat the Git integration claim as unproven.
- Build succeeds in Vercel but fails in GitHub CI: pipeline is not accepted; reconcile Node/package manager/build configuration.

## Completion statement

Only after all required checks pass may the agent state:

> GitHub is the source of truth; feature branches/PRs automatically produce Vercel Previews, and merges to the production branch automatically produce Vercel Production deployments. The path has been tested end to end with a canary commit.

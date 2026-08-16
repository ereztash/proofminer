# Production Verification

GitHub Actions only proves that the repository can lint, test, and build. ProofMiner also needs a product gate that checks a deployed URL the way a user sees it.

## Contract

A deployment is not ready for a human decision until the production smoke verifies:

1. The first screen renders the expert/consultant fit gate.
2. The user can enter a choice claim, expected evidence, and source material.
3. First Light renders an allowed action level.
4. Weak material cannot jump directly into a sendable draft.

## How To Run

Use any Vercel preview or production URL:

```bash
PROOFMINER_BASE_URL=https://your-deployment.vercel.app npm run smoke:prod
```

The workflow `.github/workflows/prod-smoke.yml` also accepts a manual URL and listens for successful deployment status events.

## Decision Rule

- CI green means the code is internally coherent.
- Production smoke green means the deployed product flow works.
- Neither means "ship" by itself. Shipping remains a human decision.

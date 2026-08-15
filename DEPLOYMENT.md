# Deployment

ProofMiner uses GitHub as the source of truth and Vercel for hosting.

- Pull requests and pushes to `main` run GitHub Actions CI.
- Feature branches and pull requests receive Vercel Preview deployments through the native Git integration.
- Merges to `main` deploy to Vercel Production automatically.
- The Vercel project is configured by `vercel.json`; no manual deploy should be required for normal changes.

This file also serves as a harmless end-to-end deployment canary for verifying the automation chain.

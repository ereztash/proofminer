# Deployment

ProofMiner uses GitHub as the source of truth and Vercel for hosting.

- Pull requests and pushes to `main` run GitHub Actions CI.
- Feature branches and pull requests receive Vercel Preview deployments through the native Git integration.
- Merges to `main` deploy to Vercel Production automatically.
- The Vercel project is configured by `vercel.json`; no manual deploy should be required for normal changes.
- The browser smoke (`prod-smoke.yml`) runs against the **production domain only**. Vercel
  SSO protection covers every deployment URL except the assigned custom/production
  domain, so a preview URL serves the Vercel login page to a headless browser and the
  specs cannot reach the app. Preview deployments therefore skip the job rather than
  failing it. To verify a preview by hand, run the workflow with `base_url` set, or
  open the preview in a logged-in browser.

This file also serves as a harmless end-to-end deployment canary for verifying the automation chain.

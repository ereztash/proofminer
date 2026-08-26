import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';

/**
 * Which commit is this?
 *
 * Vercel sets `VERCEL_GIT_COMMIT_SHA`; GitHub Actions sets `GITHUB_SHA`. Local
 * builds fall back to git. `unknown` is a real answer and is emitted rather
 * than guessed, because a build identity that is sometimes invented is worse
 * than one that admits it does not know.
 */
function resolveCommit() {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
  if (fromEnv?.trim()) return fromEnv.trim();
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return 'unknown';
  }
}

/**
 * Stamp the built page with the commit it was built from.
 *
 * Without this there is no way, from outside, to tell which commit a
 * deployment is serving — so "the exact deployed commit passed its smoke test"
 * was not a claim anybody could check, including the smoke test itself. The
 * asset hash does not answer it: two commits that do not change the bundle
 * produce the same hash, and a bundle that differs tells you only *that* it
 * differs.
 *
 * This is a build-time constant in the served HTML. It makes no request, reads
 * nothing about the visitor, and names a commit in a public repository, so it
 * costs nothing against the pledge on screen 0.
 */
function buildIdentity() {
  const commit = resolveCommit();
  return {
    name: 'proofminer-build-identity',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.replace(
          '</head>',
          `  <meta name="proofminer-commit" content="${commit}" />\n  </head>`,
        ),
    },
  };
}

export default defineConfig({
  plugins: [buildIdentity()],
});

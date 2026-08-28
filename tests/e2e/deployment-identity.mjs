/**
 * What claim may a smoke run make about the commit it just read off the alias?
 *
 * The smoke reads a public alias — `proofminer-gamma.vercel.app` — because the
 * immutable per-deployment URL is behind Vercel SSO and a headless browser
 * cannot see it. An alias serves one deployment at a time, so "the deployed app
 * passed" and "*this commit* passed" are different claims, and the gap between
 * them has three shapes, not two:
 *
 * - **match** — the alias serves the commit this run was fired for. The only
 *   case in which the run may say the commit is live.
 * - **superseded** — the alias serves a commit that is strictly newer on the
 *   default branch. Two merges seconds apart do this: the older deployment's
 *   `deployment_status` event fires after the alias has already moved on. That
 *   deployment is not broken, and the commit that replaced it gets its own
 *   smoke run. Failing here would put the default branch red for a non-defect,
 *   and a check that cries wolf is a check nobody reads.
 * - **stale** — the alias serves something else: an older commit, a rollback,
 *   an unrelated build. That is the failure this assertion exists to catch.
 *
 * The distinction is an ancestry question, so the workflow answers it with git
 * — `git rev-list <deployed>..origin/<default>` — and passes the answer in.
 *
 * **Everything unproven is `stale`.** An empty or malformed list of newer
 * commits, a truncated sha, a git step that failed: every one of them lands on
 * the failing branch rather than the skipping one. The way this check could
 * quietly stop meaning anything is by widening `superseded` until it swallows
 * `stale`, so nothing but an exact 40-hex sha in the list can widen it.
 */

const FULL_SHA = /^[0-9a-f]{40}$/u;

/** Exact shas only: a prefix, a branch name or a stray word cannot widen the skip. */
export function parseCommitList(raw) {
  return new Set(
    String(raw ?? '')
      .trim()
      .split(/\s+/u)
      .filter((token) => FULL_SHA.test(token)),
  );
}

/**
 * @returns {'unasserted'|'unidentified'|'match'|'superseded'|'stale'}
 */
export function classifyDeployment({ served, expected, newer }) {
  if (!expected) return 'unasserted';
  if (!served || served === 'unknown') return 'unidentified';
  if (served === expected) return 'match';
  const known = newer instanceof Set ? newer : parseCommitList(newer);
  return known.has(served) ? 'superseded' : 'stale';
}

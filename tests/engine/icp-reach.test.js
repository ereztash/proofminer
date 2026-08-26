/**
 * How many populations this product actually serves.
 *
 * `README.md` described an ICP of two — somebody establishing as independent
 * *or* somebody trying to get hired. `docs/UX.md` carried a section called
 * *"Two tracks, because the ICP is two populations"* with a four-row table of
 * what the track changes. `docs/TELOS.md` and `docs/MARKET.md` treated dropping
 * the second half as an open decision with three supporting arguments, weighty
 * enough to be left to the owner.
 *
 * **There is one population, and there has been from the start.** The only
 * write to `profile.track` anywhere in this codebase is the literal
 * `'independent'`. Onboarding never asks. Of the four differences `UX.md`
 * tabulated, one exists: the archetype weight table. There is no
 * track-dependent conversion vocabulary, no track-dependent surface, and the
 * urgency register reads the same field either way. Neither i18n bundle holds a
 * single job-track string.
 *
 * **What that changes is not the code but a decision.** The ICP cut looked like
 * a product amputation and is a documentation correction: there is nothing
 * shipped to cut. Recorded here rather than only in prose, because prose is
 * what got this wrong for as long as it was wrong.
 *
 * `tests/engine/authority.test.js` proves the weight table works by building
 * the state by hand. It passes, and it says nothing about what a user can
 * reach — the same shape as every other blind spot this repository has turned
 * up: a green test standing in for a capability nobody can get to.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TRACKS, emptyState, normalizeState } from '../../src/core/schema.js';

const SOURCES = [
  'src/ui/app.js',
  'src/ui/views/onboarding.js',
  'src/engine/gaps.js',
  'src/engine/authority.js',
  'src/core/schema.js',
];

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');

describe('the track a user can actually be on', () => {
  it('is never written as anything but independent', () => {
    // A source scan, deliberately: the claim is about *reachability*, and no
    // amount of calling functions proves that nothing anywhere assigns a value.
    // Comments are stripped first so the notes explaining this do not match it.
    const assignments = [];
    for (const rel of SOURCES) {
      const code = read(rel)
        .replace(/\/\*[\s\S]*?\*\//gu, '')
        .replace(/^\s*\/\/.*$/gmu, '');
      for (const [match] of code.matchAll(/\.track\s*=\s*'([^']*)'/gu)) {
        assignments.push(`${rel}: ${match.trim()}`);
      }
    }
    expect(assignments).toEqual(["src/ui/app.js: .track = 'independent'"]);
  });

  it('starts as independent on a fresh state', () => {
    expect(emptyState().profile.track).toBe('independent');
  });

  it('still round-trips an imported backup that carries the other one', () => {
    // The branch is inert, not forbidden. A state that arrives carrying `job`
    // keeps it, because silently rewriting a field the user's own file
    // contained is the behaviour this schema refuses everywhere else.
    const imported = normalizeState({ profile: { track: 'job' } });
    expect(imported.profile.track).toBe('job');
    expect(TRACKS).toContain('job');
  });

  it('has no job-track copy in either bundle to reach', () => {
    // The four differences `UX.md` tabulated needed strings, and three of them
    // never had any. If job-track copy is ever added, this fails and whoever
    // adds it has to say which of the four they are actually building.
    for (const bundle of ['src/i18n/he.js', 'src/i18n/en.js']) {
      const keys = [...read(bundle).matchAll(/^\s*(job|jobTrack|seeking)\s*:/gmu)];
      expect(keys.map((k) => `${bundle}:${k[1]}`)).toEqual([]);
    }
  });
});

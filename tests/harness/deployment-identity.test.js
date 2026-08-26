/**
 * The rule that decides whether a production smoke run may say a commit is
 * live — held to the failure it was written to prevent.
 *
 * The smoke gained a real assertion when the build started stamping its commit
 * into the served page, and the first time that assertion ever fired in
 * production it fired on a **non-defect**: two merges landed seconds apart, the
 * older deployment's `deployment_status` event arrived after the alias had
 * already moved on, and the run went red reporting that the alias was serving
 * a commit newer than the one it was fired for. The newer commit's own run
 * passed a second later.
 *
 * So the rule grew a third outcome. The danger in a third outcome is obvious
 * and is the whole subject of this file: **`superseded` is a skip, and a skip
 * that widens by accident silently deletes the assertion.** Every case below
 * exists to hold that boundary — an empty list, a truncated sha, a prefix, a
 * rollback to an older commit. All of them must land on `stale`, which fails.
 *
 * This is a test of the test harness rather than of the product, which is why
 * it sits in its own vitest project: nothing here imports `src/`.
 */

import { describe, expect, it } from 'vitest';
import { classifyDeployment, parseCommitList } from '../e2e/deployment-identity.mjs';

const OLD = '242880effc28f63e78799a6fd008241991b38b8a';
const NEW = 'ce69ac1ae086dd1a9e3f989671d19993e197e7e6';
const OTHER = '5bb00f2570000000000000000000000000000000';

describe('what a smoke run may claim about the commit it read', () => {
  it('says match only when the alias serves the commit the run was fired for', () => {
    expect(classifyDeployment({ served: NEW, expected: NEW, newer: '' })).toBe('match');
  });

  it('says superseded when the alias has moved on to a strictly newer commit', () => {
    // The exact event of 2026-08-26 16:29 UTC: fired for the merge of #25,
    // read the merge of #26 off the alias.
    expect(classifyDeployment({ served: NEW, expected: OLD, newer: `${NEW} ${OTHER}` })).toBe(
      'superseded',
    );
  });

  it('says stale when the alias serves a commit that is not newer', () => {
    // A rollback, or an alias that never moved. This is the case the assertion
    // exists for and it must never be skipped.
    expect(classifyDeployment({ served: OLD, expected: NEW, newer: `${OTHER}` })).toBe('stale');
  });

  it('says stale when nothing proves the served commit is newer', () => {
    // The git step failed, or ran on an event that does not compute the list.
    // Unproven is not permission: without evidence, a mismatch fails.
    for (const newer of ['', '   ', undefined, null]) {
      expect(classifyDeployment({ served: NEW, expected: OLD, newer })).toBe('stale');
    }
  });

  it('does not accept a prefix, a branch name or a stray word as a commit', () => {
    // `includes` on a joined string would pass the first of these, and passing
    // it would mean the skip could be widened by a short abbreviation appearing
    // anywhere in the list.
    for (const junk of [NEW.slice(0, 7), 'main', 'origin/main', `${NEW}x`, NEW.toUpperCase()]) {
      expect(classifyDeployment({ served: NEW, expected: OLD, newer: junk })).toBe('stale');
    }
  });

  it('keeps only full shas when parsing the list', () => {
    expect([...parseCommitList(`${NEW}\n${OLD}\n\nnot-a-sha ${NEW.slice(0, 7)}`)]).toEqual([
      NEW,
      OLD,
    ]);
    expect(parseCommitList(undefined).size).toBe(0);
  });

  it('asserts nothing when the run was not fired for a known commit', () => {
    // A manual run points at an arbitrary URL; a push fires before Vercel has
    // finished building. Both report the served commit without ruling on it.
    expect(classifyDeployment({ served: NEW, expected: '', newer: '' })).toBe('unasserted');
    expect(classifyDeployment({ served: NEW, expected: undefined, newer: '' })).toBe('unasserted');
  });

  it('separates "the page carries no identity" from "the wrong identity"', () => {
    // `unknown` is what the build emits when it cannot resolve a commit, and a
    // page with no stamp at all is the pre-stamp bundle. Neither is a mismatch
    // to be reasoned about; the spec fails them on their own assertions before
    // this rule is consulted.
    for (const served of ['unknown', null, undefined, '']) {
      expect(classifyDeployment({ served, expected: NEW, newer: '' })).toBe('unidentified');
    }
  });

  it('accepts a prepared Set as well as the raw environment string', () => {
    // The spec parses once at module load and passes the Set in; the workflow
    // passes a string. Both must mean the same thing.
    expect(
      classifyDeployment({ served: NEW, expected: OLD, newer: parseCommitList(`${NEW} ${OTHER}`) }),
    ).toBe('superseded');
  });
});

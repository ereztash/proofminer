/**
 * The appendix has to match the code.
 *
 * `docs/METHOD.md` opens by promising that every number the product shows a
 * user is derivable from what is written there, and keeps an appendix of every
 * constant so the promise can be kept. `docs/TELOS.md` names this as the one
 * part of readiness that is **"a discipline held by hand"** with no test behind
 * it — and it broke the same day it was written down, in three places at once,
 * within two hours of a constant changing.
 *
 * So it is no longer held by hand. If a constant moves in the code and not in
 * the appendix, this fails and names it.
 *
 * **What this cannot catch, stated plainly:** a brand-new constant added to the
 * code and never written into the appendix at all. Not every exported value is
 * shown to a user — `MAX_SPAN` and `FOLD_CHARS` are internal — so there is no
 * mechanical rule that separates the two, and inventing one would fail honestly
 * written code. That half stays a discipline. This half does not.
 */

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { LIEBIG_GATE, STARTED, DEVELOPED, GAP_THRESHOLD, MEASURED_FOUNDATION, LOW_CONFIDENCE } from '../../src/engine/authority.js';
import { BAND_STRONG, BAND_USABLE, DECAY_FLOOR, HALF_LIFE_DAYS } from '../../src/engine/score.js';
import { COVERAGE_CEILING, MAGNITUDE_ONLY_DISCOUNT, SPARSE_MAGNITUDE } from '../../src/engine/gaps.js';
import { MAX_RETRIEVALS, MAX_RECIPIENT_CHARS } from '../../src/engine/recall.js';
import {
  MIN_OBSERVATIONS,
  SHRINKAGE_K,
  CONFIDENT_OBSERVATIONS,
  MAX_WEIGHT_DRIFT,
  COMPOUND_THRESHOLD,
  COMPOUND_MIN_ENGAGEMENT,
} from '../../src/engine/feedback.js';

const METHOD = fs.readFileSync(
  path.join(process.cwd(), 'docs/METHOD.md'),
  'utf8',
);

/** The appendix row whose first cell matches, with its value cell returned raw. */
function appendixValue(label) {
  const rows = METHOD.split('\n').filter((l) => l.startsWith('|'));
  const row = rows.find((l) => {
    const first = l.split('|')[1] ?? '';
    return first.replace(/`/g, '').trim() === label;
  });
  if (!row) throw new Error(`no appendix row labelled "${label}"`);
  return (row.split('|')[2] ?? '').replace(/`/g, '').trim();
}

describe('every constant the appendix publishes', () => {
  it('matches the code, one number at a time', () => {
    const scalars = [
      ['LIEBIG_GATE', LIEBIG_GATE],
      ['MEASURED_FOUNDATION', MEASURED_FOUNDATION],
      ['LOW_CONFIDENCE', LOW_CONFIDENCE],
      ['DECAY_FLOOR', DECAY_FLOOR],
      ['MAGNITUDE_ONLY_DISCOUNT', MAGNITUDE_ONLY_DISCOUNT],
    ];
    for (const [label, value] of scalars) {
      expect(appendixValue(label), `${label} drifted`).toBe(String(value));
    }
  });

  it('matches the code where the appendix pairs two on a line', () => {
    const pairs = [
      ['BAND_STRONG / BAND_USABLE', [BAND_STRONG, BAND_USABLE]],
      ['STARTED / DEVELOPED / GAP_THRESHOLD', [STARTED, DEVELOPED, GAP_THRESHOLD]],
      ['MIN_OBSERVATIONS / SHRINKAGE_K / CONFIDENT_OBSERVATIONS',
        [MIN_OBSERVATIONS, SHRINKAGE_K, CONFIDENT_OBSERVATIONS]],
      ['MAX_RETRIEVALS / MAX_RECIPIENT_CHARS', [MAX_RETRIEVALS, MAX_RECIPIENT_CHARS]],
    ];
    for (const [label, values] of pairs) {
      const published = appendixValue(label).split('/').map((v) => v.trim());
      expect(published, `${label} drifted`).toEqual(values.map(String));
    }
  });

  it('matches the code for MAX_WEIGHT_DRIFT, which the appendix states alone', () => {
    expect(appendixValue('MAX_WEIGHT_DRIFT')).toBe(String(MAX_WEIGHT_DRIFT));
  });

  it('matches the code for the two compounding gates', () => {
    const published = appendixValue('COMPOUND_THRESHOLD / COMPOUND_MIN_ENGAGEMENT / min impressions')
      .split('/').map((v) => v.trim());
    expect(published.slice(0, 2)).toEqual([String(COMPOUND_THRESHOLD), String(COMPOUND_MIN_ENGAGEMENT)]);
  });

  it('matches the code for every half-life, by proof kind', () => {
    // "credential 1460, experience 1095, outcome 730, media 540, event 365, traction 180"
    const published = Object.fromEntries(
      appendixValue('half-lives').split(',').map((part) => {
        const [kind, days] = part.trim().split(/\s+/);
        return [kind, Number(days)];
      }),
    );
    expect(published).toEqual(HALF_LIFE_DAYS);
  });

  it('matches the code for every coverage threshold', () => {
    // "45 default; ORIGIN 30, METHOD 40, CREDENTIAL 38, FAILURE 42" — this is
    // the row that went stale, so it is checked archetype by archetype.
    const raw = appendixValue('coverage thresholds');
    const [fallback, named] = raw.split(';');
    expect(Number(fallback.trim().split(/\s+/)[0]), 'default threshold').toBe(BAND_USABLE);
    const published = Object.fromEntries(
      named.split(',').map((part) => {
        const [archetype, value] = part.trim().split(/\s+/);
        return [archetype, Number(value)];
      }),
    );
    expect(published).toEqual(COVERAGE_CEILING);
  });

  it('matches the code for the sparse-magnitude gate', () => {
    const published = appendixValue('SPARSE_MAGNITUDE / sample floor').split('/')[0].trim();
    expect(Number(published)).toBe(SPARSE_MAGNITUDE);
  });
});

/**
 * The journey clock JF1 reads is already in the state, and stays there.
 *
 * `docs/JOURNEY_FRICTION.md` concludes **NEW INSTRUMENTATION REQUIRED: NO**,
 * and the load-bearing half of that conclusion is a measurement rather than an
 * argument: every stage transition JF1 needs a time for is already stamped by
 * the product, so an event ledger would be recording a second copy of
 * something the participant's own device already holds.
 *
 * `minedAt − createdAt` *is* time-to-First-Light. `retrievals[].askedAt` and
 * `closedAt` are the errand's two outside-world states. If any of them stops
 * surviving a round trip through storage — dropped in a refactor, or reset to
 * `Date.now()` on load, which is the failure `normalizeState` is most likely to
 * introduce while looking correct — the audit's conclusion quietly becomes
 * false and nothing else in this suite would say so.
 *
 * This does not test that the numbers mean anything. It tests that they are
 * still the numbers the app wrote.
 */

import { describe, expect, it } from 'vitest';
import { createStore, loadState } from '../../src/core/store.js';
import { normalizeState } from '../../src/core/schema.js';

/** Distinct, recognisable and in the past, so a reset to "now" is visible. */
const T = {
  opened: 1_750_000_000_000,
  pasted: 1_750_000_060_000,
  mined: 1_750_000_075_000,
  proof: 1_750_000_075_100,
  drafted: 1_750_000_600_000,
  published: 1_750_000_900_000,
  errand: 1_750_000_120_000,
  asked: 1_750_000_180_000,
  closed: 1_750_400_000_000,
  measured: 1_750_500_000_000,
  noInbound: 1_750_600_000_000,
};

const walked = () => ({
  version: 2,
  createdAt: T.opened,
  locale: 'he',
  profile: { onboarded: true, sawFirstLight: true, noInboundAt: T.noInbound },
  playLog: { VALIDATION: T.errand },
  sources: [
    { id: 'src_1', name: 'a', text: 'ירדנו מ-19 יום ל-7 ימים.', demo: false, addedAt: T.pasted, minedAt: T.mined },
  ],
  proofs: [
    { id: 'prf_1', sourceId: 'src_1', claim: 'ירדנו מ-19 יום ל-7 ימים.', score: 62, createdAt: T.proof },
  ],
  artifacts: [
    { id: 'art_1', proofIds: ['prf_1'], body: 'x', status: 'published', createdAt: T.drafted, publishedAt: T.published },
  ],
  retrievals: [
    { id: 'rtv_1', recipient: 'רונית', about: 'הפרויקט', createdAt: T.errand, askedAt: T.asked, closedAt: T.closed },
  ],
  receptions: [{ id: 'rcp_1', artifactId: 'art_1', impressions: 900, capturedAt: T.measured }],
});

/** Every timestamp the audit reconstructs a stage transition from. */
const clock = (s) => ({
  'state.createdAt': s.createdAt,
  'sources[0].addedAt': s.sources[0].addedAt,
  'sources[0].minedAt': s.sources[0].minedAt,
  'proofs[0].createdAt': s.proofs[0].createdAt,
  'artifacts[0].createdAt': s.artifacts[0].createdAt,
  'artifacts[0].publishedAt': s.artifacts[0].publishedAt,
  'retrievals[0].createdAt': s.retrievals[0].createdAt,
  'retrievals[0].askedAt': s.retrievals[0].askedAt,
  'retrievals[0].closedAt': s.retrievals[0].closedAt,
  'receptions[0].capturedAt': s.receptions[0].capturedAt,
  'profile.noInboundAt': s.profile.noInboundAt,
  'playLog.VALIDATION': s.playLog.VALIDATION,
});

const EXPECTED = {
  'state.createdAt': T.opened,
  'sources[0].addedAt': T.pasted,
  'sources[0].minedAt': T.mined,
  'proofs[0].createdAt': T.proof,
  'artifacts[0].createdAt': T.drafted,
  'artifacts[0].publishedAt': T.published,
  'retrievals[0].createdAt': T.errand,
  'retrievals[0].askedAt': T.asked,
  'retrievals[0].closedAt': T.closed,
  'receptions[0].capturedAt': T.measured,
  'profile.noInboundAt': T.noInbound,
  'playLog.VALIDATION': T.errand,
};

/** localStorage stand-in; the engine project runs in node. */
function memoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

describe('the journey clock JF1 reads', () => {
  it('survives normalisation unchanged', () => {
    expect(clock(normalizeState(walked()))).toEqual(EXPECTED);
  });

  it('survives a write and a reload', () => {
    const storage = memoryStorage();
    createStore(walked(), storage).flush();
    expect(clock(loadState(storage))).toEqual(EXPECTED);
  });

  it('does not restamp the first-open time on a later update', () => {
    // `createdAt` is the only stamp that is not written beside the event it
    // describes, so it is the one a later `store.update` could silently reset.
    // It is the left-hand side of time-to-First-Light.
    const store = createStore(walked(), memoryStorage());
    store.update((draft) => {
      draft.sources.push({ id: 'src_2', name: 'b', text: 'עוד חומר.', demo: false, addedAt: T.closed });
    });
    expect(store.get().createdAt).toBe(T.opened);
  });

  it('keeps an errand that was never sent distinguishable from one that was', () => {
    // `null` and a timestamp are different observations — PREPARED against
    // INITIATED. A normaliser that coerced the first to a number would make
    // every drafted errand look sent.
    const unsent = normalizeState({
      ...walked(),
      retrievals: [{ id: 'rtv_2', recipient: 'דנה', about: 'הפרויקט', createdAt: T.errand }],
    });
    expect(unsent.retrievals[0].askedAt).toBeNull();
    expect(unsent.retrievals[0].closedAt).toBeNull();
    expect(unsent.retrievals[0].createdAt).toBe(T.errand);
  });

  it('keeps a source that has never been mined distinguishable from one that has', () => {
    // `minedAt: null` is what `nextMove` reads to say a source is waiting, and
    // it is the right-hand side of time-to-First-Light.
    const unmined = normalizeState({
      ...walked(),
      sources: [{ id: 'src_3', name: 'c', text: 'טקסט.', demo: false, addedAt: T.pasted }],
    });
    expect(unmined.sources[0].minedAt).toBeNull();
    expect(unmined.sources[0].addedAt).toBe(T.pasted);
  });
});

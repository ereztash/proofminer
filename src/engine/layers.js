/**
 * The six layer scorers (docs/METHOD.md).
 *
 * Every scorer returns `{ score, confidence, inputs, locked }`.
 *
 * `confidence` is not decoration. A layer computed from two data points must
 * not be presented with the same authority as one computed from thirty, and
 * `locked: true` means "no data yet" — which the UI renders as *not started*,
 * never as *failing*. Showing a newly unemployed person six red zeros is the
 * fastest way to lose them, and it would also be dishonest: absence of
 * evidence about a layer is not evidence of a bad layer.
 */

import { DAY_MS, clamp100, mean, saturate, sortByDesc } from '../core/util.js';
import { decayedScore } from './score.js';
import { realProofs } from './mine.js';
import { coverageScore } from './gaps.js';
import { scorePositioning } from './positioning.js';

/** Commitment weight per conversion type. */
export const CONVERSION_WEIGHT = {
  reply: 1, dm: 1, call: 3, interview: 5, proposal: 6, offer: 9, deal: 10,
};

/** Recognition weight — being invited outranks being mentioned. */
export const RECOGNITION_WEIGHT = {
  endorsement: 1, citation: 2, referral: 3, feature: 4, invite: 4,
};

const locked = (reason) => ({ score: 0, confidence: 0, inputs: {}, locked: true, reason });

/**
 * L1 — PROOF. What evidence do you actually hold?
 * Three parts: how much, how good, and how complete the case is.
 */
export function layerProof(state, now = Date.now()) {
  const proofs = realProofs(state);
  if (!proofs.length) return locked('no-proofs');

  const scores = sortByDesc(
    proofs.map((p) => decayedScore(p, now)),
    (v) => v,
  );
  // Quality is the mean of the top 10, not of everything: a user is judged on
  // their best evidence, and mining a long CV should not dilute the score.
  const quality = mean(scores.slice(0, 10));
  const volume = saturate(proofs.length, 12);
  const coverage = coverageScore(state, now);

  const score = clamp100(0.5 * quality + 0.2 * volume + 0.3 * coverage);
  return {
    score,
    confidence: Math.min(1, proofs.length / 8),
    locked: false,
    inputs: {
      count: proofs.length,
      quality: Math.round(quality),
      volume: Math.round(volume),
      coverage: Math.round(coverage),
      strongCount: scores.filter((s) => s >= 75).length,
    },
  };
}

/** L2 — POSITION. What single claim do you own? */
export function layerPosition(state) {
  const result = scorePositioning(state.positioning);
  if (result.confidence === 0) return locked('no-positioning');
  return {
    score: result.score,
    confidence: result.confidence,
    locked: false,
    inputs: { components: result.components, issues: result.issues.length },
  };
}

/**
 * L3 — ARTIFACT. What have you put into the world?
 * The opinionated part is `groundedness`: publishing that is not tied to a
 * proof unit does not raise standing in this model.
 */
export function layerArtifact(state, now = Date.now()) {
  const published = (state.artifacts || []).filter(
    (a) => a.status === 'published' && Number.isFinite(a.publishedAt),
  );
  if (!published.length) return locked('nothing-published');

  const windowStart = now - 56 * DAY_MS; // trailing 8 weeks
  const recent = published.filter((a) => a.publishedAt >= windowStart);
  const perWeek = recent.length / 8;
  // Saturating at ~3/week: this product is not trying to turn a consultant
  // into a daily poster, and rewarding volume past that point would be
  // rewarding the behaviour the telos rejects.
  const cadence = saturate(perWeek, 0.75, 100);

  const grounded = published.filter((a) => a.proofIds.length > 0).length;
  const groundedness = (grounded / published.length) * 100;

  const formats = new Set(published.map((a) => a.channel)).size;
  const mix = saturate(formats, 2);

  const score = clamp100(0.4 * cadence + 0.45 * groundedness + 0.15 * mix);
  return {
    score,
    confidence: Math.min(1, published.length / 6),
    locked: false,
    inputs: {
      published: published.length,
      recent: recent.length,
      perWeek: Number(perWeek.toFixed(2)),
      groundedness: Math.round(groundedness),
      formats,
    },
  };
}

/**
 * Reception score for a single artifact, relative to the user's own baseline.
 * Absolute engagement numbers are meaningless across audience sizes and would
 * tell a 400-connection user they are failing while they outperform a
 * 20,000-connection account.
 */
export function receptionScore(reception, baseline) {
  const impressions = Math.max(reception.impressions, 1);
  // Weighted by cost to the reader: a substantive comment is expensive,
  // a reaction is nearly free.
  const weighted =
    reception.substantiveComments * 6 +
    (reception.comments - reception.substantiveComments) * 2 +
    reception.saves * 4 +
    reception.shares * 3 +
    reception.reactions * 1;
  const rate = weighted / impressions;
  if (!baseline || baseline <= 0) {
    // No baseline yet: anchor on a modest absolute rate so the first few
    // records still produce a usable number.
    return clamp100(saturate(rate, 0.04, 100));
  }
  // 1.0 = exactly at own baseline -> 55. Above baseline climbs, below drops.
  return clamp100(55 * (rate / baseline) ** 0.7);
}

/** L4 — RECEPTION. How did it land? */
export function layerReception(state, now = Date.now()) {
  const receptions = state.receptions || [];
  if (receptions.length < 1) return locked('no-reception');

  const rates = receptions.map((r) => {
    const impressions = Math.max(r.impressions, 1);
    const weighted =
      r.substantiveComments * 6 +
      (r.comments - r.substantiveComments) * 2 +
      r.saves * 4 +
      r.shares * 3 +
      r.reactions * 1;
    return weighted / impressions;
  });
  const baseline = mean(rates);

  const windowStart = now - 90 * DAY_MS;
  const recent = receptions.filter((r) => r.capturedAt >= windowStart);
  const pool = recent.length ? recent : receptions;
  const score = mean(pool.map((r) => receptionScore(r, baseline)));

  return {
    score: clamp100(score),
    // Below 3 records this is an anecdote, and the UI says so.
    confidence: Math.min(1, receptions.length / 5),
    locked: false,
    inputs: {
      records: receptions.length,
      baseline: Number(baseline.toFixed(4)),
      recent: recent.length,
    },
  };
}

/** L5 — CONVERSION. Who moved? */
export function layerConversion(state, now = Date.now()) {
  const conversions = state.conversions || [];
  if (!conversions.length) return locked('no-conversions');

  const windowStart = now - 90 * DAY_MS;
  const recent = conversions.filter((c) => c.at >= windowStart);
  const weight = recent.reduce((sum, c) => sum + (CONVERSION_WEIGHT[c.type] || 1), 0);
  const score = saturate(weight, 18);

  const best = recent.reduce(
    (max, c) => Math.max(max, CONVERSION_WEIGHT[c.type] || 1),
    0,
  );

  return {
    score: clamp100(score),
    confidence: Math.min(1, recent.length / 4),
    locked: false,
    inputs: {
      total: conversions.length,
      recent: recent.length,
      weight,
      deepest: best,
    },
  };
}

/** L6 — RECOGNITION. Who vouches for you? */
export function layerRecognition(state, now = Date.now()) {
  const recognitions = state.recognitions || [];
  if (!recognitions.length) return locked('no-recognition');

  // Recognition decays: being cited two years ago is weaker standing than
  // being cited last month, but never worthless.
  const weight = recognitions.reduce((sum, r) => {
    const ageDaysValue = Math.max(0, (now - r.at) / DAY_MS);
    const decay = 0.4 + 0.6 * 0.5 ** (ageDaysValue / 540);
    return sum + (RECOGNITION_WEIGHT[r.type] || 1) * decay;
  }, 0);

  return {
    score: clamp100(saturate(weight, 8)),
    confidence: Math.min(1, recognitions.length / 3),
    locked: false,
    inputs: {
      total: recognitions.length,
      weight: Number(weight.toFixed(2)),
      types: [...new Set(recognitions.map((r) => r.type))],
    },
  };
}

/** Compute all six layers at once. */
export function computeLayers(state, now = Date.now()) {
  return {
    L1: layerProof(state, now),
    L2: layerPosition(state),
    L3: layerArtifact(state, now),
    L4: layerReception(state, now),
    L5: layerConversion(state, now),
    L6: layerRecognition(state, now),
  };
}

export const LAYER_KEYS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

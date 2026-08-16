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

import { DAY_MS, clamp100, mean, round, saturate, sortByDesc } from '../core/util.js';
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
  const result = scorePositioning(state.positioning, state.recognitions || []);
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
  const demoProofIds = new Set(
    (state.proofs || []).filter((p) => p.demo).map((p) => p.id),
  );
  const published = (state.artifacts || []).filter(
    (a) =>
      a.status === 'published' &&
      Number.isFinite(a.publishedAt) &&
      // Publishing bundled fixtures used to raise L3 to 74 and flip the
      // diagnosis, with the demo banner already gone because a real proof
      // existed elsewhere in the inventory.
      !a.proofIds.some((id) => demoProofIds.has(id)),
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
 * Engagement weighted by what it costs the reader. A substantive comment is
 * expensive; a reaction is nearly free.
 */
export function engagementWeight(r) {
  return (
    r.substantiveComments * 6 +
    (r.comments - r.substantiveComments) * 2 +
    r.saves * 4 +
    r.shares * 3 +
    r.reactions * 1
  );
}

/**
 * The comparable quantity for one reception record, or `null` when there is
 * none.
 *
 * Impressions stay optional in the form — LinkedIn hides them behind an extra
 * click and a demoralised user will skip the field — but a record without them
 * is **not scored** for reception. The previous design gave it a second,
 * independently-chosen anchor, and the two anchors agreed at exactly 600
 * impressions and diverged in both directions from there: the same post scored
 * 90 with impressions and 61 without at 100 views, and 9 versus 61 at 10,000.
 * A 52-point swing decided by whether the user clicked through — rewarding the
 * larger audience for omitting the field — is worse than an honest gap.
 *
 * The record still counts for cadence, for conversion attribution, and as a
 * published artifact. It simply cannot answer "how did it land".
 */
export function receptionSignal(r) {
  if (!(r.impressions > 0)) return null;
  return { mode: 'rate', value: engagementWeight(r) / r.impressions };
}

/**
 * Reference points, declared as priors (docs/METHOD.md honesty rule 5).
 *
 * `RATE_ANCHOR` is the weighted-engagement rate at which a post scores 50.
 * 0.05 corresponds to roughly a 5% weighted response — a solid but not
 * exceptional personal post. It is the only anchor: see `receptionSignal`.
 *
 * These are fixed anchors rather than the user's own moving mean, and that
 * choice is the whole design. Scoring each record against a baseline computed
 * from the user's other records made the layer self-referential: the average
 * of ratios around their own mean is pinned near the midpoint, so a uniform
 * tenfold improvement changed nothing and publishing a genuine hit *lowered*
 * the score, because the hit inflated the denominator every other post was
 * divided by. A rate already normalises for audience size, which was the only
 * reason to avoid absolute numbers in the first place.
 *
 * Relative-to-yourself comparison still happens — it is the right question for
 * "did this beat your norm" — but it lives in compounding and calibration,
 * where that is what is being asked.
 */
export const RATE_ANCHOR = 0.05;

/**
 * Score one reception on 0..100. Monotone in engagement, bounded, and 50 at
 * the anchor.
 */
export function receptionScore(reception) {
  const signal = receptionSignal(reception);
  if (!signal) return null;
  return clamp100(saturate(signal.value, RATE_ANCHOR, 100));
}

/**
 * How this record compares to a set of peers, on 0..100 with 50 at parity.
 * Used where the question really is "relative to your own norm".
 */
export function relativeReceptionScore(reception, peerBaseline) {
  const { value } = receptionSignal(reception);
  if (!(peerBaseline > 0)) return 50;
  return clamp100((100 * value) / (value + peerBaseline));
}

/** L4 — RECEPTION. How did it land? */
export function layerReception(state, now = Date.now()) {
  const scorable = (state.receptions || []).filter((r) => receptionSignal(r) !== null);
  // docs/METHOD.md requires three records before this layer says anything.
  // Below that a single number is being presented as a pattern.
  if (scorable.length < 3) return locked('no-reception');

  // Recency-weighted rather than a hard 90-day set swap. The swap stepped the
  // layer 23-38 points in a single day at constant confidence, purely because
  // a record crossed the boundary.
  const scores = scorable.map((r) => {
    const ageDaysValue = Math.max(0, (now - r.capturedAt) / DAY_MS);
    return { score: receptionScore(r), weight: 0.5 ** (ageDaysValue / 90) };
  });
  const totalWeight = scores.reduce((sum, e) => sum + e.weight, 0);
  const weighted = totalWeight > 0
    ? scores.reduce((sum, e) => sum + e.score * e.weight, 0) / totalWeight
    : mean(scores.map((e) => e.score));

  // Kish's effective sample size, not the raw count. The score is a weighted
  // mean, so six records of which one is recent and five are two years old is
  // arithmetically close to a single observation — and reporting confidence
  // 1.0 over it claimed a settled pattern where there was one post. Equal
  // weights give back the plain count, so nothing changes for fresh data.
  const sumSquares = scores.reduce((sum, e) => sum + e.weight * e.weight, 0);
  const effectiveN = sumSquares > 0 ? (totalWeight * totalWeight) / sumSquares : 0;

  return {
    score: clamp100(weighted),
    // Counted over the records the score was actually computed from, not over
    // every record on file.
    confidence: Math.min(1, effectiveN / 6),
    locked: false,
    inputs: {
      records: (state.receptions || []).length,
      scorable: scorable.length,
      unscorable: (state.receptions || []).length - scorable.length,
      effectiveN: round(effectiveN, 2),
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

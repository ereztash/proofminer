/**
 * Composite proof scoring, decay, and near-duplicate detection.
 */

import { clamp100, sumValues, ageDays } from '../core/util.js';
import { DIMENSION_KEYS, PRIOR_WEIGHTS } from './dimensions.js';
import { tokenSet } from './text.js';

/**
 * Half-life in days per proof kind (docs/METHOD.md).
 * Evidence loses persuasive value at very different rates: a degree ages over
 * years, a reach number ages over months.
 */
export const HALF_LIFE_DAYS = {
  credential: 1460,
  experience: 1095,
  outcome: 730,
  media: 540,
  event: 365,
  traction: 180,
};

/** Decay never removes more than this share of a proof's value. */
export const DECAY_FLOOR = 0.35;

/**
 * Weighted composite of the dimension breakdown.
 * Weights are renormalised so a partial or recalibrated weight map still
 * produces a 0..100 score.
 */
export function compositeScore(breakdown, weights = PRIOR_WEIGHTS) {
  const active = {};
  for (const key of DIMENSION_KEYS) {
    if (Number.isFinite(breakdown[key]) && Number.isFinite(weights[key])) {
      active[key] = weights[key];
    }
  }
  const total = sumValues(active);
  if (total <= 0) return 0;
  let sum = 0;
  for (const [key, w] of Object.entries(active)) sum += breakdown[key] * w;
  return clamp100(sum / total);
}

/**
 * Exponential decay factor for a proof.
 * @param {{occurredAt: number|null, createdAt: number, kind: string}} proof
 * @param {number} at epoch ms
 * @returns {number} 0.35..1
 */
export function decayFactor(proof, at) {
  const halfLife = HALF_LIFE_DAYS[proof.kind] ?? HALF_LIFE_DAYS.experience;
  // Undated proof decays from when the user captured it, at half rate: we know
  // it is not fresh but we must not punish it as if it were provably old.
  const dated = Number.isFinite(proof.occurredAt);
  const anchor = dated ? proof.occurredAt : proof.createdAt;
  const rate = dated ? 1 : 0.5;
  const age = ageDays(anchor, at);
  if (!Number.isFinite(age)) return DECAY_FLOOR;
  const factor = 0.5 ** ((age * rate) / halfLife);
  return DECAY_FLOOR + (1 - DECAY_FLOOR) * factor;
}

/** Score after decay. */
export const decayedScore = (proof, at) => clamp100(proof.score * decayFactor(proof, at));

/**
 * Days until this proof falls below `threshold` of its original value.
 * Drives integration I5 (publish before it stales).
 * @returns {number|null} null when it never crosses the threshold
 */
export function daysUntilStale(proof, at, threshold = 0.6) {
  if (threshold <= DECAY_FLOOR) return null;
  const halfLife = HALF_LIFE_DAYS[proof.kind] ?? HALF_LIFE_DAYS.experience;
  const dated = Number.isFinite(proof.occurredAt);
  const anchor = dated ? proof.occurredAt : proof.createdAt;
  const rate = dated ? 1 : 0.5;
  const target = (threshold - DECAY_FLOOR) / (1 - DECAY_FLOOR);
  if (target <= 0 || target > 1) return null;
  const totalDays = (Math.log2(1 / target) * halfLife) / rate;
  return Math.round(totalDays - ageDays(anchor, at));
}

/**
 * Remove near-duplicate proof units.
 *
 * Uses asymmetric containment in both directions: a short claim fully restated
 * inside a longer one is a duplicate even though symmetric similarity would
 * score it low. Input is assumed sorted best-first, so the survivor of a
 * duplicate pair is always the higher-scoring one.
 *
 * @param {object[]} proofs sorted best-first
 * @param {{threshold?: number, protect?: Set<string>}} [options] `protect`
 *   holds ids that must survive regardless of overlap.
 */
export function dedupeProofs(proofs, { threshold = 0.8, protect = null } = {}) {
  // Token sets are built once per claim rather than twice per comparison. The
  // pairwise loop is still quadratic, but the constant was the problem: 800
  // mined sentences took 6.2 seconds on the main thread with no spinner,
  // because `containment` re-tokenised both claims every time.
  const entries = proofs.map((proof) => ({ proof, tokens: tokenSet(proof.claim) }));

  const overlap = (a, b) => {
    if (!a.size) return 0;
    let shared = 0;
    for (const token of a) if (b.has(token)) shared += 1;
    return shared / a.size;
  };

  const kept = [];
  for (const entry of entries) {
    // A unit the user pinned, dismissed, or published from carries a decision,
    // and a decision is not a duplicate of anything. Dropping it here also
    // stranded any artifact citing it, because this runs before the caller's
    // pin-aware truncation and so that guard never saw the unit at all.
    if (entry.proof.pinned || entry.proof.dismissed || protect?.has(entry.proof.id)) {
      kept.push(entry);
      continue;
    }
    const duplicate = kept.some(
      (k) =>
        overlap(entry.tokens, k.tokens) >= threshold ||
        overlap(k.tokens, entry.tokens) >= threshold,
    );
    if (!duplicate) kept.push(entry);
  }
  return kept.map((e) => e.proof);
}

/**
 * Band boundaries, calibrated against the distribution the engine actually
 * produces on real material rather than against a round number.
 *
 * Reference points, measured on the exact strings in
 * `tests/engine/regression.test.js > band calibration` and asserted there, so
 * this comment cannot drift away from the engine it describes:
 *
 *   86  named client + press + percentage + currency + URL
 *   69  third-party quote with a percentage delta
 *   56  quantified outcome, no external source
 *   52  written method
 *   49  ordinary CV line
 *   11  platitude ("I believe in teamwork and continuous learning")
 *
 * The previous 75/55 cut made `strong` unreachable and printed "Weak" over a
 * user's best evidence on the reveal screen that exists to tell them the
 * opposite.
 */
export const BAND_STRONG = 68;
export const BAND_USABLE = 45;

/** Band label for a score. Text, not colour — colour alone conveys nothing. */
export function scoreBand(score) {
  if (score >= BAND_STRONG) return 'strong';
  if (score >= BAND_USABLE) return 'usable';
  return 'weak';
}

/**
 * Strongest and weakest dimension of a proof, for the "what's good / what's
 * missing" pair the UI always shows in that order.
 */
export function extremes(breakdown) {
  const entries = Object.entries(breakdown).filter(([, v]) => Number.isFinite(v));
  if (!entries.length) return { strongest: null, weakest: null };
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  return { strongest: sorted[0][0], weakest: sorted[sorted.length - 1][0] };
}

/**
 * Integration I3 — the gap engine.
 *
 * Ranking what a user already has is half the product. The other half is
 * telling them what to go and get. Coverage is computed against eight evidence
 * archetypes; each uncovered archetype emits an **acquisition play**: a
 * concrete action that would create the missing evidence, ranked by impact
 * divided by effort.
 *
 * This is the hand-holding mechanism. Without it the product is a ranker.
 */

import { ARCHETYPES } from '../core/schema.js';
import { clamp100, sortByDesc } from '../core/util.js';
import { BAND_USABLE, daysUntilStale, decayedScore } from './score.js';
import { realProofs } from './mine.js';

/**
 * How much each archetype matters, by track. A job seeker and an independent
 * consultant need genuinely different evidence: peer recognition converts
 * clients, demonstrated method converts hiring managers.
 */
const ARCHETYPE_WEIGHT = {
  job: {
    OUTCOME: 1.0, METHOD: 0.9, CREDENTIAL: 0.7, VALIDATION: 0.7,
    SCALE: 0.6, ORIGIN: 0.5, PEER: 0.4, FAILURE: 0.4,
  },
  independent: {
    OUTCOME: 1.0, VALIDATION: 0.95, PEER: 0.8, METHOD: 0.75,
    SCALE: 0.6, ORIGIN: 0.5, FAILURE: 0.45, CREDENTIAL: 0.35,
  },
};

/**
 * A proof must reach the `usable` band (after decay) to count as coverage.
 *
 * Tied to the band boundary rather than set independently: an archetype is
 * covered when the user holds evidence of it the product would call usable,
 * and those two statements must not be able to disagree.
 */
const COVERAGE_THRESHOLD = BAND_USABLE;

/**
 * Acquisition plays, one per archetype. `effortMinutes` is honest: asking a
 * client for a written outcome confirmation really does take about 15 minutes
 * of the user's time, and saying so is what makes the plan followable.
 *
 * `impact` is 1..3, `effort` is 1..3. Ranking is by weighted impact / effort.
 */
const PLAYS = {
  OUTCOME: { id: 'play.outcome', impact: 3, effort: 2, effortMinutes: 25 },
  VALIDATION: { id: 'play.validation', impact: 3, effort: 2, effortMinutes: 15 },
  SCALE: { id: 'play.scale', impact: 2, effort: 1, effortMinutes: 10 },
  METHOD: { id: 'play.method', impact: 3, effort: 3, effortMinutes: 45 },
  CREDENTIAL: { id: 'play.credential', impact: 1, effort: 1, effortMinutes: 5 },
  PEER: { id: 'play.peer', impact: 2, effort: 2, effortMinutes: 20 },
  FAILURE: { id: 'play.failure', impact: 2, effort: 2, effortMinutes: 30 },
  ORIGIN: { id: 'play.origin', impact: 2, effort: 2, effortMinutes: 30 },
};

/**
 * Coverage of each archetype by the user's real (non-demo) evidence.
 * @returns {Array<{archetype:string, covered:boolean, count:number, best:number, weight:number}>}
 */
export function archetypeCoverage(state, now = Date.now()) {
  const track = state.profile?.track === 'job' ? 'job' : 'independent';
  const weights = ARCHETYPE_WEIGHT[track];
  const proofs = realProofs(state);

  return ARCHETYPES.map((archetype) => {
    const matching = proofs.filter((p) => p.archetypes.includes(archetype));
    const scores = matching.map((p) => decayedScore(p, now));
    const best = scores.length ? Math.max(...scores) : 0;
    return {
      archetype,
      count: matching.length,
      best: Math.round(best),
      covered: best >= COVERAGE_THRESHOLD,
      weight: weights[archetype],
    };
  });
}

/**
 * Coverage as a 0..100 score, weighted by track importance.
 * Feeds the L1 layer score.
 */
export function coverageScore(state, now = Date.now()) {
  const coverage = archetypeCoverage(state, now);
  let earned = 0;
  let possible = 0;
  for (const c of coverage) {
    possible += c.weight;
    // Partial credit below the threshold: having a weak OUTCOME proof is
    // genuinely better than having none, and an all-or-nothing gate would
    // make the first weeks of use feel static.
    earned += c.weight * Math.min(1, c.best / COVERAGE_THRESHOLD);
  }
  return possible > 0 ? clamp100((earned / possible) * 100) : 0;
}

/**
 * Acquisition plays for uncovered archetypes, best value first.
 * @returns {Array<object>}
 */
export function acquisitionPlays(state, now = Date.now()) {
  const coverage = archetypeCoverage(state, now);
  const plays = coverage
    .filter((c) => !c.covered)
    .map((c) => {
      const play = PLAYS[c.archetype];
      return {
        ...play,
        archetype: c.archetype,
        weight: c.weight,
        currentBest: c.best,
        // Value = how much this archetype matters here, how strong the play
        // is, and how cheap it is. Users in this state have limited energy;
        // the cheapest high-impact move must sort first.
        value: Number(((c.weight * play.impact) / play.effort).toFixed(3)),
      };
    });
  return sortByDesc(plays, (p) => p.value);
}

/**
 * Integration I5 — evidence approaching its shelf life.
 * High-value proof that will lose meaningful value soon gets publishing
 * priority over equally strong but stable evidence.
 */
export function stalingProofs(
  state,
  now = Date.now(),
  { withinDays = 90, minScore = BAND_USABLE } = {},
) {
  const published = new Set(
    (state.artifacts || [])
      .filter((a) => a.status === 'published')
      .flatMap((a) => a.proofIds),
  );

  return realProofs(state)
    .filter((p) => !published.has(p.id))
    .map((proof) => ({
      proof,
      current: Math.round(decayedScore(proof, now)),
      daysLeft: daysUntilStale(proof, now),
    }))
    // Gate on the *undecayed* score. Gating on the decayed one required the
    // proof to still be above the threshold after the decay that put it in this
    // window in the first place — which needed raw scores above the engine's
    // own ceiling, so the integration could never fire.
    // Bounded on both sides. With only an upper bound, evidence that crossed
    // the threshold years ago returned a large negative, passed the filter,
    // was clamped to "0 days left", and sorted first — so the single Next Move
    // pointed at the user's most-decayed material three steps running, while
    // stronger unpublished evidence sat one screen away in the picker.
    .filter(
      ({ proof, daysLeft }) =>
        proof.score >= minScore &&
        daysLeft !== null &&
        daysLeft <= withinDays &&
        daysLeft >= -14,
    )
    .map((entry) => ({ ...entry, daysLeft: Math.max(0, entry.daysLeft) }))
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

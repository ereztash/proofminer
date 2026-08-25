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
import { BAND_USABLE, HALF_LIFE_DAYS, daysUntilStale, decayedScore } from './score.js';
import { realProofs } from './mine.js';
import { extractSignals } from './signals.js';

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
 * What a proof must score, after decay, for its archetype to count as covered.
 *
 * `BAND_USABLE` by default — an archetype is covered when the user holds
 * evidence of it the product would call usable, and those two statements must
 * not be able to disagree.
 *
 * Four archetypes are exceptions, and they are exceptions for a real reason:
 * the dimension scorer rewards checkability, magnitude and external
 * attribution, and some kinds of evidence structurally cannot carry those. An
 * origin story has no percentage in it. Measured on best-practice evidence
 * written exactly as each play instructs (pinned in
 * `tests/engine/regression.test.js > acquisition plays`):
 *
 *   OUTCOME 68 · VALIDATION 65 · PEER 57 · SCALE 55
 *   FAILURE 47 · CREDENTIAL 47 · METHOD 45 · ORIGIN 36
 *
 * Holding all eight to 45 meant four plays instructed the user to produce
 * evidence that could not satisfy them. A user who obeyed for 24 weeks saw
 * coverage never move and the Visibility Gap widen, with the same instruction
 * re-issued every fortnight. The threshold now asks each archetype for the
 * best that archetype can be, not for the best an OUTCOME can be.
 */
const COVERAGE_CEILING = {
  ORIGIN: 30,
  METHOD: 40,
  // Re-calibrated with the verification fix in `dimensions.js`, not loosened.
  // A bare URL used to be paid twice — once in `verification`, once in
  // `falsifiability` — so every claim carrying a link sat a few points higher
  // than the evidence in it justified. The reference credential (a degree, an
  // institution, a year, a specialisation and a link) scored 43 against this
  // bar of 42: a one-point margin, and the point came from the double count.
  // With verification no longer paying for self-reference it scores 39, so the
  // bar moves to 38 and the margin is the same one point it always was. A
  // thinner line — a certification with no institution named — still scores in
  // the mid-thirties and still does not cover.
  CREDENTIAL: 38,
  FAILURE: 42,
};

const coverageThreshold = (archetype) => COVERAGE_CEILING[archetype] ?? BAND_USABLE;

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
 * The one archetype no wording can reach without digits.
 *
 * `inferArchetypes` adds SCALE from `hasScaleUnit` alone, and `hasScaleUnit`
 * requires an actual digit next to the unit. Every other archetype has a route
 * that carries no magnitude at all — measured on best-practice evidence
 * written without one (pinned in `tests/engine/gaps.test.js`):
 *
 *   OUTCOME 54 (bar 45, via a stated before/after) · PEER 53 · VALIDATION 51
 *   FAILURE 47 (bar 42) · METHOD 43 (bar 40) · ORIGIN 31 (bar 30)
 *   SCALE — not classified as SCALE at all
 *
 * So the product can honestly tell seven of eight plays how to be satisfied
 * without a number. It cannot tell SCALE that, and pretending otherwise would
 * be the same defect in the other direction.
 */
export const MAGNITUDE_ONLY = 'SCALE';

/**
 * At or below this share of units carrying a magnitude, the inventory reads as
 * one this user cannot add numbers to.
 */
export const SPARSE_MAGNITUDE = 0.2;

/** Below this many real units the share is noise, and no inference is drawn. */
const MAGNITUDE_SAMPLE_MIN = 3;

/**
 * What the SCALE play's value is multiplied by in a magnitude-free inventory.
 *
 * Ranking only. Coverage thresholds, `BAND_USABLE` and the Liebig gate are
 * untouched: this changes which instruction is offered first, never what
 * counts as evidence. SCALE sorts third for an independent user and second for
 * a job seeker on effort alone, so someone who has never written a number down
 * is told to go and count things before they are told to go and ask a client
 * for a sentence — the one of the two they can actually do.
 */
const MAGNITUDE_ONLY_DISCOUNT = 0.5;

/**
 * Share of the user's real evidence that carries a magnitude.
 *
 * Recomputed from the claim text rather than read off the unit, because
 * proof units store their `breakdown` and not their signals — the same reason
 * `rescoreProofs` re-extracts.
 *
 * @returns {{share:number, units:number, withMagnitude:number}|null}
 *   null when the inventory is too small to mean anything.
 */
export function magnitudeDensity(state) {
  const proofs = realProofs(state);
  if (proofs.length < MAGNITUDE_SAMPLE_MIN) return null;
  const withMagnitude = proofs.filter((p) => extractSignals(p.claim).numberCount > 0).length;
  return {
    share: withMagnitude / proofs.length,
    units: proofs.length,
    withMagnitude,
  };
}

/**
 * Coverage of each archetype by the user's real (non-demo) evidence.
 *
 * Takes no clock: coverage is a question about what the user holds, and the
 * answer does not change overnight. Callers still pass `now` positionally
 * through `coverageScore` and `acquisitionPlays`, which do use it.
 * @returns {Array<{archetype:string, covered:boolean, count:number, best:number,
 *   threshold:number, weight:number}>}
 */
export function archetypeCoverage(state) {
  const track = state.profile?.track === 'job' ? 'job' : 'independent';
  const weights = ARCHETYPE_WEIGHT[track];
  const proofs = realProofs(state);

  return ARCHETYPES.map((archetype) => {
    const matching = proofs.filter((p) => p.archetypes.includes(archetype));
    // Undecayed, deliberately. Coverage asks *do you hold evidence of this
    // kind*, and holding it is not time-sensitive — a degree earned in 2018 is
    // still a degree. Gating it on the decayed score meant an ordinary older
    // credential scored 24 against a bar of 42, so the CREDENTIAL play could
    // not be satisfied by doing exactly what it said. What decay is for is how
    // much the evidence is *worth*, and that is already measured: L1's quality
    // term runs on decayed scores, and I5 handles publishing freshness.
    const scores = matching.map((p) => p.score);
    const best = scores.length ? Math.max(...scores) : 0;
    const threshold = coverageThreshold(archetype);
    return {
      archetype,
      count: matching.length,
      best: Math.round(best),
      // Reported so the guidance can say "what you added scored 38, this needs
      // 42" instead of silently re-issuing an identical instruction.
      threshold,
      covered: best >= threshold,
      weight: weights[archetype],
    };
  });
}

/**
 * Coverage as a 0..100 score, weighted by track importance.
 * Feeds the L1 layer score.
 */
export function coverageScore(state) {
  const coverage = archetypeCoverage(state);
  let earned = 0;
  let possible = 0;
  for (const c of coverage) {
    possible += c.weight;
    // Partial credit below the threshold: having a weak OUTCOME proof is
    // genuinely better than having none, and an all-or-nothing gate would
    // make the first weeks of use feel static.
    earned += c.weight * Math.min(1, c.best / c.threshold);
  }
  return possible > 0 ? clamp100((earned / possible) * 100) : 0;
}

/**
 * Acquisition plays for uncovered archetypes, best value first.
 * @returns {Array<object>}
 */
export function acquisitionPlays(state) {
  const coverage = archetypeCoverage(state);
  const density = magnitudeDensity(state);
  // Only demoted on evidence. With too few units to judge, or with magnitudes
  // present, SCALE keeps its own value — the discount answers a demonstrated
  // inability to write numbers down, never a guess at one.
  const sparse = density !== null && density.share <= SPARSE_MAGNITUDE;

  const plays = coverage
    .filter((c) => !c.covered)
    .map((c) => {
      const play = PLAYS[c.archetype];
      const magnitudeOnly = c.archetype === MAGNITUDE_ONLY;
      const deprioritised = sparse && magnitudeOnly;
      // Value = how much this archetype matters here, how strong the play
      // is, and how cheap it is. Users in this state have limited energy;
      // the cheapest high-impact move must sort first.
      const base = (c.weight * play.impact) / play.effort;
      return {
        ...play,
        archetype: c.archetype,
        weight: c.weight,
        currentBest: c.best,
        threshold: c.threshold,
        /** True once the user has evidence of this type that is simply not strong enough. */
        shortOfBar: c.count > 0,
        /** This play cannot be satisfied without a digit; the copy says so. */
        magnitudeOnly,
        /** Sorted down because this inventory carries no magnitudes at all. */
        deprioritised,
        value: Number((base * (deprioritised ? MAGNITUDE_ONLY_DISCOUNT : 1)).toFixed(3)),
      };
    });
  return sortByDesc(plays, (p) => p.value);
}

/**
 * Integration I5 — evidence approaching its shelf life.
 * High-value proof that will lose meaningful value soon gets publishing
 * priority over equally strong but stable evidence.
 */
export function stalingProofs(state, now = Date.now(), { minScore = BAND_USABLE } = {}) {
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
    // The window is a share of the proof kind's own half-life, not a flat 90
    // days. A fixed window sat around a crossing point 248 to 4,025 days out
    // depending on kind and dating, so the integration produced zero candidates
    // across a five-year weekly sweep — it was alive and unreachable.
    //
    // Bounded below as well: with only an upper bound, evidence that crossed
    // the threshold years ago returned a large negative, was clamped to
    // "0 days left", and sorted first.
    .filter(({ proof, daysLeft }) => {
      if (proof.score < minScore || daysLeft === null) return false;
      const halfLife = HALF_LIFE_DAYS[proof.kind] ?? HALF_LIFE_DAYS.experience;
      return daysLeft <= halfLife * 0.35 && daysLeft >= -14;
    })
    .map((entry) => ({ ...entry, daysLeft: Math.max(0, entry.daysLeft) }))
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

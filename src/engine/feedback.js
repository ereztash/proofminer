/**
 * The two closing integrations — the reason this is a system and not a ranker.
 *
 * I1 · compounding   L4 -> L1  reception becomes new evidence
 * I2 · calibration   L4 -> L1  reception rewrites the ranking weights
 *
 * Together they make the product's output its own input. No tool in this
 * category models that, which is why every one of them ranks content the same
 * way for every user forever.
 */

import { correlation, makeId, mean, round, sumValues } from '../core/util.js';
import { CALIBRATABLE_KEYS, DIMENSION_KEYS, PRIOR_WEIGHTS } from './dimensions.js';
import { analyzeClaim } from './mine.js';
import { receptionScore } from './layers.js';

/** Minimum observations before calibration is allowed to move anything. */
export const MIN_OBSERVATIONS = 5;
/** Shrinkage constant: at n = k the empirical signal carries half the weight. */
export const SHRINKAGE_K = 8;
/** No calibrated weight may move more than this factor from its prior. */
export const MAX_WEIGHT_DRIFT = 2.5;

/**
 * Pair each measured artifact with the dimension breakdown of the proof it was
 * grounded in. Ungrounded artifacts carry no dimension data and are skipped —
 * which is also why groundedness matters in the L3 score.
 */
export function buildObservations(state) {
  const proofById = new Map((state.proofs || []).map((p) => [p.id, p]));
  const artifactById = new Map((state.artifacts || []).map((a) => [a.id, a]));
  const receptions = state.receptions || [];

  const rates = receptions.map((r) => {
    const impressions = Math.max(r.impressions, 1);
    return (
      (r.substantiveComments * 6 +
        (r.comments - r.substantiveComments) * 2 +
        r.saves * 4 +
        r.shares * 3 +
        r.reactions * 1) /
      impressions
    );
  });
  const baseline = rates.length ? mean(rates) : 0;

  const observations = [];
  for (const reception of receptions) {
    const artifact = artifactById.get(reception.artifactId);
    if (!artifact || !artifact.proofIds.length) continue;

    const proofs = artifact.proofIds.map((id) => proofById.get(id)).filter(Boolean);
    // Demo material must never teach the model anything about this user.
    const real = proofs.filter((p) => !p.demo);
    if (!real.length) continue;

    // Average the breakdown across the proofs backing one artifact.
    const breakdown = {};
    for (const key of DIMENSION_KEYS) {
      const values = real.map((p) => p.breakdown[key]).filter(Number.isFinite);
      if (values.length) breakdown[key] = mean(values);
    }
    observations.push({
      breakdown,
      reception: receptionScore(reception, baseline),
      artifactId: artifact.id,
    });
  }
  return observations;
}

/**
 * Integration I2 — learn this user's own leverage model.
 *
 * Regresses reception on each dimension independently (correlation, not a full
 * multivariate fit: with 5-30 observations a multivariate model would overfit
 * badly and the honest move is the simpler estimator), then shrinks hard
 * toward the priors.
 *
 * `falsifiability` and `recency` are excluded from calibration by design.
 * Falsifiability is an integrity floor, and if a user's audience happened to
 * reward unverifiable claims, learning that would turn the product into
 * exactly the thing it exists to prevent.
 *
 * @returns {{weights: Record<string, number>|null, observations: number, confidence: number, detail: object}}
 */
export function calibrate(state) {
  const observations = buildObservations(state);
  const n = observations.length;

  if (n < MIN_OBSERVATIONS) {
    return {
      weights: null,
      observations: n,
      confidence: 0,
      detail: { reason: 'insufficient-observations', need: MIN_OBSERVATIONS - n },
    };
  }

  const receptions = observations.map((o) => o.reception);
  const correlations = {};
  for (const key of CALIBRATABLE_KEYS) {
    const xs = observations.map((o) => o.breakdown[key]);
    if (xs.some((v) => !Number.isFinite(v))) {
      correlations[key] = 0;
      continue;
    }
    correlations[key] = correlation(xs, receptions);
  }

  // Map correlation (-1..1) onto a multiplier around 1. A dimension that
  // predicts reception gains weight; one that anti-predicts loses it.
  const shrink = SHRINKAGE_K / (SHRINKAGE_K + n);
  const empiricalShare = 1 - shrink;

  const raw = {};
  for (const key of DIMENSION_KEYS) {
    const prior = PRIOR_WEIGHTS[key];
    if (!CALIBRATABLE_KEYS.includes(key)) {
      raw[key] = prior; // fixed dimensions never move
      continue;
    }
    const multiplier = 1 + correlations[key] * 1.2;
    const empirical = prior * Math.max(0.2, multiplier);
    const blended = prior * shrink + empirical * empiricalShare;
    // Hard clamp so a small, noisy sample can never invert the model.
    raw[key] = Math.min(
      prior * MAX_WEIGHT_DRIFT,
      Math.max(prior / MAX_WEIGHT_DRIFT, blended),
    );
  }

  // Renormalise to 100 so composite scores stay comparable across calibrations.
  const total = sumValues(raw);
  const weights = {};
  for (const [key, value] of Object.entries(raw)) {
    weights[key] = round((value / total) * 100, 3);
  }

  return {
    weights,
    observations: n,
    confidence: round(Math.min(1, n / 15), 3),
    detail: {
      correlations: Object.fromEntries(
        Object.entries(correlations).map(([k, v]) => [k, round(v, 3)]),
      ),
      shrinkage: round(shrink, 3),
      excluded: DIMENSION_KEYS.filter((k) => !CALIBRATABLE_KEYS.includes(k)),
    },
  };
}

/** The weights currently in force: calibrated when available, priors otherwise. */
export function activeWeights(state) {
  const w = state.calibration?.weights;
  if (!w) return PRIOR_WEIGHTS;
  // Guard against a partially-written calibration from an older version.
  const complete = DIMENSION_KEYS.every((k) => Number.isFinite(w[k]));
  return complete ? w : PRIOR_WEIGHTS;
}

/**
 * How far a calibrated weight map has moved from the priors, per dimension.
 * Shown to the user as "what your audience actually rewards".
 */
export function calibrationDelta(weights) {
  if (!weights) return [];
  return DIMENSION_KEYS.map((key) => ({
    key,
    prior: PRIOR_WEIGHTS[key],
    current: weights[key] ?? PRIOR_WEIGHTS[key],
    delta: round((weights[key] ?? PRIOR_WEIGHTS[key]) - PRIOR_WEIGHTS[key], 2),
  })).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

/** Reception must beat the user's own baseline by this factor to become evidence. */
export const COMPOUND_THRESHOLD = 1.6;

/**
 * Integration I1 — compounding. An artifact that meaningfully outperformed the
 * user's own baseline *is itself evidence*: reach and response are traction,
 * and traction is a claim a sceptic can check.
 *
 * Returns proof units to add. Deliberately conservative: it fires only well
 * above baseline, requires a real impression count, and produces a claim built
 * strictly from observed numbers — it never characterises the result.
 *
 * @returns {object[]} new proof units
 */
export function compound(state, { now = Date.now(), minImpressions = 200 } = {}) {
  const receptions = state.receptions || [];
  if (receptions.length < 3) return []; // no baseline worth comparing against

  const artifactById = new Map((state.artifacts || []).map((a) => [a.id, a]));
  const rates = receptions.map((r) => {
    const impressions = Math.max(r.impressions, 1);
    return (
      (r.substantiveComments * 6 +
        (r.comments - r.substantiveComments) * 2 +
        r.saves * 4 +
        r.shares * 3 +
        r.reactions * 1) /
      impressions
    );
  });
  const baseline = mean(rates);
  if (baseline <= 0) return [];

  const alreadyCompounded = new Set(
    (state.proofs || [])
      .filter((p) => p.origin === 'compounded')
      .map((p) => p.sourceId),
  );

  const created = [];
  receptions.forEach((reception, index) => {
    if (reception.impressions < minImpressions) return;
    if (rates[index] < baseline * COMPOUND_THRESHOLD) return;
    if (alreadyCompounded.has(reception.id)) return;

    const artifact = artifactById.get(reception.artifactId);
    if (!artifact) return;

    // Built only from observed numbers. No adjectives, no interpretation.
    const claim = buildTractionClaim(reception, state.locale);
    const analysis = analyzeClaim(claim, {
      positioning: state.positioning,
      now,
    });

    created.push({
      id: makeId('proof'),
      claim,
      sourceId: reception.id,
      sourceName: artifact.channel,
      kind: 'traction',
      archetypes: [...new Set([...analysis.archetypes, 'SCALE'])],
      breakdown: analysis.breakdown,
      score: analysis.score,
      occurredAt: artifact.publishedAt ?? reception.capturedAt,
      demo: false,
      origin: 'compounded',
      pinned: false,
      dismissed: false,
      createdAt: now,
    });
  });

  return created;
}

/** Factual traction sentence assembled from the recorded numbers only. */
function buildTractionClaim(reception, locale = 'he') {
  const parts = [];
  if (locale === 'en') {
    parts.push(`A post I published reached ${reception.impressions.toLocaleString('en-US')} impressions`);
    if (reception.substantiveComments > 0) {
      parts.push(`with ${reception.substantiveComments} substantive comments`);
    }
    if (reception.saves > 0) parts.push(`and ${reception.saves} saves`);
    return `${parts.join(' ')}.`;
  }
  parts.push(`פוסט שפרסמתי הגיע ל-${reception.impressions.toLocaleString('he-IL')} חשיפות`);
  if (reception.substantiveComments > 0) {
    parts.push(`עם ${reception.substantiveComments} תגובות ענייניות`);
  }
  if (reception.saves > 0) parts.push(`ו-${reception.saves} שמירות`);
  return `${parts.join(' ')}.`;
}

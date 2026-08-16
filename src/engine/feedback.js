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
import { compositeScore } from './score.js';
import { engagementWeight, relativeReceptionScore, receptionSignal } from './layers.js';

/**
 * Minimum *distinct artifacts* before calibration is allowed to move anything.
 *
 * Raised from 5. Seven dimensions are correlated independently with no
 * multiple-comparison correction, so at n=5 more than half of users whose
 * results are pure noise would see at least one dimension "confirmed" at
 * |r| > 0.8. Eight does not make the estimator sound — nothing at this sample
 * size does — but combined with the shrinkage below and the provisional
 * labelling in the UI it stops the panel from asserting a finding.
 */
export const MIN_OBSERVATIONS = 8;

/** Below this, the calibration panel presents itself as a hypothesis. */
export const CONFIDENT_OBSERVATIONS = 15;
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

  // One artifact measured five times is one observation, not five. Counting
  // receptions made MIN_OBSERVATIONS reachable with a single post whose numbers
  // the user re-checked each week, which is ordinary behaviour.
  const latestPerArtifact = new Map();
  for (const reception of state.receptions || []) {
    const held = latestPerArtifact.get(reception.artifactId);
    if (!held || reception.capturedAt > held.capturedAt) {
      latestPerArtifact.set(reception.artifactId, reception);
    }
  }
  const receptions = [...latestPerArtifact.values()];
  const signals = receptions
    .map((r) => {
      const signal = receptionSignal(r);
      return signal ? { r, ...signal } : null;
    })
    .filter(Boolean);

  const observations = [];
  for (const entry of signals) {
    const artifact = artifactById.get(entry.r.artifactId);
    if (!artifact || !artifact.proofIds.length) continue;

    const proofs = artifact.proofIds.map((id) => proofById.get(id)).filter(Boolean);
    // Demo material must never teach the model anything about this user.
    const real = proofs.filter((p) => !p.demo);
    if (!real.length || real.length !== proofs.length) continue;

    // Average the breakdown across the proofs backing one artifact.
    const breakdown = {};
    for (const key of DIMENSION_KEYS) {
      const values = real.map((p) => p.breakdown[key]).filter(Number.isFinite);
      if (values.length) breakdown[key] = mean(values);
    }

    const peers = signals.filter((o) => o !== entry && o.mode === entry.mode);
    observations.push({
      breakdown,
      reception: relativeReceptionScore(
        entry.r,
        peers.length ? mean(peers.map((o) => o.value)) : 0,
      ),
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
 * Absolute floor for compounding, independent of the user's own baseline.
 *
 * Relative-only thresholds fire on nothing: with the minimum three records, two
 * flops make an utterly ordinary third post "1.6x baseline", and a 240-view
 * post was being written into the evidence base as traction.
 */
export const COMPOUND_MIN_ENGAGEMENT = 40;

/**
 * What the URL on a traction claim actually proves.
 *
 * The generated sentence carries a link and a specific figure, so the scorer
 * read it as highly checkable — `verification` 90, `falsifiability` 84 — and
 * the resulting unit outscored the user's real CV lines. But the link evidences
 * that *the post exists*; the impression count is not public on any of these
 * platforms, so the one fact the claim asserts is precisely the one a sceptic
 * cannot open and check. It is a number the user typed about themselves.
 *
 * So both dimensions are overridden and the composite recomputed. The unit is
 * still evidence — reach is real and this is the integration that makes output
 * an input — but it is self-reported evidence and is scored as such.
 */
const SELF_REPORTED = { verification: 30, falsifiability: 40 };

function selfReported(analysis) {
  const breakdown = { ...analysis.breakdown, ...SELF_REPORTED };
  return { ...analysis, breakdown, score: compositeScore(breakdown) };
}

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
export function compound(state, { now = Date.now(), minImpressions = 500 } = {}) {
  const receptions = state.receptions || [];
  if (receptions.length < 4) return []; // no baseline worth comparing against

  const proofById = new Map((state.proofs || []).map((p) => [p.id, p]));
  const artifactById = new Map((state.artifacts || []).map((a) => [a.id, a]));

  const signals = receptions
    .map((r) => {
      const signal = receptionSignal(r);
      return signal ? { r, ...signal } : null;
    })
    .filter(Boolean);

  // Keyed by artifact, not by reception: logging the same post's numbers three
  // weeks running used to produce three near-identical traction claims, each
  // offered as publishable. `buildObservations` already dedupes per artifact
  // for the same reason.
  const receptionToArtifact = new Map(
    (state.receptions || []).map((r) => [r.id, r.artifactId]),
  );
  const alreadyCompounded = new Set(
    (state.proofs || [])
      .filter((p) => p.origin === 'compounded')
      .map((p) => receptionToArtifact.get(p.sourceId) ?? p.sourceId),
  );

  const created = [];
  for (const entry of signals) {
    const { r: reception } = entry;
    // Also guards within this run: three weekly measurements of the same post
    // arrive as three receptions in one call. Marked below, once a unit is
    // actually created — marking here would consume the artifact on the first
    // record that failed a threshold.
    if (alreadyCompounded.has(reception.artifactId)) continue;

    // Absolute floors first. Without them the relative test fires on a post
    // that simply happened to follow two flops.
    if (reception.impressions < minImpressions) continue;
    if (engagementWeight(reception) < COMPOUND_MIN_ENGAGEMENT) continue;

    // Leave-one-out baseline, same mode only.
    const peers = signals.filter((o) => o !== entry && o.mode === entry.mode);
    if (peers.length < 3) continue;
    const baseline = mean(peers.map((o) => o.value));
    if (!(baseline > 0) || entry.value < baseline * COMPOUND_THRESHOLD) continue;

    const artifact = artifactById.get(reception.artifactId);
    if (!artifact || artifact.status !== 'published') continue;

    // An artifact grounded in bundled fixtures must never produce a real proof
    // unit. Without this check, loading the sample and typing three reception
    // rows manufactures a `demo: false` traction claim, clears the site-wide
    // demo banner, and leaves the entire evidence base as one laundered
    // sentence assembled from numbers the user typed themselves.
    const cited = artifact.proofIds.map((id) => proofById.get(id)).filter(Boolean);
    if (!cited.length || cited.some((p) => p.demo)) continue;

    // Reach becomes evidence only when there is something a sceptic could open.
    // Without a link this is a number the user typed about themselves, and the
    // compounding loop would be a pipe from self-report into the score.
    if (!/^https?:\/\/\S+\.\S+/i.test(artifact.url?.trim() ?? '')) continue;

    // Built only from observed numbers. No adjectives, no interpretation.
    const claim = buildTractionClaim(reception, artifact.url, state.locale);
    const analysis = selfReported(
      analyzeClaim(claim, { positioning: state.positioning, now }),
    );

    alreadyCompounded.add(reception.artifactId);
    created.push({
      id: makeId('proof'),
      claim,
      sourceId: reception.id,
      sourceName: artifact.channel,
      kind: 'traction',
      // No archetype at all. Reach the user typed in is evidence of a kind,
      // but counting it as SCALE coverage made the product stop telling them to
      // go and get real scale evidence because they had entered a number.
      // The generated sentence also contains the word "published",
      // which the third-party lexicon reads as external validation — so
      // re-analysing our own output let self-reported reach close the
      // VALIDATION gap and suppress the highest-value acquisition play, the
      // one that tells the user to go and get a testimonial.
      archetypes: [],
      breakdown: analysis.breakdown,
      score: analysis.score,
      occurredAt: artifact.publishedAt ?? reception.capturedAt,
      demo: false,
      origin: 'compounded',
      pinned: false,
      dismissed: false,
      createdAt: now,
    });
  }

  return created;
}

/**
 * Factual traction sentence assembled from the recorded numbers only, with the
 * artifact's own URL attached so the resulting claim is checkable rather than
 * self-asserted.
 */
function buildTractionClaim(reception, url, locale = 'he') {
  const parts = [];
  if (locale === 'en') {
    parts.push(`A post I published reached ${reception.impressions.toLocaleString('en-US')} impressions`);
    if (reception.substantiveComments > 0) {
      parts.push(`with ${reception.substantiveComments} substantive comments`);
    }
    if (reception.saves > 0) parts.push(`and ${reception.saves} saves`);
    return `${parts.join(' ')} — ${url}`;
  }
  parts.push(`פוסט שפרסמתי הגיע ל-${reception.impressions.toLocaleString('he-IL')} חשיפות`);
  if (reception.substantiveComments > 0) {
    parts.push(`עם ${reception.substantiveComments} תגובות ענייניות`);
  }
  if (reception.saves > 0) parts.push(`ו-${reception.saves} שמירות`);
  return `${parts.join(' ')} — ${url}`;
}

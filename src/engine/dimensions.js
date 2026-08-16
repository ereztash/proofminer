/**
 * The nine proof dimensions.
 *
 * Each dimension is a pure function from signals + context to 0..100, plus the
 * metadata the UI needs to explain itself. Weights here are **priors** — see
 * docs/METHOD.md — and are replaced per user by `feedback.calibrate()` once
 * enough reception data exists.
 *
 * Note on demo material: dimensions score it on its merits and apply no demo
 * penalty. The guarantee that fixtures cannot inflate a real score is enforced
 * where it belongs — `mine.realProofs()` drops demo the instant any real
 * evidence exists, and `feedback.buildObservations()` never learns from it,
 * both under test. Penalising it here as well only made the bundled sample
 * score so poorly that it stopped demonstrating what the product does.
 */

import { clamp100 } from '../core/util.js';
import { contextRelevance } from './text.js';

/**
 * @typedef {object} Dimension
 * @property {string} key
 * @property {number} prior           weight 0..100, priors sum to 100
 * @property {boolean} calibratable   false = fixed by design, not by preference
 * @property {(s: object, ctx: object) => number} score
 */

/** @type {Dimension[]} */
export const DIMENSIONS = [
  {
    key: 'verification',
    prior: 18,
    calibratable: true,
    // A claim someone else made about you outranks a claim you made about
    // yourself. Users systematically under-supply this and it is the single
    // strongest driver of perceived credibility.
    score: (s) => {
      let v = 20;
      if (s.thirdParty) v += 42;
      if (s.verifiableRef) v += 14;
      if (s.hasUrl) v += 12;
      if (s.hasProperNoun) v += 8;
      if (s.peer) v += 6;
      if (s.generic) v -= 16;
      return clamp100(v);
    },
  },
  {
    key: 'icpFit',
    prior: 16,
    calibratable: true,
    // Evidence is not good in the abstract, only for an audience with a
    // problem. Baseline 30 (not 0) because an unfilled positioning must not
    // zero out every proof the user owns on their first run.
    score: (s, ctx) => {
      if (!ctx.audienceContext.trim()) return 30;
      const rel = contextRelevance(ctx.text, ctx.audienceContext);
      let v = 22 + rel * 62;
      if (s.outcome) v += 8;
      if (s.generic) v -= 10;
      return clamp100(v);
    },
  },
  {
    key: 'outcome',
    prior: 15,
    calibratable: true,
    // Did something change in the world? Change verb plus a stated delta.
    score: (s) => {
      let v = 22;
      if (s.outcome) v += 30;
      if (s.outcome && s.numberCount > 0) v += 16;
      if (s.hasPercent) v += 10;
      if (s.hasCurrency) v += 10;
      if (s.contrast) v += 8;
      if (s.hedge) v -= 12;
      if (s.generic) v -= 18;
      return clamp100(v);
    },
  },
  {
    key: 'specificity',
    prior: 13,
    calibratable: true,
    // Concreteness is what makes a claim feel checkable rather than asserted.
    score: (s) => {
      let v = 20;
      v += Math.min(3, s.numberCount) * 12;
      if (s.hasDuration) v += 10;
      if (s.hasScaleUnit) v += 10;
      if (s.hasProperNoun) v += 10;
      if (s.hedge) v -= 14;
      if (s.generic) v -= 20;
      // Very long claims dilute: a 60-word sentence is a paragraph, and a
      // paragraph is not an atomic proof unit.
      if (s.words > 45) v -= 8;
      return clamp100(v);
    },
  },
  {
    key: 'differentiation',
    prior: 10,
    calibratable: true,
    // How many people in the field could say this exact sentence? Rare
    // intersections beat strong-but-common claims. Approximated by the
    // co-occurrence of qualities that rarely travel together.
    score: (s, ctx) => {
      let v = 30;
      const rare = [s.method, s.failure, s.credential && s.outcome, s.peer, s.origin && s.outcome];
      v += rare.filter(Boolean).length * 11;
      if (s.hasProperNoun && s.outcome) v += 8;
      // A claim that restates the user's own generic positioning language adds
      // no separation from anyone else in the category.
      if (ctx.claimContext.trim() && contextRelevance(ctx.text, ctx.claimContext) > 0.7) v -= 6;
      if (s.generic) v -= 20;
      return clamp100(v);
    },
  },
  {
    key: 'falsifiability',
    prior: 8,
    calibratable: false, // integrity floor — never tuned toward what performs
    // Could a sceptic check this? This dimension has no equivalent in any
    // competing tool and is the structural defence against hollow authority.
    score: (s) => {
      let v = 12;
      if (s.hasUrl) v += 30;
      if (s.hasProperNoun) v += 20;
      if (s.verifiableRef) v += 16;
      if (s.years.length) v += 12;
      if (s.numberCount > 0) v += 10;
      if (s.thirdParty) v += 10;
      if (s.hedge) v -= 18;
      if (s.generic) v -= 22;
      return clamp100(v);
    },
  },
  {
    key: 'commercialProximity',
    prior: 8,
    calibratable: true,
    // Distance between the proof and the thing being sold or hired for.
    score: (s, ctx) => {
      let v = 24;
      if (ctx.offerContext.trim()) v += contextRelevance(ctx.text, ctx.offerContext) * 40;
      if (s.outcome) v += 18;
      if (s.thirdParty) v += 8;
      if (s.method) v += 8;
      if (s.generic) v -= 12;
      return clamp100(v);
    },
  },
  {
    key: 'recency',
    prior: 6,
    calibratable: false, // derived from time, not preference
    score: (s, ctx) => {
      if (s.hasRelativeTime) return 92;
      if (!s.years.length) return 40; // undated: neutral, not penalised to zero
      const newest = Math.max(...s.years);
      const age = Math.max(0, ctx.nowYear - newest);
      return clamp100(96 - age * 11);
    },
  },
  {
    key: 'narrative',
    prior: 6,
    calibratable: true,
    // Before/after structure, tension, a turn. Determines whether the proof
    // can carry an artifact at all.
    score: (s) => {
      let v = 28;
      if (s.contrast) v += 24;
      if (s.outcome) v += 18;
      if (s.failure) v += 14; // a turn is the strongest narrative material
      if (s.origin) v += 10;
      if (s.words < 8) v -= 12; // too short to carry a story
      if (s.generic) v -= 14;
      return clamp100(v);
    },
  },
];

export const DIMENSION_KEYS = DIMENSIONS.map((d) => d.key);

/** Priors as a plain map. */
export const PRIOR_WEIGHTS = Object.fromEntries(DIMENSIONS.map((d) => [d.key, d.prior]));

/** Dimension keys eligible for per-user calibration. */
export const CALIBRATABLE_KEYS = DIMENSIONS.filter((d) => d.calibratable).map((d) => d.key);

/**
 * Build the scoring context once per mining run.
 * @param {object} positioning
 * @param {number} now epoch ms
 */
export function makeContext(positioning, now) {
  const p = positioning || {};
  return {
    text: '',
    audienceContext: [p.audience, p.transformation].filter(Boolean).join(' '),
    claimContext: p.claim || '',
    offerContext: p.offer || '',
    nowYear: new Date(now).getUTCFullYear(),
  };
}

/**
 * Score every dimension for one claim.
 * @returns {Record<string, number>}
 */
export function scoreDimensions(signals, context) {
  const out = {};
  for (const dim of DIMENSIONS) out[dim.key] = dim.score(signals, context);
  return out;
}

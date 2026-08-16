import { describe, expect, it } from 'vitest';
import {
  MIN_OBSERVATIONS,
  activeWeights,
  buildObservations,
  calibrate,
  calibrationDelta,
  compound,
} from '../../src/engine/feedback.js';
import { CALIBRATABLE_KEYS, DIMENSION_KEYS, PRIOR_WEIGHTS } from '../../src/engine/dimensions.js';
import { sumValues } from '../../src/core/util.js';
import { NOW, DAY, STRONG_HE, artifact, proofFrom, reception, stateWith } from '../helpers.js';

/**
 * Build a state where reception correlates strongly with one dimension, so
 * calibration has a real signal to find.
 */
function calibratableState(count = 10) {
  const proofs = [];
  const artifacts = [];
  const receptions = [];

  for (let i = 0; i < count; i += 1) {
    const verification = 10 + i * 9; // 10..~100
    const proof = proofFrom(`ראיה מספר ${i} על תוצאה מדידה אצל לקוח בתעשייה`, {
      breakdown: Object.fromEntries(DIMENSION_KEYS.map((k) => [k, k === 'verification' ? verification : 50])),
    });
    const art = artifact({ proofIds: [proof.id], publishedAt: NOW - (i + 2) * DAY });
    proofs.push(proof);
    artifacts.push(art);
    receptions.push(
      reception({
        artifactId: art.id,
        impressions: 1000,
        // Engagement rises with the verification dimension.
        reactions: 5 + i * 4,
        comments: i,
        substantiveComments: i,
        saves: i,
        shares: 0,
        capturedAt: NOW - (i + 1) * DAY,
      }),
    );
  }
  return stateWith({ proofs, artifacts, receptions });
}

describe('observations', () => {
  it('skips ungrounded artifacts', () => {
    const state = stateWith({
      proofs: [proofFrom(STRONG_HE)],
      artifacts: [artifact({ id: 'a1', proofIds: [] })],
      receptions: [reception({ artifactId: 'a1' })],
    });
    expect(buildObservations(state)).toHaveLength(0);
  });

  it('never learns from demo proof', () => {
    const proof = proofFrom(STRONG_HE, { demo: true });
    const state = stateWith({
      proofs: [proof],
      artifacts: [artifact({ id: 'a1', proofIds: [proof.id] })],
      receptions: [reception({ artifactId: 'a1' })],
    });
    expect(buildObservations(state)).toHaveLength(0);
  });
});

describe('calibration', () => {
  it('refuses to move weights below the observation minimum', () => {
    const result = calibrate(calibratableState(MIN_OBSERVATIONS - 1));
    expect(result.weights).toBeNull();
    expect(result.confidence).toBe(0);
    expect(result.detail.reason).toBe('insufficient-observations');
  });

  it('produces weights that still sum to 100', () => {
    const result = calibrate(calibratableState(12));
    expect(result.weights).not.toBeNull();
    expect(sumValues(result.weights)).toBeCloseTo(100, 1);
  });

  it('raises the weight of the dimension that predicted reception', () => {
    const result = calibrate(calibratableState(12));
    expect(result.weights.verification).toBeGreaterThan(PRIOR_WEIGHTS.verification);
  });

  it('never calibrates falsifiability or recency, by design', () => {
    const result = calibrate(calibratableState(20));
    const fixed = DIMENSION_KEYS.filter((k) => !CALIBRATABLE_KEYS.includes(k));
    expect(fixed).toEqual(expect.arrayContaining(['falsifiability', 'recency']));

    // Fixed dimensions move only by the shared renormalisation, never by fit,
    // so their ratios to each other are exactly the prior ratios and all fixed
    // dimensions share one common scale factor.
    const scales = fixed.map((k) => result.weights[k] / PRIOR_WEIGHTS[k]);
    for (const scale of scales) expect(scale).toBeCloseTo(scales[0], 3);
    expect(result.weights.falsifiability / result.weights.recency).toBeCloseTo(
      PRIOR_WEIGHTS.falsifiability / PRIOR_WEIGHTS.recency,
      3,
    );
    expect(result.detail.excluded).toContain('falsifiability');
    expect(result.detail.excluded).toContain('recency');
  });

  it('shrinks hard toward the priors on a small sample', () => {
    const small = calibrate(calibratableState(6));
    const large = calibrate(calibratableState(24));
    const driftOf = (r) => Math.abs(r.weights.verification - PRIOR_WEIGHTS.verification);
    expect(driftOf(small)).toBeLessThan(driftOf(large));
  });

  it('clamps every weight within the permitted drift band', () => {
    const result = calibrate(calibratableState(30));
    for (const key of DIMENSION_KEYS) {
      expect(result.weights[key]).toBeGreaterThan(0);
      expect(result.weights[key]).toBeLessThan(PRIOR_WEIGHTS[key] * 3);
    }
  });

  it('falls back to priors when calibration is absent or incomplete', () => {
    expect(activeWeights(stateWith())).toEqual(PRIOR_WEIGHTS);
    const partial = stateWith();
    partial.calibration.weights = { verification: 40 };
    expect(activeWeights(partial)).toEqual(PRIOR_WEIGHTS);
  });

  it('reports per-dimension delta from the priors', () => {
    const result = calibrate(calibratableState(12));
    const deltas = calibrationDelta(result.weights);
    expect(deltas).toHaveLength(DIMENSION_KEYS.length);
    expect(Math.abs(deltas[0].delta)).toBeGreaterThanOrEqual(Math.abs(deltas[1].delta));
  });
});

describe('compounding', () => {
  const baselineReceptions = (artifactId) =>
    Array.from({ length: 4 }, (_, i) =>
      reception({
        artifactId,
        impressions: 1000,
        reactions: 10,
        comments: 1,
        substantiveComments: 0,
        saves: 0,
        shares: 0,
        capturedAt: NOW - (i + 5) * DAY,
      }),
    );

  function outperformingState() {
    const proof = proofFrom(STRONG_HE);
    const art = artifact({ id: 'a_hit', proofIds: [proof.id] });
    return stateWith({
      proofs: [proof],
      artifacts: [art],
      receptions: [
        ...baselineReceptions('a_hit'),
        reception({
          id: 'rcp_hit',
          artifactId: 'a_hit',
          impressions: 12_000,
          reactions: 400,
          comments: 60,
          substantiveComments: 40,
          saves: 90,
          shares: 25,
          capturedAt: NOW - DAY,
        }),
      ],
    });
  }

  it('turns a post that beat the baseline into a new proof unit', () => {
    const created = compound(outperformingState(), { now: NOW });
    expect(created).toHaveLength(1);
    expect(created[0].origin).toBe('compounded');
    expect(created[0].kind).toBe('traction');
    expect(created[0].archetypes).toContain('SCALE');
  });

  it('builds the claim only from observed numbers', () => {
    const [created] = compound(outperformingState(), { now: NOW });
    expect(created.claim).toContain('12,000');
    expect(created.claim).toContain('40');
    // No interpretation, no adjectives about the result.
    expect(created.claim).not.toMatch(/מדהים|ויראלי|הצלחה/);
  });

  it('does nothing without a baseline to compare against', () => {
    const thin = stateWith({ receptions: [reception()] });
    expect(compound(thin, { now: NOW })).toHaveLength(0);
  });

  it('ignores posts that merely matched the baseline', () => {
    const proof = proofFrom(STRONG_HE);
    const art = artifact({ id: 'a1', proofIds: [proof.id] });
    const flat = stateWith({
      proofs: [proof],
      artifacts: [art],
      receptions: Array.from({ length: 5 }, () =>
        reception({ artifactId: 'a1', impressions: 1000, reactions: 10, comments: 1, substantiveComments: 0, saves: 0, shares: 0 }),
      ),
    });
    expect(compound(flat, { now: NOW })).toHaveLength(0);
  });

  it('does not compound the same reception twice', () => {
    const state = outperformingState();
    const [created] = compound(state, { now: NOW });
    state.proofs.push(created);
    expect(compound(state, { now: NOW })).toHaveLength(0);
  });

  it('ignores outperformance on a negligible impression count', () => {
    const state = outperformingState();
    state.receptions[state.receptions.length - 1].impressions = 30;
    expect(compound(state, { now: NOW })).toHaveLength(0);
  });
});

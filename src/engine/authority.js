/**
 * The Authority Index, the Visibility Gap, the diagnosis, and the Next Move.
 *
 * This module is where the product's ethics become arithmetic. The Liebig gate
 * below is the reason this tool cannot be used to manufacture standing: built
 * layers are capped by the evidence foundation, so publishing harder on a thin
 * base does not raise the number — it changes the diagnosis to HOLLOW and
 * routes the user to evidence acquisition instead.
 */

import { clamp100, round } from '../core/util.js';
import { computeLayers } from './layers.js';
import { acquisitionPlays, stalingProofs } from './gaps.js';
import { detectDrift, scorePositioning } from './positioning.js';
import { realProofs } from './mine.js';
import { decayedScore } from './score.js';

/** How far built standing may exceed the evidence foundation. */
export const LIEBIG_GATE = 25;

const FOUNDATION_WEIGHTS = { L1: 0.55, L2: 0.45 };
const BUILT_WEIGHTS = { L3: 0.3, L4: 0.25, L5: 0.25, L6: 0.2 };

/** Below this the index is presented as an estimate, not a measurement. */
export const LOW_CONFIDENCE = 0.35;

/** Diagnosis threshold: above this a half of the stack counts as developed. */
const DEVELOPED = 45;

function weightedLayers(layers, weights) {
  let score = 0;
  let confidence = 0;
  let totalWeight = 0;
  for (const [key, w] of Object.entries(weights)) {
    score += (layers[key]?.score ?? 0) * w;
    confidence += (layers[key]?.confidence ?? 0) * w;
    totalWeight += w;
  }
  return {
    score: clamp100(score),
    confidence: totalWeight > 0 ? confidence / totalWeight : 0,
  };
}

/**
 * @param {object} state
 * @param {number} [now]
 * @returns {object} the full authority computation
 */
export function computeAuthority(state, now = Date.now()) {
  const layers = computeLayers(state, now);

  const foundation = weightedLayers(layers, FOUNDATION_WEIGHTS);
  const built = weightedLayers(layers, BUILT_WEIGHTS);

  // Liebig's law of the minimum: the ceiling on built standing is the
  // foundation that supports it.
  const effectiveBuilt = Math.min(built.score, foundation.score + LIEBIG_GATE);
  const gated = built.score > foundation.score + LIEBIG_GATE;

  const index = clamp100(0.45 * foundation.score + 0.55 * effectiveBuilt);
  const gap = Math.round(foundation.score - built.score);

  const confidence = round(0.5 * foundation.confidence + 0.5 * built.confidence, 3);

  return {
    layers,
    foundation: foundation.score,
    built: built.score,
    effectiveBuilt: Math.round(effectiveBuilt),
    gated,
    index,
    /** Signed. Positive = worth more than the world can see. The headline number. */
    gap,
    confidence,
    lowConfidence: confidence < LOW_CONFIDENCE,
    diagnosis: diagnose(foundation.score, built.score),
    unlockedLayers: Object.entries(layers)
      .filter(([, l]) => !l.locked)
      .map(([k]) => k),
  };
}

/**
 * The 2x2. `BURIED` is the state most of this product's users arrive in;
 * `HOLLOW` is the state the rest of the category actively produces.
 * @returns {'STALLED'|'BURIED'|'HOLLOW'|'COMPOUNDING'}
 */
export function diagnose(foundation, built) {
  const strongFoundation = foundation >= DEVELOPED;
  const strongBuilt = built >= DEVELOPED;
  if (strongFoundation && strongBuilt) return 'COMPOUNDING';
  if (strongFoundation && !strongBuilt) return 'BURIED';
  if (!strongFoundation && strongBuilt) return 'HOLLOW';
  return 'STALLED';
}

/**
 * Exactly one next move. Never a menu.
 *
 * The order of the rules below is the product. It encodes what a competent
 * advisor would say next, given everything currently known, and it is
 * deliberately biased toward the cheapest action that unblocks the largest
 * downstream layer.
 *
 * @returns {{id:string, layer:string, effortMinutes:number, view:string, payload?:object}}
 */
export function nextMove(state, now = Date.now()) {
  const authority = computeAuthority(state, now);
  const { layers } = authority;
  const proofs = realProofs(state);
  const positioning = scorePositioning(state.positioning);

  // 1. Nothing to work with. Everything else is premature.
  if (!state.sources?.length && !proofs.length) {
    return { id: 'move.addSource', layer: 'L1', effortMinutes: 5, view: 'mine' };
  }

  // 2. Sources exist but were never mined — one click from the first value.
  if (state.sources?.length && !state.proofs?.length) {
    return { id: 'move.mine', layer: 'L1', effortMinutes: 1, view: 'mine' };
  }

  // 3. Positioning is what makes ranking mean anything. Without an audience,
  //    icpFit is a constant and the ranking is only measuring intrinsic
  //    strength — useful, but not the product's claim.
  if (!state.positioning?.audience?.trim()) {
    return { id: 'move.setAudience', layer: 'L2', effortMinutes: 4, view: 'position' };
  }

  // 4. Louder than the evidence. Publishing more would make it worse, and this
  //    is the one case where the product actively tells the user to stop.
  if (authority.diagnosis === 'HOLLOW' || authority.gated) {
    const play = acquisitionPlays(state, now)[0];
    return {
      id: 'move.acquireProof',
      layer: 'L1',
      effortMinutes: play?.effortMinutes ?? 20,
      view: 'gaps',
      payload: { play },
    };
  }

  // 5. Evidence exists, nothing published. The BURIED state — the reason this
  //    product exists.
  const publishedCount = (state.artifacts || []).filter((a) => a.status === 'published').length;
  if (proofs.length && publishedCount === 0) {
    const best = bestUnpublished(state, now);
    return {
      id: 'move.publishFirst',
      layer: 'L3',
      effortMinutes: 12,
      view: 'studio',
      payload: { proofId: best?.id ?? null },
    };
  }

  // 6. Evidence with a shelf life, still unpublished (integration I5).
  const staling = stalingProofs(state, now)[0];
  if (staling && staling.daysLeft <= 45) {
    return {
      id: 'move.publishStaling',
      layer: 'L3',
      effortMinutes: 12,
      view: 'studio',
      payload: { proofId: staling.proof.id, daysLeft: staling.daysLeft },
    };
  }

  // 7. Published but never measured. Without reception there is no calibration
  //    and no compounding — the two integrations that make this more than a
  //    ranker.
  const unmeasured = (state.artifacts || []).filter(
    (a) =>
      a.status === 'published' &&
      !(state.receptions || []).some((r) => r.artifactId === a.id),
  );
  if (unmeasured.length) {
    return {
      id: 'move.logReception',
      layer: 'L4',
      effortMinutes: 3,
      view: 'measure',
      payload: { artifactId: unmeasured[0].id, pending: unmeasured.length },
    };
  }

  // 8. Weakest of the covered archetypes, once the loop is running.
  const play = acquisitionPlays(state, now)[0];
  if (play) {
    return {
      id: 'move.closeGap',
      layer: 'L1',
      effortMinutes: play.effortMinutes,
      view: 'gaps',
      payload: { play },
    };
  }

  // 9. Positioning refinement, once evidence and distribution are both healthy.
  if (positioning.issues.length) {
    return {
      id: 'move.sharpenPositioning',
      layer: 'L2',
      effortMinutes: 8,
      view: 'position',
      payload: { issue: positioning.issues[0] },
    };
  }

  // 10. Drift: the market is buying something other than the declared claim.
  const drift = detectDrift(state);
  if (drift?.drifting) {
    return {
      id: 'move.resolveDrift',
      layer: 'L2',
      effortMinutes: 10,
      view: 'position',
      payload: { drift },
    };
  }

  // 11. Everything is healthy — the weakest unlocked layer is next.
  const weakest = Object.entries(layers)
    .filter(([, l]) => !l.locked)
    .sort((a, b) => a[1].score - b[1].score)[0];
  return {
    id: 'move.strengthenLayer',
    layer: weakest?.[0] ?? 'L1',
    effortMinutes: 15,
    view: 'dashboard',
  };
}

/** Highest-value proof unit that has not been published yet. */
export function bestUnpublished(state, now = Date.now()) {
  const published = new Set(
    (state.artifacts || []).flatMap((a) => a.proofIds),
  );
  const candidates = realProofs(state).filter((p) => !published.has(p.id));
  if (!candidates.length) return null;
  return candidates
    .map((p) => ({ p, s: decayedScore(p, now) }))
    .sort((a, b) => b.s - a.s)[0].p;
}

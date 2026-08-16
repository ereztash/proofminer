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
import { isDemoMode, realProofs } from './mine.js';
import { BAND_USABLE, decayedScore } from './score.js';

/** How far built standing may exceed the evidence foundation. */
export const LIEBIG_GATE = 25;

const FOUNDATION_WEIGHTS = { L1: 0.55, L2: 0.45 };
const BUILT_WEIGHTS = { L3: 0.3, L4: 0.25, L5: 0.25, L6: 0.2 };

/**
 * Below this the index is presented as an estimate, not a measurement.
 *
 * Raised from 0.35, which sat just under the confidence of the two states that
 * most need the caveat: a user with four proofs and no publishing history
 * (0.36), and a user whose thin foundation triggers a HOLLOW reading (0.53).
 */
export const LOW_CONFIDENCE = 0.55;

/** Below this on both halves, there is genuinely nothing to work with yet. */
export const STARTED = 18;
/** Above this on both halves, the stack is developed enough to be compounding. */
export const DEVELOPED = 45;
/** Gap magnitude at which the two halves count as out of step. */
export const GAP_THRESHOLD = 12;

/**
 * Combine layers under a weight map.
 *
 * `skipLocked` renormalises over the layers that actually have data, and the
 * asymmetry between the two halves of the stack is deliberate:
 *
 * - **Foundation (L1, L2) skips locked layers.** A locked L2 means the user has
 *   not filled in the positioning form yet — it does not mean they have no
 *   claim. Averaging in a zero there charges them for the incompleteness of
 *   *our* form, and it is what made someone who had just pasted fifteen years
 *   of work read "you haven't started yet".
 * - **Built (L3–L6) counts locked layers as zero.** A locked L3 means nothing
 *   has been published. That is a real fact about the world, and it is exactly
 *   the gap this product exists to name.
 */
function weightedLayers(layers, weights, { skipLocked = false } = {}) {
  let score = 0;
  let confidence = 0;
  let totalWeight = 0;
  for (const [key, w] of Object.entries(weights)) {
    const layer = layers[key];
    if (skipLocked && layer?.locked) continue;
    // Weight each layer by how much of it we actually know. Without this,
    // typing one character into the positioning form unlocked L2 at a very low
    // score and blended it in at full weight — dropping the headline number by
    // 20 points as a direct consequence of obeying the product's own
    // instruction, and leaving a competent full answer still below the score
    // for leaving the form blank.
    // Squared, so a quarter-answered form contributes a sixteenth of its
    // weight rather than a quarter of it. A partial answer is not a quarter of
    // a positioning — it is barely a positioning, and weighting it as though we
    // knew a quarter of the truth still cost the user points for starting.
    const known = skipLocked ? Math.max(0.02, (layer?.confidence ?? 1) ** 2) : 1;
    const effective = w * known;
    score += (layer?.score ?? 0) * effective;
    confidence += (layer?.confidence ?? 0) * w;
    totalWeight += effective;
  }
  if (totalWeight <= 0) return { score: 0, confidence: 0 };
  const divisor = skipLocked ? totalWeight : sumWeights(weights);
  return {
    score: clamp100(score / divisor),
    confidence: confidence / (skipLocked ? sumWeights(weights) : sumWeights(weights)),
  };
}

const sumWeights = (weights) => Object.values(weights).reduce((s, w) => s + w, 0);

/**
 * @param {object} state
 * @param {number} [now]
 * @returns {object} the full authority computation
 */
export function computeAuthority(state, now = Date.now()) {
  const layers = computeLayers(state, now);

  const foundation = weightedLayers(layers, FOUNDATION_WEIGHTS, { skipLocked: true });
  const built = weightedLayers(layers, BUILT_WEIGHTS);

  // Liebig's law of the minimum: the ceiling on built standing is the
  // foundation that supports it.
  const effectiveBuilt = Math.min(built.score, foundation.score + LIEBIG_GATE);
  const gated = built.score > foundation.score + LIEBIG_GATE;

  const index = clamp100(0.45 * foundation.score + 0.55 * effectiveBuilt);
  const gap = Math.round(foundation.score - built.score);

  // The minimum, not the mean. The headline sentence asserts both numbers, and
  // a fully-measured foundation was buying off the hedge on a built half
  // computed from layers with no observations at all.
  const confidence = round(Math.min(foundation.confidence, built.confidence), 3);

  // Bundled fixtures describe nobody. Any verdict computed from them is a
  // verdict about our sample, and the product says so instead of asserting it.
  const demo = isDemoMode(state);

  return {
    layers,
    demo,
    foundation: foundation.score,
    built: built.score,
    effectiveBuilt: Math.round(effectiveBuilt),
    gated,
    index,
    /** Signed. Positive = worth more than the world can see. The headline number. */
    gap,
    confidence,
    lowConfidence: demo || confidence < LOW_CONFIDENCE,
    diagnosis: demo
      ? 'DEMO'
      : diagnose(foundation.score, built.score, layers.L1),
    unlockedLayers: Object.entries(layers)
      .filter(([, l]) => !l.locked)
      .map(([k]) => k),
  };
}

/** L1 confidence below which we have not measured the evidence base at all. */
export const MEASURED_FOUNDATION = 0.5;

/**
 * The 2x2, plus one honest refusal.
 *
 * `BURIED` is the state most of this product's users arrive in; `HOLLOW` is the
 * state the rest of the category actively produces.
 *
 * `UNCATALOGUED` is the fifth answer, and it exists because the arithmetic
 * could not previously tell *inflated* from *not yet written down*. The built
 * side fills from a few dropdown clicks — three real interviews and two real
 * referrals — while the foundation side requires pasting documents. A user who
 * honestly logged what happened to them was being told, at full confidence,
 * that they appear larger than their evidence supports. That is calling an
 * honest person a fraud for under-supplying input to a form.
 *
 * So HOLLOW is only ever returned when the evidence base has actually been
 * measured. Otherwise the product says the true thing: we do not know yet.
 *
 * @returns {'STALLED'|'BURIED'|'HOLLOW'|'COMPOUNDING'|'UNCATALOGUED'}
 */
export function diagnose(foundation, built, proofLayer = null) {
  const measured = (proofLayer?.confidence ?? 1) >= MEASURED_FOUNDATION;
  const gap = foundation - built;

  // Genuinely nothing on either side yet.
  if (foundation < STARTED && built < STARTED) return 'STALLED';

  // Otherwise the diagnosis follows the gap — the same quantity the product
  // leads with. Keying it to absolute thresholds instead put a hard cliff on a
  // continuous number: a user who had just been told "we found six pieces of
  // evidence" read "you haven't started yet" one screen later, because their
  // foundation came out at 44 against a threshold of 45.
  if (gap >= GAP_THRESHOLD) return 'BURIED';
  if (gap <= -GAP_THRESHOLD) return measured ? 'HOLLOW' : 'UNCATALOGUED';
  // Balanced. Whether that is compounding or merely early depends on the level:
  // "now it is cadence and conversion" is the wrong thing to tell someone whose
  // two halves are balanced at 18.
  return foundation >= DEVELOPED && built >= DEVELOPED ? 'COMPOUNDING' : 'EARLY';
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
  const positioning = scorePositioning(state.positioning, state.recognitions || []);

  // 1. Nothing to work with. Everything else is premature. Also covers the
  //    case where sources exist but mining found nothing usable in them —
  //    otherwise the only instruction is "mine", forever, on empty input.
  if (!proofs.length && !(state.sources || []).some((s) => !Number.isFinite(s.minedAt))) {
    return { id: 'move.addSource', layer: 'L1', effortMinutes: 5, view: 'mine' };
  }

  // 2. Sources exist with nothing mined from them yet. Re-checked on every
  //    call, not only on the first run: evidence acquired through a gap play
  //    comes back in as a new source, and the guidance has to notice it or the
  //    acquisition loop has no return path.
  const unmined = (state.sources || []).filter((s) => !Number.isFinite(s.minedAt));
  if (unmined.length) {
    return {
      id: 'move.mine',
      layer: 'L1',
      effortMinutes: 1,
      view: 'mine',
      payload: { unmined: unmined.length },
    };
  }

  // 2b. Only fixtures so far. Everything downstream would be measuring us
  //     rather than them.
  if (isDemoMode(state)) {
    return { id: 'move.addRealSource', layer: 'L1', effortMinutes: 5, view: 'mine' };
  }

  const publishedCount = (state.artifacts || []).filter((a) => a.status === 'published').length;
  const strongest = bestUnpublished(state, now);
  const hasStrongProof = strongest ? decayedScore(strongest, now) >= BAND_USABLE : false;

  // 3. Positioning is what makes ranking mean anything. Without an audience,
  //    icpFit is a constant and the ranking is only measuring intrinsic
  //    strength — useful, but not the product's claim.
  //
  //    Exception: when the user already holds a genuinely strong piece of
  //    evidence and has published nothing, sending them to a five-field form
  //    is the wrong first instruction. They came here invisible; the first
  //    thing that should happen is that something of theirs becomes visible.
  //    Positioning is the very next move after that.
  if (!state.positioning?.audience?.trim() && !(hasStrongProof && publishedCount === 0)) {
    return { id: 'move.setAudience', layer: 'L2', effortMinutes: 4, view: 'position' };
  }

  // 4a. Thin evidence base, but we have not measured enough of it to call
  //     anyone hollow. Ask for the material, do not deliver a verdict.
  if (authority.diagnosis === 'UNCATALOGUED') {
    return { id: 'move.catalogueMore', layer: 'L1', effortMinutes: 8, view: 'mine' };
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
  if (proofs.length && publishedCount === 0) {
    return {
      id: 'move.publishFirst',
      layer: 'L3',
      effortMinutes: 12,
      view: 'studio',
      payload: { proofId: strongest?.id ?? null },
    };
  }

  // 5b. Published something, but positioning is still empty. Now the form is
  //     the right ask, because the ranking has real work to do.
  if (!state.positioning?.audience?.trim()) {
    return { id: 'move.setAudience', layer: 'L2', effortMinutes: 4, view: 'position' };
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

  // 7b. The recurring publish move.
  //
  //     Without this the guidance said "publish" exactly once, on the first
  //     post, and then routed to evidence acquisition forever — in a product
  //     whose entire purpose is converting evidence into visible standing. A
  //     user holding strong unpublished evidence should be told to publish it,
  //     however many times that is true.
  if (strongest && decayedScore(strongest, now) >= BAND_USABLE && authority.gap > 8) {
    return {
      id: 'move.publishNext',
      layer: 'L3',
      effortMinutes: 12,
      view: 'studio',
      payload: { proofId: strongest.id },
    };
  }

  // 7c. The built half cannot rise without these, and until now nothing ever
  //     asked for them: L5 and L6 carry 0.45 of built, so an obedient user
  //     publishing and measuring forever watched the headline gap freeze.
  //     They are also the cheapest inputs in the product — one dropdown.
  const publishedWithReception = (state.artifacts || []).filter(
    (a) => a.status === 'published' && (state.receptions || []).some((r) => r.artifactId === a.id),
  ).length;
  if (publishedWithReception >= 2 && !(state.conversions || []).length) {
    return { id: 'move.logConversion', layer: 'L5', effortMinutes: 2, view: 'measure' };
  }
  if (publishedWithReception >= 3 && !(state.recognitions || []).length) {
    return { id: 'move.logRecognition', layer: 'L6', effortMinutes: 2, view: 'measure' };
  }

  // 8. Weakest of the covered archetypes, once the loop is running.
  const play = acquisitionPlays(state, now)[0];
  if (play && !recentlyAttempted(state, play, now)) {
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

/**
 * True when this play was surfaced recently and nothing new has arrived since.
 *
 * Without it the guidance re-issued an identical 20-minute task after the user
 * had gone and done it — because the evidence they came back with scored just
 * under the coverage threshold. Repeating an instruction someone has already
 * followed is the fastest way to lose them.
 */
function recentlyAttempted(state, play, now) {
  const attempt = state.playLog?.[play.archetype];
  if (!Number.isFinite(attempt)) return false;
  const addedSince = (state.sources || []).some((s) => s.addedAt > attempt);
  return !addedSince && now - attempt < 7 * 24 * 60 * 60 * 1000;
}

/**
 * Highest-value proof unit that has not been published yet.
 *
 * Demo units are excluded unconditionally — the single primary action on the
 * dashboard must never read "publish your strongest evidence" pointing at
 * bundled fiction.
 */
export function bestUnpublished(state, now = Date.now()) {
  const published = new Set(
    (state.artifacts || []).flatMap((a) => a.proofIds),
  );
  const candidates = realProofs(state).filter((p) => !published.has(p.id) && !p.demo);
  if (!candidates.length) return null;
  return candidates
    .map((p) => ({ p, s: decayedScore(p, now) }))
    .sort((a, b) => b.s - a.s)[0].p;
}

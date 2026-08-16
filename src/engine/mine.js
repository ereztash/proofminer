/**
 * The mining pipeline: source documents -> ranked, deduplicated proof units.
 *
 * A source document is a container. The atomic object is a proof unit: one
 * claim that can stand on its own.
 */

import { makeId, sortByDesc } from '../core/util.js';
import { splitSentences } from './text.js';
import { extractSignals, inferArchetypes, inferKind, inferOccurredAt } from './signals.js';
import { makeContext, scoreDimensions } from './dimensions.js';
import { compositeScore, dedupeProofs } from './score.js';
import { PRIOR_WEIGHTS } from './dimensions.js';

/** Upper bound on units kept per run, to keep the inventory reviewable. */
export const MAX_PROOFS = 60;

/**
 * Analyse one claim string into a full proof unit (without persistence).
 * @param {string} claim
 * @param {object} options
 */
export function analyzeClaim(claim, { positioning, weights = PRIOR_WEIGHTS, now = Date.now() }) {
  const signals = extractSignals(claim);
  const context = makeContext(positioning, now);
  context.text = claim;
  const breakdown = scoreDimensions(signals, context);
  return {
    signals,
    breakdown,
    score: compositeScore(breakdown, weights),
    kind: inferKind(signals),
    archetypes: inferArchetypes(signals),
    occurredAt: inferOccurredAt(signals, now),
  };
}

/**
 * Mine all sources into proof units.
 *
 * User decisions are preserved across re-mining: a unit the user pinned or
 * dismissed keeps that state when the same claim reappears. Re-running the
 * miner after changing positioning is the intended workflow — the whole point
 * is that ranking is relative to who you are talking to — so it must not
 * silently throw away the user's curation.
 *
 * @param {object} state
 * @param {object} [options]
 * @returns {object[]} proof units, best first
 */
export function mineSources(state, { now = Date.now(), weights = PRIOR_WEIGHTS } = {}) {
  const priorDecisions = new Map();
  for (const p of state.proofs || []) {
    priorDecisions.set(p.claim.trim(), {
      pinned: p.pinned,
      dismissed: p.dismissed,
      id: p.id,
      // Undated evidence decays from when it was first captured. Stamping
      // `now` on every mining pass reset that clock, so pressing "mine again"
      // made an eight-year-old undated claim brand new — silently rewarding
      // the user for not dating their evidence.
      createdAt: p.createdAt,
    });
  }

  // Compounded and manual units are not derived from source text, so they are
  // carried through untouched rather than regenerated.
  const preserved = (state.proofs || []).filter((p) => p.origin !== 'mined');
  const preservedClaims = new Set(preserved.map((p) => p.claim.trim()));

  const candidates = [];
  for (const source of state.sources || []) {
    for (const sentence of splitSentences(source.text)) {
      const trimmed = sentence.trim();
      if (preservedClaims.has(trimmed)) continue;
      const analysis = analyzeClaim(trimmed, { positioning: state.positioning, weights, now });
      const prior = priorDecisions.get(trimmed);
      candidates.push({
        id: prior?.id || makeId('proof'),
        claim: trimmed,
        sourceId: source.id,
        sourceName: source.name,
        kind: analysis.kind,
        archetypes: analysis.archetypes,
        breakdown: analysis.breakdown,
        score: analysis.score,
        occurredAt: analysis.occurredAt,
        demo: source.demo || analysis.signals.demo,
        origin: 'mined',
        pinned: prior?.pinned ?? false,
        dismissed: prior?.dismissed ?? false,
        createdAt: prior?.createdAt ?? now,
      });
    }
  }

  // Stamped whether or not the source produced anything. Inferring "mined"
  // from the presence of a proof carrying the source id meant a source that
  // yielded nothing — a bulleted list under the sentence-length floor, or one
  // whose claims all deduped against existing units — was permanently unmined,
  // and the product's single instruction became a button that did nothing.
  for (const source of state.sources || []) source.minedAt = now;

  // Publishing from a unit is a decision about it, exactly like pinning one.
  // Without this, mining a large new CV could drop the unit a published post
  // was written from, and the post's citation — the thing that makes it
  // grounded — pointed at nothing.
  const cited = new Set((state.artifacts || []).flatMap((a) => a.proofIds || []));
  const curatedBy = (p) => p.pinned || p.dismissed || cited.has(p.id);

  // Compounded and manual units join the dedupe pass rather than bypassing it.
  // Routing them straight to `preserved` meant N published posts minted N
  // traction units differing only in their URL, each one counting separately
  // toward volume, quality and confidence — and so toward the gate ceiling.
  const ranked = sortByDesc([...preserved, ...candidates], (p) => p.score);
  const deduped = dedupeProofs(ranked, { protect: cited });

  // Truncation must never destroy a decision the user made. A pinned unit that
  // happened to score low was being dropped by the score-sorted cut, taking the
  // pin with it and leaving any artifact citing it with a dangling reference.
  const curated = deduped.filter(curatedBy);
  const rest = deduped.filter((p) => !curatedBy(p));
  const kept = [...curated, ...rest.slice(0, Math.max(0, MAX_PROOFS - curated.length))];

  return sortByDesc(kept, (p) => p.score);
}

/**
 * Re-score existing proof units against current positioning and weights
 * without re-splitting sources. Used when the user edits their positioning:
 * the same evidence must be re-ranked for the new audience.
 */
export function rescoreProofs(proofs, { positioning, weights = PRIOR_WEIGHTS, now = Date.now() }) {
  const context = makeContext(positioning, now);
  return proofs.map((proof) => {
    const signals = extractSignals(proof.claim);
    context.text = proof.claim;
    const breakdown = scoreDimensions(signals, context);
    return { ...proof, breakdown, score: compositeScore(breakdown, weights) };
  });
}

/** Active inventory: not dismissed. */
export const activeProofs = (state) => (state.proofs || []).filter((p) => !p.dismissed);

/**
 * True when the only evidence present is bundled demo material.
 *
 * In that state the product is demonstrating itself, not measuring anyone, and
 * the UI says so on every screen.
 */
export function isDemoMode(state) {
  const active = activeProofs(state);
  return active.length > 0 && active.every((p) => p.demo);
}

/**
 * The evidence used for scoring.
 *
 * The integrity rule is that demo material must never inflate a *real* score,
 * so demo proof is dropped the moment any real evidence exists. When the user
 * has loaded only the sample there is no real standing to inflate, and scoring
 * on the sample is what lets the sample demonstrate anything at all — the
 * alternative is showing someone who clicked "show me on an example" six
 * locked layers and a gap of zero, which teaches them nothing and reproduces
 * exactly the dashboard-of-zeros experience docs/UX.md rules out.
 *
 * Demo material is still excluded from calibration unconditionally
 * (see `feedback.buildObservations`) — the model never learns from fixtures.
 */
export function realProofs(state) {
  const active = activeProofs(state);
  const real = active.filter((p) => !p.demo);
  return real.length ? real : active;
}

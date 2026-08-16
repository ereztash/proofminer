/**
 * Why *this* piece of evidence.
 *
 * The First Light reveal is the product's entire hook: the user is supposed to
 * learn something about their own material that they did not already know. A
 * static glossary line for whichever dimension scored highest does not do that
 * — and worse, it can be plainly false against the card it sits under ("someone
 * else said this about you" printed over a claim the user wrote themselves).
 *
 * So reasons are derived from the *signals actually present in this claim*, and
 * from how this claim compares to the rest of the user's inventory. A reason is
 * only emitted when its evidence is in the text.
 */

import { extractSignals } from './signals.js';

/**
 * @typedef {object} Reason
 * @property {string} id      i18n key under `reasons.`
 * @property {number} weight  ordering; higher is more surprising to the user
 * @property {object} [vars]  interpolation values
 */

/**
 * Reasons that come from the claim itself.
 * Ordered by how much they tell a user they did not already know: "you have a
 * number in here" is mundane; "this is checkable by a stranger" is not.
 */
function intrinsicReasons(signals) {
  const out = [];
  const add = (id, weight, vars) => out.push({ id, weight, vars });

  if (signals.thirdParty && signals.hasProperNoun) add('reasons.namedThirdParty', 95);
  else if (signals.thirdParty) add('reasons.thirdParty', 88);

  if (signals.hasUrl) add('reasons.checkable', 90);
  else if (signals.hasProperNoun && signals.years.length) add('reasons.datedAndNamed', 80);

  if (signals.outcome && signals.hasPercent) add('reasons.percentDelta', 86);
  else if (signals.outcome && signals.hasCurrency) add('reasons.moneyDelta', 84);
  else if (signals.outcome && signals.contrast) add('reasons.beforeAfter', 78);
  else if (signals.outcome) add('reasons.outcome', 62);

  if (signals.hasScaleUnit) add('reasons.scale', 70);
  if (signals.method) add('reasons.method', 76);
  if (signals.failure) add('reasons.failure', 82);
  if (signals.peer) add('reasons.peer', 79);
  if (signals.credential && signals.numberCount > 0) add('reasons.credentialGraded', 55);

  if (signals.hedge) add('reasons.hedged', 40);
  if (signals.generic && !signals.outcome) add('reasons.generic', 35);

  return out;
}

/**
 * Reasons that only exist relative to the rest of the inventory. These are the
 * ones the user genuinely cannot see for themselves, because they require
 * having read all of their own material at once.
 */
function comparativeReasons(claim, signals, inventorySignals) {
  const out = [];
  const total = inventorySignals.length;
  if (total < 3) return out;

  const countWith = (key) => inventorySignals.filter((s) => s[key]).length;

  if (signals.thirdParty) {
    const n = countWith('thirdParty');
    if (n <= 2) out.push({ id: 'reasons.rareVerification', weight: 100, vars: { n, total } });
  }
  if (signals.hasPercent || signals.hasCurrency) {
    const n = inventorySignals.filter((s) => s.hasPercent || s.hasCurrency).length;
    if (n <= 2) out.push({ id: 'reasons.rareNumbers', weight: 98, vars: { n, total } });
  }
  if (signals.failure) {
    const n = countWith('failure');
    if (n === 1) out.push({ id: 'reasons.onlyFailure', weight: 96 });
  }
  if (signals.method) {
    const n = countWith('method');
    if (n === 1) out.push({ id: 'reasons.onlyMethod', weight: 94 });
  }
  return out;
}

/**
 * Signals for a whole inventory, extracted once.
 *
 * Hoisted out of `reasonFor` because the inventory view called it per row and
 * it re-extracted the entire inventory each time — n^2 synchronous signal
 * extraction on the most-used screen, measured at ~100ms per click at 60
 * proofs and 4.9s at 600. `MAX_PROOFS` does not bound it: imported files are
 * uncapped, and pinned and compounded units bypass truncation.
 */
export function inventorySignals(inventory = []) {
  const map = new Map();
  for (const proof of inventory) map.set(proof.id, extractSignals(proof.claim));
  return map;
}

/**
 * The single best reason to show for a proof, given the whole inventory.
 *
 * @param {object} proof
 * @param {object[]} inventory  all active proofs, for comparison
 * @param {Map<string, object>} [cache] precomputed signals, for list rendering
 * @returns {Reason|null}
 */
export function reasonFor(proof, inventory = [], cache = null) {
  const signals = cache?.get(proof.id) ?? extractSignals(proof.claim);
  const inventorySignalList = inventory.map(
    (p) => cache?.get(p.id) ?? (p.id === proof.id ? signals : extractSignals(p.claim)),
  );
  const all = [
    ...comparativeReasons(proof.claim, signals, inventorySignalList),
    ...intrinsicReasons(signals),
  ];
  if (!all.length) return null;
  return all.sort((a, b) => b.weight - a.weight)[0];
}

/**
 * Pick the three units for the First Light reveal.
 *
 * Not simply the top three by score: the reveal's promise is *"three you would
 * never have published yourself"*, so it prefers strong evidence the user is
 * least likely to rate highly — third-party validation, an analysed failure, a
 * written method — and it enforces variety so the reveal is not three
 * paraphrases of the same accomplishment.
 *
 * @returns {object[]} up to three proofs
 */
export function revealPicks(proofs, limit = 3) {
  if (proofs.length <= limit) return [...proofs];

  const scored = proofs.map((proof) => {
    const signals = extractSignals(proof.claim);
    // Surprise: qualities users systematically under-rate in their own material.
    let surprise = 0;
    if (signals.thirdParty) surprise += 18;
    if (signals.failure) surprise += 22;
    if (signals.method) surprise += 16;
    if (signals.peer) surprise += 14;
    if (signals.hasScaleUnit) surprise += 8;
    if (signals.generic) surprise -= 25;
    return { proof, signals, rank: proof.score + surprise };
  });

  scored.sort((a, b) => b.rank - a.rank);

  const picks = [];
  const usedKinds = new Set();
  for (const entry of scored) {
    if (picks.length >= limit) break;
    if (usedKinds.has(entry.proof.kind)) continue;
    picks.push(entry.proof);
    usedKinds.add(entry.proof.kind);
  }
  // Backfill if the variety rule left us short.
  for (const entry of scored) {
    if (picks.length >= limit) break;
    if (!picks.includes(entry.proof)) picks.push(entry.proof);
  }
  return picks;
}

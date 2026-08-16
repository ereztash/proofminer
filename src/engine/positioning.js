/**
 * L2 — positioning quality.
 *
 * The single claim the user owns. Scored on five components, with the heaviest
 * penalty reserved for the thing this ICP produces by default: a fluent,
 * grammatical sentence that describes half the market.
 */

import { clamp100, round } from '../core/util.js';
import { tokenize, wordCount } from './text.js';

/**
 * Category filler that survives editing because it sounds professional.
 * Every one of these words is used by thousands of people making the same
 * claim, which is precisely why it carries no separation.
 */
const FILLER = [
  /אסטרטג/u, /הוליסט/u, /חדשנ/u, /מקצוענ/u, /יצירתי/u, /מנוסה/u, /מוביל דעה/u,
  /פורץ דרך/u, /מותאם אישית/u, /תוצאות מוכחות/u, /ערך אמיתי/u, /פתרונות/u,
  /strategic/iu, /holistic/iu, /innovative/iu, /passionate/iu, /results-?driven/iu,
  /cutting-?edge/iu, /best-?in-?class/iu, /thought leader/iu, /solutions/iu,
  /value-?driven/iu, /world-?class/iu, /game-?chang/iu,
];

/** The template that makes every consultant sound identical. */
const HELP_TEMPLATE = /(?:אני\s+)?(?:עוזר|מסייע|מלווה)\s+ל?\S+\s+(?:ל|להשיג|לייצר)/u;
const HELP_TEMPLATE_EN = /i help \w+ (?:to )?\w+/iu;

const countFiller = (text) => FILLER.filter((re) => re.test(text)).length;

/**
 * Specificity of a free-text field: rewards concrete nouns and numbers,
 * penalises filler and pure length.
 */
function fieldSpecificity(text, { idealWords = 8 } = {}) {
  const trimmed = (text || '').trim();
  if (!trimmed) return 0;
  const words = wordCount(trimmed);
  const content = tokenize(trimmed).length;
  const filler = countFiller(trimmed);

  let score = 18;
  score += Math.min(content, 8) * 7; // concrete content words
  if (/\d/.test(trimmed)) score += 8; // a number in a positioning line is rare and good
  // Vagueness by brevity, and vagueness by sprawl, are both failures.
  if (words < 3) score -= 25;
  if (words > idealWords * 3) score -= 15;
  score -= filler * 16;
  return clamp100(score);
}

/**
 * Score the positioning statement.
 * @param {object} positioning
 * @returns {{score:number, confidence:number, components:Record<string,number>, issues:object[]}}
 */
export function scorePositioning(positioning, recognitions = []) {
  const p = positioning || {};
  const audience = (p.audience || '').trim();
  const transformation = (p.transformation || '').trim();
  const claim = (p.claim || '').trim();
  const offer = (p.offer || '').trim();

  const filled = [audience, transformation, claim, offer].filter(Boolean).length;

  const components = {
    audience: fieldSpecificity(audience, { idealWords: 7 }),
    transformation: fieldSpecificity(transformation, { idealWords: 10 }),
    claim: fieldSpecificity(claim, { idealWords: 12 }),
    offerCoupling: offer ? fieldSpecificity(offer, { idealWords: 8 }) : 0,
    nonGenericity: 0,
    defensibility: 0,
  };

  // Non-genericity is measured across the whole statement, because filler
  // migrates between fields when a user edits one at a time.
  const all = [audience, transformation, claim, offer].join(' ');
  let nonGeneric = 82;
  nonGeneric -= countFiller(all) * 18;
  if (HELP_TEMPLATE.test(all) || HELP_TEMPLATE_EN.test(all)) nonGeneric -= 20;
  if (/\d/.test(all)) nonGeneric += 8;
  if (Array.isArray(p.nonGoals) && p.nonGoals.length) nonGeneric += 10; // naming what you are not is separation
  components.nonGenericity = filled ? clamp100(nonGeneric) : 0;

  // Integration I6 — third-party recognition raises defensibility.
  //
  // A claim you make about yourself and a claim other people repeat about you
  // are not the same claim. This is the only component of positioning that the
  // user cannot raise by editing a text box, which is exactly why it belongs
  // here: it is the part of "what you own" that someone else has to grant.
  components.defensibility = filled ? defensibilityScore(claim, recognitions) : 0;

  const weights = {
    audience: 0.21,
    transformation: 0.19,
    claim: 0.21,
    offerCoupling: 0.10,
    nonGenericity: 0.16,
    defensibility: 0.13,
  };
  let score = 0;
  for (const [key, w] of Object.entries(weights)) score += components[key] * w;

  return {
    score: clamp100(score),
    confidence: filled / 4,
    components,
    issues: positioningIssues({ audience, transformation, claim, offer, components, p }),
  };
}

/** How much of the recognition weight per type transfers to the claim. */
const RECOGNITION_DEFENSIBILITY = {
  endorsement: 6, citation: 10, referral: 12, feature: 16, invite: 16,
};

/**
 * Defensibility of the claim, given who else has vouched for it.
 *
 * Starts low deliberately: an unvouched claim is not indefensible, it is
 * merely unwitnessed, so the floor is 20 rather than 0. Named sources count
 * for more than anonymous ones, and a linked source more than a named one.
 */
export function defensibilityScore(claim, recognitions = []) {
  if (!claim.trim()) return 0;
  let v = 20;
  for (const r of recognitions) {
    let value = RECOGNITION_DEFENSIBILITY[r.type] ?? 6;
    if (r.by?.trim()) value += 4;
    if (r.url?.trim()) value += 4;
    v += value;
  }
  // Naming what you are not is itself a defensibility move, but a small one.
  return clamp100(v);
}

/**
 * Concrete, actionable problems with the positioning — never a grade, always
 * a next edit. `severity` orders them; `field` lets the UI focus the input.
 */
function positioningIssues({ audience, transformation, claim, offer, components, p }) {
  const issues = [];
  const push = (id, field, severity) => issues.push({ id, field, severity });

  if (!audience) push('audience.missing', 'audience', 3);
  else if (components.audience < 45) push('audience.vague', 'audience', 2);

  if (!transformation) push('transformation.missing', 'transformation', 3);
  else if (components.transformation < 45) push('transformation.vague', 'transformation', 2);

  if (!claim) push('claim.missing', 'claim', 2);
  else if (components.claim < 45) push('claim.vague', 'claim', 2);

  if (!offer) push('offer.missing', 'offer', 1);

  const all = [audience, transformation, claim, offer].join(' ');
  if (countFiller(all) > 0) push('filler', 'claim', 3);
  if (HELP_TEMPLATE.test(all) || HELP_TEMPLATE_EN.test(all)) push('template', 'claim', 2);
  if (!Array.isArray(p.nonGoals) || !p.nonGoals.length) push('nonGoals.missing', 'nonGoals', 1);

  return issues.sort((a, b) => b.severity - a.severity);
}

/**
 * Integration I4 — claim validation via conversion.
 *
 * The question is real: is the market buying what you say you sell? The first
 * implementation answered it by counting shared words between the declared
 * claim and the proof units behind converting artifacts, and that measure
 * cannot answer it. Measured on realistic pairs, a proof plainly on topic but
 * worded differently — claim "מערכי אספקה שאפשר לסמוך עליהם", evidence
 * "קיצרתי את זמן האספקה מ-19 יום ל-7 ימים" — scores **0.000**, exactly the
 * same as evidence about an unrelated subject. Only near-literal restatement
 * scored above the threshold, so a perfectly coherent user was told their
 * positioning does not match what works. Bridging that gap needs embeddings,
 * which this product deliberately does not carry.
 *
 * So the comparison is made on ground the engine can actually stand on:
 * **archetypes**. Which kind of evidence produced inbound is countable, and it
 * is classified by the same signal engine that scores everything else. Drift is
 * now the statement "the kind of evidence that converts for you is not the kind
 * you are publishing" — observable on both sides, and a more useful sentence
 * than a similarity score in any case.
 *
 * Returns null when there is not enough conversion data to say anything, which
 * is the honest answer for most users most of the time.
 */
export function detectDrift(state, { minConversions = 3 } = {}) {
  const converting = (state.conversions || []).filter((c) => c.artifactId);
  if (converting.length < minConversions) return null;

  const proofById = new Map((state.proofs || []).map((p) => [p.id, p]));
  const artifactById = new Map((state.artifacts || []).map((a) => [a.id, a]));

  /** @type {Record<string, number[]>} archetype -> conversion weights */
  const byArchetype = {};
  for (const conv of converting) {
    const artifact = artifactById.get(conv.artifactId);
    if (!artifact) continue;
    for (const proofId of artifact.proofIds) {
      const proof = proofById.get(proofId);
      if (!proof) continue;
      for (const archetype of proof.archetypes) {
        (byArchetype[archetype] ||= []).push(1);
      }
    }
  }

  const ranked = Object.entries(byArchetype)
    .map(([archetype, hits]) => ({ archetype, count: hits.length }))
    .sort((a, b) => b.count - a.count);

  if (!ranked.length) return null;

  // What the user actually publishes, by archetype, over everything published —
  // the other side of the comparison.
  const publishedCounts = {};
  for (const artifact of state.artifacts || []) {
    if (artifact.status !== 'published') continue;
    for (const proofId of artifact.proofIds) {
      const proof = proofById.get(proofId);
      if (!proof) continue;
      for (const archetype of proof.archetypes) {
        publishedCounts[archetype] = (publishedCounts[archetype] || 0) + 1;
      }
    }
  }
  const publishedTotal = Object.values(publishedCounts).reduce((a, b) => a + b, 0);

  const topArchetype = ranked[0].archetype;
  const convertingShare = ranked[0].count / ranked.reduce((a, r) => a + r.count, 0);
  const publishedShare = publishedTotal
    ? (publishedCounts[topArchetype] || 0) / publishedTotal
    : 0;

  return {
    topArchetype,
    ranked,
    convertingShare: round(convertingShare, 3),
    publishedShare: round(publishedShare, 3),
    /**
     * Drifting when one kind of evidence clearly dominates what converts while
     * being under-represented in what the user publishes. Both sides are
     * counts, so the claim is checkable by the user against their own records.
     */
    drifting: publishedTotal > 0 && convertingShare >= 0.5 && publishedShare < convertingShare - 0.2,
    observations: converting.length,
  };
}

/**
 * L2 — positioning quality.
 *
 * The single claim the user owns. Scored on five components, with the heaviest
 * penalty reserved for the thing this ICP produces by default: a fluent,
 * grammatical sentence that describes half the market.
 */

import { clamp100, mean } from '../core/util.js';
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
export function scorePositioning(positioning) {
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

  const weights = {
    audience: 0.24,
    transformation: 0.22,
    claim: 0.24,
    offerCoupling: 0.12,
    nonGenericity: 0.18,
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
 * Compares what actually converted against the claim the user says they own.
 * When the artifacts that produced conversions are grounded in proof units
 * that do not resemble the declared claim, the market is buying something
 * other than what is being sold.
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

  const claimTokens = new Set(tokenize(state.positioning?.claim || ''));
  const convertingProofs = converting
    .map((c) => artifactById.get(c.artifactId))
    .filter(Boolean)
    .flatMap((a) => a.proofIds.map((id) => proofById.get(id)))
    .filter(Boolean);

  const overlapScores = convertingProofs.map((proof) => {
    const tokens = new Set(tokenize(proof.claim));
    if (!claimTokens.size || !tokens.size) return 0;
    let shared = 0;
    for (const t of claimTokens) if (tokens.has(t)) shared += 1;
    return shared / claimTokens.size;
  });

  const alignment = mean(overlapScores);
  return {
    topArchetype: ranked[0].archetype,
    ranked,
    alignment: Number(alignment.toFixed(3)),
    drifting: claimTokens.size > 0 && alignment < 0.15,
    observations: converting.length,
  };
}

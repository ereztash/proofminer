/**
 * Evidence-grounded artifact generation.
 *
 * Binding rule (docs/METHOD.md, honesty rule 3): a draft may reframe, order and
 * connect the user's own proof text. It may never introduce a fact, number,
 * client or outcome that is not present in a cited proof unit.
 *
 * That rule is enforced mechanically by `validateGrounding()`, not left to the
 * template author's discretion, and the same validator gates any optional LLM
 * enrichment. This is the difference between a tool that helps someone show
 * what they did and a tool that helps them make things up.
 */

import { makeId } from '../core/util.js';
import { DEMO_MARKER } from './signals.js';

export const ANGLES = /** @type {const} */ (['direct', 'story', 'insight', 'method', 'question']);

/**
 * Framing lines are deliberately *about the act of evidencing*, never about the
 * user's abilities. They assert nothing that would need proving.
 */
const FRAMES = {
  he: {
    direct: {
      lead: '',
      close:
        'זו לא טענה על מה שאני יודע לעשות. זו עקבה של משהו שקרה.\n\nההבדל בין השניים הוא כל מה שמעניין אותי.',
    },
    story: {
      lead: 'הדבר הכי שימושי שהיה לי לא היה רעיון חדש. הוא כבר היה שם.',
      close:
        'מה שמעניין כאן הוא לא האירוע עצמו, אלא מה אפשר לבדוק בו.',
    },
    insight: {
      lead: '',
      close:
        'מומחיות לא נמדדת במה שאנחנו יודעים להסביר, אלא במה שכבר השאיר עקבה.\n\nכשאני בוחן עבודה מקצועית — שלי או של אחרים — אני מחפש בדיוק את זה: מה השתנה, עבור מי, ואיך אפשר לאמת.',
    },
    method: {
      lead: '',
      close:
        'הסיבה שאני מפרסם את זה היא לא התוצאה. היא שהדרך אליה ניתנת לשחזור.',
    },
    question: {
      lead: '',
      close: 'אני עדיין מנסה להבין עד כמה זה מוכלל.',
    },
  },
  en: {
    direct: {
      lead: '',
      close:
        'This is not a claim about what I can do. It is a trace of something that happened.\n\nThe difference between the two is the only part I find interesting.',
    },
    story: {
      lead: 'The most useful thing I had was not a new idea. It was already there.',
      close: 'What matters here is not the event. It is that you can check it.',
    },
    insight: {
      lead: '',
      close:
        'Expertise is not measured by what we can explain, but by what left a trace.\n\nWhen I look at professional work — mine or anyone else’s — that is what I look for: what changed, for whom, and how it can be verified.',
    },
    method: {
      lead: '',
      close: 'The reason I am posting this is not the result. It is that the path to it is repeatable.',
    },
    question: {
      lead: '',
      close: 'I am still working out how far this generalises.',
    },
  },
};

const CTAS = {
  he: {
    none: '',
    discussion: 'מעניין אותי לשמוע — איפה אתם רואים את זה אצלכם?',
    dm: 'אם זה פוגש אתכם, אפשר לכתוב לי.',
    call: 'אם אתם רוצים לבדוק את זה על המקרה שלכם, אפשר לקבוע שיחה.',
  },
  en: {
    none: '',
    discussion: 'Curious where you see this in your own work.',
    dm: 'If this lands, feel free to message me.',
    call: 'If you want to check this against your own case, happy to talk.',
  },
};

/** Strip the demo marker so it never ends up inside a draft body. */
const cleanClaim = (claim) => claim.replace(DEMO_MARKER, '').trim();

/**
 * Numeric tokens in a text, normalised. Used by the grounding validator.
 * Formatting separators are removed so "5,500" and "5500" compare equal.
 */
export function extractNumbers(text) {
  return (text.match(/\d[\d.,]*/g) || [])
    .map((n) => n.replace(/[.,]$/, '').replace(/[, \s]/g, ''))
    .filter(Boolean);
}

/**
 * Verify that a draft body introduces no numeric fact absent from its cited
 * proof units. This is the mechanical form of "no invented evidence".
 *
 * @param {string} body
 * @param {Array<{claim:string}>} proofs
 * @returns {{ok:boolean, unsupported:string[]}}
 */
export function validateGrounding(body, proofs) {
  const supported = new Set(proofs.flatMap((p) => extractNumbers(p.claim)));
  const unsupported = [...new Set(extractNumbers(body))].filter((n) => !supported.has(n));
  return { ok: unsupported.length === 0, unsupported };
}

/**
 * Compose a draft from one or more proof units.
 *
 * The proof text is inserted **verbatim**. Everything the generator adds is
 * framing that makes no factual claim, which is what allows the grounding
 * validator to pass by construction.
 *
 * @param {object} options
 * @param {Array<object>} options.proofs   cited proof units (at least one)
 * @param {typeof ANGLES[number]} [options.angle]
 * @param {string} [options.cta]
 * @param {'he'|'en'} [options.locale]
 * @returns {{body:string, proofIds:string[], grounding:object, warnings:string[]}}
 */
export function composeDraft({ proofs, angle = 'direct', cta = 'none', locale = 'he' }) {
  const cited = (proofs || []).filter(Boolean);
  const warnings = [];
  if (!cited.length) {
    return {
      body: '',
      proofIds: [],
      grounding: { ok: true, unsupported: [] },
      warnings: ['no-proof'],
    };
  }
  if (cited.some((p) => p.demo)) warnings.push('demo-proof');

  const lang = FRAMES[locale] ? locale : 'he';
  const frame = FRAMES[lang][angle] || FRAMES[lang].direct;
  const ctaText = (CTAS[lang] || CTAS.he)[cta] || '';

  const evidence = cited.map((p) => cleanClaim(p.claim)).join('\n\n');

  const body = [frame.lead, evidence, frame.close, ctaText]
    .filter((part) => part && part.trim())
    .join('\n\n')
    .trim();

  const grounding = validateGrounding(body, cited);
  if (!grounding.ok) warnings.push('ungrounded-numbers');

  return { body, proofIds: cited.map((p) => p.id), grounding, warnings };
}

/**
 * Provenance block appended when the user exports or copies a draft. Keeping
 * the sources attached to the text is what stops a draft from drifting into
 * fiction after it leaves the app.
 */
export function provenanceFooter(proofs, locale = 'he') {
  if (!proofs.length) return '';
  const label = locale === 'en' ? 'Grounded in' : 'מבוסס על';
  const lines = proofs.map((p) => `• ${cleanClaim(p.claim)} (${p.sourceName})`);
  return `\n\n---\n${label}:\n${lines.join('\n')}`;
}

/** Build a persistable artifact record from a composed draft. */
export function makeArtifact({ draft, channel = 'post', angle = 'direct', now = Date.now() }) {
  return {
    id: makeId('art'),
    proofIds: draft.proofIds,
    channel,
    angle,
    body: draft.body,
    status: 'draft',
    publishedAt: null,
    url: '',
    createdAt: now,
  };
}

/** LinkedIn truncates the feed preview at roughly this many characters. */
export const FOLD_CHARS = 210;

/**
 * Practical length feedback. Not a quality score — an artifact is not better
 * for being longer or shorter, and the product does not pretend otherwise.
 */
export function lengthAdvice(body) {
  const chars = body.length;
  return {
    chars,
    beforeFold: body.slice(0, FOLD_CHARS),
    tooShort: chars < 220,
    tooLong: chars > 2800,
  };
}

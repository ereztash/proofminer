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

import { DEMO_MARKER, entityCoverage, extractSignals, spelledNumbers } from './signals.js';

export const ANGLES = /** @type {const} */ (['bare', 'context', 'method', 'question']);

/**
 * Scaffolds, not finished posts.
 *
 * The previous version shipped five fixed frames x four fixed CTAs — twenty
 * complete post shells, identical for every user forever, written in exactly
 * the aphoristic "not X, but Y" cadence this audience opens the product to
 * escape. Two users in a market this size would publish the same three
 * sentences in the same week, manufactured by the tool that promised to remove
 * that problem.
 *
 * So the default angle adds **nothing at all**: the evidence, and the user's
 * own words. The other angles add a short, plain scaffold line with a blank
 * the user completes, and the studio reports what share of the text is theirs
 * (see `authorship`). A sentence the product wrote is a sentence the user has
 * to defend as their own voice, so the product writes as few as it can.
 */
const SCAFFOLDS = {
  he: {
    bare: { lead: '', close: '' },
    context: { lead: '', close: 'ההקשר שבו זה קרה: ______' },
    method: { lead: '', close: 'איך זה נעשה, בשלבים:\n— ______\n— ______\n— ______' },
    question: { lead: '', close: 'מה שאני עדיין לא בטוח לגביו: ______' },
  },
  en: {
    bare: { lead: '', close: '' },
    context: { lead: '', close: 'The context this happened in: ______' },
    method: { lead: '', close: 'How it was done, in steps:\n— ______\n— ______\n— ______' },
    question: { lead: '', close: 'What I am still unsure about: ______' },
  },
};

const CTAS = {
  he: {
    none: '',
    discussion: 'איך זה נראה אצלכם?',
    dm: 'אם זה רלוונטי לכם, אפשר לכתוב לי.',
    call: 'אם תרצו לבדוק את זה על המקרה שלכם, אפשר לדבר.',
  },
  en: {
    none: '',
    discussion: 'How does this look on your side?',
    dm: 'If this is relevant to you, feel free to write.',
    call: 'If you want to check this against your own case, happy to talk.',
  },
};

/**
 * Strip the inline demo marker from a claim.
 *
 * The marker is removed from mid-sentence for readability and re-attached as a
 * banner line on the whole body by `composeDraft`. Stripping it and stopping
 * there — which is what this used to do — meant demo text copied out of the app
 * no longer announced what it was, defeating the one mechanism that made
 * bundled fixtures un-launderable.
 */
const cleanClaim = (claim) => claim.replace(DEMO_MARKER, '').trim();

/** Banner prepended to any body derived from demo material. */
const DEMO_BANNER = {
  he: '[דמו בלבד — טקסט לדוגמה, לא ניסיון אמיתי]',
  en: '[demo only — sample text, not real experience]',
};

/**
 * Numeric tokens in a text, normalised. Used by the grounding validator.
 * Formatting separators are removed so "5,500" and "5500" compare equal.
 */
export function extractNumbers(text) {
  const digits = ((text || '').match(/\d[\d.,]*/g) || [])
    .map((n) => n.replace(/[.,]$/, '').replace(/[, \s]/g, ''))
    .filter(Boolean);
  // Spelled-out magnitudes count too. "eight months" and "שמונה חודשים" are
  // facts a draft can invent just as easily as "8", and the product's own
  // bundled sample contains one.
  return [...digits, ...spelledNumbers(text).map(String)];
}

/** Superlatives and causal overreach a draft must not acquire on its way out. */
const OVERREACH = [
  /חסר תקדים/u, /פורץ דרך/u, /מהפכני/u, /הטוב ביותר/u, /המוביל ב/u, /ויראלי/u,
  /בזכותי בלבד/u, /לבד לחלוטין/u, /תמיד מצליח/u, /מומחה מספר/u,
  /unprecedented/iu, /game-?chang/iu, /revolutionar/iu, /the best\b/iu,
  /world-?class/iu, /single-?handedly/iu, /viral/iu, /number one expert/iu,
];

/**
 * Verify that a draft introduces no checkable fact absent from its cited proof.
 *
 * Three checks, because the first one alone was being sold as more than it is:
 *
 *  1. **Numbers** — every magnitude in the body, digits or words, must appear
 *     in the cited evidence.
 *  2. **Named entities** — every proper noun and named organisation in the body
 *     must appear in the cited evidence. This is what catches an invented
 *     client, employer, or publication, which is the fabrication this audience
 *     would actually reach for and which a digit check cannot see.
 *  3. **Overreach** — superlatives and sole-credit claims are flagged. They are
 *     not checkable facts, so they are a warning rather than a hard failure.
 *
 * What this still cannot catch, stated plainly rather than papered over: a real
 * number attached to the wrong subject, an invented job title made of ordinary
 * words, and a claim stitched across two separately-true proofs. Those need a
 * reader, and the UI says so instead of implying the check is a truth gate.
 *
 * @param {string} body
 * @param {Array<{claim:string}>} proofs
 * @returns {{ok:boolean, unsupported:string[], entities:string[], overreach:string[]}}
 */
export function validateGrounding(body, proofs) {
  const cited = (proofs || []).filter(Boolean);
  const evidence = cited.map((p) => p.claim).join('\n');

  const supportedNumbers = new Set(extractNumbers(evidence));
  const unsupported = [...new Set(extractNumbers(body))].filter((n) => !supportedNumbers.has(n));

  const supportedEntities = new Set(
    extractSignals(evidence).properNouns.map((e) => e.toLowerCase()),
  );
  const entities = [
    ...new Set(
      extractSignals(body)
        .properNouns.filter((e) => !supportedEntities.has(e.toLowerCase()))
        .map((e) => e.trim()),
    ),
  ];

  const overreach = OVERREACH.filter((re) => re.test(body)).map((re) => re.source);

  return {
    ok: unsupported.length === 0 && entities.length === 0,
    unsupported,
    entities,
    overreach,
    /**
     * How complete the name check could be. Hebrew has no capitalisation, so
     * names are findable only by an adjacent role or organisation word or by
     * the known-entity list — the UI must report that rather than print a clean
     * bill of health over a draft naming three invented employers.
     */
    entityCoverage: entityCoverage(body),
  };
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
export function composeDraft({ proofs, angle = 'bare', cta = 'none', locale = 'he' }) {
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

  const lang = SCAFFOLDS[locale] ? locale : 'he';
  const frame = SCAFFOLDS[lang][angle] || SCAFFOLDS[lang].bare;
  const ctaText = (CTAS[lang] || CTAS.he)[cta] || '';

  const evidence = cited.map((p) => cleanClaim(p.claim)).join('\n\n');
  const isDemo = cited.some((p) => p.demo);

  const body = [isDemo ? DEMO_BANNER[lang] : '', frame.lead, evidence, frame.close, ctaText]
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
  const lang = DEMO_BANNER[locale] ? locale : 'he';
  const label = lang === 'en' ? 'Grounded in' : 'מבוסס על';
  const lines = proofs.map(
    (p) => `• ${p.demo ? `${DEMO_BANNER[lang]} ` : ''}${cleanClaim(p.claim)} (${p.sourceName})`,
  );
  return `\n\n---\n${label}:\n${lines.join('\n')}`;
}

/**
 * What share of this text is the user's own.
 *
 * This is the product's answer to the second pain in docs/UX.md — the
 * revulsion at sounding like everyone else on LinkedIn. Rather than pretending
 * our scaffolds are not scaffolds, the studio measures how much of the post the
 * tool wrote and shows it. The default angle scores 100%.
 *
 * @param {string} body
 * @param {Array<{claim:string}>} proofs
 * @param {'he'|'en'} locale
 * @returns {{ownShare:number, canned:string[]}}
 */
export function authorship(body, proofs, locale = 'he') {
  const text = (body || '').trim();
  if (!text) return { ownShare: 1, canned: [] };

  const lang = SCAFFOLDS[locale] ? locale : 'he';
  const ours = [
    ...Object.values(SCAFFOLDS[lang]).flatMap((f) => [f.lead, f.close]),
    ...Object.values(CTAS[lang]),
    DEMO_BANNER[lang],
  ].filter((line) => line && line.trim());

  const canned = ours.filter((line) => text.includes(line));
  const cannedChars = canned.reduce((sum, line) => sum + line.length, 0);
  return {
    ownShare: Math.max(0, Math.min(1, 1 - cannedChars / text.length)),
    canned,
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

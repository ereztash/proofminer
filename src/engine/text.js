/**
 * Language-aware text processing for Hebrew and English.
 *
 * Hebrew is treated as a first-class language, not as "not English": niqqud is
 * stripped, final letters are normalised, and the single-letter prefixes that
 * carry syntax (ו/ה/ב/ל/מ/ש/כ) are removed before matching, because without
 * that "ללקוח" and "לקוח" never match and every similarity measure collapses.
 */

const HEBREW_LETTERS = /[א-ת]/;
const NIQQUD = /[֑-ׇ]/g;
const GERESH = /[׳״'"]/g;

/** Final-form letters mapped to their base form. */
const FINAL_FORMS = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' };

/** Hebrew single-letter prefixes worth stripping for token matching. */
const HE_PREFIXES = ['ומ', 'ול', 'וב', 'וה', 'וכ', 'ש', 'ו', 'ה', 'ב', 'ל', 'מ', 'כ'];

const HE_STOPWORDS = new Set([
  'של', 'את', 'על', 'עם', 'זה', 'זו', 'אני', 'אתה', 'הוא', 'היא', 'הם', 'הן',
  'לא', 'כן', 'גם', 'רק', 'אבל', 'או', 'אם', 'כי', 'כך', 'אשר', 'יש', 'אין',
  'היה', 'היתה', 'הייתי', 'להיות', 'יותר', 'פחות', 'מאוד', 'כל', 'כמה', 'איך',
  'מה', 'מי', 'למה', 'איפה', 'שם', 'פה', 'כאן', 'אז', 'עכשיו', 'תוך', 'בין',
  'אחרי', 'לפני', 'בתוך', 'ללא', 'בלי', 'אצל', 'לכן', 'כדי', 'בגלל', 'עוד',
  'אותו', 'אותה', 'שלי', 'שלו', 'שלה', 'שלהם', 'להם', 'לנו', 'אנחנו', 'הזה',
]);

const EN_STOPWORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'was', 'were', 'are',
  'have', 'has', 'had', 'not', 'but', 'you', 'your', 'they', 'them', 'their',
  'our', 'its', 'his', 'her', 'she', 'him', 'who', 'what', 'when', 'where',
  'which', 'been', 'being', 'into', 'over', 'more', 'most', 'some', 'any',
  'all', 'can', 'will', 'would', 'could', 'should', 'about', 'after', 'before',
  'than', 'then', 'there', 'here', 'also', 'just', 'only', 'very', 'much',
]);

/**
 * Detect the dominant script.
 * @returns {'he'|'en'}
 */
export function detectLanguage(text) {
  if (!text) return 'he';
  const hebrew = (text.match(/[א-ת]/g) || []).length;
  const latin = (text.match(/[A-Za-z]/g) || []).length;
  if (hebrew === 0 && latin === 0) return 'he';
  return hebrew >= latin ? 'he' : 'en';
}

export const hasHebrew = (text) => HEBREW_LETTERS.test(text || '');

/** Strip niqqud, geresh/gershayim and normalise final letters. */
export function normalizeHebrew(word) {
  let out = word.replace(NIQQUD, '').replace(GERESH, '');
  for (const [final, base] of Object.entries(FINAL_FORMS)) {
    out = out.split(final).join(base);
  }
  return out;
}

/**
 * Remove a leading Hebrew prefix when doing so leaves a plausible stem.
 * Conservative: only strips when at least three letters remain.
 *
 * This is inherently ambiguous without a lexicon — `לקוחות` ("clients") starts
 * with the same ל that marks the dative prefix, and stripping it produces
 * nonsense. That is why the stripped form is never used *instead of* the
 * original: `tokenVariants()` keeps both, and matching succeeds if either form
 * lines up. Over-generating variants costs a little precision; replacing a
 * content word with a mangled stem costs correctness.
 */
export function stripHebrewPrefix(word) {
  if (word.length < 4) return word;
  for (const prefix of HE_PREFIXES) {
    if (word.startsWith(prefix) && word.length - prefix.length >= 3) {
      return word.slice(prefix.length);
    }
  }
  return word;
}

/** Fold a single token to its canonical comparison form (no prefix stripping). */
export function foldToken(token) {
  const lower = token.toLocaleLowerCase();
  if (HEBREW_LETTERS.test(lower)) return normalizeHebrew(lower);
  return lower;
}

/**
 * All forms a token may legitimately match under: itself, plus its
 * prefix-stripped form when Hebrew prefix removal applies.
 */
export function tokenVariants(token) {
  if (!HEBREW_LETTERS.test(token)) return [token];
  const stripped = stripHebrewPrefix(token);
  return stripped === token ? [token] : [token, stripped];
}

/** Variant set of a whole text, used by every similarity measure. */
export function tokenSet(text) {
  const set = new Set();
  for (const token of tokenize(text)) {
    for (const variant of tokenVariants(token)) set.add(variant);
  }
  return set;
}

/**
 * Split text into comparable content tokens with stopwords removed.
 * @returns {string[]}
 */
export function tokenize(text) {
  if (!text) return [];
  const rawTokens = text.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const out = [];
  for (const raw of rawTokens) {
    const folded = foldToken(raw);
    if (!folded) continue;
    const isHe = HEBREW_LETTERS.test(folded);
    if (isHe) {
      if (folded.length < 2 || HE_STOPWORDS.has(folded)) continue;
    } else if (/^\d+$/.test(folded)) {
      out.push(folded);
      continue;
    } else if (folded.length < 3 || EN_STOPWORDS.has(folded)) {
      continue;
    }
    out.push(folded);
  }
  return out;
}

/**
 * Sørensen–Dice similarity over token sets. Symmetric, 0..1.
 * Preferred over the min-set overlap used by the original MVP, which reported
 * 1.0 whenever one text was a superset of the other and so merged distinct
 * evidence.
 */
export function similarity(a, b) {
  const A = tokenSet(a);
  const B = tokenSet(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const t of A) if (B.has(t)) shared += 1;
  return (2 * shared) / (A.size + B.size);
}

/**
 * Containment: how much of `inner` appears in `outer`. Asymmetric, 0..1.
 * Used for near-duplicate detection where one proof unit restates another.
 */
export function containment(inner, outer) {
  const A = tokenSet(inner);
  const B = tokenSet(outer);
  if (!A.size) return 0;
  let shared = 0;
  for (const t of A) if (B.has(t)) shared += 1;
  return shared / A.size;
}

/**
 * Relevance of `text` against a context string, on 0..1.
 * Uses containment of the context in the text (we care whether the proof
 * speaks to the audience, not whether the audience description is exhaustive)
 * blended with symmetric similarity so long rambling proofs do not win by
 * covering everything.
 */
export function contextRelevance(text, context) {
  if (!context.trim()) return 0;
  return 0.6 * containment(context, text) + 0.4 * similarity(text, context);
}

/**
 * Lines that are contact details or document furniture rather than claims.
 *
 * A CV header — name, city, mobile, email — was being mined as a proof unit,
 * ranked mid-inventory, and offered in the publish picker. For a product whose
 * first promise is that nothing leaves your machine, suggesting the user's own
 * phone number as publishable evidence is the wrong kind of surprise.
 */
const CONTACT_MARKERS = [
  /[\w.+-]+@[\w-]+\.[\w.]{2,}/u,
  /(?:^|\D)0\d{1,2}[-\s]?\d{3}[-\s]?\d{4}(?:\D|$)/u,
  /\+\d{1,3}[-\s]?\d{2,3}[-\s]?\d{3}[-\s]?\d{4}/u,
  /linkedin\.com\/in\//iu,
];

/** A document title standing alone on its own line. */
const HEADER_LINE = /^\s*(?:קורות חיים|resume|curriculum vitae|cv)\s*[-–—:|]?\s*$/iu;

/**
 * True when a line is contact details or document furniture rather than a claim.
 *
 * Two rules, both deliberately narrow. A contact marker only disqualifies a
 * line that is *mostly* contact details — a header of name, city, phone and
 * email separated by pipes — because a legitimate claim can contain a link or
 * an address ("grew the newsletter to 40,000 subscribers at support@acme.co.il")
 * and silently deleting it is exactly the wrong default for a product whose
 * job is to stop the user's evidence going missing. A document title
 * disqualifies a line only when it is the whole line: `\b` is ASCII-only even
 * under `/u`, so the Hebrew pattern this filter exists for never matched, while
 * the English one dropped ordinary sentences beginning "CV coaching…".
 */
export function isContactOrFurniture(line) {
  if (HEADER_LINE.test(line)) return true;
  if (!CONTACT_MARKERS.some((re) => re.test(line))) return false;

  // Mostly-contact heuristic: heavy separator use, or short with little prose.
  const separators = (line.match(/[|·•]/gu) || []).length;
  const words = line.split(/\s+/u).filter(Boolean).length;
  return separators >= 2 || (words <= 10 && separators >= 1);
}

/**
 * Split a source document into candidate proof-unit sentences.
 *
 * Handles Hebrew and English terminators, bullet lists, and line breaks.
 * Fragments shorter than `minLength` graphemes are dropped — they are almost
 * always headers, dates or list markers rather than claims.
 */
export function splitSentences(text, minLength = 30) {
  if (!text) return [];
  return text
    .split(/\r?\n+/)
    // A line carrying a quotation stays whole. Splitting on the full stops
    // inside a testimonial separated the quotation from the name attached to
    // it, and the attribution — the part that makes it evidence — became a
    // fragment too short to survive the length floor.
    .flatMap((line) =>
      /["״”].*["״”]/u.test(line) && line.length <= 400
        ? [line]
        : line.split(/(?<=[.!?׃…])\s+/u),
    )
    .flatMap((chunk) => chunk.split(/\s*[•·▪]\s*/u))
    .map((s) => s.replace(/^\s*[-–—*+\d]+[.)\]]?\s*/u, '').trim())
    .filter((s) => s.length >= minLength)
    .filter((s) => !isContactOrFurniture(s));
}

/** Word count, script-aware. */
export const wordCount = (text) =>
  (text || '').split(/[^\p{L}\p{N}]+/u).filter(Boolean).length;

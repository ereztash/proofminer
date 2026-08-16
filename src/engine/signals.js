/**
 * Signal extraction: turn a claim sentence into structured, inspectable
 * features. Dimension scoring reads *only* from this object.
 *
 * The separation matters. The previous implementation computed each dimension
 * from its own inline regex, which meant no signal could be reused, no signal
 * could be shown to the user, and no signal could be tested independently of
 * the score it fed. Here every feature is named, extracted once, and visible
 * in the UI as the reason a score is what it is.
 */

import { detectLanguage, stripHebrewPrefix, wordCount } from './text.js';

/** Marker written into demo text so demo material can never be laundered. */
export const DEMO_MARKER = /\[(?:דמו בלבד|demo only)\]/iu;

const LEX = {
  he: {
    /** Someone other than the author asserted or hosted this. */
    thirdParty: /כתבה|כתבו עלי|ראיון|התראיינ|עיתון|מגזין|פודקאסט|צוטט|ציטט|מצטט|פורסם|התפרסם|כנס|וובינר|פאנל|הרצא|הזמינו אותי|המלצ|לקוח סיפר|לקוחה סיפרה|חוות דעת|ביקורת|פרס|זכי|נבחר|דורג/u,
    /**
     * Something changed in the world.
     *
     * Hebrew verb conjugation is enumerated rather than stemmed: `הפחית` and
     * `הפחתתי` share no usable prefix, so a stem-based pattern would miss the
     * first-person forms users actually write. Bare stems are avoided where
     * they would create false positives (`סגר` is a substring of `מסגרת`).
     */
    outcome: /הגדיל|הגדלתי|הגדלנו|הגדלה|גדלו|גדל ב|צמח|צמחו|צמיחה|העלה|העליתי|הכפיל|הכפלתי|שילש|הפחית|הפחתתי|הפחתנו|הוריד|הורדתי|צמצם|צמצמתי|חסך|חסכתי|חסכנו|קיצר|קיצרתי|ייעל|ייעלתי|שיפר|שיפרתי|הציל|הצלתי|נסגר|נסגרו|סגרתי|סגרנו|הביא|הבאתי|יצר|יצרתי|השיק|השקתי|הקים|הקמתי|בנה|בניתי|הוביל|הובלתי|העביר|העברתי|גייס|גייסתי|החזיר|החזרתי|שיקם|שיקמתי|פתר|פתרתי|מנע|מנעתי|פיתח|פיתחתי|פיתחנו|עיצבתי|הטמעתי|הטמיע|יישמתי|ניהלתי|הכשרתי|אוטמט/u,
    /** Before/after tension — the raw material of a story. */
    contrast: /לפני|אחרי|במשך|בתוך|תוך|מ-?\s*\d+\s*ל-?\s*\d+|מ\S{2,10}\s+ל\S{2,10}|במקום|לעומת|עד ש|מאז|בעקבות|כתוצאה|בזכות|למרות|אף על פי/u,
    credential: /תואר|תעודה|הסמכ|הוסמכ|רישיון|בוגר|מוסמך|דוקטור|ד״ר|תזה|ציון|ממוצע|קורס מקצועי|התמחות/u,
    /** Self-描述 personality claims: the most common and least useful thing users write. */
    generic: /יצירתי|סקרן|אסטרטגי|מקצועי מאוד|תותח|מנוסה מאוד|שנים של ניסיון|אוהב אנשים|חושב מחוץ לקופסה|רעב|נחוש|תשוקה|אכפתי|ראש גדול|בעל ניסיון רב|מוביל דעה|מומחה מוביל|מאמינ\S* ב|עבודת צוות|למידה מתמדת|גישה אישית|תשומת לב לפרטים|ראייה מערכתית|חשיבה מחוץ|אוריינטציה|יחסי אנוש|יכולת גבוהה|כישורים בין-?אישיים|מוטיבציה גבוהה|אחריות אישית|נכונות ללמוד|תודעת שירות|דינמי|פרואקטיבי/u,
    hedge: /אולי|נראה לי|אני מאמין ש|בערך|סוג של|כנראה|לפעמים|יכול להיות|בגדול|פחות או יותר/u,
    /** Named third-party context a sceptic could go and check. */
    verifiable: /באתר|בכתבה|בעיתון|בגלובס|בכלכליסט|ב-?TheMarker|בפודקאסט|בכנס|בערוץ|בלינקדאין|קישור|לינק/u,
    scale: /משתתפים|אנשים|עובדים|לקוחות|מנויים|צפיות|חברות|ארגונים|סניפים|מדינות|צוותים|תלמידים|נרשמו/u,
    method: /שיטה|מתודולוגיה|תהליך|מודל|פריימוורק|מסגרת עבודה|שלבים|פרוטוקול|גישה|כלי שפיתחתי|מערכת שבניתי/u,
    failure: /נכשל|כישלון|טעות|טעיתי|לא עבד|למדתי בדרך הקשה|פספסתי|החמצתי|קרסה|נסגר בהפסד|ויתרתי/u,
    origin: /התחלתי|הגעתי|עברתי|בחרתי|למה אני|הסיפור שלי|לפני שנים|כשהייתי|מה שהוביל אותי/u,
    /** Peer-level recognition rather than client-level. */
    peer: /עמית|קולג|מומחה אחר|בתחום שלי|חבר לתעשייה|מנטור|שותף|ממליץ|המלצה מקצועית/u,
    currency: /(?:₪|ש["״']?ח|שקל|שח|אלף|מיליון|מיליארד)/u,
    duration: /(?:שנ(?:ה|תיים|ים)|חוד(?:ש|שיים|שים)|שבוע(?:ות|יים)?|ימים|יום|רבעון|סמסטר)/u,
    relativeTime: /(?:השנה|החודש|לאחרונה|בימים אלה|כרגע|עכשיו|בשנה האחרונה|בחודשים האחרונים)/u,
  },
  en: {
    thirdParty: /interview(?:ed)?|featured|quoted|cited|article|published (?:in|an|a )|press|magazine|podcast|conference|keynote|panel|webinar|testimonial|review(?:ed)?|award|won|selected|ranked|recommended by/iu,
    outcome: /increas|grew|grow|doubl|tripl|reduc|cut|sav(?:ed|ing)|shorten|improv|optimi[sz]|clos(?:ed)|deliver|launch|built|led|raised|recover|solved|prevent|scal(?:ed)|design(?:ed)?|develop(?:ed)?|implement(?:ed)?|automat(?:ed)?|manage(?:d)?|train(?:ed)?/iu,
    contrast: /before|after|within|from\s+\S+\s+to\s+\S+|instead of|compared to|since|as a result|thanks to|despite|used to/iu,
    credential: /degree|bachelor|master|mba|phd|certifi|licens|accredit|graduat|gpa|thesis|diploma/iu,
    generic: /creative|curious|strategic|passionate|driven|results-?oriented|team player|think outside the box|self-?starter|thought leader|guru|ninja|rockstar|highly experienced|years of experience|i believe in|continuous learning|attention to detail|strong communicator|interpersonal skills|hard-?working|detail-?oriented|proactive|dynamic|go-?getter/iu,
    hedge: /maybe|i think|i believe|kind of|sort of|probably|somewhat|roughly|more or less/iu,
    verifiable: /https?:\/\/|www\.|linkedin\.com|on the site|in the article|link/iu,
    scale: /participants|attendees|people|employees|clients|customers|subscribers|views|companies|organi[sz]ations|teams|students|countries|signups/iu,
    method: /method|methodology|process|model|framework|playbook|protocol|approach|system i built|tool i built|steps/iu,
    failure: /fail(?:ed|ure)|mistake|got it wrong|didn'?t work|learned the hard way|missed|shut down|lost/iu,
    origin: /i started|i came from|i switched|i chose|why i|my story|years ago|when i was|what led me/iu,
    peer: /peer|colleague|fellow|in my field|industry friend|mentor|partner|professional recommendation/iu,
    currency: /(?:\$|€|£|usd|eur|ils|k\b|m\b|million|billion|thousand)/iu,
    duration: /(?:years?|months?|weeks?|days?|quarters?|semesters?)/iu,
    relativeTime: /(?:this year|this month|recently|currently|right now|over the past year|in recent months)/iu,
  },
};

/**
 * Spelled-out magnitudes.
 *
 * Users write "eight months" and "שמונה חודשים" at least as often as "8".
 * Without these, a claim reading "shortened the close from three weeks to six
 * days" carried no measurable specificity at all, and the grounding validator
 * could not see a magnitude it should have been checking.
 */
export const NUMBER_WORDS = {
  he: {
    אחד: 1, אחת: 1, שניים: 2, שתיים: 2, שני: 2, שתי: 2, שלוש: 3, שלושה: 3,
    ארבע: 4, ארבעה: 4, חמש: 5, חמישה: 5, שש: 6, שישה: 6, שבע: 7, שבעה: 7,
    שמונה: 8, תשע: 9, תשעה: 9, עשר: 10, עשרה: 10, עשרים: 20, שלושים: 30,
    ארבעים: 40, חמישים: 50, שישים: 60, שבעים: 70, שמונים: 80, תשעים: 90,
    מאה: 100, מאות: 100, אלף: 1000, אלפים: 1000, מיליון: 1000000,
  },
  en: {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
    nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20,
    thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80,
    ninety: 90, hundred: 100, thousand: 1000, million: 1000000,
  },
};

const ALL_NUMBER_WORDS = { ...NUMBER_WORDS.he, ...NUMBER_WORDS.en };

/**
 * Magnitudes written as words, as numbers.
 *
 * The bare token is checked before the prefix-stripped one: `שלושה` must match
 * as itself, and `משלושה` ("from three") only matches once the ~mem~ is removed.
 */
export function spelledNumbers(text) {
  const out = [];
  for (const token of (text || '').split(/[^\p{L}]+/u)) {
    if (!token) continue;
    const lower = token.toLowerCase();
    const value = ALL_NUMBER_WORDS[lower] ?? ALL_NUMBER_WORDS[stripHebrewPrefix(lower)];
    if (value !== undefined) out.push(value);
  }
  return out;
}

/**
 * A stated shift between two magnitudes: "from three weeks to six days",
 * "משלושה שבועות לשישה ימים". Requires two magnitudes as well as the
 * construction, so ordinary prepositions cannot trigger it.
 */
function hasRangeShift(text, magnitudeCount) {
  if (magnitudeCount < 2) return false;
  return (
    /(?:^|\s)מ\S{2,}[\s\S]{0,24}?\sל\S{2,}/u.test(text) ||
    /\bfrom\b[\s\S]{0,24}?\bto\b/iu.test(text)
  );
}

/** Four-digit years that are plausible career dates. */
const YEAR_RE = /\b(19[89]\d|20[0-4]\d)\b/g;
const URL_RE = /https?:\/\/[^\s]+|www\.[^\s]+/iu;
const PERCENT_RE = /\d+(?:[.,]\d+)?\s*(?:%|אחוז|percent)/iu;
/** A number, optionally with thousands separators or decimals. */
const NUMBER_RE = /\d+(?:[.,]\d{3})*(?:[.,]\d+)?/g;
/**
 * Capitalised multi-word runs in Latin text — a crude proper-noun proxy.
 *
 * These are used with `matchAll`, never with `.test()`. A `/g` regex held at
 * module scope and probed with `.test()` advances its own `lastIndex`, so
 * consecutive calls alternate true/false and identical input produces different
 * scores on consecutive runs. That bug moved every score 4-6 points and
 * inverted the proof ranking between two presses of the same button.
 */
const PROPER_NOUN_RE = /\b[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})*/g;
/**
 * Words that are routinely capitalised without naming anything, so that a
 * sentence opener is not mistaken for an organisation.
 */
const CAPITALISED_FUNCTION_WORDS = new Set([
  'the', 'this', 'that', 'these', 'those', 'how', 'what', 'when', 'where',
  'why', 'who', 'which', 'and', 'but', 'for', 'from', 'with', 'without',
  'after', 'before', 'during', 'over', 'under', 'about', 'into', 'onto',
  'there', 'here', 'they', 'their', 'our', 'your', 'his', 'her', 'its',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'not', 'was', 'were', 'has', 'have', 'had', 'can', 'could', 'would',
  'should', 'will', 'shall', 'may', 'might', 'must', 'did', 'does', 'done',
  'now', 'then', 'also', 'still', 'just', 'only', 'more', 'most', 'less',
]);

/**
 * True when a match sits at the start of the text or of a sentence.
 *
 * Only `.`, `!`, `?` and a line break count. A hyphen must not: Hebrew attaches
 * Latin words with one ("ב-Deloitte"), so treating it as a sentence boundary
 * made every such name invisible — including to the grounding validator, which
 * is exactly where an invented employer would appear.
 */
function isSentenceInitial(text, index) {
  if (index === 0) return true;
  return /(?:^|[.!?\n])\s*$/u.test(text.slice(0, index));
}

/** Named organisations in Hebrew text. */
const HE_ORG_RE = /(?:חברת|בחברת|בארגון|בעמותת|בקבוצת|באוניברסיטת|במכללת|בבית הספר|בסטארטאפ)\s+(\S+)/gu;

/**
 * @typedef {object} Signals
 * @property {'he'|'en'} lang
 * @property {number} words
 * @property {boolean} demo
 * @property {number[]} numbers    numeric magnitudes found
 * @property {number} numberCount
 * @property {boolean} hasPercent
 * @property {boolean} hasCurrency
 * @property {boolean} hasDuration
 * @property {boolean} hasScaleUnit
 * @property {number[]} years
 * @property {boolean} hasRelativeTime
 * @property {boolean} hasUrl
 * @property {string[]} properNouns
 * @property {boolean} hasProperNoun
 * @property {boolean} thirdParty
 * @property {boolean} outcome
 * @property {boolean} contrast
 * @property {boolean} credential
 * @property {boolean} generic
 * @property {boolean} hedge
 * @property {boolean} verifiableRef
 * @property {boolean} method
 * @property {boolean} failure
 * @property {boolean} origin
 * @property {boolean} peer
 */

/**
 * Extract all signals from a claim.
 * @param {string} text
 * @returns {Signals}
 */
export function extractSignals(text) {
  const raw = text || '';
  const lang = detectLanguage(raw);
  const lex = LEX[lang];
  const other = LEX[lang === 'he' ? 'en' : 'he'];

  // Test both lexicons: mixed-language text is the norm in Israeli
  // professional writing ("הרצתי POC על AWS מול 3 לקוחות").
  const any = (key) => lex[key].test(raw) || other[key].test(raw);

  // Collected as values, not probed as booleans — see PROPER_NOUN_RE above.
  const properNouns = [
    ...[...raw.matchAll(PROPER_NOUN_RE)]
      // A capitalised word at the start of a sentence is capitalised by
      // grammar, not because it names anything. Without this, "The context
      // this happened in" reads as a named entity and the grounding validator
      // rejects the product's own scaffold text.
      .filter((m) => !isSentenceInitial(raw, m.index))
      .map((m) => m[0])
      .filter((name) => !CAPITALISED_FUNCTION_WORDS.has(name.toLowerCase())),
    ...[...raw.matchAll(HE_ORG_RE)].map((m) => m[1]),
  ].filter(Boolean);

  const digits = (raw.match(NUMBER_RE) || [])
    .map((n) => Number.parseFloat(n.replace(/,/g, '')))
    .filter((n) => Number.isFinite(n));
  const words = spelledNumbers(raw);
  const numbers = [...digits, ...words];
  const years = (raw.match(YEAR_RE) || []).map(Number);

  return {
    lang,
    words: wordCount(raw),
    demo: DEMO_MARKER.test(raw),
    numbers,
    // Years are dates, not magnitudes; counting them as specificity would
    // reward "in 2019 I was employed" as much as "cut cost by 38%".
    numberCount: digits.filter((n) => !years.includes(n)).length + words.length,
    hasPercent: PERCENT_RE.test(raw),
    hasCurrency: any('currency') && numbers.length > 0,
    hasDuration: any('duration') && numbers.length > 0,
    hasScaleUnit: any('scale') && numbers.length > 0,
    years,
    hasRelativeTime: any('relativeTime'),
    hasUrl: URL_RE.test(raw),
    properNouns,
    hasProperNoun: properNouns.length > 0,
    thirdParty: any('thirdParty'),
    outcome: any('outcome'),
    contrast: any('contrast') || hasRangeShift(raw, digits.length + words.length),
    credential: any('credential'),
    generic: any('generic'),
    hedge: any('hedge'),
    verifiableRef: any('verifiable'),
    method: any('method'),
    failure: any('failure'),
    origin: any('origin'),
    peer: any('peer'),
  };
}

/**
 * Infer the proof kind, which determines the decay half-life.
 * Order matters: the most time-sensitive interpretation wins.
 */
export function inferKind(signals) {
  if (signals.credential) return 'credential';
  if (signals.thirdParty && signals.hasScaleUnit) return 'event';
  if (signals.thirdParty) return 'media';
  if (signals.outcome && (signals.numberCount > 0 || signals.contrast)) return 'outcome';
  if (signals.hasScaleUnit) return 'traction';
  return 'experience';
}

/**
 * Which of the eight evidence archetypes this claim covers.
 * A claim can cover more than one.
 * @returns {string[]}
 */
export function inferArchetypes(signals) {
  const out = new Set();
  if (signals.outcome && (signals.numberCount > 0 || signals.contrast)) out.add('OUTCOME');
  if (signals.thirdParty) out.add('VALIDATION');
  if (signals.hasScaleUnit) out.add('SCALE');
  if (signals.method) out.add('METHOD');
  if (signals.credential) out.add('CREDENTIAL');
  if (signals.peer) out.add('PEER');
  if (signals.failure) out.add('FAILURE');
  if (signals.origin) out.add('ORIGIN');
  return [...out];
}

/**
 * Best guess at when the described event happened, for decay.
 * Returns null when undated — decay then falls back to the capture date with
 * reduced penalty rather than inventing a timestamp.
 */
export function inferOccurredAt(signals, now) {
  if (signals.hasRelativeTime) return now;
  if (!signals.years.length) return null;
  const year = Math.max(...signals.years);
  const nowYear = new Date(now).getUTCFullYear();
  if (year > nowYear) return null;
  // Mid-year, so a bare year is not treated as either January or December.
  return Date.UTC(year, 6, 1);
}

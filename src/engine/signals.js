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

/**
 * Hebrew stem matching with prefix tolerance.
 *
 * Bare stems create false positives — `כנס` (conference) sits inside `הכנסות`
 * (revenues), and matching it there labelled an ordinary revenue line as
 * third-party validation. Plain `(?<![א-ת])` boundaries stop that, but they
 * also stop the *legitimate* prefixed forms Hebrew actually writes: `שנכשל`
 * ("that failed") never matched `נכשל`, so the best-practice failure evidence
 * the product's own FAILURE play asks for classified as no archetype at all.
 *
 * So: one optional prefix letter is allowed, and the guard sits before it.
 *
 * `open` stems may be followed by more letters (`הרצא` covers הרצאה/הרצאות);
 * `closed` stems must end at a word boundary.
 */
function heStems({ closed = [], open = [] }) {
  const parts = [];
  if (closed.length) parts.push(`(?:${closed.join('|')})(?![א-ת])`);
  if (open.length) parts.push(`(?:${open.join('|')})`);
  return new RegExp(`(?<![א-ת])[ובהלמשכ]?(?:${parts.join('|')})`, 'u');
}

const LEX = {
  he: {
    /** Someone other than the author asserted or hosted this. */
    thirdParty: heStems({
      closed: [
        'כתבה', 'עיתון', 'מגזין', 'פודקאסט', 'כנס', 'וובינר', 'פאנל',
        'צוטטתי', 'ציטטו אותי', 'פורסם', 'התפרסם', 'פרס', 'זכיתי בפרס',
      ],
      open: [
        'כתבו עלי', 'רואיינתי', 'ראיינו אותי', 'התראיינ', 'ראיון איתי',
        'הרצא', 'הזמינו אותי', 'המלצ', 'לקוח סיפר', 'לקוחה סיפרה',
        // `נבחרתי` is dropped deliberately: being picked to run a project
        // internally is not somebody vouching for you publicly, and it was the
        // most common false positive in the Hebrew corpus.
        'חוות דעת', 'דורגתי',
      ],
    }),
    /**
     * Something changed in the world.
     *
     * Hebrew verb conjugation is enumerated rather than stemmed: `הפחית` and
     * `הפחתתי` share no usable prefix, so a stem-based pattern would miss the
     * first-person forms users actually write. Bare stems are avoided where
     * they would create false positives (`סגר` is a substring of `מסגרת`).
     */
    outcome: /(?<![א-ת])(?:[וש]?)(?:הגדיל|הגדלתי|הגדלנו|הגדלה|גדלו|גדל ב|צמח|צמחו|צמיחה|העלה|העליתי|הכפיל|הכפלתי|שילש|הפחית|הפחתתי|הפחתנו|הוריד|הורדתי|צמצם|צמצמתי|חסך|חסכתי|חסכנו|קיצר|קיצרתי|ייעל|ייעלתי|שיפר|שיפרתי|הציל|הצלתי|נסגר|נסגרו|סגרתי|סגרנו|הביא|הבאתי|יצר|יצרתי|השיק|השקתי|הקים|הקמתי|בנה|בניתי|הוביל|הובלתי|העביר|העברתי|גייס|גייסתי|החזיר|החזרתי|שיקם|שיקמתי|פתר|פתרתי|מנע|מנעתי|פיתח|פיתחתי|פיתחנו|עיצבתי|הטמעתי|הטמיע|יישמתי|ניהלתי|הכשרתי|אוטמט|חיסכון|חסכון|קיצור|צמצום|הפחתה|הגדלה|ייעול)(?![א-ת])/u,
    /** Before/after tension — the raw material of a story. */
    contrast: /לפני|אחרי|במשך|בתוך|תוך|מ-?\s*\d+\s*ל-?\s*\d+|מ\S{2,10}\s+ל\S{2,10}|במקום|לעומת|עד ש|מאז|בעקבות|כתוצאה|בזכות|למרות|אף על פי/u,
    credential: heStems({
      closed: ['תואר', 'תעודה', 'רישיון', 'בוגר', 'מוסמך', 'דוקטור', 'ד״ר', 'תזה', 'ציון', 'ציונים', 'התמחות'],
      open: ['הסמכ', 'הוסמכ', 'קורס מקצועי'],
    }),
    /** Self-描述 personality claims: the most common and least useful thing users write. */
    generic: /יצירתי|סקרן|אסטרטגי|מקצועי מאוד|תותח|מנוסה מאוד|שנים של ניסיון|אוהב אנשים|חושב מחוץ לקופסה|רעב|נחוש|תשוקה|אכפתי|ראש גדול|בעל ניסיון רב|מוביל דעה|מומחה מוביל|מאמינ\S* ב|עבודת צוות|למידה מתמדת|גישה אישית|תשומת לב לפרטים|ראייה מערכתית|חשיבה מחוץ|אוריינטציה|יחסי אנוש|יכולת גבוהה|כישורים בין-?אישיים|מוטיבציה גבוהה|אחריות אישית|נכונות ללמוד|תודעת שירות|דינמי|פרואקטיבי/u,
    hedge: /אולי|נראה לי|אני מאמין ש|בערך|סוג של|כנראה|לפעמים|יכול להיות|בגדול|פחות או יותר/u,
    /** Named third-party context a sceptic could go and check. */
    verifiable: /באתר|בכתבה|בעיתון|בגלובס|בכלכליסט|ב-?TheMarker|בפודקאסט|בכנס|בערוץ|בלינקדאין|קישור|לינק/u,
    scale: heStems({
      closed: ['משתתפים', 'אנשים', 'עובדים', 'לקוחות', 'מנויים', 'צפיות', 'חברות',
        'ארגונים', 'סניפים', 'מדינות', 'צוותים', 'תלמידים', 'נרשמו'],
    }),
    method: heStems({
      closed: ['שיטה', 'מתודולוגיה', 'תהליך', 'מודל', 'פריימוורק', 'שלבים', 'פרוטוקול', 'גישה'],
      open: ['מסגרת עבודה', 'כלי שפיתחתי', 'מערכת שבניתי'],
    }),
    failure: heStems({
      closed: ['נכשל', 'כישלון', 'טעות', 'טעיתי', 'פספסתי', 'החמצתי', 'קרסה', 'ויתרתי'],
      open: ['לא עבד', 'למדתי בדרך הקשה', 'נסגר בהפסד'],
    }),
    origin: heStems({
      closed: ['התחלתי', 'הגעתי', 'עברתי', 'בחרתי', 'כשהייתי'],
      open: ['למה אני', 'הסיפור שלי', 'לפני שנים', 'מה שהוביל אותי', 'מאז אני'],
    }),
    /** Peer-level recognition rather than client-level. */
    peer: heStems({
      closed: ['עמית', 'עמיתים', 'מנטור', 'שותף'],
      open: ['קולג', 'מומחה אחר', 'בתחום שלי', 'חבר לתעשייה', 'ממליץ', 'המלצה מקצועית'],
    }),
    currency: /(?:₪|ש["״']?ח|שקל|שח|אלף|מיליון|מיליארד)/u,
    duration: /(?:שנ(?:ה|תיים|ים)|חוד(?:ש|שיים|שים)|שבוע(?:ות|יים)?|ימים|יום|רבעון|סמסטר)/u,
    relativeTime: /(?:השנה|החודש|לאחרונה|בימים אלה|כרגע|עכשיו|בשנה האחרונה|בחודשים האחרונים)/u,
  },
  en: {
    // Only constructions where somebody else acted on the author. The previous
    // pattern matched ordinary self-authored CV verbs — `interview`, `reviewed`,
    // `selected`, `won`, `ranked` — so "Ran 40+ customer discovery interviews"
    // was scored as external validation and printed on the reveal screen as
    // "someone external vouches for you", over a line the user wrote themselves.
    thirdParty:
      /featured in|profiled in|quoted in|(?:was|were) quoted|cited in|interviewed by|was interviewed|wrote about (?:me|my)|covered by|recommended by|endorsed by|nominated for|testimonial|spoke at|speaker at|keynote|panell?ist|podcast|press coverage|award(?:ed)? to me|received the [\w\s]*award/iu,
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
    שניים: 2, שתיים: 2, שני: 2, שתי: 2, שלוש: 3, שלושה: 3,
    ארבע: 4, ארבעה: 4, חמש: 5, חמישה: 5, שש: 6, שישה: 6, שבע: 7, שבעה: 7,
    שמונה: 8, תשע: 9, תשעה: 9, עשר: 10, עשרה: 10, עשרים: 20, שלושים: 30,
    ארבעים: 40, חמישים: 50, שישים: 60, שבעים: 70, שמונים: 80, תשעים: 90,
    מאה: 100, מאות: 100, אלף: 1000, אלפים: 1000, מיליון: 1000000,
    // Hebrew's dual. `יומיים` *is* the number two — it is how a Hebrew speaker
    // writes "two days" — and without these the same fact scored 49 written in
    // digits and 38 written in words. A client email saying "היום אנחנו סוגרים
    // הזמנה ביומיים" registered numberCount 0 and ranked last.
    יומיים: 2, שנתיים: 2, שבועיים: 2, חודשיים: 2, פעמיים: 2,
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
function hasRangeShift(text) {
  const spans = [
    ...(text.match(/(?:^|\s)מ-?\S{1,14}[\s\S]{0,24}?\sל-?\S{1,14}/gu) || []),
    ...(text.match(/\bfrom\b[\s\S]{0,28}?\bto\b[^.\n]{0,14}/giu) || []),
  ];
  return spans.some((span) => {
    const digits = (span.match(/\d+/g) || []).length;
    return digits + spelledNumbers(span).length >= 2;
  });
}

/** Four-digit years that are plausible career dates. */
const YEAR_RE = /\b(19[89]\d|20[0-4]\d)\b/g;
const URL_RE = /https?:\/\/[^\s]+|www\.[^\s]+/iu;
const PERCENT_RE = /\d+(?:[.,]\d+)?\s*(?:%|אחוז|percent)/iu;
/** A number, optionally with thousands separators or decimals. */
const NUMBER_RE = /\d+(?:[.,]\d{3})*(?:[.,]\d+)?/g;
/**
 * Named things in Latin script.
 *
 * Four patterns, because organisations are not all Capitalised Words: acronyms
 * (`IBM`, `NASA`), internal caps (`McKinsey`, `eBay`), digit-bearing names
 * (`3M`), and ordinary capitalised runs (`Goldman Sachs`).
 *
 * All are used with `matchAll`, never with `.test()`. A `/g` regex held at
 * module scope and probed with `.test()` advances its own `lastIndex`, so
 * consecutive calls alternate true/false and identical input produces different
 * scores on consecutive runs. That bug moved every score 4-6 points and
 * inverted the proof ranking between two presses of the same button.
 */
const LATIN_NAME_RES = [
  /\b[A-Z][a-z]{2,}(?:\s+(?:[A-Z][a-z]{2,}|&))*\b/g,
  /\b[A-Z]{2,6}\b/g,
  /\b[A-Z][a-z]*[A-Z][a-zA-Z]*\b/g,
  /\b[a-z][A-Z][a-zA-Z]*\b/g,
  /\b\d[A-Z][a-zA-Z]*\b/g,
];

/**
 * Acronyms that name a role or a concept rather than an organisation. Flagging
 * these would make the grounding check cry wolf on ordinary professional prose.
 */
const GENERIC_ACRONYMS = new Set([
  'CEO', 'CTO', 'CFO', 'COO', 'CMO', 'CIO', 'VP', 'HR', 'IT', 'PM', 'QA',
  'UX', 'UI', 'AI', 'ML', 'API', 'SDK', 'CRM', 'ERP', 'KPI', 'ROI', 'OKR',
  'SLA', 'POC', 'MVP', 'B2B', 'B2C', 'SAAS', 'PHD', 'MBA', 'EU', 'US', 'UK',
  'PDF', 'CSV', 'SQL', 'AWS', 'GDP', 'RFP', 'NDA', 'FAQ', 'TBD', 'ASAP',
]);
/**
 * Words that are routinely capitalised without naming anything, so that a
 * sentence opener is not mistaken for an organisation.
 */
const CAPITALISED_FUNCTION_WORDS = new Set([
  // Grammar
  'the', 'this', 'that', 'these', 'those', 'how', 'what', 'when', 'where',
  'why', 'who', 'which', 'and', 'but', 'for', 'from', 'with', 'without',
  'after', 'before', 'during', 'over', 'under', 'about', 'into', 'onto',
  'there', 'here', 'they', 'their', 'our', 'your', 'his', 'her', 'its',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'not', 'was', 'were', 'has', 'have', 'had', 'can', 'could', 'would',
  'should', 'will', 'shall', 'may', 'might', 'must', 'did', 'does', 'done',
  'now', 'then', 'also', 'still', 'just', 'only', 'more', 'most', 'less',
  'every', 'each', 'some', 'many', 'both', 'because', 'while', 'since',
  'though', 'although', 'however', 'instead', 'within', 'across', 'through',
  // Ordinary professional vocabulary that routinely starts a sentence.
  // Without these the check cried wolf on correctly-grounded text — flagging
  // "Onboarding", "Evidence" and "Revenue" as invented organisations — and a
  // warning that fires on ordinary nouns is a warning users learn to ignore.
  'onboarding', 'evidence', 'revenue', 'customers', 'clients', 'growth',
  'results', 'delivery', 'quality', 'process', 'processes', 'product',
  'products', 'project', 'projects', 'team', 'teams', 'training', 'support',
  'sales', 'marketing', 'operations', 'engineering', 'design', 'research',
  'strategy', 'planning', 'budget', 'costs', 'cost', 'time', 'reporting',
  'hiring', 'retention', 'churn', 'conversion', 'performance', 'efficiency',
  'automation', 'migration', 'launch', 'rollout', 'adoption', 'usage',
  'feedback', 'testing', 'security', 'compliance', 'documentation', 'data',
  'analysis', 'reviews', 'review', 'meetings', 'workshops', 'workshop',
  'management', 'leadership', 'experience', 'expertise', 'knowledge',
  'working', 'building', 'leading', 'running', 'managing', 'creating',
  'together', 'overall', 'previously', 'currently', 'recently', 'earlier',
  'later', 'first', 'second', 'third', 'finally', 'today', 'yesterday',
  'monday', 'friday', 'january', 'december', 'week', 'month', 'quarter',
  'year', 'years', 'people', 'everyone', 'nobody', 'something', 'nothing',
]);

/**
 * How complete the named-entity check can be for a given text.
 *
 * `full`   — Latin script: capitalisation makes names findable.
 * `partial`— Hebrew: only names preceded by an organisational word, or present
 *            in the known-entity lexicon, can be found. Everything else is
 *            invisible, and the UI must say so rather than affirm a clean bill.
 *
 * This exists because the honest thing to publish is not a guarantee but the
 * shape of the guarantee.
 */
export function entityCoverage(text) {
  // Any Hebrew content at all makes the check partial. Keying on the *dominant*
  // script meant an English-dominant draft containing an invented Hebrew
  // employer came back `full`, and the studio printed an unqualified "no names
  // absent from the evidence" over it — the same false assurance this function
  // exists to prevent, one language mix over.
  return /[א-ת]/u.test(text || '') ? 'partial' : 'full';
}

/**
 * Named organisations in Hebrew text.
 *
 * Hebrew has no capitalisation, so a name can only be found by the word in
 * front of it or by recognising the name itself. Both are partial, and the UI
 * says so rather than implying the check is complete — see
 * `entityCoverage()` below.
 */
const HE_ORG_RE =
  /(?<![א-ת])(?:חברת|בחברת|מחברת|לחברת|ארגון|בארגון|עמותת|בעמותת|קבוצת|בקבוצת|אוניברסיטת|באוניברסיטת|מכללת|במכללת|בית הספר|סטארטאפ|בסטארטאפ|בנק|הבנק|רשת|ברשת|קרן|בקרן|משרד|במשרד|עיתון|בעיתון|מגזין|במגזין|קונצרן|תאגיד)(?![א-ת])\s+([א-ת\w'׳"״-]+)/gu;

/**
 * Hebrew-language organisations and publications common enough in Israeli
 * professional writing to be worth recognising by name.
 *
 * A lexicon is not a solution to Hebrew named-entity recognition and is not
 * presented as one. It covers the specific fabrications this product's users
 * would actually reach for — a well-known employer, a bank, a newspaper that
 * did not run the piece — and everything it misses is disclosed to the user
 * instead of being implied away.
 */
const HE_KNOWN_ENTITIES = [
  'טבע', 'אינטל', 'צ׳ק פוינט', "צ'ק פוינט", 'אלביט', 'רפאל', 'נייס', 'אמדוקס',
  'ווייז', 'מובילאיי', 'מונדיי', 'ויקס', 'פייבר', 'לייטריקס', 'פלייטיקה',
  'בנק הפועלים', 'בנק לאומי', 'לאומי', 'הפועלים', 'דיסקונט', 'מזרחי טפחות',
  'הראל', 'כלל', 'מגדל', 'פניקס', 'מנורה', 'אלטשולר',
  'גלובס', 'כלכליסט', 'דה מרקר', 'הארץ', 'ידיעות', 'מעריב', 'ynet', 'מאקו',
  'ישראל היום', 'ערוץ 12', 'ערוץ 13', 'כאן',
  'מיקרוסופט', 'גוגל', 'אמזון', 'אפל', 'מטא', 'פייסבוק', 'אנבידיה',
  'הטכניון', 'תל אביב', 'העברית', 'בן גוריון', 'רייכמן', 'בר אילן',
];
/**
 * Hebrew personal names, found by the role word attached to them.
 *
 * `יעל ברקוביץ׳, מנכ״לית תפעול` — the single piece of genuine third-party
 * validation in a typical CV — was invisible, scored 33, and never reached the
 * reveal, while `Lean` in a skills list was detected as a proper noun.
 */
const HE_PERSON_RES = [
  // Role word, optionally followed by the department it heads, then the name.
  // A Hebrew given name never takes the definite article, so tokens starting
  // with ה or ו are skipped rather than captured — without that, "מנהל הייצור
  // והמחסן" ("head of production and warehousing") was reported to the user as
  // a named person absent from their evidence.
  /(?<![א-ת])(?:מנכ["״']?ל(?:ית)?|סמנכ["״']?ל(?:ית)?|מנהל(?:ת)?|יו["״']?ר|ד["״']?ר|פרופ|רו["״']?ח|עו["״']?ד|ראש(?: צוות| אגף| מחלקה)|שותף|מייסד(?:ת)?)(?![א-ת])(?:\s+ה[א-ת]{2,})*\s+((?![הו])[א-ת]{2,}(?:\s+(?![הו])[א-ת]{2,})?)/gu,
  /(?<![א-ת])((?![הו])[א-ת]{2,}\s+(?![הו])[א-ת]{2,}["״']?)\s*,\s*(?=מנכ|סמנכ|מנהל|יו["״']?ר|ראש|שותף|מייסד|לשעבר)/gu,
];

/**
 * A quoted passage with someone's name attached to it.
 *
 * A written recommendation is the single most valuable thing in a typical CV
 * and it rarely contains a cue word like "interviewed" or "featured" — it is
 * just a quotation followed by a name and a title. Without this the strongest
 * evidence in the document scored 38, rendered no reason, and never reached the
 * reveal, in both languages.
 */
const ATTRIBUTED_QUOTE = /["״”][^"״”]{20,}["״”]\s*[-–—,]\s*\S/u;

/**
 * A claim signed off by a named person with a role.
 *
 * The same evidence as an attributed quotation, minus the quotation marks —
 * which is exactly how a client thank-you email arrives, and the onboarding
 * copy invites that file by name. `attachSignature` in `text.js` folds the
 * signature block onto the claim it vouches for; this is the signal that reads
 * it, so the strongest sentence in the email stops scoring as the user's own
 * unsupported assertion.
 */
const ATTRIBUTED_SOURCE =
  /[-–—]\s*[^\n]{2,60}?(?:מנכ"?ל|סמנכ"?ל|מנהל(?:ת)?|יו"?ר|מייסד(?:ת)?|שותף|דירקטור|CEO|CTO|COO|CFO|VP|Head of|Director|Founder|Partner)/iu;

const HE_KNOWN_RE = new RegExp(`(?:^|[^א-ת])(${HE_KNOWN_ENTITIES.map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![א-ת])`, 'gu');

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

  // Collected as values, not probed as booleans — see LATIN_NAME_RES above.
  //
  // Sentence position is deliberately *not* used to filter. It was, so that the
  // app's own scaffold text ("The context this happened in") did not
  // self-reject — but the effect was that any invented name placed at the start
  // of a sentence became invisible, which is exactly where names go. Boilerplate
  // is now removed before validation instead, and only a function-word list
  // filters here.
  const properNouns = [
    ...LATIN_NAME_RES.flatMap((re) => [...raw.matchAll(re)].map((m) => m[0]))
      .map((name) => name.trim())
      .filter(
        (name) =>
          name.length > 1 &&
          !CAPITALISED_FUNCTION_WORDS.has(name.toLowerCase()) &&
          !GENERIC_ACRONYMS.has(name.toUpperCase()),
      ),
    ...[...raw.matchAll(HE_ORG_RE)].map((m) => m[1]),
    ...[...raw.matchAll(HE_KNOWN_RE)].map((m) => m[1]),
    ...HE_PERSON_RES.flatMap((re) => [...raw.matchAll(re)].map((m) => m[1])),
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
    // Digits specifically: a bare "חברות" plus a spelled-out word elsewhere in
    // the sentence is not a counted scale.
    hasScaleUnit: any('scale') && digits.length > 0,
    years,
    hasRelativeTime: any('relativeTime'),
    hasUrl: URL_RE.test(raw),
    properNouns,
    hasProperNoun: properNouns.length > 0,
    // A quotation with a name attached — or a claim signed by a named person
    // with a role — is third-party validation even with no cue word in it.
    thirdParty: any('thirdParty') || ATTRIBUTED_QUOTE.test(raw) || ATTRIBUTED_SOURCE.test(raw),
    outcome: any('outcome'),
    contrast: any('contrast') || hasRangeShift(raw),
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

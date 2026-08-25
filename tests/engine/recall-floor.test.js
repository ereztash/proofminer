/**
 * How much real evidence the detectors still cannot see.
 *
 * `docs/METHOD.md` promises a route to covering every archetype but `SCALE`
 * without a magnitude, and publishes a table of what best-practice evidence
 * scores. That table is **one sentence per archetype**. Written to the same
 * recipes in different words, roughly four in ten fall under their own bar —
 * and close to six in ten in Hebrew against three in ten in English, which is
 * the wrong way round for a product whose first language is Hebrew.
 *
 * **This is a floor on a known deficiency, not a target that has been met.**
 * The numbers below are the measured miss rates, pinned so they cannot quietly
 * get worse while something else is being improved. They are meant to come
 * down, and were: Hebrew organisation detection has since been fixed for the
 * forms that can be read safely, which moved the overall rate to 0.40 and the
 * Hebrew rate to 0.50.
 *
 * Three known causes remain open. A workplace named with a bare `ב` prefix
 * (`באלפא לוגיסטיקה`) is still invisible and deliberately so — see the comment
 * on `HE_ORG_PREP_RE`, where reading it cost false positives worse than the
 * miss. The Hebrew `outcome` lexicon enumerates verb forms and misses idiom
 * while English matches loosely enough to catch things by accident. And `PEER`
 * is not classified at all, in either language, for evidence written to its own
 * recipe. When any is fixed, these thresholds should be tightened in the same
 * commit.
 *
 * Every item is written for this test, to `METHOD.md`'s stated recipe, with no
 * magnitude anywhere. None of it is anybody's real words — the rule that
 * governs the client corpus and `tests/ui/guidance.test.js` applies here too.
 */

import { describe, expect, it } from 'vitest';
import { analyzeClaim } from '../../src/engine/mine.js';
import { COVERAGE_CEILING } from '../../src/engine/gaps.js';
import { BAND_USABLE } from '../../src/engine/score.js';

const NOW = Date.parse('2026-08-25');
const bar = (archetype) => COVERAGE_CEILING[archetype] ?? BAND_USABLE;

/** Written to the recipe in METHOD.md's last column, magnitude-free. */
const POSITIVES = {
  OUTCOME: { // "a stated before → after, in words"
    he: [
      'לפני שנכנסתי, האספקה באלפא לוגיסטיקה איחרה כמעט כל שבוע. אחרי שבנינו את התהליך היא הפסיקה לאחר.',
      'בבטא תעשיות המחסן היה נסגר בעומס. מאז השינוי שהובלתי הוא כבר לא נסגר.',
    ],
    en: [
      'Before I joined, releases at Alpha Logistics slipped almost every week. After we rebuilt the process they stopped slipping.',
      'The warehouse at Beta Industries used to shut down under load. Since the change I led, it no longer does.',
    ],
  },
  PEER: { // "name, role, place"
    he: [
      'דוד לוי, סמנכ"ל תפעול בבטא תעשיות, הזכיר את העבודה שלי בכנס הלוגיסטיקה.',
      'מיכל ברק, מנהלת הרכש בגמא קמעונאות, הפנתה אלי שתי חברות מהתחום.',
    ],
    en: [
      'David Levi, VP Operations at Beta Industries, cited my work at the logistics conference.',
      'Michal Barak, head of procurement at Gamma Retail, referred me to two companies in her sector.',
    ],
  },
  VALIDATION: { // "an attributed quotation"
    he: [
      'רונית לוי, מנהלת התפעול באלפא לוגיסטיקה, כתבה: "התהליך שבנית הוא היחיד ששרד אצלנו שנה שלמה".',
      'המנכ"ל של בטא תעשיות אמר לי: "לא היינו עוברים את הרבעון בלי השינוי הזה".',
    ],
    en: [
      'Ronit Levi, operations manager at Alpha Logistics, wrote: "the process you built is the only one that survived a full year here".',
      'The CEO at Beta Industries told me: "we would not have made the quarter without this change".',
    ],
  },
  FAILURE: { // "date and named party"
    he: ['ב-2023 הפיילוט שהרצתי בגמא קמעונאות נכשל, כי לא בדקתי מי מזין את הנתונים בפועל.'],
    en: ['In 2023 the pilot I ran at Gamma Retail failed, because I never checked who actually entered the data.'],
  },
  METHOD: { // "dated, attributed, linked"
    he: ['ב-2024 כתבתי את שיטת העבודה שלי כמסמך פתוח עבור אלפא לוגיסטיקה: מיפוי צווארי בקבוק, פיילוט באתר אחד, מדידה שבועית.'],
    en: ['In 2024 I wrote up my method as an open document for Alpha Logistics: map the bottlenecks, pilot at one site, measure weekly.'],
  },
  ORIGIN: { // "year, place, what you saw"
    he: ['ב-2011 עבדתי במפעל של אלפא תעשיות וראיתי קו ייצור נעצר בגלל טעות בספירת מלאי. מאז אני עוסק רק בזה.'],
    en: ['In 2011 I worked at the Alpha Industries plant and watched a line stop over a stock-count error. I have worked on nothing else since.'],
  },
  CREDENTIAL: { // "a year is a date"
    he: ['תואר במנהל עסקים מאוניברסיטת תל אביב, 2018, בהתמחות לוגיסטיקה.'],
    en: ['MBA from Tel Aviv University, 2018, specialising in logistics.'],
  },
};

function misses() {
  const out = { all: { n: 0, m: 0 }, he: { n: 0, m: 0 }, en: { n: 0, m: 0 } };
  for (const [archetype, langs] of Object.entries(POSITIVES)) {
    for (const [lang, items] of Object.entries(langs)) {
      for (const claim of items) {
        const { score } = analyzeClaim(claim, { positioning: {}, now: NOW });
        const missed = score < bar(archetype);
        out.all.n += 1; out[lang].n += 1;
        if (missed) { out.all.m += 1; out[lang].m += 1; }
      }
    }
  }
  return out;
}

describe('evidence the detectors cannot see', () => {
  it('does not miss more than it does today, overall', () => {
    const { all } = misses();
    // Measured 2026-08-25 at 0.40, tightened from 0.45 when Hebrew
    // organisation detection improved. Lower this when a detector improves;
    // never raise it.
    expect(all.m / all.n).toBeLessThanOrEqual(0.42);
  });

  it('does not miss more Hebrew than it does today', () => {
    const { he } = misses();
    // The product is Hebrew-first and this is its worse half. Measured
    // 2026-08-25 at 0.50, down from 0.60 with the organisation fix.
    expect(he.m / he.n).toBeLessThanOrEqual(0.52);
  });

  it('is still worse in Hebrew than in English, which is the finding', () => {
    // Not an assertion that this is acceptable — an assertion that the gap is
    // real and has not been silently closed by a change nobody wrote down. If
    // this fails because Hebrew caught up, delete it and say so in the commit.
    const { he, en } = misses();
    expect(he.m / he.n).toBeGreaterThan(en.m / en.n);
  });
});

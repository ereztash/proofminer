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
 * `PEER` has since been settled, and not by fixing a detector: its published
 * recipe was wrong. "Name, role, place" cannot produce `PEER`, because nothing
 * in `VP Operations at Beta Industries` says whether that person is a peer or a
 * client, and the product will not decide that for the user. The recipe now
 * says the relation has to be stated, and the items here state it.
 *
 * **What still blocks Hebrew is one thing, and it is deliberate.** A workplace
 * named with a bare `ב` prefix — `באלפא לוגיסטיקה`, the commonest form there
 * is — carries no `hasProperNoun`, and that alone holds two of the remaining
 * Hebrew misses under their bar even where every other signal fires. Reading it
 * was tried and reverted: `ב` is also the first letter of `בניתי` and `ביקשתי`,
 * and the attempt reported a company called *"ניתי תהליך"* to the user. Doing
 * it properly needs Hebrew morphology this product does not carry and should
 * not add for it. So the miss stays, named, rather than being traded for a
 * fabrication. See the comment on `HE_ORG_PREP_RE`.
 *
 * **What that sentence got wrong, and what it cost.** It said *every* heuristic
 * separating the two breaks on the same rock. That is true only for a `ב` on an
 * arbitrary word. A `ב` on a word from a closed list — `בבית הספר`, `בבנק` —
 * cannot be anything else, and filing the two together hid a fix worth 12
 * points of recall against an external corpus. `tests/engine/hebrew-orgs.test.js`
 * holds that measurement and the forms it added.
 *
 * **These floors did not move when it landed, and that is the point.** Every
 * Hebrew item below writes its workplace as `באלפא לוגיסטיקה` — the one form
 * whoever wrote them already knew was broken — so this file was blind to a real
 * improvement in the thing it exists to measure. A floor pinned against
 * material written inside the project cannot tell a detector that works from a
 * detector that matches its author's expectations.
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
  PEER: { // "the peer relation stated, then name, role, place"
    // These items used to omit the relation word, because METHOD.md's recipe
    // omitted it. They were testing something the product cannot do and should
    // not do: infer from "VP Operations at Beta Industries" whether that person
    // is a peer or a client. The recipe is corrected; so are they.
    he: [
      'עמית בתחום, דוד לוי, סמנכ"ל תפעול בבטא תעשיות, הזכיר את העבודה שלי בכנס הלוגיסטיקה.',
      'מיכל ברק, עמיתה בתחום ומנהלת הרכש בגמא קמעונאות, הפנתה אלי שתי חברות.',
    ],
    en: [
      'A colleague in my field, David Levi, VP Operations at Beta Industries, cited my work at the logistics conference.',
      'Michal Barak, a peer in my field and head of procurement at Gamma Retail, referred me to two companies.',
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
    expect(all.m / all.n).toBeLessThanOrEqual(0.37);
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

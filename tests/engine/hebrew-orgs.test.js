/**
 * Hebrew organisation names: what is now read, and what is still refused.
 *
 * These forms were found missing by measurement, not by review. Against 427
 * organisations that Hebrew Wikipedia marks as organisations — its own links,
 * its own entity infoboxes, none of it written by anybody on this project —
 * the detector found 34%. Adding the forms below took that to 46%.
 *
 * **The repository's own suite could not see any of it.** Every Hebrew fixture
 * here writes a workplace as `באלפא לוגיסטיקה`, a bare `ב` on an arbitrary
 * name, because that is the failure mode whoever wrote them already knew
 * about. `tests/engine/recall-floor.test.js` reads 0.50 in Hebrew before this
 * change and 0.50 after it. A green suite is not evidence that a detector
 * works; it is evidence that it does what its author expected.
 *
 * Every string here is written for this test. No sentence from the measured
 * corpus enters the repository — the rule that governs the client material and
 * `tests/ui/guidance.test.js` applies to research corpora too.
 */

import { describe, expect, it } from 'vitest';
import { extractSignals } from '../../src/engine/signals.js';

const nouns = (text) => extractSignals(text).properNouns;
const finds = (text, name) => nouns(text).some((n) => n.includes(name));

describe('a type word that is part of the name', () => {
  // `בחברת אלפא` returns `אלפא`, because nobody is called "חברת". But
  // `בערוץ הראשון` returning `הראשון` both loses half the name and trips the
  // definite-article guard — and Hebrew organisation names carry ה constantly.
  // These return the type word with the name attached.
  it.each([
    ['ערוץ הראשון', 'הסדרה ששימשתי בה עורך שודרה בערוץ הראשון.'],
    ['סמינר הקיבוצים', 'לימדתי קורס אחד בסמינר הקיבוצים.'],
    ['בית החולים הכללי', 'עבדתי במחלקה לרדיולוגיה בבית החולים הכללי.'],
    ['בית הספר לרפואה', 'מוניתי למרצה בבית הספר לרפואה.'],
    ['מכון ויצמן', 'עשיתי את הדוקטורט במכון ויצמן.'],
    ['בנק הפועלים', 'ניהלתי צוות סיכונים בבנק הפועלים.'],
    ['מכללה למינהל', 'לימדתי משפט מסחרי במכללה למינהל.'],
  ])('reads %s', (name, sentence) => {
    expect(finds(sentence, name)).toBe(true);
  });
});

describe('a prefix on a word from the closed trigger list', () => {
  // A `ב` on an arbitrary word is ambiguous — it is also the first letter of
  // `בניתי`. A `ב` on one of these is not: `בבית הספר` cannot be anything
  // else. Filing the two together as "needs Hebrew morphology" cost 9% of the
  // measured instances; only the first one does.
  it.each([
    ['אלפא לוגיסטיקה', 'הובלתי את המעבר מחברת אלפא לוגיסטיקה.'],
    ['אלפא לוגיסטיקה', 'הובלתי את המעבר לחברת אלפא לוגיסטיקה.'],
    ['גמא', 'סיימתי תואר שני מאוניברסיטת גמא.'],
  ])('reads %s through a prefixed trigger', (name, sentence) => {
    expect(finds(sentence, name)).toBe(true);
  });
});

describe('what it still refuses to call an organisation', () => {
  // Each of these was produced by an earlier version of this detector and
  // shown to nobody only because it was caught here first. Telling somebody
  // they named an organisation they never named is the anti-goal in
  // `docs/TELOS.md` running backwards.
  it.each([
    ['a generic industry, not a company', 'עבדתי בחברת הביטוח הגדולה בארץ.'],
    ['a verb that opens with ב', 'בניתי תהליך עבודה חדש לצוות.'],
    ['a second verb that opens with ב', 'ביקשתי מהצוות לשנות את סדר העבודה.'],
    ['something published, not somewhere worked', 'פרסמתי ברשת מאמר על הנושא.'],
    ['a person, not a company', 'מיכל ברק ניהלה את הפרויקט מתחילתו.'],
    ['a client nobody named', 'עבדתי אצל לקוח גדול בתחום הפיננסי.'],
    ['a school as an errand', 'הסעתי את הילדים לבית הספר כל בוקר.'],
  ])('%s', (_why, sentence) => {
    expect(nouns(sentence)).toEqual([]);
  });
});

describe('a captured name stops where the name stops', () => {
  it('does not swallow the particle after a one-word name', () => {
    // Returned an organisation called *"בוסטון את"*.
    const found = nouns('ייסדתי באוניברסיטת בוסטון את התוכנית הראשונה.');
    expect(found).toContain('בוסטון');
    expect(found.some((n) => n.includes(' את'))).toBe(false);
  });

  it('does not swallow the duration after a name', () => {
    // Returned a bank called *"בנק הפועלים חמש"*.
    const found = nouns('עבדתי בבנק הפועלים חמש שנים.');
    expect(found).toContain('בנק הפועלים');
    expect(found.some((n) => n.includes('חמש'))).toBe(false);
  });

  it('does not swallow the date frame after a name', () => {
    // Returned a broadcaster called *"ערוץ 10 בשנת"*.
    const found = nouns('הפינה שהגשתי שודרה בערוץ 10 בשנת 2011.');
    expect(found.some((n) => n.includes('בשנת'))).toBe(false);
  });

  it('does not run one organisation into the next', () => {
    // Returned *"לרפואה באוניברסיטת"* — half a school and the start of a
    // university.
    const found = nouns('מוניתי למרצה בבית הספר לרפואה באוניברסיטת גמא.');
    expect(found.some((n) => n.includes('באוניברסיטת'))).toBe(false);
  });
});

describe('the form that is still missed, on purpose', () => {
  // A bare `ב` straight onto the name. 38% of the measured instances, and the
  // only class where reading it means guessing whether the letter is a
  // preposition or the first letter of a verb. Reading it was tried and
  // reverted: it reported a company called *"ניתי תהליך"*. This stays missed
  // and `docs/METHOD.md` says so, rather than being traded for a fabrication.
  it('does not read a workplace named with a bare ב', () => {
    expect(nouns('עבדתי כמנהל מוצר בניקלודיאון שלוש שנים.')).toEqual([]);
  });
});

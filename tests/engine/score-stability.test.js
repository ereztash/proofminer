/**
 * How much a score moves when the sentence means the same thing.
 *
 * This product shows a person a number about their own material and a verdict
 * against two thresholds — `BAND_USABLE` at 45, `BAND_STRONG` at 68. Nothing in
 * this repository had ever asked what the measurement error on that number is,
 * and a point estimate published without one is a claim about precision nobody
 * had checked. At a boundary it is the difference between *this clears the bar*
 * and *this does not*.
 *
 * **The risk was written down before it was run:** if a rewrite a person would
 * call the same sentence moves the score materially, the band is noise at the
 * threshold. The prediction was a median under five points but more than a tenth
 * of near-boundary rewrites crossing a band.
 *
 * **The measured answer, 26 August 2026: 126 of 127 rewrites moved the score by
 * exactly zero, and not one crossed a band — including seventy rewrites of items
 * sitting within five points of a threshold.** The second half of the prediction
 * was wrong. The scorer is lexical and deterministic, and it turns out that is
 * enough: the dimensions read features that survive punctuation and word order.
 *
 * **Then it was run again on sentences written fresh, and it crossed twice.**
 * The first run used the items in `recall-floor.test.js` — fixtures written by
 * somebody who already knew the scorer, which is the exact error this project
 * spent the day chasing elsewhere. On new sentences: a Hebrew attribution fell
 * seven points and a band when its commas were stripped, and an English claim
 * *rose* six points and a band when three meaningless words were put in front
 * of it.
 *
 * The two failures are not the same kind of thing, and the tests below are
 * shaped by the difference.
 *
 * - **The rise was a defect and is fixed.** `All in all, ` produced a proper
 *   noun called *"All"*. See `CAPITALISED_FUNCTION_WORDS` in `signals.js`.
 * - **The fall was my misclassification.** `שם, תפקיד` is how Hebrew marks an
 *   apposition; the comma is what separates *Yael Berkovitz, head of
 *   operations* from a noun phrase ending in a role word. Making it optional
 *   reports a person called *"עבודה מול"* out of `עבודה מול מנהל`. A comma
 *   there is information, and calling its removal meaning-preserving was
 *   wrong. It is out of the list, and recorded here because the sensitivity is
 *   real and somebody will rediscover it.
 */

import { describe, expect, it } from 'vitest';
import { analyzeClaim } from '../../src/engine/mine.js';
import { BAND_STRONG, BAND_USABLE } from '../../src/engine/score.js';

const NOW = Date.parse('2026-08-25');
const score = (claim) => analyzeClaim(claim, { positioning: {}, now: NOW }).score;
const band = (n) => (n >= BAND_STRONG ? 'strong' : n >= BAND_USABLE ? 'usable' : 'weak');

/**
 * Sentences carrying a checkable line, in both languages, at both sides of the
 * usable bar. Written for this test.
 */
const ITEMS = [
  ['he', 'ב-2025 קיצרתי באלפא לוגיסטיקה את זמן האספקה מ-19 יום ל-7 ימים.'],
  ['he', 'עמית בתחום, יעל ברקוביץ, מנהלת תפעול בבטא תעשיות, אמרה שהתהליך שבניתי שינה להם את הרבעון.'],
  ['he', 'ליוויתי שמונה צוותים במשך שנתיים, ובכל אחד מהם זמן ההחלטה התקצר.'],
  ['he', 'הלקוח כתב לי אחרי הפרויקט שזו הפעם הראשונה שהם יודעים מה קורה במחסן.'],
  ['en', 'In 2025 I cut delivery time at Alpha Logistics from 19 days to 7 days.'],
  ['en', 'A peer in the field, Yael Berkovitz, head of operations at Beta Industries, said the process I built changed their quarter.'],
  ['en', 'I ran eight teams over two years, and decision time fell in every one of them.'],
  ['en', 'The client wrote to me afterwards that it was the first time they knew what was happening in the warehouse.'],
];

/**
 * Rewrites that add and remove nothing a reader would call information.
 * Punctuation that carries grammar is not in this list — see the note above.
 */
const REWRITES = [
  ['trailing full stop removed', (s) => s.replace(/[.]\s*$/u, '')],
  ['double space after a full stop', (s) => s.replace(/\.\s/gu, '.  ')],
  ['opened with a filler', (s, lang) => (lang === 'he' ? `בסך הכול, ${s}` : `All in all, ${s}`)],
  ['closed with a filler', (s, lang) => (lang === 'he' ? `${s} זה הסיפור.` : `${s} That is the story.`)],
  ['line wrapped', (s) => s.replace(' ', '\n')],
  ['non-breaking space', (s) => s.replace(' ', ' ')],
];

/**
 * Downward drift is bounded; upward drift is refused outright. The asymmetry is
 * the point: losing a signal when text is degraded is a detector doing its job
 * badly, and gaining one when nothing was added is the product contradicting
 * its own reason to exist.
 */
const MAX_DRIFT = 5;

describe('a score under rewrites that preserve the meaning', () => {
  it('never rises, because words that carry nothing may not add anything', () => {
    // The hard invariant, and the one that was actually broken. `All in all, `
    // in front of an English sentence produced a proper noun called "All",
    // which lifted falsifiability 24 to 46, verification 62 to 74, specificity
    // 24 to 36 and narrative 58 to 64, carrying the claim from `weak` across
    // BAND_USABLE. Three meaningless words upgraded the evidence beneath them.
    // Everything else in this file is a bound; this one is a refusal.
    const raised = [];
    for (const [lang, claim] of ITEMS) {
      const base = score(claim);
      for (const [name, rewrite] of REWRITES) {
        const variant = rewrite(claim, lang);
        if (variant === claim) continue;
        const after = score(variant);
        if (after > base) raised.push(`${lang} "${name}": ${base} → ${after}`);
      }
    }
    expect(raised).toEqual([]);
  });

  it('never moves more than the measured worst case', () => {
    const moved = [];
    for (const [lang, claim] of ITEMS) {
      const base = score(claim);
      for (const [name, rewrite] of REWRITES) {
        const variant = rewrite(claim, lang);
        if (variant === claim) continue;
        const drift = Math.abs(score(variant) - base);
        if (drift > MAX_DRIFT) moved.push(`${lang} "${name}": ${base} → ${score(variant)}`);
      }
    }
    expect(moved).toEqual([]);
  });

  it('never moves a claim across a band, which is the part a user sees', () => {
    // The number is shown, but the *verdict* is what gets acted on: below the
    // usable bar the product refuses to draft. A rewrite that flips that is a
    // coin toss presented as a measurement.
    const crossed = [];
    for (const [lang, claim] of ITEMS) {
      const before = band(score(claim));
      for (const [name, rewrite] of REWRITES) {
        const variant = rewrite(claim, lang);
        if (variant === claim) continue;
        const after = band(score(variant));
        if (after !== before) crossed.push(`${lang} "${name}": ${before} → ${after}`);
      }
    }
    expect(crossed).toEqual([]);
  });

  it('is identical for the identical string, twice', () => {
    // Determinism is assumed everywhere in this repository and asserted
    // nowhere. If it ever stops holding, every other number here stops meaning
    // anything, and this is the cheapest possible tripwire.
    for (const [, claim] of ITEMS) expect(score(claim)).toBe(score(claim));
  });
});

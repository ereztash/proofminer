import { describe, expect, it } from 'vitest';
import {
  MAGNITUDE_ONLY,
  SPARSE_MAGNITUDE,
  acquisitionPlays,
  archetypeCoverage,
  magnitudeDensity,
} from '../../src/engine/gaps.js';
import { extractSignals, inferArchetypes } from '../../src/engine/signals.js';
import { NOW, proofFrom, stateWith } from '../helpers.js';
import heBundle from '../../src/i18n/he.js';
import enBundle from '../../src/i18n/en.js';

const POSITIONING = {
  audience: 'מנהלי תפעול בחברות קמעונאיות',
  transformation: 'תהליך עבודה שאפשר לנהל',
  claim: '',
  offer: '',
};

const proof = (claim) => proofFrom(claim, { positioning: POSITIONING, now: NOW });
const inventory = (...claims) =>
  stateWith({ positioning: POSITIONING, proofs: claims.map(proof) });

/**
 * Best-practice evidence for each archetype written with **no magnitude at
 * all** — the route the play copy now promises. These are the fixtures behind
 * the score table in `gaps.js`, and behind every `plays.*.without` line.
 */
const WITHOUT_MAGNITUDE = {
  OUTCOME:
    'ב-2025 בחברת אלפא לוגיסטיקה האספקה הייתה מתעכבת כל שבוע, ואחרי שבניתי את התהליך היא הפסיקה להתעכב.',
  VALIDATION:
    'רונית לוי, מנהלת התפעול של אלפא לוגיסטיקה, כתבה ב-2025: "התהליך שבנית הוא היחיד ששרד אצלנו שנה שלמה".',
  PEER:
    'עמית בתחום, דוד לוי, סמנכ"ל תפעול בבטא תעשיות, אזכר את העבודה שלי בהרצאה בכנס הלוגיסטיקה. https://conf.co.il',
  METHOD:
    'ב-2024 כתבתי את שיטת העבודה שלי כמסמך פתוח באתר של אלפא לוגיסטיקה: מיפוי צווארי בקבוק, תיעדוף לפי עלות, פיילוט באתר אחד, מדידה שבועית, הרחבה. https://example.co.il/method',
  ORIGIN:
    'ב-2011 עבדתי במפעל של אלפא תעשיות וראיתי קו ייצור שלם נעצר בגלל טעות בספירת מלאי. מאז אני עוסק רק בזה.',
  // Deliberately not "תואר שני": the spelled-out-number detector reads שני as a
  // magnitude, which would make this fixture prove the opposite of its label.
  CREDENTIAL:
    'תואר במנהל עסקים מאוניברסיטת תל אביב, 2018, בהתמחות לוגיסטיקה. https://tau.ac.il',
};

/** Claims with nothing a magnitude detector could latch onto. */
const NO_NUMBERS = [
  'ליוויתי מנהלי תפעול בחברות קמעונאיות והתהליך שבניתי נשאר אצלם.',
  'כתבתי את שיטת העבודה שלי כמסמך פתוח והיא בשימוש אצל לקוחות.',
  'מנהלת התפעול של אלפא לוגיסטיקה כתבה שהתהליך שבנינו שרד אצלה.',
];

describe('the route without a magnitude', () => {
  it('exists for every archetype except SCALE', () => {
    for (const [archetype, claim] of Object.entries(WITHOUT_MAGNITUDE)) {
      const signals = extractSignals(claim);
      expect(signals.numberCount, `${archetype} fixture carries a magnitude`).toBe(0);

      const state = inventory(claim);
      const c = archetypeCoverage(state).find((x) => x.archetype === archetype);
      expect(
        c.covered,
        `${archetype} without a magnitude scored ${c.best}, bar is ${c.threshold}`,
      ).toBe(true);
    }
  });

  it('does not exist for SCALE, because SCALE is a count', () => {
    // Not "scores low" — not classified as SCALE at all. `hasScaleUnit`
    // requires a digit beside the unit, so no wording reaches this archetype.
    const claim = 'ליוויתי הרבה מאוד חברות קמעונאיות לאורך השנים.';
    expect(extractSignals(claim).numberCount).toBe(0);
    expect(inferArchetypes(extractSignals(claim))).not.toContain('SCALE');
    expect(MAGNITUDE_ONLY).toBe('SCALE');
  });

  it('scores the same claim lower once its magnitude is removed', () => {
    // Stated exactly this narrowly on purpose. A richer claim without a number
    // can and does outscore a terser one with a number — the first draft of
    // this test asserted the general form and was wrong by three points. What
    // holds, and what the copy is allowed to say, is the controlled version:
    // hold the claim still, take the figure out, the score drops.
    const withNumber = proof(
      'ב-2025 קיצרתי אצל אלפא לוגיסטיקה את זמן האספקה מ-19 יום ל-7 ימים, ומאז הוא לא עלה בחזרה.',
    );
    const without = proof(
      'ב-2025 קיצרתי אצל אלפא לוגיסטיקה את זמן האספקה מהמצב שהיה למצב סביר, ומאז הוא לא עלה בחזרה.',
    );
    expect(extractSignals(without.claim).numberCount).toBe(0);
    expect(withNumber.score).toBeGreaterThan(without.score);
  });
});

describe('magnitude density', () => {
  it('says nothing about an inventory too small to read', () => {
    expect(magnitudeDensity(inventory(NO_NUMBERS[0]))).toBeNull();
    expect(magnitudeDensity(inventory(NO_NUMBERS[0], NO_NUMBERS[1]))).toBeNull();
  });

  it('reports the share once there is enough to count', () => {
    const density = magnitudeDensity(inventory(...NO_NUMBERS));
    expect(density).not.toBeNull();
    expect(density.units).toBe(3);
    expect(density.withMagnitude).toBe(0);
    expect(density.share).toBe(0);
  });

  it('counts a unit as carrying a magnitude only when it really does', () => {
    const density = magnitudeDensity(
      inventory(...NO_NUMBERS, 'ניהלתי 22 עובדים בשלושה אתרים בשנת 2024.'),
    );
    expect(density.withMagnitude).toBe(1);
    expect(density.share).toBeGreaterThan(SPARSE_MAGNITUDE);
  });
});

describe('ranking under a magnitude-free inventory', () => {
  const scaleValue = (state) =>
    acquisitionPlays(state).find((p) => p.archetype === 'SCALE');

  it('sorts the count-only play down when nothing in the inventory has a number', () => {
    const sparse = scaleValue(inventory(...NO_NUMBERS));
    expect(sparse.deprioritised).toBe(true);
    expect(sparse.magnitudeOnly).toBe(true);

    // The point of the demotion: asking a client for a sentence now outranks
    // "go and count things" for someone who has nothing to count.
    const plays = acquisitionPlays(inventory(...NO_NUMBERS));
    const rank = (a) => plays.findIndex((p) => p.archetype === a);
    expect(rank('SCALE')).toBeGreaterThan(rank('PEER'));
    expect(rank('SCALE')).toBeGreaterThan(rank('METHOD'));
  });

  it('leaves it alone when the user demonstrably does write numbers down', () => {
    const state = inventory(
      'ניהלתי 22 עובדים בשלושה אתרים בשנת 2024.',
      'ב-2025 קיצרתי את זמן האספקה מ-19 יום ל-7 ימים.',
      'ליוויתי 34 חברות קמעונאיות בין 2019 ל-2025.',
    );
    expect(scaleValue(state)?.deprioritised ?? false).toBe(false);
  });

  it('leaves it alone when there is not enough inventory to judge', () => {
    expect(scaleValue(inventory(NO_NUMBERS[0]))?.deprioritised ?? false).toBe(false);
  });

  it('changes the order and nothing else', () => {
    // The Liebig gate, the thresholds and coverage itself must be identical
    // whether or not the demotion fired. This is ranking, not scoring.
    const state = inventory(...NO_NUMBERS);
    const coverage = archetypeCoverage(state);
    const scale = coverage.find((c) => c.archetype === 'SCALE');
    expect(scale.threshold).toBe(45);
    expect(scale.covered).toBe(false);

    for (const play of acquisitionPlays(state)) {
      const c = coverage.find((x) => x.archetype === play.archetype);
      expect(play.threshold).toBe(c.threshold);
      expect(play.currentBest).toBe(c.best);
    }
  });

  it('keeps plays sorted by value', () => {
    const plays = acquisitionPlays(inventory(...NO_NUMBERS));
    for (let i = 1; i < plays.length; i += 1) {
      expect(plays[i - 1].value).toBeGreaterThanOrEqual(plays[i].value);
    }
  });
});

describe('the copy that promises the route', () => {
  it('gives every play a without-a-number line in both locales', () => {
    for (const bundle of [heBundle, enBundle]) {
      for (const [id, play] of Object.entries(bundle.plays)) {
        expect(typeof play.without, id).toBe('string');
        expect(play.without.length, id).toBeGreaterThan(20);
      }
    }
  });

  it('states the cost of the route rather than implying the two are equal', () => {
    for (const bundle of [heBundle, enBundle]) {
      expect(typeof bundle.gaps.withoutLabel).toBe('string');
      expect(typeof bundle.gaps.withoutCost).toBe('string');
      expect(typeof bundle.gaps.sparseNote).toBe('string');
    }
  });
});

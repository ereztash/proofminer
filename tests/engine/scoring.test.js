import { describe, expect, it } from 'vitest';
import { extractSignals, inferArchetypes, inferKind, inferOccurredAt, spelledNumbers } from '../../src/engine/signals.js';
import { makeContext, scoreDimensions, PRIOR_WEIGHTS } from '../../src/engine/dimensions.js';
import {
  DECAY_FLOOR,
  compositeScore,
  daysUntilStale,
  decayFactor,
  dedupeProofs,
  scoreBand,
} from '../../src/engine/score.js';
import { analyzeClaim, mineSources } from '../../src/engine/mine.js';
import { sumValues } from '../../src/core/util.js';
import { GENERIC_EN, GENERIC_HE, NOW, DAY, STRONG_EN, STRONG_HE, proofFrom, stateWith } from '../helpers.js';

describe('signal extraction', () => {
  it('finds third-party validation in both languages', () => {
    expect(extractSignals(STRONG_HE).thirdParty).toBe(true);
    expect(extractSignals(STRONG_EN).thirdParty).toBe(true);
  });

  it('flags generic self-description in both languages', () => {
    expect(extractSignals(GENERIC_HE).generic).toBe(true);
    expect(extractSignals(GENERIC_EN).generic).toBe(true);
  });

  it('does not count years as specificity numbers', () => {
    const s = extractSignals('בשנת 2019 עבדתי בחברה גדולה במשרה מלאה בתחום הזה');
    expect(s.years).toContain(2019);
    expect(s.numberCount).toBe(0);
  });

  it('counts real magnitudes', () => {
    const s = extractSignals('ההכנסות גדלו ב-38% והגיעו ל-27,000 שקל בתוך ארבעה חודשים');
    expect(s.hasPercent).toBe(true);
    expect(s.numberCount).toBeGreaterThanOrEqual(2);
  });

  it('detects mixed-language markers', () => {
    // "published an article" is the user publishing — self-authored, not
    // somebody else vouching. The marker has to be an external act.
    const s = extractSignals('הרצתי POC מול 3 clients ואז featured in a trade magazine על זה');
    expect(s.thirdParty).toBe(true);
  });

  it('does not read ordinary self-authored work as external validation', () => {
    // The thirdParty lexicon was the only one without word boundaries, so it
    // matched inside words — `press` in "compressed", `פרס` in "פרסום" — and
    // scored a line the user wrote about themselves as somebody else's word.
    const selfAuthored = [
      'I worked under pressure to close the quarter in six days.',
      'We compressed the onboarding cycle from three weeks to six days.',
      'I reviewed the budget spreadsheet every Monday for two years.',
      'Ran 40+ customer discovery interviews per year.',
      'Selected and onboarded the new billing vendor.',
      'Won the internal hackathon.',
      'ניהלתי את תקציב הפרסום הדיגיטלי של החברה במשך שלוש שנים.',
      'ניהלתי את מחלקת הביקורת הפנימית מול רשות המסים.',
      'זכיתי לעבוד עם צוות מצוין במשך ארבע שנים באגף התפעול.',
      'נבחרתי לרכז את פרויקט המעבר למערכת החדשה.',
      'הגדלתי את ההכנסות של המחלקה ב-30% בשנתיים.',
      'עברתי ראיון אצל מנהל הפיתוח של החברה.',
    ];
    for (const text of selfAuthored) {
      expect(extractSignals(text).thirdParty, text).toBe(false);
    }
  });

  it('still reads a genuine external act as validation', () => {
    const external = [
      'I was featured in Forbes last year.',
      'My client was quoted in a trade article about the rollout.',
      'Interviewed by the Marketing Week podcast in 2025.',
      'התראיינתי לפודקאסט מקצועי על לוגיסטיקה.',
      'הרצאתי בכנס הלוגיסטיקה 2025 מול 300 משתתפים.',
      'לקוח סיפר בכתבה שההכנסות שלו גדלו בעקבות העבודה איתי.',
    ];
    for (const text of external) {
      expect(extractSignals(text).thirdParty, text).toBe(true);
    }
  });

  it('marks demo text from the text itself', () => {
    expect(extractSignals('[דמו בלבד] משהו').demo).toBe(true);
    expect(extractSignals('[demo only] something').demo).toBe(true);
  });
});

describe('kind and archetype inference', () => {
  it('classifies a credential', () => {
    expect(inferKind(extractSignals('סיימתי תואר שני בהצטיינות עם ממוצע 93'))).toBe('credential');
  });

  it('classifies media coverage', () => {
    expect(inferKind(extractSignals(STRONG_HE))).toBe('media');
  });

  it('assigns OUTCOME only when there is a change plus a delta', () => {
    const withDelta = inferArchetypes(extractSignals('הפחתתי את זמן הטיפול ב-40% תוך חודשיים'));
    const withoutDelta = inferArchetypes(extractSignals('אני עוסק בשיפור תהליכים בארגונים'));
    expect(withDelta).toContain('OUTCOME');
    expect(withoutDelta).not.toContain('OUTCOME');
  });

  it('reads an explicit year as the occurrence date', () => {
    const at = inferOccurredAt(extractSignals('בשנת 2022 הובלתי את הפרויקט הגדול הזה'), NOW);
    expect(new Date(at).getUTCFullYear()).toBe(2022);
  });

  it('refuses to invent a date for undated claims', () => {
    expect(inferOccurredAt(extractSignals('ניהלתי צוות פיתוח גדול'), NOW)).toBeNull();
  });

  it('ignores future years rather than trusting them', () => {
    expect(inferOccurredAt(extractSignals('בשנת 2044 אעשה משהו גדול מאוד'), NOW)).toBeNull();
  });
});

describe('dimension scoring', () => {
  const ctx = (text, positioning = {}) => {
    const context = makeContext(positioning, NOW);
    context.text = text;
    return context;
  };

  it('scores verifiable third-party evidence far above generic self-description', () => {
    const strong = scoreDimensions(extractSignals(STRONG_HE), ctx(STRONG_HE));
    const generic = scoreDimensions(extractSignals(GENERIC_HE), ctx(GENERIC_HE));
    expect(compositeScore(strong)).toBeGreaterThan(compositeScore(generic) + 25);
  });

  it('penalises generic traits on falsifiability specifically', () => {
    const generic = scoreDimensions(extractSignals(GENERIC_HE), ctx(GENERIC_HE));
    expect(generic.falsifiability).toBeLessThan(30);
  });

  it('raises icpFit when the claim matches the declared audience', () => {
    const claim = 'עזרתי לשלושה מנהלי כספים בחברות תעשייה לקצר את סגירת הרבעון בשבוע';
    const positioning = { audience: 'מנהלי כספים בחברות תעשייה', transformation: 'סגירת רבעון מהירה' };
    const withAudience = scoreDimensions(extractSignals(claim), ctx(claim, positioning));
    const withoutAudience = scoreDimensions(extractSignals(claim), ctx(claim));
    expect(withAudience.icpFit).toBeGreaterThan(withoutAudience.icpFit);
  });

  it('never returns a score outside 0..100', () => {
    for (const text of [STRONG_HE, GENERIC_HE, STRONG_EN, GENERIC_EN, '', 'א']) {
      const scores = Object.values(scoreDimensions(extractSignals(text), ctx(text)));
      for (const score of scores) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('composite score', () => {
  it('has priors summing to 100', () => {
    expect(sumValues(PRIOR_WEIGHTS)).toBe(100);
  });

  it('renormalises when given a partial weight map', () => {
    const breakdown = { verification: 80, icpFit: 40 };
    expect(compositeScore(breakdown, { verification: 1, icpFit: 1 })).toBe(60);
  });

  it('returns 0 rather than NaN for an empty breakdown', () => {
    expect(compositeScore({}, PRIOR_WEIGHTS)).toBe(0);
  });

  it('labels bands by text, not only colour', () => {
    expect(scoreBand(90)).toBe('strong');
    expect(scoreBand(60)).toBe('usable');
    expect(scoreBand(20)).toBe('weak');
  });
});

describe('decay', () => {
  it('is 1 for evidence from today and decreases with age', () => {
    const fresh = { occurredAt: NOW, createdAt: NOW, kind: 'traction' };
    const old = { occurredAt: NOW - 365 * DAY, createdAt: NOW, kind: 'traction' };
    expect(decayFactor(fresh, NOW)).toBeCloseTo(1, 5);
    expect(decayFactor(old, NOW)).toBeLessThan(decayFactor(fresh, NOW));
  });

  it('decays traction faster than a credential', () => {
    const age = NOW - 400 * DAY;
    const traction = decayFactor({ occurredAt: age, createdAt: NOW, kind: 'traction' }, NOW);
    const credential = decayFactor({ occurredAt: age, createdAt: NOW, kind: 'credential' }, NOW);
    expect(traction).toBeLessThan(credential);
  });

  it('never drops below the floor', () => {
    const ancient = { occurredAt: NOW - 20_000 * DAY, createdAt: NOW, kind: 'traction' };
    expect(decayFactor(ancient, NOW)).toBeGreaterThanOrEqual(DECAY_FLOOR);
  });

  it('decays undated evidence at half rate rather than punishing it as old', () => {
    const anchor = NOW - 400 * DAY;
    const dated = decayFactor({ occurredAt: anchor, createdAt: anchor, kind: 'outcome' }, NOW);
    const undated = decayFactor({ occurredAt: null, createdAt: anchor, kind: 'outcome' }, NOW);
    expect(undated).toBeGreaterThan(dated);
  });

  it('reports days until stale, decreasing with age', () => {
    const fresh = daysUntilStale({ occurredAt: NOW, createdAt: NOW, kind: 'traction' }, NOW);
    const older = daysUntilStale(
      { occurredAt: NOW - 100 * DAY, createdAt: NOW, kind: 'traction' },
      NOW,
    );
    expect(fresh).toBeGreaterThan(older);
  });
});

describe('dedupe', () => {
  it('drops a claim fully restated inside a kept one', () => {
    const long = proofFrom(
      'העברתי הרצאה על הנדסת פרומפטים מול שמונים מנהלים בכנס מקצועי גדול בתחום',
    );
    const short = proofFrom('העברתי הרצאה על הנדסת פרומפטים');
    expect(dedupeProofs([long, short])).toHaveLength(1);
  });

  it('keeps genuinely distinct claims', () => {
    const a = proofFrom('הכנסות הלקוח גדלו בשלושים ושמונה אחוזים בתוך ארבעה חודשים');
    const b = proofFrom('התראיינתי לכתבה מקצועית על בינה מלאכותית בעסקים קטנים');
    expect(dedupeProofs([a, b])).toHaveLength(2);
  });
});

describe('mining', () => {
  const source = {
    id: 'src_1',
    name: 'CV',
    demo: false,
    addedAt: NOW,
    text: [
      STRONG_HE,
      GENERIC_HE,
      'העברתי הרצאה על הנדסת פרומפטים מול כשמונים מנהלים בכנס מקצועי בשנת 2025.',
    ].join('\n'),
  };

  it('ranks verifiable evidence above generic self-description', () => {
    const proofs = mineSources(stateWith({ sources: [source] }), { now: NOW });
    const generic = proofs.find((p) => p.claim.includes('יצירתי'));
    expect(proofs[0].score).toBeGreaterThan(generic.score);
    // The generic line is what this ICP writes by default; it must rank last.
    expect(proofs[proofs.length - 1].id).toBe(generic.id);
  });

  it('preserves pin and dismiss decisions across re-mining', () => {
    const state = stateWith({ sources: [source] });
    state.proofs = mineSources(state, { now: NOW });
    state.proofs[0].pinned = true;
    state.proofs[1].dismissed = true;
    const pinnedClaim = state.proofs[0].claim;
    const dismissedClaim = state.proofs[1].claim;

    const remined = mineSources(state, { now: NOW });
    expect(remined.find((p) => p.claim === pinnedClaim).pinned).toBe(true);
    expect(remined.find((p) => p.claim === dismissedClaim).dismissed).toBe(true);
  });

  it('carries compounded proof through re-mining untouched', () => {
    const state = stateWith({ sources: [source] });
    state.proofs = [proofFrom('פוסט שפרסמתי הגיע ל-12,000 חשיפות', { origin: 'compounded' })];
    const remined = mineSources(state, { now: NOW });
    expect(remined.some((p) => p.origin === 'compounded')).toBe(true);
  });

  it('marks proof from a demo source as demo', () => {
    const demoSource = { ...source, id: 'src_demo', demo: true };
    const proofs = mineSources(stateWith({ sources: [demoSource] }), { now: NOW });
    expect(proofs.every((p) => p.demo)).toBe(true);
  });

  it('re-ranks the same evidence when positioning changes', () => {
    const claim = 'עזרתי למנהלי כספים בתעשייה לקצר את סגירת הרבעון בשבוע שלם';
    const neutral = analyzeClaim(claim, { positioning: {}, now: NOW });
    const targeted = analyzeClaim(claim, {
      positioning: { audience: 'מנהלי כספים בתעשייה', transformation: 'סגירת רבעון' },
      now: NOW,
    });
    expect(targeted.score).toBeGreaterThan(neutral.score);
  });
});

describe('Hebrew writes numbers as words', () => {
  it('reads the dual forms', () => {
    // `יומיים` *is* the number two. Without these the same fact scored 49 in
    // digits and 38 in words, and a client email saying "סוגרים הזמנה ביומיים"
    // registered no magnitude at all and ranked last.
    for (const [text, value] of [
      ['סוגרים הזמנה ביומיים', 2],
      ['ניסיון של שנתיים', 2],
      ['תוך שבועיים', 2],
      ['נמשך חודשיים', 2],
    ]) {
      expect(spelledNumbers(text), text).toContain(value);
      expect(extractSignals(text).numberCount, text).toBeGreaterThan(0);
    }
  });

  it('reads a claim signed by a named person with a role as third-party', () => {
    const signed = 'היום אנחנו סוגרים הזמנה ביומיים והצוות מרוצה — יוסי כהן, מנכ"ל, חברת גמא לוגיסטיקה';
    expect(extractSignals(signed).thirdParty).toBe(true);
  });

  it('does not read the user describing their own role as third-party', () => {
    for (const text of [
      'ניהלתי צוות של 22 עובדים — מנהל תפעול בכיר',
      'שימשתי כמנהל הפרויקט לאורך שנתיים',
      'I was the director of operations for four years',
    ]) {
      expect(extractSignals(text).thirdParty, text).toBe(false);
    }
  });
});

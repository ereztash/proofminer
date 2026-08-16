/**
 * Regressions for defects found by adversarial review.
 *
 * Each test here corresponds to a specific way the engine was wrong. They are
 * grouped separately from the feature tests because their value is in never
 * passing vacuously: several of the defects below were invisible to the
 * existing suite precisely because the suite asserted the shape of the answer
 * rather than the property that had to hold.
 */

import { describe, expect, it } from 'vitest';
import { analyzeClaim, mineSources } from '../../src/engine/mine.js';
import { extractSignals, spelledNumbers } from '../../src/engine/signals.js';
import { dedupeProofs, decayFactor, scoreBand } from '../../src/engine/score.js';
import {
  RATE_ANCHOR,
  layerReception,
  receptionScore,
  receptionSignal,
} from '../../src/engine/layers.js';
import { computeAuthority, nextMove } from '../../src/engine/authority.js';
import { normalizeState } from '../../src/core/schema.js';
import { saturate } from '../../src/core/util.js';
import { escapeHtml, toString_ } from '../../src/ui/html.js';
import { button } from '../../src/ui/components.js';
import { NOW, DAY, artifact, proofFrom, reception, stateWith } from '../helpers.js';

describe('determinism', () => {
  // A module-level /g regex probed with .test() advances its own lastIndex, so
  // consecutive calls alternated true/false. Identical input produced scores
  // 4-6 points apart and the proof ranking inverted between two presses of the
  // same button.
  const LATIN = 'At Contoso Systems I cut onboarding time by 40% in 2024, verified by Acme Corp.';

  it('scores identical input identically, ten times running', () => {
    const scores = Array.from(
      { length: 10 },
      () => analyzeClaim(LATIN, { positioning: {}, now: NOW }).score,
    );
    expect(new Set(scores).size).toBe(1);
  });

  it('extracts identical signals on repeat calls', () => {
    const a = extractSignals(LATIN);
    const b = extractSignals(LATIN);
    expect(a.hasProperNoun).toBe(b.hasProperNoun);
    expect(a.properNouns).toEqual(b.properNouns);
  });

  it('produces a stable ranking across repeated mining runs', () => {
    const source = {
      id: 's1',
      name: 'cv',
      demo: false,
      addedAt: NOW,
      text: [
        'At Acme Corp I reduced onboarding time by 40% during 2024.',
        'At Contoso Systems I grew revenue by 22% across two quarters.',
        'At Northwind Traders I launched a new support process for 300 clients.',
      ].join('\n'),
    };
    const first = mineSources(stateWith({ sources: [source] }), { now: NOW });
    const second = mineSources(stateWith({ sources: [source] }), { now: NOW });
    expect(second.map((p) => p.claim)).toEqual(first.map((p) => p.claim));
    expect(second.map((p) => p.score)).toEqual(first.map((p) => p.score));
  });
});

describe('spelled-out magnitudes', () => {
  it('reads Hebrew number words, including prefixed forms', () => {
    expect(spelledNumbers('משלושה שבועות לשישה ימים')).toEqual([3, 6]);
    expect(spelledNumbers('שלושה לקוחות')).toEqual([3]);
  });

  it('reads English number words', () => {
    expect(spelledNumbers('from three weeks to six days')).toEqual([3, 6]);
  });

  it('detects a stated shift between two magnitudes', () => {
    expect(extractSignals('קיצרתי משלושה שבועות לשישה ימים').contrast).toBe(true);
    expect(extractSignals('I shortened it from three weeks to six days').contrast).toBe(true);
  });

  it('does not read an ordinary preposition as a range', () => {
    expect(extractSignals('מנהל בחברה לביטוח').contrast).toBe(false);
  });
});

describe('decay', () => {
  it('does not reset an undated proof clock when the user re-mines', () => {
    // Stamping `now` on every mining pass made an eight-year-old undated claim
    // brand new, silently rewarding the user for not dating their evidence.
    const captured = NOW - 8 * 365 * DAY;
    const source = {
      id: 's1',
      name: 'cv',
      demo: false,
      addedAt: captured,
      text: 'ניהלתי צוות פיתוח גדול והובלתי אותו לאורך זמן רב מאוד בארגון.',
    };
    const state = stateWith({ sources: [source] });
    state.proofs = mineSources(state, { now: captured });
    const before = decayFactor(state.proofs[0], NOW);

    const remined = mineSources(state, { now: NOW });
    expect(decayFactor(remined[0], NOW)).toBeCloseTo(before, 6);
    expect(remined[0].createdAt).toBe(captured);
  });
});

describe('curation survives re-mining', () => {
  it('never truncates away a pinned or dismissed unit', () => {
    // MAX_PROOFS truncated a purely score-sorted list, so a pinned low-scoring
    // unit was dropped along with the user's decision — and any artifact citing
    // it was left with a dangling reference.
    const lines = Array.from(
      { length: 80 },
      (_, i) => `בשנת 2024 הובלתי את פרויקט מספר ${i} מול לקוח בתחום התעשייה והבנקאות.`,
    );
    const weakest = 'אני אדם נחמד מאוד ואוהב אנשים בכל מצב שהוא בעולם.';
    const source = {
      id: 's1',
      name: 'cv',
      demo: false,
      addedAt: NOW,
      text: [...lines, weakest].join('\n'),
    };
    const state = stateWith({ sources: [source] });
    state.proofs = mineSources(state, { now: NOW });

    const pinned = state.proofs.find((p) => p.claim === weakest);
    expect(pinned).toBeTruthy();
    pinned.pinned = true;

    const remined = mineSources(state, { now: NOW });
    const survivor = remined.find((p) => p.claim === weakest);
    expect(survivor).toBeTruthy();
    expect(survivor.pinned).toBe(true);
  });
});

describe('dedupe cost', () => {
  it('handles a large document without quadratic re-tokenisation', () => {
    const proofs = Array.from({ length: 600 }, (_, i) =>
      proofFrom(`בשנת 2024 הובלתי את פרויקט מספר ${i} מול לקוח בתחום הבנקאות והביטוח.`),
    );
    const started = performance.now();
    dedupeProofs(proofs);
    // Loose bound: the point is that 600 claims is not seconds of blocked UI.
    expect(performance.now() - started).toBeLessThan(2000);
  });
});

describe('L4 reception', () => {
  const base = (over = {}) => ({
    impressions: 1000, reactions: 10, comments: 1, substantiveComments: 0,
    saves: 0, shares: 0, ...over,
  });

  it('stays locked below three records rather than scoring a number by itself', () => {
    // With a self-inclusive baseline a single record scored exactly 55 for
    // every possible input — a constant presented as a measurement.
    for (const n of [1, 2]) {
      const state = stateWith({
        receptions: Array.from({ length: n }, (_, i) => reception({ artifactId: `a${i}` })),
      });
      expect(layerReception(state, NOW).locked).toBe(true);
    }
  });

  it('is monotone: a better post scores higher than a worse one', () => {
    expect(receptionScore(base({ reactions: 80, substantiveComments: 10 }))).toBeGreaterThan(
      receptionScore(base({ reactions: 5 })),
    );
  });

  it('scores 50 exactly at the declared anchor', () => {
    // Reactions weigh 1 each, so this is exactly the anchor rate.
    expect(
      receptionScore(base({ impressions: 1000, comments: 0, reactions: RATE_ANCHOR * 1000 })),
    ).toBe(50);
  });

  it('detects a uniform improvement instead of normalising it away', () => {
    const weak = Array.from({ length: 4 }, (_, i) =>
      reception({ id: `w${i}`, artifactId: `a${i}`, ...base({ reactions: 5 }) }),
    );
    const strong = weak.map((r) => ({ ...r, reactions: 50 }));
    expect(layerReception(stateWith({ receptions: strong }), NOW).score).toBeGreaterThan(
      layerReception(stateWith({ receptions: weak }), NOW).score + 20,
    );
  });

  it('rises rather than falls when a genuinely strong post is added', () => {
    // The old form was capped at 55 by Jensen's inequality: publishing a hit
    // inflated the baseline it was divided by, so a good post lowered the layer.
    const ordinary = Array.from({ length: 6 }, (_, i) =>
      reception({ id: `r${i}`, artifactId: `a${i}`, ...base(), capturedAt: NOW - (i + 1) * DAY }),
    );
    const withHit = [
      ...ordinary,
      reception({
        id: 'r_hit', artifactId: 'a_hit', capturedAt: NOW - DAY,
        ...base({ reactions: 400, comments: 60, substantiveComments: 40, saves: 90, shares: 25 }),
      }),
    ];
    expect(layerReception(stateWith({ receptions: withHit }), NOW).score).toBeGreaterThan(
      layerReception(stateWith({ receptions: ordinary }), NOW).score,
    );
  });

  it('refuses to score a record with no impressions rather than inventing a mode', () => {
    expect(receptionSignal(base({ impressions: 0 }))).toBeNull();
    expect(receptionSignal(base()).mode).toBe('rate');
  });

  it('is completely unmoved by records that carry no impressions', () => {
    // A blank field first destroyed the layer, then — with a second,
    // independently-chosen anchor — inflated it by 52 points at large audience
    // sizes, rewarding the user for omitting the field. Now it does neither.
    const rated = Array.from({ length: 5 }, (_, i) =>
      reception({ id: `r${i}`, artifactId: `a${i}`, ...base(), capturedAt: NOW - (i + 1) * DAY }),
    );
    const clean = layerReception(stateWith({ receptions: rated }), NOW);
    const withBlanks = layerReception(
      stateWith({
        receptions: [
          ...rated,
          reception({ id: 'r_b1', artifactId: 'a_b1', ...base({ impressions: 0 }) }),
          reception({ id: 'r_b2', artifactId: 'a_b2', ...base({ impressions: 0, reactions: 900 }) }),
        ],
      }),
      NOW,
    );
    expect(withBlanks.score).toBe(clean.score);
    expect(withBlanks.confidence).toBe(clean.confidence);
    expect(withBlanks.inputs.unscorable).toBe(2);
  });

  it('has no single-day cliff as a record ages past the window', () => {
    const at = (d) =>
      layerReception(
        stateWith({
          receptions: [
            reception({ id: 'a', artifactId: 'a', ...base({ reactions: 80 }), capturedAt: NOW - 2 * DAY }),
            reception({ id: 'b', artifactId: 'b', ...base({ reactions: 80 }), capturedAt: NOW - 3 * DAY }),
            reception({ id: 'c', artifactId: 'c', ...base({ reactions: 2 }), capturedAt: NOW - d * DAY }),
          ],
        }),
        NOW,
      ).score;
    // The old hard set-swap stepped 23-38 points across this boundary.
    expect(Math.abs(at(90.5) - at(89.5))).toBeLessThan(2);
  });
});

describe('numeric safety', () => {
  it('saturate never returns NaN', () => {
    for (const v of [Infinity, -Infinity, Number.NaN, 0, -5]) {
      expect(Number.isNaN(saturate(v, 8))).toBe(false);
    }
  });

  it('the index stays finite for adversarial states', () => {
    const states = [
      stateWith(),
      stateWith({ proofs: [proofFrom('x'.repeat(400))] }),
      stateWith({ artifacts: [artifact({ publishedAt: Number.NaN })] }),
      stateWith({ receptions: [reception({ impressions: 0, reactions: 0, comments: 0 })] }),
    ];
    for (const state of states) {
      const r = computeAuthority(normalizeState(state), NOW);
      expect(Number.isFinite(r.index)).toBe(true);
      expect(Number.isFinite(r.gap)).toBe(true);
    }
  });
});

describe('imported data cannot reach markup', () => {
  const ATTACK = '"><img src=x onerror="alert(1)">';

  it('replaces an unsafe id from an imported file', () => {
    const state = normalizeState({
      proofs: [{ id: ATTACK, claim: 'ראיה כלשהי שנשמרה בקובץ', score: 50 }],
    });
    expect(state.proofs[0].id).not.toContain('<');
    expect(state.proofs[0].id).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('drops artifact proof references that are not safe ids', () => {
    const state = normalizeState({ artifacts: [{ proofIds: [ATTACK, 'proof_ok'] }] });
    expect(state.artifacts[0].proofIds).toEqual(['proof_ok']);
  });

  it('escapes every button attribute, including aria targets', () => {
    // The previous `attrs` option took an unescaped string built with a plain
    // template literal, and callers interpolated ids into it. That was a stored
    // XSS reachable through the product's own import feature.
    const markup = toString_(
      button('expand', 'x', {
        payload: { id: ATTACK },
        ariaLabel: ATTACK,
        ariaControls: ATTACK,
        ariaExpanded: true,
      }),
    );
    expect(markup).not.toContain('<img');
    expect(markup).toContain(escapeHtml(ATTACK));
    expect(markup).toContain('aria-expanded="true"');
  });

  it('renders boolean aria values as strings, not empty attributes', () => {
    const markup = toString_(button('pin', '★', { ariaPressed: false }));
    expect(markup).toContain('aria-pressed="false"');
  });

  it('emits a real disabled attribute rather than a raw string', () => {
    expect(toString_(button('mine', 'x', { disabled: true }))).toContain('disabled');
    expect(toString_(button('mine', 'x', { disabled: false }))).not.toContain('disabled');
  });
});

describe('band calibration', () => {
  const POSITIONING = {
    audience: 'מנהלי כספים בחברות תעשייה בינוניות',
    transformation: 'סגירת רבעון תוך שבוע במקום שלושה שבועות',
    claim: 'אני מקצר סגירות רבעון בתעשייה',
    offer: 'ליווי לצוות כספים',
  };

  /**
   * The exact strings the boundary comment in score.js cites. Asserted here so
   * the documented distribution cannot drift away from the engine — the
   * comment previously claimed 86/69/56/40/13 while the engine produced
   * 79/51/67/52/13, with the two load-bearing points inverted.
   */
  const REFERENCE = [
    [86, 'בכתבה שפורסמה בכלכליסט ב-2026 צוטט סמנכ"ל הכספים של חברת אלביט שאמר שקיצרתי את סגירת הרבעון שלהם משלושה שבועות לשישה ימים, חיסכון של 220,000 ש״ח בשנה — https://example.com/article'],
    [69, 'בכתבה שפורסמה ב-2025 באתר מקצועי צוטט לקוח שלי שסיפר שההכנסות שלו גדלו ב-38% בתוך ארבעה חודשים מהעבודה איתי.'],
    [56, 'קיצרתי את סגירת הרבעון של לקוח תעשייתי משלושה שבועות לשישה ימים ב-2025, חיסכון של 40 שעות עבודה בחודש.'],
    [52, 'פיתחתי תהליך בן חמישה שלבים לסגירת רבעון שאני מיישם זהה בכל לקוח מאז 2024.'],
    [49, 'ניהלתי צוות של שנים עשר אנשים במחלקת הכספים במשך ארבע שנים.'],
    [11, 'מאמינה בעבודת צוות ובלמידה מתמדת ובגישה אישית לכל לקוח.'],
  ];

  it('produces the distribution its own boundary comment claims', () => {
    for (const [expected, claim] of REFERENCE) {
      const { score } = analyzeClaim(claim, { positioning: POSITIONING, now: NOW });
      expect(score, claim.slice(0, 50)).toBeGreaterThanOrEqual(expected - 3);
      expect(score, claim.slice(0, 50)).toBeLessThanOrEqual(expected + 3);
    }
  });

  it('keeps the reference points in the bands the boundaries assign them', () => {
    const bandOf = (claim) =>
      scoreBand(analyzeClaim(claim, { positioning: POSITIONING, now: NOW }).score);
    expect(bandOf(REFERENCE[0][1])).toBe('strong');
    expect(bandOf(REFERENCE[1][1])).toBe('strong');
    expect(bandOf(REFERENCE[2][1])).toBe('usable');
    expect(bandOf(REFERENCE[5][1])).toBe('weak');
  });
});

describe('sources that yield nothing', () => {
  it('does not pin the guidance to a button that does nothing', () => {
    // A bulleted list under the sentence-length floor produced zero proofs, and
    // "mine" was inferred as undone from the absence of a proof carrying the
    // source id — so the product's single instruction became a no-op forever.
    const state = stateWith({
      sources: [{ id: 's1', name: 'list', text: '• קצר\n• גם קצר', demo: false, addedAt: NOW, minedAt: null }],
    });
    expect(nextMove(state, NOW).id).toBe('move.mine');

    state.proofs = mineSources(state, { now: NOW });
    expect(state.proofs).toHaveLength(0);
    expect(state.sources[0].minedAt).toBe(NOW);
    expect(nextMove(state, NOW).id).toBe('move.addSource');
  });
});

describe('contact details are not evidence', () => {
  it('never mines a CV header into the inventory', () => {
    const source = {
      id: 's1', name: 'cv', demo: false, addedAt: NOW, minedAt: null,
      text: [
        'מנהל תפעול ולוגיסטיקה בכיר | תל אביב | 052-8841203 | ronen.avidan@gmail.com',
        'linkedin.com/in/ronen-avidan — פרופיל מקצועי מלא עם המלצות',
        'קיצרתי את זמן האספקה הממוצע מ-19 יום ל-7 ימים במהלך 2025.',
      ].join('\n'),
    };
    const proofs = mineSources(stateWith({ sources: [source] }), { now: NOW });
    expect(proofs).toHaveLength(1);
    expect(proofs[0].claim).not.toMatch(/052|gmail|linkedin\.com/);
  });
});

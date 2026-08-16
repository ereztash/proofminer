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
import { BAND_USABLE, dedupeProofs, decayFactor, scoreBand } from '../../src/engine/score.js';
import { computeLayers } from '../../src/engine/layers.js';
import { compound } from '../../src/engine/feedback.js';
import { acquisitionPlays, archetypeCoverage } from '../../src/engine/gaps.js';
import { detectDrift, scorePositioning } from '../../src/engine/positioning.js';
import {
  RATE_ANCHOR,
  layerReception,
  receptionScore,
  receptionSignal,
} from '../../src/engine/layers.js';
import { LIEBIG_GATE, MOVE_IDS, computeAuthority, nextMove } from '../../src/engine/authority.js';
import { translator } from '../../src/i18n/index.js';
import heBundle from '../../src/i18n/he.js';
import enBundle from '../../src/i18n/en.js';
import { readFileSync } from 'node:fs';
import { normalizeState } from '../../src/core/schema.js';
import { saturate } from '../../src/core/util.js';
import { parseAnalyticsPaste } from '../../src/engine/analytics.js';
import { escapeHtml, toString_ } from '../../src/ui/html.js';
import { button } from '../../src/ui/components.js';
import { NOW, DAY, artifact, minedSource, proofFrom, reception, stateWith } from '../helpers.js';

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
    const state = normalizeState({
      proofs: [{ id: 'proof_ok', claim: 'ניהלתי צוות של שמונה אנשים במשך שנתיים.' }],
      artifacts: [{ proofIds: [ATTACK, 'proof_ok'] }],
    });
    expect(state.artifacts[0].proofIds).toEqual(['proof_ok']);
  });

  it('follows a rewritten id rather than dropping everything that pointed at it', () => {
    // Minting a safe id for a rejected one used to orphan every reference to
    // it: the artifact lost its proof and — silently — the reception of that
    // artifact was discarded whole, taking the L4 layer with it.
    const state = normalizeState({
      proofs: [{ id: ATTACK, claim: 'ניהלתי צוות של שמונה אנשים במשך שנתיים.' }],
      artifacts: [{ id: ATTACK, proofIds: [ATTACK], status: 'published' }],
      receptions: [{ artifactId: ATTACK, impressions: 900, reactions: 30 }],
    });
    const proofId = state.proofs[0].id;
    const artifactId = state.artifacts[0].id;
    expect(proofId).not.toContain('<');
    expect(artifactId).not.toContain('<');
    expect(state.artifacts[0].proofIds).toEqual([proofId]);
    expect(state.receptions).toHaveLength(1);
    expect(state.receptions[0].artifactId).toBe(artifactId);
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
        'קיצרתי את זמן האספקה הממוצע מ-19 יום ל-7 ימים במהלך 2025.',
      ].join('\n'),
    };
    const proofs = mineSources(stateWith({ sources: [source] }), { now: NOW });
    expect(proofs).toHaveLength(1);
    expect(proofs[0].claim).not.toMatch(/052|gmail/);
  });

  it('keeps a claim that merely contains a link', () => {
    // Silently deleting evidence is the wrong default for a product whose job
    // is to stop the user's evidence going missing.
    const source = {
      id: 's2', name: 'notes', demo: false, addedAt: NOW, minedAt: null,
      text: 'המלצה כתובה מסמנכ״לית התפעול לשעבר יושבת בכתובת linkedin.com/in/yael-b ומאשרת את התוצאה.',
    };
    expect(mineSources(stateWith({ sources: [source] }), { now: NOW })).toHaveLength(1);
  });

  it('keeps a testimonial and its attribution as one unit', () => {
    const source = {
      id: 's3', name: 'rec', demo: false, addedAt: NOW, minedAt: null,
      text: '"רונן היה האדם שסידר לנו את התפעול. אחרי שנה היה לנו דוח יומי שאפשר לסמוך עליו." - יעל ברקוביץ, מנכ"לית תפעול לשעבר',
    };
    const proofs = mineSources(stateWith({ sources: [source] }), { now: NOW });
    expect(proofs).toHaveLength(1);
    // The attribution is what makes it evidence rather than a nice sentence.
    expect(proofs[0].claim).toContain('יעל ברקוביץ');
    expect(proofs[0].archetypes).toContain('VALIDATION');
  });
});

describe('positioning cannot stand in for evidence', () => {
  const thin = () => stateWith({
    profile: { track: 'independent', locale: 'he', startedAt: NOW },
    sources: [minedSource({ text: 'ליוויתי לקוחות בתהליכי שיווק.' })],
    proofs: [proofFrom('ליוויתי לקוחות בתהליכי שיווק.')],
  });

  const sharp = {
    audience: 'מנהלי שיווק בחברות B2B בישראל',
    problem: 'קמפיינים שמביאים לידים שלא נסגרים',
    method: 'אבחון מסע לקוח ובנייה מחדש של המשפך',
    proofPoint: 'הכפלתי המרות אצל שלושה לקוחות',
    updatedAt: NOW,
  };

  it('does not let a filled positioning form carry the evidence half', () => {
    // Blending L1 and L2 as peers let four text boxes move the foundation from
    // 18 to 71 on one weak CV line, switching *off* the Liebig gate — the
    // mechanism this module exists to enforce.
    const before = computeAuthority(thin(), NOW);
    const after = computeAuthority({ ...thin(), positioning: sharp }, NOW);
    expect(after.foundation).toBeLessThanOrEqual(before.foundation * 1.25 + 1);
  });

  it('never lowers the headline number for answering its own prompt', () => {
    // The mirror defect: a half-finished positioning scored low as a peer, so
    // obeying the product's instruction cost the user points.
    const before = computeAuthority(thin(), NOW);
    const half = { ...sharp, method: '', proofPoint: '' };
    const after = computeAuthority({ ...thin(), positioning: half }, NOW);
    expect(after.foundation).toBeGreaterThanOrEqual(before.foundation);
    expect(after.index).toBeGreaterThanOrEqual(before.index);
  });

  it('keeps the gate closed on a thin foundation however loud the built half', () => {
    const loud = {
      ...thin(),
      positioning: sharp,
      artifacts: [artifact({ id: 'a1' }), artifact({ id: 'a2' }), artifact({ id: 'a3' })],
      receptions: [
        reception({ artifactId: 'a1' }),
        reception({ artifactId: 'a2' }),
        reception({ artifactId: 'a3' }),
      ],
    };
    const result = computeAuthority(loud, NOW);
    expect(result.effectiveBuilt).toBeLessThanOrEqual(result.foundation + LIEBIG_GATE);
  });
});

describe('analytics paste', () => {
  const EXPECTED = { impressions: 1204, reactions: 38, comments: 4 };

  it('reads both stacking directions and inline text alike', () => {
    const layouts = [
      'Impressions\n1,204\nReactions\n38\nComments\n4',
      '1,204\nImpressions\n38\nReactions\n4\nComments',
      '1,204 impressions · 38 reactions · 4 comments',
      'חשיפות\n1,204\nתגובות רגש\n38\nתגובות\n4',
      '1,204\nחשיפות\n38\nתגובות רגש\n4\nתגובות',
    ];
    for (const text of layouts) {
      expect(parseAnalyticsPaste(text).found, text).toEqual(EXPECTED);
    }
  });

  it('refuses a paste whose layout is genuinely ambiguous', () => {
    // Guessing "the line after" on a number-above-label card handed every
    // label the next metric's number and fed a 32x understated impression
    // count into the reception denominator, reporting matched: 4 while doing it.
    expect(parseAnalyticsPaste('1,204\nImpressions\n38').found).toEqual({});
  });

  it('never lets one number fill two fields', () => {
    const { found } = parseAnalyticsPaste('Impressions\n1,204\nReactions');
    const values = Object.values(found);
    expect(new Set(values).size).toBe(values.length);
  });

  it('applies magnitude suffixes in both languages', () => {
    expect(parseAnalyticsPaste('12K impressions').found.impressions).toBe(12_000);
    expect(parseAnalyticsPaste('חשיפות 12 אלף').found.impressions).toBe(12_000);
  });
});

describe('L4 confidence reflects how much recent evidence stands behind it', () => {
  const record = (daysAgo) =>
    reception({
      id: `r${daysAgo}`,
      artifactId: `a${daysAgo}`,
      capturedAt: NOW - daysAgo * DAY,
      impressions: 1000,
      reactions: 40,
    });

  it('does not report a five-year-old number at full confidence', () => {
    // Kish's effective sample size is scale-invariant: it corrects weight
    // imbalance, never staleness, so six records all captured in 2021 reported
    // confidence 1.0 while carrying a quarter of built standing.
    const fresh = stateWith({ receptions: [1, 5, 9, 13, 17, 21].map(record) });
    const stale = stateWith({ receptions: [1801, 1805, 1809, 1813, 1817, 1821].map(record) });
    expect(layerReception(fresh, NOW).confidence).toBeGreaterThan(0.9);
    expect(layerReception(stale, NOW).confidence).toBeLessThan(0.1);
  });

  it('never lowers confidence for logging a fresh measurement', () => {
    // Under ESS it did, by 4.3x: adding an unequal weight makes a sample less
    // balanced, so obeying `move.logReception` was punished.
    const stale = [540, 545, 550, 555, 560].map(record);
    const before = layerReception(stateWith({ receptions: stale }), NOW);
    const after = layerReception(stateWith({ receptions: [...stale, record(0)] }), NOW);
    expect(after.confidence).toBeGreaterThan(before.confidence);
  });

  it('reaches full confidence on six current records', () => {
    const state = stateWith({ receptions: [0, 1, 2, 3, 4, 5].map(record) });
    expect(layerReception(state, NOW).confidence).toBeGreaterThan(0.97);
  });
});

describe('every next move has something to say', () => {
  it('resolves each move id in both bundles', () => {
    for (const id of MOVE_IDS) {
      for (const locale of ['he', 'en']) {
        const t = translator(locale);
        const title = t(['moves', id, 'title']);
        expect(title, `${locale} ${id}`).not.toContain(id);
        expect(t(['moves', id, 'why']), `${locale} ${id}`).not.toContain(id);
      }
    }
  });

  it('declares every move id the engine can actually emit', () => {
    // The dashboard's only primary card rendered "moves.move.attributeConversion.title"
    // because a move was added to the guidance and to nothing else.
    const source = readFileSync('src/engine/authority.js', 'utf8');
    const emitted = new Set([...source.matchAll(/id: '(move\.[A-Za-z]+)'/g)].map((m) => m[1]));
    expect([...emitted].filter((id) => !MOVE_IDS.includes(id))).toEqual([]);
  });

  it('carries no move string the engine can never emit', () => {
    for (const locale of ['he', 'en']) {
      const bundle = locale === 'he' ? heBundle : enBundle;
      const declared = Object.keys(bundle.moves).filter((k) => k.startsWith('move.'));
      expect(declared.filter((id) => !MOVE_IDS.includes(id)), locale).toEqual([]);
    }
  });
});

describe('the positioning screen agrees with the layer it describes', () => {
  const positioning = {
    audience: 'מנהלי תפעול בחברות לוגיסטיקה בישראל',
    transformation: 'מזמן אספקה של שבוע לשני ימים',
    claim: 'אני בונה מערכי אספקה שאפשר לסמוך עליהם',
    offer: 'ליווי תפעולי לשישה חודשים',
    nonGoals: ['ייעוץ אסטרטגי כללי'],
  };
  const recognitions = [
    { id: 'r1', type: 'referral', by: 'יעל ברקוביץ', url: '', at: NOW - 10 * DAY },
    { id: 'r2', type: 'feature', by: 'כלכליסט', url: 'https://x.co/a', at: NOW - 20 * DAY },
    { id: 'r3', type: 'invite', by: 'כנס לוגיסטיקה', url: '', at: NOW - 30 * DAY },
  ];

  it('does not show the unvouched floor to someone who has been vouched for', () => {
    // The view dropped the recognitions argument, so the meter read 20 while
    // L2 computed the same component at 88 from the same state.
    const withRec = scorePositioning(positioning, recognitions);
    const without = scorePositioning(positioning, []);
    expect(withRec.components.defensibility).toBeGreaterThan(without.components.defensibility);

    const state = stateWith({ positioning, recognitions });
    expect(computeLayers(state, NOW).L2.inputs.components.defensibility).toBe(
      withRec.components.defensibility,
    );
  });

  it('has a label for every component it renders', () => {
    for (const locale of ['he', 'en']) {
      const t = translator(locale);
      for (const key of Object.keys(scorePositioning(positioning, recognitions).components)) {
        expect(t(['position', key]), `${locale} ${key}`).not.toContain(key);
      }
    }
  });
});

describe('acquisition plays can be satisfied by doing them', () => {
  // Best-practice evidence, written exactly as each play's copy instructs.
  // Holding all eight archetypes to BAND_USABLE meant four plays asked for
  // evidence that could not clear their own bar: a user who obeyed for 24
  // weeks watched coverage stay flat and the Visibility Gap widen.
  const POSITIONING = {
    audience: 'מנהלי תפעול בחברות לוגיסטיקה',
    transformation: 'זמן אספקה קצר יותר',
    claim: 'מערכי אספקה שאפשר לסמוך עליהם',
    offer: 'ליווי תפעולי',
  };
  const IDEAL = {
    OUTCOME: 'ב-2025 קיצרתי אצל חברת אלפא לוגיסטיקה את זמן האספקה מ-19 יום ל-7 ימים, חיסכון של 1.2 מיליון ש"ח בשנה.',
    VALIDATION: '"רונן סידר לנו את התפעול תוך חצי שנה" — יעל ברקוביץ, מנכ"לית אלפא לוגיסטיקה, מרץ 2025. https://linkedin.com/in/yael',
    SCALE: 'ניהלתי מערך של 22 עובדים בשלושה אתרים ותקציב שנתי של 12 מיליון ש"ח בשנים 2019-2025.',
    METHOD: 'ב-2024 כתבתי את השיטה בחמישה שלבים ופרסמתי אותה כמסמך פתוח: מיפוי צווארי בקבוק, תיעדוף לפי עלות, פיילוט באתר אחד, מדידה שבועית, הרחבה. https://example.co.il/method',
    CREDENTIAL: 'תואר שני במנהל עסקים מאוניברסיטת תל אביב, 2018, בהתמחות לוגיסטיקה. https://tau.ac.il',
    PEER: 'עמית בתחום, דוד לוי, סמנכ"ל תפעול בבטא תעשיות, אזכר את העבודה שלי בהרצאה בכנס הלוגיסטיקה 2025. https://conf.co.il/2025',
    FAILURE: 'ב-2023 הרצתי פיילוט אוטומציה במחסן שנכשל: 4 חודשים ו-300 אלף ש"ח בלי שיפור. מאז אני בודק זמינות נתונים לפני כל אוטומציה.',
    ORIGIN: 'ב-2011 עבדתי במפעל של אלפא תעשיות וראיתי קו ייצור שלם נעצר ל-3 ימים בגלל טעות בספירת מלאי. מאז אני עוסק רק בזה.',
  };

  const coverageOf = (archetype, claim) => {
    const proof = proofFrom(claim, { positioning: POSITIONING });
    const state = stateWith({ positioning: POSITIONING, proofs: [proof] });
    return archetypeCoverage(state, NOW).find((c) => c.archetype === archetype);
  };

  it('classifies the evidence each play asks for as that archetype', () => {
    for (const [archetype, claim] of Object.entries(IDEAL)) {
      expect(coverageOf(archetype, claim).count, archetype).toBeGreaterThan(0);
    }
  });

  it('covers the archetype when the user does exactly what the play says', () => {
    for (const [archetype, claim] of Object.entries(IDEAL)) {
      const c = coverageOf(archetype, claim);
      expect(c.covered, `${archetype}: scored ${c.best}, needs ${c.threshold}`).toBe(true);
    }
  });

  it('does not cover an archetype from a throwaway line', () => {
    const WEAK = {
      CREDENTIAL: 'יש לי תואר במנהל עסקים.',
      PEER: 'עמית בתחום המליץ עלי.',
      OUTCOME: 'שיפרתי תהליכים בחברה.',
    };
    for (const [archetype, claim] of Object.entries(WEAK)) {
      expect(coverageOf(archetype, claim).covered, archetype).toBe(false);
    }
  });

  it('tells the guidance how far short the user landed', () => {
    const state = stateWith({
      positioning: POSITIONING,
      proofs: [proofFrom('יש לי תואר במנהל עסקים.', { positioning: POSITIONING })],
    });
    const play = acquisitionPlays(state, NOW).find((p) => p.archetype === 'CREDENTIAL');
    expect(play.shortOfBar).toBe(true);
    expect(play.currentBest).toBeGreaterThan(0);
    expect(play.threshold).toBeGreaterThan(play.currentBest);
  });
});

describe('self-report cannot buy the evidence half', () => {
  const NOW_ = NOW;
  const build = () => {
    const state = stateWith({
      profile: { track: 'independent', weeksInMotion: 12, onboarded: true, sawFirstLight: true, declined: false },
      proofs: [proofFrom('ניהלתי צוות תפעול בחברה קמעונאית במשך ארבע שנים.')],
    });
    state.artifacts = Array.from({ length: 16 }, (_, i) =>
      artifact({
        id: `a${i}`,
        proofIds: [state.proofs[0].id],
        url: `https://linkedin.com/posts/x${i}`,
        publishedAt: NOW_ - (i + 1) * 3 * DAY,
      }),
    );
    state.receptions = Array.from({ length: 16 }, (_, i) =>
      reception({
        id: `r${i}`, artifactId: `a${i}`, impressions: 900,
        reactions: i < 8 ? 3 : 70, comments: i < 8 ? 0 : 12,
        substantiveComments: i < 8 ? 0 : 6, saves: i < 8 ? 0 : 8, shares: i < 8 ? 0 : 4,
        capturedAt: NOW_ - (i + 1) * 2 * DAY,
      }),
    );
    return state;
  };

  it('scores a typed-in reach figure below the usable band', () => {
    // The link proves the post exists. The impression count is public nowhere,
    // so the one fact the claim asserts is the one nobody can check — and it
    // was scoring verification 90 / falsifiability 84, outranking real CV lines.
    const created = compound(build(), { now: NOW_ });
    expect(created.length).toBeGreaterThan(0);
    for (const unit of created) expect(unit.score).toBeLessThan(BAND_USABLE);
  });

  it('does not let the interface language decide how much evidence you have', () => {
    // Compounded claims share a sentence template, so prose dedupe compared
    // them against each other at a knife edge: two genuinely distinct posts
    // produced Hebrew claims overlapping at exactly 0.800 — the threshold — and
    // one was destroyed, while the English claims for the same two posts
    // overlapped at 0.75 and both survived. Same user, same posts, same numbers.
    const counts = ['he', 'en'].map((locale) => {
      const state = { ...build(), locale };
      const created = compound(state, { now: NOW_ });
      const mined = mineSources({ ...state, proofs: [...state.proofs, ...created] }, { now: NOW_ });
      return mined.filter((p) => p.origin === 'compounded').length;
    });
    expect(counts[0]).toBe(counts[1]);
    expect(counts[0]).toBeGreaterThan(0);
  });

  it('mints at most one unit per artifact, however often it is measured', () => {
    const state = build();
    // The same artifact measured twice is one piece of traction, not two.
    state.receptions.push({ ...state.receptions[8], id: 'r-again' });
    const created = compound(state, { now: NOW_ });
    const artifacts = created.map((p) => p.sourceName);
    expect(created.length).toBe(new Set(created.map((p) => p.sourceId)).size);
    expect(artifacts.length).toBeGreaterThan(0);
  });

  it('barely moves the ceiling the gate is measured against', () => {
    const state = build();
    const before = computeAuthority(state, NOW_);
    const created = compound(state, { now: NOW_ });
    const after = computeAuthority(
      { ...state, proofs: mineSources({ ...state, proofs: [...state.proofs, ...created] }, { now: NOW_ }) },
      NOW_,
    );
    expect(after.foundation - before.foundation).toBeLessThan(8);
  });
});

describe('integrations that were alive and unreachable', () => {
  it('routes the next move at staling evidence at least sometimes', () => {
    // Gated on the decayed score, which needed a raw score of 75 — nothing in
    // the corpus reaches it, so across a five-year weekly sweep the branch
    // fired zero times. Same trap gaps.js documents fixing one layer down.
    const text = [
      'ב-2025 קיצרתי אצל חברת אלפא לוגיסטיקה את זמן האספקה מ-19 יום ל-7 ימים.',
      'ניהלתי מערך של 22 עובדים בשלושה אתרים ותקציב שנתי של 12 מיליון ש"ח.',
      'הובלתי הטמעה של מערכת ניהול מלאי בארבעה סניפים במהלך 2024.',
    ].join('\n');
    const captured = Date.UTC(2025, 0, 1);
    let fired = 0;
    for (let week = 0; week < 120; week += 1) {
      const at = NOW + week * 7 * DAY;
      const state = stateWith({
        profile: { track: 'independent', weeksInMotion: 20, onboarded: true, sawFirstLight: true, declined: false, noInboundAt: null },
        positioning: { audience: 'מנהלי תפעול בחברות לוגיסטיקה', transformation: 'זמן אספקה קצר', claim: 'מערכי אספקה אמינים', offer: 'ליווי', nonGoals: [] },
        sources: [{ id: 's1', name: 'cv', demo: false, addedAt: captured, minedAt: null, text }],
      });
      state.proofs = mineSources(state, { now: captured });
      state.artifacts = [artifact({ id: 'a0', proofIds: [], publishedAt: at - 20 * DAY })];
      if (nextMove(state, at).id === 'move.publishStaling') fired += 1;
    }
    expect(fired).toBeGreaterThan(0);
  });

  it('does not accuse a coherent user of positioning drift', () => {
    // Drift was word overlap against the declared claim, and on-topic evidence
    // phrased differently scored 0.000 — identical to unrelated evidence.
    const proof = (id, archetype) => ({
      id, claim: 'x', sourceId: '', sourceName: '', kind: 'experience',
      archetypes: [archetype], breakdown: {}, score: 60, occurredAt: null,
      demo: false, origin: 'mined', pinned: false, dismissed: false, createdAt: NOW,
    });
    const build = (converting, published) => {
      const proofs = [proof('pV', 'VALIDATION'), proof('pM', 'METHOD')];
      const artifacts = published.map((a, i) =>
        artifact({ id: `a${i}`, proofIds: [a === 'VALIDATION' ? 'pV' : 'pM'] }),
      );
      // Spread across *distinct* artifacts: drift needs three converting posts,
      // not three replies to one post.
      const byArchetype = { VALIDATION: [], METHOD: [] };
      artifacts.forEach((x) => byArchetype[x.proofIds[0] === 'pV' ? 'VALIDATION' : 'METHOD'].push(x.id));
      const used = { VALIDATION: 0, METHOD: 0 };
      const conversions = converting.map((a, i) => {
        const pool = byArchetype[a];
        const id = pool[used[a] % pool.length] ?? null;
        used[a] += 1;
        return { id: `c${i}`, type: 'call', note: '', at: NOW - 5 * DAY, artifactId: id };
      });
      return stateWith({
        positioning: { audience: 'a', transformation: 'b', claim: 'מערכי אספקה שאפשר לסמוך עליהם', offer: 'c', nonGoals: [] },
        proofs, artifacts, conversions,
      });
    };
    const M = 'METHOD', V = 'VALIDATION';
    expect(detectDrift(build([M, M, M, M], [M, M, M, M])).drifting).toBe(false);
    expect(detectDrift(build([V, V, M, M], [V, V, M, M])).drifting).toBe(false);
    // And still fires when the mismatch is real and countable.
    expect(detectDrift(build([V, V, V, V], [V, V, V, M, M, M, M, M, M, M, M, M])).drifting).toBe(true);
    // But never from a single post, however many replies it drew.
    expect(detectDrift(build([V, V, V], [V, M, M, M]))).toBe(null);
  });

  it('stops asking who got in touch once the user says nobody did', () => {
    const base = stateWith({
      profile: { track: 'independent', weeksInMotion: 20, onboarded: true, sawFirstLight: true, declined: false, noInboundAt: null },
      positioning: { audience: 'a', transformation: 'b', claim: 'c', offer: 'd', nonGoals: [] },
      proofs: [proofFrom('ב-2025 קיצרתי את זמן האספקה מ-19 יום ל-7 ימים אצל לקוח.')],
      artifacts: [0, 1, 2].map((i) => artifact({ id: `a${i}`, publishedAt: NOW - (40 - i) * DAY })),
      receptions: [0, 1, 2].map((i) => reception({ id: `r${i}`, artifactId: `a${i}` })),
    });
    // Three weeks of publishing with reception and no inbound: the product
    // stops asking an unanswerable question and names the actual problem.
    expect(nextMove(base, NOW).id).not.toBe('move.logConversion');

    // And saying "nobody has been in touch" must *stop* the question, not pin
    // it for three weeks — which is what the gate did inverted. Inside the
    // first three weeks the question is still fair, so it is asked...
    const fresh = {
      ...base,
      artifacts: [0, 1, 2].map((i) => artifact({ id: `a${i}`, publishedAt: NOW - (5 - i) * DAY })),
    };
    expect(nextMove(fresh, NOW).id).toBe('move.logConversion');
    // ...until the user answers it.
    const acknowledged = { ...fresh, profile: { ...fresh.profile, noInboundAt: NOW - 2 * DAY } };
    expect(nextMove(acknowledged, NOW).id).not.toBe('move.logConversion');
  });
});

describe('positioning confidence is about substance, not about boxes', () => {
  it('claims no certainty from four single words', () => {
    // `filled / 4` reported 1.00 — full certainty — over four words whose four
    // substantive components all scored 0.
    const thin = scorePositioning(
      { audience: 'אנשים', transformation: 'טוב', claim: 'שיווק', offer: 'ייעוץ' },
      [],
    );
    expect(thin.confidence).toBeLessThan(0.2);
  });

  it('reaches full confidence on a specific, complete positioning', () => {
    const sharp = scorePositioning(
      {
        audience: 'מנהלי תפעול בחברות לוגיסטיקה בישראל',
        transformation: 'מזמן אספקה של שבוע לשני ימים',
        claim: 'אני בונה מערכי אספקה שאפשר לסמוך עליהם',
        offer: 'ליווי תפעולי לשישה חודשים',
      },
      [],
    );
    expect(sharp.confidence).toBeGreaterThan(0.9);
  });

  it('never claims more confidence than it has fields', () => {
    const partial = scorePositioning(
      { audience: 'מנהלי תפעול בחברות לוגיסטיקה בישראל', transformation: '', claim: '', offer: '' },
      [],
    );
    expect(partial.confidence).toBeLessThanOrEqual(0.25);
  });
});

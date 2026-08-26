import { describe, expect, it } from 'vitest';
import {
  LIEBIG_GATE,
  bestUnpublished,
  computeAuthority,
  diagnose,
  nextMove,
  unpublishedProofs,
} from '../../src/engine/authority.js';
import { computeLayers, receptionScore } from '../../src/engine/layers.js';
import { archetypeCoverage, acquisitionPlays } from '../../src/engine/gaps.js';
import { FILLER_SHOWN, fillerWords, scorePositioning } from '../../src/engine/positioning.js';
import { isDemoMode } from '../../src/engine/mine.js';
import {
  NOW,
  DAY,
  STRONG_HE,
  artifact,
  minedSource,
  proofFrom,
  reception,
  stateWith,
} from '../helpers.js';

const POSITIONING = {
  audience: 'מנהלי כספים בחברות תעשייה בינוניות',
  transformation: 'סגירת רבעון תוך שבוע במקום שלושה שבועות',
  claim: 'אני מקצר סגירות רבעון בתעשייה',
  offer: 'ליווי בן שלושה חודשים לצוות כספים',
  nonGoals: ['לא עושה הטמעות ERP'],
};

/** A state with real evidence and a real positioning, but nothing published. */
function buriedState() {
  return stateWith({
    positioning: POSITIONING,
    proofs: [
      proofFrom(STRONG_HE, { positioning: POSITIONING }),
      proofFrom('קיצרתי את סגירת הרבעון של לקוח תעשייתי משלושה שבועות לשישה ימים ב-2025', {
        positioning: POSITIONING,
      }),
      proofFrom('פיתחתי תהליך בן חמישה שלבים לסגירת רבעון שאני מיישם זהה בכל לקוח', {
        positioning: POSITIONING,
      }),
      proofFrom('התראיינתי לכתבה מקצועית על אוטומציה בפיננסים שפורסמה ב-2025', {
        positioning: POSITIONING,
      }),
    ],
  });
}

describe('layer scores', () => {
  it('locks every layer for a brand-new user rather than showing zeros as failure', () => {
    const layers = computeLayers(stateWith(), NOW);
    for (const layer of Object.values(layers)) {
      expect(layer.locked).toBe(true);
      expect(layer.confidence).toBe(0);
      expect(layer.reason).toBeTruthy();
    }
  });

  it('drops demo proof the moment any real evidence exists', () => {
    const real = proofFrom('קיצרתי סגירת רבעון של לקוח תעשייתי משלושה שבועות לשישה ימים ב-2025');
    const demo = proofFrom(STRONG_HE, { demo: true });
    const mixed = stateWith({ proofs: [real, demo] });
    const realOnly = stateWith({ proofs: [real] });
    // Adding demo material next to real evidence changes nothing at all.
    expect(computeLayers(mixed, NOW).L1).toEqual(computeLayers(realOnly, NOW).L1);
    expect(isDemoMode(mixed)).toBe(false);
  });

  it('scores demo-only state so the sample demonstrates something, and flags it', () => {
    const demoOnly = stateWith({ proofs: [proofFrom(STRONG_HE, { demo: true })] });
    expect(isDemoMode(demoOnly)).toBe(true);
    // There is no real standing to inflate here, and a locked dashboard would
    // teach a user who asked for an example precisely nothing.
    expect(computeLayers(demoOnly, NOW).L1.locked).toBe(false);
  });

  it('rewards groundedness over volume in L3', () => {
    const base = { positioning: POSITIONING, proofs: buriedState().proofs };
    const proofId = base.proofs[0].id;
    const grounded = stateWith({
      ...base,
      artifacts: [1, 2, 3].map(() => artifact({ proofIds: [proofId] })),
    });
    const ungrounded = stateWith({
      ...base,
      artifacts: [1, 2, 3].map(() => artifact({ proofIds: [] })),
    });
    expect(computeLayers(grounded, NOW).L3.score).toBeGreaterThan(
      computeLayers(ungrounded, NOW).L3.score,
    );
  });

  it('measures reception relative to the user own baseline, not absolute size', () => {
    // Same engagement rate, wildly different audience size -> same score.
    const small = receptionScore(reception({ impressions: 400, reactions: 20, comments: 4, substantiveComments: 2, saves: 3, shares: 1 }), 0.05);
    const large = receptionScore(reception({ impressions: 4000, reactions: 200, comments: 40, substantiveComments: 20, saves: 30, shares: 10 }), 0.05);
    expect(Math.abs(small - large)).toBeLessThan(1);
  });

  it('weights a substantive comment above a reaction', () => {
    const base = { impressions: 1000, reactions: 0, comments: 0, substantiveComments: 0, saves: 0, shares: 0 };
    const withComments = receptionScore({ ...base, comments: 5, substantiveComments: 5 }, 0);
    const withReactions = receptionScore({ ...base, reactions: 5 }, 0);
    expect(withComments).toBeGreaterThan(withReactions);
  });

  it('reports low confidence on thin data', () => {
    const state = buriedState();
    state.receptions = [reception()];
    expect(computeLayers(state, NOW).L4.confidence).toBeLessThan(0.4);
  });
});

/**
 * Loud: heavy publishing, reception, conversion — on a measured but weak
 * evidence base.
 *
 * The evidence here is real and ordinary, not filler, and that distinction is
 * now load-bearing. L1 confidence weighs each unit against the usable band, so
 * a base of four platitudes no longer reaches `MEASURED_FOUNDATION` and the
 * product correctly answers `UNCATALOGUED` — *not written down* — rather than
 * accusing the user of being louder than evidence it never measured. To test
 * the gate we have to give it something it can actually measure.
 */
function hollowState({ volume = 1 } = {}) {
  return stateWith({
    positioning: { audience: 'אנשים', transformation: 'טוב יותר' },
    proofs: [
      proofFrom('ריכזתי את העבודה מול ספקי הלוגיסטיקה של החברה בשנת 2023.'),
      proofFrom('כתבתי נהלי עבודה למחלקת התפעול והדרכתי עליהם את הצוות.'),
      proofFrom('ליוויתי את המעבר של המשרד למערכת דיווח שעות חדשה ב-2025.'),
      proofFrom('טיפלתי בפניות של לקוחות מול מחלקת השירות לאורך התקופה.'),
      proofFrom('השתתפתי בוועדת ההיגוי של הפרויקט מטעם מחלקת התפעול.'),
      proofFrom('סייעתי בהכנת החומרים לישיבות ההנהלה הרבעוניות בארגון.'),
      proofFrom('עבדתי מול צוותי הביצוע באתר על לוחות הזמנים של ההקמה.'),
      proofFrom('ליוויתי עובדים חדשים בשבועות הראשונים שלהם במחלקה.'),
      proofFrom('ריכזתי את הדיווח השבועי להנהלה על ביצועי התפעול.'),
      proofFrom('השתתפתי בהטמעה של מערכת ניהול המלאי במחסן המרכזי.'),
    ],
    artifacts: Array.from({ length: 8 * volume }, () => artifact({ proofIds: [] })),
    receptions: Array.from({ length: 6 * volume }, (_, i) =>
      reception({ artifactId: `a${i}`, impressions: 500, reactions: 90, comments: 30, substantiveComments: 20, saves: 25, shares: 12 }),
    ),
    conversions: Array.from({ length: 6 * volume }, (_, i) => ({
      id: `c${i}`, type: 'offer', artifactId: null, note: '', at: NOW - 5 * DAY,
    })),
    recognitions: Array.from({ length: 5 * volume }, (_, i) => ({
      id: `r${i}`, type: 'feature', by: 'x', url: '', at: NOW - 10 * DAY,
    })),
  });
}

describe('the Liebig gate', () => {
  it('caps built standing at foundation + gate', () => {
    const result = computeAuthority(hollowState(), NOW);
    expect(result.built).toBeGreaterThan(result.foundation + LIEBIG_GATE);
    expect(result.gated).toBe(true);
    expect(result.effectiveBuilt).toBeLessThanOrEqual(result.foundation + LIEBIG_GATE);
    expect(result.diagnosis).toBe('HOLLOW');
  });

  it('means publishing more cannot raise the index at all once gated', () => {
    const base = computeAuthority(hollowState({ volume: 1 }), NOW);
    const louder = computeAuthority(hollowState({ volume: 6 }), NOW);
    expect(base.gated).toBe(true);
    expect(louder.gated).toBe(true);
    // Same evidence foundation, six times the output: identical standing.
    expect(louder.index).toBe(base.index);
    expect(louder.built).toBeGreaterThanOrEqual(base.built);
  });

  it('raises the index only when the evidence foundation itself grows', () => {
    const thin = computeAuthority(hollowState(), NOW);
    const thickened = hollowState();
    thickened.positioning = POSITIONING;
    thickened.proofs = buriedState().proofs;
    expect(computeAuthority(thickened, NOW).index).toBeGreaterThan(thin.index);
  });

  it('refuses to call an honest under-supplier hollow', () => {
    // Two CV lines plus three real interviews and two real referrals. The
    // built side fills from dropdown clicks; the foundation side needs pasted
    // documents. Reading that as inflation is calling an honest person a fraud.
    const honest = stateWith({
      positioning: { audience: 'מנהלי מוצר', transformation: 'צוות שמשלים ברבעון' },
      proofs: [proofFrom('ניהלתי צוות מוצר במשך ארבע שנים')],
      artifacts: Array.from({ length: 6 }, (_, i) =>
        artifact({ id: `a${i}`, proofIds: [] }),
      ),
      receptions: Array.from({ length: 5 }, (_, i) =>
        reception({ artifactId: `a${i}`, impressions: 600, reactions: 60, comments: 12, substantiveComments: 8, saves: 10, shares: 4 }),
      ),
      conversions: [
        { id: 'c1', type: 'interview', artifactId: null, note: '', at: NOW - 3 * DAY },
        { id: 'c2', type: 'interview', artifactId: null, note: '', at: NOW - 5 * DAY },
        { id: 'c3', type: 'offer', artifactId: null, note: '', at: NOW - 7 * DAY },
        { id: 'c4', type: 'offer', artifactId: null, note: '', at: NOW - 8 * DAY },
        { id: 'c5', type: 'call', artifactId: null, note: '', at: NOW - 9 * DAY },
      ],
      recognitions: [
        { id: 'r1', type: 'referral', by: 'עמית', url: '', at: NOW - 9 * DAY },
        { id: 'r2', type: 'invite', by: 'מיטאפ', url: '', at: NOW - 11 * DAY },
        { id: 'r3', type: 'feature', by: 'כתבה', url: '', at: NOW - 12 * DAY },
        { id: 'r4', type: 'invite', by: 'כנס', url: '', at: NOW - 13 * DAY },
      ],
    });
    const result = computeAuthority(honest, NOW);
    expect(result.diagnosis).toBe('UNCATALOGUED');
    expect(result.diagnosis).not.toBe('HOLLOW');
    expect(nextMove(honest, NOW).id).toBe('move.catalogueMore');
  });

  it('leaves a grounded user ungated', () => {
    const state = buriedState();
    const proofId = state.proofs[0].id;
    state.artifacts = Array.from({ length: 4 }, () => artifact({ proofIds: [proofId] }));
    expect(computeAuthority(state, NOW).gated).toBe(false);
  });
});

describe('visibility gap and diagnosis', () => {
  it('is positive when evidence outruns visibility', () => {
    const result = computeAuthority(buriedState(), NOW);
    expect(result.gap).toBeGreaterThan(0);
    expect(result.diagnosis).toBe('BURIED');
  });

  it('produces every diagnosis, keyed to the gap rather than to cliffs', () => {
    const measured = { confidence: 1 };
    expect(diagnose(10, 8, measured)).toBe('STALLED');
    expect(diagnose(70, 20, measured)).toBe('BURIED');
    expect(diagnose(20, 70, measured)).toBe('HOLLOW');
    expect(diagnose(70, 70, measured)).toBe('COMPOUNDING');
    // Balanced but modest is neither "not started" nor "now scale and convert".
    expect(diagnose(30, 28, measured)).toBe('EARLY');
    expect(diagnose(18, 18, measured)).toBe('EARLY');
  });

  it('has no cliff: one point of foundation cannot flip the verdict', () => {
    const measured = { confidence: 1 };
    // A blank optional field used to move foundation from 45 to 44 and flip
    // BURIED to "you haven't started yet" on an identical evidence base.
    for (const f of [43, 44, 45, 46]) {
      expect(diagnose(f, 0, measured)).toBe('BURIED');
    }
  });

  it('says uncatalogued rather than hollow when the foundation is unmeasured', () => {
    expect(diagnose(20, 70, { confidence: 0.1 })).toBe('UNCATALOGUED');
  });

  it('never delivers a verdict about a person from bundled fixtures', () => {
    const demoOnly = stateWith({
      proofs: [proofFrom(STRONG_HE, { demo: true })],
      conversions: Array.from({ length: 6 }, (_, i) => ({
        id: `c${i}`, type: 'deal', artifactId: null, note: 'x', at: NOW - i * DAY,
      })),
      recognitions: Array.from({ length: 5 }, (_, i) => ({
        id: `g${i}`, type: 'feature', by: 'x', url: '', at: NOW - i * DAY,
      })),
    });
    const result = computeAuthority(demoOnly, NOW);
    expect(result.demo).toBe(true);
    expect(result.diagnosis).toBe('DEMO');
    expect(result.lowConfidence).toBe(true);
  });

  it('does not let a published fixture raise the artifact layer', () => {
    const demo = proofFrom(STRONG_HE, { demo: true });
    const real = proofFrom('קיצרתי סגירת רבעון של לקוח תעשייתי לשישה ימים ב-2025');
    const state = stateWith({
      proofs: [real, demo],
      artifacts: Array.from({ length: 6 }, (_, i) =>
        artifact({ id: `a${i}`, proofIds: [demo.id] }),
      ),
    });
    expect(computeLayers(state, NOW).L3.locked).toBe(true);
  });

  it('does not punish the user for answering the positioning form', () => {
    // Typing one character used to unlock L2 at a low score, blend it in at
    // full weight, and drop the headline by 20 points — as a direct result of
    // obeying the product's own instruction.
    const proofs = buriedState().proofs;
    const blank = computeAuthority(stateWith({ proofs }), NOW).foundation;
    const oneChar = computeAuthority(
      stateWith({ proofs, positioning: { audience: 'x', transformation: '', claim: '', offer: '', nonGoals: [] } }),
      NOW,
    ).foundation;
    const full = computeAuthority(stateWith({ proofs, positioning: POSITIONING }), NOW).foundation;
    expect(blank - oneChar).toBeLessThan(6);
    expect(full).toBeGreaterThanOrEqual(blank);
  });

  it('flags low confidence for a nearly-empty state', () => {
    expect(computeAuthority(stateWith(), NOW).lowConfidence).toBe(true);
  });

  it('keeps the index inside 0..100 for every state shape tested', () => {
    for (const state of [stateWith(), buriedState()]) {
      const { index } = computeAuthority(state, NOW);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThanOrEqual(100);
    }
  });
});

describe('next move', () => {
  it('asks for a source when there is nothing at all', () => {
    expect(nextMove(stateWith(), NOW).id).toBe('move.addSource');
  });

  it('asks to mine when sources exist but were never mined', () => {
    const state = stateWith({
      sources: [{ id: 's1', name: 'cv', text: STRONG_HE, demo: false, addedAt: NOW }],
    });
    expect(nextMove(state, NOW).id).toBe('move.mine');
  });

  it('asks for an audience when the evidence is not yet compelling', () => {
    const weak = proofFrom('ניהלתי צוות במחלקה במשך כמה שנים', { sourceId: 's1' });
    const state = stateWith({
      proofs: [weak],
      sources: [minedSource({ text: 'x' })],
    });
    expect(nextMove(state, NOW).id).toBe('move.setAudience');
  });

  it('shows the win before the form when the user already holds strong evidence', () => {
    const strong = proofFrom(
      'בכתבה שפורסמה בכלכליסט ב-2026 צוטט סמנכ"ל הכספים של חברת אלביט שאמר שקיצרתי את סגירת הרבעון שלהם משלושה שבועות לשישה ימים — https://example.com/a',
      { sourceId: 's1' },
    );
    const state = stateWith({
      proofs: [strong],
      sources: [minedSource({ text: 'x' })],
    });
    // They arrived invisible. The first instruction must not be a five-field form.
    expect(nextMove(state, NOW).id).toBe('move.publishFirst');
  });

  it('notices sources added after the first mine', () => {
    const state = buriedState();
    state.sources = [
      minedSource({ id: 's_new', name: 'testimonial', minedAt: null }),
    ];
    // Evidence acquired through a gap play comes back in as a new source; the
    // guidance has to notice it or the acquisition loop has no return path.
    expect(nextMove(state, NOW).id).toBe('move.mine');
  });

  it('never points the primary action at bundled fixtures', () => {
    const demoOnly = stateWith({
      profile: { ...stateWith().profile, onboarded: true },
      sources: [minedSource({ id: 's_d', name: 'sample', text: 'x', demo: true })],
      proofs: [proofFrom(STRONG_HE, { demo: true, sourceId: 's_d' })],
    });
    const move = nextMove(demoOnly, NOW);
    expect(move.id).toBe('move.addRealSource');
  });

  it('tells a BURIED user to publish', () => {
    const state = buriedState();
    state.sources = [minedSource()];
    const move = nextMove(state, NOW);
    expect(move.id).toBe('move.publishFirst');
    expect(move.payload.proofId).toBeTruthy();
  });

  it('tells a HOLLOW user to stop publishing and acquire evidence', () => {
    // Real but ordinary evidence, not platitudes: L1 confidence now weighs each
    // unit against the usable band, and a base of four self-descriptions
    // correctly reads as UNCATALOGUED rather than earning the HOLLOW verdict.
    const hollow = stateWith({
      positioning: { audience: 'אנשים בתעשייה', transformation: 'משהו טוב יותר' },
      proofs: [
        proofFrom('ריכזתי את העבודה מול ספקי הלוגיסטיקה של החברה בשנת 2023.'),
        proofFrom('כתבתי נהלי עבודה למחלקת התפעול והדרכתי עליהם את הצוות.'),
        proofFrom('ליוויתי את המעבר של המשרד למערכת דיווח שעות חדשה ב-2025.'),
        proofFrom('טיפלתי בפניות של לקוחות מול מחלקת השירות לאורך התקופה.'),
        proofFrom('השתתפתי בוועדת ההיגוי של הפרויקט מטעם מחלקת התפעול.'),
        proofFrom('סייעתי בהכנת החומרים לישיבות ההנהלה הרבעוניות בארגון.'),
        proofFrom('עבדתי מול צוותי הביצוע באתר על לוחות הזמנים של ההקמה.'),
        proofFrom('ליוויתי עובדים חדשים בשבועות הראשונים שלהם במחלקה.'),
        proofFrom('ריכזתי את הדיווח השבועי להנהלה על ביצועי התפעול.'),
        proofFrom('השתתפתי בהטמעה של מערכת ניהול המלאי במחסן המרכזי.'),
      ],
      artifacts: Array.from({ length: 10 }, () => artifact({ proofIds: [] })),
      receptions: Array.from({ length: 6 }, (_, i) =>
        reception({ artifactId: `a${i}`, impressions: 500, reactions: 90, comments: 30, substantiveComments: 20, saves: 25, shares: 12 }),
      ),
      conversions: Array.from({ length: 5 }, (_, i) => ({ id: `c${i}`, type: 'offer', artifactId: null, note: '', at: NOW - 5 * DAY })),
      recognitions: Array.from({ length: 4 }, (_, i) => ({ id: `r${i}`, type: 'feature', by: 'x', url: '', at: NOW - 5 * DAY })),
    });
    const move = nextMove(hollow, NOW);
    expect(move.id).toBe('move.acquireProof');
    expect(move.view).toBe('gaps');
  });

  it('asks for reception data once something is published', () => {
    const state = buriedState();
    state.sources = [minedSource()];
    state.artifacts = [artifact({ proofIds: [state.proofs[0].id] })];
    expect(nextMove(state, NOW).id).toBe('move.logReception');
  });

  it('always returns exactly one move with an effort estimate', () => {
    for (const state of [stateWith(), buriedState()]) {
      const move = nextMove(state, NOW);
      expect(typeof move.id).toBe('string');
      expect(move.effortMinutes).toBeGreaterThan(0);
      expect(typeof move.view).toBe('string');
    }
  });
});

describe('gap engine', () => {
  it('reports coverage across all eight archetypes', () => {
    expect(archetypeCoverage(buriedState(), NOW)).toHaveLength(8);
  });

  it('weights archetypes differently by track', () => {
    // **This proves the table and nothing about the product.** It builds the
    // state by hand, and no user can reach `track: 'job'` — nothing in the
    // interface writes it and onboarding never asks. Kept, because an imported
    // backup can still carry the value and the weights have to behave when it
    // does; annotated, because for a long time this passing test was part of
    // why three documents described a two-population product that was never
    // built. `tests/engine/icp-reach.test.js` measures the reachability.

    const job = archetypeCoverage(stateWith({ profile: { ...stateWith().profile, track: 'job' } }), NOW);
    const independent = archetypeCoverage(stateWith(), NOW);
    const weightOf = (list, key) => list.find((c) => c.archetype === key).weight;
    expect(weightOf(job, 'CREDENTIAL')).toBeGreaterThan(weightOf(independent, 'CREDENTIAL'));
    expect(weightOf(independent, 'PEER')).toBeGreaterThan(weightOf(job, 'PEER'));
  });

  it('emits acquisition plays ordered by value, cheapest-high-impact first', () => {
    const plays = acquisitionPlays(buriedState(), NOW);
    expect(plays.length).toBeGreaterThan(0);
    for (let i = 1; i < plays.length; i += 1) {
      expect(plays[i - 1].value).toBeGreaterThanOrEqual(plays[i].value);
    }
    for (const play of plays) expect(play.effortMinutes).toBeGreaterThan(0);
  });
});

describe('positioning', () => {
  it('scores a specific positioning above a generic one', () => {
    const specific = scorePositioning(POSITIONING);
    const generic = scorePositioning({
      audience: 'בעלי עסקים',
      transformation: 'תוצאות מוכחות',
      claim: 'אני עוזר לעסקים לצמוח',
      offer: 'ייעוץ',
      nonGoals: [],
    });
    expect(specific.score).toBeGreaterThan(generic.score);
  });

  it('flags the "I help X do Y" template explicitly', () => {
    const result = scorePositioning({ audience: 'עסקים', transformation: 'צמיחה', claim: 'אני עוזר לעסקים להשיג צמיחה', offer: '' });
    expect(result.issues.some((i) => i.id === 'template')).toBe(true);
  });

  it('flags category filler', () => {
    const result = scorePositioning({ audience: 'ארגונים', transformation: 'פתרונות הוליסטיים', claim: 'גישה אסטרטגית וחדשנית', offer: '' });
    expect(result.issues.some((i) => i.id === 'filler')).toBe(true);
  });

  it('reports zero confidence when nothing is filled', () => {
    expect(scorePositioning({}).confidence).toBe(0);
  });
});

describe('naming the filler instead of counting it', () => {
  it('returns the word the user actually typed, not the stem that matched', () => {
    // The patterns are stems: /אסטרטג/ matches inside אסטרטגי. Handing back the
    // fragment would name a word nobody wrote.
    expect(fillerWords('גישה אסטרטגית וחדשנית')).toEqual(['אסטרטגית', 'חדשנית']);
    expect(fillerWords('a strategic, innovative approach')).toEqual([
      'strategic',
      'innovative',
    ]);
  });

  it('returns a multi-word pattern whole', () => {
    expect(fillerWords('אני מוביל דעה בתחום')).toEqual(['מוביל דעה']);
    expect(fillerWords('results-driven and best-in-class')).toEqual([
      'results-driven',
      'best-in-class',
    ]);
  });

  it('reads in the order the words appear, not the order of the pattern list', () => {
    // FILLER lists אסטרטג before הוליסט; the text puts them the other way round.
    expect(fillerWords('גישה הוליסטית ואסטרטגית')).toEqual(['הוליסטית', 'אסטרטגית']);
  });

  it('names the word itself, not the grammar glued to its front', () => {
    // The vav in ואסטרטגי joins the previous word and the he in הפתרונות is an
    // article. Neither is part of the word being named, and «ואסטרטגי» reads as
    // a word nobody wrote. The first draft of this test asserted the opposite
    // and was wrong about which half of the expansion does the work.
    expect(fillerWords('מהיר ואסטרטגי')).toEqual(['אסטרטגי']);
    expect(fillerWords('הפתרונות שלנו')).toEqual(['פתרונות']);
    // But a word that really starts with one of those letters keeps it: the
    // match begins at the word's first character, so there is nothing to strip.
    expect(fillerWords('אנחנו מקצוענים')).toEqual(['מקצוענים']);
  });

  it('says nothing about text that carries none', () => {
    expect(fillerWords('קיצרתי את זמן האספקה מ-19 יום ל-7 ימים')).toEqual([]);
    expect(fillerWords('')).toEqual([]);
    expect(fillerWords(undefined)).toEqual([]);
  });

  it('hands the words to the issue rather than a count', () => {
    const result = scorePositioning({
      audience: 'ארגונים',
      transformation: 'פתרונות הוליסטיים',
      claim: 'גישה אסטרטגית וחדשנית',
      offer: '',
    });
    const issue = result.issues.find((i) => i.id === 'filler');
    expect(issue).toBeTruthy();
    const [words, more] = issue.vars;
    expect(words).toContain('אסטרטגית');
    expect(words).toContain('הוליסטיים');
    expect(more).toBe(0);
  });

  it('counts the remainder rather than silently dropping it', () => {
    const many = 'אסטרטגי הוליסטי חדשני מקצועני יצירתי מנוסה פורץ דרך';
    const result = scorePositioning({ audience: many, transformation: '', claim: '', offer: '' });
    const [words, more] = result.issues.find((i) => i.id === 'filler').vars;
    expect(words).toHaveLength(FILLER_SHOWN);
    expect(more).toBeGreaterThan(0);
    expect(words.length + more).toBe(fillerWords(many).length);
  });
});

describe('the evidence nobody has seen', () => {
  const positioning = { audience: 'מנהלי תפעול', transformation: 'תהליך', claim: '', offer: '' };
  const held = (claim, over = {}) => ({
    ...proofFrom(claim, { positioning, now: NOW }),
    ...over,
  });

  it('is real, unpublished, and strongest first', () => {
    const strong = held(STRONG_HE, { id: 'p_strong' });
    const weak = held('עבדתי בחברה גדולה.', { id: 'p_weak' });
    const state = stateWith({ positioning, proofs: [weak, strong] });
    expect(unpublishedProofs(state, NOW).map((p) => p.id)).toEqual(['p_strong', 'p_weak']);
  });

  it('drops what has already gone out, and bundled fixtures always', () => {
    const published = held(STRONG_HE, { id: 'p_out' });
    const demo = held(STRONG_HE, { id: 'p_demo', demo: true });
    const mine = held('ליוויתי מנהלי תפעול והתהליך נשאר אצלם.', { id: 'p_mine' });
    const state = stateWith({
      positioning,
      proofs: [published, demo, mine],
      artifacts: [artifact({ id: 'a0', proofIds: ['p_out'] })],
    });
    expect(unpublishedProofs(state, NOW).map((p) => p.id)).toEqual(['p_mine']);
  });

  it('honours the limit the screen asks for', () => {
    const proofs = ['אחת', 'שתיים', 'שלוש', 'ארבע'].map((n, i) =>
      held(`ליוויתי מנהלי תפעול בחברה ${n}.`, { id: `p${i}` }),
    );
    expect(unpublishedProofs(stateWith({ positioning, proofs }), NOW, { limit: 3 })).toHaveLength(3);
  });

  it('still answers the question bestUnpublished was asking', () => {
    const strong = held(STRONG_HE, { id: 'p_strong' });
    const weak = held('עבדתי בחברה גדולה.', { id: 'p_weak' });
    const state = stateWith({ positioning, proofs: [weak, strong] });
    expect(bestUnpublished(state, NOW).id).toBe('p_strong');
    expect(bestUnpublished(stateWith({}), NOW)).toBeNull();
  });
});

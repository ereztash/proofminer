import { emptyState } from '../src/core/schema.js';
import { analyzeClaim } from '../src/engine/mine.js';
import { makeId } from '../src/core/util.js';

/** Fixed clock so decay and window logic are deterministic. */
export const NOW = Date.UTC(2026, 7, 16);
export const DAY = 86_400_000;

export function stateWith(overrides = {}) {
  return { ...emptyState(), ...overrides };
}

/** Build a fully-scored proof unit from a claim string. */
export function proofFrom(claim, options = {}) {
  const { positioning = {}, now = NOW, ...rest } = options;
  const analysis = analyzeClaim(claim, { positioning, now });
  return {
    id: makeId('proof'),
    claim,
    sourceId: 'src_test',
    sourceName: 'test',
    kind: analysis.kind,
    archetypes: analysis.archetypes,
    breakdown: analysis.breakdown,
    score: analysis.score,
    occurredAt: analysis.occurredAt,
    demo: false,
    origin: 'mined',
    pinned: false,
    dismissed: false,
    createdAt: now,
    ...rest,
  };
}

export function artifact(overrides = {}) {
  return {
    id: makeId('art'),
    proofIds: [],
    channel: 'post',
    angle: 'direct',
    body: 'body',
    status: 'published',
    publishedAt: NOW - 3 * DAY,
    url: '',
    createdAt: NOW - 3 * DAY,
    ...overrides,
  };
}

export function reception(overrides = {}) {
  return {
    id: makeId('rcp'),
    artifactId: 'art_x',
    impressions: 1000,
    reactions: 20,
    comments: 4,
    substantiveComments: 2,
    saves: 3,
    shares: 1,
    capturedAt: NOW - 2 * DAY,
    ...overrides,
  };
}

/** Strong, checkable, third-party-validated evidence. */
export const STRONG_HE =
  'בכתבה שפורסמה ב-2025 באתר מקצועי צוטט לקוח שלי שסיפר שההכנסות שלו גדלו ב-38% בתוך ארבעה חודשים מהעבודה איתי.';

/** The generic self-description this ICP writes by default. */
export const GENERIC_HE = 'אני אדם יצירתי, סקרן ואסטרטגי מאוד עם שנים של ניסיון בליווי אנשים.';

export const STRONG_EN =
  'In a 2025 trade article, my client was quoted saying revenue grew 38% within four months of working with me.';

export const GENERIC_EN =
  'I am a creative, curious and highly strategic person with years of experience guiding people.';

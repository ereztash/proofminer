/**
 * Data model for the six measurable layers (see docs/METHOD.md).
 *
 * The state is a plain, JSON-serialisable object. It is versioned and migrated
 * forward on load so a returning user never loses their evidence base — the
 * evidence base is the only thing in this product that is expensive to rebuild.
 */

import { makeId } from './util.js';

export const STATE_VERSION = 2;
export const STORAGE_KEY = 'proofminer:state';
/** Key written by the pre-rewrite MVP; migrated then left untouched. */
export const LEGACY_STORAGE_KEY = 'proofminer-state';

/** Which track the user is on. Changes vocabulary and the conversion funnel. */
export const TRACKS = /** @type {const} */ (['job', 'independent']);

/** Proof kinds, each with its own decay half-life (see METHOD.md). */
export const PROOF_KINDS = /** @type {const} */ ([
  'outcome',
  'media',
  'event',
  'credential',
  'traction',
  'experience',
]);

/**
 * The eight archetypes a complete evidence case needs.
 * Gap analysis is computed against this set (integration I3).
 */
export const ARCHETYPES = /** @type {const} */ ([
  'OUTCOME',
  'VALIDATION',
  'SCALE',
  'METHOD',
  'CREDENTIAL',
  'PEER',
  'FAILURE',
  'ORIGIN',
]);

/** Conversion events, weighted by commitment in the L5 scorer. */
export const CONVERSION_TYPES = /** @type {const} */ ([
  'reply',
  'dm',
  'call',
  'interview',
  'proposal',
  'offer',
  'deal',
]);

/** Third-party recognition events (L6). */
export const RECOGNITION_TYPES = /** @type {const} */ ([
  'citation',
  'invite',
  'referral',
  'feature',
  'endorsement',
]);

/** Surfaces an artifact can be published on. */
export const CHANNELS = /** @type {const} */ ([
  'post',
  'comment',
  'article',
  'profile',
  'talk',
  'casestudy',
]);

/**
 * A fresh, empty state. Note that nothing here is fabricated: counts are zero
 * and every layer will report zero confidence until real input arrives.
 */
export function emptyState() {
  return {
    version: STATE_VERSION,
    createdAt: Date.now(),
    /** @type {'he'|'en'} */
    locale: 'he',
    profile: {
      /** @type {'job'|'independent'} */
      track: 'independent',
      /** Weeks the user has been at this. Sets the urgency register. */
      weeksInMotion: 0,
      /** True once the cold-start sequence has been completed. */
      onboarded: false,
      /** True once the First Light reveal has been shown. */
      sawFirstLight: false,
    },
    positioning: {
      audience: '',
      transformation: '',
      claim: '',
      offer: '',
      /** @type {string[]} */
      nonGoals: [],
    },
    /** @type {Source[]} */
    sources: [],
    /** @type {ProofUnit[]} */
    proofs: [],
    /** @type {Artifact[]} */
    artifacts: [],
    /** @type {Reception[]} */
    receptions: [],
    /** @type {ConversionEvent[]} */
    conversions: [],
    /** @type {Recognition[]} */
    recognitions: [],
    /** archetype -> epoch ms the acquisition play was last surfaced. */
    playLog: {},
    calibration: {
      /** @type {Record<string, number>|null} null = still using priors */
      weights: null,
      observations: 0,
      confidence: 0,
      updatedAt: null,
    },
    settings: {
      /** Optional BYOK enrichment. Off by default; see adapters/llm.js. */
      llm: { enabled: false, provider: 'anthropic', model: '', apiKey: '' },
      reduceMotion: false,
    },
  };
}

/**
 * @typedef {object} Source
 * @property {string} id
 * @property {string} name
 * @property {string} text
 * @property {boolean} demo  true for bundled sample material
 * @property {number} addedAt
 * @property {number|null} minedAt  last mining pass, null if never mined
 */

/**
 * @typedef {object} ProofUnit
 * @property {string} id
 * @property {string} claim              the atomic evidence sentence
 * @property {string} sourceId
 * @property {string} sourceName
 * @property {typeof PROOF_KINDS[number]} kind
 * @property {string[]} archetypes       which of ARCHETYPES this unit covers
 * @property {Record<string, number>} breakdown  dimension key -> 0..100
 * @property {number} score              weighted composite, 0..100
 * @property {number|null} occurredAt    epoch ms, or null when undated
 * @property {boolean} demo
 * @property {'mined'|'compounded'|'manual'} origin
 * @property {boolean} pinned
 * @property {boolean} dismissed
 * @property {number} createdAt
 */

/**
 * @typedef {object} Artifact
 * @property {string} id
 * @property {string[]} proofIds     provenance; empty means ungrounded
 * @property {typeof CHANNELS[number]} channel
 * @property {string} angle
 * @property {string} body
 * @property {'draft'|'published'} status
 * @property {number|null} publishedAt
 * @property {string} url
 * @property {number} createdAt
 */

/**
 * @typedef {object} Reception
 * @property {string} id
 * @property {string} artifactId
 * @property {number} impressions
 * @property {number} reactions
 * @property {number} comments
 * @property {number} substantiveComments  comments longer than a token reply
 * @property {number} saves
 * @property {number} shares
 * @property {number} capturedAt
 */

/**
 * @typedef {object} ConversionEvent
 * @property {string} id
 * @property {typeof CONVERSION_TYPES[number]} type
 * @property {string|null} artifactId
 * @property {string} note
 * @property {number} at
 */

/**
 * @typedef {object} Recognition
 * @property {string} id
 * @property {typeof RECOGNITION_TYPES[number]} type
 * @property {string} by
 * @property {string} url
 * @property {number} at
 */

/**
 * Ids end up in DOM attribute values and CSS selectors, so they are restricted
 * to a safe alphabet on the way in rather than trusted on the way out. An
 * imported backup is attacker-controllable input: a shared file whose proof id
 * carried markup was a stored XSS with the user's API key in reach.
 */
const ID_SAFE = /^[A-Za-z0-9_-]{1,64}$/;
const safeId = (value, prefix) =>
  typeof value === 'string' && ID_SAFE.test(value) ? value : makeId(prefix);

const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
const arr = (v) => (Array.isArray(v) ? v : []);
const str = (v, fallback = '') => (typeof v === 'string' ? v : fallback);
const num = (v, fallback = 0) => (Number.isFinite(v) ? v : fallback);
const bool = (v, fallback = false) => (typeof v === 'boolean' ? v : fallback);
const oneOf = (v, allowed, fallback) => (allowed.includes(v) ? v : fallback);

/**
 * Coerce arbitrary parsed JSON into a valid state. Never throws: a corrupted
 * or partially-written localStorage entry degrades to defaults field by field
 * rather than wiping the user's evidence base.
 */
export function normalizeState(input) {
  const base = emptyState();
  if (!isObj(input)) return base;

  const profile = isObj(input.profile) ? input.profile : {};
  const positioning = isObj(input.positioning) ? input.positioning : {};
  const calibration = isObj(input.calibration) ? input.calibration : {};
  const settings = isObj(input.settings) ? input.settings : {};
  const llm = isObj(settings.llm) ? settings.llm : {};

  return {
    version: STATE_VERSION,
    createdAt: num(input.createdAt, base.createdAt),
    locale: oneOf(input.locale, ['he', 'en'], 'he'),
    profile: {
      track: oneOf(profile.track, TRACKS, 'independent'),
      weeksInMotion: Math.max(0, Math.round(num(profile.weeksInMotion, 0))),
      onboarded: bool(profile.onboarded),
      sawFirstLight: bool(profile.sawFirstLight),
    },
    positioning: {
      audience: str(positioning.audience),
      transformation: str(positioning.transformation),
      claim: str(positioning.claim),
      offer: str(positioning.offer),
      nonGoals: arr(positioning.nonGoals).filter((v) => typeof v === 'string'),
    },
    sources: arr(input.sources).map(normalizeSource).filter(Boolean),
    proofs: arr(input.proofs).map(normalizeProof).filter(Boolean),
    artifacts: arr(input.artifacts).map(normalizeArtifact).filter(Boolean),
    receptions: arr(input.receptions).map(normalizeReception).filter(Boolean),
    conversions: arr(input.conversions).map(normalizeConversion).filter(Boolean),
    recognitions: arr(input.recognitions).map(normalizeRecognition).filter(Boolean),
    playLog: isObj(input.playLog)
      ? Object.fromEntries(
          Object.entries(input.playLog).filter(([, v]) => Number.isFinite(v)),
        )
      : {},
    calibration: {
      weights: isObj(calibration.weights) ? calibration.weights : null,
      observations: Math.max(0, Math.round(num(calibration.observations, 0))),
      confidence: Math.min(1, Math.max(0, num(calibration.confidence, 0))),
      updatedAt: Number.isFinite(calibration.updatedAt) ? calibration.updatedAt : null,
    },
    settings: {
      llm: {
        enabled: bool(llm.enabled),
        provider: str(llm.provider, 'anthropic'),
        model: str(llm.model),
        apiKey: str(llm.apiKey),
      },
      reduceMotion: bool(settings.reduceMotion),
    },
  };
}

function normalizeSource(s) {
  if (!isObj(s) || typeof s.text !== 'string' || !s.text.trim()) return null;
  return {
    id: safeId(s.id, 'src'),
    name: str(s.name, 'מקור'),
    text: s.text,
    demo: bool(s.demo),
    addedAt: num(s.addedAt, Date.now()),
    /** When this source was last run through the miner. */
    minedAt: Number.isFinite(s.minedAt) ? s.minedAt : null,
  };
}

function normalizeProof(p) {
  if (!isObj(p) || typeof p.claim !== 'string' || !p.claim.trim()) return null;
  const breakdown = isObj(p.breakdown) ? p.breakdown : {};
  const clean = {};
  for (const [k, v] of Object.entries(breakdown)) {
    if (Number.isFinite(v)) clean[k] = Math.min(100, Math.max(0, v));
  }
  return {
    id: safeId(p.id, 'proof'),
    claim: p.claim,
    sourceId: ID_SAFE.test(str(p.sourceId)) ? p.sourceId : '',
    sourceName: str(p.sourceName, '—'),
    kind: oneOf(p.kind, PROOF_KINDS, 'experience'),
    archetypes: arr(p.archetypes).filter((a) => ARCHETYPES.includes(a)),
    breakdown: clean,
    score: Math.min(100, Math.max(0, num(p.score, 0))),
    occurredAt: Number.isFinite(p.occurredAt) ? p.occurredAt : null,
    demo: bool(p.demo),
    origin: oneOf(p.origin, ['mined', 'compounded', 'manual'], 'mined'),
    pinned: bool(p.pinned),
    dismissed: bool(p.dismissed),
    createdAt: num(p.createdAt, Date.now()),
  };
}

function normalizeArtifact(a) {
  if (!isObj(a)) return null;
  return {
    id: safeId(a.id, 'art'),
    proofIds: arr(a.proofIds).filter((v) => typeof v === 'string' && ID_SAFE.test(v)),
    channel: oneOf(a.channel, CHANNELS, 'post'),
    angle: str(a.angle, 'direct'),
    body: str(a.body),
    status: oneOf(a.status, ['draft', 'published'], 'draft'),
    publishedAt: Number.isFinite(a.publishedAt) ? a.publishedAt : null,
    url: str(a.url),
    createdAt: num(a.createdAt, Date.now()),
  };
}

function normalizeReception(r) {
  // A reception whose artifact reference is unusable can never be scored,
  // calibrated from, or displayed — it would silently disappear from
  // `buildObservations` instead.
  if (!isObj(r) || typeof r.artifactId !== 'string' || !ID_SAFE.test(r.artifactId)) return null;
  const n = (v) => Math.max(0, Math.round(num(v, 0)));
  return {
    id: safeId(r.id, 'rcp'),
    artifactId: r.artifactId,
    impressions: n(r.impressions),
    reactions: n(r.reactions),
    comments: n(r.comments),
    substantiveComments: Math.min(n(r.substantiveComments), n(r.comments)),
    saves: n(r.saves),
    shares: n(r.shares),
    capturedAt: num(r.capturedAt, Date.now()),
  };
}

function normalizeConversion(c) {
  if (!isObj(c) || !CONVERSION_TYPES.includes(c.type)) return null;
  return {
    id: safeId(c.id, 'cnv'),
    type: c.type,
    artifactId:
      typeof c.artifactId === 'string' && ID_SAFE.test(c.artifactId) ? c.artifactId : null,
    note: str(c.note),
    at: num(c.at, Date.now()),
  };
}

function normalizeRecognition(r) {
  if (!isObj(r) || !RECOGNITION_TYPES.includes(r.type)) return null;
  return {
    id: safeId(r.id, 'rec'),
    type: r.type,
    by: str(r.by),
    url: str(r.url),
    at: num(r.at, Date.now()),
  };
}

/**
 * Migrate the pre-rewrite MVP state (v1) into the current shape.
 *
 * v1 stored `{context:{icp,goal,offer}, sources:[{id,name,text}], proofs:[...]}`
 * with a different dimension vocabulary. Sources are the irreplaceable part —
 * proofs are re-derived from them by the new engine, so we carry sources and
 * positioning forward and let the user re-mine rather than importing scores
 * that were produced by a different method.
 */
export function migrateLegacy(legacy) {
  const state = emptyState();
  if (!isObj(legacy)) return state;
  const ctx = isObj(legacy.context) ? legacy.context : {};
  state.positioning.audience = str(ctx.icp);
  state.positioning.transformation = str(ctx.goal);
  state.positioning.offer = str(ctx.offer);
  state.sources = arr(legacy.sources).map(normalizeSource).filter(Boolean);
  state.profile.onboarded = Boolean(state.sources.length);
  return state;
}

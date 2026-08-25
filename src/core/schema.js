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
      /** Whether the user's work is framed mainly as consulting action or expert judgement. */
      practiceMode: 'consultant',
      /**
       * Self-reported confidence that they know why to choose them over an
       * alternative.
       *
       * **Deliberately never displayed, and never set against a measured
       * score.** The tempting feature — "you said 8, your evidence says 31" —
       * fails three ways at once. It reverses the emotional direction of the
       * product, which exists to tell someone the world undervalues them, not
       * that they overvalue themselves (`docs/UX.md`: never scold, credit
       * before critique). It is a category error wearing a finding's clothes:
       * this is self-reported clarity about differentiation, L1's band is
       * measured evidence quality, and the two scales are not defined against
       * each other anywhere. And `docs/METHOD.md` opens by promising that every
       * number the product shows is derivable from it — this one is not in it.
       *
       * It is kept because the question does work in the conversation where it
       * is asked. Its only sanctioned use is calibrating register, never
       * arithmetic.
       */
      fitConfidence: 5,
      /**
       * The evidence they expect should support that choice, before the miner
       * tests it. Read in First Light, beside the unit that actually scored
       * highest — see `expectedCard` in `ui/views/onboarding.js`.
       */
      expectedEvidence: '',
      /** Weeks the user has been at this. Sets the urgency register. */
      weeksInMotion: 0,
      /** True once the cold-start sequence has been completed. */
      onboarded: false,
      /**
       * True when the visitor answered the qualifying question with "I do not
       * feel I have a problem right now". Persisted so the honest exit survives
       * a reload instead of quietly letting them back into the funnel.
       */
      declined: false,
      /**
       * When the user acknowledged that nothing has come in yet. Records a
       * null result so the guidance can stop asking and move on, instead of
       * putting the same unanswerable question every visit to the person whose
       * named pain is that publishing produced nothing.
       */
      noInboundAt: null,
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
    /**
     * Retrieval tasks produced by the recall route (`engine/recall.js`).
     *
     * **Not evidence, and structurally kept apart from it.** These records
     * hold what the user typed from memory, which is the one input class the
     * verbatim gate cannot vouch for — it checks the model's output against
     * the user's document, and here the user *is* the document. So they live
     * in their own array, no layer reads them, and nothing here reaches the
     * foundation, the gap, or archetype coverage. What they hold is a
     * person's name and an errand.
     * @type {Retrieval[]}
     */
    retrievals: [],
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
      llm: { enabled: false, provider: 'anthropic', model: '', apiKey: '', extract: false },
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
 * @property {string[]} extracted  spans model-assisted extraction proposed and the
 *   gate accepted; empty when the source has only ever been split deterministically
 * @property {number|null} extractedAt
 */

/**
 * @typedef {object} ProofUnit
 * @property {string} id
 * @property {string} claim              the atomic evidence sentence
 * @property {'split'|'model'} via        how the claim's boundaries were found
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
 * A request for evidence, addressed to a person the user named.
 *
 * `about` and `recalled` are the user's own words, carried so the task still
 * makes sense weeks later. They are shown back and never measured.
 *
 * @typedef {object} Retrieval
 * @property {string} id
 * @property {string} recipient   the named person; a task without one is not a task
 * @property {string} about       what the request concerns, in the user's words
 * @property {string} recalled    what the user remembers being said, shown back to them
 * @property {number|null} askedAt   when the user marked it sent
 * @property {number|null} closedAt  when the material actually arrived
 * @property {number} createdAt
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
/**
 * Ceiling on stored extraction spans per source. Matches `MAX_SPANS` in
 * `engine/extract.js`; duplicated rather than imported because `core/` does not
 * depend on `engine/`, and a state validator that pulls in the measurement
 * engine to validate an array length is the wrong trade.
 */
const MAX_EXTRACTED_SPANS = 40;
/**
 * Ceiling on a retrieval's recipient. Matches `MAX_RECIPIENT_CHARS` in
 * `engine/recall.js`, duplicated for the same reason as above: `core/` does
 * not depend on `engine/`.
 */
const MAX_RECIPIENT_CHARS = 60;

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
      practiceMode: oneOf(profile.practiceMode, ['consultant', 'expert'], 'consultant'),
      fitConfidence: Math.min(10, Math.max(1, Math.round(num(profile.fitConfidence, 5)))),
      expectedEvidence: str(profile.expectedEvidence),
      weeksInMotion: Math.max(0, Math.round(num(profile.weeksInMotion, 0))),
      onboarded: bool(profile.onboarded),
      declined: bool(profile.declined),
      noInboundAt: Number.isFinite(profile.noInboundAt) ? profile.noInboundAt : null,
      sawFirstLight: bool(profile.sawFirstLight),
    },
    positioning: {
      audience: str(positioning.audience),
      transformation: str(positioning.transformation),
      claim: str(positioning.claim),
      offer: str(positioning.offer),
      nonGoals: arr(positioning.nonGoals).filter((v) => typeof v === 'string'),
    },
    ...relatedRecords(input),
    // Standalone: a retrieval points at a person, not at another record, so it
    // takes no part in the reference rewrite below.
    retrievals: arr(input.retrievals).map(normalizeRetrieval).filter(Boolean),
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
        /**
         * Separate consent from `enabled`. Rewriting sends one draft and the
         * proof under it; extraction sends a whole document. A single switch
         * would have let the smaller consent authorise the larger disclosure.
         */
        extract: bool(llm.extract) && bool(llm.enabled),
      },
      reduceMotion: bool(settings.reduceMotion),
    },
  };
}

/**
 * Referential integrity across the whole file, in dependency order.
 *
 * `safeId` mints a fresh id whenever an imported one could reach markup — and
 * every reference to the rejected id then failed its own `ID_SAFE` test and was
 * dropped on the floor. An artifact lost the proof it was written from, and,
 * silently, every reception of that artifact was discarded whole, taking the
 * L4 layer with it. References are now translated through the same rewrite, so
 * only genuinely dangling ones are dropped.
 */
function relatedRecords(input) {
  const rawSources = arr(input.sources);
  const rawProofs = arr(input.proofs);
  const rawArtifacts = arr(input.artifacts);

  const src = assignIds(rawSources, 'src');
  const prf = assignIds(rawProofs, 'proof');
  const art = assignIds(rawArtifacts, 'art');

  const sources = rawSources.map((s, i) => normalizeSource(s, src.ids[i])).filter(Boolean);

  const proofs = rawProofs
    .map((p, i) => normalizeProof(p, prf.ids[i], (v) => remap(v, src.map)))
    .filter(Boolean);
  const liveProofs = new Set(proofs.map((p) => p.id));

  const artifacts = rawArtifacts
    .map((a, i) => normalizeArtifact(a, art.ids[i], (v) => resolveRef(v, prf.map, liveProofs)))
    .filter(Boolean);
  // Receptions and conversions follow the rewrite but are *not* required to
  // land on a surviving artifact. A reception is a measurement the user typed
  // in; losing it because its artifact was deleted three months ago would be
  // deleting their data to tidy up our own graph.
  const toArtifact = (v) => remap(v, art.map);

  return {
    sources,
    proofs,
    artifacts,
    receptions: arr(input.receptions).map((r) => normalizeReception(r, toArtifact)).filter(Boolean),
    conversions: arr(input.conversions).map((c) => normalizeConversion(c, toArtifact)).filter(Boolean),
    recognitions: arr(input.recognitions).map(normalizeRecognition).filter(Boolean),
  };
}

/**
 * Assign each raw record its final id, and record the rewrite so references to
 * the original can follow it. Indexed by position, because a record that fails
 * normalisation later must not shift the ids of the ones after it.
 */
function assignIds(records, prefix) {
  const ids = [];
  const map = new Map();
  for (const record of records) {
    const raw = isObj(record) ? record.id : undefined;
    const id = safeId(raw, prefix);
    ids.push(id);
    if (typeof raw === 'string') map.set(raw, id);
  }
  return { ids, map };
}

/** Follow a reference through the rewrite. Null when it cannot be represented. */
function remap(value, map) {
  if (typeof value !== 'string') return null;
  return map.get(value) ?? (ID_SAFE.test(value) ? value : null);
}

/**
 * Follow a reference through the rewrite, then require that it lands on a
 * record that survived. Used where a pointer to nothing is not data the user
 * entered but breakage: a citation naming a proof unit that no longer exists
 * renders as nothing while still being counted.
 */
function resolveRef(value, map, live) {
  const target = remap(value, map);
  return target && live.has(target) ? target : null;
}

function normalizeSource(s, id) {
  if (!isObj(s) || typeof s.text !== 'string' || !s.text.trim()) return null;
  return {
    id,
    name: str(s.name, 'מקור'),
    text: s.text,
    demo: bool(s.demo),
    addedAt: num(s.addedAt, Date.now()),
    /** When this source was last run through the miner. */
    minedAt: Number.isFinite(s.minedAt) ? s.minedAt : null,
    /**
     * Accepted extraction spans. Coerced to strings and capped here; **verified
     * against the source text in `mineSources`**, not here, so the check runs on
     * every mining pass rather than only at import. Schema owns shape; the
     * miner owns the guarantee.
     */
    extracted: arr(s.extracted)
      .filter((span) => typeof span === 'string' && span.trim())
      .slice(0, MAX_EXTRACTED_SPANS),
    extractedAt: Number.isFinite(s.extractedAt) ? s.extractedAt : null,
  };
}

function normalizeProof(p, id, toSource) {
  if (!isObj(p) || typeof p.claim !== 'string' || !p.claim.trim()) return null;
  const breakdown = isObj(p.breakdown) ? p.breakdown : {};
  const clean = {};
  for (const [k, v] of Object.entries(breakdown)) {
    if (Number.isFinite(v)) clean[k] = Math.min(100, Math.max(0, v));
  }
  return {
    id,
    claim: p.claim,
    sourceId: toSource(p.sourceId) ?? '',
    sourceName: str(p.sourceName, '—'),
    kind: oneOf(p.kind, PROOF_KINDS, 'experience'),
    archetypes: arr(p.archetypes).filter((a) => ARCHETYPES.includes(a)),
    breakdown: clean,
    score: Math.min(100, Math.max(0, num(p.score, 0))),
    occurredAt: Number.isFinite(p.occurredAt) ? p.occurredAt : null,
    demo: bool(p.demo),
    origin: oneOf(p.origin, ['mined', 'compounded', 'manual'], 'mined'),
    via: oneOf(p.via, ['split', 'model'], 'split'),
    pinned: bool(p.pinned),
    dismissed: bool(p.dismissed),
    createdAt: num(p.createdAt, Date.now()),
  };
}

function normalizeArtifact(a, id, toProof) {
  if (!isObj(a)) return null;
  return {
    id,
    proofIds: arr(a.proofIds).map(toProof).filter(Boolean),
    channel: oneOf(a.channel, CHANNELS, 'post'),
    angle: str(a.angle, 'direct'),
    body: str(a.body),
    status: oneOf(a.status, ['draft', 'published'], 'draft'),
    publishedAt: Number.isFinite(a.publishedAt) ? a.publishedAt : null,
    url: str(a.url),
    createdAt: num(a.createdAt, Date.now()),
  };
}

function normalizeReception(r, toArtifact) {
  // A reception whose artifact reference is unusable can never be scored,
  // calibrated from, or displayed — it would silently disappear from
  // `buildObservations` instead.
  const artifactId = isObj(r) ? toArtifact(r.artifactId) : null;
  if (!artifactId) return null;
  const n = (v) => Math.max(0, Math.round(num(v, 0)));
  return {
    id: safeId(r.id, 'rcp'),
    artifactId,
    impressions: n(r.impressions),
    reactions: n(r.reactions),
    comments: n(r.comments),
    substantiveComments: Math.min(n(r.substantiveComments), n(r.comments)),
    saves: n(r.saves),
    shares: n(r.shares),
    capturedAt: num(r.capturedAt, Date.now()),
  };
}

function normalizeConversion(c, toArtifact) {
  if (!isObj(c) || !CONVERSION_TYPES.includes(c.type)) return null;
  return {
    id: safeId(c.id, 'cnv'),
    type: c.type,
    // Unattributed conversions are legitimate — the user records a call they
    // cannot trace — so a reference that goes nowhere degrades to null rather
    // than discarding the event.
    artifactId: toArtifact(c.artifactId),
    note: str(c.note),
    at: num(c.at, Date.now()),
  };
}

/**
 * A retrieval with no recipient is dropped rather than repaired.
 *
 * The named person *is* the feature — it is what separates a task the user can
 * send from a note-to-self about a memory. A record that lost its name is an
 * errand addressed to nobody, and keeping it would put a permanent unfinishable
 * line on a to-do list belonging to someone who is already stuck.
 */
function normalizeRetrieval(r) {
  if (!isObj(r) || typeof r.recipient !== 'string' || !r.recipient.trim()) return null;
  return {
    id: safeId(r.id, 'rtv'),
    recipient: r.recipient.trim().slice(0, MAX_RECIPIENT_CHARS),
    about: str(r.about),
    recalled: str(r.recalled),
    askedAt: Number.isFinite(r.askedAt) ? r.askedAt : null,
    closedAt: Number.isFinite(r.closedAt) ? r.closedAt : null,
    createdAt: num(r.createdAt, Date.now()),
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
  state.sources = arr(legacy.sources)
    .map((s) => normalizeSource(s, safeId(isObj(s) ? s.id : undefined, 'src')))
    .filter(Boolean);
  state.profile.onboarded = Boolean(state.sources.length);
  return state;
}

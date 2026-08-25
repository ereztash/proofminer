import { describe, expect, it } from 'vitest';
import { computeAuthority, nextMove } from '../../src/engine/authority.js';
import { computeLayers } from '../../src/engine/layers.js';
import { acquisitionPlays, archetypeCoverage, coverageScore } from '../../src/engine/gaps.js';
import { detectDrift, scorePositioning } from '../../src/engine/positioning.js';
import { buildObservations, calibrate } from '../../src/engine/feedback.js';
import { normalizeState } from '../../src/core/schema.js';
import {
  DAY,
  NOW,
  STRONG_HE,
  artifact,
  minedSource,
  proofFrom,
  reception,
  stateWith,
} from '../helpers.js';

/** A reply carrying everything the scorer rewards, in case any of it leaks. */
const LOADED = [
  {
    id: 'rpl_1',
    artifactId: 'a0',
    text: STRONG_HE,
    at: NOW - DAY,
  },
  {
    id: 'rpl_2',
    artifactId: 'a1',
    text: 'רונית לוי, מנהלת התפעול של אלפא לוגיסטיקה: "חסכת לנו ארבעה חודשים ו-38% מהעלות".',
    at: NOW - 2 * DAY,
  },
];

describe('the reply bank round-trips exactly', () => {
  it('keeps the text character for character, line breaks included', () => {
    // "Verbatim" is a promise about the middle of the string as much as the
    // ends. A reply reflowed into one paragraph is not what was said.
    const text = 'שלום ארז,\n\n  קראתי את מה שכתבת.\n  זה בדיוק מה שקרה אצלנו.\n\nרונית';
    const round = normalizeState({ replies: [{ id: 'rpl_1', text, at: NOW }] });
    expect(round.replies).toHaveLength(1);
    expect(round.replies[0].text).toBe(text);
  });

  it('drops a record with nothing in it', () => {
    const round = normalizeState({
      replies: [{ id: 'a', text: '   ' }, { id: 'b' }, null, 'x', { id: 'c', text: 7 }],
    });
    expect(round.replies).toEqual([]);
  });

  it('keeps a reply whose reference cannot be represented, unlike a reception', () => {
    // A reception whose artifact reference is unusable can never be scored, so
    // keeping it would only hide it. A reply is never scored in the first place
    // — the words are the whole record — so it degrades to unattributed rather
    // than being deleted to tidy up our own graph.
    const unrepresentable = '"><img src=x onerror=alert(1)>';
    const round = normalizeState({
      artifacts: [],
      replies: [{ id: 'rpl_1', artifactId: unrepresentable, text: 'זה עבד' }],
      receptions: [{ id: 'rcp_1', artifactId: unrepresentable, impressions: 10 }],
    });
    expect(round.replies).toHaveLength(1);
    expect(round.replies[0].artifactId).toBeNull();
    expect(round.replies[0].text).toBe('זה עבד');
    expect(round.receptions).toEqual([]);
  });

  it('carries a merely dangling reference through, as conversions do', () => {
    // A safe id pointing at nothing is kept rather than nulled — the same rule
    // `remap` applies to every reference in the file, and the view renders it
    // as unattached. Pinned because the first version of this test assumed the
    // opposite and would have hidden a change in the shared rewrite.
    const round = normalizeState({
      artifacts: [],
      replies: [{ id: 'rpl_1', artifactId: 'gone', text: 'זה עבד' }],
    });
    expect(round.replies[0].artifactId).toBe('gone');
  });

  it('follows its post through the id rewrite an import forces', () => {
    const round = normalizeState({
      artifacts: [{ id: '"><img src=x>', status: 'published', body: 'b', proofIds: [] }],
      replies: [{ id: 'rpl_1', artifactId: '"><img src=x>', text: 'זה עבד' }],
    });
    expect(round.replies[0].artifactId).toBe(round.artifacts[0].id);
    expect(round.replies[0].artifactId).not.toContain('<');
  });

  it('re-mints an id that could reach markup', () => {
    const round = normalizeState({
      replies: [{ id: '"><img src=x onerror=alert(1)>', text: 'זה עבד' }],
    });
    expect(round.replies[0].id.startsWith('rpl_')).toBe(true);
    expect(round.replies[0].id).not.toContain('<');
  });

  it('survives an unknown shape without crashing the load', () => {
    expect(normalizeState({ replies: 'not an array' }).replies).toEqual([]);
    expect(normalizeState({}).replies).toEqual([]);
  });
});

/**
 * The reason this field is safe to put four rows below `substantiveComments`.
 *
 * That input carries weight 6 in L4, and `verification` is the highest-weighted
 * dimension in the proof scorer. If a box captioned "what did they reply" fed
 * either one, *the client said I am the best* would be a scorable input typed
 * one screen away from the numbers it would move. So the guarantee is
 * structural and pinned here rather than asserted in copy.
 */
describe('nothing reads it', () => {
  const positioning = {
    audience: 'מנהלי תפעול בחברות קמעונאיות',
    transformation: 'תהליך עבודה שאפשר לנהל',
    claim: 'מערכי אספקה שאפשר לסמוך עליהם',
    offer: 'ליווי תפעולי',
    nonGoals: [],
  };
  const proof = (id, archetype) => ({
    ...proofFrom(STRONG_HE, { positioning, now: NOW }),
    id,
    archetypes: [archetype],
  });
  const base = stateWith({
    positioning,
    sources: [minedSource()],
    proofs: [proof('pV', 'VALIDATION'), proof('pM', 'METHOD')],
    artifacts: [
      artifact({ id: 'a0', proofIds: ['pV'] }),
      artifact({ id: 'a1', proofIds: ['pV'] }),
      artifact({ id: 'a2', proofIds: ['pV'] }),
      artifact({ id: 'a3', proofIds: ['pM'] }),
    ],
    receptions: ['a0', 'a1', 'a2'].map((artifactId, i) =>
      reception({ id: `rcp_${i}`, artifactId }),
    ),
    conversions: ['a0', 'a1', 'a2'].map((artifactId, i) => ({
      id: `c${i}`,
      type: 'call',
      artifactId,
      note: '',
      at: NOW - 5 * DAY,
    })),
  });
  const loud = { ...base, replies: LOADED };

  it('leaves the whole authority computation byte for byte identical', () => {
    expect(computeAuthority(loud, NOW)).toEqual(computeAuthority(base, NOW));
  });

  it('leaves every layer identical — L4 above all', () => {
    const before = computeLayers(base, NOW);
    const after = computeLayers(loud, NOW);
    expect(after).toEqual(before);
    // Named explicitly: L4 is the layer a reply looks like it belongs to, and
    // `substantiveComments` is the field it could plausibly have fed.
    expect(after.L4.score).toBe(before.L4.score);
    expect(after.L4.confidence).toBe(before.L4.confidence);
  });

  it('leaves coverage, the gap engine and the plays identical', () => {
    expect(archetypeCoverage(loud)).toEqual(archetypeCoverage(base));
    expect(coverageScore(loud)).toBe(coverageScore(base));
    expect(acquisitionPlays(loud)).toEqual(acquisitionPlays(base));
  });

  it('leaves the two integrations the rejected version wanted to feed alone', () => {
    // The original recommendation had replies driving an anti-ICP list and
    // drift detection. Both were cut, and this is the test that keeps them cut.
    const drift = detectDrift(base);
    expect(drift).not.toBeNull();
    expect(detectDrift(loud)).toEqual(drift);
    expect(scorePositioning(loud.positioning, loud.recognitions)).toEqual(
      scorePositioning(base.positioning, base.recognitions),
    );
    expect(loud.positioning.nonGoals).toEqual([]);
  });

  it('leaves calibration and its observations identical', () => {
    expect(buildObservations(loud)).toEqual(buildObservations(base));
    expect(calibrate(loud)).toEqual(calibrate(base));
  });

  it('leaves the single next move identical', () => {
    expect(nextMove(loud, NOW)).toEqual(nextMove(base, NOW));
  });

  it('cannot buy anything on an empty state either', () => {
    const empty = stateWith({});
    expect(computeAuthority({ ...empty, replies: LOADED }, NOW)).toEqual(
      computeAuthority(empty, NOW),
    );
  });

  it('never carries a shape a proof unit or a source would accept', () => {
    for (const reply of LOADED) {
      expect(reply).not.toHaveProperty('claim');
      expect(reply).not.toHaveProperty('score');
      expect(reply).not.toHaveProperty('archetypes');
    }
    const round = normalizeState({ ...loud, sources: [], proofs: [] });
    expect(round.proofs).toEqual([]);
    expect(round.sources).toEqual([]);
    expect(round.replies).toHaveLength(2);
  });
});

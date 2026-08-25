import { describe, expect, it } from 'vitest';
import {
  MAX_RECIPIENT_CHARS,
  MAX_RETRIEVALS,
  draftRetrievals,
  namesFrom,
  nextRetrieval,
  openRetrievals,
} from '../../src/engine/recall.js';
import { computeAuthority, nextMove } from '../../src/engine/authority.js';
import { acquisitionPlays, archetypeCoverage, coverageScore } from '../../src/engine/gaps.js';
import { computeLayers } from '../../src/engine/layers.js';
import { normalizeState } from '../../src/core/schema.js';
import { NOW, STRONG_HE, minedSource, proofFrom, stateWith } from '../helpers.js';

const ids = () => {
  let n = 0;
  return () => `rtv_${(n += 1)}`;
};

const draft = (answers, options = {}) =>
  draftRetrievals(answers, { now: NOW, id: ids(), ...options });

const ANSWERS = {
  project: 'הטמעת תהליך התפעול באלפא לוגיסטיקה',
  room: 'רונית לוי\nדוד כהן',
  ending: 'רונית אמרה שזה התהליך היחיד ששרד אצלם שנה שלמה',
};

describe('reading the names out of the room', () => {
  it('splits on the separators the field asks for, and only those', () => {
    expect(namesFrom('רונית לוי\nדוד כהן').names).toEqual(['רונית לוי', 'דוד כהן']);
    expect(namesFrom('רונית, דוד; מיכל').names).toEqual(['רונית', 'דוד', 'מיכל']);
  });

  it('refuses to guess where a Hebrew name ends', () => {
    // "רונית ודוד" is two people and "רונית וייס" is one, and nothing in the
    // string says which — the vav prefix is spelled identically to the first
    // letter of a surname. Splitting on it would address a request for a
    // client's own words to a person who does not exist.
    expect(namesFrom('רונית ודוד').names).toEqual(['רונית ודוד']);
    expect(namesFrom('רונית וייס').names).toEqual(['רונית וייס']);
  });

  it('does not treat a paragraph as a name, and says how many it dropped', () => {
    const sentence = 'א'.repeat(MAX_RECIPIENT_CHARS + 1);
    const { names, ignored } = namesFrom(`רונית\n${sentence}`);
    expect(names).toEqual(['רונית']);
    expect(ignored).toBe(1);
  });

  it('folds a repeated name without reporting it as a problem', () => {
    const { names, ignored } = namesFrom('רונית\nרונית\nדוד');
    expect(names).toEqual(['רונית', 'דוד']);
    expect(ignored).toBe(0);
  });

  it('reads an empty or absent answer as no names', () => {
    expect(namesFrom('').names).toEqual([]);
    expect(namesFrom(undefined).names).toEqual([]);
    expect(namesFrom('  \n , ; ').names).toEqual([]);
  });
});

describe('what a recall pass produces', () => {
  it('is one task per named person, each addressed to that person', () => {
    const { retrievals } = draft(ANSWERS);
    expect(retrievals.map((r) => r.recipient)).toEqual(['רונית לוי', 'דוד כהן']);
    for (const r of retrievals) {
      expect(r.about).toBe(ANSWERS.project);
      expect(r.recalled).toBe(ANSWERS.ending);
      expect(r.askedAt).toBeNull();
      expect(r.closedAt).toBeNull();
    }
  });

  it('produces nothing at all without a name', () => {
    // The named recipient is the feature. Without one this is a diary entry,
    // and a diary entry is exactly what the route exists not to create.
    expect(draft({ ...ANSWERS, room: '' }).retrievals).toEqual([]);
    expect(draft({ ...ANSWERS, room: 'א' }).retrievals).toEqual([]);
  });

  it('does not duplicate a task that is already open', () => {
    const first = draft(ANSWERS).retrievals;
    const second = draft(ANSWERS, { existing: first });
    expect(second.retrievals).toEqual([]);
    expect(second.skipped).toBe(2);
  });

  it('lets the same person be asked again once the last request came back', () => {
    const closed = draft(ANSWERS).retrievals.map((r) => ({ ...r, closedAt: NOW }));
    expect(draft(ANSWERS, { existing: closed }).retrievals).toHaveLength(2);
  });

  it('treats a different project as a different request to the same person', () => {
    const first = draft(ANSWERS).retrievals;
    const second = draft({ ...ANSWERS, project: 'פרויקט אחר' }, { existing: first });
    expect(second.retrievals).toHaveLength(2);
  });

  it('separates "no name in there" from "everyone is already listed"', () => {
    // Both produce an empty result and want opposite things said about them.
    const none = draft({ ...ANSWERS, room: ' , ; ' });
    expect(none.found).toBe(0);
    expect(none.ignored).toBe(0);

    const already = draft(ANSWERS, { existing: draft(ANSWERS).retrievals });
    expect(already.retrievals).toEqual([]);
    expect(already.found).toBe(2);
  });

  it('agrees with the screen about which tasks are closed', () => {
    // `closedAt: 0` is a real epoch timestamp a crafted import can carry. A
    // truthiness test read it as open here and as closed in `openRetrievals`,
    // which blocked a request for no reason the user could see.
    const closed = draft(ANSWERS).retrievals.map((r) => ({ ...r, closedAt: 0 }));
    expect(openRetrievals(stateWith({ retrievals: closed }))).toEqual([]);
    expect(draft(ANSWERS, { existing: closed }).retrievals).toHaveLength(2);
  });

  it('caps one pass and reports what it did not take', () => {
    const room = Array.from({ length: MAX_RETRIEVALS + 3 }, (_, i) => `אדם ${i}`).join('\n');
    const { retrievals, skipped } = draft({ ...ANSWERS, room });
    expect(retrievals).toHaveLength(MAX_RETRIEVALS);
    expect(skipped).toBe(3);
  });
});

describe('which task to put in front of the user', () => {
  const state = (retrievals) => stateWith({ retrievals });

  it('prefers the one that has not been sent yet', () => {
    const [a, b] = draft(ANSWERS).retrievals;
    const sent = { ...a, askedAt: NOW };
    expect(nextRetrieval(state([sent, b])).id).toBe(b.id);
  });

  it('falls back to one already waiting on an answer', () => {
    const [a] = draft(ANSWERS).retrievals;
    expect(nextRetrieval(state([{ ...a, askedAt: NOW }])).id).toBe(a.id);
  });

  it('has nothing to say once everything came back', () => {
    const closed = draft(ANSWERS).retrievals.map((r) => ({ ...r, closedAt: NOW }));
    expect(openRetrievals(state(closed))).toEqual([]);
    expect(nextRetrieval(state(closed))).toBeNull();
  });
});

/**
 * The load-bearing claim of the whole route. A sentence typed from memory is
 * the one input the verbatim gate cannot check — it checks the model's output
 * against the user's document, and here the user *is* the document. So the
 * guarantee has to be structural, and this is where it is pinned.
 */
describe('none of it is evidence', () => {
  const positioning = {
    audience: 'מנהלי תפעול בחברות קמעונאיות',
    transformation: 'תהליך עבודה שאפשר לנהל',
    claim: '',
    offer: '',
    nonGoals: [],
  };
  const base = stateWith({
    positioning,
    sources: [minedSource()],
    proofs: [proofFrom(STRONG_HE, { positioning, now: NOW })],
  });

  // Deliberately the strongest text in the fixtures: an attributed, dated,
  // third-party outcome carrying a magnitude. If any of this reached the
  // scorer it would not reach it quietly.
  const loaded = draft({
    project: 'העלאת הכנסות ב-38% בתוך ארבעה חודשים',
    room: 'רונית לוי',
    ending: STRONG_HE,
  }).retrievals;
  const withRecall = { ...base, retrievals: loaded };

  it('leaves the whole authority computation byte for byte identical', () => {
    expect(computeAuthority(withRecall, NOW)).toEqual(computeAuthority(base, NOW));
  });

  it('leaves every layer identical', () => {
    expect(computeLayers(withRecall, NOW)).toEqual(computeLayers(base, NOW));
  });

  it('leaves coverage, the gap engine and the plays identical', () => {
    expect(archetypeCoverage(withRecall)).toEqual(archetypeCoverage(base));
    expect(coverageScore(withRecall)).toBe(coverageScore(base));
    expect(acquisitionPlays(withRecall)).toEqual(acquisitionPlays(base));
  });

  it('cannot buy a foundation on an empty inventory either', () => {
    const empty = stateWith({});
    const only = { ...empty, retrievals: loaded };
    expect(computeAuthority(only, NOW).foundation).toBe(0);
    expect(computeAuthority(only, NOW)).toEqual(computeAuthority(empty, NOW));
  });

  it('never lands in the two arrays that are measured', () => {
    // Belt and braces: the drafted record has no shape a source or a proof
    // unit would accept, so a slip that pushed it into either would not be
    // silently absorbed by the normaliser.
    for (const r of loaded) {
      expect(r).not.toHaveProperty('text');
      expect(r).not.toHaveProperty('claim');
      expect(r).not.toHaveProperty('score');
    }
    const round = normalizeState({ ...withRecall, sources: [], proofs: [] });
    expect(round.sources).toEqual([]);
    expect(round.proofs).toEqual([]);
    expect(round.retrievals).toHaveLength(1);
  });
});

describe('the guidance for someone who has nothing yet', () => {
  it('sends them to paste when there is genuinely nothing else', () => {
    expect(nextMove(stateWith({}), NOW).id).toBe('move.addSource');
  });

  it('names the person once there is a request to send', () => {
    const { retrievals } = draft(ANSWERS);
    const move = nextMove(stateWith({ retrievals }), NOW);
    expect(move.id).toBe('move.chaseRetrieval');
    expect(move.payload.recipient).toBe('רונית לוי');
    expect(move.view).toBe('mine');
  });

  it('goes back to asking for material once every request came back', () => {
    const retrievals = draft(ANSWERS).retrievals.map((r) => ({ ...r, closedAt: NOW }));
    expect(nextMove(stateWith({ retrievals }), NOW).id).toBe('move.addSource');
  });

  it('stops being the headline the moment real evidence exists', () => {
    // Retrievals are the instruction for an empty inventory only. A user who
    // has evidence has a next move about their evidence.
    const { retrievals } = draft(ANSWERS);
    const state = stateWith({
      retrievals,
      sources: [minedSource()],
      proofs: [proofFrom(STRONG_HE, { now: NOW })],
    });
    expect(nextMove(state, NOW).id).not.toBe('move.chaseRetrieval');
  });
});

describe('a retrieval survives a reload', () => {
  it('round-trips through the schema', () => {
    const { retrievals } = draft(ANSWERS);
    const round = normalizeState({ retrievals });
    expect(round.retrievals).toHaveLength(2);
    expect(round.retrievals[0]).toEqual(retrievals[0]);
  });

  it('drops a record that lost its recipient rather than repairing it', () => {
    // An errand addressed to nobody is a permanent unfinishable line on the
    // to-do list of someone who is already stuck.
    const round = normalizeState({ retrievals: [{ id: 'rtv_1', about: 'x', recipient: '  ' }] });
    expect(round.retrievals).toEqual([]);
  });

  it('re-mints an id that could reach markup', () => {
    const round = normalizeState({
      retrievals: [{ id: '"><img src=x onerror=alert(1)>', recipient: 'רונית' }],
    });
    expect(round.retrievals[0].id).not.toContain('<');
    expect(round.retrievals[0].id.startsWith('rtv_')).toBe(true);
  });

  it('keeps an unknown state shape from crashing the load', () => {
    expect(normalizeState({ retrievals: 'not an array' }).retrievals).toEqual([]);
    expect(normalizeState({ retrievals: [null, 7, 'x'] }).retrievals).toEqual([]);
  });
});

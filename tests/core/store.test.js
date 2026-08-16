import { beforeEach, describe, expect, it } from 'vitest';
import { LEGACY_STORAGE_KEY, STORAGE_KEY, migrateLegacy, normalizeState } from '../../src/core/schema.js';
import { createStore, loadState } from '../../src/core/store.js';

/** In-memory localStorage stand-in. */
function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, v),
    removeItem: (k) => map.delete(k),
    _map: map,
  };
}

/** Storage that always throws, like Safari private mode or a full quota. */
const throwingStorage = {
  getItem: () => {
    throw new Error('denied');
  },
  setItem: () => {
    throw new Error('quota');
  },
  removeItem: () => {},
};

describe('normalizeState', () => {
  it('returns a valid state for garbage input', () => {
    for (const input of [null, undefined, 42, 'nope', []]) {
      const state = normalizeState(input);
      expect(state.version).toBe(2);
      expect(Array.isArray(state.proofs)).toBe(true);
    }
  });

  it('drops malformed records instead of throwing', () => {
    const state = normalizeState({
      proofs: [null, { claim: '' }, { claim: 'ראיה תקינה', score: 70 }],
      sources: [{ text: '   ' }, { name: 'ok', text: 'תוכן' }],
      conversions: [{ type: 'not-a-type' }, { type: 'call', at: 1 }],
    });
    expect(state.proofs).toHaveLength(1);
    expect(state.sources).toHaveLength(1);
    expect(state.conversions).toHaveLength(1);
  });

  it('clamps out-of-range numbers', () => {
    const state = normalizeState({ proofs: [{ claim: 'x', score: 5000, breakdown: { verification: -20 } }] });
    expect(state.proofs[0].score).toBe(100);
    expect(state.proofs[0].breakdown.verification).toBe(0);
  });

  it('never lets substantive comments exceed total comments', () => {
    const state = normalizeState({
      receptions: [{ artifactId: 'a', comments: 3, substantiveComments: 99 }],
    });
    expect(state.receptions[0].substantiveComments).toBe(3);
  });

  it('rejects unknown enum values in favour of a safe default', () => {
    const state = normalizeState({ locale: 'fr', profile: { track: 'wizard' } });
    expect(state.locale).toBe('he');
    expect(state.profile.track).toBe('independent');
  });
});

describe('legacy migration', () => {
  it('carries the irreplaceable parts forward and drops old scores', () => {
    const legacy = {
      context: { icp: 'בעלי עסקים קטנים', goal: 'שיראו בי סמכות', offer: 'ייעוץ עסקי' },
      sources: [{ id: 's1', name: 'CV', text: 'תוכן אמיתי מהמשתמש' }],
      proofs: [{ claim: 'ישן', score: 88, breakdown: { external: 90 } }],
    };
    const migrated = migrateLegacy(legacy);
    expect(migrated.positioning.audience).toBe('בעלי עסקים קטנים');
    expect(migrated.sources).toHaveLength(1);
    // Old scores came from a different method and are not imported.
    expect(migrated.proofs).toHaveLength(0);
    expect(migrated.profile.onboarded).toBe(true);
  });

  it('survives a completely unrecognised legacy shape', () => {
    expect(migrateLegacy('garbage').version).toBe(2);
  });
});

describe('loadState', () => {
  it('reads the current key first', () => {
    const storage = memoryStorage({
      [STORAGE_KEY]: JSON.stringify({ locale: 'en', profile: { onboarded: true } }),
    });
    expect(loadState(storage).locale).toBe('en');
  });

  it('falls back to the legacy key when the current one is absent', () => {
    const storage = memoryStorage({
      [LEGACY_STORAGE_KEY]: JSON.stringify({ context: { icp: 'קהל ישן' }, sources: [] }),
    });
    expect(loadState(storage).positioning.audience).toBe('קהל ישן');
  });

  it('returns a fresh state on corrupt JSON rather than crashing', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: '{not json' });
    expect(loadState(storage).proofs).toEqual([]);
  });

  it('works with no storage at all', () => {
    expect(loadState(null).version).toBe(2);
  });
});

describe('createStore', () => {
  let storage;
  beforeEach(() => {
    storage = memoryStorage();
  });

  it('notifies subscribers on update', () => {
    const store = createStore(undefined, storage);
    let calls = 0;
    store.subscribe(() => {
      calls += 1;
    });
    store.update((draft) => {
      draft.locale = 'en';
    });
    expect(calls).toBe(1);
    expect(store.get().locale).toBe('en');
  });

  it('does not mutate the previous state object', () => {
    const store = createStore(undefined, storage);
    const before = store.get();
    store.update((draft) => {
      draft.positioning.audience = 'חדש';
    });
    expect(before.positioning.audience).toBe('');
    expect(store.get().positioning.audience).toBe('חדש');
  });

  it('normalises whatever a recipe produces', () => {
    const store = createStore(undefined, storage);
    store.update((draft) => {
      draft.proofs = [{ claim: '' }, { claim: 'תקין' }];
    });
    expect(store.get().proofs).toHaveLength(1);
  });

  it('persists on flush', () => {
    const store = createStore(undefined, storage);
    store.update((draft) => {
      draft.locale = 'en';
    });
    store.flush();
    expect(JSON.parse(storage.getItem(STORAGE_KEY)).locale).toBe('en');
  });

  it('keeps working when storage throws, and reports the failure', () => {
    const store = createStore(undefined, throwingStorage);
    store.update((draft) => {
      draft.locale = 'en';
    });
    store.flush();
    expect(store.get().locale).toBe('en');
    expect(store.persistError()).toBeInstanceOf(Error);
  });

  it('snapshot is a detached copy', () => {
    const store = createStore(undefined, storage);
    const snap = store.snapshot();
    snap.positioning.audience = 'שונה';
    expect(store.get().positioning.audience).toBe('');
  });
});

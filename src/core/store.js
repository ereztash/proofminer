/**
 * Observable state container with durable local persistence.
 *
 * Everything lives in the browser. There is no server, no account, and no
 * telemetry — which is a product decision, not only an architectural one: the
 * user is being asked to paste their CV, client emails and salary-relevant
 * outcomes into this tool while they are unemployed. That data does not leave
 * the device.
 */

import { deepClone } from './util.js';
import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  emptyState,
  migrateLegacy,
  normalizeState,
} from './schema.js';

/**
 * localStorage can throw (Safari private mode, disabled storage, quota).
 * Failing to persist must never break the running app, so all access is
 * wrapped and degrades to in-memory-only operation.
 */
function safeStorage() {
  try {
    const s = globalThis.localStorage;
    const probe = '__pm_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

export function loadState(storage = safeStorage()) {
  if (!storage) return emptyState();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));
    const legacyRaw = storage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) return normalizeState(migrateLegacy(JSON.parse(legacyRaw)));
  } catch {
    // Corrupt JSON: fall through to a fresh state rather than crashing on boot.
  }
  return emptyState();
}

export function createStore(initial = loadState(), storage = safeStorage()) {
  let state = normalizeState(initial);
  /** @type {Set<(s: object) => void>} */
  const listeners = new Set();
  let persistTimer = null;
  let lastPersistError = null;

  function persist() {
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      lastPersistError = null;
    } catch (err) {
      // Most likely QuotaExceededError from a very large pasted source.
      lastPersistError = err;
    }
  }

  function schedulePersist() {
    if (!storage) return;
    if (persistTimer !== null) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      persistTimer = null;
      persist();
    }, 120);
  }

  function emit() {
    for (const listener of listeners) listener(state);
  }

  return {
    /** @returns {object} the live state (treat as read-only) */
    get: () => state,

    /** Deep snapshot, for export and for engine calls that must not alias. */
    snapshot: () => deepClone(state),

    /** Last persistence failure, surfaced in Settings so storage loss is visible. */
    persistError: () => lastPersistError,

    /**
     * Apply a mutation. `recipe` receives a draft it may mutate in place, or
     * may return a wholly new state object.
     * @param {(draft: object) => object|void} recipe
     */
    update(recipe) {
      const draft = deepClone(state);
      const result = recipe(draft);
      state = normalizeState(result === undefined ? draft : result);
      schedulePersist();
      emit();
      return state;
    },

    /** Replace the entire state (import, reset). Persists synchronously. */
    replace(next) {
      state = normalizeState(next);
      persist();
      emit();
      return state;
    },

    /** @param {(s: object) => void} listener @returns {() => void} unsubscribe */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /** Force a synchronous write (used before unload). */
    flush() {
      if (persistTimer !== null) {
        clearTimeout(persistTimer);
        persistTimer = null;
      }
      persist();
    },
  };
}

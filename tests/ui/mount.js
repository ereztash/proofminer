/**
 * Helpers for the tests that mount the real app and click through it.
 *
 * **One walk per file, deliberately.** `ui` in `src/ui/app.js` is a module
 * singleton — which screen is open, which row is expanded — and vitest gives
 * each test *file* a fresh module graph but not each test. Two walks in one
 * file therefore start the second one on whatever screen the first one left
 * behind, and the failure looks like a missing button rather than like shared
 * state. So each walk gets its own file, and the shared plumbing lives here.
 */

// jsdom ships no `CSS.escape`, and every field lookup in the app goes through
// it. Browsers have had it since 2016; this is a test-environment gap.
globalThis.CSS = globalThis.CSS || {
  escape: (v) => String(v).replace(/[^\w-]/g, '\\$&'),
};

/** Persistence is debounced. The app flushes on `beforeunload`, so we do too. */
export const flush = () => window.dispatchEvent(new window.Event('beforeunload'));

/**
 * Click the one button matching an action, optionally narrowed by the dataset
 * the action reads. Throws rather than no-opping: a walk that silently skips a
 * step asserts nothing.
 */
export const click = (root, act, { id, view } = {}) => {
  const el = [...root.querySelectorAll(`[data-act="${act}"]`)].find(
    (e) => (!id || e.dataset.id === id) && (!view || e.dataset.view === view),
  );
  if (!el) throw new Error(`no button for ${act}${id ? ` #${id}` : ''}${view ? ` → ${view}` : ''}`);
  el.click();
};

export const set = (root, id, value) => {
  const el = root.querySelector(`#${id}`);
  if (!el) throw new Error(`no field #${id}`);
  el.value = value;
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
};

export const check = (root, selector) => {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`no control ${selector}`);
  el.checked = true;
  el.dispatchEvent(new window.Event('change', { bubbles: true }));
};

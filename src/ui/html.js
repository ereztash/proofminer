/**
 * Minimal, escape-by-default templating.
 *
 * Every interpolation is HTML-escaped unless it is itself a template result or
 * explicitly wrapped in `raw()`. The previous implementation concatenated
 * strings into `innerHTML` and relied on the author remembering to call an
 * escape helper at each site — one omission on a field the user pastes from a
 * client email is a stored XSS. Here the safe path is the default and the
 * unsafe path has to be typed out.
 */

const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

const RAW = Symbol('raw-html');

/** Mark a string as pre-escaped markup. Use only on markup you built. */
export const raw = (value) => ({ [RAW]: true, value: String(value) });

export const isRaw = (value) =>
  typeof value === 'object' && value !== null && value[RAW] === true;

function flatten(value) {
  if (value === null || value === undefined || value === false || value === true) return '';
  if (Array.isArray(value)) return value.map(flatten).join('');
  if (isRaw(value)) return value.value;
  return escapeHtml(value);
}

/**
 * Tagged template producing escaped markup.
 * @returns {{value: string}} a raw marker, so templates compose safely
 */
export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    out += flatten(values[i]) + strings[i + 1];
  }
  return raw(out);
}

/** Render a template into a DOM node. */
export function renderInto(node, template) {
  node.innerHTML = flatten(template);
}

/** Convert a template to a plain string (for tests and for `renderInto`). */
export const toString_ = (template) => flatten(template);

/**
 * Build a class attribute from a map or list, skipping falsy entries.
 * `cx({ card: true, active: isActive })`
 */
export function cx(...args) {
  const out = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string') out.push(arg);
    else if (Array.isArray(arg)) out.push(cx(...arg));
    else for (const [key, value] of Object.entries(arg)) if (value) out.push(key);
  }
  return out.filter(Boolean).join(' ');
}

/**
 * Wrap Latin/numeric fragments so bidirectional reordering does not mangle
 * them inside Hebrew sentences ("הגיע ל-12,400 חשיפות" must not reorder).
 */
export const bidi = (value) => raw(`<bdi>${escapeHtml(value)}</bdi>`);

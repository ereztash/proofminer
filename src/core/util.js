/**
 * Small shared primitives. Deliberately dependency-free and side-effect-free
 * so the engine stays pure and testable.
 */

/** Milliseconds in a day. */
export const DAY_MS = 86_400_000;

/**
 * Injectable clock. Every time-dependent engine function takes `now` as an
 * explicit argument so decay, cadence and trailing-window logic are testable
 * without freezing global time.
 * @returns {number} epoch milliseconds
 */
export const now = () => Date.now();

/** @returns {number} n clamped into [lo, hi] */
export function clamp(n, lo = 0, hi = 100) {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

/** Clamp to 0..100 and round. */
export const clamp100 = (n) => Math.round(clamp(n, 0, 100));

/**
 * Saturating curve: rises quickly, asymptotically approaches `max`.
 * Used wherever "more is better but with diminishing returns" (cadence,
 * inventory volume, conversion counts).
 * @param {number} value observed quantity
 * @param {number} half quantity at which the output reaches half of `max`
 * @param {number} max ceiling
 */
export function saturate(value, half, max = 100) {
  const v = Math.max(0, value);
  if (half <= 0) return v > 0 ? max : 0;
  return (max * v) / (v + half);
}

/** Age of a timestamp in days, never negative. */
export function ageDays(timestamp, at) {
  if (!Number.isFinite(timestamp)) return Infinity;
  return Math.max(0, (at - timestamp) / DAY_MS);
}

/** Mean of an array of numbers; 0 for an empty array. */
export function mean(values) {
  if (!values.length) return 0;
  let sum = 0;
  for (const v of values) sum += v;
  return sum / values.length;
}

/** Population standard deviation. */
export function stdev(values) {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(mean(values.map((v) => (v - m) ** 2)));
}

/**
 * Pearson correlation. Returns 0 for degenerate input (constant series,
 * fewer than 3 points) rather than NaN — a flat series carries no information
 * and must not poison downstream weights.
 */
export function correlation(xs, ys) {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return 0;
  const mx = mean(xs.slice(0, n));
  const my = mean(ys.slice(0, n));
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i += 1) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  if (dx === 0 || dy === 0) return 0;
  const r = num / Math.sqrt(dx * dy);
  return Number.isFinite(r) ? r : 0;
}

/**
 * Collision-resistant id that does not depend on `crypto.randomUUID`
 * (absent in some non-secure contexts and in older test runners).
 * @param {string} prefix
 */
export function makeId(prefix = 'id') {
  const rand =
    typeof globalThis.crypto?.getRandomValues === 'function'
      ? Array.from(globalThis.crypto.getRandomValues(new Uint8Array(8)))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
      : Math.random().toString(16).slice(2, 18).padEnd(16, '0');
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

/** Structured clone with a JSON fallback, for state snapshots. */
export function deepClone(value) {
  if (typeof globalThis.structuredClone === 'function') {
    return globalThis.structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

/** Stable descending sort by a numeric selector (ties keep input order). */
export function sortByDesc(items, selector) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => selector(b.item) - selector(a.item) || a.index - b.index)
    .map(({ item }) => item);
}

/** Sum of numeric values in an object. */
export const sumValues = (obj) => Object.values(obj).reduce((s, v) => s + v, 0);

/** Round to `digits` decimal places. */
export const round = (n, digits = 2) => {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
};

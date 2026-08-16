import he from './he.js';
import en from './en.js';

const BUNDLES = { he, en };

/**
 * Resolve a path in the active bundle, falling back to Hebrew (the source
 * language) and finally to the path itself, so a missing string is visible in
 * development rather than rendering as `undefined` in production.
 *
 * The path may be a dotted string (`'nav.mine'`) **or an array of segments**
 * (`['moves', 'move.publishStaling', 'why']`). The array form exists because
 * several of our keys are engine identifiers that themselves contain dots —
 * play ids, move ids and positioning issue ids — and splitting those on `.`
 * silently resolves to nothing.
 *
 * @param {'he'|'en'} locale
 * @returns {(path: string|string[], ...args: unknown[]) => any}
 */
export function translator(locale) {
  const bundle = BUNDLES[locale] || BUNDLES.he;
  return function t(path, ...args) {
    const segments = Array.isArray(path) ? path : String(path).split('.');
    const resolve = (source) =>
      segments.reduce((acc, key) => (acc == null ? undefined : acc[key]), source);
    const value = resolve(bundle) ?? resolve(BUNDLES.he);
    if (value === undefined) return Array.isArray(path) ? path.join('.') : path;
    return typeof value === 'function' ? value(...args) : value;
  };
}

export const bundleFor = (locale) => BUNDLES[locale] || BUNDLES.he;
export const LOCALES = Object.keys(BUNDLES);

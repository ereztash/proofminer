import { describe, expect, it } from 'vitest';
import { bidi, cx, escapeHtml, html, raw, toString_ } from '../../src/ui/html.js';
import { translator } from '../../src/i18n/index.js';
import heBundle from '../../src/i18n/he.js';
import enBundle from '../../src/i18n/en.js';

describe('escaping', () => {
  it('escapes every dangerous character', () => {
    expect(escapeHtml(`<script>&"'`)).toBe('&lt;script&gt;&amp;&quot;&#39;');
  });

  it('escapes interpolations by default', () => {
    const evil = '<img src=x onerror=alert(1)>';
    expect(toString_(html`<p>${evil}</p>`)).toBe(
      '<p>&lt;img src=x onerror=alert(1)&gt;</p>',
    );
  });

  it('escapes inside attribute positions', () => {
    const evil = '" onmouseover="alert(1)';
    const out = toString_(html`<div title="${evil}"></div>`);
    expect(out).not.toContain('onmouseover="alert');
    expect(out).toContain('&quot;');
  });

  it('composes nested templates without double-escaping', () => {
    const inner = html`<b>${'A & B'}</b>`;
    expect(toString_(html`<p>${inner}</p>`)).toBe('<p><b>A &amp; B</b></p>');
  });

  it('flattens arrays of templates', () => {
    const items = ['<a>', '<b>'].map((s) => html`<li>${s}</li>`);
    expect(toString_(html`<ul>${items}</ul>`)).toBe('<ul><li>&lt;a&gt;</li><li>&lt;b&gt;</li></ul>');
  });

  it('renders null, undefined and false as empty', () => {
    expect(toString_(html`<p>${null}${undefined}${false}</p>`)).toBe('<p></p>');
  });

  it('only emits unescaped markup through the explicit raw() escape hatch', () => {
    expect(toString_(html`${raw('<hr>')}`)).toBe('<hr>');
  });

  it('escapes inside bdi wrappers', () => {
    expect(toString_(html`${bidi('<b>12</b>')}`)).toBe('<bdi>&lt;b&gt;12&lt;/b&gt;</bdi>');
  });
});

describe('cx', () => {
  it('joins strings, arrays and truthy map keys', () => {
    expect(cx('a', ['b', { c: true, d: false }], null, undefined)).toBe('a b c');
  });
});

describe('i18n', () => {
  it('resolves dotted paths', () => {
    expect(translator('he')('nav.mine')).toBe('מקורות');
    expect(translator('en')('nav.mine')).toBe('Sources');
  });

  it('resolves array paths for keys that themselves contain dots', () => {
    const t = translator('he');
    expect(t(['moves', 'move.addSource', 'title'])).toBeTruthy();
    expect(t(['plays', 'play.outcome', 'title'])).toBeTruthy();
    expect(t(['position', 'issue', 'audience.missing'])).toBeTruthy();
  });

  it('calls function entries with arguments', () => {
    expect(translator('en')('firstLight.title', 14)).toContain('14');
  });

  it('falls back to Hebrew when a key is missing from English', () => {
    expect(translator('en')('nav.dashboard')).toBeTruthy();
  });

  it('returns the path itself for a genuinely unknown key', () => {
    expect(translator('he')('nope.not.here')).toBe('nope.not.here');
  });

  it('keeps the two bundles structurally aligned', () => {
    const shape = (obj, prefix = '') =>
      Object.entries(obj).flatMap(([key, value]) =>
        value && typeof value === 'object' && !Array.isArray(value)
          ? shape(value, `${prefix}${key}.`)
          : [`${prefix}${key}`],
      );
    const heKeys = new Set(shape(heBundle));
    const missing = shape(enBundle).filter((k) => !heKeys.has(k));
    expect(missing).toEqual([]);
  });

  it('never uses the vocabulary that repels this audience', () => {
    const banned = [
      /מיתוג אישי/, /מותג אישי/, /משפיען/, /ויראלי/,
      /personal brand/i, /thought leader/i, /influencer/i, /go viral/i, /crush it/i,
    ];
    const flatten = (obj) =>
      Object.values(obj).flatMap((v) =>
        typeof v === 'string' ? [v] : typeof v === 'object' && v ? flatten(v) : [],
      );
    // Function-valued strings are excluded here; they are covered by usage tests.
    for (const bundle of [heBundle, enBundle]) {
      for (const text of flatten(bundle)) {
        for (const pattern of banned) {
          expect(pattern.test(text), `"${text}" matched ${pattern}`).toBe(false);
        }
      }
    }
  });
});

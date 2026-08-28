/**
 * The product ships no measurement transport.
 *
 * Three documents assert this in prose — `docs/ARCHITECTURE.md` ("no server, no
 * account, no telemetry"), `docs/MEASUREMENT_MODEL.md` (seven of twelve nodes
 * are `cannot observe`, and that is the architecture stated as a measurement
 * fact), and the pledge the user reads on screen 0 before pasting a client's
 * mail into the box. `index.html` says it in a comment. Nothing tested it.
 *
 * That is the same "discipline held by hand" that `tests/engine/appendix.test.js`
 * exists to end, and it is the invariant with the most pressure on it: the
 * cheapest way to make a user study easier is always to add one beacon, and the
 * observability audit in `docs/JOURNEY_FRICTION.md` concluded — per candidate,
 * not in general — that JF1 needs none.
 *
 * So the rule is mechanical. Exactly one outbound-request call site exists in
 * `src/`, it is the BYOK model adapter, it is off by default and it sits behind
 * two nested consents. Everything else that could carry a measurement off the
 * device fails here and is named.
 *
 * **What this cannot catch, stated plainly:** an outbound call assembled from
 * strings at run time, or a transport reached through an alias. A repository
 * that wanted to hide one could. This guards the honest mistake and the
 * convenient shortcut, which are the two that actually happen.
 */

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');

/** Every `.js` under `src/`, relative to the repository root. */
function sourceFiles(dir = SRC) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.isFile() && entry.name.endsWith('.js') ? [path.relative(ROOT, full)] : [];
  });
}

const FILES = sourceFiles();

/**
 * The one file allowed to make a request, and the reason it is allowed.
 *
 * `src/adapters/llm.js` sends a draft, or one document, to a provider the user
 * configured with their own key, after a `confirm()` restated at the point of
 * the action. It is a capability the user switched on, not a measurement taken
 * from them.
 */
const REQUEST_ALLOWLIST = new Set(['src/adapters/llm.js']);

/**
 * Ways a browser can move bytes off the device, written so they match code
 * rather than prose. The comments in this repository discuss telemetry
 * constantly and must not fail a check about whether it is implemented.
 */
const TRANSPORTS = [
  { name: 'fetch()', re: /\bfetch\s*\(/, allowlisted: true },
  { name: 'navigator.sendBeacon()', re: /\bsendBeacon\s*\(/, allowlisted: false },
  { name: 'XMLHttpRequest', re: /\bXMLHttpRequest\s*\(?/, allowlisted: false },
  { name: 'new WebSocket', re: /\bnew\s+WebSocket\b/, allowlisted: false },
  { name: 'new EventSource', re: /\bnew\s+EventSource\b/, allowlisted: false },
  // The tracking pixel: `new Image().src = '…'` needs no fetch and no consent.
  { name: 'new Image()', re: /\bnew\s+Image\s*\(/, allowlisted: false },
  { name: 'navigator.geolocation', re: /\bnavigator\s*\.\s*geolocation\b/, allowlisted: false },
];

/**
 * Packages that exist to record what a user did. Matched on the import
 * specifier, so a mention in a comment — `docs/JOURNEY_FRICTION.md` studies
 * several of these by name — is not an integration.
 */
const ANALYTICS_IMPORT =
  /\bfrom\s+['"](?:posthog[^'"]*|mixpanel[^'"]*|@amplitude\/[^'"]*|@segment\/[^'"]*|@sentry\/[^'"]*|@opentelemetry\/[^'"]*|@vercel\/analytics[^'"]*|web-vitals|rrweb[^'"]*|@growthbook\/[^'"]*)['"]/;

const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

describe('no measurement transport ships in the product', () => {
  it('finds the source tree it is supposed to be guarding', () => {
    // A traversal that silently returned nothing would pass every check below.
    expect(FILES.length).toBeGreaterThan(20);
    expect(FILES).toContain('src/adapters/llm.js');
    expect(FILES).toContain('src/ui/app.js');
  });

  it('has exactly one outbound-request call site, and it is the consent-gated adapter', () => {
    const callers = FILES.filter((file) => /\bfetch\s*\(/.test(read(file)));
    expect(callers).toEqual([...REQUEST_ALLOWLIST]);
  });

  it('carries no beacon, socket, pixel or other off-device transport anywhere', () => {
    const found = [];
    for (const file of FILES) {
      const text = read(file);
      for (const transport of TRANSPORTS) {
        if (transport.allowlisted && REQUEST_ALLOWLIST.has(file)) continue;
        if (transport.re.test(text)) found.push(`${file}: ${transport.name}`);
      }
    }
    expect(found).toEqual([]);
  });

  it('imports no analytics, replay or experimentation package', () => {
    const found = FILES.filter((file) => ANALYTICS_IMPORT.test(read(file)));
    expect(found).toEqual([]);
  });

  it('serves a page that requests nothing from anywhere else', () => {
    const html = read('index.html');
    // The favicon is a data: URI and the module is same-origin. Any absolute
    // http(s) URL in the served shell is a request the pledge did not mention.
    const remote = html.match(/(?:src|href)\s*=\s*["']https?:\/\/[^"']+/g) ?? [];
    expect(remote).toEqual([]);
  });

  it('stamps the build without asking the network for anything', () => {
    // `vite.config.js` writes the commit into the HTML at build time. It is the
    // one thing in this repository that looks like instrumentation and is not:
    // a constant in the served page, read by the smoke test and by an observer
    // running JF1, that makes no request and reads nothing about the visitor.
    const config = read('vite.config.js');
    expect(config).toMatch(/proofminer-commit/);
    expect(/\bfetch\s*\(|\bsendBeacon\s*\(/.test(config)).toBe(false);
  });
});

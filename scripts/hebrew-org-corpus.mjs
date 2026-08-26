/**
 * Rebuild the Hebrew organisation corpus from Wikipedia, byte for byte.
 *
 * `docs/MEASUREMENT.md` publishes a recall figure for the Hebrew organisation
 * detector. A published figure that nobody else can recompute is an assertion,
 * so this script exists to make it a measurement: it reconstructs the exact
 * text the figure was computed over.
 *
 * **Reproducibility comes from pinned revisions, not from a copy.** Every
 * article is fetched at a fixed `oldid`, which Wikipedia serves immutably, and
 * every fetch is checked against a SHA-256 recorded in the manifest. A page
 * edited tomorrow changes nothing here. What is stored in this repository is
 * the manifest — article titles, revision ids, hashes, and the organisation
 * names labelled in each — and not one sentence of the prose. That is the same
 * rule the client material and the Hacker News pitches are held to, for the
 * same reason: this repository does not become a bank of other people's
 * wordings.
 *
 * The text is CC BY-SA 4.0, from he.wikipedia.org. It is cached under
 * `.corpus/` and is gitignored.
 *
 *   node scripts/hebrew-org-corpus.mjs          build or resume the cache
 *   node scripts/hebrew-org-corpus.mjs --verify check the cache, fetch nothing
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
export const MANIFEST = join(HERE, 'hebrew-org-corpus.manifest.json');
export const CACHE = join(ROOT, '.corpus', 'hebrew-orgs');

const UA = 'proofminer-corpus/1.0 (measurement reproduction; github.com/ereztash/proofminer)';
/** Wikipedia asks for serial, unhurried access from scripts. This obeys. */
const PACE_MS = 1200;

const sha256 = (text) => createHash('sha256').update(text, 'utf8').digest('hex');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const readManifest = async () => JSON.parse(await readFile(MANIFEST, 'utf8'));
export const cachePath = (revid) => join(CACHE, `${revid}.wiki`);

/** One article, at one revision, or an explanation. */
async function fetchRevision(revid) {
  const url = `https://he.wikipedia.org/w/index.php?action=raw&oldid=${revid}`;
  let delay = 4000;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA } });
      if (res.status === 429 || res.status === 503) throw new Error(`http-${res.status}`);
      if (!res.ok) return { ok: false, reason: `http-${res.status}` };
      return { ok: true, text: await res.text() };
    } catch (err) {
      if (attempt === 4) return { ok: false, reason: err?.message || 'network' };
      await sleep(delay);
      delay = Math.min(delay * 2, 60_000);
    }
  }
  return { ok: false, reason: 'unreachable' };
}

async function main() {
  const verifyOnly = process.argv.includes('--verify');
  const manifest = await readManifest();
  await mkdir(CACHE, { recursive: true });

  let cached = 0;
  let fetched = 0;
  const drifted = [];
  const missing = [];

  for (const article of manifest.articles) {
    const path = cachePath(article.revid);

    if (existsSync(path)) {
      const text = await readFile(path, 'utf8');
      if (sha256(text) === article.sha256) {
        cached += 1;
        continue;
      }
      // A cached file that no longer hashes is corrupt, not drifted: the
      // revision it came from cannot have changed.
      drifted.push({ title: article.title, revid: article.revid, why: 'cache-corrupt' });
      if (verifyOnly) continue;
    } else if (verifyOnly) {
      missing.push(article.title);
      continue;
    }

    const got = await fetchRevision(article.revid);
    await sleep(PACE_MS);
    if (!got.ok) {
      missing.push(`${article.title} (${got.reason})`);
      continue;
    }
    if (sha256(got.text) !== article.sha256) {
      // Wikipedia served a fixed revision that does not match the recorded
      // hash. That is a real event and it is reported rather than absorbed:
      // the published figure was computed over the recorded bytes.
      drifted.push({ title: article.title, revid: article.revid, why: 'hash-mismatch' });
      continue;
    }
    await writeFile(path, got.text, 'utf8');
    fetched += 1;
    if ((cached + fetched) % 25 === 0) {
      console.error(`  ${cached + fetched}/${manifest.articles.length}`);
    }
  }

  const files = (await readdir(CACHE)).filter((f) => f.endsWith('.wiki')).length;
  console.error(
    `corpus: ${manifest.articles.length} articles | cached ${cached} | fetched ${fetched} | ` +
      `files ${files} | drifted ${drifted.length} | missing ${missing.length}`,
  );
  for (const d of drifted) console.error(`  DRIFT  ${d.title} @${d.revid} — ${d.why}`);
  for (const m of missing.slice(0, 10)) console.error(`  MISSING ${m}`);

  if (drifted.length || missing.length) {
    console.error(
      '\nThe corpus is incomplete, so any number computed from it is not the published one.',
    );
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await main();

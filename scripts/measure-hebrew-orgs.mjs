/**
 * How many Hebrew organisations the detector finds, against ground truth it
 * did not write.
 *
 * ## What is measured
 *
 * One number, defined before it was computed:
 *
 * > Of the organisations named in the corpus with a bare `ב` prefix — the form
 * > Hebrew uses for a workplace — what share does `extractSignals` return as a
 * > proper noun, in the sentence where the name appears?
 *
 * ## Where the labels come from
 *
 * Not from this project. In Wikipedia's markup a workplace written `ברשת 13`
 * is `ב[[רשת 13]]`, and the linked article's own `[[קטגוריה:…]]` lines and
 * entity infobox say whether the thing is an organisation. Both decisions are
 * Wikipedia's. Nobody here annotated anything, which is the point: every
 * fixture in this repository was written by somebody who already knew what the
 * detector looks for, and a suite built that way cannot see what the detector
 * does not do. `tests/engine/recall-floor.test.js` read 0.50 in Hebrew before
 * and after a change worth twelve points here.
 *
 * ## What counts as a hit
 *
 * The detector consumes the type word it triggered on and returns the name
 * after it — `אוניברסיטת מקגיל` comes back as `מקגיל` — so the label is
 * normalised the same way before comparing. Demanding it echo its own trigger
 * measures the convention rather than the detection, and scored 0.4% when it
 * was first written that way.
 *
 * ## What this is not
 *
 * Wikipedia biographies are third-person encyclopedic prose. They are a
 * **calibration corpus for one component**, not a sample of the population this
 * product serves, and nothing here may be used to calibrate bands, ceilings or
 * archetype distribution. The rate below says what the detector does with
 * Hebrew organisation names; it says nothing about what people write about
 * themselves.
 *
 *   npm run measure:hebrew-orgs
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extractSignals } from '../src/engine/signals.js';
import { MANIFEST, cachePath, readManifest } from './hebrew-org-corpus.mjs';

/** Type words the detector consumes rather than returns. */
const TRIGGERS =
  /^(?:ה?חברת|ה?ארגון|ה?עמותת|ה?קבוצת|ה?אוניברסיטת|ה?מכללת|בית הספר|ה?סטארטאפ|ה?בנק|ה?רשת|ה?קרן|ה?משרד|ה?עיתון|ה?מגזין|ה?קונצרן|ה?תאגיד)\s+/u;

const nameTokens = (org) =>
  org
    .replace(TRIGGERS, '')
    .trim()
    .split(/\s+/u)
    .filter((t) => t.length >= 2);

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

/** Wikitext to prose. Only removes; never rewrites a character of the text. */
function stripWikitext(input) {
  let s = input;
  s = s.replace(/<ref[^>]*?\/>/gu, '');
  s = s.replace(/<ref[\s\S]*?<\/ref>/gu, '');
  for (let i = 0; i < 3; i += 1) s = s.replace(/\{\{[^{}]*\}\}/gu, '');
  s = s.replace(/\{\|[\s\S]*?\|\}/gu, '');
  s = s.replace(/\[\[(?:קובץ|תמונה|File|Image):[^\]]*\]\]/gu, '');
  s = s.replace(/\[\[קטגוריה:[^\]]*\]\]/gu, '');
  s = s.replace(/\[\[([^\]|#]+?)\|([^\]]+?)\]\]/gu, '$2');
  s = s.replace(/\[\[([^\]|#]+?)\]\]/gu, '$1');
  s = s.replace(/'''?/gu, '');
  s = s.replace(/^=+.*?=+$/gmu, '');
  s = s.replace(/<[^>]+>/gu, '');
  s = s.replace(/[ \t]+/gu, ' ');
  return s;
}

/**
 * Wilson score interval. The normal approximation is wrong at these sample
 * sizes and this is the standard repair; publishing a bare percentage from 427
 * observations without one overstates how much is known.
 */
function wilson(hits, n, z = 1.96) {
  if (!n) return [0, 0];
  const p = hits / n;
  const d = 1 + (z * z) / n;
  const centre = (p + (z * z) / (2 * n)) / d;
  const half = (z / d) * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return [Math.max(0, centre - half), Math.min(1, centre + half)];
}

/**
 * Sentences that must never yield an organisation.
 *
 * Written for this measurement, not taken from anywhere: each is a form that
 * broke an earlier version of the detector. A recall figure published without
 * its companion is half a result — a detector can reach any recall by calling
 * everything an organisation.
 */
const NEGATIVES = [
  ['a verb opening with ב', 'בניתי תהליך עבודה חדש לצוות.'],
  ['a second verb opening with ב', 'ביקשתי מהצוות לשנות את סדר העבודה.'],
  ['a third verb opening with ב', 'בדקתי את המערכת לפני העלייה לאוויר.'],
  ['a fourth verb opening with ב', 'בחרתי בגישה אחרת לגמרי לפרויקט.'],
  ['a fifth verb opening with ב', 'ביטלתי את הפגישה בגלל עומס בעבודה.'],
  ['a sixth verb opening with ב', 'ביצעתי את המעבר בתוך שבועיים בלבד.'],
  ['a generic industry, not a company', 'עבדתי בחברת הביטוח הגדולה בארץ.'],
  ['something published, not somewhere worked', 'פרסמתי ברשת מאמר על הנושא.'],
  ['a school as an errand', 'הסעתי את הילדים לבית הספר כל בוקר.'],
  ['a person, not a company', 'מיכל ברק ניהלה את הפרויקט מתחילתו.'],
  ['a client nobody named', 'עבדתי אצל לקוח גדול בתחום הפיננסי.'],
  ['a department, not a name', 'עבדתי במחלקה הזאת ארבע שנים.'],
  ['a preposition before a group', 'בין חברי הצוות הייתה הסכמה מלאה.'],
  ['a meeting, not a place of work', 'בפגישה סיכמנו על לוח זמנים חדש.'],
  ['a role, not a place', 'שימשתי כמנהל מוצר בכיר.'],
  ['a skill list', 'ניסיון בפייתון, בסיסי נתונים ובענן.'],
];

async function main() {
  const manifest = await readManifest();

  const uncached = manifest.articles.filter((a) => !existsSync(cachePath(a.revid)));
  if (uncached.length) {
    console.error(
      `${uncached.length} of ${manifest.articles.length} articles are not cached.\n` +
        'Run: node scripts/hebrew-org-corpus.mjs',
    );
    process.exitCode = 1;
    return;
  }

  let instances = 0;
  let hits = 0;
  const misses = [];

  for (const article of manifest.articles) {
    const text = stripWikitext(await readFile(cachePath(article.revid), 'utf8'));
    const sentences = text.split(/(?<=[.!?])\s+|\n+/u);
    for (const org of article.orgs) {
      const bare = new RegExp(`(?<![א-ת])ב${escape(org)}(?![א-ת])`, 'u');
      const want = nameTokens(org);
      if (!want.length) continue;
      for (const sentence of sentences.filter((s) => bare.test(s)).slice(0, 2)) {
        instances += 1;
        const nouns = extractSignals(sentence).properNouns || [];
        if (nouns.some((n) => want.every((w) => n.includes(w)))) hits += 1;
        else if (misses.length < 10) misses.push({ org, nouns });
      }
    }
  }

  let fabrications = 0;
  const fabricated = [];
  for (const [why, sentence] of NEGATIVES) {
    const nouns = extractSignals(sentence).properNouns || [];
    if (nouns.length) {
      fabrications += 1;
      fabricated.push({ why, nouns });
    }
  }

  const recall = instances ? hits / instances : 0;
  const [lo, hi] = wilson(hits, instances);
  const pc = (x) => `${(100 * x).toFixed(1)}%`;

  console.log(`corpus            : ${manifest.articles.length} articles, he.wikipedia.org`);
  console.log(`manifest          : ${MANIFEST}`);
  console.log(`labelled instances: ${instances}`);
  console.log(`found             : ${hits}`);
  console.log(`RECALL            : ${pc(recall)}   95% CI [${pc(lo)}, ${pc(hi)}]  (Wilson)`);
  console.log(`baseline          : ${pc(manifest.baseline.recall)} on ${manifest.baseline.measuredAt}`);
  console.log(`floor             : ${pc(manifest.baseline.floor)}`);
  console.log(`fabrications      : ${fabrications}/${NEGATIVES.length} negatives yielded an organisation`);

  if (misses.length) {
    console.log('\nfirst misses:');
    for (const m of misses) console.log(`  ${m.org}  ->  ${JSON.stringify(m.nouns)}`);
  }
  if (fabricated.length) {
    console.log('\nFABRICATED:');
    for (const f of fabricated) console.log(`  ${f.why}  ->  ${JSON.stringify(f.nouns)}`);
  }

  // A fabrication is a hard failure whatever the recall: this product may miss
  // an organisation and may not invent one.
  if (fabrications > 0) {
    console.error('\nA negative produced an organisation. That is the anti-goal, not a regression.');
    process.exitCode = 1;
  }
  if (recall < manifest.baseline.floor) {
    console.error(`\nRecall ${pc(recall)} is below the pinned floor ${pc(manifest.baseline.floor)}.`);
    process.exitCode = 1;
  }
}

await main();

/**
 * Parse a block of text copied out of LinkedIn's post analytics.
 *
 * The measurement screen is where this product's two feedback integrations
 * live, and it was asking a demoralised person to hand-type six numbers after
 * every post — including `saves`, which LinkedIn does not expose on personal
 * post analytics at all. That is not a friction problem, it is the reason the
 * loop would never close.
 *
 * The user selects the stats block on the post page, copies, and pastes. We do
 * no scraping and make no request: the clipboard content is theirs, and it
 * never leaves the device.
 *
 * Deliberately forgiving. A miss shows an empty field the user can fill in,
 * which is exactly where they were before.
 */

const HE = {
  impressions: /(?:חשיפות|צפיות|הופעות)/u,
  reactions: /(?:תגובו?ת רגש|לייקים|רגשות|אהבתי)/u,
  comments: /(?:תגובות|הערות)/u,
  shares: /(?:שיתופים|שותף)/u,
  saves: /(?:שמירות|נשמר)/u,
};

const EN = {
  impressions: /\b(?:impressions|views)\b/iu,
  reactions: /\b(?:reactions|likes)\b/iu,
  comments: /\b(?:comments)\b/iu,
  shares: /\b(?:reposts|shares)\b/iu,
  saves: /\b(?:saves|saved)\b/iu,
};

/** `1,234`, `1.2K`, `3M`, `12 אלף`. */
const NUMBER = /(\d[\d.,]*)\s*([KkMm]|אלף|אלפים|מיליון)?/u;

const MULTIPLIER = { k: 1000, m: 1_000_000, אלף: 1000, אלפים: 1000, מיליון: 1_000_000 };

function parseMagnitude(raw, suffix) {
  const base = Number.parseFloat(raw.replace(/,/g, ''));
  if (!Number.isFinite(base)) return null;
  const factor = suffix ? MULTIPLIER[suffix.toLowerCase()] ?? 1 : 1;
  return Math.round(base * factor);
}

/**
 * Extract whatever metrics are recognisable from pasted text.
 *
 * Handles both orders LinkedIn uses across surfaces and locales — number then
 * label ("1,204 impressions") and label then number ("Impressions 1,204") —
 * by scanning each line for a label and taking the nearest number on it.
 *
 * @param {string} text
 * @returns {{found: Record<string, number>, matched: number}}
 */
export function parseAnalyticsPaste(text) {
  const found = {};
  if (!text || !text.trim()) return { found, matched: 0 };

  const lines = text
    .split(/\r?\n|[·|•]/u)
    .map((line) => line.trim())
    .filter(Boolean);

  // Order matters: `תגובות` is a substring of `תגובות רגש`, so reactions must
  // be tested before comments or every reaction count lands in the wrong field.
  const LABELS = [
    ['impressions', [HE.impressions, EN.impressions]],
    ['reactions', [HE.reactions, EN.reactions]],
    ['shares', [HE.shares, EN.shares]],
    ['saves', [HE.saves, EN.saves]],
    ['comments', [HE.comments, EN.comments]],
  ];

  /** A line that is nothing but a magnitude. */
  const bareNumber = (line) => {
    if (!line) return null;
    const m = line.match(new RegExp(`^${NUMBER.source}$`, 'u'));
    return m ? parseMagnitude(m[1], m[2]) : null;
  };

  const labelAt = (line) =>
    LABELS.find(([, patterns]) => patterns.some((re) => re.test(line)))?.[0] ?? null;

  const labelled = lines
    .map((line, i) => ({ i, line, key: labelAt(line), inline: line.match(NUMBER) }))
    .filter((entry) => entry.key);

  // Determine the layout once, from the whole paste, instead of guessing per
  // line. LinkedIn stacks the label above its number on some surfaces and below
  // it on others; preferring "the line after" unconditionally meant the
  // number-above-label card parsed with every value shifted one row, reported
  // `matched: 4`, and fed a 32x understated impression count straight into the
  // reception denominator. Confidently wrong is worse here than empty.
  const stackedAfter = labelled.filter((e) => !e.inline && bareNumber(lines[e.i + 1]) !== null).length;
  const stackedBefore = labelled.filter((e) => !e.inline && bareNumber(lines[e.i - 1]) !== null).length;
  const preferBefore = stackedBefore > stackedAfter;

  for (const entry of labelled) {
    if (found[entry.key] !== undefined) continue;
    const neighbours = preferBefore
      ? [bareNumber(lines[entry.i - 1]), bareNumber(lines[entry.i + 1])]
      : [bareNumber(lines[entry.i + 1]), bareNumber(lines[entry.i - 1])];
    const value =
      (entry.inline ? parseMagnitude(entry.inline[1], entry.inline[2]) : null) ??
      neighbours.find((n) => n !== null) ??
      null;
    if (value !== null) found[entry.key] = value;
  }

  return { found, matched: Object.keys(found).length };
}

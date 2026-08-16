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

  for (const line of lines) {
    const number = line.match(NUMBER);
    if (!number) continue;
    const value = parseMagnitude(number[1], number[2]);
    if (value === null) continue;

    for (const [key, patterns] of Object.entries({
      impressions: [HE.impressions, EN.impressions],
      reactions: [HE.reactions, EN.reactions],
      shares: [HE.shares, EN.shares],
      saves: [HE.saves, EN.saves],
      comments: [HE.comments, EN.comments],
    })) {
      if (found[key] !== undefined) continue;
      if (patterns.some((re) => re.test(line))) {
        // `תגובות` matches both reactions and comments in Hebrew; whichever
        // label is checked first wins, and reactions is checked first because
        // LinkedIn lists it first. A wrong guess is a visible number the user
        // can correct, not a silent error.
        found[key] = value;
        break;
      }
    }
  }

  return { found, matched: Object.keys(found).length };
}

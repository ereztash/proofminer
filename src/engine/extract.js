/**
 * The extraction gate — what a model is allowed to hand back to the miner.
 *
 * The product's promise is that it works only with what the user wrote, and a
 * model asked to propose claims could break that promise in one sentence. So
 * this module does not ask it to behave. A candidate is accepted only if it is
 * present **verbatim** in the source document, and what enters the inventory is
 * the *source's own characters*, sliced at the located offsets — never the
 * string the model returned. A paraphrase, a stitched claim, an invented number
 * and a hallucinated employer all fail in exactly the same way: they are not in
 * the text. Fabrication is not made unlikely here, it is made structurally
 * impossible, which is the only version of this feature this product can carry.
 *
 * Two things are done to a located span, and neither can add information: a
 * leading bullet is dropped, and internal whitespace is collapsed. No
 * non-whitespace character is ever substituted, reordered or introduced.
 *
 * That leaves the model one job, and it is the one it is actually good at:
 * deciding **where a claim begins and ends**. Sentence splitting cannot see
 * that a proof spans two sentences, that a paragraph of pleasantries contains
 * one buried outcome, or that "responsible for the onboarding process" is not
 * evidence of anything. Boundaries are a judgement; worth is a measurement.
 * The model gets the judgement and never touches the measurement.
 *
 * The gate runs at mining time, not only at the API boundary, so a hand-edited
 * backup file cannot inject a claim that was never in the source either.
 */

import { isContactOrFurniture } from './text.js';

/** Same floor as `splitSentences` — below this a span is a fragment. */
export const MIN_SPAN = 30;

/**
 * A span longer than this is a section, not a claim. Kept generous because a
 * testimonial with its attribution, or an outcome with its before-state, is
 * legitimately several sentences long.
 */
export const MAX_SPAN = 600;

/** Upper bound on accepted spans per source, mirroring `MAX_PROOFS`. */
export const MAX_SPANS = 40;

/** Zero-width and bidirectional control characters: present in pasted text, absent from an echo. */
const INVISIBLE = /[\u00AD\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/u;

/** Combining marks — niqqud above all, which a model routinely drops. */
const COMBINING = /\p{M}/u;

const WHITESPACE = /\s/u;

/** Every apostrophe and quotation mark the two texts might disagree about. */
const QUOTES = /['"\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F\u2032\u2033\u05F3\u05F4]/u;

/**
 * Every dash, including the Hebrew maqaf. A model normalises an em dash — and a
 * maqaf — to an ASCII hyphen without being asked, and rejecting the user's own
 * sentence over a hyphen it silently swapped is the fastest way to make this
 * gate look broken when it is working.
 */
const DASHES = /[\u2010-\u2015\u2212\u05BE]/u;

/**
 * Leading bullet or enumerator. Stripped from a located span for the same
 * reason `splitSentences` strips it — it is furniture, not claim. This is the
 * only edit made to source text, and it only ever *removes* characters.
 */
const ENUMERATOR = /^\s*(?:[-*+\u2013\u2014\u2022\u00B7\u25AA]+\s*|\d+[.)\]]\s+)/u;

/** Fold one character for comparison. Never returns more than one character. */
function foldChar(ch) {
  if (QUOTES.test(ch)) return '"';
  if (DASHES.test(ch)) return '-';
  const lower = ch.toLowerCase();
  return lower.length === 1 ? lower : ch;
}

/**
 * Fold `text` for comparison while keeping a map back to the original offsets.
 *
 * The map is the whole point: it is what lets a tolerant comparison return an
 * intolerant result. We match on a form that forgives niqqud, curly quotes and
 * re-wrapped lines, then hand back the untouched original characters.
 *
 * @param {string} text
 * @returns {{folded:string, start:number[], end:number[]}}
 */
export function foldWithOffsets(text) {
  const chars = [];
  const start = [];
  const end = [];
  let pendingSpace = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (COMBINING.test(ch) || INVISIBLE.test(ch)) continue;
    if (WHITESPACE.test(ch)) {
      // Runs of whitespace collapse to one space, and leading whitespace is
      // dropped entirely: a model re-wraps lines and the user's newline is not
      // part of the claim.
      pendingSpace = chars.length > 0;
      continue;
    }
    if (pendingSpace) {
      // Zero-width in the original, so it can never become a slice boundary.
      chars.push(' ');
      start.push(i);
      end.push(i);
      pendingSpace = false;
    }
    chars.push(foldChar(ch));
    start.push(i);
    end.push(i + 1);
  }

  return { folded: chars.join(''), start, end };
}

/**
 * Locate `candidate` inside `source`, tolerant of formatting, exact on content.
 *
 * @param {string} source
 * @param {string} candidate
 * @param {{folded:string, start:number[], end:number[]}} [index] precomputed fold of `source`
 * @returns {{from:number, to:number, text:string}|null} offsets into the original source
 */
export function locateVerbatim(source, candidate, index) {
  if (typeof source !== 'string' || typeof candidate !== 'string') return null;
  const hay = index || foldWithOffsets(source);
  const needle = foldWithOffsets(candidate).folded;
  if (!needle) return null;

  const at = hay.folded.indexOf(needle);
  if (at < 0) return null;

  const from = hay.start[at];
  const to = hay.end[at + needle.length - 1];
  return { from, to, text: source.slice(from, to) };
}

/**
 * Apply the gate to a model's candidate spans.
 *
 * Rejections are returned rather than swallowed. The UI reports them, because
 * "the model proposed 17 passages and 4 were not in your document" is a true
 * statement about a tool the user is being asked to trust with their material,
 * and hiding it would make the feature look better than it is.
 *
 * @param {string} source raw source document text
 * @param {unknown[]} candidates strings the model returned
 * @param {object} [options]
 * @returns {{spans:string[], rejected:Array<{text:string, reason:string}>}}
 */
export function acceptSpans(source, candidates, options = {}) {
  const {
    minLength = MIN_SPAN,
    maxLength = MAX_SPAN,
    max = MAX_SPANS,
  } = options;

  const rejected = [];
  if (typeof source !== 'string' || !source.trim() || !Array.isArray(candidates)) {
    return { spans: [], rejected };
  }

  const index = foldWithOffsets(source);
  const accepted = [];
  const preview = (value) => String(value).slice(0, 120);

  for (const candidate of candidates) {
    if (accepted.length >= max) {
      rejected.push({ text: preview(candidate), reason: 'over-limit' });
      continue;
    }
    if (typeof candidate !== 'string' || !candidate.trim()) {
      rejected.push({ text: preview(candidate), reason: 'invalid' });
      continue;
    }

    const hit = locateVerbatim(source, candidate, index);
    if (!hit) {
      // The only interesting rejection: the model wrote something that is not
      // in the user's document. Everything downstream depends on this line.
      rejected.push({ text: preview(candidate), reason: 'not-found' });
      continue;
    }

    // Two edits are made to the located slice, and both are stated in the
    // module header because this is the one place the word "verbatim" is at
    // risk: a leading bullet is removed, and internal whitespace is collapsed
    // the way `unwrap` collapses a line the user's editor happened to wrap.
    // No non-whitespace character is ever substituted, moved or added.
    const lead = ENUMERATOR.exec(source.slice(hit.from, hit.to));
    const from = hit.from + (lead ? lead[0].length : 0);
    const to = hit.to;
    const text = source.slice(from, to).replace(/\s+/gu, ' ').trim();

    if (text.length < minLength) {
      rejected.push({ text: preview(candidate), reason: 'too-short' });
      continue;
    }
    if (text.length > maxLength) {
      rejected.push({ text: preview(candidate), reason: 'too-long' });
      continue;
    }
    if (isContactOrFurniture(text)) {
      rejected.push({ text: preview(candidate), reason: 'furniture' });
      continue;
    }
    // Overlapping spans are the same evidence twice, and two proof units
    // covering the same sentence each count toward volume and toward the gate
    // ceiling. Prose dedupe downstream catches near-duplicates; this catches
    // the exact case it is worst at — one span wholly inside another.
    if (accepted.some((span) => from < span.to && span.from < to)) {
      rejected.push({ text: preview(candidate), reason: 'overlap' });
      continue;
    }

    accepted.push({ from, to, text });
  }

  // Source order, not model order: the user reads the result against their own
  // document, and a list that jumps around it is a list they cannot check.
  accepted.sort((a, b) => a.from - b.from);
  return { spans: accepted.map((span) => span.text), rejected };
}

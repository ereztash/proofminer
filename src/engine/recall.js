/**
 * The recall route — for the user who has nothing to paste.
 *
 * The commonest way this product fails a real person is a dead screen: they
 * arrive, they are asked for documents, and they do not have any. Not because
 * they never did the work, but because the work left no file behind — it
 * happened in rooms, in calls, in other people's inboxes.
 *
 * The obvious fix is to ask them to write it down from memory and score what
 * they write. **That fix is wrong, and this module exists to not build it.**
 *
 * `docs/METHOD.md` rule 5 guarantees that a proof unit's text is a substring
 * of a document the user supplied, and the extraction gate enforces it
 * exactly. But the gate checks the *model's* output against the user's input;
 * it has nothing to say about the input itself. A textarea captioned "what do
 * you remember?" walks straight past it: whatever is typed there is, by
 * construction, present verbatim in the source, because it *is* the source.
 * Type "the client said I saved them four months" and the product would score
 * it as evidence — and score it well, since it carries a magnitude, an
 * attribution and an outcome. The one number this product exists to protect
 * would become a number the user can raise by writing a nicer sentence about
 * themselves. That is the category it refuses to be.
 *
 * So recall produces **retrieval tasks, not proof units**. The pivot is the
 * second question: *who was in the room*. A name is not evidence, but it is
 * the address of someone who can supply evidence — and one message to one
 * named person is, per the corpus, the move that actually gets stuck. Nothing
 * this module returns is scored, counted, or fed to any layer. It is a to-do
 * list with a person's name on each line, and the evidence enters later,
 * through the ordinary paste box, in the words of whoever wrote back.
 *
 * **The fourth recall question is deliberately not asked.** The research
 * proposed four — the last project, who was in the room, what was said at the
 * end, and what you do differently since. The fourth produces no recipient,
 * and under the inversion above it cannot become evidence either, so it would
 * be a fourth box whose answer is written to disk and never read again. That
 * is the exact defect `profile.expectedEvidence` was just repaired for; adding
 * a fresh instance of it in the same breath is not a trade worth making.
 */

import { makeId } from '../core/util.js';

/**
 * Longest a line may be and still be treated as somebody's name.
 *
 * Over this and the entry is silently dropped from the *recipient* list — the
 * user wrote a sentence in the name box, and addressing a task to a paragraph
 * produces a task nobody can send. Reported back as a count rather than
 * swallowed, in the same shape the extraction gate reports rejections.
 */
export const MAX_RECIPIENT_CHARS = 60;

/** Shortest string that can be a name. One character is a typo. */
const MIN_RECIPIENT_CHARS = 2;

/**
 * Ceiling on tasks created in one pass.
 *
 * Not a data limit — an attention one. This screen is reached by someone who
 * has just been told they have no evidence; handing them eleven errands is a
 * way of making sure none of them happen.
 */
export const MAX_RETRIEVALS = 6;

/**
 * Separators the name field is explicitly asked to use, and only those.
 *
 * Hebrew is not split on the conjunction. "רונית ודוד" is two people and
 * "רונית וייס" is one, and nothing in the string says which — the vav prefix
 * is spelled identically to the first letter of a surname. Guessing wrong
 * addresses a request for a client's own words to a person who does not exist,
 * which is worse than leaving one line reading "רונית ודוד" and letting the
 * user send two messages. So the separators are the unambiguous ones, and the
 * field hint asks for one name per line.
 */
const SEPARATORS = /[,;\n]+/;

/**
 * Names in the "who was in the room" answer.
 *
 * @param {string} text
 * @returns {{names: string[], ignored: number}} `ignored` counts entries that
 *   could not be a name. Duplicates are folded silently — writing the same
 *   person twice is not an error to report back.
 */
export function namesFrom(text = '') {
  const parts = String(text ?? '')
    .split(SEPARATORS)
    .map((part) => part.trim())
    .filter(Boolean);

  const names = [];
  const seen = new Set();
  let ignored = 0;

  for (const part of parts) {
    if (part.length < MIN_RECIPIENT_CHARS || part.length > MAX_RECIPIENT_CHARS) {
      ignored += 1;
      continue;
    }
    const key = part.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(part);
  }

  return { names, ignored };
}

/**
 * Turn a recall pass into retrieval tasks.
 *
 * One task per named person. `about` and `recalled` are the user's own words,
 * carried on the task so it still makes sense three weeks later — they are
 * there to remind the user what to ask for, and they are never read by
 * anything that computes a number.
 *
 * @param {{project?: string, room?: string, ending?: string}} answers
 * @param {object} [options]
 * @param {number} [options.now]
 * @param {Array<object>} [options.existing] retrievals already on file, so a
 *   second pass over the same room does not duplicate open tasks
 * @param {() => string} [options.id] id factory, injected for tests
 * @returns {{retrievals: Array<object>, found: number, ignored: number, skipped: number}}
 *   `found` is how many names were read at all. The caller needs it to tell
 *   "nothing in that box was a name" from "everyone in it is already on the
 *   list" — two states that produce an identical empty result and want
 *   opposite things said about them.
 */
export function draftRetrievals(answers = {}, options = {}) {
  const { now = Date.now(), existing = [], id = () => makeId('rtv') } = options;

  const about = String(answers.project ?? '').trim();
  const recalled = String(answers.ending ?? '').trim();
  const { names, ignored } = namesFrom(answers.room);

  // Only *open* tasks block a duplicate. A retrieval the user closed months
  // ago is a request that already came back; asking the same person about the
  // same project again is a legitimate second ask, not a mistake.
  // `Number.isFinite`, matching `openRetrievals` exactly. A truthiness test
  // disagreed with it on `closedAt: 0` — an epoch timestamp a crafted import
  // can carry — so the same record read as closed on the screen and as open
  // here, silently blocking a request the user could see no reason for.
  const taken = new Set(
    existing
      .filter((r) => !Number.isFinite(r.closedAt))
      .map((r) => key(r.recipient, r.about)),
  );

  const retrievals = [];
  for (const recipient of names) {
    if (retrievals.length >= MAX_RETRIEVALS) break;
    if (taken.has(key(recipient, about))) continue;
    taken.add(key(recipient, about));
    retrievals.push({
      id: id(),
      recipient,
      about,
      recalled,
      askedAt: null,
      closedAt: null,
      createdAt: now,
    });
  }

  return {
    retrievals,
    found: names.length,
    ignored,
    skipped: names.length - retrievals.length,
  };
}

const key = (recipient, about) => `${String(recipient).toLowerCase()}::${about}`;

/** Tasks still waiting for an answer. */
export const openRetrievals = (state) =>
  (state.retrievals || []).filter((r) => !Number.isFinite(r.closedAt));

/**
 * The one task to put in front of the user next.
 *
 * Never sent, before sent-and-waiting: an unsent message is the only one whose
 * next step is entirely in the user's hands.
 */
export function nextRetrieval(state) {
  const open = openRetrievals(state);
  return open.find((r) => !Number.isFinite(r.askedAt)) || open[0] || null;
}

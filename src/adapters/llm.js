/**
 * Optional LLM enrichment — bring your own key, off by default.
 *
 * SECURITY POSTURE, stated plainly because the user deserves to decide:
 * this app has no server. An API key entered here is stored in this browser's
 * localStorage and sent directly from the browser to the provider. That means
 * any script running on this page could read it, and the key is not protected
 * the way a server-side key would be. The feature is therefore:
 *   - disabled by default,
 *   - never required for any core function,
 *   - documented in the UI with this exact caveat,
 *   - recommended only with a scoped, low-limit, revocable key.
 *
 * The honest alternative — a backend proxy — is deliberately not built, because
 * building it would mean this product starts holding other people's evidence
 * on a server, and that trade is worse for this ICP than an opt-in local key.
 *
 * ENGINE INDEPENDENCE: every score, layer, diagnosis and next move in this
 * product is computed by deterministic code. The model never scores anything.
 * It has exactly two jobs, and a gate on each:
 *
 *   - `refineDraft` rewrites text the user already owns. Its output passes the
 *     same grounding check as a template draft: an unsupported number blocks,
 *     an unsupported name warns.
 *   - `extractClaims` proposes which passages of a source document are
 *     evidence. Its output passes `acceptSpans`, which keeps a passage only if
 *     it is present verbatim in that document and returns the *document's*
 *     characters rather than the model's. See `engine/extract.js`.
 *
 * Both are conveniences. A model outage, a missing key or a disabled toggle
 * removes a convenience and never a capability: drafts still compose from
 * templates, and mining still falls back to deterministic sentence splitting.
 */

import { validateGrounding } from '../engine/drafts.js';
import { MAX_SPANS, acceptSpans } from '../engine/extract.js';

const ENDPOINTS = {
  anthropic: 'https://api.anthropic.com/v1/messages',
};

const DEFAULT_MODEL = 'claude-sonnet-5';

/**
 * How much of a source document is sent in one extraction call.
 *
 * A cap is unavoidable, so the only question is whether the user is told. A
 * truncated run reports `truncated: true` and the UI says which part of the
 * document was read — silently analysing the first third of someone's career
 * and presenting the result as their evidence base is exactly the kind of
 * quiet incompleteness this product exists to argue against.
 */
export const MAX_SOURCE_CHARS = 20_000;

export function isConfigured(settings) {
  const llm = settings?.llm;
  return Boolean(llm?.enabled && llm?.apiKey?.trim());
}

/**
 * Model-assisted extraction is a second, larger disclosure than rewriting.
 * Rewriting sends one draft and the proof under it; extraction sends the whole
 * document — the CV, the client email, the thread. It gets its own switch.
 */
export function isExtractionConfigured(settings) {
  return isConfigured(settings) && Boolean(settings.llm.extract);
}

/**
 * One request to the provider. Shared by both jobs so the failure vocabulary —
 * `network`, `aborted`, `http-4xx`, `bad-response`, `empty-completion` — is
 * identical wherever the UI has to explain what went wrong.
 *
 * @returns {Promise<{ok:true, text:string}|{ok:false, reason:string}>}
 */
async function complete({ apiKey, endpoint, model, system, userMessage, maxTokens, signal }) {
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        // Required for direct browser calls; see the security note above.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: model?.trim() || DEFAULT_MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
  } catch (err) {
    return { ok: false, reason: err?.name === 'AbortError' ? 'aborted' : 'network' };
  }

  if (!response.ok) return { ok: false, reason: `http-${response.status}` };

  let payload;
  try {
    payload = await response.json();
  } catch {
    return { ok: false, reason: 'bad-response' };
  }

  const text = (payload?.content || [])
    .filter((block) => block?.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();

  if (!text) return { ok: false, reason: 'empty-completion' };
  return { ok: true, text };
}

/**
 * Rewrite a draft in the user's own register without adding facts.
 *
 * @param {object} options
 * @param {object} options.settings
 * @param {string} options.body            the template-composed draft
 * @param {Array<{claim:string}>} options.proofs  cited proof units
 * @param {'he'|'en'} [options.locale]
 * @param {string} [options.instruction]   user's own steer, e.g. "shorter, drier"
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<{ok:boolean, body?:string, reason?:string, unsupported?:string[]}>}
 */
export async function refineDraft({
  settings,
  body,
  proofs,
  locale = 'he',
  instruction = '',
  signal,
}) {
  if (!isConfigured(settings)) return { ok: false, reason: 'not-configured' };
  if (!body?.trim()) return { ok: false, reason: 'empty-body' };

  const { apiKey, model, provider } = settings.llm;
  const endpoint = ENDPOINTS[provider] || ENDPOINTS.anthropic;

  const evidence = proofs.map((p, i) => `[${i + 1}] ${p.claim}`).join('\n');
  const system = [
    'You edit professional social posts. You are given a draft and the exact evidence it is grounded in.',
    'HARD CONSTRAINTS:',
    '1. Never introduce a fact, number, name, date, client, metric or outcome that does not appear in the evidence block.',
    '2. Never make the claims stronger than the evidence supports. Removing hedges that the evidence justifies is allowed; adding superlatives is not.',
    '3. Never add hype vocabulary (game-changing, thought leader, revolutionary, crushing it, viral).',
    '4. Keep the author’s register: plain, adult, unsentimental. No emoji unless the draft already had them.',
    `5. Write in ${locale === 'en' ? 'English' : 'Hebrew'}.`,
    'Return only the edited post text. No preamble, no explanation, no markdown fences.',
  ].join('\n');

  const userMessage = [
    'EVIDENCE (the only facts you may use):',
    evidence,
    '',
    'DRAFT:',
    body,
    instruction ? `\nAUTHOR'S STEER: ${instruction}` : '',
  ].join('\n');

  const call = await complete({
    apiKey,
    endpoint,
    model,
    system,
    userMessage,
    maxTokens: 1200,
    signal,
  });
  if (!call.ok) return call;
  const text = call.text;

  // Same gate as template drafts. A model that invented a number does not get
  // to write into this app, regardless of how good the prose is.
  const grounding = validateGrounding(text, proofs);
  if (!grounding.ok) {
    return { ok: false, reason: 'ungrounded', unsupported: grounding.unsupported };
  }

  return { ok: true, body: text };
}

/**
 * The instruction. Written as a copy task, not a writing task.
 *
 * The model is never asked to summarise, improve or characterise anything —
 * only to point at passages. That framing is doing real work: a model asked to
 * "extract achievements" writes achievements, and a model asked to quote
 * quotes. The gate would catch the difference either way, but a prompt that
 * fights the gate wastes the user's call and their money.
 */
function extractionSystem(locale, mode) {
  return [
    'You are given one document belonging to the person you work for. Your only job is to point at the passages in it that are EVIDENCE.',
    '',
    'Evidence is a specific thing that happened, was built, was measured, was decided, or was said about their work by someone else.',
    '',
    'INCLUDE:',
    '- an outcome, with or without a number attached',
    '- what a client, manager or colleague said about their work, together with the attribution',
    '- a method, process, framework or tool they built, described concretely enough to recognise',
    '- a decision they made and what followed from it',
    '- a failure or a reversal, where the document says concretely what happened',
    '- scale: how many, how long, how much, for whom, over what period',
    '',
    'EXCLUDE:',
    '- job titles, employers and dates standing on their own',
    '- responsibilities and duties ("responsible for", "managed the onboarding process", "worked closely with")',
    '- greetings, sign-offs, contact details, headers, boilerplate',
    '- ambitions, opinions and self-description with nothing behind them',
    '',
    mode === 'expert'
      ? 'This person is positioned on what they SEE that others miss: prefer passages showing a diagnosis, a judgement, or a call made early.'
      : 'This person is positioned on the CHANGE they lead: prefer passages showing a before-state and what it became.',
    '',
    'HARD CONSTRAINTS:',
    '1. Every passage must be COPIED EXACTLY from the document, character for character.',
    '2. Never paraphrase, summarise, translate, correct, complete or improve a passage. A passage you did not copy exactly is discarded, and the user is told you returned one that was not in their document.',
    '3. Never join passages that are not adjacent in the document. If two facts sit in different paragraphs, return two passages.',
    '4. Never write a passage of your own, and never fill a gap. Returning four passages from a thin document is the correct answer; inventing a fifth is not.',
    '5. A passage may be one sentence or several consecutive sentences. Take the shortest span in which the claim still stands on its own — an outcome that needs its before-state, or a quotation that needs its attribution, is one passage, not two.',
    `6. The document is written in ${locale === 'en' ? 'English or Hebrew' : 'Hebrew or English'}. Return the passages in whatever language they are written in. Do not translate.`,
    `7. Return at most ${MAX_SPANS} passages, best first.`,
    '',
    'Return JSON and nothing else, in this exact shape:',
    '{"spans": ["first passage", "second passage"]}',
  ].join('\n');
}

/** Parse a JSON object out of a completion that may be fenced or prefaced. */
function parseSpans(text) {
  const attempt = (candidate) => {
    try {
      const parsed = JSON.parse(candidate);
      return Array.isArray(parsed?.spans) ? parsed.spans : null;
    } catch {
      return null;
    }
  };

  const unfenced = text.replace(/^```(?:json)?\s*/iu, '').replace(/\s*```$/u, '');
  const direct = attempt(unfenced);
  if (direct) return direct;

  const open = unfenced.indexOf('{');
  const close = unfenced.lastIndexOf('}');
  if (open >= 0 && close > open) return attempt(unfenced.slice(open, close + 1));
  return null;
}

/**
 * Propose which passages of a source document are evidence.
 *
 * What comes back is the *source's own text*: every candidate is located in the
 * document by `acceptSpans`, and the located offsets are used to slice the
 * original. Anything the model wrote rather than copied is rejected and
 * reported. See `engine/extract.js` for why the gate is shaped this way.
 *
 * Nothing here is scored. The returned spans go into the same deterministic
 * pipeline that a split sentence goes into, and are ranked by the same
 * dimensions with the same weights.
 *
 * @param {object} options
 * @param {object} options.settings
 * @param {{text:string}} options.source
 * @param {'he'|'en'} [options.locale]
 * @param {'consultant'|'expert'} [options.mode]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<{ok:boolean, spans?:string[], rejected?:Array<{text:string,reason:string}>,
 *   returned?:number, truncated?:boolean, reason?:string}>}
 */
export async function extractClaims({
  settings,
  source,
  locale = 'he',
  mode = 'consultant',
  signal,
}) {
  if (!isExtractionConfigured(settings)) return { ok: false, reason: 'not-configured' };
  const text = source?.text;
  if (!text?.trim()) return { ok: false, reason: 'empty-source' };

  const { apiKey, model, provider } = settings.llm;
  const truncated = text.length > MAX_SOURCE_CHARS;
  const sent = truncated ? text.slice(0, MAX_SOURCE_CHARS) : text;

  const call = await complete({
    apiKey,
    endpoint: ENDPOINTS[provider] || ENDPOINTS.anthropic,
    model,
    system: extractionSystem(locale, mode),
    userMessage: `DOCUMENT:\n${sent}`,
    maxTokens: 4000,
    signal,
  });
  if (!call.ok) return call;

  const candidates = parseSpans(call.text);
  if (!candidates) return { ok: false, reason: 'bad-response' };

  // The gate runs against the *whole* source, not the truncated copy. A model
  // that echoed a passage from beyond the cut would still be quoting the user's
  // own document, and dropping it would be the gate lying about what it does.
  const { spans, rejected } = acceptSpans(text, candidates);
  return { ok: true, spans, rejected, returned: candidates.length, truncated };
}

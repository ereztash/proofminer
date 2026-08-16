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
 * product is computed by deterministic code. The LLM never scores anything and
 * never scores anything, and its output passes the same grounding check as a template draft — which blocks an unsupported number and only warns on an unsupported name. It only rewrites text the user already owns, and its
 * output is rejected unless it passes the same grounding validator that
 * template drafts pass.
 */

import { validateGrounding } from '../engine/drafts.js';

const ENDPOINTS = {
  anthropic: 'https://api.anthropic.com/v1/messages',
};

const DEFAULT_MODEL = 'claude-sonnet-5';

export function isConfigured(settings) {
  const llm = settings?.llm;
  return Boolean(llm?.enabled && llm?.apiKey?.trim());
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
        max_tokens: 1200,
        system,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
  } catch (err) {
    return { ok: false, reason: err?.name === 'AbortError' ? 'aborted' : 'network' };
  }

  if (!response.ok) {
    return { ok: false, reason: `http-${response.status}` };
  }

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

  // Same gate as template drafts. A model that invented a number does not get
  // to write into this app, regardless of how good the prose is.
  const grounding = validateGrounding(text, proofs);
  if (!grounding.ok) {
    return { ok: false, reason: 'ungrounded', unsupported: grounding.unsupported };
  }

  return { ok: true, body: text };
}

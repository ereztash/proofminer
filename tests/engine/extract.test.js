import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  MAX_SPANS,
  acceptSpans,
  foldWithOffsets,
  locateVerbatim,
} from '../../src/engine/extract.js';
import { extractClaims, isExtractionConfigured } from '../../src/adapters/llm.js';
import { mineSources } from '../../src/engine/mine.js';
import { normalizeState } from '../../src/core/schema.js';
import { NOW, minedSource, stateWith } from '../helpers.js';

/** A messy source of the kind this feature exists for: prose, not bullets. */
const EMAIL = [
  'היי דני, מקווה שהכל טוב אצלך.',
  'רציתי לעדכן שסגרנו את הרבעון.',
  'לפני שהתחלנו העבודה איתך היינו מפספסים כל דדליין שני.',
  'מאז השינוי שהובלת סיימנו ארבעה רבעונים ברציפות בזמן, וזמן האספקה ירד ב־40 אחוז.',
  'תודה רבה,',
  'רונית כהן, סמנכ"לית תפעול',
].join('\n');

const CV = [
  '- Led the migration of 12 services to a new platform.',
  'Deadlines had slipped for six months.',
  'After the restructure the team shipped on time for four consecutive quarters.',
  'Responsible for the onboarding process and worked closely with stakeholders.',
].join('\n');

describe('the verbatim gate', () => {
  it('accepts a passage copied exactly', () => {
    const { spans, rejected } = acceptSpans(EMAIL, [
      'לפני שהתחלנו העבודה איתך היינו מפספסים כל דדליין שני.',
    ]);
    expect(spans).toEqual(['לפני שהתחלנו העבודה איתך היינו מפספסים כל דדליין שני.']);
    expect(rejected).toEqual([]);
  });

  it('forgives the formatting a model changes without asking', () => {
    // Re-wrapped lines, an ASCII hyphen for the maqaf, straight quotes for
    // curly ones. None of these is a change to what the sentence says.
    const source = 'הצוות עמד בכל היעדים\nוזמן האספקה ירד ב־40 אחוז, כלשונו של הלקוח: “סוף סוף”.';
    const echo = 'הצוות עמד בכל היעדים וזמן האספקה ירד ב-40 אחוז, כלשונו של הלקוח: "סוף סוף".';
    const { spans } = acceptSpans(source, [echo]);
    expect(spans).toHaveLength(1);
    // What comes back is the source's characters, not the model's.
    expect(spans[0]).toContain('ב־40');
    expect(spans[0]).toContain('“סוף סוף”');
  });

  it('locates a passage whose niqqud the model dropped', () => {
    const source = 'הַצוות סיים אַרבעה רבעונים ברציפות בזמן, וזה החזיק שנה שלמה.';
    const { spans } = acceptSpans(source, [
      'הצוות סיים ארבעה רבעונים ברציפות בזמן, וזה החזיק שנה שלמה.',
    ]);
    expect(spans).toEqual([source]);
  });

  it('rejects a paraphrase', () => {
    const { spans, rejected } = acceptSpans(EMAIL, [
      'הלקוחה סיפרה שזמן האספקה ירד משמעותית אחרי השינוי.',
    ]);
    expect(spans).toEqual([]);
    expect(rejected[0].reason).toBe('not-found');
  });

  it('rejects an invented number inside an otherwise real sentence', () => {
    const { spans, rejected } = acceptSpans(EMAIL, [
      'מאז השינוי שהובלת סיימנו ארבעה רבעונים ברציפות בזמן, וזמן האספקה ירד ב־70 אחוז.',
    ]);
    expect(spans).toEqual([]);
    expect(rejected[0].reason).toBe('not-found');
  });

  it('rejects a claim stitched from two passages that are not adjacent', () => {
    const { spans } = acceptSpans(EMAIL, [
      'לפני שהתחלנו העבודה איתך היינו מפספסים כל דדליין שני. תודה רבה,',
    ]);
    expect(spans).toEqual([]);
  });

  it('accepts a span running across several sentences — the case splitting cannot see', () => {
    const { spans } = acceptSpans(CV, [
      'Deadlines had slipped for six months. After the restructure the team shipped on time for four consecutive quarters.',
    ]);
    expect(spans).toHaveLength(1);
    expect(spans[0]).toMatch(/^Deadlines had slipped.*consecutive quarters\.$/u);
  });

  it('strips a leading bullet and never adds a character', () => {
    const { spans } = acceptSpans(CV, ['- Led the migration of 12 services to a new platform.']);
    expect(spans).toEqual(['Led the migration of 12 services to a new platform.']);
  });

  it('rejects a passage the model shortened into something the document does not say', () => {
    // "12 services" is true; "12 services." as a complete claim is not what the
    // document says, and a truncation is as much an edit as an addition.
    const { rejected } = acceptSpans(CV, ['- Led the migration of 12 services.']);
    expect(rejected[0].reason).toBe('not-found');
  });

  it('drops fragments, sections, and contact furniture', () => {
    const header = 'רונית כהן | תל אביב | 050-1234567 | ronit@example.com';
    const source = ['קצר מדי.', header, 'א'.repeat(700)].join('\n');
    const { rejected } = acceptSpans(source, ['קצר מדי.', header, 'א'.repeat(700)]);
    expect(rejected.map((r) => r.reason)).toEqual(['too-short', 'furniture', 'too-long']);
  });

  it('keeps a claim that merely contains an address, because deleting it is the worse default', () => {
    const source = 'הגדלנו את הרשימה ל-40,000 נרשמים דרך הטופס בכתובת support@acme.co.il בשנה אחת.';
    expect(acceptSpans(source, [source]).spans).toEqual([source]);
  });

  it('rejects a span already covered by an accepted one', () => {
    const { spans, rejected } = acceptSpans(CV, [
      'Deadlines had slipped for six months. After the restructure the team shipped on time for four consecutive quarters.',
      'After the restructure the team shipped on time for four consecutive quarters.',
    ]);
    expect(spans).toHaveLength(1);
    expect(rejected[0].reason).toBe('overlap');
  });

  it('returns spans in source order, whatever order the model used', () => {
    const { spans } = acceptSpans(EMAIL, [
      'מאז השינוי שהובלת סיימנו ארבעה רבעונים ברציפות בזמן, וזמן האספקה ירד ב־40 אחוז.',
      'לפני שהתחלנו העבודה איתך היינו מפספסים כל דדליין שני.',
    ]);
    expect(spans[0]).toMatch(/^לפני שהתחלנו/u);
  });

  it('caps the number of accepted spans', () => {
    const sentences = Array.from(
      { length: MAX_SPANS + 5 },
      (_, i) => `Sentence number ${i} describing an outcome that happened in the year 2024.`,
    );
    const { spans, rejected } = acceptSpans(sentences.join('\n'), sentences);
    expect(spans).toHaveLength(MAX_SPANS);
    expect(rejected.every((r) => r.reason === 'over-limit')).toBe(true);
  });

  it('survives hostile input without throwing', () => {
    expect(acceptSpans(EMAIL, [null, 42, '', {}, []]).spans).toEqual([]);
    expect(acceptSpans('', ['anything']).spans).toEqual([]);
    expect(acceptSpans(EMAIL, 'not an array').spans).toEqual([]);
    expect(locateVerbatim(null, 'x')).toBeNull();
  });

  it('maps folded offsets back to the original string exactly', () => {
    const source = 'א  ב\nג';
    const { folded, start, end } = foldWithOffsets(source);
    expect(folded).toBe('א ב ג');
    for (let i = 0; i < folded.length; i += 1) {
      if (folded[i] === ' ') continue;
      expect(source.slice(start[i], end[i])).toBe(folded[i]);
    }
  });
});

describe('mining with extracted spans', () => {
  const state = () =>
    stateWith({
      sources: [
        minedSource({
          id: 's1',
          text: EMAIL,
          minedAt: null,
          extracted: [
            'מאז השינוי שהובלת סיימנו ארבעה רבעונים ברציפות בזמן, וזמן האספקה ירד ב־40 אחוז.',
          ],
        }),
      ],
    });

  it('uses the spans instead of sentence splitting, and says which pass found them', () => {
    const proofs = mineSources(state(), { now: NOW });
    expect(proofs).toHaveLength(1);
    expect(proofs[0].claim).toMatch(/ארבעה רבעונים/u);
    expect(proofs[0].via).toBe('model');
  });

  it('re-verifies stored spans on every pass, so an edited backup cannot inject a claim', () => {
    const tampered = state();
    tampered.sources[0].extracted = ['ניהלתי תקציב של 40 מיליון שקל בשלוש יבשות.'];
    const proofs = mineSources(tampered, { now: NOW });
    // The fabricated span is gone, and the deterministic split ran instead.
    expect(proofs.some((p) => p.claim.includes('40 מיליון'))).toBe(false);
    expect(proofs.every((p) => p.via === 'split')).toBe(true);
    expect(proofs.length).toBeGreaterThan(0);
  });

  it('falls back to splitting rather than losing the source entirely', () => {
    const stale = state();
    // The user replaced the text after extracting from it.
    stale.sources[0].text = `${EMAIL}\nוגם הכנסנו תהליך בדיקה חדש שקיצר את זמן התגובה בחצי.`;
    stale.sources[0].extracted = ['משפט שאיננו במסמך הזה בכלל, ולכן ייפסל בשער.'];
    expect(mineSources(stale, { now: NOW }).length).toBeGreaterThan(0);
  });

  it('keeps the user’s curation when the same claim comes back through the model', () => {
    const claim = 'מאז השינוי שהובלת סיימנו ארבעה רבעונים ברציפות בזמן, וזמן האספקה ירד ב־40 אחוז.';
    const withDecision = state();
    withDecision.proofs = [
      { ...mineSources(state(), { now: NOW })[0], claim, pinned: true, createdAt: NOW - 1000 },
    ];
    const proofs = mineSources(withDecision, { now: NOW });
    const same = proofs.find((p) => p.claim === claim);
    expect(same.pinned).toBe(true);
    expect(same.createdAt).toBe(NOW - 1000);
  });
});

describe('state shape', () => {
  it('coerces stored spans and caps them', () => {
    const state = normalizeState({
      sources: [
        { id: 's1', name: 'cv', text: EMAIL, extracted: [null, 7, '  ', 'ok span', ...Array(60).fill('x')] },
      ],
    });
    expect(state.sources[0].extracted).toHaveLength(40);
    expect(state.sources[0].extracted[0]).toBe('ok span');
  });

  it('defaults extraction off, and never lets it stand without the parent consent', () => {
    expect(normalizeState({}).settings.llm.extract).toBe(false);
    const forged = normalizeState({ settings: { llm: { enabled: false, extract: true } } });
    expect(forged.settings.llm.extract).toBe(false);
  });
});

describe('the adapter', () => {
  afterEach(() => vi.unstubAllGlobals());

  const settings = { llm: { enabled: true, extract: true, apiKey: 'k', provider: 'anthropic', model: '' } };
  const reply = (text) =>
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({ content: [{ type: 'text', text }] }) })),
    );

  it('requires its own consent, not the rewriter’s', () => {
    expect(isExtractionConfigured(settings)).toBe(true);
    expect(isExtractionConfigured({ llm: { ...settings.llm, extract: false } })).toBe(false);
    expect(isExtractionConfigured({ llm: { ...settings.llm, enabled: false } })).toBe(false);
  });

  it('does not call the provider when extraction is off', async () => {
    const spy = vi.fn();
    vi.stubGlobal('fetch', spy);
    const result = await extractClaims({
      settings: { llm: { ...settings.llm, extract: false } },
      source: { text: EMAIL },
    });
    expect(result).toEqual({ ok: false, reason: 'not-configured' });
    expect(spy).not.toHaveBeenCalled();
  });

  it('returns the document’s own characters and reports what it threw away', async () => {
    reply(
      JSON.stringify({
        spans: [
          // Real, with the formatting a model changes.
          'מאז השינוי שהובלת סיימנו ארבעה רבעונים ברציפות בזמן, וזמן האספקה ירד ב-40 אחוז.',
          // Invented.
          'הובלתי צוות של 30 אנשים בשלוש מדינות.',
        ],
      }),
    );
    const result = await extractClaims({ settings, source: { text: EMAIL } });
    expect(result.ok).toBe(true);
    expect(result.returned).toBe(2);
    expect(result.spans).toHaveLength(1);
    expect(EMAIL).toContain(result.spans[0]);
    expect(result.rejected).toEqual([
      { text: 'הובלתי צוות של 30 אנשים בשלוש מדינות.', reason: 'not-found' },
    ]);
  });

  it('tolerates a fenced or prefaced completion', async () => {
    reply('```json\n{"spans": ["לפני שהתחלנו העבודה איתך היינו מפספסים כל דדליין שני."]}\n```');
    const result = await extractClaims({ settings, source: { text: EMAIL } });
    expect(result.spans).toHaveLength(1);
  });

  it('fails cleanly on a completion it cannot parse', async () => {
    reply('I found several achievements in this document!');
    expect((await extractClaims({ settings, source: { text: EMAIL } })).reason).toBe('bad-response');
  });

  it('reports truncation rather than silently reading part of a document', async () => {
    const long = `${'א'.repeat(25_000)}\n${EMAIL}`;
    reply(JSON.stringify({ spans: ['לפני שהתחלנו העבודה איתך היינו מפספסים כל דדליין שני.'] }));
    const result = await extractClaims({ settings, source: { text: long } });
    expect(result.truncated).toBe(true);
    // Gated against the whole document, so a passage from beyond the cut is
    // still the user's own text and is still accepted.
    expect(result.spans).toHaveLength(1);
  });

  it('surfaces a transport failure without touching state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      }),
    );
    expect((await extractClaims({ settings, source: { text: EMAIL } })).reason).toBe('network');
  });
});

import { describe, expect, it } from 'vitest';
import {
  containment,
  contextRelevance,
  detectLanguage,
  normalizeHebrew,
  similarity,
  splitSentences,
  stripHebrewPrefix,
  tokenSet,
  tokenVariants,
  tokenize,
} from '../../src/engine/text.js';

describe('detectLanguage', () => {
  it('detects Hebrew and English by dominant script', () => {
    expect(detectLanguage('שלום עולם')).toBe('he');
    expect(detectLanguage('hello world')).toBe('en');
  });

  it('picks the dominant script in mixed text', () => {
    expect(detectLanguage('הרצתי POC על AWS מול שלושה לקוחות גדולים')).toBe('he');
    expect(detectLanguage('We ran a POC with שלושה clients')).toBe('en');
  });

  it('defaults to Hebrew for empty or symbol-only input', () => {
    expect(detectLanguage('')).toBe('he');
    expect(detectLanguage('--- 123 ---')).toBe('he');
  });
});

describe('Hebrew normalisation', () => {
  it('normalises final letters so inflections match', () => {
    expect(normalizeHebrew('מלך')).toBe('מלכ');
    expect(normalizeHebrew('שלום')).toBe('שלומ');
  });

  it('strips niqqud', () => {
    expect(normalizeHebrew('שָׁלוֹם')).toBe('שלומ');
  });

  it('strips syntactic prefixes only when a stem survives', () => {
    expect(stripHebrewPrefix('ללקוחות')).toBe('לקוחות');
    expect(stripHebrewPrefix('בכתבה')).toBe('כתבה');
    // Too short to strip safely.
    expect(stripHebrewPrefix('ליד')).toBe('ליד');
  });
});

describe('tokenize', () => {
  it('drops Hebrew and English stopwords', () => {
    const tokens = tokenize('אני עובד עם לקוחות של חברות גדולות');
    expect(tokens).not.toContain('אני');
    expect(tokens).not.toContain('של');
    expect(tokens).toContain('לקוחות');
  });

  it('keeps numbers as tokens', () => {
    expect(tokenize('גדל ב-38 אחוז')).toContain('38');
  });

  it('never mangles a content word that merely starts with a prefix letter', () => {
    // לקוחות ("clients") begins with the same ל that marks the dative prefix.
    expect(tokenize('עבדתי עם לקוחות')).toContain('לקוחות');
  });

  it('matches prefixed and bare forms through the variant set', () => {
    const a = tokenSet('עבדתי עם לקוחות');
    const b = tokenSet('ללקוחות שלי');
    expect([...a].some((token) => b.has(token))).toBe(true);
  });

  it('keeps both the original and the stripped form as variants', () => {
    expect(tokenVariants('ללקוחות')).toEqual(['ללקוחות', 'לקוחות']);
    expect(tokenVariants('client')).toEqual(['client']);
  });
});

describe('similarity and containment', () => {
  it('is symmetric for Dice similarity', () => {
    const a = 'הכנסות הלקוח גדלו בעקבות שינוי תהליך המכירה';
    const b = 'שינוי תהליך המכירה הגדיל את הכנסות הלקוח';
    expect(similarity(a, b)).toBeCloseTo(similarity(b, a), 10);
  });

  it('does not report a superset as identical, unlike raw min-overlap', () => {
    const short = 'העברתי הרצאה';
    const long =
      'העברתי הרצאה על הנדסת פרומפטים מול שמונים מנהלים בכנס מקצועי, ואחריה נסגרו שתי עסקאות חדשות עם ארגונים גדולים';
    // Containment is high (the short claim is inside the long one)...
    expect(containment(short, long)).toBeGreaterThan(0.9);
    // ...but similarity correctly says these are not the same claim.
    expect(similarity(short, long)).toBeLessThan(0.5);
  });

  it('returns 0 for empty input', () => {
    expect(similarity('', 'משהו')).toBe(0);
    expect(containment('', 'משהו')).toBe(0);
    expect(contextRelevance('משהו', '')).toBe(0);
  });
});

describe('splitSentences', () => {
  it('splits on terminators and newlines', () => {
    const text =
      'ליוויתי בעל עסק שלא ייצר הכנסה במשך ארבעה חודשים. בתוך חודש נסגרו עסקאות בהיקף משמעותי.\nהתראיינתי לכתבה מקצועית על בינה מלאכותית בעסקים.';
    expect(splitSentences(text)).toHaveLength(3);
  });

  it('handles bullet lists and strips list markers', () => {
    const text = '• ניהלתי צוות של שנים עשר אנשים במשך שלוש שנים\n- הקמתי מערך תמיכה מאפס עבור אלפי משתמשים';
    const parts = splitSentences(text);
    expect(parts).toHaveLength(2);
    expect(parts[0].startsWith('•')).toBe(false);
    expect(parts[1].startsWith('-')).toBe(false);
  });

  it('drops fragments below the minimum length', () => {
    expect(splitSentences('2019. כן. לא.')).toHaveLength(0);
  });
});

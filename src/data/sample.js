/**
 * Sample material for users who arrive with nothing ready.
 *
 * Every line carries the demo marker in the text itself, not only in metadata,
 * so a demo claim that is copied out of the app still announces what it is.
 * Demo proof is excluded from the Authority Index, from gap coverage and from
 * calibration — the score a user sees must never be inflated by our fixtures.
 */

export const SAMPLE_SOURCES = {
  he: {
    name: 'דוגמה — חומרים של יועץ עצמאי',
    text: [
      '[דמו בלבד] ליוויתי בעל עסק שבמשך ארבעה חודשים לא ייצר הכנסה חדשה, ובתוך חודש מתחילת העבודה נסגרו עסקאות בהיקף 5,500 ש״ח.',
      '[דמו בלבד] באותו תהליך, בשלושת החודשים שאחרי, נסגרו עשר עסקאות נוספות בהיקף כולל של 27,000 ש״ח.',
      '[דמו בלבד] התראיינתי לכתבה מקצועית בנושא שימוש בבינה מלאכותית בעסקים קטנים, שפורסמה ב-2025.',
      '[דמו בלבד] העברתי הרצאה על הנדסת פרומפטים מול כ-80 מנהלים ובעלי עסקים בכנס מקצועי.',
      '[דמו בלבד] פיתחתי תהליך בן חמישה שלבים למעבר ממומחיות מקצועית להצעה שאפשר למכור, ואני מיישם אותו זהה בכל ליווי.',
      '[דמו בלבד] סיימתי תואר בעבודה סוציאלית בציון ממוצע 93.24.',
      '[דמו בלבד] בשנה הראשונה כעצמאי ניסיתי למכור ליווי כללי לכל מי שפנה, ואיבדתי בערך שמונה חודשים עד שהבנתי שזו הטעות.',
      '[דמו בלבד] אני אדם יצירתי, סקרן ואסטרטגי מאוד, עם שנים של ניסיון בליווי אנשים ותהליכים.',
    ].join('\n'),
  },
  en: {
    name: 'Sample — independent consultant material',
    text: [
      '[demo only] I worked with a business owner who had produced no new revenue for four months; within one month of starting, deals worth $1,500 closed.',
      '[demo only] Over the following three months, ten further deals closed for a combined $7,300.',
      '[demo only] I was interviewed for a trade article on using AI in small businesses, published in 2025.',
      '[demo only] I gave a talk on prompt engineering to roughly 80 managers and business owners at an industry conference.',
      '[demo only] I built a five-step process for turning professional expertise into a sellable offer, and I apply it identically in every engagement.',
      '[demo only] I completed a degree in social work with a 93.24 average.',
      '[demo only] In my first year independent I tried to sell general consulting to anyone who asked, and lost about eight months before I understood that was the mistake.',
      '[demo only] I am a creative, curious and highly strategic person with years of experience guiding people and processes.',
    ].join('\n'),
  },
};

/**
 * The last sample line is deliberately the generic self-description that this
 * ICP writes by default. It should rank near the bottom, and seeing that
 * happen on the sample is the fastest way to explain what the tool measures.
 */
export const sampleFor = (locale) => SAMPLE_SOURCES[locale] || SAMPLE_SOURCES.he;

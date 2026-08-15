const WEIGHTS = {
  evidence: 35,
  fit: 35,
  proximity: 20,
  freshness: 10,
};

const state = JSON.parse(localStorage.getItem('proofminer-v2') || 'null') || {
  context: {
    audience: 'בעלי עסקים קטנים ויועצים שכבר משתמשים ב-AI אבל עדיין לא רואים תוצאה עסקית ברורה',
    belief: 'שיש לי דרך מוכחת לזהות איפה נמצא המינוף העסקי הגבוה ביותר',
    doubt: 'שזה עוד ייעוץ כללי או עוד דיבור על AI בלי תוצאה',
    offer: 'תהליך ייעוץ עסקי ממוקד מינוף ותוצאה',
  },
  sources: [],
  proofs: [],
  tab: 'paste',
  selected: null,
  angle: 'lesson',
  cta: 'none',
  dismissed: [],
  pinned: [],
};

const save = () => localStorage.setItem('proofminer-v2', JSON.stringify(state));
const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
const clamp = n => Math.max(0, Math.min(100, Math.round(n)));
const words = t => String(t).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(x => x.length > 2);
const overlap = (a,b) => {
  const A = new Set(words(a)), B = new Set(words(b));
  if (!A.size || !B.size) return 0;
  let n = 0; A.forEach(x => B.has(x) && n++);
  return n / Math.min(A.size, B.size);
};

const SAMPLE = `ליוויתי בעל עסק שבמשך ארבעה חודשים לא ייצר הכנסה חדשה. בתוך חודש מהעבודה המשותפת נסגרו עסקאות בהיקף 5,500 ש״ח, ובהמשך 27,000 ש״ח מעשר עסקאות.
התראיינתי בכתבה מקצועית על שימוש ב-AI בעסקים קטנים.
העברתי הרצאה על הנדסת פרומפטים לקהל של מנהלים ובעלי עסקים.
סיימתי תואר בעבודה סוציאלית בציון ממוצע 93.24.
לקוחה כתבה אחרי תהליך העבודה: "סוף סוף הצלחתי לראות מה באמת מעכב את העסק ולא רק מה מרגיש דחוף".
יש לי שנים של ניסיון בליווי אנשים ותהליכים.
אני יצירתי, סקרן ואסטרטגי מאוד.`;

const DEMO_WEB = `[דמו בלבד] אתר כנס מציג הרצאה בנושא AI ועסקים בפני כ-80 משתתפים.
[דמו בלבד] כתבה חיצונית מצטטת תוצאה של לקוח שהגדיל הכנסות לאחר שינוי בתהליך המכירה.
[דמו בלבד] עמוד מקצועי מתאר חיבור בין עבודה סוציאלית, אסטרטגיה ובינה מלאכותית.`;

function signalType(text) {
  const x = text.toLowerCase();
  if (/לקוח|לקוחה|הכנס|הכנסות|מכירות|עסקאות|חסך|הפחית|הגדיל|נסגר/.test(x)) return 'תוצאה בשטח';
  if (/כתבה|ראיון|עיתון|ציטט|המלצ|אמרה|כתב|כתבה חיצונית/.test(x)) return 'אימות חיצוני';
  if (/הרצא|כנס|וובינר|פאנל/.test(x)) return 'במה מקצועית';
  if (/מחקר|מאמר|פרסם|פרסום/.test(x)) return 'יצירה מקצועית';
  if (/תואר|ציון|הסמכ|פרס/.test(x)) return 'הסמכה';
  return 'ניסיון / טענה';
}

function beliefMoved(text) {
  const x = text.toLowerCase();
  if (/הכנס|הכנסות|מכירות|עסקאות|חסך|הפחית|הגדיל|נסגר|בתוך חודש/.test(x)) return '“זה עובד בפועל, לא רק נשמע טוב.”';
  if (/לקוח|לקוחה|המלצ|כתבה|ראיון|ציטט/.test(x)) return '“לא רק הוא אומר שהוא טוב — אחרים ראו ערך.”';
  if (/הרצא|כנס|וובינר|מחקר|מאמר/.test(x)) return '“יש כאן מומחיות שמחזיקה גם מול קהל מקצועי.”';
  if (/תואר|הסמכ|פרס|ציון/.test(x)) return '“יש כאן בסיס מקצועי ואמינות.”';
  return '“יש כאן ניסיון, אבל עדיין חסרה הוכחה חזקה.”';
}

function evidenceScore(text, sourceName='') {
  const x = text.toLowerCase();
  const nums = (text.match(/\d[\d,.]*/g) || []).length;
  const thirdParty = /כתבה|ראיון|עיתון|לקוח|לקוחה|המלצ|ציטט|אתר כנס|עמוד כנס/.test(x) || /חיפוש|כתבה|המלצה|לקוח/.test(sourceName.toLowerCase());
  const outcome = /הכנס|הכנסות|מכירות|עסקאות|חסך|הפחית|הגדיל|נסגר|תוצאה|בתוך חודש|לפני|אחרי/.test(x);
  const attribution = /לקוח|לקוחה|חברה|ארגון|כנס|כתבה|עיתון|אתר/.test(x);
  const vague = /יצירתי|סקרן|מקצועי מאוד|אסטרטגי מאוד|שנים של ניסיון/.test(x) && !nums;
  return clamp(25 + nums * 12 + (thirdParty ? 22 : 0) + (outcome ? 20 : 0) + (attribution ? 10 : 0) - (vague ? 28 : 0));
}

function fitScore(text) {
  const ctx = `${state.context.audience} ${state.context.belief} ${state.context.doubt} ${state.context.offer}`;
  const lexical = overlap(text, ctx);
  const x = text.toLowerCase();
  let structural = 0;
  if (/עסק|לקוח|מכירות|הכנס|הכנסות|ai|בינה מלאכותית|ייעוץ|תהליך/.test(x)) structural += 18;
  if (/תוצאה|שינוי|בתוך|אחרי|לפני|הגדיל|הפחית|נסגר/.test(x)) structural += 16;
  return clamp(35 + lexical * 55 + structural);
}

function proximityScore(text) {
  const x = text.toLowerCase();
  const offerFit = overlap(text, state.context.offer);
  const buyerOutcome = /לקוח|עסק|הכנס|הכנסות|מכירות|תוצאה|חסך|הפחית|הגדיל|נסגר/.test(x);
  const statusOnly = /תואר|ציון|פרס/.test(x) && !buyerOutcome;
  return clamp(30 + offerFit * 45 + (buyerOutcome ? 30 : 0) - (statusOnly ? 18 : 0));
}

function freshnessScore(text) {
  const x = text.toLowerCase();
  if (/2026|השנה|החודש|לאחרונה|בתוך חודש/.test(x)) return 88;
  if (/2025/.test(x)) return 72;
  return 55;
}

function confidenceScore(text, sourceName='') {
  const x = text.toLowerCase();
  const nums = (text.match(/\d[\d,.]*/g) || []).length;
  const demo = /דמו בלבד/.test(x);
  const sourceKnown = sourceName && !/^טקסט \d+/.test(sourceName);
  const attribution = /לקוח|לקוחה|כתבה|ראיון|כנס|חברה|ארגון|עיתון/.test(x);
  return clamp(35 + nums * 10 + (sourceKnown ? 15 : 0) + (attribution ? 15 : 0) - (demo ? 25 : 0));
}

function evaluate(text, source) {
  const evidence = evidenceScore(text, source);
  const fit = fitScore(text);
  const proximity = proximityScore(text);
  const freshness = freshnessScore(text);
  const priority = clamp(
    evidence * WEIGHTS.evidence / 100 +
    fit * WEIGHTS.fit / 100 +
    proximity * WEIGHTS.proximity / 100 +
    freshness * WEIGHTS.freshness / 100
  );
  return { evidence, fit, proximity, freshness, priority, confidence: confidenceScore(text, source) };
}

function strengthen(text, metrics) {
  const x = text.toLowerCase();
  if (metrics.confidence < 55) return 'צרף מקור ברור: שם לקוח, קישור, ציטוט, מסמך או הקשר שניתן לבדוק.';
  if (metrics.evidence < 65) return 'הפוך את הטענה לעקבה: הוסף מספר, לפני/אחרי, מסגרת זמן או תוצאה שנוצרה.';
  if (metrics.fit < 65) return 'הסבר במשפט אחד למה ההוכחה הזו חשובה דווקא לקהל שבחרת.';
  if (metrics.proximity < 60) return 'חבר את ההוכחה ישירות לבעיה שאתה פותר או לתוצאה שאתה מוכר.';
  if (!/למד|מכאן|המשמעות|זה אומר|גיליתי/.test(x)) return 'כדי להפוך את זה לתוכן שימושי, הוסף את הלקח המקצועי שהקורא יכול לקחת לעצמו.';
  return 'ההוכחה כבר חזקה. עכשיו חשוב לא להעמיס עליה — בחר מסר אחד והפץ.';
}

function whyNow(proof) {
  const { evidence, fit, proximity } = proof.metrics;
  if (fit >= 78 && evidence >= 72) return 'גם אמינה וגם פוגעת קרוב לספק של הקהל — זו ההוכחה שהייתי מוציא ראשונה.';
  if (evidence >= 82 && fit < 68) return 'חזקה מאוד כהוכחה, אבל לפני פרסום צריך לחבר אותה מפורשות לבעיה של הקהל.';
  if (fit >= 80 && evidence < 65) return 'רלוונטית מאוד לקהל, אבל כרגע היא נשענת יותר על טענה מאשר על ראיה.';
  if (proximity >= 78) return 'קרובה מאוד להצעה שלך ולכן יכולה לקצר את הדרך משיחה מקצועית לשיחה עסקית.';
  return 'שימושית, אבל יש במאגר הוכחות שיכולות לשנות תפיסה מהר יותר.';
}

function mine() {
  const chunks = state.sources.flatMap(source =>
    source.text
      .split(/(?<=[.!?])\s+|\n+/)
      .map(text => ({ text: text.trim(), source: source.name }))
  ).filter(x => x.text.length > 24);

  const candidates = chunks.map((x, i) => ({
    id: `p-${Date.now()}-${i}`,
    claim: x.text,
    source: x.source,
    type: signalType(x.text),
    belief: beliefMoved(x.text),
    metrics: evaluate(x.text, x.source),
  })).sort((a,b) => b.metrics.priority - a.metrics.priority);

  const dedup = [];
  for (const p of candidates) {
    if (!dedup.some(d => overlap(d.claim, p.claim) > .72)) dedup.push(p);
  }
  state.proofs = dedup.slice(0, 30);
  save();
  render();
}

function addSource(name, text) {
  if (!String(text).trim()) return;
  state.sources.push({ id: crypto.randomUUID(), name, text: String(text).trim() });
  save(); render();
}

function activeProofs() {
  return state.proofs
    .filter(p => !state.dismissed.includes(p.id))
    .sort((a,b) => (state.pinned.includes(b.id) - state.pinned.includes(a.id)) || (b.metrics.priority - a.metrics.priority));
}

function topInsight() {
  const proofs = activeProofs();
  if (!proofs.length) return null;
  const best = proofs[0];
  const weakEvidence = proofs.filter(p => p.metrics.evidence < 60).length;
  const weakFit = proofs.filter(p => p.metrics.fit < 60).length;
  const external = proofs.filter(p => /אימות חיצוני|תוצאה בשטח/.test(p.type)).length;
  let gap = 'המאגר מגוון יחסית.';
  if (weakEvidence > proofs.length / 2) gap = 'יש הרבה טענות, אבל מעט עקבות שניתן לבדוק.';
  else if (weakFit > proofs.length / 2) gap = 'יש הוכחות, אבל הן עדיין לא מחוברות מספיק לספק של הקונה.';
  else if (external < 2) gap = 'חסר יותר קול חיצוני: לקוחות, מקורות, ציטוטים או תוצאות מתועדות.';
  return { best, gap };
}

function ctaText() {
  return {
    none: '',
    discuss: '\n\nמעניין אותי לשמוע — איזה סוג הוכחה גורם לכם לסמוך על איש מקצוע?',
    dm: '\n\nאם אתם מתלבטים איפה נמצא המינוף אצלכם, אפשר לכתוב לי בפרטי.',
    call: '\n\nאם אתם רוצים לבדוק את זה על העסק שלכם, אפשר לקבוע שיחה קצרה.'
  }[state.cta] || '';
}

function postFor(proof, angle) {
  const raw = proof.claim.replace(/^\[דמו בלבד\]\s*/,'');
  const lesson = proof.type === 'תוצאה בשטח'
    ? 'החלק המעניין הוא לא המספר עצמו, אלא מה היה צריך להשתנות כדי שהתוצאה תקרה.'
    : proof.type === 'אימות חיצוני'
      ? 'אימות חיצוני חשוב רק כשהוא עוזר לקורא להבין משהו שימושי על העבודה עצמה.'
      : 'מומחיות הופכת למעניינת כשאפשר לחבר אותה להחלטה אמיתית של מישהו אחר.';
  const cta = ctaText();

  if (angle === 'result') {
    return `${raw}\n\nאני משתף את זה לא כדי להגיד “תראו מה עשיתי”, אלא כי זו הוכחה לדבר שמעסיק אותי מקצועית: ${state.context.belief}.\n\n${lesson}${cta}`;
  }
  if (angle === 'story') {
    return `לפעמים אנחנו מחפשים רעיון לפוסט, בזמן שהחומר הכי טוב כבר קרה במציאות.\n\n${raw}\n\n${lesson}\n\nמבחינתי, זו הנקודה שהאירוע הזה מוכיח: ${state.context.belief}.${cta}`;
  }
  return `${raw}\n\nמה אפשר ללמוד מזה מעבר לסיפור עצמו?\n\n${lesson}\n\nכשאני בוחן עבודה מקצועית, אני מחפש פחות הצהרות ויותר עקבות: מה השתנה, עבור מי, ובאיזה הקשר.\n\nזה בדיוק סוג ההוכחה שיכול לצמצם את הספק: ${state.context.doubt}.${cta}`;
}

function scoreBand(n) {
  if (n >= 78) return { label: 'להוציא עכשיו', cls: 'strong' };
  if (n >= 64) return { label: 'שווה לחזק', cls: 'medium' };
  return { label: 'לא עכשיו', cls: 'weak' };
}

function renderContext() {
  const fields = [
    ['audience','למי אתה רוצה להיראות רלוונטי עכשיו?','למשל: מנהלות HR בחברות של 50–300 עובדים'],
    ['belief','מה אתה רוצה שהם יבינו עליך?','למשל: שאני יודע להפוך בעיה עמומה לתהליך שמייצר תוצאה'],
    ['doubt','איזה ספק אתה רוצה להקטין?','למשל: שזה נשמע טוב אבל לא יעבוד אצלנו'],
    ['offer','מה אתה מוכר כרגע?','למשל: תהליך ייעוץ של 30 יום'],
  ];
  return fields.map(([key,label,ph]) => `
    <label class="field">
      <span>${label}</span>
      <input data-context="${key}" value="${esc(state.context[key])}" placeholder="${esc(ph)}" />
    </label>`).join('');
}

function renderSourcePanel() {
  return `
    <section class="source-panel">
      <div class="step-label">01 · כוון את ההוכחה</div>
      <h2>מה אתה רוצה שהקונה יאמין?</h2>
      <p class="muted">המערכת לא מחפשת את הדבר הכי מרשים שעשית. היא מחפשת מה הכי יעזור מול הקונה הזה, עכשיו.</p>
      <div class="context-fields">${renderContext()}</div>
      <div class="divider"></div>
      <div class="step-label">02 · תן לה חומר שכבר קיים</div>
      <div class="tabs">
        <button data-tab="paste" class="tab ${state.tab==='paste'?'active':''}">הדבק טקסט</button>
        <button data-tab="file" class="tab ${state.tab==='file'?'active':''}">קובץ</button>
        <button data-tab="web" class="tab ${state.tab==='web'?'active':''}">אינטרנט</button>
      </div>
      ${state.tab === 'paste' ? `
        <textarea id="paste" class="source-text" placeholder="כתבה, המלצה, קורות חיים, תמלול, case study, מאמר..."></textarea>
        <div class="button-row"><button id="addText" class="primary">הוסף למאגר</button><button id="sample" class="secondary">טען דוגמה</button></div>` : ''}
      ${state.tab === 'file' ? `
        <label class="upload-box"><input id="file" type="file" accept=".txt,.md" multiple><b>בחר TXT או MD</b><span>הקבצים נקראים מקומית בדפדפן</span></label>` : ''}
      ${state.tab === 'web' ? `
        <div class="web-box"><b>חיפוש חי עדיין לא מחובר.</b><span>אנחנו לא מציגים תוצאה מדומה כאילו היא אמיתית.</span><button id="demoWeb" class="secondary">נסה עם תוצאות דמו</button></div>` : ''}
      <div class="source-count">${state.sources.length ? `${state.sources.length} מקורות מחכים לניתוח` : 'עדיין לא הוספת מקור'}</div>
      <button id="mine" class="primary analyze" ${state.sources.length ? '' : 'disabled'}>מצא מה הכי שווה להראות עכשיו</button>
    </section>`;
}

function proofMini(proof, rank) {
  const band = scoreBand(proof.metrics.priority);
  return `
    <article class="mini-proof">
      <div class="mini-top"><span class="rank">#${rank}</span><span class="band ${band.cls}">${band.label}</span></div>
      <h4>${esc(proof.claim)}</h4>
      <p>${esc(proof.belief)}</p>
      <button class="text-button" data-select="${proof.id}">למה דווקא זה? →</button>
    </article>`;
}

function renderBest(proof) {
  const band = scoreBand(proof.metrics.priority);
  return `
    <section class="best-card">
      <div class="best-copy">
        <div class="step-label">03 · ההוכחה שהייתי מוציא ראשונה</div>
        <div class="best-title-row"><h2>${esc(proof.type)}</h2><span class="band ${band.cls}">${band.label}</span></div>
        <blockquote>${esc(proof.claim)}</blockquote>
        <div class="belief-box"><span>מה זה יכול לגרום לקונה להבין</span><b>${esc(proof.belief)}</b></div>
        <p class="why">${esc(whyNow(proof))}</p>
        <div class="button-row"><button data-post="${proof.id}" class="primary">הפוך את זה לפוסט</button><button data-select="${proof.id}" class="secondary">פתח את הראיות</button></div>
      </div>
      <div class="best-signal">
        <span>עדיפות</span><strong>${proof.metrics.priority}</strong><small>לא “ציון אמת” — אות להשוואה</small>
        <div class="confidence"><span>ביטחון בראיה</span><b>${proof.metrics.confidence}%</b></div>
      </div>
    </section>`;
}

function renderEvidenceDrawer(proof) {
  if (!proof) return '';
  const metrics = [
    ['עוצמת הראיה', proof.metrics.evidence, 'עד כמה אפשר לבדוק את זה מבחוץ'],
    ['התאמה לקונה', proof.metrics.fit, 'עד כמה זה נוגע לספק שהגדרת'],
    ['קרבה למה שאתה מוכר', proof.metrics.proximity, 'עד כמה זה מוכיח את התוצאה הרלוונטית'],
    ['עדכניות', proof.metrics.freshness, 'עד כמה הזמן מחזק או מחליש את השימוש עכשיו'],
  ];
  return `
    <div class="drawer-backdrop" data-close-drawer>
      <aside class="drawer" onclick="event.stopPropagation()">
        <button class="close" data-close-drawer>×</button>
        <div class="step-label">למה המערכת בחרה בזה?</div>
        <h3>${esc(proof.claim)}</h3>
        <p class="source-line">מקור: ${esc(proof.source)}</p>
        <div class="metric-list">${metrics.map(([name,val,desc]) => `
          <div class="metric-row"><div><b>${name}</b><span>${desc}</span></div><div class="meter"><i style="width:${val}%"></i></div><strong>${val}</strong></div>`).join('')}</div>
        <div class="strengthen"><span>מה חסר כדי שזה יהיה משכנע יותר?</span><b>${esc(strengthen(proof.claim, proof.metrics))}</b></div>
        <p class="epistemic">הדירוג הוא כלי תעדוף היוריסטי. הוא לא מודד “השפעה חברתית” כאמת אובייקטיבית, והוא אמור להשתנות כשמשנים קהל, ספק או הצעה.</p>
      </aside>
    </div>`;
}

function renderPostModal(proof) {
  if (!proof) return '';
  const post = postFor(proof, state.angle);
  return `
    <div class="modal-backdrop">
      <section class="post-modal">
        <button id="closePost" class="close">×</button>
        <div class="step-label">הפוך הוכחה לתוכן — בלי להפוך אותה להתרברבות</div>
        <h3>איזו זווית נותנת הכי הרבה ערך לקורא?</h3>
        <div class="angle-tabs">
          <button data-angle="lesson" class="tab ${state.angle==='lesson'?'active':''}">תובנה מקצועית</button>
          <button data-angle="story" class="tab ${state.angle==='story'?'active':''}">סיפור</button>
          <button data-angle="result" class="tab ${state.angle==='result'?'active':''}">הוכחה ישירה</button>
        </div>
        <label class="field"><span>CTA</span><select id="cta"><option value="none">בלי CTA</option><option value="discuss" ${state.cta==='discuss'?'selected':''}>פתח דיון</option><option value="dm" ${state.cta==='dm'?'selected':''}>הזמן להודעה</option><option value="call" ${state.cta==='call'?'selected':''}>הזמן לשיחה</option></select></label>
        <textarea id="postText" class="post-text">${esc(post)}</textarea>
        <div class="post-meta"><span>הראיה נשארת צמודה למקור: ${esc(proof.source)}</span><span id="chars">${post.length} תווים</span></div>
        <button id="copyPost" class="primary">העתק פוסט</button>
      </section>
    </div>`;
}

function renderResults() {
  const proofs = activeProofs();
  if (!proofs.length) return `<section class="empty"><h2>אין כרגע הוכחות פעילות</h2><p>הוסף מקור חדש או אפס את המאגר.</p></section>`;
  const insight = topInsight();
  const best = insight.best;
  const next = proofs.slice(1,3);
  return `
    ${renderBest(best)}
    ${next.length ? `<section class="next-section"><div class="section-head"><div><div class="step-label">אם הראשונה לא מתאימה</div><h3>עוד שתי אפשרויות טובות</h3></div></div><div class="next-grid">${next.map((p,i)=>proofMini(p,i+2)).join('')}</div></section>` : ''}
    <section class="gap-card"><div><span>הפער הכי יקר במאגר כרגע</span><b>${esc(insight.gap)}</b></div><button id="showAll" class="secondary">ראה את כל המאגר</button></section>
    <section id="allProofs" class="all-proofs collapsed">
      <div class="section-head"><div><div class="step-label">מאחורי ההכרעה</div><h3>כל ההוכחות שמצאנו</h3></div><button id="how" class="text-button">איך התעדוף עובד?</button></div>
      <div class="proof-list">${proofs.map(p => {
        const band = scoreBand(p.metrics.priority);
        return `<article class="proof-row"><div class="priority ${band.cls}">${p.metrics.priority}</div><div class="proof-body"><b>${esc(p.claim)}</b><span>${esc(p.type)} · ${esc(p.source)}</span><small>${esc(p.belief)}</small></div><div class="proof-actions"><button data-post="${p.id}" class="secondary">פוסט</button><button data-select="${p.id}" class="text-button">פירוט</button><button data-pin="${p.id}" class="icon-button" aria-label="נעץ">${state.pinned.includes(p.id)?'★':'☆'}</button><button data-dismiss="${p.id}" class="text-button danger">הסתר</button></div></article>`;
      }).join('')}</div>
    </section>`;
}

function render() {
  const selectedProof = state.proofs.find(p => p.id === state.selected);
  const postProof = state.proofs.find(p => p.id === state.postSelected);
  document.querySelector('#app').innerHTML = `
    <header class="site-header"><div class="brand"><b>ProofMiner</b><span>לא עוד רעיונות. הוכחות שכבר הרווחת.</span></div><div class="principle">מה להראות → מה זה מוכיח → מה לעשות עכשיו</div></header>
    <main class="shell">
      ${renderSourcePanel()}
      <section class="workspace">
        ${state.proofs.length ? renderResults() : `
          <section class="welcome">
            <div class="eyebrow">הבעיה אינה שאין לך מה להגיד</div>
            <h1>הדבר הכי משכנע שכבר עשית כנראה קבור בתוך מסמך.</h1>
            <p>תן למערכת כתבה, קורות חיים, המלצה, תוצאה או מאמר. היא תפרק אותם להוכחות ותראה לך <b>מה הכי שווה להוציא עכשיו — מול הקונה הספציפי שלך.</b></p>
            <div class="promise-grid"><div><b>1</b><span>מוצאים עקבות אמיתיות</span></div><div><b>2</b><span>בודקים איזה ספק הן מצמצמות</span></div><div><b>3</b><span>בוחרים הוכחה אחת להפיץ</span></div></div>
          </section>`}
      </section>
    </main>
    ${selectedProof ? renderEvidenceDrawer(selectedProof) : ''}
    ${postProof ? renderPostModal(postProof) : ''}`;
  bind();
}

function bind() {
  document.querySelectorAll('[data-context]').forEach(el => el.addEventListener('input', e => {
    state.context[e.target.dataset.context] = e.target.value; save();
  }));
  document.querySelectorAll('[data-tab]').forEach(el => el.onclick = () => { state.tab = el.dataset.tab; save(); render(); });
  document.querySelector('#addText')?.addEventListener('click', () => addSource(`טקסט ${state.sources.length+1}`, document.querySelector('#paste').value));
  document.querySelector('#sample')?.addEventListener('click', () => addSource('דוגמת נכסים', SAMPLE));
  document.querySelector('#demoWeb')?.addEventListener('click', () => addSource('תוצאות חיפוש — דמו בלבד', DEMO_WEB));
  document.querySelector('#file')?.addEventListener('change', async e => { for (const f of e.target.files) addSource(f.name, await f.text()); });
  document.querySelector('#mine')?.addEventListener('click', mine);
  document.querySelectorAll('[data-select]').forEach(el => el.onclick = () => { state.selected = el.dataset.select; save(); render(); });
  document.querySelectorAll('[data-close-drawer]').forEach(el => el.onclick = () => { state.selected = null; save(); render(); });
  document.querySelectorAll('[data-post]').forEach(el => el.onclick = () => { state.postSelected = el.dataset.post; state.angle='lesson'; save(); render(); });
  document.querySelector('#closePost')?.addEventListener('click', () => { state.postSelected = null; save(); render(); });
  document.querySelectorAll('[data-angle]').forEach(el => el.onclick = () => { state.angle = el.dataset.angle; save(); render(); });
  document.querySelector('#cta')?.addEventListener('change', e => { state.cta = e.target.value; save(); render(); });
  document.querySelector('#postText')?.addEventListener('input', e => { document.querySelector('#chars').textContent = `${e.target.value.length} תווים`; });
  document.querySelector('#copyPost')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(document.querySelector('#postText').value);
    document.querySelector('#copyPost').textContent = 'הועתק';
  });
  document.querySelectorAll('[data-pin]').forEach(el => el.onclick = () => {
    const id = el.dataset.pin;
    state.pinned = state.pinned.includes(id) ? state.pinned.filter(x=>x!==id) : [...state.pinned,id];
    save(); render();
  });
  document.querySelectorAll('[data-dismiss]').forEach(el => el.onclick = () => { state.dismissed = [...new Set([...state.dismissed, el.dataset.dismiss])]; save(); render(); });
  document.querySelector('#showAll')?.addEventListener('click', () => {
    document.querySelector('#allProofs')?.classList.toggle('collapsed');
    document.querySelector('#showAll').textContent = document.querySelector('#allProofs')?.classList.contains('collapsed') ? 'ראה את כל המאגר' : 'סגור מאגר';
  });
  document.querySelector('#how')?.addEventListener('click', () => alert('התעדוף משלב ארבעה דברים: עוצמת הראיה (35%), התאמה לקונה ולספק שהגדרת (35%), קרבה למה שאתה מוכר (20%) ועדכניות (10%). בנוסף מוצג ביטחון נפרד בראיה. זה כלי החלטה היוריסטי — לא מדידה אובייקטיבית של השפעה חברתית.'));
}

render();

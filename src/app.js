const STORAGE_KEY = 'proofminer-transition-v5-preview';

const demo = {
  transition: 'אני רוצה לעבור מייעוץ לעצמאים קטנים לייעוץ לארגונים, בלי לבזבז חודשים על מיתוג מחדש שלא יזיז את העסק.',
  profession: 'יועץ עסקי',
  desiredState: 'שמנהלים בארגונים יראו בי אופציה לגיטימית ויקבעו שיחות על תהליכי ייעוץ.',
  baselinePlan: 'לשכתב את האתר\nלהתחיל לפרסם יותר בלינקדאין\nלבנות וובינר למנהלים',
  hours: '50',
  budget: '5000',
  why: 'כי כרגע אני נראה כמו מישהו שעובד עם עצמאים, ואני מניח שצריך לשנות את הנראות לפני שאפנה לארגונים.',
  bottleneck: 'אני לא יודע אם הבעיה האמיתית היא מיצוב, הוכחה, גישה למקבלי החלטות או פשוט חוסר עקביות.',
  mirror: 'אם לקוח היה מגיע אליי במצב הזה, לא הייתי מתחיל מערוץ או אתר. הייתי מגדיר קודם מי צריך לבחור בו, לפי מה הוא בוחר, ומה חסר כדי שהבחירה תהיה סבירה.',
};

const blank = {
  step: 'transition',
  transition: '',
  profession: '',
  desiredState: '',
  baselinePlan: '',
  hours: '',
  budget: '',
  why: '',
  bottleneck: '',
  mirror: '',
  mirrorChoice: null,
  decision: null,
  commitment: '',
  challenge: '',
  reversal: '',
};

const state = { ...blank, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {}) };
const app = document.querySelector('#app');

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function esc(v = '') { return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
function lines(v='') { return String(v).split(/\n+/).map(x => x.trim()).filter(Boolean); }
function firstLine(v='') { return lines(v)[0] || ''; }

function go(step) { state.step = step; save(); render(); window.scrollTo({top:0, behavior:'smooth'}); }
function reset() { Object.assign(state, blank); save(); render(); }
function loadDemo() { Object.assign(state, blank, demo); save(); render(); }

function stepIndex() {
  return ({transition:1, baseline:2, mirror:3, decision:4, commit:5}[state.step] || 1);
}

function header() {
  const labels = ['המעבר','לפני ההמלצה','העדשה שלך','מה עכשיו','ההכרעה שלך'];
  const current = stepIndex();
  return `
    <header class="site-header">
      <div class="brand-lockup">
        <div class="logo-mark">P</div>
        <div><b>ProofMiner</b><span>להחליט מה עכשיו</span></div>
      </div>
      <div class="header-actions">
        <span class="preview-badge">Decision Preview · v5</span>
        <button class="text-btn" data-action="reset">התחל מחדש</button>
      </div>
    </header>
    <nav class="episode-progress" aria-label="שלבי התהליך">
      ${labels.map((x,i)=>`<div class="episode-step ${i+1<current?'done':''} ${i+1===current?'active':''}"><span>${i+1}</span><b>${x}</b></div>`).join('')}
    </nav>`;
}

function transitionScreen() {
  return `
    <main class="stage focus-stage">
      <div class="screen-kicker">מתחילים במה שקורה אצלך — לא בקטגוריה שלנו</div>
      <h1>מה משתנה אצלך מקצועית עכשיו?</h1>
      <p class="lead">ספר על שינוי אמיתי שאתה מנסה לייצר: לקוחות אחרים, תפקיד אחר, הצעה חדשה, קהל חדש או שלב חדש בעסק.</p>

      <section class="paper primary-card">
        <label class="big-field">
          <span>מה קורה עכשיו?</span>
          <textarea id="transition" rows="5" placeholder="לדוגמה: אני רוצה לעבור מייעוץ לעצמאים קטנים לייעוץ לארגונים, אבל לא ברור לי במה להשקיע קודם.">${esc(state.transition)}</textarea>
        </label>
        <div class="two-fields">
          <label><span>מה אתה עושה מקצועית? <small>אופציונלי</small></span><input id="profession" value="${esc(state.profession)}" placeholder="יועץ, מנהל פרויקטים, משווק..." /></label>
          <label><span>מה היית רוצה שיהיה נכון במקום? <small>אופציונלי</small></span><input id="desiredState" value="${esc(state.desiredState)}" placeholder="למשל: שמנהלים בארגונים יפנו אליי..." /></label>
        </div>
        <div class="card-actions">
          <button class="primary" data-action="transition-next" ${state.transition.trim()?'':'disabled'}>המשך <span>←</span></button>
          <button class="secondary" data-action="demo">טען מקרה לדוגמה</button>
        </div>
      </section>

      <section class="quiet-principles">
        <div><b>לא צריך לדעת מה הבעיה “באמת”</b><span>אנחנו שומרים את הניסוח שלך לפני שנשפיע עליו.</span></div>
        <div><b>לא מתחילים במחקר רחב</b><span>נחפש רק מידע שיכול לשנות החלטה.</span></div>
        <div><b>לא מחפשים תשובה מפתיעה</b><span>גם KEEP יכול להיות תוצאה טובה אם התוכנית שלך שורדת.</span></div>
      </section>
    </main>`;
}

function baselineScreen() {
  return `
    <main class="stage split-stage">
      <aside class="context-rail">
        <span>המעבר שלך</span>
        <b>${esc(state.transition)}</b>
        ${state.desiredState ? `<small>מצב רצוי: ${esc(state.desiredState)}</small>` : ''}
        <button class="text-btn" data-action="back-transition">ערוך</button>
      </aside>

      <section class="content-column">
        <div class="screen-kicker">לפני ההמלצה</div>
        <h1>אם לא היינו כאן — מה היית עושה ב־30 הימים הקרובים?</h1>
        <p class="lead">זה לא מבחן. אנחנו מקפיאים את התוכנית שלך לפני שהמערכת משנה אותה.</p>

        <div class="baseline-banner"><b>לפני ההמלצה</b><span>המידע במסך הזה נשמר כ־before state. הוא לא יתוקן בדיעבד.</span></div>

        <section class="paper primary-card">
          <label class="big-field">
            <span>הפעולות שאתה מתכוון לעשות</span>
            <textarea id="baselinePlan" rows="7" placeholder="כל פעולה בשורה חדשה\nלמשל: לשכתב אתר\nלהתחיל לפרסם יותר\nלקבוע 5 שיחות">${esc(state.baselinePlan)}</textarea>
          </label>
          <div class="two-fields resource-fields">
            <label><span>כמה שעות בערך?</span><input id="hours" inputmode="numeric" value="${esc(state.hours)}" placeholder="30" /></label>
            <label><span>כמה כסף בערך? <small>אם רלוונטי</small></span><input id="budget" inputmode="numeric" value="${esc(state.budget)}" placeholder="3000" /></label>
          </div>
          <label class="big-field compact-field"><span>למה אתה חושב שזה יעבוד?</span><textarea id="why" rows="3" placeholder="מה ההנחה שמחברת בין הפעולות לבין התוצאה שאתה רוצה?">${esc(state.why)}</textarea></label>
          <label class="big-field compact-field"><span>מה לדעתך מעכב אותך כרגע?</span><textarea id="bottleneck" rows="3" placeholder="גם “אני לא יודע” זו תשובה טובה.">${esc(state.bottleneck)}</textarea></label>
          <div class="card-actions">
            <button class="primary" data-action="baseline-next" ${state.baselinePlan.trim()?'':'disabled'}>שמור את ה־before state <span>←</span></button>
          </div>
        </section>
      </section>
    </main>`;
}

function mirrorScreen() {
  const profession = state.profession || 'המקצוע שלך';
  return `
    <main class="stage split-stage">
      <aside class="context-rail compact-rail">
        <span>התוכנית שלך בלי המערכת</span>
        <div class="baseline-list">${lines(state.baselinePlan).map(x=>`<em>${esc(x)}</em>`).join('')}</div>
        <small>${state.hours ? `${esc(state.hours)} שעות` : ''}${state.hours && state.budget ? ' · ' : ''}${state.budget ? `₪${esc(state.budget)}` : ''}</small>
      </aside>

      <section class="content-column">
        <div class="screen-kicker">עדשה אופציונלית</div>
        <h1>בוא נבדוק רגע דרך העיניים המקצועיות שלך.</h1>
        <p class="lead">לפעמים יש אצלך כלי אבחון שאתה מפעיל על אחרים אבל לא על עצמך. אם הוא לא מוסיף להחלטה — נדלג עליו.</p>

        <section class="paper mirror-card">
          <div class="lens-note"><span>עדשה, לא תשובה</span><p>אנחנו בודקים אם הדרך שבה אתה עובד כ־${esc(profession)} חושפת משהו שימושי. אחר כך נבדוק גם איפה האנלוגיה נשברת.</p></div>

          <label class="big-field">
            <span>אם אדם במצב שלך היה מגיע אליך כלקוח — מה היית בודק קודם?</span>
            <textarea id="mirror" rows="6" placeholder="אל תספר את כל המתודולוגיה. כתוב רק מה היית בודק לפני שאתה ממליץ לו על פעולה.">${esc(state.mirror)}</textarea>
          </label>

          <div class="mirror-boundary">
            <b>לפני שמשתמשים בעדשה</b>
            <span>המקצוע שלך יכול לעזור לראות את הבעיה — והוא גם יכול להסתיר דברים. המערכת לא תתייחס למה שכתבת כעובדה על השוק.</span>
          </div>

          <div class="card-actions">
            <button class="primary" data-action="use-mirror" ${state.mirror.trim()?'':'disabled'}>השתמש בעדשה הזאת <span>←</span></button>
            <button class="secondary" data-action="skip-mirror">דלג — זה לא מוסיף כרגע</button>
          </div>
        </section>
      </section>
    </main>`;
}

function makeDecision() {
  const planned = lines(state.baselinePlan);
  const first = planned[0] || 'הפעולה הראשונה שתכננת';
  const rest = planned.slice(1);
  const mirrorUsed = state.mirrorChoice === 'use' && state.mirror.trim();
  const transitionText = `${state.transition} ${state.desiredState} ${state.bottleneck}`.toLowerCase();
  const demoLike = /ארגונ|מנהלים|עצמאים/.test(transitionText);

  let now;
  let later;
  let learn;

  if (demoLike) {
    now = {
      status:'ADD',
      title:'לברר איך ההחלטה באמת מתקבלת לפני שבונים את כל המעטפת',
      detail:'לקבוע 5 שיחות קצרות עם מנהלים / בעלי תפקידים רלוונטיים ולחלץ: מי מחזיק את הבעיה, לפי מה נבחר ספק, ואיזה proof מוריד סיכון.',
      resource:'כ־8–10 שעות',
      source:'מסקנה',
      reason: mirrorUsed ? 'העדשה המקצועית שלך מצביעה על כך שאתה עצמך לא היית מתחיל מערוץ לפני שהגדרת buyer + criterion. זה משנה את סדר הפעולות.' : 'התוכנית הנוכחית משקיעה בנראות לפני שהוגדר מספיק טוב מי צריך לבחור ובאיזה קריטריון.',
      reverse:'אם כבר קיימת אצלך ראיה ישירה ועדכנית שמגדירה buyer, criterion ו־proof נדרש — הצעד הזה יכול להתקצר או להיעלם.'
    };
    later = {
      status:'DELAY',
      title: rest.length ? rest.join(' · ') : first,
      detail:'לא מבטלים. דוחים עד שנדע מה המסר וה־proof צריכים לעשות עבור הקונה הרלוונטי.',
      resource: state.hours ? `מתוך ${esc(state.hours)} השעות שתכננת` : 'המשאב שתכננת',
      source:'ממך',
      reason:'אלה פעולות סבירות, אבל כרגע הן יוצרות lock-in לפני שהנחות הקנייה נבדקו.',
      reverse:'אם השיחות מראות שהבעיה אינה buyer/criterion אלא רק distribution — מחזירים את פעולות הנראות קדימה.'
    };
    learn = {
      status:'LEARN',
      title:'מה באמת מונע את המעבר לשוק הארגוני?',
      detail:'להבדיל בין ארבע השערות: מיצוב, proof, access למקבלי החלטות, או עקביות / capacity.',
      resource:'שאלה שמסוגלת לשנות את ההקצאה',
      source:'השערה לבדיקה',
      reason:'כל אחת מהשערות מובילה לתוכנית אחרת. כרגע אין הצדקה לבחור אחת רק כי היא נשמעת סבירה.',
      reverse:'הסיגנל הראשון שמבדיל בין ההשערות צריך לשנות את התוכנית — לא לחזק אותה בכוח.'
    };
  } else {
    now = {
      status:'KEEP',
      title:first,
      detail:'ב־Preview אין כרגע ראיה חיצונית שמצדיקה להפוך את הפעולה הראשונה שלך. לכן היא נשארת — אבל עם תנאי עצירה ברור.',
      resource: state.hours ? `חלק מתוך ${esc(state.hours)} השעות שתכננת` : 'משאב מוגבל',
      source:'ממך',
      reason: mirrorUsed ? `העדשה שהבאת מוסיפה קריטריון: ${firstLine(state.mirror) || 'בדיקה מקצועית משלך'}. היא לא מספיקה לבדה כדי לבטל את התוכנית.` : 'המערכת לא מייצרת שינוי רק כדי להראות ערך.',
      reverse:'ראיה חדשה שמראה שהפעולה תלויה ב־prerequisite אחר או שהקהל אינו מגיב למנגנון הזה.'
    };
    later = {
      status: rest.length ? 'DELAY' : 'REDUCE',
      title: rest.length ? rest.join(' · ') : 'להרחיב את התוכנית לפני שיש signal ראשון',
      detail:'שמור את שאר המשאבים עד שהפעולה הראשונה מחזירה מידע שמצדיק הרחבה.',
      resource: state.budget ? `הגן כרגע על ₪${esc(state.budget)}` : 'הגן על הזמן והקשב שנותרו',
      source:'מסקנה',
      reason:'כאשר אי־הוודאות גבוהה, staged commitment שומר option value ומקטין lock-in.',
      reverse:'signal מוקדם וחזק שמאשר שהמנגנון עובד יכול להצדיק האצה.'
    };
    learn = {
      status:'LEARN',
      title: state.bottleneck || 'מהו צוואר הבקבוק שבאמת משנה את סדר הפעולות?',
      detail:'נדרש מידע חיצוני רק אם התשובה יכולה להפוך את הפעולה הראשונה או לשנות את המשאב שמוקצה לה.',
      resource:'לא לחקור מעבר למה שמשנה החלטה',
      source:'השערה לבדיקה',
      reason:'זהו החוב שנותר לפני שאפשר לתת המלצה חזקה יותר בלי להמציא ודאות.',
      reverse:'כאשר מתקבלת ראיה שמבדילה בין החלופות, החוב נסגר ונדרשת הקצאה מחדש.'
    };
  }

  state.decision = { now, later, learn, mirrorUsed };
  save();
}

function evidenceBadge(source) {
  const cls = source === 'ממך' ? 'from-user' : source === 'מהשטח' ? 'from-field' : source === 'מסקנה' ? 'inference' : 'hypothesis';
  return `<span class="evidence-badge ${cls}">${esc(source)}</span>`;
}

function decisionCard(type, card) {
  return `
    <article class="decision-card ${type}">
      <div class="decision-card-head">
        <span class="status-pill">${esc(card.status)}</span>
        ${evidenceBadge(card.source)}
      </div>
      <h3>${esc(card.title)}</h3>
      <p>${esc(card.detail)}</p>
      <div class="resource-line"><span>משאב</span><b>${card.resource}</b></div>
      <details>
        <summary>למה?</summary>
        <p>${esc(card.reason)}</p>
      </details>
      <details>
        <summary>מה יגרום לנו לשנות כיוון?</summary>
        <p>${esc(card.reverse)}</p>
      </details>
    </article>`;
}

function decisionScreen() {
  if (!state.decision) makeDecision();
  const d = state.decision;
  return `
    <main class="stage decision-stage">
      <section class="decision-intro">
        <div class="screen-kicker">זו לא תוכנית עבודה מלאה</div>
        <h1>ההחלטה עכשיו היא איפה לשים את המשאב הבא.</h1>
        <p class="lead">ה־Preview מפריד בין מה שכדאי לעשות, מה סביר אבל מוקדם מדי, ומה צריך לברר לפני שמתחייבים.</p>
      </section>

      <section class="before-after paper">
        <div>
          <span>לפני</span>
          <b>${lines(state.baselinePlan).map(x=>esc(x)).join(' · ') || 'לא הוגדרה תוכנית'}</b>
        </div>
        <div class="ba-arrow">←</div>
        <div>
          <span>אחרי</span>
          <b>${esc(d.now.title)}</b>
        </div>
      </section>

      <section class="decision-board">
        <div class="lane lane-now"><div class="lane-title"><span>01</span><b>לעשות עכשיו</b></div>${decisionCard('now', d.now)}</div>
        <div class="lane lane-later"><div class="lane-title"><span>02</span><b>לא עכשיו</b></div>${decisionCard('later', d.later)}</div>
        <div class="lane lane-learn"><div class="lane-title"><span>03</span><b>לברר לפני שמחליטים</b></div>${decisionCard('learn', d.learn)}</div>
      </section>

      <section class="trust-strip">
        <div><span class="dot from-user-dot"></span><b>ממך</b><small>מה שאמרת או תכננת</small></div>
        <div><span class="dot inference-dot"></span><b>מסקנה</b><small>פירוש של המערכת</small></div>
        <div><span class="dot hypothesis-dot"></span><b>השערה לבדיקה</b><small>עדיין לא ראיה מהשוק</small></div>
      </section>

      <div class="decision-footer">
        <button class="primary" data-action="decision-next">אני רוצה להכריע בעצמי <span>←</span></button>
        <button class="secondary" data-action="back-mirror">חזור ושנה את העדשה</button>
      </div>
    </main>`;
}

function commitScreen() {
  const d = state.decision || {};
  return `
    <main class="stage commit-stage">
      <div class="screen-kicker">המערכת המליצה. עכשיו ההכרעה חוזרת אליך.</div>
      <h1>מה אתה באמת הולך לעשות?</h1>
      <p class="lead">אנחנו לא מסמנים “המלצה התקבלה”. אנחנו שומרים מה אתה בוחר, מה אתה משנה, ומה יגרום לך להפוך את ההחלטה.</p>

      <div class="commit-grid">
        <section class="paper commit-form">
          <label class="big-field"><span>הפעולה הראשונה שלך</span><textarea id="commitment" rows="4" placeholder="כתוב במילים שלך — גם אם זה שונה מההמלצה.">${esc(state.commitment || d.now?.title || '')}</textarea></label>
          <label class="big-field compact-field"><span>מה בהמלצה אתה לא מקבל או רוצה לשנות?</span><textarea id="challenge" rows="4" placeholder="אפשר גם לכתוב: כרגע אני מקבל הכול, אבל אני לא בטוח לגבי...">${esc(state.challenge)}</textarea></label>
          <label class="big-field compact-field"><span>איזו ראיה תגרום לך לשנות כיוון?</span><textarea id="reversal" rows="4" placeholder="למשל: אם 5 שיחות יראו ש...">${esc(state.reversal || d.now?.reverse || '')}</textarea></label>
          <div class="card-actions"><button class="primary" data-action="finish" ${state.commitment.trim()?'':'disabled'}>שמור כהחלטה שלי <span>✓</span></button></div>
        </section>

        <aside class="paper authorship-card">
          <span>Decision authorship</span>
          <h3>המערכת לא מקבלת בעלות על ההחלטה.</h3>
          <p>אם אתה לא יכול להסביר למה בחרת, לערער על הנחה, או לומר מה ישנה את דעתך — עוד לא סיימנו.</p>
          <div class="mini-summary"><span>המלצת המערכת</span><b>${esc(d.now?.title || '')}</b></div>
        </aside>
      </div>
    </main>`;
}

function doneScreen() {
  return `
    <main class="stage done-stage">
      <div class="done-mark">✓</div>
      <div class="screen-kicker">החלטה נשמרה</div>
      <h1>עכשיו יש למה לחזור כשהעולם יענה.</h1>
      <p class="lead">השווי העתידי של המערכת יגיע רק אם נוכל להשוות בין מה שחשבת, מה שבחרת, מה שביצעת ומה שקרה — ולדעת מה עדיין רלוונטי בהחלטה הבאה.</p>
      <section class="paper decision-record">
        <div><span>המעבר</span><b>${esc(state.transition)}</b></div>
        <div><span>מה בחרת לעשות</span><b>${esc(state.commitment)}</b></div>
        <div><span>מה אתה מערער עליו</span><b>${esc(state.challenge || 'לא נרשם ערעור')}</b></div>
        <div><span>מה ישנה את ההחלטה</span><b>${esc(state.reversal)}</b></div>
      </section>
      <div class="done-actions"><button class="primary" data-action="reset">פתח החלטה חדשה</button></div>
    </main>`;
}

function render() {
  const body = state.step === 'transition' ? transitionScreen()
    : state.step === 'baseline' ? baselineScreen()
    : state.step === 'mirror' ? mirrorScreen()
    : state.step === 'decision' ? decisionScreen()
    : state.step === 'commit' ? commitScreen()
    : doneScreen();

  app.innerHTML = `<div class="app-shell" dir="rtl">${header()}${body}<footer>Preview ניסויי · אין כאן עדיין מחקר שוק אוטונומי או המלצה אסטרטגית מאומתת</footer></div>`;
  bind();
}

function val(id) { return document.querySelector(`#${id}`)?.value ?? ''; }
function persistInputs() {
  ['transition','profession','desiredState','baselinePlan','hours','budget','why','bottleneck','mirror','commitment','challenge','reversal'].forEach(k => {
    const el = document.querySelector(`#${k}`); if (el) state[k] = el.value;
  });
  save();
}

function bind() {
  document.querySelectorAll('textarea,input').forEach(el => el.addEventListener('input', () => {
    persistInputs();
    document.querySelectorAll('[data-action="transition-next"]').forEach(b=>b.disabled=!state.transition.trim());
    document.querySelectorAll('[data-action="baseline-next"]').forEach(b=>b.disabled=!state.baselinePlan.trim());
    document.querySelectorAll('[data-action="use-mirror"]').forEach(b=>b.disabled=!state.mirror.trim());
    document.querySelectorAll('[data-action="finish"]').forEach(b=>b.disabled=!state.commitment.trim());
  }));

  document.querySelector('[data-action="reset"]')?.addEventListener('click', reset);
  document.querySelector('[data-action="demo"]')?.addEventListener('click', () => { loadDemo(); go('transition'); });
  document.querySelector('[data-action="transition-next"]')?.addEventListener('click', () => { persistInputs(); go('baseline'); });
  document.querySelector('[data-action="back-transition"]')?.addEventListener('click', () => go('transition'));
  document.querySelector('[data-action="baseline-next"]')?.addEventListener('click', () => { persistInputs(); go('mirror'); });
  document.querySelector('[data-action="use-mirror"]')?.addEventListener('click', () => { persistInputs(); state.mirrorChoice='use'; state.decision=null; save(); makeDecision(); go('decision'); });
  document.querySelector('[data-action="skip-mirror"]')?.addEventListener('click', () => { persistInputs(); state.mirrorChoice='skip'; state.decision=null; save(); makeDecision(); go('decision'); });
  document.querySelector('[data-action="back-mirror"]')?.addEventListener('click', () => go('mirror'));
  document.querySelector('[data-action="decision-next"]')?.addEventListener('click', () => go('commit'));
  document.querySelector('[data-action="finish"]')?.addEventListener('click', () => { persistInputs(); state.step='done'; save(); render(); window.scrollTo({top:0,behavior:'smooth'}); });
}

render();

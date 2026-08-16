const KEY='proofminer-safety-layer-demo-v1';

const scenarios={
  calendar:{
    source:'Calendar demo',sourceIcon:'◷',title:'להקדיש יומיים לשכתוב האתר לקראת מעבר לייעוץ לארגונים',when:'מחר · 09:00',exposure:'16 שעות',detail:'בלוק עבודה שנוצר ביומן: “שכתוב אתר — ארגונים”',
    commitment:'לשכתב את האתר לפני התחלת פנייה מסודרת לארגונים',hours:16,
    bet:'translation',betLabel:'שהמסר והתרגום הם כרגע החסם המשמעותי',
    alternative:'ייתכן שהחסם מוקדם יותר: proof ארגוני או גישה ל-buyer, ולכן שכתוב האתר לא יפתור אותו עדיין.',
    probe:'לפני 16 שעות שכתוב: הצג את העמוד הנוכחי ל־5 אנשים רלוונטיים ובדוק מה בדיוק מונע מהם להתקדם — חוסר הבנה, חוסר proof או חוסר רלוונטיות.',probeHours:2,
    signal:'5 תגובות שמבדילות בין מסר / proof / access',horizon:'48 שעות'
  },
  task:{
    source:'Task demo',sourceIcon:'✓',title:'לבנות וובינר חדש למנהלים',when:'השבוע',exposure:'12 שעות',detail:'משימה שסומנה כ־High priority: “וובינר AI למנהלים”',
    commitment:'לבנות וובינר חדש כדי לפתוח דלת לשיחות עם מנהלים',hours:12,
    bet:'visibility',betLabel:'שיותר חשיפה דרך וובינר תיצור את ההזדמנות שחסרה',
    alternative:'ייתכן שהחשיפה אינה הבעיה; ייתכן שאנשים נחשפים אבל לא מזהים proof או הצעה שמצדיקה שיחה.',
    probe:'שלח את ההצעה הקיימת ל־8 מנהלים/בעלי תפקידים ובדוק אם החסם הוא להגיע אליהם, להסביר את הערך או להוכיח רלוונטיות — לפני בניית נכס חדש.',probeHours:2,
    signal:'תגובות אמיתיות להצעה הקיימת',horizon:'72 שעות'
  },
  proposal:{
    source:'Proposal demo',sourceIcon:'↗',title:'להוציא הצעה מוזלת כדי לסגור לקוח ראשון בארגון',when:'לפני שליחה',exposure:'₪4,000 ו־30 יום',detail:'טיוטת הצעה: מחיר כניסה נמוך יותר מהמחיר המתוכנן',
    commitment:'לרדת במחיר כדי להגדיל את הסיכוי לסגירה',hours:0,
    bet:'offer',betLabel:'שהמחיר הוא כרגע הסיבה המרכזית לכך שהעסקה עלולה לא להיסגר',
    alternative:'ייתכן שהמחיר אינו החסם; ייתכן שהקונה עדיין לא רואה מספיק proof, בהירות או התאמה לסיכון הארגוני.',
    probe:'לפני שינוי המחיר: בקש מהקונה לדרג במילים שלו מה עדיין חסר כדי להתקדם. שנה מחיר רק אם המחיר עולה כקריטריון ממשי ולא כהנחה שלנו.',probeHours:0,
    signal:'סיבת ההתנגדות בניסוח של הקונה',horizon:'באותה שיחה'
  }
};

const blank={scenario:'calendar',stage:'incoming',betOverride:null,outcome:null,receipt:null,skipped:false};
const state={...blank,...JSON.parse(localStorage.getItem(KEY)||'null')};
const app=document.querySelector('#app');
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const s=()=>scenarios[state.scenario]||scenarios.calendar;
const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function header(){
  return `<header class="topbar"><div class="brand"><div class="mark">P</div><div><b>ProofMiner</b><span>Commitment Safety Layer · prototype</span></div></div><button class="ghost" data-reset>אפס הדגמה</button></header>`;
}

function sourceTabs(){
  return `<div class="source-tabs" aria-label="תרחישי הדגמה">${Object.entries(scenarios).map(([id,x])=>`<button class="source-tab ${state.scenario===id?'active':''}" data-scenario="${id}"><span>${x.sourceIcon}</span>${x.source}</button>`).join('')}</div>`;
}

function incoming(){const x=s();return `
  <main class="shell">
    <section class="intro">
      <div><span class="kicker">הדגמת אינטגרציה · לא חיבור אמיתי</span><h1>אתה עומד להתחייב למשהו שיכול להצדיק בדיקה קצרה.</h1><p>ProofMiner לא מחכה שתפתח אפליקציה. בתרחיש הזה ההתחייבות מגיעה ממשטח העבודה, והמערכת צריכה להחליט אם להפריע בכלל.</p></div>
      ${sourceTabs()}
    </section>

    <section class="incoming-card">
      <div class="incoming-source"><span class="source-icon">${x.sourceIcon}</span><div><b>${x.source}</b><small>${x.when}</small></div><span class="demo-chip">DEMO</span></div>
      <h2>${esc(x.title)}</h2>
      <p>${esc(x.detail)}</p>
      <div class="facts"><div><span>חשיפה</span><b>${esc(x.exposure)}</b></div><div><span>סוג</span><b>מחויבות מקצועית</b></div><div><span>מצב</span><b>לפני ביצוע</b></div></div>
    </section>

    <section class="router-card">
      <div><span class="kicker">Selective support router</span><h3>שווה לעצור לרגע?</h3><p>הבדיקה מוצעת בגלל חשיפה מהותית + מנגנון שעדיין לא נבדק. אין כאן “ציון סיכון”; זו היפותזת routing שנבדוק בשטח.</p></div>
      <div class="router-actions"><button class="secondary" data-skip>דלג והמשך</button><button class="primary" data-start>בדיקה של פחות מדקה</button></div>
    </section>
    <p class="ethics">המערכת חייבת להישאר ניתנת לעקיפה. המטרה: להיות קשה לוותר עליה בגלל ערך — לא בגלל חסימה.</p>
  </main>`;}

function gate(){const x=s();const bet=state.betOverride||x.bet;const labels={translation:'מסר / תרגום',visibility:'חשיפה',proof:'proof / לגיטימציה',access:'גישה',offer:'הצעה / מחיר'};return `
  <main class="shell gate-shell">
    <div class="gate-top"><button class="back" data-back>← חזרה</button><span>בדיקה לפני התחייבות</span><b>Before-state נשמר</b></div>

    <section class="receipt-preview user-layer">
      <div class="layer-label">שלך · לפני השפעת המערכת</div>
      <h2>${esc(x.commitment)}</h2>
      <div class="commitment-line"><span>מה עומד לצאת עכשיו</span><b>${esc(x.exposure)}</b></div>
    </section>

    <section class="inference-layer system-layer">
      <div class="layer-label">מערכת · inference לתיקון</div>
      <h2>התוכנית הזאת מתנהגת כאילו...</h2>
      <p class="big-claim">${esc(state.betOverride?`החסם כרגע הוא בעיקר ${labels[bet]||bet}`:x.betLabel)}.</p>
      <p class="supporting">זו לא עובדה על העולם ולא “מה שאתה באמת מאמין”. זו פרשנות של מבנה המחויבות.</p>
      <div class="bet-picker"><span>לא מדויק? תקן:</span>${Object.entries(labels).map(([id,label])=>`<button class="bet ${bet===id?'active':''}" data-bet="${id}">${label}</button>`).join('')}</div>
    </section>

    <section class="evidence-grid">
      <article class="evidence known"><div class="layer-label">נצפה</div><h3>מה אנחנו כן יודעים</h3><p>אתה עומד להוציא <b>${esc(x.exposure)}</b> על פעולה שמכוונת בעיקר למנגנון הזה.</p></article>
      <article class="evidence inferred"><div class="layer-label">הסבר מתחרה</div><h3>מה עוד יכול להסביר את המצב</h3><p>${esc(x.alternative)}</p></article>
      <article class="evidence missing"><div class="layer-label">חסר</div><h3>מה עדיין לא הוכרע</h3><p>אין כרגע בתרחיש הזה ראיה חיצונית שמבדילה מספיק בין ההסברים לפני תשלום מלוא המחויבות.</p></article>
    </section>

    <section class="verdict">
      <div class="verdict-copy"><span class="kicker">המלצת ה־gate</span><h2>PROBE · קנה מידע קטן לפני מחויבות גדולה</h2><p>${esc(x.probe)}</p><div class="probe-meta"><span>עלות בדיקה: ${x.probeHours?`${x.probeHours} שעות`:'שאלה אחת'}</span><span>אות צפוי: ${esc(x.signal)}</span><span>אופק: ${esc(x.horizon)}</span></div></div>
      <div class="outcomes"><button data-outcome="PASS"><b>PASS</b><span>אני ממשיך כמתוכנן</span></button><button data-outcome="MODIFY"><b>MODIFY</b><span>אני משנה את המחויבות</span></button><button class="recommended" data-outcome="PROBE"><b>PROBE</b><span>אני בודק לפני</span></button></div>
    </section>
  </main>`;}

function outcome(){const x=s();const outcome=state.outcome;const copy={PASS:['ממשיכים','בחרת להמשיך במחויבות המקורית אחרי שההימור נהיה גלוי.'],MODIFY:['משנים','בחרת לשנות את ההתחייבות לפני שהיא יצאה לעולם.'],PROBE:['בודקים קודם','בחרת לקנות מידע קטן לפני מלוא המחויבות.']}[outcome]||['נשמר',''];return `
  <main class="shell outcome-shell">
    <section class="outcome-hero"><span class="kicker">${outcome}</span><h1>${copy[0]}</h1><p>${copy[1]}</p></section>
    <section class="decision-receipt">
      <div class="receipt-head"><div><span class="kicker">Decision Receipt · pre-commitment</span><h2>${esc(x.commitment)}</h2></div><span class="sealed">נשמר לפני outcome</span></div>
      <dl><div><dt>חשיפה מקורית</dt><dd>${esc(x.exposure)}</dd></div><div><dt>הימור שנבדק</dt><dd>${esc(state.betOverride||x.bet)}</dd></div><div><dt>הכרעה</dt><dd>${outcome}</dd></div><div><dt>מה ייבדק / יעקוב</dt><dd>${outcome==='PROBE'?esc(x.signal):'אות outcome במועד שנקבע'}</dd></div><div><dt>מועד review</dt><dd>${esc(x.horizon)}</dd></div></dl>
      ${outcome==='PROBE'?`<div class="next-action"><span>הפעולה הקטנה הבאה</span><b>${esc(x.probe)}</b></div>`:''}
    </section>
    <section class="flight-recorder"><div><span class="kicker">Decision Flight Recorder</span><h3>הערך הבא לא מגיע מעוד ניתוח — אלא מהחיבור למה שיקרה.</h3><p>כשיגיע האות, המוצר צריך לקשור אותו ל־before-state הזה. רק כך נוכל ללמוד בלי hindsight rewriting ולתת להחלטה הבאה הקשר שאי־אפשר לשחזר בצ׳אט טרי.</p></div><div class="timeline"><span class="done">כוונה</span><span class="done">Gate</span><span class="active">ביצוע</span><span>אות</span><span>למידה</span></div></section>
    <div class="end-actions"><button class="secondary" data-new>בדוק התחייבות אחרת</button><button class="primary" data-removal>הפעל Removal Test</button></div>
  </main>`;}

function removal(){return `<main class="shell removal-shell"><section class="removal"><span class="kicker">Removal test · סימולציה</span><h1>עכשיו שכבת הבטיחות נעלמה.</h1><p>בדיקה טובה ל“מוצר שאי אפשר לא להשתמש בו” אינה “האם אהבת אותו?”, אלא: <b>מה אתה עושה כשהוא חסר?</b></p><div class="removal-options"><button data-removal-choice>אני ממשיך כרגיל ולא חסר לי כלום</button><button data-removal-choice>אני עוצר ומריץ את הבדיקה ידנית</button><button data-removal-choice>אני רוצה את השכבה בחזרה לפני ההתחייבות</button><button data-removal-choice>אני ממשיך, אבל מודע במפורש לסיכון שלא בדקתי</button></div><div class="removal-note">ב־FIELD אמיתי ההתנהגות הזאת תימדד, לא רק תשאל.</div><button class="secondary" data-new>חזרה להתחלה</button></section></main>`;}

function skipped(){return `<main class="shell"><section class="skip-screen"><span class="kicker">SILENT / BYPASS PATH</span><h1>המשכת בלי הבדיקה.</h1><p>זה חייב להישאר אפשרי. אם אחרי כמה מחזורי ערך ההתנהגות הזו נשארת ברירת המחדל — המוצר נכשל ב־Indispensability DOD.</p><button class="primary" data-new>נסה התחייבות אחרת</button></section></main>`;}

function render(){
  let body=state.skipped?skipped():state.stage==='incoming'?incoming():state.stage==='gate'?gate():state.stage==='outcome'?outcome():state.stage==='removal'?removal():incoming();
  app.innerHTML=header()+body;bind();
}

function bind(){
  document.querySelectorAll('[data-scenario]').forEach(b=>b.onclick=()=>{state.scenario=b.dataset.scenario;state.stage='incoming';state.betOverride=null;state.outcome=null;state.skipped=false;save();render();});
  document.querySelector('[data-start]')?.addEventListener('click',()=>{state.stage='gate';state.skipped=false;save();render();});
  document.querySelector('[data-skip]')?.addEventListener('click',()=>{state.skipped=true;save();render();});
  document.querySelector('[data-back]')?.addEventListener('click',()=>{state.stage='incoming';save();render();});
  document.querySelectorAll('[data-bet]').forEach(b=>b.onclick=()=>{state.betOverride=b.dataset.bet;save();render();});
  document.querySelectorAll('[data-outcome]').forEach(b=>b.onclick=()=>{state.outcome=b.dataset.outcome;state.stage='outcome';state.receipt={scenario:state.scenario,outcome:state.outcome,bet:state.betOverride||s().bet,createdAt:new Date().toISOString()};save();render();});
  document.querySelector('[data-removal]')?.addEventListener('click',()=>{state.stage='removal';save();render();});
  document.querySelectorAll('[data-new]').forEach(b=>b.onclick=()=>{Object.assign(state,{stage:'incoming',betOverride:null,outcome:null,receipt:null,skipped:false});save();render();});
  document.querySelectorAll('[data-removal-choice]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-removal-choice]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');});
  document.querySelector('[data-reset]')?.addEventListener('click',()=>{localStorage.removeItem(KEY);Object.assign(state,blank);render();});
}

render();
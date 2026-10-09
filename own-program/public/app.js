// AI-MasterPlan frontend — vanilla JS. Talks only to /api/*.
const $ = (s) => document.querySelector(s);
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { localStorage.setItem(k, JSON.stringify(v)); } };
let CUR = null, DONE = store.get('amp-own-done', []), TOTAL = 111;
let DATES = store.get('amp-own-dates', []);
let GOAL = Number(localStorage.getItem('amp-own-goal') || 5) || 5;
function touchDate() {
  const day = new Date().toISOString().slice(0, 10);
  if (!DATES.some((d) => d.slice(0, 10) === day)) {
    DATES = [...DATES, new Date().toISOString()];
    store.set('amp-own-dates', DATES);
  }
}
function streak() {
  const days = new Set(DATES.map((d) => d.slice(0, 10)));
  let n = 0;
  const c = new Date();
  if (!days.has(c.toISOString().slice(0, 10))) c.setDate(c.getDate() - 1);
  while (days.has(c.toISOString().slice(0, 10)) && n < 365) { n++; c.setDate(c.getDate() - 1); }
  return n;
}
function weekStart() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
function weekDays() {
  const s = weekStart();
  return new Set(DATES.map((d) => d.slice(0, 10)).filter((day) => day >= s)).size;
}

async function jget(p) { const r = await fetch(p); return r.json(); }

function renderJourney(list) {
  $('#journey').innerHTML = list.map((j, i) => `<li>${i + 1}. ${j}</li>`).join('');
}

function renderLevels(levels) {
  const box = $('#levels');
  box.innerHTML = levels.map((lv) => `
    <div class="lvl"><h3>Level ${lv.n}: ${lv.title}</h3><p class="muted">${lv.sum}</p>
    ${lv.tools ? `<p class="muted">Tools: ${lv.tools.join(' • ')}</p>` : ''}
    ${lv.project ? `<p class="muted">PROJECT: ${lv.project}</p>` : ''}
    ${lv.modules.map((m) => `
      <div class="mod"><h4>${m.id} — ${m.title}</h4>
      ${m.lessons.map(([id, t, min]) => `
        <button class="les ${DONE.includes(id) ? 'done' : ''}" data-id="${id}">
          <span class="dot">${DONE.includes(id) ? '✓' : '○'}</span>
          <span><b>${id} — ${t}</b><br><span class="muted">${min} min • tap to ${DONE.includes(id) ? 'uncheck' : 'complete'}</span></span>
        </button>`).join('')}
      </div>`).join('')}
    </div>`).join('');
  box.querySelectorAll('.les').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.id;
    const adding = !DONE.includes(id);
    DONE = adding ? [...DONE, id] : DONE.filter((x) => x !== id);
    if (adding) touchDate();
    store.set('amp-own-done', DONE);
    renderLevels(levels); renderBar();
  }));
}

function renderBar() {
  const total = TOTAL, n = DONE.filter((id) => lessonExists(id)).length, pct = Math.round((n / total) * 100);
  const st = streak(), wd = weekDays(), wpct = Math.min(100, Math.round((wd / GOAL) * 100));
  $('#barFill').style.width = pct + '%';
  $('#barLabel').textContent = `${n}/${total} lessons • ${pct}% • ${n * 50} XP • 🔥 ${st} day streak`;
  $('#lcount').textContent = `${n}/${total}`;
  $('#progOut').textContent = (n === 0 ? 'Complete lessons above to grow XP.' :
    n >= total ? `All ${total} done — you are an Independent Builder! (${n * 50} XP)` :
    `${n}/${total} lessons, ${n * 50} XP (50/lesson). ~${Math.ceil((total - n) / 2)} days left at 2/day. Next: ${nextId()}.`) +
    ` Weekly goal: ${wd}/${GOAL} active days (${wpct}%)${wd >= GOAL ? ' ✓ met!' : ''}. Streak: ${st} day(s).`;
  const g = $('#goalLine');
  if (g) g.textContent = `Weekly goal: ${wd}/${GOAL} days • streak 🔥 ${st}`;
}

function lessonExists(id) {
  if (!CUR) return true;
  for (const lv of CUR.levels) for (const m of lv.modules) for (const [lid] of m.lessons) if (lid === id) return true;
  return false;
}

function nextId() {
  if (!CUR) return 'L1M1L1';
  for (const lv of CUR.levels) for (const m of lv.modules) for (const [id] of m.lessons) if (!DONE.includes(id)) return id;
  return 'done';
}

function renderTools(tools, q) {
  const f = tools.filter((t) => !q || (t.name + t.cat + t.what).toLowerCase().includes(q.toLowerCase()));
  $('#tools').innerHTML = f.map((t) => `<div class="tool"><b>${t.icon || ''} ${t.name}</b><span class="price">${t.price}</span><br><span class="muted">${t.cat}</span><br>${t.what}</div>`).join('') || '<p class="muted">No match.</p>';
}

function renderProjects(list) {
  $('#projects').innerHTML = list.map((p) => `<div class="proj"><b>${p.id} — ${p.title}</b> <span class="price">Level ${p.level}</span><br><span class="muted">${p.req}</span><br><span class="muted">Setup: ${p.setup || ''}</span><br><span class="muted">Stages: ${p.stages || ''}</span></div>`).join('');
}

async function boot() {
  try {
    const h = await jget('/api/health');
    $('#health').textContent = `Server OK • port=${h.port}`;
    $('#sig').textContent = `program=${h.program} port=${h.port} ${new Date().toISOString().slice(0, 10)}`;
  } catch { $('#health').textContent = 'server unreachable'; return; }
  const ov = await jget('/api/overview');
  TOTAL = ov.lessons || TOTAL;
  // drop stale completions from the old 40-lesson shape
  DONE = DONE.filter((id) => { for (const lv of (CUR?.levels || [])) for (const m of lv.modules) for (const [lid] of m.lessons) if (lid === id) return true; return CUR ? false : true; });
  renderJourney(ov.journey);
  CUR = await jget('/api/curriculum');
  DONE = DONE.filter((id) => lessonExists(id));
  store.set('amp-own-done', DONE);
  renderLevels(CUR.levels); renderBar();
  const t = await jget('/api/tools');
  renderTools(t.tools, '');
  $('#q').addEventListener('input', (e) => renderTools(t.tools, e.target.value));
  const pr = await jget('/api/projects');
  renderProjects(pr.projects);
  $('#startBtn').addEventListener('click', () => { document.getElementById('roadmap').scrollIntoView({ behavior: 'smooth' }); });
  $('#planBtn').addEventListener('click', async () => {
    const idea = $('#idea').value;
    $('#planOut').textContent = 'planning…';
    const p = await jget('/api/plan?idea=' + encodeURIComponent(idea));
    window._lastPlan = { idea, plan: p };
    $('#planOut').textContent = `DEFINITION: ${p.definition}\n\nFEATURES:\n- ${p.features.join('\n- ')}\n\nSTACK: ${p.stack.join(' • ')}\n\nARCHITECTURE: ${p.architecture}\n\nTODOS:\n- ${p.todos.join('\n- ')}\n\nDEPLOY: ${p.deployment}`;
  });
  wirePlans(); wireAsk(); wireMeet(); wireCommunity(); wireCerts(); wireEnroll(); wireNotify(); wireCms();
  $('#resetBtn').addEventListener('click', () => { DONE = []; store.set('amp-own-done', DONE); renderLevels(CUR.levels); renderBar(); });
  $('#goalDown').addEventListener('click', () => { GOAL = Math.max(1, GOAL - 1); localStorage.setItem('amp-own-goal', String(GOAL)); renderBar(); });
  $('#goalUp').addEventListener('click', () => { GOAL = Math.min(21, GOAL + 1); localStorage.setItem('amp-own-goal', String(GOAL)); renderBar(); });
  wireAuth();
  wireOnboard();
}
function plans() { try { return JSON.parse(localStorage.getItem('amp-plans') || '[]'); } catch { return []; } }function setPlans(p) { localStorage.setItem('amp-plans', JSON.stringify(p)); renderSaved(); }
function renderSaved() {
  const box = $('#savedPlans');
  if (!box) return;
  const ps = plans();
  box.innerHTML = ps.length ? '' : '<p class="muted">No saved plans yet.</p>';
  ps.forEach((r, ri) => {
    const done = r.done.filter(Boolean).length;
    const d = document.createElement('div');
    d.className = 'proj';
    d.innerHTML = `<b>${r.idea.slice(0, 80)}</b> <span class="price">${done}/${r.todos.length}</span><br>` +
      r.todos.map((t, i) => `<button data-p="${ri}" data-t="${i}" class="les ${r.done[i] ? 'done' : ''}"><span class="dot">${r.done[i] ? '✓' : '○'}</span><span>${t}</span></button>`).join('') +
      `<div class="cta"><button data-del="${ri}" class="ghost">Delete</button></div>`;
    box.appendChild(d);
  });
  box.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => {
    const ps = plans(); const r = ps[+b.dataset.p];
    r.done[+b.dataset.t] = !r.done[+b.dataset.t];
    setPlans(ps);
  }));
  box.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
    setPlans(plans().filter((_, i) => i !== +b.dataset.del));
  }));
}
function wirePlans() {
  renderSaved();
  const sb = $('#savePlanBtn');
  if (sb) sb.addEventListener('click', async () => {
    const idea = $('#idea').value;
    const p = (window._lastPlan && window._lastPlan.idea === idea) ? window._lastPlan.plan : await jget('/api/plan?idea=' + encodeURIComponent(idea));
    const ps = plans();
    ps.unshift({ idea, todos: p.todos, done: p.todos.map(() => false) });
    setPlans(ps);
  });
}
const ASK_QS = ['Explain this simply.', 'Why am I getting this error?', 'What should I do next?', 'Explain this code.', 'Help me improve this prompt.', 'Check if I followed the tutorial correctly.'];
let _hintN = 0;
async function doAsk(q) {
  const query = (q || $('#askQ').value).trim();
  if (!query) return;
  $('#askOut').textContent = 'thinking…';
  _hintN = 0;
  const r = await jget(`/api/ask?q=${encodeURIComponent(query)}&lesson=${$('#askLesson').value}&project=${$('#askProj').value}`);
  window._lastAsk = { q: query, a: r.answer };
  $('#askOut').textContent = `TUTOR (lesson ${r.lesson ? r.lesson.id : '—'}):\n${r.answer}`;
}
async function wireAsk() {
  const lc = $('#askLesson'), pc = $('#askProj'), chips = $('#askChips');
  if (!lc || !CUR) return;
  lc.innerHTML = CUR.levels.flatMap((lv) => lv.modules.flatMap((m) => m.lessons.map(([id, t]) => `<option value="${id}">${id} — ${t}</option>`))).join('');
  try {
    const pr = await jget('/api/projects');
    pc.innerHTML = '<option value="">No project</option>' + pr.projects.map((p) => `<option value="${p.id}">${p.id} — ${p.title}</option>`).join('');
  } catch { /* projects optional */ }
  chips.innerHTML = '';
  ASK_QS.forEach((s) => {
    const b = document.createElement('button');
    b.className = 'ghost'; b.textContent = s;
    b.addEventListener('click', () => doAsk(s));
    chips.appendChild(b);
  });
  $('#askBtn').addEventListener('click', () => doAsk(''));
  $('#hintBtn').addEventListener('click', () => {
    _hintN++;
    const base = (window._lastAsk && window._lastAsk.a) || 'Tell me the lesson ID first.';
    const extras = ['Do just the first checklist item. Nothing else.', 'Run exactly the step command, compare with expected.', 'Apply the usual fix from Common errors, then report what changed.'];
    $('#askOut').textContent += `\n\nBIGGER HINT ${_hintN}: ${extras[Math.min(_hintN - 1, extras.length - 1)]}\n(base: ${base.slice(0, 120)}…)`;
  });
}
function mqs() { try { return JSON.parse(localStorage.getItem('amp-meet-q') || '[]'); } catch { return []; } }
function wireMeet() {
  const out = $('#meetOut');
  if (!out) return;
  jget('/api/meet').then((m) => {
    const ms = new Date(m.session.startsAt).getTime() - Date.now();
    const cd = ms <= 0 ? 'Live now — join!' : `${Math.floor(ms / 864e5)}d ${Math.floor(ms / 36e5) % 24}h ${Math.floor(ms / 6e4) % 60}m to go`;
    out.textContent = `${m.session.title}\n${new Date(m.session.startsAt).toLocaleString()} • ${cd}\nHost: ${m.author.name} (${m.author.role})\nFormat:\n- ${m.format.join('\n- ')}\nJoin: ${m.session.url}`;
    $('#meetArch').innerHTML = '<h3>Archive + recordings</h3>' + m.archive.map((a) => `<div class="proj"><b>${a.title}</b><br><span class="muted">${a.recording}</span></div>`).join('');
  }).catch(() => { out.textContent = 'Meet info unreachable.'; });
  const paint = () => {
    const qs = mqs().sort((a, b) => b.v - a.v);
    $('#meetQs').innerHTML = qs.length ? '' : '<p class="muted">No questions yet — submit the first.</p>';
    qs.forEach((q, i) => {
      const b = document.createElement('button');
      b.className = 'les'; b.innerHTML = `<span class="dot">▲ ${q.v}</span><span>${q.t}</span>`;
      b.addEventListener('click', () => { const all = mqs(); all[i].v++; localStorage.setItem('amp-meet-q', JSON.stringify(all)); paint(); });
      $('#meetQs').appendChild(b);
    });
  };
  paint();
  $('#meetQBtn').addEventListener('click', () => {
    const t = $('#meetQ').value.trim().slice(0, 280);
    if (!t) return;
    const all = mqs(); all.push({ t, v: 0 });
    localStorage.setItem('amp-meet-q', JSON.stringify(all));
    $('#meetQ').value = '';
    paint();
  });
  $('#meetAttend').addEventListener('click', (e) => {
    localStorage.setItem('amp-meet-attend', '1');
    e.target.textContent = '✓ Attending';
  });
  if (localStorage.getItem('amp-meet-attend')) $('#meetAttend').textContent = '✓ Attending';
}
let _cCh = '', _cData = null;
async function paintCommunity() {
  const box = $('#cFeed');
  if (!box) return;
  if (!_cData) _cData = await jget('/api/community');
  const q = ($('#cQ').value || '').toLowerCase();
  const list = _cData.posts.filter((p) => (!_cCh || p.channel === _cCh) && (!q || (p.body + p.author).toLowerCase().includes(q)) && (p.reports || 0) < 3);
  box.innerHTML = '';
  document.querySelectorAll('#cChannels button').forEach((b) => b.classList.toggle('gold', b.textContent === (_cCh || 'All')));
  list.forEach((p) => {
    const d = document.createElement('div');
    d.className = 'proj';
    d.innerHTML = `<b>${p.author}</b> <span class="price">${p.channel} • ${p.kind}</span><br>${p.body}<br><span class="muted">♥ ${p.likes} • 🎉 ${p.reactions['🎉'] || 0} • 💬 ${(p.comments || []).length}</span><br><span class="muted">${(p.comments || []).map((c) => `${c.author}: ${c.body}`).join('<br>')}</span>`;
    const row = document.createElement('div');
    row.className = 'cta';
    [['♥', 'like'], ['🎉', 'celebrate'], ['💬', 'comment'], ['⚑', 'report']].forEach(([e, label]) => {
      const b = document.createElement('button');
      b.className = 'ghost'; b.textContent = `${e} ${label}`;
      b.addEventListener('click', async () => {
        if (e === '💬') {
          const body = prompt('Reply as guest:');
          if (!body) return;
          await post('/api/community/comment', { id: p.id, author: 'Guest', body });
        } else if (e === '⚑') {
          await post('/api/community/report', { id: p.id });
        } else {
          await post('/api/community/react', { id: p.id, emoji: e });
        }
        _cData = await jget('/api/community');
        paintCommunity();
      });
      row.appendChild(b);
    });
    d.appendChild(row);
    box.appendChild(d);
  });
}
function wireCommunity() {
  if (!$('#cFeed')) return;
  jget('/api/community').then((d) => {
    _cData = d;
    $('#cCh').innerHTML = d.channels.map((c) => `<option>${c}</option>`).join('');
    const cc = $('#cChannels');
    cc.innerHTML = '';
    [''].concat(d.channels).forEach((c) => {
      const b = document.createElement('button');
      b.className = 'ghost'; b.textContent = c || 'All';
      b.addEventListener('click', () => { _cCh = c; paintCommunity(); });
      cc.appendChild(b);
    });
    paintCommunity();
  });
  $('#cQ').addEventListener('input', paintCommunity);
  $('#cPost').addEventListener('click', async () => {
    const body = $('#cBody').value.trim();
    if (!body) return;
    await post('/api/community', { channel: $('#cCh').value, kind: $('#cKind').value, author: 'Guest', body });
    $('#cBody').value = '';
    _cData = await jget('/api/community');
    paintCommunity();
  });
}
function wireCerts() {
  const btn = $('#certBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const email = ($('#certEmail').value || 'student').trim();
    const c = await jget('/api/cert?email=' + encodeURIComponent(email));
    $('#certOut').textContent = `FINAL: ${c.program}\nStudent: ${c.student} • Date: ${c.date}\nID: ${c.final.certId}\nVerify: ${c.final.url}\nSignature: ${c.signature}\n(Print this page to PDF to download • copy the link to share.)`;
    $('#certMods').innerHTML = '<h3>Module certificates (20)</h3>' + c.modules.map((m) => `<div class="proj"><b>${m.moduleId} — ${m.title}</b><br><span class="muted">ID ${m.certId}</span><br><span class="muted">${m.url}</span></div>`).join('');
  });
}
function wireEnroll() {
  const qb = $('#eQuote');
  if (!qb) return;
  const creds = () => ({ productId: $('#ePlan').value, coupon: $('#eCoupon').value, story: $('#eStory').value, email: $('#eEmail').value.trim() });
  qb.addEventListener('click', async () => {
    const c = creds();
    const q = await post('/api/enroll/quote', { productId: c.productId, coupon: c.coupon, story: c.story });
    $('#eOut').textContent = q.ok ? `Quote: $${(q.quote.subtotal / 100).toFixed(2)} - $${(q.quote.discount / 100).toFixed(2)} = $${(q.quote.total / 100).toFixed(2)}` : `Error: ${q.error}`;
  });
  $('#eBuy').addEventListener('click', async () => {
    const c = creds();
    const r = await post('/api/enroll/purchase', c);
    $('#eOut').textContent = r.ok ? `✓ Enrolled (demo, no charge).\n${r.receipt}` : `Error: ${r.error}`;
    paintBilling();
  });
  paintBilling();
}
async function paintBilling() {
  const box = $('#eHist');
  if (!box) return;
  const email = ($('#eEmail').value || '').trim();
  const d = await jget('/api/billing' + (email ? '?email=' + encodeURIComponent(email) : ''));
  box.innerHTML = d.purchases.length ? '' : '<p class="muted">No purchases yet.</p>';
  d.purchases.forEach((p) => {
    const dv = document.createElement('div');
    dv.className = 'proj';
    dv.innerHTML = `<b>${p.id} — ${p.productId}</b> <span class="price">$${(p.total / 100).toFixed(2)}</span><br><span class="muted">${p.email} • ${String(p.at).slice(0, 10)}</span>`;
    box.appendChild(dv);
  });
}
function wireNotify() {
  const list = $('#nList');
  if (!list) return;
  jget('/api/notify').then((d) => {
    list.innerHTML = '';
    d.triggers.forEach((t) => {
      const dv = document.createElement('div');
      dv.className = 'proj';
      dv.innerHTML = `<b>${t.label}</b><br><span class="muted">${t.hint}</span>`;
      list.appendChild(dv);
    });
  });
  $('#nEnable').addEventListener('click', async () => {
    if (!('Notification' in window)) { alert('Browser notifications unsupported here.'); return; }
    const r = await Notification.requestPermission();
    if (r === 'granted') {
      try { new Notification('AI-MasterPlan', { body: 'Reminders on — resume your next lesson tomorrow.' }); } catch { /* blocked */ }
      localStorage.setItem('amp-notify', '1');
    }
  });
}
function wireCms() {
  if (!$('#cmsOut')) return;
  jget('/api/cms').then((d) => {
    const b = d.dashboard;
    $('#cmsOut').textContent = `Levels ${b.levels} • Lessons ${b.lessons} • Tools ${b.tools} • Projects ${b.projects}\nPurchases ${b.purchases} • Pending reports ${b.pendingReports}`;
    $('#cmsMod').innerHTML = d.moderation.length ? '<h3>Moderation queue</h3>' + d.moderation.map((m) => `<div class="proj"><b>${m.id}</b> by ${m.author} — ⚑ ${m.reports}</div>`).join('') : '<p class="muted">Moderation queue clear.</p>';
  }).catch(() => { $('#cmsOut').textContent = 'CMS unreachable.'; });
}
const EXPLAIN_SHORT = [  ['Vibe Coding', 'Describe in words; AI writes code. You direct, check, fix.'],
  ['AI-assisted dev', 'Loop: prompt → generate → run → fix. Small loops win.'],
  ['Prompts', 'GOAL + CONTEXT + CONSTRAINTS + EXAMPLE of done.'],
  ['Frontend/backend', 'Menu+tables vs kitchen+pantry. They talk over network.'],
  ['APIs', 'Menus for software: request → JSON response. Keys server-side.'],
  ['Databases', 'Remember rows: create/read/update/delete/query.'],
  ['Deployment', 'Publish to a real link: test → internal → production.'],
  ['AI models', 'Next-word prediction; needs clear instructions + guardrails.'],
];
async function wireOnboard() {
  const btn = $('#oBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const coded = $('#oCoded').value, ai = $('#oAI').value, goal = $('#oGoal').value;
    $('#oExp').textContent = EXPLAIN_SHORT.map((e, i) => `${i + 1}. ${e[0]}: ${e[1]}`).join('\n');
    $('#oOut').textContent = 'recommending…';
    const r = await jget(`/api/onboard?coded=${coded}&ai=${ai}&goal=${goal}`);
    $('#oOut').textContent = `${r.headline}\nStart: ${r.startLessonId} (${r.fastTrack ? 'fast-track' : 'full guidance'})\nProject: ${r.focusProjectId} — ${r.focusProjectTitle}\n\nFirst week:\n- ${r.firstWeek.join('\n- ')}`;
  });
}
async function post(p, body, token) {
  const r = await fetch(p, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: JSON.stringify(body || {}) });
  return r.json();
}
function tok() { return localStorage.getItem('amp-own-token'); }
function say(t) { $('#authOut').textContent = t; }
async function refreshMe() {
  const t = tok();
  if (!t) { $('#meOut').textContent = 'Signed out.'; return null; }
  const r = await fetch('/api/me', { headers: { Authorization: 'Bearer ' + t } });
  const j = await r.json();
  if (!j.ok) { $('#meOut').textContent = 'Signed out (session expired).'; localStorage.removeItem('amp-own-token'); return null; }
  const u = j.user;
  $('#meOut').textContent = `Signed in: ${u.name} <${u.email}> • ${u.role} • verified=${u.emailVerified} • enrollment=${u.enrollmentStatus} • level ${u.currentLevel} • goals=[${u.learningGoals.join(', ') || '—'}]`;
  $('#pName').value = u.name || '';
  $('#pAvatar').value = u.avatarUrl || '';
  $('#pRole').value = u.role || 'student';
  return u;
}
function wireAuth() {
  const creds = () => ({ email: $('#aEmail').value.trim(), password: $('#aPass').value });
  $('#regBtn').addEventListener('click', async () => {
    const { email, password } = creds();
    const j = await post('/api/auth/register', { email, password });
    say(JSON.stringify(j, null, 2));
    if (j.ok) { localStorage.setItem('amp-own-token', j.token); await refreshMe(); }
  });
  $('#loginBtn').addEventListener('click', async () => {
    const { email, password } = creds();
    const j = await post('/api/auth/login', { email, password });
    say(JSON.stringify(j, null, 2));
    if (j.ok) { localStorage.setItem('amp-own-token', j.token); await refreshMe(); }
  });
  $('#googleBtn').addEventListener('click', async () => {
    const email = $('#aEmail').value.trim() || 'google.student@example.com';
    const j = await post('/api/auth/google', { email, name: 'Google Student' });
    say(JSON.stringify(j, null, 2));
    if (j.ok) { localStorage.setItem('amp-own-token', j.token); await refreshMe(); }
  });
  $('#appleBtn').addEventListener('click', async () => {
    const email = $('#aEmail').value.trim() || 'apple.student@privaterelay.apple.com';
    const j = await post('/api/auth/apple', { email, name: 'Apple Student' });
    say(JSON.stringify(j, null, 2));
    if (j.ok) { localStorage.setItem('amp-own-token', j.token); await refreshMe(); }
  });
  $('#verifyBtn').addEventListener('click', async () => {
    const j = await post('/api/auth/verify', { email: $('#aEmail').value.trim(), code: $('#aCode').value.trim() });
    say(JSON.stringify(j, null, 2));
    await refreshMe();
  });
  $('#recBtn').addEventListener('click', async () => {
    const j = await post('/api/auth/recover', { email: $('#aEmail').value.trim() });
    say(JSON.stringify(j, null, 2));
  });
  $('#resetBtn2').addEventListener('click', async () => {
    const j = await post('/api/auth/reset', { email: $('#aEmail').value.trim(), code: $('#aCode').value.trim(), newPassword: $('#aNew').value });
    say(JSON.stringify(j, null, 2));
  });
  $('#logoutBtn').addEventListener('click', async () => { localStorage.removeItem('amp-own-token'); say('Signed out.'); await refreshMe(); });
  $('#saveProfile').addEventListener('click', async () => {
    const t = tok();
    if (!t) { say('Sign in first.'); return; }
    const r = await fetch('/api/me', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: JSON.stringify({ name: $('#pName').value, avatarUrl: $('#pAvatar').value, role: $('#pRole').value }) });
    const j = await r.json();
    say(JSON.stringify(j, null, 2));
    await refreshMe();
  });
  refreshMe();
}
boot();

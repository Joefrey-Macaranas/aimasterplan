// AI-MasterPlan web server — hand-written Node using only built-in modules: http, fs, path, url.
// Hand-written Node server using only built-in modules: http, fs, path, url.
// Serves ./public + a small JSON API built from our own curriculum data.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 8082);
const ROOT = path.join(__dirname, 'public');

// ---- Our own curriculum data (hand-written, mirrors src/data/*) ----
const PRODUCT = { name: 'AI-MasterPlan', tagline: 'From zero coding to independent AI builder — learn by building.' };
const JOURNEY = ['Beginner','AI Fundamentals','Vibe Coding Basics','Build First Website','Build First Application','Connect APIs','Build AI Automation','Databases + Authentication','Build Full AI Application','Deployment','Independent System Builder'];
const LEVELS = [
  { id: 'L1', n: 1, title: 'Understanding AI & Vibe Coding', sum: 'AI, LLMs, prompts, app parts in plain words.', modules: [
    { id: 'L1M1', title: 'AI Foundations', lessons: [['L1M1L1','What is AI?',12],['L1M1L2','What is an LLM?',15],['L1M1L3','What is Vibe Coding?',15],['L1M1L4','AI vs Traditional Programming',14],['L1M1L5','Understanding Prompts',16]] },
    { id: 'L1M2', title: 'How Apps Work', lessons: [['L1M2L1','Understanding Context',14],['L1M2L2','Files and Folders',14],['L1M2L3','Basic Developer Terminology',12],['L1M2L4','Understanding an Application Architecture',18],['L1M2L5','First AI Coding Exercise',20]] } ] },
  { id: 'L2', n: 2, title: 'Setting Up Your Development Environment', sum: 'Editor, terminal, git, Node, run locally.', tools: ['ChatGPT','AI Coding Assistant','VS Code','GitHub','Git','Node.js','Terminal','Browser DevTools'], modules: [
    { id: 'L2M1', title: 'Install Your Toolkit', lessons: [['L2M1L1','Installing Required Tools',20],['L2M1L2','IDE / Code Editor Introduction',16],['L2M1L3','Git Basics',18],['L2M1L4','GitHub Account Setup',15],['L2M1L5','Node.js Installation',16]] },
    { id: 'L2M2', title: 'Run Your First Project', lessons: [['L2M2L1','Terminal Basics',15],['L2M2L2','Package Managers',14],['L2M2L3','Environment Variables',14],['L2M2L4','Project Folders',12],['L2M2L5','Running a Local Development Server',18]] } ] },
  { id: 'L3', n: 3, title: 'Build Your First Website', sum: 'Generate, style, navigate, debug, ship a site. PROJECT: Personal/Business Website.', project: 'P01', modules: [
    { id: 'L3M1', title: 'Web Basics with AI', lessons: [['L3M1L1','Generate Initial Project',20],['L3M1L2','HTML Concepts',18],['L3M1L3','CSS Concepts',20],['L3M1L4','JavaScript Concepts',20],['L3M1L5','Components',22]] },
    { id: 'L3M2', title: 'Ship a Complete Website', lessons: [['L3M2L1','Responsive Layouts',20],['L3M2L2','Navigation',16],['L3M2L3','Forms',20],['L3M2L4','Images and Assets',14],['L3M2L5','Debugging',18],['L3M2L6','Build a Complete Website',30]] } ] },
  { id: 'L4', n: 4, title: 'Build Your First Real Application', sum: 'Frontend, backend, APIs, JSON, REST, CRUD. PROJECT: Functional CRUD application.', project: 'P03', modules: [
    { id: 'L4M1', title: 'Client & Server', lessons: [['L4M1L1','Understand Frontend',16],['L4M1L2','Understand Backend',16],['L4M1L3','Understand Client/Server Communication',18],['L4M1L4','APIs',20],['L4M1L5','JSON',14],['L4M1L6','REST',16]] },
    { id: 'L4M2', title: 'CRUD in Practice', lessons: [['L4M2L1','Form Submission',22],['L4M2L2','Data Persistence',20],['L4M2L3','Error Handling + Functional CRUD Application',32]] } ] },
  { id: 'L5', n: 5, title: 'Databases & User Accounts', sum: 'Tables, queries, auth, sessions, env vars. PROJECT: Multi-user application.', project: 'P-multi', modules: [
    { id: 'L5M1', title: 'Data Basics', lessons: [['L5M1L1','Database Basics',16],['L5M1L2','Tables and Collections',18],['L5M1L3','Creating Records',18],['L5M1L4','Updating Records',16],['L5M1L5','Deleting Records',14],['L5M1L6','Querying Data',20]] },
    { id: 'L5M2', title: 'Accounts & Security', lessons: [['L5M2L1','Authentication',25],['L5M2L2','Authorization',20],['L5M2L3','User Sessions',18],['L5M2L4','User Profiles',18],['L5M2L5','Secure Environment Variables + Multi-User App',30]] } ] },
  { id: 'L6', n: 6, title: 'AI Integration', sum: 'LLM APIs, prompts, context, JSON, streaming, cost. PROJECT: AI-powered assistant.', project: 'P04', modules: [
    { id: 'L6M1', title: 'LLM APIs', lessons: [['L6M1L1','AI APIs',20],['L6M1L2','LLM API Concepts',18],['L6M1L3','System Prompts',20],['L6M1L4','User Prompts',18],['L6M1L5','Context Management',20]] },
    { id: 'L6M2', title: 'Production AI Features', lessons: [['L6M2L1','Structured Output',20],['L6M2L2','Tool and Function Calling',22],['L6M2L3','Streaming Responses',20],['L6M2L4','Error Handling',18],['L6M2L5','Usage and Cost Awareness + Assistant App',30]] } ] },
  { id: 'L7', n: 7, title: 'AI Automation', sum: 'Triggers, webhooks, schedules, approvals. PROJECT: Real-world AI automation.', project: 'P05', modules: [
    { id: 'L7M1', title: 'Automation Foundations', lessons: [['L7M1L1','Automation Fundamentals',20],['L7M1L2','Triggers',16],['L7M1L3','Actions',16],['L7M1L4','Webhooks',18],['L7M1L5','APIs for Automation',16],['L7M1L6','Scheduled Workflows',18]] },
    { id: 'L7M2', title: 'Real-World Automations', lessons: [['L7M2L1','Data Processing',18],['L7M2L2','Email Automation',20],['L7M2L3','CRM Automation',20],['L7M2L4','Social Automation',18],['L7M2L5','AI Decision Steps',22],['L7M2L6','Human Approval Workflows + Real Automation',30]] } ] },
  { id: 'L8', n: 8, title: 'AI Agents', sum: 'Tools, memory, planning, verification, multi-agent. PROJECT: Autonomous task agent.', project: 'P07', modules: [
    { id: 'L8M1', title: 'Agent Architecture', lessons: [['L8M1L1','What is an AI Agent?',20],['L8M1L2','Agent Architecture',20],['L8M1L3','Tools',20],['L8M1L4','Memory',18],['L8M1L5','Planning',20]] },
    { id: 'L8M2', title: 'Reliable Agents', lessons: [['L8M2L1','Execution',18],['L8M2L2','Verification',20],['L8M2L3','Multi-Step Tasks',22],['L8M2L4','Agent Safety and Permissions',22],['L8M2L5','Multi-Agent Workflows + Task Agent',32]] } ] },
  { id: 'L9', n: 9, title: 'Full AI System Development', sum: 'PRD to production SaaS. PROJECT: Production AI SaaS.', project: 'P09', modules: [
    { id: 'L9M1', title: 'Plan the System', lessons: [['L9M1L1','Product Requirements',22],['L9M1L2','System Architecture',22],['L9M1L3','Frontend Build',25],['L9M1L4','Backend Build',25],['L9M1L5','Database Build',22],['L9M1L6','Authentication Build',22],['L9M1L7','AI Integration Build',28]] },
    { id: 'L9M2', title: 'Build & Harden', lessons: [['L9M2L1','Agent Workflows',22],['L9M2L2','File Handling',20],['L9M2L3','Notifications',18],['L9M2L4','Logging',16],['L9M2L5','Error Handling',18],['L9M2L6','Testing',22],['L9M2L7','Security',22],['L9M2L8','Performance + SaaS Launch',30]] } ] },
  { id: 'L10', n: 10, title: 'Build Independently', sum: 'Fading hand-holding: plan, build, test, deploy solo. FINAL: own product.', project: 'P10', modules: [
    { id: 'L10M1', title: 'From Idea to Plan', lessons: [['L10M1L1','Turn an Idea into Requirements',25],['L10M1L2','Create PRD',22],['L10M1L3','Define Features',20],['L10M1L4','Design Architecture',22],['L10M1L5','Choose Technologies',18],['L10M1L6','Break Project into Tasks',20]] },
    { id: 'L10M2', title: 'Ship Your MVP', lessons: [['L10M2L1','Prompt AI Coding Agents Effectively',22],['L10M2L2','Review Generated Code',20],['L10M2L3','Debug Independently',25],['L10M2L4','Test Application',22],['L10M2L5','Deploy Application',25],['L10M2L6','Maintain Application',18],['L10M2L7','Improve + Present Your Product',35]] } ] },
];
const TOOLS = [
  ['ChatGPT','AI Assistants','Conversations, explanations, draft prompts.','freemium','💬'],
  ['AI Coding Assistant','Coding Agents','Writes/edits code from plain words. Core Vibe Coding engine.','freemium','🤖'],
  ['VS Code','IDEs','Free editor where all projects are built.','free','📝'],
  ['Figma','Design Tools','Free design tool for page mockups.','freemium','🎨'],
  ['Supabase','Databases','Postgres + auth + storage with instant APIs.','freemium','🗄️'],
  ['n8n','Automation Platforms','Visual workflow builder: triggers → AI → actions.','freemium','🔗'],
  ['Node.js','APIs','Runs JS + dev servers locally.','free','🟢'],
  ['GitHub','Git/GitHub','Hosts code, backup, portfolio.','free','🐙'],
  ['Git','Git/GitHub','Version control — undo mistakes.','free','🌿'],
  ['Netlify','Hosting','Free static hosting with deploy previews.','freemium','🌐'],
  ['Expo','Deployment','Ships this mobile app to iOS + Android.','free','📱'],
  ['Browser DevTools','Testing','Inspect + debug pages (F12).','free','🔍'],
  ['Terminal','Productivity','Run servers, git, commands.','free','⌨️'],
];
const PROJECTS = [
  ['P01','Personal Website',3,'3 pages, responsive, contact form','Static site + components','HTML • CSS • JS','Install VS Code → scaffold → run dev → add assets','Generate → Style → Navigate → Debug → Publish','Static hosting','Responsive + form + live URL'],
  ['P02','Landing Page',3,'Hero, features, signup form','Single-page marketing site','HTML • CSS • JS','Sketch → scaffold from sketch → dev with phone view','Copy → Sections → Form → Polish','Static hosting','Clear CTA + mobile + tested signup'],
  ['P03','CRUD Application',4,'Create/read/update/delete + errors','Frontend + REST API (JSON)','JS • Node • REST','Define item shape → run API + client → open Network tab','API → UI → Forms → Errors','Web host','All CRUD works live'],
  ['P04','AI Chat Application',6,'Chat UI, LLM API, streaming','Chat client → server → LLM (keys server-side)','JS • LLM API','Key in server .env only → scaffold chat + /api/chat → set caps','Prompts → API → Streaming → Caps','Web host','Streams + handles errors + capped'],
  ['P05','Business Automation',7,'Trigger, AI step, notify + approval','Webhook → AI → CRM/email + approval gate','Webhooks • n8n • LLM','n8n workflow + test trigger → connect source → dry-run mode','Trigger → AI decision → Action → Approval','Automation platform','Approval gate + CRM + alerts'],
  ['P06','AI Customer Support System',7,'FAQ bot, escalation, logs','Chat → KB retriever → grounded answers → handoff','LLM API • DB','Write 10 FAQs → scaffold chat + /api/support → review queue','KB → Bot → Handoff','Web + API','Escalates with context, never invents'],
  ['P07','AI Agent',8,'Tools, memory, verify, permissions','Planner → allowlisted tools → verifier + memory','LLM API • Agent runtime','Define goal + 2 tools → allowlist → run log','Tools → Memory → Verify → Permissions','Sandboxed host','Allowlist + verify + end-to-end demo'],
  ['P08','Mobile Application',9,'Expo app, auth, push','Expo → API → Postgres + push','Expo • Supabase','create-expo-app → Expo Go → Supabase .env → EAS id','Screens → API → Auth → Store build','TestFlight + Play tracks','Runs on phone, auth + push tested'],
  ['P09','SaaS Application',9,'Auth, AI feature, launch checklist','Web → API → Postgres RLS → AI + jobs','JS • Node • Postgres','Scaffold from PRD → users+plans RLS → monitoring first','PRD → Build → Harden → Launch','Prod host + CDN','Secure + monitored + demo video'],
  ['P10',"Student's Own AI Product",10,'PRD, MVP, AI, deploy, demo','Student-designed, L9-hardened','Student choice','One-page PRD → MVP slice → repo + hosting','Idea → MVP → AI → Test → Deploy → Present','Student launch','Live demo + docs + maintainable'],
];

function planFor(idea) {
  const s = String(idea || 'My AI app idea').slice(0, 500);
  const lower = s.toLowerCase();
  const feats = ['User accounts', 'Core workflow', 'AI-assisted step', 'Notifications'];
  if (lower.includes('facebook')) feats.push('Auto-reply to inquiries', 'Lead capture + CRM save');
  if (lower.includes('lead')) feats.push('Lead scoring with AI', 'Human approval before sending');
  return {
    definition: s,
    features: feats,
    stack: ['Expo (mobile app)', 'Supabase (Postgres + auth + storage)', 'LLM API (server-side)'],
    architecture: lower.includes('facebook')
      ? 'Messenger webhook → API → AI reply + lead save (human approval for promos).'
      : 'Mobile app → secure API → Postgres; AI calls server-side only (keys never in client).',
    todos: ['Write 1-page PRD', 'Design 3 screens', 'Build auth', 'Build core CRUD', 'Add AI step', 'Test on device', 'Deploy'],
    deployment: 'EAS build → TestFlight/Play internal → production + monitoring',
  };
}

const CHANNELS = ['Introductions', 'Beginner Help', 'Vibe Coding', 'AI Automation', 'AI Agents', 'Web Development', 'Mobile Development', 'Project Showcase', 'Weekly Meet Discussions'];
const COMMUNITY_FILE = () => path.join(__dirname, 'data', 'community.json');
const DATA_MKDIR = () => { try { fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true }); } catch { /* read-only */ } };
function community() {
  try {
    const d = JSON.parse(fs.readFileSync(COMMUNITY_FILE(), 'utf8'));
    if (Array.isArray(d) && d.length) return d;
  } catch { /* seed below */ }
  return [
    { id: 'c1', channel: 'Introductions', kind: 'general', author: 'Maya', body: 'Zero coding experience — excited to build my first site! @Leo study buddies?', likes: 12, reactions: { '♥': 12, '🎉': 4 }, comments: [{ author: 'Leo', body: 'Yes @Maya! L1 together.' }], reports: 0 },
    { id: 'c2', channel: 'Beginner Help', kind: 'help', author: 'Leo', body: 'Stuck on Node install — "command not found" on Mac? L2M1L1 step 3.', likes: 4, reactions: { '♥': 4 }, comments: [], reports: 0 },
    { id: 'c3', channel: 'Project Showcase', kind: 'showcase', author: 'Aya', body: 'Shipped my personal website (P01)! Link inside.', likes: 21, reactions: { '♥': 21, '🎉': 15 }, comments: [{ author: 'Maya', body: 'Congrats @Aya!' }], reports: 0 },
    { id: 'c4', channel: 'Project Showcase', kind: 'win', author: 'Leo', body: 'Milestone: finished Level 1 — 10/10 lessons!', likes: 9, reactions: { '🎉': 9 }, comments: [], reports: 0 },
    { id: 'c5', channel: 'Vibe Coding', kind: 'question', author: 'Sam', body: 'Does context mean pasting EVERY file, or just the one changing? L1M2L1', likes: 6, reactions: { '♥': 6 }, comments: [], reports: 0 },
  ];
}
function saveCommunity(all) {
  DATA_MKDIR();
  try { fs.writeFileSync(COMMUNITY_FILE(), JSON.stringify(all, null, 2)); } catch { /* read-only */ }
}

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain' };

// ---- Own auth store (file-backed, demo only — passwords are dev-hashed, like the app) ----
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
function loadUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); } catch { return {}; }
}
function saveUsers(u) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2)); } catch { /* read-only env */ }
}
const TOKENS = new Map(); // token -> email (in-memory sessions; persistent login via client localStorage)
const norm = (e) => String(e || '').trim().toLowerCase();
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(norm(e));
function devHash(s) { let h = 0x811c9dc5; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return 'dev-' + h.toString(16).padStart(8, '0'); }
function six(from) { let h = 0; from = String(from); for (const c of from) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0; return String(100000 + (h % 900000)); }
const vcode = (email) => six('verify:' + norm(email));
const rcode = (email, nonce) => six('recover:' + norm(email) + ':' + nonce);
function pub(u) {
  return { email: u.email, name: u.name, avatarUrl: u.avatarUrl || null, experienceLevel: u.experienceLevel, learningGoals: u.learningGoals, currentLevel: u.currentLevel, enrollmentStatus: u.enrollmentStatus, emailVerified: u.emailVerified, provider: u.provider, role: u.role, createdAt: u.createdAt };
}
function tokenFor(email) {
  const t = 'own-' + devHash(email + ':' + Date.now()).slice(4) + devHash(String(Math.random())).slice(4, 8);
  TOKENS.set(t, norm(email));
  return t;
}
function bearer(req) {
  const h = req.headers.authorization || '';
  const m = h.match(/^Bearer\s+(.+)$/);
  return m ? m[1] : null;
}
function readJson(req) {
  return new Promise((resolve) => {
    let b = '';
    req.on('data', (c) => { b += c; if (b.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(b || '{}')); } catch { resolve({}); } });
  });
}

function send(res, code, body, type) {
  res.writeHead(code, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'X-Powered-By': 'AI-MasterPlan',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url || '/', 'http://x');
  const p = u.pathname;

  // ---- API ----
  if (p === '/api/health') return send(res, 200, JSON.stringify({ ok: true, program: 'ai-masterplan', port: PORT }), MIME['.json']);
  if (p === '/api/overview') { const total = LEVELS.reduce((n, lv) => n + lv.modules.reduce((a, m) => a + m.lessons.length, 0), 0); return send(res, 200, JSON.stringify({ product: PRODUCT, journey: JOURNEY, levels: LEVELS.length, lessons: total, tools: TOOLS.length, projects: PROJECTS.length }), MIME['.json']); }
  if (p === '/api/curriculum') return send(res, 200, JSON.stringify({ levels: LEVELS }), MIME['.json']);
  if (p === '/api/tools') return send(res, 200, JSON.stringify({ tools: TOOLS.map((t) => ({ name: t[0], cat: t[1], what: t[2], price: t[3], icon: t[4] })), categories: 12 }), MIME['.json']);
  if (p === '/api/projects') return send(res, 200, JSON.stringify({ projects: PROJECTS.map((x) => ({ id: x[0], title: x[1], level: x[2], req: x[3], arch: x[4], stack: x[5], setup: x[6], stages: x[7], deploy: x[8], done: x[9] })) }), MIME['.json']);
  if (p === '/api/plan') return send(res, 200, JSON.stringify(planFor(u.searchParams.get('idea'))), MIME['.json']);
  if (p === '/api/cms') {
    let reports = [];
    try {
      const all = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'community.json'), 'utf8'));
      reports = all.filter((x) => (x.reports || 0) > 0).map((x) => ({ id: x.id, author: x.author, reports: x.reports }));
    } catch { /* none */ }
    let purchases = 0;
    try { purchases = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'purchases.json'), 'utf8')).length; } catch { /* none */ }
    const lessons = LEVELS.reduce((n, lv) => n + lv.modules.reduce((a, m) => a + m.lessons.length, 0), 0);
    return send(res, 200, JSON.stringify({
      dashboard: { levels: LEVELS.length, lessons, tools: TOOLS.length, projects: PROJECTS.length, purchases, pendingReports: reports.length },
      moderation: reports,
    }), MIME['.json']);
  }
  if (p === '/api/notify') {
    return send(res, 200, JSON.stringify({ triggers: [
      { label: 'New module', hint: 'A new module lands in your path.' },
      { label: 'New lesson', hint: 'A fresh walkthrough is ready.' },
      { label: 'Continue learning', hint: 'Daily nudge with your next lesson.' },
      { label: 'Weekly Meet & Greet', hint: '24h before the session.' },
      { label: 'Meeting starting soon', hint: '1h before the session.' },
      { label: 'Instructor announcement', hint: 'Tips + course news.' },
      { label: 'Comment / reply', hint: 'Someone answered you.' },
      { label: 'Achievement unlocked', hint: 'The moment a badge is earned.' },
      { label: 'Project milestone', hint: 'Stage and project completions.' },
    ] }), MIME['.json']);
  }
  // --- enrollment commerce: products, quotes, purchases, history, invoices ---
  const PRODUCTS = [
    { id: 'free-audit', title: 'Free Audit', kind: 'free', price: 0 },
    { id: 'lifetime', title: 'Lifetime Access', kind: 'once', price: 14900 },
    { id: 'monthly', title: 'Monthly Plan', kind: 'sub', price: 1900 },
  ];
  const COUPONS = { WELCOME20: 20, BUILDER50: 50, SCHOLAR100: 100 };
  const money = (c) => '$' + (c / 100).toFixed(2);
  const quoteFor = (pid, code, story) => {
    const pr = PRODUCTS.find((x) => x.id === pid);
    if (!pr) return { ok: false, error: 'unknown plan' };
    if (pr.kind === 'free') return { ok: true, quote: { subtotal: 0, discount: 0, total: 0, free: true } };
    let pct = 0;
    if (String(code || '').trim()) {
      const c = String(code).trim().toUpperCase();
      if (!COUPONS[c]) return { ok: false, error: 'bad code (try WELCOME20)' };
      if (c === 'SCHOLAR100' && String(story || '').trim().length < 20) return { ok: false, error: 'SCHOLAR100 needs your story (20+ chars)' };
      pct = COUPONS[c];
    }
    const d = Math.round((pr.price * pct) / 100);
    return { ok: true, quote: { subtotal: pr.price, discount: d, total: pr.price - d, coupon: code ? String(code).trim().toUpperCase() : undefined, free: pr.price - d === 0 } };
  };
  if (p === '/api/products') return send(res, 200, JSON.stringify({ products: PRODUCTS, coupons: Object.keys(COUPONS) }), MIME['.json']);
  if (p === '/api/enroll/quote' && req.method === 'POST') {
    return readJson(req).then((b) => send(res, 200, JSON.stringify(quoteFor(b.productId, b.coupon, b.story)), MIME['.json']));
  }
  if (p === '/api/enroll/purchase' && req.method === 'POST') {
    return readJson(req).then((b) => {
      const email = String(b.email || '').toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return send(res, 400, JSON.stringify({ ok: false, error: 'invalid email' }), MIME['.json']);
      const q = quoteFor(b.productId, b.coupon, b.story);
      if (!q.ok) return send(res, 400, JSON.stringify(q), MIME['.json']);
      const at = new Date().toISOString();
      let h = 0;
      for (const c of email + b.productId + at) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
      const inv = { id: 'INV-' + h.toString(16).toUpperCase().padStart(8, '0'), email, productId: b.productId, ...q.quote, at };
      DATA_MKDIR();
      const F = path.join(__dirname, 'data', 'purchases.json');
      let all = [];
      try { all = JSON.parse(fs.readFileSync(F, 'utf8')); } catch { /* fresh */ }
      all.unshift(inv);
      try { fs.writeFileSync(F, JSON.stringify(all, null, 2)); } catch { /* read-only */ }
      return send(res, 200, JSON.stringify({ ok: true, invoice: inv, receipt: `AI-MasterPlan receipt\nInvoice ${inv.id}\n${email} • ${b.productId}\n${money(inv.subtotal)} - ${money(inv.discount)} = ${money(inv.total)}` }), MIME['.json']);
    });
  }
  if (p === '/api/billing' && req.method === 'GET') {
    const email = String(u.searchParams.get('email') || '').toLowerCase();
    let all = [];
    try { all = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'purchases.json'), 'utf8')); } catch { /* none */ }
    return send(res, 200, JSON.stringify({ purchases: all.filter((x) => !email || x.email === email) }), MIME['.json']);
  }
  if (p === '/api/cert') {
    const email = String(u.searchParams.get('email') || 'student').toLowerCase();
    const hash = (s) => { let h = 0; s = String(s); for (const c of s) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0; return 'AMP-' + h.toString(16).toUpperCase().padStart(8, '0'); };
    const date = new Date().toISOString().slice(0, 10);
    const mods = LEVELS.flatMap((lv) => lv.modules.map((m) => {
      const id = hash(email + '#' + m.id + '#AI-MasterPlan');
      return { moduleId: m.id, title: m.title, certId: id, url: 'https://verify.aimasterplan.app/c/' + id };
    }));
    const fin = hash(email + '-AI-MasterPlan');
    return send(res, 200, JSON.stringify({
      ok: true, student: email, program: 'Independent AI System Builder (AI-MasterPlan)', date,
      signature: 'The AI-MasterPlan Author, Course Author & Vibe Coding Coach',
      final: { certId: fin, url: 'https://verify.aimasterplan.app/c/' + fin },
      modules: mods,
    }), MIME['.json']);
  }
  if (p === '/api/community' && req.method === 'GET') {
    return send(res, 200, JSON.stringify({ channels: CHANNELS, posts: community() }), MIME['.json']);
  }
  if (p === '/api/community' && req.method === 'POST') {
    return readJson(req).then((b) => {
      const all = community();
      const post = { id: 'u-' + Date.now(), channel: String(b.channel || 'Introductions'), kind: String(b.kind || 'question'), author: String(b.author || 'Anonymous').slice(0, 40), body: String(b.body || '').slice(0, 500), likes: 0, reactions: {}, comments: [], reports: 0 };
      if (!post.body.trim()) return send(res, 400, JSON.stringify({ ok: false, error: 'empty' }), MIME['.json']);
      all.unshift(post);
      saveCommunity(all);
      return send(res, 200, JSON.stringify({ ok: true, post }), MIME['.json']);
    });
  }
  if ((p === '/api/community/react' || p === '/api/community/comment' || p === '/api/community/report') && req.method === 'POST') {
    return readJson(req).then((b) => {
      const all = community();
      const post = all.find((x) => x.id === b.id);
      if (!post) return send(res, 404, JSON.stringify({ ok: false }), MIME['.json']);
      if (p.endsWith('/react')) {
        const e = String(b.emoji || '♥');
        post.reactions[e] = (post.reactions[e] || 0) + 1;
        if (e === '♥') post.likes++;
      }
      if (p.endsWith('/comment') && String(b.body || '').trim()) {
        post.comments.push({ author: String(b.author || 'Anonymous').slice(0, 40), body: String(b.body).slice(0, 300) });
      }
      if (p.endsWith('/report')) post.reports++;
      saveCommunity(all);
      return send(res, 200, JSON.stringify({ ok: true, post }), MIME['.json']);
    });
  }
  if (p === '/api/meet') {
    const start = new Date(Date.now() + 3 * 864e5).toISOString();
    return send(res, 200, JSON.stringify({
      ok: true,
      session: { id: 'meet-weekly', title: 'Weekly Meet & Greet with the Author', startsAt: start, url: 'https://meet.aimasterplan.app/weekly', recurring: 'weekly', enrolled: 'all enrolled students' },
      author: { name: 'The AI-MasterPlan Author', role: 'Course author & Vibe Coding coach' },
      format: ['Welcome / community updates (8m)', 'Student Q&A (15m)', 'Project troubleshooting (12m)', 'Student project showcase (10m)', 'New AI / Vibe Coding tips (5m)', 'Open discussion (5m)', "What's coming next (5m)"],
      archive: [
        { id: 'meet-2026-w40', title: 'Week 40 — First websites go live', recording: 'https://cdn.aimasterplan.app/recordings/meet-2026-w40.mp4' },
        { id: 'meet-2026-w39', title: 'Week 39 — Terminal without fear', recording: 'https://cdn.aimasterplan.app/recordings/meet-2026-w39.mp4' },
        { id: 'meet-2026-w38', title: 'Week 38 — Prompts that build', recording: 'https://cdn.aimasterplan.app/recordings/meet-2026-w38.mp4' },
      ],
    }), MIME['.json']);
  }
  if (p === '/api/ask') {
    const q = String(u.searchParams.get('q') || '');
    const lid = String(u.searchParams.get('lesson') || '');
    const proj = String(u.searchParams.get('project') || '');
    const ql = q.toLowerCase();
    const findL = (id) => { for (const lv of LEVELS) for (const m of lv.modules) for (const L of m.lessons) if (L[0] === id) return { id: L[0], title: L[1] }; return null; };
    const les = findL(lid);
    const pj = PROJECTS.find((x) => x[0] === proj);
    const tail = pj ? ` Your project ${pj[0]} (${pj[1]}) uses this next.` : '';
    let a;
    if (/error|not working|different/.test(ql)) a = `Debug in 3 steps: (1) exact message, (2) compare with "What should I see?"${les ? ` in ${les.id}` : ''}, (3) re-run the last step only. Which step are you on?`;
    else if (/next/.test(ql)) a = les ? `Next: finish "${les.id} — ${les.title}", then continue the module in order.${tail}` : 'Next: continue your first incomplete lesson. Small wins compound.';
    else if (/check|followed|correctly|did i do/.test(ql)) a = les ? `Verify ${les.id} together: (1) objective done — ${les.title}, (2) ran the step command, (3) screen matches expected. Which fails?` : 'Tell me the lesson ID + which checklist item fails.';
    else if (/explain|simply/.test(ql)) a = 'Simple version: frontend = menu/table (what you see), backend = kitchen (does the work), database = pantry (stores). Which part feels fuzzy?';
    else if (/prompt/.test(ql)) a = 'Strong prompt: GOAL + CONTEXT + CONSTRAINTS + EXAMPLE of DONE. Paste yours.';
    else if (/code/.test(ql)) a = 'Paste code + expected vs actual. I explain line-by-line.';
    else a = 'Tell me: (1) lesson, (2) what you did, (3) expected vs saw. Hints first, never ahead.';
    return send(res, 200, JSON.stringify({ ok: true, answer: a, lesson: les, skill: 'beginner' }), MIME['.json']);
  }
  if (p === '/api/onboard') {
    const coded = ['never', 'little', 'yes'].includes(String(u.searchParams.get('coded'))) ? String(u.searchParams.get('coded')) : 'never';
    const ai = ['never', 'chat', 'agent'].includes(String(u.searchParams.get('ai'))) ? String(u.searchParams.get('ai')) : 'never';
    const goal = ['website', 'mobile', 'automation', 'agent', 'business', 'saas', 'personal'].includes(String(u.searchParams.get('goal'))) ? String(u.searchParams.get('goal')) : 'website';
    const GMAP = { website: ['L3M1L1', 'P01', 'Personal Website'], personal: ['L3M1L1', 'P01', 'Personal Website'], mobile: ['L4M1L1', 'P08', 'Mobile Application'], automation: ['L7M1L1', 'P05', 'Business Automation'], business: ['L7M1L1', 'P05', 'Business Automation'], agent: ['L8M1L1', 'P07', 'AI Agent'], saas: ['L9M1L1', 'P09', 'SaaS Application'] };
    const g = GMAP[goal];
    const fast = coded === 'yes' && ai === 'agent';
    return send(res, 200, JSON.stringify({
      ok: true, answers: { coded, aiTools: ai, goal },
      headline: fast ? `Fast-track: Level 1 basics → ${g[2]}` : `Start at Level 1 — your ${g[2].toLowerCase()} comes at ${g[0].slice(0, 2)}`,
      startLessonId: fast ? g[0] : 'L1M1L1', fastTrack: fast,
      focusProjectId: g[1], focusProjectTitle: g[2],
      firstWeek: fast
        ? [`Day 1–2: skim L1+L2 setup.`, `Day 3–5: enter at ${g[0]}, build first slice of ${g[1]}.`, 'Day 6–7: test + post screenshot.']
        : ['Day 1–2: L1M1 — what AI is + first AI page.', 'Day 3–4: L1M2+L2M1 — how apps work, install tools.', 'Day 5–7: L2M2 — run first project locally.'],
      explainers: 8,
    }), MIME['.json']);
  }

  // ---- Own auth API (POST JSON; GET /api/me with Bearer) ----
  if (p.startsWith('/api/auth/') || p === '/api/me') {
    if (req.method === 'GET' && p === '/api/me') {
      const users = loadUsers();
      const em = TOKENS.get(bearer(req) || '');
      const usr = em && users[em];
      if (!usr) return send(res, 401, JSON.stringify({ ok: false, error: 'not signed in' }), MIME['.json']);
      return send(res, 200, JSON.stringify({ ok: true, user: pub(usr) }), MIME['.json']);
    }
    if (req.method === 'PUT' && p === '/api/me') {
      return readJson(req).then((b) => {
        const users = loadUsers();
        const em = TOKENS.get(bearer(req) || '');
        const usr = em && users[em];
        if (!usr) return send(res, 401, JSON.stringify({ ok: false, error: 'not signed in' }), MIME['.json']);
        if (typeof b.name === 'string' && b.name.trim()) usr.name = b.name.trim().slice(0, 60);
        if (typeof b.avatarUrl === 'string') usr.avatarUrl = b.avatarUrl.trim() || null;
        if (['none', 'beginner', 'intermediate'].includes(b.experienceLevel)) usr.experienceLevel = b.experienceLevel;
        if (Array.isArray(b.learningGoals)) usr.learningGoals = b.learningGoals.map(String).map((x) => x.slice(0, 60)).slice(0, 8);
        if (Number.isFinite(+b.currentLevel)) usr.currentLevel = Math.max(1, Math.min(10, Math.round(+b.currentLevel)));
        if (['pending', 'active', 'completed', 'suspended'].includes(b.enrollmentStatus)) usr.enrollmentStatus = b.enrollmentStatus;
        if (['student', 'instructor', 'author', 'admin'].includes(b.role)) usr.role = b.role; // demo switcher; prod: admin-only
        saveUsers(users);
        return send(res, 200, JSON.stringify({ ok: true, user: pub(usr) }), MIME['.json']);
      });
    }
    if (req.method === 'POST') {
      return readJson(req).then((b) => {
        const users = loadUsers();
        const action = p.slice('/api/auth/'.length);
        if (action === 'register') {
          const em = norm(b.email);
          if (!emailOk(em)) return send(res, 400, JSON.stringify({ ok: false, error: 'invalid email' }), MIME['.json']);
          if (typeof b.password !== 'string' || b.password.length < 8) return send(res, 400, JSON.stringify({ ok: false, error: 'password: 8+ chars' }), MIME['.json']);
          if (users[em]) return send(res, 409, JSON.stringify({ ok: false, error: 'email exists — sign in' }), MIME['.json']);
          users[em] = { email: em, name: String(b.name || em.split('@')[0]).slice(0, 60), passHash: devHash(em + ':' + b.password), provider: 'password', emailVerified: false, avatarUrl: null, experienceLevel: 'none', learningGoals: [], currentLevel: 1, enrollmentStatus: 'pending', role: 'student', createdAt: new Date().toISOString(), recoveryNonce: null };
          saveUsers(users);
          return send(res, 200, JSON.stringify({ ok: true, token: tokenFor(em), user: pub(users[em]), verificationCode: vcode(em) }), MIME['.json']);
        }
        if (action === 'login') {
          const em = norm(b.email);
          const usr = users[em];
          if (!usr || (usr.provider === 'password' && usr.passHash !== devHash(em + ':' + String(b.password || '')))) {
            return send(res, 401, JSON.stringify({ ok: false, error: 'wrong email or password' }), MIME['.json']);
          }
          return send(res, 200, JSON.stringify({ ok: true, token: tokenFor(em), user: pub(usr) }), MIME['.json']);
        }
        if (action === 'google' || action === 'apple') {
          const em = norm(b.email);
          if (!emailOk(em)) return send(res, 400, JSON.stringify({ ok: false, error: 'provider email missing' }), MIME['.json']);
          if (!users[em]) {
            users[em] = { email: em, name: String(b.name || em.split('@')[0]).slice(0, 60), passHash: null, provider: action, emailVerified: true, avatarUrl: b.avatarUrl || null, experienceLevel: 'none', learningGoals: [], currentLevel: 1, enrollmentStatus: 'active', role: 'student', createdAt: new Date().toISOString(), recoveryNonce: null };
          } else {
            users[em].emailVerified = true;
            if (users[em].enrollmentStatus === 'pending') users[em].enrollmentStatus = 'active';
            if (b.name) users[em].name = String(b.name).slice(0, 60);
          }
          saveUsers(users);
          return send(res, 200, JSON.stringify({ ok: true, token: tokenFor(em), user: pub(users[em]) }), MIME['.json']);
        }
        if (action === 'verify') {
          const em = norm(b.email);
          const usr = users[em];
          if (!usr) return send(res, 404, JSON.stringify({ ok: false, error: 'no account' }), MIME['.json']);
          if (String(b.code || '').trim() !== vcode(em)) return send(res, 400, JSON.stringify({ ok: false, error: 'wrong code' }), MIME['.json']);
          usr.emailVerified = true;
          if (usr.enrollmentStatus === 'pending') usr.enrollmentStatus = 'active';
          saveUsers(users);
          return send(res, 200, JSON.stringify({ ok: true, user: pub(usr) }), MIME['.json']);
        }
        if (action === 'recover') {
          const em = norm(b.email);
          const usr = users[em];
          const nonce = new Date().toISOString();
          if (usr) { usr.recoveryNonce = nonce; saveUsers(users); }
          return send(res, 200, JSON.stringify({ ok: true, recoveryCode: rcode(em, usr ? nonce : 'unknown') }), MIME['.json']);
        }
        if (action === 'reset') {
          const em = norm(b.email);
          const usr = users[em];
          if (!usr || !usr.recoveryNonce) return send(res, 400, JSON.stringify({ ok: false, error: 'request a code first' }), MIME['.json']);
          if (String(b.code || '').trim() !== rcode(em, usr.recoveryNonce)) return send(res, 400, JSON.stringify({ ok: false, error: 'wrong code' }), MIME['.json']);
          if (typeof b.newPassword !== 'string' || b.newPassword.length < 8) return send(res, 400, JSON.stringify({ ok: false, error: 'password: 8+ chars' }), MIME['.json']);
          usr.passHash = devHash(em + ':' + b.newPassword);
          usr.provider = 'password';
          usr.recoveryNonce = null;
          saveUsers(users);
          return send(res, 200, JSON.stringify({ ok: true }), MIME['.json']);
        }
        return send(res, 404, JSON.stringify({ ok: false, error: 'unknown auth action' }), MIME['.json']);
      });
    }
    return send(res, 405, JSON.stringify({ ok: false, error: 'method not allowed' }), MIME['.json']);
  }

  // ---- Static ----
  let file = p === '/' ? '/index.html' : p;
  const full = path.normalize(path.join(ROOT, file));
  if (!full.startsWith(ROOT)) return send(res, 403, 'forbidden');
  fs.readFile(full, (err, data) => {
    if (err) {
      // SPA fallback: unknown paths serve index (our own router handles #/ routes client-side)
      if (!path.extname(full)) {
        fs.readFile(path.join(ROOT, 'index.html'), (e2, d2) => {
          if (e2) return send(res, 404, 'not found');
          return send(res, 200, d2, MIME['.html']);
        });
        return;
      }
      return send(res, 404, 'not found');
    }
    return send(res, 200, data, MIME[path.extname(full)] || 'application/octet-stream');
  });
});

server.listen(PORT, () => console.log(`AI-MasterPlan serving on http://localhost:${PORT} (pid ${process.pid})`));

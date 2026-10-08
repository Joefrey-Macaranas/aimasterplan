// PHASE 05 — AI MASTERPLAN LEARNING ROADMAP (Levels 1-10)
// Every lesson satisfies PHASE 06 required fields.
import type { Level, Module, Lesson } from '../types/models';

function lesson(
  id: string, moduleId: string, index: number, title: string, objective: string,
  minutes: number, promptEx: string, cmdEx: string, codeEx: string,
): Lesson {
  return {
    id, moduleId, index, title, objective,
    expectedOutcome: `Student can demonstrate: ${objective.toLowerCase()}`,
    difficulty: index === 0 ? 'beginner' : 'easy',
    minutes,
    intro: `${title}: why it matters before how it works. No jargon, plain words first.`,
    concept: `${objective}. WHY before HOW, with a real example a non-coder can follow.`,
    videoUrl: `https://cdn.aimasterplan.app/videos/${id}.mp4`,
    chapters: [
      { time: '00:00', seconds: 0, title: 'Introduction' },
      { time: '02:15', seconds: 135, title: 'Project Setup' },
      { time: '05:30', seconds: 330, title: 'AI Prompt' },
      { time: '09:20', seconds: 560, title: 'Editing Code' },
      { time: '14:10', seconds: 850, title: 'Testing' },
      { time: '17:30', seconds: 1050, title: 'Debugging' },
      { time: '21:00', seconds: 1260, title: 'Deployment' },
    ],
    transcript: `${title} transcript. Every important step is demonstrated and narrated slowly.`,
    steps: [
      { kind: 'USER_ACTION', label: 'What you do', body: 'Open the tool and follow the on-screen checklist.' },
      { kind: 'AI_PROMPT', label: 'Prompt to copy', body: promptEx },
      { kind: 'TERMINAL_COMMAND', label: 'Command to run', body: cmdEx },
      { kind: 'CODE', label: 'Code used', body: codeEx },
      { kind: 'EXPECTED_RESULT', label: 'What should I see?', body: 'You should see a success message and the expected screen shown in the walkthrough screenshot.' },
    ],
    promptsUsed: [promptEx],
    commandsUsed: [cmdEx],
    codeUsed: [codeEx],
    toolsRequired: ['AI coding assistant', 'VS Code', 'Terminal'],
    resources: [
      { name: `${title} — starter project`, url: `https://cdn.aimasterplan.app/starter/${id}.zip` },
      { name: `${title} — finished project`, url: `https://cdn.aimasterplan.app/finished/${id}.zip` },
    ],
    commonErrors: [
      { error: 'Command not found', fix: 'Close and reopen the terminal, then verify installation with --version.' },
      { error: 'Mine looks different', fix: 'Compare with the "What should I see?" screenshot; check the troubleshooting guide step-by-step.' },
    ],
    troubleshooting: [
      'Stop: read the exact error message word for word — do not guess.',
      'Compare your screen with the EXPECTED RESULT box in the steps above.',
      `Re-run only the last step of "${title}" — most issues come from skipping one line.`,
      'Check the Common errors cards below; apply the matching fix exactly.',
      'Still stuck? Ask the Learning Assistant with: lesson ID, what you did, expected vs what you saw.',
    ],
    knowledgeCheck: [{ q: `What is the main goal of: ${title}?`, options: [objective, 'Unrelated task', 'Skip testing'], answer: 0 }],
    exercise: `Repeat the tutorial once without pausing the video, using only the written steps.`,
    checklist: ['Watched walkthrough', 'Copied prompt and ran it', 'Completed exercise', 'Passed knowledge check'],
  };
}

export const LEVELS: Level[] = [
  { id: 'L1', courseId: 'vibe-coding', index: 1, title: 'Understanding AI & Vibe Coding', summary: 'What AI, LLMs, prompts and app architecture really are.' },
  { id: 'L2', courseId: 'vibe-coding', index: 2, title: 'Setting Up Your Development Environment', summary: 'Tools, editor, terminal, git, Node and running locally.' },
  { id: 'L3', courseId: 'vibe-coding', index: 3, title: 'Build Your First Website', summary: 'Generate, style, navigate, debug and ship a complete site.' },
  { id: 'L4', courseId: 'vibe-coding', index: 4, title: 'Build Your First Real Application', summary: 'Frontend, backend, APIs, JSON, REST and CRUD.' },
  { id: 'L5', courseId: 'vibe-coding', index: 5, title: 'Databases & User Accounts', summary: 'Records, queries, auth, sessions and secure env vars.' },
  { id: 'L6', courseId: 'vibe-coding', index: 6, title: 'AI Integration', summary: 'LLM APIs, prompts, context, structured output, streaming, cost.' },
  { id: 'L7', courseId: 'vibe-coding', index: 7, title: 'AI Automation', summary: 'Triggers, webhooks, schedules, email/CRM/social automation.' },
  { id: 'L8', courseId: 'vibe-coding', index: 8, title: 'AI Agents', summary: 'Tools, memory, planning, execution, verification, multi-agent.' },
  { id: 'L9', courseId: 'vibe-coding', index: 9, title: 'Full AI System Development', summary: 'PRD to production SaaS: arch, files, notify, log, test, secure.' },
  { id: 'L10', courseId: 'vibe-coding', index: 10, title: 'Build Independently', summary: 'Reduced hand-holding: plan, build, test, deploy your own MVP.' },
];

export const MODULES: Module[] = [
  { id: 'L1M1', levelId: 'L1', index: 1, title: 'AI Foundations', summary: 'AI, LLM, Vibe Coding, AI vs traditional, prompts.' },
  { id: 'L1M2', levelId: 'L1', index: 2, title: 'How Apps Work', summary: 'Context, files, terminology, architecture, first exercise.' },
  { id: 'L2M1', levelId: 'L2', index: 1, title: 'Install Your Toolkit', summary: 'Tools, IDE, git, GitHub, Node.' },
  { id: 'L2M2', levelId: 'L2', index: 2, title: 'Run Your First Project', summary: 'Terminal, packages, env vars, folders, dev server.' },
  { id: 'L3M1', levelId: 'L3', index: 1, title: 'Web Basics with AI', summary: 'Generate project, HTML, CSS, JS, components.' },
  { id: 'L3M2', levelId: 'L3', index: 2, title: 'Ship a Complete Website', summary: 'Responsive, nav, forms, assets, debug + complete site. PROJECT: Personal/Business Website.' },
  { id: 'L4M1', levelId: 'L4', index: 1, title: 'Client & Server', summary: 'Frontend, backend, client/server, APIs, JSON, REST.' },
  { id: 'L4M2', levelId: 'L4', index: 2, title: 'CRUD in Practice', summary: 'Forms, persistence, errors. PROJECT: Functional CRUD application.' },
  { id: 'L5M1', levelId: 'L5', index: 1, title: 'Data Basics', summary: 'Basics, tables, create/update/delete/query.' },
  { id: 'L5M2', levelId: 'L5', index: 2, title: 'Accounts & Security', summary: 'Auth, authorization, sessions, profiles, secrets. PROJECT: Multi-user application.' },
  { id: 'L6M1', levelId: 'L6', index: 1, title: 'LLM APIs', summary: 'AI APIs, concepts, system/user prompts, context.' },
  { id: 'L6M2', levelId: 'L6', index: 2, title: 'Production AI Features', summary: 'Structured output, tools, streaming, errors, cost. PROJECT: AI-powered assistant.' },
  { id: 'L7M1', levelId: 'L7', index: 1, title: 'Automation Foundations', summary: 'Fundamentals, triggers, actions, webhooks, APIs, schedules.' },
  { id: 'L7M2', levelId: 'L7', index: 2, title: 'Real-World Automations', summary: 'Data, email/CRM/social, AI decisions, approvals. PROJECT: Real-world AI automation.' },
  { id: 'L8M1', levelId: 'L8', index: 1, title: 'Agent Architecture', summary: 'What agents are, architecture, tools, memory, planning.' },
  { id: 'L8M2', levelId: 'L8', index: 2, title: 'Reliable Agents', summary: 'Execution, verification, multi-step, safety, multi-agent. PROJECT: Autonomous task agent.' },
  { id: 'L9M1', levelId: 'L9', index: 1, title: 'Plan the System', summary: 'Requirements, architecture, frontend, backend, db, auth, AI.' },
  { id: 'L9M2', levelId: 'L9', index: 2, title: 'Build & Harden', summary: 'Agents, files, notify, log, errors, test, secure, perform. PROJECT: Production AI SaaS.' },
  { id: 'L10M1', levelId: 'L10', index: 1, title: 'From Idea to Plan', summary: 'Requirements, PRD, features, architecture, stack, tasks.' },
  { id: 'L10M2', levelId: 'L10', index: 2, title: 'Ship Your MVP', summary: 'Prompt, review, debug, test, deploy, maintain, improve. FINAL: own product.' },
];

export const LESSONS: Lesson[] = [
  // LEVEL 1 — UNDERSTANDING AI & VIBE CODING (10)
  lesson('L1M1L1', 'L1M1', 0, 'What is AI?', 'Explain what AI is in plain words', 12, 'Explain what AI is as if I am 10 years old, with 3 everyday examples.', 'node --version', 'console.log("hello ai")'),
  lesson('L1M1L2', 'L1M1', 1, 'What is an LLM?', 'Explain what an LLM does with prompts and context', 15, 'Explain LLMs, prompts and context with a simple analogy.', 'npm --version', 'const answer = await ask("hi");'),
  lesson('L1M1L3', 'L1M1', 2, 'What is Vibe Coding?', 'Describe Vibe Coding: directing AI to build software with words', 15, 'Explain Vibe Coding to a total beginner: what I say, what the AI does, what I check.', 'npx --version', '// you: words in → AI: code out'),
  lesson('L1M1L4', 'L1M1', 3, 'AI vs Traditional Programming', 'Contrast AI-assisted building with hand-written code', 14, 'Compare AI vs traditional programming with one feature built both ways.', 'git --version', '// traditional: write every line vs vibe: direct + verify'),
  lesson('L1M1L5', 'L1M1', 4, 'Understanding Prompts', 'Write a clear GOAL + CONTEXT + CONSTRAINTS + EXAMPLE prompt', 16, 'Turn this vague request into a strong prompt: "make a page". Show GOAL + CONTEXT + CONSTRAINTS + EXAMPLE.', 'echo "prompt draft v1"', 'GOAL: hello page\nCONTEXT: 1 file\nDONE: shows my name'),
  lesson('L1M2L1', 'L1M2', 0, 'Understanding Context', 'Explain context: what the AI knows plus what you must attach', 14, 'Explain context with an example: same prompt with and without the file attached.', 'ls -la', '// context = instructions + attached files'),
  lesson('L1M2L2', 'L1M2', 1, 'Files and Folders', 'Navigate a project: files, folders, names, where things live', 14, 'Show me a tiny project tree and what each file does, in plain words.', 'pwd && ls', 'site/\n  index.html\n  style.css'),
  lesson('L1M2L3', 'L1M2', 2, 'Basic Developer Terminology', 'Define app, frontend, backend, bug, deploy without jargon', 12, 'Define 10 developer words as if I am 10 years old, with one example each.', 'echo terms', '// app = program you open; bug = mistake to fix'),
  lesson('L1M2L4', 'L1M2', 3, 'Understanding an Application Architecture', 'Describe frontend, backend, database with a diagram in words', 18, 'Describe the parts of a simple app (frontend/backend/database) for a beginner.', 'git --version', '// frontend -> backend -> db'),
  lesson('L1M2L5', 'L1M2', 4, 'First AI Coding Exercise', 'Run a first AI-generated change successfully', 20, 'Create a hello page and explain every file you made.', 'npx --version', '<h1>Hello AI-MasterPlan</h1>'),
  // LEVEL 2 — SETTING UP YOUR DEVELOPMENT ENVIRONMENT (10)
  lesson('L2M1L1', 'L2M1', 0, 'Installing Required Tools', 'Install editor, Node, git and verify versions', 20, 'Give me a checklist to install VS Code, Node 20, git on Mac and Windows.', 'node --version && npm --version && git --version', 'echo $PATH'),
  lesson('L2M1L2', 'L2M1', 1, 'IDE / Code Editor Introduction', 'Open, edit, save and find files in VS Code confidently', 16, 'Tour VS Code for a beginner: files, search, terminal panel, extensions.', 'code --version', '// file explorer -> editor -> terminal'),
  lesson('L2M1L3', 'L2M1', 2, 'Git Basics', 'Track changes: status, add, commit, log, undo safely', 18, 'Teach git status/add/commit/log with a tiny practice repo and safe undo.', 'git status && git log --oneline -5', 'git add . && git commit -m "my first save"'),
  lesson('L2M1L4', 'L2M1', 3, 'GitHub Account Setup', 'Create GitHub account and push first repo', 15, 'Walk me through creating a GitHub account and pushing my first repo.', 'git init && git add . && git commit -m init', 'git remote add origin <url>'),
  lesson('L2M1L5', 'L2M1', 4, 'Node.js Installation', 'Install Node LTS and run JavaScript outside the browser', 16, 'Verify Node 20 LTS install and run a hello script step by step.', 'node --version && npm --version', 'console.log("node works")'),
  lesson('L2M2L1', 'L2M2', 0, 'Terminal Basics', 'Navigate folders and run commands confidently', 15, 'Teach me 10 terminal commands with safe practice examples.', 'ls -la && pwd', 'echo hello'),
  lesson('L2M2L2', 'L2M2', 1, 'Package Managers', 'Install and manage libraries with npm confidently', 14, 'Explain npm install/save/dev with a tiny example and what node_modules is.', 'npm --version && npm list', 'npm install <pkg> && npm run dev'),
  lesson('L2M2L3', 'L2M2', 2, 'Environment Variables', 'Store secrets and settings in .env without leaking them', 14, 'Show .env for a beginner: what goes in, what never gets committed, with gitignore.', 'cp .env.example .env', 'API_KEY=xxx  # never commit this'),
  lesson('L2M2L4', 'L2M2', 3, 'Project Folders', 'Organize a project folder the standard way', 12, 'Give me a standard project folder layout and naming rules with reasons.', 'mkdir -p site/assets && ls -R', 'site/ src/ assets/ README.md .gitignore'),
  lesson('L2M2L5', 'L2M2', 4, 'Running a Local Development Server', 'Start a local server and open it in the browser', 18, 'Create a minimal web project and run it locally, explain each step.', 'npm run dev', 'http://localhost:3000'),
  // LEVEL 3 — BUILD YOUR FIRST WEBSITE (11) — PROJECT: Personal/Business Website
  lesson('L3M1L1', 'L3M1', 0, 'Generate Initial Project', 'Generate a website project with AI', 20, 'Generate a personal website project with 3 pages and explain the files.', 'npm create vite@latest site -- --template vanilla', '<nav>Home About Contact</nav>'),
  lesson('L3M1L2', 'L3M1', 1, 'HTML Concepts', 'Structure a page with headings, links, images, lists', 18, 'Build a semantic HTML page and explain every tag simply.', 'npm run dev', '<main><h1>Hello</h1><a href="/about">About</a></main>'),
  lesson('L3M1L3', 'L3M1', 2, 'CSS Concepts', 'Style with colors, spacing, fonts and layout basics', 20, 'Style my page: colors, spacing, fonts — explain each rule simply.', 'npm run dev', '.hero { padding: 32px; color: #111; }'),
  lesson('L3M1L4', 'L3M1', 3, 'JavaScript Concepts', 'Add interactivity: buttons, input, dynamic text', 20, 'Add one button that updates the page and explain the JS line by line.', 'npm run dev', 'button.addEventListener("click", () => show("hi"))'),
  lesson('L3M1L5', 'L3M1', 4, 'Components', 'Build reusable components instead of copy-paste', 22, 'Refactor my page into reusable components and explain props simply.', 'npm run dev', 'function Card({title}) { return `<div>${title}</div>` }'),
  lesson('L3M2L1', 'L3M2', 0, 'Responsive Layouts', 'Make the site look right on phone and desktop', 20, 'Make my layout responsive with mobile-first CSS and explain breakpoints.', 'npm run dev', '@media (min-width: 768px) { .grid { display: grid; } }'),
  lesson('L3M2L2', 'L3M2', 1, 'Navigation', 'Add multi-page navigation with active states', 16, 'Add navigation with 3 pages and highlight the current page.', 'npm run build', '<nav><a href="/" aria-current="page">Home</a></nav>'),
  lesson('L3M2L3', 'L3M2', 2, 'Forms', 'Add a working contact form with validation', 20, 'Add a contact form with validation and a success message.', 'npm run build', '<form>...</form>'),
  lesson('L3M2L4', 'L3M2', 3, 'Images and Assets', 'Add optimized images, favicon and fonts correctly', 14, 'Add images + favicon + fonts with correct folders and sizes.', 'ls assets/', '<img src="/assets/hero.jpg" alt="My business">'),
  lesson('L3M2L5', 'L3M2', 4, 'Debugging', 'Find and fix layout and console errors with DevTools', 18, 'Help me debug: blank page + console error, step by step with DevTools.', 'npm run preview', 'console.debug(state)'),
  lesson('L3M2L6', 'L3M2', 5, 'Build a Complete Website', 'Ship a finished personal/business website (PROJECT P01)', 30, 'Give me a launch checklist for my complete website: content, mobile, forms, deploy.', 'npm run build && npm run preview', '<!-- P01: personal/business website, shipped -->'),
  // LEVEL 4 — BUILD YOUR FIRST REAL APPLICATION (9) — PROJECT: Functional CRUD application
  lesson('L4M1L1', 'L4M1', 0, 'Understand Frontend', 'Explain what the frontend does: screens, taps, display', 16, 'Explain frontend with a form example a beginner can picture.', 'curl http://localhost:3000/api/health', '// frontend = what you see + tap'),
  lesson('L4M1L2', 'L4M1', 1, 'Understand Backend', 'Explain what the backend does: logic, rules, storage', 16, 'Explain backend with the same form: where the data goes and why.', 'npm run dev', '// backend = does the work + remembers'),
  lesson('L4M1L3', 'L4M1', 2, 'Understand Client/Server Communication', 'Trace a tap from client to server and back', 18, 'Trace one button tap: client → network → server → response, simply.', 'curl http://localhost:3000/api/health', 'tap -> request -> response -> screen'),
  lesson('L4M1L4', 'L4M1', 3, 'APIs', 'Call an API and use the result on screen', 20, 'Show me how to fetch data from a REST API and handle errors.', 'curl https://api.example.com/items', 'fetch("/api/items").then(r=>r.json())'),
  lesson('L4M1L5', 'L4M1', 4, 'JSON', 'Read and write JSON: objects, arrays, nesting', 14, 'Teach JSON with 3 real examples: user, list, API response.', 'node -e "console.log(JSON.stringify({ok:true}))"', '{"name":"Maya","items":[1,2]}'),
  lesson('L4M1L6', 'L4M1', 5, 'REST', 'Use GET/POST/PUT/DELETE correctly on resources', 16, 'Explain REST with an items resource and one curl per method.', 'curl -X POST http://localhost:3000/api/items -d {}', 'GET read / POST create / PUT update / DELETE remove'),
  lesson('L4M2L1', 'L4M2', 0, 'Form Submission', 'Submit a form and show success or errors clearly', 22, 'Build a form that saves data and shows errors clearly.', 'npm run dev', 'await db.insert(item)'),
  lesson('L4M2L2', 'L4M2', 1, 'Data Persistence', 'Persist data so refresh never loses it', 20, 'Persist form data and reload-proof it step by step.', 'npm run dev', 'save(item) -> read() -> render()'),
  lesson('L4M2L3', 'L4M2', 2, 'Error Handling + Functional CRUD Application', 'Build a complete CRUD app with friendly errors (PROJECT P03)', 32, 'Guide me to build a CRUD app step by step with tests and friendly errors.', 'npm test', 'CRUD: create/read/update/delete'),
  // LEVEL 5 — DATABASES & USER ACCOUNTS (11) — PROJECT: Multi-user application
  lesson('L5M1L1', 'L5M1', 0, 'Database Basics', 'Explain what a database is and when to use one', 16, 'Explain databases vs files with one app example.', 'psql -c "select 1"', '-- database remembers rows'),
  lesson('L5M1L2', 'L5M1', 1, 'Tables and Collections', 'Design tables/collections with fields and types', 18, 'Design a leads table: fields, types, why each exists.', 'psql $DATABASE_URL', 'CREATE TABLE leads(name text, status text);'),
  lesson('L5M1L3', 'L5M1', 2, 'Creating Records', 'Insert records safely with validation', 18, 'Insert 3 records with validation and show the result.', 'psql $DATABASE_URL', "INSERT INTO leads(name) VALUES ('Maya');"),
  lesson('L5M1L4', 'L5M1', 3, 'Updating Records', 'Update records without touching the wrong rows', 16, 'Update one record safely with a where-clause, plus undo tips.', 'psql $DATABASE_URL', "UPDATE leads SET status='won' WHERE id=1;"),
  lesson('L5M1L5', 'L5M1', 4, 'Deleting Records', 'Delete records safely with confirmations and backups', 14, 'Delete safely: confirm, backup, soft-delete vs hard-delete.', 'psql $DATABASE_URL', "DELETE FROM leads WHERE id=1; -- careful"),
  lesson('L5M1L6', 'L5M1', 5, 'Querying Data', 'Query and filter data correctly', 20, 'Show me 5 query patterns I will actually use.', 'psql $DATABASE_URL', 'SELECT * FROM leads WHERE status = \'new\';'),
  lesson('L5M2L1', 'L5M2', 0, 'Authentication', 'Add sign-up, sign-in and sessions', 25, 'Add email auth with sessions and explain each part simply.', 'npm run dev', 'signIn(email, password)'),
  lesson('L5M2L2', 'L5M2', 1, 'Authorization', 'Restrict rows so users only touch their own data', 20, 'Add owner-based rules so users see only their rows.', 'npm test', 'auth.uid() = owner_id'),
  lesson('L5M2L3', 'L5M2', 2, 'User Sessions', 'Keep users signed in safely across visits', 18, 'Explain sessions simply: login → token → stay signed in → logout.', 'npm run dev', 'session = sign(token) // httpOnly'),
  lesson('L5M2L4', 'L5M2', 3, 'User Profiles', 'Add editable profiles with names and avatars', 18, 'Add a profile page: name, photo, goals, level.', 'npm run dev', 'profile = {name, avatarUrl}'),
  lesson('L5M2L5', 'L5M2', 4, 'Secure Environment Variables + Multi-User App', 'Ship a secure multi-user app (PROJECT)', 30, 'Help me build a multi-user app with profiles and secure env vars.', 'npm test', 'API_KEY=xxx  # server only'),
  // LEVEL 6 — AI INTEGRATION (10) — PROJECT: AI-powered assistant application
  lesson('L6M1L1', 'L6M1', 0, 'AI APIs', 'Call an AI API from your app for the first time', 20, 'Show me a minimal AI API call from my app, keys server-side.', 'curl $AI_API/chat', 'POST /chat {messages: [...]}'),
  lesson('L6M1L2', 'L6M1', 1, 'LLM API Concepts', 'Explain models, tokens, temperature with cost intuition', 18, 'Explain tokens, models and temperature with a cost example.', 'node ai-test.js', '// tokens = chunks of words you pay for'),
  lesson('L6M1L3', 'L6M1', 2, 'System Prompts', 'Write a system prompt with role, rules and guardrails', 20, 'Write a system prompt for my tutor: role, rules, refusals.', 'curl $AI_API/chat', '{"role":"system","content":"You are a patient tutor..."}'),
  lesson('L6M1L4', 'L6M1', 3, 'User Prompts', 'Shape user prompts with context and examples', 18, 'Improve my user prompt with context + one example of done.', 'node ai-test.js', '{"role":"user","content":"Explain X given..."}'),
  lesson('L6M1L5', 'L6M1', 4, 'Context Management', 'Fit history into limits with summarize-and-trim', 20, 'Teach context windows: trim + summarize so long chats keep working.', 'node ai-test.js', 'history.slice(-6) + summary'),
  lesson('L6M2L1', 'L6M2', 0, 'Structured Output', 'Force reliable JSON output with schemas', 20, 'Force JSON output with a schema and retry on bad shape.', 'node ai-test.js', '{ "answer": "...", "steps": [] }'),
  lesson('L6M2L2', 'L6M2', 1, 'Tool and Function Calling', 'Give the model one tool and handle its call', 22, 'Add one tool call (e.g. lookup) and handle the result.', 'npm run dev', 'tools: [{name: "lookup", run}]'),
  lesson('L6M2L3', 'L6M2', 2, 'Streaming Responses', 'Stream tokens so answers appear instantly', 20, 'Stream the answer token-by-token into my chat UI.', 'npm run dev', 'stream.on("token", render)'),
  lesson('L6M2L4', 'L6M2', 3, 'Error Handling', 'Handle timeouts, rate limits and bad output gracefully', 18, 'Handle AI errors: retry, fallback message, log.', 'npm run dev', 'try { ask() } catch { fallback() }'),
  lesson('L6M2L5', 'L6M2', 4, 'Usage and Cost Awareness + Assistant App', 'Ship an AI assistant with caps (PROJECT P04)', 30, 'Guide me to build an AI assistant with usage limits and cost caps.', 'npm test', 'usage: {tokens, cost, cap}'),
  // LEVEL 7 — AI AUTOMATION (12) — PROJECT: Real-world AI automation
  lesson('L7M1L1', 'L7M1', 0, 'Automation Fundamentals', 'Build a trigger → action workflow', 20, 'Design my first automation: trigger, actions, webhook.', 'curl -X POST $WEBHOOK_URL', '{ trigger, actions }'),
  lesson('L7M1L2', 'L7M1', 1, 'Triggers', 'Fire workflows from events: new row, message, form', 16, 'List 5 triggers for my business with one example each.', 'curl -X POST $WEBHOOK_URL', 'on(new_lead) -> run()'),
  lesson('L7M1L3', 'L7M1', 2, 'Actions', 'Chain actions: message, save, notify, update', 16, 'Chain 3 actions after a trigger with error handling.', 'npm run dev', 'reply() -> save() -> notify()'),
  lesson('L7M1L4', 'L7M1', 3, 'Webhooks', 'Receive and verify webhooks from other apps', 18, 'Receive a webhook, verify it, log it, respond 200.', 'curl -X POST $WEBHOOK_URL -d {}', 'if (!verify(sig)) return 401'),
  lesson('L7M1L5', 'L7M1', 4, 'APIs for Automation', 'Call outside APIs from a workflow with keys server-side', 16, 'Call one outside API from my workflow with retries.', 'curl https://api.example.com/send', 'POST /send {to, text}'),
  lesson('L7M1L6', 'L7M1', 5, 'Scheduled Workflows', 'Run data processing on a schedule', 18, 'Create a scheduled job that processes data daily.', '0 9 * * * npm run job', 'cron.schedule(job)'),
  lesson('L7M2L1', 'L7M2', 0, 'Data Processing', 'Clean and shape data inside a workflow', 18, 'Clean incoming data: trim, dedupe, validate, default.', 'npm run dev', 'clean(row) -> valid ? save : skip'),
  lesson('L7M2L2', 'L7M2', 1, 'Email Automation', 'Send personal follow-ups automatically', 20, 'Send a welcome email sequence with unsubscribe and logs.', 'npm run dev', 'send(to, template, {unsub})'),
  lesson('L7M2L3', 'L7M2', 2, 'CRM Automation', 'Keep the CRM updated from every workflow', 20, 'Sync leads to the CRM: create, update stage, log notes.', 'npm run dev', 'crm.upsert(lead)'),
  lesson('L7M2L4', 'L7M2', 3, 'Social Automation', 'Auto-draft social replies and posts for review', 18, 'Draft social replies for approval — never auto-post blindly.', 'npm run dev', 'draft(post) -> queue(review)'),
  lesson('L7M2L5', 'L7M2', 4, 'AI Decision Steps', 'Let AI classify, score and route inside workflows', 22, 'Add an AI step: classify intent + score, then route.', 'npm run dev', 'if (ai.score > 0.7) send() else queue()'),
  lesson('L7M2L6', 'L7M2', 5, 'Human Approval Workflows + Real Automation', 'Ship an automation with approval (PROJECT P05)', 30, 'Build an automation with human approval before sending.', 'npm test', 'pending_approval -> approved'),
  // LEVEL 8 — AI AGENTS (10) — PROJECT: Autonomous task agent
  lesson('L8M1L1', 'L8M1', 0, 'What is an AI Agent?', 'Explain agents: goal, tools, loop until done', 20, 'Explain agents simply and sketch the loop: goal → act → check.', 'npm run dev', 'agent = {goal, tools, loop}'),
  lesson('L8M1L2', 'L8M1', 1, 'Agent Architecture', 'Diagram planner, tools, memory, verifier simply', 20, 'Sketch agent architecture for a research task.', 'npm run dev', '{planner, tools, memory, verifier}'),
  lesson('L8M1L3', 'L8M1', 2, 'Tools', 'Give an agent two safe tools with schemas', 20, 'Add search + save tools with strict schemas.', 'npm test', 'tools: [search, save]'),
  lesson('L8M1L4', 'L8M1', 3, 'Memory', 'Add short-term notes + long-term facts correctly', 18, 'Add memory: notes per run + facts across runs.', 'npm run dev', 'memory = {notes, facts}'),
  lesson('L8M1L5', 'L8M1', 4, 'Planning', 'Break goals into small verifiable steps', 20, 'Plan a 5-step task where each step is checkable.', 'npm run dev', 'plan = [step1..step5] // checkable'),
  lesson('L8M2L1', 'L8M2', 0, 'Execution', 'Run steps with retries and logs', 18, 'Execute the plan with retries and a visible log.', 'npm run dev', 'run(step) with retry(2)'),
  lesson('L8M2L2', 'L8M2', 1, 'Verification', 'Verify each step before moving on', 20, 'Add a verify step so bad results never compound.', 'npm test', 'plan -> act -> verify'),
  lesson('L8M2L3', 'L8M2', 2, 'Multi-Step Tasks', 'Chain 5+ steps reliably end to end', 22, 'Chain a 5-step task with checkpoints and resume.', 'npm run dev', 'checkpoint after step 3'),
  lesson('L8M2L4', 'L8M2', 3, 'Agent Safety and Permissions', 'Sandbox with allowlists and approval gates', 22, 'Sandbox my agent: allowlist tools + approve sends.', 'npm test', 'permissions: allowlist'),
  lesson('L8M2L5', 'L8M2', 4, 'Multi-Agent Workflows + Task Agent', 'Ship a safe agent team (PROJECT P07)', 32, 'Guide me to build a safe autonomous agent with a reviewer agent.', 'npm test', 'doer -> reviewer -> approve'),
  // LEVEL 9 — FULL AI SYSTEM DEVELOPMENT (15) — PROJECT: Production-style AI SaaS application
  lesson('L9M1L1', 'L9M1', 0, 'Product Requirements', 'Turn an idea into a one-page PRD', 22, 'Turn my idea into a PRD: problem, users, features, non-goals.', 'npm run dev', 'PRD: problem/users/features'),
  lesson('L9M1L2', 'L9M1', 1, 'System Architecture', 'Draw frontend, API, db, AI, jobs simply', 22, 'Draw my system architecture with data flow in words.', 'npm run dev', 'app -> api -> db + ai + jobs'),
  lesson('L9M1L3', 'L9M1', 2, 'Frontend Build', 'Build the app screens with auth states', 25, 'Build 3 screens with loading/empty/error states.', 'npm test', 'screens: [home, detail, settings]'),
  lesson('L9M1L4', 'L9M1', 3, 'Backend Build', 'Build API routes with validation and errors', 25, 'Build CRUD API routes with validation and clean errors.', 'npm test', 'POST /items {validate}'),
  lesson('L9M1L5', 'L9M1', 4, 'Database Build', 'Model tables, relations and row security', 22, 'Model my tables with relations + owner security.', 'npm test', 'owner_id + RLS policy'),
  lesson('L9M1L6', 'L9M1', 5, 'Authentication Build', 'Wire sign-up/in, sessions and profiles', 22, 'Wire auth end to end with profiles.', 'npm run dev', 'signUp -> verify -> profile'),
  lesson('L9M1L7', 'L9M1', 6, 'AI Integration Build', 'Add the core AI feature with caps', 28, 'Add my AI feature with prompts + caps + fallback.', 'npm test', 'ai(feature, {cap, fallback})'),
  lesson('L9M2L1', 'L9M2', 0, 'Agent Workflows', 'Embed an agent loop for multi-step jobs', 22, 'Embed an agent for my longest multi-step job.', 'npm run dev', 'job = agent(plan, tools)'),
  lesson('L9M2L2', 'L9M2', 1, 'File Handling', 'Upload, store and serve files safely', 20, 'Add uploads with type + size limits and private buckets.', 'npm run dev', 'upload(file) // 5MB, images only'),
  lesson('L9M2L3', 'L9M2', 2, 'Notifications', 'Notify users by email/push on key events', 18, 'Notify on 3 key events with preferences.', 'npm run dev', 'notify(user, event)'),
  lesson('L9M2L4', 'L9M2', 3, 'Logging', 'Log requests, AI calls and errors usefully', 16, 'Add logs I can actually search when things break.', 'npm run dev', 'log({route, ms, aiTokens})'),
  lesson('L9M2L5', 'L9M2', 4, 'Error Handling', 'Friendly errors + retries + dead-letter queue', 18, 'Harden errors: friendly UI, retries, dead-letter.', 'npm test', 'retry(2) -> dlq -> alert'),
  lesson('L9M2L6', 'L9M2', 5, 'Testing', 'Cover happy paths + one failure each', 22, 'Write tests: happy path + one failure per feature.', 'npm test', 'test(happy) + test(failure)'),
  lesson('L9M2L7', 'L9M2', 6, 'Security', 'Keys, RLS, rate limits, backups before launch', 22, 'Pre-launch security pass: keys, RLS, limits, backups.', 'npm test', 'RLS + rate limit + backup'),
  lesson('L9M2L8', 'L9M2', 7, 'Performance + SaaS Launch', 'Ship a fast production AI SaaS (PROJECT P09)', 30, 'Give me a launch checklist: speed, security, monitoring for my SaaS.', 'npm test', 'p95 < 500ms + monitor'),
  // LEVEL 10 — BUILD INDEPENDENTLY (13, reduced hand-holding) — FINAL: own product
  lesson('L10M1L1', 'L10M1', 0, 'Turn an Idea into Requirements', 'Write the problem, users and scope alone', 25, 'Help me critique (not write for me) my requirements draft.', 'npm run dev', 'my problem/users/scope v1...'),
  lesson('L10M1L2', 'L10M1', 1, 'Create PRD', 'Write a one-page PRD solo with non-goals', 22, 'Review my PRD: is the scope shippable in 2 weeks?', 'npm test', 'my PRD v1... // non-goals listed'),
  lesson('L10M1L3', 'L10M1', 2, 'Define Features', 'Cut to an MVP slice: must, later, never', 20, 'Cut my feature list to MVP: must/later/never.', 'npm run dev', 'MVP = 3 features max'),
  lesson('L10M1L4', 'L10M1', 3, 'Design Architecture', 'Sketch your system without help', 22, 'Critique my architecture sketch (hints only).', 'npm run dev', 'my arch sketch...'),
  lesson('L10M1L5', 'L10M1', 4, 'Choose Technologies', 'Justify your stack in one paragraph each', 18, 'Check my stack choices: why each, what risk?', 'npm test', 'expo + supabase + llm // why'),
  lesson('L10M1L6', 'L10M1', 5, 'Break Project into Tasks', 'Slice work into small testable tasks', 20, 'Review my task breakdown: small + testable?', 'npm test', 'task: <small, testable>'),
  lesson('L10M2L1', 'L10M2', 0, 'Prompt AI Coding Agents Effectively', 'Prompt in small slices with acceptance checks', 22, 'Improve my agent prompts: slice + acceptance check.', 'npm run dev', 'build X. done = [test passes]'),
  lesson('L10M2L2', 'L10M2', 1, 'Review Generated Code', 'Review diffs for logic, security, cost', 20, 'Teach me a 5-minute code review checklist for AI output.', 'npm test', 'review: logic/security/cost'),
  lesson('L10M2L3', 'L10M2', 2, 'Debug Independently', 'Isolate, reproduce, bisect and fix solo', 25, 'Give me hints (not full answers) for this bug...', 'npm test', 'failing test output...'),
  lesson('L10M2L4', 'L10M2', 3, 'Test Application', 'Write user-level tests for your MVP', 22, 'What tests prove my MVP works for a stranger?', 'npm test', 'user test script v1'),
  lesson('L10M2L5', 'L10M2', 4, 'Deploy Application', 'Deploy web + mobile tracks with monitoring', 25, 'Give me a deploy checklist: web + TestFlight/Play + monitor.', 'eas build && eas submit', 'https://my-mvp.app'),
  lesson('L10M2L6', 'L10M2', 5, 'Maintain Application', 'Fix, update deps and answer users weekly', 18, 'Give me a weekly maintenance routine (30 min).', 'npm run dev', 'maintain: deps + fixes + replies'),
  lesson('L10M2L7', 'L10M2', 6, 'Improve + Present Your Product', 'Iterate once and demo a working product (FINAL P10)', 35, 'Give me a demo-day checklist: story, live demo, backup video.', 'eas build && eas submit', 'demo: problem -> live MVP -> next'),
];

export function getLevel(id: string) { return LEVELS.find((l) => l.id === id); }
export function getModulesForLevel(levelId: string) { return MODULES.filter((m) => m.levelId === levelId).sort((a, b) => a.index - b.index); }
export function getLessonsForModule(moduleId: string) { return LESSONS.filter((l) => l.moduleId === moduleId).sort((a, b) => a.index - b.index); }
export function getLesson(id: string) { return LESSONS.find((l) => l.id === id); }
export function totalLessons() { return LESSONS.length; }
// Lesson navigation: previous/next in module order, with course-order fallback
// (mirrors the lesson screen: prev stays in-module, next spills to the next lesson overall).
export function getPrevLesson(id: string) {
  const cur = getLesson(id);
  if (!cur) return undefined;
  const sibs = getLessonsForModule(cur.moduleId);
  const i = sibs.findIndex((l) => l.id === id);
  return i > 0 ? sibs[i - 1] : undefined;
}
export function getNextLesson(id: string) {
  const cur = getLesson(id);
  if (!cur) return undefined;
  const sibs = getLessonsForModule(cur.moduleId);
  const i = sibs.findIndex((l) => l.id === id);
  if (i >= 0 && i < sibs.length - 1) return sibs[i + 1];
  const all = LESSONS.findIndex((l) => l.id === id);
  return all >= 0 && all < LESSONS.length - 1 ? LESSONS[all + 1] : undefined;
}
export function getResumeLesson(completedIds: string[]) {
  return LESSONS.find((l) => !completedIds.includes(l.id));
}

// PHASE 01 — PRODUCT FOUNDATION (finalized)
// Product name: AI-MasterPlan — confirmed, do not rename without migration.
export const PRODUCT = {
  name: 'AI-MasterPlan',
  tagline: 'From zero coding to independent AI builder — learn by building.',
  version: '1.0.0-mvp',
} as const;

export const TARGET_USERS = [
  'Complete non-coders',
  'Beginner developers',
  'Business owners',
  'Freelancers',
  'Aspiring AI developers',
  'Automation builders',
  'Startup founders',
] as const;

export const LEARNING_PHILOSOPHY = [
  'No coding experience required',
  'Learn by actually building',
  'Step-by-step instructions',
  'Explain WHY before HOW',
  'Avoid unnecessary technical jargon',
  'Demonstrate every important step',
  'Give students reproducible projects',
  'Gradually remove hand-holding',
  'End with independent project development',
] as const;

export const STUDENT_JOURNEY = [
  'Beginner',
  'AI Fundamentals',
  'Vibe Coding Basics',
  'Build First Website',
  'Build First Application',
  'Connect APIs',
  'Build AI Automation',
  'Databases + Authentication',
  'Build Full AI Application',
  'Deployment',
  'Independent System Builder',
] as const;

// Maps each journey milestone to the course level(s) that deliver it.
// Used by Home, Roadmap and Onboarding so the journey is visible everywhere.
export const JOURNEY_MAP: { step: (typeof STUDENT_JOURNEY)[number]; levels: string; detail: string }[] = [
  { step: 'Beginner', levels: 'Start', detail: 'No experience needed. Start at Level 1.' },
  { step: 'AI Fundamentals', levels: 'L1', detail: 'What AI, LLMs, prompts and app parts really are — in plain words.' },
  { step: 'Vibe Coding Basics', levels: 'L1–L2', detail: 'Talk to an AI coding assistant, set up tools, run your first project.' },
  { step: 'Build First Website', levels: 'L3', detail: 'Generate, style and ship a complete personal/business website.' },
  { step: 'Build First Application', levels: 'L4', detail: 'Frontend + backend + forms + persistence (CRUD).' },
  { step: 'Connect APIs', levels: 'L4–L6', detail: 'REST, JSON, then LLM APIs with prompts and structured output.' },
  { step: 'Build AI Automation', levels: 'L7', detail: 'Triggers, webhooks, schedules, email/CRM with human approval.' },
  { step: 'Databases + Authentication', levels: 'L5', detail: 'Tables, queries, sign-up/sign-in, secure multi-user apps.' },
  { step: 'Build Full AI Application', levels: 'L6–L9', detail: 'Chat, agents, files, notifications, SaaS architecture.' },
  { step: 'Deployment', levels: 'L9–L10', detail: 'Test, secure, deploy to web + mobile stores, monitor.' },
  { step: 'Independent System Builder', levels: 'L10', detail: 'Plan, build, test and deploy your own AI product solo.' },
];

export const SUCCESS_CRITERIA = [
  'Understand the basic structure of software',
  'Communicate effectively with an AI coding agent',
  'Create useful prompts',
  'Run and modify a project',
  'Understand files and project structure',
  'Debug common problems',
  'Connect APIs',
  'Work with databases',
  'Add authentication',
  'Integrate AI',
  'Build AI automations',
  'Build AI agents',
  'Build web/mobile applications',
  'Test their own software',
  'Deploy their software',
  'Convert an idea into a technical development plan',
  'Independently develop an MVP',
] as const;

// One-line explainer per target user — shown on landing + onboarding.
export const TARGET_USER_DETAILS: { user: (typeof TARGET_USERS)[number]; pitch: string }[] = [
  { user: 'Complete non-coders', pitch: 'Start from zero. Every term explained, every click demonstrated.' },
  { user: 'Beginner developers', pitch: 'Fill the gaps: APIs, databases, auth, AI and deployment — by building.' },
  { user: 'Business owners', pitch: 'Automate leads, replies and operations without hiring a dev team first.' },
  { user: 'Freelancers', pitch: 'Ship client websites, automations and AI apps faster with reproducible systems.' },
  { user: 'Aspiring AI developers', pitch: 'LLM APIs, agents, tools, memory and verification — step by step.' },
  { user: 'Automation builders', pitch: 'Triggers, webhooks, schedules and approval gates that work in production.' },
  { user: 'Startup founders', pitch: 'Turn an idea into a PRD, MVP and deployed product you can demo.' },
];

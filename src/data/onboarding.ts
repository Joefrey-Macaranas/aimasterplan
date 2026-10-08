// Beginner onboarding content: 3 questions + 8 plain-words explainers.
// Every explainer: WHY first, one analogy, one "you will do" line. No jargon.
export type CodedBefore = 'never' | 'little' | 'yes';
export type UsedAITools = 'never' | 'chat' | 'agent';
export type BuildGoal = 'website' | 'mobile' | 'automation' | 'agent' | 'business' | 'saas' | 'personal';

export interface WizardAnswers {
  coded: CodedBefore;
  aiTools: UsedAITools;
  goal: BuildGoal;
}

export const CODED_OPTIONS: { id: CodedBefore; label: string; hint: string }[] = [
  { id: 'never', label: 'Never — I have not coded before', hint: 'Perfect. Most students start here.' },
  { id: 'little', label: 'A little — copied or edited code', hint: 'You have seen code; we fill the gaps.' },
  { id: 'yes', label: 'Yes — I built something', hint: 'You will move faster in Levels 1–3.' },
];

export const AI_TOOLS_OPTIONS: { id: UsedAITools; label: string; hint: string }[] = [
  { id: 'never', label: 'Never used AI coding tools', hint: 'We teach prompting from zero.' },
  { id: 'chat', label: 'ChatGPT for writing / ideas', hint: 'Same prompting skill — applied to code.' },
  { id: 'agent', label: 'Yes — an AI coding assistant', hint: 'You know the loop; we make it reliable.' },
];

export const GOAL_OPTIONS: { id: BuildGoal; label: string; hint: string }[] = [
  { id: 'website', label: 'Website', hint: 'Personal or business site, live on the internet.' },
  { id: 'mobile', label: 'Mobile App', hint: 'An app on your phone (Expo).' },
  { id: 'automation', label: 'AI Automation', hint: 'Replies, leads, emails on autopilot.' },
  { id: 'agent', label: 'AI Agent', hint: 'An assistant that does multi-step tasks.' },
  { id: 'business', label: 'Business System', hint: 'Leads + CRM + follow-ups that run themselves.' },
  { id: 'saas', label: 'SaaS', hint: 'A product with users, logins, billing-ready.' },
  { id: 'personal', label: 'Personal Project', hint: 'Your own idea — we shape it in Level 10.' },
];

export interface Explainer {
  id: string;
  title: string;
  why: string;
  analogy: string;
  youWill: string;
}

export const EXPLAINERS: Explainer[] = [
  {
    id: 'vibe',
    title: 'Vibe Coding',
    why: 'You describe the outcome in plain words; the AI writes the code. Your job is directing: clear goal, check the result, ask for fixes.',
    analogy: 'Like directing a movie: you say the scene, the crew builds it, you say “again, funnier”.',
    youWill: 'In Level 1 you run your first AI-generated page without typing code by hand.',
  },
  {
    id: 'assisted',
    title: 'AI-assisted development',
    why: 'A loop, not magic: prompt → generate → run → see → fix. Small loops win; big “build everything” prompts fail.',
    analogy: 'Like cooking with a helper: one dish at a time, taste, adjust.',
    youWill: 'From Level 2 every lesson is one small loop you can repeat.',
  },
  {
    id: 'prompts',
    title: 'Prompts',
    why: 'A prompt is instructions + context. Strong recipe: GOAL + CONTEXT (files) + CONSTRAINTS + EXAMPLE of done.',
    analogy: 'Like ordering food precisely: dish + size + allergies + “like last time”.',
    youWill: 'Every lesson gives a copy-paste prompt; later you write your own.',
  },
  {
    id: 'frontback',
    title: 'Frontend / backend',
    why: 'Frontend is what people see and tap. Backend does the work and remembers things. They talk over the network.',
    analogy: 'Restaurant: menu + tables (frontend), kitchen (backend), pantry (database).',
    youWill: 'Level 3 builds frontend; Level 4 connects it to a backend.',
  },
  {
    id: 'apis',
    title: 'APIs',
    why: 'An API is a menu other software can order from: send a request, get data back (usually JSON). Keys stay server-side.',
    analogy: 'A waiter: you order (request), kitchen cooks, waiter returns the plate (response).',
    youWill: 'Level 4 you call your first API; Level 6 you call an AI API.',
  },
  {
    id: 'db',
    title: 'Databases',
    why: 'A database remembers rows (users, leads, orders) so closing the app loses nothing. You create, read, update, delete, query.',
    analogy: 'A spreadsheet with rules: one row per thing, find with filters.',
    youWill: 'Level 5 you save your first record and add login.',
  },
  {
    id: 'deploy',
    title: 'Deployment',
    why: 'Deployment puts your work on the internet with a real link others can open. Test → internal track → production.',
    analogy: 'From home kitchen to restaurant opening: same food, now anyone can come.',
    youWill: 'Level 3 ships a site; Level 10 ships your MVP to web + stores.',
  },
  {
    id: 'models',
    title: 'AI models',
    why: 'An LLM predicts the next words from patterns in text. Clear instructions + examples + guardrails = useful; vague = confident nonsense.',
    analogy: 'Autocomplete that read the library: great with directions, lost without.',
    youWill: 'Level 6 you wire system + user prompts, JSON output, and cost caps.',
  },
];

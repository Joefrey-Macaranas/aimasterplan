// PHASE 11 — STUDENT AI PROJECT PLANNER (deterministic, testable; LLM-optional)
import { sanitizeInput } from './auth';

export interface ProjectPlan {
  definition: string; features: string[]; stack: string[]; architecture: string;
  phases: string[]; todos: string[]; tools: string[]; database: string[];
  apis: string[]; aiPlan: string[]; deployment: string[];
}
const KEYWORDS: Record<string, Partial<ProjectPlan>> = {
  facebook: { apis: ['Facebook Graph API / Messenger webhooks'], features: ['Auto-reply to inquiries', 'Lead capture + CRM save'] },
  leads: { database: ['leads(name, contact, source, status)'], features: ['Lead scoring with AI', 'Human approval before sending'] },
  shop: { stack: ['Expo (mobile)', 'Supabase (db+auth)', 'LLM API'], architecture: 'Mobile client → API → Postgres + LLM' },
  automation: { phases: ['Trigger', 'AI decision', 'Action', 'Human approval', 'Logging'] },
};
export function generatePlan(rawIdea: string): ProjectPlan {
  const idea = sanitizeInput(rawIdea);
  const lower = idea.toLowerCase();
  const plan: ProjectPlan = {
    definition: idea,
    features: ['User accounts', 'Core workflow', 'AI-assisted step', 'Notifications'],
    stack: ['Expo (mobile app)', 'Supabase (Postgres + auth + storage)', 'LLM API'],
    architecture: 'Mobile app → secure API → Postgres; AI calls server-side only (keys never in client).',
    phases: ['PRD', 'Scaffold', 'Core features', 'AI integration', 'Test', 'Deploy', 'Showcase'],
    todos: ['Write 1-page PRD', 'Design 3 screens', 'Build auth', 'Build core CRUD', 'Add AI step', 'Test on device', 'Deploy'],
    tools: ['VS Code', 'Expo', 'Supabase', 'GitHub'],
    database: ['users', 'items (owner_id + RLS)'],
    apis: ['App API (REST)', 'LLM API (server-side)'],
    aiPlan: ['System prompt with guardrails', 'Structured JSON output', 'Usage caps + error handling'],
    deployment: ['EAS build → TestFlight/Play internal → production + monitoring'],
  };
  for (const [k, v] of Object.entries(KEYWORDS)) {
    if (lower.includes(k)) {
      if (v.features) plan.features = [...new Set([...plan.features, ...v.features])];
      if (v.apis) plan.apis = [...new Set([...plan.apis, ...v.apis])];
      if (v.database) plan.database = [...new Set([...plan.database, ...v.database])];
      if (v.stack) plan.stack = [...new Set([...plan.stack, ...v.stack])];
      if (v.phases) plan.phases = v.phases;
      if (k === 'facebook') plan.architecture = 'Messenger webhook → API → AI reply + lead save (human approval for promos).';
    }
  }
  return plan;
}

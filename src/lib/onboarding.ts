// Personalized starting recommendation — pure + tested.
// Input: 3 wizard answers. Output: where to start + first week + project + tools.
import type { BuildGoal, CodedBefore, UsedAITools, WizardAnswers } from '../data/onboarding';

export interface Recommendation {
  headline: string;
  startLevelId: string;
  startLevelTitle: string;
  startModuleId: string;
  startLessonId: string;
  fastTrack: boolean;
  focusProjectId: string;
  focusProjectTitle: string;
  keyTools: string[];
  firstWeek: string[];
  pace: string;
  why: string;
}

const GOAL_MAP: Record<BuildGoal, { lesson: string; module: string; project: string; projectTitle: string; tools: string[] }> = {
  website: { lesson: 'L3M1L1', module: 'L3M1', project: 'P01', projectTitle: 'Personal Website', tools: ['VS Code', 'AI Coding Assistant', 'Terminal'] },
  personal: { lesson: 'L3M1L1', module: 'L3M1', project: 'P01', projectTitle: 'Personal Website', tools: ['VS Code', 'AI Coding Assistant', 'Terminal'] },
  mobile: { lesson: 'L4M1L1', module: 'L4M1', project: 'P08', projectTitle: 'Mobile Application', tools: ['Expo', 'VS Code', 'Supabase'] },
  automation: { lesson: 'L7M1L1', module: 'L7M1', project: 'P05', projectTitle: 'Business Automation', tools: ['Webhooks', 'AI Coding Assistant', 'Supabase'] },
  business: { lesson: 'L7M1L1', module: 'L7M1', project: 'P05', projectTitle: 'Business Automation', tools: ['Webhooks', 'Supabase', 'AI Coding Assistant'] },
  agent: { lesson: 'L8M1L1', module: 'L8M1', project: 'P07', projectTitle: 'AI Agent', tools: ['LLM API', 'AI Coding Assistant', 'Terminal'] },
  saas: { lesson: 'L9M1L1', module: 'L9M1', project: 'P09', projectTitle: 'SaaS Application', tools: ['Supabase', 'LLM API', 'Expo'] },
};

const LEVEL_TITLE: Record<string, string> = {
  L1: 'Understanding AI & Vibe Coding',
  L2: 'Setting Up Your Development Environment',
  L3: 'Build Your First Website',
  L4: 'Build Your First Real Application',
  L7: 'AI Automation',
  L8: 'AI Agents',
  L9: 'Full AI System Development',
};

export function recommend(a: WizardAnswers): Recommendation {
  const goal = GOAL_MAP[a.goal];
  const experienced = a.coded === 'yes' && a.aiTools === 'agent';
  const someCode = a.coded !== 'never' || a.aiTools !== 'never';

  // Everyone anchors at Level 1 foundations; experienced fast-track to goal entry.
  const startLessonId = experienced ? goal.lesson : 'L1M1L1';
  const startModuleId = experienced ? goal.module : 'L1M1';
  const levelId = experienced ? goal.lesson.slice(0, 2) : 'L1';

  const headline = experienced
    ? `Fast-track: Level 1 basics → ${goal.projectTitle}`
    : `Start at Level 1 — your ${goal.projectTitle.toLowerCase()} comes at ${goal.lesson.slice(0, 2)}`;

  const firstWeek = experienced
    ? [
        'Day 1–2: skim L1 (AI + prompts) and L2 (tools install + first run).',
        `Day 3–5: enter at ${goal.lesson} and build the first slice of ${goal.projectTitle} (${goal.project}).`,
        'Day 6–7: test on your device, post a screenshot in Community Showcase.',
      ]
    : [
        'Day 1–2: L1M1 — what AI is + your first AI-generated page.',
        'Day 3–4: L1M2 + L2M1 — how apps work, install tools (30 min/day is enough).',
        'Day 5–7: L2M2 — run your first project locally, then preview your goal path.',
      ];

  const why = [
    `Coded before: ${a.coded}.`,
    `AI tools: ${a.aiTools}.`,
    `Goal: ${a.goal} → entry ${goal.lesson} / ${goal.project}.`,
    someCode ? 'Some background, so we compress early levels.' : 'True beginner path: full hand-holding, no skipped setups.',
  ].join(' ');

  return {
    headline,
    startLevelId: levelId,
    startLevelTitle: LEVEL_TITLE[levelId] ?? levelId,
    startModuleId,
    startLessonId,
    fastTrack: experienced,
    focusProjectId: goal.project,
    focusProjectTitle: goal.projectTitle,
    keyTools: goal.tools,
    firstWeek,
    pace: '30 minutes a day beats weekend marathons. One small loop per session.',
    why,
  };
}

export function wizardProgress(step: number, total: number): number {
  return Math.max(0, Math.min(100, Math.round((step / total) * 100)));
}

export type { CodedBefore, UsedAITools, BuildGoal, WizardAnswers };

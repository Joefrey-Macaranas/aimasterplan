import { recommend, wizardProgress } from '../src/lib/onboarding';
import { EXPLAINERS, GOAL_OPTIONS, CODED_OPTIONS, AI_TOOLS_OPTIONS } from '../src/data/onboarding';

test('all checklist options exist', () => {
  expect(CODED_OPTIONS.map((o) => o.id)).toEqual(['never', 'little', 'yes']);
  expect(AI_TOOLS_OPTIONS.map((o) => o.id)).toEqual(['never', 'chat', 'agent']);
  expect(GOAL_OPTIONS.map((o) => o.id)).toEqual(['website', 'mobile', 'automation', 'agent', 'business', 'saas', 'personal']);
});

test('8 explainers cover the checklist', () => {
  const titles = EXPLAINERS.map((e) => e.title.toLowerCase());
  for (const need of ['vibe coding', 'ai-assisted', 'prompts', 'frontend', 'apis', 'databases', 'deployment', 'ai models']) {
    expect(titles.some((t) => need.split(' ')[0] && t.includes(need.split(' ')[0]))).toBe(true);
  }
  for (const e of EXPLAINERS) {
    expect(e.why.length).toBeGreaterThan(20);
    expect(e.analogy.length).toBeGreaterThan(10);
    expect(e.youWill.length).toBeGreaterThan(10);
  }
});

test('true beginner starts at L1M1L1, website goal points at P01', () => {
  const r = recommend({ coded: 'never', aiTools: 'never', goal: 'website' });
  expect(r.startLessonId).toBe('L1M1L1');
  expect(r.focusProjectId).toBe('P01');
  expect(r.fastTrack).toBe(false);
  expect(r.firstWeek.length).toBe(3);
});

test('experienced agent-builder fast-tracks to agent entry', () => {
  const r = recommend({ coded: 'yes', aiTools: 'agent', goal: 'agent' });
  expect(r.fastTrack).toBe(true);
  expect(r.startLessonId).toBe('L8M1L1');
  expect(r.focusProjectId).toBe('P07');
});

test('every goal maps to a real entry lesson + project', () => {
  const goals = ['website', 'mobile', 'automation', 'agent', 'business', 'saas', 'personal'] as const;
  for (const g of goals) {
    const r = recommend({ coded: 'yes', aiTools: 'agent', goal: g });
    expect(r.startLessonId).toMatch(/^L\d/);
    expect(r.focusProjectId).toMatch(/^P/);
    expect(r.keyTools.length).toBeGreaterThanOrEqual(3);
  }
});

test('wizard progress math', () => {
  expect(wizardProgress(0, 12)).toBe(0);
  expect(wizardProgress(12, 12)).toBe(100);
});

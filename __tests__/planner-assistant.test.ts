import { generatePlan } from '../src/lib/planner';
import { createSavedPlan, togglePlanTodo, planProgress, updatePlanIdea, removePlan } from '../src/lib/savedPlans';
import {
  offlineHint, biggerHint, buildPrompt, skillFromCompleted,
  previousLessons, allowedLessonIds, projectFor,
} from '../src/lib/assistant';
import { LESSONS } from '../src/data/curriculum';

const CTX = { skillLevel: 'beginner', completedIds: ['L1M1L1', 'L1M1L2'], currentLessonId: 'L1M1L3' as string, currentProjectId: 'P01' };

test('planner still generates all 11 parts for the facebook example', () => {
  const p = generatePlan('I want an AI system that automatically answers Facebook inquiries and saves leads.');
  for (const k of ['definition', 'features', 'stack', 'architecture', 'phases', 'todos', 'tools', 'database', 'apis', 'aiPlan', 'deployment'] as const) {
    expect(p[k]).toBeTruthy();
    expect(Array.isArray(p[k]) ? (p[k] as string[]).length > 0 : String(p[k]).length > 10).toBe(true);
  }
});

test('saved plans: save → track todos → progress → update → remove', () => {
  const plan = generatePlan('My test app idea');
  const rec = createSavedPlan('My test app idea', plan, '2026-01-01T00:00:00.000Z');
  expect(rec.todosDone).toHaveLength(plan.todos.length);
  expect(planProgress(rec)).toBe(0);
  const t1 = togglePlanTodo(rec, 0);
  expect(t1.todosDone[0]).toBe(true);
  expect(planProgress(t1)).toBeGreaterThan(0);
  const np = generatePlan('My updated bakery app idea');
  const up = updatePlanIdea(t1, 'My updated bakery app idea', np);
  expect(up.idea).toBe('My updated bakery app idea');
  expect(up.todosDone[0]).toBe(true); // overlapping tick preserved
  expect(up.todosDone).toHaveLength(np.todos.length);
  expect(removePlan([up], up.id)).toHaveLength(0);
});

test('assistant answers all 6 spec questions with context', () => {
  const qs = [
    'Explain this simply.',
    'Why am I getting this error?',
    'What should I do next?',
    'Explain this code.',
    'Help me improve this prompt.',
    'Check if I followed the tutorial correctly.',
  ];
  for (const q of qs) {
    const a = offlineHint(q, CTX);
    expect(a.length).toBeGreaterThan(40);
  }
});

test('assistant never references lessons ahead of current+next', () => {
  const allowed = new Set(allowedLessonIds(CTX));
  expect(allowed.has('L1M1L1')).toBe(true);
  expect(allowed.has('L1M1L3')).toBe(true);
  const qs = ['Why error?', 'What next?', 'Check my work please', 'Explain code here'];
  for (const q of qs) {
    const a = offlineHint(q, CTX);
    const hits = LESSONS.map((l) => l.id).filter((id) => a.includes(id));
    for (const h of hits) expect(allowed.has(h)).toBe(true);
  }
});

test('skill + history + project context shape answers and prompts', () => {
  expect(skillFromCompleted(0)).toBe('brand-new beginner');
  expect(skillFromCompleted(30)).toMatch(/independent/);
  expect(previousLessons(CTX).map((l) => l.id)).toEqual(['L1M1L1', 'L1M1L2']);
  expect(projectFor(CTX)?.id).toBe('P01');
  const pr = buildPrompt('Explain this simply.', CTX);
  expect(pr).toMatch(/Current lesson/);
  expect(pr).toMatch(/Previous lessons/);
  expect(pr).toMatch(/Current project: P01/);
  expect(pr).toMatch(/never|ahead|hints/i);
  const h1 = biggerHint(1, CTX);
  const h3 = biggerHint(3, CTX);
  expect(h1.length).toBeGreaterThan(20);
  expect(h3).not.toBe(h1); // escalates
});

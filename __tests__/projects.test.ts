import { PROJECTS } from '../src/data/projects';
import { LEVELS } from '../src/data/curriculum';

test('10 guided projects in spec order', () => {
  expect(PROJECTS.map((p) => p.id)).toEqual(['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10']);
  expect(PROJECTS.map((p) => p.title)).toEqual([
    'Project 01 — Personal Website',
    'Project 02 — Landing Page',
    'Project 03 — CRUD Application',
    'Project 04 — AI Chat Application',
    'Project 05 — Business Automation',
    'Project 06 — AI Customer Support System',
    'Project 07 — AI Agent',
    'Project 08 — Mobile Application',
    'Project 09 — SaaS Application',
    "Project 10 — Student's Own AI Product",
  ]);
});

test('every project has all 10 guided sections', () => {
  const levelIds = new Set(LEVELS.map((l) => l.index));
  for (const p of PROJECTS) {
    expect(levelIds.has(p.level)).toBe(true);
    expect(p.requirements.length).toBeGreaterThanOrEqual(3);
    expect(p.architecture.length).toBeGreaterThan(20);
    expect(p.stack.length).toBeGreaterThanOrEqual(p.id === 'P10' ? 1 : 2);
    expect(p.setup.length).toBeGreaterThanOrEqual(3);
    expect(p.stages.length).toBeGreaterThanOrEqual(3);
    expect(p.prompts.length).toBeGreaterThanOrEqual(2);
    expect(p.testing.length).toBeGreaterThanOrEqual(2);
    expect(p.debugging.length).toBeGreaterThanOrEqual(1);
    expect(p.deployment.length).toBeGreaterThanOrEqual(1);
    expect(p.checklist.length).toBeGreaterThanOrEqual(2);
  }
});

test('capstones match their levels (P01 website … P10 independent)', () => {
  const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
  expect(byId.P01.level).toBe(3);
  expect(byId.P03.level).toBe(4);
  expect(byId.P04.level).toBe(6);
  expect(byId.P05.level).toBe(7);
  expect(byId.P07.level).toBe(8);
  expect(byId.P09.level).toBe(9);
  expect(byId.P10.level).toBe(10);
});

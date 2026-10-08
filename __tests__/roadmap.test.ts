import { LEVELS, MODULES, LESSONS, getLessonsForModule, getLesson } from '../src/data/curriculum';
import { TOOLS } from '../src/data/tools';
import { PROJECTS } from '../src/data/projects';

function idsForLevel(levelId: string): string[] {
  return MODULES.filter((m) => m.levelId === levelId).flatMap((m) => getLessonsForModule(m.id).map((l) => l.id));
}

test('LEVEL 1 — 10 lessons in spec order', () => {
  expect(idsForLevel('L1')).toEqual([
    'L1M1L1', 'L1M1L2', 'L1M1L3', 'L1M1L4', 'L1M1L5',
    'L1M2L1', 'L1M2L2', 'L1M2L3', 'L1M2L4', 'L1M2L5',
  ]);
  expect(getLesson('L1M1L1')?.title).toBe('What is AI?');
  expect(getLesson('L1M1L2')?.title).toBe('What is an LLM?');
  expect(getLesson('L1M1L3')?.title).toBe('What is Vibe Coding?');
  expect(getLesson('L1M1L4')?.title).toBe('AI vs Traditional Programming');
  expect(getLesson('L1M1L5')?.title).toBe('Understanding Prompts');
  expect(getLesson('L1M2L1')?.title).toBe('Understanding Context');
  expect(getLesson('L1M2L2')?.title).toBe('Files and Folders');
  expect(getLesson('L1M2L3')?.title).toBe('Basic Developer Terminology');
  expect(getLesson('L1M2L4')?.title).toBe('Understanding an Application Architecture');
  expect(getLesson('L1M2L5')?.title).toBe('First AI Coding Exercise');
});

test('LEVEL 2 — 10 lessons + 8-tool section', () => {
  expect(idsForLevel('L2')).toEqual([
    'L2M1L1', 'L2M1L2', 'L2M1L3', 'L2M1L4', 'L2M1L5',
    'L2M2L1', 'L2M2L2', 'L2M2L3', 'L2M2L4', 'L2M2L5',
  ]);
  expect(getLesson('L2M1L2')?.title).toMatch(/IDE/);
  expect(getLesson('L2M2L2')?.title).toBe('Package Managers');
  expect(getLesson('L2M2L3')?.title).toBe('Environment Variables');
  const l2Tools = TOOLS.filter((t) =>
    ['ChatGPT', 'AI Coding Assistant', 'VS Code', 'GitHub', 'Git', 'Node.js', 'Terminal', 'Browser DevTools'].includes(t.name),
  );
  expect(l2Tools).toHaveLength(8);
  for (const t of l2Tools) {
    for (const rid of t.relatedLessons) {
      if (rid.startsWith('L2') || rid === 'L3M2L5' || rid.startsWith('L1M2')) {
        expect(getLesson(rid)).toBeTruthy();
      }
    }
  }
});

test('LEVEL 3 — 11 lessons + Personal/Business Website project', () => {
  expect(idsForLevel('L3')).toEqual([
    'L3M1L1', 'L3M1L2', 'L3M1L3', 'L3M1L4', 'L3M1L5',
    'L3M2L1', 'L3M2L2', 'L3M2L3', 'L3M2L4', 'L3M2L5', 'L3M2L6',
  ]);
  expect(getLesson('L3M2L6')?.title).toBe('Build a Complete Website');
  const p01 = PROJECTS.find((p) => p.id === 'P01');
  expect(p01).toBeTruthy();
  expect(p01!.title).toMatch(/Personal Website/);
  expect(LEVELS).toHaveLength(10);
  expect(LESSONS.length).toBe(10 + 10 + 11 + 9 + 11 + 10 + 12 + 10 + 15 + 13);
});

test('LEVEL 4 — 9 lessons + CRUD project', () => {
  expect(idsForLevel('L4')).toEqual([
    'L4M1L1', 'L4M1L2', 'L4M1L3', 'L4M1L4', 'L4M1L5', 'L4M1L6',
    'L4M2L1', 'L4M2L2', 'L4M2L3',
  ]);
  expect(getLesson('L4M1L5')?.title).toBe('JSON');
  expect(getLesson('L4M1L6')?.title).toBe('REST');
  const p03 = PROJECTS.find((p) => p.id === 'P03');
  expect(p03?.title).toMatch(/CRUD/);
});

test('LEVEL 5 — 11 lessons + multi-user project', () => {
  expect(idsForLevel('L5')).toEqual([
    'L5M1L1', 'L5M1L2', 'L5M1L3', 'L5M1L4', 'L5M1L5', 'L5M1L6',
    'L5M2L1', 'L5M2L2', 'L5M2L3', 'L5M2L4', 'L5M2L5',
  ]);
  expect(getLesson('L5M2L2')?.title).toBe('Authorization');
  expect(getLesson('L5M2L3')?.title).toBe('User Sessions');
});

test('LEVEL 6 — 10 lessons + assistant project', () => {
  expect(idsForLevel('L6')).toEqual([
    'L6M1L1', 'L6M1L2', 'L6M1L3', 'L6M1L4', 'L6M1L5',
    'L6M2L1', 'L6M2L2', 'L6M2L3', 'L6M2L4', 'L6M2L5',
  ]);
  expect(getLesson('L6M1L3')?.title).toBe('System Prompts');
  expect(getLesson('L6M2L5')?.title).toMatch(/Cost/);
});

test('LEVEL 7 — 12 lessons + real automation project', () => {
  expect(idsForLevel('L7')).toHaveLength(12);
  expect(getLesson('L7M1L4')?.title).toBe('Webhooks');
  expect(getLesson('L7M2L5')?.title).toBe('AI Decision Steps');
  expect(getLesson('L7M2L6')?.title).toMatch(/Approval/);
});

test('LEVEL 8 — 10 lessons + autonomous agent project', () => {
  expect(idsForLevel('L8')).toHaveLength(10);
  expect(getLesson('L8M1L1')?.title).toBe('What is an AI Agent?');
  expect(getLesson('L8M2L4')?.title).toMatch(/Safety/);
  expect(getLesson('L8M2L5')?.title).toMatch(/Multi-Agent/);
});

test('LEVEL 9 — 15 lessons + SaaS project', () => {
  expect(idsForLevel('L9')).toHaveLength(15);
  expect(getLesson('L9M2L7')?.title).toBe('Security');
  expect(getLesson('L9M2L8')?.title).toMatch(/Launch/);
});

test('LEVEL 10 — 13 lessons, fading hand-holding + final product', () => {
  expect(idsForLevel('L10')).toHaveLength(13);
  expect(getLesson('L10M1L2')?.title).toBe('Create PRD');
  expect(getLesson('L10M2L5')?.title).toBe('Deploy Application');
  expect(getLesson('L10M2L7')?.title).toMatch(/Present/);
  const p10 = PROJECTS.find((p) => p.id === 'P10');
  expect(p10).toBeTruthy();
});

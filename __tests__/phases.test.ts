import { chapterAt, formatClock } from '../src/lib/playback';
import { TOOLS, TOOL_CATEGORIES } from '../src/data/tools';
import { LESSONS, getLesson } from '../src/data/curriculum';

test('player helpers: clock + chapter markers (spec example)', () => {
  expect(formatClock(0)).toBe('0:00');
  expect(formatClock(135)).toBe('2:15');
  expect(formatClock(330)).toBe('5:30');
  expect(formatClock(1260)).toBe('21:00');
  const chapters = [
    { seconds: 0, title: 'Introduction' },
    { seconds: 135, title: 'Project Setup' },
    { seconds: 330, title: 'AI Prompt' },
    { seconds: 560, title: 'Editing Code' },
    { seconds: 850, title: 'Testing' },
    { seconds: 1050, title: 'Debugging' },
    { seconds: 1260, title: 'Deployment' },
  ];
  expect(chapterAt(chapters, 0)).toBe(0);
  expect(chapterAt(chapters, 200)).toBe(1);
  expect(chapterAt(chapters, 560)).toBe(3);
  expect(chapterAt(chapters, 9999)).toBe(6);
});

test('every lesson carries the 7 spec chapter markers', () => {
  const titles = ['Introduction', 'Project Setup', 'AI Prompt', 'Editing Code', 'Testing', 'Debugging', 'Deployment'];
  for (const l of LESSONS) {
    expect(l.chapters.map((c) => c.title)).toEqual(titles);
    expect(l.chapters.map((c) => c.time)).toEqual(['00:00', '02:15', '05:30', '09:20', '14:10', '17:30', '21:00']);
  }
});

test('copy & follow: 5 step kinds present across lessons', () => {
  const kinds = new Set(LESSONS.flatMap((l) => l.steps.map((s) => s.kind)));
  for (const k of ['USER_ACTION', 'AI_PROMPT', 'TERMINAL_COMMAND', 'CODE', 'EXPECTED_RESULT']) {
    expect(kinds.has(k as never)).toBe(true);
  }
});

test('tools vault: 12 categories, all non-empty, full fields', () => {
  expect(TOOL_CATEGORIES).toHaveLength(12);
  for (const c of TOOL_CATEGORIES) {
    expect(TOOLS.filter((t) => t.category === c).length).toBeGreaterThanOrEqual(1);
  }
  for (const t of TOOLS) {
    expect(t.name).toBeTruthy();
    expect(t.icon).toBeTruthy();
    expect(t.what).toBeTruthy();
    expect(t.why).toBeTruthy();
    expect(['free', 'freemium', 'paid']).toContain(t.free);
    expect(t.install).toBeTruthy();
    expect(t.setupSteps.length).toBeGreaterThanOrEqual(3);
    expect(t.setupUrl).toMatch(/^https:\/\//);
    expect(t.website).toMatch(/^https:\/\//);
    expect(t.relatedLessons.length).toBeGreaterThanOrEqual(1);
    for (const rid of t.relatedLessons) expect(getLesson(rid)).toBeTruthy();
  }
});

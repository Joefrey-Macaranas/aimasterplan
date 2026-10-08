import { LEVELS, MODULES, LESSONS, getLessonsForModule } from '../src/data/curriculum';

test('10 levels exist (L1-L10)', () => {
  expect(LEVELS).toHaveLength(10);
  expect(LEVELS.map((l) => l.id)).toEqual(['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10']);
});
test('every level has modules and every module has lessons', () => {
  for (const lv of LEVELS) {
    const mods = MODULES.filter((m) => m.levelId === lv.id);
    expect(mods.length).toBeGreaterThanOrEqual(2);
    for (const m of mods) expect(getLessonsForModule(m.id).length).toBeGreaterThanOrEqual(2);
  }
});
test('every lesson has full PHASE-06 fields', () => {
  for (const l of LESSONS) {
    expect(l.title).toBeTruthy(); expect(l.objective).toBeTruthy();
    expect(l.videoUrl).toMatch(/^https:\/\//); expect(l.chapters.length).toBeGreaterThanOrEqual(5);
    expect(l.steps.length).toBeGreaterThanOrEqual(5);
    expect(l.promptsUsed.length).toBeGreaterThanOrEqual(1);
    expect(l.checklist.length).toBeGreaterThanOrEqual(3);
    expect(l.knowledgeCheck.length).toBeGreaterThanOrEqual(1);
    expect(l.troubleshooting.length).toBeGreaterThanOrEqual(3);
  }
});

import {
  LESSONS, getLesson, getPrevLesson, getNextLesson, getResumeLesson,
  getLessonsForModule, MODULES,
} from '../src/data/curriculum';

// Covers the LESSON SYSTEM checklist: every content field present on all lessons,
// plus navigation (prev/next/resume) that powers Mark Complete, tracking, resume,
// previous/next and bookmarks.
test('every lesson carries all 19 content fields', () => {
  expect(LESSONS.length).toBeGreaterThan(0);
  for (const l of LESSONS) {
    // header: title, objective, expected outcome, difficulty, time
    expect(l.title).toBeTruthy();
    expect(l.objective).toBeTruthy();
    expect(l.expectedOutcome).toBeTruthy();
    expect(['beginner', 'easy', 'medium', 'advanced']).toContain(l.difficulty);
    expect(l.minutes).toBeGreaterThan(0);
    // body: intro, concept, walkthrough, tutorial, code, prompts, tools, resources
    expect(l.intro).toBeTruthy();
    expect(l.concept).toBeTruthy();
    expect(l.videoUrl).toMatch(/^https:\/\//);
    expect(l.chapters.length).toBeGreaterThanOrEqual(5);
    expect(l.transcript).toBeTruthy();
    expect(l.steps.length).toBeGreaterThanOrEqual(5);
    expect(l.codeUsed.length + l.commandsUsed.length).toBeGreaterThanOrEqual(1);
    expect(l.promptsUsed.length).toBeGreaterThanOrEqual(1);
    expect(l.toolsRequired.length).toBeGreaterThanOrEqual(1);
    expect(l.resources.length).toBeGreaterThanOrEqual(1);
    // support: errors, troubleshooting, check, exercise, checklist
    expect(l.commonErrors.length).toBeGreaterThanOrEqual(1);
    expect(l.troubleshooting.length).toBeGreaterThanOrEqual(3);
    expect(l.knowledgeCheck.length).toBeGreaterThanOrEqual(1);
    expect(l.exercise).toBeTruthy();
    expect(l.checklist.length).toBeGreaterThanOrEqual(3);
  }
});

test('prev/next navigation chains every module without gaps', () => {
  for (const m of MODULES) {
    const ls = getLessonsForModule(m.id);
    expect(ls.length).toBeGreaterThanOrEqual(2);
    expect(getPrevLesson(ls[0].id)).toBeUndefined();
    for (let i = 1; i < ls.length; i++) {
      expect(getPrevLesson(ls[i].id)?.id).toBe(ls[i - 1].id);
      expect(getNextLesson(ls[i - 1].id)?.id).toBe(ls[i].id);
    }
  }
  // course boundaries: first lesson has no prev, last has no next
  expect(getPrevLesson(LESSONS[0].id)).toBeUndefined();
  expect(getNextLesson(LESSONS[LESSONS.length - 1].id)).toBeUndefined();
  // module tail spills to the next lesson overall (course order)
  const firstModuleTail = getLessonsForModule(MODULES[0].id).pop()!;
  expect(getNextLesson(firstModuleTail.id)?.id).toBe(LESSONS[MODULES[0] ? getLessonsForModule(MODULES[0].id).length : 0].id);
});

test('resume returns the first incomplete lesson', () => {
  expect(getResumeLesson([])?.id).toBe(LESSONS[0].id);
  expect(getResumeLesson(LESSONS.map((l) => l.id))).toBeUndefined();
  const partial = LESSONS.slice(0, 3).map((l) => l.id);
  expect(getResumeLesson(partial)?.id).toBe(LESSONS[3].id);
});

test('lesson ids are unique and resolvable (bookmarks/mark-complete targets)', () => {
  const ids = LESSONS.map((l) => l.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const id of ids) expect(getLesson(id)?.id).toBe(id);
});

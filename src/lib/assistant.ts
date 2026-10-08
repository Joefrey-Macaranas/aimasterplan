// PHASE 12 — AI LEARNING ASSISTANT (context-aware, never jumps ahead unnecessarily)
import { getLesson, getNextLesson, LESSONS, getModulesForLevel, LEVELS } from '../data/curriculum';
import { PROJECTS } from '../data/projects';
import type { Lesson } from '../types/models';

export interface AssistantContext {
  currentLessonId?: string;
  skillLevel: string;
  completedIds: string[];
  currentProjectId?: string;
}

/** Skill label derived from real progress (screens pass stored level when known). */
export function skillFromCompleted(count: number): string {
  if (count <= 0) return 'brand-new beginner';
  if (count < 5) return 'beginner';
  if (count < 20) return 'advancing builder';
  return 'independent-track builder';
}

/** Last 3 finished lessons — "previous lessons" context, most recent last. */
export function previousLessons(ctx: AssistantContext): Lesson[] {
  const done = ctx.completedIds
    .map((id) => LESSONS.find((l) => l.id === id))
    .filter((l): l is Lesson => Boolean(l));
  return done.slice(-3);
}

/** Farthest lesson the tutor may reference: current + one next (never jumps ahead). */
export function allowedLessonIds(ctx: AssistantContext): string[] {
  const ids = new Set(ctx.completedIds);
  if (ctx.currentLessonId) {
    ids.add(ctx.currentLessonId);
    const nxt = getNextLesson(ctx.currentLessonId);
    if (nxt) ids.add(nxt.id);
  }
  return [...ids];
}

export function projectFor(ctx: AssistantContext) {
  return ctx.currentProjectId ? PROJECTS.find((p) => p.id === ctx.currentProjectId) : undefined;
}

export function buildPrompt(userQ: string, ctx: AssistantContext): string {
  const lesson: Lesson | undefined = ctx.currentLessonId ? getLesson(ctx.currentLessonId) : undefined;
  const levelTitle = lesson ? LEVELS.find((l) => l.id === lesson.id.slice(0, 2))?.title ?? '' : '';
  const prev = previousLessons(ctx);
  const proj = projectFor(ctx);
  return [
    'You are the AI-MasterPlan tutor. Beginner-friendly, WHY before HOW, small steps.',
    `Student level: ${ctx.skillLevel} (derived: ${skillFromCompleted(ctx.completedIds.length)}). Completed ${ctx.completedIds.length} lessons.`,
    lesson ? `Current lesson: ${lesson.title} (${levelTitle}). Objective: ${lesson.objective}.` : 'No current lesson.',
    prev.length ? `Previous lessons: ${prev.map((l) => `${l.id} ${l.title}`).join(' | ')}.` : 'No previous lessons yet.',
    proj ? `Current project: ${proj.id} ${proj.title} (Level ${proj.level}).` : 'No current project selected.',
    lesson
      ? `Course docs in scope: "${lesson.title}" steps(${lesson.steps.map((s) => s.kind).join(',')}) + troubleshooting(${lesson.troubleshooting.length} steps). Reference lesson ${lesson.id} only; next allowed: ${getNextLesson(lesson.id)?.id ?? 'none'}.`
      : 'Course docs: full roadmap Levels 1–10; stay at the student’s current position.',
    'Rules: do not jump ahead of the curriculum; give progressive hints; reference the current lesson steps; explain errors simply.',
    `Student asks: ${userQ}`,
  ].join('\n');
}
// Offline fallback: progressive hints without network (used in MVP + tests)
export function offlineHint(userQ: string, ctx: AssistantContext): string {
  const q = userQ.toLowerCase();
  const lesson: Lesson | undefined = ctx.currentLessonId ? getLesson(ctx.currentLessonId) : undefined;
  const proj = projectFor(ctx);
  const projTail = proj ? ` Your project ${proj.id} (${proj.title}) uses this next — open its workspace when done here.` : '';
  if (q.includes('error') || q.includes('not working') || q.includes('different'))
    return `Let’s debug in 3 steps: (1) tell me the exact message, (2) compare with "What should I see?"${lesson ? ` in ${lesson.id}` : ''}, (3) re-run the last step only — most likely: ${lesson?.commandsUsed[0] ?? 'the last command'}. Which step are you on?`;
  if (q.includes('next')) {
    if (lesson) return `Next: finish checklist item — "${lesson.checklist[0]}" — then run: ${lesson.commandsUsed[0] ?? 'the next step'}. Want me to explain WHY first?${projTail}`;
    return 'Next: open your roadmap and continue the first incomplete lesson. Small wins compound.';
  }
  if (q.includes('check') || q.includes('followed') || q.includes('correctly') || q.includes('did i do')) {
    if (lesson)
      return `Let’s verify ${lesson.id} together — tick these: (1) ${lesson.checklist[0]}, (2) you ran: ${lesson.commandsUsed[0] ?? 'the command'}, (3) your screen matches "${lesson.steps.find((s) => s.kind === 'EXPECTED_RESULT')?.body.slice(0, 80) ?? 'the expected result'}…". Tell me which one fails and I’ll hint just that step.`;
    return 'Open the lesson checklist and tell me which item fails — I’ll verify that step only, no spoilers for the rest.';
  }
  if (q.includes('explain') || q.includes('simply'))
    return 'Simple version: the app is like a restaurant — frontend is the menu/table (what you see), backend is the kitchen (does the work), database is the pantry (stores things). Which part feels fuzzy?';
  if (q.includes('prompt'))
    return 'Strong prompt recipe: GOAL + CONTEXT (files) + CONSTRAINTS + EXAMPLE of DONE. Paste yours and I’ll improve it with you.';
  if (q.includes('code'))
    return 'Paste the code + what you expected vs what happened. I’ll explain line-by-line in plain words.';
  return 'Got it. Tell me: (1) current lesson, (2) what you did, (3) what you expected vs saw. I’ll guide with hints, not spoilers.';
}

/** Escalating hint: reveals the next concrete artifact (checklist → command → fix). */
export function biggerHint(level: number, ctx: AssistantContext): string {
  const lesson = ctx.currentLessonId ? getLesson(ctx.currentLessonId) : undefined;
  if (!lesson) return 'Open your current lesson and tell me its ID — hints work best pinned to one lesson.';
  const steps = [
    `Hint 1 — do just this: "${lesson.checklist[0]}". Nothing else yet.`,
    `Hint 2 — run exactly: ${lesson.commandsUsed[0] ?? lesson.promptsUsed[0] ?? 'the first step'}. Then compare with "What should I see?".`,
    `Hint 3 — the fix for the usual suspect: ${lesson.commonErrors[0]?.error} → ${lesson.commonErrors[0]?.fix}`,
    `Almost answer — re-read "${lesson.title}" troubleshooting step 3, then tell me what changed. I still won’t jump ahead of ${lesson.id}.`,
  ];
  return steps[Math.min(Math.max(level, 0), steps.length - 1)];
}
export { getModulesForLevel };

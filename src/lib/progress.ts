// Progress + streak engine (PHASE 15)
import { LESSONS, getLessonsForModule, MODULES } from '../data/curriculum';
import { PROJECTS } from '../data/projects';

export function overallProgress(completedIds: string[]): number {
  if (LESSONS.length === 0) return 0;
  const done = LESSONS.filter((l) => completedIds.includes(l.id)).length;
  return Math.round((done / LESSONS.length) * 100);
}
export function levelProgress(levelId: string, completedIds: string[]): number {
  const mods = MODULES.filter((m) => m.levelId === levelId).map((m) => m.id);
  const lessons = LESSONS.filter((l) => mods.includes(l.moduleId));
  if (!lessons.length) return 0;
  const done = lessons.filter((l) => completedIds.includes(l.id)).length;
  return Math.round((done / lessons.length) * 100);
}
export function moduleProgress(moduleId: string, completedIds: string[]): number {
  const lessons = getLessonsForModule(moduleId);
  if (!lessons.length) return 0;
  const done = lessons.filter((l) => completedIds.includes(l.id)).length;
  return Math.round((done / lessons.length) * 100);
}
/** Project stage completion 0–100 for one project. */
export function projectProgress(totalStages: number, doneCount: number): number {
  if (totalStages <= 0) return 0;
  return Math.round((Math.max(0, Math.min(totalStages, doneCount)) / totalStages) * 100);
}
/** How many projects are fully complete given a pid → done-stages map. */
export function completedProjectsCount(doneByProject: Record<string, string[]>): number {
  return PROJECTS.filter((p) => projectProgress(p.stages.length, (doneByProject[p.id] ?? []).length) === 100).length;
}
/** YYYY-MM-DD key for activity tracking. */
export function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
/** Pure activity append (dedupes days). */
export function recordDate(datesISO: string[], atISO: string): string[] {
  const day = atISO.slice(0, 10);
  return datesISO.some((d) => d.slice(0, 10) === day) ? datesISO : [...datesISO, atISO];
}
export function currentStreakDayCount(datesISO: string[]): number {
  const days = new Set(datesISO.map((d) => d.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    else if (streak === 0) { cursor.setDate(cursor.getDate() - 1); if (streak === 0 && !days.has(cursor.toISOString().slice(0, 10))) break; else continue; }
    else break;
    if (streak > 365) break;
  }
  return streak;
}

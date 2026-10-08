// Progress + streak engine (PHASE 15)
import { LESSONS } from '../data/curriculum';

export function overallProgress(completedIds: string[]): number {
  if (LESSONS.length === 0) return 0;
  const done = LESSONS.filter((l) => completedIds.includes(l.id)).length;
  return Math.round((done / LESSONS.length) * 100);
}
export function levelProgress(levelId: string, completedIds: string[]): number {
  const { MODULES } = require('../data/curriculum') as typeof import('../data/curriculum');
  const mods = MODULES.filter((m) => m.levelId === levelId).map((m) => m.id);
  const lessons = LESSONS.filter((l) => mods.includes(l.moduleId));
  if (!lessons.length) return 0;
  const done = lessons.filter((l) => completedIds.includes(l.id)).length;
  return Math.round((done / lessons.length) * 100);
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

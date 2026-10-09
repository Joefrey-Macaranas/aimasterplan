// XP engine (PHASE 15)
import { ACHIEVEMENTS, XP_PER_LESSON, XP_PER_PROJECT_STAGE } from '../data/gamification';

export function xpForLessons(count: number): number { return count * XP_PER_LESSON; }
export function xpForProjectStages(count: number): number { return count * XP_PER_PROJECT_STAGE; }
export function levelForXp(xp: number): number { return Math.floor(Math.sqrt(xp / 100)) + 1; }
export function achievementsFor(completedIds: string[], projectCount: number): string[] {
  const out: string[] = [];
  if (completedIds.length >= 1) out.push('first-lesson');
  if (completedIds.length >= 5) out.push('first-prompt');
  if (completedIds.some((id) => id.startsWith('L3'))) out.push('first-app');
  if (completedIds.some((id) => id.startsWith('L4'))) out.push('first-api');
  if (completedIds.some((id) => id.startsWith('L5'))) out.push('first-db');
  if (completedIds.some((id) => id.startsWith('L6'))) out.push('first-ai');
  if (completedIds.some((id) => id.startsWith('L7'))) out.push('first-auto');
  if (completedIds.some((id) => id.startsWith('L10'))) out.push('first-deploy');
  if (projectCount >= 4) out.push('ai-builder');
  if (completedIds.some((id) => id === 'L10M2L7')) out.push('independent');
  return out;
}
export function xpBreakdown(completedIds: string[]): { total: number; level: number } {
  const total = xpForLessons(completedIds.length);
  return { total, level: levelForXp(total) };
}
/** Full XP: lessons + project stages, with the split exposed for the dashboard. */
export function xpBreakdownFull(completedIds: string[], projectStageCount: number): { total: number; level: number; fromLessons: number; fromProjects: number } {
  const fromLessons = xpForLessons(completedIds.length);
  const fromProjects = xpForProjectStages(projectStageCount);
  const total = fromLessons + fromProjects;
  return { total, level: levelForXp(total), fromLessons, fromProjects };
}
// --- weekly goals (Monday-start weeks, local calendar days) ---
export function weekStartKey(now = new Date()): string {
  const d = new Date(now);
  const dow = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - dow);
  return d.toISOString().slice(0, 10);
}
export function countThisWeek(datesISO: string[], now = new Date()): number {
  const start = weekStartKey(now);
  return new Set(datesISO.map((d) => d.slice(0, 10)).filter((day) => day >= start)).size;
}
export function weeklyStatus(datesISO: string[], target: number, now = new Date()): { done: number; target: number; pct: number; met: boolean } {
  const done = countThisWeek(datesISO, now);
  const t = Math.max(1, Math.round(target) || 1);
  return { done, target: t, pct: Math.min(100, Math.round((done / t) * 100)), met: done >= t };
}
export { ACHIEVEMENTS };

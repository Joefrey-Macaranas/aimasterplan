// XP engine (PHASE 15)
import { ACHIEVEMENTS, XP_PER_LESSON } from '../data/gamification';

export function xpForLessons(count: number): number { return count * XP_PER_LESSON; }
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
  if (completedIds.some((id) => id === 'L10M2L2')) out.push('independent');
  return out;
}
export function xpBreakdown(completedIds: string[]): { total: number; level: number } {
  const total = xpForLessons(completedIds.length);
  return { total, level: levelForXp(total) };
}
export { ACHIEVEMENTS };

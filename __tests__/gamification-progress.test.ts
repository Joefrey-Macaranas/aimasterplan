import { moduleProgress, projectProgress, completedProjectsCount, recordDate, dayKey } from '../src/lib/progress';
import {
  xpForProjectStages, xpBreakdownFull, levelForXp,
  weekStartKey, countThisWeek, weeklyStatus, achievementsFor,
} from '../src/lib/gamification';
import { XP_PER_PROJECT_STAGE } from '../src/data/gamification';

test('module progress slices its own lessons only', () => {
  expect(moduleProgress('L1M1', [])).toBe(0);
  expect(moduleProgress('L1M1', ['L1M1L1', 'L1M1L2', 'L1M1L3', 'L1M1L4', 'L1M1L5'])).toBe(100);
  expect(moduleProgress('L1M1', ['L1M1L1'])).toBe(20);
  expect(moduleProgress('L1M2', ['L1M1L1'])).toBe(0);
  expect(moduleProgress('NOPE', ['L1M1L1'])).toBe(0);
});

test('project completion: stages → pct → finished count', () => {
  expect(projectProgress(5, 0)).toBe(0);
  expect(projectProgress(5, 5)).toBe(100);
  expect(projectProgress(4, 2)).toBe(50);
  expect(projectProgress(0, 0)).toBe(0);
  expect(projectProgress(4, 99)).toBe(100);
  expect(completedProjectsCount({})).toBe(0);
  expect(completedProjectsCount({ P01: ['Generate', 'Style', 'Navigate', 'Debug', 'Publish'] })).toBe(1);
  expect(completedProjectsCount({ P01: ['Generate'] })).toBe(0);
});

test('XP: lessons + project stages with visible split', () => {
  expect(xpForProjectStages(0)).toBe(0);
  expect(xpForProjectStages(2)).toBe(2 * XP_PER_PROJECT_STAGE);
  const full = xpBreakdownFull(['L1M1L1', 'L1M1L2'], 4);
  expect(full.fromLessons).toBe(2 * 50);
  expect(full.fromProjects).toBe(4 * XP_PER_PROJECT_STAGE);
  expect(full.total).toBe(full.fromLessons + full.fromProjects);
  expect(full.level).toBe(levelForXp(full.total));
});

test('all 10 spec badges unlock on the right evidence', () => {
  expect(achievementsFor(['L1M1L1'], 0)).toContain('first-lesson');
  expect(achievementsFor(['L1M1L1', 'L1M1L2', 'L1M1L3', 'L1M1L4', 'L1M1L5'], 0)).toContain('first-prompt');
  expect(achievementsFor(['L3M1L1'], 0)).toContain('first-app');
  expect(achievementsFor(['L4M1L1'], 0)).toContain('first-api');
  expect(achievementsFor(['L5M1L1'], 0)).toContain('first-db');
  expect(achievementsFor(['L6M1L1'], 0)).toContain('first-ai');
  expect(achievementsFor(['L7M1L1'], 0)).toContain('first-auto');
  expect(achievementsFor(['L10M1L1'], 0)).toContain('first-deploy');
  expect(achievementsFor([], 4)).toContain('ai-builder');
  expect(achievementsFor([], 3)).not.toContain('ai-builder');
  expect(achievementsFor(['L10M2L7'], 0)).toContain('independent');
  expect(achievementsFor(['L10M2L2'], 0)).not.toContain('independent');
});

test('streak activity dedupes by day', () => {
  expect(recordDate([], '2026-10-08T10:00:00.000Z')).toEqual(['2026-10-08T10:00:00.000Z']);
  expect(recordDate(['2026-10-08T10:00:00.000Z'], '2026-10-08T22:00:00.000Z')).toHaveLength(1);
  expect(recordDate(['2026-10-08T10:00:00.000Z'], '2026-10-09T01:00:00.000Z')).toHaveLength(2);
  expect(dayKey(new Date('2026-10-08T12:00:00Z'))).toBe('2026-10-08');
});

test('weekly goals: Monday weeks, counts, met flag', () => {
  // 2026-10-08 is a Thursday; week starts Monday 2026-10-05
  expect(weekStartKey(new Date('2026-10-08T12:00:00Z'))).toBe('2026-10-05');
  expect(weekStartKey(new Date('2026-10-05T00:00:00Z'))).toBe('2026-10-05');
  const dates = ['2026-10-05T10:00:00Z', '2026-10-05T20:00:00Z', '2026-10-07T10:00:00Z', '2026-09-30T10:00:00Z'];
  expect(countThisWeek(dates, new Date('2026-10-08T12:00:00Z'))).toBe(2);
  const met = weeklyStatus(dates, 2, new Date('2026-10-08T12:00:00Z'));
  expect(met).toEqual({ done: 2, target: 2, pct: 100, met: true });
  const short = weeklyStatus(dates, 5, new Date('2026-10-08T12:00:00Z'));
  expect(short.met).toBe(false);
  expect(short.pct).toBe(40);
});

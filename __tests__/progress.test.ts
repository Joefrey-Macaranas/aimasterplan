import { overallProgress, levelProgress } from '../src/lib/progress';
import { LESSONS } from '../src/data/curriculum';
import { xpBreakdown, achievementsFor } from '../src/lib/gamification';

test('overall progress math', () => {
  expect(overallProgress([])).toBe(0);
  expect(overallProgress(LESSONS.map((l) => l.id))).toBe(100);
});
test('level progress subset', () => {
  expect(levelProgress('L1', [])).toBe(0);
  expect(levelProgress('L1', ['L1M1L1','L1M1L2','L1M1L3','L1M1L4','L1M1L5','L1M2L1','L1M2L2','L1M2L3','L1M2L4','L1M2L5'])).toBe(100);
  expect(levelProgress('L1', ['L1M1L1'])).toBe(10);
});
test('xp + achievements', () => {
  const { total, level } = xpBreakdown(['L1M1L1','L3M1L1','L4M1L1','L5M1L1','L6M1L1','L7M1L1']);
  expect(total).toBe(6 * 50); expect(level).toBeGreaterThanOrEqual(1);
  const a = achievementsFor(['L1M1L1','L3M1L1','L6M2L2'], 4);
  expect(a).toContain('first-lesson'); expect(a).toContain('ai-builder');
});

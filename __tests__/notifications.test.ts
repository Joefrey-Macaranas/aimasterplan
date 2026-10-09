import {
  TRIGGER_KINDS, defaultPrefs, payloadFor, newBadges, routeForData,
} from '../src/lib/notifications';

test('all 9 notify moments exist with routes', () => {
  expect(TRIGGER_KINDS.map((t) => t.label)).toEqual([
    'New module', 'New lesson', 'Continue learning', 'Weekly Meet & Greet',
    'Meeting starting soon', 'Instructor announcement', 'Comment / reply',
    'Achievement unlocked', 'Project milestone',
  ]);
  for (const t of TRIGGER_KINDS) expect(t.route).toMatch(/^\//);
  const prefs = defaultPrefs();
  expect(Object.keys(prefs)).toHaveLength(9);
  expect(Object.values(prefs).every(Boolean)).toBe(true);
});

test('payloads carry lesson/badge/project context + routes', () => {
  const c = payloadFor('Continue learning', { lessonId: 'L1M1L1', lessonTitle: 'What is AI?' });
  expect(c.body).toContain('L1M1L1');
  expect(c.route).toBe('/progress');
  const a = payloadFor('Achievement unlocked', { badge: 'First Lesson' });
  expect(a.body).toContain('First Lesson');
  expect(a.route).toBe('/achievements');
  const m = payloadFor('Meeting starting soon', { hoursLeft: 1 });
  expect(m.route).toBe('/meet');
  const p = payloadFor('Project milestone', { projectId: 'P01' });
  expect(p.body).toContain('P01');
  const n = payloadFor('New lesson', { lessonId: 'L2M1L1', lessonTitle: 'Tools' });
  expect(n.body).toContain('L2M1L1');
});

test('badge diff + deep-link routing', () => {
  expect(newBadges(['a', 'b'], ['a'])).toEqual(['b']);
  expect(newBadges([], [])).toEqual([]);
  expect(routeForData({ route: '/meet' })).toBe('/meet');
  expect(routeForData(null)).toBe('/(tabs)/home');
  expect(routeForData({})).toBe('/(tabs)/home');
});

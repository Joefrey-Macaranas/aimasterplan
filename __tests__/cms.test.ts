import {
  createNode, renameNode, moveNode, setStatus, deleteNode, childrenOf,
  emptyDraft, validateDraft, rosterStats, moderate, pendingReports,
  announcementText, progressPct,
} from '../src/lib/cms';

test('content tree: create → rename → reorder → publish → delete (cascades)', () => {
  let n = createNode([], 'course', null, '  Vibe Coding  ');
  expect(n[0].status).toBe('draft');
  n = createNode(n, 'level', n[0].id, 'L1');
  n = createNode(n, 'module', n[1].id, 'M1');
  n = createNode(n, 'lesson', n[2].id, 'Hello');
  expect(n).toHaveLength(4);
  n = renameNode(n, n[3].id, 'Hello World');
  expect(n.find((x) => x.id === n[3].id)?.title).toBe('Hello World');
  n = renameNode(n, n[3].id, '   ');
  expect(n.find((x) => x.id === n[3].id)?.title).toBe('Hello World');
  const l2 = createNode(n, 'lesson', n[2].id, 'Second');
  const ids = childrenOf(l2, 'lesson', n[2].id).map((x) => x.id);
  const moved = moveNode(l2, ids[1], -1);
  expect(childrenOf(moved, 'lesson', n[2].id)[0].id).toBe(ids[1]);
  const pub = setStatus(moved, ids[0], 'published');
  expect(pub.find((x) => x.id === ids[0])?.status).toBe('published');
  const gone = deleteNode(pub, n[1].id);
  expect(gone.filter((x) => x.id !== n[0].id)).toHaveLength(0); // cascade wiped level+module+lessons
});

test('lesson editor validation covers all 10 blocks', () => {
  expect(validateDraft(emptyDraft()).length).toBeGreaterThanOrEqual(10);
  const full = {
    ...emptyDraft(), title: 'T', objective: 'O', intro: 'I', videoUrl: 'https://x',
    images: 'https://img', code: 'c', commands: 'cmd', prompts: 'p',
    downloads: 'starter | https://x', links: 'docs | https://x',
    quizQ: 'q?', quizA: 'a', exercise: 'do it',
  };
  expect(validateDraft(full)).toEqual([]);
});

test('roster stats spotlight at-risk students', () => {
  const s = rosterStats([
    { id: 'a', name: 'A', email: 'a@x.co', enrollment: 'active', completedLessons: 100, totalLessons: 100, completedProjects: 5, attendance: 8 },
    { id: 'b', name: 'B', email: 'b@x.co', enrollment: 'active', completedLessons: 2, totalLessons: 100, completedProjects: 0, attendance: 0 },
    { id: 'c', name: 'C', email: 'c@x.co', enrollment: 'pending', completedLessons: 0, totalLessons: 100, completedProjects: 0, attendance: 0 },
  ]);
  expect(s).toMatchObject({ total: 3, active: 2 });
  expect(s.avgPct).toBe(34);
  expect(s.atRisk.map((r) => r.id)).toEqual(['b']);
  expect(progressPct({ id: 'x', name: 'X', email: 'x', enrollment: 'active', completedLessons: 1, totalLessons: 0, completedProjects: 0, attendance: 0 })).toBe(0);
});

test('moderation queue: report order, approve clears, hide hides', () => {
  const items = [
    { id: 'm1', author: 'A', body: 'spam', reports: 5, hidden: false },
    { id: 'm2', author: 'B', body: 'rude', reports: 2, hidden: false },
    { id: 'm3', author: 'C', body: 'ok', reports: 0, hidden: false },
  ];
  expect(pendingReports(items).map((m) => m.id)).toEqual(['m1', 'm2']);
  const approved = moderate(items, 'm1', 'approve');
  expect(approved.find((m) => m.id === 'm1')).toMatchObject({ reports: 0 });
  const hidden = moderate(items, 'm2', 'hide');
  expect(hidden.find((m) => m.id === 'm2')?.hidden).toBe(true);
  expect(pendingReports(hidden).map((m) => m.id)).toEqual(['m1']);
});

test('announcement text is share-ready', () => {
  const t = announcementText('Meet Friday', 'Bring questions.');
  expect(t).toContain('Meet Friday');
  expect(t).toContain('AI-MasterPlan');
});

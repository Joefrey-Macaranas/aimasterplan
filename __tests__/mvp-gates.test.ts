import { loadSeed, seedCounts, seedLessonBlocks, seedVideoUrl, seedMeeting } from '../src/lib/seedAdapter';
import { grantFor } from '../src/lib/videoAccess';
import { catalogDrift, syncLessonProgressRemote, rsvpMeetRemote, savePushTokenRemote, publishLessonRemote } from '../src/lib/sync';
import { TOOLS } from '../src/data/tools';
import { PROJECTS } from '../src/data/projects';

test('seed bundles :8083 MVP content (10/20/111/13/10/1)', () => {
  const s = loadSeed();
  expect(s).not.toBeNull();
  const c = seedCounts();
  expect(c.levels).toBe(10);
  expect(c.modules).toBe(20);
  expect(c.lessons).toBe(111);
  expect(c.tools).toBe(13);
  expect(c.projects).toBe(10);
  expect(c.meetings).toBe(1);
  expect(s!.levels.length).toBe(10);
  expect(s!.lessons.length).toBe(111);
});

test('every seed lesson has blocks; L1M1L1 has video+code+prompt', () => {
  const s = loadSeed()!;
  for (const l of s.lessons) {
    expect(seedLessonBlocks(l.id).length).toBeGreaterThan(0);
  }
  const types = seedLessonBlocks('L1M1L1').map((b) => b.type);
  expect(types).toEqual(expect.arrayContaining(['heading', 'text', 'video', 'code', 'terminal', 'prompt']));
  expect(seedVideoUrl('L1M1L1')).toMatch(/^https:\/\//);
});

test('bundled catalog matches seed (no drift)', () => {
  const d = catalogDrift();
  expect(d.tools.local).toBe(TOOLS.length);
  expect(d.projects.local).toBe(PROJECTS.length);
  expect(d.tools.ok).toBe(true);
  expect(d.projects.ok).toBe(true);
});

test('video gate: anon 401, unenrolled 402, enrolled ok — never leaks URL when denied', () => {
  const anon = grantFor('L1M1L1', { userId: null, role: 'student', enrolled: false }, 'https://cdn/fallback.mp4');
  expect(anon.ok).toBe(false);
  if (!anon.ok) {
    expect(anon.code).toBe(401);
    expect(JSON.stringify(anon)).not.toMatch(/cdn|mp4/);
  }
  const locked = grantFor('L1M1L1', { userId: 'u-1', role: 'student', enrolled: false }, 'https://cdn/fallback.mp4');
  expect(locked.ok).toBe(false);
  if (!locked.ok) {
    expect(locked.code).toBe(402);
    expect(JSON.stringify(locked)).not.toMatch(/cdn|mp4/);
  }
  const open = grantFor('L1M1L1', { userId: 'u-1', role: 'student', enrolled: true }, 'https://cdn/fallback.mp4');
  expect(open.ok).toBe(true);
  if (open.ok) expect(open.url).toMatch(/^https:\/\//);
  const staff = grantFor('L1M1L1', { userId: 'u-2', role: 'admin', enrolled: false }, 'https://cdn/fallback.mp4');
  expect(staff.ok).toBe(true);
});

test('seed meeting is weekly with join url', () => {
  const m = seedMeeting();
  expect(m).not.toBeNull();
  expect(m!.join_url).toMatch(/^https:\/\//);
});

test('sync writers resolve offline without throwing', async () => {
  await expect(syncLessonProgressRemote('u-1', 'L1M1L1', true, 42)).resolves.toEqual({ ok: true, offline: true });
  await expect(rsvpMeetRemote('u-1', 'meet-weekly')).resolves.toEqual({ ok: true, offline: true });
  await expect(savePushTokenRemote('u-1', 'ExponentPushToken[x]', 'ios')).resolves.toEqual({ ok: true, offline: true });
  await expect(publishLessonRemote({ id: 'L1M1L1', module_id: 'L1M1', idx: 1, title: 't', objective: 'o', video_url: '', minutes: 12 })).resolves.toEqual({ ok: true, offline: true });
});

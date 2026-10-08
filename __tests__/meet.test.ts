import {
  countdownTo, countdownLabel, icsFor, nextWeekly,
  markAttended, attendanceCount, addQuestion, toggleUpvote, topQuestions,
} from '../src/lib/meet';
import { MEET_AUTHOR, MEET_FORMAT, MEET_ARCHIVE, MEET_QUESTION_SEED } from '../src/data/meet';

test('countdown math + labels', () => {
  const base = new Date('2026-10-08T12:00:00Z').getTime();
  const c = countdownTo(new Date(base + (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000).toISOString(), base);
  expect(c).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5, past: false });
  expect(countdownLabel(c)).toMatch(/2d 3h/);
  expect(countdownTo(new Date(base - 1000).toISOString(), base).past).toBe(true);
  expect(countdownLabel({ days: 0, hours: 0, minutes: 0, seconds: 0, past: true })).toMatch(/archive/);
});

test('weekly recurrence + calendar file', () => {
  const nxt = nextWeekly('2026-10-08T12:00:00.000Z');
  expect(new Date(nxt).getTime() - new Date('2026-10-08T12:00:00.000Z').getTime()).toBe(7 * 864e5);
  const ics = icsFor({ title: 'T', description: 'D', url: 'https://x', startsAtISO: '2026-10-08T12:00:00.000Z' });
  expect(ics).toMatch(/BEGIN:VCALENDAR/);
  expect(ics).toMatch(/RRULE:FREQ=WEEKLY/);
  expect(ics).toMatch(/SUMMARY:T/);
});

test('session format covers all 7 required segments', () => {
  expect(MEET_FORMAT.map((s) => s.title)).toEqual([
    'Welcome / community updates',
    'Student Q&A',
    'Project troubleshooting',
    'Student project showcase',
    'New AI / Vibe Coding tips',
    'Open discussion',
    "What's coming next",
  ]);
  expect(MEET_FORMAT.reduce((n, s) => n + s.minutes, 0)).toBe(60);
  expect(MEET_AUTHOR.name).toBeTruthy();
});

test('archive has recordings + notes', () => {
  expect(MEET_ARCHIVE.length).toBeGreaterThanOrEqual(3);
  for (const a of MEET_ARCHIVE) {
    expect(a.recordingUrl).toMatch(/^https:\/\//);
    expect(a.notes.length).toBeGreaterThanOrEqual(2);
  }
});

test('attendance tracking is idempotent', () => {
  expect(markAttended([], 'm1')).toEqual(['m1']);
  expect(markAttended(['m1'], 'm1')).toEqual(['m1']);
  expect(attendanceCount(['m1', 'm2'])).toBe(2);
});

test('questions: submit trims + upvote toggles + top sorts', () => {
  expect(addQuestion(MEET_QUESTION_SEED, 'Zed', '   ')).toHaveLength(MEET_QUESTION_SEED.length);
  const with1 = addQuestion(MEET_QUESTION_SEED, 'Zed', 'L1M1L1: what is AI?');
  expect(with1).toHaveLength(MEET_QUESTION_SEED.length + 1);
  const v1 = toggleUpvote(with1, 'mq1', []);
  expect(v1.list.find((q) => q.id === 'mq1')?.votes).toBe(13);
  expect(v1.voted).toEqual(['mq1']);
  const v2 = toggleUpvote(v1.list, 'mq1', v1.voted);
  expect(v2.list.find((q) => q.id === 'mq1')?.votes).toBe(12);
  expect(topQuestions(v1.list, 1)[0].id).toBe('mq1');
});

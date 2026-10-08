// Meet & Greet helpers: countdown, calendar file, attendance, Q&A voting. Pure + tested.
import type { MeetQuestion } from '../data/meet';

export interface Countdown { days: number; hours: number; minutes: number; seconds: number; past: boolean }

export function countdownTo(targetISO: string, nowMs = Date.now()): Countdown {
  const diff = new Date(targetISO).getTime() - nowMs;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    past: false,
  };
}

export function countdownLabel(c: Countdown): string {
  if (c.past) return 'Live now or just ended — check the archive below.';
  if (c.days > 0) return `${c.days}d ${c.hours}h ${c.minutes}m to go`;
  return `${c.hours}h ${c.minutes}m ${c.seconds}s to go`;
}

/** Minimal .ics for "Add to Calendar" (weekly session, 60 min). */
export function icsFor(opts: { title: string; description: string; url: string; startsAtISO: string }): string {
  const dt = new Date(opts.startsAtISO);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = new Date(dt.getTime() + 60 * 60 * 1000);
  const esc = (t: string) => t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AI-MasterPlan//Meet//EN', 'BEGIN:VEVENT',
    `UID:${Date.now()}@aimasterplan.app`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(dt)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(opts.title)}`, `DESCRIPTION:${esc(opts.description)}`, `URL:${esc(opts.url)}`,
    'RRULE:FREQ=WEEKLY', 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}

export function nextWeekly(fromISO: string): string {
  return new Date(new Date(fromISO).getTime() + 7 * 864e5).toISOString();
}

// --- attendance (pure over id lists; screens persist to AsyncStorage) ---
export function markAttended(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids : [...ids, id];
}
export function attendanceCount(ids: string[]): number {
  return ids.length;
}

// --- pre-submitted questions (pure; screens persist) ---
export function addQuestion(list: MeetQuestion[], author: string, body: string): MeetQuestion[] {
  const clean = body.trim().slice(0, 280);
  if (!clean) return list;
  return [...list, { id: `mq-${Date.now()}`, author: author.trim().slice(0, 40) || 'Anonymous', body: clean, votes: 0 }];
}
export function toggleUpvote(list: MeetQuestion[], id: string, voted: string[]): { list: MeetQuestion[]; voted: string[] } {
  const has = voted.includes(id);
  return {
    list: list.map((q) => (q.id === id ? { ...q, votes: Math.max(0, q.votes + (has ? -1 : 1)) } : q)),
    voted: has ? voted.filter((v) => v !== id) : [...voted, id],
  };
}
export function topQuestions(list: MeetQuestion[], n = 5): MeetQuestion[] {
  return [...list].sort((a, b) => b.votes - a.votes).slice(0, n);
}

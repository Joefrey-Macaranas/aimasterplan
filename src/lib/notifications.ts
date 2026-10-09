// Push notifications: 9 triggers, prefs, payloads, scheduling, deep links.
// expo-notifications is lazily required so jest/node (and web) never parse native code.
// Pure builders are tested; device calls degrade gracefully when denied.
import type { NotifyKind } from './misc';
import { notifyTitle } from './misc';

/** Web check without importing react-native (keeps jest/node green). */
function isWeb(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native').Platform.OS === 'web';
  } catch {
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function expoNotifications(): any {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-notifications');
  } catch {
    return null;
  }
}

export const TRIGGER_KINDS: { kind: NotifyKind; label: string; hint: string; route: string }[] = [
  { kind: 'new-lesson', label: 'New module', hint: 'A new module lands in your path.', route: '/roadmap' },
  { kind: 'new-lesson', label: 'New lesson', hint: 'A fresh walkthrough is ready.', route: '/roadmap' },
  { kind: 'continue', label: 'Continue learning', hint: 'Daily gentle nudge with your next lesson.', route: '/progress' },
  { kind: 'meetup', label: 'Weekly Meet & Greet', hint: '24h before the session.', route: '/meet' },
  { kind: 'meetup', label: 'Meeting starting soon', hint: '1h before the session.', route: '/meet' },
  { kind: 'announcement', label: 'Instructor announcement', hint: 'Tips + course news from the author.', route: '/community' },
  { kind: 'reply', label: 'Comment / reply', hint: 'Someone answered your question.', route: '/community' },
  { kind: 'achievement', label: 'Achievement unlocked', hint: 'The moment a badge is earned.', route: '/achievements' },
  { kind: 'achievement', label: 'Project milestone', hint: 'Stage and project completions.', route: '/progress' },
];

export type Prefs = Record<string, boolean>;
export const PREFS_KEY = 'amp-notify-prefs';
export const LOG_KEY = 'amp-notify-log';

export interface LogEntry { id: string; title: string; body: string; route: string; at: string; read: boolean }

export function defaultPrefs(): Prefs {
  return Object.fromEntries(TRIGGER_KINDS.map((t) => [t.label, true]));
}

export function payloadFor(label: string, vars: { lessonId?: string; lessonTitle?: string; badge?: string; projectId?: string; hoursLeft?: number }): { title: string; body: string; route: string } {
  const t = TRIGGER_KINDS.find((x) => x.label === label) ?? TRIGGER_KINDS[2];
  const base = notifyTitle(t.kind);
  switch (label) {
    case 'New module':
      return { title: base, body: `New module live${vars.lessonId ? `: ${vars.lessonId}` : ''} — open the roadmap to start it.`, route: t.route };
    case 'New lesson':
      return { title: base, body: `“${vars.lessonTitle ?? 'A new walkthrough'}” (${vars.lessonId ?? 'new'}) is ready — 15 min today keeps momentum.`, route: t.route };
    case 'Continue learning':
      return { title: base, body: vars.lessonId ? `Resume ${vars.lessonId} — ${vars.lessonTitle ?? 'your lesson'}. Small wins compound.` : 'Resume your next lesson — small wins compound.', route: t.route };
    case 'Weekly Meet & Greet':
      return { title: 'Weekly Meet & Greet soon', body: 'Tomorrow: bring one question + your lesson ID. Same link, same time.', route: t.route };
    case 'Meeting starting soon':
      return { title: 'Meeting starting soon', body: `Starts in ~${vars.hoursLeft ?? 1}h — join with one question ready.`, route: t.route };
    case 'Instructor announcement':
      return { title: base, body: 'New tip from the author — strong prompts = GOAL + CONTEXT + CONSTRAINTS + EXAMPLE.', route: t.route };
    case 'Comment / reply':
      return { title: 'New reply', body: 'Someone replied to your post — open Community to continue the thread.', route: t.route };
    case 'Achievement unlocked':
      return { title: base, body: `You earned “${vars.badge ?? 'a new badge'}” — open Achievements to celebrate.`, route: t.route };
    case 'Project milestone':
      return { title: base, body: `${vars.projectId ?? 'Your project'} hit a milestone — check the workspace for the next stage.`, route: t.route };
    default:
      return { title: base, body: 'Something new in AI-MasterPlan — open the app.', route: '/(tabs)/home' };
  }
}

/** New badges since last seen (for auto-notify on unlock). */
export function newBadges(current: string[], seen: string[]): string[] {
  return current.filter((b) => !seen.includes(b));
}

export async function ensurePermission(): Promise<boolean> {
  try {
    if (isWeb()) return false;
    const Notifications = expoNotifications();
    if (!Notifications) return false;
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function fireLocal(title: string, body: string, route: string, seconds = 1): Promise<string | null> {
  try {
    if (isWeb()) return null;
    const Notifications = expoNotifications();
    if (!Notifications) return null;
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { route } },
      trigger: seconds <= 1 ? null : ({ seconds } as never),
    });
    return id;
  } catch {
    return null;
  }
}

export async function scheduleDailyContinue(hour = 19, minute = 0): Promise<string | null> {
  try {
    if (isWeb()) return null;
    const Notifications = expoNotifications();
    if (!Notifications) return null;
    await Notifications.cancelScheduledNotificationAsync('amp-daily-continue').catch(() => {});
    const id = await Notifications.scheduleNotificationAsync({
      content: { title: 'Continue learning', body: 'One lesson today keeps your streak alive. Open to resume.', data: { route: '/progress' } },
      trigger: { hour, minute, repeats: true } as never,
    });
    return id;
  } catch {
    return null;
  }
}

export function routeForData(data: unknown): string {
  if (data && typeof data === 'object' && 'route' in data && typeof (data as { route: unknown }).route === 'string') {
    return (data as { route: string }).route;
  }
  return '/(tabs)/home';
}

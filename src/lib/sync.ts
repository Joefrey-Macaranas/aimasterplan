// Catalog + progress + meet/push sync — best-effort Supabase writers.
// All functions resolve offline (no env) without throwing; UI stays local-first.
import { getSupabase } from './supabase';
import { TOOLS } from '../data/tools';
import { PROJECTS } from '../data/projects';
import { loadSeed } from './seedAdapter';

export function catalogDrift(): { tools: { local: number; seed: number; ok: boolean }; projects: { local: number; seed: number; ok: boolean } } {
  const s = loadSeed();
  return {
    tools: { local: TOOLS.length, seed: s?.tools.length ?? -1, ok: s ? TOOLS.length === s.tools.length : true },
    projects: { local: PROJECTS.length, seed: s?.projects.length ?? -1, ok: s ? PROJECTS.length === s.projects.length : true },
  };
}

export async function syncLessonProgressRemote(userId: string, lessonId: string, completed: boolean, playbackSec: number): Promise<{ ok: boolean; offline: boolean }> {
  const sb = getSupabase();
  if (!sb) return { ok: true, offline: true };
  try {
    await sb.from('lesson_progress').upsert({ user_id: userId, lesson_id: lessonId, completed, playback_seconds: Math.floor(playbackSec) });
    return { ok: true, offline: false };
  } catch {
    return { ok: false, offline: false };
  }
}

export async function rsvpMeetRemote(userId: string, meetingId: string): Promise<{ ok: boolean; offline: boolean }> {
  const sb = getSupabase();
  if (!sb) return { ok: true, offline: true };
  try {
    await sb.from('meeting_attendance').upsert({ user_id: userId, meeting_id: meetingId });
    return { ok: true, offline: false };
  } catch {
    return { ok: false, offline: false };
  }
}

export async function savePushTokenRemote(userId: string, expoToken: string, platform: string): Promise<{ ok: boolean; offline: boolean }> {
  const sb = getSupabase();
  if (!sb) return { ok: true, offline: true };
  try {
    await sb.from('push_tokens').upsert({ user_id: userId, expo_token: expoToken, platform });
    return { ok: true, offline: false };
  } catch {
    return { ok: false, offline: false };
  }
}

// Admin publish — draft lesson -> lessons table (status draft|published). Best-effort.
export async function publishLessonRemote(row: {
  id: string; module_id: string; idx: number; title: string; objective: string; video_url: string; minutes: number;
}): Promise<{ ok: boolean; offline: boolean }> {
  const sb = getSupabase();
  if (!sb) return { ok: true, offline: true };
  try {
    await sb.from('lessons').upsert({ ...row, difficulty: 'beginner', steps: [], prompts: [], commands: [], resources: [], troubleshooting: [] });
    return { ok: true, offline: false };
  } catch {
    return { ok: false, offline: false };
  }
}

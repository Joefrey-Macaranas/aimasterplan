// Video access gate — MVP enforcement of "paid videos not by public link".
// Mirrors :8083 semantics: anon -> 401, unenrolled student -> 402, enrolled/
// staff -> ok with playable URL. The raw URL is NEVER returned when denied,
// so UI cannot leak it (no public bucket links in logs/views for anon).
// Pure + tested; Supabase/Mux signed tokens plug in at resolveVideoUrl().
import { seedVideoUrl } from './seedAdapter';

export type VideoGrant =
  | { ok: true; url: string; signed: boolean }
  | { ok: false; code: 401 | 402; reason: string };

export function grantFor(
  lessonId: string,
  ctx: { userId: string | null; role: string; enrolled: boolean },
  fallbackUrl: string,
): VideoGrant {
  if (!ctx.userId) return { ok: false, code: 401, reason: 'Sign in to watch walkthroughs.' };
  if (!ctx.enrolled && !['instructor', 'author', 'admin'].includes(ctx.role)) {
    return { ok: false, code: 402, reason: 'Enrollment required — enroll to unlock videos.' };
  }
  const url = seedVideoUrl(lessonId) || fallbackUrl;
  if (!url) return { ok: false, code: 402, reason: 'No walkthrough published for this lesson yet.' };
  return { ok: true, url, signed: false };
}

// Production hook: exchange a lesson id for a short-lived signed URL via
// Supabase Edge Function (checks enrollments server-side, returns Mux token).
// Offline/MVP: returns null so callers keep using the bundled URL via grantFor().
export async function resolveSignedUrl(_lessonId: string): Promise<string | null> {
  return null;
}

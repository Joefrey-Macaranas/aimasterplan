// PHASE 16 — certificates + PHASE 18 notifications + PHASE 22 analytics
export function certificateId(userId: string, program: string): string {
  const base = `${userId}-${program}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  let hash = 0; for (const c of base) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return `AMP-${hash.toString(16).toUpperCase().padStart(8, '0')}`;
}
export function verifyUrl(certId: string): string { return `https://verify.aimasterplan.app/c/${certId}`; }

export type NotifyKind = 'new-lesson' | 'continue' | 'meetup' | 'announcement' | 'reply' | 'achievement';
export function notifyTitle(kind: NotifyKind): string {
  return { 'new-lesson': 'New lesson available', continue: 'Continue learning', meetup: 'Weekly Meet & Greet soon', announcement: 'Instructor announcement', reply: 'New reply', achievement: 'Achievement unlocked' }[kind];
}

export interface AdminStats { registered: number; active: number; avgCompletion: number; dropOffLessonId?: string; }
export function summarizeAdmin(completionsPerUser: number[][], lessonViews: Record<string, number>): AdminStats {
  const registered = completionsPerUser.length;
  const active = completionsPerUser.filter((c) => c.length > 0).length;
  const all = completionsPerUser.flat();
  const avgCompletion = all.length ? Math.round((all.filter(Boolean).length / all.length) * 100) : 0;
  let dropOffLessonId: string | undefined;
  let min = Infinity; for (const [id, v] of Object.entries(lessonViews)) if (v < min) { min = v; dropOffLessonId = id; }
  return { registered, active, avgCompletion, dropOffLessonId };
}

// Seed adapter — bundled :8083 MVP seed (supabase/seed-mvp.json) as the
// canonical content source for Supabase migration. Pure + jest-safe: loaded
// lazily, never throws when seed is missing (offline/dev).
// Metro bundles JSON via require; jest resolves the same file.
type SeedBlock = { lesson_id: string; type: string; body: string; language: string | null; url: string | null; caption: string | null; order: number };
type Seed = {
  meta: { counts: Record<string, number> };
  levels: { id: string; n: number; title: string; summary: string }[];
  modules: { id: string; level_id: string; title: string }[];
  lessons: { id: string; module_id: string; level_id: string; title: string; minutes: number; order: number }[];
  lesson_blocks: SeedBlock[];
  tools: { id: string; name: string }[];
  projects: { id: string; title: string; level: number }[];
  meetings: { id: string; title: string; starts_at: string; join_url: string }[];
};

let cache: Seed | null = null;
let missing = false;

export function loadSeed(): Seed | null {
  if (cache) return cache;
  if (missing) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cache = require('../../supabase/seed-mvp.json') as Seed;
    return cache;
  } catch {
    missing = true;
    return null;
  }
}

export function seedCounts(): Record<string, number> {
  return loadSeed()?.meta.counts ?? {};
}

export function seedLessonBlocks(lessonId: string): SeedBlock[] {
  const s = loadSeed();
  if (!s) return [];
  return s.lesson_blocks.filter((b) => b.lesson_id === lessonId).sort((a, b) => a.order - b.order);
}

export function seedVideoUrl(lessonId: string): string | null {
  const blocks = seedLessonBlocks(lessonId);
  const v = blocks.find((b) => b.type === 'video' && (b.url || b.body));
  return v ? (v.url || v.body) : null;
}

export function seedMeeting(): Seed['meetings'][number] | null {
  return loadSeed()?.meetings[0] ?? null;
}

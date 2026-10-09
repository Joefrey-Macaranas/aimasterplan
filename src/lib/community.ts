// Community feed logic: kinds, filtering, comments, reactions, mentions, reports.
// Pure functions (screens persist). Tested in __tests__/community.test.ts.
import type { CommunityPost, PostKind } from '../types/models';

export const POST_KINDS: { id: PostKind; label: string; icon: string }[] = [
  { id: 'question', label: 'Questions', icon: 'help-circle' },
  { id: 'showcase', label: 'Project showcase', icon: 'send' },
  { id: 'win', label: 'Wins / Milestones', icon: 'award' },
  { id: 'help', label: 'Help requests', icon: 'life-buoy' },
  { id: 'general', label: 'General', icon: 'message-circle' },
];

export const REACTION_EMOJI = ['♥', '🎉', '🙏'] as const;
export const REPORT_THRESHOLD = 3;

export function filterPosts(posts: CommunityPost[], channel: string | null, kind: PostKind | null, query: string): CommunityPost[] {
  const q = query.trim().toLowerCase();
  return posts.filter((p) => {
    if (channel && p.channel !== channel) return false;
    if (kind && p.kind !== kind) return false;
    if (q) {
      const hay = (p.body + ' ' + p.author + ' ' + p.id + ' ' + p.comments.map((c) => `${c.body} ${c.author}`).join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (p.reports >= REPORT_THRESHOLD) return false; // auto-hidden after reports
    return true;
  });
}

export function addPost(posts: CommunityPost[], channel: string, kind: PostKind, author: string, body: string): CommunityPost[] {
  const clean = body.trim().slice(0, 500);
  if (!clean) return posts;
  return [
    { id: `u-${Date.now()}`, channel, author: author.trim().slice(0, 40) || 'Anonymous', body: clean, createdAt: new Date().toISOString(), likes: 0, kind, comments: [], reactions: {}, reports: 0 },
    ...posts,
  ];
}

export function addComment(posts: CommunityPost[], postId: string, author: string, body: string): CommunityPost[] {
  const clean = body.trim().slice(0, 300);
  if (!clean) return posts;
  return posts.map((p) =>
    p.id === postId
      ? { ...p, comments: [...p.comments, { id: `m-${Date.now()}`, author: author.trim().slice(0, 40) || 'Anonymous', body: clean, createdAt: new Date().toISOString() }] }
      : p,
  );
}

/** Toggle one reaction emoji; votedKey = `${postId}:${emoji}` tracked by screens. */
export function toggleReaction(
  posts: CommunityPost[], postId: string, emoji: string, voted: string[],
): { posts: CommunityPost[]; voted: string[] } {
  const key = `${postId}:${emoji}`;
  const has = voted.includes(key);
  return {
    posts: posts.map((p) => {
      if (p.id !== postId) return p;
      const cur = p.reactions[emoji] ?? 0;
      const next = { ...p.reactions, [emoji]: Math.max(0, cur + (has ? -1 : 1)) };
      const likes = emoji === '♥' ? Math.max(0, p.likes + (has ? -1 : 1)) : p.likes;
      return { ...p, reactions: next, likes };
    }),
    voted: has ? voted.filter((v) => v !== key) : [...voted, key],
  };
}

export function reportPost(posts: CommunityPost[], postId: string): CommunityPost[] {
  return posts.map((p) => (p.id === postId ? { ...p, reports: p.reports + 1 } : p));
}

/** @mentions in a body, e.g. ["Leo", "Maya"] for "hi @Leo and @Maya". */
export function parseMentions(body: string): string[] {
  const out: string[] = [];
  for (const m of body.matchAll(/@([\p{L}\p{N}_.]+)/gu)) {
    const name = m[1].replace(/[_.]+$/, '');
    if (name && !out.includes(name)) out.push(name);
  }
  return out;
}

export function totalReactions(p: CommunityPost): number {
  return Object.values(p.reactions).reduce((n, v) => n + v, 0);
}

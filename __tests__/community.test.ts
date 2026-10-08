import {
  POST_KINDS, REACTION_EMOJI, REPORT_THRESHOLD, filterPosts,
  addPost, addComment, toggleReaction, reportPost, parseMentions, totalReactions,
} from '../src/lib/community';
import { COMMUNITY_SEED, CHANNELS } from '../src/data/gamification';

test('9 channels exist', () => {
  expect(CHANNELS).toEqual([
    'Introductions', 'Beginner Help', 'Vibe Coding', 'AI Automation', 'AI Agents',
    'Web Development', 'Mobile Development', 'Project Showcase', 'Weekly Meet Discussions',
  ]);
});

test('seed covers questions, showcase, wins, help + comments + reactions + mentions', () => {
  const kinds = new Set(COMMUNITY_SEED.map((p) => p.kind));
  for (const k of ['question', 'showcase', 'win', 'help']) expect(kinds.has(k as never)).toBe(true);
  expect(COMMUNITY_SEED.some((p) => p.comments.length > 0)).toBe(true);
  expect(totalReactions(COMMUNITY_SEED[0])).toBeGreaterThan(0);
  expect(parseMentions(COMMUNITY_SEED[0].body)).toContain('Leo');
});

test('filtering by channel, kind, query; reported posts hidden', () => {
  expect(filterPosts(COMMUNITY_SEED, 'Beginner Help', null, '').map((p) => p.id)).toEqual(['c2']);
  expect(filterPosts(COMMUNITY_SEED, null, 'win', '').map((p) => p.id)).toEqual(['c4']);
  expect(filterPosts(COMMUNITY_SEED, null, null, '@aya').map((p) => p.id)).toContain('c3');
  const hidden = reportPost(reportPost(reportPost(COMMUNITY_SEED, 'c2'), 'c2'), 'c2');
  expect(hidden.find((p) => p.id === 'c2')?.reports).toBe(3);
  expect(filterPosts(hidden, null, null, '')).not.toContainEqual(expect.objectContaining({ id: 'c2' }));
});

test('composer trims + caps length; comments append', () => {
  expect(addPost(COMMUNITY_SEED, 'Introductions', 'question', 'Zed', '   ')).toHaveLength(COMMUNITY_SEED.length);
  const with1 = addPost(COMMUNITY_SEED, 'Introductions', 'question', 'Zed', 'L1M1L1: what?');
  expect(with1).toHaveLength(COMMUNITY_SEED.length + 1);
  expect(with1[0].kind).toBe('question');
  const withC = addComment(with1, with1[0].id, 'Maya', 'Nice @Zed!');
  expect(withC[0].comments).toHaveLength(1);
});

test('reactions toggle per emoji and sync likes for hearts', () => {
  const r1 = toggleReaction(COMMUNITY_SEED, 'c2', '🎉', []);
  expect(r1.posts.find((p) => p.id === 'c2')?.reactions['🎉']).toBe(1);
  expect(r1.voted).toEqual(['c2:🎉']);
  const r2 = toggleReaction(r1.posts, 'c2', '🎉', r1.voted);
  expect(r2.posts.find((p) => p.id === 'c2')?.reactions['🎉']).toBe(0);
  const before = COMMUNITY_SEED.find((p) => p.id === 'c2')!.likes;
  const r3 = toggleReaction(COMMUNITY_SEED, 'c2', '♥', []);
  expect(r3.posts.find((p) => p.id === 'c2')?.likes).toBe(before + 1);
  expect(REACTION_EMOJI).toEqual(['♥', '🎉', '🙏']);
});

test('mentions parse @names and dedupe', () => {
  expect(parseMentions('hi @Leo and @Maya!')).toEqual(['Leo', 'Maya']);
  expect(parseMentions('thanks @Leo @Leo')).toEqual(['Leo']);
  expect(parseMentions('no mentions')).toEqual([]);
  expect(POST_KINDS.map((k) => k.id)).toEqual(['question', 'showcase', 'win', 'help', 'general']);
});

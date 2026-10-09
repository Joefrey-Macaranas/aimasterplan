// Student community feed: questions, showcase, wins, help + comments,
// reactions, mentions, reports. 9 channels. Beginner-safe rules on top.
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../src/theme';
import { CHANNELS, COMMUNITY_SEED } from '../src/data/gamification';
import { POST_KINDS, REACTION_EMOJI, REPORT_THRESHOLD, filterPosts, addPost, addComment, toggleReaction, reportPost, parseMentions } from '../src/lib/community';
import type { CommunityPost, PostKind } from '../src/types/models';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip } from '../src/components/ui';
import { MelroseIcon, REACTION_ICON, type MelroseName } from '../src/components/icons';
import { useAuth } from '../src/store/store';

const POSTS_KEY = 'amp-community-posts';
const VOTED_KEY = 'amp-community-voted';

function Mentioned({ text }: { text: string }) {
  const parts = text.split(/(@[\p{L}\p{N}_.]+)/gu);
  return (
    <Text style={s.body}>
      {parts.map((part, i) =>
        part.startsWith('@') ? (
          <Text key={i} style={s.mention}>
            {part}
          </Text>
        ) : (
          <Text key={i}>{part}</Text>
        ),
      )}
    </Text>
  );
}

export default function Community() {
  const { auth } = useAuth();
  const [channel, setChannel] = useState<string | null>(null);
  const [kind, setKind] = useState<PostKind | null>(null);
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_SEED);
  const [voted, setVoted] = useState<string[]>([]);
  const [openComments, setOpenComments] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [composer, setComposer] = useState('');
  const [composerChannel, setComposerChannel] = useState<string>(CHANNELS[0]);
  const [composerKind, setComposerKind] = useState<PostKind>('question');
  const [reported, setReported] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(POSTS_KEY).then((s) => s && setPosts(JSON.parse(s)));
    AsyncStorage.getItem(VOTED_KEY).then((s) => s && setVoted(JSON.parse(s)));
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts)).catch(() => {});
  }, [posts]);
  useEffect(() => {
    AsyncStorage.setItem(VOTED_KEY, JSON.stringify(voted)).catch(() => {});
  }, [voted]);

  const visible = filterPosts(posts, channel, kind, query);
  const me = auth.name || 'Student';

  function submit() {
    const next = addPost(posts, composerChannel, composerKind, me, composer);
    if (next.length !== posts.length) {
      setPosts(next);
      setComposer('');
    }
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>STUDENT COMMUNITY • {visible.length} SHOWING • BE KIND</Eyebrow>
        <H1>Community</H1>
        <Body>Questions, showcases, wins, help — no question is “too basic” here. Type @name to mention someone.</Body>

        <TextInput value={query} onChangeText={setQuery} placeholder="Search feed… (try @Maya)" placeholderTextColor="#64748b" style={s.search} />

        <H2>Channels (9)</H2>
        <View style={s.chips}>
          <Pressable onPress={() => setChannel(null)} style={[s.chip, !channel && s.on]}>
            <Text style={[s.chipT, !channel && s.chipTOn]}>All</Text>
          </Pressable>
          {CHANNELS.map((c) => (
            <Pressable key={c} onPress={() => setChannel(channel === c ? null : c)} style={[s.chip, channel === c && s.on]}>
              <Text style={[s.chipT, channel === c && s.chipTOn]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <H2>Post types</H2>
        <View style={s.chips}>
          <Pressable onPress={() => setKind(null)} style={[s.chip, !kind && s.on]}>
            <Text style={[s.chipT, !kind && s.chipTOn]}>All types</Text>
          </Pressable>
          {POST_KINDS.map((k) => (
            <Pressable key={k.id} onPress={() => setKind(kind === k.id ? null : k.id)} style={[s.chip, kind === k.id && s.on]}>
              <View style={s.chipRow}>
                <MelroseIcon name={k.icon as MelroseName} size={13} color={kind === k.id ? '#fff' : Theme.colors.text} />
                <Text style={[s.chipT, kind === k.id && s.chipTOn]}>{k.label}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <H2>New post as {me}</H2>
        <Card>
          <View style={s.chips}>
            {POST_KINDS.map((k) => (
              <Pressable key={k.id} onPress={() => setComposerKind(k.id)} style={[s.chip, composerKind === k.id && s.on]}>
                <View style={s.chipRow}>
                  <MelroseIcon name={k.icon as MelroseName} size={13} color={composerKind === k.id ? '#fff' : Theme.colors.text} />
                  <Text style={[s.chipT, composerKind === k.id && s.chipTOn]}>{k.id}</Text>
                </View>
              </Pressable>
            ))}
          </View>
          <View style={s.chips}>
            {CHANNELS.map((c) => (
              <Pressable key={c} onPress={() => setComposerChannel(c)} style={[s.chip, composerChannel === c && s.on]}>
                <Text style={[s.chipT, composerChannel === c && s.chipTOn]}>{c}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={composer}
            onChangeText={setComposer}
            placeholder="Share a win, ask with lesson ID, @mention a buddy… (500 max)"
            placeholderTextColor="#64748b"
            style={s.composer}
            multiline
            maxLength={500}
          />
          <Muted>Mentions found: {parseMentions(composer).join(', ') || 'none'}</Muted>
          <Pressable onPress={submit} style={s.post}>
            <Text style={s.postT}>Post to {composerChannel}</Text>
          </Pressable>
        </Card>

        {visible.map((p) => {
          const kindMeta = POST_KINDS.find((k) => k.id === p.kind);
          const commentsOpen = openComments.includes(p.id);
          const isReported = reported.includes(p.id);
          return (
            <Card key={p.id}>
              <View style={s.row}>
                <Chip label={p.channel} tone="accent" />
                <Chip label={`${p.kind}`} icon={(kindMeta?.icon as MelroseName) ?? 'message-circle'} />
              </View>
              <Text style={s.author}>{p.author}</Text>
              <Mentioned text={p.body} />
              <Muted>{new Date(p.createdAt).toLocaleDateString()}</Muted>
              <View style={s.reacts}>
                {REACTION_EMOJI.map((e) => {
                  const on = voted.includes(`${p.id}:${e}`);
                  const n = p.reactions[e] ?? 0;
                  return (
                    <Pressable
                      key={e}
                      onPress={() => {
                        const r = toggleReaction(posts, p.id, e, voted);
                        setPosts(r.posts);
                        setVoted(r.voted);
                      }}
                      style={[s.react, on && s.reactOn]}
                    >
                      <View style={s.reactRow}>
                        <MelroseIcon name={REACTION_ICON[e] ?? 'heart'} size={13} color={Theme.colors.accent} />
                        <Text style={s.reactT}>{n}</Text>
                      </View>
                    </Pressable>
                  );
                })}
                <Pressable onPress={() => setOpenComments((o) => (o.includes(p.id) ? o.filter((x) => x !== p.id) : [...o, p.id]))} style={s.react}>
                  <View style={s.reactRow}>
                    <MelroseIcon name="message-circle" size={13} color={Theme.colors.accent} />
                    <Text style={s.reactT}>{p.comments.length}</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setPosts((ps) => reportPost(ps, p.id));
                    setReported((r) => (r.includes(p.id) ? r : [...r, p.id]));
                  }}
                  style={s.react}
                >
                  <View style={s.reactRow}>
                    <MelroseIcon name="flag" size={13} color={Theme.colors.accent} />
                    <Text style={s.reactT}>{isReported ? 'reported' : 'report'}</Text>
                  </View>
                </Pressable>
              </View>
              {isReported && <Muted>Thanks — reports hide posts at {REPORT_THRESHOLD}+ for review.</Muted>}
              {commentsOpen && (
                <View style={s.comments}>
                  {p.comments.map((c) => (
                    <View key={c.id} style={s.comment}>
                      <Text style={s.commentA}>{c.author}</Text>
                      <Mentioned text={c.body} />
                    </View>
                  ))}
                  <TextInput
                    value={drafts[p.id] ?? ''}
                    onChangeText={(t) => setDrafts((d) => ({ ...d, [p.id]: t }))}
                    placeholder={`Reply as ${me}… @mentions welcome`}
                    placeholderTextColor="#64748b"
                    style={s.reply}
                    multiline
                    maxLength={300}
                  />
                  <Pressable
                    onPress={() => {
                      const next = addComment(posts, p.id, me, drafts[p.id] ?? '');
                      if (next !== posts) {
                        setPosts(next);
                        setDrafts((d) => ({ ...d, [p.id]: '' }));
                      }
                    }}
                    style={s.postSmall}
                  >
                    <Text style={s.postSmallT}>Comment</Text>
                  </Pressable>
                </View>
              )}
            </Card>
          );
        })}

        <Card>
          <Text style={s.author}>Posting rules (beginner-safe)</Text>
          <Body>1) Channel + lesson ID 2) What you did 3) Screenshot or exact message 4) What you expected. Report unkind or spam content — {REPORT_THRESHOLD} reports hide a post for review.</Body>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  search: { backgroundColor: Theme.colors.card, color: Theme.colors.text, borderRadius: Theme.radius.md, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: Theme.colors.border, minHeight: Theme.touch.min },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  chip: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  on: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.goldBorder },
  chipT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 12 },
  chipTOn: { color: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  author: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, marginTop: 8 },
  body: { color: Theme.colors.text, fontFamily: Theme.fonts.regular, marginTop: 4, lineHeight: 20 },
  mention: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
  composer: { backgroundColor: Theme.colors.surface, color: Theme.colors.text, borderRadius: Theme.radius.md, padding: 12, marginVertical: 6, borderWidth: 1, borderColor: Theme.colors.border, minHeight: 80 },
  post: { backgroundColor: Theme.colors.primary, borderWidth: 2, borderColor: Theme.colors.goldBorder, borderRadius: Theme.radius.sm, padding: 14, marginTop: 8, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  postT: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold },
  postSmall: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 8, padding: 10, marginTop: 6, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  postSmallT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
  reacts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  react: { backgroundColor: Theme.colors.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: Theme.colors.border, minHeight: Theme.touch.min, justifyContent: 'center' },
  reactRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reactOn: { borderColor: Theme.colors.primary },
  reactT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
  comments: { marginTop: 8, borderTopWidth: 1, borderTopColor: Theme.colors.border, paddingTop: 8 },
  comment: { backgroundColor: Theme.colors.surface, borderRadius: 8, padding: 10, marginVertical: 4 },
  commentA: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 13 },
  reply: { backgroundColor: Theme.colors.surface, color: Theme.colors.text, borderRadius: 8, padding: 10, marginTop: 6, borderWidth: 1, borderColor: Theme.colors.border, minHeight: Theme.touch.min },
});

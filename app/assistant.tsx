// Context-aware Learning Assistant: lesson + skill + project + history + docs.
// Offline-first hints with escalation; wire POST /assistant/ask for LLM in production.
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../src/theme';
import { offlineHint, biggerHint, buildPrompt, skillFromCompleted, previousLessons, projectFor } from '../src/lib/assistant';
import { getLesson, getNextLesson } from '../src/data/curriculum';
import { PROJECTS } from '../src/data/projects';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip } from '../src/components/ui';
import { useProgress } from '../src/store/store';

interface Msg {
  role: 'you' | 'tutor';
  text: string;
  hintLevel?: number;
  refs?: string[];
}

const PROJ_KEY = 'amp-assistant-proj';
const STARTERS = [
  'Explain this simply.',
  'Why am I getting this error?',
  'What should I do next?',
  'Explain this code.',
  'Help me improve this prompt.',
  'Check if I followed the tutorial correctly.',
];

export default function Assistant() {
  const { completed } = useProgress();
  const current = [...completed].pop() ?? 'L1M1L1';
  const lesson = getLesson(current);
  const [projId, setProjId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [log, setLog] = useState<Msg[]>([]);
  const skill = skillFromCompleted(completed.length);
  const prev = previousLessons({ skillLevel: skill, completedIds: completed, currentLessonId: current });
  const proj = projectFor({ skillLevel: skill, completedIds: completed, currentLessonId: current, currentProjectId: projId ?? undefined });
  const next = lesson ? getNextLesson(lesson.id) : undefined;

  useEffect(() => {
    AsyncStorage.getItem(PROJ_KEY).then((s) => {
      if (s) setProjId(JSON.parse(s));
    });
  }, []);
  useEffect(() => {
    setLog([
      {
        role: 'tutor',
        text: `Hi! I'm your tutor. I see ${lesson?.id ?? 'your first lesson'} (${lesson?.title ?? 'start'}), skill: ${skill}, ${completed.length} done. Ask me anything — hints first, answers later, and I never jump past ${next?.id ?? lesson?.id ?? 'your lesson'}.`,
        refs: lesson ? [lesson.id] : [],
      },
    ]);
  }, [current]);

  function ctx() {
    return { skillLevel: skill, completedIds: completed, currentLessonId: current, currentProjectId: projId ?? undefined };
  }

  function ask(text: string) {
    const query = text.trim();
    if (!query) return;
    // keep the LLM prompt builder honest: log context line for transparency
    void buildPrompt(query, ctx());
    const a = offlineHint(query, ctx());
    setLog((l) => [...l, { role: 'you', text: query }, { role: 'tutor', text: a, hintLevel: 0, refs: lesson ? [lesson.id] : [] }]);
    setQ('');
  }

  function escalate(index: number) {
    setLog((l) =>
      l.map((m, i) => {
        if (i !== index || m.role !== 'tutor') return m;
        const lv = (m.hintLevel ?? 0) + 1;
        return { ...m, text: `${m.text}\n\n${biggerHint(lv, ctx())}`, hintLevel: lv };
      }),
    );
  }

  function pickProject(id: string | null) {
    setProjId(id);
    AsyncStorage.setItem(PROJ_KEY, JSON.stringify(id)).catch(() => {});
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>CONTEXT-AWARE • SKILL + PROJECT + HISTORY + DOCS</Eyebrow>
        <H1>Learning Assistant</H1>
        <Card>
          <View style={s.ctxRow}>
            <Chip label={`📖 ${lesson?.id ?? '—'} ${lesson?.title ?? ''}`} tone="accent" />
            <Chip label={`🎚 ${skill}`} />
            <Chip label={`✓ ${completed.length} done`} tone="success" />
          </View>
          <Muted>
            Previous: {prev.length ? prev.map((l) => l.id).join(', ') : 'none yet'} • Next allowed: {next?.id ?? lesson?.id ?? '—'} (I never jump ahead)
          </Muted>
          <Muted>DOCS IN SCOPE: {lesson ? `"${lesson.title}" objective + ${lesson.steps.length} steps + ${lesson.troubleshooting.length} troubleshooting steps` : 'roadmap Levels 1–10'}</Muted>
        </Card>

        <H2>Current project (I’ll tie answers to it)</H2>
        <View style={s.chips}>
          <Pressable onPress={() => pickProject(null)} style={[s.pick, !projId && s.pickOn]}>
            <Text style={s.pickT}>None</Text>
          </Pressable>
          {PROJECTS.map((p) => (
            <Pressable key={p.id} onPress={() => pickProject(projId === p.id ? null : p.id)} style={[s.pick, projId === p.id && s.pickOn]}>
              <Text style={s.pickT}>{p.id}</Text>
            </Pressable>
          ))}
        </View>
        {proj && (
          <Card>
            <Body>
              {proj.id} — {proj.title} (Level {proj.level})
            </Body>
            <Link href={`/project/${proj.id}` as never}>
              <Text style={s.link}>Open {proj.id} workspace →</Text>
            </Link>
          </Card>
        )}

        <H2>Ask anything — start with these</H2>
        <View style={s.chips}>
          {STARTERS.map((st) => (
            <Pressable key={st} onPress={() => ask(st)} style={s.starter}>
              <Text style={s.starterT}>{st}</Text>
            </Pressable>
          ))}
        </View>

        {log.map((m, i) => (
          <Card key={i} style={m.role === 'you' ? s.you : s.tutor}>
            <Muted>{m.role === 'you' ? 'YOU' : `TUTOR • hint ${(m.hintLevel ?? 0) + 1}/4`}</Muted>
            <Text style={s.msg}>{m.text}</Text>
            {m.refs?.map((r) => {
              const l = getLesson(r);
              if (!l) return null;
              return (
                <Link key={r} href={`/lesson/${r}` as never}>
                  <Text style={s.link}>📖 Referenced: {r} — {l.title}</Text>
                </Link>
              );
            })}
            {m.role === 'tutor' && i > 0 && (
              <Pressable onPress={() => escalate(i)} style={s.more}>
                <Text style={s.moreT}>Give me a bigger hint →</Text>
              </Pressable>
            )}
          </Card>
        ))}

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Ask: explain, error, next, code, prompt, check my work…"
          placeholderTextColor="#64748b"
          style={s.input}
          multiline
          onSubmitEditing={() => ask(q)}
        />
        <Pressable onPress={() => ask(q)} style={s.send}>
          <Text style={s.sendT}>Ask tutor</Text>
        </Pressable>
        <Muted>Beginner rule: tell me (1) lesson, (2) what you did, (3) expected vs what you saw. Hints escalate — answers never spoil ahead.</Muted>
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  ctxRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  starter: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  starterT: { color: Theme.colors.accent, fontSize: 13, fontWeight: '700' },
  pick: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  pickOn: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.goldBorder },
  pickT: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 13 },
  you: { borderColor: Theme.colors.primary },
  tutor: { borderColor: Theme.colors.border },
  msg: { color: Theme.colors.text, fontSize: 14, lineHeight: 21, marginTop: 4 },
  link: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold, marginTop: 6 },
  more: { marginTop: 8, paddingVertical: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  moreT: { color: Theme.colors.warning, fontFamily: Theme.fonts.bold },
  input: { backgroundColor: Theme.colors.card, color: Theme.colors.text, borderRadius: Theme.radius.md, padding: 14, marginTop: 8, minHeight: 56, borderWidth: 1, borderColor: Theme.colors.border },
  send: { backgroundColor: Theme.colors.primary, borderWidth: 2, borderColor: Theme.colors.goldBorder, padding: 14, borderRadius: Theme.radius.sm, alignItems: 'center', marginTop: 8, minHeight: Theme.touch.min, justifyContent: 'center' },
  sendT: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold },
});

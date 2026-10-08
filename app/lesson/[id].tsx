import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Theme } from '../../src/theme';
import { getLesson, LESSONS, getPrevLesson, getNextLesson } from '../../src/data/curriculum';
import { CopyBlock, Chapters } from '../../src/components/blocks';
import { Screen, H1, H2, Body, Muted, Card, Chip, LinkButton } from '../../src/components/ui';
import { useProgress } from '../../src/store/store';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = String(id);
  const lesson = getLesson(lessonId);
  const { completed, toggleComplete, bookmarks, toggleBookmark } = useProgress();
  const [checked, setChecked] = useState<string[]>([]);
  const [quizPick, setQuizPick] = useState<number | null>(null);
  const [autoNote, setAutoNote] = useState(false);

  const prev = useMemo(() => getPrevLesson(lessonId), [lessonId]);
  const next = useMemo(() => getNextLesson(lessonId), [lessonId]);

  if (!lesson) {
    return (
      <Screen>
        <H1>Lesson not found</H1>
        <Body>Try the roadmap to find your current lesson.</Body>
        <LinkButton href="/roadmap" title="Open roadmap" />
      </Screen>
    );
  }

  const done = completed.includes(lesson.id);
  const toggleItem = (c: string) => setChecked((arr) => (arr.includes(c) ? arr.filter((x) => x !== c) : [...arr, c]));
  const quiz = lesson.knowledgeCheck[0];
  const allChecked = checked.length === lesson.checklist.length;

  // Automatic progress tracking: finishing every checklist item completes the lesson.
  useEffect(() => {
    if (allChecked && !done) {
      toggleComplete(lesson.id);
      setAutoNote(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChecked]);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Muted>
          {lesson.id} • {lesson.minutes} MIN • {lesson.difficulty.toUpperCase()} • NO JARGON
        </Muted>
        <H1>{lesson.title}</H1>
        <Body>{lesson.objective}</Body>
        <View style={s.chips}>
          <Chip label={done ? '✓ Completed' : 'Not completed yet'} tone={done ? 'success' : 'default'} />
          <Chip label={`${lesson.minutes} min`} tone="default" />
          <Chip label="WHY before HOW" tone="accent" />
        </View>

        <LinkButton href={`/video/${lesson.id}`} title="▶ Play recorded walkthrough (chapters + transcript)" />

        <Card>
          <Muted>START HERE — WHY THIS MATTERS (READ FIRST)</Muted>
          <Text style={s.why}>{lesson.intro}</Text>
          <H2>Big idea in plain words</H2>
          <Body>{lesson.concept}</Body>
          <Card>
            <Muted>BY THE END YOU CAN</Muted>
            <Body>{lesson.expectedOutcome}</Body>
          </Card>
        </Card>

        <H2>Follow along — tap Copy, then paste</H2>
        <Muted>Do steps in order. Every important click is demonstrated in the video above.</Muted>
        {lesson.steps.map((st, i) => (
          <CopyBlock key={`${st.kind}-${i}`} step={st} index={i} />
        ))}

        <H2>Tools you need</H2>
        <View style={s.chips}>
          {lesson.toolsRequired.map((t) => (
            <Chip key={t} label={t} />
          ))}
        </View>
        <LinkButton href="/tools" title="Open Tools Vault — install guides" />

        <H2>Downloads (reproducible project)</H2>
        {lesson.resources.map((r) => (
          <Pressable key={r.url} onPress={() => Linking.openURL(r.url)} style={s.link}>
            <Text style={s.linkT}>⬇ {r.name}</Text>
          </Pressable>
        ))}

        <H2>Troubleshooting guide — when stuck, do this in order</H2>
        <Muted>Distinct from one-off errors below: this is the universal 5-step rescue path.</Muted>
        {lesson.troubleshooting.map((t, i) => (
          <Card key={i}>
            <Body>
              {i + 1}. {t}
            </Body>
          </Card>
        ))}

        <H2>If it looks different — common errors</H2>
        {lesson.commonErrors.map((e, i) => (
          <Card key={i}>
            <Body>❌ {e.error}</Body>
            <Muted>✅ Fix: {e.fix}</Muted>
          </Card>
        ))}

        <H2>Quick check — did you get it?</H2>
        {quiz && (
          <Card>
            <Body>{quiz.q}</Body>
            {quiz.options.map((o, i) => {
              const correct = quizPick !== null && i === quiz.answer;
              const wrong = quizPick === i && i !== quiz.answer;
              return (
                <Pressable
                  key={o}
                  onPress={() => setQuizPick(i)}
                  style={[s.quiz, correct && s.quizGood, wrong && s.quizBad]}
                >
                  <Text style={s.quizT}>
                    {i === quizPick ? (i === quiz.answer ? '✓ ' : '✗ ') : '○ '}
                    {o}
                  </Text>
                </Pressable>
              );
            })}
            {quizPick !== null && (
              <Muted>{quizPick === quiz.answer ? 'Correct! You got the big idea.' : 'Not quite — re-read “Big idea” above, then try again.'}</Muted>
            )}
          </Card>
        )}

        <H2>Practice (do it once without pausing)</H2>
        <Card>
          <Body>{lesson.exercise}</Body>
        </Card>

        <H2>Done checklist — tap each one</H2>
        {lesson.checklist.map((c) => {
          const on = checked.includes(c);
          return (
            <Pressable key={c} onPress={() => toggleItem(c)} style={[s.check, on && s.checkOn]}>
              <Text style={s.checkDot}>{on ? '☑' : '☐'}</Text>
              <Text style={s.checkT}>{c}</Text>
            </Pressable>
          );
        })}
        <Muted>
          {checked.length}/{lesson.checklist.length} checked
          {allChecked ? ' — checklist complete, lesson auto-marked ✓' : ''}
          {autoNote && allChecked ? ' (just now — resume points at your next lesson)' : ''}
        </Muted>

        <Pressable onPress={() => toggleComplete(lesson.id)} style={[s.done, done && s.doneOn]}>
          <Text style={s.doneT}>{done ? '✓ Completed — tap to undo' : 'Mark lesson complete (+50 XP)'}</Text>
        </Pressable>
        <Pressable onPress={() => toggleBookmark(lesson.id)}>
          <Text style={s.bm}>{bookmarks.includes(lesson.id) ? '★ Bookmarked — tap to remove' : '☆ Bookmark for later'}</Text>
        </Pressable>

        <H2>Keep going</H2>
        <View style={s.nav}>
          {prev && <Link href={`/lesson/${prev.id}` as never}><Text style={s.navT}>← {prev.title}</Text></Link>}
          {next && <Link href={`/lesson/${next.id}` as never}><Text style={s.navT}>{next.title} →</Text></Link>}
        </View>
        <LinkButton href="/roadmap" title="Back to roadmap" />
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  why: { color: Theme.colors.text, fontSize: 16, lineHeight: 24, fontWeight: '600', marginTop: 6 },
  link: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, padding: 12, marginVertical: 4 },
  linkT: { color: Theme.colors.accent, fontWeight: '700' },
  quiz: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, padding: 12, marginVertical: 4 },
  quizGood: { borderColor: Theme.colors.success },
  quizBad: { borderColor: Theme.colors.danger },
  quizT: { color: Theme.colors.text, fontWeight: '600' },
  check: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, padding: 12, marginVertical: 4 },
  checkOn: { borderColor: Theme.colors.success },
  checkDot: { color: Theme.colors.success, fontSize: 18, fontWeight: '800' },
  checkT: { color: Theme.colors.text, flex: 1 },
  done: { backgroundColor: Theme.colors.success, padding: 16, borderRadius: 0, marginTop: 14, alignItems: 'center' },
  doneOn: { backgroundColor: '#065f46' },
  doneT: { color: '#052e16', fontWeight: '800', fontSize: 16 },
  bm: { color: Theme.colors.accent, marginTop: 12, textAlign: 'center', fontSize: 15 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginVertical: 8 },
  navT: { color: Theme.colors.accent, fontWeight: '700' },
});

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

// Module listing — one module = its lessons, progress, tools, project link.
// Route: /module/<moduleId> (e.g. /module/L3M1)
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Theme } from '../../src/theme';
import { MODULES, LEVELS, getLessonsForModule, LESSONS } from '../../src/data/curriculum';
import { PROJECTS } from '../../src/data/projects';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, ProgressBar, LinkButton, Grid } from '../../src/components/ui';
import { useProgress } from '../../src/store/store';

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const mod = MODULES.find((m) => m.id === String(id));
  const { completed } = useProgress();

  if (!mod) {
    return (
      <Screen>
        <H1>Module not found</H1>
        <LinkButton href="/roadmap" title="Back to roadmap" />
      </Screen>
    );
  }

  const level = LEVELS.find((l) => l.id === mod.levelId);
  const lessons = getLessonsForModule(mod.id);
  const done = lessons.filter((l) => completed.includes(l.id)).length;
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  const next = lessons.find((l) => !completed.includes(l.id)) ?? lessons[0];
  const relatedProjects = PROJECTS.filter((p) => p.level === level?.index);
  const totalMins = lessons.reduce((n, l) => n + l.minutes, 0);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>
          LEVEL {level?.index} • {level?.title.toUpperCase()} • MODULE {mod.index}
        </Eyebrow>
        <H1>{mod.title}</H1>
        <Body>{mod.summary}</Body>
        <View style={s.chips}>
          <Chip label={`${done}/${lessons.length} lessons`} tone={pct === 100 ? 'success' : 'default'} />
          <Chip label={`~${totalMins} min`} />
          <Chip label={pct === 100 ? 'DONE ✓' : `${pct}%`} tone={pct === 100 ? 'success' : 'accent'} />
        </View>
        <ProgressBar pct={pct} />

        {next && (
          <Card style={s.next}>
            <Muted>UP NEXT IN THIS MODULE</Muted>
            <Text style={s.nextT}>
              {next.id} — {next.title}
            </Text>
            <Muted>
              {next.objective} • {next.minutes} min
            </Muted>
            <LinkButton href={`/lesson/${next.id}`} title="▶ Continue this module" />
          </Card>
        )}

        <H2>Lessons ({lessons.length}) — do in order</H2>
        <Grid>
          {lessons.map((l, i) => {
            const isDone = completed.includes(l.id);
            return (
              <Link key={l.id} href={`/lesson/${l.id}` as never} asChild>
                <Pressable style={StyleSheet.flatten([s.lesson, isDone && s.lessonDone])}>
                  <Text style={s.num}>{String(i + 1).padStart(2, '0')}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.lessonT}>
                      {isDone ? '✓ ' : ''}
                      {l.title}
                    </Text>
                    <Text style={s.lessonS}>
                      {l.id} • {l.minutes} min • {l.difficulty}
                    </Text>
                  </View>
                  <Text style={s.go}>›</Text>
                </Pressable>
              </Link>
            );
          })}
        </Grid>

        {relatedProjects.length > 0 && (
          <>
            <H2>Build it — related project</H2>
            {relatedProjects.map((p) => (
              <Card key={p.id}>
                <Chip label={`LEVEL ${p.level}`} tone="accent" />
                <Body>
                  {p.id} — {p.title.replace(/^Project \d+ — /, '')}
                </Body>
                <LinkButton href={`/project/${p.id}`} title="Open project workspace" />
              </Card>
            ))}
          </>
        )}

        <LinkButton href="/roadmap" title="← All levels" />
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  next: { borderColor: Theme.colors.primary },
  nextT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 16, marginTop: 4 },
  lesson: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.md, padding: 14, marginVertical: 4, minHeight: Theme.touch.min },
  lessonDone: { borderColor: Theme.colors.success },
  num: { color: Theme.colors.primary, fontFamily: Theme.fonts.black, fontSize: 18, width: 32 },
  lessonT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 14 },
  lessonS: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 12, marginTop: 2 },
  go: { color: Theme.colors.muted, fontSize: 22, fontWeight: '700' },
});

export function generateStaticParams() {
  return MODULES.map((m) => ({ id: m.id }));
}

// re-export for tests that import LESSONS count
export { LESSONS };

import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Theme } from '../../src/theme';
import { LEVELS, MODULES, getLessonsForModule } from '../../src/data/curriculum';
import { JOURNEY_MAP } from '../../src/constants/branding';
import { useProgress } from '../../src/store/store';
import { levelProgress } from '../../src/lib/progress';
import { Screen, H1, Body, Eyebrow, Card, Chip, ProgressBar, Grid, LinkButton } from '../../src/components/ui';
import { Link } from 'expo-router';

const LEVEL_JOURNEY: Record<string, string> = {
  L1: 'AI Fundamentals + Vibe Coding Basics',
  L2: 'Vibe Coding Basics — tools & setup',
  L3: 'Build First Website',
  L4: 'Build First Application + Connect APIs',
  L5: 'Databases + Authentication',
  L6: 'Connect APIs — AI Integration',
  L7: 'Build AI Automation',
  L8: 'AI Agents → Full AI Application',
  L9: 'Build Full AI Application + Deployment',
  L10: 'Independent System Builder',
};

export default function Roadmap() {
  const { completed } = useProgress();
  const [open, setOpen] = useState<string | null>('L1');

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>COURSE ROADMAP • LEVELS 1–10 • MODULES → LESSONS</Eyebrow>
        <H1>Course Roadmap</H1>
        <Body>Levels 1–10. WHY before HOW, demo every step, reproducible projects, less hand-holding as you grow.</Body>
        <Body>{JOURNEY_MAP.map((j) => j.step).join('  ↓  ')}</Body>

        <Grid>
          {LEVELS.map((lv) => {
            const pct = levelProgress(lv.id, completed);
            const mods = MODULES.filter((m) => m.levelId === lv.id);
            const expanded = open === lv.id;
            const doneCount = mods.reduce((n, m) => n + getLessonsForModule(m.id).filter((l) => completed.includes(l.id)).length, 0);
            const totalCount = mods.reduce((n, m) => n + getLessonsForModule(m.id).length, 0);
            return (
              <Card key={lv.id}>
                <Pressable onPress={() => setOpen(expanded ? null : lv.id)} style={s.tap}>
                  <View style={s.row}>
                    <Text style={s.lvT}>
                      Level {lv.index}: {lv.title}
                    </Text>
                    <Text style={s.chev}>{expanded ? '−' : '+'}</Text>
                  </View>
                  <Body>{lv.summary}</Body>
                  <Chip label={LEVEL_JOURNEY[lv.id] ?? ''} tone="accent" />
                  <ProgressBar pct={pct} />
                  <Body>
                    {pct}% • {doneCount}/{totalCount} lessons {pct === 100 ? '✓' : ''}
                  </Body>
                </Pressable>
                {expanded &&
                  mods.map((m) => {
                    const lessons = getLessonsForModule(m.id);
                    const mDone = lessons.filter((l) => completed.includes(l.id)).length;
                    return (
                      <View key={m.id} style={s.mod}>
                        <Link href={`/module/${m.id}` as never} asChild>
                          <Pressable style={s.modTap}>
                            <Text style={s.mT}>
                              {m.title} — <Text style={s.mS}>{m.summary}</Text>
                            </Text>
                            <Text style={s.mMeta}>
                              {mDone}/{lessons.length} • Open module ›
                            </Text>
                          </Pressable>
                        </Link>
                        {lessons.map((l) => {
                          const done = completed.includes(l.id);
                          return (
                            <Link key={l.id} href={`/lesson/${l.id}` as never} asChild>
                              <Pressable style={StyleSheet.flatten([s.lesson, done && s.lessonDone])}>
                                <Text style={s.lessonDot}>{done ? '✓' : '○'}</Text>
                                <View style={{ flex: 1 }}>
                                  <Text style={s.lessonT}>
                                    {l.id} — {l.title}
                                  </Text>
                                  <Text style={s.lessonS}>
                                    {l.objective} • {l.minutes} min • {l.difficulty}
                                  </Text>
                                </View>
                              </Pressable>
                            </Link>
                          );
                        })}
                      </View>
                    );
                  })}
              </Card>
            );
          })}
        </Grid>
        <LinkButton href="/progress" title="Open progress dashboard" />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  tap: { minHeight: 44 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lvT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 17, flex: 1, paddingRight: 8 },
  chev: { color: Theme.colors.accent, fontSize: 22, fontFamily: Theme.fonts.bold },
  mod: { marginTop: 12, borderTopWidth: 1, borderTopColor: Theme.colors.border, paddingTop: 8 },
  modTap: { paddingVertical: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  mT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold, marginVertical: 2 },
  mS: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular },
  mMeta: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 12, marginBottom: 4 },
  lesson: { flexDirection: 'row', gap: 10, backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.md, padding: 12, marginVertical: 4, minHeight: Theme.touch.min, alignItems: 'center' },
  lessonDone: { borderColor: Theme.colors.success },
  lessonDot: { color: Theme.colors.success, fontFamily: Theme.fonts.bold, fontSize: 16 },
  lessonT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 14 },
  lessonS: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 12, marginTop: 2 },
});

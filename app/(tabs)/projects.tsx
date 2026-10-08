import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Theme } from '../../src/theme';
import { PROJECTS } from '../../src/data/projects';
import { Screen, H1, Body, Eyebrow, Card, Chip, Grid, LinkButton } from '../../src/components/ui';

export default function Projects() {
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>PROJECT WORKSPACE • 10 REPRODUCIBLE BUILDS • TAP TO OPEN</Eyebrow>
        <H1>Guided Projects</H1>
        <Body>
          10 reproducible projects. Early projects hold your hand; later ones remove scaffolding until P10 — your own AI
          product. Each card opens a full workspace: stages, prompts, testing, deploy.
        </Body>
        <Body>P01–P03: websites • P03–P05: apps & automations • P06–P09: AI systems • P10: independent</Body>
        <Grid>
          {PROJECTS.map((p) => (
            <Link key={p.id} href={`/project/${p.id}` as never} asChild>
              <Pressable style={s.card}>
                <View style={s.row}>
                  <Text style={s.t}>
                    {p.id} — {p.title.replace(/^Project \d+ — /, '')}
                  </Text>
                  <Text style={s.go}>›</Text>
                </View>
                <View style={s.row}>
                  <Chip label={`Level ${p.level}`} tone="accent" />
                  <Chip label={`${p.stages.length} stages`} />
                </View>
                <Text style={s.arch}>{p.architecture}</Text>
                <Text style={s.stack}>Stack: {p.stack.join(' • ')}</Text>
                <Text style={s.open}>Open workspace →</Text>
              </Pressable>
            </Link>
          ))}
        </Grid>
        <LinkButton href="/planner" title="Have your own idea? Open AI Project Planner" />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: Theme.colors.card, borderColor: Theme.colors.border, borderWidth: 1, borderRadius: Theme.radius.md, padding: 16, marginVertical: 6, minHeight: 120 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  t: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 16, flex: 1 },
  go: { color: Theme.colors.muted, fontSize: 24, fontFamily: Theme.fonts.bold },
  arch: { color: Theme.colors.text, fontFamily: Theme.fonts.regular, marginTop: 8, fontSize: 14 },
  stack: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 12, marginTop: 4 },
  open: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold, marginTop: 8 },
});

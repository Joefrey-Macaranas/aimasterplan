// Project workspace — guided build surface: plan → stages → prompts → test → deploy.
// Route: /project/<projectId> (e.g. /project/P01)
import { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Theme } from '../../src/theme';
import { PROJECTS } from '../../src/data/projects';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, ProgressBar, LinkButton, Segmented } from '../../src/components/ui';

const TABS = ['Setup', 'Stages', 'Prompts', 'Testing', 'Deploy'] as const;
type Tab = (typeof TABS)[number];

export default function ProjectWorkspace() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pid = String(id);
  const project = PROJECTS.find((p) => p.id === pid);
  const [tab, setTab] = useState<Tab>('Setup');
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(`amp-proj-${pid}`).then((s) => {
      if (s) setDone(JSON.parse(s));
    });
  }, [pid]);
  useEffect(() => {
    AsyncStorage.setItem(`amp-proj-${pid}`, JSON.stringify(done)).catch(() => {});
  }, [done, pid]);

  const pct = useMemo(() => {
    if (!project || !project.stages.length) return 0;
    return Math.round((done.length / project.stages.length) * 100);
  }, [done, project]);

  if (!project) {
    return (
      <Screen>
        <H1>Project not found</H1>
        <LinkButton href="/(tabs)/projects" title="All projects" />
      </Screen>
    );
  }

  const toggle = (st: string) => setDone((d) => (d.includes(st) ? d.filter((x) => x !== st) : [...d, st]));
  const handholding = project.level <= 4 ? 'Full guidance — every click shown' : project.level <= 7 ? 'Medium guidance — checklists + hints' : project.level <= 9 ? 'Low guidance — plan + review points' : 'Independent — you plan, AI critiques';

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>
          {project.id} • LEVEL {project.level} • GUIDED PROJECT
        </Eyebrow>
        <H1>{project.title.replace(/^Project \d+ — /, '')}</H1>
        <Body>{project.architecture}</Body>
        <View style={s.chips}>
          <Chip label={`Level ${project.level}`} tone="accent" />
          <Chip label={handholding} tone={project.level >= 10 ? 'warning' : 'default'} />
          <Chip label={pct === 100 ? 'SHIPPED ✓' : `${pct}%`} tone={pct === 100 ? 'success' : 'default'} />
        </View>
        <ProgressBar pct={pct} />
        <Muted>
          Stack: {project.stack.join(' • ')}
        </Muted>

        <Segmented options={TABS} value={tab} onChange={setTab} />

        {tab === 'Setup' && (
          <>
            <H2>Requirements (definition of done)</H2>
            {project.requirements.map((r) => (
              <Text key={r} style={s.li}>
                • {r}
              </Text>
            ))}
            <H2>Architecture (how it fits together)</H2>
            <Card>
              <Body>{project.architecture}</Body>
            </Card>
            <H2>Technologies (your stack)</H2>
            <View style={s.chips}>
              {project.stack.map((t) => (
                <Chip key={t} label={t} tone="accent" />
              ))}
            </View>
            <H2>Setup (do this first, in order)</H2>
            {project.setup.map((st, i) => (
              <Card key={st}>
                <Body>
                  {i + 1}. {st}
                </Body>
              </Card>
            ))}
          </>
        )}

        {tab === 'Stages' && (
          <>
            <H2>Build stages — tap to check off</H2>
            {project.stages.map((st, i) => {
              const on = done.includes(st);
              return (
                <Pressable key={st} onPress={() => toggle(st)} style={[s.stage, on && s.stageDone]}>
                  <Text style={s.stageNum}>{on ? '✓' : `${i + 1}`}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.stageT}>{st}</Text>
                    <Text style={s.stageS}>
                      {i === 0 ? 'Start here — smallest working slice' : i === project.stages.length - 1 ? 'Finish: test + publish URL' : 'Next small slice — test as you go'}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
            <H2>Final checklist (ship criteria)</H2>
            {project.checklist.map((c) => (
              <Text key={c} style={s.li}>
                ☐ {c}
              </Text>
            ))}
          </>
        )}

        {tab === 'Prompts' && (
          <>
            <H2>Copy-paste prompts (in order)</H2>
            <Muted>WHY first: each prompt states GOAL + CONTEXT + CONSTRAINTS + DONE-example.</Muted>
            {project.prompts.map((pr, i) => (
              <Card key={`${i}-${pr.slice(0, 20)}`}>
                <Muted>
                  PROMPT {i + 1} OF {project.prompts.length}
                </Muted>
                <Text selectable style={s.prompt}>
                  {pr}
                </Text>
              </Card>
            ))}
          </>
        )}

        {tab === 'Testing' && (
          <>
            <H2>Test it like a pro</H2>
            {project.testing.map((t) => (
              <Card key={t}>
                <Body>✓ {t}</Body>
              </Card>
            ))}
            <H2>If it breaks</H2>
            {project.debugging.map((d) => (
              <Card key={d}>
                <Body>🔧 {d}</Body>
              </Card>
            ))}
          </>
        )}

        {tab === 'Deploy' && (
          <>
            <H2>Ship it</H2>
            {project.deployment.map((d) => (
              <Card key={d}>
                <Body>🚀 {d}</Body>
              </Card>
            ))}
            <Card style={pct === 100 ? s.shipped : undefined}>
              <Body>{pct === 100 ? 'All stages done — paste your live URL in Community Showcase!' : `Finish ${project.stages.length - done.length} stage(s) to ship.`}</Body>
              <LinkButton href="/community" title="Open Community Showcase" />
            </Card>
          </>
        )}

        <LinkButton href="/(tabs)/projects" title="← All 10 projects" />
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  stage: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.md, padding: 14, marginVertical: 5, minHeight: 56 },
  stageDone: { borderColor: Theme.colors.success },
  stageNum: { color: Theme.colors.primary, fontFamily: Theme.fonts.black, fontSize: 18, width: 28, textAlign: 'center' },
  stageT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 15 },
  stageS: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 12, marginTop: 2 },
  li: { color: Theme.colors.text, fontFamily: Theme.fonts.regular, fontSize: 14, lineHeight: 21, marginVertical: 2 },
  prompt: { color: Theme.colors.text, fontFamily: Theme.fonts.mono, fontSize: 13, lineHeight: 19, marginTop: 6 },
  shipped: { borderColor: Theme.colors.success },
});

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

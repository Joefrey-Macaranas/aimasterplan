// Beginner onboarding wizard — 3 questions → 8 plain-words explainers → personalized plan.
// Steps: 1 coded? • 2 AI tools? • 3 build goal (7) • 4–11 explainers • 12 recommendation.
import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../../src/theme';
import { CODED_OPTIONS, AI_TOOLS_OPTIONS, GOAL_OPTIONS, EXPLAINERS, type WizardAnswers } from '../../src/data/onboarding';
import { recommend, wizardProgress } from '../../src/lib/onboarding';
import { useAuth } from '../../src/store/store';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, ProgressBar, LinkButton } from '../../src/components/ui';

type Step = { kind: 'q1' } | { kind: 'q2' } | { kind: 'q3' } | { kind: 'exp'; i: number } | { kind: 'done' };
const TOTAL_STEPS = 3 + EXPLAINERS.length; // 11 content steps; done = result

const GOAL_TO_PROFILE: Record<WizardAnswers['goal'], string> = {
  website: 'Build my first website',
  mobile: 'Ship a mobile app',
  automation: 'Automate my business',
  agent: 'Learn AI agents',
  business: 'Automate my business',
  saas: 'Launch a SaaS',
  personal: 'Personal Project',
};

export default function Assessment() {
  const [step, setStep] = useState<Step>({ kind: 'q1' });
  const [answers, setAnswers] = useState<Partial<WizardAnswers>>({});
  const { setExperience, setGoals, setCurrentLevel } = useAuth();

  const stepIndex = step.kind === 'q1' ? 0 : step.kind === 'q2' ? 1 : step.kind === 'q3' ? 2 : step.kind === 'exp' ? 3 + step.i : TOTAL_STEPS;
  const rec = useMemo(
    () => (answers.coded && answers.aiTools && answers.goal ? recommend(answers as WizardAnswers) : null),
    [answers],
  );

  async function finish() {
    // persist wizard → profile (experience + goal) + current level pointer
    if (answers.coded) setExperience(answers.coded === 'yes' ? 'intermediate' : answers.coded === 'little' ? 'beginner' : 'none');
    if (answers.goal) setGoals([GOAL_TO_PROFILE[answers.goal]]);
    if (rec) setCurrentLevel(Number(rec.startLevelId.slice(1)) || 1);
    await AsyncStorage.setItem('amp-onboarding', JSON.stringify({ ...answers, at: new Date().toISOString() })).catch(() => {});
    router.replace('/(tabs)/home');
  }

  return (
    <Screen>
      {step.kind !== 'done' ? (
        <>
          <Eyebrow>
            BEGINNER WIZARD • STEP {Math.min(stepIndex + 1, TOTAL_STEPS)} OF {TOTAL_STEPS}
          </Eyebrow>
          <ProgressBar pct={wizardProgress(stepIndex, TOTAL_STEPS)} />
        </>
      ) : (
        <Eyebrow>YOUR PERSONAL STARTING PLAN • SAVED TO PROFILE</Eyebrow>
      )}

      {step.kind === 'q1' && (
        <>
          <H1>Have you coded before?</H1>
          <Body>No wrong answers — this sets your hand-holding level.</Body>
          {CODED_OPTIONS.map((o) => (
            <Pressable
              key={o.id}
              onPress={() => {
                setAnswers((a) => ({ ...a, coded: o.id }));
                setStep({ kind: 'q2' });
              }}
              style={s.opt}
            >
              <Text style={s.optT}>{o.label}</Text>
              <Text style={s.optH}>{o.hint}</Text>
            </Pressable>
          ))}
        </>
      )}

      {step.kind === 'q2' && (
        <>
          <H1>Have you used AI coding tools?</H1>
          <Body>ChatGPT counts — same prompting muscle, applied to code.</Body>
          {AI_TOOLS_OPTIONS.map((o) => (
            <Pressable
              key={o.id}
              onPress={() => {
                setAnswers((a) => ({ ...a, aiTools: o.id }));
                setStep({ kind: 'q3' });
              }}
              style={s.opt}
            >
              <Text style={s.optT}>{o.label}</Text>
              <Text style={s.optH}>{o.hint}</Text>
            </Pressable>
          ))}
          <Pressable onPress={() => setStep({ kind: 'q1' })} style={s.back}>
            <Text style={s.backT}>← Back</Text>
          </Pressable>
        </>
      )}

      {step.kind === 'q3' && (
        <>
          <H1>What do you want to build?</H1>
          <Body>Pick one — your entry project and fast-track depend on it.</Body>
          {GOAL_OPTIONS.map((o) => (
            <Pressable
              key={o.id}
              onPress={() => {
                setAnswers((a) => ({ ...a, goal: o.id }));
                setStep({ kind: 'exp', i: 0 });
              }}
              style={s.opt}
            >
              <Text style={s.optT}>{o.label}</Text>
              <Text style={s.optH}>{o.hint}</Text>
            </Pressable>
          ))}
          <Pressable onPress={() => setStep({ kind: 'q2' })} style={s.back}>
            <Text style={s.backT}>← Back</Text>
          </Pressable>
        </>
      )}

      {step.kind === 'exp' && (
        <>
          <Eyebrow>
            BIG IDEA {step.i + 1} OF {EXPLAINERS.length} • PLAIN WORDS, NO JARGON
          </Eyebrow>
          <H1>{EXPLAINERS[step.i]?.title}</H1>
          <Card>
            <Muted>WHY IT MATTERS</Muted>
            <Body>{EXPLAINERS[step.i]?.why}</Body>
          </Card>
          <Card>
            <Muted>THINK OF IT LIKE…</Muted>
            <Body>{EXPLAINERS[step.i]?.analogy}</Body>
          </Card>
          <Card style={s.youCard}>
            <Muted>YOU WILL…</Muted>
            <Body>{EXPLAINERS[step.i]?.youWill}</Body>
          </Card>
          <Pressable
            onPress={() => {
              if (step.i + 1 >= EXPLAINERS.length) setStep({ kind: 'done' });
              else setStep({ kind: 'exp', i: step.i + 1 });
            }}
            style={s.go}
          >
            <Text style={s.goT}>{step.i + 1 >= EXPLAINERS.length ? 'See my starting plan →' : `Got it — next (${step.i + 2}/${EXPLAINERS.length}) →`}</Text>
          </Pressable>
          <Pressable
            onPress={() => setStep(step.i === 0 ? { kind: 'q3' } : { kind: 'exp', i: step.i - 1 })}
            style={s.back}
          >
            <Text style={s.backT}>← Back</Text>
          </Pressable>
        </>
      )}

      {step.kind === 'done' && rec && (
        <>
          <H1>{rec.headline}</H1>
          <Card style={s.recCard}>
            <View style={s.chips}>
              <Chip label={`Start: ${rec.startLessonId}`} tone="accent" />
              <Chip label={rec.fastTrack ? 'FAST-TRACK' : 'FULL GUIDANCE'} tone={rec.fastTrack ? 'warning' : 'success'} />
            </View>
            <Body>
              Level {rec.startLevelId.slice(1)}: {rec.startLevelTitle} → {rec.startModuleId} → {rec.startLessonId}
            </Body>
            <Muted>{rec.why}</Muted>
          </Card>
          <H2>Your first week (30 min/day)</H2>
          {rec.firstWeek.map((d, i) => (
            <Card key={i}>
              <Body>{d}</Body>
            </Card>
          ))}
          <H2>Focus project + tools</H2>
          <Card>
            <Body>
              {rec.focusProjectId} — {rec.focusProjectTitle}
            </Body>
            <Muted>Tools: {rec.keyTools.join(' • ')}</Muted>
            <LinkButton href={`/project/${rec.focusProjectId}`} title={`Preview ${rec.focusProjectId} workspace`} />
          </Card>
          <Card>
            <Muted>PACE</Muted>
            <Body>{rec.pace}</Body>
          </Card>
          <Pressable onPress={finish} style={s.go}>
            <Text style={s.goT}>Save plan + enter AI-MasterPlan →</Text>
          </Pressable>
          <LinkButton href={`/lesson/${rec.startLessonId}`} title={`Jump straight to ${rec.startLessonId}`} />
          <Muted>
            Picks: coded={answers.coded} • ai={answers.aiTools} • goal={answers.goal}
          </Muted>
        </>
      )}
      <View style={{ height: 24 }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  opt: { backgroundColor: Theme.colors.card, borderWidth: 1, borderColor: Theme.colors.border, padding: 16, borderRadius: Theme.radius.md, marginVertical: 6, minHeight: 64, justifyContent: 'center' },
  optT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 16 },
  optH: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 13, marginTop: 2 },
  go: { backgroundColor: Theme.colors.primary, borderWidth: 2, borderColor: Theme.colors.goldBorder, padding: 16, borderRadius: Theme.radius.sm, alignItems: 'center', marginTop: 12, minHeight: Theme.touch.min, justifyContent: 'center' },
  goT: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold, fontSize: 16 },
  back: { minHeight: Theme.touch.min, justifyContent: 'center', marginTop: 6 },
  backT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold, textAlign: 'center' },
  youCard: { borderColor: Theme.colors.success },
  recCard: { borderColor: Theme.colors.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
});

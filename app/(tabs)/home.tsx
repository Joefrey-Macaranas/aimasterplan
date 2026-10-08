import { ScrollView, StyleSheet } from 'react-native';
import { PRODUCT, JOURNEY_MAP, LEARNING_PHILOSOPHY } from '../../src/constants/branding';
import { useProgress, useAuth } from '../../src/store/store';
import { overallProgress } from '../../src/lib/progress';
import { xpBreakdown } from '../../src/lib/gamification';
import { LESSONS, LEVELS, getModulesForLevel } from '../../src/data/curriculum';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, ProgressBar, LinkButton, Bullet, Grid } from '../../src/components/ui';

export default function Home() {
  const { completed } = useProgress();
  const { auth } = useAuth();
  const pct = overallProgress(completed);
  const { total, level } = xpBreakdown(completed);
  const next = LESSONS.find((l) => !completed.includes(l.id));
  const nextLevel = next ? LEVELS.find((lv) => getModulesForLevel(lv.id).some((m) => m.id === next.moduleId)) : undefined;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>{auth.name ? `WELCOME BACK, ${auth.name.toUpperCase()}` : PRODUCT.name.toUpperCase()}</Eyebrow>
        <H1>{auth.name ? 'Continue building.' : 'Become an independent AI builder.'}</H1>
        <Body>{PRODUCT.tagline}</Body>

        <Card>
          <Muted>
            OVERALL PROGRESS • {completed.length}/{LESSONS.length} LESSONS • {total} XP • LEVEL {level}
          </Muted>
          <ProgressBar pct={pct} />
          <Muted>{pct}% complete — small steps every day compound.</Muted>
        </Card>

        <Card>
          <Muted>UP NEXT — RESUME WHERE YOU LEFT OFF</Muted>
          {next ? (
            <>
              <H2>
                {next.id} — {next.title}
              </H2>
              <Body>
                {next.objective} • {next.minutes} min{nextLevel ? ` • Level ${nextLevel.index}: ${nextLevel.title}` : ''}
              </Body>
              <LinkButton href={`/lesson/${next.id}`} title="▶ Continue lesson (WHY first, then HOW)" />
              <LinkButton href={`/video/${next.id}`} title="▶ Play recorded walkthrough" />
            </>
          ) : (
            <>
              <H2>All done — you are an Independent Builder!</H2>
              <Body>Open the AI Project Planner and ship your own product.</Body>
              <LinkButton href="/planner" title="Open AI Project Planner" />
            </>
          )}
        </Card>

        <H2>Your student journey</H2>
        <Muted>Beginner → Independent System Builder. Each step maps to guided levels.</Muted>
        {JOURNEY_MAP.map((j) => (
          <Card key={j.step}>
            <Chip label={j.levels} tone="accent" />
            <Body>{j.step}</Body>
            <Muted>{j.detail}</Muted>
          </Card>
        ))}

        <H2>How this school teaches</H2>
        {LEARNING_PHILOSOPHY.map((p) => (
          <Bullet key={p}>{p}</Bullet>
        ))}

        <H2>Quick actions</H2>
        <LinkButton href="/roadmap" title="Open Course Roadmap (Levels 1–10)" />
        <LinkButton href="/progress" title="Open Progress dashboard" />
        <LinkButton href="/module/L1M1" title="Open a module (e.g. L1M1 AI Foundations)" />
        <LinkButton href="/project/P01" title="Open a project workspace (e.g. P01)" />
        <LinkButton href="/achievements" title="View achievements" />
        <LinkButton href="/settings" title="Open settings" />
        <LinkButton href="/(tabs)/projects" title="Browse 10 guided projects" />
        <LinkButton href="/(tabs)/tools" title="Open Tools Vault (what to install)" />
        <LinkButton href="/planner" title="AI Project Planner — turn idea into plan" />
        <LinkButton href="/assistant" title="Ask the Learning Assistant" />
        <LinkButton href="/meet" title="Weekly Meet & Greet with the author" />
        <LinkButton href="/community" title="Community — introductions & help" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({});
export { styles };

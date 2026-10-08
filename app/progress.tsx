// Progress dashboard — the student's command center: overall, per-level, XP, streak, forecast.
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Theme } from '../src/theme';
import { LEVELS, LESSONS } from '../src/data/curriculum';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, ProgressBar, LinkButton, Grid } from '../src/components/ui';
import { useProgress } from '../src/store/store';
import { overallProgress, levelProgress } from '../src/lib/progress';
import { xpBreakdown, levelForXp } from '../src/lib/gamification';

const XP_PER_LEVEL = [0, 100, 225, 400, 625, 900, 1225, 1600, 2025, 2500];

export default function ProgressDashboard() {
  const { completed, bookmarks } = useProgress();
  const pct = overallProgress(completed);
  const { total, level } = xpBreakdown(completed);
  const nextThreshold = XP_PER_LEVEL[level] ?? total + 200;
  const toNext = Math.max(0, nextThreshold - total);
  const lessonsLeft = LESSONS.length - completed.length;
  const estMinsLeft = LESSONS.filter((l) => !completed.includes(l.id)).reduce((n, l) => n + l.minutes, 0);
  const next = LESSONS.find((l) => !completed.includes(l.id));

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>PROGRESS DASHBOARD • PLAN → BUILD → SHIP</Eyebrow>
        <H1>Your progress</H1>
        <Body>
          {completed.length}/{LESSONS.length} lessons • {bookmarks.length} bookmarked • {estMinsLeft} min left (~
          {Math.ceil(estMinsLeft / 30)} sessions).
        </Body>

        <Card style={s.hero}>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.big}>{pct}%</Text>
              <Muted>complete — Independent Builder at 100%</Muted>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.big}>{total} XP</Text>
              <Muted>
                Gamer level {level} • {toNext} XP to {level + 1} ({levelForXp(total + toNext) > level ? 'level-up soon!' : 'keep going'})
              </Muted>
            </View>
          </View>
          <ProgressBar pct={pct} />
          {next ? (
            <LinkButton href={`/lesson/${next.id}`} title={`▶ Continue: ${next.id} — ${next.title}`} />
          ) : (
            <LinkButton href="/planner" title="All done — plan your own product" />
          )}
        </Card>

        <H2>Levels 1–10 breakdown</H2>
        <Grid>
          {LEVELS.map((lv) => {
            const p = levelProgress(lv.id, completed);
            return (
              <Card key={lv.id}>
                <View style={s.row}>
                  <Text style={s.lvT}>
                    L{lv.index} {lv.title}
                  </Text>
                  <Chip label={p === 100 ? 'DONE ✓' : `${p}%`} tone={p === 100 ? 'success' : 'default'} />
                </View>
                <ProgressBar pct={p} />
                <Muted>{lv.summary}</Muted>
                <LinkButton href={`/roadmap`} title={`Open Level ${lv.index}`} />
              </Card>
            );
          })}
        </Grid>

        <H2>Forecast</H2>
        <Card>
          <Body>
            {lessonsLeft === 0
              ? 'You finished everything. Ship P10 and claim your certificate.'
              : `At 2 lessons/day you finish in ~${Math.ceil(lessonsLeft / 2)} days. At 30 min/day, ~${Math.ceil(estMinsLeft / 30)} days.`}
          </Body>
          <Muted>Small daily wins beat weekend marathons. Streaks are counted when you complete any lesson.</Muted>
        </Card>

        <LinkButton href="/achievements" title="View achievements" />
        <LinkButton href="/certificates" title="View certificates" />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { borderColor: Theme.colors.primary },
  row: { flexDirection: 'row', gap: 12 },
  big: { color: Theme.colors.text, fontFamily: Theme.fonts.black, fontSize: 32 },
  lvT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 14, flex: 1 },
});

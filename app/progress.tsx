// Progress dashboard — overall, levels, modules, lessons, projects, XP, streak, weekly goals.
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../src/theme';
import { LEVELS, LESSONS, getModulesForLevel } from '../src/data/curriculum';
import { PROJECTS } from '../src/data/projects';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, ProgressBar, LinkButton, Grid } from '../src/components/ui';
import { MelroseIcon } from '../src/components/icons';
import { useProgress } from '../src/store/store';
import { overallProgress, levelProgress, moduleProgress } from '../src/lib/progress';
import { xpBreakdownFull, levelForXp, weeklyStatus, achievementsFor } from '../src/lib/gamification';

const XP_PER_LEVEL = [0, 100, 225, 400, 625, 900, 1225, 1600, 2025, 2500];
const GOAL_KEY = 'amp-weekly-target';

export default function ProgressDashboard() {
  const { completed, bookmarks, activity, streak, projectDone, projectPct, completedProjects, projectStageCount } = useProgress();
  const pct = overallProgress(completed);
  const xp = xpBreakdownFull(completed, projectStageCount);
  const badges = achievementsFor(completed, completedProjects);
  const nextThreshold = XP_PER_LEVEL[xp.level] ?? xp.total + 200;
  const toNext = Math.max(0, nextThreshold - xp.total);
  const lessonsLeft = LESSONS.length - completed.length;
  const estMinsLeft = LESSONS.filter((l) => !completed.includes(l.id)).reduce((n, l) => n + l.minutes, 0);
  const next = LESSONS.find((l) => !completed.includes(l.id));
  const [target, setTarget] = useState(5);

  useEffect(() => {
    AsyncStorage.getItem(GOAL_KEY).then((s) => {
      if (s) setTarget(Math.max(1, Math.min(21, Number(s) || 5)));
    });
  }, []);
  function bump(d: number) {
    const t = Math.max(1, Math.min(21, target + d));
    setTarget(t);
    AsyncStorage.setItem(GOAL_KEY, String(t)).catch(() => {});
  }
  const week = weeklyStatus(activity, target);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>PROGRESS DASHBOARD • LESSONS + PROJECTS + STREAK + GOALS</Eyebrow>
        <H1>Your progress</H1>
        <Body>
          {completed.length}/{LESSONS.length} lessons • {completedProjects}/{PROJECTS.length} projects • {bookmarks.length} bookmarked • {estMinsLeft} min left
        </Body>

        <Card style={s.hero}>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.big}>{pct}%</Text>
              <Muted>lessons complete</Muted>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.big}>{xp.total} XP</Text>
              <Muted>
                Gamer level {xp.level} • {toNext} XP to {xp.level + 1} ({levelForXp(xp.total + toNext) > xp.level ? 'level-up soon!' : 'keep going'})
              </Muted>
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.streakRow}>
                <MelroseIcon name="zap" size={22} color={Theme.colors.text} />
                <Text style={s.big}>{streak}</Text>
              </View>
              <Muted>day streak — complete anything daily</Muted>
            </View>
          </View>
          <ProgressBar pct={pct} />
          <Muted>
            XP split: {xp.fromLessons} lessons + {xp.fromProjects} project stages • {badges.length} badges unlocked
          </Muted>
          {next ? (
            <LinkButton href={`/lesson/${next.id}`} title={`Continue: ${next.id} — ${next.title}`} />
          ) : (
            <LinkButton href="/planner" title="All done — plan your own product" />
          )}
        </Card>

        <H2>Weekly goal — {week.met ? 'met ✓' : `${week.done}/${week.target} days`}</H2>
        <Card>
          <View style={s.row}>
            <Pressable onPress={() => bump(-1)} style={s.step}>
              <Text style={s.stepT}>−</Text>
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={s.goalT}>
                {week.done}/{week.target} active days this week
              </Text>
              <ProgressBar pct={week.pct} />
            </View>
            <Pressable onPress={() => bump(1)} style={s.step}>
              <Text style={s.stepT}>＋</Text>
            </Pressable>
          </View>
          <Muted>{week.met ? 'Goal met — set a higher target or enjoy the momentum.' : 'Target: active days with any lesson or project stage. Small daily wins beat marathons.'}</Muted>
        </Card>

        <H2>Levels + modules</H2>
        <Grid>
          {LEVELS.map((lv) => {
            const p = levelProgress(lv.id, completed);
            const mods = getModulesForLevel(lv.id);
            return (
              <Card key={lv.id}>
                <View style={s.row}>
                  <Text style={s.lvT}>
                    L{lv.index} {lv.title}
                  </Text>
                  <Chip label={p === 100 ? 'DONE ✓' : `${p}%`} tone={p === 100 ? 'success' : 'default'} />
                </View>
                <ProgressBar pct={p} />
                {mods.map((m) => {
                  const mp = moduleProgress(m.id, completed);
                  return (
                    <View key={m.id} style={s.modRow}>
                      <Text style={s.modT}>
                        {m.id} {m.title}
                      </Text>
                      <Text style={s.modP}>{mp}%</Text>
                    </View>
                  );
                })}
                <LinkButton href={`/roadmap`} title={`Open Level ${lv.index}`} />
              </Card>
            );
          })}
        </Grid>

        <H2>Projects ({completedProjects}/{PROJECTS.length} complete)</H2>
        {PROJECTS.map((p) => {
          const pp = projectPct(p.id);
          const done = (projectDone[p.id] ?? []).length;
          return (
            <Card key={p.id}>
              <View style={s.row}>
                <Text style={s.lvT}>
                  {p.id} — {p.title.replace(/^Project \d+ — /, '')}
                </Text>
                <Chip label={pp === 100 ? 'DONE ✓' : `${done}/${p.stages.length}`} tone={pp === 100 ? 'success' : 'default'} />
              </View>
              <ProgressBar pct={pp} />
              <LinkButton href={`/project/${p.id}`} title={`Open ${p.id} workspace`} />
            </Card>
          );
        })}

        <H2>Forecast</H2>
        <Card>
          <Body>
            {lessonsLeft === 0
              ? 'You finished everything. Ship P10 and claim your certificate.'
              : `At 2 lessons/day you finish in ~${Math.ceil(lessonsLeft / 2)} days. At 30 min/day, ~${Math.ceil(estMinsLeft / 30)} days.`}
          </Body>
          <Muted>Streak {streak} day(s) • weekly {week.done}/{week.target} • badges {badges.length}/10.</Muted>
        </Card>

        <LinkButton href="/achievements" title="View achievements" />
        <LinkButton href="/certificates" title="View certificates" />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { borderColor: Theme.colors.primary },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  big: { color: '#fff', fontFamily: Theme.fonts.black, fontSize: 30 },
  lvT: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 14, flex: 1 },
  modRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  modT: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 12, flex: 1 },
  modP: { color: Theme.colors.muted, fontFamily: Theme.fonts.bold, fontSize: 12 },
  step: { width: 48, height: 48, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  stepT: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 20 },
  goalT: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 15 },
});

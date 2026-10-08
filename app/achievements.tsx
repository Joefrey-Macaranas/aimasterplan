// Achievements — gamified wins from first lesson to independent builder.
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Theme } from '../src/theme';
import { ACHIEVEMENTS } from '../src/data/gamification';
import { Screen, H1, Body, Muted, Eyebrow, Card, Chip, ProgressBar, LinkButton, Grid } from '../src/components/ui';
import { useProgress } from '../src/store/store';
import { achievementsFor, xpBreakdown } from '../src/lib/gamification';

export default function AchievementsScreen() {
  const { completed } = useProgress();
  const mine = achievementsFor(completed, 0);
  const { total } = xpBreakdown(completed);
  const pct = ACHIEVEMENTS.length ? Math.round((mine.length / ACHIEVEMENTS.length) * 100) : 0;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>ACHIEVEMENTS • {mine.length}/{ACHIEVEMENTS.length} UNLOCKED • {total} XP</Eyebrow>
        <H1>Achievements</H1>
        <Body>Small wins compound. Unlock these by actually building — not by watching.</Body>
        <ProgressBar pct={pct} />
        <Grid>
          {ACHIEVEMENTS.map((a) => {
            const got = mine.includes(a.id);
            return (
              <Card key={a.id} style={got ? s.got : s.locked}>
                <View style={s.row}>
                  <Text style={s.emoji}>{got ? '🏆' : '🔒'}</Text>
                  <Chip label={`+${a.xp} XP`} tone={got ? 'success' : 'default'} />
                </View>
                <Text style={s.t}>{a.title}</Text>
                <Muted>{a.description}</Muted>
                <Muted>{got ? 'Unlocked ✓' : 'Locked — keep building'}</Muted>
              </Card>
            );
          })}
        </Grid>
        <LinkButton href="/certificates" title="View certificates" />
        <LinkButton href="/progress" title="Open progress dashboard" />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  emoji: { fontSize: 28 },
  t: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 16, marginTop: 8 },
  got: { borderColor: Theme.colors.success },
  locked: { opacity: 0.85 },
});

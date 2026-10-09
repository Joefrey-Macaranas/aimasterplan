// Entry — Melrose-style light editorial landing.
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { PRODUCT, TARGET_USERS, STUDENT_JOURNEY, LEARNING_PHILOSOPHY } from '../src/constants/branding';
import { Theme } from '../src/theme';
import { Screen, Eyebrow, Grid, Card } from '../src/components/ui';

const STATS: [string, string][] = [
  ['40', 'Hands-on lessons'],
  ['10', 'Guided levels'],
  ['10', 'Real projects'],
  ['Live', 'Weekly meetups'],
];

export default function Index() {
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.inner}>
        <Text style={s.brand}>AI-MASTERPLAN</Text>
        <Eyebrow>Beginner-friendly • No coding required • Phone + tablet</Eyebrow>
        <Text style={s.t}>Learn to build AI apps.</Text>
        <Text style={s.sub}>{PRODUCT.tagline} Follow guided lessons and recorded walkthroughs, from zero to shipping your own product.</Text>

        <Link href="/(onboarding)/welcome" asChild>
          <Pressable style={s.b}>
            <Text style={s.bt}>Get started — it&apos;s guided</Text>
          </Pressable>
        </Link>
        <Link href="/(tabs)/home" asChild>
          <Pressable style={s.ghost}>
            <Text style={s.ghostT}>Explore the course roadmap</Text>
          </Pressable>
        </Link>
        <Link href="/(auth)/login" asChild>
          <Pressable style={s.loginBtn}>
            <Text style={s.loginBtnText}>Already have an account? Sign in</Text>
          </Pressable>
        </Link>

        <View style={s.stats}>
          {STATS.map(([n, label]) => (
            <View key={label} style={s.stat}>
              <Text style={s.statN}>{n}</Text>
              <Text style={s.statL}>{label}</Text>
            </View>
          ))}
        </View>

        <Card>
          <Text style={s.cardT}>Your journey: Beginner → Independent System Builder</Text>
          <Text style={s.cardP}>{STUDENT_JOURNEY.join('  →  ')}</Text>
        </Card>

        <Text style={s.h}>Built for</Text>
        <Grid>
          {TARGET_USERS.map((u) => (
            <Card key={u}>
              <Text style={s.p}>{u}</Text>
            </Card>
          ))}
        </Grid>

        <Text style={s.h}>How you will learn</Text>
        {LEARNING_PHILOSOPHY.map((p) => (
          <Text key={p} style={s.p}>
            • {p}
          </Text>
        ))}
        <Text style={s.foot}>Vibe Coding • AI automation • Apps • Full systems — plan, build, test, deploy. Android + iOS.</Text>
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  inner: { paddingBottom: 24 },
  brand: { color: Theme.colors.text, fontFamily: Theme.fonts.display, fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  t: { color: Theme.colors.text, fontFamily: Theme.fonts.display, fontSize: 44, marginTop: 12 },
  sub: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 16, lineHeight: 25, marginVertical: 14 },
  b: { backgroundColor: Theme.colors.primary, borderWidth: 1, borderColor: Theme.colors.primary, padding: 17, borderRadius: 0, alignItems: 'center', marginTop: 12, minHeight: Theme.touch.min, justifyContent: 'center' },
  bt: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Theme.colors.text, padding: 16, borderRadius: 0, alignItems: 'center', marginTop: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  ghostT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' },
  loginBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Theme.colors.border, padding: 14, borderRadius: 0, alignItems: 'center', marginTop: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  loginBtnText: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 14, letterSpacing: 0.5 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, marginTop: 28 },
  stat: { width: '50%', padding: 18, borderWidth: 0.5, borderColor: Theme.colors.border, alignItems: 'center' },
  statN: { color: Theme.colors.text, fontFamily: Theme.fonts.display, fontSize: 32 },
  statL: { color: Theme.colors.muted, fontFamily: Theme.fonts.bold, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4, textAlign: 'center' },
  cardT: { color: Theme.colors.text, fontFamily: Theme.fonts.display, fontSize: 19, marginBottom: 8 },
  cardP: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 13, lineHeight: 21 },
  h: { color: Theme.colors.text, fontFamily: Theme.fonts.display, fontSize: 24, marginTop: 32, marginBottom: 8 },
  p: { color: Theme.colors.text, marginVertical: 3, fontSize: 15, lineHeight: 23, fontFamily: Theme.fonts.regular },
  foot: { color: Theme.colors.muted, marginTop: 28, textAlign: 'center', fontFamily: Theme.fonts.regular, fontSize: 13 },
});

// Entry — Melrose-style light editorial landing.
import { ScrollView, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { PRODUCT, TARGET_USERS, STUDENT_JOURNEY, LEARNING_PHILOSOPHY } from '../src/constants/branding';
import { Theme } from '../src/theme';
import { useTheme } from '../src/store/theme';
import { Screen, Eyebrow, Grid, Card } from '../src/components/ui';

const STATS: [string, string][] = [
  ['40', 'Hands-on lessons'],
  ['10', 'Guided levels'],
  ['10', 'Real projects'],
  ['Live', 'Weekly meetups'],
];

export default function Index() {
  const { colors, mode, toggle, dark } = useTheme();
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.inner}>
        <View style={s.brandRow}>
          <Pressable
            onPress={toggle}
            accessibilityRole="button"
            accessibilityLabel={`AI-MasterPlan logo — switch to ${dark ? 'light' : 'dark'} mode (now ${mode})`}
            accessibilityHint="Tap the logo to toggle dark and light mode"
            style={({ pressed }) => StyleSheet.flatten([s.logoBtn, pressed && { opacity: 0.7 }])}
          >
            <Image source={require('../logo/icon.jpeg')} style={s.logo} resizeMode="contain" accessibilityLabel="AI-MasterPlan logo" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[s.brand, { color: colors.text }]}>AI-MASTERPLAN</Text>
          </View>
        </View>
        <Eyebrow>Beginner-friendly • No coding required • Phone + tablet</Eyebrow>
        <Text style={[s.t, { color: colors.text }]}>Learn to build AI apps.</Text>
        <Text style={[s.sub, { color: colors.muted }]}>{PRODUCT.tagline} Follow guided lessons and recorded walkthroughs, from zero to shipping your own product.</Text>

        <Link href="/(onboarding)/welcome" asChild>
          <Pressable style={StyleSheet.flatten([s.b, { backgroundColor: colors.primary, borderColor: colors.primary }])}>
            <Text style={[s.bt, { color: colors.onPrimary }]}>Get started — it&apos;s guided</Text>
          </Pressable>
        </Link>
        <Link href="/(tabs)/home" asChild>
          <Pressable style={StyleSheet.flatten([s.ghost, { borderColor: colors.text }])}>
            <Text style={[s.ghostT, { color: colors.text }]}>Explore the course roadmap</Text>
          </Pressable>
        </Link>
        <Link href="/(auth)/login" asChild>
          <Pressable style={StyleSheet.flatten([s.loginBtn, { borderColor: colors.border }])}>
            <Text style={[s.loginBtnText, { color: colors.muted }]}>Already have an account? Sign in</Text>
          </Pressable>
        </Link>

        <View style={[s.stats, { borderColor: colors.border }]}>
          {STATS.map(([n, label]) => (
            <View key={label} style={[s.stat, { borderColor: colors.border }]}>
              <Text style={[s.statN, { color: colors.text }]}>{n}</Text>
              <Text style={[s.statL, { color: colors.muted }]}>{label}</Text>
            </View>
          ))}
        </View>

        <Card>
          <Text style={[s.cardT, { color: colors.text }]}>Your journey: Beginner → Independent System Builder</Text>
          <Text style={[s.cardP, { color: colors.muted }]}>{STUDENT_JOURNEY.join('  →  ')}</Text>
        </Card>

        <Text style={[s.h, { color: colors.text }]}>Built for</Text>
        <Grid>
          {TARGET_USERS.map((u) => (
            <Card key={u}>
              <Text style={[s.p, { color: colors.text }]}>{u}</Text>
            </Card>
          ))}
        </Grid>

        <Text style={[s.h, { color: colors.text }]}>How you will learn</Text>
        {LEARNING_PHILOSOPHY.map((p) => (
          <Text key={p} style={[s.p, { color: colors.text }]}>
            • {p}
          </Text>
        ))}
        <Text style={[s.foot, { color: colors.muted }]}>Vibe Coding • AI automation • Apps • Full systems — plan, build, test, deploy. Android + iOS.</Text>
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  inner: { paddingBottom: 24 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  logoBtn: { borderRadius: 12, minHeight: Theme.touch.min, minWidth: Theme.touch.min, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 48, height: 48, borderRadius: 12 },
  brand: { color: Theme.colors.text, fontFamily: Theme.fonts.display, fontSize: 22, letterSpacing: 2, textTransform: 'uppercase' },
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

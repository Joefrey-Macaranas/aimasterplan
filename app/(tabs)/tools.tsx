// PHASE 09 — Tools Vault: name, icon, category, what, why, free/paid,
// install, setup walkthrough, website, related tutorials (tappable).
import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Linking, Image } from 'react-native';
import { Link } from 'expo-router';
import { Theme } from '../../src/theme';
import { TOOLS, TOOL_CATEGORIES } from '../../src/data/tools';
import { getLesson } from '../../src/data/curriculum';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip } from '../../src/components/ui';

// Each tool's own brand logo, bundled locally (offline-first).
const LOGOS: Record<string, number> = {
  chatgpt: require('../../assets/logos/chatgpt.png'),
  vscode: require('../../assets/logos/vscode.png'),
  figma: require('../../assets/logos/figma.png'),
  supabase: require('../../assets/logos/supabase.png'),
  n8n: require('../../assets/logos/n8n.png'),
  nodejs: require('../../assets/logos/nodejs.png'),
  github: require('../../assets/logos/github.png'),
  git: require('../../assets/logos/git.png'),
  netlify: require('../../assets/logos/netlify.png'),
  expo: require('../../assets/logos/expo.png'),
  devtools: require('../../assets/logos/devtools.png'),
};
// Generic tools with no brand mark get a minimal initial tile (Melrose-style).
const INITIALS: Record<string, string> = { 'coding-agent': 'AI', terminal: '>_' };

function ToolLogo({ id, name }: { id: string; name: string }) {
  const src = LOGOS[id];
  if (src) {
    return <Image source={src} style={s.logo} resizeMode="contain" accessibilityLabel={`${name} logo`} />;
  }
  return (
    <View style={s.logoTile}>
      <Text style={s.logoTileT}>{INITIALS[id] ?? name.slice(0, 2).toUpperCase()}</Text>
    </View>
  );
}

export default function Tools() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const filtered = TOOLS.filter((t) => {
    if (cat && t.category !== cat) return false;
    if (!q.trim()) return true;
    const hay = `${t.name} ${t.what} ${t.why} ${t.category}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>TOOLS VAULT • {TOOLS.length} TOOLS • {TOOL_CATEGORIES.length} CATEGORIES</Eyebrow>
        <H1>Tools Vault</H1>
        <Body>Every tool you need — what it is, why you need it, setup walkthrough, related tutorials. Free-first for beginners.</Body>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search tools… (e.g. database, git, design)"
          placeholderTextColor="#64748b"
          style={s.search}
        />
        <View style={s.chips}>
          <Pressable onPress={() => setCat(null)} style={[s.chip, !cat && s.chipOn]}>
            <Text style={[s.chipT, !cat && s.chipTOn]}>All</Text>
          </Pressable>
          {TOOL_CATEGORIES.map((c) => (
            <Pressable key={c} onPress={() => setCat(cat === c ? null : c)} style={[s.chip, cat === c && s.chipOn]}>
              <Text style={[s.chipT, cat === c && s.chipTOn]}>{c}</Text>
            </Pressable>
          ))}
        </View>
        <Muted>
          {filtered.length} tools{cat ? ` in ${cat}` : ''}{q ? ` matching “${q}”` : ''}
        </Muted>
        {filtered.map((t) => (
          <Card key={t.id}>
            <View style={s.row}>
              <ToolLogo id={t.id} name={t.name} />
              <Text style={s.name}>{t.name}</Text>
              <Chip label={t.free} tone={t.free === 'free' ? 'success' : t.free === 'freemium' ? 'warning' : 'default'} />
            </View>
            <Muted>{t.category}</Muted>
            <Text style={s.label}>What is it?</Text>
            <Text style={s.p}>{t.what}</Text>
            <Text style={s.label}>Why do I need it?</Text>
            <Text style={s.p}>{t.why}</Text>
            <Text style={s.label}>How do I install it?</Text>
            <Text style={s.p}>{t.install}</Text>
            <H2>Setup walkthrough</H2>
            {t.setupSteps.map((st, i) => (
              <Text key={i} style={s.p}>
                {i + 1}. {st}
              </Text>
            ))}
            <View style={s.row}>
              <Pressable onPress={() => Linking.openURL(t.setupUrl)} style={s.btn}>
                <Text style={s.btnT}>Setup guide</Text>
              </Pressable>
              <Pressable onPress={() => Linking.openURL(t.website)} style={s.btnGhost}>
                <Text style={s.btnGhostT}>Official website</Text>
              </Pressable>
            </View>
            {t.relatedLessons.length > 0 && (
              <>
                <Text style={s.label}>Related tutorials</Text>
                {t.relatedLessons.map((rid) => {
                  const l = getLesson(rid);
                  if (!l) return null;
                  return (
                    <Link key={rid} href={`/lesson/${rid}` as never}>
                      <Text style={s.rel}>▶ {rid} — {l.title}</Text>
                    </Link>
                  );
                })}
              </>
            )}
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  search: { backgroundColor: Theme.colors.card, color: Theme.colors.text, borderRadius: 0, padding: 12, marginVertical: 10, borderWidth: 1, borderColor: Theme.colors.border, minHeight: Theme.touch.min },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, minHeight: Theme.touch.min, justifyContent: 'center' },
  chipOn: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.primary },
  chipT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 12 },
  chipTOn: { color: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  logo: { width: 40, height: 40 },
  logoTile: { width: 40, height: 40, backgroundColor: Theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoTileT: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 15 },
  name: { color: Theme.colors.text, fontWeight: '800', fontSize: 17, flex: 1 },
  label: { color: Theme.colors.text, fontWeight: '800', marginTop: 8, fontSize: 13 },
  p: { color: Theme.colors.text, fontSize: 14, lineHeight: 20, marginTop: 2 },
  rel: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold, fontSize: 14, marginVertical: 4 },
  btn: { backgroundColor: Theme.colors.primary, borderRadius: 0, paddingHorizontal: 14, paddingVertical: 10, marginTop: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  btnT: { color: '#fff', fontFamily: Theme.fonts.bold },
  btnGhost: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, paddingHorizontal: 14, paddingVertical: 10, marginTop: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  btnGhostT: { color: Theme.colors.accent, fontWeight: '700' },
});

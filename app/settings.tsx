// Settings — preferences, notifications, playback, offline, privacy, danger zone.
// Offline-first: persisted in AsyncStorage, works on Android + iOS + web.
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Switch, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, LinkButton, Divider, Chip } from '../src/components/ui';
import { Theme } from '../src/theme';
import { useAuth, useProgress } from '../src/store/store';
import { ROLE_ORDER, ROLE_COPY } from '../src/lib/roles';

const KEY = 'amp-settings';
const DEFAULTS = { reminders: true, meetReminders: true, speed: 1 as number, wifiOnly: true, textSize: 'Standard' as 'Compact' | 'Standard' | 'Large' };

type Settings = typeof DEFAULTS;

function Row({ title, hint, right }: { title: string; hint?: string; right: React.ReactNode }) {
  return (
    <View style={s.row}>
      <View style={{ flex: 1 }}>
        <Text style={s.rowT}>{title}</Text>
        {hint ? <Text style={s.rowH}>{hint}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export default function SettingsScreen() {
  const [cfg, setCfg] = useState<Settings>(DEFAULTS);
  const [savedTick, setSavedTick] = useState(false);
  const { signOut } = useAuth();
  const { auth, setRole } = useAuth();
  const { completed } = useProgress();

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) setCfg({ ...DEFAULTS, ...JSON.parse(raw) });
    });
  }, []);
  const patch = (p: Partial<Settings>) => {
    const next = { ...cfg, ...p };
    setCfg(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 1200);
  };

  const cycleSpeed = () => {
    const order = [0.75, 1, 1.25, 1.5, 2];
    const i = order.indexOf(cfg.speed);
    patch({ speed: order[(i + 1) % order.length] ?? 1 });
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>SETTINGS • {Platform.OS.toUpperCase()} • SAVED ON DEVICE{savedTick ? ' ✓' : ''}</Eyebrow>
        <H1>Settings</H1>

        <H2>Learning</H2>
        <Card>
          <Row
            title="Default walkthrough speed"
            hint="Applies to every recorded video."
            right={
              <Pressable onPress={cycleSpeed} style={s.pill}>
                <Text style={s.pillT}>{cfg.speed}x — tap</Text>
              </Pressable>
            }
          />
          <Divider />
          <Row title="Text size" hint="Larger = easier for total beginners." right={
            <View style={s.seg}>
              {(['Compact', 'Standard', 'Large'] as const).map((t) => (
                <Pressable key={t} onPress={() => patch({ textSize: t })} style={[s.segBtn, cfg.textSize === t && s.segOn]}>
                  <Text style={[s.segT, cfg.textSize === t && s.segTOn]}>{t}</Text>
                </Pressable>
              ))}
            </View>
          } />
        </Card>

        <H2>Reminders</H2>
        <Card>
          <Row
            title="Daily learning reminder"
            hint="Gentle nudge to keep your streak."
            right={<Switch value={cfg.reminders} onValueChange={(v) => patch({ reminders: v })} />}
          />
          <Divider />
          <Row
            title="Meet & Greet reminder"
            hint="1 day + 1 hour before the weekly session."
            right={<Switch value={cfg.meetReminders} onValueChange={(v) => patch({ meetReminders: v })} />}
          />
        </Card>

        <H2>Offline & data</H2>
        <Card>
          <Row
            title="Download on Wi-Fi only"
            hint={Platform.OS === 'android' ? 'Android: saves mobile data.' : 'iOS: saves mobile data.'}
            right={<Switch value={cfg.wifiOnly} onValueChange={(v) => patch({ wifiOnly: v })} />}
          />
          <Divider />
          <Body>Lessons completed on this device: {completed.length}. Sign-in syncs when backend is connected.</Body>
        </Card>

        <H2>About</H2>
        <Card>
          <Muted>AI-MasterPlan 1.0.0-mvp • Beginner → Independent System Builder • Vibe Coding, AI automation, apps, systems.</Muted>
          <LinkButton href="/splash" title="Preview splash screen" />
          <LinkButton href="/progress" title="Open progress dashboard" />
        </Card>

        <H2>Role (demo switcher)</H2>
        <Card>
          <Muted>CURRENT: {auth.role.toUpperCase()} — {ROLE_COPY[auth.role].blurb}</Muted>
          <View style={s.roleGrid}>
            {ROLE_ORDER.map((r) => (
              <Pressable key={r} onPress={() => setRole(r)} style={[s.segBtn, auth.role === r && s.segOn]}>
                <Text style={[s.segT, auth.role === r && s.segTOn]}>{ROLE_COPY[r].title}</Text>
              </Pressable>
            ))}
          </View>
          <Muted>Student → Instructor → Author → Admin. Admin CMS unlocks at author+. Production: server assigns roles (PUT /admin/users/:id/role).</Muted>
          <LinkButton href="/admin" title="Open Admin CMS (role-gated)" />
          <View style={s.roleList}>
            {ROLE_ORDER.map((r) => (
              <View key={r} style={s.roleRow}>
                <Chip label={ROLE_COPY[r].badge} tone={auth.role === r ? 'success' : 'default'} />
                <View style={{ flex: 1 }}>
                  <Text style={s.rowT}>{ROLE_COPY[r].title}</Text>
                  <Text style={s.rowH}>{ROLE_COPY[r].blurb}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <H2>Account</H2>
        <Card>
          <Pressable onPress={signOut} style={s.out}>
            <Text style={s.outT}>Sign out</Text>
          </Pressable>
        </Card>
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  rowT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 15 },
  rowH: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 12, marginTop: 2 },
  pill: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  pillT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
  seg: { flexDirection: 'row', gap: 6 },
  segBtn: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, paddingHorizontal: 10, paddingVertical: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  segOn: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.goldBorder },
  segT: { color: Theme.colors.muted, fontFamily: Theme.fonts.bold, fontSize: 12 },
  segTOn: { color: Theme.colors.onPrimary },
  out: { backgroundColor: Theme.colors.danger, padding: 14, borderRadius: 0, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  outT: { color: '#fff', fontFamily: Theme.fonts.bold },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  roleList: { marginTop: 8, gap: 8 },
  roleRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
});

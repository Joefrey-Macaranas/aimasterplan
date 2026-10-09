// Push notifications center: enable, per-trigger toggles, test fires,
// auto-triggers (achievements, milestones, meetup, continue), tappable log.
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../src/theme';
import {
  TRIGGER_KINDS, PREFS_KEY, LOG_KEY, defaultPrefs, payloadFor,
  newBadges, ensurePermission, fireLocal, scheduleDailyContinue,
  type LogEntry,
} from '../src/lib/notifications';
import { achievementsFor } from '../src/lib/gamification';
import { getResumeLesson } from '../src/data/curriculum';
import { MEETINGS } from '../src/data/gamification';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip } from '../src/components/ui';
import { useProgress } from '../src/store/store';

const SEEN_KEY = 'amp-badges-seen';

export default function Notifications() {
  const { completed, completedProjects } = useProgress();
  const [enabled, setEnabled] = useState(false);
  const [prefs, setPrefs] = useState<Record<string, boolean>>(defaultPrefs());
  const [log, setLog] = useState<LogEntry[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY).then((s) => s && setPrefs({ ...defaultPrefs(), ...JSON.parse(s) }));
    AsyncStorage.getItem(LOG_KEY).then((s) => s && setLog(JSON.parse(s)));
    ensurePermission().then(setEnabled);
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs)).catch(() => {});
  }, [prefs]);
  useEffect(() => {
    AsyncStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, 50))).catch(() => {});
  }, [log]);

  // auto-trigger: new badges + project milestones get logged + pushed once
  useEffect(() => {
    (async () => {
      const seen: string[] = JSON.parse((await AsyncStorage.getItem(SEEN_KEY)) ?? '[]');
      const mine = achievementsFor(completed, completedProjects);
      const fresh = newBadges(mine, seen);
      if (!fresh.length) return;
      await AsyncStorage.setItem(SEEN_KEY, JSON.stringify(mine));
      for (const b of fresh) {
        await push('Achievement unlocked', { badge: b });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, completedProjects]);

  async function push(label: string, vars: { lessonId?: string; lessonTitle?: string; badge?: string; projectId?: string; hoursLeft?: number } = {}) {
    if (!prefs[label]) {
      setMsg(`“${label}” is muted — enable its toggle to receive it.`);
      return;
    }
    const p = payloadFor(label, vars);
    const entry: LogEntry = { id: `n-${Date.now()}`, title: p.title, body: p.body, route: p.route, at: new Date().toISOString(), read: false };
    setLog((l) => [entry, ...l].slice(0, 50));
    const id = await fireLocal(p.title, p.body, p.route);
    setMsg(id ? `✓ Push sent (“${label}”). Tap the log entry to open it.` : `Logged (“${label}”) — push unavailable here (web/denied), in-app log kept.`);
  }

  async function enable() {
    const ok = await ensurePermission();
    setEnabled(ok);
    setMsg(ok ? '✓ Push enabled. Daily continue reminder scheduled for 19:00.' : 'Push unavailable (web or denied) — in-app log still works. Tap any entry to open.');
    if (ok) await scheduleDailyContinue(19, 0);
  }

  async function meetReminders() {
    const m = MEETINGS[0];
    const ms = new Date(m.startsAt).getTime() - Date.now();
    if (ms <= 0) {
      setMsg('This week’s session already started — see archive on the Meet page.');
      return;
    }
    await push('Weekly Meet & Greet');
    await push('Meeting starting soon', { hoursLeft: Math.max(1, Math.round(ms / 36e5)) });
  }

  function openEntry(e: LogEntry) {
    setLog((l) => l.map((x) => (x.id === e.id ? { ...x, read: true } : x)));
    router.push(e.route as never);
  }

  const resume = getResumeLesson(completed);
  const unread = log.filter((l) => !l.read).length;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>PUSH CENTER • {enabled ? 'DEVICE PUSH ON' : 'IN-APP LOG'} • {unread} UNREAD</Eyebrow>
        <H1>Notifications</H1>
        <Body>Gentle nudges for all 9 moments — new content, continue streaks, meetups, replies, wins. No spam, every type mutable.</Body>

        <Pressable onPress={enable} style={s.enable}>
          <Text style={s.enableT}>{enabled ? '✓ Push notifications enabled' : 'Enable push notifications'}</Text>
        </Pressable>
        {!!msg && (
          <Card>
            <Body>{msg}</Body>
          </Card>
        )}

        <H2>Notify me for (9 triggers)</H2>
        {TRIGGER_KINDS.map((t, i) => (
          <Card key={`${t.label}-${i}`}>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.t}>{t.label}</Text>
                <Muted>{t.hint} → {t.route}</Muted>
              </View>
              <Switch value={!!prefs[t.label]} onValueChange={(v) => setPrefs((p) => ({ ...p, [t.label]: v }))} />
            </View>
            <View style={s.row}>
              <Pressable
                onPress={() =>
                  push(t.label, {
                    lessonId: resume?.id,
                    lessonTitle: resume?.title,
                    badge: 'First Lesson',
                    projectId: 'P01',
                    hoursLeft: 1,
                  })
                }
                style={s.test}
              >
                <Text style={s.testT}>Send test</Text>
              </Pressable>
              {t.label === 'Continue learning' && (
                <Pressable onPress={() => resume && push('Continue learning', { lessonId: resume.id, lessonTitle: resume.title })} style={s.test}>
                  <Text style={s.testT}>Nudge my resume lesson</Text>
                </Pressable>
              )}
              {(t.label === 'Weekly Meet & Greet' || t.label === 'Meeting starting soon') && (
                <Pressable onPress={meetReminders} style={s.test}>
                  <Text style={s.testT}>Schedule meetup pair</Text>
                </Pressable>
              )}
            </View>
          </Card>
        ))}

        <H2>Recent ({log.length}) — tap to open</H2>
        {log.length === 0 && <Muted>Nothing yet. Send a test above, or earn a badge to trigger one automatically.</Muted>}
        {log.map((n) => (
          <Pressable key={n.id} onPress={() => openEntry(n)}>
            <Card style={n.read ? s.read : s.unread}>
              <View style={s.row}>
                <Chip label={n.title} tone={n.read ? 'default' : 'accent'} />
                <Muted>{new Date(n.at).toLocaleString()}</Muted>
              </View>
              <Text style={s.body}>{n.body}</Text>
              <Muted>{n.read ? 'Read ✓ • ' : 'Unread • '}opens {n.route}</Muted>
            </Card>
          </Pressable>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  t: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 15 },
  body: { color: Theme.colors.text, marginTop: 8, lineHeight: 20 },
  enable: { backgroundColor: Theme.colors.primary, borderWidth: 2, borderColor: Theme.colors.goldBorder, padding: 15, borderRadius: Theme.radius.sm, alignItems: 'center', marginVertical: 8, minHeight: Theme.touch.min, justifyContent: 'center' },
  enableT: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold, fontSize: 16 },
  test: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8, minHeight: Theme.touch.min, justifyContent: 'center' },
  testT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold, fontSize: 13 },
  unread: { borderColor: Theme.colors.accent },
  read: { opacity: 0.75 },
});

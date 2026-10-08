// Student profile — all 9 account fields + certificates + role.
// 1 Name • 2 Profile image • 3 Experience level • 4 Learning goals • 5 Current level
// 6 Completed modules • 7 Current projects • 8 Certificates • 9 Enrollment status
import { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, TextInput, Image } from 'react-native';
import { Theme } from '../../src/theme';
import { useAuth } from '../../src/store/store';
import { useProgress } from '../../src/store/store';
import { xpBreakdown, achievementsFor } from '../../src/lib/gamification';
import { ACHIEVEMENTS } from '../../src/data/gamification';
import { overallProgress } from '../../src/lib/progress';
import { certificateId, verifyUrl } from '../../src/lib/misc';
import { MODULES, LESSONS } from '../../src/data/curriculum';
import { ROLE_COPY } from '../../src/lib/roles';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, ProgressBar, LinkButton, Grid, Divider, PlatformNote } from '../../src/components/ui';

const GOAL_PRESETS = ['Build my first website', 'Ship a mobile app', 'Automate my business', 'Learn AI agents', 'Launch a SaaS', 'Freelance clients'];
const LEVELS_1_10 = Array.from({ length: 10 }, (_, i) => i + 1);

export default function Profile() {
  const { auth, signOut, setName, setAvatar, setExperience, setGoals, setCurrentLevel, setEnrollment } = useAuth();
  const { completed, bookmarks } = useProgress();
  const { total, level } = xpBreakdown(completed);
  const pct = overallProgress(completed);
  const mine = achievementsFor(completed, 0);
  const [goalDraft, setGoalDraft] = useState('');

  const completedModules = useMemo(
    () =>
      MODULES.filter((m) => {
        const ls = LESSONS.filter((l) => l.moduleId === m.id);
        return ls.length > 0 && ls.every((l) => completed.includes(l.id));
      }),
    [completed],
  );
  const cert = auth.email ? certificateId(auth.email, 'AI-MasterPlan') : null;

  const toggleGoal = (g: string) => {
    const has = auth.learningGoals.includes(g);
    setGoals(has ? auth.learningGoals.filter((x) => x !== g) : [...auth.learningGoals, g]);
  };
  const addGoal = () => {
    const g = goalDraft.trim();
    if (!g) return;
    if (!auth.learningGoals.includes(g)) setGoals([...auth.learningGoals, g]);
    setGoalDraft('');
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>
          STUDENT PROFILE • {ROLE_COPY[auth.role].badge} • LEVEL {level} • {total} XP
        </Eyebrow>
        <H1>{auth.name || 'Student profile'}</H1>
        <Body>{auth.email ?? 'Not signed in — create an account to save progress across devices.'}</Body>

        {/* 1+2 — name + image */}
        <H2>1–2 • Identity</H2>
        <Card>
          <View style={s.idRow}>
            {auth.avatarUrl ? (
              <Image source={{ uri: auth.avatarUrl }} style={s.avatar} />
            ) : (
              <View style={s.avatarFallback}>
                <Text style={s.avatarLetter}>{(auth.name || auth.email || 'S').slice(0, 1).toUpperCase()}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Muted>DISPLAY NAME</Muted>
              <TextInput value={auth.name} onChangeText={setName} placeholder="e.g. Maya the Builder" placeholderTextColor="#64748b" style={s.input} maxLength={60} />
            </View>
          </View>
          <Muted>PROFILE IMAGE (URL)</Muted>
          <TextInput
            value={auth.avatarUrl ?? ''}
            onChangeText={(t) => setAvatar(t.trim() ? t.trim() : null)}
            placeholder="https://…/me.png (optional)"
            placeholderTextColor="#64748b"
            autoCapitalize="none"
            style={s.input}
          />
          <PlatformNote ios="On iPhone, Google/Apple sign-in fills name + photo automatically." android="On Android, Google sign-in fills name + photo automatically." />
        </Card>

        {/* 3+4 — experience + goals */}
        <H2>3–4 • Experience + goals</H2>
        <Card>
          <Muted>EXPERIENCE LEVEL</Muted>
          <View style={s.seg}>
            {(['none', 'beginner', 'intermediate'] as const).map((lv) => (
              <Pressable key={lv} onPress={() => setExperience(lv)} style={[s.segBtn, auth.experienceLevel === lv && s.segOn]}>
                <Text style={[s.segT, auth.experienceLevel === lv && s.segTOn]}>{lv === 'none' ? 'Total beginner' : lv}</Text>
              </Pressable>
            ))}
          </View>
          <Muted>LEARNING GOALS ({auth.learningGoals.length}/8)</Muted>
          <View style={s.goals}>
            {GOAL_PRESETS.map((g) => {
              const on = auth.learningGoals.includes(g);
              return (
                <Pressable key={g} onPress={() => toggleGoal(g)} style={[s.goal, on && s.goalOn]}>
                  <Text style={[s.goalT, on && s.goalTOn]}>{on ? '✓ ' : '+ '}{g}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={s.goalAdd}>
            <TextInput value={goalDraft} onChangeText={setGoalDraft} placeholder="Custom goal…" placeholderTextColor="#64748b" style={[s.input, { flex: 1 }]} maxLength={60} onSubmitEditing={addGoal} />
            <Pressable onPress={addGoal} style={s.addBtn}>
              <Text style={s.addBtnT}>Add</Text>
            </Pressable>
          </View>
          {auth.learningGoals.filter((g) => !GOAL_PRESETS.includes(g)).map((g) => (
            <Pressable key={g} onPress={() => toggleGoal(g)} style={[s.goal, s.goalOn]}>
              <Text style={s.goalTOn}>✓ {g} (tap to remove)</Text>
            </Pressable>
          ))}
        </Card>

        {/* 5+6+9 — level, modules, enrollment */}
        <H2>5–6–9 • Level, modules, enrollment</H2>
        <Card>
          <Muted>CURRENT LEVEL (1–10)</Muted>
          <View style={s.seg}>
            {LEVELS_1_10.map((n) => (
              <Pressable key={n} onPress={() => setCurrentLevel(n)} style={[s.lvBtn, auth.currentLevel === n && s.segOn]}>
                <Text style={[s.segT, auth.currentLevel === n && s.segTOn]}>{n}</Text>
              </Pressable>
            ))}
          </View>
          <ProgressBar pct={pct} />
          <Muted>
            {completed.length}/{LESSONS.length} lessons • {completedModules.length}/{MODULES.length} modules complete • {bookmarks.length} bookmarked
          </Muted>
          <Muted>COMPLETED MODULES: {completedModules.length ? completedModules.map((m) => m.id).join(', ') : 'none yet — finish every lesson in a module'}</Muted>
          <Divider />
          <Muted>ENROLLMENT STATUS</Muted>
          <View style={s.seg}>
            {(['pending', 'active', 'completed', 'suspended'] as const).map((st) => (
              <Pressable key={st} onPress={() => setEnrollment(st)} style={[s.segBtn, auth.enrollmentStatus === st && s.segOn]}>
                <Text style={[s.segT, auth.enrollmentStatus === st && s.segTOn]}>{st}</Text>
              </Pressable>
            ))}
          </View>
          <Muted>
            {auth.enrollmentStatus === 'pending' && 'Pending: verify your email to activate.'}
            {auth.enrollmentStatus === 'active' && 'Active: full curriculum unlocked.'}
            {auth.enrollmentStatus === 'completed' && 'Completed: Independent Builder!'}
            {auth.enrollmentStatus === 'suspended' && 'Suspended: contact support.'}
          </Muted>
          <LinkButton href="/progress" title="Open full progress dashboard" />
        </Card>

        {/* 7 — current projects */}
        <H2>7 • Current projects</H2>
        <Card>
          <Body>Continue in the workspace — stages persist per project.</Body>
          <LinkButton href="/project/P01" title="P01 workspace →" />
          <LinkButton href="/(tabs)/projects" title="All 10 project workspaces" />
          <LinkButton href="/planner" title="Plan your own (P10-style)" />
        </Card>

        {/* 8 — certificates */}
        <H2>8 • Certificates</H2>
        <Card>
          {cert ? (
            <>
              <Chip label={pct === 100 ? 'ELIGIBLE ✓' : `${pct}% — KEEP BUILDING`} tone={pct === 100 ? 'success' : 'warning'} />
              <Body>ID: {cert}</Body>
              <Muted>Verify: {verifyUrl(cert)}</Muted>
            </>
          ) : (
            <Muted>Sign in to issue certificates.</Muted>
          )}
          <LinkButton href="/certificates" title="Open certificates" />
          <LinkButton href="/achievements" title={`Achievements ${mine.length}/${ACHIEVEMENTS.length}`} />
        </Card>

        <H2>Account</H2>
        <Grid>
          <Card>
            <Muted>SIGNED IN AS</Muted>
            <Body>{auth.email ?? '—'}</Body>
            <Muted>
              {auth.provider === 'google' && 'via Google (email verified ✓)'}
              {auth.provider === 'apple' && 'via Apple (email verified ✓)'}
              {auth.provider === 'password' && (auth.emailVerified ? 'Email verified ✓' : 'Email NOT verified — visit Verify screen.')}
              {!auth.provider && 'Not signed in.'}
            </Muted>
            {!auth.emailVerified && auth.provider === 'password' && auth.email && <LinkButton href="/(auth)/verify" title="Verify email now →" />}
          </Card>
          <Card>
            <Muted>ROLE: {ROLE_COPY[auth.role].title.toUpperCase()}</Muted>
            <Body>{ROLE_COPY[auth.role].blurb}</Body>
            <LinkButton href="/settings" title="Change role (demo) in Settings" />
          </Card>
        </Grid>
        <LinkButton href="/settings" title="Open settings (reminders, speed, offline)" />
        <LinkButton href="/notifications" title="Notifications & reminders" />
        <LinkButton href="/admin" title="Author / Admin CMS (role-gated)" />
        <Pressable onPress={signOut} style={s.out}>
          <Text style={s.outT}>Sign out (stays logged out)</Text>
        </Pressable>
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  idRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 0, backgroundColor: Theme.colors.surface },
  avatarFallback: { width: 64, height: 64, borderRadius: 0, backgroundColor: Theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.black, fontSize: 28 },
  input: { backgroundColor: Theme.colors.surface, color: Theme.colors.text, fontFamily: Theme.fonts.regular, borderRadius: Theme.radius.md, padding: 12, marginVertical: 6, borderWidth: 1, borderColor: Theme.colors.border, minHeight: Theme.touch.min },
  seg: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  segBtn: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, paddingHorizontal: 12, paddingVertical: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  segOn: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.goldBorder },
  segT: { color: Theme.colors.muted, fontFamily: Theme.fonts.bold, fontSize: 13 },
  segTOn: { color: Theme.colors.onPrimary },
  lvBtn: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  goals: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  goal: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  goalOn: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.goldBorder },
  goalT: { color: Theme.colors.muted, fontFamily: Theme.fonts.bold, fontSize: 12 },
  goalTOn: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold, fontSize: 12 },
  goalAdd: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  addBtn: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, paddingHorizontal: 16, minHeight: Theme.touch.min, justifyContent: 'center' },
  addBtnT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
  out: { backgroundColor: Theme.colors.danger, padding: 14, borderRadius: Theme.radius.md, marginVertical: 16, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  outT: { color: Theme.colors.text, fontFamily: Theme.fonts.bold },
});

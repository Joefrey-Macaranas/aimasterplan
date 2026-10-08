// Email verification + password reset confirmation (6-digit demo codes).
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Theme } from '../../src/theme';
import { isValidEmail, passwordIssues } from '../../src/lib/auth';
import { useAuth } from '../../src/store/store';
import { Screen, H1, Body, Muted, Eyebrow, Card, Segmented } from '../../src/components/ui';

const TABS = ['Verify email', 'Reset password'] as const;

export default function Verify() {
  const { auth, verifyEmail, resendVerification, requestRecovery, confirmRecovery } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Verify email');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [shown, setShown] = useState<string | null>(null);

  async function doVerify() {
    setErr('');
    setMsg('');
    const r = await verifyEmail(code);
    if (!r.ok) {
      setErr(r.error ?? 'Verification failed.');
      return;
    }
    setMsg('✓ Email verified — enrollment active. Welcome in!');
    setTimeout(() => router.replace('/(tabs)/home'), 800);
  }

  async function doRequest() {
    setErr('');
    setMsg('');
    const target = email.trim() || auth.email || '';
    if (!isValidEmail(target)) {
      setErr('Enter the account email first.');
      return;
    }
    const r = await requestRecovery(target);
    if (!r.ok) {
      setErr(r.error ?? 'Could not create code.');
      return;
    }
    setShown(r.recoveryCode ?? null);
    setMsg('✓ Code generated (demo shows it below). Enter it with a new password.');
  }

  async function doReset() {
    setErr('');
    setMsg('');
    const target = email.trim() || auth.email || '';
    if (!isValidEmail(target)) {
      setErr('Enter the account email first.');
      return;
    }
    const issues = passwordIssues(pw);
    if (issues.length) {
      setErr(issues[0]);
      return;
    }
    const r = await confirmRecovery(target, code, pw);
    if (!r.ok) {
      setErr(r.error ?? 'Reset failed.');
      return;
    }
    setMsg('✓ Password updated — sign in with the new password.');
    setTimeout(() => router.replace('/(auth)/login'), 800);
  }

  return (
    <Screen>
      <Eyebrow>VERIFY • {auth.email ?? 'NO ACCOUNT YET'} {auth.emailVerified ? '• VERIFIED ✓' : '• UNVERIFIED'}</Eyebrow>
      <H1>{tab === 'Verify email' ? 'Verify your email' : 'Reset password'}</H1>
      <Body>
        {tab === 'Verify email'
          ? 'We sent a 6-digit code at signup. Demo shows it on the signup screen and here — no email backend in MVP.'
          : 'Step 1: generate a code. Step 2: enter code + new password.'}
      </Body>
      <Segmented options={TABS} value={tab} onChange={setTab} />

      {tab === 'Verify email' ? (
        <Card>
          <Muted>ACCOUNT: {auth.email ?? '(signed out — sign up first)'}</Muted>
          <Text style={s.label}>6-digit code</Text>
          <TextInput value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="123456" placeholderTextColor="#64748b" style={s.i} maxLength={6} />
          {!!err && <Text style={s.e}>{err}</Text>}
          {!!msg && <Text style={s.ok}>{msg}</Text>}
          <Pressable onPress={doVerify} style={s.b}>
            <Text style={s.bt}>Verify email</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              const c = resendVerification();
              setShown(null);
              setMsg(c ? `Demo code re-shown: ${c}` : 'Sign up first.');
            }}
            style={s.ghost}
          >
            <Text style={s.ghostT}>Resend code</Text>
          </Pressable>
        </Card>
      ) : (
        <Card>
          <Text style={s.label}>Account email</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder={auth.email ?? 'you@example.com'} placeholderTextColor="#64748b" style={s.i} />
          <Pressable onPress={doRequest} style={s.ghost}>
            <Text style={s.ghostT}>1 — Generate recovery code</Text>
          </Pressable>
          <Text style={s.label}>Code + new password</Text>
          <TextInput value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="6-digit code" placeholderTextColor="#64748b" style={s.i} maxLength={6} />
          <TextInput value={pw} onChangeText={setPw} secureTextEntry placeholder="New password (8+ chars, A-Z, 0-9)" placeholderTextColor="#64748b" style={s.i} />
          {!!err && <Text style={s.e}>{err}</Text>}
          {!!msg && <Text style={s.ok}>{msg}</Text>}
          {shown && <Text style={s.code}>Demo recovery code: {shown}</Text>}
          <Pressable onPress={doReset} style={s.b}>
            <Text style={s.bt}>2 — Set new password</Text>
          </Pressable>
        </Card>
      )}
      <View style={{ height: 24 }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  label: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, marginTop: 10 },
  i: { backgroundColor: Theme.colors.surface, color: Theme.colors.text, borderRadius: Theme.radius.md, padding: 14, marginVertical: 6, borderWidth: 1, borderColor: Theme.colors.border, fontSize: 17, minHeight: Theme.touch.min, letterSpacing: 2 },
  e: { color: Theme.colors.danger, marginVertical: 6, fontFamily: Theme.fonts.bold },
  ok: { color: Theme.colors.success, marginVertical: 6, fontFamily: Theme.fonts.bold },
  code: { color: Theme.colors.text, fontFamily: Theme.fonts.mono, marginTop: 8 },
  b: { backgroundColor: Theme.colors.primary, borderWidth: 2, borderColor: Theme.colors.goldBorder, padding: 15, borderRadius: Theme.radius.sm, marginTop: 10, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  bt: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold, fontSize: 16 },
  ghost: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.sm, padding: 13, marginTop: 8, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  ghostT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
});

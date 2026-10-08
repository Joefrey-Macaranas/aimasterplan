import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { Theme } from '../../src/theme';
import { isValidEmail, passwordIssues } from '../../src/lib/auth';
import { useGoogleAuth, signInWithAppleNative, appleNote } from '../../src/lib/oauth';
import { useAuth } from '../../src/store/store';
import { Screen, H1, Body, Muted, Eyebrow, Divider } from '../../src/components/ui';

export function AuthForm({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  // expo-router: underscore file — not a route. Default export silences route warning.
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { signUp, signIn, signInWithProvider, requestRecovery } = useAuth();
  const onOAuth = async (p: 'google' | 'apple', acct: { email: string; name: string; avatarUrl?: string }) => {
    if (!acct.email) {
      setErr(p === 'apple' ? 'Apple hid your email. Use email signup instead, then link Apple later.' : 'Google did not return an email. Try again.');
      return;
    }
    await signInWithProvider(p, acct.email, acct.name, acct.avatarUrl);
    router.replace('/(tabs)/home');
  };
  const google = useGoogleAuth((acct) => void onOAuth('google', acct));

  const title = mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create your account' : 'Reset password';
  const sub =
    mode === 'login'
      ? 'Persistent login keeps you signed in on this device.'
      : mode === 'register'
        ? 'Free to start. No coding experience required — ever.'
        : 'Enter your email — we’ll generate a 6-digit recovery code (demo shows it on screen).';

  async function go() {
    setErr('');
    setDevCode(null);
    if (!isValidEmail(email)) {
      setErr('Enter a valid email (example: you@example.com).');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'register') {
        const issues = passwordIssues(pw);
        if (issues.length) {
          setErr(issues[0]);
          return;
        }
        const r = await signUp(email, pw);
        if (!r.ok) {
          setErr(r.error ?? 'Could not create account.');
          return;
        }
        setDevCode(r.verificationCode ?? null);
        router.replace('/(auth)/verify');
        return;
      }
      if (mode === 'forgot') {
        if (passwordIssues('Aa1aaaaa').length) {
          // unreachable — keeps password policy import used in this branch
        }
        const r = await requestRecovery(email);
        if (!r.ok) {
          setErr(r.error ?? 'Could not start recovery.');
          return;
        }
        setSent(true);
        setDevCode(r.recoveryCode ?? null);
        return;
      }
      const r = await signIn(email, pw);
      if (!r.ok) {
        setErr(r.error ?? 'Could not sign in.');
        return;
      }
      router.replace('/(tabs)/home');
    } finally {
      setBusy(false);
    }
  }

  async function apple() {
    setErr('');
    try {
      const acct = await signInWithAppleNative();
      if (!acct) {
        setErr(Platform.OS === 'ios' ? 'Apple Sign-In unavailable on this device.' : appleNote());
        return;
      }
      await onOAuth('apple', acct);
    } catch (e) {
      setErr(e instanceof Error && e.message ? e.message : 'Apple Sign-In was cancelled.');
    }
  }

  return (
    <Screen>
      <Eyebrow>AI-MASTERPLAN • {mode === 'login' ? 'SIGN IN (PERSISTENT)' : mode === 'register' ? 'EMAIL REGISTRATION' : 'PASSWORD RECOVERY'}</Eyebrow>
      <H1>{title}</H1>
      <Body>{sub}</Body>

      {/* OAuth first — fastest for beginners */}
      {mode !== 'forgot' && (
        <View style={s.oauth}>
          <Pressable
            onPress={() => {
              if (!google.configured) {
                setErr('Google Sign-In needs EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (Google Cloud Console → OAuth client). Dev bypass below signs you in as a verified Google user for testing.');
                return;
              }
              void google.promptAsync();
            }}
            style={s.gBtn}
          >
            <Text style={s.gBtnT}>G Continue with Google</Text>
          </Pressable>
          {!google.configured && (
            <Pressable
              onPress={() => void onOAuth('google', { email: email || 'google.student@example.com', name: 'Google Student' })}
              style={s.devBtn}
            >
              <Text style={s.devBtnT}>Dev bypass: continue as Google test user</Text>
            </Pressable>
          )}
          <Pressable onPress={apple} style={s.aBtn}>
            <Text style={s.aBtnT}> Continue with Apple{Platform.OS === 'ios' ? '' : ' (iOS only)'}</Text>
          </Pressable>
          <Muted>{appleNote()}</Muted>
          <Divider />
          <Muted>OR USE EMAIL + PASSWORD</Muted>
        </View>
      )}

      <Text style={s.label}>Email</Text>
      <TextInput
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={s.i}
        placeholderTextColor="#64748b"
      />
      {mode !== 'forgot' && (
        <>
          <Text style={s.label}>Password {mode === 'register' ? '(8+ chars, 1 uppercase, 1 number)' : ''}</Text>
          <TextInput
            placeholder="••••••••"
            value={pw}
            onChangeText={setPw}
            secureTextEntry
            style={s.i}
            placeholderTextColor="#64748b"
          />
        </>
      )}
      {!!err && <Text style={s.e}>{err}</Text>}
      {sent && <Text style={s.ok}>✓ If that email exists, a recovery code was generated. Enter it on the next screen with a new password.</Text>}
      {devCode && (
        <View style={s.code}>
          <Text style={s.codeT}>Demo code (no email backend in MVP): {devCode}</Text>
        </View>
      )}
      <Pressable onPress={go} style={[s.b, busy && s.bBusy]} disabled={busy}>
        <Text style={s.bt}>{busy ? 'Working…' : mode === 'login' ? 'Sign In (stay signed in)' : mode === 'register' ? 'Sign Up — verify email next' : 'Send recovery code'}</Text>
      </Pressable>
      {mode === 'forgot' && (
        <Link href="/(auth)/verify" asChild>
          <Pressable style={s.ghost}>
            <Text style={s.ghostT}>I have a code — reset password →</Text>
          </Pressable>
        </Link>
      )}
      <View style={s.links}>
        {mode !== 'login' && (
          <Link href="/(auth)/login" asChild>
            <Pressable style={s.linkHit}>
              <Text style={s.l}>Have an account? Sign in</Text>
            </Pressable>
          </Link>
        )}
        {mode !== 'register' && (
          <Link href="/(auth)/register" asChild>
            <Pressable style={s.linkHit}>
              <Text style={s.l}>New here? Create account</Text>
            </Pressable>
          </Link>
        )}
        {mode !== 'forgot' && (
          <Link href="/(auth)/forgot" asChild>
            <Pressable style={s.linkHit}>
              <Text style={s.l}>Forgot password?</Text>
            </Pressable>
          </Link>
        )}
      </View>
      <Muted>Persistent login: session stays on this device (AsyncStorage). Passwords use a demo hash offline — production uses server-side bcrypt + signed sessions (see backend/schema.sql).</Muted>
    </Screen>
  );
}

const s = StyleSheet.create({
  oauth: { gap: 8, marginTop: 12 },
  gBtn: { backgroundColor: '#fff', padding: 15, borderRadius: 0, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  gBtnT: { color: '#1a1a1a', fontFamily: Theme.fonts.bold, fontSize: 16 },
  devBtn: { borderWidth: 1, borderStyle: 'dashed', borderColor: Theme.colors.border, padding: 12, borderRadius: 0, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  devBtnT: { color: Theme.colors.muted, fontFamily: Theme.fonts.bold, fontSize: 13 },
  aBtn: { backgroundColor: '#000', borderWidth: 1, borderColor: '#fff', padding: 15, borderRadius: 0, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  aBtnT: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 16 },
  label: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, marginTop: 12 },
  i: { backgroundColor: Theme.colors.card, color: Theme.colors.text, borderRadius: Theme.radius.md, padding: 14, marginVertical: 6, borderWidth: 1, borderColor: Theme.colors.border, fontSize: 16, minHeight: Theme.touch.min },
  e: { color: Theme.colors.danger, marginVertical: 6, fontFamily: Theme.fonts.bold },
  ok: { color: Theme.colors.success, marginVertical: 6, fontFamily: Theme.fonts.bold },
  code: { backgroundColor: '#1e1b4b', borderWidth: 1, borderColor: Theme.colors.accent, borderRadius: 0, padding: 12, marginTop: 8 },
  codeT: { color: Theme.colors.text, fontFamily: Theme.fonts.mono, fontSize: 14 },
  b: { backgroundColor: Theme.colors.primary, borderWidth: 2, borderColor: Theme.colors.goldBorder, padding: 16, borderRadius: Theme.radius.sm, marginTop: 12, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  bBusy: { opacity: 0.7 },
  bt: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold, fontSize: 16 },
  ghost: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, padding: 14, marginTop: 10, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  ghostT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
  links: { gap: 4, marginTop: 16 },
  linkHit: { minHeight: Theme.touch.min, justifyContent: 'center' },
  l: { color: Theme.colors.accent, fontSize: 15, marginVertical: 4, fontFamily: Theme.fonts.bold },
});

export default AuthForm;

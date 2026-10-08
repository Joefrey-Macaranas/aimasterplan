// OAuth providers: Google (expo-auth-session, all platforms) + Apple (iOS native).
// Production wiring:
//  - Google: set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (+ ios/android IDs) from Google Cloud Console.
//    Without IDs the hook returns { available: false } and UI shows setup guidance + dev bypass.
//  - Apple: requires iOS device + Apple Developer Sign in with Apple capability.
//    On Android/web Apple button shows "iOS only" guidance (Apple web flow needs backend).
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WELL_KNOWN = 'https://accounts.google.com/.well-known/openid-configuration';

export interface OAuthAccount { provider: 'google' | 'apple'; email: string; name: string; avatarUrl?: string; idToken?: string; }

export function googleClientIds(): { web?: string; ios?: string; android?: string } {
  return {
    web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || undefined,
    ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined,
    android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || undefined,
  };
}

export function useGoogleAuth(onSuccess: (acct: OAuthAccount) => void) {
  const ids = googleClientIds();
  const configured = Boolean(ids.web || ids.ios || ids.android);
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'aimasterplan' } as never);
  const discovery = AuthSession.useAutoDiscovery(GOOGLE_WELL_KNOWN);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: (ids.web ?? ids.ios ?? ids.android ?? 'unconfigured') as string,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type !== 'success') return;
    const params = response.params as { id_token?: string };
    const idToken = params.id_token;
    if (!idToken) return;
    try {
      const [, payload] = idToken.split('.');
      const json = JSON.parse(
        (globalThis as { Buffer?: typeof Buffer }).Buffer
          ? (globalThis as { Buffer: typeof Buffer }).Buffer.from(payload, 'base64').toString('utf8')
          : atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
      );
      onSuccess({ provider: 'google', email: String(json.email ?? ''), name: String(json.name ?? json.email ?? 'Google student'), avatarUrl: json.picture, idToken });
    } catch {
      // malformed token — ignore, user can retry
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return { configured, request, promptAsync: () => promptAsync() };
}

export async function signInWithAppleNative(): Promise<OAuthAccount | null> {
  const available = await AppleAuthentication.isAvailableAsync().catch(() => false);
  if (!available) return null;
  const cred = await AppleAuthentication.signInAsync({
    requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
  });
  const email = cred.email ?? `${cred.user}@privaterelay.apple.com`;
  const name = [cred.fullName?.givenName, cred.fullName?.familyName].filter(Boolean).join(' ') || 'Apple student';
  return { provider: 'apple', email, name, idToken: cred.identityToken ?? undefined };
}

export function appleNote(): string {
  if (Platform.OS === 'ios') return 'Native Sign in with Apple (requires Apple Developer capability in production builds).';
  return 'Sign in with Apple is iOS-only in this MVP. On Android/web use Google or email — Apple web flow needs a backend Service ID.';
}

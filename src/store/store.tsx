// Store: Auth (PHASE 03) + Progress (PHASE 15) — AsyncStorage persisted, offline-first.
// Auth covers: email/password registration, Google/Apple, persistent login,
// email verification, password recovery, full student profile (9 fields), roles.
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Role, EnrollmentStatus } from '../types/models';
import {
  normalizeEmail, userIdFor, devHash, verificationCodeFor, recoveryCodeFor,
  defaultNameFor, type Provider, type ExperienceLevel,
} from '../lib/auth';

export interface AuthState {
  userId: string | null;
  email: string | null;
  role: Role;
  enrolled: boolean;
  name: string;
  // student profile (9 fields)
  avatarUrl: string | null;
  experienceLevel: ExperienceLevel;
  learningGoals: string[];
  currentLevel: number;
  enrollmentStatus: EnrollmentStatus;
  emailVerified: boolean;
  provider: Provider | null;
  createdAt: string | null;
  // local-only secrets (demo): never sync raw to backend
  passwordHash: string | null;
  recoveryNonce: string | null;
}

const INITIAL: AuthState = {
  userId: null, email: null, role: 'student', enrolled: false, name: '',
  avatarUrl: null, experienceLevel: 'none', learningGoals: [], currentLevel: 1,
  enrollmentStatus: 'pending', emailVerified: false, provider: null, createdAt: null,
  passwordHash: null, recoveryNonce: null,
};

interface AuthApi {
  auth: AuthState;
  loaded: boolean;
  // email/password
  signUp(email: string, password: string): Promise<{ ok: boolean; error?: string; verificationCode?: string }>;
  signIn(email: string, password?: string): Promise<{ ok: boolean; error?: string }>;
  signOut(): Promise<void>;
  // OAuth
  signInWithProvider(p: Exclude<Provider, 'password'>, email: string, name?: string, avatarUrl?: string): Promise<void>;
  // verification + recovery
  expectedVerificationCode(): string | null;
  verifyEmail(code: string): Promise<{ ok: boolean; error?: string }>;
  resendVerification(): string | null;
  requestRecovery(email: string): Promise<{ ok: boolean; error?: string; recoveryCode?: string }>;
  confirmRecovery(email: string, code: string, newPassword: string): Promise<{ ok: boolean; error?: string }>;
  // profile (9 fields)
  setName(n: string): void;
  setAvatar(url: string | null): void;
  setExperience(lv: ExperienceLevel): void;
  setGoals(goals: string[]): void;
  setCurrentLevel(n: number): void;
  setEnrollment(s: EnrollmentStatus): void;
  setRole(r: Role): void;
  // registry (multi-account on device, demo): email -> passwordHash
  hasPasswordAccount(email: string): Promise<boolean>;
}

const AuthCtx = createContext<AuthApi | null>(null);
const PASS_KEY = 'amp-pass-registry';

async function readRegistry(): Promise<Record<string, string>> {
  try {
    const s = await AsyncStorage.getItem(PASS_KEY);
    return s ? (JSON.parse(s) as Record<string, string>) : {};
  } catch { return {}; }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(INITIAL);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('amp-auth').then((s) => {
      if (s) {
        try { setAuth({ ...INITIAL, ...(JSON.parse(s) as AuthState) }); } catch { /* corrupted — stay logged out */ }
      }
      setLoaded(true);
    });
  }, []);
  useEffect(() => {
    if (loaded) AsyncStorage.setItem('amp-auth', JSON.stringify(auth)).catch(() => {});
  }, [auth, loaded]);

  const value = useMemo<AuthApi>(() => ({
    auth, loaded,
    async signUp(email, password) {
      const em = normalizeEmail(email);
      const reg = await readRegistry();
      if (reg[em]) return { ok: false, error: 'That email already has an account — sign in instead.' };
      const hash = devHash(`${em}:${password}`);
      reg[em] = hash;
      await AsyncStorage.setItem(PASS_KEY, JSON.stringify(reg));
      setAuth({
        ...INITIAL, userId: userIdFor(em), email: em, enrolled: true,
        name: defaultNameFor(em), provider: 'password', createdAt: new Date().toISOString(),
        passwordHash: hash, emailVerified: false, enrollmentStatus: 'pending',
      });
      return { ok: true, verificationCode: verificationCodeFor(em) };
    },
    async signIn(email, password) {
      const em = normalizeEmail(email);
      if (password !== undefined) {
        const reg = await readRegistry();
        const want = devHash(`${em}:${password}`);
        if (reg[em] && reg[em] !== want) return { ok: false, error: 'Wrong password. Try again or use “Forgot password”.' };
        if (!reg[em]) {
          // legacy account (pre-password) or first device: adopt password
          reg[em] = want;
          await AsyncStorage.setItem(PASS_KEY, JSON.stringify(reg));
        }
        setAuth((a) => ({
          ...(a.email === em && a.userId ? a : { ...INITIAL, userId: userIdFor(em), createdAt: new Date().toISOString() }),
          email: em, enrolled: true, provider: a.provider ?? 'password',
          name: a.name || defaultNameFor(em), passwordHash: want,
        }));
        return { ok: true };
      }
      // password-less legacy path (kept for backward compat with old UI/tests)
      setAuth((a) => ({
        ...(a.email === em && a.userId ? a : { ...INITIAL, userId: userIdFor(em), createdAt: new Date().toISOString() }),
        email: em, enrolled: true, provider: a.provider ?? 'password', name: a.name || defaultNameFor(em),
      }));
      return { ok: true };
    },
    async signInWithProvider(p, email, name, avatarUrl) {
      const em = normalizeEmail(email);
      setAuth((a) => ({
        ...INITIAL,
        userId: userIdFor(em), email: em, enrolled: true, provider: p,
        name: name?.trim() ? name.trim().slice(0, 60) : defaultNameFor(em),
        avatarUrl: avatarUrl ?? a.avatarUrl ?? null,
        emailVerified: true, // Google/Apple emails arrive verified
        enrollmentStatus: 'active', createdAt: a.createdAt ?? new Date().toISOString(),
        passwordHash: null, currentLevel: a.currentLevel > 1 ? a.currentLevel : 1,
      }));
    },
    async signOut() { setAuth(INITIAL); },
    expectedVerificationCode() { return auth.email ? verificationCodeFor(auth.email) : null; },
    async verifyEmail(code) {
      if (!auth.email) return { ok: false, error: 'Sign up first.' };
      if (code.trim() !== verificationCodeFor(auth.email)) return { ok: false, error: 'That code does not match. Check the 6-digit code.' };
      setAuth((a) => ({ ...a, emailVerified: true, enrollmentStatus: 'active' }));
      return { ok: true };
    },
    resendVerification() { return auth.email ? verificationCodeFor(auth.email) : null; },
    async requestRecovery(email) {
      const em = normalizeEmail(email);
      const reg = await readRegistry();
      const nonce = new Date().toISOString();
      if (!reg[em] && auth.email !== em) {
        // don't leak which emails exist — still return a code shape in UI copy, but no-op
        return { ok: true, recoveryCode: recoveryCodeFor(em, nonce) };
      }
      setAuth((a) => (a.email === em ? { ...a, recoveryNonce: nonce } : a));
      await AsyncStorage.setItem('amp-recovery-' + em, nonce);
      return { ok: true, recoveryCode: recoveryCodeFor(em, nonce) };
    },
    async confirmRecovery(email, code, newPassword) {
      const em = normalizeEmail(email);
      const stored = await AsyncStorage.getItem('amp-recovery-' + em);
      const nonce = stored ?? auth.recoveryNonce;
      if (!nonce) return { ok: false, error: 'Request a recovery code first.' };
      if (code.trim() !== recoveryCodeFor(em, nonce)) return { ok: false, error: 'Wrong code. Request a fresh one and try again.' };
      const reg = await readRegistry();
      reg[em] = devHash(`${em}:${newPassword}`);
      await AsyncStorage.setItem(PASS_KEY, JSON.stringify(reg));
      await AsyncStorage.removeItem('amp-recovery-' + em);
      setAuth((a) => (a.email === em ? { ...a, passwordHash: reg[em], recoveryNonce: null } : a));
      return { ok: true };
    },
    setName(n) { setAuth((a) => ({ ...a, name: n.slice(0, 60) })); },
    setAvatar(url) { setAuth((a) => ({ ...a, avatarUrl: url })); },
    setExperience(lv) { setAuth((a) => ({ ...a, experienceLevel: lv })); },
    setGoals(goals) { setAuth((a) => ({ ...a, learningGoals: goals.slice(0, 8).map((g) => g.slice(0, 60)) })); },
    setCurrentLevel(n) { setAuth((a) => ({ ...a, currentLevel: Math.max(1, Math.min(10, Math.round(n) || 1)) })); },
    setEnrollment(s) { setAuth((a) => ({ ...a, enrollmentStatus: s, enrolled: s === 'active' || s === 'completed' })); },
    setRole(r) { setAuth((a) => ({ ...a, role: r })); },
    async hasPasswordAccount(email) { const reg = await readRegistry(); return Boolean(reg[normalizeEmail(email)]); },
  }), [auth, loaded]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
export function useAuth() { const v = useContext(AuthCtx); if (!v) throw new Error('AuthProvider missing'); return v; }

const ProgCtx = createContext<{
  completed: string[]; toggleComplete(id: string): void;
  bookmarks: string[]; toggleBookmark(id: string): void;
  activity: string[]; streak: number;
  projectDone: Record<string, string[]>; toggleProjectStage(pid: string, stage: string): void;
  projectPct(pid: string): number; completedProjects: number; projectStageCount: number;
} | null>(null);
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activity, setActivity] = useState<string[]>([]);
  const [projectDone, setProjectDone] = useState<Record<string, string[]>>({});
  useEffect(() => {
    AsyncStorage.getItem('amp-progress').then((s) => { if (s) { const p = JSON.parse(s); setCompleted(p.completed ?? []); setBookmarks(p.bookmarks ?? []); } });
    AsyncStorage.getItem('amp-activity').then((s) => { if (s) setActivity(JSON.parse(s)); });
    // project workspaces share the amp-proj-<id> keys with the workspace screen
    AsyncStorage.getAllKeys().then((keys) => {
      const mine = keys.filter((k) => k.startsWith('amp-proj-'));
      if (!mine.length) return;
      AsyncStorage.multiGet(mine).then((pairs) => {
        const map: Record<string, string[]> = {};
        for (const [k, v] of pairs) {
          if (!v) continue;
          try { map[k.replace('amp-proj-', '')] = JSON.parse(v); } catch { /* skip */ }
        }
        setProjectDone(map);
      });
    });
  }, []);
  useEffect(() => { AsyncStorage.setItem('amp-progress', JSON.stringify({ completed, bookmarks })); }, [completed, bookmarks]);
  useEffect(() => { AsyncStorage.setItem('amp-activity', JSON.stringify(activity)); }, [activity]);
  const value = useMemo(() => {
    const { currentStreakDayCount } = require('../lib/progress') as typeof import('../lib/progress');
    const { PROJECTS } = require('../data/projects') as typeof import('../data/projects');
    const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p.stages.length]));
    const stageCount = Object.values(projectDone).reduce((n, arr) => n + arr.length, 0);
    return {
      completed,
      toggleComplete: (id: string) => {
        setCompleted((c) => {
          const adding = !c.includes(id);
          if (adding) setActivity((a) => (a.some((d) => d.slice(0, 10) === new Date().toISOString().slice(0, 10)) ? a : [...a, new Date().toISOString()]));
          return adding ? [...c, id] : c.filter((x) => x !== id);
        });
      },
      bookmarks,
      toggleBookmark: (id: string) => setBookmarks((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id])),
      activity,
      streak: currentStreakDayCount(activity),
      projectDone,
      toggleProjectStage: (pid: string, stage: string) => {
        setProjectDone((m) => {
          const cur = m[pid] ?? [];
          const next = { ...m, [pid]: cur.includes(stage) ? cur.filter((x) => x !== stage) : [...cur, stage] };
          AsyncStorage.setItem(`amp-proj-${pid}`, JSON.stringify(next[pid])).catch(() => {});
          return next;
        });
        setActivity((a) => (a.some((d) => d.slice(0, 10) === new Date().toISOString().slice(0, 10)) ? a : [...a, new Date().toISOString()]));
      },
      projectPct: (pid: string) => {
        const total = byId[pid] ?? 0;
        if (!total) return 0;
        return Math.round((Math.min(total, (projectDone[pid] ?? []).length) / total) * 100);
      },
      completedProjects: PROJECTS.filter((p) => (projectDone[p.id] ?? []).length >= p.stages.length && p.stages.length > 0).length,
      projectStageCount: stageCount,
    };
  }, [completed, bookmarks, activity, projectDone]);
  return <ProgCtx.Provider value={value}>{children}</ProgCtx.Provider>;
}
export function useProgress() { const v = useContext(ProgCtx); if (!v) throw new Error('ProgressProvider missing'); return v; }

// Auth repository — Supabase when configured, offline AsyncStorage otherwise.
// Existing store.tsx keeps working untouched (81 tests green). New code paths
// are additive + best-effort: never throw when offline, never block UI.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupabase, isSupabaseConfigured } from './supabase';
import type { WizardAnswers } from '../data/onboarding';
import type { Recommendation } from './onboarding';

export interface OnboardingProfilePayload {
  experience_level: 'none' | 'beginner' | 'intermediate';
  learning_goals: string[];
  current_level: number;
  recommended_level: number;
  recommended_lesson: string;
  focus_project: string;
}

// Pure mapper — quiz answers + recommendation -> profiles row. Tested.
export function onboardingToProfilePayload(
  answers: WizardAnswers,
  rec: Recommendation,
  goalLabel: string,
): OnboardingProfilePayload {
  const experience_level = answers.coded === 'yes' ? 'intermediate' : answers.coded === 'little' ? 'beginner' : 'none';
  const recommended_level = Number(rec.startLevelId.slice(1)) || 1;
  return {
    experience_level,
    learning_goals: [goalLabel].slice(0, 8),
    current_level: Math.max(1, Math.min(10, recommended_level)),
    recommended_level: Math.max(1, Math.min(10, recommended_level)),
    recommended_lesson: rec.startLessonId,
    focus_project: rec.focusProjectId,
  };
}

// Pure mapper — quiz answers -> onboarding_responses row. Tested.
export function onboardingToResponseRow(userId: string, answers: WizardAnswers, rec: Recommendation) {
  return {
    user_id: userId,
    coded_before: answers.coded,
    ai_tools: answers.aiTools,
    goal: answers.goal,
    recommended_level: Number(rec.startLevelId.slice(1)) || 1,
    recommended_lesson: rec.startLessonId,
    focus_project: rec.focusProjectId,
  };
}

export async function saveOnboardingRemote(
  userId: string,
  answers: WizardAnswers,
  rec: Recommendation,
  goalLabel: string,
): Promise<{ ok: boolean; offline: boolean }> {
  const sb = getSupabase();
  if (!sb) {
    // Offline: UI already persisted to AsyncStorage 'amp-onboarding'. Nothing more to do.
    return { ok: true, offline: true };
  }
  try {
    const profile = onboardingToProfilePayload(answers, rec, goalLabel);
    await sb.from('profiles').upsert({ user_id: userId, ...profile });
    await sb.from('onboarding_responses').upsert(onboardingToResponseRow(userId, answers, rec));
    return { ok: true, offline: false };
  } catch {
    return { ok: false, offline: false };
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<{ ok: boolean; offline?: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, offline: true };
  const { error } = await sb.auth.signUp({ email: email.trim().toLowerCase(), password });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function signInWithEmail(email: string, password: string): Promise<{ ok: boolean; offline?: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, offline: true };
  const { error } = await sb.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function signOutRemote(): Promise<void> {
  try {
    await getSupabase()?.auth.signOut();
  } catch { /* offline — local signOut in store already ran */ }
}

// Secure session note: tokens live in Supabase Auth storage. When we add
// expo-secure-store for custom tokens (Phase 5 push), use this key prefix.
export const SECURE_SESSION_KEY = 'amp-secure-session';

export async function readLocalOnboarding(): Promise<Record<string, unknown> | null> {
  try {
    const s = await AsyncStorage.getItem('amp-onboarding');
    return s ? (JSON.parse(s) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export { isSupabaseConfigured };

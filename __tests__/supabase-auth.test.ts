import { isSupabaseConfigured } from '../src/lib/supabase';
import { onboardingToProfilePayload, onboardingToResponseRow, saveOnboardingRemote } from '../src/lib/authRepo';
import { recommend } from '../src/lib/onboarding';

test('supabase unconfigured in CI (no env) — offline mode, never throws', () => {
  expect(isSupabaseConfigured()).toBe(false);
});

test('onboarding maps to profile payload (beginner website)', () => {
  const rec = recommend({ coded: 'never', aiTools: 'never', goal: 'website' });
  const p = onboardingToProfilePayload({ coded: 'never', aiTools: 'never', goal: 'website' }, rec, 'Build my first website');
  expect(p.experience_level).toBe('none');
  expect(p.current_level).toBe(1);
  expect(p.recommended_lesson).toBe('L1M1L1');
  expect(p.focus_project).toBe('P01');
  expect(p.learning_goals).toEqual(['Build my first website']);
});

test('onboarding maps to profile payload (experienced agent fast-track)', () => {
  const rec = recommend({ coded: 'yes', aiTools: 'agent', goal: 'agent' });
  const p = onboardingToProfilePayload({ coded: 'yes', aiTools: 'agent', goal: 'agent' }, rec, 'Learn AI agents');
  expect(p.experience_level).toBe('intermediate');
  expect(p.current_level).toBe(8);
  expect(p.recommended_lesson).toBe('L8M1L1');
  expect(p.focus_project).toBe('P07');
});

test('onboarding response row carries quiz + recommendation', () => {
  const rec = recommend({ coded: 'little', aiTools: 'chat', goal: 'mobile' });
  const row = onboardingToResponseRow('u-test', { coded: 'little', aiTools: 'chat', goal: 'mobile' }, rec);
  expect(row).toMatchObject({ user_id: 'u-test', coded_before: 'little', ai_tools: 'chat', goal: 'mobile', focus_project: 'P08' });
});

test('saveOnboardingRemote offline returns ok+offline (no network)', async () => {
  const rec = recommend({ coded: 'never', aiTools: 'never', goal: 'website' });
  const r = await saveOnboardingRemote('u-test', { coded: 'never', aiTools: 'never', goal: 'website' }, rec, 'Build my first website');
  expect(r).toEqual({ ok: true, offline: true });
});

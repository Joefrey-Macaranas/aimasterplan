import { generatePlan } from '../src/lib/planner';
import { offlineHint, buildPrompt } from '../src/lib/assistant';
import { isValidEmail, passwordIssues, canAccess } from '../src/lib/auth';
import { certificateId, verifyUrl } from '../src/lib/misc';

test('planner covers facebook-leads example', () => {
  const p = generatePlan('I want an AI system that automatically answers Facebook inquiries and saves leads.');
  expect(p.definition.length).toBeGreaterThan(10);
  expect(p.features.join(' ')).toMatch(/lead/i);
  expect(p.architecture.length).toBeGreaterThan(10);
  expect(p.todos.length).toBeGreaterThanOrEqual(5);
});
test('assistant stays on curriculum', () => {
  const h = offlineHint('What should I do next?', { skillLevel: 'beginner', completedIds: [], currentLessonId: 'L1M1L1' });
  expect(h.length).toBeGreaterThan(20);
  const pr = buildPrompt('Explain this simply.', { skillLevel: 'beginner', completedIds: [], currentLessonId: 'L1M1L1' });
  expect(pr).toMatch(/Current lesson/);
});
test('auth + certs', () => {
  expect(isValidEmail('a@b.co')).toBe(true); expect(isValidEmail('bad')).toBe(false);
  expect(passwordIssues('short')).toContain('Use at least 8 characters.');
  expect(canAccess(['author','admin'], 'admin')).toBe(true);
  expect(canAccess(['admin'], 'student')).toBe(false);
  const id = certificateId('u1', 'AI-MasterPlan'); expect(id.startsWith('AMP-')).toBe(true);
  expect(verifyUrl(id)).toMatch(/^https:\/\//);
});

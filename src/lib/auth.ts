// PHASE 03 + PHASE 21 — auth validation, roles, verification, recovery, OAuth helpers.
// Offline-first MVP: local accounts in AsyncStorage (see store). Production: swap
// AuthStore persistence with Supabase Auth / server sessions — same interface.
// Passwords here use a NON-secure dev hash (demo only). Never ship this to prod;
// prod must use bcrypt/scrypt/argon2 server-side + signed httpOnly sessions.
import type { Role, EnrollmentStatus } from '../types/models';

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
export function passwordIssues(password: string): string[] {
  const issues: string[] = [];
  if (password.length < 8) issues.push('Use at least 8 characters.');
  if (!/[A-Z]/.test(password)) issues.push('Add an uppercase letter.');
  if (!/[0-9]/.test(password)) issues.push('Add a number.');
  return issues;
}
export function canAccess(required: Role[], actual: Role): boolean {
  const rank: Record<Role, number> = { student: 0, instructor: 1, author: 2, admin: 3 };
  const need = Math.min(...required.map((r) => rank[r]));
  return rank[actual] >= need;
}
export function sanitizeInput(input: string): string {
  return input.replace(/[<>"'`;]/g, '').slice(0, 2000);
}

// ---- extensions (backward-compatible, tests unaffected) ----
export type Provider = 'password' | 'google' | 'apple';
export type ExperienceLevel = 'none' | 'beginner' | 'intermediate';

export const ROLES: Role[] = ['student', 'instructor', 'author', 'admin'];
export const ROLE_META: Record<Role, { title: string; can: string }> = {
  student: { title: 'Student', can: 'Learn, build projects, earn certificates.' },
  instructor: { title: 'Instructor', can: 'Host Meet & Greet, answer Q&A, review projects.' },
  author: { title: 'Author', can: 'Create/edit lessons, tools, projects (CMS).' },
  admin: { title: 'Admin', can: 'Everything: users, enrollments, moderation, CMS.' },
};

export const ENROLLMENT_STATUSES: EnrollmentStatus[] = ['pending', 'active', 'completed', 'suspended'];

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
export function userIdFor(email: string): string {
  return 'u-' + normalizeEmail(email).replace(/[^a-z0-9]+/g, '-');
}
// Dev-only hash (FNV-1a hex). NOT secure — demo/offline only.
export function devHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `dev-${h.toString(16).padStart(8, '0')}`;
}
export function sixDigit(from: string): string {
  let h = 0;
  for (const c of from) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
  return String(100000 + (h % 900000));
}
export function verificationCodeFor(email: string): string {
  return sixDigit(`verify:${normalizeEmail(email)}`);
}
export function recoveryCodeFor(email: string, nonce: string): string {
  return sixDigit(`recover:${normalizeEmail(email)}:${nonce}`);
}
export function defaultNameFor(email: string, providerName?: string): string {
  if (providerName && providerName.trim()) return providerName.trim().slice(0, 60);
  const base = normalizeEmail(email).split('@')[0] ?? 'student';
  return base.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 60) || 'Student';
}

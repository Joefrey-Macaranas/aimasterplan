import {
  normalizeEmail, userIdFor, devHash, verificationCodeFor, recoveryCodeFor,
  defaultNameFor, ROLES, ROLE_META, ENROLLMENT_STATUSES, canAccess,
} from '../src/lib/auth';
import { ROLE_ORDER, ROLE_COPY, roleAtLeast } from '../src/lib/roles';

test('email normalization + ids are stable', () => {
  expect(normalizeEmail('  Maya@Example.COM ')).toBe('maya@example.com');
  expect(userIdFor('Maya@Example.COM')).toBe(userIdFor('maya@example.com'));
  expect(userIdFor('a@b.co')).toMatch(/^u-/);
});

test('verification + recovery codes are deterministic 6-digit', () => {
  const v1 = verificationCodeFor('a@b.co');
  expect(v1).toMatch(/^\d{6}$/);
  expect(verificationCodeFor('A@B.CO')).toBe(v1);
  const r1 = recoveryCodeFor('a@b.co', 'n1');
  expect(r1).toMatch(/^\d{6}$/);
  expect(recoveryCodeFor('a@b.co', 'n2')).not.toBe(r1);
});

test('dev hash + default names', () => {
  expect(devHash('a')).toBe(devHash('a'));
  expect(devHash('a')).not.toBe(devHash('b'));
  expect(defaultNameFor('maya.lee@example.com')).toMatch(/Maya/);
  expect(defaultNameFor('x@y.co', '  Ana  ')).toBe('Ana');
});

test('roles: 4 ranks, copy, gating', () => {
  expect(ROLES).toEqual(['student', 'instructor', 'author', 'admin']);
  expect(ROLE_ORDER).toEqual(ROLES);
  for (const r of ROLES) expect(ROLE_META[r].title).toBeTruthy();
  for (const r of ROLES) expect(ROLE_COPY[r].title).toBeTruthy();
  expect(ENROLLMENT_STATUSES).toContain('active');
  expect(canAccess(['admin'], 'admin')).toBe(true);
  expect(canAccess(['author', 'admin'], 'author')).toBe(true);
  expect(canAccess(['instructor', 'author', 'admin'], 'student')).toBe(false);
  expect(roleAtLeast('admin', 'student')).toBe(true);
  expect(roleAtLeast('student', 'admin')).toBe(false);
});

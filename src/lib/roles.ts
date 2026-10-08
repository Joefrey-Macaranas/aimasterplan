// Role system: student → instructor → author → admin (ranked, see canAccess).
// Single place for role copy + gating used by Admin CMS, Settings, Profile.
import type { Role } from '../types/models';
import { canAccess } from './auth';

export const ROLE_ORDER: Role[] = ['student', 'instructor', 'author', 'admin'];

export const ROLE_COPY: Record<Role, { title: string; blurb: string; badge: string }> = {
  student: { title: 'Student', blurb: 'Learn guided lessons, build 10 projects, earn certificates.', badge: 'LEARNER' },
  instructor: { title: 'Instructor', blurb: 'Host Meet & Greet, run Q&A, review student projects.', badge: 'TEACHER' },
  author: { title: 'Author', blurb: 'Create and publish levels, lessons, tools, projects (CMS).', badge: 'CREATOR' },
  admin: { title: 'Admin', blurb: 'Manage users, roles, enrollments, moderation, everything.', badge: 'STAFF' },
};

export function roleAtLeast(actual: Role, minimum: Role): boolean {
  return canAccess([minimum], actual);
}

export function staffRoles(role: Role): boolean {
  return role === 'author' || role === 'admin';
}

// PHASE 20 — API contract (auth, CMS, progress, projects, community, meetings, AI)
export interface ApiRoute { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; path: string; auth: boolean; roles?: string[]; }
export const API: ApiRoute[] = [
  // --- authentication & student accounts ---
  { method: 'POST', path: '/auth/signup', auth: false },
  { method: 'POST', path: '/auth/signin', auth: false },
  { method: 'POST', path: '/auth/google', auth: false },
  { method: 'POST', path: '/auth/apple', auth: false },
  { method: 'POST', path: '/auth/verify-email', auth: true },
  { method: 'POST', path: '/auth/resend-verification', auth: true },
  { method: 'POST', path: '/auth/recover', auth: false },
  { method: 'POST', path: '/auth/reset', auth: false },
  { method: 'GET', path: '/auth/me', auth: true },
  { method: 'GET', path: '/profile/me', auth: true },
  { method: 'PUT', path: '/profile/me', auth: true },
  // --- learning ---
  { method: 'GET', path: '/courses', auth: true },
  { method: 'GET', path: '/levels/:courseId', auth: true },
  { method: 'GET', path: '/lessons/:id', auth: true },
  { method: 'POST', path: '/progress/complete', auth: true },
  { method: 'GET', path: '/progress/me', auth: true },
  { method: 'GET', path: '/tools', auth: true },
  { method: 'GET', path: '/projects', auth: true },
  { method: 'POST', path: '/planner/generate', auth: true },
  { method: 'POST', path: '/assistant/ask', auth: true },
  { method: 'GET', path: '/meetings/upcoming', auth: true },
  { method: 'POST', path: '/meetings/:id/rsvp', auth: true },
  { method: 'GET', path: '/community', auth: true },
  { method: 'POST', path: '/community', auth: true },
  { method: 'GET', path: '/certificates/me', auth: true },
  // --- roles: instructor (meetings/Q&A), author (CMS), admin (everything) ---
  { method: 'GET', path: '/instructor/projects', auth: true, roles: ['instructor', 'author', 'admin'] },
  { method: 'POST', path: '/instructor/review', auth: true, roles: ['instructor', 'author', 'admin'] },
  // Admin CMS (author/admin only)
  { method: 'POST', path: '/admin/lessons', auth: true, roles: ['author', 'admin'] },
  { method: 'PUT', path: '/admin/lessons/:id', auth: true, roles: ['author', 'admin'] },
  { method: 'POST', path: '/admin/lessons/reorder', auth: true, roles: ['author', 'admin'] },
  { method: 'POST', path: '/admin/meetings', auth: true, roles: ['author', 'admin'] },
  { method: 'PUT', path: '/admin/users/:id/role', auth: true, roles: ['admin'] },
  { method: 'PUT', path: '/admin/users/:id/enrollment', auth: true, roles: ['admin'] },
];

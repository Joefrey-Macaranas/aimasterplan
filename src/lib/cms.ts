// Author/Instructor CMS engine: content tree ops, lesson validation,
// roster stats, meeting + moderation helpers. Pure + tested.
import type { EnrollmentStatus } from '../types/models';

export type CmsKind = 'course' | 'level' | 'module' | 'lesson';
export interface CmsNode { id: string; kind: CmsKind; parentId: string | null; title: string; status: 'draft' | 'published'; order: number }

export function createNode(nodes: CmsNode[], kind: CmsKind, parentId: string | null, title: string): CmsNode[] {
  const clean = title.trim().slice(0, 80) || `Untitled ${kind}`;
  const siblings = nodes.filter((n) => n.kind === kind && n.parentId === parentId);
  const id = `${kind.slice(0, 1).toUpperCase()}${Date.now().toString(36)}${siblings.length}`;
  return [...nodes, { id, kind, parentId, title: clean, status: 'draft', order: siblings.length }];
}

export function renameNode(nodes: CmsNode[], id: string, title: string): CmsNode[] {
  const clean = title.trim().slice(0, 80);
  if (!clean) return nodes;
  return nodes.map((n) => (n.id === id ? { ...n, title: clean } : n));
}

export function moveNode(nodes: CmsNode[], id: string, dir: -1 | 1): CmsNode[] {
  const node = nodes.find((n) => n.id === id);
  if (!node) return nodes;
  const sibs = nodes.filter((n) => n.kind === node.kind && n.parentId === node.parentId).sort((a, b) => a.order - b.order);
  const i = sibs.findIndex((s) => s.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= sibs.length) return nodes;
  const order = new Map(sibs.map((s, k) => [s.id, k]));
  const [a, b] = [sibs[i], sibs[j]];
  order.set(a.id, j);
  order.set(b.id, i);
  return nodes.map((n) => (order.has(n.id) ? { ...n, order: order.get(n.id)! } : n));
}

export function setStatus(nodes: CmsNode[], id: string, status: 'draft' | 'published'): CmsNode[] {
  return nodes.map((n) => (n.id === id ? { ...n, status } : n));
}

export function deleteNode(nodes: CmsNode[], id: string): CmsNode[] {
  const kill = new Set([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const n of nodes) {
      if (n.parentId && kill.has(n.parentId) && !kill.has(n.id)) {
        kill.add(n.id);
        grew = true;
      }
    }
  }
  return nodes.filter((n) => !kill.has(n.id));
}

export function childrenOf(nodes: CmsNode[], kind: CmsKind, parentId: string | null): CmsNode[] {
  return nodes.filter((n) => n.kind === kind && n.parentId === parentId).sort((a, b) => a.order - b.order);
}

export interface DraftLesson {
  title: string; objective: string; intro: string; videoUrl: string;
  images: string; code: string; commands: string; prompts: string;
  downloads: string; links: string; quizQ: string; quizA: string; exercise: string;
}

export function emptyDraft(): DraftLesson {
  return {
    title: '', objective: '', intro: '', videoUrl: '',
    images: '', code: '', commands: '', prompts: '',
    downloads: '', links: '', quizQ: '', quizA: '', exercise: '',
  };
}

/** All 10 editor blocks must be non-empty to publish. Returns missing labels. */
export function validateDraft(d: DraftLesson): string[] {
  const need: [keyof DraftLesson, string][] = [
    ['title', 'Title'], ['objective', 'Objective'], ['intro', 'Rich-text intro'],
    ['videoUrl', 'Video URL'], ['images', 'Images'], ['code', 'Code'],
    ['commands', 'Terminal commands'], ['prompts', 'Prompts'], ['downloads', 'Downloads'],
    ['links', 'Links'], ['quizQ', 'Quiz question'], ['quizA', 'Quiz answer'], ['exercise', 'Exercise'],
  ];
  return need.filter(([k]) => !d[k].trim()).map(([, label]) => label);
}

export interface RosterStudent {
  id: string; name: string; email: string;
  enrollment: EnrollmentStatus; completedLessons: number; totalLessons: number;
  completedProjects: number; attendance: number;
}

export function progressPct(s: RosterStudent): number {
  if (!s.totalLessons) return 0;
  return Math.round((s.completedLessons / s.totalLessons) * 100);
}

export function rosterStats(students: RosterStudent[]): { total: number; active: number; avgPct: number; atRisk: RosterStudent[] } {
  const total = students.length;
  const active = students.filter((s) => s.enrollment === 'active').length;
  const avgPct = total ? Math.round(students.reduce((n, s) => n + progressPct(s), 0) / total) : 0;
  const atRisk = students.filter((s) => s.enrollment === 'active' && progressPct(s) < 20);
  return { total, active, avgPct, atRisk };
}

export interface ModItem { id: string; author: string; body: string; reports: number; hidden: boolean }

export function moderate(items: ModItem[], id: string, action: 'approve' | 'hide'): ModItem[] {
  return items.map((m) => (m.id === id ? { ...m, hidden: action === 'hide', reports: action === 'approve' ? 0 : m.reports } : m));
}

export function pendingReports(items: ModItem[]): ModItem[] {
  return items.filter((m) => m.reports > 0 && !m.hidden).sort((a, b) => b.reports - a.reports);
}

export function announcementText(title: string, body: string): string {
  return `${title.trim()}\n\n${body.trim()}\n\n— AI-MasterPlan`;
}

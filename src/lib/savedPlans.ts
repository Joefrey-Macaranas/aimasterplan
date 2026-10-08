// Saved planner projects: pure record logic (AsyncStorage wiring lives in the screen).
// Save Project → track todos → update plan on re-brief. Testable without storage.
import type { ProjectPlan } from './planner';

export interface SavedPlan {
  id: string;
  idea: string;
  plan: ProjectPlan;
  todosDone: boolean[];
  createdAt: string;
  updatedAt: string;
}

export function planIdFor(idea: string, at: string): string {
  let h = 0;
  for (const c of `${idea}::${at}`) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
  return `plan-${h.toString(16).padStart(8, '0')}`;
}

export function createSavedPlan(idea: string, plan: ProjectPlan, at = new Date().toISOString()): SavedPlan {
  return { id: planIdFor(idea, at), idea, plan, todosDone: plan.todos.map(() => false), createdAt: at, updatedAt: at };
}

export function togglePlanTodo(rec: SavedPlan, index: number): SavedPlan {
  const todosDone = rec.todosDone.map((d, i) => (i === index ? !d : d));
  return { ...rec, todosDone, updatedAt: new Date().toISOString() };
}

export function planProgress(rec: SavedPlan): number {
  if (!rec.plan.todos.length) return 0;
  const done = rec.todosDone.filter(Boolean).length;
  return Math.round((done / rec.plan.todos.length) * 100);
}

/** Update plan after the student edits the brief: keep overlapping todo ticks. */
export function updatePlanIdea(rec: SavedPlan, newIdea: string, newPlan: ProjectPlan): SavedPlan {
  const todosDone = newPlan.todos.map((_, i) => rec.todosDone[i] ?? false);
  return { ...rec, idea: newIdea, plan: newPlan, todosDone, updatedAt: new Date().toISOString() };
}

export function removePlan(plans: SavedPlan[], id: string): SavedPlan[] {
  return plans.filter((p) => p.id !== id);
}

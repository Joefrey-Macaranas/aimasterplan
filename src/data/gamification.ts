// PHASE 15 — PROGRESS & GAMIFICATION + PHASE 13 meetings seed
import type { Achievement, Meeting, CommunityPost } from '../types/models';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First Lesson', description: 'Complete your first lesson', xp: 50 },
  { id: 'first-prompt', title: 'First Prompt', description: 'Copy and run your first AI prompt', xp: 25 },
  { id: 'first-app', title: 'First App', description: 'Run your first application', xp: 100 },
  { id: 'first-api', title: 'First API', description: 'Connect your first API', xp: 100 },
  { id: 'first-db', title: 'First Database', description: 'Save your first record', xp: 100 },
  { id: 'first-ai', title: 'First AI Integration', description: 'Call an LLM API', xp: 150 },
  { id: 'first-auto', title: 'First Automation', description: 'Ship an automation', xp: 150 },
  { id: 'first-deploy', title: 'First Deployment', description: 'Deploy to production', xp: 200 },
  { id: 'ai-builder', title: 'AI Builder', description: 'Finish Level 6 project', xp: 300 },
  { id: 'independent', title: 'Independent Builder', description: 'Ship your own MVP (L10)', xp: 500 },
];

export const XP_PER_LESSON = 50;
export const XP_PER_PROJECT_STAGE = 30;

export const MEETINGS: Meeting[] = [
  { id: 'meet-weekly', title: 'Weekly Meet & Greet with the Author', startsAt: new Date(Date.now() + 3 * 864e5).toISOString(), meetingUrl: 'https://meet.aimasterplan.app/weekly', description: 'Welcome, Q&A, troubleshooting, showcase, AI tips, roadmap. All enrolled students welcome.' },
];

export const COMMUNITY_SEED: CommunityPost[] = [
  { id: 'c1', channel: 'Introductions', author: 'Maya', body: 'Zero coding experience — excited to build my first site! @Leo want to be study buddies?', createdAt: new Date().toISOString(), likes: 12, kind: 'general', comments: [{ id: 'c1m1', author: 'Leo', body: 'Yes @Maya! Same level — let’s do L1 together.', createdAt: new Date().toISOString() }], reactions: { '♥': 12, '🎉': 4 }, reports: 0 },
  { id: 'c2', channel: 'Beginner Help', author: 'Leo', body: 'Stuck on Node install — "command not found" on Mac? L2M1L1 step 3.', createdAt: new Date().toISOString(), likes: 4, kind: 'help', comments: [], reactions: { '♥': 4 }, reports: 0 },
  { id: 'c3', channel: 'Project Showcase', author: 'Aya', body: 'Shipped my personal website (P01)! Link inside. Thanks @Instructor for the debugging tip!', createdAt: new Date().toISOString(), likes: 21, kind: 'showcase', comments: [{ id: 'c3m1', author: 'Maya', body: 'Congrats @Aya! The responsive layout is clean.', createdAt: new Date().toISOString() }], reactions: { '♥': 21, '🎉': 15 }, reports: 0 },
  { id: 'c4', channel: 'Project Showcase', author: 'Leo', body: 'Milestone: finished Level 1 — 10/10 lessons! On to tools setup. 🎉', createdAt: new Date().toISOString(), likes: 9, kind: 'win', comments: [], reactions: { '🎉': 9, '♥': 3 }, reports: 0 },
  { id: 'c5', channel: 'Vibe Coding', author: 'Sam', body: 'Question: does context mean I must paste EVERY file, or just the one I’m changing? L1M2L1', createdAt: new Date().toISOString(), likes: 6, kind: 'question', comments: [{ id: 'c5m1', author: 'Aya', body: 'Just the file you change + the error, @Sam — lesson says so!', createdAt: new Date().toISOString() }], reactions: { '♥': 6 }, reports: 0 },
];

export const CHANNELS = ['Introductions', 'Beginner Help', 'Vibe Coding', 'AI Automation', 'AI Agents', 'Web Development', 'Mobile Development', 'Project Showcase', 'Weekly Meet Discussions'] as const;

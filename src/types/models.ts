// PHASE 20 — Core database entities as TypeScript models.
// Mirrors backend/schema.sql. Keep in sync.
export type Role = 'student' | 'instructor' | 'author' | 'admin';
export type EnrollmentStatus = 'pending' | 'active' | 'completed' | 'suspended';
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'advanced';

export interface User { id: string; email: string; role: Role; createdAt: string; emailVerified: boolean; }
export interface Profile {
  id: string; userId: string; name: string; avatarUrl?: string;
  experienceLevel: 'none' | 'beginner' | 'intermediate';
  learningGoals: string[]; currentLevel: number;
  enrollmentStatus: EnrollmentStatus;
}
export interface Course { id: string; title: string; description: string; }
export interface Level { id: string; courseId: string; index: number; title: string; summary: string; }
export interface Module { id: string; levelId: string; index: number; title: string; summary: string; }
export interface LessonStep { kind: 'USER_ACTION' | 'AI_PROMPT' | 'TERMINAL_COMMAND' | 'CODE' | 'EXPECTED_RESULT'; label: string; body: string; }
export interface Chapter { time: string; seconds: number; title: string; }
export interface Lesson {
  id: string; moduleId: string; index: number;
  title: string; objective: string; expectedOutcome: string;
  difficulty: Difficulty; minutes: number;
  intro: string; concept: string;
  videoUrl: string; chapters: Chapter[]; transcript: string;
  steps: LessonStep[];
  promptsUsed: string[]; commandsUsed: string[]; codeUsed: string[];
  toolsRequired: string[]; resources: { name: string; url: string }[];
  commonErrors: { error: string; fix: string }[];
  troubleshooting: string[];
  knowledgeCheck: { q: string; options: string[]; answer: number }[];
  exercise: string; checklist: string[];
}
export interface LessonProgress { userId: string; lessonId: string; completed: boolean; playbackSeconds: number; bookmarked: boolean; updatedAt: string; }
export interface Tool {
  id: string; name: string; icon: string; category: string; what: string; why: string;
  free: 'free' | 'freemium' | 'paid'; install: string; setupSteps: string[]; setupUrl: string; website: string; relatedLessons: string[];
}
export interface GuidedProject {
  id: string; title: string; level: number; requirements: string[];
  architecture: string; stack: string[]; setup: string[]; stages: string[]; prompts: string[];
  testing: string[]; debugging: string[]; deployment: string[]; checklist: string[];
}
export interface Achievement { id: string; title: string; description: string; xp: number; }
export interface StudentAchievement { userId: string; achievementId: string; awardedAt: string; }
export interface Meeting { id: string; title: string; startsAt: string; meetingUrl: string; description: string; recordingUrl?: string; }
export type PostKind = 'question' | 'showcase' | 'win' | 'help' | 'general';
export interface PostComment { id: string; author: string; body: string; createdAt: string; }
export interface CommunityPost {
  id: string; channel: string; author: string; body: string; createdAt: string; likes: number;
  kind: PostKind; comments: PostComment[]; reactions: Record<string, number>; reports: number;
}
export interface Certificate { id: string; userId: string; programName: string; completionDate: string; verifyUrl: string; }
export interface NotificationItem { id: string; userId: string; kind: string; title: string; body: string; createdAt: string; read: boolean; }

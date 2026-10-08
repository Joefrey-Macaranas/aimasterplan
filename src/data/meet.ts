// Weekly Meet & Greet content: author, 7-part session format, archive, seed questions.
export interface MeetAuthor { name: string; role: string; bio: string; emoji: string }
export interface MeetSegment { title: string; minutes: number; detail: string }
export interface MeetArchiveEntry { id: string; title: string; heldOn: string; recordingUrl: string; notes: string[] }
export interface MeetQuestion { id: string; author: string; body: string; votes: number }

export const MEET_AUTHOR: MeetAuthor = {
  name: 'The AI-MasterPlan Author',
  role: 'Course author & Vibe Coding coach',
  bio: 'Built the Levels 1–10 path for total beginners. Hosts every session, debugs live, celebrates every shipped project.',
  emoji: '🎙️',
};

export const MEET_FORMAT: MeetSegment[] = [
  { title: 'Welcome / community updates', minutes: 8, detail: 'New students intro, wins of the week, enrollment shout-outs. Cameras optional, chat welcome.' },
  { title: 'Student Q&A', minutes: 15, detail: 'Top upvoted pre-submitted questions answered first, then live hands. No jargon, slow demos.' },
  { title: 'Project troubleshooting', minutes: 12, detail: 'Top stuck points solved live with screen-share — errors become lessons.' },
  { title: 'Student project showcase', minutes: 10, detail: 'Students demo websites, automations and AI apps. Applaud loudly; links in chat.' },
  { title: 'New AI / Vibe Coding tips', minutes: 5, detail: 'One new prompt pattern or tool trick you can use the same day.' },
  { title: 'Open discussion', minutes: 5, detail: 'Ideas, blockers, study buddies — unmute and talk.' },
  { title: "What's coming next", minutes: 5, detail: 'Next lessons, next projects, next session date. Leave with one clear next step.' },
];

export const MEET_ARCHIVE: MeetArchiveEntry[] = [
  {
    id: 'meet-2026-w40', title: 'Week 40 — First websites go live',
    heldOn: '2026-10-01', recordingUrl: 'https://cdn.aimasterplan.app/recordings/meet-2026-w40.mp4',
    notes: ['P01 showcase: 6 personal sites shipped', 'Top fix: Netlify Drop folder must be the build output', 'Tip: mobile-first CSS with one breakpoint at 768px'],
  },
  {
    id: 'meet-2026-w39', title: 'Week 39 — Terminal without fear',
    heldOn: '2026-09-24', recordingUrl: 'https://cdn.aimasterplan.app/recordings/meet-2026-w39.mp4',
    notes: ['Live: ls/cd/pwd drills + safe practice folder', 'Top fix: "command not found" = reopen terminal, check PATH', 'Tip: keep one terminal per project folder'],
  },
  {
    id: 'meet-2026-w38', title: 'Week 38 — Prompts that build',
    heldOn: '2026-09-17', recordingUrl: 'https://cdn.aimasterplan.app/recordings/meet-2026-w38.mp4',
    notes: ['GOAL + CONTEXT + CONSTRAINTS + EXAMPLE recipe practiced live', 'Top fix: attach the file — context beats clever words', 'Tip: one small loop per prompt, verify before next'],
  },
];

export const MEET_QUESTION_SEED: MeetQuestion[] = [
  { id: 'mq1', author: 'Maya', body: 'L2M1L1: Node installer finished but node --version says nothing — Mac?', votes: 12 },
  { id: 'mq2', author: 'Leo', body: 'L3M2L3: my form succeeds but nothing is saved — where does data go before L4?', votes: 8 },
  { id: 'mq3', author: 'Aya', body: 'Can I skip to P05 automation if my goal is leads, or finish L3 first?', votes: 5 },
];

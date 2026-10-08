# AI-MasterPlan — Zero-to-Hero Vibe Coding Learning Platform (MVP)

Expo (React Native, TypeScript, Expo Router) mobile app for iOS + Android (phone + tablet).
Offline-first MVP: AsyncStorage auth/progress, full Levels 1–10 seed curriculum, Tools Vault,
10 guided projects, AI Project Planner, context-aware Learning Assistant (offline hints + API hook),
Weekly Meet & Greet, Community, XP/gamification, certificates, Admin CMS overview,
Supabase-compatible Postgres schema in `backend/`.

## Run
```
npm install
npm test            # jest
npm run typecheck   # tsc --noEmit
npx expo start      # scan QR / run on device
```

## MVP coverage (Phase 25)
Auth, onboarding + assessment, home, Levels 1–10 roadmap, modules, lessons,
video walkthroughs, copyable prompts/code/commands, Tools Library, progress,
guided projects, Meet & Greet, notifications, profile, Admin CMS.

Deferred (per spec): complex gamification extras, marketplace, public directory, advanced certs.

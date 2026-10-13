-- Phase 2 — MVP auth add-on (additive, run after backend/schema.sql + supabase/seed-mvp.sql).
-- Stores the onboarding quiz result per user. RLS: users read/write own rows only.
CREATE TABLE IF NOT EXISTS onboarding_responses(
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  coded_before text NOT NULL DEFAULT 'never',
  ai_tools text NOT NULL DEFAULT 'never',
  goal text NOT NULL DEFAULT 'website',
  recommended_level int NOT NULL DEFAULT 1,
  recommended_lesson text NOT NULL DEFAULT 'L1M1L1',
  focus_project text NOT NULL DEFAULT 'P01',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY(user_id)
);
-- profiles.user_id may not exist yet in older DBs (profiles.id is the pk there).
-- MVP mobile writes { user_id, experience_level, learning_goals, current_level }.
-- Keep columns nullable so offline-first local data never breaks inserts.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS recommended_level int DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS recommended_lesson text DEFAULT 'L1M1L1';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS focus_project text DEFAULT 'P01';

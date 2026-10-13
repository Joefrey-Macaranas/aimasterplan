-- Phase 7 — MVP RLS (additive, idempotent). Run after schema.sql + seed-mvp.sql + mvp-auth.sql.
-- Rule enforced: paid VIDEO bytes never public. Lesson metadata stays readable so the
-- roadmap renders; playback URLs are gated in app (videoAccess.ts 401/402) and must be
-- served via signed Mux/Storage tokens in prod (never raw bucket URLs).
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- profiles: owner read/write (service_role bypasses for admin panel)
DROP POLICY IF EXISTS "own profile" ON profiles;
CREATE POLICY "own profile" ON profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "own onboarding" ON onboarding_responses;
CREATE POLICY "own onboarding" ON onboarding_responses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "own progress" ON lesson_progress;
CREATE POLICY "own progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "own attendance" ON meeting_attendance;
CREATE POLICY "own attendance" ON meeting_attendance FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- catalog reads: published content is listable (video bytes still gated separately)
-- No policy needed while RLS stays disabled on levels/modules/lessons/tools/projects/meetings.
-- If you enable RLS there later, add: FOR SELECT USING (true) + keep video_url out of anon selects
-- via a view (lesson_public without video_url) — anon gets metadata, never playback URLs.

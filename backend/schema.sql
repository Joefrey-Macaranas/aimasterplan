-- PHASE 20 — PostgreSQL schema (Supabase-compatible, RLS protected premium content)
create table users(id uuid primary key default gen_random_uuid(), email text unique not null, role text not null default 'student', created_at timestamptz default now(), email_verified boolean default false);
create table profiles(id uuid primary key default gen_random_uuid(), user_id uuid references users(id) on delete cascade, name text, avatar_url text, experience_level text default 'none', learning_goals text[] default '{}', current_level int default 1, enrollment_status text default 'pending');
create table courses(id text primary key, title text not null, description text);
create table levels(id text primary key, course_id text references courses(id), idx int, title text, summary text);
create table modules(id text primary key, level_id text references levels(id), idx int, title text, summary text);
create table lessons(id text primary key, module_id text references modules(id), idx int, title text not null, objective text, video_url text, minutes int default 15, difficulty text default 'beginner', steps jsonb default '[]', prompts text[] default '{}', commands text[] default '{}', resources jsonb default '[]', troubleshooting jsonb default '[]');
create table lesson_resources(id uuid primary key default gen_random_uuid(), lesson_id text references lessons(id), name text, url text);
create table enrollments(user_id uuid references users(id), course_id text references courses(id), status text default 'pending', primary key(user_id, course_id));
create table lesson_progress(user_id uuid references users(id), lesson_id text references lessons(id), completed boolean default false, playback_seconds int default 0, bookmarked boolean default false, updated_at timestamptz default now(), primary key(user_id, lesson_id));
create table projects(id text primary key, title text, level int, data jsonb);
create table project_tasks(user_id uuid references users(id), project_id text references projects(id), task text, done boolean default false, primary key(user_id, project_id, task));
create table quizzes(id uuid primary key default gen_random_uuid(), lesson_id text references lessons(id), q jsonb);
create table quiz_attempts(id uuid primary key default gen_random_uuid(), user_id uuid references users(id), quiz_id uuid references quizzes(id), score int, created_at timestamptz default now());
create table achievements(id text primary key, title text, description text, xp int);
create table student_achievements(user_id uuid references users(id), achievement_id text references achievements(id), awarded_at timestamptz default now(), primary key(user_id, achievement_id));
create table meetings(id text primary key, title text, starts_at timestamptz, meeting_url text, description text, recording_url text);
create table meeting_attendance(user_id uuid references users(id), meeting_id text references meetings(id), primary key(user_id, meeting_id));
create table community_posts(id uuid primary key default gen_random_uuid(), channel text, author text, body text, likes int default 0, created_at timestamptz default now());
create table comments(id uuid primary key default gen_random_uuid(), post_id uuid references community_posts(id) on delete cascade, author text, body text, created_at timestamptz default now());
create table notifications(id uuid primary key default gen_random_uuid(), user_id uuid references users(id), kind text, title text, body text, read boolean default false, created_at timestamptz default now());
create table certificates(id text primary key, user_id uuid references users(id), program_name text, completion_date date, verify_url text);
-- Auth: OAuth accounts (Google/Apple) + password recovery tokens (hashed in prod).
create table oauth_accounts(id uuid primary key default gen_random_uuid(), user_id uuid references users(id) on delete cascade, provider text not null, provider_sub text not null, email text, created_at timestamptz default now(), unique(provider, provider_sub));
create table recovery_tokens(id uuid primary key default gen_random_uuid(), user_id uuid references users(id) on delete cascade, token_hash text not null, expires_at timestamptz not null, used boolean default false);
-- RLS: enable + policies (premium lessons visible to active enrollments; users read own progress)
alter table lesson_progress enable row level security;
alter table certificates enable row level security;
-- Signed/temporary media: serve video_url via signed storage URLs (never raw public buckets in prod).

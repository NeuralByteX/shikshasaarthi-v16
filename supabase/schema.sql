-- ShikshaSaarthi Supabase schema (v2 — real auth-backed accounts)
-- Run this entire file in Supabase Dashboard -> SQL Editor.
--
-- Design: students.id and teachers.id ARE the Supabase Auth user id
-- (auth.users.id) — a real one-to-one link, not a separate fake id.
-- Teachers use a real email address for Supabase Auth.
-- Students use Student/Samagra ID + PIN in the UI. The student-auth Edge
-- Function maps that identifier to an internal Auth identity and returns a
-- real Supabase session. No student email is required or sent.

create extension if not exists "pgcrypto";

-- ⚠️ This version changes the table structure (students/teachers are now
-- linked to real Supabase Auth accounts). If you already ran an earlier
-- version of this schema, drop the old tables first so this can rebuild
-- them cleanly. This deletes any earlier demo/test data — that's expected.
drop table if exists public.teacher_students cascade;
drop table if exists public.teacher_classes cascade;
drop table if exists public.assigned_tasks cascade;
drop table if exists public.sync_queue cascade;
drop table if exists public.learning_progress cascade;
drop table if exists public.practice_results cascade;
drop table if exists public.diagnostic_results cascade;
drop table if exists public.questions cascade;
drop table if exists public.teachers cascade;
drop table if exists public.students cascade;

-- ── Profiles & class enrollment ────────────────────────────────────────

create table if not exists public.teachers (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  employee_id text unique not null,
  school_name text,
  udise_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  samagra_id text unique not null,
  roll_no text,
  class_name text,
  school_name text,
  udise_code text,
  avatar_color text default 'blue',
  preferred_language text default 'en',
  teacher_id uuid references public.teachers(id) on delete set null,
  teacher_name text,
  class_code text,
  xp integer not null default 0,
  streak_days integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.teacher_classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  class_name text not null,
  section text not null,
  class_code text unique not null,
  created_at timestamptz not null default now(),
  unique(teacher_id, class_name, section)
);

create table if not exists public.teacher_students (
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  class_id uuid not null references public.teacher_classes(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  primary key (teacher_id, student_id, class_id)
);

-- ── Content & activity ──────────────────────────────────────────────────

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  question text not null,
  question_hi text,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text,
  explanation_hi text,
  difficulty text default 'medium',
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  score integer not null default 0,
  total_questions integer not null default 0,
  topic_scores jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);

create table if not exists public.practice_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  topic text not null,
  score integer not null default 0,
  total_questions integer not null default 0,
  completed_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  topic text not null,
  mastery integer not null default 0,
  attempts integer not null default 0,
  last_score integer,
  updated_at timestamptz not null default now(),
  unique(student_id, topic)
);

create table if not exists public.assigned_tasks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  assigned_by uuid references public.teachers(id) on delete set null,
  topic text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.sync_queue (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  payload jsonb not null,
  synced boolean not null default false,
  created_at timestamptz not null default now(),
  synced_at timestamptz
);

-- ── Row Level Security ──────────────────────────────────────────────────
-- Real rules, not "allow everything" demo policies:
--   - Nobody unauthenticated can read or write anything.
--   - Signed-in users can read the data needed by the prototype dashboard.
--     A production deployment should further scope teacher reads by school_id
--     and class/teacher assignment; this prototype keeps the policies simple.
--   - A student can only INSERT/UPDATE their OWN profile and activity rows
--     (enforced via auth.uid() = id / student_id), so one student cannot
--     write into another student's record even if they guessed the id.

alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.questions enable row level security;
alter table public.diagnostic_results enable row level security;
alter table public.practice_results enable row level security;
alter table public.learning_progress enable row level security;
alter table public.assigned_tasks enable row level security;
alter table public.teacher_classes enable row level security;
alter table public.teacher_students enable row level security;
alter table public.sync_queue enable row level security;

drop policy if exists "authenticated read students" on public.students;
drop policy if exists "student or assigned teacher reads student" on public.students;
create policy "student or assigned teacher reads student" on public.students
  for select using (
    auth.uid() = id
    or exists (
      select 1 from public.teacher_students ts
      where ts.student_id = students.id and ts.teacher_id = auth.uid()
    )
  );

drop policy if exists "student writes own row" on public.students;
create policy "student writes own row" on public.students
  for insert with check (auth.uid() = id);

drop policy if exists "student updates own row" on public.students;
create policy "student updates own row" on public.students
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "authenticated read teachers" on public.teachers;
create policy "authenticated read teachers" on public.teachers
  for select using (auth.role() = 'authenticated');

drop policy if exists "teacher writes own row" on public.teachers;
create policy "teacher writes own row" on public.teachers
  for insert with check (auth.uid() = id);

drop policy if exists "teacher updates own row" on public.teachers;
create policy "teacher updates own row" on public.teachers
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "authenticated read questions" on public.questions;
create policy "authenticated read questions" on public.questions
  for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated read diagnostic" on public.diagnostic_results;
drop policy if exists "student or assigned teacher reads diagnostic" on public.diagnostic_results;
create policy "student or assigned teacher reads diagnostic" on public.diagnostic_results
  for select using (
    auth.uid() = student_id
    or exists (
      select 1 from public.teacher_students ts
      where ts.student_id = diagnostic_results.student_id and ts.teacher_id = auth.uid()
    )
  );

drop policy if exists "student inserts own diagnostic" on public.diagnostic_results;
create policy "student inserts own diagnostic" on public.diagnostic_results
  for insert with check (auth.uid() = student_id);

drop policy if exists "authenticated read practice" on public.practice_results;
drop policy if exists "student or assigned teacher reads practice" on public.practice_results;
create policy "student or assigned teacher reads practice" on public.practice_results
  for select using (
    auth.uid() = student_id
    or exists (
      select 1 from public.teacher_students ts
      where ts.student_id = practice_results.student_id and ts.teacher_id = auth.uid()
    )
  );

drop policy if exists "student inserts own practice" on public.practice_results;
create policy "student inserts own practice" on public.practice_results
  for insert with check (auth.uid() = student_id);

drop policy if exists "authenticated read progress" on public.learning_progress;
drop policy if exists "student or assigned teacher reads progress" on public.learning_progress;
create policy "student or assigned teacher reads progress" on public.learning_progress
  for select using (
    auth.uid() = student_id
    or exists (
      select 1 from public.teacher_students ts
      where ts.student_id = learning_progress.student_id and ts.teacher_id = auth.uid()
    )
  );

drop policy if exists "student writes own progress" on public.learning_progress;
create policy "student writes own progress" on public.learning_progress
  for insert with check (auth.uid() = student_id);

drop policy if exists "student updates own progress" on public.learning_progress;
create policy "student updates own progress" on public.learning_progress
  for update using (auth.uid() = student_id) with check (auth.uid() = student_id);



drop policy if exists "teachers read own classes" on public.teacher_classes;
create policy "teachers read own classes" on public.teacher_classes
  for select using (auth.uid() = teacher_id);

drop policy if exists "teachers create own classes" on public.teacher_classes;
create policy "teachers create own classes" on public.teacher_classes
  for insert with check (auth.uid() = teacher_id);

drop policy if exists "teachers read own enrollments" on public.teacher_students;
create policy "teachers read own enrollments" on public.teacher_students
  for select using (auth.uid() = teacher_id);

drop policy if exists "students read own enrollment" on public.teacher_students;
create policy "students read own enrollment" on public.teacher_students
  for select using (auth.uid() = student_id);

drop policy if exists "authenticated read tasks" on public.assigned_tasks;
drop policy if exists "student or assigned teacher reads tasks" on public.assigned_tasks;
create policy "student or assigned teacher reads tasks" on public.assigned_tasks
  for select using (
    auth.uid() = student_id or auth.uid() = assigned_by
  );

drop policy if exists "authenticated assigns tasks" on public.assigned_tasks;
create policy "assigned teacher creates tasks" on public.assigned_tasks
  for insert with check (
    auth.uid() = assigned_by
    and exists (
      select 1 from public.teacher_students ts
      where ts.teacher_id = auth.uid() and ts.student_id = assigned_tasks.student_id
    )
  );

drop policy if exists "authenticated read sync" on public.sync_queue;
create policy "student reads own sync" on public.sync_queue
  for select using (auth.uid() = student_id);

drop policy if exists "student writes own sync" on public.sync_queue;
create policy "student writes own sync" on public.sync_queue
  for insert with check (auth.uid() = student_id);

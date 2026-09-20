-- ShikshaSaarthi v15 — run ONCE in Supabase Dashboard -> SQL Editor.
--
-- This is a NON-destructive migration: it does NOT drop any tables or data
-- (unlike schema.sql). It is safe to run on your live database, and safe to
-- re-run.
--
-- What it does:
--   1. Makes sure practice_results exists (remedial practice scores).
--   2. Lets a student mark their own assigned task as completed.
--   3. Turns on Supabase Realtime for the tables the teacher dashboard
--      watches, so a student's remedial result shows up instantly.

-- 1) practice_results (already in schema.sql; this is a no-op if it exists)
create table if not exists public.practice_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  topic text not null,
  score integer not null default 0,
  total_questions integer not null default 0,
  completed_at timestamptz not null default now()
);
alter table public.practice_results enable row level security;

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

create index if not exists practice_results_student_completed_idx
  on public.practice_results (student_id, completed_at desc);

-- 2) A student may flip THEIR OWN task's status (pending -> completed).
drop policy if exists "student completes own task" on public.assigned_tasks;
create policy "student completes own task" on public.assigned_tasks
  for update using (auth.uid() = student_id) with check (auth.uid() = student_id);

-- 3) Realtime for the teacher dashboard. (Realtime still respects the RLS
--    policies above — a teacher only receives events for their own students.)
do $$
declare t text;
begin
  foreach t in array array['practice_results', 'diagnostic_results', 'learning_progress']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

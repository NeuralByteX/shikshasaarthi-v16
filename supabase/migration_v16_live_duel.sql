-- ShikshaSaarthi V16: real two-device student duel
-- Run once in Supabase SQL Editor after V15 migration.

create table if not exists public.duel_rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  created_by uuid not null references public.students(id) on delete cascade,
  opponent_id uuid references public.students(id) on delete set null,
  status text not null default 'waiting' check (status in ('waiting','active','finished')),
  round integer not null default 1,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create table if not exists public.duel_answers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.duel_rooms(id) on delete cascade,
  round integer not null,
  student_id uuid not null references public.students(id) on delete cascade,
  answer text not null,
  correct boolean not null default false,
  points integer not null default 0,
  answered_at timestamptz not null default now(),
  unique(room_id, round, student_id)
);

alter table public.duel_rooms enable row level security;
alter table public.duel_answers enable row level security;

drop policy if exists "duel participants read rooms" on public.duel_rooms;
create policy "duel participants read rooms" on public.duel_rooms
  for select using (auth.uid() = created_by or auth.uid() = opponent_id);

drop policy if exists "students create duel rooms" on public.duel_rooms;
create policy "students create duel rooms" on public.duel_rooms
  for insert with check (auth.uid() = created_by);

drop policy if exists "duel participants update rooms" on public.duel_rooms;
create policy "duel participants update rooms" on public.duel_rooms
  for update using (auth.uid() = created_by or auth.uid() = opponent_id)
  with check (auth.uid() = created_by or auth.uid() = opponent_id);

drop policy if exists "duel participants read answers" on public.duel_answers;
create policy "duel participants read answers" on public.duel_answers
  for select using (
    exists (
      select 1 from public.duel_rooms r
      where r.id = duel_answers.room_id
        and (r.created_by = auth.uid() or r.opponent_id = auth.uid())
    )
  );

drop policy if exists "students submit own duel answers" on public.duel_answers;
create policy "students submit own duel answers" on public.duel_answers
  for insert with check (
    auth.uid() = student_id
    and exists (
      select 1 from public.duel_rooms r
      where r.id = duel_answers.room_id
        and (r.created_by = auth.uid() or r.opponent_id = auth.uid())
    )
  );

create or replace function public.join_duel(p_code text)
returns public.duel_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  room public.duel_rooms;
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'Not authenticated'; end if;

  select * into room from public.duel_rooms
  where code = upper(trim(p_code)) and status = 'waiting'
  for update;

  if not found then raise exception 'Duel code not found or already started'; end if;
  if room.created_by = uid then raise exception 'You cannot join your own duel'; end if;

  update public.duel_rooms
  set opponent_id = uid, status = 'active', started_at = now()
  where id = room.id
  returning * into room;

  return room;
end;
$$;

grant execute on function public.join_duel(text) to authenticated;

-- Realtime: two laptops see room/answer changes immediately.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'duel_rooms'
  ) then
    alter publication supabase_realtime add table public.duel_rooms;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'duel_answers'
  ) then
    alter publication supabase_realtime add table public.duel_answers;
  end if;
end $$;

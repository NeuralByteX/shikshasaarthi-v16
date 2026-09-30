-- V17: persist richer diagnostic evidence for the teacher dashboard.
alter table public.diagnostic_results
  add column if not exists diagnostic_details jsonb not null default '{}'::jsonb;

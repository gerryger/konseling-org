-- Anonymous, content-free retention instrumentation sink (Phase 1 slice 1a).
--
-- Privacy: no column ever holds message text, chat content, email, or IP-derived data.
-- `visitor_id` / `session_id` are opaque random tokens generated client-side and are not
-- linked to any identity. `mood` is constrained to a closed set at the app layer.
--
-- NOTE: this migration is provided for when Supabase infra is provisioned. There is no
-- migration runner wired into the repo yet, and the app's default sink is a safe no-op
-- until NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set. See
-- lib/api/events.ts (defaultSink).

create table if not exists public.retention_events (
  id uuid primary key default gen_random_uuid(),
  event text not null check (event in ('session_start', 'return_visit', 'mood_checkin')),
  visitor_id text not null,
  session_id text not null,
  mood text check (mood in ('senang', 'biasa', 'lelah', 'cemas', 'hancur', 'skipped')),
  created_at timestamptz not null default now()
);

alter table public.retention_events enable row level security;

-- Anonymous clients may INSERT their own events, but may never SELECT them back.
-- Aggregation/reporting is a separate, privileged concern (out of scope for this slice).
create policy "anon can insert retention events"
  on public.retention_events
  for insert
  to anon
  with check (true);

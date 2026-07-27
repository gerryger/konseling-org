-- Anonymous referral attribution sink (Phase 2 slice 2).
--
-- Privacy: no column ever holds message text, chat content, email, phone number, or IP-derived data.
-- `visitor_id` / `session_id` are opaque random tokens generated client-side and are not
-- linked to any identity. `psikolog_id` is a stable public slug for the directory entry.
--
-- NOTE: this migration is provided for when Supabase infra is provisioned. There is no
-- migration runner wired into the repo yet, and the app's default sink is a safe no-op
-- until NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set. See
-- lib/api/referral-events.ts (defaultSink).

create table if not exists public.referral_events (
  id uuid primary key default gen_random_uuid(),
  event text not null check (event = 'referral_click'),
  visitor_id text not null,
  session_id text not null,
  psikolog_id text not null,
  source text not null check (source in ('directory', 'crisis_banner', 'crisis_takeover')),
  created_at timestamptz not null default now()
);

alter table public.referral_events enable row level security;

-- Anonymous clients may INSERT their own events, but may never SELECT them back.
-- Aggregation/reporting is a separate, privileged concern (out of scope for this slice).
create policy "anon can insert referral events"
  on public.referral_events
  for insert
  to anon
  with check (true);

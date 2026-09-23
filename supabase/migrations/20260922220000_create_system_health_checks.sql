create table if not exists public.system_health_checks (
  id uuid primary key default gen_random_uuid(),
  check_name text not null,
  created_at timestamptz not null default now()
);

alter table public.system_health_checks enable row level security;

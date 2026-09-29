-- Local foundation only. Do not apply until the approved Anchor program and
-- server-side reconciliation path are reviewed. Solana remains authoritative.
create table if not exists public.wallet_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wallet_address text not null,
  cluster text not null default 'devnet' check (cluster = 'devnet'),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, wallet_address)
);

create table if not exists public.wallet_nonces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nonce text not null,
  expires_at timestamptz not null,
  used_at timestamptz
);

create table if not exists public.gig_escrows (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete restrict,
  client_id uuid not null references auth.users(id) on delete restrict,
  worker_id uuid references auth.users(id) on delete restrict,
  program_id text not null,
  escrow_pda text not null unique,
  vault_pda text not null unique,
  gig_digest text not null,
  terms_hash text not null,
  amount_lamports numeric(20,0) not null check (amount_lamports > 0),
  fee_bps integer not null check (fee_bps between 0 and 1000),
  chain_state text not null default 'CREATED' check (chain_state in ('CREATED','FUNDED','ASSIGNED','SUBMITTED','REVISION_REQUESTED','DISPUTED','RELEASED','REFUNDED')),
  funding_signature text,
  settlement_signature text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blockchain_operations (
  id uuid primary key default gen_random_uuid(),
  escrow_id uuid references public.gig_escrows(id) on delete cascade,
  operation_type text not null check (operation_type in ('INITIALIZE','FUND','ASSIGN','SUBMIT','REVISION','RELEASE','REFUND','DISPUTE')),
  signature text unique,
  status text not null default 'PENDING' check (status in ('PENDING','CONFIRMED','FAILED')),
  error_code text,
  observed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.escrow_events (
  id uuid primary key default gen_random_uuid(),
  escrow_id uuid not null references public.gig_escrows(id) on delete cascade,
  event_type text not null,
  signature text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (escrow_id, event_type, signature)
);

alter table public.wallet_links enable row level security;
alter table public.wallet_nonces enable row level security;
alter table public.gig_escrows enable row level security;
alter table public.blockchain_operations enable row level security;
alter table public.escrow_events enable row level security;

-- No broad client policies: service-role reconciliation will write these mirrors.

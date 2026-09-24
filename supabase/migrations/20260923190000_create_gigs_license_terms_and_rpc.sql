create schema if not exists extensions;
create extension if not exists pgcrypto
with schema extensions;

create table public.gigs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete restrict,
  assigned_worker_id uuid references public.profiles(id) on delete restrict,
  title text not null,
  description text not null,
  category text not null,
  deliverables text not null,
  budget_atomic bigint not null,
  token_mint text null,
  deadline timestamptz not null,
  revision_allowance integer not null default 1,
  required_skills text[] not null default '{}',
  status text not null default 'DRAFT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gigs_title_length check (char_length(btrim(title)) between 5 and 120),
  constraint gigs_description_length check (char_length(btrim(description)) >= 20),
  constraint gigs_category_length check (char_length(btrim(category)) between 2 and 60),
  constraint gigs_deliverables_length check (char_length(btrim(deliverables)) >= 10),
  constraint gigs_budget_positive check (budget_atomic > 0),
  constraint gigs_revision_allowance check (revision_allowance between 0 and 10),
  constraint gigs_status_allowed check (status in ('DRAFT','TERMS_LOCKED','OPEN','CLAIMED','CANCELLED')),
  constraint gigs_worker_not_client check (assigned_worker_id is null or assigned_worker_id <> client_id),
  constraint gigs_claimed_has_worker check ((status = 'CLAIMED') = (assigned_worker_id is not null))
);

create table public.license_terms (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete cascade,
  version integer not null,
  license_type text not null,
  terms_text text not null,
  terms_hash text null,
  locked_at timestamptz null,
  created_at timestamptz not null default now(),
  unique (gig_id, version),
  constraint license_terms_version_positive check (version > 0),
  constraint license_terms_type_allowed check (license_type in ('NON_EXCLUSIVE','EXCLUSIVE','LIMITED_USE')),
  constraint license_terms_text_length check (char_length(btrim(terms_text)) >= 20),
  constraint license_terms_hash_format check (terms_hash is null or terms_hash ~ '^[0-9a-f]{64}$'),
  constraint license_terms_hash_lock_pair check ((terms_hash is null) = (locked_at is null))
);

create index gigs_client_id_idx on public.gigs(client_id);
create index gigs_assigned_worker_id_idx on public.gigs(assigned_worker_id);
create index gigs_status_idx on public.gigs(status);
create index gigs_created_at_idx on public.gigs(created_at desc);
create index gigs_status_deadline_idx on public.gigs(status, deadline);
create index license_terms_gig_id_idx on public.license_terms(gig_id);

create or replace function public.set_gigs_updated_at()
returns trigger language plpgsql security invoker set search_path = ''
as $$ begin new.updated_at = now(); return new; end $$;
create trigger gigs_updated_at before update on public.gigs for each row execute function public.set_gigs_updated_at();

create or replace function public.prevent_locked_terms_mutation()
returns trigger language plpgsql security invoker set search_path = ''
as $$ begin
  if old.locked_at is not null then raise exception 'Locked terms are immutable'; end if;
  return new;
end $$;
create trigger license_terms_locked_update before update on public.license_terms for each row execute function public.prevent_locked_terms_mutation();
create or replace function public.prevent_locked_terms_delete()
returns trigger language plpgsql security invoker set search_path = ''
as $$ begin
  if old.locked_at is not null then raise exception 'Locked terms are immutable'; end if;
  return old;
end $$;
create trigger license_terms_locked_delete before delete on public.license_terms for each row execute function public.prevent_locked_terms_delete();

alter table public.gigs enable row level security;
alter table public.license_terms enable row level security;
create policy "clients read own gigs" on public.gigs for select to authenticated
  using (
    client_id = (select auth.uid())
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'CLIENT')
  );
create policy "workers read available or assigned gigs" on public.gigs for select to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'WORKER')
    and (status = 'OPEN' or assigned_worker_id = (select auth.uid()))
  );
create policy "clients read own terms" on public.license_terms for select to authenticated
  using (
    exists (
      select 1 from public.gigs g
      join public.profiles p on p.id = (select auth.uid())
      where g.id = gig_id and g.client_id = (select auth.uid()) and p.role = 'CLIENT'
    )
  );
create policy "workers read relevant terms" on public.license_terms for select to authenticated
  using (
    exists (
      select 1 from public.gigs g
      join public.profiles p on p.id = (select auth.uid())
      where g.id = gig_id and p.role = 'WORKER'
        and (g.status = 'OPEN' or g.assigned_worker_id = (select auth.uid()))
    )
  );

create or replace function public.gig_actor_role()
returns text language sql security definer set search_path = ''
as $$ select p.role from public.profiles p where p.id = (select auth.uid()) $$;
revoke all on function public.gig_actor_role() from public, anon;
grant execute on function public.gig_actor_role() to authenticated;

create or replace function public.create_draft_gig_with_terms(
  p_title text, p_description text, p_category text, p_deliverables text,
  p_budget_atomic bigint, p_deadline timestamptz, p_revision_allowance integer,
  p_required_skills text[], p_license_type text, p_terms_text text
) returns uuid language plpgsql security definer set search_path = ''
as $$ declare v_id uuid; v_actor uuid := auth.uid(); begin
  if v_actor is null or public.gig_actor_role() <> 'CLIENT' then raise exception 'Unauthorized'; end if;
  if p_deadline <= now() then raise exception 'INVALID_DEADLINE'; end if;
  insert into public.gigs (client_id,title,description,category,deliverables,budget_atomic,deadline,revision_allowance,required_skills,token_mint)
  values (v_actor,btrim(p_title),btrim(p_description),btrim(p_category),btrim(p_deliverables),p_budget_atomic,p_deadline,p_revision_allowance,coalesce(p_required_skills,'{}'),null) returning id into v_id;
  insert into public.license_terms (gig_id,version,license_type,terms_text) values (v_id,1,p_license_type,btrim(replace(replace(p_terms_text,E'\r\n',E'\n'),E'\r',E'\n')));
  return v_id;
end $$;

create or replace function public.update_draft_gig(
  p_gig_id uuid, p_title text, p_description text, p_category text, p_deliverables text,
  p_budget_atomic bigint, p_deadline timestamptz, p_revision_allowance integer,
  p_required_skills text[], p_license_type text, p_terms_text text
) returns boolean language plpgsql security definer set search_path = ''
as $$ declare v_terms_id uuid; begin
  if auth.uid() is null or public.gig_actor_role() <> 'CLIENT' then raise exception 'Unauthorized'; end if;
  if p_deadline <= now() then raise exception 'INVALID_DEADLINE'; end if;
  update public.gigs set title=btrim(p_title),description=btrim(p_description),category=btrim(p_category),deliverables=btrim(p_deliverables),budget_atomic=p_budget_atomic,deadline=p_deadline,revision_allowance=p_revision_allowance,required_skills=coalesce(p_required_skills,'{}')
    where id=p_gig_id and client_id=auth.uid() and status='DRAFT';
  if not found then raise exception 'Gig not editable'; end if;
  select id into v_terms_id
    from public.license_terms
    where gig_id=p_gig_id and version=1 and locked_at is null
    for update;
  if not found then raise exception 'Terms not editable'; end if;
  update public.license_terms
    set license_type=p_license_type,
        terms_text=btrim(replace(replace(p_terms_text,E'\r\n',E'\n'),E'\r',E'\n'))
    where id=v_terms_id;
  return true;
end $$;

create or replace function public.lock_gig_terms(p_gig_id uuid) returns boolean language plpgsql security definer set search_path = ''
as $$ declare v_g public.gigs%rowtype; v_t public.license_terms%rowtype; v_canonical text; begin
  if auth.uid() is null or public.gig_actor_role() <> 'CLIENT' then raise exception 'Unauthorized'; end if;
  select * into v_g from public.gigs where id=p_gig_id and client_id=auth.uid() for update;
  if not found or v_g.status <> 'DRAFT' then raise exception 'Gig cannot be locked'; end if;
  select * into v_t from public.license_terms where gig_id=p_gig_id and version=1 for update;
  if not found or v_t.locked_at is not null then raise exception 'Terms cannot be locked'; end if;
  v_canonical := 'gig_id=' || p_gig_id::text || E'\n'
    || 'version=' || v_t.version::text || E'\n'
    || 'license_type=' || v_t.license_type || E'\n'
    || 'terms_text=' || btrim(replace(replace(v_t.terms_text,E'\r\n',E'\n'),E'\r',E'\n'));
  update public.license_terms set terms_hash = encode(extensions.digest(v_canonical, 'sha256'),'hex'),locked_at=now() where id=v_t.id;
  update public.gigs set status='TERMS_LOCKED' where id=v_g.id;
  return true;
end $$;

create or replace function public.open_gig(p_gig_id uuid) returns boolean language plpgsql security definer set search_path = ''
as $$ begin
  if auth.uid() is null or public.gig_actor_role() <> 'CLIENT' then raise exception 'Unauthorized'; end if;
  update public.gigs g set status='OPEN' where g.id=p_gig_id and g.client_id=auth.uid() and g.status='TERMS_LOCKED' and g.assigned_worker_id is null and exists (select 1 from public.license_terms t where t.gig_id=g.id and t.version=1 and t.terms_hash is not null and t.locked_at is not null);
  if not found then raise exception 'Gig cannot be opened'; end if; return true;
end $$;

create or replace function public.claim_gig(p_gig_id uuid) returns boolean language plpgsql security definer set search_path = ''
as $$ declare v_status text; v_assigned_worker_id uuid; v_client_id uuid; begin
  if auth.uid() is null or public.gig_actor_role() <> 'WORKER' then raise exception 'Unauthorized'; end if;
  select g.status, g.assigned_worker_id, g.client_id
    into v_status, v_assigned_worker_id, v_client_id
    from public.gigs g
    where g.id = p_gig_id
    for update;
  if not found then raise exception 'Gig unavailable'; end if;
  if v_client_id = auth.uid() then raise exception 'Gig unavailable'; end if;
  if v_assigned_worker_id is not null or v_status = 'CLAIMED' then
raise exception 'GIG_ALREADY_CLAIMED';
end if;
if v_status <> 'OPEN' then
raise exception 'GIG_NOT_AVAILABLE';
end if;
  if not exists (
    select 1 from public.license_terms t
    where t.gig_id = p_gig_id and t.version = 1
      and t.terms_hash is not null and t.locked_at is not null
  ) then
    raise exception 'Gig unavailable';
  end if;
  update public.gigs g set assigned_worker_id=auth.uid(),status='CLAIMED' where g.id=p_gig_id and g.status='OPEN' and g.assigned_worker_id is null and g.client_id <> auth.uid() and exists (select 1 from public.license_terms t where t.gig_id=g.id and t.version=1 and t.terms_hash is not null and t.locked_at is not null);
  if not found then raise exception 'GIG_ALREADY_CLAIMED'; end if;
  return true;
end $$;

create or replace function public.cancel_gig(p_gig_id uuid) returns boolean language plpgsql security definer set search_path = ''
as $$ begin
  if auth.uid() is null or public.gig_actor_role() <> 'CLIENT' then raise exception 'Unauthorized'; end if;
  update public.gigs set status='CANCELLED' where id=p_gig_id and client_id=auth.uid() and status in ('DRAFT','TERMS_LOCKED','OPEN') and assigned_worker_id is null;
  if not found then raise exception 'Gig cannot be cancelled'; end if; return true;
end $$;

revoke all on public.gigs from anon, authenticated;
revoke all on public.license_terms from anon, authenticated;
grant select on public.gigs, public.license_terms to authenticated;
revoke all on function public.gig_actor_role() from public, anon;
grant execute on function public.gig_actor_role() to authenticated;
revoke execute on function public.create_draft_gig_with_terms(text,text,text,text,bigint,timestamptz,integer,text[],text,text) from public, anon;
revoke execute on function public.update_draft_gig(uuid,text,text,text,text,bigint,timestamptz,integer,text[],text,text) from public, anon;
revoke execute on function public.lock_gig_terms(uuid) from public, anon;
revoke execute on function public.open_gig(uuid) from public, anon;
revoke execute on function public.claim_gig(uuid) from public, anon;
revoke execute on function public.cancel_gig(uuid) from public, anon;
grant execute on function public.create_draft_gig_with_terms(text,text,text,text,bigint,timestamptz,integer,text[],text,text) to authenticated;
grant execute on function public.update_draft_gig(uuid,text,text,text,text,bigint,timestamptz,integer,text[],text,text) to authenticated;
grant execute on function public.lock_gig_terms(uuid) to authenticated;
grant execute on function public.open_gig(uuid) to authenticated;
grant execute on function public.claim_gig(uuid) to authenticated;
grant execute on function public.cancel_gig(uuid) to authenticated;

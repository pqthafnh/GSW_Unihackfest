create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('CLIENT', 'WORKER', 'ADMIN')),
  wallet_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (char_length(btrim(display_name)) between 2 and 80)
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create or replace function public.prevent_profile_identity_changes()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.id <> old.id
    or new.role <> old.role
    or new.created_at <> old.created_at
    or new.wallet_address is distinct from old.wallet_address then
    raise exception 'Profile identity fields cannot be changed';
  end if;
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_prevent_identity_changes
before update on public.profiles
for each row execute function public.prevent_profile_identity_changes();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text := upper(btrim(coalesce(new.raw_user_meta_data ->> 'requested_role', '')));
  display_name text := btrim(coalesce(new.raw_user_meta_data ->> 'display_name', ''));
begin
  if display_name = '' or char_length(display_name) not between 2 and 80 then
    raise exception 'A valid display name is required';
  end if;

  if requested_role not in ('CLIENT', 'WORKER') then
    raise exception 'A valid signup role is required';
  end if;

  insert into public.profiles (id, display_name, role)
  values (new.id, display_name, requested_role);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ================================================================
-- FIX-ALL MIGRATION — chạy toàn bộ file này trong Supabase SQL Editor
-- ================================================================

-- 1. Tạo bảng submissions nếu chưa có
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete restrict,
  worker_id uuid not null references public.profiles(id) on delete restrict,
  version integer not null default 1,
  submission_title text not null,
  summary text not null,
  object_path text not null,
  bucket_id text not null default 'deliverables',
  original_file_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  sha256 text not null,
  notes text null,
  status text not null default 'SUBMITTED',
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Thêm các cột còn thiếu (bỏ qua nếu đã tồn tại)
do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='submissions' and column_name='bucket_id') then
    alter table public.submissions add column bucket_id text not null default 'deliverables';
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='submissions' and column_name='sha256') then
    alter table public.submissions add column sha256 text not null default '';
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='submissions' and column_name='original_file_name') then
    alter table public.submissions add column original_file_name text not null default '';
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='submissions' and column_name='mime_type') then
    alter table public.submissions add column mime_type text not null default 'application/octet-stream';
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='submissions' and column_name='size_bytes') then
    alter table public.submissions add column size_bytes bigint not null default 0;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='submissions' and column_name='submission_title') then
    alter table public.submissions add column submission_title text not null default '';
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='submissions' and column_name='notes') then
    alter table public.submissions add column notes text null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='submissions' and column_name='status') then
    alter table public.submissions add column status text not null default 'SUBMITTED';
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='submissions' and column_name='submitted_at') then
    alter table public.submissions add column submitted_at timestamptz not null default now();
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='submissions' and column_name='updated_at') then
    alter table public.submissions add column updated_at timestamptz not null default now();
  end if;
end $$;

-- 3. Bật RLS nếu chưa bật
alter table public.submissions enable row level security;

-- 4. Thêm SETTLED vào gig_status enum nếu chưa có
do $$ begin
  if not exists (
    select 1 from pg_enum
    where enumtypid = 'public.gig_status'::regtype and enumlabel = 'SETTLED'
  ) then
    alter type public.gig_status add value 'SETTLED';
  end if;
end $$;

-- 5. Tạo lại hàm create_submission
create or replace function public.create_submission(
  p_gig_id uuid,
  p_submission_title text,
  p_summary text,
  p_object_path text,
  p_original_file_name text,
  p_mime_type text,
  p_size_bytes bigint,
  p_sha256 text,
  p_notes text default null
)
returns public.submissions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_worker_id uuid := auth.uid();
  v_version integer;
  v_submission public.submissions;
begin
  if v_worker_id is null
     or not exists (
       select 1 from public.profiles p
       where p.id = v_worker_id and p.role = 'WORKER'
     )
  then raise exception 'SUBMISSION_WORKER_REQUIRED'; end if;

  perform pg_advisory_xact_lock(hashtextextended(p_gig_id::text, 0));

  if not exists (
    select 1 from public.gigs g
    where g.id = p_gig_id
      and g.status = 'CLAIMED'
      and g.assigned_worker_id = v_worker_id
  ) then
    raise exception 'SUBMISSION_GIG_NOT_CLAIMABLE';
  end if;

  if p_object_path !~ ('^gigs/' || p_gig_id::text || '/submissions/[0-9a-fA-F-]{36}/[^/]+$') then
    raise exception 'SUBMISSION_OBJECT_PATH_INVALID';
  end if;

  select coalesce(max(s.version) + 1, 1) into v_version
  from public.submissions s where s.gig_id = p_gig_id;

  insert into public.submissions (
    gig_id, worker_id, version, submission_title, summary, object_path,
    bucket_id, original_file_name, mime_type, size_bytes, sha256, notes
  ) values (
    p_gig_id, v_worker_id, v_version, p_submission_title, p_summary, p_object_path,
    'deliverables', p_original_file_name, p_mime_type, p_size_bytes, p_sha256, p_notes
  ) returning * into v_submission;

  return v_submission;
end
$$;

-- 6. RLS policies cho submissions (bỏ qua nếu đã tồn tại)
do $$ begin
  if not exists (select 1 from pg_policies where tablename='submissions' and policyname='worker reads own submissions') then
    create policy "worker reads own submissions" on public.submissions
      for select to authenticated
      using (worker_id = auth.uid());
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='submissions' and policyname='client reads gig submissions') then
    create policy "client reads gig submissions" on public.submissions
      for select to authenticated
      using (exists (
        select 1 from public.gigs g
        where g.id = gig_id and g.client_id = auth.uid()
      ));
  end if;
end $$;

-- 7. Reload PostgREST schema cache
notify pgrst, 'reload schema';

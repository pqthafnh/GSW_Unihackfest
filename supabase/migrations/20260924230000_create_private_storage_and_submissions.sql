create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete restrict,
  worker_id uuid not null references public.profiles(id) on delete restrict,
  version integer not null,
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
  updated_at timestamptz not null default now(),
  unique (gig_id, version),
  constraint submissions_version_positive check (version > 0),
  constraint submissions_title_length check (char_length(btrim(submission_title)) between 3 and 160),
  constraint submissions_summary_length check (char_length(btrim(summary)) between 10 and 5000),
  constraint submissions_object_path_nonempty check (char_length(btrim(object_path)) > 0),
  constraint submissions_bucket_check check (bucket_id = 'deliverables'),
  constraint submissions_filename_nonempty check (char_length(btrim(original_file_name)) > 0),
  constraint submissions_mime_allowed check (mime_type in ('application/pdf','image/png','image/jpeg','image/webp','text/plain','application/zip')),
  constraint submissions_size_allowed check (size_bytes > 0 and size_bytes <= 5242880),
  constraint submissions_hash_format check (sha256 ~ '^[0-9a-f]{64}$'),
  constraint submissions_status_allowed check (status in ('SUBMITTED','REVISION_REQUESTED'))
);
create index submissions_gig_id_idx on public.submissions(gig_id);
create index submissions_worker_id_idx on public.submissions(worker_id);
create index submissions_status_idx on public.submissions(status);
alter table public.submissions enable row level security;

create or replace function public.validate_submission_assignment()
returns trigger language plpgsql security invoker set search_path = ''
as $$ declare g public.gigs%rowtype;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.gig_id::text, 0));
  select * into g from public.gigs where id = new.gig_id;
  if g.id is null or g.status <> 'CLAIMED' or g.assigned_worker_id is distinct from new.worker_id then
    raise exception 'SUBMISSION_ASSIGNMENT_INVALID';
  end if;
  if new.status = 'SUBMITTED' and exists (
    select 1 from public.submissions s where s.gig_id = new.gig_id and s.status = 'SUBMITTED'
  ) then raise exception 'SUBMISSION_REQUIRES_REVISION'; end if;
  if new.version <> coalesce((select max(s.version)+1 from public.submissions s where s.gig_id = new.gig_id), 1) then
    raise exception 'SUBMISSION_VERSION_INVALID'; end if;
  return new;
end $$;
create trigger submissions_validate before insert on public.submissions for each row execute function public.validate_submission_assignment();

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

create or replace function public.request_submission_revision(p_submission_id uuid)
returns public.submissions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_submission public.submissions;
begin
  update public.submissions s
  set status = 'REVISION_REQUESTED', updated_at = now()
  where s.id = p_submission_id
    and s.status = 'SUBMITTED'
    and exists (
      select 1
      from public.gigs g
      join public.profiles p on p.id = auth.uid()
      where g.id = s.gig_id
        and g.client_id = auth.uid()
        and p.role = 'CLIENT'
    )
  returning s.* into v_submission;

  if v_submission.id is null then
    raise exception 'REVISION_REQUEST_INVALID';
  end if;
  return v_submission;
end
$$;

create or replace function public.prevent_submission_mutation()
returns trigger language plpgsql security invoker set search_path = ''
as $$ begin
  if new.gig_id <> old.gig_id or new.worker_id <> old.worker_id or new.version <> old.version
    or new.bucket_id <> old.bucket_id or new.object_path <> old.object_path or new.sha256 <> old.sha256
    or new.size_bytes <> old.size_bytes or new.mime_type <> old.mime_type
    or new.submission_title <> old.submission_title or new.summary <> old.summary
    or new.original_file_name <> old.original_file_name or new.created_at <> old.created_at then
    raise exception 'SUBMISSION_IMMUTABLE_FIELDS'; end if;
  if old.status <> 'SUBMITTED' or new.status <> 'REVISION_REQUESTED' then
    raise exception 'SUBMISSION_STATUS_INVALID'; end if;
  return new;
end $$;
create trigger submissions_immutable before update on public.submissions for each row execute function public.prevent_submission_mutation();

create policy "submission participants read" on public.submissions for select to authenticated using (
  exists (select 1 from public.gigs g join public.profiles p on p.id = auth.uid()
    where g.id = gig_id and p.role = 'CLIENT' and g.client_id = auth.uid())
  or worker_id = auth.uid()
);
revoke all on public.submissions from public, anon;
revoke insert, update, delete on public.submissions from authenticated;
grant select on public.submissions to authenticated;
revoke all on function public.create_submission(uuid, text, text, text, text, text, bigint, text, text) from public, anon;
revoke all on function public.request_submission_revision(uuid) from public, anon;
grant execute on function public.create_submission(uuid, text, text, text, text, text, bigint, text, text) to authenticated;
grant execute on function public.request_submission_revision(uuid) to authenticated;

insert into storage.buckets (id, name, public)
values ('deliverables', 'deliverables', false)
on conflict (id) do update set public = false;
create policy "assigned workers upload deliverables" on storage.objects for insert to authenticated
with check (bucket_id = 'deliverables' and name like 'gigs/%/submissions/%'
  and name ~ '^gigs/[0-9a-fA-F-]{36}/submissions/[0-9a-fA-F-]{36}/[A-Za-z0-9._-]+$'
  and split_part(name, '/', 4) ~ '^[0-9a-fA-F-]{36}$'
  and exists (select 1 from public.gigs g join public.profiles p on p.id = auth.uid()
    where g.id::text = split_part(name, '/', 2) and g.assigned_worker_id = auth.uid()
      and g.status = 'CLAIMED' and p.role = 'WORKER'));
create policy "submission participants read deliverables" on storage.objects for select to authenticated
using (bucket_id = 'deliverables' and exists (
  select 1 from public.submissions s join public.gigs g on g.id = s.gig_id
  where s.object_path = name and (g.client_id = auth.uid() or s.worker_id = auth.uid())
));
revoke update, delete on storage.objects from authenticated;

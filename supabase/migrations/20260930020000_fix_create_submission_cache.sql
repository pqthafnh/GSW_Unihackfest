-- Re-create create_submission function and reload PostgREST schema cache
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

-- Force PostgREST to reload schema cache immediately
notify pgrst, 'reload schema';

-- Keep chat images for 10 days, then remove them from Supabase Storage.
create or replace function public.delete_expired_chat_images()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count bigint;
begin
  delete from storage.objects
  where bucket_id = 'mudmy'
    and (storage.foldername(name))[1] = 'chats'
    and created_at < now() - interval '10 days';

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.delete_expired_chat_images() from public;
grant execute on function public.delete_expired_chat_images() to service_role;
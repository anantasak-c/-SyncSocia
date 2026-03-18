-- 1. Create a public storage bucket for media
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- 2. Allow authenticated users to upload files to 'media' bucket
drop policy if exists "Authenticated users can upload media" on storage.objects;
create policy "Authenticated users can upload media"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'media' );

-- 3. Allow public access to view files in 'media' bucket
drop policy if exists "Public can view media" on storage.objects;
create policy "Public can view media"
on storage.objects for select
to public
using ( bucket_id = 'media' );

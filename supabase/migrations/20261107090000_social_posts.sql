create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null default 'instagram' check (platform in ('instagram', 'facebook')),
  prompt_image text,
  caption text not null,
  temp_storage_path text,
  public_image_url text,
  scheduled_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'publishing', 'published', 'failed')),
  instagram_post_id text,
  facebook_post_id text,
  permalink text,
  created_at timestamptz not null default now()
);

create index if not exists social_posts_user_created_idx on public.social_posts (user_id, created_at desc);
create index if not exists social_posts_scheduled_idx on public.social_posts (scheduled_at) where status = 'scheduled';

alter table public.social_posts enable row level security;

create policy "Users can read their social posts" on public.social_posts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can create their social posts" on public.social_posts
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update their social posts" on public.social_posts
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their social posts" on public.social_posts
  for delete to authenticated using ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('instagram-temp', 'instagram-temp', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can upload their temporary social images" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'instagram-temp' and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
create policy "Users can delete their temporary social images" on storage.objects
  for delete to authenticated using (
    bucket_id = 'instagram-temp' and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

grant select, insert, update, delete on public.social_posts to authenticated;

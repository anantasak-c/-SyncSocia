-- Create posts table for history
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text,
  media_urls text[],
  platforms text[],
  status text check (status in ('success', 'failed', 'partial')),
  created_at timestamptz default now() not null
);

-- Enable RLS for posts
alter table public.posts enable row level security;

-- Policies
drop policy if exists "Users can view own posts" on public.posts;
create policy "Users can view own posts"
  on public.posts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own posts" on public.posts;
create policy "Users can insert own posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

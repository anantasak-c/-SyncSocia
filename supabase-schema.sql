-- SyncSocial: Supabase SQL Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Create the profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  late_profile_id text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Enable Row Level Security
alter table public.profiles enable row level security;

-- 3. RLS Policies: users can only read/update their own row
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 3.5. Ensure late_profile_id and line_access_token columns exist (safe to re-run)
alter table public.profiles add column if not exists late_profile_id text;
alter table public.profiles add column if not exists line_access_token text;

-- 4. Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Auto-update updated_at on row change
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- 6. Create posts table for history
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text,
  media_urls text[],
  platforms text[],
  status text check (status in ('success', 'failed', 'partial')),
  created_at timestamptz default now() not null
);

-- 7. Enable RLS for posts
alter table public.posts enable row level security;

drop policy if exists "Users can view own posts" on public.posts;
create policy "Users can view own posts"
  on public.posts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own posts" on public.posts;
create policy "Users can insert own posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

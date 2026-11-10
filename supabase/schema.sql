-- ==============================================================================
-- Schema: user_progress
-- Description: Stores per-lesson progress, code state, and earned XP per user.
-- Security: Row Level Security (RLS) restricts access strictly to row owners.
-- ==============================================================================

-- Create user_progress table
create table if not exists public.user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_slug text not null,
  completed boolean not null default false,
  saved_code text default '' check (char_length(saved_code) <= 65536),
  xp_earned integer not null default 0 check (xp_earned >= 0),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  primary key (user_id, lesson_slug)
);

-- Index for querying all progress rows for a specific user
create index if not exists idx_user_progress_user_id
  on public.user_progress(user_id);

-- Helper trigger function to maintain updated_at timestamp
create or replace function public.handle_user_progress_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically touch updated_at on record changes
drop trigger if exists set_user_progress_updated_at on public.user_progress;
create trigger set_user_progress_updated_at
  before update on public.user_progress
  for each row
  execute function public.handle_user_progress_updated_at();

-- Enable Row Level Security
alter table public.user_progress enable row level security;

-- Idempotent RLS Policies: Authenticated users can only read/write their own records
drop policy if exists "Users can read own progress" on public.user_progress;
create policy "Users can read own progress"
  on public.user_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own progress" on public.user_progress;
create policy "Users can insert own progress"
  on public.user_progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.user_progress;
create policy "Users can update own progress"
  on public.user_progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own progress" on public.user_progress;
create policy "Users can delete own progress"
  on public.user_progress
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Explicitly ensure anon role has no access, authenticated has full table access (governed by RLS)
revoke all on public.user_progress from anon;
grant select, insert, update, delete on public.user_progress to authenticated;


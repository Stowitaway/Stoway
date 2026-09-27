-- Favorites: lets a logged-in user save listings to a personal shortlist.
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

alter table public.favorites enable row level security;

create policy "Users can view their own favorites"
  on public.favorites for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can add their own favorites"
  on public.favorites for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can remove their own favorites"
  on public.favorites for delete
  to authenticated
  using (auth.uid() = user_id);

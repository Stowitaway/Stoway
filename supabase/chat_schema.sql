-- Chat: conversations + messages between a listing's host and an interested guest.
-- Run this once in the Supabase SQL Editor.

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  listing_title text,
  host_id uuid not null references auth.users(id) on delete cascade,
  host_name text not null,
  guest_id uuid not null references auth.users(id) on delete cascade,
  guest_name text not null,
  created_at timestamptz not null default now(),
  unique (listing_id, guest_id)
);

alter table public.conversations enable row level security;

create policy "Participants can view their conversations"
  on public.conversations for select
  to authenticated
  using (auth.uid() = host_id or auth.uid() = guest_id);

create policy "Guests can start a conversation"
  on public.conversations for insert
  to authenticated
  with check (auth.uid() = guest_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Participants can view messages"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.host_id = auth.uid() or c.guest_id = auth.uid())
    )
  );

create policy "Participants can send messages"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.host_id = auth.uid() or c.guest_id = auth.uid())
    )
  );

-- Enable realtime so new messages appear live without reloading.
alter publication supabase_realtime add table public.messages;

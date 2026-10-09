-- Stoway: reports, host responsibility acceptance, account deletion.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.

-- 1. Reports (Report button on listings and conversations)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  reporter_email text,
  target_type text not null check (target_type in ('listing', 'conversation', 'user')),
  target_id uuid not null,
  reason text not null check (reason in ('illegal', 'scam', 'prohibited_items', 'misleading', 'abuse', 'other')),
  details text not null check (char_length(details) between 10 and 2000),
  good_faith boolean not null check (good_faith),
  status text not null default 'open' check (status in ('open', 'actioned', 'dismissed')),
  decision_note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.reports enable row level security;

-- Anyone (signed in or not) can submit a report. Nobody can read, edit or delete
-- reports from the site: you review them in the dashboard (Table Editor > reports).
drop policy if exists "Anyone can submit a report" on public.reports;
create policy "Anyone can submit a report"
  on public.reports for insert
  to anon, authenticated
  with check (
    status = 'open'
    and decision_note is null
    and resolved_at is null
    and (reporter_id is null or reporter_id = auth.uid())
  );

-- 2. Host accepts responsibility for stored items (Terms section 4.6)
alter table public.listings
  add column if not exists host_terms_accepted_at timestamptz,
  add column if not exists host_terms_version text;

drop policy if exists "Authenticated users can insert their own listings" on public.listings;
create policy "Authenticated users can insert their own listings"
  on public.listings for insert
  to authenticated
  with check (
    auth.uid() = owner_id
    and host_terms_accepted_at is not null
    and host_terms_version is not null
  );

-- 3. Delete my account
-- Deleting the auth user cascades to listings, favorites, conversations and messages.
-- The site deletes the user's photos from Storage before calling this.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- 4. Email every new report to stoway.support@gmail.com (via Resend)
-- Before running this part, store your Resend API key in the Vault (once, in a separate query):
--   select vault.create_secret('re_YOUR_KEY_HERE', 'resend_api_key');
-- Never put the key in this file or in the code.
create extension if not exists pg_net with schema extensions;

create or replace function public.notify_new_report()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  api_key text;
begin
  select decrypted_secret into api_key
  from vault.decrypted_secrets
  where name = 'resend_api_key'
  limit 1;

  if api_key is null then
    return new; -- no key yet: the report is still saved, just not emailed
  end if;

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || api_key
    ),
    body := jsonb_build_object(
      'from', 'Stoway Reports <onboarding@resend.dev>',
      'to', jsonb_build_array('stoway.support@gmail.com'),
      'subject', 'New Stoway report: ' || new.reason || ' (' || new.target_type || ')',
      'text',
        'A new report was submitted on Stoway.' || chr(10) || chr(10) ||
        'Reason: ' || new.reason || chr(10) ||
        'Target: ' || new.target_type || ' ' || new.target_id::text || chr(10) ||
        'Reporter email: ' || coalesce(new.reporter_email, '(none)') || chr(10) ||
        'Submitted: ' || new.created_at::text || chr(10) || chr(10) ||
        'Details:' || chr(10) || new.details || chr(10) || chr(10) ||
        'Report id: ' || new.id::text || chr(10) ||
        'Review it in Supabase: Table Editor > reports.'
    )
  );
  return new;
end;
$$;

drop trigger if exists on_report_created on public.reports;
create trigger on_report_created
  after insert on public.reports
  for each row execute function public.notify_new_report();

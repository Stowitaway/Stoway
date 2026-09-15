-- Store the (fuzzed) map coordinates for a listing. The exact address
-- entered by the host is never sent to or stored in the database.
alter table public.listings
  add column if not exists lat double precision,
  add column if not exists lng double precision;

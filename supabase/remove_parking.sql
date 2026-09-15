-- Remove the "parking" category: delete existing parking listings
-- and stop the type column from accepting "parking" in the future.

delete from public.listings where type = 'parking';

alter table public.listings drop constraint if exists listings_type_check;

alter table public.listings
  add constraint listings_type_check
  check (type in ('cellar', 'garage', 'storage'));

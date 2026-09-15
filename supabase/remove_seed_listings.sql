-- Remove the original demo/example listings (no real owner behind them).
-- Real, user-created listings (with an owner_id) are untouched.
delete from public.listings where owner_id is null;

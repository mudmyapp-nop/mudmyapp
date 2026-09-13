alter table public.payments
  add column if not exists stripe_session_id text;

create unique index if not exists payments_stripe_session_id_idx
  on public.payments (stripe_session_id)
  where stripe_session_id is not null;
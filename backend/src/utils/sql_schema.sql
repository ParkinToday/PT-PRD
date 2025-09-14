-- Users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default now()
);

-- Bookings
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  license_plate text not null,
  lot_id text not null,
  start_time timestamp with time zone not null,
  entry_time timestamp with time zone,
  exit_time timestamp with time zone,
  status text not null check (status in ('pending','active','completed','paid')),
  initial_amount_cents integer not null,
  stripe_payment_intent_id text,
  created_at timestamp with time zone default now()
);

-- Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  stripe_payment_intent_id text,
  amount_cents integer not null,
  status text not null,
  kind text not null check (kind in ('initial','capture','refund')),
  created_at timestamp with time zone default now()
);

create index if not exists idx_bookings_license on public.bookings(license_plate);
create index if not exists idx_payments_booking on public.payments(booking_id);



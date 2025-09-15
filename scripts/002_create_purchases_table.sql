-- Create purchases table to track ebook purchases
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ebook_title text not null,
  purchase_date timestamp with time zone default timezone('utc'::text, now()) not null,
  amount decimal(10,2) not null,
  payment_status text not null default 'pending',
  stripe_payment_intent_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.purchases enable row level security;

-- Create policies for purchases
create policy "purchases_select_own"
  on public.purchases for select
  using (auth.uid() = user_id);

create policy "purchases_insert_own"
  on public.purchases for insert
  with check (auth.uid() = user_id);

create policy "purchases_update_own"
  on public.purchases for update
  using (auth.uid() = user_id);

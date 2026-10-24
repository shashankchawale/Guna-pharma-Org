-- GUNA PHARMA - Complete Supabase Backend Schema
-- Run this in your Supabase Dashboard: SQL Editor -> New query -> Paste & Run

create extension if not exists "uuid-ossp";

-- 1. Enquiries Table (Contact Form)
create table if not exists public.enquiries (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  country text,
  enquiry_type text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz default now()
);

-- 2. Quotes Table (Bulk & Wholesale Quote Requests)
create table if not exists public.quotes (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  company text,
  email text not null,
  country text not null,
  quantity text,
  phone text,
  details text not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- 3. Orders Table (Checkout Form)
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  guest_email text,
  status text not null default 'pending',
  payment_status text not null default 'pending',
  payment_method text not null,
  subtotal numeric(10,2) not null,
  discount_amount numeric(10,2) default 0,
  shipping_amount numeric(10,2) default 0,
  total_amount numeric(10,2) not null,
  shipping_address jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Order Items Table
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  requires_prescription boolean default false,
  prescription_status text default 'not_required',
  created_at timestamptz default now()
);

-- 5. Prescriptions Table
create table if not exists public.prescriptions (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete set null,
  file_name text not null,
  file_type text not null,
  file_size bigint not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.enquiries enable row level security;
alter table public.quotes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.prescriptions enable row level security;

-- Policies allowing public submissions to be inserted
create policy "allow public insert enquiries" on public.enquiries for insert with check (true);
create policy "allow public insert quotes" on public.quotes for insert with check (true);
create policy "allow public insert orders" on public.orders for insert with check (true);
create policy "allow public insert order_items" on public.order_items for insert with check (true);
create policy "allow public insert prescriptions" on public.prescriptions for insert with check (true);

-- Policies allowing read access
create policy "allow read enquiries" on public.enquiries for select using (true);
create policy "allow read quotes" on public.quotes for select using (true);
create policy "allow read orders" on public.orders for select using (true);
create policy "allow read order_items" on public.order_items for select using (true);

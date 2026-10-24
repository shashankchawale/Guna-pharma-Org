-- Core commerce schema. Run through the Supabase CLI or dashboard SQL editor.
create extension if not exists "uuid-ossp";

create table public.categories (
  id uuid primary key default uuid_generate_v4(), name text not null, slug text unique not null,
  description text, image_url text, display_order integer default 0, is_active boolean default true,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table public.brands (
  id uuid primary key default uuid_generate_v4(), name text unique not null, slug text unique not null,
  is_active boolean default true, created_at timestamptz default now(), updated_at timestamptz default now()
);
create table public.products (
  id uuid primary key default uuid_generate_v4(), name text not null, slug text unique not null,
  category_id uuid references public.categories(id), brand_id uuid references public.brands(id), sku text unique not null,
  description text, short_description text, mrp numeric(10,2) not null check (mrp >= 0), selling_price numeric(10,2) not null check (selling_price >= 0),
  stock_quantity integer not null default 0, low_stock_threshold integer default 10, images jsonb default '[]'::jsonb,
  requires_prescription boolean default false, prescription_notes text, composition text, usage_instructions text,
  warnings text, storage_instructions text, manufacturer text, is_active boolean default true, is_featured boolean default false,
  rating_average numeric(2,1) default 0, rating_count integer default 0, tags text[] default '{}', created_at timestamptz default now(), updated_at timestamptz default now()
);
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade, full_name text, phone text,
  role text not null default 'customer' check (role in ('customer','admin','pharmacist')), created_at timestamptz default now(), updated_at timestamptz default now()
);
create table public.addresses (
  id uuid primary key default uuid_generate_v4(), user_id uuid references auth.users(id) on delete cascade,
  full_name text not null, phone text not null, address_line_1 text not null, address_line_2 text, city text not null,
  state text not null, postal_code text not null, country text not null default 'India', is_default boolean default false, created_at timestamptz default now()
);
create table public.orders (
  id uuid primary key default uuid_generate_v4(), order_number text unique not null, user_id uuid references auth.users(id), guest_email text,
  status text not null default 'pending', payment_status text not null default 'pending', payment_method text not null,
  subtotal numeric(10,2) not null, discount_amount numeric(10,2) default 0, shipping_amount numeric(10,2) default 0, total_amount numeric(10,2) not null,
  shipping_address jsonb not null, created_at timestamptz default now(), updated_at timestamptz default now()
);
create table public.order_items (
  id uuid primary key default uuid_generate_v4(), order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id), product_name text not null, quantity integer not null check (quantity > 0), unit_price numeric(10,2) not null,
  requires_prescription boolean default false, prescription_status text default 'not_required', created_at timestamptz default now()
);
create table public.prescriptions (
  id uuid primary key default uuid_generate_v4(), user_id uuid references auth.users(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null, storage_path text not null, file_name text not null,
  file_type text not null, file_size bigint not null, status text not null default 'pending', reviewed_by uuid references auth.users(id), reviewed_at timestamptz,
  rejection_reason text, created_at timestamptz default now(), updated_at timestamptz default now()
);

alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.prescriptions enable row level security;
create policy "catalog is public" on public.categories for select using (is_active);
create policy "brands are public" on public.brands for select using (is_active);
create policy "products are public" on public.products for select using (is_active);
create policy "users manage their addresses" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users see their orders" on public.orders for select using (auth.uid() = user_id);
create policy "users see own prescriptions" on public.prescriptions for select using (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('prescriptions', 'prescriptions', false) on conflict do nothing;
create policy "users upload own prescription" on storage.objects for insert with check (bucket_id = 'prescriptions' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "users read own prescription" on storage.objects for select using (bucket_id = 'prescriptions' and auth.uid()::text = (storage.foldername(name))[1]);

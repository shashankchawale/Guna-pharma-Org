-- GUNA PHARMA: Admin Schema and Row Level Security (RLS) Configuration
-- File: supabase/migrations/20261024_admin_schema_and_rls.sql

-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed verified administrator Shashank
INSERT INTO public.admin_users (email, role, full_name)
VALUES ('shashankchawale@gmail.com', 'admin', 'Shashank Chawale')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin users read policy" ON public.admin_users;
CREATE POLICY "Admin users read policy" ON public.admin_users
  FOR SELECT USING (
    (auth.jwt()->>'email') = email
    OR (auth.jwt()->>'email') = 'shashankchawale@gmail.com'
  );

-- 2. Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id TEXT NOT NULL,
  brand_id TEXT NOT NULL,
  mrp NUMERIC(10,2) NOT NULL,
  selling_price NUMERIC(10,2) NOT NULL,
  discount_percent INT DEFAULT 0,
  stock_quantity INT DEFAULT 0,
  sku TEXT,
  images TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  requires_prescription BOOLEAN DEFAULT false,
  composition TEXT,
  usage_instructions TEXT,
  warnings TEXT,
  storage_instructions TEXT,
  manufacturer TEXT,
  country_of_origin TEXT DEFAULT 'India',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  rating_average NUMERIC(3,2) DEFAULT 4.5,
  rating_count INT DEFAULT 18,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL USING (
    (auth.jwt()->>'email') = 'shashankchawale@gmail.com'
    OR (auth.jwt()->>'email') IN (SELECT email FROM public.admin_users WHERE role = 'admin')
  );

-- 3. Ensure enquiries table exists and has proper RLS
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  enquiry_type TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert enquiries" ON public.enquiries;
CREATE POLICY "Public can insert enquiries" ON public.enquiries
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage enquiries" ON public.enquiries;
CREATE POLICY "Admins can manage enquiries" ON public.enquiries
  FOR ALL USING (
    (auth.jwt()->>'email') = 'shashankchawale@gmail.com'
    OR (auth.jwt()->>'email') IN (SELECT email FROM public.admin_users WHERE role = 'admin')
  );

-- 4. Create trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

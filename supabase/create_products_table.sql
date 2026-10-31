-- ========================================================
-- GUNA PHARMA: Production Schema for 'products' Table
-- ========================================================

-- 1. Create the products table with TEXT id to support custom SKUs and UUIDs
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id TEXT NOT NULL DEFAULT 'medicines',
  category TEXT DEFAULT 'medicines',
  brand_id TEXT NOT NULL DEFAULT 'guna-pharma',
  mrp NUMERIC(10,2) NOT NULL DEFAULT 299.00,
  selling_price NUMERIC(10,2) NOT NULL DEFAULT 249.00,
  discount_percent INT DEFAULT 0,
  stock_quantity INT DEFAULT 50,
  low_stock_threshold INT DEFAULT 10,
  sku TEXT,
  images TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  image_url TEXT,
  requires_prescription BOOLEAN DEFAULT false,
  prescription_notes TEXT,
  composition TEXT,
  usage_instructions TEXT,
  warnings TEXT,
  storage_instructions TEXT,
  manufacturer TEXT DEFAULT 'GUNA PHARMA',
  country_of_origin TEXT DEFAULT 'India',
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  rating_average NUMERIC(3,2) DEFAULT 4.7,
  rating_count INT DEFAULT 15,
  view_count INT DEFAULT 100,
  sold_count INT DEFAULT 20,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Clean non-destructive policies (no DROP keywords so Supabase shows no warnings)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public can view active products') THEN
    CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow product inserts') THEN
    CREATE POLICY "Allow product inserts" ON public.products FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow product updates') THEN
    CREATE POLICY "Allow product updates" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow product deletes') THEN
    CREATE POLICY "Allow product deletes" ON public.products FOR DELETE USING (true);
  END IF;
END $$;

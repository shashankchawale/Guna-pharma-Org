import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/types';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xtnazvpjlsupnyyovnes.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_Pi_q-MeEtDkT5-03RE_9fQ_f461abXL';

export function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

export interface SupabaseHealth {
  connected: boolean;
  tableExists: boolean;
  productCount: number;
  url: string;
  error?: string;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  try {
    const supabase = getSupabaseClient();
    const { data, error, count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true });

    if (error) {
      const isMissingTable =
        error.code === 'PGRST205' ||
        error.message?.includes('not find the table') ||
        error.message?.includes('does not exist');

      return {
        connected: true,
        tableExists: !isMissingTable,
        productCount: 0,
        url: SUPABASE_URL,
        error: error.message,
      };
    }

    return {
      connected: true,
      tableExists: true,
      productCount: count ?? (Array.isArray(data) ? data.length : 0),
      url: SUPABASE_URL,
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      productCount: 0,
      url: SUPABASE_URL,
      error: err?.message || 'Failed to connect to Supabase',
    };
  }
}

export async function fetchSupabaseProducts(): Promise<Product[] | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    return data.map((row: any): Product => {
      const mrp = Number(row.mrp || row.price || 0);
      const sellingPrice = Number(row.selling_price || row.price || mrp);
      const calculatedDiscount =
        mrp > 0 && sellingPrice < mrp
          ? Math.round(((mrp - sellingPrice) / mrp) * 100)
          : Number(row.discount_percent || row.discount || 0);

      const imageUrl =
        row.image_url ||
        row.thumbnail_url ||
        (Array.isArray(row.images) && row.images[0]) ||
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';

      const isAvailable =
        row.is_available !== undefined
          ? Boolean(row.is_available)
          : row.is_active !== undefined
          ? Boolean(row.is_active)
          : Number(row.stock_quantity ?? 0) > 0;

      return {
        id: String(row.id),
        name: String(row.name || 'Unnamed Product'),
        slug: String(row.slug || row.id || `product-${row.name}`),
        category_id: String(row.category_id || row.category || 'medicines'),
        category: String(row.category || row.category_id || 'medicines'),
        brand_id: String(row.brand_id || 'guna-pharma'),
        mrp,
        selling_price: sellingPrice,
        price: sellingPrice,
        discount_percent: calculatedDiscount,
        discount: calculatedDiscount,
        stock_quantity: Number(row.stock_quantity ?? 0),
        low_stock_threshold: Number(row.low_stock_threshold ?? 10),
        sku: String(row.sku || `GP-${row.id}`),
        images: Array.isArray(row.images) && row.images.length ? row.images : [imageUrl],
        thumbnail_url: imageUrl,
        image_url: imageUrl,
        requires_prescription: Boolean(row.requires_prescription),
        prescription_notes: row.prescription_notes || '',
        composition: row.composition || '',
        usage_instructions: row.usage_instructions || '',
        warnings: row.warnings || '',
        storage_instructions: row.storage_instructions || '',
        manufacturer: row.manufacturer || 'GUNA PHARMA',
        country_of_origin: row.country_of_origin || 'India',
        is_active: Boolean(row.is_active ?? true),
        is_available: isAvailable,
        is_featured: Boolean(row.is_featured ?? false),
        rating_average: Number(row.rating_average ?? 4.7),
        rating_count: Number(row.rating_count ?? 15),
        view_count: Number(row.view_count ?? 100),
        sold_count: Number(row.sold_count ?? 20),
        tags: Array.isArray(row.tags) ? row.tags : [],
        short_description: row.short_description || row.description || '',
        description: row.description || row.short_description || '',
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || new Date().toISOString(),
      };
    });
  } catch (err) {
    console.warn('Error querying Supabase products:', err);
    return null;
  }
}

export async function upsertSupabaseProduct(product: Product): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const row = {
      id: product.id,
      name: product.name,
      slug: product.slug || product.id,
      category_id: product.category_id || (typeof product.category === 'string' ? product.category : 'medicines'),
      brand_id: product.brand_id || 'guna-pharma',
      mrp: product.mrp,
      selling_price: product.selling_price || product.price || product.mrp,
      discount_percent: product.discount_percent ?? product.discount ?? 0,
      stock_quantity: product.stock_quantity ?? 0,
      sku: product.sku || `GP-${product.id}`,
      thumbnail_url: product.thumbnail_url || product.image_url,
      images: product.images || [product.image_url || product.thumbnail_url || ''],
      requires_prescription: Boolean(product.requires_prescription),
      short_description: product.short_description || '',
      description: product.description || '',
      composition: product.composition || '',
      manufacturer: product.manufacturer || 'GUNA PHARMA',
      is_active: product.is_active ?? true,
      is_available: product.is_available ?? (product.stock_quantity > 0),
      is_featured: product.is_featured ?? false,
      rating_average: product.rating_average ?? 4.5,
      rating_count: product.rating_count ?? 10,
      tags: product.tags || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Could not upsert into Supabase products:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase upsert exception:', err);
    return false;
  }
}

export async function deleteSupabaseProduct(id: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('products')
      .delete()
      .or(`id.eq.${id},slug.eq.${id}`);

    if (error) {
      console.warn('Could not delete from Supabase products:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete exception:', err);
    return false;
  }
}

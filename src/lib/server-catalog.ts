import fs from 'fs';
import path from 'path';
import type { Product } from '@/types';
import { products as seedProducts } from './catalog';
import {
  fetchSupabaseProducts,
  upsertSupabaseProduct,
  deleteSupabaseProduct,
  checkSupabaseHealth,
  type SupabaseHealth,
} from './supabase-catalog';

const DATA_DIR = path.join(process.cwd(), '.data');
const DELETED_FILE = path.join(DATA_DIR, 'deleted_products.json');
const CUSTOM_FILE = path.join(DATA_DIR, 'custom_products.json');
const PRODUCTS_DB_FILE = path.join(DATA_DIR, 'products_db.json');

// In-memory fallback & cache
const globalScope = globalThis as unknown as {
  __GUNA_CUSTOM_PRODUCTS__?: Product[];
  __GUNA_DELETED_PRODUCT_IDS__?: string[];
  __GUNA_PRODUCTS_DB__?: Product[];
};

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Could not ensure data directory:', err);
  }
}

/**
 * Standardize product fields so all catalog properties are present
 */
export function normalizeProduct(p: any): Product {
  const mrp = Number(p.mrp || p.price || 299);
  const sellingPrice = Number(p.selling_price || p.price || mrp);
  const discount =
    p.discount !== undefined
      ? Number(p.discount)
      : p.discount_percent !== undefined
      ? Number(p.discount_percent)
      : mrp > 0 && sellingPrice < mrp
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  const stock = Number(p.stock_quantity ?? 50);
  const isAvailable =
    p.is_available !== undefined
      ? Boolean(p.is_available)
      : p.is_active !== undefined
      ? Boolean(p.is_active)
      : stock > 0;

  const rawCategory = (p.category_id || (typeof p.category === 'string' ? p.category : '') || 'medicines').toLowerCase();
  let categoryId = rawCategory;
  if (['medicine', 'pharma', 'pain-relief', 'cold-flu', 'first-aid', 'digestive-health'].includes(rawCategory)) {
    categoryId = 'medicines';
  } else if (['cosmetic', 'cosmetics', 'beauty', 'hair-care', 'makeup'].includes(rawCategory)) {
    categoryId = 'beauty';
  } else if (['skin', 'dermatology', 'skincare', 'body-care'].includes(rawCategory)) {
    categoryId = 'skincare';
  } else if (['wellness', 'vitamins', 'supplements', 'ayurveda', 'herbal'].includes(rawCategory)) {
    categoryId = 'wellness';
  }

  const imageUrl =
    p.image_url ||
    p.thumbnail_url ||
    (Array.isArray(p.images) && p.images[0]) ||
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';

  return {
    id: String(p.id),
    slug: String(p.slug || p.id),
    name: String(p.name),
    category_id: categoryId,
    category: categoryId,
    brand_id: String(p.brand_id || 'guna-pharma'),
    description: String(p.description || p.short_description || 'Certified pharmaceutical formulation.'),
    short_description: String(p.short_description || p.description || 'Quality health product.'),
    mrp,
    selling_price: sellingPrice,
    price: sellingPrice,
    discount_percent: discount,
    discount,
    stock_quantity: stock,
    low_stock_threshold: Number(p.low_stock_threshold ?? 10),
    sku: String(p.sku || `GP-${p.id}`),
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [imageUrl],
    thumbnail_url: imageUrl,
    image_url: imageUrl,
    requires_prescription: Boolean(p.requires_prescription),
    prescription_notes: p.prescription_notes || '',
    composition: p.composition || '',
    usage_instructions: p.usage_instructions || 'Use as directed by healthcare professional.',
    warnings: p.warnings || 'Keep out of reach of children. Store in a cool dry place.',
    storage_instructions: p.storage_instructions || 'Store below 25°C.',
    manufacturer: p.manufacturer || 'GUNA PHARMA',
    country_of_origin: p.country_of_origin || 'India',
    is_active: Boolean(p.is_active ?? true),
    is_available: isAvailable,
    is_featured: Boolean(p.is_featured ?? false),
    rating_average: Number(p.rating_average ?? 4.7),
    rating_count: Number(p.rating_count ?? 24),
    view_count: Number(p.view_count ?? 150),
    sold_count: Number(p.sold_count ?? 30),
    tags: Array.isArray(p.tags) ? p.tags : [categoryId],
    created_at: p.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function loadPersistedDeletedIds(): string[] {
  try {
    ensureDataDir();
    if (fs.existsSync(DELETED_FILE)) {
      const content = fs.readFileSync(DELETED_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading deleted products file:', err);
  }
  return globalScope.__GUNA_DELETED_PRODUCT_IDS__ || [];
}

export function savePersistedDeletedIds(ids: string[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(DELETED_FILE, JSON.stringify(ids, null, 2), 'utf-8');
    globalScope.__GUNA_DELETED_PRODUCT_IDS__ = ids;
  } catch (err) {
    console.warn('Error writing deleted products file:', err);
    globalScope.__GUNA_DELETED_PRODUCT_IDS__ = ids;
  }
}

export function loadPersistedCustomProducts(): Product[] {
  try {
    ensureDataDir();
    if (fs.existsSync(CUSTOM_FILE)) {
      const content = fs.readFileSync(CUSTOM_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeProduct);
      }
    }
  } catch (err) {
    console.warn('Error reading custom products file:', err);
  }
  return (globalScope.__GUNA_CUSTOM_PRODUCTS__ || []).map(normalizeProduct);
}

export function savePersistedCustomProducts(prods: Product[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(CUSTOM_FILE, JSON.stringify(prods, null, 2), 'utf-8');
    globalScope.__GUNA_CUSTOM_PRODUCTS__ = prods;
  } catch (err) {
    console.warn('Error writing custom products file:', err);
    globalScope.__GUNA_CUSTOM_PRODUCTS__ = prods;
  }
}

export function loadDatabaseCatalog(): Product[] {
  try {
    ensureDataDir();
    if (fs.existsSync(PRODUCTS_DB_FILE)) {
      const content = fs.readFileSync(PRODUCTS_DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeProduct);
      }
    }
  } catch (err) {
    console.warn('Error reading database catalog file:', err);
  }

  const initial = seedProducts.map(normalizeProduct);
  try {
    ensureDataDir();
    fs.writeFileSync(PRODUCTS_DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  } catch {}
  return initial;
}

export function saveDatabaseCatalog(prods: Product[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(PRODUCTS_DB_FILE, JSON.stringify(prods, null, 2), 'utf-8');
    globalScope.__GUNA_PRODUCTS_DB__ = prods;
  } catch (err) {
    console.warn('Error saving database catalog file:', err);
    globalScope.__GUNA_PRODUCTS_DB__ = prods;
  }
}

export function getServerProducts(cookieDeletedIds: string[] = []): Product[] {
  const dbCatalog = loadDatabaseCatalog();
  const custom = loadPersistedCustomProducts();
  const memoryCustom = globalScope.__GUNA_CUSTOM_PRODUCTS__ || [];

  const productMap = new Map<string, Product>();

  for (const p of dbCatalog) {
    if (p && p.id) productMap.set(p.id, normalizeProduct(p));
  }

  for (const p of [...custom, ...memoryCustom]) {
    if (p && p.id) productMap.set(p.id, normalizeProduct(p));
  }

  const persistedDeleted = loadPersistedDeletedIds();
  const memoryDeleted = globalScope.__GUNA_DELETED_PRODUCT_IDS__ || [];
  const deletedSet = new Set(
    [...persistedDeleted, ...memoryDeleted, ...cookieDeletedIds]
      .map((d) => (d || '').trim().toLowerCase())
      .filter(Boolean)
  );

  const activeProducts = Array.from(productMap.values()).filter((p) => {
    const idLower = (p.id || '').toLowerCase();
    const slugLower = (p.slug || '').toLowerCase();
    return !deletedSet.has(idLower) && !deletedSet.has(slugLower);
  });

  return activeProducts;
}

// Server-side cache for live products to prevent spamming Supabase on every page navigation
let serverLiveProductsCache: {
  timestamp: number;
  data: {
    products: Product[];
    source: 'supabase' | 'database';
    supabaseHealth: SupabaseHealth;
  };
} | null = null;

export function invalidateLiveProductsCache(): void {
  serverLiveProductsCache = null;
}

export async function getLiveCatalogProducts(cookieDeletedIds: string[] = []): Promise<{
  products: Product[];
  source: 'supabase' | 'database';
  supabaseHealth: SupabaseHealth;
}> {
  const now = Date.now();
  const CACHE_TTL_MS = 30_000; // 30 seconds

  let baseResult = serverLiveProductsCache?.data;
  if (!baseResult || now - (serverLiveProductsCache?.timestamp || 0) > CACHE_TTL_MS) {
    const health = await checkSupabaseHealth();
    let supabaseProducts: Product[] | null = null;

    if (health.connected && health.tableExists) {
      supabaseProducts = await fetchSupabaseProducts();
    }

    const localProducts = getServerProducts([]);
    if (supabaseProducts && supabaseProducts.length > 0) {
      const productMap = new Map<string, Product>();
      for (const p of localProducts) {
        if (p && p.id) productMap.set(p.id, p);
      }
      for (const p of supabaseProducts) {
        if (p && p.id) productMap.set(p.id, normalizeProduct(p));
      }
      baseResult = {
        products: Array.from(productMap.values()),
        source: 'supabase',
        supabaseHealth: health,
      };
    } else {
      baseResult = {
        products: localProducts,
        source: 'database',
        supabaseHealth: health,
      };
    }

    serverLiveProductsCache = {
      timestamp: now,
      data: baseResult,
    };
  }

  // Filter against deleted IDs (persisted + memory + cookie)
  const persistedDeleted = loadPersistedDeletedIds();
  const memoryDeleted = globalScope.__GUNA_DELETED_PRODUCT_IDS__ || [];
  const deletedSet = new Set(
    [...persistedDeleted, ...memoryDeleted, ...cookieDeletedIds]
      .map((d) => (d || '').trim().toLowerCase())
      .filter(Boolean)
  );

  const filtered = baseResult.products.filter((p) => {
    const idLower = (p.id || '').toLowerCase();
    const slugLower = (p.slug || '').toLowerCase();
    return !deletedSet.has(idLower) && !deletedSet.has(slugLower);
  });

  return {
    products: filtered,
    source: baseResult.source,
    supabaseHealth: baseResult.supabaseHealth,
  };
}

export function getServerProduct(slug: string, cookieDeletedIds: string[] = []): Product | undefined {
  const all = getServerProducts(cookieDeletedIds);
  const slugLower = slug.trim().toLowerCase();
  return all.find(
    (p) =>
      p.slug === slug ||
      p.id === slug ||
      (p.slug || '').toLowerCase() === slugLower ||
      (p.id || '').toLowerCase() === slugLower
  );
}

export async function getOrFetchServerProduct(slug: string, cookieDeletedIds: string[] = []): Promise<Product | undefined> {
  const local = getServerProduct(slug, cookieDeletedIds);
  if (local) return local;

  // Fallback: check Supabase directly if not yet in local disk cache
  try {
    const supabaseProducts = await fetchSupabaseProducts();
    if (supabaseProducts && supabaseProducts.length > 0) {
      const slugLower = slug.trim().toLowerCase();
      const found = supabaseProducts.find(
        (p) =>
          p.slug === slug ||
          p.id === slug ||
          (p.slug || '').toLowerCase() === slugLower ||
          (p.id || '').toLowerCase() === slugLower
      );
      if (found) {
        const normalized = normalizeProduct(found);
        addServerProduct(normalized); // Cache locally for instant subsequent loads
        return normalized;
      }
    }
  } catch {}

  return undefined;
}

export function addServerProduct(rawProduct: Product): Product {
  const product = normalizeProduct(rawProduct);
  const current = loadPersistedCustomProducts();
  const idx = current.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    current[idx] = product;
  } else {
    current.unshift(product);
  }
  savePersistedCustomProducts(current);

  const db = loadDatabaseCatalog();
  const dbIdx = db.findIndex((p) => p.id === product.id);
  if (dbIdx >= 0) {
    db[dbIdx] = product;
  } else {
    db.unshift(product);
  }
  saveDatabaseCatalog(db);

  const deleted = loadPersistedDeletedIds();
  const idLower = (product.id || '').toLowerCase();
  const slugLower = (product.slug || '').toLowerCase();
  const filteredDeleted = deleted.filter(
    (d) => d.toLowerCase() !== idLower && d.toLowerCase() !== slugLower
  );
  if (filteredDeleted.length !== deleted.length) {
    savePersistedDeletedIds(filteredDeleted);
  }

  upsertSupabaseProduct(product).catch(() => {});
  invalidateLiveProductsCache();

  return product;
}

export function updateServerProduct(product: Product): Product {
  return addServerProduct(product);
}

export function deleteServerProduct(id: string): void {
  const idStr = String(id).trim();
  const idLower = idStr.toLowerCase();

  const currentDeleted = loadPersistedDeletedIds();
  const toAdd = [idStr, idLower];

  const db = loadDatabaseCatalog();
  const matching = db.find(
    (p) =>
      p.id === idStr ||
      p.slug === idStr ||
      p.id.toLowerCase() === idLower ||
      p.slug.toLowerCase() === idLower
  );
  if (matching) {
    toAdd.push(
      matching.id,
      matching.slug,
      matching.id.toLowerCase(),
      matching.slug.toLowerCase()
    );
  }

  const updatedDeleted = Array.from(new Set([...currentDeleted, ...toAdd]));
  savePersistedDeletedIds(updatedDeleted);

  const custom = loadPersistedCustomProducts();
  const filteredCustom = custom.filter(
    (p) =>
      p.id !== idStr &&
      p.slug !== idStr &&
      (p.id || '').toLowerCase() !== idLower &&
      (p.slug || '').toLowerCase() !== idLower
  );
  savePersistedCustomProducts(filteredCustom);

  const filteredDb = db.filter(
    (p) =>
      p.id !== idStr &&
      p.slug !== idStr &&
      (p.id || '').toLowerCase() !== idLower &&
      (p.slug || '').toLowerCase() !== idLower
  );
  saveDatabaseCatalog(filteredDb);

  deleteSupabaseProduct(idStr).catch(() => {});
  invalidateLiveProductsCache();
}

export function restoreAllServerProducts(): void {
  savePersistedDeletedIds([]);
  const initial = seedProducts.map(normalizeProduct);
  saveDatabaseCatalog(initial);
  savePersistedCustomProducts([]);
  invalidateLiveProductsCache();
}

import type { Product } from '@/types';

export const categories = [
  ['erectile-dysfunction', 'ERECTILE DYSFUNCTION', 'Sildenafil, Tadalafil, Vidalista & PDE-5 therapies', '⚡'],
  ['steroids', 'STEROIDS', 'Prednisolone, Dexamethasone & anti-inflammatory corticoids', '💉'],
  ['anti-anxiety', 'ANTI ANXIETY', 'Etizolam, Alprazolam & anxiolytic treatments', '🧘'],
  ['anti-parasitic', 'ANTI PARASITIC', 'Ivermectin, Albendazole & anti-parasitics', '🔬'],
  ['pain-killers', 'PAIN KILLERS', 'Tapentadol, Tramadol, Tydol & analgesic relief', '🩹'],
  ['sleeping-pills', 'SLEEPING PILLS', 'Zopiclone, Zolpidem & clinical sleep therapies', '🌙'],
  ['weight-loss', 'WEIGHT LOSS', 'Semaglutide, Orlistat, Rybelsus & metabolic management', '⚖️'],
  ['antibiotics', 'ANTIBIOTICS', 'Augmentin, Azithromycin & broad spectrum antimicrobials', '🛡️'],
  ['anti-diabetics', 'ANTI DIABETICS', 'Metformin, Glimepiride & glycemic regulation', '🩸'],
  ['antihypertensive', 'ANTIHYPERTENSIVE', 'Telmisartan, Amlodipine & blood pressure therapeutics', '❤️'],
  ['human-growth-hormones', 'HUMAN GROWTH HORMONES', 'Somatropin r-DNA, Norditropin & endocrine vitality', '🧬'],
  ['skin-cream', 'SKIN CREAM', 'Retino-A, Tretinoin, Skinlite & dermatological topicals', '🧴'],
  ['antiemetics', 'ANTIEMETICS', 'Ondansetron, Domperidone & nausea suppression', '🌿'],
  ['skincare', 'Skincare & Cosmetics', 'L\'Oréal, serums, sunscreens & facial care', '✨'],
  ['beauty', 'Beauty Products', 'Luxury cosmetics, hair care & perfumes', '💄'],
  ['wellness', 'Vitamins & Supplements', 'Daily B-Complex, Calcium, Vitamin C & E', '🍊'],
] as const;

interface RealProductSeed {
  slug: string;
  name: string;
  category_id: string;
  mrp: number;
  selling_price: number;
  stock_quantity: number;
  brand: string;
  requires_prescription: boolean;
  image_url: string;
  tags: string[];
  composition: string;
  short_description: string;
  description: string;
}

const realProductsSeed: RealProductSeed[] = [];

export const products: Product[] = realProductsSeed.map((p, index) => ({
  id: p.slug,
  slug: p.slug,
  name: p.name,
  category_id: p.category_id,
  brand_id: p.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  mrp: p.mrp,
  selling_price: p.selling_price,
  discount_percent: Math.round((1 - p.selling_price / p.mrp) * 100),
  stock_quantity: p.stock_quantity,
  low_stock_threshold: 15,
  sku: `GP-${String(index + 101).padStart(4, '0')}`,
  images: [p.image_url],
  thumbnail_url: p.image_url,
  requires_prescription: p.requires_prescription,
  short_description: p.short_description,
  description: p.description,
  composition: p.composition,
  usage_instructions: 'Gently massage a small amount on the affected area 2 to 3 times a day.',
  warnings: 'For external application only. Do not apply on broken skin or near eyes.',
  storage_instructions: 'Store below 25°C in a dry place. Protect from direct heat and moisture.',
  manufacturer: p.brand,
  country_of_origin: 'India',
  is_active: true,
  is_featured: true,
  rating_average: 4.8,
  rating_count: 85,
  view_count: 240,
  sold_count: 120,
  tags: p.tags,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

// In-memory global store across server API calls & page requests
const globalScope = globalThis as unknown as {
  __GUNA_CUSTOM_PRODUCTS__?: Product[];
  __GUNA_DELETED_PRODUCT_IDS__?: string[];
};

function getFsPersistedState(): { deleted: string[]; custom: Product[] } {
  let deleted: string[] = [];
  let custom: Product[] = [];
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const dataDir = path.join(process.cwd(), '.data');
      const delFile = path.join(dataDir, 'deleted_products.json');
      const custFile = path.join(dataDir, 'custom_products.json');
      if (fs.existsSync(delFile)) {
        const parsed = JSON.parse(fs.readFileSync(delFile, 'utf-8'));
        if (Array.isArray(parsed)) deleted = parsed;
      }
      if (fs.existsSync(custFile)) {
        const parsed = JSON.parse(fs.readFileSync(custFile, 'utf-8'));
        if (Array.isArray(parsed)) custom = parsed;
      }
    } catch {}
  }
  return { deleted, custom };
}

export function getAllProducts(): Product[] {
  const { deleted: diskDeleted, custom: diskCustom } = getFsPersistedState();
  const memoryCustom = globalScope.__GUNA_CUSTOM_PRODUCTS__ || [];

  const customMap = new Map<string, Product>();
  for (const p of diskCustom) {
    if (p && p.id) customMap.set(p.id, p);
  }
  for (const p of memoryCustom) {
    if (p && p.id) customMap.set(p.id, p);
  }
  const custom = Array.from(customMap.values());

  const memoryDeleted = globalScope.__GUNA_DELETED_PRODUCT_IDS__ || [];
  const deletedIds = Array.from(new Set([...diskDeleted, ...memoryDeleted])).map((d) => d.toLowerCase());

  const filteredCustom = custom.filter((p) => {
    const idLower = (p.id || '').toLowerCase();
    const slugLower = (p.slug || '').toLowerCase();
    return !deletedIds.includes(idLower) && !deletedIds.includes(slugLower);
  });

  const filteredSeed = products.filter((p) => {
    const idLower = (p.id || '').toLowerCase();
    const slugLower = (p.slug || '').toLowerCase();
    if (deletedIds.includes(idLower) || deletedIds.includes(slugLower)) {
      return false;
    }
    return !filteredCustom.some((c) => c.id === p.id || c.slug === p.slug);
  });

  return [...filteredCustom, ...filteredSeed];
}

export function getProduct(slug: string): Product | undefined {
  const all = getAllProducts();
  const slugLower = slug.toLowerCase();
  return all.find(
    (p) =>
      p.slug === slug ||
      p.id === slug ||
      p.slug?.toLowerCase() === slugLower ||
      p.id?.toLowerCase() === slugLower
  );
}

export function addServerProduct(p: Product): Product {
  if (!globalScope.__GUNA_CUSTOM_PRODUCTS__) {
    globalScope.__GUNA_CUSTOM_PRODUCTS__ = [];
  }
  const existingIdx = globalScope.__GUNA_CUSTOM_PRODUCTS__.findIndex((i) => i.id === p.id);
  if (existingIdx >= 0) {
    globalScope.__GUNA_CUSTOM_PRODUCTS__[existingIdx] = p;
  } else {
    globalScope.__GUNA_CUSTOM_PRODUCTS__.unshift(p);
  }
  return p;
}

export function updateServerProduct(p: Product): Product {
  if (!globalScope.__GUNA_CUSTOM_PRODUCTS__) {
    globalScope.__GUNA_CUSTOM_PRODUCTS__ = [];
  }
  const existingIdx = globalScope.__GUNA_CUSTOM_PRODUCTS__.findIndex((i) => i.id === p.id);
  if (existingIdx >= 0) {
    globalScope.__GUNA_CUSTOM_PRODUCTS__[existingIdx] = p;
  } else {
    globalScope.__GUNA_CUSTOM_PRODUCTS__.unshift(p);
  }
  return p;
}

export function deleteServerProduct(id: string): void {
  if (!globalScope.__GUNA_DELETED_PRODUCT_IDS__) {
    globalScope.__GUNA_DELETED_PRODUCT_IDS__ = [];
  }
  const idStr = String(id).trim();
  const idLower = idStr.toLowerCase();

  if (!globalScope.__GUNA_DELETED_PRODUCT_IDS__.includes(idStr)) {
    globalScope.__GUNA_DELETED_PRODUCT_IDS__.push(idStr);
  }
  if (!globalScope.__GUNA_DELETED_PRODUCT_IDS__.includes(idLower)) {
    globalScope.__GUNA_DELETED_PRODUCT_IDS__.push(idLower);
  }

  const matchingSeed = products.find(
    (p) =>
      p.id === idStr ||
      p.slug === idStr ||
      p.id.toLowerCase() === idLower ||
      p.slug.toLowerCase() === idLower
  );
  if (matchingSeed) {
    if (!globalScope.__GUNA_DELETED_PRODUCT_IDS__.includes(matchingSeed.id)) {
      globalScope.__GUNA_DELETED_PRODUCT_IDS__.push(matchingSeed.id);
    }
    if (!globalScope.__GUNA_DELETED_PRODUCT_IDS__.includes(matchingSeed.slug)) {
      globalScope.__GUNA_DELETED_PRODUCT_IDS__.push(matchingSeed.slug);
    }
  }

  if (globalScope.__GUNA_CUSTOM_PRODUCTS__) {
    globalScope.__GUNA_CUSTOM_PRODUCTS__ = globalScope.__GUNA_CUSTOM_PRODUCTS__.filter(
      (p) =>
        p.id !== idStr &&
        p.slug !== idStr &&
        p.id?.toLowerCase() !== idLower &&
        p.slug?.toLowerCase() !== idLower
    );
  }
}

export function restoreAllServerProducts(): void {
  globalScope.__GUNA_DELETED_PRODUCT_IDS__ = [];
}

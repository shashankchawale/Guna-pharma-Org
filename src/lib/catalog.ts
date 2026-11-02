import type { Product } from '@/types';

export const categories = [
  ['pain-relief', 'Pain Relief & Fever', 'Paracetamol, pain gels & relief tablets', '🩹'],
  ['skincare', 'Skincare & Cosmetics', 'L\'Oréal, Dot & Key, serums & sunscreens', '✨'],
  ['cold-flu', 'Cold, Cough & Flu', 'Vicks, inhalers, nasal sprays & relief', '🌿'],
  ['vitamins', 'Vitamins & Supplements', 'Daily B-Complex, Calcium, Vitamin C & E', '🍊'],
  ['digestive-health', 'Digestive Health', 'Antacids, gas relief & digestive care', '🌱'],
  ['first-aid', 'First Aid & Antiseptics', 'Betadine, Band-Aids & wound care', '➕'],
  ['hair-care', 'Hair & Scalp Care', 'L\'Oréal hair serums & scalp remedies', '💆'],
  ['body-care', 'Personal & Body Care', 'Gentle cleansers & dermatological care', '🫧'],
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

const realProductsSeed: RealProductSeed[] = [
  {
    slug: 'bontress-pro-scalp-serum',
    name: 'Bontress Pro+ Scalp Revitalizing Serum (60ml)',
    category_id: 'hair-care',
    mrp: 34.99,
    selling_price: 28.99,
    stock_quantity: 85,
    brand: 'Glenmark Pharmaceuticals',
    requires_prescription: false,
    image_url: '/products/bontress-pro-scalp-serum.png',
    tags: ['Hair Care', 'Scalp Serum', 'Hair Growth', 'Bontress', 'Hair Density'],
    composition: 'Anagain, RootBioTec HO, Capixyl, Redensyl, Procapil Peptides',
    short_description: 'Advanced scalp revitalizer serum with clinically proven peptides for promoting hair density and follicle strength.',
    description: 'Bontress Pro+ Scalp Serum is an advanced, non-sticky hair and scalp revitalizing serum formulated with multi-peptide complexes (Anagain, Capixyl, Redensyl, and Procapil). It works at the hair root level to reduce shedding and improve hair density.',
  },
  {
    slug: 'mintop-forte-5-minoxidil',
    name: 'Mintop Forte 5% Minoxidil Topical Solution (60ml)',
    category_id: 'medicines',
    mrp: 24.99,
    selling_price: 19.99,
    stock_quantity: 120,
    brand: "Dr. Reddy's Laboratories",
    requires_prescription: false,
    image_url: '/products/mintop-forte-5-minoxidil.png',
    tags: ['Medicines', 'Minoxidil', 'Hair Regrowth', 'Mintop', 'Alopecia'],
    composition: 'Minoxidil IP 5.0% w/v in alcohol-propylene glycol base',
    short_description: 'Topical vasodilator solution clinically proven to stimulate hair follicles and treat androgenetic alopecia.',
    description: "Mintop Forte 5% Topical Solution by Dr. Reddy's contains pharmaceutical-grade Minoxidil 5% w/v. It dilates scalp micro-vessels, increases blood circulation to dormant follicles, and encourages active hair regrowth.",
  },
  {
    slug: 'benzac-ac-gel-wash-benzoyl-peroxide',
    name: 'Benzac AC 5% Gel Wash - Benzoyl Peroxide (50g)',
    category_id: 'skincare',
    mrp: 18.99,
    selling_price: 14.99,
    stock_quantity: 95,
    brand: 'Galderma',
    requires_prescription: false,
    image_url: '/products/benzac-ac-gel-wash-benzoyl-peroxide.png',
    tags: ['Skincare', 'Acne Wash', 'Benzoyl Peroxide', 'Galderma', 'Pore Cleanser'],
    composition: 'Benzoyl Peroxide 5% w/w with Acrylates Copolymer technology',
    short_description: 'Antimicrobial acne foaming gel wash that eliminates acne-causing bacteria and unclogs pores without overdrying.',
    description: 'Benzac AC 5% Gel Wash by Galderma delivers targeted antimicrobial action against Cutibacterium acnes. Its Acrylates Copolymer absorbs excess facial sebum while releasing moisturizing glycerin to protect the skin barrier.',
  },
  {
    slug: 'miduty-liposomal-glutathione',
    name: 'Miduty Liposomal Glutathione (60 Veg Capsules)',
    category_id: 'wellness',
    mrp: 49.99,
    selling_price: 39.99,
    stock_quantity: 60,
    brand: 'Miduty',
    requires_prescription: false,
    image_url: '/products/miduty-liposomal-glutathione.png',
    tags: ['Wellness', 'Glutathione', 'Antioxidant', 'Skin Glow', 'Detox'],
    composition: 'Setria Liposomal L-Glutathione 500mg, Vitamin C 100mg, NAC 200mg',
    short_description: 'Master antioxidant with high-bioavailability liposomal delivery for radiant skin glow, detox, and cellular defense.',
    description: 'Miduty Liposomal Glutathione utilizes phospholipid liposomal encapsulation to bypass gastric degradation, delivering pure reduced L-Glutathione directly into cells for maximal master antioxidant protection and skin brightness.',
  },
  {
    slug: 'tata-1mg-triple-strength-omega-3',
    name: 'Tata 1mg Triple Strength Omega-3 Fish Oil (60 Softgels)',
    category_id: 'wellness',
    mrp: 22.99,
    selling_price: 17.99,
    stock_quantity: 150,
    brand: 'Tata 1mg',
    requires_prescription: false,
    image_url: '/products/tata-1mg-triple-strength-omega-3.png',
    tags: ['Wellness', 'Omega-3', 'Fish Oil', 'Heart Health', 'EPA DHA'],
    composition: '1250mg Purified Fish Oil (560mg EPA, 400mg DHA, 1000mg Total Omega-3 Fatty Acids)',
    short_description: 'Ultra-pure, molecularly distilled high-potency Omega-3 fish oil for heart, joint, and brain health.',
    description: 'Tata 1mg Triple Strength Omega-3 provides 1000mg of active EPA and DHA per single enteric-coated softgel. Molecularly distilled to eliminate heavy metals, it supports cardiovascular function, joint flexibility, and cognitive clarity without fishy burps.',
  },
  {
    slug: 'ketocip-2-ketoconazole-shampoo',
    name: 'Ketocip 2% Ketoconazole Anti-Dandruff Shampoo (100ml)',
    category_id: 'medicines',
    mrp: 16.99,
    selling_price: 12.99,
    stock_quantity: 110,
    brand: 'Cipla Healthcare',
    requires_prescription: false,
    image_url: '/products/ketocip-2-ketoconazole-shampoo.png',
    tags: ['Medicines', 'Anti-Dandruff', 'Ketoconazole', 'Scalp Care', 'Cipla'],
    composition: 'Ketoconazole IP 2.0% w/v in gentle foaming shampoo base',
    short_description: 'Broad-spectrum antifungal therapeutic shampoo for controlling stubborn dandruff, seborrheic dermatitis, and flaking.',
    description: 'Ketocip 2% Shampoo by Cipla is formulated with medical-grade Ketoconazole to eradicate Malassezia yeast on the scalp, relieving flaking, redness, and intense itching while maintaining scalp pH balance.',
  },
  {
    slug: 'zylopred-ophthalmic-suspension',
    name: 'Zylopred Ophthalmic Suspension Eye Drops (5ml)',
    category_id: 'medicines',
    mrp: 14.99,
    selling_price: 11.99,
    stock_quantity: 75,
    brand: 'Sun Pharma',
    requires_prescription: true,
    image_url: '/products/zylopred-ophthalmic-suspension.png',
    tags: ['Medicines', 'Eye Drops', 'Ophthalmic', 'Prescription', 'Sun Pharma'],
    composition: 'Gatifloxacin 0.3% w/v + Prednisolone Acetate IP 1.0% w/v',
    short_description: 'Steroid-antibiotic combination ophthalmic suspension for post-operative ocular inflammation and bacterial infection prevention.',
    description: 'Zylopred Eye Drops combine fourth-generation fluoroquinolone Gatifloxacin with anti-inflammatory Prednisolone to protect and heal ocular tissues post cataract or refractive surgery.',
  },
  {
    slug: 'derma-co-ceramide-ha-moisturizer',
    name: 'The Derma Co Ceramide + HA Intense Daily Moisturizer (100g)',
    category_id: 'skincare',
    mrp: 19.99,
    selling_price: 15.99,
    stock_quantity: 90,
    brand: 'The Derma Co',
    requires_prescription: false,
    image_url: '/products/derma-co-ceramide-ha-moisturizer.png',
    tags: ['Skincare', 'Ceramide', 'Moisturizer', 'Barrier Repair', 'Hyaluronic Acid'],
    composition: 'Ceramide Complex (1, 3, 6-II), Hyaluronic Acid, Phytosphingosine',
    short_description: 'Deeply nourishing barrier repair cream with ceramides and hyaluronic acid for locked-in 72-hour moisture.',
    description: 'Designed by dermatologists, The Derma Co Ceramide + HA Intense Moisturizer repairs dry, damaged skin barriers. Infused with essential ceramides and multi-molecular hyaluronic acid, it hydrates deep cellular layers without leaving a greasy residue.',
  },
  {
    slug: 'minimalist-vitamin-c-10-serum',
    name: 'Minimalist 10% Vitamin C Brightening Face Serum (30ml)',
    category_id: 'skincare',
    mrp: 21.99,
    selling_price: 16.99,
    stock_quantity: 130,
    brand: 'Minimalist',
    requires_prescription: false,
    image_url: '/products/minimalist-vitamin-c-10-serum.png',
    tags: ['Skincare', 'Vitamin C', 'Brightening Serum', 'Centella', 'Antioxidant'],
    composition: '10% Ethyl Ascorbic Acid (Vitamin C), 1% Acetyl Glucosamine, Centella Asiatica Water',
    short_description: 'Clinically formulated stable Vitamin C serum for bright complexion, reduced hyperpigmentation, and collagen synthesis.',
    description: 'Minimalist 10% Vitamin C Serum uses pure Ethyl Ascorbic Acid—a high-potency derivative with 86% pure Vitamin C content. Soothed with soothing Centella Asiatica water, it fades stubborn sun spots and boosts skin radiance.',
  },
  {
    slug: 'nutracitta-daily-multivitamin-gummy',
    name: 'Nutracitta Daily Multivitamin & Mineral Gummies (60 Gummies)',
    category_id: 'wellness',
    mrp: 25.99,
    selling_price: 19.99,
    stock_quantity: 80,
    brand: 'Nutracitta',
    requires_prescription: false,
    image_url: '/products/nutracitta-daily-multivitamin-gummy.png',
    tags: ['Wellness', 'Multivitamin', 'Gummies', 'Immunity', 'Daily Health'],
    composition: 'Vitamin A, C, D3, E, B6, B12, Folic Acid, Zinc, Biotin in pectin gummy base',
    short_description: 'Delicious natural fruit-flavored vegan gummy vitamins supplying 16 essential daily vitamins and minerals for active energy.',
    description: 'Nutracitta Daily Multivitamin Gummies are delicious pectin-based vegan gummies formulated with comprehensive vitamins A, C, D3, B-complex, zinc, and biotin to boost daily immunity, physical energy, and vibrant vitality.',
  },
  {
    slug: 'zandu-balm-pain-relief',
    name: 'Zandu Balm - Ayurvedic Fast Pain Relief (25ml)',
    category_id: 'pain-relief',
    mrp: 11.99,
    selling_price: 9.99,
    stock_quantity: 100,
    brand: 'Zandu Healthcare',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    tags: ['Zandu Balm', 'Ayurvedic', 'Pain Relief', 'Headache', 'Cold Relief'],
    composition: 'Mentha sp. - Satva (Peppermint) 14.0%, Gaultheria fragrantissima - OL. (Wintergreen Oil) 12.0%, Eucalyptus globulus - OL. (Nilgiri Oil) 0.80%',
    short_description: 'Authentic Ayurvedic balm providing fast and effective relief from headaches, body ache, and cold.',
    description: 'Zandu Balm is India’s trusted Ayurvedic formulation for over 100 years. Enriched with natural mentha and wintergreen oil, it soothes headache tension, joint ache, and muscle stiffness.',
  },
];

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

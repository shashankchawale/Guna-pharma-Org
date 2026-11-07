export interface MedicineCategory {
  id: string;
  name: string; // Uppercase user-facing category name
  label: string; // Title Case label
  shortDesc: string;
  keywords: string[];
}

export const MEDICINE_CATEGORIES: MedicineCategory[] = [
  {
    id: 'erectile-dysfunction',
    name: 'ERECTILE DYSFUNCTION',
    label: 'Erectile Dysfunction',
    shortDesc: 'Sildenafil, Tadalafil, Vidalista, Cenforce & PDE-5 therapies',
    keywords: ['erectile', 'dysfunction', 'sildenafil', 'tadalafil', 'vidalista', 'cenforce', 'kamagra', 'ed', 'pde-5'],
  },
  {
    id: 'steroids',
    name: 'STEROIDS',
    label: 'Steroids',
    shortDesc: 'Prednisolone, Dexamethasone, Omnacortil & anti-inflammatory corticoids',
    keywords: ['steroid', 'steroids', 'prednisolone', 'dexamethasone', 'corticosteroid', 'omnacortil', 'dexona', 'cortisone'],
  },
  {
    id: 'anti-anxiety',
    name: 'ANTI ANXIETY',
    label: 'Anti Anxiety',
    shortDesc: 'Etizolam, Alprazolam, Etilaam & anxiolytic calming treatments',
    keywords: ['anxiety', 'anti-anxiety', 'anti anxiety', 'etizolam', 'alprazolam', 'etilaam', 'alprax', 'calming', 'anxiolytic', 'stress'],
  },
  {
    id: 'anti-parasitic',
    name: 'ANTI PARASITIC',
    label: 'Anti Parasitic',
    shortDesc: 'Ivermectin, Albendazole, Ivecop, Zentel & anthelmintic anti-parasitics',
    keywords: ['parasitic', 'anti-parasitic', 'anti parasitic', 'ivermectin', 'albendazole', 'ivecop', 'zentel', 'anthelmintic', 'deworming'],
  },
  {
    id: 'pain-killers',
    name: 'PAIN KILLERS',
    label: 'Pain Killers',
    shortDesc: 'Tapentadol, Tramadol, Tydol, Ultracet & analgesic pain relief',
    keywords: ['pain', 'killer', 'killers', 'pain-killer', 'pain killers', 'painkillers', 'tapentadol', 'tramadol', 'tydol', 'ultracet', 'dolo', 'paracetamol', 'analgesic'],
  },
  {
    id: 'sleeping-pills',
    name: 'SLEEPING PILLS',
    label: 'Sleeping Pills',
    shortDesc: 'Zopiclone, Zolpidem, Zolfresh, Zopicone & clinical sleep onset therapies',
    keywords: ['sleeping', 'pills', 'sleeping-pills', 'sleeping pills', 'sleep', 'insomnia', 'zopiclone', 'zolpidem', 'zolfresh', 'zopicone'],
  },
  {
    id: 'weight-loss',
    name: 'WEIGHT LOSS',
    label: 'Weight Loss',
    shortDesc: 'Semaglutide, Orlistat, Rybelsus, Obelit & metabolic weight management',
    keywords: ['weight', 'loss', 'weight-loss', 'weight loss', 'semaglutide', 'orlistat', 'rybelsus', 'obelit', 'metabolism', 'slimming', 'fat-loss'],
  },
  {
    id: 'antibiotics',
    name: 'ANTIBIOTICS',
    label: 'Antibiotics',
    shortDesc: 'Augmentin, Azithromycin, Amoxicillin & broad spectrum antimicrobials',
    keywords: ['antibiotic', 'antibiotics', 'amoxicillin', 'clavulanate', 'augmentin', 'azithromycin', 'azithral', 'clindamycin', 'novaclind', 'antimicrobial'],
  },
  {
    id: 'anti-diabetics',
    name: 'ANTI DIABETICS',
    label: 'Anti Diabetics',
    shortDesc: 'Metformin, Glimepiride, Glycomet, Sitagliptin & glycemic regulation',
    keywords: ['diabetic', 'diabetics', 'anti-diabetic', 'anti diabetics', 'antidiabetic', 'diabetes', 'metformin', 'glimepiride', 'glycomet', 'sitagliptin', 'januvia', 'glycemic'],
  },
  {
    id: 'antihypertensive',
    name: 'ANTIHYPERTENSIVE',
    label: 'Antihypertensive',
    shortDesc: 'Telmisartan, Amlodipine, Telma, Amlong & blood pressure therapeutics',
    keywords: ['antihypertensive', 'hypertension', 'blood-pressure', 'blood pressure', 'telmisartan', 'amlodipine', 'telma', 'amlong', 'cardiovascular'],
  },
  {
    id: 'human-growth-hormones',
    name: 'HUMAN GROWTH HORMONES',
    label: 'Human Growth Hormones',
    shortDesc: 'Somatropin r-DNA, Norditropin, Genotropin & endocrine vitality',
    keywords: ['growth-hormones', 'growth hormones', 'human growth hormones', 'growth', 'hormones', 'hgh', 'somatropin', 'norditropin', 'genotropin', 'peptide'],
  },
  {
    id: 'skin-cream',
    name: 'SKIN CREAM',
    label: 'Skin Cream',
    shortDesc: 'Retino-A, Tretinoin, Skinlite, Hydroquinone, Benzac & dermatological topicals',
    keywords: ['skin-cream', 'skin cream', 'tretinoin', 'retino-a', 'hydroquinone', 'skinlite', 'benzoyl', 'benzac', 'cream', 'ointment', 'topical', 'dermatology'],
  },
  {
    id: 'antiemetics',
    name: 'ANTIEMETICS',
    label: 'Antiemetics',
    shortDesc: 'Ondansetron, Domperidone, Emeset, Vomistop & nausea suppression',
    keywords: ['antiemetics', 'antiemetic', 'ondansetron', 'domperidone', 'emeset', 'vomistop', 'nausea', 'vomiting', 'motion sickness'],
  },
];

export const MEDICINE_CATEGORY_IDS = MEDICINE_CATEGORIES.map((c) => c.id);

export function normalizeCategory(c?: string): string {
  if (!c) return '';
  return c.toLowerCase().trim().replace(/[\s_]+/g, '-');
}

/**
 * Checks whether a given product belongs to a specific medicine subcategory filter.
 * Strict category assignment: if a product has a selected category (e.g. 'pain-killers'),
 * it will ONLY show in that specific section and NEVER in 'steroids' or any other category.
 */
export function matchesMedicineCategory(
  product: {
    category_id?: string;
    category?: any;
    name?: string;
    composition?: string;
    tags?: string[];
    short_description?: string;
    description?: string;
    sku?: string;
  },
  categoryId: string
): boolean {
  if (!categoryId || categoryId === 'all') return true;

  const targetCat = normalizeCategory(categoryId);
  const rawCat = product.category_id || (typeof product.category === 'string' ? product.category : product.category?.id || '');
  const prodCat = normalizeCategory(rawCat);

  // If the target is the general 'medicines' overview, any medicine subcategory matches
  if (targetCat === 'medicines') {
    return prodCat === 'medicines' || MEDICINE_CATEGORY_IDS.includes(prodCat);
  }

  // Strict category enforcement: when a product has an assigned category,
  // it MUST match that exact category and never appear in other categories
  if (prodCat) {
    return prodCat === targetCat;
  }

  // Fallback ONLY for legacy items with no category assigned
  const targetCategory = MEDICINE_CATEGORIES.find((c) => c.id === targetCat);
  if (!targetCategory) return false;

  const textBlob = [
    product.name || '',
    product.composition || '',
    ...(product.tags || []),
    product.short_description || '',
    product.description || '',
    product.sku || '',
  ]
    .join(' ')
    .toLowerCase();

  return targetCategory.keywords.some((kw) => textBlob.includes(kw.toLowerCase()));
}

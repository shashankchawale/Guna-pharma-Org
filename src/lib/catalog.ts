import type { Product } from '@/types';

export const categories = [
  ['skincare', 'Skincare', 'Moisturisers, sunscreen & daily care', '✨'],
  ['hair-care', 'Hair Care', 'Shampoo, scalp & hair treatments', '💆'],
  ['body-care', 'Body Care', 'Gentle care from head to toe', '🫧'],
  ['vitamins', 'Vitamins & Supplements', 'Everyday wellness essentials', '🍊'],
  ['pain-relief', 'Pain Relief', 'Relief for everyday aches', '🩹'],
  ['cold-flu', 'Cold & Flu', 'Seasonal care essentials', '🌿'],
  ['digestive-health', 'Digestive Health', 'Comfort for your gut', '🌱'],
  ['first-aid', 'First Aid', 'Everyday home medical kit', '➕'],
] as const;

type Seed = [string, string, string, number, number, number, string, boolean, string[]];
const seed: Seed[] = [
  ['daily-hydration-gel', 'Daily Hydration Gel', 'skincare', 499, 399, 82, 'HydraLab', false, ['Hydration', 'Sensitive skin']],
  ['broad-spectrum-sunscreen-spf-50', 'Broad Spectrum Sunscreen SPF 50', 'skincare', 699, 559, 67, 'SunKind', false, ['Sun protection', 'No white cast']],
  ['vitamin-c-brightening-serum', 'Vitamin C Brightening Serum', 'skincare', 799, 639, 41, 'Glow Theory', false, ['Pigmentation', 'Antioxidant']],
  ['gentle-foaming-face-cleanser', 'Gentle Foaming Face Cleanser', 'skincare', 349, 279, 96, 'PureDerm', false, ['Acne care', 'Daily cleanser']],
  ['anti-dandruff-care-shampoo', 'Anti-Dandruff Care Shampoo', 'hair-care', 429, 349, 54, 'Scalp Science', false, ['Flake control', 'Hair care']],
  ['nourishing-hair-growth-serum', 'Nourishing Hair Growth Serum', 'hair-care', 899, 719, 29, 'Root & Ritual', false, ['Hair fall', 'Scalp care']],
  ['ceramide-body-lotion', 'Ceramide Body Lotion', 'body-care', 549, 439, 38, 'Skin Barrier Co.', false, ['Dry skin', 'Body care']],
  ['daily-multivitamin-tablets', 'Daily Multivitamin Tablets', 'vitamins', 499, 399, 120, 'WellFound', false, ['Immunity', 'Daily wellness']],
  ['vitamin-c-zinc-effervescent', 'Vitamin C + Zinc Effervescent', 'vitamins', 399, 319, 83, 'WellFound', false, ['Immunity', 'Vitamin C']],
  ['plant-protein-powder', 'Plant Protein Powder', 'vitamins', 1299, 1099, 35, 'Nourish Form', false, ['Protein', 'Fitness']],
  ['pain-relief-tablets', 'Pain Relief Tablets', 'pain-relief', 89, 72, 148, 'CareBasics', false, ['Headache', 'Pain relief']],
  ['topical-pain-relief-gel', 'Topical Pain Relief Gel', 'pain-relief', 169, 135, 91, 'CareBasics', false, ['Muscle ache', 'Joint care']],
  ['cold-relief-tablets', 'Cold Relief Tablets', 'cold-flu', 129, 103, 106, 'CareBasics', false, ['Cold & cough', 'Congestion']],
  ['herbal-cough-syrup', 'Herbal Cough Syrup', 'cold-flu', 159, 127, 69, 'Herbal Care', false, ['Cough care', 'Soothing']],
  ['digestive-enzyme-capsules', 'Digestive Enzyme Capsules', 'digestive-health', 399, 319, 57, 'Gut Good', false, ['Digestion', 'Bloating']],
  ['antacid-chewable-tablets', 'Antacid Chewable Tablets', 'digestive-health', 119, 95, 88, 'CareBasics', false, ['Acidity', 'Digestion']],
  ['antiseptic-solution', 'Antiseptic Solution', 'first-aid', 99, 79, 103, 'First Response', false, ['First aid', 'Wound care']],
  ['sterile-adhesive-bandages', 'Sterile Adhesive Bandages', 'first-aid', 139, 111, 75, 'First Response', false, ['First aid', 'Bandages']],
  ['gentle-baby-wash', 'Gentle Baby Wash', 'body-care', 369, 295, 48, 'Little Care', false, ['Baby care', 'Gentle']],
  ['mother-care-nipple-cream', 'Mother Care Nipple Cream', 'body-care', 459, 367, 24, 'Little Care', false, ['Mother care', 'Comfort']],
  ['prescription-skin-cream', 'Prescription Skin Treatment Cream', 'skincare', 699, 559, 13, 'Derm Care', true, ['Prescription', 'Skin care']],
  ['prescription-antibiotic-capsules', 'Prescription Antibiotic Capsules', 'cold-flu', 219, 175, 9, 'CareBasics', true, ['Prescription', 'Medical']],
  ['iron-folic-acid-tablets', 'Iron + Folic Acid Tablets', 'vitamins', 249, 199, 62, 'WellFound', false, ['Iron', 'Wellness']],
  ['daily-moisture-lip-balm', 'Daily Moisture Lip Balm', 'skincare', 199, 159, 109, 'PureDerm', false, ['Lip care', 'Hydration']],
];

export const products: Product[] = seed.map(([slug, name, categoryId, mrp, sellingPrice, stock, brand, requiresPrescription, tags], index) => ({
  id: `product-${index + 1}`,
  slug, name, category_id: categoryId, brand_id: brand.toLowerCase().replace(/\s/g, '-'),
  mrp, selling_price: sellingPrice, discount_percent: Math.round((1 - sellingPrice / mrp) * 100),
  stock_quantity: stock, low_stock_threshold: 12, sku: `GP-${String(index + 1).padStart(4, '0')}`,
  images: [], thumbnail_url: undefined, requires_prescription: requiresPrescription,
  short_description: `A thoughtfully formulated ${name.toLowerCase()} for your everyday routine.`,
  description: `A quality-assured product selected for your health and wellness routine. Read the label carefully and use as directed.`,
  composition: 'See product packaging for the full ingredient or composition list.',
  usage_instructions: 'Use as directed on the pack or by your healthcare professional.',
  warnings: requiresPrescription ? 'Use only with a valid prescription and your doctor’s advice.' : 'For external or oral use only as directed. Keep out of reach of children.',
  storage_instructions: 'Store in a cool, dry place away from direct sunlight.', manufacturer: brand,
  country_of_origin: 'India', is_active: true, is_featured: index < 8,
  rating_average: 4.2 + (index % 7) / 10, rating_count: 24 + index * 13, view_count: 0, sold_count: index * 8,
  tags, created_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-01T00:00:00.000Z',
}));

export function getProduct(slug: string) { return products.find((product) => product.slug === slug); }

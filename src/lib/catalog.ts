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
    name: 'Bontress PRO+ Scalp Serum | for Hair Growth & Density (60ml)',
    category_id: 'hair-care',
    mrp: 1200,
    selling_price: 999,
    stock_quantity: 45,
    brand: 'Glenmark Pharmaceuticals',
    requires_prescription: false,
    image_url: '/products/bontress-pro-scalp-serum.png',
    tags: ['Hair Serums', 'Anagain', 'Hair Fall', 'Scalp Care', 'Density'],
    composition: 'Redensyl, Procapil, Capixyl, Anagain (Advanced Biomimetic Peptides)',
    short_description: 'Clinically proven advanced scalp serum targeting hair loss, follicle reactivation and density.',
    description: 'Bontress PRO+ Scalp Serum is enriched with Redensyl, Procapil, Capixyl, and Anagain. It revitalizes weakened hair roots, reduces excessive thinning, and strengthens follicle anchors for visibly denser hair.',
  },
  {
    slug: 'mintop-forte-5-topical-solution',
    name: 'Mintop Forte 5% Topical Solution (Minoxidil) – 60ml',
    category_id: 'medicines',
    mrp: 850,
    selling_price: 720,
    stock_quantity: 60,
    brand: "Dr. Reddy's Laboratories",
    requires_prescription: true,
    image_url: '/products/mintop-forte-5-minoxidil.png',
    tags: ['Minoxidil', 'Hair Regrowth', 'Alopecia', 'Prescription', "Dr. Reddy's"],
    composition: 'Minoxidil IP 5% w/v',
    short_description: 'Potent vasodilator solution proven to stimulate follicular blood flow and promote hair regrowth.',
    description: 'Mintop Forte 5% is a trusted formulation by Dr. Reddy’s Laboratories containing pure Minoxidil 5%. It acts by dilating blood vessels around hair follicles, delivering vital nutrients to reverse hereditary hair thinning.',
  },
  {
    slug: 'benzoyl-peroxide-wash-benzac-ac-100ml',
    name: 'Benzoyl Peroxide Wash Bottle of 100 ml (Benzac AC 5% Gel Wash)',
    category_id: 'skincare',
    mrp: 495,
    selling_price: 420,
    stock_quantity: 55,
    brand: 'Galderma',
    requires_prescription: false,
    image_url: '/products/benzac-ac-gel-wash-benzoyl-peroxide.png',
    tags: ['Acne Treatment', 'Benzoyl Peroxide', 'Galderma', 'Breakouts', 'Cleanser'],
    composition: 'Benzoyl Peroxide IP 5% w/v in Acrylates Copolymer Gel',
    short_description: 'Fast-acting antimicrobial wash that eliminates acne-causing bacteria and unclogs pores.',
    description: 'Benzac AC 5% Gel Wash by Galderma contains Benzoyl Peroxide with advanced acrylates copolymer technology to absorb excess sebum while releasing glycerin to keep acne-prone skin comfortable and clear.',
  },
  {
    slug: 'miduty-liposomal-glutathione-capsules',
    name: 'Miduty Liposomal Glutathione 85% Capsule (60 Capsules)',
    category_id: 'vitamins',
    mrp: 2199,
    selling_price: 1850,
    stock_quantity: 35,
    brand: 'Miduty',
    requires_prescription: false,
    image_url: '/products/miduty-liposomal-glutathione.png',
    tags: ['Specialty Supplements', 'Glutathione', 'Antioxidant', 'Liver Detox', 'Skin Radiance'],
    composition: 'Liposomal Reduced L-Glutathione 500mg + Vitamin C 100mg',
    short_description: 'High-absorption liposomal glutathione for master cellular antioxidant defense and radiance.',
    description: 'Miduty Liposomal Glutathione uses advanced phospholipid encapsulation for optimal cellular bioavailability. It supports liver detoxification, neutralizes oxidative stress, and fosters healthy skin pigmentation.',
  },
  {
    slug: 'tata-1mg-triple-strength-omega-3',
    name: 'Tata 1mg Triple Strength Omega 3 Fish Oil 1250mg (60 Softgels)',
    category_id: 'vitamins',
    mrp: 799,
    selling_price: 549,
    stock_quantity: 80,
    brand: 'Tata 1mg',
    requires_prescription: false,
    image_url: '/products/tata-1mg-triple-strength-omega-3.png',
    tags: ['Vitamins & Minerals', 'Omega 3', 'Fish Oil', 'Heart Health', 'Brain Care'],
    composition: 'Fish Oil 1250mg delivering 560mg EPA + 400mg DHA (Total 960mg Triple Strength)',
    short_description: 'Ultra-pure molecularly distilled fish oil softgels for cardiovascular, brain, and joint wellness.',
    description: 'Tata 1mg Triple Strength Omega 3 provides high concentrations of pure EPA and DHA fatty acids in enterically coated softgels to prevent fishy burps while optimizing heart, brain, and eye health.',
  },
  {
    slug: 'ketocip-anti-dandruff-shampoo',
    name: 'Ketocip 2% Ketoconazole Anti-Dandruff Shampoo (100ml)',
    category_id: 'hair-care',
    mrp: 280,
    selling_price: 235,
    stock_quantity: 70,
    brand: 'Cipla',
    requires_prescription: false,
    image_url: '/products/ketocip-2-ketoconazole-shampoo.png',
    tags: ['Anti-Dandruff', 'Ketoconazole', 'Cipla', 'Flake Relief', 'Scalp Health'],
    composition: 'Ketoconazole IP 2% w/v',
    short_description: 'Medical-grade antifungal shampoo targeting stubborn flakes, itchy scalp, and seborrhea.',
    description: 'Ketocip 2% Shampoo by Cipla directly targets Malassezia yeast, the underlying root cause of stubborn dandruff and scalp flaking. Relieves persistent itching and restores scalp barrier balance.',
  },
  {
    slug: 'zylopred-ophthalmic-suspension',
    name: 'Zylopred Ophthalmic Suspension (Gatifloxacin + Loteprednol 5ml)',
    category_id: 'medicines',
    mrp: 240,
    selling_price: 195,
    stock_quantity: 50,
    brand: 'Allergan India',
    requires_prescription: true,
    image_url: '/products/zylopred-ophthalmic-suspension.png',
    tags: ['Ophthalmic Suspension', 'Eye Drops', 'Allergan', 'Infection Care', 'Prescription'],
    composition: 'Gatifloxacin 0.3% w/v + Loteprednol Etabonate 0.5% w/v',
    short_description: 'Dual-action sterile eye drops combining anti-infective and anti-inflammatory agents.',
    description: 'Zylopred is a sterile ophthalmic suspension prescribed for post-surgical ocular inflammatory conditions accompanied by surface bacterial infection risks. Formulated to high ophthalmic purity standards.',
  },
  {
    slug: 'the-derma-co-ceramide-ha-moisturizer',
    name: 'The Derma Co Ceramide + HA Intense Face Moisturizer (50g)',
    category_id: 'skincare',
    mrp: 399,
    selling_price: 349,
    stock_quantity: 75,
    brand: 'The Derma Co',
    requires_prescription: false,
    image_url: '/products/derma-co-ceramide-ha-moisturizer.png',
    tags: ['Barrier Moisturizer', 'Ceramides', 'Hyaluronic Acid', 'Dry Skin Repair'],
    composition: 'Ceramides complex, Hyaluronic Acid, Shea Butter',
    short_description: 'Intense 72-hour moisture lock cream repairing dry, sensitized and compromised skin barriers.',
    description: 'Designed by dermatologists, this rich non-comedogenic formulation delivers bio-identical ceramides and hyaluronic acid deep into the epidermal layers to seal moisture and calm irritation.',
  },
  {
    slug: 'minimalist-10-vitamin-c-face-serum',
    name: 'Minimalist 10% Vitamin C Face Serum with Centella (30ml)',
    category_id: 'skincare',
    mrp: 699,
    selling_price: 599,
    stock_quantity: 65,
    brand: 'Minimalist',
    requires_prescription: false,
    image_url: '/products/minimalist-vitamin-c-10-serum.png',
    tags: ['Facial Serum', 'Vitamin C', 'Minimalist', 'Brightening', 'Centella'],
    composition: 'Ethyl Ascorbic Acid 10%, Centella Asiatica Leaf Extract, Polyhydroxy Acid (PHA)',
    short_description: 'Highly stable, non-irritating Vitamin C serum for natural luminosity and hyperpigmentation reduction.',
    description: 'Formulated with 10% pure Ethyl Ascorbic Acid, a next-generation water-soluble Vitamin C derivative with 86% active ascorbic acid content, combined with soothing Centella Asiatica for even, glowing skin.',
  },
  {
    slug: 'nutracitta-daily-multivitamin-gummies',
    name: 'Nutracitta Daily Multivitamin Gummy with 16 Essential Vitamins (30 Gummies)',
    category_id: 'vitamins',
    mrp: 599,
    selling_price: 449,
    stock_quantity: 90,
    brand: 'Nutracitta',
    requires_prescription: false,
    image_url: '/products/nutracitta-daily-multivitamin-gummy.png',
    tags: ['Daily Wellness', 'Multivitamin', 'Gummies', 'Immunity Boost', 'Energy'],
    composition: '16 Essential Vitamins & Minerals including Vitamin A, C, D3, E, B12, Zinc & Biotin',
    short_description: 'Delicious strawberry-flavored chewable gummies for daily vitality, immunity, and healthy metabolism.',
    description: 'Nutracitta Daily Multivitamin Gummies make nutritional supplementation delightful. 100% vegetarian, gelatin-free pectin gummies packed with essential micronutrients for everyday stamina and resilience.',
  },
  {
    slug: 'dolo-650-paracetamol-tablets',
    name: 'Dolo 650 Paracetamol Tablets (15 Tablets Strip)',
    category_id: 'pain-relief',
    mrp: 34,
    selling_price: 30,
    stock_quantity: 140,
    brand: 'Micro Labs',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    tags: ['Dolo 650', 'Paracetamol', 'Fever', 'Headache', 'Pain Relief'],
    composition: 'Paracetamol IP 650mg',
    short_description: "India's most trusted paracetamol for fast relief from fever, headache, and body aches.",
    description: "Dolo 650 contains Paracetamol IP 650mg, the gold standard antipyretic and analgesic recommended by doctors across India for reducing fever and easing mild to moderate bodily discomfort.",
  },
  {
    slug: 'crocin-650-fast-relief-tablets',
    name: 'Crocin 650 Fast Relief Paracetamol (15 Tablets)',
    category_id: 'pain-relief',
    mrp: 36,
    selling_price: 31,
    stock_quantity: 110,
    brand: 'GlaxoSmithKline (GSK)',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
    tags: ['Crocin', 'Paracetamol', 'Fever', 'Fast Relief', 'GSK'],
    composition: 'Paracetamol IP 650mg with Optizorb Technology',
    short_description: 'Fast-dissolving paracetamol tablets for rapid fever and body pain relief.',
    description: 'Crocin 650 delivers fast relief from fever, toothaches, joint discomfort, and muscle strain. Formulated with Optizorb technology to begin dissolving in just 5 minutes.',
  },
  {
    slug: 'combiflam-tablets-pain-relief',
    name: 'Combiflam Pain Relief Tablets (20 Tablets)',
    category_id: 'pain-relief',
    mrp: 52,
    selling_price: 46,
    stock_quantity: 95,
    brand: 'Sanofi India',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    tags: ['Combiflam', 'Ibuprofen', 'Paracetamol', 'Joint Pain', 'Sanofi'],
    composition: 'Ibuprofen IP 400mg + Paracetamol IP 325mg',
    short_description: 'Dual-action medicine combining Ibuprofen and Paracetamol for muscular and joint aches.',
    description: 'Combiflam contains Ibuprofen and Paracetamol to tackle painful inflammation, severe dental pain, muscle sprains, and back pain with dual-action efficiency.',
  },
  {
    slug: 'volini-pain-relief-gel-50g',
    name: 'Volini Fast Pain Relief Gel with Diclofenac (50g)',
    category_id: 'pain-relief',
    mrp: 175,
    selling_price: 149,
    stock_quantity: 72,
    brand: 'Sun Pharma',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    tags: ['Volini', 'Diclofenac', 'Gel', 'Backache', 'Sprain', 'Sun Pharma'],
    composition: 'Diclofenac Diethylamine 1.16%, Linseed Oil 3%, Methyl Salicylate 10%, Menthol 5%',
    short_description: 'Quick-absorbing topical gel penetrating deep for immediate joint and muscular relief.',
    description: 'Volini Pain Relief Gel is engineered with micro-penetration technology for instant and long-lasting cooling relief from neck, shoulder, knee, and lower back strains.',
  },
  {
    slug: 'dot-and-key-watermelon-cooling-sunscreen-spf50',
    name: 'Dot & Key Watermelon Cooling Sunscreen SPF 50+ PA+++ (80g)',
    category_id: 'skincare',
    mrp: 595,
    selling_price: 495,
    stock_quantity: 68,
    brand: 'Dot & Key',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
    tags: ['Dot & Key', 'Sunscreen', 'SPF 50', 'Watermelon', 'No White Cast', 'Nykaa Bestseller'],
    composition: 'Watermelon Extract, Hyaluronic Acid, Uvinul A Plus, Tinosorb S',
    short_description: 'Ultra-lightweight cooling fluid sunscreen with zero white cast and broad-spectrum defense.',
    description: 'Bestselling sunscreen in India! Infused with juicy watermelon extracts and hyaluronic acid. Shields skin from UVA/UVB rays and blue light with a refreshing, dewy, grease-free finish.',
  },
  {
    slug: 'dot-and-key-barrier-repair-ceramides-cream',
    name: 'Dot & Key Ceramides & Hyaluronic Barrier Repair Face Cream (100g)',
    category_id: 'skincare',
    mrp: 495,
    selling_price: 395,
    stock_quantity: 55,
    brand: 'Dot & Key',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    tags: ['Dot & Key', 'Ceramides', 'Moisturizer', 'Skin Barrier', 'Hydration'],
    composition: '5 Essential Ceramides (1, 2, 3, 4, 6II), Japanese Rice Water, Hyaluronic Acid',
    short_description: 'Intense barrier repairing moisturizer formulated with 5 essential ceramides and hyaluronic acid.',
    description: 'Repairs compromised skin barriers, soothes dry flaky patches, and locks in deep hydration for up to 72 hours without clogging pores.',
  },
  {
    slug: 'dot-and-key-10-vitamin-c-glow-serum',
    name: 'Dot & Key 10% Vitamin C + E Glow Boosting Face Serum (30ml)',
    category_id: 'skincare',
    mrp: 695,
    selling_price: 560,
    stock_quantity: 42,
    brand: 'Dot & Key',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1608248597359-29a3977579a3?w=600&auto=format&fit=crop&q=80',
    tags: ['Dot & Key', 'Vitamin C', 'Glow Serum', 'Dark Spots', 'Brightening'],
    composition: '10% Triple Vitamin C Complex, Sicilian Blood Orange, Vitamin E, Ferulic Acid',
    short_description: 'Potent brightening antioxidant serum targeting dark spots and hyperpigmentation.',
    description: 'Fades post-acne pigmentation, corrects sun tan, and defends against free-radical damage to reveal a radiant, luminous complexion.',
  },
  {
    slug: 'loreal-paris-glycolic-bright-cleanser',
    name: 'L\'Oréal Paris Glycolic Bright Daily Foaming Cleanser (100ml)',
    category_id: 'skincare',
    mrp: 449,
    selling_price: 349,
    stock_quantity: 60,
    brand: 'L\'Oréal Paris',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    tags: ['L\'Oreal', 'Glycolic Acid', 'Face Wash', 'Dark Spots', 'Cleanser'],
    composition: 'Glycolic Acid IP, Glycerin, Niacinamide',
    short_description: 'Dermatologist-formulated daily cleanser to exfoliate dark spots and clear impurities.',
    description: 'Enriched with glycolic acid, the smallest AHA molecule, this creamy foaming cleanser gently exfoliates dead skin cells to visibly brighten skin day after day.',
  },
  {
    slug: 'loreal-paris-hyaluronic-acid-serum',
    name: 'L\'Oréal Paris 1.5% Hyaluronic Acid Plumping Face Serum (30ml)',
    category_id: 'skincare',
    mrp: 899,
    selling_price: 699,
    stock_quantity: 48,
    brand: 'L\'Oréal Paris',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    tags: ['L\'Oreal', 'Hyaluronic Acid', 'Face Serum', 'Anti-Aging', 'Bestseller'],
    composition: '0.5% Macro Hyaluronic Acid + 1.0% Micro Hyaluronic Acid',
    short_description: '#1 selling hyaluronic acid face serum in India for instantly plump, glowing skin.',
    description: 'Clinically proven to reduce fine lines by up to 60%. Delivers intense moisture penetration for bouncy, youthful, deeply hydrated skin without greasy residue.',
  },
  {
    slug: 'loreal-paris-extraordinary-oil-hair-serum',
    name: 'L\'Oréal Paris Extraordinary Oil Hair Serum (100ml)',
    category_id: 'hair-care',
    mrp: 649,
    selling_price: 499,
    stock_quantity: 52,
    brand: 'L\'Oréal Paris',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1608248597359-29a3977579a3?w=600&auto=format&fit=crop&q=80',
    tags: ['L\'Oreal', 'Hair Serum', 'Frizz Control', 'Floral Oils', 'Silky Hair'],
    composition: 'Blend of 6 Rare Precious Flower Oils (Rose, Chamomile, Lotus, Flax, Tiare, Sunflower)',
    short_description: 'Weightless salon hair serum for 48 hours of frizz control and dazzling shine.',
    description: 'A multi-use luxury hair serum that tames unruly hair, detangles effortlessly, and provides thermal protection before heat styling.',
  },
  {
    slug: 'cetaphil-gentle-skin-cleanser-125ml',
    name: 'Cetaphil Gentle Skin Cleanser for Sensitive Skin (125ml)',
    category_id: 'skincare',
    mrp: 399,
    selling_price: 355,
    stock_quantity: 70,
    brand: 'Cetaphil (Galderma)',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    tags: ['Cetaphil', 'Cleanser', 'Sensitive Skin', 'Dermatologist Tested', 'Soap-Free'],
    composition: 'Niacinamide, Panthenol (Pro-Vitamin B5), Hydrating Glycerin',
    short_description: 'Dermatologist-recommended creamy, non-foaming cleanser for dry to normal sensitive skin.',
    description: 'Hypoallergenic and fragrance-free. Clinically proven to continuously hydrate skin and defend against 5 signs of skin sensitivity.',
  },
  {
    slug: 'minimalist-10-niacinamide-zinc-serum',
    name: 'Minimalist 10% Niacinamide Face Serum with Zinc (30ml)',
    category_id: 'skincare',
    mrp: 599,
    selling_price: 569,
    stock_quantity: 50,
    brand: 'Minimalist',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    tags: ['Minimalist', 'Niacinamide', 'Zinc', 'Pore Tightening', 'Acne Marks'],
    composition: 'Pure Niacinamide 10%, Zinc PCA 1%, Fermented Rice Extract',
    short_description: 'Clinically proven daily serum for reducing acne marks, controlling sebum, and refining pores.',
    description: 'Features high-grade Vitamin B3 (Niacinamide) and Zinc PCA to balance oily shine, clear hyperpigmentation, and reinforce the epidermal barrier.',
  },
  {
    slug: 'plum-green-tea-pore-cleansing-facewash',
    name: 'Plum Green Tea Pore Cleansing Face Wash (100ml)',
    category_id: 'skincare',
    mrp: 345,
    selling_price: 295,
    stock_quantity: 64,
    brand: 'Plum Goodness',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    tags: ['Plum', 'Green Tea', 'Face Wash', 'Acne Prone', 'Cruelty Free'],
    composition: 'Green Tea Extract, Glycolic Acid, Soft Cellulose Micro-Beads',
    short_description: '100% vegan soap-free acne cleanser with antioxidant green tea and glycolic acid.',
    description: 'Gently cleanses excess oil and dead skin cells while combating breakout-causing bacteria without stripping your skin of moisture.',
  },
  {
    slug: 'derma-co-1-hyaluronic-sunscreen-aqua-gel',
    name: 'The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50 (50g)',
    category_id: 'skincare',
    mrp: 499,
    selling_price: 449,
    stock_quantity: 80,
    brand: 'The Derma Co',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
    tags: ['The Derma Co', 'Sunscreen', 'Aqua Gel', 'SPF 50', 'PA++++'],
    composition: '1% Hyaluronic Acid, Vitamin E, Titanium Dioxide, Zinc Oxide',
    short_description: 'Water-light gel sunscreen with SPF 50 and PA++++ broad-spectrum protection.',
    description: 'Feels like second skin! Packed with 1% hyaluronic acid, this non-greasy aqua gel protects from harmful UV rays and blue light with a refreshing cooling sensation.',
  },
  {
    slug: 'vicks-vaporub-relief-balm-50ml',
    name: 'Vicks VapoRub Cold & Cough Relief Balm (50ml)',
    category_id: 'cold-flu',
    mrp: 120,
    selling_price: 104,
    stock_quantity: 88,
    brand: 'Procter & Gamble (P&G)',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&auto=format&fit=crop&q=80',
    tags: ['Vicks', 'Cold', 'Cough', 'Menthol', 'Chest Rub', 'P&G'],
    composition: 'Camphor 5.26%, Menthol 2.82%, Eucalyptus Oil 1.33%',
    short_description: 'Ayurvedic balm providing multi-symptom relief from cold, cough, and nasal congestion.',
    description: 'Provides soothing thermal comfort on the chest, throat, and back. Fast-acting vapours clear blocked nasal airways to help you breathe easily.',
  },
  {
    slug: 'otrivin-oxy-fast-relief-nasal-spray',
    name: 'Otrivin Oxy Fast Relief Adult Nasal Spray (10ml)',
    category_id: 'cold-flu',
    mrp: 125,
    selling_price: 109,
    stock_quantity: 65,
    brand: 'GSK Consumer Healthcare',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&auto=format&fit=crop&q=80',
    tags: ['Otrivin', 'Nasal Spray', 'Blocked Nose', 'Sinusitis', 'GSK'],
    composition: 'Oxymetazoline Hydrochloride USP 0.05% w/v',
    short_description: 'Fast-action nasal spray that unblocks stuffy noses in 25 seconds for up to 12 hours.',
    description: 'Formulated with Oxymetazoline to shrink swollen nasal blood vessels, immediately clearing airflow during head colds, sinusitis, and allergies.',
  },
  {
    slug: 'digene-acidity-gas-tablets-orange',
    name: 'Digene Acidity & Gas Relief Chewable Tablets - Orange (15 Tabs)',
    category_id: 'digestive-health',
    mrp: 32,
    selling_price: 28,
    stock_quantity: 130,
    brand: 'Abbott Healthcare',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
    tags: ['Digene', 'Antacid', 'Gas Relief', 'Acidity', 'Orange Flavor', 'Abbott'],
    composition: 'Magnesium Hydroxide 25mg, Simethicone 25mg, Dried Aluminium Hydroxide Gel 300mg',
    short_description: 'Doctor-recommended chewable antacid providing fast relief from gas and heartburn.',
    description: 'Neutralises excess stomach acid and breaks up stubborn intestinal gas bubbles. Pleasant orange chewable tablets for rapid post-meal digestion comfort.',
  },
  {
    slug: 'gelusil-mps-mint-liquid-200ml',
    name: 'Gelusil MPS Antacid & Anti-Gas Liquid - Mint (200ml)',
    category_id: 'digestive-health',
    mrp: 145,
    selling_price: 126,
    stock_quantity: 58,
    brand: 'Pfizer Healthcare',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
    tags: ['Gelusil', 'Antacid Syrup', 'Heartburn', 'Gas', 'Pfizer', 'Sugar-Free'],
    composition: 'Aluminium Hydroxide, Dimethicone, Magnesium Hydroxide',
    short_description: 'Sugar-free cooling antacid liquid that relieves heartburn, acidity, and bloated stomach.',
    description: 'Trusted cooling relief formula that coats the oesophagus and stomach lining to counteract acid reflux and bloating within minutes.',
  },
  {
    slug: 'betadine-antiseptic-ointment-20g',
    name: 'Betadine 10% Antiseptic Ointment for Cuts & Wounds (20g)',
    category_id: 'first-aid',
    mrp: 135,
    selling_price: 118,
    stock_quantity: 76,
    brand: 'Win-Medicare',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80',
    tags: ['Betadine', 'Antiseptic', 'Povidone Iodine', 'First Aid', 'Wounds'],
    composition: 'Povidone-Iodine IP 10% w/w',
    short_description: 'Broad-spectrum microbicidal ointment that prevents infection in cuts, burns, and wounds.',
    description: 'Essential in every home medical kit. Kills bacteria, viruses, and fungi on contact to accelerate natural skin healing and prevent septic infection.',
  },
  {
    slug: 'band-aid-waterproof-bandages-pack-30',
    name: 'Band-Aid Waterproof Sterile Bandages (Pack of 30)',
    category_id: 'first-aid',
    mrp: 120,
    selling_price: 99,
    stock_quantity: 92,
    brand: 'Johnson & Johnson',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80',
    tags: ['Band-Aid', 'Waterproof Bandages', 'Sterile Strips', 'Johnson & Johnson'],
    composition: 'Non-stick pad with waterproof micro-perforated medical adhesive',
    short_description: '100% waterproof sterile adhesive bandages that shield cuts from water and dirt.',
    description: 'Stays firmly in place through showers, hand washing, and daily chores while keeping minor wounds sterile and dry.',
  },
  {
    slug: 'becosules-z-multivitamin-capsules',
    name: 'Becosules Z Multivitamin, B-Complex & Zinc (20 Capsules)',
    category_id: 'vitamins',
    mrp: 65,
    selling_price: 56,
    stock_quantity: 105,
    brand: 'Pfizer Healthcare',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1550572017-ed200f545dec?w=600&auto=format&fit=crop&q=80',
    tags: ['Becosules', 'B-Complex', 'Zinc', 'Immunity', 'Mouth Ulcers', 'Pfizer'],
    composition: 'Thiamine, Riboflavin, Niacinamide, Pyridoxine, Folic Acid, Vitamin C, Zinc Sulfate',
    short_description: 'Daily multivitamin and zinc complex to treat fatigue, mouth ulcers, and weakness.',
    description: 'Replenishes vital water-soluble vitamins lost during stress and exertion. Enhances cell regeneration, heals mouth ulcers, and boosts daily vitality.',
  },
  {
    slug: 'shelcal-500-calcium-vitamin-d3',
    name: 'Shelcal 500 Calcium with Vitamin D3 (15 Tablets)',
    category_id: 'vitamins',
    mrp: 155,
    selling_price: 136,
    stock_quantity: 84,
    brand: 'Torrent Pharmaceuticals',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=600&auto=format&fit=crop&q=80',
    tags: ['Shelcal', 'Calcium', 'Vitamin D3', 'Bone Health', 'Joint Support'],
    composition: 'Elemental Calcium 500mg, Vitamin D3 250 IU',
    short_description: 'Pure organic calcium with Vitamin D3 for bone strength, joint mobility, and teeth health.',
    description: 'Clinically proven bone supplement for adults and seniors. Enhances calcium absorption, prevents bone density loss, and strengthens teeth enamel.',
  },
  {
    slug: 'limcee-500-vitamin-c-chewable',
    name: 'Limcee 500mg Vitamin C Chewable Tablets - Orange (15 Tabs)',
    category_id: 'vitamins',
    mrp: 42,
    selling_price: 36,
    stock_quantity: 120,
    brand: 'Abbott Healthcare',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
    tags: ['Limcee', 'Vitamin C', 'Immunity', 'Antioxidant', 'Chewable', 'Abbott'],
    composition: 'Ascorbic Acid IP 100mg + Sodium Ascorbate IP 450mg',
    short_description: 'Delicious orange chewable Vitamin C for robust immunity and glowing skin collagen.',
    description: 'Vital antioxidant that helps ward off seasonal infections, neutralises free radicals, promotes wound healing, and enhances skin barrier radiance.',
  },
  {
    slug: 'evion-400-vitamin-e-capsules',
    name: 'Evion 400 Vitamin E Capsules for Face, Hair & Nails (10 Caps)',
    category_id: 'vitamins',
    mrp: 89,
    selling_price: 77,
    stock_quantity: 140,
    brand: 'P&G Health',
    requires_prescription: false,
    image_url: 'https://images.unsplash.com/photo-1550572017-ed200f545dec?w=600&auto=format&fit=crop&q=80',
    tags: ['Evion', 'Vitamin E', 'Skin Glow', 'Hair Nourishment', 'Antioxidant', 'P&G'],
    composition: 'Tocopheryl Acetate IP 400mg',
    short_description: 'India\'s #1 Vitamin E capsules for glowing skin, hair strength, and nail health.',
    description: 'Rich in lipid-soluble antioxidants that protect cells from oxidative stress. Can be taken orally or applied topically onto the skin and hair for deep nourishment.',
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
  usage_instructions: 'Use as directed on the packaging or as advised by your medical specialist.',
  warnings: p.requires_prescription
    ? 'Prescription item. Use strictly under the guidance of a registered medical practitioner.'
    : 'Read the label carefully. Store in a cool, dry place away from direct sunlight.',
  storage_instructions: 'Store below 25°C in a dry place. Protect from heat and moisture.',
  manufacturer: p.brand,
  country_of_origin: 'India',
  is_active: true,
  is_featured: index < 8,
  rating_average: Number((4.5 + (index % 5) * 0.1).toFixed(1)),
  rating_count: 85 + index * 24,
  view_count: 140 + index * 42,
  sold_count: 65 + index * 18,
  tags: p.tags,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
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
  // Check if already exists
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

  // Also check if any seed matches this id or slug
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
    if (!globalScope.__GUNA_DELETED_PRODUCT_IDS__.includes(matchingSeed.id.toLowerCase())) {
      globalScope.__GUNA_DELETED_PRODUCT_IDS__.push(matchingSeed.id.toLowerCase());
    }
    if (!globalScope.__GUNA_DELETED_PRODUCT_IDS__.includes(matchingSeed.slug.toLowerCase())) {
      globalScope.__GUNA_DELETED_PRODUCT_IDS__.push(matchingSeed.slug.toLowerCase());
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


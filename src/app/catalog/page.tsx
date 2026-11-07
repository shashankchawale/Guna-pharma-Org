'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  X,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Package,
  Layers,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useProductsStore } from '@/store/products';
import { ProductCard } from '@/components/product/product-card';
import { getAppBaseUrl, buildCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo';
import {
  MEDICINE_CATEGORIES,
  MEDICINE_CATEGORY_IDS,
  matchesMedicineCategory,
} from '@/lib/medicine-categories';

export interface CatalogCategoryItem {
  id: string;
  name: string;
  sub: string;
  emoji: string;
  badge?: string;
  bgGradient: string;
  iconBg: string;
}

const MEDICINE_CATALOG_ITEMS: CatalogCategoryItem[] = [
  {
    id: 'erectile-dysfunction',
    name: 'ERECTILE DYSFUNCTION',
    sub: 'Sildenafil & PDE-5',
    emoji: '⚡',
    badge: 'Popular',
    bgGradient: 'from-blue-50 to-indigo-50/60',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/20',
  },
  {
    id: 'steroids',
    name: 'STEROIDS',
    sub: 'Corticoids & Anti-inflamm',
    emoji: '💉',
    badge: 'Clinical',
    bgGradient: 'from-amber-50 to-orange-50/60',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/20',
  },
  {
    id: 'anti-anxiety',
    name: 'ANTI ANXIETY',
    sub: 'Etizolam & Alprazolam',
    emoji: '🧘',
    badge: 'Calm',
    bgGradient: 'from-teal-50 to-emerald-50/60',
    iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-teal-500/20',
  },
  {
    id: 'anti-parasitic',
    name: 'ANTI PARASITIC',
    sub: 'Ivermectin & Albendazole',
    emoji: '🔬',
    badge: 'Care',
    bgGradient: 'from-purple-50 to-violet-50/60',
    iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-purple-500/20',
  },
  {
    id: 'pain-killers',
    name: 'PAIN KILLERS',
    sub: 'Tapentadol & Tramadol',
    emoji: '🩹',
    badge: 'Relief',
    bgGradient: 'from-rose-50 to-red-50/60',
    iconBg: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/20',
  },
  {
    id: 'sleeping-pills',
    name: 'SLEEPING PILLS',
    sub: 'Zopiclone & Zolpidem',
    emoji: '🌙',
    badge: 'Night',
    bgGradient: 'from-indigo-50 to-sky-50/60',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-sky-600 text-white shadow-indigo-500/20',
  },
  {
    id: 'weight-loss',
    name: 'WEIGHT LOSS',
    sub: 'Semaglutide & Orlistat',
    emoji: '⚖️',
    badge: 'Metabolic',
    bgGradient: 'from-emerald-50 to-teal-50/60',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20',
  },
  {
    id: 'antibiotics',
    name: 'ANTIBIOTICS',
    sub: 'Amoxicillin & Azithral',
    emoji: '🛡️',
    badge: 'Rx',
    bgGradient: 'from-cyan-50 to-blue-50/60',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/20',
  },
  {
    id: 'anti-diabetics',
    name: 'ANTI DIABETICS',
    sub: 'Metformin & Glimepiride',
    emoji: '🩸',
    badge: 'Glycemic',
    bgGradient: 'from-red-50 to-pink-50/60',
    iconBg: 'bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-red-500/20',
  },
  {
    id: 'antihypertensive',
    name: 'ANTIHYPERTENSIVE',
    sub: 'Telmisartan & Amlodipine',
    emoji: '❤️',
    badge: 'Cardio',
    bgGradient: 'from-rose-50 to-orange-50/60',
    iconBg: 'bg-gradient-to-br from-rose-500 to-orange-600 text-white shadow-rose-500/20',
  },
  {
    id: 'human-growth-hormones',
    name: 'HUMAN GROWTH HORMONES',
    sub: 'Somatropin & Peptides',
    emoji: '🧬',
    badge: 'Vitality',
    bgGradient: 'from-violet-50 to-purple-50/60',
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-violet-500/20',
  },
  {
    id: 'skin-cream',
    name: 'SKIN CREAM',
    sub: 'Retino-A & Hydroquinone',
    emoji: '🧴',
    badge: 'Derma',
    bgGradient: 'from-pink-50 to-rose-50/60',
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-pink-500/20',
  },
  {
    id: 'antiemetics',
    name: 'ANTIEMETICS',
    sub: 'Ondansetron & Vomistop',
    emoji: '🌿',
    badge: 'Care',
    bgGradient: 'from-emerald-50 to-green-50/60',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-emerald-500/20',
  },
];

const CATALOG_CATEGORIES: CatalogCategoryItem[] = [
  {
    id: '',
    name: 'All Products',
    sub: 'Full Store',
    emoji: '🛍️',
    bgGradient: 'from-blue-50 to-indigo-50/60',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/20',
  },
  ...MEDICINE_CATALOG_ITEMS,
  {
    id: 'skincare',
    name: 'Skincare',
    sub: 'Derma & Creams',
    emoji: '✨',
    badge: 'Derma',
    bgGradient: 'from-sky-50 to-blue-50/60',
    iconBg: 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sky-500/20',
  },
  {
    id: 'beauty',
    name: 'Beauty Care',
    sub: 'Cosmetics',
    emoji: '💄',
    badge: 'Luxury',
    bgGradient: 'from-pink-50 to-fuchsia-50/60',
    iconBg: 'bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white shadow-pink-500/20',
  },
  {
    id: 'wellness',
    name: 'Wellness',
    sub: 'Vitamins & Health',
    emoji: '🍊',
    badge: 'Nutrition',
    bgGradient: 'from-orange-50 to-amber-50/60',
    iconBg: 'bg-gradient-to-br from-orange-400 to-amber-600 text-white shadow-orange-500/20',
  },
];

function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl border border-border/80 bg-white p-4 shadow-soft animate-pulse">
      <div className="relative aspect-square w-full rounded-2xl bg-slate-100" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-1/3 rounded bg-slate-100" />
        <div className="h-4 w-4/5 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
      <div className="mt-5 flex items-center justify-between pt-2 border-t border-slate-50">
        <div className="h-5 w-20 rounded bg-slate-200" />
        <div className="h-9 w-24 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawSearch = searchParams.get('search') ?? '';
  const selectedCategory = searchParams.get('category') ?? '';
  const [sortOption, setSortOption] = React.useState('relevant');
  const [userQuery, setUserQuery] = React.useState<string | null>(null);
  const searchInput = userQuery !== null ? userQuery : rawSearch;

  // Carousel scroll ref & state (Flipkart-style navigation)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const { products, isLoading, error, isHydrated, syncWithServer, clearError } =
    useProductsStore();

  React.useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    setUserQuery(null);
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.push(`/catalog?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setUserQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/catalog?${params.toString()}`);
  };

  const handleSelectCategory = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    router.push(`/catalog?${params.toString()}`);
  };

  const filtered = React.useMemo(() => {
    const searchTerms = rawSearch.toLowerCase().trim().split(/\s+/).filter(Boolean);

    let list = products.filter((product) => {
      // Category matching
      let matchesCategory = true;
      if (selectedCategory) {
        const prodCat = (product.category_id || (typeof product.category === 'string' ? product.category : '')).toLowerCase();
        const prodName = (product.name || '').toLowerCase();
        const prodTags = (product.tags || []).map((t) => (t || '').toLowerCase());

        if (MEDICINE_CATEGORY_IDS.includes(selectedCategory)) {
          matchesCategory = matchesMedicineCategory(product, selectedCategory);
        } else if (selectedCategory === 'medicines') {
          matchesCategory =
            MEDICINE_CATEGORY_IDS.includes(prodCat) ||
            prodCat === 'medicines' ||
            Boolean(product.requires_prescription);
        } else if (selectedCategory === 'beauty') {
          matchesCategory = prodCat === 'beauty';
        } else if (selectedCategory === 'skincare') {
          matchesCategory = prodCat === 'skincare';
        } else if (selectedCategory === 'wellness') {
          matchesCategory = prodCat === 'wellness';
        } else {
          matchesCategory = prodCat === selectedCategory;
        }
      }

      // Multi-word smart search matching
      const matchesSearch =
        searchTerms.length === 0 ||
        searchTerms.every((term) => {
          const searchableBlob = [
            product.name,
            product.composition || '',
            ...(product.tags || []),
            product.category_id,
            typeof product.category === 'string' ? product.category : '',
            product.manufacturer || '',
            product.brand_id || '',
            product.short_description || '',
            product.description || '',
            product.sku || '',
          ]
            .join(' ')
            .toLowerCase();

          return searchableBlob.includes(term);
        });

      return matchesCategory && matchesSearch;
    });

    // Sorting
    if (sortOption === 'price-low') {
      list = [...list].sort((a, b) => a.selling_price - b.selling_price);
    } else if (sortOption === 'price-high') {
      list = [...list].sort((a, b) => b.selling_price - a.selling_price);
    } else if (sortOption === 'discount') {
      list = [...list].sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0));
    } else if (sortOption === 'rating') {
      list = [...list].sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0));
    } else if (sortOption === 'newest') {
      list = [...list].sort(
        (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
    }

    return list;
  }, [products, selectedCategory, rawSearch, sortOption]);

  const currentCategory = CATALOG_CATEGORIES.find((c) => c.id === selectedCategory);
  const baseUrl = getAppBaseUrl();

  const dynamicCategorySchema = React.useMemo(() => {
    if (!selectedCategory || !currentCategory) return null;
    const catName = currentCategory.name;
    const items = filtered.slice(0, 15).map((p) => ({
      name: p.name,
      url: `${baseUrl}/product/${p.slug || p.id}`,
      description: p.short_description || p.description,
      image: p.thumbnail_url || p.images?.[0],
    }));

    return {
      collection: buildCollectionPageSchema({
        title: `${catName} | GUNA PHARMA`,
        description: `Browse authentic ${catName.toLowerCase()} and healthcare products at GUNA PHARMA. Doorstep delivery worldwide.`,
        url: `${baseUrl}/catalog?category=${selectedCategory}`,
        items,
      }),
      breadcrumbs: buildBreadcrumbSchema(
        [
          { name: 'Home', path: '/' },
          { name: 'Catalog', path: '/catalog' },
          { name: catName, path: `/catalog?category=${selectedCategory}` },
        ],
        baseUrl
      ),
    };
  }, [selectedCategory, currentCategory, filtered, baseUrl]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Dynamic Category Schema for active category filter */}
      {dynamicCategorySchema && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(dynamicCategorySchema.collection),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(dynamicCategorySchema.breadcrumbs),
            }}
          />
        </>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
            Medicines, Beauty & Healthcare Catalog
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Explore authentic medicines, premium beauty products, pain & fever care, clinical skincare, and wellness essentials.
          </p>
        </div>

        {/* Inline Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search medicines, skincare, wellness..."
              value={searchInput}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full h-11 rounded-2xl border border-border bg-white pl-10 pr-20 text-xs sm:text-sm text-navy placeholder:text-gray-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-12 p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 h-8 px-3 rounded-xl bg-primary text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-2xs"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-semibold">Catalog sync warning</p>
              <p className="text-xs text-amber-700">{error}. Displaying cached database items.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              clearError();
              syncWithServer();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-amber-700 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Flipkart-Style Visual Category Carousel */}
      <div className="relative mt-6 rounded-2xl border border-border/80 bg-white shadow-soft p-3 sm:p-4">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 grid h-9 w-9 place-items-center rounded-full bg-white shadow-lg border border-border text-navy hover:bg-slate-50 transition-all hover:scale-105 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-navy" />
          </button>
        )}

        {/* Scroll Right Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 grid h-9 w-9 place-items-center rounded-full bg-white shadow-lg border border-border text-navy hover:bg-slate-50 transition-all hover:scale-105 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-navy" />
          </button>
        )}

        {/* Carousel Items Row */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-center gap-2 sm:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1"
        >
          {CATALOG_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id || (!selectedCategory && !cat.id);
            return (
              <button
                key={cat.id || 'all'}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`group flex flex-col items-center shrink-0 w-[84px] sm:w-[96px] text-center transition-all cursor-pointer rounded-2xl p-2 ${
                  isActive
                    ? 'bg-blue-50/70 ring-2 ring-primary shadow-xs'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Squircle Icon Box */}
                <div className="relative mb-2 flex items-center justify-center">
                  <div
                    className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-b ${cat.bgGradient} p-1 shadow-sm transition-all duration-200 group-hover:scale-105 ${
                      isActive ? 'border-2 border-primary shadow-md' : 'border border-border/60'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl select-none filter drop-shadow-xs">
                      {cat.emoji}
                    </span>
                  </div>

                  {cat.badge && (
                    <span className="absolute -top-1 -right-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow-2xs leading-none">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <span
                  className={`text-xs font-bold truncate max-w-[80px] sm:max-w-[90px] leading-tight transition-colors ${
                    isActive ? 'text-primary' : 'text-navy group-hover:text-primary'
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-[10px] text-gray-400 font-medium truncate max-w-[80px] sm:max-w-[90px] mt-0.5">
                  {cat.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar: Item count & Sorting */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-3 bg-slate-50/70 rounded-2xl px-4">
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-navy">{filtered.length}</span> items
          </p>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
              {CATALOG_CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}
              <button
                type="button"
                onClick={() => handleSelectCategory('')}
                className="hover:text-rose-600 transition-colors ml-0.5"
                title="Clear category"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="h-8 rounded-lg border border-border bg-white px-2.5 text-xs text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs cursor-pointer"
            aria-label="Sort catalog"
          >
            <option value="relevant">Most relevant</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {(rawSearch || selectedCategory) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {rawSearch && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-primary">
              <span>Matching &ldquo;{rawSearch}&rdquo;</span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="hover:text-rose-600 transition-colors"
                title="Remove search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-border px-3 py-1 text-xs font-bold text-navy">
              <span>Category: {selectedCategory.replace(/-/g, ' ')}</span>
              <button
                type="button"
                onClick={() => handleSelectCategory('')}
                className="hover:text-rose-600 transition-colors"
                title="Remove category"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              handleClearSearch();
              handleSelectCategory('');
            }}
            className="text-xs font-bold text-gray-500 hover:text-navy underline ml-1 cursor-pointer"
          >
            Reset all
          </button>
        </div>
      )}

      {/* Products Grid / Loading State / Empty State */}
      {isLoading && !isHydrated ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-white p-10 sm:p-14 text-center shadow-xs">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-2xl text-primary mb-3">
            <Package className="h-7 w-7 text-primary/80" />
          </div>
          <h2 className="font-bold text-navy text-base sm:text-lg">No products found</h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            {rawSearch
              ? `We couldn't find any items matching "${rawSearch}".`
              : 'No items currently in this category.'}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                handleClearSearch();
                handleSelectCategory('');
              }}
              className="inline-flex rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-soft hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Clear Filters & View All
            </button>
            <button
              type="button"
              onClick={() => syncWithServer(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-navy hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Live Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-400">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
          <p className="text-sm font-semibold text-navy">Loading database catalog...</p>
        </div>
      }
    >
      <CatalogContent />
    </React.Suspense>
  );
}

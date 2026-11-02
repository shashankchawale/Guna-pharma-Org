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

export interface CatalogCategoryItem {
  id: string;
  name: string;
  sub: string;
  emoji: string;
  gradient: string;
}

const CATALOG_CATEGORIES: CatalogCategoryItem[] = [
  { id: '', name: 'All Store', sub: 'All items', emoji: '🛍️', gradient: 'from-blue-50 via-indigo-50/60 to-slate-50' },
  { id: 'medicines', name: 'Medicines', sub: 'Rx & Generic', emoji: '💊', gradient: 'from-rose-50 via-pink-50/60 to-slate-50' },
  { id: 'beauty', name: 'Beauty Care', sub: 'Cosmetics', emoji: '💄', gradient: 'from-pink-50 via-rose-50/60 to-slate-50' },
  { id: 'pain-relief', name: 'Pain & Fever', sub: 'Balms & Relief', emoji: '🩹', gradient: 'from-amber-50 via-orange-50/60 to-slate-50' },
  { id: 'cold-flu', name: 'Cold & Cough', sub: 'Inhalers & Care', emoji: '🌿', gradient: 'from-emerald-50 via-teal-50/60 to-slate-50' },
  { id: 'wellness', name: 'Wellness', sub: 'Vitamins & Health', emoji: '🍊', gradient: 'from-orange-50 via-amber-50/60 to-slate-50' },
  { id: 'hair-care', name: 'Hair Care', sub: 'Serums & Scalp', emoji: '💆', gradient: 'from-purple-50 via-indigo-50/60 to-slate-50' },
  { id: 'skincare', name: 'Skincare', sub: 'Derma & Face', emoji: '✨', gradient: 'from-sky-50 via-cyan-50/60 to-slate-50' },
  { id: 'digestive-health', name: 'Digestion', sub: 'Antacids & Gut', emoji: '🌱', gradient: 'from-lime-50 via-emerald-50/60 to-slate-50' },
  { id: 'first-aid', name: 'First Aid', sub: 'Antiseptics', emoji: '➕', gradient: 'from-red-50 via-rose-50/60 to-slate-50' },
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

        if (selectedCategory === 'medicines') {
          matchesCategory =
            ['medicines', 'pharma', 'pain-relief', 'cold-flu', 'first-aid', 'digestive-health'].includes(prodCat) ||
            Boolean(product.requires_prescription) ||
            prodTags.includes('medicines');
        } else if (selectedCategory === 'beauty') {
          matchesCategory =
            ['beauty', 'cosmetics', 'hair-care', 'skincare', 'makeup'].includes(prodCat) ||
            prodTags.some((t) => ['beauty', 'cosmetics', 'makeup'].includes(t));
        } else if (selectedCategory === 'pain-relief') {
          matchesCategory =
            ['pain-relief', 'pain', 'fever'].includes(prodCat) ||
            prodTags.some((t) => t.includes('pain') || t.includes('balm') || t.includes('relief') || t.includes('fever')) ||
            prodName.includes('balm') || prodName.includes('pain') || prodName.includes('tydol') || prodName.includes('paracetamol');
        } else if (selectedCategory === 'cold-flu') {
          matchesCategory =
            ['cold-flu', 'cold', 'cough'].includes(prodCat) ||
            prodTags.some((t) => t.includes('cold') || t.includes('cough') || t.includes('inhaler')) ||
            prodName.includes('cold') || prodName.includes('cough') || prodName.includes('balm');
        } else if (selectedCategory === 'wellness') {
          matchesCategory =
            ['wellness', 'vitamins', 'supplements', 'ayurveda', 'herbal'].includes(prodCat) ||
            prodTags.some((t) => t.includes('wellness') || t.includes('vitamin') || t.includes('omega') || t.includes('gumm') || t.includes('antioxidant')) ||
            prodName.includes('omega') || prodName.includes('glutathione') || prodName.includes('gummy') || prodName.includes('multivitamin');
        } else if (selectedCategory === 'hair-care') {
          matchesCategory =
            ['hair-care', 'hair'].includes(prodCat) ||
            prodTags.some((t) => t.includes('hair') || t.includes('scalp') || t.includes('shampoo') || t.includes('minoxidil')) ||
            prodName.includes('serum') || prodName.includes('shampoo') || prodName.includes('minoxidil') || prodName.includes('bontress');
        } else if (selectedCategory === 'skincare') {
          matchesCategory =
            ['skincare', 'body-care', 'skin'].includes(prodCat) ||
            prodTags.some((t) => t.includes('skin') || t.includes('serum') || t.includes('acne') || t.includes('moisturizer')) ||
            prodName.includes('serum') || prodName.includes('wash') || prodName.includes('moisturizer') || prodName.includes('ceramide');
        } else if (selectedCategory === 'digestive-health') {
          matchesCategory =
            ['digestive-health', 'digestion'].includes(prodCat) ||
            prodTags.some((t) => t.includes('digest') || t.includes('antacid') || t.includes('gut')) ||
            prodName.includes('digest');
        } else if (selectedCategory === 'first-aid') {
          matchesCategory =
            ['first-aid', 'wound-care'].includes(prodCat) ||
            prodTags.some((t) => t.includes('first-aid') || t.includes('antiseptic') || t.includes('bandage')) ||
            prodName.includes('betadine') || prodName.includes('bandage');
        } else {
          matchesCategory = prodCat === selectedCategory || prodTags.includes(selectedCategory);
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

      return matchesCategory && matchesAvailability && matchesSearch;
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
  }, [products, selectedCategory, rawSearch, availabilityFilter, sortOption]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              DATABASE-BACKED CATALOG
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {source === 'supabase' ? 'Supabase Live' : 'Dynamic Database'}
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-navy">
            Medicines, Beauty & Healthcare Catalog
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Real-time catalog supporting medicines, premium beauty products, clinical skincare, and wellness essentials.
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

      {/* Category Navigation Pills */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATALOG_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id || (!selectedCategory && !cat.id);
          return (
            <button
              key={cat.id || 'all'}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className={`whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'border-primary bg-primary text-white shadow-soft'
                  : 'border-border bg-white text-gray-700 hover:bg-primary-light hover:text-primary'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar: Availability, Stats & Sorting */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-3 bg-slate-50/70 rounded-2xl px-4">
        {/* Availability Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs text-gray-500 font-bold mr-1 hidden sm:inline">Filter:</span>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'in-stock', label: 'In Stock' },
            { id: 'otc', label: 'OTC Non-Rx' },
            { id: 'rx', label: 'Prescription (Rx)' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAvailabilityFilter(item.id as any)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                availabilityFilter === item.id
                  ? 'bg-navy text-white shadow-2xs'
                  : 'bg-white text-gray-600 border border-border/80 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Counter & Sorter */}
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-500 font-medium hidden sm:inline">
            <span className="font-bold text-navy">{filtered.length}</span> items
          </p>

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
      </div>

      {/* Active Filter Tags */}
      {(rawSearch || selectedCategory || availabilityFilter !== 'all') && (
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

          {availabilityFilter !== 'all' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-border px-3 py-1 text-xs font-bold text-navy">
              <span>
                Filter:{' '}
                {availabilityFilter === 'in-stock'
                  ? 'In Stock Only'
                  : availabilityFilter === 'rx'
                  ? 'Prescription Only'
                  : 'OTC Non-Rx'}
              </span>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('all')}
                className="hover:text-rose-600 transition-colors"
                title="Reset availability filter"
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
              setAvailabilityFilter('all');
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
              ? `We couldn't find any items matching "${rawSearch}" under the chosen criteria.`
              : 'No items are currently active in this category or availability filter.'}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                handleClearSearch();
                handleSelectCategory('');
                setAvailabilityFilter('all');
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

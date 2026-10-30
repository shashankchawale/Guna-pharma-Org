'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, Search, X } from 'lucide-react';
import { useProductsStore } from '@/store/products';
import { ProductCard } from '@/components/product/product-card';

function WellnessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawSearch = searchParams.get('search') ?? '';
  const [userQuery, setUserQuery] = React.useState<string | null>(null);
  const searchInput = userQuery !== null ? userQuery : rawSearch;

  const { products, syncWithServer } = useProductsStore();

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
    router.push(`/wellness?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setUserQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/wellness?${params.toString()}`);
  };

  const wellnessProducts = React.useMemo(() => {
    const searchTerms = rawSearch.toLowerCase().trim().split(/\s+/).filter(Boolean);

    return products.filter((product) => {
      const isWellness =
        product.category_id === 'vitamins' ||
        product.category_id === 'wellness' ||
        product.tags.some(
          (t) =>
            t.toLowerCase().includes('wellness') ||
            t.toLowerCase().includes('immunity') ||
            t.toLowerCase().includes('vitamin') ||
            t.toLowerCase().includes('nutrition') ||
            t.toLowerCase().includes('supplement')
        );

      if (!isWellness) return false;

      if (searchTerms.length > 0) {
        const textBlob = [
          product.name,
          product.composition || '',
          product.manufacturer || '',
          product.brand_id || '',
          ...(product.tags || []),
          product.short_description || '',
          product.description || '',
          product.sku || '',
        ]
          .join(' ')
          .toLowerCase();

        return searchTerms.every((term) => textBlob.includes(term));
      }

      return true;
    });
  }, [products, rawSearch]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-navy">Wellness & Nutrition</span>
      </nav>

      {/* Hero Banner for Wellness Department */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005AD2] via-[#0066E8] to-[#004BB8] p-6 sm:p-8 text-white shadow-card mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Vitamins, Supplements & Daily Wellness
            </h1>
          </div>
          <div className="relative shrink-0 w-full md:w-72 lg:w-80 h-44 sm:h-48 md:h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
            <Image
              src="/category-wellness.jpg"
              alt="Vitamins, Supplements & Daily Wellness"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Search and Products Counter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm font-medium text-gray-500">
          Showing <span className="font-bold text-navy">{wellnessProducts.length}</span> wellness & nutritional essentials
          {rawSearch && (
            <span className="ml-1 text-primary">
              matching &ldquo;{rawSearch}&rdquo;
            </span>
          )}
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search vitamins, omega, minerals..."
              value={searchInput}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full h-10 rounded-2xl border border-border bg-white pl-10 pr-20 text-xs sm:text-sm text-navy placeholder:text-gray-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
              className="absolute right-1.5 h-7 px-2.5 rounded-xl bg-primary text-[11px] font-bold text-white hover:bg-primary-hover transition-colors shadow-2xs"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Product Grid */}
      {wellnessProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {wellnessProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center">
          <h3 className="font-bold text-navy text-lg">No wellness products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {rawSearch ? `No wellness items match "${rawSearch}". Try another keyword or browse all catalog products.` : 'Check back soon for newly added items.'}
          </p>
          {rawSearch && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-navy hover:bg-gray-200 transition-colors"
              >
                Clear Search
              </button>
              <Link
                href={`/catalog?search=${encodeURIComponent(rawSearch)}`}
                className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-soft"
              >
                Search Entire Catalog
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function WellnessPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen p-8 text-center text-sm text-gray-500">Loading wellness products...</div>}>
      <WellnessContent />
    </React.Suspense>
  );
}

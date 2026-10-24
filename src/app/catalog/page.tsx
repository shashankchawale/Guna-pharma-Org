'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { categories } from '@/lib/catalog';
import { useProductsStore } from '@/store/products';
import { ProductCard } from '@/components/product/product-card';

function CatalogContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() ?? '';
  const selectedCategory = searchParams.get('category') ?? '';
  const [sortOption, setSortOption] = React.useState('relevant');

  const { products, syncWithServer } = useProductsStore();

  React.useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  const filtered = React.useMemo(() => {
    let list = products.filter((product) => {
      const matchesCategory =
        !selectedCategory ||
        product.category_id === selectedCategory ||
        (selectedCategory === 'medicines' &&
          ['medicines', 'pain-relief', 'cold-flu', 'digestive-health', 'first-aid'].includes(
            product.category_id
          ));

      const matchesSearch =
        !search ||
        `${product.name} ${product.tags.join(' ')} ${product.category_id} ${product.manufacturer || ''}`
          .toLowerCase()
          .includes(search);

      return matchesCategory && matchesSearch;
    });

    if (sortOption === 'price-low') {
      list = [...list].sort((a, b) => a.selling_price - b.selling_price);
    } else if (sortOption === 'price-high') {
      list = [...list].sort((a, b) => b.selling_price - a.selling_price);
    }

    return list;
  }, [products, selectedCategory, search, sortOption]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <p className="text-sm font-bold text-primary">SHOP</p>
      <h1 className="mt-1 text-3xl font-bold text-navy">Everyday Health & Beauty</h1>
      <p className="mt-2 text-gray-600">
        Discover carefully selected essentials for your daily healthcare routine.
      </p>

      {/* Category Pills */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[['', 'All products'], ...categories.map(([slug, name]) => [slug, name])].map(
          ([slug, name]) => {
            const isActive = selectedCategory === slug || (!selectedCategory && !slug);
            return (
              <Link
                key={slug}
                href={slug ? `/catalog?category=${slug}` : '/catalog'}
                className={`whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-primary bg-primary text-white shadow-soft'
                    : 'border-border bg-white text-gray-700 hover:bg-primary-light hover:text-primary'
                }`}
              >
                {name}
              </Link>
            );
          }
        )}
      </div>

      {/* Filter Stats & Sorter */}
      <div className="mt-7 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-bold text-navy">{filtered.length}</span> products
          {search && (
            <span>
              {' '}
              matching &ldquo;<span className="font-semibold text-primary">{search}</span>&rdquo;
            </span>
          )}
        </p>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="h-10 rounded-xl border border-border bg-white px-3 text-xs sm:text-sm text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Sort products"
        >
          <option value="relevant">Most relevant</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>

      {/* Products Grid */}
      {filtered.length ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-white p-12 text-center shadow-xs">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-2xl text-primary mb-3">
            🔍
          </div>
          <h2 className="font-bold text-navy text-lg">No products found</h2>
          <p className="mt-1 text-sm text-gray-500">
            We couldn&apos;t find any items matching your criteria. Try another search or category.
          </p>
          <Link
            href="/catalog"
            className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-soft hover:bg-primary-hover"
          >
            Clear Filters & View All
          </Link>
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
          <p className="text-sm font-semibold text-navy">Loading catalog...</p>
        </div>
      }
    >
      <CatalogContent />
    </React.Suspense>
  );
}

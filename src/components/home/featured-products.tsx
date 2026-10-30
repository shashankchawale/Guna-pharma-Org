'use client';

import * as React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/product-card';
import { useProductsStore } from '@/store/products';
import { useIsMounted } from '@/lib/utils';
import type { Product } from '@/types';

interface FeaturedProductsProps {
  initialProducts?: Product[];
}

export function FeaturedProducts({ initialProducts = [] }: FeaturedProductsProps) {
  const { products, deletedProductIds, isHydrated, syncWithServer } = useProductsStore();
  const mounted = useIsMounted();

  React.useEffect(() => {
    syncWithServer();

    const handleRefresh = () => {
      syncWithServer();
    };

    window.addEventListener('storage', handleRefresh);
    window.addEventListener('guna-product-deleted', handleRefresh);
    return () => {
      window.removeEventListener('storage', handleRefresh);
      window.removeEventListener('guna-product-deleted', handleRefresh);
    };
  }, [syncWithServer]);

  // Determine active products list:
  // On SSR and initial client hydration pass, strictly render initialProducts.slice(0, 8)
  // so server HTML and client initial DOM match 100%
  const displayProducts = React.useMemo(() => {
    if (!mounted) {
      return initialProducts.slice(0, 8);
    }

    const deletedSet = new Set(
      (deletedProductIds || []).map((d) => (d || '').trim().toLowerCase()).filter(Boolean)
    );

    try {
      const storedDeleted = localStorage.getItem('guna_deleted_product_ids');
      if (storedDeleted) {
        const parsed = JSON.parse(storedDeleted);
        if (Array.isArray(parsed)) {
          parsed.forEach((d) => {
            if (d) deletedSet.add(String(d).trim().toLowerCase());
          });
        }
      }
    } catch {}

    const source = isHydrated && products.length > 0 ? products : initialProducts;

    return source
      .filter((p) => {
        const idLower = (p.id || '').trim().toLowerCase();
        const slugLower = (p.slug || '').trim().toLowerCase();
        return !deletedSet.has(idLower) && !deletedSet.has(slugLower);
      })
      .slice(0, 8);
  }, [mounted, isHydrated, products, initialProducts, deletedProductIds]);

  if (displayProducts.length === 0 && mounted) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-primary">OUR SELECTION</p>
            <h2 className="mt-1 text-2xl font-bold text-navy">Featured products</h2>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-primary">
            View all
          </Link>
        </div>
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-white p-12 text-center text-sm text-gray-500">
          No featured products available at this time.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-bold text-primary">OUR SELECTION</p>
          <h2 className="mt-1 text-2xl font-bold text-navy">Featured products</h2>
        </div>
        <Link href="/catalog" className="text-sm font-semibold text-primary">
          View all
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {displayProducts.map((product) => (
          <ProductCard key={product.id || product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

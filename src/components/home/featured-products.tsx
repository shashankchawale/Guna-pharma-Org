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
  // Render up to 12 featured products, prioritizing user-added products
  const displayProducts = React.useMemo(() => {
    const deletedSet = new Set(
      (deletedProductIds || []).map((d) => (d || '').trim().toLowerCase()).filter(Boolean)
    );

    if (mounted) {
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
    }

    const source = mounted && isHydrated && products.length > 0 ? products : initialProducts;

    const filtered = source.filter((p) => {
      const idLower = (p.id || '').trim().toLowerCase();
      const slugLower = (p.slug || '').trim().toLowerCase();
      return !deletedSet.has(idLower) && !deletedSet.has(slugLower);
    });

    // Prioritize user-added products (like Tydol 100 Tablet) and products marked is_featured
    const userAdded = filtered.filter((p) => p.id?.startsWith('prod-'));
    const featuredItems = filtered.filter((p) => !p.id?.startsWith('prod-') && p.is_featured);
    const standardItems = filtered.filter((p) => !p.id?.startsWith('prod-') && !p.is_featured);

    const ordered = [...userAdded, ...featuredItems, ...standardItems];
    return ordered.slice(0, 12);
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
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id || product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useProductsStore } from '@/store/products';
import { ProductCard } from '@/components/product/product-card';

export default function WellnessPage() {
  const { products, syncWithServer } = useProductsStore();

  React.useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  const wellnessProducts = React.useMemo(() => {
    return products.filter(
      (product) =>
        product.category_id === 'vitamins' ||
        product.tags.some(
          (t) =>
            t.toLowerCase().includes('wellness') ||
            t.toLowerCase().includes('immunity') ||
            t.toLowerCase().includes('vitamin') ||
            t.toLowerCase().includes('nutrition')
        )
    );
  }, [products]);

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005AD2] via-[#0066E8] to-[#004BB8] p-6 sm:p-10 text-white shadow-card mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-blue-100 backdrop-blur-sm mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>NUTRITIONAL HEALTH & WELLBEING</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Vitamins, Supplements & Daily Wellness
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 leading-relaxed">
            Elevate your energy, immunity, and overall well-being with clinically formulated vitamins, minerals, plant-based proteins, and vital nutrients.
          </p>
        </div>
      </div>

      {/* Products Counter */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          Showing <span className="font-bold text-navy">{wellnessProducts.length}</span> wellness & nutritional essentials
        </p>
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
          <p className="mt-1 text-sm text-gray-500">Check back soon for newly added items.</p>
        </div>
      )}
    </div>
  );
}

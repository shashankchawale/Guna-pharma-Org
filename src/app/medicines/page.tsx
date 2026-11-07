'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, Filter, ShieldAlert, Sparkles } from 'lucide-react';
import { useProductsStore } from '@/store/products';
import {
  MEDICINE_CATEGORIES,
  MEDICINE_CATEGORY_IDS,
  matchesMedicineCategory,
} from '@/lib/medicine-categories';
import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/types';

const subcategories = [
  { id: 'all', label: 'All Medicines', name: 'ALL MEDICINES' },
  ...MEDICINE_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    name: c.name,
  })),
];

function MedicinesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'all';
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const { products, syncWithServer } = useProductsStore();

  // Sync with API on mount to catch any server-side additions
  React.useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  // Determine if a product belongs in the Medicines department
  const isMedicineProduct = React.useCallback((product: Product) => {
    // 1. Explicit medicine categories or subcategories
    if (product.category_id === 'medicines' || MEDICINE_CATEGORY_IDS.includes(product.category_id)) {
      return true;
    }

    // 2. Prescription required items
    if (product.requires_prescription) return true;

    // 3. User created admin products under medicine categories
    if (product.id?.startsWith('prod-') && (
      product.category_id === 'medicines' ||
      MEDICINE_CATEGORY_IDS.includes(product.category_id)
    )) {
      return true;
    }

    // 4. Keyword heuristic on name/tags/composition/sku
    const textBlob = `${product.name} ${product.category_id} ${product.composition || ''} ${(product.tags || []).join(' ')} ${product.short_description || ''}`.toLowerCase();
    const medicineRegex = /(medicine|pharma|tablet|capsule|syrup|paracetamol|crocin|dolo|ibuprofen|fever|cough|flu|antacid|digestive|ointment|antiseptic|pain|wound|antibiotic|rx|drops|gel|cream|suspension|spray|inhaler|injection|insulin|dose|mg|ml|sildenafil|tadalafil|steroid|prednisolone|dexamethasone|etizolam|alprazolam|ivermectin|albendazole|tapentadol|tramadol|zopiclone|zolpidem|semaglutide|orlistat|amoxicillin|azithromycin|metformin|telmisartan|somatropin|tretinoin|ondansetron|domperidone)/i;
    return medicineRegex.test(textBlob);
  }, []);

  const medicineProducts = React.useMemo(() => {
    const searchTerms = searchQuery.trim().split(/\s+/).filter(Boolean);

    return products.filter((product) => {
      if (!isMedicineProduct(product)) return false;

      if (searchTerms.length > 0) {
        const text = `${product.name} ${product.composition || ''} ${(product.tags || []).join(' ')} ${product.category_id} ${product.manufacturer || ''} ${product.sku || ''}`.toLowerCase();
        const matchesSearch = searchTerms.every((t) => text.includes(t));
        if (!matchesSearch) return false;
      }

      if (currentFilter === 'all') return true;
      return matchesMedicineCategory(product, currentFilter);
    });
  }, [products, currentFilter, isMedicineProduct, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/medicines" className="hover:text-primary transition-colors">
          Medicines
        </Link>
        {currentFilter !== 'all' && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-navy">
              {subcategories.find((s) => s.id === currentFilter)?.label || currentFilter}
            </span>
          </>
        )}
      </nav>

      {/* Hero Banner for Pharmacy Department */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005AD2] via-[#0066E8] to-[#004BB8] p-6 sm:p-8 text-white shadow-card mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Clinical Medicines & Therapeutics
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-lg">
              Explore 13 therapeutic categories including Erectile Dysfunction, Steroids, Anti Anxiety, Antibiotics, Pain Killers, and more.
            </p>
          </div>
          <div className="relative shrink-0 w-full md:w-72 lg:w-80 h-44 sm:h-48 md:h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
            <Image
              src="/hero-poster-medicines.jpg"
              alt="Quality Clinical Medicines & First Aid"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Subcategory Filter Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {subcategories.map((sub) => {
          const isActive = currentFilter === sub.id;
          return (
            <Link
              key={sub.id}
              href={sub.id === 'all' ? '/medicines' : `/medicines?filter=${sub.id}`}
              className={`whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-bold tracking-tight transition-all uppercase ${
                isActive
                  ? 'border-primary bg-primary text-white shadow-soft scale-[1.02]'
                  : 'border-border bg-white text-gray-700 hover:bg-blue-50/80 hover:text-primary hover:border-blue-200'
              }`}
            >
              {sub.name}
            </Link>
          );
        })}
      </div>

      {/* Search and Products Counter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Showing <span className="font-bold text-navy">{medicineProducts.length}</span> verified medicines
            {currentFilter !== 'all' && (
              <span className="ml-1 text-primary font-bold">
                in {subcategories.find((s) => s.id === currentFilter)?.name || currentFilter.toUpperCase()}
              </span>
            )}
            {searchQuery && (
              <span className="ml-1 text-gray-600">
                matching &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </p>
          {(currentFilter !== 'all' || searchQuery) && (
            <Link
              href="/medicines"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 mt-0.5"
            >
              <span>Reset all filters</span>
            </Link>
          )}
        </div>

        {/* Medicines Search Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const input = form.elements.namedItem('medicineSearch') as HTMLInputElement;
            const val = input.value.trim();
            const params = new URLSearchParams(searchParams.toString());
            if (val) {
              params.set('search', val);
            } else {
              params.delete('search');
            }
            router.push(`/medicines?${params.toString()}`);
          }}
          className="relative w-full sm:w-80"
        >
          <div className="relative flex items-center">
            <Filter className="absolute left-3.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              name="medicineSearch"
              type="text"
              defaultValue={searchQuery}
              key={searchQuery}
              placeholder="Search by salt, brand, or disease..."
              className="w-full h-10 rounded-2xl border border-border bg-white pl-9 pr-20 text-xs sm:text-sm text-navy placeholder:text-gray-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {searchQuery && (
              <Link
                href={currentFilter !== 'all' ? `/medicines?filter=${currentFilter}` : '/medicines'}
                className="absolute right-12 p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                title="Clear search"
              >
                &times;
              </Link>
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
      {medicineProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {medicineProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-2xl text-primary mb-3">
            💊
          </div>
          <h3 className="font-bold text-navy text-lg">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No products match this medicine filter. Try viewing all medicines.
          </p>
          <Link
            href="/medicines"
            className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-hover"
          >
            View All Medicines
          </Link>
        </div>
      )}
    </div>
  );
}

export default function MedicinesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-400">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
          <p className="text-sm font-semibold text-navy">Loading medicines catalog...</p>
        </div>
      }
    >
      <MedicinesContent />
    </React.Suspense>
  );
}

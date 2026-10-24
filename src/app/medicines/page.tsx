'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Filter, Pill, ShieldAlert, Sparkles } from 'lucide-react';
import { useProductsStore } from '@/store/products';
import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/types';

const MEDICINE_CATEGORY_IDS = [
  'medicines',
  'pain-relief',
  'cold-flu',
  'digestive-health',
  'first-aid',
];

const subcategories = [
  { id: 'all', label: 'All Medicines' },
  { id: 'medicines', label: 'General Medicines' },
  { id: 'pain-relief', label: 'Pain Relief & Fever' },
  { id: 'cold-flu', label: 'Cold, Cough & Flu' },
  { id: 'digestive-health', label: 'Digestive Health' },
  { id: 'first-aid', label: 'First Aid & Wound Care' },
  { id: 'prescription', label: 'Prescription Only (Rx)' },
];

function MedicinesContent() {
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'all';

  const { products, syncWithServer } = useProductsStore();

  // Sync with API on mount to catch any server-side additions
  React.useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  // Determine if a product belongs in the Medicines department
  const isMedicineProduct = React.useCallback((product: Product) => {
    // 1. Explicit medicine categories
    if (MEDICINE_CATEGORY_IDS.includes(product.category_id)) return true;

    // 2. Prescription required items
    if (product.requires_prescription) return true;

    // 3. Keyword heuristic on name/tags/composition
    const textBlob = `${product.name} ${product.category_id} ${product.composition || ''} ${(product.tags || []).join(' ')}`.toLowerCase();
    const medicineRegex = /(medicine|pharma|tablet|capsule|syrup|paracetamol|crocin|dolo|ibuprofen|fever|cough|flu|antacid|digestive|ointment|antiseptic|pain|wound)/i;
    return medicineRegex.test(textBlob);
  }, []);

  const medicineProducts = React.useMemo(() => {
    return products.filter((product) => {
      if (!isMedicineProduct(product)) return false;

      if (currentFilter === 'all') return true;
      if (currentFilter === 'prescription') return product.requires_prescription;
      if (currentFilter === 'medicines') {
        return (
          product.category_id === 'medicines' ||
          (!['pain-relief', 'cold-flu', 'digestive-health', 'first-aid'].includes(product.category_id) && isMedicineProduct(product))
        );
      }
      return product.category_id === currentFilter;
    });
  }, [products, currentFilter, isMedicineProduct]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-navy">Medicines</span>
      </nav>

      {/* Hero Banner for Pharmacy Department */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005AD2] via-[#0066E8] to-[#004BB8] p-6 sm:p-10 text-white shadow-card mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-blue-100 backdrop-blur-sm mb-3">
            <Pill className="h-3.5 w-3.5" />
            <span>CLINICAL PHARMACY & DISPENSARY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Quality Clinical Medicines & First Aid
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 leading-relaxed">
            Authentic OTC essentials, temperature-controlled therapeutics, and prescription medicines. All formulations are verified by licensed pharmacists.
          </p>
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
              className={`whitespace-nowrap rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-primary bg-primary text-white shadow-soft'
                  : 'border-border bg-white text-gray-700 hover:bg-primary-light hover:text-primary'
              }`}
            >
              {sub.label}
            </Link>
          );
        })}
      </div>

      {/* Products Counter */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          Showing <span className="font-bold text-navy">{medicineProducts.length}</span> verified medicines
        </p>
        {currentFilter !== 'all' && (
          <Link
            href="/medicines"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Reset filters</span>
          </Link>
        )}
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

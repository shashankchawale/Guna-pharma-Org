import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { products } from '@/lib/catalog';
import { ProductCard } from '@/components/product/product-card';

const medicineCategoryIds = ['pain-relief', 'cold-flu', 'digestive-health', 'first-aid'];

const subcategories = [
  { id: 'all', label: 'All Medicines' },
  { id: 'pain-relief', label: 'Pain Relief' },
  { id: 'cold-flu', label: 'Cold, Cough & Flu' },
  { id: 'digestive-health', label: 'Digestive Health' },
  { id: 'first-aid', label: 'First Aid & Wound Care' },
  { id: 'prescription', label: 'Prescription Only' },
];

export default async function MedicinesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const currentFilter = params.filter || 'all';

  const medicineProducts = products.filter((product) => {
    const isMedicine =
      medicineCategoryIds.includes(product.category_id) || product.requires_prescription;
    if (!isMedicine) return false;

    if (currentFilter === 'all') return true;
    if (currentFilter === 'prescription') return product.requires_prescription;
    return product.category_id === currentFilter;
  });

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
              className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
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
          <h3 className="font-bold text-navy text-lg">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">Try selecting another medicine category.</p>
          <Link
            href="/medicines"
            className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            View All Medicines
          </Link>
        </div>
      )}
    </div>
  );
}

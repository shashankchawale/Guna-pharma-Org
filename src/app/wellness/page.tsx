import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { products } from '@/lib/catalog';
import { ProductCard } from '@/components/product/product-card';

export default function WellnessPage() {
  const wellnessProducts = products.filter(
    (product) => product.category_id === 'vitamins' || product.tags.some((t) => t.toLowerCase().includes('wellness') || t.toLowerCase().includes('immunity'))
  );

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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {wellnessProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check, Star } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useFormatPrice } from '@/store/locale';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const formatPrice = useFormatPrice();
  const [imgError, setImgError] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState(false);
  const imageUrl = product.thumbnail_url || product.images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // Human-friendly category/department label
  const categoryLabel = React.useMemo(() => {
    if (product.tags && product.tags.length > 0) {
      // Pick first prominent tag if available
      return product.tags[0].toUpperCase();
    }
    const catMap: Record<string, string> = {
      'pain-relief': 'PAIN RELIEF & FEVER',
      'skincare': 'SKINCARE & DERMA',
      'cold-flu': 'COLD, COUGH & FLU',
      'vitamins': 'VITAMINS & MINERALS',
      'digestive-health': 'DIGESTIVE CARE',
      'first-aid': 'FIRST AID & WOUND',
      'hair-care': 'HAIR & SCALP SERUMS',
      'medicines': 'CLINICAL PHARMACY',
    };
    return (catMap[product.category_id] || product.category_id.replace(/-/g, ' ')).toUpperCase();
  }, [product]);

  return (
    <article className="group relative rounded-3xl border border-slate-100/90 bg-white p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between">
      <Link href={`/product/${product.slug}`} prefetch={true} className="block flex-1 flex flex-col">
        {/* Clean, Soft-Padded Studio Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F6F9] flex items-center justify-center p-3 mb-3">
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-4xl">
              {product.category_id === 'skincare'
                ? '🧴'
                : product.category_id === 'vitamins'
                ? '💊'
                : product.category_id === 'hair-care'
                ? '🫧'
                : '🌿'}
            </div>
          )}

          {/* Discount Pill Badge */}
          {product.discount_percent > 0 && (
            <span className="absolute left-2.5 top-2.5 z-10 rounded-lg bg-white/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-extrabold text-[#0066E8] shadow-xs border border-blue-50">
              {product.discount_percent}% OFF
            </span>
          )}

          {/* Rx Prescription Badge */}
          {product.requires_prescription && (
            <span className="absolute right-2.5 top-2.5 z-10 rounded-lg bg-blue-600 text-white px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-xs">
              Rx
            </span>
          )}
        </div>

        {/* Clean Blue Category Subtitle */}
        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0066E8] line-clamp-1 mb-1">
          {categoryLabel}
        </p>

        {/* Product Title */}
        <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[#0066E8] transition-colors flex-1 mb-3">
          {product.name}
        </h3>

        {/* Bottom Row: Price & Circular Blue Add to Cart Button */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-slate-100/60">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold text-[#E11D48] tracking-tight leading-none">
              {formatPrice(product.selling_price)}
            </span>
            {product.mrp > product.selling_price && (
              <span className="text-[11px] text-gray-400 line-through mt-0.5 font-medium">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className={`h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-[#0066E8] hover:bg-[#0052BC] text-white hover:scale-108 active:scale-95 shadow-blue-500/20'
            }`}
          >
            {justAdded ? (
              <Check className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2.5]" />
            ) : (
              <ShoppingCart className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            )}
          </button>
        </div>
      </Link>
    </article>
  );
}

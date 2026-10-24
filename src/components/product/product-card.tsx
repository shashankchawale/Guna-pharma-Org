'use client';

import Link from 'next/link';
import { ShoppingBag, Star } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useFormatPrice } from '@/store/locale';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const formatPrice = useFormatPrice();
  return <article className="group rounded-2xl border border-border bg-white p-3 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
    <Link href={`/product/${product.slug}`} prefetch={true} className="block">
      <div className="relative flex aspect-square items-center justify-center rounded-xl bg-primary-light text-5xl">
        {product.category_id === 'skincare' ? '🧴' : product.category_id === 'vitamins' ? '💊' : product.category_id === 'hair-care' ? '🫧' : '🌿'}
        <span className="absolute left-2 top-2 rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-primary shadow-sm">{product.discount_percent}% OFF</span>
      </div>
      <p className="mt-3 text-xs font-medium text-gray-500">{product.brand_id.replace(/-/g, ' ')}</p>
      <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-navy">{product.name}</h3>
      <div className="mt-1 flex items-center gap-1 text-xs text-amber-600"><Star className="h-3.5 w-3.5 fill-current" /> {product.rating_average.toFixed(1)} <span className="text-gray-400">({product.rating_count})</span></div>
      <div className="mt-2 flex items-end gap-1.5"><strong className="text-base text-navy">{formatPrice(product.selling_price)}</strong><span className="text-xs text-gray-400 line-through">{formatPrice(product.mrp)}</span></div>
    </Link>
    <button onClick={() => addItem(product)} className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-primary text-sm font-semibold text-primary transition hover:bg-primary hover:text-white" aria-label={`Add ${product.name} to cart`}><ShoppingBag className="h-4 w-4" /> Add</button>
  </article>;
}

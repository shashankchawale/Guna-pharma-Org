'use client';

import * as React from 'react';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useIsMounted } from '@/lib/utils';

export function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = React.useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const mounted = useIsMounted();
  const isFav = mounted ? isInWishlist(product.id) : false;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {/* Quantity Selector */}
      <div className="flex h-12 items-center rounded-xl border border-border bg-white shadow-xs">
        <button
          className="grid h-full w-11 place-items-center text-gray-600 hover:text-navy hover:bg-gray-50 rounded-l-xl transition-colors cursor-pointer"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-bold text-navy text-sm">{quantity}</span>
        <button
          className="grid h-full w-11 place-items-center text-gray-600 hover:text-navy hover:bg-gray-50 rounded-r-xl transition-colors cursor-pointer"
          onClick={() => setQuantity((value) => Math.min(product.stock_quantity, value + 1))}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add To Cart Button */}
      <button
        className="flex h-12 flex-1 min-w-[140px] items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-white hover:bg-primary-hover shadow-sm transition-all cursor-pointer active:scale-98"
        onClick={() => addItem(product, quantity)}
      >
        <ShoppingCart className="h-5 w-5" />
        <span>Add to cart</span>
      </button>

      {/* Buy Now Button */}
      <Link
        href="/checkout"
        onClick={() => addItem(product, quantity)}
        className="flex h-12 items-center justify-center rounded-xl border border-primary px-5 font-bold text-primary hover:bg-primary-light transition-colors shadow-xs"
      >
        Buy now
      </Link>

      {/* Wishlist Toggle Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={() => toggleItem(product)}
        aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all cursor-pointer shadow-xs ${
          isFav
            ? 'border-rose-300 bg-rose-50 text-rose-500'
            : 'border-border bg-white text-gray-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/40'
        }`}
        title={isFav ? 'In your wishlist' : 'Save to wishlist'}
      >
        <Heart className={`h-5 w-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
      </motion.button>
    </div>
  );
}

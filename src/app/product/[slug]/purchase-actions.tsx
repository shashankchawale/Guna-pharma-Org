'use client';

import Link from 'next/link';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart';

export function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  return <div className="mt-6 flex flex-wrap gap-3"><div className="flex h-12 items-center rounded-xl border border-border"><button className="grid h-full w-11 place-items-center" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button><span className="w-8 text-center font-semibold">{quantity}</span><button className="grid h-full w-11 place-items-center" onClick={() => setQuantity((value) => Math.min(product.stock_quantity, value + 1))} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div><button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-white hover:bg-primary-hover" onClick={() => addItem(product, quantity)}><ShoppingCart className="h-5 w-5" /> Add to cart</button><Link href="/checkout" onClick={() => addItem(product, quantity)} className="flex h-12 items-center justify-center rounded-xl border border-primary px-5 font-semibold text-primary hover:bg-primary-light">Buy now</Link></div>;
}

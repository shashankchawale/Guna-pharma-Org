'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useFormatPrice } from '@/store/locale';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const formatPrice = useFormatPrice();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 499 ? 0 : items.length ? 49 : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-navy">Your cart</h1>

      {!items.length ? (
        <div className="mt-6 rounded-3xl bg-primary-light p-10 text-center">
          <p className="font-semibold text-navy">Your cart is waiting for something good.</p>
          <Link
            href="/catalog"
            className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="flex gap-4 rounded-2xl border border-border bg-white p-4 shadow-xs">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-primary-light text-3xl">
                  🧴
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-navy line-clamp-1">{item.product.name}</h2>
                  <p className="mt-1 text-sm font-bold text-primary">{formatPrice(item.product.selling_price)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-gray-700 hover:bg-gray-50"
                      type="button"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-gray-700 hover:bg-gray-50"
                      type="button"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="ml-auto grid h-9 w-9 place-items-center text-error hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove item"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-white p-5 shadow-xs">
            <h2 className="font-bold text-navy">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-navy">{formatPrice(subtotal)}</span>
              </p>
              <p className="flex justify-between">
                <span>Delivery</span>
                <span className="font-medium text-navy">{shipping ? formatPrice(shipping) : 'Free'}</span>
              </p>
              <p className="flex justify-between border-t border-border pt-3 font-bold text-navy text-base">
                <span>Total</span>
                <span className="text-primary">{formatPrice(subtotal + shipping)}</span>
              </p>
            </div>
            <Link
              href="/checkout"
              className="mt-5 flex h-12 items-center justify-center rounded-xl bg-primary font-semibold text-white shadow-soft hover:bg-primary-hover transition-colors"
            >
              Continue to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

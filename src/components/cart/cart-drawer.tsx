'use client';

import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useFormatPrice } from '@/store/locale';
import { useIsMounted } from '@/lib/utils';

export function CartDrawer() {
  const { isOpen, closeCart, items, getSubtotal, updateQuantity, removeItem } = useCartStore();
  const formatPrice = useFormatPrice();
  const mounted = useIsMounted();

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-navy/40 backdrop-blur-xs" onClick={closeCart} role="presentation">
      <aside
        onClick={(event) => event.stopPropagation()}
        className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-elevated"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold text-navy">Your cart</h2>
          <button
            onClick={closeCart}
            className="grid h-10 w-10 place-items-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-navy transition-colors"
            aria-label="Close cart"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <ShoppingBag className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-3 font-semibold text-navy">Your cart is empty</p>
                <button
                  onClick={closeCart}
                  className="mt-4 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
                  type="button"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-border pb-4">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-primary-light text-2xl">
                    🧴
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-navy">{item.product.name}</p>
                    <p className="mt-1 text-sm font-bold text-primary">{formatPrice(item.product.selling_price)}</p>
                    <div className="mt-2 flex items-center gap-2">
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
                        className="ml-auto text-xs font-semibold text-error hover:underline"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border bg-slate-50/50 p-4">
            <div className="mb-4 flex justify-between font-semibold text-navy">
              <span>Subtotal</span>
              <span className="text-lg text-primary">{formatPrice(getSubtotal())}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-white shadow-soft hover:bg-primary-hover transition-colors"
            >
              Secure checkout
            </Link>
          </div>
        )}
      </aside>
    </div>,
    document.body
  );
}

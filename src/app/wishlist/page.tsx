'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { useFormatPrice } from '@/store/locale';
import { useIsMounted } from '@/lib/utils';
import type { Product } from '@/types';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const formatPrice = useFormatPrice();
  const mounted = useIsMounted();
  const [movingId, setMovingId] = React.useState<string | null>(null);
  const [movingAll, setMovingAll] = React.useState(false);

  const wishlistItems = mounted ? items : [];

  const handleMoveToCart = (product: Product) => {
    setMovingId(product.id);
    addItem(product);
    setTimeout(() => {
      setMovingId(null);
    }, 1200);
  };

  const handleMoveAllToCart = () => {
    if (wishlistItems.length === 0) return;
    setMovingAll(true);
    wishlistItems.forEach((product) => {
      addItem(product);
    });
    setTimeout(() => {
      setMovingAll(false);
    }, 1500);
  };

  const totalMRP = wishlistItems.reduce((acc, item) => acc + (item.mrp || item.selling_price), 0);
  const totalSelling = wishlistItems.reduce((acc, item) => acc + item.selling_price, 0);
  const totalSavings = Math.max(0, totalMRP - totalSelling);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-6 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-navy font-semibold">Wishlist</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-200">
                  <Heart className="h-6 w-6 fill-rose-500" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">
                    My Wishlist
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {wishlistItems.length === 0
                      ? 'No items saved yet'
                      : `${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} saved for later`}
                  </p>
                </div>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleMoveAllToCart}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-primary-hover transition-all active:scale-95 cursor-pointer"
                >
                  {movingAll ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added All to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      <span>Move All to Cart</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 sm:p-16 text-center shadow-xs">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-400 ring-8 ring-rose-50/50 mb-5">
              <Heart className="h-10 w-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy">
              Your wishlist is currently empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 leading-relaxed">
              Explore our wide range of certified medicines, skincare, and wellness products.
              Tap the heart icon on any product to save it here for later.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/medicines"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-hover transition-all"
              >
                <span>Browse Medicines</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/wellness"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-navy hover:bg-gray-50 transition-all"
              >
                <span>Browse Wellness & Skincare</span>
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-8 text-left">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-navy">100% Genuine</p>
                  <p className="text-[11px] text-gray-500">Verified medicines</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <Truck className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-navy">Fast Delivery</p>
                  <p className="text-[11px] text-gray-500">Safe doorstep delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <Sparkles className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-navy">Best Prices</p>
                  <p className="text-[11px] text-gray-500">Exciting discounts</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Populated State */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Wishlist Items List / Cards */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {wishlistItems.map((product) => {
                  const imageUrl = product.thumbnail_url || product.images?.[0];
                  const isBeingMoved = movingId === product.id;

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group relative rounded-3xl border border-slate-100 bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl bg-[#F4F6F9] p-2 flex items-center justify-center"
                      >
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            sizes="128px"
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-4xl">💊</span>
                        )}

                        {product.discount_percent > 0 && (
                          <span className="absolute left-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[9px] font-extrabold text-[#0066E8] shadow-xs">
                            {product.discount_percent}% OFF
                          </span>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#0066E8]">
                          {product.category_id.replace(/-/g, ' ')}
                        </p>
                        <Link
                          href={`/product/${product.slug}`}
                          className="mt-1 block text-sm sm:text-base font-bold text-slate-900 hover:text-[#0066E8] transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>

                        {/* Badges / Prescriptions */}
                        <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          {product.requires_prescription && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                              <AlertTriangle className="h-3 w-3" /> Rx Required
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            In Stock
                          </span>
                        </div>

                        {/* Price details */}
                        <div className="mt-3 flex items-baseline justify-center sm:justify-start gap-2">
                          <span className="text-lg sm:text-xl font-extrabold text-[#E11D48]">
                            {formatPrice(product.selling_price)}
                          </span>
                          {product.mrp > product.selling_price && (
                            <span className="text-xs text-gray-400 line-through font-medium">
                              {formatPrice(product.mrp)}
                            </span>
                          )}
                          {product.mrp > product.selling_price && (
                            <span className="text-[11px] font-bold text-emerald-600">
                              Save {formatPrice(product.mrp - product.selling_price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleMoveToCart(product)}
                          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer ${
                            isBeingMoved
                              ? 'bg-emerald-600 text-white'
                              : 'bg-primary text-white hover:bg-primary-hover active:scale-95'
                          }`}
                        >
                          {isBeingMoved ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span>Added to Cart</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-colors cursor-pointer"
                          aria-label={`Remove ${product.name} from wishlist`}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sm:hidden">Remove</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Sidebar Order Summary / Next Steps */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
                <h3 className="text-base font-bold text-navy border-b border-gray-100 pb-3">
                  Wishlist Overview
                </h3>

                <div className="mt-4 space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Saved Items</span>
                    <span className="font-bold text-navy">{wishlistItems.length}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Total MRP</span>
                    <span className="font-medium text-gray-500 line-through">
                      {formatPrice(totalMRP)}
                    </span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Total Savings</span>
                      <span>-{formatPrice(totalSavings)}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                    <span className="font-bold text-navy">Estimated Total</span>
                    <span className="text-xl font-extrabold text-[#E11D48]">
                      {formatPrice(totalSelling)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleMoveAllToCart}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-hover transition-all active:scale-98 cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Move All Items to Cart</span>
                  </button>

                  <Link
                    href="/cart"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-navy hover:bg-gray-50 transition-all"
                  >
                    <span>View Shopping Cart</span>
                  </Link>
                </div>

                {/* Trust guarantee */}
                <div className="mt-6 rounded-2xl bg-blue-50/70 p-3.5 border border-blue-100/60">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <ShieldCheck className="h-4 w-4" /> 100% Genuine Pharmacy
                  </p>
                  <p className="mt-1 text-[11px] text-gray-600 leading-relaxed">
                    All items are batch-verified, stored in climate-controlled environments, and delivered with care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

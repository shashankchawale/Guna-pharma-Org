'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  discountAmount: number;
  shippingPincode: string;
  shippingAmount: number;
  estimatedDeliveryDays: number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setCouponCode: (code: string) => void;
  setDiscountAmount: (amount: number) => void;
  setShippingPincode: (pincode: string) => void;
  setShippingDetails: (amount: number, days: number) => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: '',
      discountAmount: 0,
      shippingPincode: '',
      shippingAmount: 0,
      estimatedDeliveryDays: 0,

      addItem: (product: Product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product_id === product.id);

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            product.stock_quantity
          );
          set({
            items: items.map((item) =>
              item.product_id === product.id ? { ...item, quantity: newQuantity } : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            product_id: product.id,
            quantity: Math.min(quantity, product.stock_quantity),
            product,
            added_at: new Date().toISOString(),
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((item) => item.product_id !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const item = get().items.find((i) => i.product_id === productId);
        if (item && quantity <= item.product.stock_quantity) {
          set({
            items: get().items.map((i) =>
              i.product_id === productId ? { ...i, quantity } : i
            ),
          });
        }
      },

      clearCart: () => {
        set({
          items: [],
          couponCode: '',
          discountAmount: 0,
          shippingPincode: '',
          shippingAmount: 0,
          estimatedDeliveryDays: 0,
        });
      },

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      setCouponCode: (code: string) => set({ couponCode: code }),
      setDiscountAmount: (amount: number) => set({ discountAmount: amount }),
      setShippingPincode: (pincode: string) => set({ shippingPincode: pincode }),
      setShippingDetails: (amount: number, days: number) =>
        set({ shippingAmount: amount, estimatedDeliveryDays: days }),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.product.selling_price * item.quantity, 0),
      getTotal: () => {
        const { getSubtotal, discountAmount, shippingAmount } = get();
        return getSubtotal() - discountAmount + shippingAmount;
      },
    }),
    {
      name: 'gunapharma-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
        shippingPincode: state.shippingPincode,
        shippingAmount: state.shippingAmount,
        estimatedDeliveryDays: state.estimatedDeliveryDays,
      }),
    }
  )
);
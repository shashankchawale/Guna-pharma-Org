'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/types';

interface WishlistState {
  items: Product[];

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const currentItems = get().items;
        if (!currentItems.some((item) => item.id === product.id)) {
          set({ items: [product, ...currentItems] });
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.id !== productId && item.slug !== productId),
        });
      },

      toggleItem: (product: Product) => {
        const currentItems = get().items;
        const exists = currentItems.some(
          (item) => item.id === product.id || item.slug === product.slug
        );

        if (exists) {
          set({
            items: currentItems.filter(
              (item) => item.id !== product.id && item.slug !== product.slug
            ),
          });
          return false;
        } else {
          set({ items: [product, ...currentItems] });
          return true;
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some(
          (item) => item.id === productId || item.slug === productId
        );
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'gunapharma-wishlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

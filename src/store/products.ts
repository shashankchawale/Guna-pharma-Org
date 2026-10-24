'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/types';
import { products as initialSeedProducts } from '@/lib/catalog';

interface ProductsState {
  products: Product[];
  isHydrated: boolean;

  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  syncWithServer: () => Promise<void>;
  setIsHydrated: (hydrated: boolean) => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: initialSeedProducts,
      isHydrated: false,

      setProducts: (products) => set({ products }),

      setIsHydrated: (isHydrated) => set({ isHydrated }),

      addProduct: (newProduct: Product) => {
        // 1. Immediately update local store (new items on top)
        set((state) => {
          const exists = state.products.some((p) => p.id === newProduct.id);
          if (exists) {
            return {
              products: state.products.map((p) => (p.id === newProduct.id ? newProduct : p)),
            };
          }
          return { products: [newProduct, ...state.products] };
        });

        // 2. Sync to API route
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        }).catch((err) => console.warn('Product sync to API error:', err));
      },

      updateProduct: (updatedProduct: Product) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          ),
        }));

        fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        }).catch((err) => console.warn('Product update API error:', err));
      },

      deleteProduct: (productId: string) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));

        fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
          method: 'DELETE',
        }).catch((err) => console.warn('Product delete API error:', err));
      },

      syncWithServer: async () => {
        try {
          const res = await fetch('/api/products');
          if (res.ok) {
            const serverProducts: Product[] = await res.json();
            if (Array.isArray(serverProducts) && serverProducts.length > 0) {
              const localProducts = get().products;
              // Combine, giving priority to local custom modifications
              const mergedMap = new Map<string, Product>();
              serverProducts.forEach((p) => mergedMap.set(p.id, p));
              localProducts.forEach((p) => mergedMap.set(p.id, p));
              set({ products: Array.from(mergedMap.values()) });
            }
          }
        } catch (err) {
          console.warn('Could not sync products with server:', err);
        }
      },
    }),
    {
      name: 'guna_products_store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setIsHydrated(true);
        }
      },
    }
  )
);

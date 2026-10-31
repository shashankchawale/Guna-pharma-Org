'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/types';
import { products as initialSeedProducts } from '@/lib/catalog';

/**
 * Merges stored products with the catalog seeds while strictly respecting deleted product IDs.
 * Guarantees that deleted products are NEVER resurrected upon page reloads or server syncs.
 */
function mergeCatalogProducts(
  currentList: Product[] = [],
  deletedProductIds: string[] = []
): Product[] {
  const deletedSet = new Set(
    deletedProductIds.map((id) => (id || '').trim().toLowerCase()).filter(Boolean)
  );
  const map = new Map<string, Product>();

  // 1. Insert seed products (skipping any deleted items)
  for (const seed of initialSeedProducts) {
    const seedIdLower = (seed.id || '').toLowerCase();
    const seedSlugLower = (seed.slug || '').toLowerCase();
    if (deletedSet.has(seedIdLower) || deletedSet.has(seedSlugLower)) {
      continue;
    }
    const key = seed.slug || seed.id;
    map.set(key, seed);
  }

  // 2. Overlay current items (admin added items or server updates, skipping deleted items)
  for (const p of currentList) {
    if (!p) continue;
    const pIdLower = (p.id || '').toLowerCase();
    const pSlugLower = (p.slug || '').toLowerCase();
    if (deletedSet.has(pIdLower) || deletedSet.has(pSlugLower)) {
      continue;
    }
    const key = p.slug || p.id;
    if (map.has(key)) {
      const existing = map.get(key)!;
      map.set(key, { ...existing, ...p });
    } else {
      map.set(key, p);
    }
  }

  // Return new custom items (e.g. prod-...) first, then standard catalog
  const all = Array.from(map.values()).filter((p) => {
    const idLower = (p.id || '').toLowerCase();
    const slugLower = (p.slug || '').toLowerCase();
    return !deletedSet.has(idLower) && !deletedSet.has(slugLower);
  });

  const custom = all.filter((p) => p.id?.startsWith('prod-'));
  const catalog = all.filter((p) => !p.id?.startsWith('prod-'));
  return [...custom, ...catalog];
}

interface ProductsState {
  products: Product[];
  deletedProductIds: string[];
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  source: 'supabase' | 'database';

  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  restoreProduct: (id: string) => void;
  resetDeletedProducts: () => void;
  syncWithServer: (forceReset?: boolean) => Promise<void>;
  setIsHydrated: (hydrated: boolean) => void;
  clearError: () => void;
}

const safeStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(name, value);
    } catch (err: any) {
      console.warn('LocalStorage save warning, cleaning legacy cache:', err?.message);
      try {
        localStorage.removeItem('guna_products_store');
        localStorage.removeItem('guna_products_store_v1');
        localStorage.removeItem('guna_products_store_v2');
        localStorage.setItem(name, value);
      } catch {
        // Safely swallow quota error so the app continues running with in-memory state & Supabase
        console.warn('LocalStorage full: keeping products active in memory and syncing directly to Supabase.');
      }
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(name);
    } catch {}
  },
};

let lastSyncTimestamp = 0;
let inFlightSyncPromise: Promise<void> | null = null;

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: mergeCatalogProducts(initialSeedProducts, []),
      deletedProductIds: [],
      isHydrated: false,
      isLoading: false,
      error: null,
      source: 'database',

      setProducts: (products) => set({ products }),

      setIsHydrated: (isHydrated) => set({ isHydrated }),

      clearError: () => set({ error: null }),

      addProduct: (newProduct: Product) => {
        set((state) => {
          const newIdLower = (newProduct.id || '').toLowerCase();
          const newSlugLower = (newProduct.slug || '').toLowerCase();

          // If this was previously marked deleted, remove from deletedProductIds
          const updatedDeleted = (state.deletedProductIds || []).filter((id) => {
            const idL = id.toLowerCase();
            return idL !== newIdLower && idL !== newSlugLower;
          });

          const filtered = state.products.filter(
            (p) => p.id !== newProduct.id && p.slug !== newProduct.slug
          );

          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('guna_deleted_product_ids', JSON.stringify(updatedDeleted));
            } catch {}
          }

          return {
            products: [newProduct, ...filtered],
            deletedProductIds: updatedDeleted,
          };
        });

        lastSyncTimestamp = 0;
        // Sync to API route
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        }).catch((err) => console.warn('Product sync to API error:', err));
      },

      updateProduct: (updatedProduct: Product) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === updatedProduct.id || p.slug === updatedProduct.slug
              ? updatedProduct
              : p
          ),
        }));

        lastSyncTimestamp = 0;
        fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        }).catch((err) => console.warn('Product update API error:', err));
      },

      deleteProduct: (productId: string) => {
        const trimmed = (productId || '').trim();
        const lower = trimmed.toLowerCase();

        set((state) => {
          // Identify matching product to also record its alternative slug/id
          const matched = state.products.find(
            (p) =>
              p.id === trimmed ||
              p.slug === trimmed ||
              (p.id || '').toLowerCase() === lower ||
              (p.slug || '').toLowerCase() === lower
          );

          const idsToAdd = [trimmed, lower];
          if (matched) {
            if (matched.id) idsToAdd.push(matched.id, matched.id.toLowerCase());
            if (matched.slug) idsToAdd.push(matched.slug, matched.slug.toLowerCase());
          }

          const currentDeleted = state.deletedProductIds || [];
          const updatedDeleted = Array.from(new Set([...currentDeleted, ...idsToAdd]));
          const deletedSet = new Set(updatedDeleted.map((d) => d.toLowerCase()));

          // Standalone backup in localStorage and cookie for immediate client/SSR checks
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('guna_deleted_product_ids', JSON.stringify(updatedDeleted));
              document.cookie = `guna_deleted_ids=${encodeURIComponent(JSON.stringify(updatedDeleted))}; path=/; max-age=31536000; SameSite=Lax`;
              window.dispatchEvent(new CustomEvent('guna-product-deleted', { detail: { id: trimmed } }));
            } catch {}
          }

          const filtered = state.products.filter((p) => {
            const pIdLower = (p.id || '').toLowerCase();
            const pSlugLower = (p.slug || '').toLowerCase();
            return (
              p.id !== trimmed &&
              p.slug !== trimmed &&
              !deletedSet.has(pIdLower) &&
              !deletedSet.has(pSlugLower)
            );
          });

          return {
            products: filtered,
            deletedProductIds: updatedDeleted,
          };
        });

        lastSyncTimestamp = 0;
        // Also notify server API route
        fetch(`/api/products?id=${encodeURIComponent(trimmed)}`, {
          method: 'DELETE',
        }).catch((err) => console.warn('Product delete API error:', err));
      },

      restoreProduct: (productId: string) => {
        const lower = (productId || '').trim().toLowerCase();
        set((state) => {
          const updatedDeleted = (state.deletedProductIds || []).filter(
            (id) => id.toLowerCase() !== lower
          );
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('guna_deleted_product_ids', JSON.stringify(updatedDeleted));
              document.cookie = `guna_deleted_ids=${encodeURIComponent(JSON.stringify(updatedDeleted))}; path=/; max-age=31536000; SameSite=Lax`;
              window.dispatchEvent(new CustomEvent('guna-product-deleted'));
            } catch {}
          }
          const restored = mergeCatalogProducts(state.products, updatedDeleted);
          return {
            deletedProductIds: updatedDeleted,
            products: restored,
          };
        });
      },

      resetDeletedProducts: () => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('guna_deleted_product_ids');
            document.cookie = 'guna_deleted_ids=; path=/; max-age=0';
            window.dispatchEvent(new CustomEvent('guna-product-deleted'));
          } catch {}
        }
        set({
          deletedProductIds: [],
          products: mergeCatalogProducts(initialSeedProducts, []),
        });
        fetch('/api/products?action=restore', { method: 'POST' }).catch(() => {});
      },

      syncWithServer: async (forceReset = false) => {
        const now = Date.now();
        // Prevent repeated redundant API calls within 30s if we already have products
        if (!forceReset && inFlightSyncPromise) {
          return inFlightSyncPromise;
        }
        if (!forceReset && now - lastSyncTimestamp < 30_000 && (get().products || []).length > 0) {
          return;
        }

        inFlightSyncPromise = (async () => {
          // Only show global loading on explicit force reset or if list is empty
          if (forceReset || (get().products || []).length === 0) {
            set({ isLoading: true, error: null });
          }
          try {
            const res = await fetch('/api/products?meta=true', { cache: 'no-store' });
            if (!res.ok) {
              throw new Error(`Server returned status ${res.status}`);
            }
            const payload = await res.json();
            let serverProducts: Product[] = [];
            let source: 'supabase' | 'database' = 'database';

            if (Array.isArray(payload)) {
              serverProducts = payload;
            } else if (payload && Array.isArray(payload.products)) {
              serverProducts = payload.products;
              if (payload.source) source = payload.source;
            }

            if (Array.isArray(serverProducts)) {
              const current = forceReset ? [] : (get().products || []);
              const deletedIds = get().deletedProductIds || [];
              const merged = mergeCatalogProducts(
                [...serverProducts, ...current],
                deletedIds
              );
              lastSyncTimestamp = Date.now();
              set({ products: merged, source, isLoading: false, error: null });
            } else {
              set({ isLoading: false });
            }
          } catch (err: any) {
            console.warn('Could not sync products with server:', err);
            set({ isLoading: false, error: err?.message || 'Failed to sync products' });
          } finally {
            inFlightSyncPromise = null;
          }
        })();

        return inFlightSyncPromise;
      },
    }),
    {
      name: 'guna_products_store_v4',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        deletedProductIds: state.deletedProductIds,
        products: state.products.map((p) => {
          // If image is a large data URL, replace it in localStorage with a placeholder to avoid exceeding browser quota
          const isLargeData = (url?: string) => typeof url === 'string' && url.startsWith('data:') && url.length > 2000;
          const fallback = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';
          return {
            ...p,
            images: p.images?.map((img) => (isLargeData(img) ? fallback : img)),
            thumbnail_url: isLargeData(p.thumbnail_url) ? fallback : p.thumbnail_url,
            image_url: isLargeData(p.image_url) ? fallback : p.image_url,
          };
        }),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setIsHydrated(true);

          if (typeof window !== 'undefined') {
            try {
              // Clean up all legacy storage caches to free up browser quota
              localStorage.removeItem('guna_products_store');
              localStorage.removeItem('guna_products_store_v1');
              localStorage.removeItem('guna_products_store_v2');
              localStorage.removeItem('guna_products_store_v3');
            } catch {}
          }

          let deletedIds = state.deletedProductIds || [];
          if (typeof window !== 'undefined') {
            try {
              const storedDeleted = localStorage.getItem('guna_deleted_product_ids');
              if (storedDeleted) {
                const parsed = JSON.parse(storedDeleted);
                if (Array.isArray(parsed)) {
                  deletedIds = Array.from(new Set([...deletedIds, ...parsed]));
                }
              }
            } catch {}
          }

          state.setProducts(mergeCatalogProducts(state.products, deletedIds));
          useProductsStore.setState({ deletedProductIds: deletedIds });

          // Trigger live server sync
          state.syncWithServer(true);
        }
      },
    }
  )
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, Variant } from '../lib/api';

export interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getItem: (variantId: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.variant.id === variant.id
          );

          if (existingItem) {
            // Actualizar cantidad si ya existe
            return {
              items: state.items.map((item) =>
                item.variant.id === variant.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // Agregar nuevo item
          return {
            items: [...state.items, { product, variant, quantity }],
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variant.id !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.variant.id === variantId ? { ...item, quantity } : item
          ),
        }));
      },

      clear: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getItem: (variantId) => {
        const { items } = get();
        return items.find((item) => item.variant.id === variantId);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// store/useCartStore.js
"use client";

import { set } from "mongoose";
import { title } from "process";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "cart-store";
const initial = { prodQnt: {}, products: {}, savedIds: [] };

export const useCart = create(
  persist(
    (set, get) => ({
      ...initial,

      addToCart: (id, productstate) =>
        set((s) => {
          const k = String(id);
          return {
            prodQnt: { ...s.prodQnt, [k]: (s.prodQnt[k] || 0) + 1 },
            products: { ...s.products, [k]: productstate ?? s.products[k] ?? {} },
            savedIds: s.savedIds.filter((x) => x !== k),
          };
        }),

      incQnt: (id) =>
        set((s) => {
          const k = String(id);
          return { prodQnt: { ...s.prodQnt, [k]: (s.prodQnt[k] || 0) + 1 } };
        }),

      decQnt: (id) =>
        set((s) => {
          const k = String(id);
          const cur = s.prodQnt[k] || 0;
          if (cur <= 1) {
            const { [k]: _, ...rest } = s.prodQnt;
            return { prodQnt: rest };
          }
          return { prodQnt: { ...s.prodQnt, [k]: cur - 1 } };
        }),

      setQnt: (id, qty) =>
        set((s) => {
          const k = String(id);
          if ((qty || 0) < 1) {
            const { [k]: _, ...rest } = s.prodQnt;
            return { prodQnt: rest };
          }
          return { prodQnt: { ...s.prodQnt, [k]: Number(qty) } };
        }),

      remove: (id) =>
        set((s) => {
          const k = String(id);
          const { [k]: _, ...rest } = s.prodQnt;
          return { prodQnt: rest };
        }),

      clear: () => set({ ...initial }),

      saveForLater: (id) =>
        set((s) => {
          const k = String(id);
          const { [k]: _, ...rest } = s.prodQnt;
          return {
            prodQnt: rest,
            savedIds: s.savedIds.includes(k) ? s.savedIds : [...s.savedIds, k],
          };
        }),

      moveToCart: (id) =>
        set((s) => {
          const k = String(id);
          return {
            savedIds: s.savedIds.filter((x) => x !== k),
            prodQnt: { ...s.prodQnt, [k]: (s.prodQnt[k] || 0) + 1 },
          };
        }),

      removeSaved: (id) =>
        set((s) => {
          const k = String(id);
          const next = s.savedIds.filter((x) => x !== k);
          return next === s.savedIds ? s : { savedIds: next };
        }),

      clearSaved: () => set({ savedIds: [] }),
    }),
    {
      name: STORAGE_KEY,
      version: 3, // bump to force migrate
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : undefined
      ),
      partialize: (s) => ({
        prodQnt: s.prodQnt,
        products: s.products,
        savedIds: s.savedIds,
      }),
      migrate: (persisted) => {
        const base = typeof persisted === "object" && persisted ? persisted : {};
        const pq = base.prodQnt && typeof base.prodQnt === "object" ? base.prodQnt : {};
        const prods = base.products && typeof base.products === "object" ? base.products : {};
        const saved = Array.isArray(base.savedIds) ? base.savedIds.map(String) : [];
        return { prodQnt: pq, products: prods, savedIds: saved };
      },
    }
  )
);

/* Stable selectors */
export const useCartProdQnt = () => useCart((s) => s.prodQnt);
export const useCartProducts = () => useCart((s) => s.products);
export const useCartSavedIds = () => useCart((s) => s.savedIds);

export const useCartActions = () => {
  const addToCart = useCart((s) => s.addToCart);
  const incQnt = useCart((s) => s.incQnt);
  const decQnt = useCart((s) => s.decQnt);
  const setQnt = useCart((s) => s.setQnt);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const saveForLater = useCart((s) => s.saveForLater);
  const moveToCart = useCart((s) => s.moveToCart);
  const removeSaved = useCart((s) => s.removeSaved);
  const clearSaved = useCart((s) => s.clearSaved);
  return {
    addToCart,
    incQnt,
    decQnt,
    setQnt,
    remove,
    clear,
    saveForLater,
    moveToCart,
    removeSaved,
    clearSaved,
  };
};

export const useCartUniqueCount = () =>
  useCart((s) => Object.keys(s.prodQnt).length);




const initiall = {
  id: "",
  title: "",
  price: 0,
  originalPrice: 0,
  discountPercent: 0,
  category: "",
  rating: { rate: 0, count: 0 },
  image: "",
  inStock: true,
};

const useProductStore = create((set, get) => ({
  product: initiall,

  setProductField: (key, value) =>
    set((state) => ({
      product: { ...(state.product || initiall), [key]: value },
    })),

  setRating: (rate, count) =>
    set((state) => ({
      product: { ...(state.product || initiall), rating: { rate, count } },
    })),

  resetProduct: () => set({ product: initiall }),
}));

export default useProductStore;



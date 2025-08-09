// store/wishlistStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      setWishlist: (data) => set({ wishlist: data }),
      addToWishlist: (product) => {
        const exists = get().wishlist.some((item) => item.id === product.id);
        if (!exists) {
          set({ wishlist: [...get().wishlist, product] });
        }
      },
      removeFromWishlist: (productId) => {
        set({
          wishlist: get().wishlist.filter((item) => item.id !== productId),
        });
      },
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "wishlist-storage",
    }
  )
);

export default useWishlistStore;

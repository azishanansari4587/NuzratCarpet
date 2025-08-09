import { create } from "zustand";
import { persist } from "zustand/middleware";

 const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      setCart: (cartItems) => set({ cart: cartItems }),

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

        removeFromCart: (cartId) =>
            set((state) => ({
              cart: state.cart.filter((item) => item.cartId !== cartId),
            })),
          

      increment: (productId) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),

      decrement: (productId) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === productId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
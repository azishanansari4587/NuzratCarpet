'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false); // for hydration fix

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
    setCartCount(storedCart.reduce((total, item) => total + item.quantity, 0));
    setMounted(true);
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cartItems];
    const index = updatedCart.findIndex((item) => item.productId === product.productId);

    if (index !== -1) {
      updatedCart[index].quantity += product.quantity;
    } else {
      updatedCart.push(product);
    }

    setCartItems(updatedCart);
    setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, cartCount, mounted }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

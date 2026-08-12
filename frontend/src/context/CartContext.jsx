import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  // To support "redirect to login if not authenticated when checkout is attempted, then return to checkout after login"
  const [redirectAfterAuth, setRedirectAfterAuth] = useState(null);

  const addToCart = (product, quantity) => {
    const qty = parseInt(quantity, 10) || 1;
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.productId === product.id);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += qty;
        return newCart;
      }
      return [
        ...prevCart,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: qty
        }
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    const qty = parseInt(quantity, 10) || 1;
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        cartItemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        redirectAfterAuth,
        setRedirectAfterAuth
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

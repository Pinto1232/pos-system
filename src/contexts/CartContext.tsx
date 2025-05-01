'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  stripePriceId: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (
    itemId: string | number
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartItems, setCartItems] = useState<
    CartItem[]
  >([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (
    itemId: string | number
  ) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== itemId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      'useCart must be used within a CartProvider'
    );
  }
  return context;
}

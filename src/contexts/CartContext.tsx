'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  features?: string[];
  addOns?: string[];
  packageType?: string;
  stripePriceId: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
}

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

export const CartProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [cartItems, setCartItems] = useState<
    CartItem[]
  >([]);

  useEffect(() => {
    const storedItems = JSON.parse(
      localStorage.getItem('cartItems') || '[]'
    );
    setCartItems(storedItems);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'cartItems',
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        const updatedCartItems = prevItems.map(
          (cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity +
                    item.quantity,
                }
              : cartItem
        );
        return updatedCartItems;
      } else {
        return [
          ...prevItems,
          {
            ...item,
            quantity: item.quantity || 1,
          },
        ]; // Ensure quantity is set, default to 1
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      'useCart must be used within a CartProvider'
    );
  }
  return context;
};

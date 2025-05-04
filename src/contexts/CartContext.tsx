'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
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

  // Load cart items from localStorage on initial render
  useEffect(() => {
    const storedCart =
      localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error(
          'Failed to parse cart from localStorage:',
          error
        );
        localStorage.removeItem('cartItems');
      }
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'cartItems',
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

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

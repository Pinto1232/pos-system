'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartUIContextType {
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
}

const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const setCartOpen = (isOpen: boolean) => {
    setIsCartOpen(isOpen);
  };

  return (
    <CartUIContext.Provider
      value={{
        isCartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartUIContext.Provider>
  );
}

export function useCartUI() {
  const context = useContext(CartUIContext);
  if (context === undefined) {
    throw new Error('useCartUI must be used within a CartUIProvider');
  }
  return context;
}
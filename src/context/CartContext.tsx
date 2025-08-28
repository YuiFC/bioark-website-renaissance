import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string; // product id
  name: string;
  price: number; // unit price in cents to avoid FP issues
  imageUrl?: string;
  variant?: string; // e.g., size/color
  quantity: number;
  link?: string;
};

type CartContextType = {
  items: CartItem[];
  subtotal: number; // cents
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  updateQty: (id: string, variant: string | undefined, qty: number) => void;
  removeItem: (id: string, variant?: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LS_KEY = 'bioark_cart_v1';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const addItem: CartContextType['addItem'] = (item, qty = 1) => {
    setItems(prev => {
      const keyMatch = (x: CartItem) => x.id === item.id && x.variant === item.variant;
      const exists = prev.findIndex(keyMatch);
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = { ...next[exists], quantity: next[exists].quantity + qty };
        return next;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const updateQty: CartContextType['updateQty'] = (id, variant, qty) => {
    setItems(prev => prev.map(x => (x.id === id && x.variant === variant ? { ...x, quantity: Math.max(1, qty) } : x)));
  };

  const removeItem: CartContextType['removeItem'] = (id, variant) => {
    setItems(prev => prev.filter(x => !(x.id === id && x.variant === variant)));
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, x) => sum + x.price * x.quantity, 0), [items]);

  const value = { items, subtotal, addItem, updateQty, removeItem, clear };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

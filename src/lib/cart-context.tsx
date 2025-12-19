import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem } from '../types/Cart';
import { getCartItems, setCartItems, clearCartStorage } from './cart-storage';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (variationId: string) => void;
  updateQuantity: (variationId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      const storedItems = getCartItems();
      setItems(storedItems);
      setIsLoading(false);
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      setCartItems(items);
    }
  }, [items, isLoading]);

  // Calculate derived values
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      // Check if item already exists
      const existingIndex = currentItems.findIndex(
        item => item.variationId === newItem.variationId
      );

      if (existingIndex >= 0) {
        // Update quantity if item exists
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      } else {
        // Add new item with quantity 1
        return [...currentItems, { ...newItem, quantity: 1 }];
      }
    });
  }, []);

  const removeItem = useCallback((variationId: string) => {
    setItems(currentItems =>
      currentItems.filter(item => item.variationId !== variationId)
    );
  }, []);

  const updateQuantity = useCallback((variationId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variationId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.variationId === variationId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    clearCartStorage();
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

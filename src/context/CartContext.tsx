
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/components/marketplace/types';
import { useToast } from '@/hooks/use-toast';

// Define the structure for cart items
export interface CartItem {
  id: string;
  name: string;
  price: string;
  image?: string | null;
  quantity: number;
  type: 'product' | 'tool'; // Differentiate between products and tools
  duration?: string; // Only for tools
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id && item.type === newItem.type);
      
      if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        
        toast({
          title: "Item quantity updated",
          description: `${newItem.name} quantity increased in your cart.`,
        });
        
        return updatedItems;
      } else {
        // Item doesn't exist, add to cart
        toast({
          title: "Item added to cart",
          description: `${newItem.name} has been added to your cart.`,
        });
        
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === id);
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} has been removed from your cart.`,
        });
      }
      return prevItems.filter(item => item.id !== id);
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      clearCart,
      getItemCount,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

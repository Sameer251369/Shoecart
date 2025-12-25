import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: any) => void;
  updateQuantity: (productId: number, delta: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize from LocalStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []; // Safety check for SSR
    const saved = localStorage.getItem('stridezone_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('stridezone_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Performance Optimization: Only recalculate when items change
  const cartCount = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.quantity, 0), 
  [cartItems]);

  const cartTotal = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
  [cartItems]);

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error("Maximum stock reached");
          return prev;
        }
        toast.success(`Another ${product.name} added to bag`);
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      toast.success(`${product.name} added to bag`);
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: parseFloat(product.price), 
        image: product.images?.[0]?.image || '', 
        quantity: 1,
        stock: product.stock
      }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty < 1 || newQty > item.stock) {
          if (newQty > item.stock) toast.error("Out of stock");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast.dismiss();
    toast("Item removed", { icon: '🗑️' });
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
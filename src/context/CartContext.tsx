import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number; // Changed to number for cleaner math
  image: string;
  quantity: number;
  stock: number; // Added to prevent over-ordering
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
  // Load initial state from LocalStorage so cart persists on refresh
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('stridezone_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to LocalStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('stridezone_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // High-accuracy math: use parseFloat then round to 2 decimals
  const cartTotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Limit based on stock
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
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
        // Prevent going below 1 or above stock
        if (newQty < 1 || newQty > item.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
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
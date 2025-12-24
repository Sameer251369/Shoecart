import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

import { CartSidebar } from './components/CartSidebar';
import { AuthModal } from './components/AuthModal';
import { ProductGrid } from './components/ProductGrid';
import { LandingPage } from './components/LandingPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrdersPage } from './components/OrdersPage';
import { Navbar } from './components/Navbar';

const DJANGO_URL = 'http://127.0.0.1:8000';

// --- Interfaces ---
export interface ProductImage { id: number; image: string; alt_text: string; }
export interface Product { id: number; name: string; price: string; stock: number; is_active: boolean; images: ProductImage[]; }
export interface CartItem extends Product { quantity: number; }
export interface Category { id: number; name: string; slug: string; }

function App() {
  // UI State
  const [view, setView] = useState<'home' | 'checkout' | 'orders'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Auth & Cart State
  const [isInitialized, setIsInitialized] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  /**
   * FIX: REMEMBER LOGIN
   * We initialize the token state directly from localStorage so it's 
   * available on the very first render.
   */
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  
  const productsSectionRef = useRef<HTMLDivElement>(null);

  // 1. Initialize Cart from Storage
  useEffect(() => {
    const savedCart = localStorage.getItem('stridezone_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart data corrupted:", e);
        localStorage.removeItem('stridezone_cart');
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Sync Cart to Storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('stridezone_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  /**
   * 3. FIX: ENHANCED TOKEN DECODER
   * Handles session expiry and extracts username from various JWT formats.
   */
  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        
        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          handleLogout();
          toast.error("Session expired. Please log in again.");
          return;
        }

        /**
         * Robust username extraction: Handles 'username', 'name', 
         * or falls back to email prefix.
         */
        const name = decoded.username || 
                     decoded.name || 
                     (decoded.email ? decoded.email.split('@')[0] : 'Member');
        
        setUsername(name);
        
        // Ensure localStorage stays in sync with state
        localStorage.setItem('token', token);
      } catch (err) {
        console.error("Invalid token format:", err);
        handleLogout();
      }
    } else {
      setUsername(null);
      localStorage.removeItem('token');
    }
  }, [token]);

  // 4. API Fetching
  const fetchProducts = useCallback(async (search = '', category = '') => {
    setIsLoading(true);
    try {
      const url = `${DJANGO_URL}/api/products/?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`;
      const response = await fetch(url);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      toast.error("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catRes = await fetch(`${DJANGO_URL}/api/products/categories/`);
        const catData = await catRes.json();
        setCategories(catData);
      } catch (e) {
        console.error("Category fetch error:", e);
      }
      fetchProducts();
    };
    fetchInitialData();
  }, [fetchProducts]);

  // --- Handlers ---
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchProducts(query, activeCategory);
    if (view !== 'home') setView('home');
  };

  const handleCategorySelect = (slug: string) => {
    const newSlug = activeCategory === slug ? '' : slug;
    setActiveCategory(newSlug);
    fetchProducts(searchQuery, newSlug);
    if (view !== 'home') setView('home');
    setTimeout(() => productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsername(null);
    setCartItems([]);
    setIsCartOpen(false);
    setView('home');
    toast.success("Logged out successfully");
  };

  const scrollToProducts = () => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 150);
    } else {
      productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addToCart = (product: Product) => {
    if (!token) {
      setIsAuthOpen(true);
      return;
    }
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to bag`, {
      style: { borderRadius: '12px', background: '#000', color: '#fff', fontSize: '11px', fontWeight: 'bold' }
    });
    if (window.innerWidth > 768) setIsCartOpen(true);
  };

  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0), [cartItems]);
  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const formatImageUrl = (path?: string) => {
    if (!path) return '/placeholder-shoe.png'; 
    if (path.startsWith('http')) return path;
    return `${DJANGO_URL}${path}`;
  };

  return (
    <div className="min-h-screen bg-white text-black antialiased font-sans selection:bg-black selection:text-white">
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
      
      <Navbar 
        token={token}
        username={username}
        cartCount={cartCount}
        categories={categories}
        activeCategory={activeCategory}
        onAuthOpen={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onCartOpen={() => setIsCartOpen(true)}
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        setView={setView}
      />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div 
            key="home" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage onShopNow={scrollToProducts} />
            <main ref={productsSectionRef} className="px-6 md:px-12 pt-32 pb-32 max-w-7xl mx-auto">
              <header className="mb-16">
                <span className="text-xs font-semibold tracking-wide text-zinc-500 block mb-3">
                  {activeCategory 
                    ? `Category / ${activeCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` 
                    : 'StrideZone / The Collection'}
                </span>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-zinc-900">
                  {searchQuery ? `Search results for "${searchQuery}"` : 'New Arrivals'}
                </h2>
              </header>

              <ProductGrid 
                isLoading={isLoading} 
                products={products} 
                onAddToCart={addToCart}
                onSelectProduct={() => {}} 
              />
            </main>
          </motion.div>
        )}

        {view === 'checkout' && (
          <motion.div key="checkout" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            <CheckoutPage 
              cartItems={cartItems}
              total={cartTotal}
              token={token}
              onBack={() => setView('home')}
              onOrderSuccess={() => {
                setCartItems([]);
                setView('orders');
                toast.success("Order placed successfully!");
              }}
            />
          </motion.div>
        )}

        {view === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
            <OrdersPage token={token} onBack={() => setView('home')} />
          </motion.div>
        )}
      </AnimatePresence>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onUpdateQuantity={(id, d) => setCartItems(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(0, i.quantity + d)} : i).filter(i => i.quantity > 0))} 
        onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))} 
        total={cartTotal} 
        formatImageUrl={formatImageUrl} 
        token={token} 
        onCheckout={() => { setIsCartOpen(false); setView('checkout'); }} 
      />
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        setToken={(newToken) => {
          /**
           * FIX: IMMEDIATE PERSISTENCE
           * Ensures localStorage is updated before state triggers a re-render.
           */
          localStorage.setItem('token', newToken);
          setToken(newToken);
        }} 
      />
    </div>
  );
}

export default App;
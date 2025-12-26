import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

import { CartSidebar } from './components/CartSidebar';
import { AuthModal } from './components/AuthModal';
import { ProductGrid } from './components/ProductGrid';
import { LandingPage } from './components/LandingPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrdersPage } from './components/OrdersPage';
import { Navbar } from './components/Navbar';
import { useCart } from './context/CartContext';

const DJANGO_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'https://shoecart-backend1.onrender.com';

export interface ProductImage { id: number; image: string; alt_text: string; }
export interface Product { id: number; name: string; price: string; stock: number; is_active: boolean; images: ProductImage[]; }
export interface Category { id: number; name: string; slug: string; }

function App() {
  const [view, setView] = useState<'home' | 'checkout' | 'orders'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  
  const { cartItems, cartCount, cartTotal, addToCart, clearCart } = useCart();
  const productsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          handleLogout();
          toast.error("Session expired.");
          return;
        }
        setUsername(decoded.username || decoded.name || 'Member');
      } catch (err) { handleLogout(); }
    } else { setUsername(null); }
  }, [token]);

  const fetchProducts = useCallback(async (search = '', category = '') => {
    setIsLoading(true);
    try {
      const url = `${DJANGO_URL}/api/products/?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`;
      const response = await fetch(url);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (err) { toast.error("Server connection failed."); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catRes = await fetch(`${DJANGO_URL}/api/products/categories/`);
        setCategories(await catRes.json());
      } catch (e) { console.error(e); }
      fetchProducts();
    };
    fetchInitialData();
  }, [fetchProducts]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsername(null);
    clearCart();
    setIsCartOpen(false);
    setView('home');
    toast.success("Logged out");
  };

const formatImageUrl = (path?: string) => {
  if (!path) return '/placeholder-shoe.png'; 
  const cleanPath = path.trim();
  // If Cloudinary already gave us a full URL, don't touch it!
  if (cleanPath.startsWith('http')) return cleanPath;
  
  // Only append DJANGO_URL for local media files
  const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${DJANGO_URL}${formattedPath}`;
};

  return (
    <div className="min-h-screen bg-white text-black antialiased font-sans">
      <Toaster position="bottom-center" />
      
      <Navbar 
        token={token} username={username} cartCount={cartCount} categories={categories} activeCategory={activeCategory}
        onAuthOpen={() => setIsAuthOpen(true)} onLogout={handleLogout} onCartOpen={() => setIsCartOpen(true)}
        onSearch={(q) => { setSearchQuery(q); fetchProducts(q, activeCategory); setView('home'); }} 
        onCategorySelect={(s) => { const n = activeCategory === s ? '' : s; setActiveCategory(n); fetchProducts(searchQuery, n); setView('home'); }} 
        setView={setView}
      />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage onShopNow={() => productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} />
            <main ref={productsSectionRef} className="px-6 md:px-12 pt-32 pb-32 max-w-7xl mx-auto">
              <header className="mb-16">
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">
                  {searchQuery ? searchQuery : activeCategory ? activeCategory : 'New Arrivals'}
                </h2>
              </header>
              <ProductGrid 
                isLoading={isLoading} products={products} 
                onAddToCart={(p) => { if(!token) return setIsAuthOpen(true); addToCart(p); if (window.innerWidth > 768) setIsCartOpen(true); }} 
              />
            </main>
          </motion.div>
        )}

        {view === 'checkout' && (
          <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CheckoutPage cartItems={cartItems} total={cartTotal} token={token} onBack={() => setView('home')} onOrderSuccess={() => { clearCart(); setView('orders'); }} />
          </motion.div>
        )}

        {view === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <OrdersPage token={token} onBack={() => setView('home')} />
          </motion.div>
        )}
      </AnimatePresence>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        formatImageUrl={formatImageUrl} 
        onCheckout={() => { setIsCartOpen(false); setView('checkout'); }} 
      />
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} setToken={(t) => { localStorage.setItem('token', t); setToken(t); }} />
    </div>
  );
}

export default App;
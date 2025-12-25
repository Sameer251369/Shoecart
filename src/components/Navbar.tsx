import { Search, User, LogOut, ShoppingBag, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface NavbarProps {
  token: string | null;
  username: string | null;
  cartCount: number;
  categories: any[];
  activeCategory: string;
  onAuthOpen: () => void;
  onLogout: () => void;
  onCartOpen: () => void;
  onSearch: (query: string) => void;
  onCategorySelect: (slug: string) => void;
  setView: (view: 'home' | 'checkout' | 'orders') => void;
}

/**
 * PRODUCTION URL REFERENCE:
 * All data fetched via this Navbar (like categories) flows from:
 * https://shoecart-backend1.onrender.com
 */

export const Navbar = ({ 
  token, username, cartCount, categories, activeCategory,
  onAuthOpen, onLogout, onCartOpen, onSearch, onCategorySelect, setView 
}: NavbarProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
    setShowMobileSearch(false);
    // Smooth scroll to product section on the live site
    window.scrollTo({ top: 700, behavior: 'smooth' });
  };

  return (
    <div className="fixed top-0 w-full z-50">
      {/* MAIN NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-md px-4 md:px-12 h-20 flex items-center justify-between border-b border-zinc-100">
        <div 
          onClick={() => { 
            setView('home'); 
            onCategorySelect(''); 
            onSearch(''); 
            setSearchInput('');
            setShowMobileSearch(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className="text-xl md:text-2xl font-[1000] tracking-tighter italic uppercase cursor-pointer"
        >
          STRIDE<span className="text-zinc-300">ZONE</span>
        </div>

        {/* DESKTOP SEARCH BAR */}
        <div className="hidden md:flex flex-1 max-w-md mx-10 bg-zinc-50 rounded-full px-5 py-2.5 items-center group border border-transparent focus-within:border-zinc-200 focus-within:bg-white transition-all">
          <input 
            type="text"
            placeholder="Search the collection..."
            className="bg-transparent w-full outline-none text-[10px] font-bold uppercase tracking-[0.15em] placeholder:text-zinc-400"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(e);
              }
            }}
          />
          <button onClick={handleSubmit}>
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
          </button>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            {showMobileSearch ? (
              <X className="w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>

          {/* User Account / Orders Section */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => token ? setView('orders') : onAuthOpen()}
            >
              <User className="w-5 h-5 stroke-[1.5]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden lg:block">
                {token ? username : 'Sign In'}
              </span>
            </div>

            {token && (
              <div className="flex items-center gap-3 ml-2 border-l border-zinc-200 pl-3">
                {/* Orders Icon Shortcut */}
                <button 
                  onClick={() => setView('orders')}
                  className="text-zinc-400 hover:text-black transition-colors"
                  title="My Orders"
                >
                  <Package className="w-5 h-5 stroke-[1.5]" />
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); onLogout(); }}
                  className="text-zinc-300 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <div className="relative cursor-pointer group" onClick={onCartOpen}>
            <ShoppingBag className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform" />
            <AnimatePresence mode="wait">
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* MOBILE SEARCH BAR */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-zinc-100 overflow-hidden"
          >
            <div className="px-4 py-3">
              <div className="flex items-center bg-zinc-50 rounded-full px-4 py-3 border border-zinc-200">
                <input 
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent w-full outline-none text-sm placeholder:text-zinc-400"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(e);
                    }
                  }}
                  autoFocus
                />
                <button onClick={handleSubmit}>
                  <Search className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CATEGORY BAR - Connects to https://shoecart-backend1.onrender.com */}
      <div className="bg-white/90 backdrop-blur-md border-b border-zinc-100 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex gap-6 md:gap-10 justify-start md:justify-center min-w-max">
          <button 
            onClick={() => { 
              onCategorySelect(''); 
              setView('home'); // Ensure we are on home when switching categories
              window.scrollTo({ top: 700, behavior: 'smooth' }); 
            }}
            className={`text-[9px] font-bold uppercase tracking-[0.25em] transition-all relative pb-1 whitespace-nowrap ${
              activeCategory === '' ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            All Collections
            {activeCategory === '' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black" />}
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => { 
                onCategorySelect(cat.slug); 
                setView('home'); 
                window.scrollTo({ top: 700, behavior: 'smooth' }); 
              }}
              className={`text-[9px] font-bold uppercase tracking-[0.25em] transition-all relative pb-1 whitespace-nowrap ${
                activeCategory === cat.slug ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {cat.name}
              {activeCategory === cat.slug && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
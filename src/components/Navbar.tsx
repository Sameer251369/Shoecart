import { Search, User, LogOut, ShoppingBag } from 'lucide-react';
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

export const Navbar = ({ 
  token, username, cartCount, categories, activeCategory,
  onAuthOpen, onLogout, onCartOpen, onSearch, onCategorySelect, setView 
}: NavbarProps) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
    // Smooth scroll to product section
    window.scrollTo({ top: 700, behavior: 'smooth' });
  };

  return (
    <div className="fixed top-0 w-full z-50">
      {/* MAIN NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-md px-6 md:px-12 h-20 flex items-center justify-between border-b border-zinc-100">
        <div 
          onClick={() => { 
            setView('home'); 
            onCategorySelect(''); 
            onSearch(''); 
            setSearchInput('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className="text-2xl font-[1000] tracking-tighter italic uppercase cursor-pointer"
        >
          STRIDE<span className="text-zinc-300">ZONE</span>
        </div>

        {/* SEARCH BAR */}
        <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-md mx-10 bg-zinc-50 rounded-full px-5 py-2.5 items-center group border border-transparent focus-within:border-zinc-200 focus-within:bg-white transition-all">
          <input 
            type="text"
            placeholder="Search the collection..."
            className="bg-transparent w-full outline-none text-[10px] font-bold uppercase tracking-[0.15em] placeholder:text-zinc-400"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
          </button>
        </form>

        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => token ? setView('orders') : onAuthOpen()}
          >
            <User className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden md:block">
              {token ? username : 'Sign In'}
            </span>
            {token && (
              <button
                onClick={(e) => { e.stopPropagation(); onLogout(); }}
                className="ml-1 text-zinc-300 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative cursor-pointer group" onClick={onCartOpen}>
            <ShoppingBag className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform" />
            <AnimatePresence mode="wait">
              {cartCount > 0 && (
                <motion.span
                  key={cartCount} // This triggers the "pop" animation whenever count changes
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

      {/* CATEGORY BAR */}
      <div className="bg-white/90 backdrop-blur-md border-b border-zinc-100 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-10 justify-center min-w-max">
          <button 
            onClick={() => { onCategorySelect(''); window.scrollTo({ top: 700, behavior: 'smooth' }); }}
            className={`text-[9px] font-bold uppercase tracking-[0.25em] transition-all relative pb-1 ${
              activeCategory === '' ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            All Collections
            {activeCategory === '' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black" />}
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => { onCategorySelect(cat.slug); window.scrollTo({ top: 700, behavior: 'smooth' }); }}
              className={`text-[9px] font-bold uppercase tracking-[0.25em] transition-all relative pb-1 ${
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
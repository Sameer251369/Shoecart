import { motion, type Variants } from 'framer-motion';
import { CameraOff, Loader2 } from 'lucide-react';
import { ProductCard, type Product } from './ProductCard';

interface ProductGridProps {
  isLoading: boolean;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

/**
 * PRODUCTION NOTE:
 * Data flows from https://shoecart-backend1.onrender.com/api/products/
 * This component handles the entrance animations and empty states.
 */

export const ProductGrid = ({ isLoading, products, onAddToCart, onSelectProduct }: ProductGridProps) => {
  
  // 1. Loading State - Using a rotating motion div for smoother performance
  if (isLoading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4 min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-zinc-300" />
        </motion.div>
        <p className="uppercase tracking-[0.4em] text-[10px] font-black text-zinc-400 animate-pulse">
          Syncing with Render...
        </p>
      </div>
    );
  }

  // 2. Empty State - Handles zero results from search or category filters
  if (!products || products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-40 flex flex-col items-center text-zinc-300 min-h-[50vh]"
      >
        <CameraOff className="mb-6 w-12 h-12 stroke-[1px]" />
        <p className="uppercase tracking-[0.3em] text-[10px] font-black text-center px-4">
          No products found in this collection
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 text-[9px] font-bold uppercase tracking-widest border-b border-zinc-200 pb-1 hover:text-black hover:border-black transition-all"
        >
          Refresh Gallery
        </button>
      </motion.div>
    );
  }

  // 3. Animation Variants - Explicitly typed to prevent Line 93 error
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  return (
    <div className="w-full min-h-[400px]">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show" 
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 md:gap-y-24"
      >
        {products.map((product, index) => (
          <motion.div
            key={`${product.id}-${index}`} 
            variants={itemVariants} 
          >
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onOpenDetail={onSelectProduct}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
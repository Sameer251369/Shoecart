import { motion } from 'framer-motion';
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
 * This component maps products fetched from:
 * https://shoecart-backend1.onrender.com/api/products/
 */

export const ProductGrid = ({ isLoading, products, onAddToCart, onSelectProduct }: ProductGridProps) => {
  
  // Loading State with a cleaner spinner
  if (isLoading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
        <p className="uppercase tracking-[0.4em] text-[10px] font-black text-zinc-400">
          Syncing with Render...
        </p>
      </div>
    );
  }

  // Empty State
  if (!products?.length) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-40 flex flex-col items-center text-zinc-300"
      >
        <CameraOff className="mb-6 w-12 h-12 stroke-[1px]" />
        <p className="uppercase tracking-[0.3em] text-[10px] font-black">No products found in this collection</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 text-[9px] font-bold uppercase tracking-widest border-b border-zinc-200 pb-1 hover:text-black hover:border-black transition-all"
        >
          Refresh Gallery
        </button>
      </motion.div>
    );
  }

  // Framer Motion Variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Each card follows the other by 0.1s
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onOpenDetail={onSelectProduct}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
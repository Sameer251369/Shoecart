import { motion } from 'framer-motion';
import { CameraOff, ShoppingBag } from 'lucide-react';

export interface ProductImage { id: number; image: string; alt_text: string; }
export interface Product { id: number; name: string; price: string; stock: number; is_active: boolean; images: ProductImage[]; }

// PRODUCTION URL: Connects to your live Render backend
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'https://shoecart-backend1.onrender.com';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onOpenDetail?: (p: Product) => void;
}

export const ProductCard = ({ product, onAddToCart, onOpenDetail }: ProductCardProps) => {
  
  const formatImageUrl = (path?: string) => {
    if (!path) return '';
    // If it's already a full URL (Cloudinary/S3), use it
    if (path.startsWith('http')) return path;
    // Otherwise, append the production Render URL, ensuring no double slashes
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col w-full bg-white border border-transparent hover:border-zinc-100 transition-colors duration-300"
    >
      {/* Image Container */}
      <div 
        className="aspect-[4/5] bg-[#F9F9F9] overflow-hidden relative mb-5 cursor-pointer"
        onClick={() => onOpenDetail?.(product)}
      >
        {product.images && product.images.length > 0 ? (
          <img
            src={formatImageUrl(product.images[0]?.image)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-6 mix-blend-multiply transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-200 bg-zinc-50">
            <CameraOff className="w-6 h-6 stroke-[1px]" />
          </div>
        )}

        {/* Desktop Quick Add (Slides up on hover) */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden md:block">
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="w-full bg-black text-white py-4 text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95"
            >
              <ShoppingBag className="w-3 h-3" />
              Quick Add
            </button>
          </div>
        )}
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 border border-zinc-200 px-4 py-2">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-1 pb-4 flex flex-col">
        <div className="flex flex-col gap-1 cursor-pointer" onClick={() => onOpenDetail?.(product)}>
          <div className="flex justify-between items-start">
             <div>
               <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">StrideZone Edit</h3>
               <h4 className="text-xs md:text-[13px] font-bold uppercase tracking-tight text-zinc-900 group-hover:text-zinc-500 transition-colors leading-tight">
                {product.name}
               </h4>
             </div>
             <span className="text-xs md:text-sm font-black text-zinc-900">
               ₹{parseFloat(product.price).toLocaleString('en-IN')}
             </span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-400' : 'bg-green-400'}`} />
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
              {isOutOfStock ? "Out of Stock" : "Limited Stock"}
            </p>
          </div>
        </div>

        {/* Mobile Call to Action */}
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          disabled={isOutOfStock}
          className="md:hidden w-full bg-zinc-900 hover:bg-black text-white py-4 rounded-none text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 mt-4 transition-all active:scale-95 disabled:bg-zinc-100 disabled:text-zinc-400"
        >
          {isOutOfStock ? "Notify Me" : "Add to Bag"}
        </button>
      </div>
    </motion.div>
  );
};
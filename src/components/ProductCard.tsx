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
  
  // FIXED: Cloudinary already gives a full URL. 
  // We only append API_BASE_URL if it's a relative local path.
  const formatImageUrl = (path?: string) => {
    if (!path) return '';
    const cleanPath = path.trim();
    if (cleanPath.startsWith('http')) return cleanPath;
    
    const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    return `${API_BASE_URL}${formattedPath}`;
  };

  const isOutOfStock = product.stock <= 0;
  const priceDisplay = product.price ? parseFloat(product.price).toLocaleString('en-IN') : '0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col w-full bg-white border border-transparent hover:border-zinc-100 transition-all duration-300"
    >
      {/* Image Container */}
      <div 
        className="aspect-[4/5] bg-[#F9F9F9] overflow-hidden relative mb-5 cursor-pointer"
        onClick={() => onOpenDetail?.(product)}
      >
        {product.images && product.images.length > 0 ? (
          <img
  src={formatImageUrl(product.images[0]?.image)}
  alt={product.images[0]?.alt_text || product.name}
  loading="lazy"
  // Removed mix-blend-multiply to ensure visibility
  className="w-full h-full object-contain p-6 transition-transform duration-[1.5s] ease-out group-hover:scale-110"
  onError={(e) => {
    // This helps you see if the URL is broken
    console.error("Image failed to load:", (e.target as HTMLImageElement).src);
    (e.target as HTMLImageElement).src = 'https://placehold.co/400x500?text=Check+URL';
  }}
/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-200 bg-zinc-50">
            <CameraOff className="w-6 h-6 stroke-[1px]" />
          </div>
        )}
        
        {/* ... Rest of your Add to Bag / Sold Out UI stays the same ... */}
      </div>

      {/* Product Info */}
      <div className="px-1 pb-4 flex flex-col flex-grow">
        <div className="flex flex-col gap-1 cursor-pointer" onClick={() => onOpenDetail?.(product)}>
           <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                {/* FIXED: Added a fallback for category name so the UI doesn't look empty */}
                <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">
                    {(product as any).category?.name || "StrideZone Edit"}
                </h3>
                <h4 className="text-xs md:text-[13px] font-bold uppercase tracking-tight text-zinc-900 group-hover:text-zinc-500 transition-colors leading-tight line-clamp-2">
                 {product.name}
                </h4>
              </div>
              <span className="text-xs md:text-sm font-black text-zinc-900 whitespace-nowrap">
                ₹{priceDisplay}
              </span>
           </div>
        </div>
        {/* ... Status Indicator and Mobile Button ... */}
      </div>
    </motion.div>
  );
};
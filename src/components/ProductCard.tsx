import { motion } from 'framer-motion';
import { CameraOff } from 'lucide-react';

// EXPORT these so other files can import them correctly
export interface ProductImage { 
  id: number; 
  image: string; 
  alt_text: string; 
}

export interface Product { 
  id: number; 
  name: string; 
  price: string; 
  stock: number; 
  is_active: boolean; 
  images: ProductImage[]; 
  thumbnail?: string; 
  category?: { id?: number; name: string }; 
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'https://shoecart-backend1.onrender.com';

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  
  const getImageUrl = () => {
    const rawPath = product.thumbnail || product.images[0]?.image;
    if (!rawPath) return null;
    if (rawPath.startsWith('http')) return rawPath;
    return `${API_BASE_URL}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`;
  };

  const imageUrl = getImageUrl();
  const priceDisplay = parseFloat(product.price || '0').toLocaleString('en-IN');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group border border-zinc-100 p-3 bg-white hover:shadow-xl transition-all duration-300 rounded-xl"
    >
      <div className="aspect-[4/5] bg-zinc-50 relative overflow-hidden mb-4 rounded-lg">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 p-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x500?text=Image+Not+Found';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100">
            <CameraOff className="text-zinc-300 w-8 h-8" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          {product.category?.name || "StrideZone Edit"}
        </p>
        <h3 className="text-sm font-bold truncate text-zinc-900">{product.name}</h3>
        <div className="flex justify-between items-center">
          <p className="text-base font-black text-zinc-900">₹{priceDisplay}</p>
          <button 
            onClick={() => onAddToCart(product)}
            className="text-[10px] font-bold bg-zinc-900 text-white px-3 py-1 rounded-full hover:bg-zinc-700 transition-colors"
          >
            + ADD
          </button>
        </div>
      </div>
    </motion.div>
  );
};
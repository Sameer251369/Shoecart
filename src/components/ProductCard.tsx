import { motion } from 'framer-motion';
import { CameraOff, ShoppingBag } from 'lucide-react';

export interface ProductImage { id: number; image: string; alt_text: string; }
export interface Product { id: number; name: string; price: string; stock: number; is_active: boolean; images: ProductImage[]; }

const DJANGO_URL = 'http://127.0.0.1:8000';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onOpenDetail?: (p: Product) => void; // Made optional with '?'
}

export const ProductCard = ({ product, onAddToCart, onOpenDetail }: ProductCardProps) => {
  const formatImageUrl = (path?: string) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${DJANGO_URL}${path}`;
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="group relative flex flex-col w-full bg-white border border-transparent hover:border-zinc-100 transition-colors duration-300"
    >
      <div className="aspect-[4/5] bg-[#F9F9F9] overflow-hidden relative mb-5">
        {product.images && product.images.length > 0 ? (
          <img
            src={formatImageUrl(product.images[0]?.image)}
            alt={product.name}
            className="w-full h-full object-contain p-4 mix-blend-multiply transition-transform duration-[2s] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-200 bg-zinc-50">
            <CameraOff className="w-5 h-5 stroke-[1px]" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden md:block">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            disabled={isOutOfStock}
            className="w-full bg-black text-white py-3 text-[9px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:bg-zinc-200"
          >
            <ShoppingBag className="w-3 h-3" />
            {isOutOfStock ? "Sold Out" : "Quick Add"}
          </button>
        </div>
      </div>

      <div className="px-1 pb-4 flex flex-col" onClick={() => onOpenDetail?.(product)}>
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-400">StrideZone Edit</h3>
          <div className="flex justify-between items-baseline">
            <h4 className="text-xs md:text-sm font-semibold uppercase tracking-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">
              {product.name}
            </h4>
            <span className="text-xs md:text-sm font-medium text-zinc-900">
              ₹{parseFloat(product.price).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-400' : 'bg-green-400'}`} />
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
            {isOutOfStock ? "Out of Stock" : "Limited Edition"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};